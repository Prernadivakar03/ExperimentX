# from datetime import datetime, timedelta
# from jose import JWTError, jwt
# from passlib.context import CryptContext

# from app.core.config import (
#     SECRET_KEY,
#     ALGORITHM,
#     ACCESS_TOKEN_EXPIRE_MINUTES,
#     REFRESH_TOKEN_EXPIRE_DAYS,
# )

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# # ── Password helpers ──────────────────────────────────────────────────────────

# def hash_password(plain: str) -> str:
#     return pwd_context.hash(plain)


# def verify_password(plain: str, hashed: str) -> bool:
#     return pwd_context.verify(plain, hashed)


# # ── Token helpers ─────────────────────────────────────────────────────────────

# def create_access_token(user_id: str) -> str:
#     expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     payload = {"sub": user_id, "exp": expire, "type": "access"}
#     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# # def create_refresh_token(user_id: str) -> str:
# #     expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
# #     payload = {"sub": user_id, "exp": expire, "type": "refresh"}
# #     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# def create_refresh_token(user_id: str) -> str:
#     expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
#     payload = {"sub": user_id, "exp": expire, "type": "refresh", "jti": uuid4().hex}
#     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# def decode_token(token: str) -> dict:
#     """
#     Returns the payload dict or raises JWTError.
#     Callers should catch JWTError and return 401.
#     """
#     return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])







# # `backend/app/core/security.py`

# from datetime import datetime, timedelta
# from uuid import uuid4

# from jose import JWTError, jwt
# from passlib.context import CryptContext

# from app.core.config import (
#     SECRET_KEY,
#     ALGORITHM,
#     ACCESS_TOKEN_EXPIRE_MINUTES,
#     REFRESH_TOKEN_EXPIRE_DAYS,
# )

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# # ── Password helpers ──────────────────────────────────────────────────────────

# def hash_password(plain: str) -> str:
#     return pwd_context.hash(plain)


# def verify_password(plain: str, hashed: str) -> bool:
#     return pwd_context.verify(plain, hashed)


# # ── Token helpers ─────────────────────────────────────────────────────────────

# def create_access_token(user_id: str) -> str:
#     expire = datetime.utcnow() + timedelta(
#         minutes=ACCESS_TOKEN_EXPIRE_MINUTES
#     )

#     payload = {
#         "sub": user_id,
#         "exp": expire,
#         "type": "access",
#     }

#     return jwt.encode(
#         payload,
#         SECRET_KEY,
#         algorithm=ALGORITHM,
#     )


# def create_refresh_token(user_id: str) -> str:
#     expire = datetime.utcnow() + timedelta(
#         days=REFRESH_TOKEN_EXPIRE_DAYS
#     )

#     payload = {
#         "sub": user_id,
#         "exp": expire,
#         "type": "refresh",
#         "jti": uuid4().hex,
#     }

#     return jwt.encode(
#         payload,
#         SECRET_KEY,
#         algorithm=ALGORITHM,
#     )


# def decode_token(token: str) -> dict:
#     """
#     Returns the payload dict or raises JWTError.
#     Callers should catch JWTError and return 401.
#     """
#     return jwt.decode(
#         token,
#         SECRET_KEY,
#         algorithms=[ALGORITHM],
#     )




































# backend/app/core/security.py
import hashlib
import secrets
from datetime import datetime, timedelta
from uuid import uuid4

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Password helpers ──────────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── JWT helpers (login/session tokens) ──────────────────────────────────────

def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": user_id, "exp": expire, "type": "access"}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": user_id, "exp": expire, "type": "refresh", "jti": uuid4().hex}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Returns the payload dict or raises JWTError.
    Callers should catch JWTError and return 401.
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


# ── Password reset token helpers ─────────────────────────────────────────────
# Deliberately NOT a JWT. A reset token isn't a session credential — it
# shouldn't be able to authenticate API calls, and it needs single-use +
# revocable semantics that a stateless JWT can't give you. This mirrors the
# API-key pattern in app/core/api_keys.py: random opaque string, only the
# hash is stored, looked up by hash at use-time.

def generate_password_reset_token() -> tuple[str, str, datetime]:
    """
    Returns (raw_token, token_hash, expires_at).
    raw_token  -> goes in the email link only, never persisted
    token_hash -> what gets stored in PasswordResetToken.token_hash
    """
    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_password_reset_token(raw_token)
    expires_at = datetime.utcnow() + timedelta(minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)
    return raw_token, token_hash, expires_at


def hash_password_reset_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
