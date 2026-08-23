from pydantic import BaseModel, field_validator
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from app.models.experiment import ExperimentStatus


class VariantCreate(BaseModel):
    name: str          # e.g. "Control"
    label: str         # e.g. "A"
    description: Optional[str] = None
    traffic_split: float  # 0.0 to 1.0


class ExperimentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    goal: str
    planned_duration_days: Optional[int] = None
    target_sample_size: Optional[int] = None
    scheduled_start_at: Optional[datetime] = None
    scheduled_end_at: Optional[datetime] = None
    timezone: str = "UTC"
    variants: List[VariantCreate]
    primary_metric_id: Optional[UUID] = None

    @field_validator("variants")
    @classmethod
    def validate_variants(cls, variants):
        if len(variants) < 2:
            raise ValueError("An experiment needs at least 2 variants")

        for v in variants:
            if v.traffic_split < 0 or v.traffic_split > 1:
                raise ValueError(
                    f"traffic_split for variant '{v.label}' must be between 0 and 1 (got {v.traffic_split})"
                )

        total = sum(v.traffic_split for v in variants)
        if not (0.99 <= total <= 1.01):   # allow tiny float rounding
            raise ValueError(f"Variant traffic splits must sum to 1.0 (got {total:.2f})")

        labels = [v.label for v in variants]
        if len(labels) != len(set(labels)):
            raise ValueError("Variant labels must be unique")

        names = [v.name for v in variants]
        if len(names) != len(set(names)):
            raise ValueError("Variant names must be unique")

        return variants

    @field_validator("planned_duration_days")
    @classmethod
    def duration_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError("planned_duration_days must be greater than 0")
        return v

    @field_validator("target_sample_size")
    @classmethod
    def sample_size_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError("target_sample_size must be greater than 0")
        return v

    @field_validator("scheduled_end_at")
    @classmethod
    def end_after_start(cls, v, info):
        start = info.data.get("scheduled_start_at")
        if v and start and v <= start:
            raise ValueError("scheduled_end_at must be after scheduled_start_at")
        return v


class ExperimentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    goal: Optional[str] = None
    scheduled_start_at: Optional[datetime] = None
    scheduled_end_at: Optional[datetime] = None
    status: Optional[ExperimentStatus] = None
    planned_duration_days: Optional[int] = None
    target_sample_size: Optional[int] = None


class VariantResponse(BaseModel):
    id: UUID
    name: str
    label: str
    description: Optional[str]
    traffic_split: float

    class Config:
        from_attributes = True


class ExperimentResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    goal: str
    status: ExperimentStatus
    planned_duration_days: Optional[int]
    target_sample_size: Optional[int]
    scheduled_start_at: Optional[datetime] = None
    scheduled_end_at: Optional[datetime] = None
    variants: List[VariantResponse]
    created_at: datetime
    updated_at: datetime
    primary_metric_id: Optional[UUID] = None

    class Config:
        from_attributes = True      