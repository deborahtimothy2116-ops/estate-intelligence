import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
from train_model import train_and_save_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure trained model exists on startup
    if not os.path.exists("trained_models/price_model.joblib"):
        print("[FastAPI Startup]: Initializing and training ML model...")
        train_and_save_model()
    yield

app = FastAPI(
    title="AI Real Estate Intelligence & ML Microservice",
    description="Python FastAPI ML Service providing price predictions, recommendation scores, listing anomaly detection, and NLP query parsing.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "OK", "service": "Python AI/ML Microservice", "version": "1.0.0"}

app.include_router(api_router)
