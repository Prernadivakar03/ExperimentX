# from sqlalchemy import Column, Integer, String, DateTime
# from datetime import datetime

# from app.database import Base


# class Conversion(Base):
#     __tablename__ = "conversions"

#     id = Column(
#         Integer,
#         primary_key=True,
#         index=True
#     )

#     user_id = Column(
#         String,
#         nullable=False
#     )

#     timestamp = Column(
#         DateTime,
#         default=datetime.utcnow
#     )








from sqlalchemy import Column, Integer, String, DateTime, ForeignKey , Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Conversion(Base):
    __tablename__ = "conversions"

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

    # What goal was completed — matches experiment.goal
    goal = Column(String, nullable=False)
    value = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    experiment = relationship("Experiment", back_populates="conversions")
    variant = relationship("Variant", back_populates="conversions")
    visitor = relationship("Visitor", back_populates="conversions")