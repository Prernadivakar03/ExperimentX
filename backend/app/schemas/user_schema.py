from pydantic import BaseModel, EmailStr, field_validator
from uuid import UUID
from datetime import datetime
from typing import Optional


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    company: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    company: Optional[str]
    created_at: datetime
    organization_id: Optional[UUID] = None
    role: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    # refresh_token is intentionally NOT included here — it's set as an
    # httpOnly cookie by the /auth endpoints instead of being returned in
    # the JSON body, so it's never reachable from frontend JS.
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshRequest(BaseModel):
    # No longer used by /auth/refresh or /auth/logout (they read the
    # refresh token from the httpOnly cookie now). Left in place in case
    # anything else imports it.
    refresh_token: str