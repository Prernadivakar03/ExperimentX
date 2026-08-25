
# backend/app/models/visitor.py
from sqlalchemy import (
    Column, String, DateTime, ForeignKey, Boolean, Integer, Float,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class Visitor(Base):
    __tablename__ = "visitors"
    __table_args__ = (
        # Prevents two concurrent /assign requests for the same person from
        # both inserting a row — the DB rejects the second insert, and
        # assign.py catches that and returns the first row instead.
        UniqueConstraint(
            "experiment_id", "fingerprint",
            name="uq_visitor_experiment_fingerprint",
        ),
    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    experiment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("experiments.id"),
        nullable=False
    )

    variant_id = Column(
        UUID(as_uuid=True),
        ForeignKey("variants.id"),
        nullable=False
    )

    # fingerprint = browser cookie / localStorage ID so the same person
    # always gets the same variant on repeat visits
    fingerprint = Column(String, nullable=False, index=True)

    # The customer's own end-user ID (from their app, once known — e.g.
    # after login). This is NOT a foreign key into our internal `users`
    # table (that's for ExperimentX dashboard accounts); it's an opaque
    # string owned by whoever integrates the SDK. Nullable because
    # anonymous/logged-out visitors are valid and common.
    user_id = Column(String, nullable=True, index=True)
    identified_at = Column(DateTime, nullable=True)

    # ML feature columns. Nullable because historical rows won't have
    # these; the real SDK fills device/browser from user-agent and
    # country from IP geolocation at assignment time. traffic_source comes
    # from document.referrer / UTM params.
    device = Column(String, nullable=True)          # "mobile" | "desktop" | "tablet"
    browser = Column(String, nullable=True)          # "chrome" | "safari" | "firefox" | "edge" | "other"
    country = Column(String, nullable=True)          # ISO country code, e.g. "IN", "US"
    traffic_source = Column(String, nullable=True)   # "organic" | "paid" | "direct" | "social" | "referral"
    is_returning = Column(Boolean, nullable=True, default=False)
    session_duration_seconds = Column(Integer, nullable=True)

    # CUPED — pre-experiment value of the same metric being measured (e.g.
    # this visitor's historical conversion rate before entering the
    # experiment). Populated at assignment time; nullable for existing rows
    # and for visitors with no prior history.
    pre_experiment_covariate = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    experiment = relationship("Experiment", back_populates="visitors")
    variant = relationship("Variant", back_populates="visitors")
    events = relationship("Event", back_populates="visitor")
    conversions = relationship("Conversion", back_populates="visitor")