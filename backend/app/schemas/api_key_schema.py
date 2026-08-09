# backend/app/schemas/api_key_schema.py
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class ApiKeyCreate(BaseModel):
    name: str  # user-facing label, e.g. "Production SDK"


class ApiKeyCreateResponse(BaseModel):
    """
    Returned ONLY at creation time. `full_key` is shown once and is not
    recoverable afterwards — the frontend should prompt the user to copy
    it immediately and warn them it won't be shown again.
    """
    id: UUID
    name: str
    full_key: str
    key_prefix: str
    created_at: datetime


class ApiKeyResponse(BaseModel):
    """Safe to list/display repeatedly — never includes the full key."""
    id: UUID
    name: str
    key_prefix: str
    created_at: datetime
    last_used_at: Optional[datetime] = None
    revoked_at: Optional[datetime] = None

    class Config:
        from_attributes = True