
# from pydantic import BaseModel
# from uuid import UUID


# class EventCreate(BaseModel):
#     experiment_id: UUID
#     variant_id: UUID
#     visitor_id: UUID
#     event_type: str     # "page_view", "button_click", "add_to_cart", etc.


# class ConversionCreate(BaseModel):
#     experiment_id: UUID
#     variant_id: UUID
#     visitor_id: UUID
#     goal: str           # must match experiment.goal

# class EventCreate(BaseModel):
#     experiment_id: UUID
#     variant_id: UUID
#     visitor_id: UUID
#     event_type: str
#     value: float | None = None   # optional numeric value, e.g. order total




























# backend/app/schemas/event_schema.py
from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class EventCreate(BaseModel):
    experiment_id: UUID
    variant_id: UUID
    visitor_id: UUID
    event_type: str               # "page_view", "button_click", "add_to_cart", etc.
    value: Optional[float] = None  # optional numeric value, e.g. order total


class ConversionCreate(BaseModel):
    experiment_id: UUID
    variant_id: UUID
    visitor_id: UUID
    goal: str                      # must match experiment.goal
    value: Optional[float] = None  # e.g. order total — previously missing
    # entirely, which is exactly what made track_conversion() crash
    event_type: str = "conversion"  # conversions are logged as an Event too
    # (for count/sum/average metrics), this labels that event row