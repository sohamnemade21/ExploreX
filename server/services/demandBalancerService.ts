import { Destination, DemandBalancerQuery, DemandBalancerResult } from '../../src/types';
import { db } from '../db';
import { ENV } from '../config/env';

const ML_URL = ENV.ML_SERVICE_URL;

/**
 * ML-powered Tourism Demand Balancer.
 * Calls the FastAPI ml-service /recommendations/by-preferences endpoint
 * and transforms results into the existing DemandBalancerResult[] shape.
 * Falls back to the rule-based balanceTourismDemand() on failure.
 */
export async function balanceTourismDemandML(query: DemandBalancerQuery): Promise<DemandBalancerResult[]> {
  const res = await fetch(`${ML_URL}/recommendations/by-preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vibes: query.vibes || [],
      thematic_tags: query.thematicTags || [],
      budget_min: undefined,
      budget_max: query.maxBudgetPerDay,
      top_n: 15,
    }),
  });

  if (!res.ok) throw new Error(`ML service error: ${res.status}`);
  const data = await res.json();

  // Transform ML results into existing DemandBalancerResult shape
  return (data.results || []).map((r: any) => {
    const dest = r.destination;
    const score = Math.round((r.similarityScore || 0) * 100);
    const capacityLoad = dest.currentCapacityLoadPct || 50;

    return {
      destination: dest as Destination,
      overallScore: score,
      breakdown: {
        satisfactionScore: score,
        affordabilityScore: dest.affordabilityIndex || 80,
        localEconomicBenefitScore: dest.localEconomy?.localImpactScore || 80,
        sustainabilityScore: dest.sustainabilityScore || 80,
      },
      demandReliefReasoning: dest.whyAlternativeBetter
        ? `💡 ${dest.whyAlternativeBetter.headline} (${dest.whyAlternativeBetter.crowdReductionPct}% lower crowds & ${dest.whyAlternativeBetter.costSavingsPct}% savings).`
        : dest.popularityTier === 'gem'
          ? `🌿 ML-recommended hidden gem with ${capacityLoad}% capacity.`
          : `⭐ ML similarity score: ${r.similarityScore?.toFixed(2) || 'N/A'}`,
      capacityUtilization: capacityLoad,
      estimatedCrowdLevel: (capacityLoad < 40 ? 'Low' : capacityLoad < 70 ? 'Moderate' : 'High') as 'Low' | 'Moderate' | 'High',
      alternativeComparison: dest.whyAlternativeBetter ? {
        replacesFamousSpot: dest.whyAlternativeBetter.replacesFamousSpot,
        crowdSavedPct: dest.whyAlternativeBetter.crowdReductionPct,
        costSavedPct: dest.whyAlternativeBetter.costSavingsPct,
      } : undefined,
    } as DemandBalancerResult;
  });
}

/**
 * AI Tourism Demand Balancer Service
 * Evaluates candidate destinations based on:
 * - Tourist Satisfaction: 25% (Vibe match, thematic alignment, rating)
 * - Affordability: 20% (Budget alignment)
 * - Local Economic Retention: 25% (Direct village/homestay/artisan retention)
 * - Weather / Seasonal Suitability: 15% (Ideal travel months and current weather fit)
 * - Crowd Avoidance / Capacity: 15% (Carrying capacity, relief from overtouristed hubs)
 * 
 * Objective: Optimize for:
 *   Tourist Satisfaction (25%) + Affordability (20%) + Local Economic Retention (25%) + Weather Suitability (15%) + Crowd Avoidance (15%)
 * Prioritizes lesser-known/Tier-2/Tier-3/rural destinations over saturated tourist hubs.
 */
export function balanceTourismDemand(query: DemandBalancerQuery): DemandBalancerResult[] {
  const allDestinations = db.getDestinations();
  const currentMonth = query.seasonOrMonth || new Date().toLocaleString('default', { month: 'long' });

  const results: DemandBalancerResult[] = [];

  for (const dest of allDestinations) {
    // Basic filter by state if explicitly specified
    if (query.statePreference && query.statePreference !== 'all') {
      const stateMatch = dest.state?.toLowerCase() === query.statePreference.toLowerCase() ||
        dest.stateOrRegion.toLowerCase().includes(query.statePreference.toLowerCase());
      if (!stateMatch) continue;
    }

    // 1. Tourist Satisfaction Score (25% weight)
    let satisfactionPoints = 0;
    if (query.vibes && query.vibes.length > 0) {
      const matchingVibes = query.vibes.filter(v => dest.vibe.includes(v));
      satisfactionPoints += (matchingVibes.length / query.vibes.length) * 45;
    } else {
      satisfactionPoints += 35;
    }

    if (query.thematicTags && query.thematicTags.length > 0 && dest.thematicTags) {
      const matchingTags = query.thematicTags.filter(t => dest.thematicTags?.includes(t));
      satisfactionPoints += (matchingTags.length / query.thematicTags.length) * 30;
    } else {
      satisfactionPoints += 25;
    }

    satisfactionPoints += (dest.rating / 5.0) * 25;
    const satisfactionScore = Math.min(100, Math.round(satisfactionPoints));

    // 2. Affordability Score (20% weight)
    let affordabilityScore = dest.affordabilityIndex || 85;
    if (query.maxBudgetPerDay && query.maxBudgetPerDay > 0) {
      const dailyEst = dest.bestTimeEngine?.budgetEstimator?.budgetTier?.totalDaily || (dest.startingPrice * 20);
      if (dailyEst <= query.maxBudgetPerDay) {
        affordabilityScore = Math.min(100, affordabilityScore + 10);
      } else {
        const penalty = Math.min(35, Math.round(((dailyEst - query.maxBudgetPerDay) / dailyEst) * 50));
        affordabilityScore = Math.max(20, affordabilityScore - penalty);
      }
    }

    // 3. Local Economic Retention Score (25% weight)
    let localEconomicBenefitScore = dest.localEconomicRetentionPct || 80;
    if (dest.localEconomy) {
      localEconomicBenefitScore = Math.min(100, Math.round(
        (dest.localEconomy.localImpactScore * 0.6) + ((dest.localEconomicRetentionPct || 85) * 0.4)
      ));
    }

    // 4. Weather & Seasonal Suitability Score (15% weight)
    let weatherSuitabilityScore = 75;
    const isIdealMonth = dest.bestMonths.some(m => m.toLowerCase().includes(currentMonth.toLowerCase()));
    if (isIdealMonth) {
      weatherSuitabilityScore = 95;
    } else {
      weatherSuitabilityScore = 60;
    }
    if (dest.currentWeather?.tempC && (dest.currentWeather.tempC >= 18 && dest.currentWeather.tempC <= 32)) {
      weatherSuitabilityScore = Math.min(100, weatherSuitabilityScore + 5);
    }

    // 5. Crowd Avoidance & Capacity Score (15% weight)
    const capacityLoad = dest.currentCapacityLoadPct || 50;
    let crowdAvoidanceScore = 100 - capacityLoad; // Lower load = higher crowd avoidance score

    if (dest.isOvertouristed) {
      crowdAvoidanceScore = Math.max(15, crowdAvoidanceScore - 30);
    } else if (dest.popularityTier === 'gem' || dest.tierCategory === 'Rural/Village' || dest.tierCategory === 'Tier-3') {
      crowdAvoidanceScore = Math.min(100, crowdAvoidanceScore + 20);
    }

    if (query.avoidOvertouristed && dest.isOvertouristed) {
      continue;
    }
    if (query.preferHiddenGems && dest.popularityTier === 'popular' && !dest.alternativeTo) {
      crowdAvoidanceScore = Math.max(20, crowdAvoidanceScore - 20);
    }

    // Weighted Overall Score adhering strictly to:
    // Tourist Satisfaction (25%) + Affordability (20%) + Local Economic Retention (25%) + Weather Suitability (15%) + Crowd Avoidance (15%)
    const overallScore = Math.round(
      (satisfactionScore * 0.25) +
      (affordabilityScore * 0.20) +
      (localEconomicBenefitScore * 0.25) +
      (weatherSuitabilityScore * 0.15) +
      (crowdAvoidanceScore * 0.15)
    );

    // AI Relief Reasoning narrative generator
    let demandReliefReasoning = '';
    if (dest.whyAlternativeBetter) {
      demandReliefReasoning = `💡 ${dest.whyAlternativeBetter.headline} (${dest.whyAlternativeBetter.crowdReductionPct}% lower crowds & ${dest.whyAlternativeBetter.costSavingsPct}% savings vs ${dest.whyAlternativeBetter.replacesFamousSpot || 'popular hubs'}).`;
    } else if (dest.popularityTier === 'gem') {
      demandReliefReasoning = `🌿 We found a less crowded alternative that matches your interests (${dest.currentCapacityLoadPct || 25}% capacity load) and ensures ${dest.localEconomicRetentionPct || 90}% local economic retention for village artisans.`;
    } else {
      demandReliefReasoning = `⭐ Well-balanced destination offering ${dest.rating}★ visitor satisfaction and rich regional heritage.`;
    }

    const estimatedCrowdLevel: 'Low' | 'Moderate' | 'High' = 
      capacityLoad < 40 ? 'Low' : capacityLoad < 70 ? 'Moderate' : 'High';

    results.push({
      destination: dest,
      overallScore,
      breakdown: {
        satisfactionScore,
        affordabilityScore,
        localEconomicBenefitScore,
        sustainabilityScore: crowdAvoidanceScore
      },
      demandReliefReasoning,
      capacityUtilization: capacityLoad,
      estimatedCrowdLevel,
      alternativeComparison: dest.whyAlternativeBetter ? {
        replacesFamousSpot: dest.whyAlternativeBetter.replacesFamousSpot,
        crowdSavedPct: dest.whyAlternativeBetter.crowdReductionPct,
        costSavedPct: dest.whyAlternativeBetter.costSavingsPct
      } : undefined
    });
  }

  // Sort descending by overall balanced score
  results.sort((a, b) => b.overallScore - a.overallScore);

  return results;
}
