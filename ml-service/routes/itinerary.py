"""Routes: Itinerary optimisation endpoints."""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter(prefix="/itinerary", tags=["Itinerary"])


# ── Pydantic schemas ───────────────────────────────────────────────────────────
class OptimiseRequest(BaseModel):
    destinationId: str = Field(..., examples=["dest-001"])
    numDays: int = Field(1, ge=1, le=14, examples=[2])
    startTime: str = Field("09:00", pattern=r"^\d{2}:\d{2}$", examples=["09:00"])
    maxHoursPerDay: float = Field(8.0, ge=1.0, le=16.0, examples=[8.0])
    categoryPreferences: Optional[list[str]] = Field(
        None,
        examples=[["beach", "temple", "museum"]],
        description="Restrict attractions to these categories. Leave null for all.",
    )


class StopDetail(BaseModel):
    order: int
    attractionId: str
    name: str
    category: str
    indoorOutdoor: str
    arrivalTime: str
    departureTime: str
    visitDurationMins: int
    travelFromPrevMins: int
    estimatedCost: float
    lat: float
    lng: float


class DayPlan(BaseModel):
    day: int
    stops: list[StopDetail]
    totalTravelMins: int
    totalVisitMins: int
    totalCost: float
    finishTime: str


class OptimiseResponse(BaseModel):
    destinationId: str
    solver: str
    numDays: int
    maxHoursPerDay: float
    startTime: str
    days: list[DayPlan]
    grandTotalCost: float
    grandTotalTravelMins: int


# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.post(
    "/optimize",
    response_model=OptimiseResponse,
    summary="Optimise multi-day attraction itinerary",
    description=(
        "Solves a TSP/VRP problem for all attractions in the destination. "
        "Uses OR-Tools when available; falls back to nearest-neighbour + 2-opt. "
        "Respects open/close hours, visit durations, and daily time budgets."
    ),
)
def optimise_itinerary(
    body: OptimiseRequest,
    request: Request,
):
    svc = request.app.state.itin_svc
    result = svc.optimise(
        destination_id=body.destinationId,
        num_days=body.numDays,
        start_time=body.startTime,
        max_hours_per_day=body.maxHoursPerDay,
        category_preferences=body.categoryPreferences,
    )
    return result
