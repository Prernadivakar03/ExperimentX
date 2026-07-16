
from pydantic import BaseModel
from uuid import UUID


class EventCreate(BaseModel):
    experiment_id: UUID
    variant_id: UUID
    visitor_id: UUID
    event_type: str     # "page_view", "button_click", "add_to_cart", etc.


class ConversionCreate(BaseModel):
    experiment_id: UUID
    variant_id: UUID
    visitor_id: UUID
    goal: str           # must match experiment.goal

class EventCreate(BaseModel):
    experiment_id: UUID
    variant_id: UUID
    visitor_id: UUID
    event_type: str
    value: float | None = None   # optional numeric value, e.g. order total