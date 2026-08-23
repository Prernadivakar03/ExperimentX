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
    user_name: Optional[str] = None    # NEW — was missing entirely, frontend
    user_email: Optional[str] = None   # would have shown raw UUIDs otherwise
    role: MemberRole
    accepted_at: Optional[datetime]
    invited_at: datetime

    class Config:
        from_attributes = True


class RoleUpdateRequest(BaseModel):
    role: MemberRole


# class WebhookSettingsResponse(BaseModel):
#     webhook_url: Optional[str]
#     webhook_events: list[str]

#     class Config:
#         from_attributes = True


# class WebhookSettingsUpdate(BaseModel):
#     webhook_url: Optional[str] = None
#     webhook_events: list[str] = []


VALID_WEBHOOK_EVENTS = {"srm_detected", "significance_reached", "anomaly_detected", "guardrail_breach"}

class WebhookSettingsUpdate(BaseModel):
    webhook_url: Optional[str] = None
    webhook_events: list[str] = []

    def validated_events(self) -> list[str]:
        return [e for e in self.webhook_events if e in VALID_WEBHOOK_EVENTS]


class WebhookSettingsResponse(BaseModel):
    webhook_url: Optional[str] = None
    webhook_events: list[str] = []

    class Config:
        from_attributes = True


class WebhookTestResponse(BaseModel):
    success: bool
    message: str