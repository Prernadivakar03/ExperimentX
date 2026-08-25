import os
from dotenv import load_dotenv

load_dotenv()

# JWT
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7


# Password reset — short-lived, single-use, not a JWT (see app/core/security.py)
PASSWORD_RESET_TOKEN_EXPIRE_MINUTES = 30