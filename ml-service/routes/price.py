"""Routes: Price prediction endpoints."""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field
from datetime import date as dt_date

router = APIRouter(prefix="/price", tags=["Price"])


# ── Pydantic schemas ───────────────────────────────────────────────────────────
class PricePredictRequest(BaseModel):
    destinationId: str = Field(..., examples=["dest-001"])
    date: dt_date = Field(..., examples=["2024-12-25"])


class PricePredictResponse(BaseModel):
    destinationId: str
    destinationName: str
    date: str
    month: str
    predictedPrice: float
    baseLine: float
    changeVsBaseline: float
    isHoliday: bool
    isBestMonth: bool
    popularityTier: str
    topFactors: list[str]
    featureImportances: dict


# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.post(
    "/predict",
    response_model=PricePredictResponse,
    summary="Predict dynamic price for a destination on a given date",
    description=(
        "Uses a RandomForestRegressor trained on synthetic but principled data. "
        "Features: month, popularityTier, capacityLoadPct, is_holiday, isBestMonth. "
        "Returns predicted price in INR + top contributing factors (feature importances)."
    ),
)
def predict_price(
    body: PricePredictRequest,
    request: Request,
):
    svc = request.app.state.price_svc
    try:
        result = svc.predict(body.destinationId, body.date)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return result
