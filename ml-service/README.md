# Wander-AI ML Service

A standalone FastAPI microservice providing real ML/NLP capabilities to the Wander-AI platform. Runs alongside the existing Express backend as a separate process on port `8000`.

---

## Quick Start

### Prerequisites
- Python 3.10 or later
- pip

### Install & Run

```bash
cd ml-service

# 1. Install dependencies
pip install -r requirements.txt

# 2. Start the service
uvicorn main:app --reload --port 8000
```

On first startup the service will:
1. Auto-generate `data/*.json` placeholder files (if absent).
2. Build the recommendation cosine-similarity matrix.
3. Train the price-prediction RandomForest model → saved to `models/`.
4. Train the weather-fit GradientBoosting model → saved to `models/`.

Subsequent restarts load the saved models (<1 s).

### Interactive API Docs
After starting, visit: **http://localhost:8000/docs** (Swagger UI)

---

## Endpoints

### Health
```
GET /health
```
```json
{ "status": "ok", "service": "wander-ai-ml-service", "version": "1.0.0" }
```

---

### 1. Recommendation Engine

> **What it is:** Content-based cosine similarity over multi-hot vibe + thematicTag features.  
> **Model type:** No training — similarity search only.

#### `GET /recommendations/{destination_id}?top_n=5`
Returns top-N similar destinations.

**Example:**
```bash
curl "http://localhost:8000/recommendations/dest-001?top_n=5"
```
**Response:**
```json
{
  "destinationId": "dest-001",
  "topN": 5,
  "results": [
    {
      "destination": { "id": "dest-006", "name": "Ratnagiri", ... },
      "similarityScore": 0.9241
    },
    ...
  ]
}
```

#### `POST /recommendations/by-preferences`
Rank destinations by user preference vector.

**Example:**
```bash
curl -X POST http://localhost:8000/recommendations/by-preferences \
  -H "Content-Type: application/json" \
  -d '{
    "vibes": ["beach", "adventure"],
    "thematic_tags": ["heritage", "food"],
    "budget_min": 1000,
    "budget_max": 5000,
    "top_n": 10
  }'
```
**Response:**
```json
{
  "results": [{ "destination": {...}, "similarityScore": 0.8812 }, ...],
  "inputVibes": ["beach", "adventure"],
  "inputTags": ["heritage", "food"],
  "budgetRange": "₹1000 – ₹5000"
}
```

---

### 2. Itinerary Optimisation

> **What it is:** TSP/VRP solver that orders attractions into an efficient multi-day plan.  
> **Model type:** OR-Tools VRP (with time-window constraints) → 2-opt nearest-neighbour fallback.

#### `POST /itinerary/optimize`

**Example:**
```bash
curl -X POST http://localhost:8000/itinerary/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "destinationId": "dest-001",
    "numDays": 2,
    "startTime": "09:00",
    "maxHoursPerDay": 8.0,
    "categoryPreferences": null
  }'
```
**Response:**
```json
{
  "destinationId": "dest-001",
  "solver": "2opt_heuristic",
  "numDays": 2,
  "days": [
    {
      "day": 1,
      "stops": [
        {
          "order": 1,
          "name": "Tarkarli Beach",
          "arrivalTime": "09:00",
          "departureTime": "10:30",
          "travelFromPrevMins": 0,
          "estimatedCost": 0
        },
        ...
      ],
      "totalTravelMins": 42,
      "totalCost": 450
    }
  ],
  "grandTotalCost": 850
}
```

---

### 3. Sentiment Analysis

> **What it is:** VADER sentiment scoring over review text.  
> **Model type:** Rule/lexicon-based (VADER) — no training, deterministic.  
> **Honest note:** VADER is lexicon-based, not a deep-learning model. It reliably identifies positive/negative polarity in travel reviews. Upgrade to `distilbert-base-uncased-finetuned-sst-2-english` via transformers for higher nuance.

#### `GET /sentiment/{destination_id}`

**Example:**
```bash
curl http://localhost:8000/sentiment/dest-001
```
**Response:**
```json
{
  "destinationId": "dest-001",
  "reviewCount": 10,
  "overallSentiment": "positive",
  "avgCompoundScore": 0.4821,
  "sentimentDistribution": { "positive": 60.0, "neutral": 20.0, "negative": 20.0 },
  "aspectBreakdown": {
    "staff": { "reviewCount": 4, "avgCompound": 0.62, "sentiment": "positive" },
    "value": { "reviewCount": 3, "avgCompound": -0.12, "sentiment": "neutral" },
    "cleanliness": { "reviewCount": 2, "avgCompound": -0.34, "sentiment": "negative" },
    "location": { "reviewCount": 6, "avgCompound": 0.71, "sentiment": "positive" }
  }
}
```

#### `POST /sentiment/analyze`

**Example:**
```bash
curl -X POST http://localhost:8000/sentiment/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Beautiful place but a bit crowded and overpriced."}'
```
**Response:**
```json
{
  "sentiment": "positive",
  "compound": 0.2732,
  "confidence": 0.6366,
  "aspectsDetected": ["location", "value"],
  "aspectSentiment": {
    "location": { "score": 0.2732, "label": "positive" },
    "value":    { "score": 0.2732, "label": "positive" }
  }
}
```

---

### 4. Price Prediction

> **What it is:** RandomForestRegressor predicting dynamic price based on seasonality, holidays, and demand.  
> **Model type:** Trained ML model (sklearn RandomForest). Training data is synthetic but generated by a principled demand formula — see `services/price_service.py` for the full formula.  
> **Honest note:** This is trained on synthetic data that approximates real demand patterns. Accuracy improves significantly when replaced with historical booking price data.

#### `POST /price/predict`

**Example:**
```bash
curl -X POST http://localhost:8000/price/predict \
  -H "Content-Type: application/json" \
  -d '{"destinationId": "dest-001", "date": "2024-12-25"}'
```
**Response:**
```json
{
  "destinationId": "dest-001",
  "destinationName": "Tarkarli",
  "date": "2024-12-25",
  "month": "December",
  "predictedPrice": 3847.0,
  "baseLine": 2500,
  "changeVsBaseline": 1347.0,
  "isHoliday": true,
  "isBestMonth": true,
  "popularityTier": "gem",
  "topFactors": [
    "Seasonality (December) accounts for ~38% of the price variation",
    "Holiday period adds ~25% premium (importance: 24%)",
    "Peak season (best months) adds up to 40% demand surge (importance: 18%)"
  ]
}
```

---

### 5. Weather

> **What it is:**
> - **Live forecast**: Real-time Open-Meteo API call (no API key). Results cached 1 hour.  
> - **Reoptimize helper**: Returns `shouldReoptimize=true` when rain probability > 60%.  
> - **Fit score**: GradientBoosting regressor trained on climate data with rule-generated labels.  
> **Model type:** Live API + trained sklearn model (bonus endpoint).

#### `GET /weather?lat=X&lng=Y`

```bash
curl "http://localhost:8000/weather?lat=15.84&lng=73.77"
```
**Response:**
```json
{
  "lat": 15.84,
  "lng": 73.77,
  "forecast": [
    { "date": "2024-12-01", "tempMaxC": 30.2, "precipitationProbabilityPct": 5 },
    { "date": "2024-12-02", "tempMaxC": 31.4, "precipitationProbabilityPct": 10 },
    ...
  ],
  "source": "open-meteo.com"
}
```

#### `GET /weather/reoptimize?lat=X&lng=Y&date=YYYY-MM-DD&activity_type=outdoor`

```bash
curl "http://localhost:8000/weather/reoptimize?lat=15.84&lng=73.77&date=2024-07-15&activity_type=outdoor"
```
**Response:**
```json
{
  "shouldReoptimize": true,
  "precipitationPct": 85,
  "threshold": 60.0,
  "reason": "Precipitation probability 85% exceeds threshold 60% — recommend indoor alternatives"
}
```

#### `GET /weather/fit-score?destinationId=X&month=November&activityType=outdoor`

```bash
curl "http://localhost:8000/weather/fit-score?destinationId=dest-001&month=November&activityType=outdoor"
```
**Response:**
```json
{
  "destinationId": "dest-001",
  "month": "November",
  "activityType": "outdoor",
  "weatherFitScore": 87.4,
  "interpretation": "Excellent",
  "climateData": { "avgTempC": 28.5, "avgRainfallMm": 12, "avgHumidityPct": 52, "monsoonSeason": false }
}
```

---

## Model Honesty Table

| Capability | Type | Notes |
|---|---|---|
| Recommendation engine | **Similarity search** (cosine) | No training. Pure math on feature vectors. |
| Itinerary optimisation | **Combinatorial solver** (OR-Tools / 2-opt) | No training. Exact/heuristic algorithm. |
| Sentiment analysis | **Lexicon-based** (VADER) | No training. Rule/dictionary lookup. Upgrade to transformer for higher nuance. |
| Price prediction | **Trained ML model** (RandomForest) | Trained on synthetic data; replace with real historical prices for production. |
| Weather forecast | **Live API** (Open-Meteo) | Real-time data, no model. |
| Weather-fit score | **Trained ML model** (GradientBoosting) | Trained on climate data with rule-generated labels. |

---

## Environment Variables (optional)
None required. The service is self-contained.
If you move the data directory, set `DATA_DIR` env variable before starting.

---

## Project Structure

```
ml-service/
  data/              # Placeholder JSON data (replace with real exports)
    destinations.json
    attractions.json
    reviews.json
    climate.json
    README.md
  models/            # Saved model files (auto-generated on first run)
    price_model.pkl
    tier_encoder.pkl
    weather_fit_model.pkl
  routes/            # FastAPI routers (one per capability)
    recommendations.py
    itinerary.py
    sentiment.py
    price.py
    weather.py
  services/          # Core ML/NLP logic (one module per capability)
    recommendation_service.py
    itinerary_service.py
    sentiment_service.py
    price_service.py
    weather_service.py
  generate_data.py   # Synthetic data generator (run to recreate data/)
  main.py            # FastAPI app entry point
  requirements.txt
  README.md
  INTEGRATION.md     # How the main Express app calls this service
```

---

## Model Backups

`models/*_synthetic_backup.pkl` are the original models trained on synthetic data from `generate_data.py`, kept for rollback if retraining on real data produces worse results.

| Backup file | Original | Description |
|---|---|---|
| `price_model_synthetic_backup.pkl` | `price_model.pkl` | RandomForest price regressor trained on synthetic demand formula |
| `weather_fit_model_synthetic_backup.pkl` | `weather_fit_model.pkl` | GradientBoosting weather-fit scorer trained on synthetic climate data |
| `tier_encoder_synthetic_backup.pkl` | `tier_encoder.pkl` | LabelEncoder for popularity tier categories |
