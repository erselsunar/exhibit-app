from sqlalchemy import Column, BigInteger, String, ForeignKey
from database.base import Base

class State(Base):
    __tablename__ = "states"

    id = Column(BigInteger, primary_key=True)
    name = Column(String(255), nullable=False)

    country_id = Column(BigInteger, ForeignKey("countries.id"), nullable=False)
    country_code = Column(String(2), ForeignKey("countries.iso2"), nullable=False)
    iso2 = Column(String(255))
    type = Column(String(191))