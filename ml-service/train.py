"""
ml-service/train.py — Standalone training script.

Retrains and overwrites the .pkl model files independently of the FastAPI app.
Uses the existing training logic in PriceService and WeatherFitService (no duplication).

Usage:
    cd ml-service
    python train.py               # retrain both models
    python train.py --price       # retrain price model only
    python train.py --weather     # retrain weather-fit model only
"""

import os
import sys
import argparse
import subprocess
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("train")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")


def _ensure_data():
    """Generate placeholder JSON files if they don't exist (same logic as main.py)."""
    required = ["destinations.json", "attractions.json", "reviews.json", "climate.json"]
    missing = [f for f in required if not os.path.exists(os.path.join(DATA_DIR, f))]
    if missing:
        logger.info("Missing data files: %s — running generator...", missing)
        gen_script = os.path.join(BASE_DIR, "generate_data.py")
        subprocess.run([sys.executable, gen_script], check=True)
        logger.info("Data generation complete.")


def train_price():
    """Retrain the price prediction model."""
    from services.price_service import PriceService

    dest_path = os.path.join(DATA_DIR, "destinations.json")
    logger.info("Instantiating PriceService (will load existing model)...")
    svc = PriceService(dest_path, MODEL_DIR)

    logger.info("Forcing retrain...")
    summary = svc.retrain()
    return summary


def train_weather():
    """Retrain the weather-fit score model."""
    from services.weather_service import WeatherFitService

    climate_path = os.path.join(DATA_DIR, "climate.json")
    logger.info("Instantiating WeatherFitService (will load existing model)...")
    svc = WeatherFitService(climate_path, MODEL_DIR)

    logger.info("Forcing retrain...")
    summary = svc.retrain()
    return summary


def main():
    parser = argparse.ArgumentParser(description="Retrain ML models for Wander-AI")
    parser.add_argument("--price", action="store_true", help="Retrain price model only")
    parser.add_argument("--weather", action="store_true", help="Retrain weather-fit model only")
    args = parser.parse_args()

    # If neither flag is set, retrain both
    train_both = not args.price and not args.weather

    _ensure_data()

    print("\n" + "=" * 60)
    print("  Wander-AI ML — Model Training")
    print("=" * 60)

    results = []

    if args.price or train_both:
        print("\n[1/2] Training Price Prediction model...")
        summary = train_price()
        results.append(summary)
        print(f"  [OK] {summary['model']}")
        print(f"    Saved to: {summary['saved_to']}")
        print(f"    Encoder:  {summary['encoder_saved_to']}")
        print(f"    Trained on {summary['n_destinations']} destinations")

    if args.weather or train_both:
        step = "2/2" if train_both else "1/1"
        print(f"\n[{step}] Training Weather-Fit Score model...")
        summary = train_weather()
        results.append(summary)
        print(f"  [OK] {summary['model']}")
        print(f"    Saved to: {summary['saved_to']}")
        print(f"    Trained on {summary['n_climate_entries']} climate entries")

    print("\n" + "=" * 60)
    print(f"  Done. {len(results)} model(s) retrained and saved to models/")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
