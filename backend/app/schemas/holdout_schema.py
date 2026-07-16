from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional


class HoldoutGroupCreate(BaseModel):
    name: str
    description: Optional[str] = None
    percentage: int = Field(..., ge=1, le=50)   # cap at 50% — a sane guardrail, not a hard industry rule
    is_active: bool = True


class HoldoutGroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    percentage: Optional[int] = Field(default=None, ge=1, le=50)
    is_active: Optional[bool] = None


class HoldoutGroupResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    percentage: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class HoldoutConversionRequest(BaseModel):
    fingerprint: str
    owner_id: UUID
    goal: str


class HoldoutImpactResponse(BaseModel):
    holdout_visitors: int
    holdout_conversions: int
    holdout_conversion_rate: float
    baseline_visitors: int
    baseline_conversions: int
    baseline_conversion_rate: float
    estimated_lift_pct: Optional[float]
    note: str