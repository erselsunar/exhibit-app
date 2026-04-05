from sqlalchemy import Column, Integer, String, ForeignKey, Float
from database import Base

class Booth(Base):
    __tablename__ = "booths"

    id = Column(Integer, primary_key=True)
    expo_id = Column(Integer, ForeignKey("expos.id"))
    bp_id = Column(Integer, ForeignKey("bps.id"))
    booth_no = Column(String)
    weight = Column(Float)