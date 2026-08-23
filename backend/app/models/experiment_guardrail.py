# backend/app/models/experiment_guardrail.py
from sqlalchemy import Column, DateTime, Float, ForeignKey, Enum as SAEnum, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.database import Base


class GuardrailDirection(str, enum.Enum):
    higher_is_better = "higher_is_better"   # e.g. conversion rate — a DROP is a regression
    lower_is_better = "lower_is_better"     # e.g. latency, error rate — a RISE is a regression


class ExperimentGuardrail(Base):
    """
    Attaches a guardrail metric to an experiment: it must not regress by
    more than max_regression_pct for any non-control variant vs. control,
    or the scheduler auto-pauses the experiment and fires a webhook alert.
    Independent of Experiment.primary_metric_id — a guardrail is a
    "don't let this break" check, not the thing being optimized for.
    """
    __tablename__ = "experiment_guardrails"
    __table_args__ = (UniqueConstraint("experiment_id", "metric_id", name="uq_guardrail_experiment_metric"),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    experiment_id = Column(UUID(as_uuid=True), ForeignKey("experiments.id"), nullable=False)
    metric_id = Column(UUID(as_uuid=True), ForeignKey("metrics.id"), nullable=False)

    direction = Column(SAEnum(GuardrailDirection), nullable=False, default=GuardrailDirection.higher_is_better)
    max_regression_pct = Column(Float, nullable=False, default=5.0)

    created_at = Column(DateTime, default=datetime.utcnow)

    experiment = relationship("Experiment", back_populates="guardrails")
    metric = relationship("Metric")