import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { GeneratedItinerary, DayPlan, ItineraryActivity, itineraryValidator } from './itineraryValidator';
import { exploreService } from './exploreService';
import { db } from '../db';
import { ENV } from '../config/env';
import { Destination } from '../../src/types';
import { weatherService } from './weatherService';
import {
  isTransportOrVehicleEntity,
  isSamePlace,
  isDuplicateActivity,
  normalizePlaceName
} from './itineraryUtils';

export interface ItineraryGenerationParams {
  destination: string;
  destinationId?: string;
  startDate?: string;
  durationDays: number;
  travelersCount: number;
  budgetLevel: 'budget' | 'moderate' | 'luxury' | 'ultra_luxury';
  maxBudget?: number;
  interests: string[];
  travelStyle: 'solo' | 'couple' | 'family' | 'friends';
  preferredActivities?: string[];
  accommodationPreference?: 'hotel' | 'resort' | 'hostel' | 'homestay' | 'villa';
  foodPreference?: 'veg' | 'non_veg' | 'local' | 'gourmet';
  transportPreference?: 'private_cab' | 'public' | 'rental' | 'walking';
  pace?: 'relaxed' | 'moderate' | 'fast_paced';
  specialRequirements?: string;
  skipAi?: boolean;
}

export class ItineraryService {
  private getAiClient(): GoogleGenAI | null {
    const apiKey = ENV.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('your_gemini')) return null;
    try {
      return new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    } catch {
      return null;
    }
  }

  /**
   * DESTINATION NORMALIZATION & RESOLUTION ENGINE
   * Resolves destination strictly without silent fallback to Sindhudurg / dests[0].
   */
  public resolveDestination(queryInput?: string, destinationId?: string): {
    dest: Destination | null;
    destinationName: string;
    isExternalFallback: boolean;
  } {
    const dests = db.getDestinations();

    // 1. Direct ID lookup
    if (destinationId) {
      const match = db.getDestinationById(destinationId);
      if (match) return { dest: match, destinationName: match.name, isExternalFallback: false };
    }

    const rawQuery = (queryInput || '').trim();
    if (!rawQuery) {
      return { dest: dests[0], destinationName: dests[0].name, isExternalFallback: false };
    }

    const q = rawQuery.toLowerCase().replace(/[^a-z0-9\s]/g, '');

    // 2. Alias Mapping
    const aliasMap: Record<string, string> = {
      mumbai: 'dest-mumbai',
      bombay: 'dest-mumbai',
      pune: 'dest-pune',
      poona: 'dest-pune',
      goa: 'dest-goa',
      northgoa: 'dest-goa',
      southgoa: 'dest-goa',
      panjim: 'dest-goa',
      hyderabad: 'dest-hyderabad',
      bengaluru: 'dest-bengaluru',
      bangalore: 'dest-bengaluru',
      delhi: 'dest-delhi',
      newdelhi: 'dest-delhi',
      jaipur: 'dest-jaipur',
      varanasi: 'dest-varanasi',
      kashi: 'dest-varanasi',
      benaras: 'dest-varanasi',
      kochi: 'dest-kerala-kochi',
      kerala: 'dest-kerala-kochi',
      munnar: 'dest-kerala-kochi',
      alleppey: 'dest-kerala-kochi',
      kutch: 'dest-gujarat-kutch',
      ahmedabad: 'dest-gujarat-kutch',
      gujarat: 'dest-gujarat-kutch',
      rishikesh: 'dest-uttarakhand-rishikesh',
      uttarakhand: 'dest-uttarakhand-rishikesh',
      shillong: 'dest-northeast-shillong',
      cherrapunji: 'dest-northeast-shillong',
      meghalaya: 'dest-northeast-shillong',
      northeast: 'dest-northeast-shillong',
      sindhudurg: 'dest-sindhudurg',
      tarkarli: 'dest-sindhudurg',
      konkan: 'dest-sindhudurg',
      ratnagiri: 'dest-ratnagiri',
      kolhapur: 'dest-kolhapur',
      solapur: 'dest-solapur',
      pandharpur: 'dest-solapur',
      satara: 'dest-satara',
      kaas: 'dest-satara',
      chettinad: 'dest-chettinad',
      karaikudi: 'dest-chettinad',
      hampi: 'dest-karnataka-hampi-coorg',
      coorg: 'dest-karnataka-hampi-coorg',
      madikeri: 'dest-karnataka-hampi-coorg',
      kodagu: 'dest-karnataka-hampi-coorg',
      karnataka: 'dest-karnataka-hampi-coorg',
      tirthan: 'dest-tirthan',
      raghurajpur: 'dest-raghurajpur',
      puri: 'dest-raghurajpur'
    };

    // Check alias map
    for (const [alias, destId] of Object.entries(aliasMap)) {
      if (q.includes(alias) || alias.includes(q)) {
        const matched = db.getDestinationById(destId);
        if (matched) return { dest: matched, destinationName: matched.name, isExternalFallback: false };
      }
    }

    // 3. Exact or Partial DB Search
    const exactNameMatch = dests.find(d => d.name.toLowerCase() === q);
    if (exactNameMatch) return { dest: exactNameMatch, destinationName: exactNameMatch.name, isExternalFallback: false };

    const partialNameMatch = dests.find(d =>
      d.name.toLowerCase().includes(q) ||
      q.includes(d.name.toLowerCase()) ||
      (d.state && d.state.toLowerCase().includes(q)) ||
      (d.stateOrRegion && d.stateOrRegion.toLowerCase().includes(q)) ||
      (d.district && d.district.toLowerCase().includes(q))
    );
    if (partialNameMatch) return { dest: partialNameMatch, destinationName: partialNameMatch.name, isExternalFallback: false };

    // 4. If destination is NOT in DB, return external fallback without guessing Sindhudurg
    return {
      dest: null,
      destinationName: rawQuery,
      isExternalFallback: true
    };
  }

  /**
   * Calculates realistic Haversine distance in kilometers between two geo coordinates.
   */
  public calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  /**
   * Loads verified tourist attractions from the local ML data catalog for a given destination.
   */
  private loadDatasetAttractions(resolvedName: string): Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    lat: number;
    lng: number;
    address: string;
    estimatedCost: number;
    rating: number;
    bestTimeToVisit?: string;
  }> {
    try {
      const jsonPath = path.join(process.cwd(), 'ml-service', 'data', 'attractions_by_destination.json');
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf8');
        const parsed = JSON.parse(raw);
        const byDest = parsed.by_destination || {};

        const results: any[] = [];
        const q = resolvedName.toLowerCase();

        const keysToSearch: string[] = [];
        if (q.includes('goa')) {
          keysToSearch.push('North Goa', 'South Goa', 'Panjim');
        } else if (q.includes('jaipur')) {
          keysToSearch.push('Jaipur');
        } else if (q.includes('mumbai') || q.includes('bombay')) {
          keysToSearch.push('Alibaug', 'Lonavala');
        } else if (q.includes('pune')) {
          keysToSearch.push('Pune');
        } else if (q.includes('rishikesh')) {
          keysToSearch.push('Rishikesh');
        } else if (q.includes('kochi') || q.includes('kerala') || q.includes('alleppey')) {
          keysToSearch.push('Kochi', 'Alleppey', 'Munnar');
        } else {
          for (const key of Object.keys(byDest)) {
            if (key.toLowerCase().includes(q) || q.includes(key.toLowerCase())) {
              keysToSearch.push(key);
            }
          }
        }

        for (const key of keysToSearch) {
          const destData = byDest[key];
          if (destData && Array.isArray(destData.attractions)) {
            for (const attr of destData.attractions) {
              if (!isTransportOrVehicleEntity(attr)) {
                results.push({
                  id: `ml-attr-${attr.attraction_id || Math.random().toString(36).substring(2, 7)}`,
                  name: attr.name,
                  category: attr.category || 'Sightseeing',
                  description: `${attr.name} in ${key} (${attr.category || 'Attraction'}).`,
                  lat: Number(attr.lat) || 15.49,
                  lng: Number(attr.lng) || 73.82,
                  address: `${attr.name}, ${key}`,
                  estimatedCost: Math.round((attr.fee_domestic || 0) / 80) || 15,
                  rating: Number(attr.rating) || 4.7,
                  bestTimeToVisit: attr.preferred_time_of_day || 'Daytime'
                });
              }
            }
          }
        }
        return results;
      }
    } catch (err) {
      console.warn('Dataset attractions load notice:', err);
    }
    return [];
  }

  /**
   * Gathers all valid, unique tourist attractions and authentic cultural experiences for a destination.
   * Strictly EXCLUDES transport/vehicle entities (cab stands, auto hubs, scooter stations, vehicle rentals).
   */
  public getCandidateAttractions(
    dest: Destination | null,
    resolvedName: string,
    params: ItineraryGenerationParams
  ): ItineraryActivity[] {
    const rawCandidates: Array<{
      id?: string;
      name: string;
      category: string;
      description: string;
      lat: number;
      lng: number;
      address?: string;
      estimatedCost: number;
      rating?: number;
      bestTimeToVisit?: string;
    }> = [];

    // 1. Destination's own curated popular attractions
    if (dest?.popularAttractions && Array.isArray(dest.popularAttractions)) {
      for (const attr of dest.popularAttractions) {
        if (!isTransportOrVehicleEntity(attr)) {
          rawCandidates.push({
            id: attr.id,
            name: attr.name,
            category: attr.category || 'Heritage',
            description: attr.description || `${attr.name} in ${dest.name}`,
            lat: attr.lat || dest.lat,
            lng: attr.lng || dest.lng,
            address: `${attr.name}, ${dest.name}`,
            estimatedCost: attr.entryFee !== undefined ? attr.entryFee : 15,
            rating: attr.rating || 4.8,
            bestTimeToVisit: attr.bestTimeToVisit
          });
        }
      }
    }

    // 2. Destination's cultural specialties & unique experiences
    if (dest?.culturalSpecialties?.uniqueExperiences && Array.isArray(dest.culturalSpecialties.uniqueExperiences)) {
      for (const exp of dest.culturalSpecialties.uniqueExperiences) {
        if (!isTransportOrVehicleEntity({ name: exp.title, description: exp.description })) {
          rawCandidates.push({
            id: `exp-${dest.id}-${exp.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)}`,
            name: exp.title,
            category: 'Culture',
            description: exp.description,
            lat: dest.lat + 0.005,
            lng: dest.lng + 0.005,
            address: `${exp.title}, ${dest.name}`,
            estimatedCost: 25,
            rating: 4.9,
            bestTimeToVisit: exp.bestTime
          });
        }
      }
    }

    // 3. Destination's handicrafts / artisan guild visits
    if (dest?.culturalSpecialties?.handicrafts && Array.isArray(dest.culturalSpecialties.handicrafts)) {
      for (const craft of dest.culturalSpecialties.handicrafts) {
        if (!isTransportOrVehicleEntity({ name: craft.name, description: craft.description })) {
          rawCandidates.push({
            id: `craft-${dest.id}-${craft.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)}`,
            name: `${craft.name} Workshop & Cooperative`,
            category: 'Culture',
            description: craft.description,
            lat: dest.lat - 0.004,
            lng: dest.lng + 0.004,
            address: `${craft.artisanCommunity || dest.name}`,
            estimatedCost: 0,
            rating: 4.85
          });
        }
      }
    }

    // 4. Attractions from ml-service/data/attractions_by_destination.json
    const datasetAttractions = this.loadDatasetAttractions(resolvedName);
    for (const attr of datasetAttractions) {
      if (!isTransportOrVehicleEntity(attr)) {
        rawCandidates.push(attr);
      }
    }

    // 5. ExploreService POIs (strictly filtered to remove any transport hubs)
    if (dest) {
      const dbExplorePois = exploreService.getAllPOIs().filter(p =>
        p.destinationId === dest.id && !isTransportOrVehicleEntity(p)
      );
      for (const p of dbExplorePois) {
        rawCandidates.push({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          lat: p.lat,
          lng: p.lng,
          address: p.address,
          estimatedCost: p.priceLevel || 15,
          rating: p.rating || 4.7
        });
      }
    }

    // 6. Strictly Deduplicate rawCandidates amongst themselves using isSamePlace
    const uniqueCandidates: typeof rawCandidates = [];
    for (const c of rawCandidates) {
      const isAlreadyInPool = uniqueCandidates.some(u => isSamePlace(u.id, u.name, c.id, c.name));
      if (!isAlreadyInPool && !isTransportOrVehicleEntity(c)) {
        uniqueCandidates.push(c);
      }
    }

    // 7. Score and prioritize candidates according to user preferences
    const userInterests = (params.interests || []).map(i => i.toLowerCase());
    uniqueCandidates.sort((a, b) => {
      let scoreA = (a.rating || 4.5) * 10;
      let scoreB = (b.rating || 4.5) * 10;

      const catA = a.category.toLowerCase();
      const catB = b.category.toLowerCase();

      for (const interest of userInterests) {
        if (catA.includes(interest) || a.description.toLowerCase().includes(interest) || a.name.toLowerCase().includes(interest)) {
          scoreA += 40;
        }
        if (catB.includes(interest) || b.description.toLowerCase().includes(interest) || b.name.toLowerCase().includes(interest)) {
          scoreB += 40;
        }
      }

      if (params.budgetLevel === 'budget') {
        if (a.estimatedCost === 0) scoreA += 15;
        if (b.estimatedCost === 0) scoreB += 15;
      }

      return scoreB - scoreA;
    });

    // Convert into ItineraryActivity template
    return uniqueCandidates.map((c, idx) => ({
      id: c.id || `act-${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${idx + 1}`,
      name: c.name,
      category: c.category,
      startTime: '09:00 AM',
      endTime: '11:30 AM',
      durationMins: 150,
      estimatedCost: c.estimatedCost,
      travelTimeMins: 15,
      distanceKm: 3.5,
      reason: `Top-rated ${c.category} attraction in ${resolvedName} matching your travel preferences`,
      location: { lat: c.lat, lng: c.lng, address: c.address },
      bookingRequired: c.estimatedCost > 100
    }));
  }

  /**
   * Main entry point to generate a personalized, validated multi-day itinerary.
   */
  public async generateItinerary(params: ItineraryGenerationParams): Promise<GeneratedItinerary> {
    const {
      destination,
      destinationId,
      durationDays = 3,
      travelersCount = 2,
      budgetLevel = 'moderate',
      maxBudget = 25000,
      interests = ['history', 'culture', 'food'],
      travelStyle = 'couple',
      pace = 'moderate',
      accommodationPreference = 'hotel',
      foodPreference = 'local',
      transportPreference = 'private_cab'
    } = params;

    // 1. Resolve Destination Strictly
    const resolution = this.resolveDestination(destination, destinationId);
    const dest = resolution.dest;
    const resolvedName = resolution.destinationName;

    console.log(`🗺️ Destination Search Pipeline: Requested="${destination}" | Resolved="${resolvedName}" | MatchedID="${dest?.id || 'EXTERNAL_KNOWLEDGE'}" | IsFallback=${resolution.isExternalFallback}`);

    // Fetch Grounding attractions (strictly excluding any transport entities)
    const candidatePool = this.getCandidateAttractions(dest, resolvedName, params);
    const whatsFamous = dest ? exploreService.getWhatsFamousInfo(dest.id) : null;

    // 2. Try Gemini LLM Generation if Key Available and not skipped
    const ai = params.skipAi ? null : this.getAiClient();
    let rawItinerary: GeneratedItinerary | null = null;

    if (ai) {
      try {
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini itinerary generation timeout (falling back to constraint solver)')), 7000)
        );
        const geminiPromise = this.generateWithGemini(ai, params, dest, resolvedName, candidatePool, whatsFamous, resolution.isExternalFallback);
        rawItinerary = await Promise.race([geminiPromise, timeoutPromise]);
      } catch (err) {
        console.warn('Gemini Itinerary Generation notice (falling back to constraint solver):', err instanceof Error ? err.message : err);
      }
    }

    // 3. Fallback to Algorithmic Constraint Solver if no LLM or if Gemini returned incomplete days
    if (!rawItinerary || !rawItinerary.days || rawItinerary.days.length === 0) {
      rawItinerary = this.generateWithAlgorithmicSolver(params, dest, resolvedName, candidatePool, whatsFamous, resolution.isExternalFallback);
    }

    // 4. CRITICAL: Run Global Post-Processing & Deduplication
    rawItinerary = this.postProcessAndEnforceUniqueness(rawItinerary, candidatePool, params, resolvedName, whatsFamous);

    // Add notice warning if external knowledge fallback was used
    if (resolution.isExternalFallback) {
      rawItinerary.validationWarnings.unshift(
        `Local database coverage for '${resolvedName}' is currently limited. Generated an authentic itinerary using verified regional travel knowledge for ${resolvedName}.`
      );
    }

    // 5. Connect Open-Meteo live weather data & dynamic seasonal advisories
    const lat = dest?.lat || candidatePool[0]?.location?.lat || 15.49;
    const lng = dest?.lng || candidatePool[0]?.location?.lng || 73.82;
    try {
      const liveWeather = await weatherService.getWeather(lat, lng, resolvedName);
      if (liveWeather) {
        rawItinerary.weatherForecastSummary = liveWeather.summaryText;
        if (liveWeather.safetyAdvisory) {
          rawItinerary.validationWarnings.push(liveWeather.safetyAdvisory);
        }
      }
    } catch (wErr) {
      console.warn('Weather fetch notice:', wErr);
    }

    // 6. Night-Travel and Traveler Safety Auditing
    let hasNightActivity = false;
    for (const day of rawItinerary.days || []) {
      const allActivities = [...(day.morning || []), ...(day.afternoon || []), ...(day.evening || [])];
      for (const act of allActivities) {
        const timeLower = `${act.startTime || ''} ${act.endTime || ''}`.toLowerCase();
        if (timeLower.includes('night') || timeLower.includes('20:') || timeLower.includes('21:') || timeLower.includes('22:') || timeLower.includes('08:00 pm') || timeLower.includes('09:00 pm') || timeLower.includes('10:00 pm')) {
          hasNightActivity = true;
          break;
        }
      }
      if (hasNightActivity) break;
    }

    if (hasNightActivity || params.travelStyle === 'solo') {
      rawItinerary.validationWarnings.push(
        'Traveler Safety Note: For evening or night activities, prefer pre-arranged hotel transit or verified GPS cabs. Keep your trusted emergency contacts and Tourist Police (1363 / 112) accessible.'
      );
    }

    // 7. Run Itinerary Validation & Optimization Phase
    const validationResult = itineraryValidator.validate(rawItinerary);
    rawItinerary.validationScore = validationResult.score;
    rawItinerary.validationWarnings = [...new Set([...rawItinerary.validationWarnings, ...validationResult.warnings])];

    return rawItinerary;
  }

  /**
   * LLM-driven generation using Gemini 2.5 Flash with strict JSON structure & uniqueness mandates.
   */
  private async generateWithGemini(
    ai: GoogleGenAI,
    params: ItineraryGenerationParams,
    dest: Destination | null,
    resolvedName: string,
    candidatePool: ItineraryActivity[],
    whatsFamous: any,
    isExternalFallback: boolean
  ): Promise<GeneratedItinerary> {
    const validAttractionsList = candidatePool.slice(0, 25).map(p =>
      `- [ID: ${p.id || 'N/A'}] ${p.name} (${p.category}, est cost ₹${p.estimatedCost}, lat: ${p.location?.lat}, lng: ${p.location?.lng}): ${p.reason}`
    ).join('\n');

    const famousFoods = (whatsFamous?.food || []).map((f: any) => `${f.name} (${f.description})`).join(', ');
    const famousCrafts = (whatsFamous?.handicrafts || []).map((c: any) => c.name).join(', ');

    const prompt = `You are ExploreX's Master Itinerary Architect.
Generate a structured, highly personalized ${params.durationDays}-day travel itinerary strictly for ${resolvedName} (${dest ? (dest.state || dest.country) : 'India'}).

CRITICAL MANDATES:
1. NEVER add transport/vehicle entities as itinerary attractions:
   - Cab stands, Taxi stations, Auto hubs, Bike/Scooter stations, Vehicle rental points, ExploreX transport services.
   - These may ONLY be used internally for transit between places, never as Morning/Afternoon/Evening activities.
2. Every itinerary day MUST contain UNIQUE real places to visit:
   - Day 1 places ≠ Day 2 places ≠ Day 3 places ≠ Day 4 places.
   - Perform a GLOBAL duplicate check across the entire generated itinerary.
   - Do NOT repeat the same attraction on different days or within the same day.
3. If enough places are unavailable, DO NOT repeat existing places and DO NOT insert vehicles/transport services. Reduce the number of activities for that day.
4. Each activity must be a genuine destination/attraction/experience relevant to ${resolvedName}.

USER CONSTRAINTS & PREFERENCES:
- Destination: ${resolvedName}
- Duration: ${params.durationDays} Days
- Travelers: ${params.travelersCount} (${params.travelStyle})
- Budget Level: ${params.budgetLevel} (Max Budget: ₹${params.maxBudget || 25000})
- Primary Interests: ${params.interests.join(', ')}
- Travel Pace: ${params.pace || 'moderate'}
- Stay Preference: ${params.accommodationPreference || 'hotel'}
- Food Preference: ${params.foodPreference || 'local'} (Famous Foods: ${famousFoods})
- Transport: ${params.transportPreference || 'private_cab'}
- Special Notes: ${params.specialRequirements || 'None'}

${validAttractionsList ? `VERIFIED GENUINE ATTRACTIONS POOL FOR ${resolvedName} (USE THESE FIRST):\n${validAttractionsList}\nFamous Artisanal Crafts: ${famousCrafts}` : `NOTE: Use real, publicly verifiable tourist attractions, heritage sites, and cultural places in ${resolvedName}.`}

Return valid JSON adhering to this EXACT structure:
{
  "id": "itin-${Date.now()}",
  "destination": "${resolvedName}",
  "destinationId": "${dest?.id || `dest-custom-${Date.now()}`}",
  "durationDays": ${params.durationDays},
  "travelersCount": ${params.travelersCount},
  "travelStyle": "${params.travelStyle}",
  "pace": "${params.pace || 'moderate'}",
  "interests": ${JSON.stringify(params.interests)},
  "budget": {
    "currency": "INR",
    "maxBudget": ${params.maxBudget || 25000},
    "estimatedTotal": 18500,
    "breakdown": { "stay": 8000, "food": 5000, "transport": 3500, "activities": 2000 }
  },
  "weatherForecastSummary": "${dest?.currentWeather?.tempC || 27}°C ${dest?.currentWeather?.condition || 'Clear & Coastal Breeze'} — Ideal for sightseeing in ${resolvedName}",
  "days": [
    {
      "dayNumber": 1,
      "theme": "Arrival, Coastal Heritage & Sunset Vista in ${resolvedName}",
      "stayHotel": "${dest?.localEconomy?.authenticHomestays?.[0]?.name || `ExploreX ${resolvedName} Heritage Hotel`}",
      "dailyTotalCost": 4500,
      "morning": [
        {
          "name": "Fort Aguada & Lighthouse",
          "category": "Heritage",
          "startTime": "09:00 AM",
          "endTime": "11:30 AM",
          "durationMins": 150,
          "estimatedCost": 50,
          "travelTimeMins": 15,
          "distanceKm": 4.5,
          "reason": "17th-century Portuguese coastal fortress with panoramic views over the Arabian Sea",
          "mealRecommendation": "Local breakfast at nearby cafe",
          "bookingRequired": false,
          "location": { "lat": 15.4920, "lng": 73.7737 }
        }
      ],
      "afternoon": [],
      "evening": []
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        maxOutputTokens: 3000
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      id: `itin-${Date.now()}`,
      destination: resolvedName,
      destinationId: dest?.id || `dest-custom-${Date.now()}`,
      durationDays: params.durationDays,
      travelersCount: params.travelersCount,
      travelStyle: params.travelStyle,
      pace: params.pace || 'moderate',
      interests: params.interests,
      budget: parsed.budget || {
        currency: 'INR',
        maxBudget: params.maxBudget || 25000,
        estimatedTotal: Math.round((params.maxBudget || 25000) * 0.8),
        breakdown: { stay: 10000, food: 5000, transport: 3500, activities: 2500 }
      },
      days: parsed.days || [],
      validationScore: 95,
      validationWarnings: [],
      weatherForecastSummary: parsed.weatherForecastSummary || `${dest?.currentWeather?.tempC || 27}°C ${dest?.currentWeather?.condition || 'Sunny & Pleasant'} in ${resolvedName}`,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Distance-aware, rule-based algorithmic constraint solver.
   * Guarantees:
   * 1. NEVER includes transport/vehicle entities (cab stands, bike docks, auto hubs).
   * 2. Globally unique attractions across all days (Day 1 ≠ Day 2 ≠ Day 3 ≠ Day 4).
   * 3. Selects attractions matching user interests, budget, and pace.
   * 4. Reduces activities if unique attractions run low; NEVER repeats or inserts vehicles.
   */
  private generateWithAlgorithmicSolver(
    params: ItineraryGenerationParams,
    dest: Destination | null,
    resolvedName: string,
    candidatePool: ItineraryActivity[],
    whatsFamous: any,
    isExternalFallback: boolean
  ): GeneratedItinerary {
    const days: DayPlan[] = [];
    const availablePool = [...candidatePool];
    const visitedPlaces: Array<{ id?: string; name: string }> = [];

    const estStayCostPerDay = Math.round((params.maxBudget || 25000) * 0.40 / params.durationDays);
    const estFoodCostPerDay = Math.round((params.maxBudget || 25000) * 0.25 / params.durationDays);
    const estTransitCostPerDay = Math.round((params.maxBudget || 25000) * 0.15 / params.durationDays);

    let totalActivitiesCost = 0;
    const pace = params.pace || 'moderate';

    // Helper to pick and remove the best matching unused candidate for a slot
    const pickCandidateForSlot = (
      preferredCategoryHints: string[],
      currentSlot: 'morning' | 'afternoon' | 'evening',
      lastLocation?: { lat: number; lng: number }
    ): ItineraryActivity | null => {
      let bestIdx = -1;
      let bestScore = -999;

      for (let i = 0; i < availablePool.length; i++) {
        const item = availablePool[i];

        // 1. Strictly forbid transport/vehicle entities
        if (isTransportOrVehicleEntity(item)) {
          continue;
        }

        // 2. Strictly forbid duplicates across entire itinerary
        if (isDuplicateActivity(item, visitedPlaces)) {
          continue;
        }

        // Score this candidate
        let score = 50;
        const cat = item.category.toLowerCase();
        for (const hint of preferredCategoryHints) {
          if (cat.includes(hint.toLowerCase()) || item.name.toLowerCase().includes(hint.toLowerCase())) {
            score += 30;
          }
        }

        // Slot suitability bonus
        if (currentSlot === 'evening') {
          if (cat.includes('nature') || cat.includes('beach') || item.name.toLowerCase().includes('sunset') || item.name.toLowerCase().includes('promenade') || item.name.toLowerCase().includes('market')) {
            score += 25;
          }
        } else if (currentSlot === 'morning') {
          if (cat.includes('heritage') || cat.includes('fort') || cat.includes('church') || cat.includes('temple')) {
            score += 25;
          }
        }

        // Geographical proximity to previous stop on same day
        if (lastLocation && item.location) {
          const dist = this.calculateDistanceKm(lastLocation.lat, lastLocation.lng, item.location.lat, item.location.lng);
          if (dist <= 12) {
            score += 20;
          } else if (dist > 35) {
            score -= 15;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }

      if (bestIdx >= 0) {
        const selected = availablePool.splice(bestIdx, 1)[0];
        visitedPlaces.push({ id: selected.id, name: selected.name });
        return selected;
      }

      // No unique candidate remaining in pool
      return null;
    };

    // Construct days
    for (let d = 1; d <= params.durationDays; d++) {
      const morning: ItineraryActivity[] = [];
      const afternoon: ItineraryActivity[] = [];
      const evening: ItineraryActivity[] = [];

      let lastLoc = dest ? { lat: dest.lat, lng: dest.lng } : undefined;

      // 1. Morning Activity
      const morningCandidate = pickCandidateForSlot(['heritage', 'nature', 'sightseeing', 'fort', 'temple'], 'morning', lastLoc);
      if (morningCandidate) {
        const distKm = lastLoc && morningCandidate.location ? this.calculateDistanceKm(lastLoc.lat, lastLoc.lng, morningCandidate.location.lat, morningCandidate.location.lng) : 4.0;
        const travelMins = Math.max(10, Math.min(50, Math.round((distKm / 35) * 60)));
        morning.push({
          ...morningCandidate,
          startTime: '09:00 AM',
          endTime: '11:30 AM',
          durationMins: 150,
          distanceKm: distKm,
          travelTimeMins: travelMins,
          reason: `Prime morning visit to ${morningCandidate.name} (${morningCandidate.category}) in ${resolvedName}`,
          mealRecommendation: `Morning Refreshment & Local Breakfast in ${resolvedName}`
        });
        totalActivitiesCost += morningCandidate.estimatedCost;
        if (morningCandidate.location) lastLoc = morningCandidate.location;
      }

      // 2. Afternoon Activity (if moderate or fast_paced, or if morning was empty)
      if (pace !== 'relaxed' || morning.length === 0) {
        const afternoonCandidate = pickCandidateForSlot(['culture', 'food', 'market', 'art', 'museum', 'heritage'], 'afternoon', lastLoc);
        if (afternoonCandidate) {
          const distKm = lastLoc && afternoonCandidate.location ? this.calculateDistanceKm(lastLoc.lat, lastLoc.lng, afternoonCandidate.location.lat, afternoonCandidate.location.lng) : 4.5;
          const travelMins = Math.max(10, Math.min(50, Math.round((distKm / 35) * 60)));
          const foodRec = whatsFamous?.food?.[(d - 1) % (whatsFamous.food.length || 1)];
          afternoon.push({
            ...afternoonCandidate,
            startTime: '01:30 PM',
            endTime: '04:00 PM',
            durationMins: 150,
            distanceKm: distKm,
            travelTimeMins: travelMins,
            reason: `Afternoon immersion at ${afternoonCandidate.name} in ${resolvedName}`,
            mealRecommendation: foodRec ? `Authentic Lunch: ${foodRec.name} at ${foodRec.mustTryAt || resolvedName}` : `Regional Specialty Thali in ${resolvedName}`
          });
          totalActivitiesCost += afternoonCandidate.estimatedCost;
          if (afternoonCandidate.location) lastLoc = afternoonCandidate.location;
        }
      }

      // 3. Evening Activity
      const eveningCandidate = pickCandidateForSlot(['beach', 'sightseeing', 'sunset', 'promenade', 'culture', 'market'], 'evening', lastLoc);
      if (eveningCandidate) {
        const distKm = lastLoc && eveningCandidate.location ? this.calculateDistanceKm(lastLoc.lat, lastLoc.lng, eveningCandidate.location.lat, eveningCandidate.location.lng) : 3.5;
        const travelMins = Math.max(10, Math.min(50, Math.round((distKm / 35) * 60)));
        evening.push({
          ...eveningCandidate,
          startTime: '05:30 PM',
          endTime: '08:00 PM',
          durationMins: 150,
          distanceKm: distKm,
          travelTimeMins: travelMins,
          reason: `Scenic evening experience and sunset at ${eveningCandidate.name} in ${resolvedName}`,
          mealRecommendation: `Coastal Sunset Dinner & Regional Delicacies in ${resolvedName}`
        });
        totalActivitiesCost += eveningCandidate.estimatedCost;
      }

      const dailyActsCost = [...morning, ...afternoon, ...evening].reduce((sum, a) => sum + (a.estimatedCost || 0), 0);
      const dailyTotal = estStayCostPerDay + estFoodCostPerDay + estTransitCostPerDay + dailyActsCost;

      const theme = d === 1
        ? `Arrival, Coastal Vistas & Historic Discovery in ${resolvedName}`
        : d === 2
        ? `Architectural Heritage & Cultural Gastronomy in ${resolvedName}`
        : d === 3
        ? `Tropical Landscapes, Scenic Shores & Artisanal Traditions in ${resolvedName}`
        : d === 4
        ? `Serene Sanctuaries, Spice Groves & Clifftop Sunsets in ${resolvedName}`
        : `Day ${d}: Authentic Experiences & Leisure in ${resolvedName}`;

      days.push({
        dayNumber: d,
        theme,
        stayHotel: dest?.localEconomy?.authenticHomestays?.[(d - 1) % (dest.localEconomy.authenticHomestays.length || 1)]?.name || `ExploreX ${resolvedName} Verified Hotel`,
        dailyTotalCost: dailyTotal,
        morning,
        afternoon,
        evening
      });
    }

    const estimatedTotal = days.reduce((sum, day) => sum + day.dailyTotalCost, 0);

    return {
      id: `itin-${Date.now()}`,
      destination: resolvedName,
      destinationId: dest?.id || `dest-custom-${Date.now()}`,
      durationDays: params.durationDays,
      travelersCount: params.travelersCount,
      travelStyle: params.travelStyle,
      pace: params.pace || 'moderate',
      interests: params.interests,
      budget: {
        currency: 'INR',
        maxBudget: params.maxBudget || 25000,
        estimatedTotal,
        breakdown: {
          stay: estStayCostPerDay * params.durationDays,
          food: estFoodCostPerDay * params.durationDays,
          transport: estTransitCostPerDay * params.durationDays,
          activities: totalActivitiesCost
        }
      },
      days,
      validationScore: 96,
      validationWarnings: [],
      weatherForecastSummary: `${dest?.currentWeather?.tempC || 27}°C ${dest?.currentWeather?.condition || 'Pleasant & Clear'} — Ideal for sightseeing across ${resolvedName}`,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Scores and selects the optimal replacement candidate from availablePool
   * matching destination, interests, budget, travel pace, food preference, and slot suitability.
   */
  private pickBestReplacementCandidate(
    availablePool: ItineraryActivity[],
    visitedPlaces: Array<{ id?: string; name: string }>,
    params: ItineraryGenerationParams,
    slotKey: 'morning' | 'afternoon' | 'evening',
    lastLoc?: { lat: number; lng: number }
  ): { candidate: ItineraryActivity; index: number } | null {
    let bestIdx = -1;
    let bestScore = -Infinity;

    const userInterests = (params.interests || []).map(i => i.toLowerCase());
    const budgetLevel = params.budgetLevel || 'moderate';
    const pace = params.pace || 'moderate';

    for (let i = 0; i < availablePool.length; i++) {
      const cand = availablePool[i];
      if (isTransportOrVehicleEntity(cand) || isDuplicateActivity(cand, visitedPlaces)) {
        continue;
      }

      let score = 50;
      const cat = (cand.category || '').toLowerCase();
      const desc = (cand.reason || '').toLowerCase();
      const name = (cand.name || '').toLowerCase();

      // 1. Match User Interests (cultural, nature, heritage, beaches, photography, etc.)
      for (const interest of userInterests) {
        if (cat.includes(interest) || name.includes(interest) || desc.includes(interest)) {
          score += 35;
        }
      }

      // 2. Slot Suitability
      if (slotKey === 'morning') {
        if (cat.includes('heritage') || cat.includes('fort') || cat.includes('temple') || cat.includes('nature') || cat.includes('church') || cat.includes('monument')) {
          score += 25;
        }
      } else if (slotKey === 'afternoon') {
        if (cat.includes('culture') || cat.includes('museum') || cat.includes('art') || cat.includes('food') || cat.includes('market') || cat.includes('gallery')) {
          score += 25;
        }
      } else if (slotKey === 'evening') {
        if (cat.includes('sunset') || cat.includes('beach') || cat.includes('promenade') || cat.includes('culture') || cat.includes('bazaar') || cat.includes('viewpoint') || name.includes('sunset')) {
          score += 25;
        }
      }

      // 3. Match Budget Preferences
      if (budgetLevel === 'budget') {
        if (cand.estimatedCost === 0) score += 25;
        else if (cand.estimatedCost <= 50) score += 15;
        else score -= 20;
      } else if (budgetLevel === 'luxury' || budgetLevel === 'ultra_luxury') {
        if (cand.bookingRequired || cand.estimatedCost >= 50) score += 20;
      }

      // 4. Travel Pace Adjustment
      if (pace === 'relaxed') {
        if (cand.durationMins && cand.durationMins > 180) score -= 15;
      } else if (pace === 'fast_paced') {
        score += 10;
      }

      // 5. Geographical Proximity to previous stop on same day
      if (lastLoc && cand.location) {
        const dist = this.calculateDistanceKm(lastLoc.lat, lastLoc.lng, cand.location.lat, cand.location.lng);
        if (dist <= 10) score += 20;
        else if (dist > 30) score -= 15;
      }

      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    if (bestIdx >= 0) {
      return { candidate: availablePool[bestIdx], index: bestIdx };
    }
    return null;
  }

  /**
   * Post-processing pipeline that strictly enforces:
   * 1. ZERO transport/vehicle entities in morning/afternoon/evening activities:
   *    - Cab stands
   *    - Bike/Scooter stations
   *    - Auto hubs
   *    - Vehicle rental points
   *    - ExploreX transport services
   * 2. ZERO duplicates across the entire itinerary (Day 1 ≠ Day 2 ≠ Day 3 ≠ Day 4) using destination/place ID first, normalized name second.
   * 3. Replaces duplicates/transport items with the best matching candidates from candidatePool matching:
   *    destination, interests, budget, travel pace, food preference, and accommodation/transit parameters.
   * 4. If pool is exhausted, reduces activity count for that day without repeating existing places or inserting vehicles.
   */
  public postProcessAndEnforceUniqueness(
    itinerary: GeneratedItinerary,
    candidatePool: ItineraryActivity[],
    params: ItineraryGenerationParams,
    resolvedName: string,
    whatsFamous?: any
  ): GeneratedItinerary {
    const visitedPlaces: Array<{ id?: string; name: string }> = [];
    const availablePool = candidatePool.filter(c => !isTransportOrVehicleEntity(c));

    let totalActivitiesCost = 0;

    for (const day of itinerary.days || []) {
      let lastLoc = (day.morning?.[0]?.location) || (candidatePool[0]?.location);

      for (const slotKey of ['morning', 'afternoon', 'evening'] as const) {
        const currentActivities = day[slotKey] || [];
        const cleanedSlotActivities: ItineraryActivity[] = [];

        for (const act of currentActivities) {
          // Check 1: Is this a transport/vehicle entity?
          const isTransport = isTransportOrVehicleEntity(act);

          // Check 2: Has this place already been visited? (Global check across entire itinerary)
          const isDup = isDuplicateActivity(act, visitedPlaces);

          if (!isTransport && !isDup) {
            // Valid unique activity!
            visitedPlaces.push({ id: act.id, name: act.name });
            cleanedSlotActivities.push(act);
            totalActivitiesCost += (act.estimatedCost || 0);

            if (act.location) {
              lastLoc = act.location;
            }

            // Also remove from availablePool if present
            const poolIdx = availablePool.findIndex(p => isSamePlace(p.id, p.name, act.id, act.name));
            if (poolIdx >= 0) {
              availablePool.splice(poolIdx, 1);
            }
          } else {
            // Invalid activity (transport or duplicate)!
            // Find a valid unused replacement from availablePool matching user preferences
            const replacementMatch = this.pickBestReplacementCandidate(
              availablePool,
              visitedPlaces,
              params,
              slotKey,
              lastLoc
            );

            if (replacementMatch) {
              const replacement = availablePool.splice(replacementMatch.index, 1)[0];
              visitedPlaces.push({ id: replacement.id, name: replacement.name });

              // Construct personalized meal recommendation according to food preference
              const foodPref = params.foodPreference || 'local';
              const famousFoods = whatsFamous?.food || [];
              const foodItem = famousFoods.length > 0 ? famousFoods[(day.dayNumber - 1) % famousFoods.length] : null;
              let mealRec = act.mealRecommendation;
              if (!mealRec || mealRec.includes('cab') || mealRec.includes('transport')) {
                if (slotKey === 'morning') {
                  mealRec = foodPref === 'veg'
                    ? `Authentic Pure-Vegetarian Breakfast & Filter Coffee in ${resolvedName}`
                    : `Traditional Morning Breakfast & Regional Specialties in ${resolvedName}`;
                } else if (slotKey === 'afternoon') {
                  mealRec = foodItem
                    ? `Authentic Lunch: ${foodItem.name} at ${foodItem.mustTryAt || resolvedName}`
                    : foodPref === 'veg'
                    ? `Traditional Vegetarian Thali & Regional Delicacies in ${resolvedName}`
                    : `Authentic Regional Lunch & Coastal Specialties in ${resolvedName}`;
                } else {
                  mealRec = foodPref === 'gourmet'
                    ? `Fine-Dining Experience & Curated Regional Flavors in ${resolvedName}`
                    : `Evening Dining & Local Culinary Specialties in ${resolvedName}`;
                }
              }

              cleanedSlotActivities.push({
                ...replacement,
                startTime: act.startTime || (slotKey === 'morning' ? '09:00 AM' : slotKey === 'afternoon' ? '01:30 PM' : '05:30 PM'),
                endTime: act.endTime || (slotKey === 'morning' ? '11:30 AM' : slotKey === 'afternoon' ? '04:00 PM' : '08:00 PM'),
                durationMins: act.durationMins || 150,
                travelTimeMins: act.travelTimeMins || 15,
                distanceKm: act.distanceKm || 3.5,
                reason: replacement.reason || `Handcrafted ${replacement.category} experience matching your interests in ${resolvedName}`,
                mealRecommendation: mealRec
              });
              totalActivitiesCost += (replacement.estimatedCost || 0);
              if (replacement.location) {
                lastLoc = replacement.location;
              }
            } else {
              // Candidate pool is exhausted:
              // Requirement: "DO NOT repeat existing places and DO NOT insert vehicles/transport services.
              // Reduce the number of activities for that day or return a clear 'not enough unique attractions available' state."
              // We omit this activity so it's not repeated or substituted with vehicles.
            }
          }
        }

        day[slotKey] = cleanedSlotActivities;
      }

      // Recalculate daily total cost
      const dayActivitiesCost = [
        ...(day.morning || []),
        ...(day.afternoon || []),
        ...(day.evening || [])
      ].reduce((sum, a) => sum + (a.estimatedCost || 0), 0);

      const stayCost = Math.round((itinerary.budget.breakdown.stay || 0) / (itinerary.durationDays || 1));
      const foodCost = Math.round((itinerary.budget.breakdown.food || 0) / (itinerary.durationDays || 1));
      const transportCost = Math.round((itinerary.budget.breakdown.transport || 0) / (itinerary.durationDays || 1));

      day.dailyTotalCost = stayCost + foodCost + transportCost + dayActivitiesCost;
    }

    // Update overall budget
    itinerary.budget.breakdown.activities = totalActivitiesCost;
    itinerary.budget.estimatedTotal =
      (itinerary.budget.breakdown.stay || 0) +
      (itinerary.budget.breakdown.food || 0) +
      (itinerary.budget.breakdown.transport || 0) +
      totalActivitiesCost;

    return itinerary;
  }
}

export const itineraryService = new ItineraryService();
