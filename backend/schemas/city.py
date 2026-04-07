from pydantic import BaseModel

class CityCreate(BaseModel):
    city_name: str

class CityResponse(BaseModel):
    id: int
    city_name: str

    class Config:
        from_attributes = True