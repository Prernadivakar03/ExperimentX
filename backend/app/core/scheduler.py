# backend/app/core/scheduler.py
"""
Background jobs:
  - experiment_status_transitions: every 60s, moves draft -> running and
    running -> completed based on scheduled_start_at / scheduled_end_at.
  - bandit_reallocation: every 15min, recomputes traffic split for
    experiments in bandit allocation mode via Thompson Sampling.
  - guardrail_checks: every 10min, evaluates guardrail metrics for running
    experiments and auto-pauses + alerts on regression.
"""
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import logging

from app.database import SessionLocal
from app.models.experiment import Experiment, ExperimentStatus
from app.models.variant import Variant
from app.models.visitor import Visitor
from app.models.conversion import Conversion
from app.core.activity import log_activity
from app.core.bandit import thompson_sample_allocation

from app.models.metric import Metric
from app.models.experiment_guardrail import ExperimentGuardrail
from app.models.organization import Organization
from app.core.metric_eval import compute_base_values, compute_metric_value
from app.core.guardrails import check_guardrail_regression
from app.core.webhooks import send_slack_alert

logger = logging.getLogger("experimentx.scheduler")


# ----- Helper functions for bandit reallocation -----
def _count_visitors(variant_id: int, db) -> int:
    """Return the number of visitors assigned to a variant."""
    return db.query(Visitor).filter(Visitor.variant_id == variant_id).count()


def _count_conversions(variant_id: int, db) -> int:
    """Return the number of conversions recorded for a variant."""
    return db.query(Conversion).filter(Conversion.variant_id == variant_id).count()


# ----- Job functions -----
def _run_scheduled_transitions():
    db = SessionLocal()
    try:
        now = datetime.utcnow()

        # draft -> running
        to_start = db.query(Experiment).filter(
            Experiment.status == ExperimentStatus.draft,
            Experiment.scheduled_start_at.isnot(None),
            Experiment.scheduled_start_at <= now,
        ).all()

        for exp in to_start:
            old_status = exp.status
            exp.status = ExperimentStatus.running
            db.commit()
            db.refresh(exp)
            log_activity(db, None, "experiment.transitioned", exp.id,
                         {"from": old_status.value, "to": exp.status.value})
            logger.info(f"Auto-started experiment {exp.id} ({exp.name})")

        # running -> completed
        to_complete = db.query(Experiment).filter(
            Experiment.status == ExperimentStatus.running,
            Experiment.scheduled_end_at.isnot(None),
            Experiment.scheduled_end_at <= now,
        ).all()

        for exp in to_complete:
            old_status = exp.status
            exp.status = ExperimentStatus.completed
            db.commit()
            db.refresh(exp)
            log_activity(db, None, "experiment.transitioned", exp.id,
                         {"from": old_status.value, "to": exp.status.value})
            logger.info(f"Auto-completed experiment {exp.id} ({exp.name})")

    except Exception:
        logger.exception("Scheduler transition run failed")
        db.rollback()
    finally:
        db.close()


def _run_bandit_reallocation():
    db = SessionLocal()
    try:
        experiments = db.query(Experiment).filter(
            Experiment.status == ExperimentStatus.running,
            Experiment.allocation_mode == "bandit",
        ).all()

        for exp in experiments:
            variants_data = [
                {
                    "label": v.label,
                    "id": v.id,
                    "visitors": _count_visitors(v.id, db),
                    "conversions": _count_conversions(v.id, db)
                }
                for v in exp.variants
            ]

            if len(variants_data) < 2:
                continue

            result = thompson_sample_allocation(variants_data)
            if "error" in result:
                logger.warning(f"Bandit reallocation skipped for {exp.id}: {result['error']}")
                continue

            for alloc in result["allocations"]:
                variant_id = next(v["id"] for v in variants_data if v["label"] == alloc["label"])
                variant = db.query(Variant).filter(Variant.id == variant_id).first()
                variant.traffic_split = alloc["allocation_pct"] / 100

            db.commit()
            logger.info(f"Bandit reallocated traffic for experiment {exp.id} ({exp.name})")

    except Exception:
        logger.exception("Bandit reallocation run failed")
        db.rollback()
    finally:
        db.close()


def _run_guardrail_checks():
    db = SessionLocal()
    try:
        experiments = db.query(Experiment).filter(
            Experiment.status == ExperimentStatus.running,
        ).all()

        for exp in experiments:
            guardrails = db.query(ExperimentGuardrail).filter(
                ExperimentGuardrail.experiment_id == exp.id,
            ).all()
            if not guardrails:
                continue

            variants = sorted(exp.variants, key=lambda v: v.created_at)
            if len(variants) < 2:
                continue
            control = variants[0]

            breaches = []
            for guardrail in guardrails:
                metric = db.query(Metric).filter(Metric.id == guardrail.metric_id).first()
                if not metric:
                    continue

                control_base = compute_base_values(metric, exp.id, control.id, db)
                control_value = compute_metric_value(metric, control_base)

                for variant in variants[1:]:
                    variant_base = compute_base_values(metric, exp.id, variant.id, db)
                    variant_value = compute_metric_value(metric, variant_base)

                    regressed, _pct, detail = check_guardrail_regression(
                        control_value, variant_value, guardrail.direction.value, guardrail.max_regression_pct,
                    )
                    if regressed:
                        breaches.append(f"{metric.name} {detail} on variant '{variant.label}'")

            if not breaches:
                continue

            old_status = exp.status
            exp.status = ExperimentStatus.paused
            db.commit()
            db.refresh(exp)

            summary = "; ".join(breaches)
            log_activity(
                db, None, "experiment.guardrail_breach", exp.id,
                {"from": old_status.value, "to": exp.status.value, "breaches": breaches},
            )
            logger.warning(f"Auto-paused experiment {exp.id} ({exp.name}) — guardrail breach: {summary}")

            organization = db.query(Organization).filter(Organization.id == exp.organization_id).first()
            if organization and organization.webhook_url and "guardrail_breach" in (organization.webhook_events or []):
                send_slack_alert(
                    organization.webhook_url,
                    "guardrail_breach",
                    exp.name,
                    f"Experiment auto-paused — guardrail regression detected: {summary}",
                )

    except Exception:
        logger.exception("Guardrail check run failed")
        db.rollback()
    finally:
        db.close()


# ----- Scheduler setup -----
_scheduler = BackgroundScheduler()


def start_scheduler():
    _scheduler.add_job(
        _run_scheduled_transitions,
        "interval",
        seconds=60,
        id="experiment_status_transitions",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    _scheduler.add_job(
        _run_bandit_reallocation,
        "interval",
        minutes=15,
        id="bandit_reallocation",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    _scheduler.add_job(
        _run_guardrail_checks,
        "interval",
        minutes=10,
        id="guardrail_checks",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    _scheduler.start()
    logger.info(
        "Experiment scheduler started "
        "(transitions every 60s, bandit every 15min, guardrails every 10min)"
    )


def stop_scheduler():
    _scheduler.shutdown(wait=False)