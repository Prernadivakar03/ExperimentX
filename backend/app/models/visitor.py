

# from sqlalchemy import Column, String, DateTime, ForeignKey
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
# from datetime import datetime
# import uuid

# from app.database import Base


# class Visitor(Base):
#     __tablename__ = "visitors"

#     id = Column(
#         UUID(as_uuid=True),
#         primary_key=True,
#         default=uuid.uuid4
#     )

#     experiment_id = Column(
#         UUID(as_uuid=True),
#         ForeignKey("experiments.id"),
#         nullable=False
#     )

#     variant_id = Column(
#         UUID(as_uuid=True),
#         ForeignKey("variants.id"),
#         nullable=False
#     )

#     # fingerprint = browser cookie / localStorage ID so the same person
#     # always gets the same variant on repeat visits
#     fingerprint = Column(String, nullable=False, index=True)

#     created_at = Column(DateTime, default=datetime.utcnow)

#     # Relationships
#     experiment = relationship("Experiment", back_populates="visitors")
#     variant = relationship("Variant", back_populates="visitors")
#     events = relationship("Event", back_populates="visitor")
#     conversions = relationship("Conversion", back_populates="visitor")

























# backend/app/models/visitor.py
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class Visitor(Base):
    __tablename__ = "visitors"

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

    # NEW — ML feature columns. Nullable because historical rows won't have
    # these; the real SDK (Phase 3) fills device/browser from user-agent and
    # country from IP geolocation at assignment time. traffic_source comes
    # from document.referrer / UTM params. Until then, the synthetic data
    # generator populates these for model training.
    device = Column(String, nullable=True)          # "mobile" | "desktop" | "tablet"
    browser = Column(String, nullable=True)          # "chrome" | "safari" | "firefox" | "edge" | "other"
    country = Column(String, nullable=True)          # ISO country code, e.g. "IN", "US"
    traffic_source = Column(String, nullable=True)   # "organic" | "paid" | "direct" | "social" | "referral"
    is_returning = Column(Boolean, nullable=True, default=False)
    session_duration_seconds = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    experiment = relationship("Experiment", back_populates="visitors")
    variant = relationship("Variant", back_populates="visitors")
    events = relationship("Event", back_populates="visitor")
    conversions = relationship("Conversion", back_populates="visitor")