"""Routes: Weather endpoints — live Open-Meteo + bonus weather-fit score."""

from fastapi import APIRouter, Request, HTTPException, Query
from pydantic import BaseModel, Field
from datetime import date as dt_date
from typing import Optional
from services.weather_service import (
    fetch_forecast, should_reoptimize
)

router = APIRouter(prefix="/weather", tags=["Weather"])


# ── Pydantic schemas ───────────────────────────────────────────────────────────
class ForecastDay(BaseModel):
    date: str
    tempMaxC: Optional[float] = None
    precipitationProbabilityPct: Optional[float] = None


class ForecastResponse(BaseModel):
    lat: float
    lng: float
    forecast: list[ForecastDay]
    source: str
    cachedAt: str


class ReoptimizeResponse(BaseModel):
    shouldReoptimize: bool
    precipitationPct: Optional[float] = None
    threshold: Optional[float] = None
    reason: str


class WeatherFitResponse(BaseModel):
    destinationId: str
    month: str
    activityType: str
    weatherFitScore: Optional[float] = None
    interpretation: Optional[str] = None
    climateData: Optional[dict] = None
    warning: Optional[str] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.get(
    "",
    response_model=ForecastResponse,
    summary="7-day weather forecast via Open-Meteo (live, no API key)",
    description=(
        "Fetches real-time 7-day forecast from open-meteo.com. "
        "Results are cached in-memory for 1 hour per location. "
        "Also exposes a /weather/reoptimize helper for checking whether an outdoor "
        "activity should be replanned due to rain."
    ),
)
async def get_forecast(
    lat: float = Query(..., examples=[15.84], description="Latitude"),
    lng: float = Query(..., examples=[73.77], description="Longitude"),
):
    try:
        data = await fetch_forecast(lat, lng)
        return data
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Open-Meteo API error: {e}")


@router.get(
    "/reoptimize",
    response_model=ReoptimizeResponse,
    summary="Check whether an outdoor activity warrants replanning",
    description=(
        "Returns shouldReoptimize=True when precipitation probability on the given date "
        "exceeds the threshold (default 60%) for an outdoor activity. "
        "Indoor activities always return False."
    ),
)
async def check_reoptimize(
    lat: float = Query(..., examples=[15.84]),
    lng: float = Query(..., examples=[73.77]),
    query_date: dt_date = Query(..., alias="date", examples=["2024-12-25"]),
    activity_type: str = Query("outdoor", pattern="^(indoor|outdoor)$"),
    threshold: float = Query(60.0, ge=0.0, le=100.0),
):
    result = await should_reoptimize(lat, lng, query_date, activity_type, threshold)
    return result


@router.get(
    "/fit-score",
    response_model=WeatherFitResponse,
    summary="(Bonus) Weather-fit score from trained climate model",
    description=(
        "Returns a 0–100 weather suitability score for a destination/month/activity "
        "combination, predicted by a GradientBoostingRegressor trained on climate data "
        "with rule-generated labels."
    ),
)
def get_fit_score(
    request: Request,
    destinationId: str = Query(..., examples=["dest-001"]),
    month: str = Query(..., examples=["November"]),
    activityType: str = Query("outdoor", pattern="^(indoor|outdoor)$"),
):
    svc = request.app.state.fit_svc
    try:
        return svc.get_fit_score(destinationId, month, activityType)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
