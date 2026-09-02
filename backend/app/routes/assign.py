# backend/app/routes/assign.py
import hashlib
from typing import Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

from app.database import get_db
from app.models.experiment import Experiment, ExperimentStatus
from app.models.variant import Variant
from app.models.visitor import Visitor
from app.models.conversion import Conversion
from app.models.organization import Organization
from app.models.mutual_exclusion import MutualExclusionGroup, MutualExclusionMembership
from app.routes.holdout import check_holdout
from app.core.geoip import get_country_from_ip, get_client_ip
from app.dependencies import get_org_from_api_key
from app.core.limiter import rate_limit_by_ip
from app.schemas.assign_schema import AssignRequest, AssignResponse, IdentifyRequest, IdentifyResponse

router = APIRouter(tags=["tracking"])


def _find_existing_visitor(experiment_id: UUID, fingerprint: str, user_id: Optional[str], db: Session) -> Optional[Visitor]:
    """
    Resolves a visitor's existing assignment for this experiment. Checks
    user_id FIRST (so a returning logged-in user gets the same variant on
    any device), then falls back to fingerprint. If a fingerprint-only row
    is found and the caller now knows the user_id, stitch it onto that row
    instead of creating a second assignment.
    """
    if user_id:
        by_user = db.query(Visitor).filter(
            Visitor.experiment_id == experiment_id, Visitor.user_id == user_id,
        ).first()
        if by_user:
            return by_user

    by_fingerprint = db.query(Visitor).filter(
        Visitor.experiment_id == experiment_id, Visitor.fingerprint == fingerprint,
    ).first()

    if by_fingerprint and user_id and not by_fingerprint.user_id:
        by_fingerprint.user_id = user_id
        by_fingerprint.identified_at = datetime.utcnow()
        db.commit()
        db.refresh(by_fingerprint)

    return by_fingerprint


def _pick_variant(experiment_id: UUID, fingerprint: str, db: Session) -> Variant:
    """Deterministic assignment via hash — same fingerprint + experiment
    always maps to the same bucket, so re-running this after a race-losing
    insert reproduces the SAME variant rather than re-rolling one."""
    hash_input = f"{fingerprint}:{experiment_id}"
    hash_int = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
    bucket = (hash_int % 10000) / 10000.0   # value between 0.0 and 1.0

    variants = (
        db.query(Variant)
        .filter(Variant.experiment_id == experiment_id)
        .order_by(Variant.label)
        .all()
    )

    assigned_variant = None
    cumulative = 0.0
    for variant in variants:
        cumulative += variant.traffic_split
        if bucket < cumulative:
            assigned_variant = variant
            break

    # Fallback to last variant if float rounding misses
    return assigned_variant or variants[-1]


def _compute_pre_experiment_covariate(fingerprint: str, user_id: Optional[str], before: datetime, db: Session) -> Optional[float]:
    """
    CUPED needs a pre-experiment signal for each visitor. We use their
    historical conversion rate across OTHER experiments before this
    assignment, keyed by user_id when known (more reliable across
    devices), else fingerprint. Needs at least 2 prior visits to be a
    meaningful signal — most first-time-ever visitors won't have one,
    which is expected and fine; CUPED simply doesn't help for them.
    """
    identity_filter = (Visitor.user_id == user_id) if user_id else (Visitor.fingerprint == fingerprint)
    prior_visitors = db.query(Visitor).filter(
        identity_filter, Visitor.created_at < before,
    ).all()

    if len(prior_visitors) < 2:
        return None

    prior_ids = [v.id for v in prior_visitors]
    converted_count = (
        db.query(func.count(func.distinct(Conversion.visitor_id)))
        .filter(Conversion.visitor_id.in_(prior_ids))
        .scalar() or 0
    )
    return converted_count / len(prior_visitors)


@router.post("/assign", response_model=AssignResponse)
def assign_variant(
    payload: AssignRequest,
    request: Request,
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_by_ip("60/minute")),
    organization: Organization = Depends(get_org_from_api_key),
):
    """
    Call this when a visitor lands on an experiment page.
    If the visitor (identified by fingerprint) has been seen before,
    return their existing assignment so they always see the same variant.
    If new, deterministically assign them using a hash so the split
    is stable and reproducible — not random each call.

    Requires a valid X-API-Key header (see app/dependencies.py). The key's
    organization must own the experiment being requested — this stops one
    org's API key from being used to read/write another org's experiments.
    """

    # 1. Validate experiment exists, is running, and belongs to this org
    experiment = db.query(Experiment).filter(
        Experiment.id == payload.experiment_id,
        Experiment.status == ExperimentStatus.running,
    ).first()

    if not experiment or experiment.organization_id != organization.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiment not found or not running",
        )

    # ── Holdout check — runs first; holdout beats everything else ──────────
    holdout_hit = check_holdout(experiment.owner_id, payload.fingerprint, db)
    if holdout_hit:
        return AssignResponse(
            eligible=False,
            already_assigned=False,
            reason="Visitor is in the account's holdout group — excluded from all experiments",
        )
    # ── End holdout check ────────────────────────────────────────────────────

    # ── Mutual exclusion check ──────────────────────────────────────────────
    membership = db.query(MutualExclusionMembership).filter(
        MutualExclusionMembership.experiment_id == payload.experiment_id,
    ).first()

    if membership:
        group_memberships = (
            db.query(MutualExclusionMembership)
            .filter(MutualExclusionMembership.group_id == membership.group_id)
            .order_by(MutualExclusionMembership.experiment_id)  # stable, deterministic order
            .all()
        )

        group_hash_input = f"{payload.fingerprint}:{membership.group_id}"
        group_hash_int = int(hashlib.md5(group_hash_input.encode()).hexdigest(), 16)
        group_bucket = (group_hash_int % 10000) / 100.0  # 0.0 - 100.0

        cumulative = 0.0
        owning_experiment_id = None
        for gm in group_memberships:
            cumulative += gm.allocation_pct
            if group_bucket < cumulative:
                owning_experiment_id = gm.experiment_id
                break

        if owning_experiment_id != payload.experiment_id:
            return AssignResponse(
                eligible=False,
                already_assigned=False,
                reason="Visitor is allocated to a different experiment in this mutual exclusion group",
            )
    # ── End mutual exclusion check ──────────────────────────────────────────

    # 2. Check if visitor already assigned (by user_id first, then fingerprint)
    existing = _find_existing_visitor(payload.experiment_id, payload.fingerprint, payload.user_id, db)

    if existing:
        return AssignResponse(
            eligible=True,
            visitor_id=existing.id,
            variant_id=existing.variant_id,
            variant_label=existing.variant.label,
            variant_name=existing.variant.name,
            already_assigned=True,
        )

    # 3. Deterministic assignment via hash
    assigned_variant = _pick_variant(payload.experiment_id, payload.fingerprint, db)

    client_ip = get_client_ip(request)
    country = get_country_from_ip(client_ip)

    # 4. Persist the assignment. Two simultaneous requests for the same
    # fingerprint can both reach this point having seen "no existing row" —
    # the DB-level unique constraint on (experiment_id, fingerprint) is what
    # actually prevents the duplicate, not this application-level check.
    visitor = Visitor(
        experiment_id=payload.experiment_id,
        variant_id=assigned_variant.id,
        fingerprint=payload.fingerprint,
        device=payload.device,
        browser=payload.browser,
        traffic_source=payload.traffic_source,
        is_returning=payload.is_returning,
        country=country,
        user_id=payload.user_id,
        identified_at=(datetime.utcnow() if payload.user_id else None),
        pre_experiment_covariate=_compute_pre_experiment_covariate(payload.fingerprint, payload.user_id, datetime.utcnow(), db),
    )
    db.add(visitor)
    try:
        db.commit()
    except IntegrityError:
        # We lost the race — someone else's request for this exact
        # fingerprint committed first. Roll back our attempted insert and
        # return THEIR row so the visitor still gets a single, consistent
        # variant instead of a 500 or a duplicate assignment.
        db.rollback()
        existing = _find_existing_visitor(payload.experiment_id, payload.fingerprint, payload.user_id, db)
        if not existing:
            # Vanishingly unlikely (row would have to be deleted between
            # the failed insert and this re-query), but don't silently
            # swallow it if it somehow happens.
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Could not assign visitor due to a concurrent request; please retry",
            )
        return AssignResponse(
            eligible=True,
            visitor_id=existing.id,
            variant_id=existing.variant_id,
            variant_label=existing.variant.label,
            variant_name=existing.variant.name,
            already_assigned=True,
        )

    db.refresh(visitor)

    return AssignResponse(
        eligible=True,
        visitor_id=visitor.id,
        variant_id=assigned_variant.id,
        variant_label=assigned_variant.label,
        variant_name=assigned_variant.name,
        already_assigned=False,
    )


@router.post("/identify", response_model=IdentifyResponse)
def identify_visitor(
    payload: IdentifyRequest,
    db: Session = Depends(get_db),
    _rl=Depends(rate_limit_by_ip("60/minute")),
    organization: Organization = Depends(get_org_from_api_key),
):
    """
    Call this once, right after login. Links every fingerprint-only Visitor
    row across this org's experiments that doesn't yet have a user_id to
    the given user_id, so pre-login and post-login traffic count as one
    person. Does NOT merge or reassign variants — if this user_id is
    already linked to a DIFFERENT variant in the same experiment (e.g. they
    logged in on a second device with its own fingerprint), that's
    reported back as a conflict instead of being silently overwritten.
    """
    fingerprint_visitors = (
        db.query(Visitor)
        .join(Experiment, Visitor.experiment_id == Experiment.id)
        .filter(
            Experiment.organization_id == organization.id,
            Visitor.fingerprint == payload.fingerprint,
            Visitor.user_id.is_(None),
        )
        .all()
    )

    conflicts = []
    linked = 0
    for visitor in fingerprint_visitors:
        conflicting = db.query(Visitor).filter(
            Visitor.experiment_id == visitor.experiment_id,
            Visitor.user_id == payload.user_id,
            Visitor.id != visitor.id,
        ).first()

        if conflicting and conflicting.variant_id != visitor.variant_id:
            conflicts.append({
                "experiment_id": str(visitor.experiment_id),
                "fingerprint_variant_id": str(visitor.variant_id),
                "existing_user_variant_id": str(conflicting.variant_id),
            })
            continue  # don't stitch — would corrupt the existing assignment

        visitor.user_id = payload.user_id
        visitor.identified_at = datetime.utcnow()
        linked += 1

    db.commit()
    return IdentifyResponse(linked=linked, conflicts=conflicts)