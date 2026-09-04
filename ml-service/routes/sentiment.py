"""Routes: Sentiment analysis endpoints."""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter(prefix="/sentiment", tags=["Sentiment"])


# ── Pydantic schemas ───────────────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000,
                      examples=["Beautiful place but a bit crowded and overpriced."])


class SingleSentimentResponse(BaseModel):
    text: str
    sentiment: str
    compound: float
    confidence: float
    aspectsDetected: list[str]
    aspectSentiment: dict


class AspectDetail(BaseModel):
    reviewCount: int
    avgCompound: float
    sentiment: str


class DestinationSentimentResponse(BaseModel):
    destinationId: str
    reviewCount: int
    overallSentiment: Optional[str] = None
    avgCompoundScore: Optional[float] = None
    sentimentDistribution: Optional[dict] = None
    aspectBreakdown: Optional[dict] = None
    warning: Optional[str] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.get(
    "/{destination_id}",
    response_model=DestinationSentimentResponse,
    summary="Aggregate sentiment for a destination",
    description=(
        "Scores all reviews for the given destination using VADER, then "
        "aggregates into overall sentiment, distribution, and per-aspect breakdown "
        "(cleanliness, staff, value, location)."
    ),
)
def destination_sentiment(
    destination_id: str,
    request: Request,
):
    svc = request.app.state.sent_svc
    result = svc.get_destination_sentiment(destination_id)
    return result


@router.post(
    "/analyze",
    response_model=SingleSentimentResponse,
    summary="Analyse a single piece of review text",
    description=(
        "Runs VADER sentiment on raw text and returns sentiment label, compound score, "
        "confidence, and detected aspects. Use for live scoring of new reviews."
    ),
)
def analyze_text(
    body: AnalyzeRequest,
    request: Request,
):
    svc = request.app.state.sent_svc
    return svc.analyse_text(body.text)
