import { Destination } from '../../src/types';

export const INDIA_REGIONAL_DESTINATIONS: Destination[] = [
  // 1. SOUTH INDIA: CHETTINAD / KARAIKUDI, TAMIL NADU (Heritage Mansions & Spices)
  {
    id: 'dest-chettinad',
    name: 'Chettinad & Karaikudi',
    stateOrRegion: 'Tamil Nadu',
    country: 'India',
    isInternational: false,
    state: 'Tamil Nadu',
    region: 'South Tamil Nadu',
    district: 'Sivaganga',
    thematicTags: ['heritage', 'food', 'clothing', 'shopping', 'culture'],
    tierCategory: 'Rural/Village',
    popularityTier: 'gem',
    carryingCapacityDaily: 2500,
    currentCapacityLoadPct: 28,
    isOvertouristed: false,
    localEconomicRetentionPct: 94,
    sustainabilityScore: 96,
    affordabilityIndex: 90,
    tagline: 'Grand 100-Room Merchant Palaces, Athangudi Handmade Tiles & Fiery Royal Gastronomy',
    description: 'Chettinad is a cluster of 75 heritage villages celebrated for grand 19th-century mansions built by Nagarathar merchant bankers with Burmese teak, Italian marble, and Bohemian crystals. Famed for Athangudi GI handmade tiles, Kandangi cotton sarees, and world-renowned aromatic Chettinad cuisine.',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'culinary', 'cultural', 'luxury'],
    rating: 4.93,
    reviewCount: 1040,
    lat: 10.0704,
    lng: 78.7844,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 28,
      condition: 'Breezy & Sunny',
      icon: 'Sun',
      forecast: 'Warm sunny weather with pleasant courtyard breezes',
      airQualityIndex: 25
    },
    safetyScore: {
      overall: 98,
      daySafety: 99,
      nightSafety: 96,
      emergencyContact: '112 / Karaikudi Police (+91 4565 222100)',
      advisory: 'Extremely welcoming village elders. Walking in the heritage streets is safe at all hours.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '11:00 AM - 1:30 PM (Mansion tours & lunch)',
      quietHours: '6:30 AM - 10:00 AM',
      recommendation: 'Cycle through the village lanes of Kanadukathan in the early morning for peaceful mansion photography.'
    },
    popularAttractions: [
      {
        id: 'att-chettinad-1',
        name: 'Chettinad Palace (Kanadukathan)',
        category: 'Heritage',
        rating: 4.95,
        reviewCount: 1650,
        estimatedTime: '2.5 hrs',
        entryFee: 100,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Exquisite 1912 mansion with 126 rooms, Belgian chandeliers, Burma teak pillars, and intricate woodwork.',
        lat: 10.1583,
        lng: 78.7889,
        crowdLevel: 'Low',
        bestTimeToVisit: '9:00 AM - 11:30 AM',
        isOffbeat: true
      },
      {
        id: 'att-chettinad-2',
        name: 'Athangudi GI Tile Craft Village',
        category: 'Shopping',
        rating: 4.9,
        reviewCount: 920,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        description: 'Watch hereditary artisans hand-cast glass-moulded geometric cement tiles using natural mineral colors and rice husk polishing.',
        lat: 10.1689,
        lng: 78.8512,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 1:00 PM',
        isOffbeat: true
      }
    ],
    localCuisines: ['Authentic Chettinad Pepper Chicken', 'Kuzhi Paniyaram', 'Kavuni Arisi (Black Rice Sweet)', 'Vellai Kurma with Idiyappam', 'Seeyam & Murukku', 'Banana Leaf Virundhu'],
    startingPrice: 7150,

    culturalSpecialties: {
      food: [
        { name: 'Traditional Chettinad Virundhu on Banana Leaf', description: 'Grand multi-course feast featuring 18 spice blends (Marukozhundu, star anise, kalpasi/stone flower), freshly ground pepper masala, and piping hot rasam.', mustTryAt: 'The Bangala, Karaikudi / Visalam Heritage', isVeg: false, tag: 'World Heritage Feast' },
        { name: 'Kavuni Arisi (Forbidden Black Rice Halwa)', description: 'Nutty ancient black glutinous rice simmered in coconut milk, jaggery, cardamom, and roasted cashews.', isVeg: true, tag: 'Royal Dessert' }
      ],
      clothing: [
        { name: 'Chettinad Kandangi Cotton Sarees (GI Tagged)', description: 'Thick, breathable handloom sarees in brilliant saffron, mustard, and brick red with contrasting geometric temple borders (Koorai).', occasion: 'Traditional Festive & Daily Heritage Wear', authenticHub: 'Karaikudi Weavers Co-op Society' }
      ],
      handicrafts: [
        { name: 'Athangudi Handmade Palace Tiles (GI Tagged)', description: 'Hand-pressed sun-dried architectural tiles made with local sand and non-fading natural mineral dyes.', giTagged: true, artisanCommunity: 'Athangudi Master Tile Makers' },
        { name: 'Kottan Palm Leaf Baskets (GI Tagged)', description: 'Intricately dyed palmyra leaf baskets crafted by Chettinad women for auspicious dowry and festive gifts.', giTagged: true, artisanCommunity: 'M.R.M. Foundation Artisan Guild' }
      ],
      jewellery: [
        { name: 'Chettinad Kaluthiru & Ruby Mangalsutra', description: 'Heavy solid gold necklace with 34 sacred coins (Thali) and Burma rubies crafted by hereditary Nagarathar goldsmiths.', material: '22K Gold & Burmese Rubies' }
      ],
      artAndCulture: [
        { name: 'Nagarathar Heritage Architecture Tours', description: 'Interactive walk through the vastu-compliant courtyard architecture, rainwater harvesting thinnai (verandahs), and brass cooking halls.', type: 'heritage' }
      ],
      festivals: [
        { name: 'Chettinad Heritage & Food Festival', monthOrSeason: 'January / Pongal', culturalSignificance: 'Celebration of harvest with community clay-pot Pongal cooking and classical Carnatic recitals in mansion courtyards.', celebrationHighlights: 'Traditional bullock cart rides and kolam rangoli contests.' }
      ],
      localShopping: [
        { product: 'Direct from Loom Kandangi Sarees', bestMarket: 'Karaikudi Handloom Center', priceRange: '₹1,200 - ₹3,500', tip: 'Authentic Kandangi uses double-warp coarse cotton that lasts decades.' },
        { product: 'Chettinad Antique Brass & Enamel Cookware', bestMarket: 'Muneeswaran Koil Antique Market', priceRange: '₹400 - ₹4,000', tip: 'Look for original heavy bronze urulis and Swedish enamel tiffin carriers brought by traders in 1920s.' }
      ],
      uniqueExperiences: [
        { title: 'Master Cooking Class at The Bangala with Achi Chefs', description: 'Learn the exact proportions of Kalpasi (stone flower), Marathi Moggu, and fresh coconut from master Chettinad home cooks.', bestTime: 'Morning 10:30 AM', localImpact: 'Directly supports women culinary teachers in rural Sivaganga.' }
      ]
    },

    alternativeTo: ['Madurai', 'dest-madurai', 'Jaipur'],
    whyAlternativeBetter: {
      headline: 'Discover the Untouched Merchant Palaces of Chettinad instead of Crowded Heritage Tourist Circuits',
      replacesFamousSpot: 'Madurai',
      crowdReductionPct: 78,
      costSavingsPct: 35,
      localAuthenticityScore: 98,
      keyAdvantage: 'Live inside 100-room heritage mansions, dine on authentic banana-leaf feasts with 94% local economic retention, and zero tourist touts.',
      comparisonHighlights: [
        { metric: 'Heritage Immersion', famousSpot: 'Rushed temple queues & noisy urban traffic', hiddenGem: 'Quiet village cycle trails, living palaces & hands-on craft workshops' },
        { metric: 'Food Authenticity', famousSpot: 'Commercial multi-cuisine restaurants', hiddenGem: 'Generations-old secret recipes prepared by family Achis' }
      ]
    },

    localEconomy: {
      localImpactScore: 94,
      economicRetentionExplainer: '94% of visitor expenses remain in village cooperatives, empowering tile makers, palm basket weavers, and mansion caretakers.',
      authenticHomestays: [
        { name: 'Mansion 1912 Heritage Homestay', hostName: 'Meenakshi & Chidambaram Achi', village: 'Kanadukathan Village', pricePerNight: 3200, specialties: ['110-year-old restored mansion', 'Home-cooked banana leaf banquet', 'Village bicycle tours'], rating: 4.96 },
        { name: 'Chettinadu Heritage Thinnai', hostName: 'Muthuraman SP', village: 'Kottaiyur', pricePerNight: 2400, specialties: ['Burma teak courtyard', 'Authentic Chettinad breakfast', 'Athangudi tile demo'], rating: 4.92 }
      ],
      traditionalKhanavals: [
        { name: 'Priya Mess Karaikudi', signatureDish: 'Chettinad Nattu Kozhi & Pepper Masala', location: 'Karaikudi New Bus Stand', avgMealCost: 240, isFamilyRun: true }
      ],
      communityGuides: [
        { name: 'Ramaswamy N.', expertise: 'Nagarathar Mansion History & Architecture', languages: ['Tamil', 'English', 'Hindi'], badge: 'Heritage Sivaganga Guide', dailyRate: 1100 }
      ],
      artisanCooperatives: [
        { craft: 'Athangudi Handmade Tiles', guildName: 'Athangudi Heritage Tile Guild', village: 'Athangudi', directBuyingContact: '+91 4565 281440' }
      ],
      localTransportOptions: [
        { mode: 'Heritage Cycle Rental / Eco Auto', typicalRoute: 'Karaikudi to Kanadukathan / Athangudi', approxFare: '₹150 - ₹350', ecoFriendly: true }
      ]
    },

    bestTimeEngine: {
      bestSeasonDescription: 'Winter (October to March) — Mild sunny days with 24°C-30°C and refreshing evening courtyard breezes.',
      idealMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
      timeOfDayGuide: {
        morning: { hours: '06:30 AM - 09:30 AM', recommendation: 'Cycle through the peaceful mansion lanes of Kanadukathan and Kottaiyur.', crowd: 'Low' },
        afternoon: { hours: '12:00 PM - 03:00 PM', recommendation: 'Experience a grand banana leaf Chettinad feast and relax inside airy high-ceiling courtyards.', crowd: 'Moderate' },
        evening: { hours: '04:00 PM - 07:00 PM', recommendation: 'Watch artisans hand-cast tiles at Athangudi and browse antique brassware shops.', crowd: 'Low' },
        night: { hours: '07:30 PM - 09:30 PM', recommendation: 'Enjoy Kuzhi Paniyaram with three spicy chutneys under starlit palace verandahs.', crowd: 'Low' }
      },
      weatherIndexCurrent: 92,
      weatherForecastNarrative: 'Crisp, pleasant tropical winter climate ideal for heritage strolls.',
      budgetEstimator: {
        budgetTier: { stayPerDay: 1200, foodPerDay: 450, transitPerDay: 250, totalDaily: 1900 },
        moderateTier: { stayPerDay: 2800, foodPerDay: 900, transitPerDay: 500, totalDaily: 4200 },
        luxuryTier: { stayPerDay: 7500, foodPerDay: 2200, transitPerDay: 1200, totalDaily: 10900 }
      },
      upcomingEvents: [
        { name: 'Chettinad Pongal Mansion Festival', dateRange: 'January 14 - 17', type: 'Cultural Harvest Celebration', significance: 'Village Kolam competitions, sweet Pongal boiling in brass pots, and heritage house tours.' }
      ]
    }
  },

  // 2. NORTH INDIA: TIRTHAN VALLEY & JIBHI, HIMACHAL PRADESH (Pristine Alternative to Manali)
  {
    id: 'dest-tirthan',
    name: 'Tirthan Valley & Jibhi',
    stateOrRegion: 'Himachal Pradesh',
    country: 'India',
    isInternational: false,
    state: 'Himachal Pradesh',
    region: 'Kullu Outer Seraj',
    district: 'Kullu',
    thematicTags: ['nature', 'adventure', 'rural_tribal', 'food', 'culture'],
    tierCategory: 'Rural/Village',
    popularityTier: 'gem',
    carryingCapacityDaily: 1800,
    currentCapacityLoadPct: 24,
    isOvertouristed: false,
    localEconomicRetentionPct: 95,
    sustainabilityScore: 98,
    affordabilityIndex: 93,
    tagline: 'Gateway to Great Himalayan National Park (UNESCO): Kathkuni Woodcraft, Trout Rivers & Serolsar Lake',
    description: 'Tirthan Valley is a tranquil alpine haven cradled by the crystal-clear Tirthan river and the UNESCO World Heritage Great Himalayan National Park. Celebrated for traditional Kathkuni timber-and-stone architecture, brown and rainbow trout angling, dense pine forests, and steaming Himachali Siddu.',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['nature', 'adventure', 'wellness', 'eco_friendly'],
    rating: 4.96,
    reviewCount: 1280,
    lat: 31.6439,
    lng: 77.3475,
    bestMonths: ['March', 'April', 'May', 'June', 'September', 'October', 'November', 'December'],
    currentWeather: {
      tempC: 16,
      condition: 'Crisp Alpine Breeze & Sunny',
      icon: 'Sun',
      forecast: 'Clear blue skies with snow-capped mountain panoramas',
      airQualityIndex: 12
    },
    safetyScore: {
      overall: 99,
      daySafety: 99,
      nightSafety: 98,
      emergencyContact: '112 / Banjar Police (+91 1903 222222)',
      advisory: 'Pristine, peaceful mountain valley. Always practice "Leave No Trace" eco-ethics.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '12:00 PM - 2:30 PM (Jibhi Waterfall)',
      quietHours: '6:00 AM - 10:00 AM',
      recommendation: 'Hike to Serolsar Lake from Jalori Pass early at 7:30 AM to see crystal morning reflections of the Himalayas.'
    },
    popularAttractions: [
      {
        id: 'att-tirthan-1',
        name: 'Great Himalayan National Park (UNESCO Wilderness)',
        category: 'Adventure',
        rating: 4.97,
        reviewCount: 1420,
        estimatedTime: '6 hrs',
        entryFee: 150,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'Pristine UNESCO alpine ecosystem home to Western Tragopan, Himalayan musk deer, and virgin oak-conifer forests.',
        lat: 31.7500,
        lng: 77.5500,
        crowdLevel: 'Low',
        bestTimeToVisit: '7:00 AM - 1:00 PM',
        isOffbeat: true
      },
      {
        id: 'att-tirthan-2',
        name: 'Chehni Kothi 1500-Year-Old Kathkuni Tower',
        category: 'Heritage',
        rating: 4.93,
        reviewCount: 980,
        estimatedTime: '3 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
        description: 'Tallest timber-and-stone fortified tower temple in the Western Himalayas built without cement or mortar.',
        lat: 31.6321,
        lng: 77.3412,
        crowdLevel: 'Low',
        bestTimeToVisit: '8:30 AM - 11:30 AM',
        isOffbeat: true
      }
    ],
    localCuisines: ['Himachali Siddu with Ghee & Walnut Chutney', 'Fresh Pan-Fried Rainbow Trout', 'Himachali Madra (Chickpeas in Spiced Yogurt)', 'Bhey (Spiced Lotus Stem)', 'Wild Forest Lingad (Fiddlehead Fern Curry)', 'Pahari Rhododendron Juice'],
    startingPrice: 6050,

    culturalSpecialties: {
      food: [
        { name: 'Authentic Himachali Siddu with Ghee & Chutney', description: 'Steamed sourdough wheat bun stuffed with poppy seeds, roasted walnuts, and local mountain herbs, served with smoking pure desi ghee.', mustTryAt: 'Local Wooden Village Cafes & Homestays', isVeg: true, tag: 'Signature Mountain Bread' },
        { name: 'Fresh Herb Pan-Fried Rainbow Trout', description: 'Freshly caught river trout seasoned with sea salt, lemon, and mountain rosemary, pan-fried in butter.', isVeg: false, tag: 'River Delicacy' },
        { name: 'Wild Lingad (Fiddlehead Fern) Curry', description: 'Tender wild-foraged ferns cooked in mustard oil, wild dry mango, and rustic Himalayan spices.', isVeg: true, tag: 'Foraged Alpine Dish' }
      ],
      clothing: [
        { name: 'Kullu Handwoven Woolen Shawls & Pattus (GI Tagged)', description: 'Warm sheep and angora wool shawls with traditional geometric multicolored border patterns (Chashm-e-Bulbul).', occasion: 'Winter Warmth & Traditional Pahari Weddings', authenticHub: 'Banjar Valley Weavers Co-op' },
        { name: 'Himachali Kullvi Topi (Cap)', description: 'Traditional round woolen cap adorned with brightly colored woven geometric bands.', occasion: 'Everyday Dignity & Festivals', authenticHub: 'Jibhi Village Artisans' }
      ],
      handicrafts: [
        { name: 'Kathkuni Architectural Woodcarvings', description: 'Intricate deodar wood door carvings and sacred temple lintels crafted by local carpenters using ancient earthquake-resistant interlocking methods.', giTagged: false, artisanCommunity: 'Outer Seraj Carpenter Guild' }
      ],
      jewellery: [
        { name: 'Himachali Chandan Haar & Silver Clip Ornaments', description: 'Handcrafted tribal silver filigree coin necklaces, enamel-inlaid Chaunk bangles, and turquoise nose pins.', material: 'Tribal Silver & Turquoise' }
      ],
      artAndCulture: [
        { name: 'Nati Folk Dance of Kullu Valley', description: 'Guinness World Record holding synchronized serpentine group circle dance performed to Dhol, Nagara, and Shehnai.', type: 'folk_dance' }
      ],
      festivals: [
        { name: 'Fagli Mask & Nature Festival', monthOrSeason: 'February / Phalgun', culturalSignificance: 'Ancient winter festival marking the victory of good over evil, where villagers dance wearing straw masks and costumes to welcome spring.', celebrationHighlights: 'Traditional feast and village bonfire circle dances.' }
      ],
      localShopping: [
        { product: 'GI Certified Kullu Handloom Shawls', bestMarket: 'Banjar Handloom Weavers Outlet', priceRange: '₹800 - ₹3,500', tip: 'Check the Handloom Mark tag to support authentic manual pit-loom weavers.' },
        { product: 'Pure Himalayan Wild Flora Honey & Apple Jam', bestMarket: 'Tirthan Riverside Farmers Stall', priceRange: '₹300 - ₹550', tip: 'Organic unprocessed raw honey harvested from high-altitude flora.' }
      ],
      uniqueExperiences: [
        { title: 'Eco-Trail Hike to Great Himalayan National Park Entry Gate', description: 'Hike along turquoise streams with local forest guards, crossing wooden bridges and mossy cedar groves.', bestTime: '07:30 AM', localImpact: 'Direct income for local biodiversity guards and village porters.' },
        { title: 'Trek to Sacred Serolsar Lake & Budhi Nagin Temple', description: 'Hike through dense oak forests from Jalori Pass to the pristine mountain lake believed to be protected by the mother of serpents.', bestTime: '08:00 AM', localImpact: 'Eco-friendly community guided trek.' }
      ]
    },

    alternativeTo: ['Manali', 'dest-manali', 'Shimla'],
    whyAlternativeBetter: {
      headline: 'Replace the Traffic Jams of Manali with the Pristine Trout Streams & Kathkuni Villages of Tirthan & Jibhi',
      replacesFamousSpot: 'Manali',
      crowdReductionPct: 82,
      costSavingsPct: 42,
      localAuthenticityScore: 97,
      keyAdvantage: 'Zero commercial high-rises, pure UNESCO mountain air (AQI 12), roaring trout rivers, and 95% direct local village economic retention.',
      comparisonHighlights: [
        { metric: 'Peace & Traffic', famousSpot: '3-hour bumper-to-bumper car jams in Solang & Mall Road', hiddenGem: 'Quiet forest walking trails, babbling river sounds & zero vehicle honking' },
        { metric: 'Accommodations', famousSpot: 'Concrete hotel blocks', hiddenGem: 'Handcrafted timber-and-stone Kathkuni wooden cottages with pine-scented balconies' }
      ]
    },

    localEconomy: {
      localImpactScore: 95,
      economicRetentionExplainer: '95% of spend goes directly to mountain village families who own the wooden cottages, cook fresh Pahari meals, and guide nature treks.',
      authenticHomestays: [
        { name: 'Riverside Kathkuni Wooden Cottage', hostName: 'Paras & Divya Thakur', village: 'Gushaini, Tirthan Valley', pricePerNight: 2200, specialties: ['Direct river access', 'Steaming hot Siddu & walnut chutney', 'Angling permit assistance'], rating: 4.98 },
        { name: 'Jibhi Cedar Woods Homestay', hostName: 'Bhagwant Rana', village: 'Jibhi Village', pricePerNight: 1800, specialties: ['Pine forest view', 'Campfire & Himachali stories', 'Jalori Pass guidance'], rating: 4.94 }
      ],
      traditionalKhanavals: [
        { name: 'Didi Ki Rasoi & Siddu Cafe', signatureDish: 'Freshly Steamed Poppyseed Siddu with Desi Ghee', location: 'Gushaini Market', avgMealCost: 160, isFamilyRun: true }
      ],
      communityGuides: [
        { name: 'Hemraj Sharma', expertise: 'GHNP UNESCO Certified Naturalist & Birding Guide', languages: ['Hindi', 'Pahari', 'English'], badge: 'Eco-Tourism Society Guide', dailyRate: 1200 }
      ],
      artisanCooperatives: [
        { craft: 'Kullvi Woolen Handlooms', guildName: 'Outer Seraj Wool Weavers Society', village: 'Banjar', directBuyingContact: '+91 1903 221804' }
      ],
      localTransportOptions: [
        { mode: 'Local Mountain 4x4 / Eco Cab', typicalRoute: 'Aut Tunnel to Jibhi / Gushaini', approxFare: '₹800 - ₹1,400', ecoFriendly: true }
      ]
    },

    bestTimeEngine: {
      bestSeasonDescription: 'Spring to Autumn (March to June & September to November) for lush greenery, apple blossoms, and trekking; December to February for fairytale snowscapes.',
      idealMonths: ['March', 'April', 'May', 'June', 'September', 'October', 'November', 'December'],
      timeOfDayGuide: {
        morning: { hours: '06:30 AM - 10:00 AM', recommendation: 'Riverside walk in Gushaini or morning trek towards the Great Himalayan National Park gate.', crowd: 'Low' },
        afternoon: { hours: '12:00 PM - 03:00 PM', recommendation: 'Relax by the riverbank with hot Siddu and freshly pan-fried trout.', crowd: 'Low' },
        evening: { hours: '04:00 PM - 06:30 PM', recommendation: 'Explore the 1500-year-old Chehni Kothi tower and Jibhi wooden bridges.', crowd: 'Moderate' },
        night: { hours: '07:30 PM - 09:30 PM', recommendation: 'Warm up by the wood-fired Bukhari stove with local Pahari herbal tea and stargazing.', crowd: 'Low' }
      },
      weatherIndexCurrent: 98,
      weatherForecastNarrative: 'Pure crisp mountain air with crystal clear Himalayan views.',
      budgetEstimator: {
        budgetTier: { stayPerDay: 1000, foodPerDay: 400, transitPerDay: 300, totalDaily: 1700 },
        moderateTier: { stayPerDay: 2400, foodPerDay: 800, transitPerDay: 600, totalDaily: 3800 },
        luxuryTier: { stayPerDay: 5800, foodPerDay: 1800, transitPerDay: 1200, totalDaily: 8800 }
      },
      upcomingEvents: [
        { name: 'Outer Seraj Apple Blossom Fest', dateRange: 'April 5 - 15', type: 'Spring Agri-Festival', significance: 'Valley turns pink and white with blooming apple and cherry orchards.' },
        { name: 'Tirthan River Eco-Angling Meet', dateRange: 'October', type: 'Catch-and-Release Conservation', significance: 'Sustainable trout conservation and youth angling workshops.' }
      ]
    }
  },

  // 3. EAST INDIA: RAGHURAJPUR & PURI, ODISHA (Living Heritage Crafts Village)
  {
    id: 'dest-raghurajpur',
    name: 'Raghurajpur Heritage Craft Village',
    stateOrRegion: 'Odisha',
    country: 'India',
    isInternational: false,
    state: 'Odisha',
    region: 'Coastal Odisha',
    district: 'Puri',
    thematicTags: ['culture', 'shopping', 'heritage', 'spirituality', 'food'],
    tierCategory: 'Rural/Village',
    popularityTier: 'gem',
    carryingCapacityDaily: 1500,
    currentCapacityLoadPct: 22,
    isOvertouristed: false,
    localEconomicRetentionPct: 96,
    sustainabilityScore: 97,
    affordabilityIndex: 95,
    tagline: 'UNESCO Living Heritage Village: Pattachitra Master Painters, Gotipua Dance & Chhena Poda',
    description: 'Raghurajpur is a world-celebrated heritage crafts village near Puri where every single home is an active art studio and every resident is an artisan. Renowned for GI-tagged Pattachitra palm-leaf paintings, Gotipua traditional dance (precursor to Odissi), cow-dung papier-mâché masks, and caramelized Chhena Poda.',
    heroImage: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['cultural', 'heritage', 'spirituality', 'culinary'],
    rating: 4.95,
    reviewCount: 910,
    lat: 19.8667,
    lng: 85.8167,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 26,
      condition: 'Pleasant & Sunny',
      icon: 'Sun',
      forecast: 'Clear sunny sky with gentle coastal breeze from the Bay of Bengal',
      airQualityIndex: 24
    },
    safetyScore: {
      overall: 98,
      daySafety: 99,
      nightSafety: 97,
      emergencyContact: '112 / Puri District Police (+91 6752 222020)',
      advisory: 'Deeply respectful village environment. Photography inside master artisan homes is warmly welcomed.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: '11:00 AM - 1:30 PM',
      quietHours: '7:00 AM - 10:00 AM',
      recommendation: 'Arrive early at 8:00 AM to watch master painters grind natural mineral stones and tree sap colors in their verandahs.'
    },
    popularAttractions: [
      {
        id: 'att-raghu-1',
        name: 'Raghurajpur Master Pattachitra Studios',
        category: 'Heritage',
        rating: 4.98,
        reviewCount: 1350,
        estimatedTime: '3 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=600&q=80',
        description: 'Two parallel rows of 120 historic thatched homes with mural-painted exterior walls, where master Chitrakars paint ancient epics.',
        lat: 19.8672,
        lng: 85.8169,
        crowdLevel: 'Low',
        bestTimeToVisit: '8:30 AM - 12:00 PM',
        isOffbeat: true
      },
      {
        id: 'att-raghu-2',
        name: 'Gotipua Gurukul & Dance Academy',
        category: 'Heritage',
        rating: 4.94,
        reviewCount: 780,
        estimatedTime: '2 hrs',
        entryFee: 100,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Traditional gurukul preserving Gotipua dance — young boys dressed in female attire performing acrobatic Odissi bandhas.',
        lat: 19.8655,
        lng: 85.8142,
        crowdLevel: 'Low',
        bestTimeToVisit: '4:30 PM - 6:30 PM',
        isOffbeat: true
      }
    ],
    localCuisines: ['Authentic Wood-Baked Chhena Poda', 'Puri Jagannath Mahaprasad (Abhada Thali)', 'Dalma with Aromatic Gobindobhog Rice', 'Chhena Gaja & Khaja', 'Dahi Baigana', 'Maccha Besara (Mustard Fish)'],
    startingPrice: 5200,

    culturalSpecialties: {
      food: [
        { name: 'Authentic Wood-Fired Chhena Poda', description: 'India’s original cottage cheese cheesecake — fresh chhena kneaded with cardamom, sugar, and cashews, baked overnight wrapped in Sal leaves.', mustTryAt: 'Nimapara Sweet Stalls & Village Kitchens', isVeg: true, tag: 'Signature Odia Confection' },
        { name: 'Odia Dalma with Gobindobhog Rice', description: 'Wholesome roasted moong dal slow-cooked with raw papaya, pumpkin, arbi, and tempered with ghee and freshly roasted Panch Phoron.', isVeg: true, tag: 'Ancient Temple Comfort' }
      ],
      clothing: [
        { name: 'Sambalpuri & Khandua Silk Sarees (GI Tagged)', description: 'Sacred tie-and-dye (Ikat) silk weaves bearing Gitagovinda shlokas and temple borders woven on handlooms.', occasion: 'Temple Offerings & Auspicious Festivals', authenticHub: 'Puri Weaver Cooperatives' }
      ],
      handicrafts: [
        { name: 'Pattachitra & Tala Pattachitra (GI Tagged)', description: 'Intricate cloth scroll paintings and etched dried palm-leaf manuscripts depicting Ramayana and Jagannath themes with 100% natural stone and conch-shell pigments.', giTagged: true, artisanCommunity: 'Chitrakar Artist Guild of Raghurajpur' },
        { name: 'Cow Dung & Papier-Mâché Masks', description: 'Hand-sculpted mythological character masks used in traditional Odia folk plays.', giTagged: false, artisanCommunity: 'Raghurajpur Mask Makers' }
      ],
      jewellery: [
        { name: 'Cuttack Tarakasi (Silver Filigree GI Tagged)', description: 'Hair-thin silver wires intricately spun and soldered into delicate peacocks, konark wheels, and bridal crowns.', material: 'Pure 99.9% Silver' }
      ],
      artAndCulture: [
        { name: 'Gotipua Acrobatic Dance', description: 'The 16th-century living root of Odissi classical dance, performed in village courtyards to the beats of Mardala drum.', type: 'folk_dance' }
      ],
      festivals: [
        { name: 'Raghurajpur Basant Utsav', monthOrSeason: 'February / March', culturalSignificance: 'Spring art carnival where the village celebrates color, Gotipua dance, and live open-air canvas painting.', celebrationHighlights: 'Night Gotipua performances under banyan trees.' }
      ],
      localShopping: [
        { product: 'Direct Master Artist Pattachitra Paintings', bestMarket: 'Artisan Homes of Raghurajpur', priceRange: '₹300 - ₹15,000', tip: 'Buy directly from the painter’s verandah to ensure 100% of payment goes to the artist.' },
        { product: 'Warm Sal-Leaf Baked Chhena Poda', bestMarket: 'Nimapara / Raghurajpur Arch', priceRange: '₹220 - ₹400 / kg', tip: 'Look for the dark caramelized outer crust for authentic smokiness.' }
      ],
      uniqueExperiences: [
        { title: 'Hands-on Pattachitra Painting Workshop with National Awardee Master', description: 'Learn to extract natural white color from conch shells and paint your own miniature bookmark on palm leaf.', bestTime: 'Morning 09:30 AM', localImpact: 'Direct financial support for hereditary artist families.' },
        { title: 'Private Evening Gotipua Dance Recital at Village Gurukul', description: 'Watch young dancers perform human pyramids (Bandhas) accompanied by live Mardala drum and harmonium.', bestTime: '05:00 PM', localImpact: 'Directly funds rural dance gurukul education and boarding.' }
      ]
    },

    alternativeTo: ['Puri Beach Resort Strip', 'dest-puri', 'Bhubaneswar'],
    whyAlternativeBetter: {
      headline: 'Step into Raghurajpur Living Heritage Village Instead of Standard Commercial Tourism',
      replacesFamousSpot: 'Puri Beach Commercial Area',
      crowdReductionPct: 76,
      costSavingsPct: 40,
      localAuthenticityScore: 99,
      keyAdvantage: 'Direct interactions with National Awardee master Chitrakars, Gotipua dance gurukuls, and 96% local artisan retention.',
      comparisonHighlights: [
        { metric: 'Art Experience', famousSpot: 'Commercial souvenir shops with mass-printed replicas', hiddenGem: 'Authentic 100% hand-painted art on palm leaves created right before your eyes' },
        { metric: 'Cultural Vibe', famousSpot: 'Noisy beach stalls', hiddenGem: 'Peaceful palm-lined village street filled with music and painting studios' }
      ]
    },

    localEconomy: {
      localImpactScore: 96,
      economicRetentionExplainer: '96% of traveler purchases directly sustain master painter households, Gotipua child dance apprentices, and village dairy sweet makers.',
      authenticHomestays: [
        { name: 'Chitrakar Heritage Artist Homestay', hostName: 'Rabi & Laxmipriya Chitrakar', village: 'Raghurajpur Village Main Lane', pricePerNight: 1300, specialties: ['Live art studio in house', 'Authentic Odia Dalma and rice meals', 'Palm-leaf painting lessons'], rating: 4.97 },
        { name: 'Bhargavi River Eco-Retreat', hostName: 'Pradeep Das', village: 'Near Raghurajpur Bridge', pricePerNight: 1600, specialties: ['Coconut grove view', 'Village cycling tour', 'Organic garden meals'], rating: 4.91 }
      ],
      traditionalKhanavals: [
        { name: 'Maa Tarini Odia Rasoi', signatureDish: 'Authentic Dalma, Machha Besara & Warm Chhena Poda', location: 'Chandanpur Junction', avgMealCost: 150, isFamilyRun: true }
      ],
      communityGuides: [
        { name: 'Kalu Charan Maharana', expertise: 'Pattachitra Iconography & Gotipua Dance History', languages: ['Odia', 'Hindi', 'English'], badge: 'Master Artist & Heritage Guide', dailyRate: 900 }
      ],
      artisanCooperatives: [
        { craft: 'Pattachitra & Palm Leaf Engravings', guildName: 'Raghurajpur Chitrakar Shilpa Samiti', village: 'Raghurajpur', directBuyingContact: '+91 6752 248102' }
      ],
      localTransportOptions: [
        { mode: 'Local Eco Auto / E-Rickshaw', typicalRoute: 'Puri Railway Station to Raghurajpur', approxFare: '₹120 - ₹220', ecoFriendly: true }
      ]
    },

    bestTimeEngine: {
      bestSeasonDescription: 'Winter (October to March) — Crisp, pleasant coastal weather with 20°C-28°C temperatures and vibrant village dance festivals.',
      idealMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
      timeOfDayGuide: {
        morning: { hours: '07:30 AM - 10:30 AM', recommendation: 'Walk down the mural-painted street and watch master artists prepare natural mineral pigments.', crowd: 'Low' },
        afternoon: { hours: '12:00 PM - 02:30 PM', recommendation: 'Enjoy wholesome Odia home-cooked Dalma and fresh Chhena Poda.', crowd: 'Low' },
        evening: { hours: '04:00 PM - 06:30 PM', recommendation: 'Watch Gotipua dance performance at the village gurukul and shop for authentic scrolls.', crowd: 'Moderate' },
        night: { hours: '07:30 PM - 09:30 PM', recommendation: 'Stargaze in the quiet village courtyard or listen to Odia flute recitals.', crowd: 'Low' }
      },
      weatherIndexCurrent: 94,
      weatherForecastNarrative: 'Soothing coastal warmth with cooling evening breezes.',
      budgetEstimator: {
        budgetTier: { stayPerDay: 800, foodPerDay: 320, transitPerDay: 200, totalDaily: 1320 },
        moderateTier: { stayPerDay: 1800, foodPerDay: 650, transitPerDay: 400, totalDaily: 2850 },
        luxuryTier: { stayPerDay: 4200, foodPerDay: 1400, transitPerDay: 900, totalDaily: 6500 }
      },
      upcomingEvents: [
        { name: 'Raghurajpur Heritage Art & Gotipua Mahotsav', dateRange: 'November 20 - 24', type: 'Folk Art & Dance', significance: 'Open village celebration featuring all 120 artist households and daily Gotipua recitals.' }
      ]
    }
  }
];
