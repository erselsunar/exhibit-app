from pydantic import BaseModel

class CountryResponse(BaseModel):
    id : int
    name: str
    iso2 : str
    currency : str
    currency_name : str

    class Config:
        from_attributes: True