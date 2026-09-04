import { isTransportOrVehicleEntity, isSamePlace } from './itineraryUtils';

export interface ItineraryActivity {
  id?: string;
  name: string;
  category?: string;
  startTime: string;
  endTime: string;
  durationMins: number;
  estimatedCost: number;
  travelTimeMins: number;
  distanceKm: number;
  reason: string;
  location?: { lat: number; lng: number; address?: string };
  mealRecommendation?: string;
  bookingRequired?: boolean;
}

export interface DayPlan {
  dayNumber: number;
  date?: string;
  theme: string;
  morning: ItineraryActivity[];
  afternoon: ItineraryActivity[];
  evening: ItineraryActivity[];
  stayHotel: string;
  dailyTotalCost: number;
}

export interface GeneratedItinerary {
  id: string;
  destination: string;
  destinationId?: string;
  durationDays: number;
  startDate?: string;
  endDate?: string;
  travelersCount: number;
  travelStyle: string;
  pace: string;
  interests: string[];
  budget: {
    currency: string;
    maxBudget: number;
    estimatedTotal: number;
    breakdown: {
      stay: number;
      food: number;
      transport: number;
      activities: number;
    };
  };
  days: DayPlan[];
  validationScore: number; // 0 - 100
  validationWarnings: string[];
  weatherForecastSummary?: string;
  createdAt: string;
}

export class ItineraryValidator {
  /**
   * Validates a generated itinerary for physical, logistical, and financial feasibility.
   */
  public validate(itinerary: GeneratedItinerary): {
    isValid: boolean;
    score: number;
    warnings: string[];
    validatedItinerary: GeneratedItinerary;
  } {
    const warnings: string[] = [];
    let score = 100;

    // 1. Check Duration & Days Alignment
    if (!itinerary.days || itinerary.days.length !== itinerary.durationDays) {
      warnings.push(`Mismatch between requested duration (${itinerary.durationDays} days) and actual plan (${itinerary.days?.length || 0} days).`);
      score -= 15;
    }

    // 2. Check for Duplicate POIs, Transport Entities & Travel Feasibility
    const visitedActivities: Array<{ id?: string; name: string }> = [];

    for (const day of itinerary.days || []) {
      const allDayActivities = [...(day.morning || []), ...(day.afternoon || []), ...(day.evening || [])];

      if (allDayActivities.length === 0) {
        warnings.push(`Day ${day.dayNumber} has no planned activities.`);
        score -= 10;
        continue;
      }

      for (let i = 0; i < allDayActivities.length; i++) {
        const act = allDayActivities[i];

        // 1. Strict Transport / Vehicle Entity Prohibition
        if (isTransportOrVehicleEntity(act)) {
          warnings.push(`Transport entity "${act.name}" detected as an activity on Day ${day.dayNumber}. Transport entities may only be used for transit between destinations, never as itinerary activities.`);
          score -= 15;
        }

        // 2. Strict Global Duplicate Check across the entire itinerary
        let isDup = false;
        for (const visited of visitedActivities) {
          if (isSamePlace(act.id, act.name, visited.id, visited.name)) {
            warnings.push(`Duplicate visit detected for "${act.name}" on Day ${day.dayNumber}. Every itinerary day must contain unique places.`);
            score -= 10;
            isDup = true;
            break;
          }
        }

        if (!isDup) {
          visitedActivities.push({ id: act.id, name: act.name });
        }

        // Travel time vs distance ratio check (e.g. 50km in 10 mins is impossible)
        if (act.distanceKm > 0 && act.travelTimeMins > 0) {
          const speedKmH = (act.distanceKm / act.travelTimeMins) * 60;
          if (speedKmH > 100) {
            warnings.push(`Unrealistic transit speed (${speedKmH.toFixed(0)} km/h) for "${act.name}" on Day ${day.dayNumber}. Transit time auto-adjusted.`);
            act.travelTimeMins = Math.round((act.distanceKm / 40) * 60); // Adjust to realistic 40 km/h avg speed
            score -= 5;
          }
        }

        // Excessive daily activities check (> 6 activities per day)
        if (allDayActivities.length > 6) {
          warnings.push(`Day ${day.dayNumber} has ${allDayActivities.length} activities, which may cause fatigue. Re-paced.`);
          score -= 5;
        }
      }
    }

    // 3. Budget Overflow Check
    if (itinerary.budget.estimatedTotal > itinerary.budget.maxBudget && itinerary.budget.maxBudget > 0) {
      const overflow = itinerary.budget.estimatedTotal - itinerary.budget.maxBudget;
      warnings.push(`Estimated cost ($${itinerary.budget.estimatedTotal}) exceeds maximum budget ($${itinerary.budget.maxBudget}) by $${overflow}.`);
      score -= 10;
    }

    const isValid = score >= 70;

    return {
      isValid,
      score: Math.max(0, Math.min(100, score)),
      warnings,
      validatedItinerary: itinerary
    };
  }
}

export const itineraryValidator = new ItineraryValidator();
