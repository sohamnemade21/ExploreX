import { Destination, TravelPackage, ExplorerVehicleOption, Review, Booking, GroupTrip, UserProfile, TravelVibe } from '../../src/types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'dest-bali',
    name: 'Bali',
    stateOrRegion: 'Bali Province',
    country: 'Indonesia',
    isInternational: true,
    tagline: 'Island of the Gods, Serene Beaches & Sacred Temples',
    description: 'Experience the enchantment of Bali with its volcanic mountains, iconic rice terraces, exotic beaches, and deeply spiritual Hindu culture. Perfect for both relaxation and adventure.',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['beach', 'nature', 'wellness', 'culinary', 'adventure'],
    rating: 4.85,
    reviewCount: 4280,
    lat: -8.409518,
    lng: 115.188919,
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    currentWeather: {
      tempC: 28,
      condition: 'Tropical Sunshine',
      icon: 'Sun',
      forecast: 'Clear skies with evening ocean breeze',
      airQualityIndex: 28
    },
    safetyScore: {
      overall: 92,
      daySafety: 96,
      nightSafety: 88,
      emergencyContact: '+62 361 112 (Bali Police Tourist Dept)',
      advisory: 'Extremely safe for solo travelers and families. Respect temple dress codes.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '10:00 AM - 2:00 PM (Ubud), 4:30 PM - 7:00 PM (Uluwatu Sunset)',
      quietHours: '6:00 AM - 9:00 AM',
      recommendation: 'Visit Tegallalang Rice Terraces early at 7:00 AM for soft morning light and zero queues.'
    },
    popularAttractions: [
      {
        id: 'att-bali-1',
        name: 'Uluwatu Cliff Temple & Kecak Dance',
        category: 'Heritage',
        rating: 4.9,
        reviewCount: 2310,
        estimatedTime: '2.5 hrs',
        entryFee: 15,
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80',
        description: 'Perched atop a 70-meter limestone cliff overlooking the roaring Indian Ocean.',
        lat: -8.8291,
        lng: 115.0849,
        crowdLevel: 'Peak',
        bestTimeToVisit: '4:30 PM - 6:30 PM'
      },
      {
        id: 'att-bali-2',
        name: 'Tegallalang Sacred Rice Terraces',
        category: 'Nature',
        rating: 4.8,
        reviewCount: 1890,
        estimatedTime: '2 hrs',
        entryFee: 8,
        image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80',
        description: 'Cascading emerald green rice paddies sculpted with the ancient Subak irrigation system.',
        lat: -8.4312,
        lng: 115.2796,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '7:00 AM - 9:30 AM'
      },
      {
        id: 'att-bali-3',
        name: 'Nusa Penida Kelingking T-Rex Beach',
        category: 'Adventure',
        rating: 4.95,
        reviewCount: 3100,
        estimatedTime: '4 hrs',
        entryFee: 12,
        image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=600&q=80',
        description: 'World-famous cliff formation resembling a Tyrannosaurus Rex overlooking turquoise waters.',
        lat: -8.7511,
        lng: 115.4746,
        crowdLevel: 'High',
        bestTimeToVisit: '8:00 AM - 11:00 AM',
        isOffbeat: true
      }
    ],
    localCuisines: ['Babi Guling', 'Nasi Goreng Kampung', 'Sate Lilit', 'Ayam Betutu', 'Tropical Dragonfruit Bowls'],
    startingPrice: 42000
  },
  {
    id: 'dest-switzerland',
    name: 'Swiss Alps & Interlaken',
    stateOrRegion: 'Bernese Oberland',
    country: 'Switzerland',
    isInternational: true,
    tagline: 'Snow-Capped Peaks, Crystal Lakes & Scenic Train Journeys',
    description: 'The pinnacle of alpine magnificence. From the towering heights of Jungfraujoch to the serene waters of Lake Brienz and Lake Thun, Switzerland offers pristine nature and world-class hospitality.',
    heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['mountain', 'nature', 'luxury', 'adventure', 'wellness'],
    rating: 4.94,
    reviewCount: 3890,
    lat: 46.6863,
    lng: 7.8632,
    bestMonths: ['June', 'July', 'August', 'December', 'January', 'February'],
    currentWeather: {
      tempC: 14,
      condition: 'Crisp Alpine Breeze',
      icon: 'CloudSun',
      forecast: 'Partly sunny, ideal visibility on mountain tops',
      airQualityIndex: 12
    },
    safetyScore: {
      overall: 98,
      daySafety: 99,
      nightSafety: 97,
      emergencyContact: '117 (Swiss Police), 144 (Ambulance)',
      advisory: 'Ranked among the safest countries globally with exceptionally punctual public transport.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '11:00 AM - 3:00 PM (Jungfrau train)',
      quietHours: '8:00 AM - 10:30 AM',
      recommendation: 'Book the first morning train to Jungfraujoch to enjoy uncrowded viewing decks.'
    },
    popularAttractions: [
      {
        id: 'att-swiss-1',
        name: 'Jungfraujoch - Top of Europe',
        category: 'Sightseeing',
        rating: 4.9,
        reviewCount: 2850,
        estimatedTime: '5 hrs',
        entryFee: 180,
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
        description: 'Europe’s highest railway station at 3,454m with the Great Aletsch Glacier and ice palace.',
        lat: 46.5475,
        lng: 7.9822,
        crowdLevel: 'High',
        bestTimeToVisit: '9:00 AM - 1:00 PM'
      },
      {
        id: 'att-swiss-2',
        name: 'Lauterbrunnen Valley of 72 Waterfalls',
        category: 'Nature',
        rating: 4.95,
        reviewCount: 2200,
        estimatedTime: '3 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'A fairytale valley dotted with dramatic vertical cliffs and Staubbach Fall.',
        lat: 46.5935,
        lng: 7.9079,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '10:00 AM - 4:00 PM'
      }
    ],
    localCuisines: ['Traditional Cheese Fondue', 'Raclette', 'Zürcher Geschnetzeltes', 'Rösti', 'Swiss Artisan Chocolates'],
    startingPrice: 95000
  },
  {
    id: 'dest-goa',
    name: 'Goa',
    stateOrRegion: 'Goa',
    country: 'India',
    isInternational: false,
    tagline: 'Sun, Sand, Portuguese Heritage & Vibrant Coastal Vibes',
    description: 'India’s ultimate coastal paradise. Blend Portuguese architecture in Old Goa, golden sandy shores in South Goa, buzzing nightlife in North Goa, and mouthwatering coastal seafood.',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['beach', 'heritage', 'culinary', 'budget', 'adventure'],
    rating: 4.78,
    reviewCount: 6540,
    lat: 15.2993,
    lng: 74.1240,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 30,
      condition: 'Sunny & Coastal',
      icon: 'Sun',
      forecast: 'Warm sea breeze, ideal water sports weather',
      airQualityIndex: 35
    },
    safetyScore: {
      overall: 88,
      daySafety: 94,
      nightSafety: 82,
      emergencyContact: '112 (Tourist Police Goa)',
      advisory: 'Stick to licensed shacks and registered Explorer cabs for late night travel.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '5:00 PM - 8:00 PM (Baga & Calangute Beach)',
      quietHours: '7:00 AM - 11:00 AM (Palolem & Cola Beach)',
      recommendation: 'Head to South Goa (Agonda & Palolem) for serene vibes and dolphin watching.'
    },
    popularAttractions: [
      {
        id: 'att-goa-1',
        name: 'Palolem Beach & Butterfly Island',
        category: 'Nature',
        rating: 4.8,
        reviewCount: 3400,
        estimatedTime: '4 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
        description: 'Crescent-shaped white sand beach lined with vibrant swaying coconut palms.',
        lat: 15.0100,
        lng: 74.0232,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '3:30 PM - 7:00 PM'
      },
      {
        id: 'att-goa-2',
        name: 'Basilica of Bom Jesus & Old Goa',
        category: 'Heritage',
        rating: 4.75,
        reviewCount: 2900,
        estimatedTime: '2 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
        description: 'UNESCO World Heritage monument showcasing Baroque architecture holding relics of St. Francis Xavier.',
        lat: 15.5009,
        lng: 73.9116,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '9:00 AM - 12:00 PM'
      }
    ],
    localCuisines: ['Goan Fish Curry Thali', 'Prawn Balchão', 'Bebinca', 'Pork Vindaloo', 'Poi Bread with Xacuti'],
    startingPrice: 14940
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo & Mount Fuji',
    stateOrRegion: 'Kanto',
    country: 'Japan',
    isInternational: true,
    tagline: 'Futuristic Innovation Meets Ancient Shinto Traditions',
    description: 'A mind-bending blend of neon skyscrapers, peaceful Shinto shrines, Michelin-star dining, cherry blossoms, and majestic views of Mount Fuji.',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['urban', 'culinary', 'heritage', 'luxury', 'nature'],
    rating: 4.96,
    reviewCount: 5120,
    lat: 35.6762,
    lng: 139.6503,
    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    currentWeather: {
      tempC: 19,
      condition: 'Pleasant & Mild',
      icon: 'Sun',
      forecast: 'Clear skies with great visibility towards Mt. Fuji',
      airQualityIndex: 18
    },
    safetyScore: {
      overall: 99,
      daySafety: 99,
      nightSafety: 98,
      emergencyContact: '110 (Police), 119 (Fire/Ambulance)',
      advisory: 'One of the safest metropolises on earth. Lost items are almost always returned.'
    },
    crowdPrediction: {
      currentStatus: 'High',
      peakHours: '5:30 PM - 8:30 PM (Shibuya Crossing & Shinjuku)',
      quietHours: '7:00 AM - 9:30 AM (Senso-ji & Meiji Shrine)',
      recommendation: 'Visit teamLab Borderless and Senso-ji first thing in the morning for best photos.'
    },
    popularAttractions: [
      {
        id: 'att-tokyo-1',
        name: 'Senso-ji Temple & Asakusa',
        category: 'Heritage',
        rating: 4.85,
        reviewCount: 4200,
        estimatedTime: '2.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
        description: 'Tokyo’s oldest and most significant Buddhist temple with the majestic Kaminarimon Gate.',
        lat: 35.7148,
        lng: 139.7967,
        crowdLevel: 'High',
        bestTimeToVisit: '7:30 AM - 10:00 AM'
      },
      {
        id: 'att-tokyo-2',
        name: 'Mount Fuji 5th Station & Lake Kawaguchiko',
        category: 'Nature',
        rating: 4.95,
        reviewCount: 3800,
        estimatedTime: 'Full Day',
        entryFee: 35,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
        description: 'Iconic snow-capped volcano reflecting in the crystal clear lake with traditional pagoda views.',
        lat: 35.3606,
        lng: 138.7274,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 2:00 PM'
      }
    ],
    localCuisines: ['A5 Wagyu Sukiyaki', 'Tonkotsu Ramen', 'Fresh Edomae Sushi at Tsukiji', 'Matcha Parfait', 'Yakitori'],
    startingPrice: 78000
  },
  {
    id: 'dest-manali',
    name: 'Manali & Solang Valley',
    stateOrRegion: 'Himachal Pradesh',
    country: 'India',
    isInternational: false,
    tagline: 'Himalayan Wonderland, Pine Forests & Snow Adventures',
    description: 'Nestled on the banks of Beas River in the Pir Panjal mountains, Manali is India’s beloved hill destination offering paragliding, snow valleys, apple orchards, and hot water springs.',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['mountain', 'nature', 'adventure', 'budget', 'wellness'],
    rating: 4.79,
    reviewCount: 4120,
    lat: 32.2432,
    lng: 77.1892,
    bestMonths: ['October', 'November', 'December', 'January', 'April', 'May', 'June'],
    currentWeather: {
      tempC: 11,
      condition: 'Crisp Mountain Breeze',
      icon: 'CloudSun',
      forecast: 'Clear skies with light evening chill',
      airQualityIndex: 15
    },
    safetyScore: {
      overall: 90,
      daySafety: 95,
      nightSafety: 85,
      emergencyContact: '112 (Himachal Tourist Police)',
      advisory: 'Check Atal Tunnel pass status during peak snowfall months.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '11:00 AM - 3:00 PM (Solang Valley)',
      quietHours: '8:00 AM - 10:00 AM (Old Manali cafes)',
      recommendation: 'Head to Sethan Village for pristine offbeat snow igloos and stargazing.'
    },
    popularAttractions: [
      {
        id: 'att-manali-1',
        name: 'Solang Valley Adventure Arena',
        category: 'Adventure',
        rating: 4.7,
        reviewCount: 3100,
        estimatedTime: '4 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
        description: 'Year-round sports hub for paragliding, zorbing, ATV quad biking, and skiing.',
        lat: 32.3166,
        lng: 77.1575,
        crowdLevel: 'High',
        bestTimeToVisit: '9:00 AM - 1:00 PM'
      },
      {
        id: 'att-manali-2',
        name: 'Atal Tunnel & Sissu Waterfall',
        category: 'Nature',
        rating: 4.9,
        reviewCount: 2800,
        estimatedTime: '3.5 hrs',
        entryFee: 0,
        image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80',
        description: 'World’s longest highway tunnel above 10,000 feet leading to the dramatic Lahaul Valley.',
        lat: 32.4820,
        lng: 77.0864,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '10:00 AM - 3:00 PM',
        isOffbeat: true
      }
    ],
    localCuisines: ['Himachali Siddu with Ghee', 'Tudkiya Bhath', 'Dhaam Platter', 'Fresh Himalayan Trout', 'Apple Crumble Tart'],
    startingPrice: 12450
  },
  {
    id: 'dest-paris',
    name: 'Paris & Versailles',
    stateOrRegion: 'Île-de-France',
    country: 'France',
    isInternational: true,
    tagline: 'City of Light, Haute Couture, World Art & Romance',
    description: 'Immerse yourself in world-renowned art at the Louvre, marvel at the Eiffel Tower, stroll down the Champs-Élysées, and savor flaky croissants in charming sidewalk bistros.',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['urban', 'heritage', 'luxury', 'culinary', 'wellness'],
    rating: 4.88,
    reviewCount: 7800,
    lat: 48.8566,
    lng: 2.3522,
    bestMonths: ['April', 'May', 'June', 'September', 'October'],
    currentWeather: {
      tempC: 18,
      condition: 'Sunny with Soft Clouds',
      icon: 'Sun',
      forecast: 'Pleasant afternoon, ideal for Seine river cruise',
      airQualityIndex: 25
    },
    safetyScore: {
      overall: 89,
      daySafety: 94,
      nightSafety: 84,
      emergencyContact: '17 (Police Secours), 112 (European Emergency)',
      advisory: 'Stay mindful of belongings in crowded metro hubs and around Eiffel Tower plaza.'
    },
    crowdPrediction: {
      currentStatus: 'High',
      peakHours: '1:00 PM - 5:00 PM (Louvre & Eiffel Tower)',
      quietHours: '8:30 AM - 10:30 AM (Montmartre & Sainte-Chapelle)',
      recommendation: 'Pre-book timed museum slots to bypass 90-minute security queues.'
    },
    popularAttractions: [
      {
        id: 'att-paris-1',
        name: 'Eiffel Tower & Champ de Mars',
        category: 'Sightseeing',
        rating: 4.9,
        reviewCount: 8200,
        estimatedTime: '3 hrs',
        entryFee: 32,
        image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
        description: 'The global architectural icon of Paris offering panoramic 360-degree city views.',
        lat: 48.8584,
        lng: 2.2945,
        crowdLevel: 'Peak',
        bestTimeToVisit: '6:30 PM - 9:00 PM (Sunset & Sparkle)'
      },
      {
        id: 'att-paris-2',
        name: 'Palace of Versailles & Grand Gardens',
        category: 'Heritage',
        rating: 4.92,
        reviewCount: 4600,
        estimatedTime: '5 hrs',
        entryFee: 28,
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
        description: 'Opulent royal residence with the Hall of Mirrors and fountain gardens.',
        lat: 48.8049,
        lng: 2.1204,
        crowdLevel: 'High',
        bestTimeToVisit: '9:00 AM - 12:30 PM'
      }
    ],
    localCuisines: ['Fresh Butter Croissants', 'Duck Confit', 'Boeuf Bourguignon', 'Crème Brûlée', 'Macarons from Ladurée'],
    startingPrice: 56440
  },
  {
    id: 'dest-jaipur',
    name: 'Jaipur - The Pink City',
    stateOrRegion: 'Rajasthan',
    country: 'India',
    isInternational: false,
    tagline: 'Royal Forts, Intricate Palaces & Rich Royal Heritage',
    description: 'The jewel of Rajasthan. Marvel at Amber Fort, the wind palace Hawa Mahal, City Palace, bustling bazaar colors, and royal Rajput hospitality.',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['heritage', 'culinary', 'budget', 'luxury'],
    rating: 4.82,
    reviewCount: 3950,
    lat: 26.9124,
    lng: 75.7873,
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 25,
      condition: 'Pleasant & Warm',
      icon: 'Sun',
      forecast: 'Clear golden sunshine throughout the day',
      airQualityIndex: 42
    },
    safetyScore: {
      overall: 91,
      daySafety: 96,
      nightSafety: 86,
      emergencyContact: '112 (Jaipur Tourist Assistance)',
      advisory: 'Registered government guides are recommended inside Amber Fort and City Palace.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '10:30 AM - 2:00 PM (Amber Fort)',
      quietHours: '7:30 AM - 9:30 AM (Hawa Mahal facade & Jal Mahal)',
      recommendation: 'Visit Nahargarh Fort at sunset for golden views over the entire Pink City.'
    },
    popularAttractions: [
      {
        id: 'att-jaipur-1',
        name: 'Amber Palace & Maota Lake',
        category: 'Heritage',
        rating: 4.88,
        reviewCount: 3600,
        estimatedTime: '3 hrs',
        entryFee: 6,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        description: 'Majestic hilltop fortress featuring the breathtaking Sheesh Mahal (Mirror Palace).',
        lat: 26.9855,
        lng: 75.8513,
        crowdLevel: 'High',
        bestTimeToVisit: '8:30 AM - 11:30 AM'
      },
      {
        id: 'att-jaipur-2',
        name: 'Hawa Mahal (Palace of Winds)',
        category: 'Heritage',
        rating: 4.8,
        reviewCount: 3100,
        estimatedTime: '1.5 hrs',
        entryFee: 4,
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
        description: 'Unique five-story facade with 953 intricately carved jharokhas (small windows).',
        lat: 26.9239,
        lng: 75.8267,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '8:00 AM - 10:00 AM'
      }
    ],
    localCuisines: ['Dal Baati Churma', 'Laal Maas', 'Ghevar', 'Pyaz Kachori from Rawat', 'Ker Sangri'],
    startingPrice: 11620
  },
  {
    id: 'dest-maldives',
    name: 'Maldives Private Atolls',
    stateOrRegion: 'Kaafu Atoll',
    country: 'Maldives',
    isInternational: true,
    tagline: 'Overwater Luxury Villas, Turquoise Lagoons & Coral Reefs',
    description: 'The ultimate tropical dream. Sleep directly over tranquil crystal-clear turquoise waters, snorkel with sea turtles and manta rays, and enjoy world-class private dining on pristine sandbanks.',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['beach', 'luxury', 'wellness', 'nature'],
    rating: 4.97,
    reviewCount: 2950,
    lat: 3.2028,
    lng: 73.2207,
    bestMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    currentWeather: {
      tempC: 29,
      condition: 'Tropical Sunshine & Gentle Waves',
      icon: 'Sun',
      forecast: 'Warm sunshine, calm water visibility > 30 meters',
      airQualityIndex: 10
    },
    safetyScore: {
      overall: 99,
      daySafety: 99,
      nightSafety: 99,
      emergencyContact: '119 (Police), 102 (Medical Services)',
      advisory: 'All private island resorts operate with dedicated 24/7 medical and water safety teams.'
    },
    crowdPrediction: {
      currentStatus: 'Low',
      peakHours: 'Private isolated islands - no public crowding',
      quietHours: 'All day',
      recommendation: 'Book a sunset dolphin cruise or private sandbank dinner for unforgettable memories.'
    },
    popularAttractions: [
      {
        id: 'att-maldives-1',
        name: 'Hanifaru Bay Manta Sanctuary',
        category: 'Nature',
        rating: 4.98,
        reviewCount: 1400,
        estimatedTime: '3.5 hrs',
        entryFee: 75,
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80',
        description: 'UNESCO Biosphere Reserve where hundreds of graceful manta rays and whale sharks congregate.',
        lat: 5.1718,
        lng: 73.1444,
        crowdLevel: 'Low',
        bestTimeToVisit: '10:00 AM - 2:00 PM'
      }
    ],
    localCuisines: ['Fresh Grilled Reef Fish', 'Mas Huni with Fresh Roshi', 'Garudhiya Fish Broth', 'Coconut Biscuits'],
    startingPrice: 95450
  },
  {
    id: 'dest-dubai',
    name: 'Dubai & Arabian Desert',
    stateOrRegion: 'Dubai Emirate',
    country: 'United Arab Emirates',
    isInternational: true,
    tagline: 'Record-Breaking Architecture, Desert Safaris & Modern Luxury',
    description: 'A city of superlatives. From the sky-piercing Burj Khalifa and Palm Jumeirah to thrilling dune bashing in the red Arabian desert and opulent shopping malls.',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80'
    ],
    vibe: ['luxury', 'urban', 'adventure', 'culinary'],
    rating: 4.89,
    reviewCount: 6200,
    lat: 25.2048,
    lng: 55.2708,
    bestMonths: ['November', 'December', 'January', 'February', 'March'],
    currentWeather: {
      tempC: 27,
      condition: 'Warm & Clear',
      icon: 'Sun',
      forecast: 'Sunny day with cool evening desert breeze',
      airQualityIndex: 38
    },
    safetyScore: {
      overall: 97,
      daySafety: 99,
      nightSafety: 97,
      emergencyContact: '999 (Dubai Police), 998 (Ambulance)',
      advisory: 'Zero-tolerance crime rate. One of the safest cities globally for female travelers.'
    },
    crowdPrediction: {
      currentStatus: 'Moderate',
      peakHours: '6:00 PM - 9:30 PM (Dubai Mall Fountain & Burj Khalifa)',
      quietHours: '9:00 AM - 11:30 AM (Museum of the Future)',
      recommendation: 'Book Burj Khalifa 148th floor At The Top SKY for fast-track VIP access.'
    },
    popularAttractions: [
      {
        id: 'att-dubai-1',
        name: 'Burj Khalifa - Levels 124, 125 & 148',
        category: 'Sightseeing',
        rating: 4.92,
        reviewCount: 7100,
        estimatedTime: '2.5 hrs',
        entryFee: 45,
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
        description: 'The tallest building on the planet reaching 828 meters high into the sky.',
        lat: 25.1972,
        lng: 55.2744,
        crowdLevel: 'High',
        bestTimeToVisit: '5:00 PM - 7:00 PM (Sunset Slot)'
      },
      {
        id: 'att-dubai-2',
        name: 'Red Dunes Desert Safari & Bedouin Camp',
        category: 'Adventure',
        rating: 4.89,
        reviewCount: 5400,
        estimatedTime: '6 hrs',
        entryFee: 55,
        image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=600&q=80',
        description: '4x4 Dune bashing, sandboarding, camel riding, BBQ buffet, and live Tanoura fire dance.',
        lat: 24.8315,
        lng: 55.7684,
        crowdLevel: 'Moderate',
        bestTimeToVisit: '3:00 PM - 9:00 PM'
      }
    ],
    localCuisines: ['Al Machboos', 'Shawarma with Garlic Toum', 'Luqaimat Sweet Dumplings', 'Kunafa', 'Camel Milk Gelato'],
    startingPrice: 48970
  }
];

export const INITIAL_PACKAGES: TravelPackage[] = [
  {
    id: 'pkg-bali-escape',
    destinationId: 'dest-bali',
    destinationName: 'Bali, Indonesia',
    title: 'Bali Tropical Luxury & Cultural Odyssey',
    tagline: '6 Days of Sacred Temples, Sunset Catamarans, Rice Terraces & Private Pool Villa',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 53950,
    priceBreakdown: {
      hotelStay: 24900,
      transport: 9960,
      activities: 11620,
      meals: 7470,
      taxesAndFees: 3320,
      discount: 3320,
      totalPerPerson: 53950
    },
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.92,
    reviewCount: 312,
    theme: 'beach',
    inclusions: [
      '5 Nights in 5-Star Private Pool Villa (Seminyak & Ubud)',
      'Daily Breakfast & 3 Gourmet Balinese Dinners',
      'Airport Pick & Drop in Luxury Explorer AC Van',
      'Uluwatu Temple VIP Sunset & Kecak Dance Tickets',
      'Nusa Penida Island Day Tour by Speedboat',
      'Private English-speaking Tour Guide & Chauffeur'
    ],
    exclusions: [
      'International Flight Airfare',
      'Indonesia Visa on Arrival ($35)',
      'Personal Souvenirs & Alcoholic Drinks'
    ],
    hotels: [
      {
        name: 'The Kayon Jungle Resort Ubud',
        stars: 5,
        roomType: 'Valley View Luxury Villa with Infinity Pool',
        address: 'Banjar Bresela, Payangan, Ubud, Bali'
      },
      {
        name: 'W Bali - Seminyak Beachfront',
        stars: 5,
        roomType: 'Spectacular Ocean Facing Suite',
        address: 'Jl. Petitenget, Kerobokan Kelod, Seminyak'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Paradise & Sunset Beach Club',
        description: 'Land at Denpasar Ngurah Rai Airport. Private Explorer transfer to Seminyak villa. Unwind at Potato Head Beach Club with sunset cocktails.',
        activities: ['Airport VIP Meet & Greet', 'Check-in Seminyak Villa', 'Sunset at Petitenget Beach'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'W Bali - Seminyak Beachfront'
      },
      {
        dayNumber: 2,
        title: 'Nusa Penida Island & Kelingking Dinosaur Cliff',
        description: 'Board speed catamaran to Nusa Penida. Visit Kelingking Beach, Angel Billabong, and Crystal Bay with guided snorkeling.',
        activities: ['Speedboat to Nusa Penida', 'Kelingking Cliff Viewpoint', 'Snorkel with Manta Rays'],
        mealsIncluded: ['Breakfast', 'Seafood Lunch'],
        stayHotel: 'W Bali - Seminyak Beachfront'
      },
      {
        dayNumber: 3,
        title: 'Cultural Ubud & Tegallalang Rice Terraces',
        description: 'Scenic transfer to Ubud. Walk among emerald Tegallalang terraces, ride the Bali Jungle Swing, and explore Ubud Royal Palace.',
        activities: ['Tegallalang Terraces Walk', 'Bali Jungle Giant Swing', 'Ubud Art Market'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'The Kayon Jungle Resort Ubud'
      },
      {
        dayNumber: 4,
        title: 'Sacred Water Cleansing & Mount Batur Viewpoint',
        description: 'Experience traditional Melukat spiritual water purification at Tirta Empul Temple followed by volcanic lunch overlooking Mount Batur.',
        activities: ['Tirta Empul Holy Springs', 'Kintamani Volcano Panoramic Lunch', 'Coffee Plantation Tasting'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'The Kayon Jungle Resort Ubud'
      },
      {
        dayNumber: 5,
        title: 'Uluwatu Cliff Sunset & Jimbaran Bay Candlelight Dinner',
        description: 'Visit the dramatic Uluwatu Temple perched 70m above ocean waves. Watch the hypnotic Kecak fire dance and dine on fresh lobster at Jimbaran Bay.',
        activities: ['Uluwatu Cliff Walk', 'Kecak Fire & Trance Dance', 'Jimbaran Candlelit Seafood Feast'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'The Kayon Jungle Resort Ubud'
      },
      {
        dayNumber: 6,
        title: 'Balinese Spa Massage & Departure',
        description: 'Morning 90-minute traditional herbal Balinese massage. Relax by the multi-tier jungle pool before private airport transfer.',
        activities: ['Traditional Balinese Spa', 'Souvenir Shopping', 'Transfer to Denpasar Airport'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 12,
    availableDates: ['2026-09-15', '2026-09-22', '2026-10-05', '2026-10-18', '2026-11-02'],
    isFeatured: true
  },
  {
    id: 'pkg-swiss-alps',
    destinationId: 'dest-switzerland',
    destinationName: 'Interlaken & Lucerne, Switzerland',
    title: 'Swiss Alpine Dreams: Jungfrau & Lake Cruises',
    tagline: '7 Days of Glacier Trains, Fairytale Valleys & 4-Star Mountain Chalets',
    durationDays: 7,
    durationNights: 6,
    startingPrice: 122840,
    priceBreakdown: {
      hotelStay: 59760,
      transport: 31540,
      activities: 21580,
      meals: 15770,
      taxesAndFees: 6640,
      discount: 12450,
      totalPerPerson: 122840
    },
    images: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.96,
    reviewCount: 184,
    theme: 'mountain',
    inclusions: [
      '6 Nights in Swiss Alpine Boutique Chalet Hotels (Interlaken & Lucerne)',
      '1st Class Swiss Travel Pass (Unlimited Trains, Boats & Buses)',
      'Jungfraujoch - Top of Europe Cogwheel Train Ticket & Ice Palace',
      'Mount Titlis Rotair Revolving Cable Car & Cliff Walk',
      'Daily Swiss Buffet Breakfast & 2 Traditional Fondue Dinners',
      'Lake Brienz Historic Steamboat Cruise'
    ],
    exclusions: [
      'International Flights to Zurich/Geneva',
      'Travel Insurance (Can be added on checkout)',
      'Personal Expenses'
    ],
    hotels: [
      {
        name: 'Victoria-Jungfrau Grand Hotel & Spa',
        stars: 5,
        roomType: 'Superior Alpine View Junior Suite',
        address: 'Höheweg 41, Interlaken'
      },
      {
        name: 'Hotel Schweizerhof Luzern',
        stars: 5,
        roomType: 'Lake Lucerne Premium Balcony Room',
        address: 'Schweizerhofquai, Lucerne'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Zurich & Scenic Train to Interlaken',
        description: 'Arrive at Zurich Airport. Board the Swiss scenic panoramic train through alpine meadows to Interlaken.',
        activities: ['Swiss Rail Scenic Transfer', 'Stroll down Höheweg promenade', 'Welcome Swiss Chocolate Fondue'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'Victoria-Jungfrau Grand Hotel & Spa'
      },
      {
        dayNumber: 2,
        title: 'Jungfraujoch 3,454m - The Top of Europe',
        description: 'Ascend the Eiger Express gondola and historic cogwheel railway into the glacier mountain station. Walk through the Ice Palace.',
        activities: ['Eiger Express Gondola', 'Sphinx Observation Deck', 'Aletsch Glacier Ice Palace'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Victoria-Jungfrau Grand Hotel & Spa'
      },
      {
        dayNumber: 3,
        title: 'Lauterbrunnen Valley & Grindelwald First Cliff Walk',
        description: 'Visit the fairytale valley of 72 waterfalls. Take cable car to Grindelwald First and walk the thrilling metal walkway suspended over abyss.',
        activities: ['Lauterbrunnen Staubbach Falls', 'Grindelwald First Cliff Walk', 'First Glider/Flyer option'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Victoria-Jungfrau Grand Hotel & Spa'
      },
      {
        dayNumber: 4,
        title: 'Lake Brienz Cruise & Transfer to Lucerne',
        description: 'Glide on turquoise glacial waters aboard a paddle steamer. Visit Giessbach Falls, then train to historic Lucerne.',
        activities: ['Lake Brienz Steamboat Cruise', 'Lucerne Chapel Bridge & Old Town Walk', 'Lion Monument'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Hotel Schweizerhof Luzern'
      },
      {
        dayNumber: 5,
        title: 'Mount Titlis 360° Revolving Cable Car & Glacier Cave',
        description: 'Ride the world’s first revolving cable car to Mount Titlis summit. Walk across Europe’s highest suspension bridge.',
        activities: ['Titlis Rotair Cable Car', 'Titlis Cliff Walk Bridge', 'Glacier Ice Flyer'],
        mealsIncluded: ['Breakfast', 'Alpine Lunch'],
        stayHotel: 'Hotel Schweizerhof Luzern'
      },
      {
        dayNumber: 6,
        title: 'Lake Lucerne Panorama Cruise & Cheese Tasting',
        description: 'Relax on a panoramic yacht cruise across Lake Lucerne with artisan Swiss cheese & wine tasting.',
        activities: ['Yacht Cruise on Lake Lucerne', 'Artisan Cheese & Wine Pairing', 'Free evening shopping in Lucerne'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'Hotel Schweizerhof Luzern'
      },
      {
        dayNumber: 7,
        title: 'Departure via Zurich Panoramic Train',
        description: 'Enjoy a leisurely breakfast overlooking Lake Lucerne before scenic train back to Zurich Airport for departure.',
        activities: ['Final Swiss souvenir shopping', 'Train to Zurich Airport'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 10,
    availableDates: ['2026-09-10', '2026-09-24', '2026-10-08', '2026-12-15', '2026-12-22'],
    isFeatured: true
  },
  {
    id: 'pkg-goa-coastal',
    destinationId: 'dest-goa',
    destinationName: 'Goa, India',
    title: 'Goa Coastal Serenity & Portuguese Heritage',
    tagline: '5 Days of Private South Goa Beaches, Spice Plantations & Catamaran Cruises',
    durationDays: 5,
    durationNights: 4,
    startingPrice: 23240,
    priceBreakdown: {
      hotelStay: 10790,
      transport: 4150,
      activities: 4980,
      meals: 3740,
      taxesAndFees: 1250,
      discount: 1660,
      totalPerPerson: 23240
    },
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.84,
    reviewCount: 420,
    theme: 'beach',
    inclusions: [
      '4 Nights in 5-Star Beach Resort in South Goa',
      'Daily Breakfast & 2 Authentic Goan Coastal Thali Lunches',
      'Private AC Cab for All Sightseeing with Explorer Service',
      'Dudhsagar Waterfall Jeep Safari',
      'Old Goa Heritage Churches & Fontainhas Latin Quarter Guided Walk',
      'Sunset Luxury Catamaran Cruise with Live Music'
    ],
    exclusions: [
      'Airfare/Train to Goa',
      'Personal Water Sports (Jet Ski/Parasailing)',
      'Late Night Club Cover Charges'
    ],
    hotels: [
      {
        name: 'The Leela Goa Beach Resort',
        stars: 5,
        roomType: 'Lagoon Suite with Private Balcony',
        address: 'Mobor Beach, Cavelossim, South Goa'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Goa & Mobor Beach Relaxation',
        description: 'Airport/Railway Station pickup in Explorer AC Cab. Check into beachfront resort. Enjoy afternoon by the pool and sunset on Mobor beach.',
        activities: ['Airport VIP Pick-up', 'Resort Check-in', 'Sunset at Mobor Beach'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'The Leela Goa Beach Resort'
      },
      {
        dayNumber: 2,
        title: 'Old Goa Heritage & Fontainhas Latin Quarter',
        description: 'Walk through 16th-century Portuguese churches in Old Goa and colorful pastel colonial houses in Fontainhas, Panjim.',
        activities: ['Basilica of Bom Jesus', 'Fontainhas Walking Tour', 'Goan Bakery Tasting'],
        mealsIncluded: ['Breakfast', 'Goan Fish Curry Lunch'],
        stayHotel: 'The Leela Goa Beach Resort'
      },
      {
        dayNumber: 3,
        title: 'Dudhsagar Waterfalls & Organic Spice Plantation',
        description: '4x4 Open Jeep safari through Mollem National Park to the 4-tiered Dudhsagar waterfall. Traditional spice plantation buffet lunch.',
        activities: ['Jeep Safari to Dudhsagar', 'Natural Pool Swimming', 'Spice Farm Guided Walk'],
        mealsIncluded: ['Breakfast', 'Traditional Buffet Lunch'],
        stayHotel: 'The Leela Goa Beach Resort'
      },
      {
        dayNumber: 4,
        title: 'Palolem Beach & Sunset Catamaran Cruise',
        description: 'Visit tranquil Palolem and Cola lagoon in South Goa. Board evening luxury catamaran for dolphin spotting and sunset tunes.',
        activities: ['Palolem Kayaking', 'Cola Beach Lagoon', 'Sunset Catamaran Cruise'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'The Leela Goa Beach Resort'
      },
      {
        dayNumber: 5,
        title: 'Morning Yoga on Beach & Departure',
        description: 'Complimentary beach yoga session. Savor breakfast before private transfer to Mopa/Dabolim Airport or Madgaon Station.',
        activities: ['Beachside Morning Yoga', 'Explorer Cab to Airport'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 15,
    availableDates: ['2026-09-18', '2026-10-02', '2026-10-20', '2026-11-10', '2026-12-01'],
    isFeatured: true
  },
  {
    id: 'pkg-tokyo-future',
    destinationId: 'dest-tokyo',
    destinationName: 'Tokyo & Mt. Fuji, Japan',
    title: 'Japan Fusion: Tokyo Futurism & Mount Fuji Wonders',
    tagline: '7 Days of Shinkansen Bullet Trains, teamLab Digital Art, Mt Fuji & Wagyu Feast',
    durationDays: 7,
    durationNights: 6,
    startingPrice: 112050,
    priceBreakdown: {
      hotelStay: 53950,
      transport: 24900,
      activities: 19920,
      meals: 16600,
      taxesAndFees: 4980,
      discount: 8300,
      totalPerPerson: 112050
    },
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.97,
    reviewCount: 260,
    theme: 'urban',
    inclusions: [
      '6 Nights in Luxury Tokyo Tower View Hotel (Shinjuku & Ginza)',
      '7-Day Whole Japan Rail Pass (Shinkansen Bullet Trains)',
      'teamLab Planets & Borderless VIP Entry',
      'Full-Day Guided Mt. Fuji 5th Station & Lake Kawaguchiko Tour',
      'Authentic A5 Wagyu Sukiyaki Dinner & Tsukiji Sushi Experience',
      'Pocket 5G Unlimited Wi-Fi Router'
    ],
    exclusions: ['International Flights to Haneda/Narita', 'Personal Shopping in Ginza'],
    hotels: [
      {
        name: 'Cerulean Tower Tokyu Hotel Shibuya',
        stars: 5,
        roomType: 'Sky View King Executive Room',
        address: '26-1 Sakuragaokacho, Shibuya City, Tokyo'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Neon Tokyo & Shibuya Crossing',
        description: 'Private Narita/Haneda pickup. Check in to sky suite with Mount Fuji & Shibuya skyline view. Cross the world’s busiest pedestrian crossing.',
        activities: ['Haneda Airport Express Transfer', 'Shibuya Crossing Walk', 'Shibuya Sky 360 Observation Deck'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'Cerulean Tower Tokyu Hotel Shibuya'
      },
      {
        dayNumber: 2,
        title: 'Traditional Asakusa & teamLab Planets Digital Art',
        description: 'Explore the ancient Senso-ji Temple and Nakamise shopping street. Immerse in the world-acclaimed teamLab Planets digital water museum.',
        activities: ['Senso-ji Temple & Kimono Rental', 'teamLab Planets Immersive Experience', 'Sumida River Water Bus'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Cerulean Tower Tokyu Hotel Shibuya'
      },
      {
        dayNumber: 3,
        title: 'Mount Fuji 5th Station & Lake Kawaguchiko Onsen',
        description: 'Ascend to Mt. Fuji 5th Station. Visit the iconic Chureito Pagoda and relax in open-air hot spring mineral baths.',
        activities: ['Mt. Fuji 5th Station Viewpoint', 'Chureito Pagoda Cherry View', 'Kawaguchiko Onsen Bath'],
        mealsIncluded: ['Breakfast', 'Kaiseki Dinner'],
        stayHotel: 'Cerulean Tower Tokyu Hotel Shibuya'
      },
      {
        dayNumber: 4,
        title: 'Tsukiji Outer Market & Akihabara Electric Town',
        description: 'Savor freshly torched fatty tuna and tamagoyaki at Tsukiji. Explore futuristic electronics and retro gaming in Akihabara.',
        activities: ['Tsukiji Food Safari', 'Akihabara Tech & Anime Exploration', 'Maid Cafe / VR Experience'],
        mealsIncluded: ['Breakfast', 'Street Food Tasting'],
        stayHotel: 'Cerulean Tower Tokyu Hotel Shibuya'
      },
      {
        dayNumber: 5,
        title: 'Shinjuku Gyoen National Garden & Roppongi Hills',
        description: 'Stroll through tranquil Japanese landscape gardens. Evening skyline views from Mori Art Museum tower.',
        activities: ['Shinjuku Gyoen Tea House', 'Meiji Jingu Shrine Forest Walk', 'Roppongi Hills Sunset'],
        mealsIncluded: ['Breakfast', 'A5 Wagyu Dinner'],
        stayHotel: 'Cerulean Tower Tokyu Hotel Shibuya'
      },
      {
        dayNumber: 6,
        title: 'Ginza Luxury District & Odaiba Bay Sunset',
        description: 'Shop world flagships in Ginza, admire the Giant Gundam statue in Odaiba, and ride the Yurikamome automated monorail across Rainbow Bridge.',
        activities: ['Ginza Luxury Walk', 'Odaiba Seaside Park & Rainbow Bridge', 'Sunset Cruise on Tokyo Bay'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'Cerulean Tower Tokyu Hotel Shibuya'
      },
      {
        dayNumber: 7,
        title: 'Matcha Ceremony & Departure',
        description: 'Participate in a traditional peaceful Urasenke matcha tea ceremony before private Narita/Haneda airport express train.',
        activities: ['Traditional Tea Ceremony', 'Airport Transfer'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 12,
    availableDates: ['2026-10-12', '2026-10-26', '2026-11-09', '2026-11-23'],
    isFeatured: true
  }
];

export const EXPLORER_VEHICLES: ExplorerVehicleOption[] = [
  {
    type: 'cab_sedan',
    name: 'Explorer Prime Sedan',
    capacity: '4 Passengers • 2 Bags',
    description: 'Comfortable air-conditioned sedan (Dzire, Honda City, Etios). Perfect for city rides & airport transfers.',
    baseFare: 50,
    perKmRate: 14,
    icon: 'Car',
    etaMins: 3
  },
  {
    type: 'cab_suv',
    name: 'Explorer XL SUV',
    capacity: '6 Passengers • 4 Bags',
    description: 'Spacious 6-seater SUV (Innova Crysta, Fortuner). Great for families, extra luggage, and mountain tours.',
    baseFare: 80,
    perKmRate: 20,
    icon: 'Truck',
    etaMins: 5
  },
  {
    type: 'cab_premium',
    name: 'Explorer Luxury Executive',
    capacity: '4 Passengers • 3 Bags',
    description: 'Top-tier luxury ride (Mercedes-Benz, Audi, BMW) with complimentary bottled mineral water and Wi-Fi.',
    baseFare: 150,
    perKmRate: 40,
    icon: 'Crown',
    etaMins: 7
  },
  {
    type: 'auto',
    name: 'Explorer Eco Auto',
    capacity: '3 Passengers',
    description: 'Quick & breezy 3-wheeler auto-rickshaw. Ideal for navigating narrow bazaar lanes and quick short hops.',
    baseFare: 25,
    perKmRate: 10,
    icon: 'Navigation',
    etaMins: 2
  },
  {
    type: 'bike',
    name: 'Explorer Express Bike Taxi',
    capacity: '1 Passenger with Helmet',
    description: 'Zip past rush-hour traffic in record time. Sanitized helmet and hairnet provided.',
    baseFare: 20,
    perKmRate: 7,
    icon: 'Bike',
    etaMins: 2
  },
  {
    type: 'scooter',
    name: 'Explorer E-Scooter Self-Rental',
    capacity: '1-2 Riders • Electric',
    description: 'Unlock smart electric scooter via QR code on app. 45 km range per battery charge. Zero emissions.',
    baseFare: 15,
    perKmRate: 4,
    icon: 'Zap',
    etaMins: 1
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'usr-demo-1',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    targetType: 'destination',
    targetId: 'dest-bali',
    targetName: 'Bali',
    rating: 5,
    reviewText: 'The AI Autopilot scheduled our visits perfectly around peak hours. We saw Tegallalang with zero crowds and caught the best sunset at Uluwatu. Flawless experience!',
    createdAt: '2026-08-20T14:30:00Z',
    verifiedBooking: true,
    likes: 24
  },
  {
    id: 'rev-2',
    userId: 'usr-demo-2',
    userName: 'Alexandre Dubois',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    targetType: 'package',
    targetId: 'pkg-swiss-alps',
    targetName: 'Swiss Alpine Dreams: Jungfrau & Lake Cruises',
    rating: 5,
    reviewText: 'Jungfraujoch was breathtaking. The price breakdown was completely transparent with zero hidden fees. The 1st class Swiss pass included made everything effortless.',
    createdAt: '2026-08-18T09:15:00Z',
    verifiedBooking: true,
    likes: 19
  },
  {
    id: 'rev-3',
    userId: 'usr-demo-3',
    userName: 'Ananya Roy',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    targetType: 'explorer',
    targetId: 'cab_suv',
    targetName: 'The Explorer XL Cab',
    rating: 5,
    reviewText: 'Driver Vikram arrived in 4 minutes flat in an immaculate Innova. Smooth driving and great local tips for hidden beach shacks in South Goa.',
    createdAt: '2026-08-22T17:45:00Z',
    verifiedBooking: true,
    likes: 12
  }
];

export const INITIAL_GROUP_TRIPS: GroupTrip[] = [
  {
    id: 'grp-goa-2026',
    userId: 'usr-current',
    title: 'Goa Friends Beach Adventure',
    destinationName: 'Goa, India',
    createdAt: '2026-08-10T10:00:00Z',
    members: [
      { id: 'usr-current', name: 'You (Traveler)', email: 'you@wanderai.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
      { id: 'mem-rohit', name: 'Rohit Verma', email: 'rohit@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
      { id: 'mem-neha', name: 'Neha Gupta', email: 'neha@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
      { id: 'mem-karan', name: 'Karan Mehta', email: 'karan@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' }
    ],
    expenses: [
      {
        id: 'exp-1',
        groupId: 'grp-goa-2026',
        title: 'Beachside Villa Stay (2 Nights)',
        category: 'Stay',
        amount: 19920,
        paidById: 'usr-current',
        paidByName: 'You (Traveler)',
        splitAmongIds: ['usr-current', 'mem-rohit', 'mem-neha', 'mem-karan'],
        splitType: 'equal',
        date: '2026-08-12',
        notes: 'Ocean view 4-bedroom villa'
      },
      {
        id: 'exp-2',
        groupId: 'grp-goa-2026',
        title: 'Seafood Shack Dinner at Fisherman Wharf',
        category: 'Food',
        amount: 7968,
        paidById: 'mem-rohit',
        paidByName: 'Rohit Verma',
        splitAmongIds: ['usr-current', 'mem-rohit', 'mem-neha', 'mem-karan'],
        splitType: 'equal',
        date: '2026-08-13',
        notes: 'Prawn curry, Kingfish & desserts'
      },
      {
        id: 'exp-3',
        groupId: 'grp-goa-2026',
        title: 'Sunset Catamaran Rental & Snorkeling',
        category: 'Activities',
        amount: 11620,
        paidById: 'mem-neha',
        paidByName: 'Neha Gupta',
        splitAmongIds: ['usr-current', 'mem-rohit', 'mem-neha', 'mem-karan'],
        splitType: 'equal',
        date: '2026-08-14'
      },
      {
        id: 'exp-4',
        groupId: 'grp-goa-2026',
        title: 'Explorer Airport XL Cab',
        category: 'Transport',
        amount: 2988,
        paidById: 'usr-current',
        paidByName: 'You (Traveler)',
        splitAmongIds: ['usr-current', 'mem-rohit', 'mem-neha', 'mem-karan'],
        splitType: 'equal',
        date: '2026-08-15'
      }
    ]
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-current',
  email: 'soham@explorex.com',
  name: 'Soham Nemade',
  phone: '+91 98210 34982',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
  bio: 'Passionate travel photographer, cultural foodie & mountain enthusiast exploring breathtaking corners of our planet.',
  homeCity: 'Mumbai, Maharashtra',
  joinedDate: 'January 2025',
  walletBalance: 37350,
  preferences: {
    vibes: ['mountain', 'beach', 'heritage', 'culinary', 'nature'] as TravelVibe[],
    budgetLevel: 'moderate',
    pace: 'moderate',
    dietary: ['Vegetarian Friendly', 'Seafood'],
    travelStyle: 'friends',
    ecoFriendly: true,
    accommodationType: 'resort'
  },
  savedDestinations: ['dest-bali', 'dest-switzerland', 'dest-tokyo'],
  savedPackages: ['pkg-bali-escape', 'pkg-swiss-alps'],
  travelHistory: [
    {
      id: 'hist-1',
      destination: 'Kyoto & Osaka',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
      year: 2025,
      durationDays: 8,
      highlight: 'Bamboo forest morning walk and Gion tea house experience',
      rating: 5
    },
    {
      id: 'hist-2',
      destination: 'Amalfi Coast',
      country: 'Italy',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
      year: 2024,
      durationDays: 6,
      highlight: 'Cliffside sunset dinner overlooking Positano',
      rating: 5
    }
  ],
  travelDNA: {
    culturalExplorer: 88,
    adventureSeeker: 76,
    gastronomyLover: 92,
    relaxationScore: 80,
    ecoConscious: 85,
    spontaneity: 68,
    primaryArchetype: 'Curious Culture & Culinary Voyager',
    secondaryArchetype: 'Eco-Minded Scenic Alpine Explorer',
    description: 'You are naturally drawn to authentic local flavors, historic architecture, and breathtaking panoramic landscapes while prioritizing sustainable, well-balanced pacing.'
  },
  role: 'admin' as const
};
