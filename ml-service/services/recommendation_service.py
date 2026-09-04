"""
Recommendation Service — content-based destination recommender.

Approach:
  - Multi-hot encode vibe + thematicTags against a canonical vocabulary
  - Normalize numeric features (rating, affordabilityIndex, sustainabilityScore)
  - Compute all-pairs cosine similarity matrix at startup (O(n²) but n≤200)
  - O(1) lookup per query

No training required — this is similarity search, not supervised learning.
"""

import json, os, logging
from typing import Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

# ── Canonical vocabularies ────────────────────────────────────────────────────
# Normalisation map: alias → canonical tag (handles "beaches" → "beach", etc.)
VIBE_NORMALISE = {
    "beaches": "beach", "mountains": "mountain", "historic": "heritage",
    "eco": "eco_friendly", "spiritual": "spiritual", "spirituality": "spiritual",
    "cuisine": "culinary", "culture": "cultural", "village": "rural",
    "offbeat": "adventure",
}
TAG_NORMALISE = {
    "beach": "beaches", "sea": "beaches", "tribal": "rural_tribal",
    "craft": "art", "temple": "spirituality", "religion": "spirituality",
    "music": "art", "dance": "art",
}

VIBE_VOCAB: list[str] = [
    "beach", "mountain", "heritage", "nature", "urban", "adventure",
    "luxury", "budget", "wellness", "culinary", "spiritual", "cultural",
    "eco_friendly", "shopping", "rural",
]
TAG_VOCAB: list[str] = [
    "food", "culture", "clothing", "shopping", "nature", "adventure",
    "heritage", "spirituality", "beaches", "festivals", "rural_tribal",
    "wildlife", "history", "art",
]

# Weights for numeric features (tune as needed)
NUMERIC_WEIGHT = 0.25  # fraction of feature vector assigned to numeric dims


def _normalise_vibe(v: str) -> Optional[str]:
    v = v.lower().strip()
    v = VIBE_NORMALISE.get(v, v)
    return v if v in VIBE_VOCAB else None


def _normalise_tag(t: str) -> Optional[str]:
    t = t.lower().strip()
    t = TAG_NORMALISE.get(t, t)
    return t if t in TAG_VOCAB else None


class RecommendationService:
    def __init__(self, data_path: str):
        self._destinations: list[dict] = []
        self._id_to_idx: dict[str, int] = {}
        self._sim_matrix: Optional[np.ndarray] = None
        self._feature_matrix: Optional[np.ndarray] = None
        self._load_and_build(data_path)

    # ── Build ──────────────────────────────────────────────────────────────────
    def _load_and_build(self, path: str):
        with open(path, encoding="utf-8") as f:
            raw = json.load(f)

        self._destinations = raw
        self._id_to_idx = {d["id"]: i for i, d in enumerate(raw)}

        X = self._build_feature_matrix(raw)
        self._feature_matrix = X
        self._sim_matrix = cosine_similarity(X)
        logger.info(
            "Recommendation engine built: %d destinations, feature dim=%d",
            len(raw), X.shape[1],
        )

    def _encode_destination(self, dest: dict) -> np.ndarray:
        """Return the feature vector for a single destination."""
        # 1. Multi-hot vibe
        vibe_vec = np.zeros(len(VIBE_VOCAB))
        for v in dest.get("vibe", []):
            norm = _normalise_vibe(v)
            if norm:
                vibe_vec[VIBE_VOCAB.index(norm)] = 1.0

        # 2. Multi-hot thematicTags
        tag_vec = np.zeros(len(TAG_VOCAB))
        for t in dest.get("thematicTags", []):
            norm = _normalise_tag(t)
            if norm:
                tag_vec[TAG_VOCAB.index(norm)] = 1.0

        # 3. Normalised numerics  [rating/5, affordabilityIndex/100, sustainabilityScore/100]
        rating  = dest.get("rating", 4.0) / 5.0
        afford  = dest.get("affordabilityIndex", 70) / 100.0
        sustain = dest.get("sustainabilityScore", 70) / 100.0
        num_vec = np.array([rating, afford, sustain])

        # Concatenate with relative weight
        categorical = np.concatenate([vibe_vec, tag_vec])
        # Scale numeric so it contributes NUMERIC_WEIGHT fraction of total L2 norm
        if np.linalg.norm(categorical) > 0:
            scale = (NUMERIC_WEIGHT / (1 - NUMERIC_WEIGHT)) * (
                np.linalg.norm(categorical) / (np.linalg.norm(num_vec) + 1e-9)
            )
        else:
            scale = 1.0
        return np.concatenate([categorical, num_vec * scale])

    def _build_feature_matrix(self, destinations: list[dict]) -> np.ndarray:
        rows = [self._encode_destination(d) for d in destinations]
        return np.array(rows, dtype=np.float32)

    # ── Public API ─────────────────────────────────────────────────────────────
    def get_similar(self, destination_id: str, top_n: int = 5) -> list[dict]:
        """Return top-N similar destinations to the given one."""
        if destination_id not in self._id_to_idx:
            raise KeyError(f"Destination '{destination_id}' not found")
        idx = self._id_to_idx[destination_id]
        scores = self._sim_matrix[idx]  # type: ignore[index]

        # Sort descending, exclude self
        ranked = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)
        results = []
        for other_idx, score in ranked:
            if other_idx == idx:
                continue
            dest = self._destinations[other_idx]
            results.append({
                "destination": dest,
                "similarityScore": round(float(score), 4),
            })
            if len(results) >= top_n:
                break
        return results

    def get_by_preferences(
        self,
        vibes: list[str],
        thematic_tags: list[str],
        budget_min: Optional[float] = None,
        budget_max: Optional[float] = None,
        top_n: int = 10,
    ) -> list[dict]:
        """Rank destinations by similarity to a synthetic preference vector."""
        # Build preference vector using the same encoding schema
        pref: dict = {
            "id": "__pref__",
            "vibe": [_normalise_vibe(v) or v for v in vibes],
            "thematicTags": [_normalise_tag(t) or t for t in thematic_tags],
            "rating": 4.5,
            "affordabilityIndex": 70,
            "sustainabilityScore": 75,
        }
        pref_vec = self._encode_destination(pref).reshape(1, -1)
        scores = cosine_similarity(pref_vec, self._feature_matrix)[0]

        ranked = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)
        results = []
        for idx, score in ranked:
            dest = self._destinations[idx]
            # Optional budget filter
            if budget_max is not None and dest.get("startingPrice", 0) > budget_max:
                continue
            if budget_min is not None and dest.get("startingPrice", 0) < budget_min:
                continue
            results.append({
                "destination": dest,
                "similarityScore": round(float(score), 4),
            })
            if len(results) >= top_n:
                break
        return results

    def destination_exists(self, destination_id: str) -> bool:
        return destination_id in self._id_to_idx
