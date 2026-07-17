"""
Builds a per-variant funnel breakdown from real event data.
This is the ONLY input the AI explanation is allowed to reason from —
no UI/design details, because the system has no way to know those.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID

from app.models.event import Event
from app.models.visitor import Visitor
from app.models.conversion import Conversion


def build_funnel_breakdown(experiment_id: UUID, variants: list, db: Session) -> list[dict]:
    breakdown = []

    for variant in variants:
        visitors = db.query(Visitor).filter(
            Visitor.experiment_id == experiment_id, Visitor.variant_id == variant.id,
        ).count()

        conversions = db.query(Conversion).filter(
            Conversion.experiment_id == experiment_id, Conversion.variant_id == variant.id,
        ).count()

        event_counts = (
            db.query(Event.event_type, func.count(Event.id))
            .filter(Event.experiment_id == experiment_id, Event.variant_id == variant.id)
            .group_by(Event.event_type)
            .all()
        )

        event_breakdown = {
            event_type: {
                "count": count,
                "rate_per_visitor": round(count / visitors * 100, 2) if visitors else 0.0,
            }
            for event_type, count in event_counts
        }

        breakdown.append({
            "label": variant.label,
            "name": variant.name,
            "visitors": visitors,
            "conversions": conversions,
            "conversion_rate": round(conversions / visitors * 100, 2) if visitors else 0.0,
            "event_breakdown": event_breakdown,
        })

    return breakdown


def find_largest_divergence(breakdown: list[dict]) -> list[dict]:
    """
    Pure math: for each event_type present in BOTH the control and a variant,
    compute the gap in rate_per_visitor. Returns sorted biggest gaps first.
    This is what the AI is allowed to talk about — nothing else.
    """
    if len(breakdown) < 2:
        return []

    control = breakdown[0]
    divergences = []

    for variant in breakdown[1:]:
        shared_event_types = set(control["event_breakdown"]) & set(variant["event_breakdown"])
        for event_type in shared_event_types:
            control_rate = control["event_breakdown"][event_type]["rate_per_visitor"]
            variant_rate = variant["event_breakdown"][event_type]["rate_per_visitor"]
            gap = variant_rate - control_rate
            divergences.append({
                "variant_label": variant["label"],
                "event_type": event_type,
                "control_rate": control_rate,
                "variant_rate": variant_rate,
                "gap_pct_points": round(gap, 2),
            })

    return sorted(divergences, key=lambda d: abs(d["gap_pct_points"]), reverse=True)