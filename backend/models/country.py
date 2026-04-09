from sqlalchemy import Column, BigInteger, String, ForeignKey
from database.base import Base

class Country(Base):
    __tablename__ = "countries"

    id = Column(BigInteger, primary_key=True)
    name = Column(String(100), nullable=False)

    iso2 = Column(String(2))
    currency = Column(String(5))
    currency_name = Column(String(30))