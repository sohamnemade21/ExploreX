import { db } from '../db';
import { Destination, ThematicTag } from '../../src/types';

export interface CulturalSpecialtyItem {
  destinationId: string;
  destinationName: string;
  state: string;
  category: 'food' | 'clothing' | 'handicrafts' | 'jewellery' | 'artAndCulture' | 'festivals' | 'localShopping' | 'uniqueExperiences';
  title: string;
  description: string;
  extraInfo?: string;
  giTagged?: boolean;
  image?: string;
}

export function searchCulturalSpecialties(query?: string, category?: string, state?: string): CulturalSpecialtyItem[] {
  const destinations = db.getDestinations();
  const results: CulturalSpecialtyItem[] = [];
  const q = (query || '').toLowerCase().trim();
  const cat = (category || '').toLowerCase().trim();
  const st = (state || '').toLowerCase().trim();

  for (const dest of destinations) {
    if (st && st !== 'all' && (dest.state || '').toLowerCase() !== st && !dest.stateOrRegion.toLowerCase().includes(st)) {
      continue;
    }

    const specs = dest.culturalSpecialties;
    if (!specs) continue;

    // 1. Food
    if (!cat || cat === 'all' || cat === 'food') {
      for (const item of specs.food || []) {
        if (!q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q) || dest.name.toLowerCase().includes(q)) {
          results.push({
            destinationId: dest.id,
            destinationName: dest.name,
            state: dest.state || dest.stateOrRegion,
            category: 'food',
            title: item.name,
            description: item.description,
            extraInfo: item.mustTryAt ? `Must Try At: ${item.mustTryAt}` : (item.isVeg ? '🌱 Pure Veg' : '🍗 Non-Veg Specialist'),
            image: item.image || dest.heroImage
          });
        }
      }
    }

    // 2. Clothing
    if (!cat || cat === 'all' || cat === 'clothing') {
      for (const item of specs.clothing || []) {
        if (!q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || (item.authenticHub || '').toLowerCase().includes(q) || dest.name.toLowerCase().includes(q)) {
          results.push({
            destinationId: dest.id,
            destinationName: dest.name,
            state: dest.state || dest.stateOrRegion,
            category: 'clothing',
            title: item.name,
            description: item.description,
            extraInfo: `Occasion: ${item.occasion}${item.authenticHub ? ` • Hub: ${item.authenticHub}` : ''}`,
            image: item.image || dest.heroImage
          });
        }
      }
    }

    // 3. Handicrafts
    if (!cat || cat === 'all' || cat === 'handicrafts') {
      for (const item of specs.handicrafts || []) {
        if (!q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || (item.artisanCommunity || '').toLowerCase().includes(q) || dest.name.toLowerCase().includes(q)) {
          results.push({
            destinationId: dest.id,
            destinationName: dest.name,
            state: dest.state || dest.stateOrRegion,
            category: 'handicrafts',
            title: item.name,
            description: item.description,
            extraInfo: item.artisanCommunity ? `Artisans: ${item.artisanCommunity}` : undefined,
            giTagged: item.giTagged,
            image: item.image || dest.heroImage
          });
        }
      }
    }

    // 4. Jewellery
    if (!cat || cat === 'all' || cat === 'jewellery') {
      for (const item of specs.jewellery || []) {
        if (!q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || dest.name.toLowerCase().includes(q)) {
          results.push({
            destinationId: dest.id,
            destinationName: dest.name,
            state: dest.state || dest.stateOrRegion,
            category: 'jewellery',
            title: item.name,
            description: item.description,
            extraInfo: item.traditionalSignificance ? `Significance: ${item.traditionalSignificance}` : (item.material ? `Material: ${item.material}` : undefined),
            image: item.image || dest.heroImage
          });
        }
      }
    }

    // 5. Art & Culture
    if (!cat || cat === 'all' || cat === 'artandculture') {
      for (const item of specs.artAndCulture || []) {
        if (!q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.type.toLowerCase().includes(q) || dest.name.toLowerCase().includes(q)) {
          results.push({
            destinationId: dest.id,
            destinationName: dest.name,
            state: dest.state || dest.stateOrRegion,
            category: 'artAndCulture',
            title: item.name,
            description: item.description,
            extraInfo: `Art Form: ${item.type.replace('_', ' ').toUpperCase()}`,
            image: dest.galleryImages?.[0] || dest.heroImage
          });
        }
      }
    }

    // 6. Festivals
    if (!cat || cat === 'all' || cat === 'festivals') {
      for (const item of specs.festivals || []) {
        if (!q || item.name.toLowerCase().includes(q) || item.culturalSignificance.toLowerCase().includes(q) || item.celebrationHighlights.toLowerCase().includes(q) || dest.name.toLowerCase().includes(q)) {
          results.push({
            destinationId: dest.id,
            destinationName: dest.name,
            state: dest.state || dest.stateOrRegion,
            category: 'festivals',
            title: item.name,
            description: `${item.culturalSignificance} (${item.monthOrSeason})`,
            extraInfo: `Highlights: ${item.celebrationHighlights}`,
            image: dest.galleryImages?.[1] || dest.heroImage
          });
        }
      }
    }

    // 7. Local Shopping
    if (!cat || cat === 'all' || cat === 'localshopping') {
      for (const item of specs.localShopping || []) {
        if (!q || item.product.toLowerCase().includes(q) || item.bestMarket.toLowerCase().includes(q) || item.tip.toLowerCase().includes(q) || dest.name.toLowerCase().includes(q)) {
          results.push({
            destinationId: dest.id,
            destinationName: dest.name,
            state: dest.state || dest.stateOrRegion,
            category: 'localShopping',
            title: item.product,
            description: `Market: ${item.bestMarket} • ${item.priceRange}`,
            extraInfo: `Pro-tip: ${item.tip}`,
            image: dest.heroImage
          });
        }
      }
    }

    // 8. Unique Experiences
    if (!cat || cat === 'all' || cat === 'uniqueexperiences') {
      for (const item of specs.uniqueExperiences || []) {
        if (!q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.localImpact.toLowerCase().includes(q) || dest.name.toLowerCase().includes(q)) {
          results.push({
            destinationId: dest.id,
            destinationName: dest.name,
            state: dest.state || dest.stateOrRegion,
            category: 'uniqueExperiences',
            title: item.title,
            description: item.description,
            extraInfo: `Best Time: ${item.bestTime} • Local Impact: ${item.localImpact}`,
            image: dest.heroImage
          });
        }
      }
    }
  }

  return results;
}

export function getAlternativeRecommendations(destinationIdOrName: string) {
  const all = db.getDestinations();
  const searchKey = destinationIdOrName.toLowerCase();
  
  // Find current destination if exists
  const currentDest = all.find(d => d.id === destinationIdOrName || d.name.toLowerCase() === searchKey);
  const targetName = currentDest ? currentDest.name : destinationIdOrName;

  // Find destinations that are marked as alternativeTo this target
  const alternatives = all.filter(d => 
    d.alternativeTo?.some(alt => alt.toLowerCase().includes(targetName.toLowerCase())) ||
    d.whyAlternativeBetter?.replacesFamousSpot.toLowerCase().includes(targetName.toLowerCase())
  );

  return {
    queriedDestination: currentDest || { name: targetName },
    alternatives: alternatives.map(alt => ({
      destination: alt,
      whyBetter: alt.whyAlternativeBetter,
      localImpactScore: alt.localEconomy?.localImpactScore || alt.sustainabilityScore || 90,
      crowdSavedPct: alt.whyAlternativeBetter?.crowdReductionPct || 65,
      costSavedPct: alt.whyAlternativeBetter?.costSavingsPct || 40
    }))
  };
}

export function getIndiaExplorerHierarchy() {
  const all = db.getDestinations().filter(d => !d.isInternational || d.country === 'India');
  
  const stateMap: Record<string, {
    state: string;
    regions: Record<string, {
      region: string;
      districts: Record<string, {
        district: string;
        destinations: { id: string; name: string; popularityTier?: string; tierCategory?: string }[];
      }>;
    }>;
  }> = {};

  for (const d of all) {
    const st = d.state || d.stateOrRegion || 'Other';
    const reg = d.region || 'General';
    const dist = d.district || d.name;

    if (!stateMap[st]) {
      stateMap[st] = { state: st, regions: {} };
    }
    if (!stateMap[st].regions[reg]) {
      stateMap[st].regions[reg] = { region: reg, districts: {} };
    }
    if (!stateMap[st].regions[reg].districts[dist]) {
      stateMap[st].regions[reg].districts[dist] = { district: dist, destinations: [] };
    }

    stateMap[st].regions[reg].districts[dist].destinations.push({
      id: d.id,
      name: d.name,
      popularityTier: d.popularityTier,
      tierCategory: d.tierCategory
    });
  }

  return stateMap;
}
