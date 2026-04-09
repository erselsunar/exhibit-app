import os

print(os.getcwd())

from fastapi import FastAPI
from routes.city_routes import router as city_router
from routes.venue_routes import router as venue_router
from routes.expo_routes import router as expo_router
from routes.expo_mgmt_routes import router as expo_mgmt_router
from routes.booth_routes import router as booth_router
from routes.country_routes import router as country_router

app = FastAPI()

app.include_router(country_router, prefix="/countries", tags=["Countries"])
app.include_router(city_router, prefix="/cities", tags=["Cities"])
app.include_router(venue_router, prefix="/venues", tags=["Venues"])
app.include_router(expo_mgmt_router, prefix="/expo-mgmt", tags=["Expo Managements"])
app.include_router(expo_router, prefix="/expos", tags=["Expos"])
app.include_router(booth_router, prefix="/booths", tags=["Booths"])


@app.get("/")
def root():
    return {"message": "API is running"}