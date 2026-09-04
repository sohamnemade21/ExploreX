"""
Sentiment Analysis Service — VADER-based NLP scoring over review text.

Model choice: VADER (Valence Aware Dictionary and sEntiment Reasoner)
  - Install size: ~1 MB vs ~250 MB for distilbert transformer
  - Latency: < 1 ms per review vs ~100 ms per review on CPU
  - Quality: slightly lower on nuanced language, but sufficient for travel reviews
    which tend to be direct and opinionated
  - Upgrade path: replace the vader_inference() call with a HuggingFace pipeline
    using "distilbert-base-uncased-finetuned-sst-2-english" — only 2 lines change

Aspect extraction: keyword-bucket reviews into 4 aspects using word matching,
then report VADER sentiment per aspect bucket.
"""

import json, logging
from collections import defaultdict
from typing import Optional
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

logger = logging.getLogger(__name__)

# ── Aspect keyword buckets ─────────────────────────────────────────────────────
ASPECT_KEYWORDS: dict[str, list[str]] = {
    "cleanliness": [
        "clean", "dirty", "hygiene", "hygienic", "filthy", "neat", "tidy",
        "mess", "garbage", "trash", "sanitize", "spotless", "pristine", "litter",
    ],
    "staff": [
        "staff", "service", "helpful", "rude", "friendly", "host", "guide",
        "polite", "reception", "management", "crew", "worker", "attendant",
        "hospitality", "welcoming",
    ],
    "value": [
        "price", "cost", "expensive", "cheap", "affordable", "overpriced",
        "worth", "value", "money", "budget", "rupee", "rupees", "fee",
        "charge", "costly", "bargain",
    ],
    "location": [
        "location", "view", "scenic", "beautiful", "landscape", "surrounding",
        "area", "spot", "place", "situated", "setting", "access", "remote",
        "crowded", "crowd", "peaceful", "quiet", "noise",
    ],
}

_analyser = SentimentIntensityAnalyzer()


def _vader_score(text: str) -> dict:
    """Run VADER on text. Returns compound score + label + confidence."""
    scores = _analyser.polarity_scores(text)
    compound = scores["compound"]
    if compound >= 0.05:
        label = "positive"
        confidence = round((compound + 1) / 2, 4)  # map [-1,1] → [0.5,1]
    elif compound <= -0.05:
        label = "negative"
        confidence = round((1 - compound) / 2, 4)
    else:
        label = "neutral"
        confidence = round(1 - abs(compound) / 0.05 * 0.5, 4)
    return {
        "label": label,
        "compound": round(compound, 4),
        "confidence": round(confidence, 4),
        "scores": {k: round(v, 4) for k, v in scores.items()},
    }


def _detect_aspects(text: str) -> list[str]:
    """Return which aspects are mentioned in the review text."""
    lower = text.lower()
    return [aspect for aspect, keywords in ASPECT_KEYWORDS.items()
            if any(kw in lower for kw in keywords)]


class SentimentService:
    def __init__(self, data_path: str):
        with open(data_path, encoding="utf-8") as f:
            raw: list[dict] = json.load(f)
        # Group by destinationId
        self._by_dest: dict[str, list[dict]] = defaultdict(list)
        for r in raw:
            self._by_dest[r["destinationId"]].append(r)
        logger.info("Sentiment service loaded %d reviews across %d destinations",
                    len(raw), len(self._by_dest))

    # ── Single review inference ────────────────────────────────────────────────
    def analyse_text(self, text: str) -> dict:
        """Score a single piece of raw text. Used for live/new review scoring."""
        result = _vader_score(text)
        aspects = _detect_aspects(text)
        aspect_scores = {}
        for aspect in aspects:
            aspect_scores[aspect] = {
                "score": result["compound"],
                "label": result["label"],
            }
        return {
            "text": text,
            "sentiment": result["label"],
            "compound": result["compound"],
            "confidence": result["confidence"],
            "aspectsDetected": aspects,
            "aspectSentiment": aspect_scores,
        }

    # ── Destination-level aggregation ─────────────────────────────────────────
    def get_destination_sentiment(self, destination_id: str) -> dict:
        reviews = self._by_dest.get(destination_id, [])
        if not reviews:
            return {
                "destinationId": destination_id,
                "reviewCount": 0,
                "warning": "No reviews found for this destination",
            }

        all_scores: list[dict] = []
        aspect_buckets: dict[str, list[float]] = defaultdict(list)

        for rev in reviews:
            text = rev.get("text", "")
            result = _vader_score(text)
            all_scores.append(result)

            aspects = _detect_aspects(text)
            for aspect in aspects:
                aspect_buckets[aspect].append(result["compound"])

        # Aggregate
        compounds = [s["compound"] for s in all_scores]
        avg_compound = round(sum(compounds) / len(compounds), 4)

        label_counts = {"positive": 0, "neutral": 0, "negative": 0}
        for s in all_scores:
            label_counts[s["label"]] += 1
        total = len(all_scores)
        distribution = {
            k: round(v / total * 100, 1) for k, v in label_counts.items()
        }

        # Aspect summary
        aspect_summary: dict[str, dict] = {}
        for aspect, scores_list in aspect_buckets.items():
            avg = sum(scores_list) / len(scores_list)
            label = "positive" if avg >= 0.05 else "negative" if avg <= -0.05 else "neutral"
            aspect_summary[aspect] = {
                "reviewCount": len(scores_list),
                "avgCompound": round(avg, 4),
                "sentiment": label,
            }

        overall_label = (
            "positive" if avg_compound >= 0.05
            else "negative" if avg_compound <= -0.05
            else "neutral"
        )

        return {
            "destinationId": destination_id,
            "reviewCount": total,
            "overallSentiment": overall_label,
            "avgCompoundScore": avg_compound,
            "sentimentDistribution": distribution,
            "aspectBreakdown": aspect_summary,
        }

    def destination_exists(self, destination_id: str) -> bool:
        return destination_id in self._by_dest
