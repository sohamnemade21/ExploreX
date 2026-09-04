"""
Price Prediction Service — dynamic price regressor.

Model: RandomForestRegressor (sklearn)
  Chosen over GradientBoosting because:
  - Handles mixed categorical + numeric without scaling
  - Built-in feature importance for explanation
  - Trains in < 1 s on synthetic dataset
  - Low risk of over-fitting on small synthetic data

Synthetic training set generation formula (principled, auditable):
  base_price = destination.startingPrice
  demand_multiplier =
      1.0 + (0.4 if current_month in bestMonths else 0.0)
          + (0.25 if is_holiday else 0.0)
          + (0.15 * (popularityTier_score))
          + (0.10 * (currentCapacityLoadPct / 100))
  predicted_price = base_price × demand_multiplier × gaussian_noise(μ=1, σ=0.05)

India public holidays (approximate dates — Gregorian proxies for floating holidays):
  - Republic Day:      Jan 26
  - Holi:              Mar 7 (approximate; varies by year)
  - Ram Navami:        Apr 5 (approximate)
  - Independence Day:  Aug 15
  - Ganesh Chaturthi: Sep 7 (approximate)
  - Navratri start:   Oct 3 (approximate)
  - Dussehra:         Oct 12 (approximate)
  - Diwali:           Nov 1 (approximate; shifts ±2 weeks)
  - Christmas:        Dec 25
  - New Year:         Jan 1
  - Eid al-Fitr:      Mar 30 (approximate; lunar, shifts yearly)
  - Eid al-Adha:      Jun 16 (approximate)
These are encoded as (month, day) tuples and matched within a ±3-day window.
"""

import json, os, logging
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from datetime import date, datetime, timedelta
from typing import Optional

logger = logging.getLogger(__name__)

# ── India public holiday calendar (month, day) approximations ─────────────────
INDIA_HOLIDAYS: list[tuple[int, int]] = [
    (1, 1),   # New Year
    (1, 26),  # Republic Day
    (3, 7),   # Holi (approx)
    (3, 30),  # Eid al-Fitr (approx)
    (4, 5),   # Ram Navami (approx)
    (4, 14),  # Ambedkar Jayanti / Baisakhi
    (6, 16),  # Eid al-Adha (approx)
    (8, 15),  # Independence Day
    (9, 7),   # Ganesh Chaturthi (approx)
    (10, 3),  # Navratri start (approx)
    (10, 12), # Dussehra (approx)
    (10, 24), # Diwali (approx; ±2 weeks variance)
    (11, 1),  # Diwali alt window
    (12, 25), # Christmas
]
HOLIDAY_WINDOW_DAYS = 3  # count dates within ±3 days as "holiday adjacent"

POPULARITY_SCORE: dict[str, float] = {
    "popular": 1.0,
    "emerging": 0.5,
    "gem": 0.1,
}

MONTHS_ORDER = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
]

MODEL_FILENAME = "price_model.pkl"
ENCODER_FILENAME = "tier_encoder.pkl"


def _is_holiday(query_date: date) -> bool:
    for (hm, hd) in INDIA_HOLIDAYS:
        hdate = date(query_date.year, hm, hd)
        if abs((query_date - hdate).days) <= HOLIDAY_WINDOW_DAYS:
            return True
    return False


def _is_best_month(month_name: str, best_months: list[str]) -> bool:
    return month_name in best_months


def _demand_multiplier(
    month_name: str,
    best_months: list[str],
    is_holiday: bool,
    popularity_tier: str,
    capacity_load_pct: float,
) -> float:
    mult = 1.0
    mult += 0.40 if month_name in best_months else 0.0
    mult += 0.25 if is_holiday else 0.0
    mult += 0.15 * POPULARITY_SCORE.get(popularity_tier, 0.5)
    mult += 0.10 * (capacity_load_pct / 100.0)
    return mult


class PriceService:
    def __init__(self, data_path: str, model_dir: str):
        with open(data_path, encoding="utf-8") as f:
            self._destinations: list[dict] = json.load(f)
        self._dest_by_id: dict[str, dict] = {d["id"]: d for d in self._destinations}
        self._model_dir = model_dir
        self._model: Optional[RandomForestRegressor] = None
        self._tier_enc: Optional[LabelEncoder] = None
        self._feature_names = [
            "month_num", "popularity_tier_enc",
            "capacity_load_pct", "is_holiday", "is_best_month",
        ]
        self._load_or_train()

    # ── Model persistence ──────────────────────────────────────────────────────
    def _model_path(self) -> str:
        return os.path.join(self._model_dir, MODEL_FILENAME)

    def _enc_path(self) -> str:
        return os.path.join(self._model_dir, ENCODER_FILENAME)

    def _load_or_train(self):
        if os.path.exists(self._model_path()) and os.path.exists(self._enc_path()):
            try:
                self._model = joblib.load(self._model_path())
                self._tier_enc = joblib.load(self._enc_path())
                logger.info("Price model loaded from %s", self._model_path())
                return
            except Exception as e:
                logger.warning("Could not load saved model (%s) — retraining", e)
        self._train()

    def _train(self):
        logger.info("Training price prediction model on synthetic data...")
        X_rows, y_rows = [], []
        rng = np.random.default_rng(42)

        # Fit tier encoder on all tiers
        all_tiers = [d.get("popularityTier", "emerging") for d in self._destinations]
        enc = LabelEncoder()
        enc.fit(all_tiers)
        self._tier_enc = enc

        for dest in self._destinations:
            base_price = dest.get("startingPrice", 3000)
            best_months = dest.get("bestMonths", [])
            pop_tier = dest.get("popularityTier", "emerging")
            cap_load = dest.get("currentCapacityLoadPct", 50)

            for month_idx, month_name in enumerate(MONTHS_ORDER, start=1):
                for hol_flag in [True, False]:
                    mult = _demand_multiplier(
                        month_name, best_months, hol_flag,
                        pop_tier, float(cap_load),
                    )
                    noise = rng.normal(1.0, 0.05)
                    price = base_price * mult * noise
                    tier_enc_val = enc.transform([pop_tier])[0]
                    X_rows.append([
                        month_idx,
                        float(tier_enc_val),
                        float(cap_load),
                        1.0 if hol_flag else 0.0,
                        1.0 if month_name in best_months else 0.0,
                    ])
                    y_rows.append(price)

        X = np.array(X_rows)
        y = np.array(y_rows)

        # ── Evaluation: 80/20 split to report MAE ──────────────────────────
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        eval_model = RandomForestRegressor(
            n_estimators=200, max_depth=8, random_state=42, n_jobs=-1
        )
        eval_model.fit(X_train, y_train)
        y_pred = eval_model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        logger.info(
            "Price model evaluation — MAE on 20%% test set (%d samples): %.2f",
            len(X_test), mae,
        )

        # ── Final model: fit on ALL data for production ────────────────────
        self._model = RandomForestRegressor(
            n_estimators=200, max_depth=8, random_state=42, n_jobs=-1
        )
        self._model.fit(X, y)

        os.makedirs(self._model_dir, exist_ok=True)
        joblib.dump(self._model, self._model_path())
        joblib.dump(self._tier_enc, self._enc_path())
        logger.info(
            "Price model trained on %d samples, saved to %s",
            len(X_rows), self._model_path(),
        )

    def retrain(self) -> dict:
        """Force retrain the model and save to disk. Returns training summary."""
        self._train()
        return {
            "model": "PriceService (RandomForestRegressor)",
            "saved_to": self._model_path(),
            "encoder_saved_to": self._enc_path(),
            "n_destinations": len(self._destinations),
        }

    # ── Prediction ────────────────────────────────────────────────────────────
    def predict(self, destination_id: str, query_date: date) -> dict:
        if destination_id not in self._dest_by_id:
            raise KeyError(f"Destination '{destination_id}' not found")
        if self._model is None or self._tier_enc is None:
            raise RuntimeError("Price model not initialised")

        dest = self._dest_by_id[destination_id]
        month_num = query_date.month
        month_name = MONTHS_ORDER[month_num - 1]
        is_hol = _is_holiday(query_date)
        best_months = dest.get("bestMonths", [])
        is_best = month_name in best_months
        pop_tier = dest.get("popularityTier", "emerging")
        cap_load = float(dest.get("currentCapacityLoadPct", 50))

        tier_enc_val = float(self._tier_enc.transform([pop_tier])[0])
        features = np.array([[month_num, tier_enc_val, cap_load,
                               1.0 if is_hol else 0.0,
                               1.0 if is_best else 0.0]])

        predicted = float(self._model.predict(features)[0])

        # Feature importance narrative
        importances = dict(zip(self._feature_names, self._model.feature_importances_))
        top_factors = sorted(importances.items(), key=lambda x: x[1], reverse=True)[:3]
        explanations = []
        for factor, imp in top_factors:
            if factor == "month_num":
                explanations.append(
                    f"Seasonality ({month_name}) accounts for ~{imp*100:.0f}% of the price variation"
                )
            elif factor == "is_holiday":
                explanations.append(
                    f"{'Holiday period adds ~25% premium' if is_hol else 'No major holiday — standard pricing'} "
                    f"(importance: {imp*100:.0f}%)"
                )
            elif factor == "is_best_month":
                explanations.append(
                    f"{'Peak season (best months) adds up to 40% demand surge' if is_best else 'Off-peak month — lower demand pricing'} "
                    f"(importance: {imp*100:.0f}%)"
                )
            elif factor == "capacity_load_pct":
                explanations.append(
                    f"Current capacity utilisation ({cap_load:.0f}%) drives demand pricing "
                    f"(importance: {imp*100:.0f}%)"
                )
            elif factor == "popularity_tier_enc":
                explanations.append(
                    f"Destination tier ({pop_tier}) base premium "
                    f"(importance: {imp*100:.0f}%)"
                )

        return {
            "destinationId": destination_id,
            "destinationName": dest.get("name", ""),
            "date": query_date.isoformat(),
            "month": month_name,
            "predictedPrice": round(predicted, 0),
            "baseLine": dest.get("startingPrice", 0),
            "changeVsBaseline": round(predicted - dest.get("startingPrice", 0), 0),
            "isHoliday": is_hol,
            "isBestMonth": is_best,
            "popularityTier": pop_tier,
            "topFactors": explanations,
            "featureImportances": {k: round(v, 4) for k, v in importances.items()},
        }

    def destination_exists(self, destination_id: str) -> bool:
        return destination_id in self._dest_by_id
