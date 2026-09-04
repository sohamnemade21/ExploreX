/**
 * Utility functions for itinerary generation, deduplication, and validation.
 * Strictly enforces that:
 * 1. Transport/vehicle entities are NEVER used as itinerary attractions.
 * 2. Every itinerary day contains UNIQUE real places to visit (global check).
 * 3. Place duplicates are matched using ID first, normalized name second, and distinctive token overlap.
 */

// Generic tourist category words and common city/administrative terms that should not be used as unique proper-noun identifiers
const GENERIC_TOURIST_WORDS = new Set([
  'beach', 'beaches', 'fort', 'forts', 'temple', 'temples', 'church', 'churches',
  'cathedral', 'mosque', 'palace', 'museum', 'garden', 'gardens', 'park', 'parks',
  'island', 'islands', 'waterfall', 'waterfalls', 'lake', 'lakes', 'hill', 'hills',
  'viewpoint', 'point', 'cliff', 'market', 'bazaar', 'street', 'road', 'walk',
  'quarter', 'heritage', 'sanctuary', 'reserve', 'bay', 'cove', 'valley', 'cave',
  'caves', 'trail', 'strip', 'shore', 'shoreline', 'promenade', 'center', 'centre',
  'village', 'town', 'tour', 'visit', 'stop', 'lighthouse', 'pier', 'wharf', 'dock',
  'resort', 'hotel', 'restaurant', 'cafe', 'kitchen', 'shack',
  // Administrative and geographic modifiers
  'city', 'state', 'national', 'royal', 'grand', 'great', 'high', 'court',
  'north', 'south', 'east', 'west', 'central', 'upper', 'lower', 'old', 'new',
  'main', 'gate', 'hall', 'house', 'complex', 'avenue', 'square', 'place', 'area', 'zone',
  // Common Indian destination names (to prevent two different attractions in the same city from colliding on city name)
  'mumbai', 'bombay', 'delhi', 'newdelhi', 'jaipur', 'pune', 'goa', 'panjim',
  'bengaluru', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'varanasi', 'kashi',
  'benaras', 'kochi', 'kerala', 'munnar', 'alleppey', 'agra', 'udaipur', 'jodhpur',
  'sindhudurg', 'kutch', 'gujarat', 'rishikesh', 'haridwar', 'uttarakhand', 'shimla',
  'manali', 'amritsar', 'mysore', 'mysuru', 'hampi', 'madurai', 'pondicherry',
  'puducherry', 'india', 'indian'
]);

/**
 * Checks whether an item or activity is a transport or vehicle entity.
 * Transport entities (cab stands, auto hubs, scooter docks, vehicle rentals, ExploreX transport)
 * may ONLY be used for transit between destinations, NEVER as itinerary attractions.
 */
export function isTransportOrVehicleEntity(item?: {
  id?: string;
  name?: string;
  category?: string;
  description?: string;
  tagline?: string;
}): boolean {
  if (!item) return false;

  const id = (item.id || '').toLowerCase().trim();
  const name = (item.name || '').toLowerCase().trim();
  const cat = (item.category || '').toLowerCase().trim();
  const desc = (item.description || '').toLowerCase().trim();
  const tagline = (item.tagline || '').toLowerCase().trim();

  // 1. Explicit Category matching (loose contains and exact)
  const transportCategories = [
    'cab', 'cabs', 'taxi', 'transport', 'transit', 'vehicle',
    'mobility', 'rental', 'transfer', 'ride', 'auto', 'shuttle', 'logistics'
  ];
  if (transportCategories.some(c => cat.includes(c))) {
    return true;
  }

  // 2. Explicit ID matching
  if (
    id.startsWith('poi-cab-') ||
    id.startsWith('transport-') ||
    id.includes('cab-stand') ||
    id.includes('scooter-') ||
    id.includes('auto-hub') ||
    id.includes('bike-station') ||
    id.includes('vehicle-rental') ||
    id.includes('explorex-transport') ||
    id.includes('explorex-ride') ||
    id.includes('explorex-cab')
  ) {
    return true;
  }

  // 3. Name Pattern Regex
  const transportPatterns = [
    /\bcab\s*(stand|station|hub|point|service|rank|pickup|drop|counter)\b/i,
    /\btaxi\s*(stand|station|hub|point|service|rank|pickup|drop|counter)\b/i,
    /\bauto\s*(hub|stand|station|rickshaw\s*stand|point|rank)\b/i,
    /\bev\s*(electric\s*)?auto\b/i,
    /\b(bike|scooter|bicycle)\s*(&|\+|and)?\s*(scooter|bike)?\s*(station|dock|stand|point|hub|rental)\b/i,
    /\b(vehicle|car|bike|scooter|cab|taxi|automobile)\s*rental\b/i,
    /\brental\s*(point|station|hub|service|agency|desk|center|centre)\b/i,
    /\bexplorer\s*(sedan|xl|suv|cab|bike|scooter|auto)\b/i,
    /\bexplorex\s*(ev|micro-mobility|transport|ride|cab|sedan|xl|transit|mobility)\b/i,
    /\bchauffeured\s*(cab|taxi|car|transit|vehicle)\b/i,
    /\bmicro-mobility\s*(hub|dock|station|point)\b/i,
    /\b(car|bike|scooter|vehicle)\s*hire\b/i,
    /\bself-?drive\s*(rental|car|vehicle)?\b/i
  ];

  for (const pattern of transportPatterns) {
    if (pattern.test(name)) {
      return true;
    }
  }

  // 4. Description/tagline patterns of transport hubs
  const transitDescPhrases = [
    'on-demand ac sedan cabs',
    'explorer xl suv cabs',
    'zero surge pricing',
    'bike & scooter dock',
    'hourly self-ride rentals',
    'gps live-tracked drivers',
    'airport, station & sightseeing transfers',
    'ev auto hub',
    'micro-mobility',
    'vehicle rental',
    'cab stand',
    'taxi stand',
    'auto stand',
    'explorex transport'
  ];

  for (const phrase of transitDescPhrases) {
    if (desc.includes(phrase) || tagline.includes(phrase)) {
      return true;
    }
  }

  return false;
}

/**
 * Normalizes a place name for consistent duplicate comparison.
 * Strips parentheses, punctuation, stopwords, and collapses whitespace.
 */
export function normalizePlaceName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ') // remove parentheses details
    .replace(/\b(the|a|an|of|in|and|&|at|to|for|near|by)\b/gi, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts distinctive proper-noun tokens from a place name.
 */
export function extractDistinctiveTokens(name: string): string[] {
  const normalized = normalizePlaceName(name);
  if (!normalized) return [];

  return normalized
    .split(' ')
    .filter(t => t.length >= 4 && !GENERIC_TOURIST_WORDS.has(t));
}

/**
 * Checks if two places are identical or refer to the exact same tourist attraction.
 * Checks ID match first, normalized name equality second, substring containment third,
 * and distinctive proper-noun overlap fourth.
 */
export function isSamePlace(
  id1?: string,
  name1?: string,
  id2?: string,
  name2?: string
): boolean {
  // 1. Direct ID match
  const cleanId1 = (id1 || '').trim();
  const cleanId2 = (id2 || '').trim();
  if (cleanId1 && cleanId2 && cleanId1 === cleanId2) {
    return true;
  }

  const n1 = normalizePlaceName(name1 || '');
  const n2 = normalizePlaceName(name2 || '');
  if (!n1 || !n2) return false;

  // 2. Exact normalized match
  if (n1 === n2) return true;

  // 3. Substring containment (if long enough)
  if (n1.length >= 6 && n2.length >= 6) {
    if (n1.includes(n2) || n2.includes(n1)) return true;
  }

  // 4. Distinctive proper noun token overlap
  const tokens1 = extractDistinctiveTokens(name1 || '');
  const tokens2 = extractDistinctiveTokens(name2 || '');

  if (tokens1.length > 0 && tokens2.length > 0) {
    for (const t1 of tokens1) {
      if (tokens2.includes(t1)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks whether an activity is a duplicate against already-visited places in the itinerary.
 */
export function isDuplicateActivity(
  act: { id?: string; name: string },
  visitedPlaces: Array<{ id?: string; name: string }>
): boolean {
  for (const visited of visitedPlaces) {
    if (isSamePlace(act.id, act.name, visited.id, visited.name)) {
      return true;
    }
  }
  return false;
}
