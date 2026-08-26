from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, APIKeyHeader
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError

from app.database import get_db
from app.core.security import decode_token
from app.core.api_keys import hash_api_key
from app.models.user import User
from app.models.api_key import ApiKey
from app.models.organization import Organization

bearer_scheme = HTTPBearer()
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency — use this on any route that requires a logged-in user.

    Example:
        @router.get("/experiments")
        def list_experiments(current_user: User = Depends(get_current_user)):
            ...
    """
    token = credentials.credentials

    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise JWTError("wrong token type")
        user_id: str = payload.get("sub")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    return user


LAST_USED_THROTTLE = timedelta(minutes=10)  # don't write on every single SDK call


def _resolve_api_key_record(api_key: str, db: Session) -> ApiKey:
    """Shared lookup/validation used by both the public and secret key
    dependencies below — the only difference between them is which
    key_type they accept."""
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-API-Key header",
        )

    key_hash = hash_api_key(api_key)
    record = db.query(ApiKey).filter(ApiKey.key_hash == key_hash).first()

    if not record or record.revoked_at is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked API key",
        )

    # Only write last_used_at at most once per throttle window, not on
    # every single visitor request — an experiment with real traffic can
    # generate thousands of these calls per minute, and nothing downstream
    # needs second-level precision on "when was this key last used."
    now = datetime.utcnow()
    if record.last_used_at is None or (now - record.last_used_at) > LAST_USED_THROTTLE:
        record.last_used_at = now
        db.commit()

    return record


def get_org_from_api_key(
    api_key: str = Depends(api_key_header),
    db: Session = Depends(get_db),
) -> Organization:
    """
    Dependency for visitor-facing SDK endpoints (/assign, /track-event,
    /track-conversion, /flags/evaluate). Accepts EITHER a public or a
    secret key — secret keys can do everything a public key can, plus
    (in future) privileged operations. Requires an `X-API-Key` header.
    """
    record = _resolve_api_key_record(api_key, db)

    organization = db.query(Organization).filter(Organization.id == record.organization_id).first()
    if not organization:
        # Shouldn't happen (FK-backed), but fail closed rather than 500
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked API key",
        )

    return organization


def get_org_from_secret_api_key(
    api_key: str = Depends(api_key_header),
    db: Session = Depends(get_db),
) -> Organization:
    """
    Dependency for future server-side-only endpoints (management/admin
    operations reachable via API key rather than a dashboard JWT). Only
    accepts a secret key — a public key embedded in browser JS must NOT
    be able to authenticate here. Nothing uses this yet; it exists so the
    next privileged API-key route is a one-line dependency swap instead
    of a schema change.
    """
    record = _resolve_api_key_record(api_key, db)

    if record.key_type != "secret":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint requires a secret API key, not a public key",
        )

    organization = db.query(Organization).filter(Organization.id == record.organization_id).first()
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked API key",
        )

    return organization