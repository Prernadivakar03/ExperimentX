

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
import math

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.experiment import Experiment
from app.models.variant import Variant
from app.models.visitor import Visitor
from app.models.event import Event
from app.models.conversion import Conversion

router = APIRouter(tags=["analytics"])


@router.get("/analytics/{experiment_id}")
def get_analytics(
    experiment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = db.query(Experiment).filter(
        Experiment.id == experiment_id,
        Experiment.owner_id == current_user.id,
    ).first()

    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")

    variants = db.query(Variant).filter(Variant.experiment_id == experiment_id).all()

    variant_stats = []
    for variant in variants:
        visitors = db.query(Visitor).filter(
            Visitor.experiment_id == experiment_id,
            Visitor.variant_id == variant.id,
        ).count()

        clicks = db.query(Event).filter(
            Event.experiment_id == experiment_id,
            Event.variant_id == variant.id,
            Event.event_type == "button_click",
        ).count()

        page_views = db.query(Event).filter(
            Event.experiment_id == experiment_id,
            Event.variant_id == variant.id,
            Event.event_type == "page_view",
        ).count()

        conversions = db.query(Conversion).filter(
            Conversion.experiment_id == experiment_id,
            Conversion.variant_id == variant.id,
        ).count()

        conv_rate = round((conversions / visitors * 100), 2) if visitors > 0 else 0.0
        ctr = round((clicks / page_views * 100), 2) if page_views > 0 else 0.0

        variant_stats.append({
            "variant_id": str(variant.id),
            "label": variant.label,
            "name": variant.name,
            "traffic_split": variant.traffic_split,
            "visitors": visitors,
            "page_views": page_views,
            "clicks": clicks,
            "conversions": conversions,
            "conversion_rate": conv_rate,
            "ctr": ctr,
        })

    # ── Statistics (Z-test for two proportions) ───────────────────────────────
    stats_result = None
    if len(variant_stats) == 2:
        stats_result = _run_z_test(variant_stats[0], variant_stats[1])

    total_visitors = sum(v["visitors"] for v in variant_stats)
    total_conversions = sum(v["conversions"] for v in variant_stats)
    total_clicks = sum(v["clicks"] for v in variant_stats)
    total_page_views = sum(v["page_views"] for v in variant_stats)

    return {
        "experiment_id": str(experiment_id),
        "experiment_name": experiment.name,
        "goal": experiment.goal,
        "status": experiment.status,
        "summary": {
            "total_visitors": total_visitors,
            "total_conversions": total_conversions,
            "total_clicks": total_clicks,
            "total_page_views": total_page_views,
        },
        "variants": variant_stats,
        "statistics": stats_result,
    }


# ── Dashboard overview (all experiments for current user) ─────────────────────

@router.get("/analytics")
def dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiments = db.query(Experiment).filter(
        Experiment.owner_id == current_user.id
    ).all()

    experiment_ids = [e.id for e in experiments]

    total_visitors = db.query(Visitor).filter(
        Visitor.experiment_id.in_(experiment_ids)
    ).count()

    total_page_views = db.query(Event).filter(
        Event.experiment_id.in_(experiment_ids),
        Event.event_type == "page_view",
    ).count()

    total_clicks = db.query(Event).filter(
        Event.experiment_id.in_(experiment_ids),
        Event.event_type == "button_click",
    ).count()

    total_conversions = db.query(Conversion).filter(
        Conversion.experiment_id.in_(experiment_ids)
    ).count()

    running = sum(1 for e in experiments if e.status.value == "running")
    completed = sum(1 for e in experiments if e.status.value == "completed")

    return {
        "total_visitors": total_visitors,
        "total_page_views": total_page_views,
        "total_clicks": total_clicks,
        "total_conversions": total_conversions,
        "total_experiments": len(experiments),
        "running_experiments": running,
        "completed_experiments": completed,
    }


# ── Z-test helper ─────────────────────────────────────────────────────────────

def _run_z_test(a: dict, b: dict) -> dict:
    """
    Two-proportion Z-test.
    Returns p_value, z_score, confidence, is_significant, and winner label.
    """
    n_a, conv_a = a["visitors"], a["conversions"]
    n_b, conv_b = b["visitors"], b["conversions"]

    if n_a == 0 or n_b == 0:
        return {"error": "Not enough visitors to compute significance"}

    p_a = conv_a / n_a
    p_b = conv_b / n_b
    p_pool = (conv_a + conv_b) / (n_a + n_b)

    denominator = math.sqrt(p_pool * (1 - p_pool) * (1 / n_a + 1 / n_b))

    if denominator == 0:
        return {"error": "Cannot compute — no conversions yet"}

    z = (p_b - p_a) / denominator
    # Approximate two-tailed p-value from Z using error function
    p_value = 2 * (1 - _norm_cdf(abs(z)))
    confidence = round((1 - p_value) * 100, 2)
    is_significant = p_value < 0.05

    if is_significant:
        winner = b["label"] if p_b > p_a else a["label"]
    else:
        winner = None

    return {
        "z_score": round(z, 4),
        "p_value": round(p_value, 6),
        "confidence": confidence,
        "is_significant": is_significant,
        "winner": winner,
    }


def _norm_cdf(x: float) -> float:
    """Standard normal CDF via math.erf — no scipy needed."""
    return (1.0 + math.erf(x / math.sqrt(2))) / 2.0