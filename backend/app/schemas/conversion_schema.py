from pydantic import BaseModel


class ConversionCreate(BaseModel):
    user_id: str