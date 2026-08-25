# # backend/app/core/metric_eval.py
# """
# Shared metric computation — used by both the on-demand
# /metrics/{id}/evaluate/{experiment_id} route and the guardrail scheduler
# job, so the two never compute a metric's value differently.
# """
# from uuid import UUID
# from sqlalchemy import func
# from sqlalchemy.orm import Session

# from app.models.metric import Metric, MetricType
# from app.models.visitor import Visitor
# from app.models.event import Event
# from app.models.conversion import Conversion
# from app.core.formula_eval import evaluate_formula


# def compute_base_values(metric: Metric, experiment_id: UUID, variant_id: UUID, db: Session) -> dict:
#     visitors = db.query(Visitor).filter(
#         Visitor.experiment_id == experiment_id, Visitor.variant_id == variant_id,
#     ).count()

#     conversions = db.query(Conversion).filter(
#         Conversion.experiment_id == experiment_id, Conversion.variant_id == variant_id,
#     ).count()

#     event_count = 0
#     event_sum = 0.0
#     if metric.event_type:
#         event_count = db.query(Event).filter(
#             Event.experiment_id == experiment_id, Event.variant_id == variant_id,
#             Event.event_type == metric.event_type,
#         ).count()
#         event_sum = db.query(func.coalesce(func.sum(Event.value), 0.0)).filter(
#             Event.experiment_id == experiment_id, Event.variant_id == variant_id,
#             Event.event_type == metric.event_type,
#         ).scalar() or 0.0

#     numerator_count = 0
#     denominator_count = 0
#     if metric.numerator_event_type:
#         numerator_count = db.query(Event).filter(
#             Event.experiment_id == experiment_id, Event.variant_id == variant_id,
#             Event.event_type == metric.numerator_event_type,
#         ).count()
#     if metric.denominator_event_type:
#         denominator_count = db.query(Event).filter(
#             Event.experiment_id == experiment_id, Event.variant_id == variant_id,
#             Event.event_type == metric.denominator_event_type,
#         ).count()

#     return {
#         "visitors": visitors,
#         "conversions": conversions,
#         "event_count": event_count,
#         "event_sum": event_sum,
#         "numerator_count": numerator_count,
#         "denominator_count": denominator_count,
#     }


# def compute_metric_value(metric: Metric, base: dict) -> float:
#     if metric.metric_type == MetricType.conversion_rate:
#         return (base["conversions"] / base["visitors"] * 100) if base["visitors"] else 0.0

#     if metric.metric_type == MetricType.count:
#         return float(base["event_count"])

#     if metric.metric_type == MetricType.sum:
#         return float(base["event_sum"])

#     if metric.metric_type == MetricType.average:
#         return (base["event_sum"] / base["event_count"]) if base["event_count"] else 0.0

#     if metric.metric_type == MetricType.ratio:
#         return (base["numerator_count"] / base["denominator_count"]) if base["denominator_count"] else 0.0

#     if metric.metric_type == MetricType.custom_formula:
#         return evaluate_formula(metric.formula, base)   # raises FormulaError — caller decides how to handle

#     return 0.0

















































# backend/app/core/metric_eval.py
"""
Shared metric computation — used by both the on-demand
/metrics/{id}/evaluate/{experiment_id} route and the guardrail scheduler
job, so the two never compute a metric's value differently.
"""
from uuid import UUID
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.metric import Metric, MetricType
from app.models.visitor import Visitor
from app.models.event import Event
from app.models.conversion import Conversion
from app.core.formula_eval import evaluate_formula


def compute_base_values(metric: Metric, experiment_id: UUID, variant_id: UUID, db: Session) -> dict:
    visitors = db.query(Visitor).filter(
        Visitor.experiment_id == experiment_id, Visitor.variant_id == variant_id,
    ).count()

    # Unit of analysis for a rate is "did this visitor convert at least
    # once", not "how many conversion rows exist" — one visitor completing
    # 3 purchases must count as 1 conversion here, or every downstream rate,
    # z-test, Bayesian test, and guardrail check gets inflated by repeat
    # converters. Raw event volume (e.g. total purchases, total revenue)
    # is tracked separately via conversion_event_count / conversion_value_sum.
    conversions = (
        db.query(func.count(func.distinct(Conversion.visitor_id)))
        .filter(Conversion.experiment_id == experiment_id, Conversion.variant_id == variant_id)
        .scalar() or 0
    )

    conversion_event_count = db.query(Conversion).filter(
        Conversion.experiment_id == experiment_id, Conversion.variant_id == variant_id,
    ).count()

    conversion_value_sum = db.query(func.coalesce(func.sum(Conversion.value), 0.0)).filter(
        Conversion.experiment_id == experiment_id, Conversion.variant_id == variant_id,
    ).scalar() or 0.0

    event_count = 0
    event_sum = 0.0
    if metric.event_type:
        event_count = db.query(Event).filter(
            Event.experiment_id == experiment_id, Event.variant_id == variant_id,
            Event.event_type == metric.event_type,
        ).count()
        event_sum = db.query(func.coalesce(func.sum(Event.value), 0.0)).filter(
            Event.experiment_id == experiment_id, Event.variant_id == variant_id,
            Event.event_type == metric.event_type,
        ).scalar() or 0.0

    numerator_count = 0
    denominator_count = 0
    if metric.numerator_event_type:
        numerator_count = db.query(Event).filter(
            Event.experiment_id == experiment_id, Event.variant_id == variant_id,
            Event.event_type == metric.numerator_event_type,
        ).count()
    if metric.denominator_event_type:
        denominator_count = db.query(Event).filter(
            Event.experiment_id == experiment_id, Event.variant_id == variant_id,
            Event.event_type == metric.denominator_event_type,
        ).count()

    return {
        "visitors": visitors,
        "conversions": conversions,                        # distinct converted visitors
        "conversion_event_count": conversion_event_count,   # raw conversion rows
        "conversion_value_sum": conversion_value_sum,       # sum of Conversion.value
        "event_count": event_count,
        "event_sum": event_sum,
        "numerator_count": numerator_count,
        "denominator_count": denominator_count,
    }


def compute_metric_value(metric: Metric, base: dict) -> float:
    if metric.metric_type == MetricType.conversion_rate:
        return (base["conversions"] / base["visitors"] * 100) if base["visitors"] else 0.0

    if metric.metric_type == MetricType.count:
        return float(base["event_count"])

    if metric.metric_type == MetricType.sum:
        return float(base["event_sum"])

    if metric.metric_type == MetricType.average:
        return (base["event_sum"] / base["event_count"]) if base["event_count"] else 0.0

    if metric.metric_type == MetricType.ratio:
        return (base["numerator_count"] / base["denominator_count"]) if base["denominator_count"] else 0.0

    if metric.metric_type == MetricType.custom_formula:
        return evaluate_formula(metric.formula, base)   # raises FormulaError — caller decides how to handle

    return 0.0