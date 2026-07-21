
# from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum as SAEnum
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
# from datetime import datetime
# import uuid
# import enum

# from app.database import Base


# class ExperimentStatus(str, enum.Enum):
#     draft = "draft"
#     running = "running"
#     paused = "paused"
#     completed = "completed"


# class Experiment(Base):
#     __tablename__ = "experiments"

#     id = Column(
#         UUID(as_uuid=True),
#         primary_key=True,
#         default=uuid.uuid4
#     )

#     owner_id = Column(
#         UUID(as_uuid=True),
#         ForeignKey("users.id"),
#         nullable=False
#     )

#     name = Column(String, nullable=False)
#     description = Column(String, nullable=True)
#     goal = Column(String, nullable=False)   # e.g. "purchase", "signup", "click"


#     goal = Column(String, nullable=False)
#     planned_duration_days = Column(Integer, nullable=True)
#     target_sample_size = Column(Integer, nullable=True)
#     scheduled_start_at = Column(DateTime, nullable=True)   # if set, auto-starts at this UTC time
#     scheduled_end_at = Column(DateTime, nullable=True)     # if set, auto-completes at this UTC time
#     timezone = Column(String, nullable=False, default="UTC")
    
#     # ----- NEW FIELDS -----
#     planned_duration_days = Column(Integer, nullable=True)
#     target_sample_size = Column(Integer, nullable=True)
#     # -----------------------

#     status = Column(
#         SAEnum(ExperimentStatus),
#         default=ExperimentStatus.draft,
#         nullable=False
#     )

#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     # Relationships
#     owner = relationship("User", back_populates="experiments")
#     variants = relationship("Variant", back_populates="experiment", cascade="all, delete-orphan")
#     visitors = relationship("Visitor", back_populates="experiment")
#     events = relationship("Event", back_populates="experiment")
#     conversions = relationship("Conversion", back_populates="experiment")






































# backend/app/models/experiment.py
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.database import Base


class ExperimentStatus(str, enum.Enum):
    draft = "draft"
    running = "running"
    paused = "paused"
    completed = "completed"


class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    owner_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    # NEW: every experiment belongs to an organization. Backfilled for
    # existing rows by migration c9d0e1f2a3b4 (every user gets a personal
    # org). owner_id is kept for audit/history ("who created this") —
    # organization_id is now the source of truth for access control.
    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False
    )

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    goal = Column(String, nullable=False)   # e.g. "purchase", "signup", "click"

    planned_duration_days = Column(Integer, nullable=True)
    target_sample_size = Column(Integer, nullable=True)
    scheduled_start_at = Column(DateTime, nullable=True)   # if set, auto-starts at this UTC time
    scheduled_end_at = Column(DateTime, nullable=True)     # if set, auto-completes at this UTC time
    timezone = Column(String, nullable=False, default="UTC")

    status = Column(
        SAEnum(ExperimentStatus),
        default=ExperimentStatus.draft,
        nullable=False
    )

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="experiments")
    organization = relationship("Organization")
    variants = relationship("Variant", back_populates="experiment", cascade="all, delete-orphan")
    visitors = relationship("Visitor", back_populates="experiment")
    events = relationship("Event", back_populates="experiment")
    conversions = relationship("Conversion", back_populates="experiment")