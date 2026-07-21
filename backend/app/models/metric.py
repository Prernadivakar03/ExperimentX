# from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Enum as SAEnum
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
# from datetime import datetime
# import uuid
# import enum

# from app.database import Base


# class MetricType(str, enum.Enum):
#     conversion_rate = "conversion_rate"   # conversions matching a goal / visitors
#     count = "count"                       # count of events matching event_type
#     sum = "sum"                           # sum of event.value for matching event_type (e.g. revenue)
#     average = "average"                   # average of event.value (e.g. AOV)
#     ratio = "ratio"                       # count(event_type_a) / count(event_type_b)
#     custom_formula = "custom_formula"     # arithmetic over named base metrics


# class Metric(Base):
#     __tablename__ = "metrics"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

#     key = Column(String, nullable=False)          # e.g. "revenue_per_visitor"
#     name = Column(String, nullable=False)          # e.g. "Revenue per Visitor"
#     description = Column(String, nullable=True)

#     metric_type = Column(SAEnum(MetricType), nullable=False)

#     # used by count / sum / average
#     event_type = Column(String, nullable=True)     # e.g. "purchase"

#     # used by ratio
#     numerator_event_type = Column(String, nullable=True)
#     denominator_event_type = Column(String, nullable=True)

#     # used by custom_formula, e.g. "revenue_sum / visitors * 100"
#     formula = Column(String, nullable=True)

#     is_guardrail = Column(Boolean, default=False, nullable=False)

#     created_at = Column(DateTime, default=datetime.utcnow)

#     owner = relationship("User")















# backend/app/models/metric.py
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.database import Base


class MetricType(str, enum.Enum):
    conversion_rate = "conversion_rate"
    count = "count"
    sum = "sum"
    average = "average"
    ratio = "ratio"
    custom_formula = "custom_formula"


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)

    key = Column(String, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    metric_type = Column(SAEnum(MetricType), nullable=False)

    event_type = Column(String, nullable=True)

    numerator_event_type = Column(String, nullable=True)
    denominator_event_type = Column(String, nullable=True)

    formula = Column(String, nullable=True)

    is_guardrail = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User")
    organization = relationship("Organization")