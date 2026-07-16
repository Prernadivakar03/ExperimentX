from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from datetime import datetime
from typing import Optional, List


class MembershipCreate(BaseModel):
    experiment_id: UUID
    allocation_pct: int = Field(..., ge=1, le=100)


class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None
    memberships: List[MembershipCreate]

    @field_validator("memberships")
    @classmethod
    def total_allocation_valid(cls, memberships):
        total = sum(m.allocation_pct for m in memberships)
        if total > 100:
            raise ValueError(f"Total allocation across experiments cannot exceed 100% (got {total}%)")
        if len(memberships) < 2:
            raise ValueError("A mutual exclusion group needs at least 2 experiments")
        return memberships


class MembershipResponse(BaseModel):
    experiment_id: UUID
    allocation_pct: int

    class Config:
        from_attributes = True


class GroupResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    memberships: List[MembershipResponse]
    created_at: datetime

    class Config:
        from_attributes = True