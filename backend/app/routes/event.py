

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.event import Event
from app.models.conversion import Conversion
from app.models.visitor import Visitor
from app.models.experiment import Experiment
from app.schemas.event_schema import EventCreate, ConversionCreate

router = APIRouter(tags=["tracking"])


@router.post("/track-event", status_code=status.HTTP_201_CREATED)
def track_event(payload: EventCreate, db: Session = Depends(get_db)):

    # Validate the visitor belongs to this experiment
    visitor = db.query(Visitor).filter(
        Visitor.id == payload.visitor_id,
        Visitor.experiment_id == payload.experiment_id,
    ).first()

    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visitor not found for this experiment",
        )

    event = Event(
        experiment_id=payload.experiment_id,
        variant_id=payload.variant_id,
        visitor_id=payload.visitor_id,
        event_type=payload.event_type,
    )
    db.add(event)
    db.commit()

    return {"message": "Event tracked"}


@router.post("/track-conversion", status_code=status.HTTP_201_CREATED)
def track_conversion(payload: ConversionCreate, db: Session = Depends(get_db)):

    visitor = db.query(Visitor).filter(
        Visitor.id == payload.visitor_id,
        Visitor.experiment_id == payload.experiment_id,
    ).first()

    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visitor not found for this experiment",
        )

    # Validate goal matches the experiment
    experiment = db.query(Experiment).filter(
        Experiment.id == payload.experiment_id
    ).first()

    if experiment.goal != payload.goal:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Goal '{payload.goal}' does not match experiment goal '{experiment.goal}'",
        )

    conversion = Conversion(
        experiment_id=payload.experiment_id,
        variant_id=payload.variant_id,
        visitor_id=payload.visitor_id,
        goal=payload.goal,
    )
    db.add(conversion)
    db.commit()

    return {"message": "Conversion tracked"}