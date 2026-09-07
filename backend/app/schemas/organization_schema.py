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


# ── Experiment / statistical defaults ────────────────────────────────────────
# Org-wide defaults shown on the Settings > Experiments tab. Kept permissive
# (no strict validation beyond ranges) since these are just pre-filled
# defaults for the "create experiment" form, not enforced constraints.

class ExperimentSettings(BaseModel):
    default_traffic_pct: int = 50
    default_confidence_level: int = 95
    default_experiment_type: str = "ab"
    default_duration_days: int = 14
    auto_stop: bool = False
    require_min_sample: bool = True
    stat_method: str = "frequentist"
    significance_level: float = 0.05
    multiple_testing_correction: str = "none"

    class Config:
        from_attributes = True


class ExperimentSettingsUpdate(BaseModel):
    default_traffic_pct: Optional[int] = None
    default_confidence_level: Optional[int] = None
    default_experiment_type: Optional[str] = None
    default_duration_days: Optional[int] = None
    auto_stop: Optional[bool] = None
    require_min_sample: Optional[bool] = None
    stat_method: Optional[str] = None
    significance_level: Optional[float] = None
    multiple_testing_correction: Optional[str] = None