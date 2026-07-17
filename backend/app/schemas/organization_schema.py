from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.organization import MemberRole


class OrganizationCreate(BaseModel):
    name: str


class OrganizationResponse(BaseModel):
    id: UUID
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: MemberRole = MemberRole.viewer


class MembershipResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID]
    invited_email: Optional[str]
    role: MemberRole
    accepted_at: Optional[datetime]
    invited_at: datetime

    class Config:
        from_attributes = True


class RoleUpdateRequest(BaseModel):
    role: MemberRole