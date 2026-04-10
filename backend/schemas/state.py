from pydantic import BaseModel

class StateResponse(BaseModel):
    id : int
    name : str
    country_id : int
    country_code : str
    iso2 : str
    type : str

    class Config:
        from_attributes : True