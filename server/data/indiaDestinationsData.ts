import { Destination } from '../../src/types';

export const INDIA_EXPANDED_DESTINATIONS: Destination[] = [
  // 1. MAHARASHTRA: SINDHUDURG & TARKARLI
  {
    id: 'dest-sindhudurg',
    name: 'Sindhudurg & Tarkarli',
    stateOrRegion: 'Konkan',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Konkan Coast',
    district: 'Sindhudurg',
    thematicTags: ['beaches', 'food', 'adventure', 'heritage', 'culture'],
    tierCategory: 'Tier-3',
    popularityTier: 'gem',
    carryingCapacityDaily: 3500,
    currentCapacityLoadPct: 32,
    isOvertouristed: false,
    localEconomicRetentionPct: 89,
    sustainabilityScore: 94,
    affordabilityIndex: 91,
    tagline: 'Pristine Scuba Waters, Chhatrapati Shivaji Sea Fort & Authentic Malvani Soul',
    description: 'Sindhudurg and Tarkarli offer crystal-clear Arabian Sea waters, pristine white-sand virgin beaches, vibrant coral reefs for scuba diving, and the formidable 17th-century Sindhudurg Sea Fort. A sustainable, culturally rich alternative to crowded party beaches.',
    heroImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['beach', 'adventure', 'culinary', 'heritage', 'nature'],
    rating: 4.9,
    reviewCount: 1420,
    lat: 16.0353,
    lng: 73.4735,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 27,
      condition: 'Coastal Breeze & Sunny',
      icon: 'Sun',
      forecast: 'Clear skies with calm ocean waters',
      airQualityIndex: 22
    },
    safetyScore: {
      overall: 96,
      daySafety: 98,
      nightSafety: 94,
      emergencyContact: '112 / Sindhudurg Coastal Police (+91 2362 228400)',
      advisory: 'Extremely peaceful and welcoming coastal villages.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '4:30 PM - 6:30 PM',
      quietHours: '6:00 AM - 11:00 AM',
      recommendation: 'Take morning 7:30 AM boat rides to Sindhudurg Fort.'
    },
    popularAttractions: [
      {
        id: 'att-sindhu-1',
        name: 'Sindhudurg Fort (Sea Fort)',
        category: 'Heritage',
        rating: 4.92,
        reviewCount: 980,
        estimatedTime: '2.5 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80',
        description: 'Iconic fortress built directly on a rocky island by Chhatrapati Shivaji Maharaj in 1664.',
        lat: 16.0416,
        lng: 73.4589,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 11:00 AM'
      },
      {
        id: 'att-sindhu-2',
        name: 'Tarkarli & Devbagh Scuba Reef',
        category: 'Adventure',
        rating: 4.88,
        reviewCount: 1240,
        estimatedTime: '3 hrs',
        entryFee: 1200,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        description: 'PADI scuba diving center and pristine coral banks with 20ft underwater visibility.',
        lat: 15.9877,
        lng: 73.4912,
        crowdLevel: 'Low',
        bestTimeToVisit: '8:30 AM - 12:00 PM',
        isOffbeat: true
      }
    ],
    localCuisines: ['Malvani Surmai Thali', 'Solkadhi', 'Kombdi Vade', 'Ukdiche Modak'],
    startingPrice: 6500,
    culturalSpecialties: {
      food: [
        { name: 'Malvani Surmai & Prawn Thali', description: 'Fresh Arabian Sea catch shallow-fried in fiery Malvani masala.', mustTryAt: 'Chaitanya Restaurant, Malvan', isVeg: false, tag: 'Signature Seafood' },
        { name: 'Solkadhi', description: 'Digestive beverage made from coconut milk and kokum.', isVeg: true, tag: 'Traditional Drink' }
      ],
      clothing: [],
      handicrafts: [
        { name: 'Sawantwadi Lacquerware Wooden Toys', description: 'Eco-friendly hand-turned wooden toys.', giTagged: true, artisanCommunity: 'Chitari Guild' }
      ],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 2. MAHARASHTRA: MUMBAI (Financial Capital, Colonial Architecture & Street Food)
  {
    id: 'dest-mumbai',
    name: 'Mumbai',
    stateOrRegion: 'Maharashtra',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Konkan / West Coast',
    district: 'Mumbai City',
    thematicTags: ['heritage', 'food', 'shopping', 'culture', 'beaches'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 50000,
    currentCapacityLoadPct: 75,
    isOvertouristed: false,
    localEconomicRetentionPct: 85,
    sustainabilityScore: 82,
    affordabilityIndex: 75,
    tagline: 'The City of Dreams: Gateway of India, Marine Drive Promenade & Street Gastronomy',
    description: 'Mumbai is India’s vibrant financial hub and entertainment capital. Home to UNESCO World Heritage Railway Termini, Victorian Gothic architecture, seaside Queens Necklace promenades, and world-class street food.',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['urban', 'heritage', 'culinary', 'shopping'],
    rating: 4.88,
    reviewCount: 3200,
    lat: 18.9220,
    lng: 72.8347,
    bestMonths: ['November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 29,
      condition: 'Humid & Sunny',
      icon: 'Sun',
      forecast: 'Pleasant evening sea breeze along the coast',
      airQualityIndex: 45
    },
    safetyScore: {
      overall: 92,
      daySafety: 96,
      nightSafety: 90,
      emergencyContact: '112 / Mumbai Police (+91 22 2262 1855)',
      advisory: 'Safe cosmopolitan megacity. Use local cabs or local trains outside peak rush hours.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '8:30 AM - 10:30 AM & 5:30 PM - 8:30 PM (Local Train Rush)',
      quietHours: '11:00 AM - 4:00 PM',
      recommendation: 'Walk Marine Drive at sunset and visit Gateway of India in early morning hours.'
    },
    popularAttractions: [
      {
        id: 'att-mumbai-1',
        name: 'Gateway of India & Taj Mahal Palace',
        category: 'Heritage',
        rating: 4.92,
        reviewCount: 4500,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
        description: 'Triumphant 26-meter basalt arch facing Mumbai Harbor built for King George V in 1911 alongside the historic Taj Hotel.',
        lat: 18.9220,
        lng: 72.8347,
        crowdLevel: 'High',
        bestTimeToVisit: '7:00 AM - 9:30 AM'
      },
      {
        id: 'att-mumbai-2',
        name: 'Marine Drive (Queens Necklace)',
        category: 'Sightseeing',
        rating: 4.95,
        reviewCount: 3800,
        estimatedTime: '1.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80',
        description: '3.6 km C-shaped Boulevard along the Arabian Coast resembling a string of sparkling pearls at night.',
        lat: 18.9438,
        lng: 72.8231,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '5:30 PM - 8:00 PM'
      },
      {
        id: 'att-mumbai-3',
        name: 'Chhatrapati Shivaji Maharaj Terminus (CST)',
        category: 'Heritage',
        rating: 4.89,
        reviewCount: 2900,
        estimatedTime: '1 hr',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=600&q=80',
        description: 'UNESCO World Heritage High Victorian Gothic revival railway station illuminated beautifully every evening.',
        lat: 18.9398,
        lng: 72.8355,
        crowdLevel: 'High',
        bestTimeToVisit: '7:00 PM - 9:00 PM'
      },
      {
        id: 'att-mumbai-4',
        name: 'Elephanta Caves (UNESCO Island)',
        category: 'Heritage',
        rating: 4.86,
        reviewCount: 2100,
        estimatedTime: '4 hrs',
        entryFee: 40,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: '5th-century rock-cut cave temples dedicated to Lord Shiva, accessible by a scenic 1-hour ferry ride from Gateway of India.',
        lat: 18.9633,
        lng: 72.9315,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '9:00 AM - 1:00 PM'
      }
    ],
    localCuisines: ['Vada Pav', 'Pav Bhaji', 'Bombay Duck Fry', 'Bhel Puri at Juhu', 'Bun Maska Chai'],
    startingPrice: 7500,
    culturalSpecialties: {
      food: [
        { name: 'Authentic Bombay Vada Pav', description: 'Spiced potato fritter served in soft white bun with garlic coconut chutney.', mustTryAt: 'Ashok Vada Pav, Dadar / Aram Vada Pav, CST', isVeg: true, tag: 'Iconic Street Food' },
        { name: 'Butter Pav Bhaji', description: 'Mashed spiced vegetable curry cooked on flat iron tawa with toasted butter buns.', mustTryAt: 'Sardar Refreshments, Tardeo / Cannon, CST', isVeg: true, tag: 'Midnight Classic' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [{ name: 'Ganesh Chaturthi', monthOrSeason: 'August-September', culturalSignificance: 'Grand community festival featuring massive eco-friendly idols and Dhol Tasha drums.', celebrationHighlights: 'Visarjan procession at Girgaon Chowpatty' }],
      localShopping: [{ product: 'Colaba Causeway Fashion & Antiques', bestMarket: 'Colaba Causeway Market', priceRange: '₹100 - ₹1,500', tip: 'Friendly bargaining recommended' }],
      uniqueExperiences: []
    }
  },

  // 3. MAHARASHTRA: PUNE (Cultural Capital, Maratha Forts & IT Hub)
  {
    id: 'dest-pune',
    name: 'Pune',
    stateOrRegion: 'Maharashtra',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Western Ghats / Desh',
    district: 'Pune',
    thematicTags: ['heritage', 'food', 'nature', 'culture', 'adventure'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 25000,
    currentCapacityLoadPct: 60,
    isOvertouristed: false,
    localEconomicRetentionPct: 88,
    sustainabilityScore: 89,
    affordabilityIndex: 86,
    tagline: 'Cultural Capital of Maharashtra: Shaniwar Wada Palace, Sahyadri Trekking & Misal Pav',
    description: 'Pune blends rich Maratha empire history with vibrant youth culture and pleasant green weather. Gateway to Sahyadri hill forts, historic Peshwa palaces, and legendary Maharashtrian culinary spots.',
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'mountain', 'culinary', 'cultural'],
    rating: 4.87,
    reviewCount: 2400,
    lat: 18.5204,
    lng: 73.8567,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 25,
      condition: 'Pleasant & Breeze',
      icon: 'Sun',
      forecast: 'Cool pleasant weather perfect for hill fort treks',
      airQualityIndex: 30
    },
    safetyScore: {
      overall: 95,
      daySafety: 98,
      nightSafety: 92,
      emergencyContact: '112 / Pune City Police (+91 20 2612 8888)',
      advisory: 'Extremely safe educational and cultural center.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '5:00 PM - 8:00 PM (FC Road Market)',
      quietHours: '7:00 AM - 11:00 AM',
      recommendation: 'Visit Shaniwar Wada in early morning for cool weather and heritage photography.'
    },
    popularAttractions: [
      {
        id: 'att-pune-1',
        name: 'Shaniwar Wada Palace Fort',
        category: 'Heritage',
        rating: 4.88,
        reviewCount: 3100,
        estimatedTime: '2 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
        description: 'Seat of the Maratha Empire Peshwas built in 1732 featuring massive Delhi Gate ramparts.',
        lat: 18.5196,
        lng: 73.8553,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '9:00 AM - 11:30 AM'
      },
      {
        id: 'att-pune-2',
        name: 'Aga Khan Palace',
        category: 'Heritage',
        rating: 4.91,
        reviewCount: 2100,
        estimatedTime: '1.5 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Italian arches and sprawling lawns where Mahatma Gandhi was incarcerated during the Quit India movement.',
        lat: 18.5529,
        lng: 73.9015,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 1:00 PM'
      },
      {
        id: 'att-pune-3',
        name: 'Sinhagad Fort (Lion Fort)',
        category: 'Adventure',
        rating: 4.94,
        reviewCount: 4200,
        estimatedTime: '4 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: 'Mountaintop fortress 1,300 meters high, famed for Tanaji Malusare’s historic siege and traditional Pithla Bhakri.',
        lat: 18.3663,
        lng: 73.7558,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '6:30 AM - 10:30 AM'
      }
    ],
    localCuisines: ['Puneri Misal Pav', 'Bakarwadi', 'Pithla Bhakri at Sinhagad', 'Mango Mastani'],
    startingPrice: 5500,
    culturalSpecialties: {
      food: [
        { name: 'Puneri Spicy Misal Pav', description: 'Sprouted moth beans curry topped with crunchy farsan, chopped onions, and lemon.', mustTryAt: 'Bedekar Misal / Katairrurr, Sadashiv Peth', isVeg: true, tag: 'Signature Breakfast' },
        { name: 'Chitale Bakarwadi & Mango Mastani', description: 'Crispy savory rolled pinwheels and thick mango ice-cream shake.', mustTryAt: 'Chitale Bandhu Mithaiwale / Sujata Mastani', isVeg: true, tag: 'Famous Snack' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 4. GOA: BEACHES, CHURCHES & HERITAGE
  {
    id: 'dest-goa',
    name: 'Goa',
    stateOrRegion: 'Goa',
    country: 'India',
    isInternational: false,
    state: 'Goa',
    region: 'Konkan Coast',
    district: 'North & South Goa',
    thematicTags: ['beaches', 'food', 'adventure', 'heritage', 'culture'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 40000,
    currentCapacityLoadPct: 65,
    isOvertouristed: false,
    localEconomicRetentionPct: 84,
    sustainabilityScore: 88,
    affordabilityIndex: 82,
    tagline: 'Sun-Kissed Beaches, Portuguese Latin Quarter & Tropical Spice Plantations',
    description: 'Goa features pristine palm-fringed coastlines, UNESCO-listed 16th-century churches of Old Goa, colorful Portuguese heritage quarters in Panjim, water sports, and world-class seafood.',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['beach', 'adventure', 'culinary', 'heritage'],
    rating: 4.91,
    reviewCount: 4800,
    lat: 15.2993,
    lng: 74.1240,
    bestMonths: ['November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 28,
      condition: 'Sunny & Coastal Breeze',
      icon: 'Sun',
      forecast: 'Warm tropical sunshine with pleasant sea breeze',
      airQualityIndex: 20
    },
    safetyScore: {
      overall: 94,
      daySafety: 97,
      nightSafety: 91,
      emergencyContact: '112 / Goa Tourist Police (+91 832 242 8990)',
      advisory: 'Very friendly tourist state. Follow beach lifeguard flags for swimming.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '5:00 PM - 8:00 PM (Baga & Calangute Beach Sunset)',
      quietHours: '7:00 AM - 10:00 AM',
      recommendation: 'Explore Fontainhas Latin Quarter in early morning for quiet photography.'
    },
    popularAttractions: [
      {
        id: 'att-goa-1',
        name: 'Fort Aguada & Lighthouse',
        category: 'Heritage',
        rating: 4.9,
        reviewCount: 3800,
        estimatedTime: '2 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
        description: '17th-century Portuguese fortress standing at Sinquerim Beach overlooking the Arabian Sea.',
        lat: 15.4920,
        lng: 73.7737,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:30 AM - 11:00 AM'
      },
      {
        id: 'att-goa-2',
        name: 'Basilica of Bom Jesus (Old Goa)',
        category: 'Heritage',
        rating: 4.93,
        reviewCount: 4100,
        estimatedTime: '1.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'UNESCO World Heritage baroque church housing the sacred mortal remains of St. Francis Xavier.',
        lat: 15.5009,
        lng: 73.9116,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '9:00 AM - 12:00 PM'
      },
      {
        id: 'att-goa-3',
        name: 'Fontainhas (Latin Quarter, Panjim)',
        category: 'Sightseeing',
        rating: 4.92,
        reviewCount: 2900,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        description: 'Charming Heritage neighborhood with vibrant yellow, blue, and green Portuguese colonial villas.',
        lat: 15.4989,
        lng: 73.8311,
        crowdLevel: 'Low',
        bestTimeToVisit: '7:30 AM - 10:00 AM'
      },
      {
        id: 'att-goa-4',
        name: 'Palolem Beach & Butterfly Island',
        category: 'Nature',
        rating: 4.88,
        reviewCount: 3500,
        estimatedTime: '3 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: 'Crescent-shaped white-sand beach with gentle turquoise surf and dolphin spotting boats.',
        lat: 15.0100,
        lng: 74.0232,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '3:30 PM - 7:00 PM'
      },
      {
        id: 'att-goa-5',
        name: 'Dudhsagar Waterfalls & Jungle Trek',
        category: 'Adventure',
        rating: 4.85,
        reviewCount: 2800,
        estimatedTime: '4 hrs',
        entryFee: 100,
        image: 'https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=600&q=80',
        description: 'Spectacular four-tiered waterfall cascading down 310 meters through dense Western Ghats forest.',
        lat: 15.3144,
        lng: 74.3143,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 1:00 PM'
      },
      {
        id: 'att-goa-6',
        name: 'Chapora Fort & Vagator Sunset Cliff',
        category: 'Heritage',
        rating: 4.86,
        reviewCount: 3200,
        estimatedTime: '1.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80',
        description: 'Iconic red-laterite clifftop fortress offering panoramic views over Vagator beach and Chapora river.',
        lat: 15.6056,
        lng: 73.7360,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '5:00 PM - 6:45 PM'
      },
      {
        id: 'att-goa-7',
        name: 'Baga Beach & Coastal Water Sports',
        category: 'Nature',
        rating: 4.75,
        reviewCount: 4500,
        estimatedTime: '3 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
        description: 'Vibrant golden sand shoreline renowned for parasailing, banana rides, and beachfront shacks.',
        lat: 15.5553,
        lng: 73.7517,
        crowdLevel: 'High',
        bestTimeToVisit: '9:00 AM - 12:30 PM'
      },
      {
        id: 'att-goa-8',
        name: 'Anjuna Wednesday Flea Market & Rocky Coast',
        category: 'Shopping',
        rating: 4.78,
        reviewCount: 2600,
        estimatedTime: '2.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'Legendary beachfront open-air bazaar with handmade souvenirs, spices, jewelry, and acoustic music.',
        lat: 15.5782,
        lng: 73.7410,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '10:00 AM - 2:00 PM'
      },
      {
        id: 'att-goa-9',
        name: 'Cabo de Rama Cliff Fort',
        category: 'Heritage',
        rating: 4.87,
        reviewCount: 1900,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
        description: 'Ancient fortress perched high on a secluded ocean cliff with ruins and dramatic coastal vistas.',
        lat: 15.0886,
        lng: 73.9213,
        crowdLevel: 'Low',
        bestTimeToVisit: '4:00 PM - 6:30 PM'
      },
      {
        id: 'att-goa-10',
        name: 'Agonda Beach & Olive Ridley Sanctuary',
        category: 'Nature',
        rating: 4.9,
        reviewCount: 2100,
        estimatedTime: '2.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: 'Peaceful, wide sandy beach protected as a pristine turtle nesting habitat with relaxed seaside cafes.',
        lat: 15.0442,
        lng: 73.9875,
        crowdLevel: 'Low',
        bestTimeToVisit: '7:00 AM - 10:30 AM'
      },
      {
        id: 'att-goa-11',
        name: 'Sahakari Spice Plantation & Botanical Tour',
        category: 'Nature',
        rating: 4.84,
        reviewCount: 2300,
        estimatedTime: '2.5 hrs',
        entryFee: 500,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        description: 'Lush tropical estate in Ponda with aromatic spices, vanilla pods, medicinal herbs, and Goan buffet.',
        lat: 15.4012,
        lng: 74.0150,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '10:00 AM - 1:30 PM'
      },
      {
        id: 'att-goa-12',
        name: 'Church of Our Lady of the Immaculate Conception',
        category: 'Heritage',
        rating: 4.89,
        reviewCount: 3100,
        estimatedTime: '1 hr',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        description: 'Iconic 16th-century whitewashed church in central Panjim with zigzagging baroque staircases.',
        lat: 15.4985,
        lng: 73.8286,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:30 AM - 11:30 AM'
      },
      {
        id: 'att-goa-13',
        name: 'Reis Magos Fort & Cultural Centre',
        category: 'Heritage',
        rating: 4.82,
        reviewCount: 1700,
        estimatedTime: '1.5 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
        description: 'Restored 1551 fortress on the Mandovi estuary housing art galleries and panoramic gun bastions.',
        lat: 15.4975,
        lng: 73.8080,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 1:00 PM'
      },
      {
        id: 'att-goa-14',
        name: 'Calangute Beach Promenade',
        category: 'Sightseeing',
        rating: 4.74,
        reviewCount: 4200,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: 'The "Queen of Beaches", famous for broad golden sands, bustling handicraft stalls, and sunset walks.',
        lat: 15.5442,
        lng: 73.7553,
        crowdLevel: 'High',
        bestTimeToVisit: '4:30 PM - 7:00 PM'
      },
      {
        id: 'att-goa-15',
        name: 'Colva Beach Promenade & Sunset Pier',
        category: 'Nature',
        rating: 4.77,
        reviewCount: 2400,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
        description: 'Classic South Goa shoreline featuring endless powder-white sand and traditional fishing trawlers.',
        lat: 15.2785,
        lng: 73.9168,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '4:00 PM - 6:30 PM'
      },
      {
        id: 'att-goa-16',
        name: 'Divar Island Portuguese Village & Sola Walk',
        category: 'Heritage',
        rating: 4.88,
        reviewCount: 1200,
        estimatedTime: '2.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        description: 'Serene island in Mandovi river accessible by ferry, dotted with paddy fields and ancient villas.',
        lat: 15.5167,
        lng: 73.9000,
        crowdLevel: 'Low',
        bestTimeToVisit: '8:00 AM - 11:00 AM'
      },
      {
        id: 'att-goa-17',
        name: 'Se Cathedral & Convent of St. Francis of Assisi',
        category: 'Heritage',
        rating: 4.91,
        reviewCount: 2900,
        estimatedTime: '1.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'One of the largest churches in Asia, built in Portuguese-Manueline style housing the famous Golden Bell.',
        lat: 15.5035,
        lng: 73.9129,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '10:00 AM - 1:00 PM'
      },
      {
        id: 'att-goa-18',
        name: 'Dr. Salim Ali Bird Sanctuary Mangrove Trail',
        category: 'Nature',
        rating: 4.83,
        reviewCount: 1400,
        estimatedTime: '2 hrs',
        entryFee: 20,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
        description: 'Pristine estuarine mangrove sanctuary on Chorão Island harboring rare migratory birds and mudskippers.',
        lat: 15.5133,
        lng: 73.8644,
        crowdLevel: 'Low',
        bestTimeToVisit: '6:30 AM - 9:30 AM'
      },
      {
        id: 'att-goa-19',
        name: 'Morjim Beach & Ashvem Serene Dunes',
        category: 'Nature',
        rating: 4.86,
        reviewCount: 2100,
        estimatedTime: '2.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: 'Tranquil northern coastline with shallow sandbars, scenic driftwood shores, and calm atmosphere.',
        lat: 15.6172,
        lng: 73.7342,
        crowdLevel: 'Low',
        bestTimeToVisit: '3:00 PM - 6:30 PM'
      },
      {
        id: 'att-goa-20',
        name: 'Shri Mangeshi Temple & Heritage Enclave',
        category: 'Heritage',
        rating: 4.89,
        reviewCount: 2700,
        estimatedTime: '1.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
        description: '450-year-old temple complex featuring a majestic seven-storeyed octagonal deepstambha (lamp tower).',
        lat: 15.4381,
        lng: 73.9686,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 11:30 AM'
      }
    ],
    localCuisines: ['Goan Fish Curry Rice', 'Pork Vindaloo', 'Bebinca', 'Goan Feni', 'Poi Bread'],
    startingPrice: 8500,
    culturalSpecialties: {
      food: [
        { name: 'Authentic Goan Fish Curry Rice', description: 'Fresh kingfish cooked in coconut milk, dried red chillies, and kokum.', mustTryAt: 'Fat Fish, Baga / Ritz Classic, Panjim', isVeg: false, tag: 'Iconic Staple' },
        { name: 'Traditional Bebinca', description: '7-layered coconut milk and egg-yolk baked dessert spiced with cardamom.', mustTryAt: 'Viva Panjim Bakeries', isVeg: false, tag: 'Festive Dessert' },
        { name: 'Pork Vindaloo with Hot Poi Bread', description: 'Spicy, tangy slow-cooked pork prepared with Goan feni, cider vinegar, and garlic.', mustTryAt: 'Florentine Bar & Restaurant', isVeg: false, tag: 'Heritage Portuguese-Goan' },
        { name: 'Fresh Crab Xacuti & Kokum Kadhi', description: 'Succulent mud crabs simmered in roasted spices, fresh coconut, and tamarind.', mustTryAt: "Britto's, Baga Beach", isVeg: false, tag: 'Coastal Delicacy' }
      ],
      clothing: [],
      handicrafts: [
        { name: 'Goan Terracotta & Coconut Shell Crafts', description: 'Artisanal handcrafted home decor, lamps, and pottery carved by local coastal craftsmen.', artisanCommunity: 'Bicholim Artisan Village, Goa', giTagged: false }
      ],
      jewellery: [],
      artAndCulture: [],
      festivals: [
        { name: 'Goa Carnival & Latin Street Parade', monthOrSeason: 'February', culturalSignificance: 'Pre-Lent Portuguese cultural street carnival with music, floats, and King Momo procession.', celebrationHighlights: 'Grand parade along Panjim Mandovi promenade' }
      ],
      localShopping: [
        {
          product: 'Handmade Bohemian Beachwear & Spices',
          bestMarket: 'Anjuna Wednesday Coastal Flea Market',
          priceRange: '₹300 - ₹2,500',
          tip: 'Bargain politely and visit before noon for the best selection'
        }
      ],
      uniqueExperiences: [
        { title: 'Mandovi River Sunset Cruise & Goan Folk Dance', description: 'Scenic 1-hour Mandovi river cruise showcasing Dekhnni and Fugdi folk dance performances.', bestTime: '05:30 PM - 07:00 PM', localImpact: 'Direct support for Goan folk dance troupes' },
        { title: 'Sahakari Organic Spice Plantation Guided Walk', description: 'Aromatic walk through cardamom, peri-peri, betel nut, and vanilla groves with traditional Goan buffet.', bestTime: '10:00 AM - 01:30 PM', localImpact: 'Preserves traditional Ponda agro-tourism' },
        { title: 'Divar Island Sola Heritage Cycling Trail', description: 'Cycle through sleepy riverside villages, baroque chapels, and scenic tidal waterways on Divar Island.', bestTime: '07:00 AM - 09:30 AM', localImpact: 'Eco-tourism with zero carbon emissions' }
      ]
    }
  },

  // 5. TELANGANA: HYDERABAD (City of Pearls, Charminar & Royal Palaces)
  {
    id: 'dest-hyderabad',
    name: 'Hyderabad',
    stateOrRegion: 'Telangana',
    country: 'India',
    isInternational: false,
    state: 'Telangana',
    region: 'Deccan Plateau',
    district: 'Hyderabad',
    thematicTags: ['heritage', 'food', 'shopping', 'culture'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 30000,
    currentCapacityLoadPct: 62,
    isOvertouristed: false,
    localEconomicRetentionPct: 88,
    sustainabilityScore: 86,
    affordabilityIndex: 85,
    tagline: 'City of Pearls: Historic Charminar, Golconda Acoustic Fort & World-Famous Biryani',
    description: 'Hyderabad combines 400-year-old Qutb Shahi and Nizam royal heritage with a booming IT hub. World-renowned for authentic Hyderabadi Dum Biryani, pearl bazaars, and massive stone fortresses.',
    heroImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'culinary', 'urban', 'shopping'],
    rating: 4.89,
    reviewCount: 3100,
    lat: 17.3850,
    lng: 78.4867,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 28,
      condition: 'Sunny & Clear',
      icon: 'Sun',
      forecast: 'Clear blue skies with warm sunny afternoon',
      airQualityIndex: 38
    },
    safetyScore: {
      overall: 94,
      daySafety: 97,
      nightSafety: 91,
      emergencyContact: '112 / Hyderabad Police (+91 40 2785 2435)',
      advisory: 'Extremely safe and hospitable city.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '6:00 PM - 9:30 PM (Laad Bazaar & Charminar Night Market)',
      quietHours: '8:00 AM - 11:00 AM',
      recommendation: 'Visit Golconda Fort at 8:30 AM to experience the acoustic clapping hall in peace.'
    },
    popularAttractions: [
      {
        id: 'att-hyd-1',
        name: 'Charminar & Laad Bazaar',
        category: 'Heritage',
        rating: 4.92,
        reviewCount: 5200,
        estimatedTime: '2 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        description: '1591 landmark mosque featuring four ornate 56-meter minarets surrounded by traditional pearl and lac bangle markets.',
        lat: 17.3616,
        lng: 78.4747,
        crowdLevel: 'High',
        bestTimeToVisit: '8:00 AM - 10:30 AM'
      },
      {
        id: 'att-hyd-2',
        name: 'Golconda Fort',
        category: 'Heritage',
        rating: 4.93,
        reviewCount: 4100,
        estimatedTime: '3 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
        description: 'Imposing medieval fortress with miraculous acoustic architecture where a handclap at the gate reverberates at the hilltop palace 1 km away.',
        lat: 17.3833,
        lng: 78.4011,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:30 AM - 11:30 AM'
      }
    ],
    localCuisines: ['Hyderabadi Dum Biryani', 'Haleem', 'Double Ka Meetha', 'Osmania Biscuits with Irani Chai'],
    startingPrice: 8250,
    culturalSpecialties: {
      food: [
        { name: 'Authentic Hyderabadi Dum Biryani', description: 'Fragrant basmati rice slow-cooked on Dum with marinated meat, saffron, and fried onions.', mustTryAt: 'Bawarchi, RTC X Roads / Paradise / Shadab', isVeg: false, tag: 'World Famous' },
        { name: 'Irani Chai with Osmania Biscuits', description: 'Thick, creamy cardamom tea paired with buttery savory Osmania biscuits.', mustTryAt: 'Nimrah Cafe facing Charminar', isVeg: true, tag: 'Heritage Breakfast' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 6. KARNATAKA: BENGALURU (Garden City, Tech Capital & Craft Breweries)
  {
    id: 'dest-bengaluru',
    name: 'Bengaluru',
    stateOrRegion: 'Karnataka',
    country: 'India',
    isInternational: false,
    state: 'Karnataka',
    region: 'Deccan Plateau',
    district: 'Bengaluru Urban',
    thematicTags: ['heritage', 'food', 'nature', 'shopping', 'culture'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 45000,
    currentCapacityLoadPct: 70,
    isOvertouristed: false,
    localEconomicRetentionPct: 86,
    sustainabilityScore: 88,
    affordabilityIndex: 80,
    tagline: 'Garden City & Tech Capital: Royal Bangalore Palace, Lalbagh Gardens & Filter Coffee',
    description: 'Bengaluru features pleasant year-round weather, historic royal palaces, sprawling botanical gardens, iconic South Indian filter coffee joints, and vibrant microbreweries.',
    heroImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['urban', 'nature', 'culinary', 'shopping'],
    rating: 4.88,
    reviewCount: 3400,
    lat: 12.9716,
    lng: 77.5946,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 24,
      condition: 'Pleasant & Mild',
      icon: 'Sun',
      forecast: 'Cool pleasant weather with light afternoon breeze',
      airQualityIndex: 28
    },
    safetyScore: {
      overall: 95,
      daySafety: 98,
      nightSafety: 92,
      emergencyContact: '112 / Bengaluru Police (+91 80 2294 2222)',
      advisory: 'Extremely safe tech city with welcoming cosmopolitan culture.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '8:30 AM - 10:30 AM & 5:30 PM - 8:30 PM (Traffic Peak)',
      quietHours: '11:00 AM - 3:30 PM',
      recommendation: 'Visit Lalbagh Botanical Garden at 7:00 AM for fresh air and bird watching.'
    },
    popularAttractions: [
      {
        id: 'att-blr-1',
        name: 'Bangalore Palace',
        category: 'Heritage',
        rating: 4.89,
        reviewCount: 2800,
        estimatedTime: '2 hrs',
        entryFee: 230,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
        description: '1878 Tudor-style royal palace featuring fortified towers, ornate wood carvings, and royal memorabilia.',
        lat: 13.0003,
        lng: 77.5921,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '10:00 AM - 1:00 PM'
      },
      {
        id: 'att-blr-2',
        name: 'Lalbagh Botanical Garden & Glass House',
        category: 'Nature',
        rating: 4.92,
        reviewCount: 4100,
        estimatedTime: '2 hrs',
        entryFee: 30,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: '240-acre botanical garden commissioned by Hyder Ali in 1760 featuring a historic London-style Glass House.',
        lat: 12.9507,
        lng: 77.5848,
        crowdLevel: 'Low',
        bestTimeToVisit: '6:30 AM - 9:30 AM'
      }
    ],
    localCuisines: ['Crispy Benne Dosa', 'South Indian Filter Coffee', 'Bisi Bele Bath', 'Rava Idli'],
    startingPrice: 8800,
    culturalSpecialties: {
      food: [
        { name: 'Malleswaram Butter Masala Dosa & Filter Coffee', description: 'Crispy golden rice crepe smeared with white butter served with frothy decoction filter coffee.', mustTryAt: 'CTR (Shri Sagar), Malleswaram / MTR, Lalbagh', isVeg: true, tag: 'Iconic Breakfast' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 7. DELHI: CAPITAL CITY, MONUMENTS & CHANDNI CHOWK
  {
    id: 'dest-delhi',
    name: 'Delhi',
    stateOrRegion: 'Delhi NCR',
    country: 'India',
    isInternational: false,
    state: 'Delhi',
    region: 'North India',
    district: 'Central & New Delhi',
    thematicTags: ['heritage', 'food', 'shopping', 'culture'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 60000,
    currentCapacityLoadPct: 75,
    isOvertouristed: false,
    localEconomicRetentionPct: 82,
    sustainabilityScore: 80,
    affordabilityIndex: 78,
    tagline: 'Heart of India: Red Fort, Qutub Minar, Humayun Tomb & Chandni Chowk Food Street',
    description: 'Delhi showcases 1,000+ years of empire history through UNESCO World Heritage monuments, broad ceremonial boulevards of New Delhi, and ancient labyrinth bazaar streets of Chandni Chowk.',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'culinary', 'urban', 'shopping'],
    rating: 4.88,
    reviewCount: 5100,
    lat: 28.6139,
    lng: 77.2090,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 22,
      condition: 'Sunny & Pleasant',
      icon: 'Sun',
      forecast: 'Crisp autumn weather ideal for outdoor monument walks',
      airQualityIndex: 65
    },
    safetyScore: {
      overall: 88,
      daySafety: 94,
      nightSafety: 82,
      emergencyContact: '112 / Delhi Police (+91 11 2349 0000)',
      advisory: 'Use metro or verified cabs. Stay on well-lit main boulevards at night.'
    },
    crowdPrediction: {
      currentStatus: 'High',
      peakHours: '11:00 AM - 4:00 PM (Chandni Chowk Market)',
      quietHours: '7:00 AM - 10:00 AM',
      recommendation: 'Visit Qutub Minar at 7:30 AM for quiet morning light and low crowds.'
    },
    popularAttractions: [
      {
        id: 'att-delhi-1',
        name: 'Qutub Minar (UNESCO World Heritage)',
        category: 'Heritage',
        rating: 4.93,
        reviewCount: 6100,
        estimatedTime: '2 hrs',
        entryFee: 40,
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
        description: '73-meter soaring fluted red sandstone minaret built in 1192 alongside the rust-resistant 4th-century Iron Pillar.',
        lat: 28.5245,
        lng: 77.1855,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '7:30 AM - 10:30 AM'
      },
      {
        id: 'att-delhi-2',
        name: 'Humayun’s Tomb (Mughal Precursor to Taj)',
        category: 'Heritage',
        rating: 4.95,
        reviewCount: 4800,
        estimatedTime: '2 hrs',
        entryFee: 40,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Magnificent 1570 garden tomb featuring double domes and Persian charbagh symmetrical water channels.',
        lat: 28.5933,
        lng: 77.2507,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 11:00 AM'
      }
    ],
    localCuisines: ['Delhi Butter Chicken', 'Chandni Chowk Paranthas', 'Chole Bhature', 'Chaat at UPSC'],
    startingPrice: 10450,
    culturalSpecialties: {
      food: [
        { name: 'Old Delhi Chole Bhature & Stuffed Paranthas', description: 'Spiced chickpea curry paired with deep-fried bread and hot stuffed paranthas.', mustTryAt: 'Sita Ram Diwan Chand, Paharganj / Paranthe Wali Gali', isVeg: true, tag: 'Legendary Breakfast' }
      ],
      clothing: [],
      handicrafts: [],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 8. RAJASTHAN: JAIPUR (Pink City, Royal Forts & Palaces)
  {
    id: 'dest-jaipur',
    name: 'Jaipur',
    stateOrRegion: 'Rajasthan',
    country: 'India',
    isInternational: false,
    state: 'Rajasthan',
    region: 'Dhundhar / Royal Rajasthan',
    district: 'Jaipur',
    thematicTags: ['heritage', 'food', 'shopping', 'culture'],
    tierCategory: 'Tier-1',
    popularityTier: 'popular',
    carryingCapacityDaily: 35000,
    currentCapacityLoadPct: 65,
    isOvertouristed: false,
    localEconomicRetentionPct: 87,
    sustainabilityScore: 89,
    affordabilityIndex: 82,
    tagline: 'The Pink City: Amber Fort, Honeycomb Hawa Mahal & Royal Rajput Palaces',
    description: 'Jaipur is the royal capital of Rajasthan, world-famed for pink sandstone architecture, hilltop Amber Fort, honeycomb Hawa Mahal facade, and exquisite block-print textiles and gemstone jewelry.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'culinary', 'cultural', 'shopping'],
    rating: 4.92,
    reviewCount: 4200,
    lat: 26.9124,
    lng: 75.7873,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 26,
      condition: 'Sunny & Warm',
      icon: 'Sun',
      forecast: 'Pleasant desert sunshine with cool evening breezes',
      airQualityIndex: 32
    },
    safetyScore: {
      overall: 95,
      daySafety: 98,
      nightSafety: 91,
      emergencyContact: '112 / Jaipur Tourist Police (+91 141 257 4000)',
      advisory: 'Extremely safe and hospitable royal heritage destination.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '10:00 AM - 1:00 PM (Amber Fort Elephant Gate)',
      quietHours: '7:30 AM - 9:30 AM',
      recommendation: 'Visit Amber Fort at 8:00 AM for cool morning light and effortless entry.'
    },
    popularAttractions: [
      {
        id: 'att-jaipur-1',
        name: 'Amber Fort (Amer Fort)',
        category: 'Heritage',
        rating: 4.96,
        reviewCount: 6500,
        estimatedTime: '3 hrs',
        entryFee: 100,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        description: 'Majestic 1592 hilltop fortress crafted from yellow and pink sandstone featuring the breathtaking Sheesh Mahal (Mirror Palace).',
        lat: 26.9855,
        lng: 75.8513,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 11:00 AM'
      },
      {
        id: 'att-jaipur-2',
        name: 'Hawa Mahal (Palace of Winds)',
        category: 'Heritage',
        rating: 4.91,
        reviewCount: 5100,
        estimatedTime: '1 hr',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        description: '5-story honeycomb facade constructed in 1799 with 953 intricate Jharokha latticed windows.',
        lat: 26.9239,
        lng: 75.8267,
        crowdLevel: 'High',
        bestTimeToVisit: '8:30 AM - 10:30 AM'
      }
    ],
    localCuisines: ['Dal Baati Churma', 'Gatte Ki Sabzi', 'Pyaaz Kachori', 'Ghevar'],
    startingPrice: 6800,
    culturalSpecialties: {
      food: [
        { name: 'Royal Rajasthani Dal Baati Churma', description: 'Hard wheat balls baked over cow dung embers served with ghee and five-lentil Panchmel dal.', mustTryAt: 'Chokhi Dhani / Laxmi Mishthan Bhandar (LMB)', isVeg: true, tag: 'Royal Feast' }
      ],
      clothing: [],
      handicrafts: [
        { name: 'Jaipur Blue Pottery & Block Print (GI Tagged)', description: 'Traditional quartz glaze blue pottery and Sanganeri woodblock textiles.', giTagged: true, artisanCommunity: 'Sanganer Guild' }
      ],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 9. MAHARASHTRA: SOLAPUR & PANDHARPUR (Spiritual Heart & Handloom Capital)
  {
    id: 'dest-solapur',
    name: 'Solapur & Pandharpur',
    stateOrRegion: 'Maharashtra',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Western Maharashtra / Desh',
    district: 'Solapur',
    thematicTags: ['culture', 'heritage', 'spirituality', 'food', 'shopping'],
    tierCategory: 'Tier-2',
    popularityTier: 'gem',
    carryingCapacityDaily: 12000,
    currentCapacityLoadPct: 42,
    isOvertouristed: false,
    localEconomicRetentionPct: 93,
    sustainabilityScore: 92,
    affordabilityIndex: 96,
    tagline: 'Historic Bhuikot Water Fort, Siddheshwar Lake Shrine & GI-Tagged Jacquard Chaddars',
    description: 'The cultural and handloom heart of southern Maharashtra. Solapur is celebrated for the tranquil Siddheshwar Temple in the middle of a holy lake, the double-moated 14th-century Solapur Bhuikot Fort, world-famous GI-tagged jacquard Solapuri Chaddar weavers, fiery Shenga Chutney with Jowar Bhakri, and the revered pilgrimage town of Pandharpur on the Chandrabhaga river.',
    heroImage: '/images/pandharpur_vitthal_rukmini.jpg',
    galleryImages: [
      '/images/pandharpur_vitthal_rukmini.jpg',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'spiritual', 'culinary', 'cultural', 'shopping'],
    rating: 4.82,
    reviewCount: 1680,
    lat: 17.6599,
    lng: 75.9064,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 28,
      condition: 'Clear Sky & Pleasant',
      icon: 'Sun',
      forecast: 'Clear skies and dry pleasant breeze across the lake promenade',
      airQualityIndex: 38
    },
    safetyScore: {
      overall: 93,
      daySafety: 96,
      nightSafety: 90,
      emergencyContact: '112 / Solapur City Police (+91 217 2744600)',
      advisory: 'Safe, warm, and highly hospitable district. Respect sacred temple dress codes.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '09:00 AM - 12:00 PM (Morning Darshan & Weaving Markets)',
      quietHours: '06:00 AM - 08:30 AM & 03:00 PM - 05:00 PM',
      recommendation: 'Visit Siddheshwar Lake Temple during early sunrise for golden reflections.'
    },
    popularAttractions: [
      {
        id: 'att-solapur-1',
        name: 'Siddheshwar Temple & Lake Complex',
        category: 'Heritage',
        rating: 4.9,
        reviewCount: 3200,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
        description: '12th-century shrine dedicated to Yogi Siddharameshwar, standing serenely in the middle of a picturesque lake with 68 Shivalingas.',
        lat: 17.6715,
        lng: 75.9103,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '06:30 AM - 09:30 AM'
      },
      {
        id: 'att-solapur-2',
        name: 'Solapur Bhuikot Fort',
        category: 'Heritage',
        rating: 4.75,
        reviewCount: 1950,
        estimatedTime: '1.5 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Formidable Bahmani-era ground fort featuring double concentric stone walls, ancient water moats, ornate gates, and a historical animal park.',
        lat: 17.6698,
        lng: 75.9082,
        crowdLevel: 'Low',
        bestTimeToVisit: '08:00 AM - 11:00 AM'
      },
      {
        id: 'att-solapur-3',
        name: 'Great Indian Bustard (Maldhok) Sanctuary (Nannaj)',
        category: 'Nature',
        rating: 4.8,
        reviewCount: 840,
        estimatedTime: '3 hrs',
        entryFee: 50,
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
        description: 'Vast grassland ecosystem protecting the critically endangered Great Indian Bustard (Maldhok), blackbucks, and migratory grassland raptors.',
        lat: 17.8285,
        lng: 75.8346,
        crowdLevel: 'Low',
        bestTimeToVisit: '06:30 AM - 10:00 AM (Winter Migratory Period)',
        isOffbeat: true
      },
      {
        id: 'att-solapur-4',
        name: 'Pandharpur Vithoba-Rukmini Mandir',
        category: 'Heritage',
        rating: 4.95,
        reviewCount: 7800,
        estimatedTime: '3 hrs',
        entryFee: 0,
        image: '/images/pandharpur_vitthal_rukmini.jpg',
        description: 'The supreme spiritual hub of the Warkari bhakti tradition, located on the banks of Chandrabhaga river 70 km from Solapur.',
        lat: 17.6775,
        lng: 75.3283,
        crowdLevel: 'High',
        bestTimeToVisit: '07:00 AM - 10:30 AM'
      },
      {
        id: 'att-solapur-5',
        name: 'Solapur Handloom Weavers Colony & Chaddar Cluster',
        category: 'Shopping',
        rating: 4.88,
        reviewCount: 1120,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
        description: 'Centuries-old artisan textile guild producing GI-tagged jacquard Solapuri Chaddars, cotton bedspreads, and Terry towels directly on pit and frame looms.',
        lat: 17.6620,
        lng: 75.9140,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 05:00 PM'
      }
    ],
    localCuisines: ['Solapuri Shenga Chutney with Jowar Bhakri', 'Shengdana Chikki', 'Kharvas Delicacy', 'Mirchi Bhaji with Tarri Rassa'],
    startingPrice: 4200,
    culturalSpecialties: {
      food: [
        {
          name: 'Authentic Solapuri Shenga Chutney & Hot Jowar Bhakri',
          description: 'Stone-pounded roasted peanut chutney infused with spicy Guntur and Byadgi red chillies, raw garlic, and cumin, served alongside wood-fired Jowar Bhakri and raw white onions.',
          mustTryAt: 'Hotel City Park Khanaval / Panchami Family Restaurant',
          isVeg: true,
          tag: 'GI Signature'
        },
        {
          name: 'Fresh Steamed Kharvas',
          description: 'Traditional pudding prepared from pure bovine colostrum milk, lightly sweetened with jaggery and spiced with green cardamom and nutmeg.',
          mustTryAt: 'Joshi Sweets & Milk Bar, Navi Peth',
          isVeg: true,
          tag: 'Regional Sweet'
        }
      ],
      clothing: [
        {
          name: 'Solapuri Cotton Dhotis & Traditional Handloom Kurtas',
          description: 'Finely spun 100% breathable organic cotton garments crafted by local master weavers.',
          occasion: 'Temple visits and traditional celebrations',
          authenticHub: 'Navi Peth Handloom Bazaar'
        }
      ],
      handicrafts: [
        {
          name: 'Solapuri Chaddar (GI Tagged)',
          description: 'World-renowned jacquard-woven cotton bedcovers with intricate floral and geometric weaves, granted Geographical Indication status in 2005.',
          giTagged: true,
          artisanCommunity: 'Solapur District Weavers Cooperative Society'
        },
        {
          name: 'Solapur Terry Towels & Jacquard Blankets',
          description: 'Ultra-absorbent, long-staple cotton bath linen and lightweight honeycomb towels exported worldwide.',
          giTagged: true,
          artisanCommunity: 'Solapur Textile Park Artisans'
        }
      ],
      jewellery: [],
      artAndCulture: [
        {
          name: 'Warkari Bhajan & Palkhi Heritage',
          type: 'heritage',
          description: 'Spiritual devotional singing and collective walking pilgrimage that unites thousands of pilgrims across Maharashtra.'
        }
      ],
      festivals: [
        {
          name: 'Gadda Yatra (Siddheshwar Festival)',
          monthOrSeason: 'January',
          culturalSignificance: 'Grand 15-day annual fair celebrating Yogi Siddheshwar',
          celebrationHighlights: 'Iconic 68 sacred Kathi processions, lighting of oil lamps, and massive open-air bazaars.'
        }
      ],
      localShopping: [
        {
          product: 'GI Solapuri Chaddars & Handloom Linens',
          bestMarket: 'Navi Peth & Super Market Wholesale Textile Hub',
          priceRange: '₹300 - ₹2,500',
          tip: 'Buy direct from cooperative outlets for authentic GI hologram tag.'
        }
      ],
      uniqueExperiences: [
        {
          title: 'Live Jacquard Handloom Weaving Masterclass',
          description: 'Sit alongside master Padma Shri-descendant weavers in Ashok Chowk and witness punch-card mechanical jacquards in action.',
          bestTime: 'Morning 10 AM - 1 PM',
          localImpact: 'Direct artisan workshop support'
        }
      ]
    }
  },

  // 10. MAHARASHTRA: RATNAGIRI & GANPATIPULE (Konkan Coast Heritage & Mango Groves)
  {
    id: 'dest-ratnagiri',
    name: 'Ratnagiri & Ganpatipule',
    stateOrRegion: 'Konkan Coast',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'Konkan Coast',
    district: 'Ratnagiri',
    thematicTags: ['beaches', 'heritage', 'nature', 'food', 'culture'],
    tierCategory: 'Tier-3',
    popularityTier: 'gem',
    carryingCapacityDaily: 5000,
    currentCapacityLoadPct: 36,
    isOvertouristed: false,
    localEconomicRetentionPct: 91,
    sustainabilityScore: 94,
    affordabilityIndex: 92,
    tagline: 'Swaying Betel Palms, 400-Year Swayambhu Ganpati Shrine & Royal Thibaw Palace',
    description: 'A coastal Konkan gem blessed with dramatic Arabian Sea cliff viewpoints, the historic seaside Jaigad Fort, the exiled Burmese King’s Thibaw Palace, white sand shorelines of Ganpatipule, and world-renowned Alphonso mango orchards.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['beach', 'heritage', 'culinary', 'nature', 'spiritual'],
    rating: 4.86,
    reviewCount: 1890,
    lat: 16.9902,
    lng: 73.3120,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
    currentWeather: {
      tempC: 27,
      condition: 'Gentle Sea Breeze & Sunny',
      icon: 'Sun',
      forecast: 'Refreshing Arabian sea winds with clear sunny skies',
      airQualityIndex: 22
    },
    safetyScore: {
      overall: 95,
      daySafety: 98,
      nightSafety: 92,
      emergencyContact: '112 / Ratnagiri Police (+91 2352 222222)',
      advisory: 'Coastal roads are scenic and safe; adhere to high-tide sea swimming warnings.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '04:30 PM - 07:00 PM (Beach Sunset & Aarti)',
      quietHours: '06:00 AM - 10:00 AM',
      recommendation: 'Visit Ganpatipule beach and Swayambhu temple early morning for peaceful darshan.'
    },
    popularAttractions: [
      {
        id: 'att-ratnagiri-1',
        name: 'Ganpatipule Beach & Swayambhu Mandir',
        category: 'Heritage',
        rating: 4.92,
        reviewCount: 4100,
        estimatedTime: '2.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        description: '400-year-old self-manifested Ganesha deity standing directly on pristine silvery ocean sands.',
        lat: 17.1444,
        lng: 73.2687,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '07:00 AM - 10:00 AM'
      },
      {
        id: 'att-ratnagiri-2',
        name: 'Jaigad Fort & Coastal Lighthouse',
        category: 'Heritage',
        rating: 4.85,
        reviewCount: 1450,
        estimatedTime: '2 hrs',
        entryFee: 20,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: '16th-century clifftop bastion overlooking the dramatic confluence of the Shastri River estuary and Arabian Sea.',
        lat: 17.3005,
        lng: 73.2195,
        crowdLevel: 'Low',
        bestTimeToVisit: '04:00 PM - 06:30 PM (Sunset)'
      },
      {
        id: 'att-ratnagiri-3',
        name: 'Thibaw Palace (Exiled Royal Palace)',
        category: 'Heritage',
        rating: 4.7,
        reviewCount: 1120,
        estimatedTime: '1.5 hrs',
        entryFee: 30,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Burmese-style teakwood and laterite royal palace built in 1910 for King Thibaw and Queen Supayalat of Myanmar.',
        lat: 16.9856,
        lng: 73.3082,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 01:00 PM'
      }
    ],
    localCuisines: ['Alphonso (Hapus) Mango Delicacies', 'Kombdi Vade', 'Solkadhi', 'Fish Curry Rice with Surmai'],
    startingPrice: 4800,
    culturalSpecialties: {
      food: [
        {
          name: 'Konkani Surmai Fry with Pink Kokum Solkadhi',
          description: 'Fresh kingfish marinated in Malvani masala and crispy semolina coating, served with coconut milk solkadhi.',
          mustTryAt: 'Hotel Vivek / Amantran Restaurant Ratnagiri',
          isVeg: false,
          tag: 'Coastal Feast'
        }
      ],
      clothing: [],
      handicrafts: [
        {
          name: 'Konkan Betel Nut & Cashew Wood Carvings',
          description: 'Traditional wood crafts and cane furnishings hand-carved in coastal hamlets.',
          giTagged: false
        }
      ],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 11. MAHARASHTRA: KOLHAPUR (Martial Heritage, Ambabai Shrine & Royal Chappals)
  {
    id: 'dest-kolhapur',
    name: 'Kolhapur',
    stateOrRegion: 'Maharashtra',
    country: 'India',
    isInternational: false,
    state: 'Maharashtra',
    region: 'South Maharashtra',
    district: 'Kolhapur',
    thematicTags: ['heritage', 'culture', 'food', 'spirituality', 'shopping'],
    tierCategory: 'Tier-2',
    popularityTier: 'gem',
    carryingCapacityDaily: 14000,
    currentCapacityLoadPct: 52,
    isOvertouristed: false,
    localEconomicRetentionPct: 92,
    sustainabilityScore: 90,
    affordabilityIndex: 94,
    tagline: 'Sacred Mahalakshmi Ambabai Shaktipeeth, Panhala Fort & Fiery Tambda-Pandhra Rassa',
    description: 'Kolhapur is an ancient cultural powerhouse famed for the 7th-century Mahalakshmi Ambabai Temple, the mighty hill fort of Panhala, traditional wrestling Akhadas, GI-tagged Kolhapuri Chappal leather artisans, and its iconic red and white broths.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'spiritual', 'culinary', 'cultural', 'shopping'],
    rating: 4.88,
    reviewCount: 2420,
    lat: 16.7050,
    lng: 74.2433,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 26,
      condition: 'Pleasant & Sunny',
      icon: 'Sun',
      forecast: 'Clear skies with pleasant breezes around Rankala lake',
      airQualityIndex: 32
    },
    safetyScore: {
      overall: 95,
      daySafety: 98,
      nightSafety: 92,
      emergencyContact: '112 / Kolhapur Police (+91 231 2653960)',
      advisory: 'Safe historic city; observe respectful attire in temple sanctums.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '09:00 AM - 12:30 PM & 06:00 PM - 08:30 PM',
      quietHours: '06:00 AM - 08:30 AM & 02:00 PM - 04:30 PM',
      recommendation: 'Take morning 6:30 AM darshan at Ambabai temple to avoid afternoon queues.'
    },
    popularAttractions: [
      {
        id: 'att-kolhapur-1',
        name: 'Shree Mahalakshmi (Ambabai) Temple',
        category: 'Heritage',
        rating: 4.96,
        reviewCount: 8900,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        description: 'One of the prime Shaktipeeths of India, built in Chalukya stone architecture with Kirnotsav sunbeam phenomenon.',
        lat: 16.6946,
        lng: 74.2238,
        crowdLevel: 'High',
        bestTimeToVisit: '06:00 AM - 08:30 AM'
      },
      {
        id: 'att-kolhapur-2',
        name: 'Panhala Hill Fort',
        category: 'Heritage',
        rating: 4.89,
        reviewCount: 3800,
        estimatedTime: '3 hrs',
        entryFee: 25,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Strategic hilltop fortress 20 km from Kolhapur, featuring Sajja Kothi, Teen Darwaza, and dramatic Sahyadri valley views.',
        lat: 16.8122,
        lng: 74.1084,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '08:30 AM - 12:00 PM'
      },
      {
        id: 'att-kolhapur-3',
        name: 'Rankala Lake Promenade & Chowpatty',
        category: 'Sightseeing',
        rating: 4.78,
        reviewCount: 2900,
        estimatedTime: '1.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        description: 'Historic scenic lake built by Chhatrapati Shahu Maharaj, surrounded by Shalini Palace and famous Kolhapuri Misal stalls.',
        lat: 16.6892,
        lng: 74.2148,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '05:00 PM - 08:00 PM'
      }
    ],
    localCuisines: ['Tambda Rassa (Red Mutton Broth)', 'Pandhra Rassa (White Coconut Broth)', 'Kolhapuri Misal', 'Jowar Bhakri'],
    startingPrice: 4500,
    culturalSpecialties: {
      food: [
        {
          name: 'Authentic Tambda & Pandhra Rassa Feast',
          description: 'Spicy broth infused with Byadgi chillies (Tambda) alongside delicate coconut and bone-marrow white broth (Pandhra).',
          mustTryAt: 'Hotel Opal / Dehati Authentic Kolhapuri Dining',
          isVeg: false,
          tag: 'Royal Culinary Legend'
        }
      ],
      clothing: [
        {
          name: 'Traditional Kolhapuri Saaj & Paithani Sarees',
          description: 'Auspicious necklace crafted from 21 handcrafted leaves and gold pendants alongside handwoven silk Paithanis.',
          occasion: 'Festive weddings and traditional occasions',
          authenticHub: 'Gujari Gold Bazaar, Kolhapur'
        }
      ],
      handicrafts: [
        {
          name: 'Kolhapuri Chappals (GI Tagged)',
          description: 'Handcrafted vegetable-tanned buffalo leather slippers made using traditional stitching methods without nails.',
          giTagged: true,
          artisanCommunity: 'Subhash Road & Shivaji Market Leather Artisans'
        }
      ],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 12. KERALA: KOCHI & ALLEPPEY (Backwaters, Spice Coast & Kathakali)
  {
    id: 'dest-kerala-kochi',
    name: 'Kochi & Alleppey Backwaters',
    stateOrRegion: 'Kerala',
    country: 'India',
    isInternational: false,
    state: 'Kerala',
    region: 'Malabar Coast',
    district: 'Ernakulam & Alappuzha',
    thematicTags: ['nature', 'heritage', 'beaches', 'food', 'culture'],
    tierCategory: 'Tier-2',
    popularityTier: 'popular',
    carryingCapacityDaily: 15000,
    currentCapacityLoadPct: 62,
    isOvertouristed: false,
    localEconomicRetentionPct: 88,
    sustainabilityScore: 92,
    affordabilityIndex: 85,
    tagline: 'Chinese Fishing Nets, Colonial Fort Kochi, Spice Warehouses & Emerald Houseboat Cruises',
    description: 'The jewel of God’s Own Country, combining Fort Kochi’s Portuguese and Dutch heritage, giant shore-operated Chinese fishing nets, vibrant spice auctions, Kathakali martial theatre, and peaceful eco-houseboats gliding across Alleppey backwater lagoons.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['nature', 'heritage', 'culinary', 'beach', 'cultural'],
    rating: 4.91,
    reviewCount: 4200,
    lat: 9.9312,
    lng: 76.2673,
    bestMonths: ['September', 'October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 28,
      condition: 'Tropical Breeze & Mild Sunshine',
      icon: 'Sun',
      forecast: 'Balmy tropical warmth with gentle maritime breezes',
      airQualityIndex: 28
    },
    safetyScore: {
      overall: 97,
      daySafety: 99,
      nightSafety: 94,
      emergencyContact: '112 / Kochi City Police (+91 484 2385000)',
      advisory: 'Follow licensed boatman safety advisories on backwater channels.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '04:00 PM - 07:00 PM (Sunset at Fort Kochi Nets)',
      quietHours: '06:00 AM - 09:00 AM & 01:00 PM - 03:30 PM',
      recommendation: 'Board early morning backwater shikaras from Alleppey jetty for uncrowded channels.'
    },
    popularAttractions: [
      {
        id: 'att-kochi-1',
        name: 'Fort Kochi Beach & Chinese Fishing Nets (Cheena Vala)',
        category: 'Heritage',
        rating: 4.88,
        reviewCount: 6500,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
        description: 'Cantilevered shore-operated fishing nets gifted by 14th-century Chinese traders of Kublai Khan.',
        lat: 9.9658,
        lng: 76.2415,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '06:00 AM - 08:30 AM & Sunset'
      },
      {
        id: 'att-kochi-2',
        name: 'Alleppey (Alappuzha) Backwater Houseboat Cruise',
        category: 'Nature',
        rating: 4.95,
        reviewCount: 5200,
        estimatedTime: '4 hrs',
        entryFee: 1500,
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80',
        description: 'Glide in an authentic thatched Kettuvallam through palm-fringed canals, paddy fields, and village lagoons.',
        lat: 9.4981,
        lng: 76.3388,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '10:00 AM - 04:00 PM'
      },
      {
        id: 'att-kochi-3',
        name: 'Mattancherry Jewish Synagogue & Jew Town',
        category: 'Heritage',
        rating: 4.82,
        reviewCount: 3100,
        estimatedTime: '1.5 hrs',
        entryFee: 20,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Built in 1568 featuring hand-painted Chinese willow-pattern porcelain floor tiles, Belgian glass chandeliers, and spice merchants.',
        lat: 9.9576,
        lng: 76.2594,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '10:00 AM - 01:00 PM'
      }
    ],
    localCuisines: ['Kerala Sadya on Banana Leaf', 'Karimeen Pollichathu (Pearl Spot Fish)', 'Appam with Stew', 'Malabar Parotta'],
    startingPrice: 6500,
    culturalSpecialties: {
      food: [
        {
          name: 'Traditional Karimeen Pollichathu',
          description: 'Fresh pearl spot fish marinated in spicy shallot, ginger, and curry leaf paste, wrapped in banana leaf and pan-roasted in coconut oil.',
          mustTryAt: 'Kashi Art Cafe / Oceanos Restaurant Fort Kochi',
          isVeg: false,
          tag: 'Kerala Delicacy'
        }
      ],
      clothing: [],
      handicrafts: [
        {
          name: 'Aranmula Kannadi Metal Mirrors & Coir Crafts',
          description: 'Front-surface reflecting metal alloy mirrors and hand-woven natural coconut coir carpets.',
          giTagged: true
        }
      ],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },

  // 13. UTTARAKHAND: RISHIKESH & HARIDWAR (Yoga Capital, Ganges Aarti & Himalayan Foothills)
  {
    id: 'dest-uttarakhand-rishikesh',
    name: 'Rishikesh & Haridwar',
    stateOrRegion: 'Uttarakhand',
    country: 'India',
    isInternational: false,
    state: 'Uttarakhand',
    region: 'Garhwal Himalayas',
    district: 'Dehradun & Haridwar',
    thematicTags: ['spirituality', 'adventure', 'nature', 'culture'],
    tierCategory: 'Tier-2',
    popularityTier: 'popular',
    carryingCapacityDaily: 16000,
    currentCapacityLoadPct: 58,
    isOvertouristed: false,
    localEconomicRetentionPct: 89,
    sustainabilityScore: 91,
    affordabilityIndex: 90,
    tagline: 'World Capital of Yoga, Roaring Ganges River Rafting & Divine Parmarth Niketan Evening Aarti',
    description: 'Nestled where the emerald Ganges tumbles out of the majestic Himalayas. Rishikesh is celebrated for suspension bridges, sacred yoga ashrams, adrenaline-pumping white water rafting, organic riverside cafes, and the sublime oil-lamp Ganga Aarti at Parmarth Niketan and Har Ki Pauri.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['adventure', 'spiritual', 'wellness', 'nature', 'culinary'],
    rating: 4.93,
    reviewCount: 3950,
    lat: 30.0869,
    lng: 78.2676,
    bestMonths: ['September', 'October', 'November', 'December', 'February', 'March', 'April', 'May'],
    currentWeather: {
      tempC: 22,
      condition: 'Crisp Mountain Breeze & Sunny',
      icon: 'Sun',
      forecast: 'Cool mountain air with sparkling sunshine along the Ganges riverbank',
      airQualityIndex: 20
    },
    safetyScore: {
      overall: 96,
      daySafety: 99,
      nightSafety: 92,
      emergencyContact: '112 / Rishikesh Tourist Police (+91 135 2430005)',
      advisory: 'Wear life jackets during rafting; follow Ganga ghat safety rules.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '05:00 PM - 07:30 PM (Evening Ganga Aarti)',
      quietHours: '06:00 AM - 09:00 AM & 12:00 PM - 03:00 PM',
      recommendation: 'Reach Triveni Ghat or Parmarth Niketan 45 minutes before aarti for peaceful seating.'
    },
    popularAttractions: [
      {
        id: 'att-rishikesh-1',
        name: 'Parmarth Niketan & Triveni Ghat Ganga Aarti',
        category: 'Heritage',
        rating: 4.97,
        reviewCount: 9200,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        description: 'Soul-stirring Vedic chants, devotional bhajans, and flaming brass oil lamps floating down the sacred Ganges at sunset.',
        lat: 30.1198,
        lng: 78.3142,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '05:30 PM - 07:15 PM'
      },
      {
        id: 'att-rishikesh-2',
        name: 'Ganges White Water Rafting & Cliff Jump (Shivpuri to Lakshman Jhula)',
        category: 'Adventure',
        rating: 4.92,
        reviewCount: 6800,
        estimatedTime: '3.5 hrs',
        entryFee: 1200,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'Exhilarating Class III and IV rapids (Roller Coaster, Golf Course, Club House) through dramatic Himalayan gorges.',
        lat: 30.1345,
        lng: 78.3289,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '09:00 AM - 02:00 PM'
      },
      {
        id: 'att-rishikesh-3',
        name: 'Beatles Ashram (Chaurasi Kutia)',
        category: 'Heritage',
        rating: 4.81,
        reviewCount: 3400,
        estimatedTime: '2 hrs',
        entryFee: 150,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'The tranquil forest ashram inside Rajaji Tiger Reserve where The Beatles composed over 40 songs in 1968, adorned with graffiti murals.',
        lat: 30.1141,
        lng: 78.3125,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 04:00 PM'
      }
    ],
    localCuisines: ['Garhwali Kafuli', 'Chainsoo (Black Gram Stew)', 'Aloo Ke Gutke', 'Ayurvedic Herbal Teas & Sattvic Thali'],
    startingPrice: 5200,
    culturalSpecialties: {
      food: [
        {
          name: 'Authentic Garhwali Kafuli & Jhangora Kheer',
          description: 'Nutritious spinach and fenugreek puree cooked in iron kadhai, accompanied by barnyard millet sweet pudding.',
          mustTryAt: 'Chotiwala Restaurant / Little Buddha Cafe',
          isVeg: true,
          tag: 'Himalayan Organic'
        }
      ],
      clothing: [],
      handicrafts: [
        {
          name: 'Rudraksha Mala & Himalayan Woollen Shawls',
          description: 'Certified 5-Mukhi sacred beads from Himalayan trees and hand-knitted merino wool sweaters and stoles.',
          giTagged: false
        }
      ],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  },
  // 14. KARNATAKA: HAMPI & COORG (UNESCO Ruins & Western Ghats Coffee Highlands)
  {
    id: 'dest-karnataka-hampi-coorg',
    name: 'Hampi & Coorg, Karnataka',
    stateOrRegion: 'Karnataka',
    country: 'India',
    isInternational: false,
    state: 'Karnataka',
    region: 'South India & Western Ghats',
    district: 'Vijayanagara & Kodagu',
    thematicTags: ['heritage', 'nature', 'culture', 'food', 'adventure'],
    tierCategory: 'Tier-2',
    popularityTier: 'gem',
    carryingCapacityDaily: 15000,
    currentCapacityLoadPct: 50,
    isOvertouristed: false,
    localEconomicRetentionPct: 91,
    sustainabilityScore: 94,
    affordabilityIndex: 88,
    tagline: 'UNESCO Vijayanagara Stone Architecture & Lush Western Ghats Coffee Plantations',
    description: 'A breathtaking journey combining the mythical boulder landscapes and 14th-century Vijayanagara ruins of UNESCO World Heritage Hampi with the mist-shrouded organic coffee estates, cascading waterfalls, and Kodava hospitality of Coorg.',
    heroImage: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'nature', 'cultural', 'adventure', 'wellness'],
    rating: 4.92,
    reviewCount: 4120,
    lat: 15.3350,
    lng: 76.4600,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 26,
      condition: 'Breezy & Sunny',
      icon: 'Sun',
      forecast: 'Pleasant mornings with clear skies',
      airQualityIndex: 28
    },
    safetyScore: {
      overall: 95,
      daySafety: 96,
      nightSafety: 88,
      emergencyContact: '112 / Karnataka Tourism Police (+91 8394 241222)',
      advisory: 'Certified tourist guides available at Vijaya Vittala complex; stay on designated trails during estate visits.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '10:30 AM - 01:30 PM',
      quietHours: '06:00 AM - 08:30 AM & 04:30 PM - 06:30 PM',
      recommendation: 'Experience sunrise over the Tungabhadra boulders at Matanga Hill and quiet afternoon coffee walks.'
    },
    popularAttractions: [
      {
        id: 'att-hampi-1',
        name: 'Vijaya Vittala Temple & Stone Chariot',
        category: 'Heritage',
        rating: 4.96,
        reviewCount: 9200,
        estimatedTime: '2.5 hrs',
        entryFee: 40,
        image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=600&q=80',
        description: 'Iconic 16th-century temple complex featuring the world-famous carved stone chariot, ornate musical pillars, and Dravidian pillared mandapas.',
        lat: 15.3400,
        lng: 76.4780,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '07:00 AM - 09:30 AM'
      },
      {
        id: 'att-hampi-2',
        name: 'Virupaksha Temple & Hampi Bazaar',
        category: 'Heritage',
        rating: 4.91,
        reviewCount: 7100,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
        description: 'Oldest active pilgrimage shrine in Hampi dedicated to Lord Shiva with a 50-meter gopuram, standing at the head of the ancient stone bazaar street.',
        lat: 15.3355,
        lng: 76.4605,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '06:30 AM - 09:00 AM'
      },
      {
        id: 'att-hampi-3',
        name: 'Tungabhadra River Coracle Crossing & Boulder Trail',
        category: 'Nature',
        rating: 4.88,
        reviewCount: 3800,
        estimatedTime: '1.5 hrs',
        entryFee: 150,
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
        description: 'Traditional round reed-boat river ride gliding beneath granite boulder gorges, ancient ghat steps, and boulder-strewn waters of the Tungabhadra.',
        lat: 15.3370,
        lng: 76.4620,
        crowdLevel: 'Low',
        bestTimeToVisit: '04:00 PM - 06:00 PM'
      },
      {
        id: 'att-coorg-1',
        name: 'Abbey Falls & Organic Coffee Plantation Walk',
        category: 'Nature',
        rating: 4.89,
        reviewCount: 5400,
        estimatedTime: '2.5 hrs',
        entryFee: 30,
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80',
        description: 'Cascading natural falls surrounded by aromatic Arabica and Robusta coffee estates, hanging spice vines, and Kodagu greenery.',
        lat: 12.4540,
        lng: 75.7180,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '09:00 AM - 11:30 AM'
      },
      {
        id: 'att-coorg-2',
        name: 'Raja’s Seat & Western Ghats Sunset Point',
        category: 'Nature',
        rating: 4.85,
        reviewCount: 4600,
        estimatedTime: '1.5 hrs',
        entryFee: 20,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'Historical scenic pavilion in Madikeri where the Kings of Kodagu watched sunsets across misty valley ridges and undulating forested hills.',
        lat: 12.4210,
        lng: 75.7360,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '05:00 PM - 06:45 PM'
      }
    ],
    localCuisines: ['Coorg Pandi Curry (Vegetarian Jackfruit Version Available)', 'Kadambuttu (Steamed Rice Dumplings)', 'Baimbale Bamboo Shoot Curry', 'Single-Estate Filter Coffee'],
    startingPrice: 6500,
    culturalSpecialties: {
      food: [
        {
          name: 'Coorg Kadambuttu with Kachampuli Vegetable Curry',
          description: 'Traditional Kodava steamed rice balls seasoned with native garcinia cambogia and black pepper.',
          mustTryAt: 'Coorg Cuisine / Raintree Restaurant, Madikeri',
          isVeg: true,
          tag: 'GI Kodagu Heritage'
        }
      ],
      clothing: [],
      handicrafts: [
        {
          name: 'GI Coorg Arabica Coffee & Wild Forest Honey',
          description: 'Certified single-origin shade-grown coffee beans and unfiltered Western Ghats apiary honey.',
          giTagged: true
        }
      ],
      jewellery: [],
      artAndCulture: [],
      festivals: [],
      localShopping: [],
      uniqueExperiences: []
    }
  }
];
