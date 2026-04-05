from sqlalchemy import Column, Integer, String, Text
from database import Base

class BP(Base):
    __tablename__ = "bps"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    address = Column(Text)