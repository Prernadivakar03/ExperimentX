# backend/app/ml/features.py
"""
Builds the feature frame every model in this module trains on — one row
per visitor, joining visitor attributes with aggregated event behavior and
the conversion label.

Honest note on session_duration_seconds / page_views: these describe the
FULL session, so at true real-time inference (mid-session) you'd only have
partial values. That's fine for this retrospective model (predicting/
explaining completed sessions), but if you ever build a live "this visitor
has an X% chance of converting right now" widget, it needs a separate model
trained on truncated/partial-session features — otherwise you're training
on information the live system won't actually have yet.
"""
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID

from app.models.visitor import Visitor
from app.models.event import Event
from app.models.conversion import Conversion
from app.models.variant import Variant


def build_feature_frame(db: Session, experiment_id: UUID) -> pd.DataFrame:
    visitors = db.query(Visitor).filter(Visitor.experiment_id == experiment_id).all()

    variant_label = {
        v.id: v.label
        for v in db.query(Variant).filter(Variant.experiment_id == experiment_id).all()
    }

    converted_visitor_ids = {
        c.visitor_id
        for c in db.query(Conversion).filter(Conversion.experiment_id == experiment_id).all()
    }

    page_view_counts = dict(
        db.query(Event.visitor_id, func.count(Event.id))
        .filter(Event.experiment_id == experiment_id, Event.event_type == "page_view")
        .group_by(Event.visitor_id)
        .all()
    )

    rows = []
    for v in visitors:
        rows.append({
            "visitor_id": str(v.id),
            "device": v.device or "unknown",
            "browser": v.browser or "unknown",
            "country": v.country or "unknown",
            "traffic_source": v.traffic_source or "unknown",
            "is_returning": bool(v.is_returning),
            "session_duration_seconds": v.session_duration_seconds or 0,
            "page_views": page_view_counts.get(v.id, 0),
            "hour_of_day": v.created_at.hour,
            "day_of_week": v.created_at.weekday(),
            "variant": variant_label.get(v.variant_id, "unknown"),
            "converted": 1 if v.id in converted_visitor_ids else 0,
        })

    return pd.DataFrame(rows)