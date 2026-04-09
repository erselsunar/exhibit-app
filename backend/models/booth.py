from sqlalchemy import Column, Integer, String, ForeignKey
from database.base import Base

class Booth(Base):
    __tablename__ = "booth"

    id = Column(Integer, primary_key=True, index=True)

    booth_id = Column(String(10), nullable=False)
    expo_id = Column(Integer, ForeignKey("expo.id"), nullable=False)

    partner_id = Column(Integer, nullable=True)

    dimension = Column(String(30))
    uom = Column(String(3))