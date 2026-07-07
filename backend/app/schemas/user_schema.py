from pydantic import BaseModel, EmailStr
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


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    company: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshRequest(BaseModel):
    refresh_token: str