from sqlalchemy import Column, String, DateTime, Integer, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class Variant(Base):
    __tablename__ = "variants"

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

    name = Column(String, nullable=False)           # e.g. "Control", "Challenger"
    label = Column(String, nullable=False)          # e.g. "A", "B"
    description = Column(String, nullable=True)     # what is different in this variant
    traffic_split = Column(Float, nullable=False)   # 0.0 to 1.0, must sum to 1.0 across variants

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    experiment = relationship("Experiment", back_populates="variants")
    visitors = relationship("Visitor", back_populates="variant")
    events = relationship("Event", back_populates="variant")
    conversions = relationship("Conversion", back_populates="variant")