from pydantic import BaseModel, Field


class SampleSizeRequest(BaseModel):
    baseline_rate: float = Field(..., gt=0, lt=1, description="Current conversion rate, e.g. 0.05")
    mde: float = Field(..., gt=0, description="Minimum detectable relative lift, e.g. 0.10 for 10%")
    alpha: float = Field(default=0.05, gt=0, lt=1)
    power: float = Field(default=0.8, gt=0, lt=1)
    variants: int = Field(default=2, ge=2)