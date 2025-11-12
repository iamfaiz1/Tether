# app/main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes import upload

app = FastAPI(title="Tether - Lost & Found Prototype")

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(upload.router, prefix="/api", tags=["submissions"])
