"""
ml-service/main.py — FastAPI application entry point.

Startup sequence:
  1. Run data generator if any JSON file is missing.
  2. Load all four data files.
  3. Build recommendation cosine-similarity matrix.
  4. Train (or load cached) price model.
  5. Train (or load cached) weather-fit model.
  6. Mount all routers, attach service instances via app.state (standard FastAPI DI).

Run:
  uvicorn main:app --reload --port 8000
"""

import os
import sys
import subprocess
import logging
from contextlib import asynccontextmanager
from typing import Callable

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# ── Service imports ────────────────────────────────────────────────────────────
from services.recommendation_service import RecommendationService
from services.itinerary_service import ItineraryService
from services.sentiment_service import SentimentService
from services.price_service import PriceService
from services.weather_service import WeatherFitService

# ── Router imports ─────────────────────────────────────────────────────────────
from routes.recommendations import router as rec_router
from routes.itinerary import router as itin_router
from routes.sentiment import router as sent_router
from routes.price import router as price_router
from routes.weather import router as weather_router

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR  = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("ml-service")


def _ensure_data():
    """Generate placeholder JSON files if they don't exist."""
    required = ["destinations.json", "attractions.json", "reviews.json", "climate.json"]
    missing = [f for f in required if not os.path.exists(os.path.join(DATA_DIR, f))]
    if missing:
        logger.info("Missing data files: %s — running generator...", missing)
        gen_script = os.path.join(BASE_DIR, "generate_data.py")
        subprocess.run([sys.executable, gen_script], check=True)
        logger.info("Data generation complete.")


# ── Application lifespan ───────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=== ml-service startup ===")

    # 1. Ensure data exists
    _ensure_data()

    # 2. Initialise services
    dest_path    = os.path.join(DATA_DIR, "destinations.json")
    attr_path    = os.path.join(DATA_DIR, "attractions.json")
    review_path  = os.path.join(DATA_DIR, "reviews.json")
    climate_path = os.path.join(DATA_DIR, "climate.json")

    app.state.rec_svc   = RecommendationService(dest_path)
    app.state.itin_svc  = ItineraryService(attr_path)
    app.state.sent_svc  = SentimentService(review_path)
    app.state.price_svc = PriceService(dest_path, MODEL_DIR)
    app.state.fit_svc   = WeatherFitService(climate_path, MODEL_DIR)

    logger.info("=== ml-service ready ===")
    yield
    logger.info("=== ml-service shutdown ===")


# ── FastAPI app ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Wander-AI ML Service",
    description=(
        "Standalone FastAPI microservice providing real ML/NLP capabilities for the "
        "Wander-AI travel platform:\n\n"
        "1. **Recommendation Engine** — content-based cosine similarity\n"
        "2. **Itinerary Optimisation** — TSP/VRP via OR-Tools or 2-opt fallback\n"
        "3. **Sentiment Analysis** — VADER NLP over review text\n"
        "4. **Price Prediction** — RandomForest regressor with India holiday calendar\n"
        "5. **Weather** — live Open-Meteo 7-day forecast + weather-fit score model\n"
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Allow the main Express app (running on a different port) to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount routers ──────────────────────────────────────────────────────────────
app.include_router(rec_router)
app.include_router(itin_router)
app.include_router(sent_router)
app.include_router(price_router)
app.include_router(weather_router)


# ── Health check ───────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "ok",
        "service": "wander-ai-ml-service",
        "version": "1.0.0",
        "capabilities": [
            "recommendations",
            "itinerary_optimisation",
            "sentiment_analysis",
            "price_prediction",
            "weather_forecast",
            "weather_fit_score",
        ],
    }


@app.get("/data-status", tags=["Health"])
def data_status():
    """Report how many destinations/climate entries have real vs synthetic data."""
    import json as _json

    dest_path = os.path.join(DATA_DIR, "destinations.json")
    climate_path = os.path.join(DATA_DIR, "climate.json")

    dest_counts = {"real": 0, "synthetic": 0, "unknown": 0}
    climate_counts = {"real": 0, "synthetic": 0, "unknown": 0}

    if os.path.exists(dest_path):
        with open(dest_path, encoding="utf-8") as f:
            for d in _json.load(f):
                src = d.get("dataSource", "unknown")
                dest_counts[src] = dest_counts.get(src, 0) + 1

    if os.path.exists(climate_path):
        with open(climate_path, encoding="utf-8") as f:
            for c in _json.load(f):
                src = c.get("dataSource", "unknown")
                climate_counts[src] = climate_counts.get(src, 0) + 1

    return {
        "destinations": dest_counts,
        "climate": climate_counts,
        "summary": (
            f"{dest_counts['real']} real / {dest_counts['synthetic']} synthetic destinations, "
            f"{climate_counts['real']} real / {climate_counts['synthetic']} synthetic climate entries"
        ),
    }


# ── Dev entrypoint ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
