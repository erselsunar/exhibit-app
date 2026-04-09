from pydantic import BaseModel

class CityResponse(BaseModel):
    id: int
    name: str
    state_id: int
    country_id: int

    class Config:
        from_attributes = True