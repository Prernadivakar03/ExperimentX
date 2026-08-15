
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from uuid import UUID
# from app.core.activity import log_activity
# from app.core.rbac import check_org_access, get_primary_org_id, get_active_org_id

# from app.database import get_db
# from app.dependencies import get_current_user
# from app.models.user import User
# from app.models.organization import MemberRole
# from app.models.experiment import Experiment, ExperimentStatus
# from app.models.variant import Variant
# from app.models.activity_log import ActivityLog  # was missing — get_timeline used this unimported
# from app.schemas.experiment_schema import (
#     ExperimentCreate,
#     ExperimentUpdate,
#     ExperimentResponse,
# )

# router = APIRouter(prefix="/experiments", tags=["experiments"])


# # ── Create ────────────────────────────────────────────────────────────────────

# # @router.post("/", response_model=ExperimentResponse, status_code=status.HTTP_201_CREATED)
# # def create_experiment(
# #     payload: ExperimentCreate,
# #     db: Session = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# # ):
# #     org_id = get_primary_org_id(current_user, db)
# #     check_org_access(org_id, current_user, db, minimum_role=MemberRole.editor)

# #     experiment = Experiment(
# #         owner_id=current_user.id,
# #         organization_id=org_id,
# #         name=payload.name,
# #         description=payload.description,
# #         goal=payload.goal,
# #         planned_duration_days=payload.planned_duration_days,
# #         target_sample_size=payload.target_sample_size,
# #         scheduled_start_at=payload.scheduled_start_at,
# #         scheduled_end_at=payload.scheduled_end_at,
# #         timezone=payload.timezone,
# #         status=ExperimentStatus.draft,
# #     )
# #     db.add(experiment)
# #     db.flush()

# #     for v in payload.variants:
# #         variant = Variant(
# #             experiment_id=experiment.id,
# #             name=v.name,
# #             label=v.label,
# #             description=v.description,
# #             traffic_split=v.traffic_split,
# #         )
# #         db.add(variant)

# #     db.commit()
# #     db.refresh(experiment)

# #     log_activity(
# #         db,
# #         current_user.id,
# #         "experiment.created",
# #         experiment.id,
# #         {"name": experiment.name}
# #     )

# #     return experiment


# # # ── List ──────────────────────────────────────────────────────────────────────

# # @router.get("/", response_model=list[ExperimentResponse])
# # def list_experiments(
# #     db: Session = Depends(get_db),
# #     current_user: User = Depends(get_current_user),
# # ):
# #     # List everything in orgs the user is an accepted member of — not just
# #     # what they personally created. This is the actual behavior change from
# #     # solo ownership to team visibility.
# #     from app.models.organization import Membership

# #     org_ids = [
# #         m.organization_id for m in
# #         db.query(Membership).filter(
# #             Membership.user_id == current_user.id,
# #             Membership.accepted_at.isnot(None),
# #         ).all()
# #     ]

# #     return (
# #         db.query(Experiment)
# #         .filter(Experiment.organization_id.in_(org_ids))
# #         .order_by(Experiment.created_at.desc())
# #         .all()
# #     )

# @router.post("/", response_model=ExperimentResponse, status_code=status.HTTP_201_CREATED)
# def create_experiment(
#     payload: ExperimentCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     org_id: UUID = Depends(get_active_org_id),
# ):
#     check_org_access(org_id, current_user, db, minimum_role=MemberRole.editor)

#     experiment = Experiment(
#         owner_id=current_user.id,
#         organization_id=org_id,
#         name=payload.name,
#         description=payload.description,
#         goal=payload.goal,
#         planned_duration_days=payload.planned_duration_days,
#         target_sample_size=payload.target_sample_size,
#         scheduled_start_at=payload.scheduled_start_at,
#         scheduled_end_at=payload.scheduled_end_at,
#         timezone=payload.timezone,
#         status=ExperimentStatus.draft,
#     )
#     db.add(experiment)
#     db.flush()

#     for v in payload.variants:
#         variant = Variant(
#             experiment_id=experiment.id,
#             name=v.name, label=v.label, description=v.description,
#             traffic_split=v.traffic_split,
#         )
#         db.add(variant)

#     db.commit()
#     db.refresh(experiment)
#     log_activity(db, current_user.id, "experiment.created", experiment.id, {"name": experiment.name})
#     return experiment


# @router.get("/", response_model=list[ExperimentResponse])
# def list_experiments(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
#     org_id: UUID = Depends(get_active_org_id),
# ):
#     check_org_access(org_id, current_user, db, minimum_role=MemberRole.viewer)
#     return (
#         db.query(Experiment)
#         .filter(Experiment.organization_id == org_id)
#         .order_by(Experiment.created_at.desc())
#         .all()
#     )

# # ── Get one ───────────────────────────────────────────────────────────────────

# @router.get("/{experiment_id}", response_model=ExperimentResponse)
# def get_experiment(
#     experiment_id: UUID,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     experiment = _get_authorized(experiment_id, current_user, db, MemberRole.viewer)
#     return experiment


# # ── Update ────────────────────────────────────────────────────────────────────

# @router.patch("/{experiment_id}", response_model=ExperimentResponse)
# def update_experiment(
#     experiment_id: UUID,
#     payload: ExperimentUpdate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     experiment = _get_authorized(experiment_id, current_user, db, MemberRole.editor)

#     changes = payload.model_dump(exclude_unset=True)

#     for field, value in changes.items():
#         setattr(experiment, field, value)

#     db.commit()
#     db.refresh(experiment)

#     log_activity(
#         db,
#         current_user.id,
#         "experiment.updated",
#         experiment.id,
#         {"name": experiment.name, "changes": changes}
#     )

#     return experiment


# @router.get("/{experiment_id}/timeline")
# def get_timeline(
#     experiment_id: UUID,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     experiment = _get_authorized(experiment_id, current_user, db, MemberRole.viewer)

#     logs = db.query(ActivityLog).filter(
#         ActivityLog.experiment_id == experiment.id,
#     ).order_by(ActivityLog.timestamp.asc()).all()

#     return [
#         {"action": log.action, "details": log.details, "timestamp": log.timestamp, "actor_user_id": log.actor_user_id}
#         for log in logs
#     ]


# # ── Delete ────────────────────────────────────────────────────────────────────

# @router.delete("/{experiment_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_experiment(
#     experiment_id: UUID,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     # Deletion requires admin — the highest bar, since it's irreversible and
#     # wipes an experiment's whole history for the team, not just the creator.
#     experiment = _get_authorized(experiment_id, current_user, db, MemberRole.admin)

#     log_activity(
#         db,
#         current_user.id,
#         "experiment.deleted",
#         experiment.id,
#         {"name": experiment.name, "status": experiment.status.value}
#     )

#     db.delete(experiment)
#     db.commit()


# # ── Helper ────────────────────────────────────────────────────────────────────

# def _get_authorized(
#     experiment_id: UUID,
#     user: User,
#     db: Session,
#     minimum_role: MemberRole,
# ) -> Experiment:
#     """
#     Fetch an experiment and verify the user has at least `minimum_role` in
#     its organization. Replaces the old _get_owned, which only checked
#     owner_id — that meant teammates could never see each other's
#     experiments even inside the same org.
#     """
#     experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()

#     if not experiment:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Experiment not found",
#         )

#     check_org_access(experiment.organization_id, user, db, minimum_role)
#     return experiment












































































































from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.activity import log_activity
from app.core.rbac import check_org_access, get_primary_org_id, get_active_org_id

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.organization import MemberRole
from app.models.experiment import Experiment, ExperimentStatus
from app.models.variant import Variant
from app.models.activity_log import ActivityLog  # was missing — get_timeline used this unimported
from app.schemas.experiment_schema import (
    ExperimentCreate,
    ExperimentUpdate,
    ExperimentResponse,
)

router = APIRouter(prefix="/experiments", tags=["experiments"])


# ── Create ────────────────────────────────────────────────────────────────────

@router.post("/", response_model=ExperimentResponse, status_code=status.HTTP_201_CREATED)
def create_experiment(
    payload: ExperimentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    org_id: UUID = Depends(get_active_org_id),
):
    check_org_access(org_id, current_user, db, minimum_role=MemberRole.editor)

    experiment = Experiment(
        owner_id=current_user.id,
        organization_id=org_id,
        name=payload.name,
        description=payload.description,
        goal=payload.goal,
        planned_duration_days=payload.planned_duration_days,
        target_sample_size=payload.target_sample_size,
        scheduled_start_at=payload.scheduled_start_at,
        scheduled_end_at=payload.scheduled_end_at,
        timezone=payload.timezone,
        status=ExperimentStatus.draft,
    )
    db.add(experiment)
    db.flush()

    for v in payload.variants:
        variant = Variant(
            experiment_id=experiment.id,
            name=v.name, label=v.label, description=v.description,
            traffic_split=v.traffic_split,
        )
        db.add(variant)

    db.commit()
    db.refresh(experiment)
    log_activity(db, current_user.id, "experiment.created", experiment.id, {"name": experiment.name})
    return experiment


# ── List ──────────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[ExperimentResponse])
def list_experiments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    org_id: UUID = Depends(get_active_org_id),
):
    check_org_access(org_id, current_user, db, minimum_role=MemberRole.viewer)
    return (
        db.query(Experiment)
        .filter(Experiment.organization_id == org_id)
        .order_by(Experiment.created_at.desc())
        .all()
    )

# ── Get one ───────────────────────────────────────────────────────────────────

@router.get("/{experiment_id}", response_model=ExperimentResponse)
def get_experiment(
    experiment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = _get_authorized(experiment_id, current_user, db, MemberRole.viewer)
    return experiment


# ── Update ────────────────────────────────────────────────────────────────────

@router.patch("/{experiment_id}", response_model=ExperimentResponse)
def update_experiment(
    experiment_id: UUID,
    payload: ExperimentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = _get_authorized(experiment_id, current_user, db, MemberRole.editor)

    changes = payload.model_dump(exclude_unset=True)

    for field, value in changes.items():
        setattr(experiment, field, value)

    db.commit()
    db.refresh(experiment)

    log_activity(
        db,
        current_user.id,
        "experiment.updated",
        experiment.id,
        {"name": experiment.name, "changes": changes}
    )

    return experiment


@router.get("/{experiment_id}/timeline")
def get_timeline(
    experiment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    experiment = _get_authorized(experiment_id, current_user, db, MemberRole.viewer)

    logs = db.query(ActivityLog).filter(
        ActivityLog.experiment_id == experiment.id,
    ).order_by(ActivityLog.timestamp.asc()).all()

    return [
        {"action": log.action, "details": log.details, "timestamp": log.timestamp, "actor_user_id": log.actor_user_id}
        for log in logs
    ]


# ── Delete ────────────────────────────────────────────────────────────────────

@router.delete("/{experiment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experiment(
    experiment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Deletion requires admin — the highest bar, since it's irreversible and
    # wipes an experiment's whole history for the team, not just the creator.
    experiment = _get_authorized(experiment_id, current_user, db, MemberRole.admin)

    log_activity(
        db,
        current_user.id,
        "experiment.deleted",
        experiment.id,
        {"name": experiment.name, "status": experiment.status.value}
    )

    db.delete(experiment)
    db.commit()


# ── Helper ────────────────────────────────────────────────────────────────────

def _get_authorized(
    experiment_id: UUID,
    user: User,
    db: Session,
    minimum_role: MemberRole,
) -> Experiment:
    """
    Fetch an experiment and verify the user has at least `minimum_role` in
    its organization. Replaces the old _get_owned, which only checked
    owner_id — that meant teammates could never see each other's
    experiments even inside the same org.
    """
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()

    if not experiment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiment not found",
        )

    check_org_access(experiment.organization_id, user, db, minimum_role)
    return experiment