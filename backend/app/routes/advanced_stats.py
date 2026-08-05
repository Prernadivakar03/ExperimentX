from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.experiment import Experiment
from app.models.visitor import Visitor
from app.models.conversion import Conversion
from app.core.bayesian import bayesian_test
from app.core.sequential import msprt_multi_variant
from app.core.cuped import cuped_compare_variants
from app.core.rbac import check_org_access
from app.models.organization import MemberRole

router = APIRouter(prefix="/advanced-stats", tags=["advanced-stats"])


def _get_experiment_authorized(experiment_id: UUID, user: User, db: Session) -> Experiment:
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    check_org_access(experiment.organization_id, user, db, MemberRole.viewer)
    return experiment


def _variant_counts(experiment: Experiment, db: Session) -> list[dict]:
    out = []
    for v in experiment.variants:
        visitors = db.query(Visitor).filter(Visitor.variant_id == v.id).count()
        conversions = db.query(Conversion).filter(Conversion.variant_id == v.id).count()
        out.append({"label": v.label, "visitors": visitors, "conversions": conversions})
    return out


@router.get("/{experiment_id}/bayesian")
def get_bayesian(experiment_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    experiment = _get_experiment_authorized(experiment_id, current_user, db)
    return bayesian_test(_variant_counts(experiment, db))


@router.get("/{experiment_id}/sequential")
def get_sequential(experiment_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    experiment = _get_experiment_authorized(experiment_id, current_user, db)
    variants = _variant_counts(experiment, db)
    if len(variants) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 variants")
    return msprt_multi_variant(variants[0], variants[1:])