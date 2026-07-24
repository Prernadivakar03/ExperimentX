# backend/app/schemas/assign_schema.py
from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class AssignRequest(BaseModel):
    experiment_id: UUID
    fingerprint: str

    # NEW — populated by the SDK from the browser. All optional so existing
    # callers (or a minimal manual integration) don't break.
    device: Optional[str] = None
    browser: Optional[str] = None
    traffic_source: Optional[str] = None
    is_returning: Optional[bool] = None
    # country intentionally NOT collected client-side — unreliable client
    # guesses (timezone-based, VPNs, travel) aren't worth faking. Real
    # country detection belongs server-side via geo-IP on the request —
    # a good Phase 4 addition, not something to fake here.


class AssignResponse(BaseModel):
    eligible: bool
    visitor_id: Optional[UUID] = None
    variant_id: Optional[UUID] = None
    variant_label: Optional[str] = None
    variant_name: Optional[str] = None
    already_assigned: bool = False
    reason: Optional[str] = None