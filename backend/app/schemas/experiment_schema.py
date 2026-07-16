# from pydantic import BaseModel, field_validator
# from uuid import UUID
# from datetime import datetime
# from typing import Optional, List
# from app.models.experiment import ExperimentStatus


# class VariantCreate(BaseModel):
#     name: str          # e.g. "Control"
#     label: str         # e.g. "A"
#     description: Optional[str] = None
#     traffic_split: float  # 0.0 to 1.0


# class ExperimentCreate(BaseModel):
#     name: str
#     description: Optional[str] = None
#     goal: str
#     variants: List[VariantCreate]

#     @field_validator("variants")
#     @classmethod
#     def splits_must_sum_to_one(cls, variants):
#         total = sum(v.traffic_split for v in variants)
#         if not (0.99 <= total <= 1.01):   # allow tiny float rounding
#             raise ValueError(f"Variant traffic splits must sum to 1.0 (got {total:.2f})")
#         if len(variants) < 2:
#             raise ValueError("An experiment needs at least 2 variants")
#         return variants


# class ExperimentUpdate(BaseModel):
#     name: Optional[str] = None
#     description: Optional[str] = None
#     goal: Optional[str] = None
#     status: Optional[ExperimentStatus] = None


# class VariantResponse(BaseModel):
#     id: UUID
#     name: str
#     label: str
#     description: Optional[str]
#     traffic_split: float

#     class Config:
#         from_attributes = True


# class ExperimentResponse(BaseModel):
#     id: UUID
#     name: str
#     description: Optional[str]
#     goal: str
#     status: ExperimentStatus
#     variants: List[VariantResponse]
#     created_at: datetime
#     updated_at: datetime

#     class Config:
#         from_attributes = True


































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
    planned_duration_days: Optional[int] = None        # NEW
    target_sample_size: Optional[int] = None           # NEW
    variants: List[VariantCreate]

    @field_validator("variants")
    @classmethod
    def splits_must_sum_to_one(cls, variants):
        total = sum(v.traffic_split for v in variants)
        if not (0.99 <= total <= 1.01):   # allow tiny float rounding
            raise ValueError(f"Variant traffic splits must sum to 1.0 (got {total:.2f})")
        if len(variants) < 2:
            raise ValueError("An experiment needs at least 2 variants")
        return variants


class ExperimentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    goal: Optional[str] = None
    scheduled_start_at: Optional[datetime] = None
    scheduled_end_at: Optional[datetime] = None
    status: Optional[ExperimentStatus] = None
    planned_duration_days: Optional[int] = None        # NEW
    target_sample_size: Optional[int] = None           # NEW


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
    planned_duration_days: Optional[int]               # NEW
    target_sample_size: Optional[int]                  # NEW
    scheduled_start_at: Optional[datetime] = None
    scheduled_end_at: Optional[datetime] = None
    variants: List[VariantResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


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

    @field_validator("scheduled_end_at")
    @classmethod
    def end_after_start(cls, v, info):
        start = info.data.get("scheduled_start_at")
        if v and start and v <= start:
            raise ValueError("scheduled_end_at must be after scheduled_start_at")
        return v