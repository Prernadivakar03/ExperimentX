from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

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

    visitor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("visitors.id"),
        nullable=False
    )

    # "page_view", "button_click", "add_to_cart", etc.
    event_type = Column(String, nullable=False)

    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    experiment = relationship("Experiment", back_populates="events")
    variant = relationship("Variant", back_populates="events")
    visitor = relationship("Visitor", back_populates="events")