from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError

from app.database import get_db
from app.models.user import User
from app.models.token import RefreshToken
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.config import REFRESH_TOKEN_EXPIRE_DAYS
from app.schemas.user_schema import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    TokenResponse,
    RefreshRequest,
)

router = APIRouter(prefix="/auth", tags=["auth"])


# ── Register ──────────────────────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        company=payload.company,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return _issue_tokens(user, db)


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == payload.email).first()

    # Same error for wrong email or wrong password — never reveal which
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    return _issue_tokens(user, db)


# ── Refresh token ─────────────────────────────────────────────────────────────

@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):

    try:
        decoded = decode_token(payload.refresh_token)
        if decoded.get("type") != "refresh":
            raise JWTError("wrong token type")
        user_id = decoded.get("sub")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    # Check token is not revoked
    stored = db.query(RefreshToken).filter(
        RefreshToken.token == payload.refresh_token,
        RefreshToken.is_revoked == False,
    ).first()

    if not stored:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not recognised or already used",
        )

    # Revoke the old one (rotation — each refresh token is single-use)
    stored.is_revoked = True
    db.commit()

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return _issue_tokens(user, db)


# ── Logout ────────────────────────────────────────────────────────────────────

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: RefreshRequest, db: Session = Depends(get_db)):
    """Revoke the refresh token. Frontend must also delete the access token locally."""

    stored = db.query(RefreshToken).filter(
        RefreshToken.token == payload.refresh_token
    ).first()

    if stored:
        stored.is_revoked = True
        db.commit()


# ── Forgot password ───────────────────────────────────────────────────────────

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    In production: generate a signed reset token, email it, store a hash.
    For MVP dev: the token is logged to the console so you can test the flow
    without setting up an email provider.
    """

    user = db.query(User).filter(User.email == payload.email).first()

    # Always return 200 — never reveal whether the email exists
    if not user:
        return {"message": "If that email exists, a reset link has been sent"}

    reset_token = create_access_token(str(user.id))  # reuse JWT for simplicity in MVP
    print(f"\n[DEV] Password reset token for {user.email}:\n{reset_token}\n")

    return {"message": "If that email exists, a reset link has been sent"}


# ── Helper ────────────────────────────────────────────────────────────────────

def _issue_tokens(user: User, db: Session) -> dict:
    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))

    # Persist refresh token so we can revoke it later
    expires = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    stored = RefreshToken(
        user_id=user.id,
        token=refresh,
        expires_at=expires,
    )
    db.add(stored)
    db.commit()

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
        "user": user,
    }