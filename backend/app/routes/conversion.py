from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.conversion import Conversion
from app.schemas.conversion_schema import ConversionCreate

router = APIRouter()


@router.post("/track-conversion")
def track_conversion(
    conversion: ConversionCreate,
    db: Session = Depends(get_db)
):

    new_conversion = Conversion(
        user_id=conversion.user_id
    )

    db.add(new_conversion)
    db.commit()

    return {
        "message": "Conversion Tracked Successfully"
    }