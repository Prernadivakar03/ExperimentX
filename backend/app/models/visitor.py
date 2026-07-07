

from sqlalchemy import Column, String, DateTime, ForeignKey
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

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    experiment = relationship("Experiment", back_populates="visitors")
    variant = relationship("Variant", back_populates="visitors")
    events = relationship("Event", back_populates="visitor")
    conversions = relationship("Conversion", back_populates="visitor")