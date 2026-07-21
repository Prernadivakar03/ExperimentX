# from sqlalchemy import Column, String, DateTime, Integer, Boolean, ForeignKey, UniqueConstraint
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
# from datetime import datetime
# import uuid

# from app.database import Base


# class HoldoutGroup(Base):
#     """
#     A fixed % of an owner's traffic that is permanently excluded from ALL
#     experiments, used to measure the long-term aggregate impact of running
#     experiments at all (vs. no experimentation program).
#     """
#     __tablename__ = "holdout_groups"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

#     name = Column(String, nullable=False)
#     description = Column(String, nullable=True)
#     percentage = Column(Integer, nullable=False)   # 0-100, share of ALL traffic held out
#     is_active = Column(Boolean, default=True, nullable=False)

#     created_at = Column(DateTime, default=datetime.utcnow)

#     owner = relationship("User")
#     visitors = relationship("HoldoutVisitor", back_populates="group", cascade="all, delete-orphan")


# class HoldoutVisitor(Base):
#     __tablename__ = "holdout_visitors"
#     __table_args__ = (
#         UniqueConstraint("group_id", "fingerprint", name="uq_holdout_group_fingerprint"),
#     )

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     group_id = Column(UUID(as_uuid=True), ForeignKey("holdout_groups.id"), nullable=False)
#     fingerprint = Column(String, nullable=False, index=True)

#     created_at = Column(DateTime, default=datetime.utcnow)

#     group = relationship("HoldoutGroup", back_populates="visitors")
#     conversions = relationship("HoldoutConversion", back_populates="holdout_visitor", cascade="all, delete-orphan")


# class HoldoutConversion(Base):
#     __tablename__ = "holdout_conversions"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     holdout_visitor_id = Column(UUID(as_uuid=True), ForeignKey("holdout_visitors.id"), nullable=False)
#     goal = Column(String, nullable=False)
#     timestamp = Column(DateTime, default=datetime.utcnow)

#     holdout_visitor = relationship("HoldoutVisitor", back_populates="conversions")




# backend/app/models/holdout.py
from sqlalchemy import Column, String, DateTime, Integer, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class HoldoutGroup(Base):
    """
    A fixed % of an owner's traffic that is permanently excluded from ALL
    experiments, used to measure the long-term aggregate impact of running
    experiments at all (vs. no experimentation program).
    """
    __tablename__ = "holdout_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    percentage = Column(Integer, nullable=False)   # 0-100, share of ALL traffic held out
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User")
    organization = relationship("Organization")
    visitors = relationship("HoldoutVisitor", back_populates="group", cascade="all, delete-orphan")


class HoldoutVisitor(Base):
    __tablename__ = "holdout_visitors"
    __table_args__ = (
        UniqueConstraint("group_id", "fingerprint", name="uq_holdout_group_fingerprint"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("holdout_groups.id"), nullable=False)
    fingerprint = Column(String, nullable=False, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    group = relationship("HoldoutGroup", back_populates="visitors")
    conversions = relationship("HoldoutConversion", back_populates="holdout_visitor", cascade="all, delete-orphan")


class HoldoutConversion(Base):
    __tablename__ = "holdout_conversions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    holdout_visitor_id = Column(UUID(as_uuid=True), ForeignKey("holdout_visitors.id"), nullable=False)
    goal = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    holdout_visitor = relationship("HoldoutVisitor", back_populates="conversions")