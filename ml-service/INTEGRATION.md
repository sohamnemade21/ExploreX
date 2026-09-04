# Integration Guide — Replacing Stubs with ML Service Calls

This document describes exactly which existing stub functions/endpoints in the
Express/TypeScript backend should call the ML service instead, and how.

The ML service runs at `http://localhost:8000` (configurable).
Add `ML_SERVICE_URL=http://localhost:8000` to your `.env`.

---

## 1. Replace `balanceTourismDemand` (demandBalancerService.ts)

**Current stub:** `server/services/demandBalancerService.ts` → `balanceTourismDemand(query)`  
Uses a manual scoring formula with hardcoded weights.

**ML replacement:** `POST /recommendations/by-preferences`

```typescript
// server/services/demandBalancerService.ts (updated)
import fetch from 'node-fetch';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export async function balanceTourismDemandML(query: DemandBalancerQuery) {
  const res = await fetch(`${ML_URL}/recommendations/by-preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vibes: query.vibes || [],
      thematic_tags: query.thematicTags || [],
      budget_min: query.maxBudgetPerDay ? undefined : undefined,
      budget_max: query.maxBudgetPerDay,
      top_n: 15,
    }),
  });
  const data = await res.json();
  return data.results; // [{destination, similarityScore}]
}
```

**Route update:** `server/routes/api.ts` line ~922:
```typescript
// Replace:
const results = balanceTourismDemand(query);
// With:
const results = await balanceTourismDemandML(query);
```

---

## 2. Replace `runWhatIfSimulation` (gemini.ts)

**Current stub:** `server/gemini.ts` → `runWhatIfSimulation(params)` → calls Gemini LLM.  
For weather-based what-if scenarios, the ML service provides factual data.

**ML replacement (composite call):**

```typescript
// Example: "What if it rains on Day 2?"
async function runWhatIfML(params: WhatIfParams) {
  const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

  // 1. Get weather forecast for the destination
  const dest = db.getDestinationById(params.destinationId);
  const weatherRes = await fetch(
    `${ML_URL}/weather?lat=${dest.lat}&lng=${dest.lng}`
  );
  const weather = await weatherRes.json();

  // 2. Check if replanning is needed for outdoor activities
  const reoptRes = await fetch(
    `${ML_URL}/weather/reoptimize?lat=${dest.lat}&lng=${dest.lng}` +
    `&date=${params.targetDate}&activity_type=outdoor`
  );
  const reopt = await reoptRes.json();

  // 3. If rain triggers replan, fetch optimised indoor-first itinerary
  if (reopt.shouldReoptimize) {
    const itinRes = await fetch(`${ML_URL}/itinerary/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationId: params.destinationId,
        numDays: params.durationDays,
        categoryPreferences: ['museum', 'restaurant', 'market'], // indoor bias
      }),
    });
    const itin = await itinRes.json();
    // Build WhatIfSimulationResult from itin + weather data
    return buildWhatIfResult(params, weather, itin, reopt);
  }

  // 4. Get price for the date
  const priceRes = await fetch(`${ML_URL}/price/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destinationId: params.destinationId, date: params.targetDate }),
  });
  const price = await priceRes.json();
  return buildWhatIfResult(params, weather, null, reopt, price);
}
```

---

## 3. Replace `generateAutopilotReplan` (gemini.ts)

**Current stub:** `server/gemini.ts` → `generateAutopilotReplan(...)` → LLM.  
The ML service provides real-time replanning data.

**ML replacement:**

```typescript
async function autopilotReplanML(destinationId: string, date: string) {
  const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
  const dest = db.getDestinationById(destinationId);

  // 1. Check weather
  const reoptCheck = await fetch(
    `${ML_URL}/weather/reoptimize` +
    `?lat=${dest.lat}&lng=${dest.lng}&date=${date}&activity_type=outdoor`
  ).then(r => r.json());

  if (reoptCheck.shouldReoptimize) {
    // 2. Optimise itinerary with indoor category preference
    const itin = await fetch(`${ML_URL}/itinerary/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationId,
        numDays: 1,
        categoryPreferences: ['museum', 'restaurant', 'market', 'temple'],
      }),
    }).then(r => r.json());

    return {
      type: 'weather_replan',
      precipitationPct: reoptCheck.precipitationPct,
      suggestedItinerary: itin,
      message: reoptCheck.reason,
    };
  }
  return { type: 'no_change', message: 'Current plan remains optimal.' };
}
```

---

## 4. Replace static `startingPrice` with dynamic price

**Current:** `Destination.startingPrice` is a static field in the DB.  
**ML replacement:** `POST /price/predict` for a given destination + date.

```typescript
// In server/routes/api.ts — add a dynamic pricing endpoint:
apiRouter.get('/destinations/:id/dynamic-price', async (req, res) => {
  const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
  const { date } = req.query;
  const result = await fetch(`${ML_URL}/price/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      destinationId: req.params.id,
      date: date || new Date().toISOString().split('T')[0],
    }),
  }).then(r => r.json());
  res.json(result);
});
```

---

## 5. Replace heuristic sentiment in demand balancer

**Current:** `demandBalancerService.ts` infers quality from `rating` (a static field).  
**ML replacement:** `GET /sentiment/{destination_id}` for real NLP-derived sentiment.

```typescript
// Enrich demand balancer result with real sentiment:
const sentimentRes = await fetch(`${ML_URL}/sentiment/${dest.id}`).then(r => r.json());
const sentimentBonus = sentimentRes.avgCompoundScore > 0.3 ? 5 : 0;
overallScore += sentimentBonus;
```

---

## 6. Add Itinerary Optimisation to Package Builder

**Current:** `PackageDayItinerary` is manually ordered.  
**ML replacement:** Call `POST /itinerary/optimize` to get a real optimised day plan.

```typescript
apiRouter.post('/packages/:id/optimize-itinerary', async (req, res) => {
  const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
  const pkg = db.getPackageById(req.params.id);
  const result = await fetch(`${ML_URL}/itinerary/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      destinationId: pkg.destinationId,
      numDays: pkg.durationDays,
      maxHoursPerDay: 8,
    }),
  }).then(r => r.json());
  res.json(result);
});
```

---

## Environment Setup

Add to `Wander-Ai-main/.env`:
```
ML_SERVICE_URL=http://localhost:8000
```

Add to `server.ts` / app startup:
```typescript
// Optional: health check on startup
const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
fetch(`${mlUrl}/health`).then(r => r.json()).then(d => {
  console.log('[ML Service]', d.status, '—', d.capabilities.join(', '));
}).catch(() => {
  console.warn('[ML Service] Not reachable at', mlUrl, '— AI features disabled');
});
```

---

## Running Both Services Together

```bash
# Terminal 1: Express backend (existing)
npm run dev

# Terminal 2: ML service
cd ml-service
uvicorn main:app --reload --port 8000
```
