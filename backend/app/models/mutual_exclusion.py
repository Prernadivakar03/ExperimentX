# from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, UniqueConstraint
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
# from datetime import datetime
# import uuid

# from app.database import Base


# class MutualExclusionGroup(Base):
#     __tablename__ = "mutual_exclusion_groups"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

#     name = Column(String, nullable=False)          # e.g. "Homepage Layer"
#     description = Column(String, nullable=True)

#     created_at = Column(DateTime, default=datetime.utcnow)

#     owner = relationship("User")
#     memberships = relationship(
#         "MutualExclusionMembership",
#         back_populates="group",
#         cascade="all, delete-orphan",
#     )


# class MutualExclusionMembership(Base):
#     """
#     Links an Experiment into a group and reserves a slice of the group's
#     traffic space for it. allocation_pct across all memberships in a group
#     must be <= 100 (leftover % means those visitors enter NO experiment
#     in the group at all).
#     """
#     __tablename__ = "mutual_exclusion_memberships"
#     __table_args__ = (
#         UniqueConstraint("group_id", "experiment_id", name="uq_group_experiment"),
#     )

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     group_id = Column(UUID(as_uuid=True), ForeignKey("mutual_exclusion_groups.id"), nullable=False)
#     experiment_id = Column(UUID(as_uuid=True), ForeignKey("experiments.id"), nullable=False)

#     allocation_pct = Column(Integer, nullable=False)  # 0-100, slice of the group's bucket space

#     group = relationship("MutualExclusionGroup", back_populates="memberships")
#     experiment = relationship("Experiment")

































# backend/app/models/mutual_exclusion.py
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class MutualExclusionGroup(Base):
    __tablename__ = "mutual_exclusion_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)

    name = Column(String, nullable=False)          # e.g. "Homepage Layer"
    description = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User")
    organization = relationship("Organization")
    memberships = relationship(
        "MutualExclusionMembership",
        back_populates="group",
        cascade="all, delete-orphan",
    )


class MutualExclusionMembership(Base):
    """
    Links an Experiment into a group and reserves a slice of the group's
    traffic space for it. allocation_pct across all memberships in a group
    must be <= 100 (leftover % means those visitors enter NO experiment
    in the group at all).
    """
    __tablename__ = "mutual_exclusion_memberships"
    __table_args__ = (
        UniqueConstraint("group_id", "experiment_id", name="uq_group_experiment"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("mutual_exclusion_groups.id"), nullable=False)
    experiment_id = Column(UUID(as_uuid=True), ForeignKey("experiments.id"), nullable=False)

    allocation_pct = Column(Integer, nullable=False)  # 0-100, slice of the group's bucket space

    group = relationship("MutualExclusionGroup", back_populates="memberships")
    experiment = relationship("Experiment")