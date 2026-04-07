from fastapi import FastAPI
from routes.city_routes import router as city_router
from routes.venue_routes import router as venue_router

app = FastAPI()

app.include_router(city_router, prefix="/cities", tags=["Cities"])
app.include_router(venue_router, prefix="/venues", tags=["Venues"])

@app.get("/")
def root():
    return {"message": "API is running"}