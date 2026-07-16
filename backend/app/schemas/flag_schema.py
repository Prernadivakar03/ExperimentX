from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional


class FlagCreate(BaseModel):
    key: str = Field(..., pattern=r'^[a-z0-9\-]+$', description="URL-safe key, e.g. 'new-checkout-flow'")
    name: str
    description: Optional[str] = None
    rollout_percentage: int = Field(default=0, ge=0, le=100)
    is_enabled: bool = False


class FlagUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    rollout_percentage: Optional[int] = Field(default=None, ge=0, le=100)
    is_enabled: Optional[bool] = None


class FlagResponse(BaseModel):
    id: UUID
    key: str
    name: str
    description: Optional[str]
    is_enabled: bool
    rollout_percentage: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FlagEvaluationResponse(BaseModel):
    key: str
    enabled: bool   # the final answer for THIS visitor
    reason: str
    