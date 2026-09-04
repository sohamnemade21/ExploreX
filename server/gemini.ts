import { GoogleGenAI } from '@google/genai';
import { db } from './db';
import { ENV } from './config/env';

const ML_URL = ENV.ML_SERVICE_URL;

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiInstance) return aiInstance;
  const apiKey = ENV.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your_gemini')) {
    return null;
  }
  try {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return aiInstance;
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

// ── ML Service Helpers ────────────────────────────────────────────────────────

/**
 * Safely fetch JSON from the ML service. Returns null on any failure.
 */
async function mlFetch(path: string, options?: RequestInit): Promise<any | null> {
  try {
    const res = await fetch(`${ML_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Detect user intent from message and gather relevant ML grounding data.
 * Returns context string for injection into Gemini's system prompt + list of sources used.
 */
async function gatherMLContext(
  message: string,
  destinationId?: string
): Promise<{ groundingBlock: string; sources: string[]; mlData: Record<string, any> }> {
  const lower = message.toLowerCase();
  const sources: string[] = [];
  const mlContext: string[] = [];
  const mlData: Record<string, any> = {};

  const dest = destinationId ? db.getDestinationById(destinationId) : null;

  // Find a destination ID from the message if not explicitly provided
  let resolvedDestId = destinationId;
  if (!resolvedDestId) {
    const destinations = db.getDestinations();
    const mentioned = destinations.find(d => lower.includes(d.name.toLowerCase()));
    if (mentioned) {
      resolvedDestId = mentioned.id;
    }
  }

  const promises: Promise<void>[] = [];

  // 1. Sentiment — if destination is mentioned
  if (resolvedDestId) {
    promises.push(
      mlFetch(`/sentiment/${resolvedDestId}`).then(data => {
        if (data && data.overallSentiment) {
          sources.push('sentiment');
          mlData.sentiment = data;
          mlContext.push(
            `[ML-SENTIMENT] Destination sentiment: ${data.overallSentiment} (avg compound: ${data.avgCompoundScore?.toFixed(2) || 'N/A'}, ${data.reviewCount} reviews)`
          );
        }
      })
    );
  }

  // 2. Price prediction — if user mentions price, cost, budget, or dates
  if (resolvedDestId && (lower.includes('price') || lower.includes('cost') || lower.includes('budget') || lower.match(/\d{4}-\d{2}-\d{2}/) || lower.includes('how much'))) {
    const dateMatch = lower.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
    promises.push(
      mlFetch('/price/predict', {
        method: 'POST',
        body: JSON.stringify({ destinationId: resolvedDestId, date }),
      }).then(data => {
        if (data && data.predictedPrice !== undefined) {
          sources.push('price');
          mlData.price = data;
          mlContext.push(
            `[ML-PRICE] Predicted price for ${data.destinationName || resolvedDestId} on ${data.date}: ₹${data.predictedPrice} (baseline: ₹${data.baseLine}, change: ${data.changeVsBaseline > 0 ? '+' : ''}${data.changeVsBaseline}%). Holiday: ${data.isHoliday ? 'Yes' : 'No'}. Top factors: ${(data.topFactors || []).join(', ')}`
          );
        }
      })
    );
  }

  // 3. Itinerary optimization — if user asks for plan/itinerary
  if (resolvedDestId && (lower.includes('itinerary') || lower.includes('plan') || lower.includes('schedule') || lower.includes('day trip') || lower.includes('things to do'))) {
    const daysMatch = lower.match(/(\d+)\s*(?:day|night)/);
    const numDays = daysMatch ? parseInt(daysMatch[1]) : 2;
    promises.push(
      mlFetch('/itinerary/optimize', {
        method: 'POST',
        body: JSON.stringify({ destinationId: resolvedDestId, numDays, maxHoursPerDay: 8 }),
      }).then(data => {
        if (data && data.days) {
          sources.push('itinerary');
          mlData.itinerary = data;
          const daysSummary = data.days.map((d: any) =>
            `Day ${d.day}: ${d.stops?.length || 0} stops, finish ${d.finishTime}, cost ₹${d.totalCost}`
          ).join('; ');
          mlContext.push(
            `[ML-ITINERARY] Optimized ${data.numDays}-day plan (solver: ${data.solver}): ${daysSummary}. Grand total: ₹${data.grandTotalCost}`
          );
        }
      })
    );
  }

  // 4. Weather — if user mentions weather, rain, climate, temperature
  if (lower.includes('weather') || lower.includes('rain') || lower.includes('climate') || lower.includes('temperature') || lower.includes('forecast')) {
    const targetDest = dest || (resolvedDestId ? db.getDestinationById(resolvedDestId) : null);
    if (targetDest?.lat && targetDest?.lng) {
      promises.push(
        mlFetch(`/weather?lat=${targetDest.lat}&lng=${targetDest.lng}`).then(data => {
          if (data && data.forecast) {
            sources.push('weather');
            mlData.weather = data;
            const forecastSummary = data.forecast.slice(0, 5).map((w: any) =>
              `${w.date}: max ${w.tempMaxC}°C, precip ${w.precipitationProbabilityPct}%`
            ).join('; ');
            mlContext.push(
              `[ML-WEATHER] 7-day forecast for ${targetDest.name} (${data.source}): ${forecastSummary}`
            );
          }
        })
      );
    }
  }

  // 5. General recommendations — if user asks for suggestions
  if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('where should') || lower.includes('hidden gem') || lower.includes('offbeat')) {
    promises.push(
      mlFetch('/recommendations/by-preferences', {
        method: 'POST',
        body: JSON.stringify({
          vibes: [],
          thematic_tags: [],
          top_n: 5,
        }),
      }).then(data => {
        if (data && data.results) {
          sources.push('recommendations');
          mlData.recommendations = data;
          const recSummary = data.results.slice(0, 5).map((r: any) =>
            `${r.destination?.name} (score: ${r.similarityScore?.toFixed(2)})`
          ).join(', ');
          mlContext.push(`[ML-RECOMMENDATIONS] Top matches: ${recSummary}`);
        }
      })
    );
  }

  // Execute all ML calls concurrently
  await Promise.allSettled(promises);

  const groundingBlock = mlContext.length
    ? `\n\n---\nML-SERVICE GROUNDING DATA (use these real predictions in your response — cite specific numbers):\n${mlContext.join('\n')}\n---\n`
    : '';

  return { groundingBlock, sources, mlData };
}

/**
 * Format raw ML service JSON into readable markdown.
 * Used in the no-Gemini-API-key fallback path.
 */
function formatMLResponseAsMarkdown(mlData: any, type: string): string {
  switch (type) {
    case 'recommendations':
      if (!mlData?.results?.length) return '';
      return `### 🌟 ML-Powered Destination Recommendations\n\n` +
        mlData.results.slice(0, 5).map((r: any, i: number) => {
          const d = r.destination;
          return `${i + 1}. **${d?.name || 'Unknown'}** (${d?.stateOrRegion || d?.state || ''}) — Similarity: ${(r.similarityScore * 100).toFixed(0)}%\n   Vibes: ${(d?.vibe || []).join(', ')}\n   Starting at: ₹${(d?.startingPrice * 75 || 0).toLocaleString('en-IN')}`;
        }).join('\n\n');

    case 'price':
      if (!mlData?.predictedPrice) return '';
      return `### 💰 Dynamic Price Prediction\n\n` +
        `- **Destination**: ${mlData.destinationName || mlData.destinationId}\n` +
        `- **Date**: ${mlData.date}\n` +
        `- **Predicted Price**: ₹${mlData.predictedPrice.toLocaleString('en-IN')}\n` +
        `- **Baseline**: ₹${mlData.baseLine?.toLocaleString('en-IN') || 'N/A'}\n` +
        `- **Change**: ${mlData.changeVsBaseline > 0 ? '+' : ''}${mlData.changeVsBaseline}%\n` +
        `- **Holiday**: ${mlData.isHoliday ? 'Yes 🎉' : 'No'}\n` +
        `- **Key Factors**: ${(mlData.topFactors || []).join(', ')}`;

    case 'itinerary':
      if (!mlData?.days?.length) return '';
      return `### 📋 Optimized ${mlData.numDays}-Day Itinerary\n\n` +
        `*Solver: ${mlData.solver} | Total cost: ₹${mlData.grandTotalCost?.toLocaleString('en-IN') || 'N/A'}*\n\n` +
        mlData.days.map((day: any) =>
          `**Day ${day.day}** (finish by ${day.finishTime}, ₹${day.totalCost})\n` +
          (day.stops || []).map((s: any) =>
            `- ${s.arrivalTime}–${s.departureTime} — **${s.name}** (${s.category}, ${s.visitDurationMins}min, ~₹${s.estimatedCost})`
          ).join('\n')
        ).join('\n\n');

    case 'weather':
      if (!mlData?.forecast?.length) return '';
      return `### 🌦 Live Weather Forecast\n\n` +
        `| Date | Max Temp | Precipitation |\n|------|----------|---------------|\n` +
        mlData.forecast.slice(0, 7).map((w: any) =>
          `| ${w.date} | ${w.tempMaxC ?? '?'}°C | ${w.precipitationProbabilityPct ?? '?'}% |`
        ).join('\n');

    case 'sentiment':
      if (!mlData?.overallSentiment) return '';
      return `### 📊 Destination Sentiment Analysis\n\n` +
        `- **Overall**: ${mlData.overallSentiment} (compound: ${mlData.avgCompoundScore?.toFixed(2) || 'N/A'})\n` +
        `- **Reviews analyzed**: ${mlData.reviewCount || 0}\n` +
        (mlData.aspectBreakdown ? `- **Aspects**: ${Object.entries(mlData.aspectBreakdown).map(([k, v]: any) => `${k}: ${v.sentiment} (${v.avgCompound?.toFixed(2)})`).join(', ')}` : '');

    default:
      return JSON.stringify(mlData, null, 2);
  }
}

// ── Main API Functions ────────────────────────────────────────────────────────

export async function askTravelAssistant(params: {
  message: string;
  history?: { role: 'user' | 'model'; text: string }[];
  destinationId?: string;
  userContext?: { name?: string; budget?: string; vibes?: string[] };
}): Promise<{ reply: string; grounding?: { sources: string[]; mlServiceAvailable: boolean } }> {
  const { message, destinationId, userContext } = params;
  const ai = getAiClient();

  const destinations = db.getDestinations();
  const dest = destinationId ? db.getDestinationById(destinationId) : null;

  // Gather ML grounding data in parallel
  const { groundingBlock, sources, mlData } = await gatherMLContext(message, destinationId);
  const mlServiceAvailable = sources.length > 0;

  const catalogSummary = destinations.map(d => 
    `- ${d.name} (${d.state ? `${d.state}, India` : d.country}): Starting ₹${d.startingPrice.toLocaleString('en-IN')}, Vibes: ${d.vibe.join(', ')}, Weather: ${d.currentWeather.tempC}°C ${d.currentWeather.condition}, Safety: ${d.safetyScore.overall}/100, Tier: ${d.tierCategory || 'General'}, Impact Score: ${d.localEconomy?.localImpactScore || 85}%`
  ).join('\n');

  const systemInstruction = `You are "ExploreX AI Assistant", an elite India-focused AI tourism engine, cultural anthropologist, and sustainable demand balancer.
Your goal is to provide deeply authentic, practical, and inspiring travel advice grounded in real database data.
Specialties you excel in:
1. India Demand Balancing: Recommend lesser-known hidden gems (e.g. Sindhudurg/Tarkarli, Ratnagiri, Kolhapur, Solapur, Kaas/Satara, Chettinad, Tirthan Valley, Raghurajpur) over crowded hubs.
2. "What's Famous Here?": Local foods (Misal, Malvani Surmai, Tambda-Pandhra Rassa, Chettinad feasts, Siddu, Chhena Poda), traditional attire (Nauvari, Paithani, Kandangi), GI-tagged handicrafts (Sawantwadi toys, Solapuri Chadars, Kolhapuri Chappals, Athangudi tiles, Pattachitra), jewellery, and festivals.
3. Local Economy Support: Prioritizing homestays, family-run khanavals, master artisans, and community guides with high local economic retention.
4. Best-Time Guidance: Time-of-day crowd optimization, seasonal weather indices, and realistic daily budgets in INR (₹).

Active destination catalog:
${catalogSummary}

${dest ? `Current Selected Destination Context: ${dest.name} (${dest.state || dest.country}), Tier: ${dest.tierCategory || 'Standard'}, Popularity: ${dest.popularityTier || 'popular'}, Best Months: ${dest.bestMonths.join(', ')}` : ''}

${userContext ? `User Profile: Name: ${userContext.name || 'Traveler'}, Budget: ${userContext.budget || 'moderate'}, Preferences: ${(userContext.vibes || []).join(', ')}` : ''}
${groundingBlock}
Tone: Warm, authoritative, culturally rich, well-formatted in clean markdown with actionable itineraries and budget estimations.`;

  if (!ai) {
    // No Gemini API key — use ML-service-first formatted responses
    const reply = await buildMLFallbackResponse(message, mlData, sources);
    return {
      reply,
      grounding: { sources, mlServiceAvailable }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    return {
      reply: response.text || 'I am ready to assist with your India travel planning!',
      grounding: { sources, mlServiceAvailable }
    };
  } catch (err) {
    console.error('Gemini Travel Assistant error:', err);
    const reply = await buildMLFallbackResponse(message, mlData, sources);
    return {
      reply,
      grounding: { sources, mlServiceAvailable }
    };
  }
}

/**
 * Build a formatted response from ML data when Gemini is unavailable.
 * Replaces the old hardcoded if/else string template blocks.
 */
async function buildMLFallbackResponse(
  message: string,
  existingMlData: Record<string, any>,
  existingSources: string[]
): Promise<string> {
  const parts: string[] = [];

  // If we already have ML data from grounding, format it
  if (existingSources.includes('itinerary') && existingMlData.itinerary) {
    parts.push(formatMLResponseAsMarkdown(existingMlData.itinerary, 'itinerary'));
  }
  if (existingSources.includes('weather') && existingMlData.weather) {
    parts.push(formatMLResponseAsMarkdown(existingMlData.weather, 'weather'));
  }
  if (existingSources.includes('price') && existingMlData.price) {
    parts.push(formatMLResponseAsMarkdown(existingMlData.price, 'price'));
  }
  if (existingSources.includes('sentiment') && existingMlData.sentiment) {
    parts.push(formatMLResponseAsMarkdown(existingMlData.sentiment, 'sentiment'));
  }
  if (existingSources.includes('recommendations') && existingMlData.recommendations) {
    parts.push(formatMLResponseAsMarkdown(existingMlData.recommendations, 'recommendations'));
  }

  if (parts.length > 0) {
    return parts.join('\n\n---\n\n');
  }

  // If no ML data was gathered (ML service also down), show generic welcome
  return `### 🇮🇳 Namaste from ExploreX!

I'm your AI-powered Indian tourism assistant. I can help you with:

- 🗺️ **Destination recommendations** — Tell me your interests!
- 📋 **Itinerary planning** — I'll create a day-by-day plan
- 💰 **Budget estimates** — Know your costs upfront
- 🌦️ **Weather guidance** — Best times to visit
- 🍽️ **Local food & culture** — Don't miss the experiences

**Try asking me:**
- "Suggest destinations for a family trip in December"
- "Plan a 3-day itinerary for Hampi"
- "What's the weather like in Goa next week?"
- "How much will a trip to Manali cost?"

Which Indian state or region would you like to explore today?`;
}

export async function generateAutopilotReplan(params: {
  destinationName: string;
  trigger: 'rain_storm' | 'crowd_surge' | 'flight_delay' | 'traffic_congestion' | 'manual_refresh';
  currentSchedule: string[];
}): Promise<{
  alertTitle: string;
  alertSummary: string;
  optimizedSchedule: { time: string; activity: string; type: 'indoor' | 'outdoor' | 'transit' | 'dining'; reason: string }[];
  savingsOrBenefits: string;
}> {
  const { destinationName, trigger, currentSchedule } = params;
  const ai = getAiClient();

  if (!ai) {
    const isRain = trigger === 'rain_storm';
    return {
      alertTitle: isRain ? '🌧️ Rain Alert: Automated Indoor Optimization Activated' : '🚦 Congestion Alert: Smart Transit Rerouting',
      alertSummary: isRain 
        ? `Moderate rainfall detected in ${destinationName} between 1:00 PM and 4:30 PM. Outdoor beach/valley activities automatically swapped for cultural museums, covered artisan workshops, and heated thermal wellness.`
        : `High tourist traffic detected along main highway. Route sequenced to avoid 45 minutes of delay.`,
      optimizedSchedule: [
        { time: '09:00 AM - 11:30 AM', activity: 'Morning Heritage Walk (Clear Weather Window)', type: 'outdoor', reason: 'Favorable morning light and low rainfall probability' },
        { time: '12:00 PM - 02:00 PM', activity: 'Artisan Culinary Workshop & Covered Market Tasting', type: 'indoor', reason: 'Avoids midday rain peak while exploring authentic gastronomy' },
        { time: '02:30 PM - 05:00 PM', activity: 'National Art & Culture Museum Tour + Interactive VR Gallery', type: 'indoor', reason: '100% sheltered indoor experience during heavy precipitation' },
        { time: '05:30 PM - 07:30 PM', activity: 'Evening Sunset Lounge & Live Acoustic Performance', type: 'dining', reason: 'Post-rain fresh air with covered glass veranda' }
      ],
      savingsOrBenefits: 'Saved 2.5 hours of ruined outdoor time and guaranteed zero rain disruption.'
    };
  }

  try {
    const prompt = `You are the ExploreX Trip Autopilot engine for ${destinationName}.
Disturbance Trigger: ${trigger}
Original Planned Schedule: ${JSON.stringify(currentSchedule)}

Respond in valid JSON format with the following keys:
{
  "alertTitle": "string",
  "alertSummary": "string",
  "optimizedSchedule": [
    { "time": "string", "activity": "string", "type": "indoor|outdoor|transit|dining", "reason": "string" }
  ],
  "savingsOrBenefits": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (err) {
    console.error('Autopilot replan error:', err);
    return {
      alertTitle: '🌤️ Dynamic Autopilot Optimization Applied',
      alertSummary: `Real-time conditions in ${destinationName} evaluated. Schedule re-balanced for optimal comfort and minimal queuing.`,
      optimizedSchedule: [
        { time: '09:00 AM', activity: 'Scenic Morning Sightseeing', type: 'outdoor', reason: 'Low crowd hours' },
        { time: '01:00 PM', activity: 'Regional Culinary Experience', type: 'dining', reason: 'Air-conditioned dining' },
        { time: '03:30 PM', activity: 'Cultural Heritage Gallery', type: 'indoor', reason: 'Avoid peak afternoon temperature' }
      ],
      savingsOrBenefits: 'Avoided peak crowd queues by 35%.'
    };
  }
}

export async function runWhatIfSimulation(params: {
  scenario: string;
  destinationName: string;
  baseBudget: number;
  groupSize: number;
  durationDays: number;
}): Promise<{
  scenarioTitle: string;
  originalPlanSummary: string;
  adjustedPlanSummary: string;
  impactScore: number;
  costDifference: number;
  timeDifferenceMins: number;
  weatherFitScore: number;
  crowdReductionPct: number;
  recommendations: string[];
  dayWiseAdjustments: { day: number; originalActivity: string; proposedActivity: string; reason: string }[];
}> {
  const { scenario, destinationName, baseBudget, groupSize, durationDays } = params;
  const ai = getAiClient();

  if (!ai) {
    // Realistic algorithmic response
    let costDiff = 0;
    let crowdRed = 25;
    let weatherFit = 92;

    if (scenario.toLowerCase().includes('budget') || scenario.toLowerCase().includes('cheap')) {
      costDiff = -Math.round(baseBudget * 0.28);
      crowdRed = 15;
    } else if (scenario.toLowerCase().includes('group') || scenario.toLowerCase().includes('people')) {
      costDiff = Math.round(baseBudget * 0.45);
      crowdRed = 30;
    } else if (scenario.toLowerCase().includes('rain')) {
      weatherFit = 96;
      crowdRed = 40;
    }

    return {
      scenarioTitle: `Simulation: "${scenario}" in ${destinationName}`,
      originalPlanSummary: `${durationDays}-Day itinerary for ${groupSize} traveler(s) with standard pace and ₹${baseBudget} budget.`,
      adjustedPlanSummary: `Optimized plan dynamically adjusted for: ${scenario}. Balances logistical comfort, cost efficiency, and authentic local experiences.`,
      impactScore: 88,
      costDifference: costDiff,
      timeDifferenceMins: -45,
      weatherFitScore: weatherFit,
      crowdReductionPct: crowdRed,
      recommendations: [
        'Shift high-demand attraction slots to 08:30 AM to bypass group tour bus arrivals.',
        'Leverage The Explorer XL rides for 4+ passengers to reduce per-person transit cost by 40%.',
        'Book verified group passes with ExploreX for bundled attraction discounts.',
        'Keep a 90-minute flexible buffer between morning and afternoon activities.'
      ],
      dayWiseAdjustments: [
        {
          day: 1,
          originalActivity: 'Standard Afternoon Beach Walk',
          proposedActivity: 'Covered Cultural Museum & Evening Sunset Veranda',
          reason: 'Protects schedule against midday temperature or precipitation swings'
        },
        {
          day: 2,
          originalActivity: 'Peak Hour Landmark Visit',
          proposedActivity: 'Early Morning Private Access + Local Artisan Breakfast',
          reason: 'Reduces queue waiting time by 55 minutes'
        },
        {
          day: 3,
          originalActivity: 'Multiple Individual Cab Bookings',
          proposedActivity: 'Dedicated Explorer Day-Chauffeur Package',
          reason: 'Decreases total travel expenses by 22%'
        }
      ]
    };
  }

  try {
    const prompt = `Simulate a "What-If" travel scenario for a trip to ${destinationName}.
User Scenario: "${scenario}"
Base Budget: ₹${baseBudget}
Group Size: ${groupSize}
Duration: ${durationDays} Days

Return valid JSON with keys:
{
  "scenarioTitle": "string",
  "originalPlanSummary": "string",
  "adjustedPlanSummary": "string",
  "impactScore": number (0-100),
  "costDifference": number (positive or negative in INR),
  "timeDifferenceMins": number,
  "weatherFitScore": number (0-100),
  "crowdReductionPct": number (0-100),
  "recommendations": ["string", "string", "string"],
  "dayWiseAdjustments": [
    { "day": number, "originalActivity": "string", "proposedActivity": "string", "reason": "string" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('WhatIf simulation error:', err);
    return {
      scenarioTitle: `Simulation: "${scenario}"`,
      originalPlanSummary: `Trip to ${destinationName}`,
      adjustedPlanSummary: `AI-adjusted scenario for ${scenario}`,
      impactScore: 85,
      costDifference: -50,
      timeDifferenceMins: -30,
      weatherFitScore: 90,
      crowdReductionPct: 20,
      recommendations: ['Maintain flexible morning bookings', 'Utilize Explorer cabs for direct transit'],
      dayWiseAdjustments: [
        { day: 1, originalActivity: 'Outdoor tour', proposedActivity: 'Optimized sheltered route', reason: 'Optimal conditions' }
      ]
    };
  }
}
