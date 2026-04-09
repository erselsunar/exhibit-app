from sqlalchemy import Column, BigInteger, String, ForeignKey
from database.base import Base

class City(Base):
    __tablename__ = "cities"

    id = Column(BigInteger, primary_key=True)
    name = Column(String(255), nullable=False)

    state_id = Column(BigInteger, ForeignKey("states.id"), nullable=False)
    country_id = Column(BigInteger, ForeignKey("countries.id"), nullable=False)