from pydantic import BaseModel

class BoothCreate(BaseModel):
    booth_id: str
    expo_id: int
    partner_id: int | None = None
    dimension: str | None = None
    uom: str | None = None

class BoothResponse(BaseModel):
    id: int
    booth_id: str
    expo_id: int
    partner_id: int | None
    dimension: str | None
    uom: str | None

    class Config:
        from_attributes = True