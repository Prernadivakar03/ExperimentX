import os
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# JWT
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    if ENVIRONMENT == "production":
        raise RuntimeError(
            "SECRET_KEY environment variable is not set. Refusing to start "
            "in production without it — set SECRET_KEY before deploying."
        )
    # Local/dev only: fall back to a clearly-fake key so `uvicorn` still boots.
    SECRET_KEY = "dev-only-insecure-key-do-not-use-in-production"

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7


# Password reset — short-lived, single-use, not a JWT (see app/core/security.py)
PASSWORD_RESET_TOKEN_EXPIRE_MINUTES = 30