from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class AssignRequest(BaseModel):
    experiment_id: UUID
    fingerprint: str


class AssignResponse(BaseModel):
    eligible: bool                          # NEW — false if excluded by mutual exclusion
    visitor_id: Optional[UUID] = None
    variant_id: Optional[UUID] = None
    variant_label: Optional[str] = None
    variant_name: Optional[str] = None
    already_assigned: bool = False
    reason: Optional[str] = None            # NEW — explains exclusion, useful for SDK debugging