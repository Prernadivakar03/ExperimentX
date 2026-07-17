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

# logger = logging.getLogger("experimentx.scheduler")


# def _run_scheduled_transitions():
#     db = SessionLocal()
#     try:
#         now = datetime.utcnow()

#         # draft -> running
#         to_start = db.query(Experiment).filter(
#             Experiment.status == ExperimentStatus.draft,
#             Experiment.scheduled_start_at.isnot(None),
#             Experiment.scheduled_start_at <= now,
#         ).all()
#         for exp in to_start:
#             exp.status = ExperimentStatus.running
#             logger.info(f"Auto-started experiment {exp.id} ({exp.name})")

#         # running -> completed
#         to_complete = db.query(Experiment).filter(
#             Experiment.status == ExperimentStatus.running,
#             Experiment.scheduled_end_at.isnot(None),
#             Experiment.scheduled_end_at <= now,
#         ).all()
#         for exp in to_complete:
#             exp.status = ExperimentStatus.completed
#             logger.info(f"Auto-completed experiment {exp.id} ({exp.name})")

#         if to_start or to_complete:
#             db.commit()
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



# # Inside _run_scheduled_transitions, after committing the transition

# # ── Log automated state transition ──
# log_activity(
#     db,
#     SYSTEM_USER_ID,        # or None if you made the column nullable
#     "experiment.transitioned",
#     experiment.id,
#     {"from": old_status.value, "to": new_status.value}
# )





































"""
Background job that auto-transitions experiment status based on scheduled times.
Runs every 60 seconds. Uses UTC internally — scheduled_start_at/end_at should
always be stored as UTC datetimes (convert from the experiment's timezone at
the point the frontend submits the form, not here).
"""
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import logging

from app.database import SessionLocal
from app.models.experiment import Experiment, ExperimentStatus
from app.core.activity import log_activity   # <-- added import

logger = logging.getLogger("experimentx.scheduler")


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
            db.commit()  # commit this single change
            db.refresh(exp)

            # Log the auto‑start
            log_activity(
                db,
                None,  # actor_user_id = None (requires nullable column)
                "experiment.transitioned",
                exp.id,
                {"from": old_status.value, "to": exp.status.value}
            )
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

            # Log the auto‑complete
            log_activity(
                db,
                None,
                "experiment.transitioned",
                exp.id,
                {"from": old_status.value, "to": exp.status.value}
            )
            logger.info(f"Auto-completed experiment {exp.id} ({exp.name})")

    except Exception:
        logger.exception("Scheduler transition run failed")
        db.rollback()
    finally:
        db.close()


_scheduler = BackgroundScheduler()


def start_scheduler():
    _scheduler.add_job(
        _run_scheduled_transitions,
        "interval",
        seconds=60,
        id="experiment_status_transitions",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info("Experiment scheduler started (checking every 60s)")


def stop_scheduler():
    _scheduler.shutdown(wait=False)