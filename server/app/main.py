import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import routers
from app.routes.report import router as report_router
from app.routes.match import router as match_router

# Ensure uploads directory exists
os.makedirs("app/uploads", exist_ok=True)

app = FastAPI(titleA="Tether Backend (JSON-File Mode)")

# CORS (Cross-Origin Resource Sharing)
# This allows your React frontend (running on port 5173) 
# to talk to this backend (running on port 8000)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Serve Static Images ---
# This line is the new "image route". 
# Any request to "/uploads/some-file.jpg" will be served
# from the "app/uploads/" directory.
app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")


# --- Register API Routes ---
app.include_router(report_router, prefix="/api")
app.include_router(match_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Tether Backend Running (JSON-File Mode)"}