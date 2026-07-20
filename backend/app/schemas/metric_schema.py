
from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from datetime import datetime
from typing import Optional, List

from app.models.metric import MetricType


# ── Create ─────────────────────────────────────────────────────────────────────

class MetricCreate(BaseModel):
    key: str = Field(..., pattern=r'^[a-z0-9_]+$')
    name: str
    description: Optional[str] = None
    metric_type: MetricType
    event_type: Optional[str] = None
    numerator_event_type: Optional[str] = None
    denominator_event_type: Optional[str] = None
    formula: Optional[str] = None
    is_guardrail: bool = False

    @field_validator("formula")
    @classmethod
    def validate_formula_syntax(cls, v):
        if v is None:
            return v
        from app.core.formula_eval import evaluate_formula, FormulaError
        # dry-run against dummy variables to catch syntax errors early
        dummy = {"visitors": 1, "conversions": 1, "event_count": 1, "event_sum": 1}
        try:
            evaluate_formula(v, dummy)
        except FormulaError as e:
            raise ValueError(str(e))
        return v


# ── Update ─────────────────────────────────────────────────────────────────────

class MetricUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    metric_type: Optional[MetricType] = None
    event_type: Optional[str] = None
    numerator_event_type: Optional[str] = None
    denominator_event_type: Optional[str] = None
    formula: Optional[str] = None
    is_guardrail: Optional[bool] = None

    @field_validator("formula")
    @classmethod
    def validate_formula_syntax(cls, v):
        if v is None:
            return v
        from app.core.formula_eval import evaluate_formula, FormulaError
        dummy = {"visitors": 1, "conversions": 1, "event_count": 1, "event_sum": 1}
        try:
            evaluate_formula(v, dummy)
        except FormulaError as e:
            raise ValueError(str(e))
        return v


# ── Response ──────────────────────────────────────────────────────────────────

class MetricResponse(BaseModel):
    id: UUID
    key: str
    name: str
    description: Optional[str]
    metric_type: MetricType
    event_type: Optional[str]
    numerator_event_type: Optional[str]
    denominator_event_type: Optional[str]
    formula: Optional[str]
    is_guardrail: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Value response (for analytics) ──────────────────────────────────────────

class MetricValueResponse(BaseModel):
    metric_key: str
    variant_label: str
    value: float


# ── List response wrapper ────────────────────────────────────────────────────

class MetricListResponse(BaseModel):
    metrics: List[MetricResponse]