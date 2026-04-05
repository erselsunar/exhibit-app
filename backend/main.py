""" from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "API is running"} """

from sqlalchemy import create_engine

engine = create_engine("postgresql://postgres:1245*@localhost:5432/Exhibit")

try:
    conn = engine.connect()
    print("✅ DB bağlantısı başarılı")
except Exception as e:
    print("❌ Hata:", e)