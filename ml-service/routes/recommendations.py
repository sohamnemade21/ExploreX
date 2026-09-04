"""Routes: Recommendation endpoints."""

from fastapi import APIRouter, Request, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


# ── Pydantic schemas ───────────────────────────────────────────────────────────
class PreferenceRequest(BaseModel):
    vibes: list[str] = Field(default_factory=list, examples=[["beach", "adventure"]])
    thematic_tags: list[str] = Field(default_factory=list, examples=[["heritage", "food"]])
    budget_min: Optional[float] = Field(None, ge=0, examples=[1000])
    budget_max: Optional[float] = Field(None, ge=0, examples=[6000])
    top_n: int = Field(10, ge=1, le=50, examples=[10])


class SimilarResult(BaseModel):
    destination: dict
    similarityScore: float


class SimilarResponse(BaseModel):
    destinationId: str
    topN: int
    results: list[SimilarResult]


class PreferenceResponse(BaseModel):
    results: list[SimilarResult]
    inputVibes: list[str]
    inputTags: list[str]
    budgetRange: Optional[str] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.get(
    "/{destination_id}",
    response_model=SimilarResponse,
    summary="Get top-N similar destinations",
    description=(
        "Returns the most similar destinations to the given one, ranked by "
        "cosine similarity over multi-hot vibe + thematicTag features."
    ),
)
def get_similar(
    destination_id: str,
    request: Request,
    top_n: int = Query(5, ge=1, le=50, description="Number of results to return"),
):
    svc = request.app.state.rec_svc
    try:
        results = svc.get_similar(destination_id, top_n)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return SimilarResponse(
        destinationId=destination_id,
        topN=top_n,
        results=[SimilarResult(**r) for r in results],
    )


@router.post(
    "/by-preferences",
    response_model=PreferenceResponse,
    summary="Rank destinations by user preference vector",
    description=(
        "Accepts a user's preferred vibes, thematic tags, and optional budget range. "
        "Constructs a synthetic preference vector and returns destinations ranked by "
        "cosine similarity."
    ),
)
def by_preferences(
    body: PreferenceRequest,
    request: Request,
):
    svc = request.app.state.rec_svc
    results = svc.get_by_preferences(
        vibes=body.vibes,
        thematic_tags=body.thematic_tags,
        budget_min=body.budget_min,
        budget_max=body.budget_max,
        top_n=body.top_n,
    )
    budget_str = None
    if body.budget_min is not None or body.budget_max is not None:
        lo = f"₹{body.budget_min:.0f}" if body.budget_min else "any"
        hi = f"₹{body.budget_max:.0f}" if body.budget_max else "any"
        budget_str = f"{lo} – {hi}"

    return PreferenceResponse(
        results=[SimilarResult(**r) for r in results],
        inputVibes=body.vibes,
        inputTags=body.thematic_tags,
        budgetRange=budget_str,
    )
