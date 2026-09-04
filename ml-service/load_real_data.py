"""
ml-service/load_real_data.py — Real-data ingestion utility.

Converts teammate-provided CSVs into the exact JSON schema used by
data/destinations.json and data/climate.json. Run manually once real
data arrives — this is NOT wired into main.py startup.

Usage:
    python load_real_data.py --price-csv real_prices.csv --climate-csv real_climate.csv

CSV column expectations:
  Price CSV:  destination, date, price, is_holiday, occupancy_pct, tier
  Climate CSV: destination, month, avg_temp_c, avg_rainfall_mm, is_monsoon, activity_type, fit_label
"""

import argparse
import csv
import json
import logging
import os
import sys
from typing import Optional

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s -- %(message)s",
)
logger = logging.getLogger("load_real_data")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")


# ── Helpers ──────────────────────────────────────────────────────────────────

def _load_existing_json(filename: str) -> list[dict]:
    """Load an existing JSON data file, return empty list if not found."""
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _save_json(filename: str, data: list[dict]):
    path = os.path.join(DATA_DIR, filename)
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    logger.info("Saved %d entries to %s", len(data), path)


def _clip_outliers(values: list[float], low_pct: float = 1.0, high_pct: float = 99.0) -> tuple[float, float]:
    """Return (low_bound, high_bound) at the given percentiles."""
    import numpy as np
    arr = np.array(values)
    low = float(np.percentile(arr, low_pct))
    high = float(np.percentile(arr, high_pct))
    return low, high


# ── Price CSV ingestion ──────────────────────────────────────────────────────

def load_price_csv(csv_path: str) -> list[dict]:
    """
    Load a CSV of real price data and merge into destinations.json.

    Expected columns: destination, date, price, is_holiday, occupancy_pct, tier

    Produces destination entries matching the exact schema:
        {id, name, state, lat, lng, vibe, thematicTags, bestMonths, rating,
         startingPrice, popularityTier, tierCategory, affordabilityIndex,
         sustainabilityScore, currentCapacityLoadPct, isOvertouristed, dataSource}
    """
    existing = _load_existing_json("destinations.json")
    existing_by_name = {d["name"].lower(): d for d in existing}

    rows = []
    missing_fields_warnings = []

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row_num, row in enumerate(reader, start=2):  # row 1 is header
            dest_name = (row.get("destination") or "").strip()
            if not dest_name:
                missing_fields_warnings.append(
                    f"Row {row_num}: missing 'destination' column -- skipped"
                )
                continue

            # Parse price with missing-value handling
            raw_price = row.get("price", "").strip()
            if not raw_price:
                missing_fields_warnings.append(
                    f"Row {row_num} ({dest_name}): missing 'price' -- defaulting to 3000"
                )
                price = 3000.0
            else:
                try:
                    price = float(raw_price)
                except ValueError:
                    missing_fields_warnings.append(
                        f"Row {row_num} ({dest_name}): invalid price '{raw_price}' -- defaulting to 3000"
                    )
                    price = 3000.0

            # Parse occupancy_pct
            raw_occ = row.get("occupancy_pct", "").strip()
            if not raw_occ:
                missing_fields_warnings.append(
                    f"Row {row_num} ({dest_name}): missing 'occupancy_pct' -- defaulting to 50"
                )
                occupancy = 50.0
            else:
                try:
                    occupancy = float(raw_occ)
                except ValueError:
                    missing_fields_warnings.append(
                        f"Row {row_num} ({dest_name}): invalid occupancy '{raw_occ}' -- defaulting to 50"
                    )
                    occupancy = 50.0

            # Parse tier
            tier = (row.get("tier") or "").strip().lower()
            if tier not in ("gem", "emerging", "popular"):
                missing_fields_warnings.append(
                    f"Row {row_num} ({dest_name}): invalid/missing tier '{tier}' -- defaulting to 'emerging'"
                )
                tier = "emerging"

            # Parse is_holiday
            raw_hol = (row.get("is_holiday") or "").strip().lower()
            is_holiday = raw_hol in ("true", "1", "yes")

            rows.append({
                "destination": dest_name,
                "price": price,
                "occupancy_pct": occupancy,
                "tier": tier,
                "is_holiday": is_holiday,
                "date": (row.get("date") or "").strip(),
            })

    # Log all missing-value warnings
    if missing_fields_warnings:
        logger.warning(
            "Missing/invalid data in %d rows:\n  %s",
            len(missing_fields_warnings),
            "\n  ".join(missing_fields_warnings),
        )

    if not rows:
        logger.error("No valid rows found in %s", csv_path)
        return existing

    # Outlier clipping on price
    prices = [r["price"] for r in rows]
    low_bound, high_bound = _clip_outliers(prices, 1.0, 99.0)
    clipped_count = 0
    for r in rows:
        if r["price"] < low_bound:
            logger.warning(
                "Price outlier for '%s': %.2f clipped to %.2f (1st percentile)",
                r["destination"], r["price"], low_bound,
            )
            r["price"] = low_bound
            clipped_count += 1
        elif r["price"] > high_bound:
            logger.warning(
                "Price outlier for '%s': %.2f clipped to %.2f (99th percentile)",
                r["destination"], r["price"], high_bound,
            )
            r["price"] = high_bound
            clipped_count += 1
    if clipped_count:
        logger.info("Clipped %d price outliers to [%.2f, %.2f] range", clipped_count, low_bound, high_bound)

    # Aggregate by destination (average price, average occupancy)
    from collections import defaultdict
    agg: dict[str, dict] = defaultdict(lambda: {"prices": [], "occupancies": [], "tier": "emerging"})
    for r in rows:
        key = r["destination"].lower()
        agg[key]["prices"].append(r["price"])
        agg[key]["occupancies"].append(r["occupancy_pct"])
        agg[key]["tier"] = r["tier"]
        agg[key]["name"] = r["destination"]

    # Merge into existing destinations or create new entries
    updated_count = 0
    new_count = 0
    for key, data in agg.items():
        avg_price = round(sum(data["prices"]) / len(data["prices"]))
        avg_occ = round(sum(data["occupancies"]) / len(data["occupancies"]))

        if key in existing_by_name:
            # Update existing entry with real data
            dest = existing_by_name[key]
            dest["startingPrice"] = avg_price
            dest["currentCapacityLoadPct"] = avg_occ
            dest["popularityTier"] = data["tier"]
            dest["isOvertouristed"] = avg_occ > 80 and data["tier"] == "popular"
            dest["affordabilityIndex"] = max(20, min(100, 100 - int((avg_price - 1500) / 70)))
            dest["dataSource"] = "real"
            updated_count += 1
        else:
            # Create a minimal new entry (user will need to fill in lat/lng/vibes etc.)
            new_id = f"dest-{len(existing) + new_count + 1:03d}"
            new_entry = {
                "id": new_id,
                "name": data["name"],
                "state": "",
                "lat": 0.0,
                "lng": 0.0,
                "vibe": [],
                "thematicTags": [],
                "bestMonths": [],
                "rating": 0.0,
                "startingPrice": avg_price,
                "popularityTier": data["tier"],
                "tierCategory": "Tier-2",
                "affordabilityIndex": max(20, min(100, 100 - int((avg_price - 1500) / 70))),
                "sustainabilityScore": 70,
                "currentCapacityLoadPct": avg_occ,
                "isOvertouristed": avg_occ > 80 and data["tier"] == "popular",
                "dataSource": "real",
            }
            existing.append(new_entry)
            logger.warning(
                "New destination '%s' created with id '%s' — needs manual lat/lng/vibe/tags",
                data["name"], new_id,
            )
            new_count += 1

    logger.info("Price CSV: %d destinations updated, %d new destinations created", updated_count, new_count)
    _save_json("destinations.json", existing)
    return existing


# ── Climate CSV ingestion ────────────────────────────────────────────────────

def load_climate_csv(csv_path: str) -> list[dict]:
    """
    Load a CSV of real climate/weather data and merge into climate.json.

    Expected columns: destination, month, avg_temp_c, avg_rainfall_mm, is_monsoon, activity_type, fit_label

    Produces climate entries matching the exact schema:
        {destinationId, month, avgTempC, avgRainfallMm, avgHumidityPct, monsoonSeason, dataSource}

    Note: fit_label and activity_type from the CSV are NOT stored in climate.json
    (they are training labels, not climate features). avgHumidityPct defaults to 60
    since the CSV doesn't include it — override manually if available.
    """
    existing_dests = _load_existing_json("destinations.json")
    dest_name_to_id = {d["name"].lower(): d["id"] for d in existing_dests}

    existing_climate = _load_existing_json("climate.json")
    existing_keys = {(c["destinationId"], c["month"]) for c in existing_climate}

    rows_added = 0
    rows_updated = 0
    missing_fields_warnings = []

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row_num, row in enumerate(reader, start=2):
            dest_name = (row.get("destination") or "").strip()
            if not dest_name:
                missing_fields_warnings.append(f"Row {row_num}: missing 'destination' -- skipped")
                continue

            dest_id = dest_name_to_id.get(dest_name.lower())
            if not dest_id:
                missing_fields_warnings.append(
                    f"Row {row_num}: destination '{dest_name}' not found in destinations.json -- skipped"
                )
                continue

            month = (row.get("month") or "").strip().title()
            valid_months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December",
            ]
            if month not in valid_months:
                missing_fields_warnings.append(
                    f"Row {row_num} ({dest_name}): invalid month '{month}' -- skipped"
                )
                continue

            # Parse avg_temp_c
            raw_temp = row.get("avg_temp_c", "").strip()
            if not raw_temp:
                missing_fields_warnings.append(
                    f"Row {row_num} ({dest_name}, {month}): missing avg_temp_c -- defaulting to 25.0"
                )
                temp = 25.0
            else:
                try:
                    temp = float(raw_temp)
                except ValueError:
                    missing_fields_warnings.append(
                        f"Row {row_num} ({dest_name}, {month}): invalid avg_temp_c '{raw_temp}' -- defaulting to 25.0"
                    )
                    temp = 25.0

            # Parse avg_rainfall_mm
            raw_rain = row.get("avg_rainfall_mm", "").strip()
            if not raw_rain:
                missing_fields_warnings.append(
                    f"Row {row_num} ({dest_name}, {month}): missing avg_rainfall_mm -- defaulting to 0"
                )
                rain = 0.0
            else:
                try:
                    rain = float(raw_rain)
                except ValueError:
                    missing_fields_warnings.append(
                        f"Row {row_num} ({dest_name}, {month}): invalid avg_rainfall_mm '{raw_rain}' -- defaulting to 0"
                    )
                    rain = 0.0

            # Parse is_monsoon
            raw_monsoon = (row.get("is_monsoon") or "").strip().lower()
            is_monsoon = raw_monsoon in ("true", "1", "yes")

            entry = {
                "destinationId": dest_id,
                "month": month,
                "avgTempC": round(temp, 1),
                "avgRainfallMm": round(rain, 1),
                "avgHumidityPct": 60,  # default — CSV doesn't include humidity
                "monsoonSeason": is_monsoon,
                "dataSource": "real",
            }

            key = (dest_id, month)
            if key in existing_keys:
                # Update existing entry
                for i, c in enumerate(existing_climate):
                    if c["destinationId"] == dest_id and c["month"] == month:
                        existing_climate[i] = entry
                        break
                rows_updated += 1
            else:
                existing_climate.append(entry)
                existing_keys.add(key)
                rows_added += 1

    # Log all missing-value warnings
    if missing_fields_warnings:
        logger.warning(
            "Missing/invalid data in %d rows:\n  %s",
            len(missing_fields_warnings),
            "\n  ".join(missing_fields_warnings),
        )

    logger.info("Climate CSV: %d entries added, %d entries updated", rows_added, rows_updated)
    _save_json("climate.json", existing_climate)
    return existing_climate


# ── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Load real teammate-provided CSV data into ml-service JSON format"
    )
    parser.add_argument(
        "--price-csv", type=str, default=None,
        help="Path to real price data CSV (columns: destination, date, price, is_holiday, occupancy_pct, tier)"
    )
    parser.add_argument(
        "--climate-csv", type=str, default=None,
        help="Path to real climate data CSV (columns: destination, month, avg_temp_c, avg_rainfall_mm, is_monsoon, activity_type, fit_label)"
    )

    args = parser.parse_args()

    if not args.price_csv and not args.climate_csv:
        parser.print_help()
        print("\nError: Provide at least one of --price-csv or --climate-csv")
        sys.exit(1)

    if args.price_csv:
        if not os.path.exists(args.price_csv):
            logger.error("Price CSV not found: %s", args.price_csv)
            sys.exit(1)
        print(f"\n--- Loading price data from {args.price_csv} ---")
        load_price_csv(args.price_csv)

    if args.climate_csv:
        if not os.path.exists(args.climate_csv):
            logger.error("Climate CSV not found: %s", args.climate_csv)
            sys.exit(1)
        print(f"\n--- Loading climate data from {args.climate_csv} ---")
        load_climate_csv(args.climate_csv)

    print("\nDone. Run 'python train.py' to retrain models on the updated data.")


if __name__ == "__main__":
    main()
