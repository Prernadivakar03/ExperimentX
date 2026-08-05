
# """
# Background job that auto-transitions experiment status based on scheduled times.
# Runs every 60 seconds. Uses UTC internally — scheduled_start_at/end_at should
# always be stored as UTC datetimes (convert from the experiment's timezone at
# the point the frontend submits the form, not here).
# """
# from apscheduler.schedulers.background import BackgroundScheduler
# from datetime import datetime
# import logging

# from app.database import SessionLocal
# from app.models.experiment import Experiment, ExperimentStatus
# from app.core.activity import log_activity   # <-- added import

# logger = logging.getLogger("experimentx.scheduler")


# def _run_scheduled_transitions():
#     db = SessionLocal()
#     try:
#         now = datetime.utcnow()

#         # ── draft → running ──
#         to_start = db.query(Experiment).filter(
#             Experiment.status == ExperimentStatus.draft,
#             Experiment.scheduled_start_at.isnot(None),
#             Experiment.scheduled_start_at <= now,
#         ).all()

#         for exp in to_start:
#             old_status = exp.status
#             exp.status = ExperimentStatus.running
#             db.commit()  # commit this single change
#             db.refresh(exp)

#             # Log the auto‑start
#             log_activity(
#                 db,
#                 None,  # actor_user_id = None (requires nullable column)
#                 "experiment.transitioned",
#                 exp.id,
#                 {"from": old_status.value, "to": exp.status.value}
#             )
#             logger.info(f"Auto-started experiment {exp.id} ({exp.name})")

#         # ── running → completed ──
#         to_complete = db.query(Experiment).filter(
#             Experiment.status == ExperimentStatus.running,
#             Experiment.scheduled_end_at.isnot(None),
#             Experiment.scheduled_end_at <= now,
#         ).all()

#         for exp in to_complete:
#             old_status = exp.status
#             exp.status = ExperimentStatus.completed
#             db.commit()
#             db.refresh(exp)

#             # Log the auto‑complete
#             log_activity(
#                 db,
#                 None,
#                 "experiment.transitioned",
#                 exp.id,
#                 {"from": old_status.value, "to": exp.status.value}
#             )
#             logger.info(f"Auto-completed experiment {exp.id} ({exp.name})")

#     except Exception:
#         logger.exception("Scheduler transition run failed")
#         db.rollback()
#     finally:
#         db.close()


# _scheduler = BackgroundScheduler()


# def start_scheduler():
#     _scheduler.add_job(
#         _run_scheduled_transitions,
#         "interval",
#         seconds=60,
#         id="experiment_status_transitions",
#         replace_existing=True,
#     )
#     _scheduler.start()
#     logger.info("Experiment scheduler started (checking every 60s)")


# def stop_scheduler():
#     _scheduler.shutdown(wait=False)





















































# """
# Background jobs:
# 1. Auto-transitions experiment status based on scheduled times (every 60s).
# 2. Recomputes traffic allocation for experiments in bandit mode (every 15min).
# Uses UTC internally — scheduled_start_at/end_at should always be stored as
# UTC datetimes.
# """
# from apscheduler.schedulers.background import BackgroundScheduler
# from datetime import datetime
# import logging

# from app.database import SessionLocal
# from app.models.experiment import Experiment, ExperimentStatus
# from app.models.variant import Variant
# from app.models.visitor import Visitor
# from app.models.conversion import Conversion
# from app.core.activity import log_activity
# from app.core.bandit import thompson_sample_allocation

# logger = logging.getLogger("experimentx.scheduler")


# def _run_scheduled_transitions():
#     db = SessionLocal()
#     try:
#         now = datetime.utcnow()

#         # ── draft → running ──
#         to_start = db.query(Experiment).filter(
#             Experiment.status == ExperimentStatus.draft,
#             Experiment.scheduled_start_at.isnot(None),
#             Experiment.scheduled_start_at <= now,
#         ).all()

#         for exp in to_start:
#             old_status = exp.status
#             exp.status = ExperimentStatus.running
#             db.commit()
#             db.refresh(exp)
#             log_activity(db, None, "experiment.transitioned", exp.id,
#                          {"from": old_status.value, "to": exp.status.value})
#             logger.info(f"Auto-started experiment {exp.id} ({exp.name})")

#         # ── running → completed ──
#         to_complete = db.query(Experiment).filter(
#             Experiment.status == ExperimentStatus.running,
#             Experiment.scheduled_end_at.isnot(None),
#             Experiment.scheduled_end_at <= now,
#         ).all()

#         for exp in to_complete:
#             old_status = exp.status
#             exp.status = ExperimentStatus.completed
#             db.commit()
#             db.refresh(exp)
#             log_activity(db, None, "experiment.transitioned", exp.id,
#                          {"from": old_status.value, "to": exp.status.value})
#             logger.info(f"Auto-completed experiment {exp.id} ({exp.name})")

#     except Exception:
#         logger.exception("Scheduler transition run failed")
#         db.rollback()
#     finally:
#         db.close()


# def _run_bandit_reallocation():
#     db = SessionLocal()
#     try:
#         experiments = db.query(Experiment).filter(
#             Experiment.status == ExperimentStatus.running,
#             Experiment.allocation_mode == "bandit",
#         ).all()

#         for exp in experiments:
#             variants = db.query(Variant).filter(Variant.experiment_id == exp.id).all()
#             if len(variants) < 2:
#                 continue

#             variants_data = []
#             for v in variants:
#                 visitors = db.query(Visitor).filter(Visitor.variant_id == v.id).count()
#                 conversions = db.query(Conversion).filter(Conversion.variant_id == v.id).count()
#                 variants_data.append({"id": v.id, "label": v.label, "visitors": visitors, "conversions": conversions})

#             result = thompson_sample_allocation(variants_data)
#             if "error" in result:
#                 logger.warning(f"Bandit reallocation skipped for {exp.id}: {result['error']}")
#                 continue

#             label_to_id = {vd["label"]: vd["id"] for vd in variants_data}
#             for alloc in result["allocations"]:
#                 variant = db.query(Variant).filter(Variant.id == label_to_id[alloc["label"]]).first()
#                 variant.traffic_split = alloc["allocation_pct"] / 100
#             db.commit()
#             logger.info(f"Bandit reallocated traffic for experiment {exp.id} ({exp.name})")

#     except Exception:
#         logger.exception("Bandit reallocation run failed")
#         db.rollback()
#     finally:
#         db.close()


# _scheduler = BackgroundScheduler()


# def start_scheduler():
#     _scheduler.add_job(
#         _run_scheduled_transitions,
#         "interval",
#         seconds=60,
#         id="experiment_status_transitions",
#         replace_existing=True,
#     )
#     _scheduler.add_job(
#         _run_bandit_reallocation,
#         "interval",
#         minutes=15,
#         id="bandit_reallocation",
#         replace_existing=True,
#     )
#     _scheduler.start()
#     logger.info("Experiment scheduler started (transitions every 60s, bandit every 15min)")


# def stop_scheduler():
#     _scheduler.shutdown(wait=False)












































"""
Background jobs:
1. Auto-transitions experiment status based on scheduled times (every 60s).
2. Recomputes traffic allocation for experiments in bandit mode (every 15min).
Uses UTC internally — scheduled_start_at/end_at should always be stored as
UTC datetimes.
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

        # ── draft → running ──
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

        # ── running → completed ──
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
            Experiment.allocation_mode == "bandit",   # new field, see below
        ).all()

        for exp in experiments:
            # Build data for Thompson sampling using the relationship
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

            # Update each variant's traffic split
            for alloc in result["allocations"]:
                # Find the variant id from the label
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


# ----- Scheduler setup -----
_scheduler = BackgroundScheduler()


def start_scheduler():
    _scheduler.add_job(
        _run_scheduled_transitions,
        "interval",
        seconds=60,
        id="experiment_status_transitions",
        replace_existing=True,
    )
    _scheduler.add_job(
        _run_bandit_reallocation,
        "interval",
        minutes=15,
        id="bandit_reallocation",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info("Experiment scheduler started (transitions every 60s, bandit every 15min)")


def stop_scheduler():
    _scheduler.shutdown(wait=False)