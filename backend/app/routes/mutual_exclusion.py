from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.mutual_exclusion import MutualExclusionGroup, MutualExclusionMembership
from app.models.experiment import Experiment
from app.schemas.mutual_exclusion_schema import GroupCreate, GroupResponse

router = APIRouter(prefix="/mutual-exclusion-groups", tags=["mutual-exclusion"])


@router.post("/", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
def create_group(
    payload: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # verify every experiment belongs to this user and isn't already in another group
    for m in payload.memberships:
        experiment = db.query(Experiment).filter(
            Experiment.id == m.experiment_id, Experiment.owner_id == current_user.id,
        ).first()
        if not experiment:
            raise HTTPException(status_code=404, detail=f"Experiment {m.experiment_id} not found")

        already_in_group = db.query(MutualExclusionMembership).filter(
            MutualExclusionMembership.experiment_id == m.experiment_id,
        ).first()
        if already_in_group:
            raise HTTPException(
                status_code=409,
                detail=f"Experiment {m.experiment_id} is already in a mutual exclusion group",
            )

    group = MutualExclusionGroup(
        owner_id=current_user.id, name=payload.name, description=payload.description,
    )
    db.add(group)
    db.flush()

    for m in payload.memberships:
        db.add(MutualExclusionMembership(
            group_id=group.id, experiment_id=m.experiment_id, allocation_pct=m.allocation_pct,
        ))

    db.commit()
    db.refresh(group)
    return group


@router.get("/", response_model=list[GroupResponse])
def list_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(MutualExclusionGroup).filter(
        MutualExclusionGroup.owner_id == current_user.id,
    ).all()


@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_group(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = db.query(MutualExclusionGroup).filter(
        MutualExclusionGroup.id == group_id, MutualExclusionGroup.owner_id == current_user.id,
    ).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    db.delete(group)
    db.commit()