"""
Smoke test script for all ML Service endpoints.
"""
import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, method, path, payload=None, params=None):
    print(f"\n--- Testing: {name} ({method} {path}) ---")
    url = f"{BASE_URL}{path}"
    try:
        if method == "GET":
            resp = requests.get(url, params=params, timeout=10)
        else:
            resp = requests.post(url, json=payload, timeout=10)
        
        print(f"Status Code: {resp.status_code}")
        if resp.status_code >= 400:
            print(f"Error Response: {resp.text}")
            return False
        
        data = resp.json()
        print("Sample Output:")
        print(json.dumps(data, indent=2)[:400] + ("..." if len(str(data)) > 400 else ""))
        return True
    except Exception as e:
        print(f"FAILED: {e}")
        return False

def main():
    print("Starting ML Service End-to-End Endpoint Verification...")
    results = []

    # 1. Health
    results.append(test_endpoint("Health Check", "GET", "/health"))

    # 2. Recommendations
    results.append(test_endpoint(
        "Recommendations (by ID)", "GET", "/recommendations/dest-001", params={"top_n": 3}
    ))
    results.append(test_endpoint(
        "Recommendations (by Preferences)", "POST", "/recommendations/by-preferences",
        payload={
            "vibes": ["beach", "adventure"],
            "thematic_tags": ["heritage", "food"],
            "budget_min": 1000,
            "budget_max": 4000,
            "top_n": 5
        }
    ))

    # 3. Itinerary Optimisation
    results.append(test_endpoint(
        "Itinerary Optimization", "POST", "/itinerary/optimize",
        payload={
            "destinationId": "dest-001",
            "numDays": 2,
            "startTime": "09:00",
            "maxHoursPerDay": 8.0
        }
    ))

    # 4. Sentiment Analysis
    results.append(test_endpoint(
        "Destination Sentiment Aggregate", "GET", "/sentiment/dest-001"
    ))
    results.append(test_endpoint(
        "Live Review Sentiment Scoring", "POST", "/sentiment/analyze",
        payload={"text": "Clean rooms and fantastic staff! A bit expensive but truly worth visiting."}
    ))

    # 5. Price Prediction
    results.append(test_endpoint(
        "Dynamic Price Prediction", "POST", "/price/predict",
        payload={"destinationId": "dest-001", "date": "2024-12-25"}
    ))

    # 6. Weather & Climate
    results.append(test_endpoint(
        "Live Weather Forecast (Open-Meteo)", "GET", "/weather",
        params={"lat": 16.005, "lng": 73.469}
    ))
    results.append(test_endpoint(
        "Weather Reoptimization Check", "GET", "/weather/reoptimize",
        params={"lat": 16.005, "lng": 73.469, "date": "2024-12-25", "activity_type": "outdoor"}
    ))
    results.append(test_endpoint(
        "Weather Fit Score (Climate Model)", "GET", "/weather/fit-score",
        params={"destinationId": "dest-001", "month": "November", "activityType": "outdoor"}
    ))

    passed = sum(1 for r in results if r)
    total = len(results)
    print(f"\n==========================================")
    print(f"Results: {passed}/{total} tests passed.")
    print(f"==========================================")
    if passed != total:
        sys.exit(1)

if __name__ == "__main__":
    main()
