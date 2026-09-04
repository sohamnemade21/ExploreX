import { GoogleGenAI } from '@google/genai';
import { db } from '../db';
import { ENV } from '../config/env';
import { weatherService } from './weatherService';
import { GeneratedItinerary, DayPlan, ItineraryActivity } from './itineraryValidator';
import { itineraryService } from './itineraryService';
import { balanceTourismDemand } from './demandBalancerService';

export interface ItineraryAdaptationRequest {
  destinationName: string;
  destinationId?: string;
  trigger: 'heavy_rain' | 'extreme_heat' | 'crowd_surge' | 'traffic_congestion' | 'attraction_closed' | 'budget_constraint' | 'manual_request';
  customProblemDescription?: string;
  currentItinerary?: GeneratedItinerary | any;
  weatherData?: any;
}

export interface AdaptedActivityChange {
  dayNumber: number;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  originalActivity: ItineraryActivity;
  replacementActivity: ItineraryActivity;
  reason: string;
}

export interface ItineraryAdaptationResult {
  alertTitle: string;
  problemDetected: string;
  aiExplanation: string;
  preservedActivitiesCount: number;
  replacedActivitiesCount: number;
  changes: AdaptedActivityChange[];
  originalItinerary?: GeneratedItinerary;
  adaptedItinerary: GeneratedItinerary;
  savingsOrBenefits: string;
  demandBalancerAlternative?: {
    recommendedSpot: string;
    crowdReductionPct: number;
    reason: string;
  };
}

/**
 * Categorize if an activity is primarily outdoor vs indoor
 */
function classifyActivityEnvironment(activityName: string, category: string): 'outdoor' | 'indoor' | 'dining' {
  const name = activityName.toLowerCase();
  const cat = (category || '').toLowerCase();

  // Dining
  if (name.includes('restaurant') || name.includes('cafe') || name.includes('thali') || name.includes('breakfast') || name.includes('lunch') || name.includes('dinner') || name.includes('bakery') || cat.includes('culinary') || cat.includes('food')) {
    return 'dining';
  }

  // Definite Outdoor
  if (name.includes('beach') || name.includes('fort') || name.includes('trek') || name.includes('hike') || name.includes('walk') || name.includes('viewpoint') || name.includes('peak') || name.includes('lake') || name.includes('falls') || name.includes('waterfall') || name.includes('garden') || name.includes('safari') || name.includes('scuba') || name.includes('kayak') || name.includes('temple outdoor') || cat.includes('adventure') || cat.includes('nature') || cat.includes('beach')) {
    return 'outdoor';
  }

  // Definite Indoor
  if (name.includes('museum') || name.includes('gallery') || name.includes('palace indoor') || name.includes('workshop') || name.includes('craft') || name.includes('handloom') || name.includes('arcade') || name.includes('hall') || name.includes('center') || name.includes('centre') || cat.includes('culture') || cat.includes('craft') || cat.includes('shopping')) {
    return 'indoor';
  }

  return 'outdoor'; // default assumption for tourism monuments
}

/**
 * Generate rich indoor replacements for a destination
 */
function getIndoorReplacementsForDestination(destName: string, destId?: string): ItineraryActivity[] {
  const q = destName.toLowerCase();
  const dest = destId ? db.getDestinationById(destId) : db.getDestinations().find(d => q.includes(d.name.toLowerCase()));

  // Curated authentic indoor cultural alternatives for top Indian regions
  if (q.includes('pune')) {
    return [
      {
        id: 'repl-pune-1',
        name: 'Raja Dinkar Kelkar Museum & Heritage Gallery',
        category: 'Cultural Museum',
        startTime: '12:00 PM',
        endTime: '02:30 PM',
        durationMins: 150,
        estimatedCost: 100,
        travelTimeMins: 15,
        distanceKm: 3.5,
        reason: 'Sheltered 3-story repository of 20,000+ rare Indian artifacts, historic textiles, and musical instruments.',
        bookingRequired: false,
        location: { lat: 18.5109, lng: 73.8554, address: 'Bajirao Rd, Shukrawar Peth, Pune' }
      },
      {
        id: 'repl-pune-2',
        name: 'Aga Khan Palace Memorial & Covered Archives',
        category: 'Heritage Museum',
        startTime: '02:45 PM',
        endTime: '04:45 PM',
        durationMins: 120,
        estimatedCost: 50,
        travelTimeMins: 20,
        distanceKm: 6.0,
        reason: 'Historic Italian-arched palace complex with indoor Gandhian photo galleries and covered corridors.',
        bookingRequired: false,
        location: { lat: 18.5524, lng: 73.9015, address: 'Nagar Road, Kalyani Nagar, Pune' }
      },
      {
        id: 'repl-pune-3',
        name: 'Maharashtrian Culinary Masterclass & Spice Tasting',
        category: 'Culinary Experience',
        startTime: '01:00 PM',
        endTime: '03:00 PM',
        durationMins: 120,
        estimatedCost: 350,
        travelTimeMins: 10,
        distanceKm: 2.0,
        reason: 'Air-conditioned authentic kitchen demonstration of Puran Poli, Misal rassa spices, and Ukadiche Modak.',
        bookingRequired: true,
        location: { lat: 18.5204, lng: 73.8567, address: 'FC Road Heritage Center, Pune' }
      }
    ];
  }

  if (q.includes('goa')) {
    return [
      {
        id: 'repl-goa-1',
        name: 'Goa Chitra Museum & Ethnographic Heritage Village',
        category: 'Ethnographic Museum',
        startTime: '12:00 PM',
        endTime: '02:30 PM',
        durationMins: 150,
        estimatedCost: 300,
        travelTimeMins: 20,
        distanceKm: 8.0,
        reason: 'Fully sheltered traditional organic farm museum showcasing 4,000+ antique Goan agrarian and lifestyle tools.',
        bookingRequired: false,
        location: { lat: 15.2635, lng: 73.9647, address: 'Benaulim, South Goa' }
      },
      {
        id: 'repl-goa-2',
        name: 'Museum of Christian Art & Santa Monica Cloisters',
        category: 'Heritage Gallery',
        startTime: '02:30 PM',
        endTime: '04:30 PM',
        durationMins: 120,
        estimatedCost: 100,
        travelTimeMins: 15,
        distanceKm: 5.0,
        reason: 'Historic 17th-century convent cloisters housing Indo-Portuguese gold, ivory, and wood carvings.',
        bookingRequired: false,
        location: { lat: 15.5033, lng: 73.9118, address: 'Old Goa Heritage Zone' }
      },
      {
        id: 'repl-goa-3',
        name: 'Houses of Goa Architectural Museum & Mario Gallery',
        category: 'Art & Architecture',
        startTime: '01:30 PM',
        endTime: '03:30 PM',
        durationMins: 120,
        estimatedCost: 150,
        travelTimeMins: 15,
        distanceKm: 4.5,
        reason: 'Unique ship-shaped multi-level indoor museum dedicated to Goan domestic architectural heritage.',
        bookingRequired: false,
        location: { lat: 15.5492, lng: 73.8423, address: 'Porvorim, Goa' }
      }
    ];
  }

  if (q.includes('mumbai')) {
    return [
      {
        id: 'repl-mumbai-1',
        name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS Museum)',
        category: 'National Museum',
        startTime: '12:00 PM',
        endTime: '03:00 PM',
        durationMins: 180,
        estimatedCost: 150,
        travelTimeMins: 15,
        distanceKm: 3.0,
        reason: 'Indo-Saracenic grand museum containing 50,000+ ancient Indian sculptures, miniature paintings, and decorative arts.',
        bookingRequired: false,
        location: { lat: 18.9269, lng: 72.8327, address: 'Fort, Mumbai' }
      },
      {
        id: 'repl-mumbai-2',
        name: 'National Gallery of Modern Art (NGMA) Mumbai',
        category: 'Art Gallery',
        startTime: '03:15 PM',
        endTime: '05:00 PM',
        durationMins: 105,
        estimatedCost: 50,
        travelTimeMins: 10,
        distanceKm: 1.5,
        reason: 'Four-tiered domed air-conditioned auditorium gallery housing masterworks of contemporary Indian artists.',
        bookingRequired: false,
        location: { lat: 18.9272, lng: 72.8319, address: 'Colaba, Mumbai' }
      }
    ];
  }

  if (q.includes('jaipur')) {
    return [
      {
        id: 'repl-jaipur-1',
        name: 'Anokhi Museum of Hand Printing & Block Workshop',
        category: 'Textile Workshop',
        startTime: '12:00 PM',
        endTime: '02:30 PM',
        durationMins: 150,
        estimatedCost: 150,
        travelTimeMins: 15,
        distanceKm: 4.0,
        reason: 'Restored royal haveli displaying historic Rajasthani block-printing with live artisan demonstrations.',
        bookingRequired: false,
        location: { lat: 26.9868, lng: 75.8513, address: 'Amer, Jaipur' }
      },
      {
        id: 'repl-jaipur-2',
        name: 'Albert Hall State Museum & Durbar Gallery',
        category: 'Heritage Museum',
        startTime: '02:45 PM',
        endTime: '05:00 PM',
        durationMins: 135,
        estimatedCost: 100,
        travelTimeMins: 15,
        distanceKm: 3.5,
        reason: 'Oldest state museum of Rajasthan featuring 16 galleries of royal weaponry, carpets, and miniature art.',
        bookingRequired: false,
        location: { lat: 26.9116, lng: 75.8195, address: 'Ram Niwas Garden, Jaipur' }
      }
    ];
  }

  // Generic regional Indian indoor alternatives
  return [
    {
      id: `repl-gen-1-${Date.now()}`,
      name: `${destName} Regional Heritage & Crafts Museum`,
      category: 'Cultural Museum',
      startTime: '12:00 PM',
      endTime: '02:30 PM',
      durationMins: 150,
      estimatedCost: 100,
      travelTimeMins: 15,
      distanceKm: 4.0,
      reason: `Sheltered indoor exploration of ${destName}'s regional folklore, architectural history, and historic arts.`,
      bookingRequired: false
    },
    {
      id: `repl-gen-2-${Date.now()}`,
      name: 'Local Artisan Handloom & GI Craft Workshop',
      category: 'Artisan Workshop',
      startTime: '02:45 PM',
      endTime: '04:45 PM',
      durationMins: 120,
      estimatedCost: 150,
      travelTimeMins: 15,
      distanceKm: 3.0,
      reason: 'Interactive indoor handicraft masterclass supporting master village artisans and traditional looms.',
      bookingRequired: false
    }
  ];
}

/**
 * Generate natural language explanation using OpenAI / Gemini / Algorithmic
 */
async function generateAdaptationExplanation(params: {
  destinationName: string;
  trigger: string;
  problemDescription: string;
  changes: AdaptedActivityChange[];
  preservedCount: number;
}): Promise<string> {
  const { destinationName, trigger, problemDescription, changes, preservedCount } = params;

  const openaiKey = ENV.OPENAI_API_KEY;
  if (openaiKey && !openaiKey.includes('your_') && !openaiKey.includes('placeholder')) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are ExploreX AI Trip Optimizer. Write a clear, warm 2-3 sentence explanation to the traveler explaining WHY specific activities were rescheduled or replaced, and how the rest of their plan was preserved.'
            },
            {
              role: 'user',
              content: `Destination: ${destinationName}\nTrigger: ${trigger}\nProblem: ${problemDescription}\nChanges made: ${changes.map(c => `Replaced "${c.originalActivity.name}" with "${c.replacementActivity.name}" (${c.reason})`).join('; ')}\nPreserved activities: ${preservedCount} activities kept intact.\nProvide a direct, conversational explanation.`
            }
          ],
          temperature: 0.5,
          max_tokens: 250
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content || '';
      }
    } catch {}
  }

  // Deterministic high quality explanation
  if (trigger === 'heavy_rain') {
    return `We moved your midday outdoor sightseeing because heavy rainfall is expected between 12:00 PM and 3:30 PM in ${destinationName}. We replaced outdoor spots with sheltered cultural museums and artisan workshops while keeping your morning activities, dining, and evening schedule completely intact.`;
  }
  if (trigger === 'extreme_heat') {
    return `To protect your comfort during the midday temperature surge (38°C+), we shifted outdoor monument tours to early morning and introduced climate-controlled heritage galleries during peak noon hours.`;
  }
  if (trigger === 'crowd_surge') {
    return `Peak tourist queues detected at major landmark sites. We swapped congested entry points with lesser-known authentic heritage alternatives that reduce wait times by over 45 minutes.`;
  }
  return `Your schedule has been dynamically optimized for ${destinationName} to bypass real-time disruptions while preserving ${preservedCount} of your original activities.`;
}

export class ItineraryAdaptationService {
  /**
   * Main entrypoint for adapting an existing itinerary
   */
  public async adaptItinerary(request: ItineraryAdaptationRequest): Promise<ItineraryAdaptationResult> {
    const { destinationName, trigger, customProblemDescription, currentItinerary, destinationId } = request;

    // 1. Resolve or create base itinerary if not supplied
    let baseItinerary: GeneratedItinerary;
    if (currentItinerary && currentItinerary.days && currentItinerary.days.length > 0) {
      baseItinerary = JSON.parse(JSON.stringify(currentItinerary));
    } else {
      // Generate a clean baseline itinerary
      baseItinerary = await itineraryService.generateItinerary({
        destination: destinationName,
        destinationId,
        durationDays: 3,
        travelersCount: 2,
        budgetLevel: 'moderate',
        interests: ['culture', 'heritage', 'food'],
        travelStyle: 'couple',
        skipAi: true
      });
    }

    const originalCopy: GeneratedItinerary = JSON.parse(JSON.stringify(baseItinerary));
    const adaptedItinerary: GeneratedItinerary = JSON.parse(JSON.stringify(baseItinerary));

    // 2. Determine problem statement & title
    let alertTitle = '🌦️ Weather Alert: Automated Trip Adaptation Activated';
    let problemDetected = `Disruption detected in ${destinationName}: ${customProblemDescription || 'Rain/crowd condition impacting outdoor schedule.'}`;

    if (trigger === 'heavy_rain') {
      alertTitle = '🌧️ Heavy Rainfall Alert: Indoor Cultural Optimization Applied';
      problemDetected = `Moderate-to-heavy rainfall detected in ${destinationName} between 12:00 PM and 04:00 PM. Outdoor sightseeing risk is elevated.`;
    } else if (trigger === 'extreme_heat') {
      alertTitle = '☀️ High Heat Alert: Midday Sun Relief Sequencing';
      problemDetected = `Extreme afternoon heat index (38°C+) in ${destinationName}. Outdoor walking tours relocated.`;
    } else if (trigger === 'crowd_surge') {
      alertTitle = '👥 Tourist Crowd Surge: Sustainable Demand Balancer Activated';
      problemDetected = `Popular attractions at 90%+ capacity load with 60+ min ticket queues.`;
    } else if (trigger === 'traffic_congestion') {
      alertTitle = '🚦 Highway Congestion: Route Cluster Re-sequencing';
      problemDetected = `Main arterial route blocked with 45-minute transit delay.`;
    }

    // 3. Collect available indoor/sheltered replacements
    const indoorPool = getIndoorReplacementsForDestination(destinationName, destinationId);
    let replacementIndex = 0;

    const changes: AdaptedActivityChange[] = [];
    let preservedCount = 0;
    let replacedCount = 0;

    // 4. Adapt Day Plans
    adaptedItinerary.days.forEach((day: DayPlan) => {
      const timeSlots: Array<'morning' | 'afternoon' | 'evening'> = ['morning', 'afternoon', 'evening'];

      timeSlots.forEach(slot => {
        const activities = day[slot] || [];
        day[slot] = activities.map(act => {
          const env = classifyActivityEnvironment(act.name, act.category);

          // For rain or heat, afternoon outdoor activities are the ones impacted
          const isImpacted = (
            (trigger === 'heavy_rain' && (slot === 'afternoon' || slot === 'morning') && env === 'outdoor' && !act.name.toLowerCase().includes('museum')) ||
            (trigger === 'extreme_heat' && slot === 'afternoon' && env === 'outdoor') ||
            (trigger === 'crowd_surge' && env === 'outdoor' && Math.random() > 0.4)
          );

          if (isImpacted && indoorPool.length > 0) {
            const replTemplate = indoorPool[replacementIndex % indoorPool.length];
            replacementIndex++;

            const replacement: ItineraryActivity = {
              ...act,
              id: replTemplate.id,
              name: replTemplate.name,
              category: replTemplate.category,
              durationMins: replTemplate.durationMins || act.durationMins,
              estimatedCost: replTemplate.estimatedCost || act.estimatedCost,
              reason: replTemplate.reason,
              location: replTemplate.location || act.location
            };

            changes.push({
              dayNumber: day.dayNumber,
              timeSlot: slot,
              originalActivity: act,
              replacementActivity: replacement,
              reason: replTemplate.reason
            });

            replacedCount++;
            return replacement;
          } else {
            preservedCount++;
            return act;
          }
        });
      });
    });

    // If no changes were triggered (e.g. all activities were already indoor), force adapt 1 outdoor activity
    if (changes.length === 0 && adaptedItinerary.days.length > 0 && indoorPool.length > 0) {
      const targetDay = adaptedItinerary.days[0];
      const targetSlot = (targetDay.afternoon && targetDay.afternoon.length > 0) ? 'afternoon' : 'morning';
      const orig = targetDay[targetSlot][0];
      if (orig) {
        const repl = indoorPool[0];
        const replacement: ItineraryActivity = {
          ...orig,
          id: repl.id,
          name: repl.name,
          category: repl.category,
          reason: repl.reason
        };
        changes.push({
          dayNumber: targetDay.dayNumber,
          timeSlot: targetSlot,
          originalActivity: orig,
          replacementActivity: replacement,
          reason: repl.reason
        });
        targetDay[targetSlot][0] = replacement;
        replacedCount++;
      }
    }

    // 5. Connect with Demand Balancer for offbeat alternative suggestion
    const demandResults = balanceTourismDemand({
      preferHiddenGems: true,
      avoidOvertouristed: true
    });
    const topGem = demandResults.find(r => r.destination.popularityTier === 'gem' || r.destination.alternativeTo);

    let demandBalancerAlternative = undefined;
    if (topGem) {
      demandBalancerAlternative = {
        recommendedSpot: topGem.destination.name,
        crowdReductionPct: topGem.destination.whyAlternativeBetter?.crowdReductionPct || 60,
        reason: topGem.demandReliefReasoning
      };
    }

    // 6. Generate AI Explanation
    const aiExplanation = await generateAdaptationExplanation({
      destinationName,
      trigger,
      problemDescription: problemDetected,
      changes,
      preservedCount
    });

    const savingsOrBenefits = trigger === 'heavy_rain' 
      ? 'Protected 3.5 hours of ruined outdoor time and guaranteed 100% weather-proof sightseeing.'
      : 'Reduced queue wait times by 40 minutes and optimized transit routes.';

    return {
      alertTitle,
      problemDetected,
      aiExplanation,
      preservedActivitiesCount: preservedCount,
      replacedActivitiesCount: replacedCount,
      changes,
      originalItinerary: originalCopy,
      adaptedItinerary,
      savingsOrBenefits,
      demandBalancerAlternative
    };
  }
}

export const itineraryAdaptationService = new ItineraryAdaptationService();
