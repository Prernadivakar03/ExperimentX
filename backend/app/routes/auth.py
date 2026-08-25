# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from datetime import datetime, timedelta
# from jose import JWTError
# from app.models.organization import Organization, Membership, MemberRole


# from app.database import get_db
# from app.models.user import User
# from app.models.token import RefreshToken
# from app.core.security import (
#     hash_password,
#     verify_password,
#     create_access_token,
#     create_refresh_token,
#     decode_token,
# )
# from app.core.config import REFRESH_TOKEN_EXPIRE_DAYS
# from app.schemas.user_schema import (
#     RegisterRequest,
#     LoginRequest,
#     ForgotPasswordRequest,
#     TokenResponse,
#     RefreshRequest,
# )

# router = APIRouter(prefix="/auth", tags=["auth"])

# from slowapi import Limiter
# from slowapi.util import get_remote_address
# from fastapi import Request
# from fastapi import Request
# from app.core.limiter import limiter

# limiter = Limiter(key_func=get_remote_address)

# # ── Register ──────────────────────────────────────────────────────────────────

# # @router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
# # def register(payload: RegisterRequest, db: Session = Depends(get_db)):
# # @router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
# # @limiter.limit("5/minute")
# # def register(request: Request, payload: RegisterRequest, db: Session = Depends(get_db)):
# #     ...

# # @router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
# # @limiter.limit("3/minute")
# # def register(request: Request, payload: RegisterRequest, db: Session = Depends(get_db)):
# #     # ... rest unchanged
# #     existing = db.query(User).filter(User.email == payload.email).first()
# #     if existing:
# #         raise HTTPException(
# #             status_code=status.HTTP_409_CONFLICT,
# #             detail="An account with this email already exists",
# #         )

# #     user = User(
# #         name=payload.name,
# #         email=payload.email,
# #         password_hash=hash_password(payload.password),
# #         company=payload.company,
# #     )
# #     db.add(user)
# #     db.commit()
# #     db.refresh(user)
# #     from app.core.email import send_welcome
# #     send_welcome(user.email, user.name)

# #     return _issue_tokens(user, db)

# @router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
# @limiter.limit("3/minute")
# def register(request: Request, payload: RegisterRequest, db: Session = Depends(get_db)):
#     existing = db.query(User).filter(User.email == payload.email).first()
#     if existing:
#         raise HTTPException(
#             status_code=status.HTTP_409_CONFLICT,
#             detail="An account with this email already exists",
#         )

#     user = User(
#         name=payload.name,
#         email=payload.email,
#         password_hash=hash_password(payload.password),
#         company=payload.company,
#     )
#     db.add(user)
#     db.flush()  # get user.id before creating the org

#     # Every user gets a personal organization on signup — this is what
#     # organization_id on experiments/flags/etc. points to until they invite
#     # teammates or create additional orgs.
#     org_name = f"{payload.company}'s Workspace" if payload.company else f"{payload.name}'s Workspace"
#     organization = Organization(
#         name=org_name,
#         created_by=user.id,
#     )
#     db.add(organization)
#     db.flush()

#     membership = Membership(
#         organization_id=organization.id,
#         user_id=user.id,
#         role=MemberRole.admin,
#         accepted_at=datetime.utcnow(),
#     )
#     db.add(membership)
#     # Auto-accept any pending invites sent to this email before they had
#     # an account — without this, someone invited to a team who signs up
#     # fresh would only get their own personal org, and the invite would
#     # sit there permanently unlinked.
#     from app.models.organization import Membership as MembershipModel
#     pending_invites = db.query(MembershipModel).filter(
#         MembershipModel.invited_email == payload.email,
#         MembershipModel.user_id.is_(None),
#         MembershipModel.accepted_at.is_(None),
#     ).all()
#     for invite in pending_invites:
#         invite.user_id = user.id
#         invite.accepted_at = datetime.utcnow()

#     db.commit()
#     db.refresh(user)

#     from app.core.email import send_welcome
#     send_welcome(user.email, user.name)

#     return _issue_tokens(user, db)

# # ── Login ─────────────────────────────────────────────────────────────────────
# # @router.post("/login", response_model=TokenResponse)
# # @limiter.limit("10/minute")
# # def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
# # @router.post("/login", response_model=TokenResponse)
# # def login(payload: LoginRequest, db: Session = Depends(get_db)):

# @router.post("/login", response_model=TokenResponse)
# @limiter.limit("5/minute")
# def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
#     # ... rest unchanged

#     user = db.query(User).filter(User.email == payload.email).first()

#     # Same error for wrong email or wrong password — never reveal which
#     if not user or not verify_password(payload.password, user.password_hash):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#         )

#     if not user.is_active:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Account is disabled",
#         )

#     return _issue_tokens(user, db)


# # ── Refresh token ─────────────────────────────────────────────────────────────

# @router.post("/refresh", response_model=TokenResponse)
# def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):

#     try:
#         decoded = decode_token(payload.refresh_token)
#         if decoded.get("type") != "refresh":
#             raise JWTError("wrong token type")
#         user_id = decoded.get("sub")
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid or expired refresh token",
#         )

#     # Check token is not revoked
#     stored = db.query(RefreshToken).filter(
#         RefreshToken.token == payload.refresh_token,
#         RefreshToken.is_revoked == False,
#     ).first()

#     if not stored:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Refresh token not recognised or already used",
#         )

#     # Revoke the old one (rotation — each refresh token is single-use)
#     stored.is_revoked = True
#     db.commit()

#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

#     return _issue_tokens(user, db)


# # ── Logout ────────────────────────────────────────────────────────────────────

# @router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
# def logout(payload: RefreshRequest, db: Session = Depends(get_db)):
#     """Revoke the refresh token. Frontend must also delete the access token locally."""

#     stored = db.query(RefreshToken).filter(
#         RefreshToken.token == payload.refresh_token
#     ).first()

#     if stored:
#         stored.is_revoked = True
#         db.commit()


# # ── Forgot password ───────────────────────────────────────────────────────────

# @router.post("/forgot-password", status_code=status.HTTP_200_OK)
# @limiter.limit("3/minute")
# def forgot_password(request: Request, payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
#     from app.core.email import send_password_reset
#     from app.core.security import create_access_token

#     user = db.query(User).filter(User.email == payload.email).first()

#     if user:
#         reset_token = create_access_token(str(user.id))
#         send_password_reset(user.email, user.name, reset_token)

#     return {"message": "If that email exists, a reset link has been sent"}


# # ── Helper ────────────────────────────────────────────────────────────────────

# # def _issue_tokens(user: User, db: Session) -> dict:
# #     access = create_access_token(str(user.id))
# #     refresh = create_refresh_token(str(user.id))

# #     # Persist refresh token so we can revoke it later
# #     expires = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
# #     stored = RefreshToken(
# #         user_id=user.id,
# #         token=refresh,
# #         expires_at=expires,
# #     )
# #     db.add(stored)
# #     db.commit()

# #     return {
# #         "access_token": access,
# #         "refresh_token": refresh,
# #         "token_type": "bearer",
# #         "user": user,
# #     }

# def _issue_tokens(user: User, db: Session) -> dict:
#     access = create_access_token(str(user.id))
#     refresh = create_refresh_token(str(user.id))

#     # Find the user's primary organization
#     membership = (
#         db.query(Membership)
#         .filter(
#             Membership.user_id == user.id,
#             Membership.accepted_at.isnot(None),
#         )
#         .order_by(Membership.accepted_at.asc())
#         .first()
#     )

#     organization_id = membership.organization_id if membership else None
#     role = membership.role.value if membership and membership.role else None

#     # Persist refresh token so we can revoke it later
#     expires = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
#     stored = RefreshToken(
#         user_id=user.id,
#         token=refresh,
#         expires_at=expires,
#     )
#     db.add(stored)
#     db.commit()

#     return {
#         "access_token": access,
#         "refresh_token": refresh,
#         "token_type": "bearer",
#         "user": {
#             "id": user.id,
#             "name": user.name,
#             "email": user.email,
#             "company": user.company,
#             "created_at": user.created_at,
#             "organization_id": organization_id,
#             "role": role,
#         },
#     }











































































from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError
from app.models.organization import Organization, Membership, MemberRole

from app.database import get_db
from app.models.user import User
from app.models.token import RefreshToken
from app.models.password_reset_token import PasswordResetToken
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    generate_password_reset_token,
    hash_password_reset_token,
)
from app.core.config import REFRESH_TOKEN_EXPIRE_DAYS
from app.schemas.user_schema import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    TokenResponse,
    RefreshRequest,
)
from app.core.limiter import limiter

router = APIRouter(prefix="/auth", tags=["auth"])


# ── Register ──────────────────────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
def register(request: Request, payload: RegisterRequest, db: Session = Depends(get_db)):
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
    db.flush()  # get user.id before creating the org

    # Every user gets a personal organization on signup — this is what
    # organization_id on experiments/flags/etc. points to until they invite
    # teammates or create additional orgs.
    org_name = f"{payload.company}'s Workspace" if payload.company else f"{payload.name}'s Workspace"
    organization = Organization(
        name=org_name,
        created_by=user.id,
    )
    db.add(organization)
    db.flush()

    membership = Membership(
        organization_id=organization.id,
        user_id=user.id,
        role=MemberRole.admin,
        accepted_at=datetime.utcnow(),
    )
    db.add(membership)
    # Auto-accept any pending invites sent to this email before they had
    # an account — without this, someone invited to a team who signs up
    # fresh would only get their own personal org, and the invite would
    # sit there permanently unlinked.
    from app.models.organization import Membership as MembershipModel
    pending_invites = db.query(MembershipModel).filter(
        MembershipModel.invited_email == payload.email,
        MembershipModel.user_id.is_(None),
        MembershipModel.accepted_at.is_(None),
    ).all()
    for invite in pending_invites:
        invite.user_id = user.id
        invite.accepted_at = datetime.utcnow()

    db.commit()
    db.refresh(user)

    from app.core.email import send_welcome
    send_welcome(user.email, user.name)

    return _issue_tokens(user, db)


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
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
@limiter.limit("3/minute")
def forgot_password(request: Request, payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    from app.core.email import send_password_reset

    user = db.query(User).filter(User.email == payload.email).first()

    if user:
        # Invalidate any previous unused reset tokens for this user first —
        # only the most recently requested link should ever work.
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used_at.is_(None),
        ).update({"used_at": datetime.utcnow()})

        raw_token, token_hash, expires_at = generate_password_reset_token()
        db.add(PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
        ))
        db.commit()

        send_password_reset(user.email, user.name, raw_token)

    # Same response whether or not the email exists — don't leak which
    # emails have accounts.
    return {"message": "If that email exists, a reset link has been sent"}


# ── Reset password ────────────────────────────────────────────────────────────

@router.post("/reset-password", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
def reset_password(request: Request, payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_hash = hash_password_reset_token(payload.token)

    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == token_hash,
    ).first()

    # Same generic error whether the token is unknown, expired, or already
    # used — don't give an attacker a way to distinguish these cases.
    invalid = (
        not reset_token
        or reset_token.used_at is not None
        or reset_token.expires_at < datetime.utcnow()
    )
    if invalid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link is invalid or has expired. Please request a new one.",
        )

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link is invalid or has expired. Please request a new one.",
        )

    user.password_hash = hash_password(payload.new_password)
    reset_token.used_at = datetime.utcnow()

    # Force re-login everywhere — a password reset is a strong signal the
    # old sessions might be compromised (that's often WHY someone reset it).
    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.is_revoked == False,
    ).update({"is_revoked": True})

    db.commit()

    return {"message": "Password has been reset. Please log in again."}


# ── Helper ────────────────────────────────────────────────────────────────────

def _issue_tokens(user: User, db: Session) -> dict:
    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))

    # Find the user's primary organization
    membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == user.id,
            Membership.accepted_at.isnot(None),
        )
        .order_by(Membership.accepted_at.asc())
        .first()
    )

    organization_id = membership.organization_id if membership else None
    role = membership.role.value if membership and membership.role else None

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
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "company": user.company,
            "created_at": user.created_at,
            "organization_id": organization_id,
            "role": role,
        },
    }