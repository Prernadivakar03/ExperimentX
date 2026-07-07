from pydantic import BaseModel
from uuid import UUID


class AssignRequest(BaseModel):
    experiment_id: UUID
    fingerprint: str    # visitor's localStorage UUID — sent from frontend


class AssignResponse(BaseModel):
    visitor_id: UUID
    variant_id: UUID
    variant_label: str  # "A" or "B"
    variant_name: str   # "Control" or "Challenger"
    already_assigned: bool  # true if this visitor was seen before