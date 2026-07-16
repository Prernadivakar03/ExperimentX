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

logger = logging.getLogger("experimentx.scheduler")


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
            exp.status = ExperimentStatus.running
            logger.info(f"Auto-started experiment {exp.id} ({exp.name})")

        # running -> completed
        to_complete = db.query(Experiment).filter(
            Experiment.status == ExperimentStatus.running,
            Experiment.scheduled_end_at.isnot(None),
            Experiment.scheduled_end_at <= now,
        ).all()
        for exp in to_complete:
            exp.status = ExperimentStatus.completed
            logger.info(f"Auto-completed experiment {exp.id} ({exp.name})")

        if to_start or to_complete:
            db.commit()
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