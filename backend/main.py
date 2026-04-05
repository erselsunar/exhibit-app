from fastapi import FastAPI
from database import Base, engine

# modelleri import et (çok önemli!)
from models import city, venue, expo, bp, booth

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "API çalışıyor 🚀"}