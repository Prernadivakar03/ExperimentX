# backend/app/schemas/guardrail_schema.py
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Literal


class GuardrailCreate(BaseModel):
    metric_id: UUID
    direction: Literal["higher_is_better", "lower_is_better"] = "higher_is_better"
    max_regression_pct: float = Field(default=5.0, gt=0, le=100)


class GuardrailResponse(BaseModel):
    id: UUID
    experiment_id: UUID
    metric_id: UUID
    metric_key: str
    metric_name: str
    direction: str
    max_regression_pct: float
    created_at: datetime

    class Config:
        from_attributes = True