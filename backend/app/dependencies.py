# from fastapi import Depends, HTTPException, status
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from sqlalchemy.orm import Session
# from jose import JWTError

# from app.database import get_db
# from app.core.security import decode_token
# from app.models.user import User

# bearer_scheme = HTTPBearer()


# def get_current_user(
#     credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
#     db: Session = Depends(get_db),
# ) -> User:
#     """
#     Dependency — use this on any route that requires a logged-in user.

#     Example:
#         @router.get("/experiments")
#         def list_experiments(current_user: User = Depends(get_current_user)):
#             ...
#     """
#     token = credentials.credentials

#     try:
#         payload = decode_token(token)
#         if payload.get("type") != "access":
#             raise JWTError("wrong token type")
#         user_id: str = payload.get("sub")
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid or expired token",
#             headers={"WWW-Authenticate": "Bearer"},
#         )

#     user = db.query(User).filter(User.id == user_id).first()
#     if not user or not user.is_active:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="User not found or inactive",
#         )

#     return user













































from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, APIKeyHeader
from sqlalchemy.orm import Session
from datetime import datetime
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


def get_org_from_api_key(
    api_key: str = Depends(api_key_header),
    db: Session = Depends(get_db),
) -> Organization:
    """
    Dependency — use this on any route the client SDK calls directly
    (e.g. /assign, /track-event, /track-conversion). Requires an
    `X-API-Key: expx_live_...` header instead of a user's JWT, since these
    calls come from a visitor's browser via the SDK, not a logged-in
    dashboard session.

    Example:
        @router.post("/assign")
        def assign_variant(
            payload: AssignRequest,
            organization: Organization = Depends(get_org_from_api_key),
            db: Session = Depends(get_db),
        ):
            ...
    """
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

    record.last_used_at = datetime.utcnow()
    db.commit()

    organization = db.query(Organization).filter(Organization.id == record.organization_id).first()
    if not organization:
        # Shouldn't happen (FK-backed), but fail closed rather than 500
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked API key",
        )

    return organization