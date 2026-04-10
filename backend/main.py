import models.expo_mgmt
import models.expo
import models


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routes.city_routes import router as city_router
from routes.venue_routes import router as venue_router
from routes.expo_routes import router as expo_router
from routes.expo_mgmt_routes import router as expo_mgmt_router
from routes.booth_routes import router as booth_router
from routes.country_routes import router as country_router
from routes.state_routes import router as state_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],   # 🔥 BU ÇOK ÖNEMLİ
    allow_headers=["*"],   # 🔥 BU DA
)

app.include_router(country_router, prefix="/countries", tags=["Countries"])
app.include_router(state_router, prefix="/states", tags=["States"])
app.include_router(city_router, prefix="/cities", tags=["Cities"])
app.include_router(venue_router, prefix="/venues", tags=["Venues"])
app.include_router(expo_mgmt_router, prefix="/expo-mgmt", tags=["Expo Managements"])
app.include_router(expo_router, prefix="/expos", tags=["Expos"])
app.include_router(booth_router, prefix="/booths", tags=["Booths"])


@app.get("/")
def root():
    return {"message": "API is running"}