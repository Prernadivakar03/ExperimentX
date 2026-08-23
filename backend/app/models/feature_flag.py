# from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
# from datetime import datetime
# import uuid

# from app.database import Base


# class FeatureFlag(Base):
#     __tablename__ = "feature_flags"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

#     key = Column(String, nullable=False, index=True)   # e.g. "new-checkout-flow"
#     name = Column(String, nullable=False)
#     description = Column(String, nullable=True)

#     is_enabled = Column(Boolean, default=False, nullable=False)   # master kill switch
#     rollout_percentage = Column(Integer, default=0, nullable=False)  # 0-100

#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     owner = relationship("User")












# backend/app/models/feature_flag.py
from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey
#from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base
from sqlalchemy.dialects.postgresql import UUID, JSONB


class FeatureFlag(Base):
    __tablename__ = "feature_flags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)

    key = Column(String, nullable=False, index=True)   # e.g. "new-checkout-flow"
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    is_enabled = Column(Boolean, default=False, nullable=False)   # master kill switch
    rollout_percentage = Column(Integer, default=0, nullable=False)  # 0-100

    # Ordered list of targeting rules; see app/core/targeting.py for shape.
    # Empty list = no targeting, falls back to is_enabled/rollout_percentage.
    targeting_rules = Column(JSONB, nullable=False, default=list, server_default="[]")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User")
    organization = relationship("Organization")