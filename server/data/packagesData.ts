import { TravelPackage } from '../../src/types';

export const ALL_PACKAGES: TravelPackage[] = [
  {
    id: 'pkg-goa-coastal',
    destinationId: 'dest-goa',
    destinationName: 'Goa, India',
    title: 'Goa Coastal Serenity & Portuguese Heritage',
    tagline: '5 Days of Private South Goa Beaches, Spice Plantations & Catamaran Cruises',
    durationDays: 5,
    durationNights: 4,
    startingPrice: 24500,
    priceBreakdown: {
      hotelStay: 11500,
      transport: 4200,
      activities: 5200,
      meals: 3800,
      taxesAndFees: 1800,
      discount: 2000,
      totalPerPerson: 24500
    },
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.88,
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
    id: 'pkg-kerala-backwaters',
    destinationId: 'dest-chettinad',
    destinationName: 'Alleppey & Munnar, Kerala',
    title: 'Kerala Backwaters & Misty Tea Trails',
    tagline: '6 Days of Private Houseboat Cruises, Munnar Tea Valleys & Ayurvedic Wellness',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 34500,
    priceBreakdown: {
      hotelStay: 16500,
      transport: 6800,
      activities: 6200,
      meals: 5500,
      taxesAndFees: 2500,
      discount: 3000,
      totalPerPerson: 34500
    },
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.94,
    reviewCount: 389,
    theme: 'wellness',
    inclusions: [
      '1 Night in Luxury Air-Conditioned Private Houseboat with Chef',
      '2 Nights in Munnar Tea Plantation Villa + 2 Nights in Marari Beach Resort',
      'Authentic Kerala Sadya Lunch on Banana Leaf',
      'Traditional Ayurvedic Rejuvenation Massage (60 mins)',
      'Kathakali & Kalaripayattu Cultural Evening Show',
      'Dedicated AC Sedan with Experienced Local Chauffeur'
    ],
    exclusions: [
      'Flight tickets to Kochi Airport',
      'Optional Spice Purchase at Organic Markets',
      'Alcoholic Beverages'
    ],
    hotels: [
      {
        name: 'Punnamada Luxury Houseboat Cruise',
        stars: 5,
        roomType: 'Royal Suite on Water',
        address: 'Punnamada Lake, Alleppey'
      },
      {
        name: 'Fragrant Nature Munnar',
        stars: 5,
        roomType: 'Tropic Green Valley View Suite',
        address: 'Pothamedu, Munnar, Kerala'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Kochi & Scenic Drive to Munnar',
        description: 'Arrive at Cochin International Airport. Scenic mountain drive past Cheeyappara Waterfalls to Munnar tea country.',
        activities: ['Airport Meet & Greet', 'Waterfall Photo Stop', 'Resort Check-in & Evening Tea Tasting'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'Fragrant Nature Munnar'
      },
      {
        dayNumber: 2,
        title: 'Eravikulam National Park & Kolukkumalai Sunrise Point',
        description: 'Explore misty hills of Nilgiri Tahr sanctuary and visit the highest organic tea factory in the world.',
        activities: ['Eravikulam Wildlife Sanctuary', 'Tea Museum & Factory Tour', 'Sunset Viewpoint'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Fragrant Nature Munnar'
      },
      {
        dayNumber: 3,
        title: 'Transfer to Alleppey & Houseboat Boarding',
        description: 'Descend to Alleppey backwaters. Board private kettuvallam houseboat. Cruise through narrow palm-fringed canals.',
        activities: ['Houseboat Boarding at 12:30 PM', 'Canal Sunset Cruise', 'Chef-prepared Karimeen Pollichathu Dinner'],
        mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
        stayHotel: 'Punnamada Luxury Houseboat Cruise'
      },
      {
        dayNumber: 4,
        title: 'Village Canoe Ride & Marari Beachfront',
        description: 'Morning sunrise canoe through narrow village waterways. Transfer to peaceful Marari Beach resort for seaside leisure.',
        activities: ['Village Canoe Exploration', 'Coir Making Demonstration', 'Marari Beach Relaxation'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'Marari Beach Resort'
      },
      {
        dayNumber: 5,
        title: 'Ayurvedic Wellness & Fort Kochi Heritage',
        description: 'Indulge in authentic herbal Abhyanga massage. Afternoon walk seeing Chinese Fishing Nets and Jewish Synagogue in Fort Kochi.',
        activities: ['Ayurvedic Herbal Massage', 'Chinese Fishing Nets Sunset', 'Kathakali Dance Performance'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Marari Beach Resort'
      },
      {
        dayNumber: 6,
        title: 'Souvenir Spice Shopping & Kochi Departure',
        description: 'Fresh cardamom and pepper shopping at Mattancherry spice market before chauffeur transfer to Kochi Airport.',
        activities: ['Mattancherry Spice Shopping', 'Transfer to Cochin Airport'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 10,
    availableDates: ['2026-09-20', '2026-10-10', '2026-10-25', '2026-11-15', '2026-12-05'],
    isFeatured: true
  },
  {
    id: 'pkg-rajasthan-heritage',
    destinationId: 'dest-jaipur',
    destinationName: 'Jaipur & Udaipur, Rajasthan',
    title: 'Rajasthan Heritage Circuit: Forts & Palaces',
    tagline: '7 Days of Grand Rajput Forts, Lake Pichola Boating & Heritage Haveli Stays',
    durationDays: 7,
    durationNights: 6,
    startingPrice: 48000,
    priceBreakdown: {
      hotelStay: 24000,
      transport: 9500,
      activities: 8000,
      meals: 7500,
      taxesAndFees: 3000,
      discount: 4000,
      totalPerPerson: 48000
    },
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.93,
    reviewCount: 315,
    theme: 'heritage',
    inclusions: [
      '6 Nights in Royal Heritage Haveli Hotels (Jaipur, Jodhpur & Udaipur)',
      'Daily Royal Rajasthani Buffet Breakfast & 3 Traditional Thali Dinners',
      'Private Elephant/Jeep Ride to Amber Fort Courtyard',
      'Private Boat Cruise on Lake Pichola at Sunset',
      'Mehrangarh Fort & City Palace Guided VIP Access',
      'Dedicated Chauffeur Driven AC Innova Crysta'
    ],
    exclusions: [
      'Domestic Airfare to Jaipur / from Udaipur',
      'Camera / Video Permits at Monuments',
      'Personal Souvenir Shopping'
    ],
    hotels: [
      {
        name: 'Samode Haveli Jaipur',
        stars: 5,
        roomType: 'Deluxe Heritage Courtyard Suite',
        address: 'Gangapole, Jaipur, Rajasthan'
      },
      {
        name: 'Fateh Garh Palace Udaipur',
        stars: 5,
        roomType: 'Heritage Lake View Chamber',
        address: 'Sajjan Garh Road, Sisarma, Udaipur'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Pink City Arrival & Hawa Mahal Walk',
        description: 'Land at Jaipur Airport. Private chauffeur transfer to Samode Haveli. Evening walk around illuminated Hawa Mahal and Johari Bazaar.',
        activities: ['Jaipur Airport Welcome', 'Haveli Check-in', 'Johari Bazaar Gemstone Walk'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'Samode Haveli Jaipur'
      },
      {
        dayNumber: 2,
        title: 'Amber Fort & Sheesh Mahal Splendor',
        description: 'Jeep ride to Amber Fort. Marvel at thousand mirror reflections inside Sheesh Mahal and visit scenic Jal Mahal.',
        activities: ['Amber Fort VIP Guided Tour', 'Sheesh Mahal Exploration', 'Jal Mahal Photo Stop', 'Chokhi Dhani Cultural Dinner'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'Samode Haveli Jaipur'
      },
      {
        dayNumber: 3,
        title: 'City Palace & Blue City of Jodhpur',
        description: 'Visit Jaipur City Palace & Jantar Mantar. Drive past scenic Thar desert to the majestic blue city of Jodhpur.',
        activities: ['Jaipur City Palace & Jantar Mantar', 'Scenic Drive to Jodhpur', 'Clock Tower Spice Market Walk'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Ajit Bhawan Palace Jodhpur'
      },
      {
        dayNumber: 4,
        title: 'Mehrangarh Fort & Transfer to Udaipur',
        description: 'Explore the impenetrable Mehrangarh Fort towering 400ft over blue houses. Scenic drive through Ranakpur Jain Marble Temple to Udaipur.',
        activities: ['Mehrangarh Fort Guided Tour', 'Jaswant Thada Memorial', 'Ranakpur 1,444 Marble Pillars Temple'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Fateh Garh Palace Udaipur'
      },
      {
        dayNumber: 5,
        title: 'City of Lakes & Pichola Sunset Boat Cruise',
        description: 'Explore Udaipur City Palace and Jagdish Temple. Evening private solar boat cruise around Lake Palace on Lake Pichola.',
        activities: ['Udaipur City Palace Museum', 'Saheliyon Ki Bari Royal Gardens', 'Lake Pichola Sunset Yacht'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'Fateh Garh Palace Udaipur'
      },
      {
        dayNumber: 6,
        title: 'Monsoon Palace & Artisan Miniature Painting',
        description: 'Visit hilltop Sajjan Garh Monsoon Palace. Hands-on miniature Rajasthani painting workshop with master artisan.',
        activities: ['Sajjan Garh Monsoon Palace', 'Artisan Miniature Art Workshop', 'Lakeside Rooftop Candlelight Dinner'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'Fateh Garh Palace Udaipur'
      },
      {
        dayNumber: 7,
        title: 'Bagore Ki Haveli & Udaipur Departure',
        description: 'Morning lakeside walk at Ambrai Ghat before private airport transfer for departure.',
        activities: ['Ambrai Ghat Morning Stroll', 'Transfer to Maharana Pratap Airport Udaipur'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 12,
    availableDates: ['2026-10-05', '2026-10-18', '2026-11-02', '2026-11-20', '2026-12-10'],
    isFeatured: true
  },
  {
    id: 'pkg-kashmir-valley',
    destinationId: 'dest-manali',
    destinationName: 'Srinagar & Gulmarg, Kashmir',
    title: 'Kashmir Valley & Gulmarg Alpine Paradise',
    tagline: '6 Days of Dal Lake Shikaras, Luxury Houseboats, Gondola Snow Rides & Saffron Farms',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 42000,
    priceBreakdown: {
      hotelStay: 21000,
      transport: 8000,
      activities: 7500,
      meals: 6500,
      taxesAndFees: 2500,
      discount: 3500,
      totalPerPerson: 42000
    },
    images: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.96,
    reviewCount: 290,
    theme: 'mountain',
    inclusions: [
      '2 Nights in Luxury Cedarwood Houseboat on Nigeen/Dal Lake',
      '2 Nights in Gulmarg Alpine Ski Resort + 1 Night in Pahalgam Pine Valley',
      'Gulmarg Gondola Phase 1 & 2 Cable Car Tickets Included',
      'Private Shikara Rides at Sunrise & Sunset with Kahwa Tea',
      'Authentic 7-Course Kashmiri Wazwan Feast',
      'All Sightseeing in Heated 4x4 AC SUV'
    ],
    exclusions: [
      'Flights to Srinagar Sheikh Ul-Alam Airport',
      'Pony Rides in Pahalgam / Gulmarg',
      'Personal Cold Weather Clothing Rentals'
    ],
    hotels: [
      {
        name: 'The Khyber Himalayan Resort & Spa',
        stars: 5,
        roomType: 'Premier Pine View Room',
        address: 'Gulmarg, Jammu & Kashmir'
      },
      {
        name: 'Sukoon Luxury Floating Houseboat',
        stars: 5,
        roomType: 'Royal Suite on Water',
        address: 'Nigeen Lake, Srinagar'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Srinagar & Dal Lake Shikara Ride',
        description: 'Land at Srinagar Airport. Check in to Sukoon luxury houseboat on tranquil Nigeen Lake. Sunset Shikara ride with authentic Kashmiri saffron Kahwa.',
        activities: ['Srinagar Airport Pickup', 'Houseboat Check-in', 'Sunset Shikara Cruise with Saffron Kahwa'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'Sukoon Luxury Floating Houseboat'
      },
      {
        dayNumber: 2,
        title: 'Mughal Gardens & Floating Vegetable Market',
        description: 'Early morning Shikara visit to 100-year-old floating market. Explore Shalimar Bagh and Nishat Bagh Persian terraced gardens.',
        activities: ['Dawn Floating Market Shikara', 'Shalimar & Nishat Gardens', 'Old Srinagar Copper Artisans'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Sukoon Luxury Floating Houseboat'
      },
      {
        dayNumber: 3,
        title: 'Scenic Drive to Gulmarg & Gondola Phase 1',
        description: 'Drive through apple orchards to Gulmarg (Meadow of Flowers). Ride the iconic Gulmarg Gondola to Kongdoori mountain ridge.',
        activities: ['Gulmarg Alpine Drive', 'Gondola Phase 1 Ascent to 10,000ft', 'High Altitude Meadow Walk'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'The Khyber Himalayan Resort & Spa'
      },
      {
        dayNumber: 4,
        title: 'Apharwat Peak Snow Ridge & Alpine Spa',
        description: 'Ascend to Phase 2 at 13,780ft overlooking snow-covered Pir Panjal ranges. Evening heated indoor glass pool and sauna relaxation.',
        activities: ['Gondola Phase 2 to Apharwat Peak', 'Snow Walk / Sledging', 'Heated Mineral Spa Session'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'The Khyber Himalayan Resort & Spa'
      },
      {
        dayNumber: 5,
        title: 'Pahalgam Valley of Shepherds & Betaab Valley',
        description: 'Transfer past Pampore purple saffron fields to picturesque Pahalgam. Walk along gushing Lidder River and Betaab Valley.',
        activities: ['Pampore Saffron Farms Stop', 'Betaab Valley & Aru Valley Walk', 'Lidder River Riverside Dinner'],
        mealsIncluded: ['Breakfast', 'Wazwan Dinner'],
        stayHotel: 'Pahalgam Pine Valley Resort'
      },
      {
        dayNumber: 6,
        title: 'Walnut Woodcraft Shopping & Departure',
        description: 'Visit local walnut wood carvers and Pashmina shawl weavers before chauffeur transfer to Srinagar Airport.',
        activities: ['Authentic Pashmina & Walnut Wood Shopping', 'Transfer to Srinagar Airport'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 10,
    availableDates: ['2026-09-25', '2026-10-15', '2026-11-05', '2026-12-01', '2026-12-20'],
    isFeatured: true
  },
  {
    id: 'pkg-himachal-adventure',
    destinationId: 'dest-manali',
    destinationName: 'Manali & Spiti, Himachal Pradesh',
    title: 'Himachal Adventure & High Altitude Odyssey',
    tagline: '6 Days of Atal Tunnel, Solang Valley Paragliding, Old Manali Cafes & Mineral Hot Springs',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 28500,
    priceBreakdown: {
      hotelStay: 13500,
      transport: 6500,
      activities: 5500,
      meals: 4500,
      taxesAndFees: 1500,
      discount: 3000,
      totalPerPerson: 28500
    },
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.89,
    reviewCount: 340,
    theme: 'adventure',
    inclusions: [
      '5 Nights in Luxury Riverside Wooden Chalet in Manali & Sissu',
      'Atal Tunnel Crossing & Lahaul Valley Sissu Waterfall Expedition',
      'Solang Valley Paragliding & Ziplining Tickets',
      'Vashisht Natural Sulphur Hot Springs VIP Access',
      'Daily Mountain Buffet Breakfast & 2 Bonfire Barbecue Dinners',
      'Private 4x4 AC Vehicle for Mountain Sightseeing'
    ],
    exclusions: [
      'Bus/Flight to Kullu/Bhuntar or Chandigarh',
      'Rohtang Pass Snow Permit Fee (if open)',
      'Personal Adventure Sports Upgrades'
    ],
    hotels: [
      {
        name: 'The Himalayan Luxury Castle & Resort',
        stars: 5,
        roomType: 'Grand Victorian Mountain Chalet',
        address: 'Hadimba Road, Manali, Himachal Pradesh'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Manali & Old Manali Heritage Walk',
        description: 'Pickup from Bhuntar Airport or Manali Volvo Stand. Check in to Victorian chalet. Evening walk among apple orchards and cafes in Old Manali.',
        activities: ['Chalet Check-in', 'Hadimba Temple Pine Forest Walk', 'Old Manali Cafe Tasting'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'The Himalayan Luxury Castle & Resort'
      },
      {
        dayNumber: 2,
        title: 'Atal Tunnel & Lahaul Valley Sissu Waterfall',
        description: 'Drive through the 9.02km engineering marvel Atal Tunnel into the dramatically different trans-Himalayan Lahaul valley.',
        activities: ['Atal Tunnel Crossing', 'Sissu Waterfall & Lake Walk', 'Trout Fish Lunch by Gushing River'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'The Himalayan Luxury Castle & Resort'
      },
      {
        dayNumber: 3,
        title: 'Solang Valley Paragliding & Adventure Arena',
        description: 'Tandem paragliding flight over Solang Valley with certified instructor. Experience high rope course and zorbing.',
        activities: ['Tandem Paragliding Flight', 'Solang Valley Ropeway', 'Bonfire & Live Acoustic Evening'],
        mealsIncluded: ['Breakfast', 'Barbecue Dinner'],
        stayHotel: 'The Himalayan Luxury Castle & Resort'
      },
      {
        dayNumber: 4,
        title: 'Naggar Castle & Roerich Art Gallery',
        description: 'Visit the medieval wooden Naggar Castle overlooking the Beas Valley. Taste authentic Himachali Siddu with melted ghee.',
        activities: ['Naggar Castle Exploration', 'Nicholas Roerich Himalayan Art Gallery', 'Traditional Siddu Gastronomy'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'The Himalayan Luxury Castle & Resort'
      },
      {
        dayNumber: 5,
        title: 'Jogini Waterfall Trek & Vashisht Hot Springs',
        description: 'Scenic 2-hour forest hike to cascading Jogini Waterfalls. Soak in natural therapeutic hot sulphur springs in Vashisht village.',
        activities: ['Jogini Waterfall Nature Hike', 'Vashisht Hot Spring Bath', 'Mall Road Shopping'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'The Himalayan Luxury Castle & Resort'
      },
      {
        dayNumber: 6,
        title: 'Kullu Shawl Weaving & Departure',
        description: 'Visit traditional Kullu woolen handloom cooperative before transfer to Bhuntar Airport or Chandigarh.',
        activities: ['Kullu Handloom Shawl Weaving Visit', 'Chauffeur Drop-off'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 12,
    availableDates: ['2026-09-18', '2026-10-05', '2026-10-22', '2026-11-12', '2026-12-05'],
    isFeatured: false
  },
  {
    id: 'pkg-konkan-coastal',
    destinationId: 'dest-sindhudurg',
    destinationName: 'Sindhudurg & Tarkarli, Maharashtra',
    title: 'Konkan Coastal Escape: Forts & Virgin Beaches',
    tagline: '4 Days of Sea Fort Expeditions, Coral Snorkeling, Malvani Feasts & Mango Orchards',
    durationDays: 4,
    durationNights: 3,
    startingPrice: 18500,
    priceBreakdown: {
      hotelStay: 8500,
      transport: 3800,
      activities: 3600,
      meals: 2800,
      taxesAndFees: 1300,
      discount: 1500,
      totalPerPerson: 18500
    },
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.87,
    reviewCount: 198,
    theme: 'beach',
    inclusions: [
      '3 Nights in Beachfront Coconut Grove Cottage at Tarkarli / Devbagh',
      'Boat Safari to 17th Century Shivaji Maharaj Sea Fort (Sindhudurg)',
      'Scuba Diving & Coral Reef Snorkeling with Certified Instructor',
      'Daily Authentic Malvani Coastal Thali Lunches & Solkadhi',
      'Tsunami Island Water Sports & Karli River Estuary Cruise',
      'Private AC Cab for All Regional Transfers'
    ],
    exclusions: [
      'Train to Kudal/Sawantwadi or Flights to Chipi Airport',
      'Personal Cashew & Wooden Toy Shopping',
      'Extra Scuba Underwater Video Charges'
    ],
    hotels: [
      {
        name: 'MTDC Tarkarli Coastal Resort',
        stars: 4,
        roomType: 'Deluxe Sea View Houseboat/Cottage',
        address: 'Tarkarli Beach, Malvan, Sindhudurg'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Malvan & Devbagh Sangam Sunset',
        description: 'Pickup from Chipi Airport or Kudal Station. Check in to beach cottage under swaying palms. Sunset walk at Devbagh Sangam where river meets Arabian Sea.',
        activities: ['Arrival Welcome with Tender Coconut', 'Devbagh Beach Walk', 'Authentic Malvani Surmai Thali Dinner'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'MTDC Tarkarli Coastal Resort'
      },
      {
        dayNumber: 2,
        title: 'Sindhudurg Sea Fort & Scuba Snorkeling',
        description: 'Take a boat to the historic Sindhudurg fort built directly in the sea. Enjoy guided scuba diving with clear waters and colorful marine life.',
        activities: ['Sindhudurg Fort Exploration', 'Coral Snorkeling & Scuba Dive', 'Malvani Fish Curry Cooking Demo'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'MTDC Tarkarli Coastal Resort'
      },
      {
        dayNumber: 3,
        title: 'Karli River Backwaters & Tsunami Island',
        description: 'Cruise the pristine Karli backwaters lined with mangroves. Visit Tsunami Island for dolphin spotting and water sports.',
        activities: ['Karli River Boat Safari', 'Dolphin Spotting', 'Sawantwadi GI-tagged Wooden Toys Workshop'],
        mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
        stayHotel: 'MTDC Tarkarli Coastal Resort'
      },
      {
        dayNumber: 4,
        title: 'Cashew Plantation & Departure',
        description: 'Tour a local cashew processing farm and Alphonso mango orchard before departure transfer.',
        activities: ['Cashew Processing Farm Tour', 'Transfer to Chipi Airport / Kudal Station'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 10,
    availableDates: ['2026-09-22', '2026-10-08', '2026-10-24', '2026-11-14', '2026-12-02'],
    isFeatured: true
  },
  {
    id: 'pkg-karnataka-heritage',
    destinationId: 'dest-karnataka-hampi-coorg',
    destinationName: 'Hampi & Coorg, Karnataka',
    title: 'Karnataka Heritage & Coffee Highlands',
    tagline: '5 Days of UNESCO Vijayanagara Ruins, Coracle River Rides & Coorg Coffee Estates',
    durationDays: 5,
    durationNights: 4,
    startingPrice: 26500,
    priceBreakdown: {
      hotelStay: 12500,
      transport: 5800,
      activities: 4800,
      meals: 3800,
      taxesAndFees: 1600,
      discount: 2000,
      totalPerPerson: 26500
    },
    images: [
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.91,
    reviewCount: 220,
    theme: 'heritage',
    inclusions: [
      '2 Nights in Hampi Heritage Resort + 2 Nights in Coorg Coffee Plantation Villa',
      'Tungabhadra River Traditional Coracle (Round Boat) Ride',
      'Virupaksha Temple, Stone Chariot & Lotus Mahal Guided Walk',
      'Private Coffee & Spice Plantation Estate Walk with Barista Tasting',
      'Daily South Indian Gourmet Breakfast & 2 Coorgi Pandi/Vegetarian Dinners',
      'Dedicated AC Sedan for All Inter-city Sightseeing'
    ],
    exclusions: [
      'Flight tickets to Hubli / Bangalore Airport',
      'Personal Souvenirs & Coffee Purchases',
      'Monument Camera Permits'
    ],
    hotels: [
      {
        name: 'Heritage Resort Hampi',
        stars: 5,
        roomType: 'Vijayanagara Luxury Villa',
        address: 'Hosapete, Hampi, Karnataka'
      },
      {
        name: 'The Tamara Coorg',
        stars: 5,
        roomType: 'Luxury Cottage in Coffee Canopy',
        address: 'Kabbinakad Estate, Yevakapadi, Coorg'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Hampi & Tungabhadra Sunset',
        description: 'Pickup from Jindal/Hubli Airport or Hospet Station. Check in to resort. Sunset view from Hemakuta Hill overlooking 14th-century temples.',
        activities: ['Resort Check-in', 'Hemakuta Hill Sunset Walk', 'Traditional Karnataka Thali Dinner'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'Heritage Resort Hampi'
      },
      {
        dayNumber: 2,
        title: 'UNESCO Stone Chariot & Coracle River Ride',
        description: 'Explore the iconic Vittala Temple with its musical pillars and Stone Chariot. Ride a circular coracle boat across the Tungabhadra river.',
        activities: ['Vittala Temple & Musical Pillars', 'Coracle Boat Ride', 'Royal Enclosure & Queen Bath'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Heritage Resort Hampi'
      },
      {
        dayNumber: 3,
        title: 'Scenic Drive to Coorg Coffee Highlands',
        description: 'Scenic journey through Western Ghats down to Coorg coffee hills. Check in to private cottage inside a 180-acre lush coffee estate.',
        activities: ['Western Ghats Mountain Drive', 'Estate Check-in', 'Evening Bonfire & Fresh Arabica Brews'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'The Tamara Coorg'
      },
      {
        dayNumber: 4,
        title: 'Coffee Estate Walk & Abbey Falls',
        description: 'Guided sensory plantation walk learning coffee roasting, pepper climbing, and cardamom harvesting. Visit Abbey Falls.',
        activities: ['Coffee Roasting & Cupping Session', 'Abbey Falls Nature Walk', 'Namdroling Golden Tibetan Monastery'],
        mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
        stayHotel: 'The Tamara Coorg'
      },
      {
        dayNumber: 5,
        title: 'Madikeri Fort & Bangalore/Mangalore Drop',
        description: 'Morning Raja Seat valley viewpoint before private chauffeur transfer to Bangalore or Mangalore Airport.',
        activities: ['Raja Seat Panorama', 'Estate Fresh Coffee Shopping', 'Airport Transfer'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 12,
    availableDates: ['2026-09-28', '2026-10-14', '2026-11-04', '2026-11-25', '2026-12-15'],
    isFeatured: false
  },
  {
    id: 'pkg-tamilnadu-temples',
    destinationId: 'dest-chettinad',
    destinationName: 'Chettinad & Madurai, Tamil Nadu',
    title: 'Tamil Nadu Temple & Heritage Circuit',
    tagline: '5 Days of Thousand-Pillar Dravidian Temples, Chettinad Palaces & Master Weavers',
    durationDays: 5,
    durationNights: 4,
    startingPrice: 23500,
    priceBreakdown: {
      hotelStay: 11000,
      transport: 5200,
      activities: 4200,
      meals: 3500,
      taxesAndFees: 1600,
      discount: 2000,
      totalPerPerson: 23500
    },
    images: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.86,
    reviewCount: 165,
    theme: 'heritage',
    inclusions: [
      '4 Nights in Authentic Chettinad Mansion Heritage Properties',
      'VIP Guided Entry to Madurai Meenakshi Amman Temple',
      'Athangudi Handmade Tile Making Masterclass',
      'Kandangi Handloom Silk/Cotton Weaving Demonstration',
      'Daily Authentic Chettinad Feast Served on Banana Leaf',
      'Private AC Sedan with Regional Cultural Expert'
    ],
    exclusions: [
      'Flights/Trains to Trichy or Madurai Airport',
      'Temple Archana / Special Pooja Tickets',
      'Personal Brass Antique Purchases'
    ],
    hotels: [
      {
        name: 'Chidambara Vilas Luxury Heritage Mansion',
        stars: 5,
        roomType: 'Heritage Chettiar Suite',
        address: 'Kadiapatti, Pudukkottai, Chettinad'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Madurai & Meenakshi Night Ceremony',
        description: 'Arrive at Madurai Airport. Visit the towering gopurams of Meenakshi Amman Temple and witness the sacred night procession.',
        activities: ['Madurai Airport Meet', 'Meenakshi Temple Evening Walk', 'Jigarthanda Famous Drink Tasting'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'Heritage Madurai Resort'
      },
      {
        dayNumber: 2,
        title: 'Thirumalai Nayakkar Palace & Drive to Chettinad',
        description: 'Explore the giant Italian-stucco pillars of Nayakkar Palace before driving to the sprawling mansions of Chettinad.',
        activities: ['Thirumalai Nayakkar Palace', 'Scenic Chettinad Countryside Drive', 'Mansion Check-in'],
        mealsIncluded: ['Breakfast', 'Chettinad Banana Leaf Lunch'],
        stayHotel: 'Chidambara Vilas Luxury Heritage Mansion'
      },
      {
        dayNumber: 3,
        title: 'Athangudi Tiles & Kandangi Silk Weavers',
        description: 'Watch master craftsmen hand-pour geometric patterns in Athangudi handmade tiles. Visit 100-year-old Kandangi handlooms.',
        activities: ['Athangudi Tile Workshop', 'Kandangi Weaving Village', 'Chettinad Antiques Market'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Chidambara Vilas Luxury Heritage Mansion'
      },
      {
        dayNumber: 4,
        title: 'Thanjavur Brihadisvara Great Living Chola Temple',
        description: 'Visit the 1,000-year-old UNESCO Brihadisvara Temple with its single granite stone vimana weighing 80 tons.',
        activities: ['Big Temple Guided Architecture Tour', 'Thanjavur Bronze Casting Demonstration', 'Classical Carnatic Music Evening'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'Chidambara Vilas Luxury Heritage Mansion'
      },
      {
        dayNumber: 5,
        title: 'Chettinad Culinary Tasting & Departure',
        description: 'Morning spice roasting masterclass followed by departure transfer to Madurai or Trichy Airport.',
        activities: ['Culinary Spice Tasting', 'Airport Drop-off'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 10,
    availableDates: ['2026-10-02', '2026-10-20', '2026-11-10', '2026-12-04'],
    isFeatured: false
  },
  {
    id: 'pkg-northeast-explorer',
    destinationId: 'dest-manali',
    destinationName: 'Shillong & Cherrapunji, Meghalaya',
    title: 'Northeast India Explorer: Living Root Bridges & Tea Valleys',
    tagline: '6 Days of Double Decker Root Bridges, Cleanest Village in Asia & Crystal Rivers',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 38000,
    priceBreakdown: {
      hotelStay: 18500,
      transport: 8500,
      activities: 6200,
      meals: 5200,
      taxesAndFees: 2600,
      discount: 3000,
      totalPerPerson: 38000
    },
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.95,
    reviewCount: 180,
    theme: 'adventure',
    inclusions: [
      '5 Nights in Luxury Pine Valley Resorts in Shillong & Cherrapunji',
      'Guided Trek to Nongriat Double Decker Living Root Bridge',
      'Crystal Clear Boating on Umngot River in Dawki',
      'Mawlynnong Cleanest Village in Asia Cultural Walk',
      'Daily Organic Khasi & Assamese Buffet Breakfasts',
      'Private 4x4 AC Vehicle with Experienced Mountain Chauffeur'
    ],
    exclusions: [
      'Flights to Guwahati Lokpriya Gopinath Bordoloi Airport',
      'Boating Lifejacket Extra Rentals',
      'Personal Porter Charges during Root Bridge Trek'
    ],
    hotels: [
      {
        name: 'Ri Kynjai - Serenity by the Lake',
        stars: 5,
        roomType: 'Khasi Thatched Lake View Cottage',
        address: 'Umiam Lake, Shillong, Meghalaya'
      },
      {
        name: 'Polo Orchid Resort Cherrapunji',
        stars: 5,
        roomType: 'Nohsngithiang Falls View Suite',
        address: 'Mawsmai, Sohra, Meghalaya'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Guwahati & Umiam Lake Scenic Drive',
        description: 'Land at Guwahati Airport. Scenic pine forest drive into Meghalaya. Check in to lakeside cottages at Ri Kynjai overlooking emerald Umiam Lake.',
        activities: ['Guwahati Airport Pickup', 'Umiam Lake Viewpoint', 'Traditional Khasi Welcome Dinner'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'Ri Kynjai - Serenity by the Lake'
      },
      {
        dayNumber: 2,
        title: 'Shillong Scotland of the East & Ward Lake',
        description: 'Explore Shillong peak, Elephant Falls, and the vibrant music cafes of Police Bazaar.',
        activities: ['Elephant Falls Walk', 'Shillong Peak 360 View', 'Laitlum Canyons Sunset'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Ri Kynjai - Serenity by the Lake'
      },
      {
        dayNumber: 3,
        title: 'Cherrapunji Waterfalls & Mawsmai Limestone Cave',
        description: 'Drive along cloud-covered mountain ridges to Sohra. View the thunderous Nohkalikai Falls and explore prehistoric Mawsmai limestone cave.',
        activities: ['Nohkalikai Waterfall Cliff Walk', 'Mawsmai Cave Spelunking', 'Seven Sisters Waterfall Photo Stop'],
        mealsIncluded: ['Breakfast', 'Lunch'],
        stayHotel: 'Polo Orchid Resort Cherrapunji'
      },
      {
        dayNumber: 4,
        title: 'Double Decker Living Root Bridge Trek',
        description: 'Descend 3,000 stone steps into tropical rainforest to witness the centuries-old bio-engineered Ficus elastica Double Decker root bridge.',
        activities: ['Nongriat Root Bridge Guided Trek', 'Natural Turquoise Pool Swimming', 'Rainbow Falls Hike'],
        mealsIncluded: ['Breakfast', 'Packed Energy Lunch', 'Dinner'],
        stayHotel: 'Polo Orchid Resort Cherrapunji'
      },
      {
        dayNumber: 5,
        title: 'Dawki Transparent River & Mawlynnong Village',
        description: 'Boat on the mirror-like transparent waters of Umngot River in Dawki. Walk through bamboo pathways of Mawlynnong village.',
        activities: ['Dawki Umngot Transparent Boating', 'Mawlynnong Village Eco Walk', 'Single Living Root Bridge'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'Ri Kynjai - Serenity by the Lake'
      },
      {
        dayNumber: 6,
        title: 'Kamakhya Temple Blessings & Guwahati Departure',
        description: 'Morning drive to Guwahati. Visit sacred Kamakhya Devi Temple before private airport transfer.',
        activities: ['Kamakhya Temple Visit', 'Transfer to Guwahati Airport'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 10,
    availableDates: ['2026-10-10', '2026-10-28', '2026-11-15', '2026-12-05'],
    isFeatured: true
  },
  {
    id: 'pkg-maharashtra-escape',
    destinationId: 'dest-pune',
    destinationName: 'Lonavala & Nashik, Maharashtra',
    title: 'Maharashtra Weekend Escape: Sahyadri Hills & Vineyards',
    tagline: '4 Days of Sahyadri Waterfall Treks, Nashik Wine Tasting & Buddhist Caves',
    durationDays: 4,
    durationNights: 3,
    startingPrice: 16500,
    priceBreakdown: {
      hotelStay: 8200,
      transport: 3500,
      activities: 3200,
      meals: 2400,
      taxesAndFees: 1200,
      discount: 2000,
      totalPerPerson: 16500
    },
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.82,
    reviewCount: 240,
    theme: 'culinary',
    inclusions: [
      '3 Nights in Luxury Sahyadri Hill & Vineyard Resort Suites',
      'Sula / York Vineyards Sommelier Guided Tour & 6-Wine Tasting Flight',
      'Karla & Bhaja 2,000-Year-Old Rock-Cut Buddhist Caves Entry',
      'Tiger Point Monsoon Waterfall Walk & Chikki Tasting',
      'Daily Maharashtrian Buffet Breakfast & 1 Vineyard Italian Dinner',
      'Private AC Explorer SUV from Mumbai/Pune'
    ],
    exclusions: [
      'Transport from cities other than Mumbai/Pune',
      'Personal Wine Bottle Purchases',
      'Optional Helicopter Joyride'
    ],
    hotels: [
      {
        name: 'The Source at Sula Vineyards',
        stars: 5,
        roomType: 'Tuscan Vineyard Villa',
        address: 'Govardhan Village, Gangapur Dam, Nashik'
      }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Mumbai/Pune Pickup & Lonavala Ghats',
        description: 'Doorstep pickup in Explorer AC Cab. Drive up Mumbai-Pune expressway. View Tiger Point misty cliffs and sample freshly made Lonavala chikki.',
        activities: ['Doorstep AC Pickup', 'Tiger Point & Bushi Dam Vista', 'Karla Caves 2nd Century BC Chaitya Hall'],
        mealsIncluded: ['Dinner'],
        stayHotel: 'Della Luxury Resorts Lonavala'
      },
      {
        dayNumber: 2,
        title: 'Scenic Sahyadri Drive to Nashik Wine Country',
        description: 'Drive past picturesque Kasara Ghat into India wine capital. Check in to Tuscan villa overlooking Gangapur lake and vineyard vines.',
        activities: ['Kasara Ghat Scenic Drive', 'Sula Vineyard Check-in', 'Sunset Infinity Pool by Vineyards'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        stayHotel: 'The Source at Sula Vineyards'
      },
      {
        dayNumber: 3,
        title: 'Sommelier Wine Tasting & Barrel Room Tour',
        description: 'Walk through oak aging barrel rooms. Taste award-winning Chenin Blanc, Cabernet, and sparkling wines with artisan cheese platter.',
        activities: ['Vineyard Agronomy Walk', 'Sommelier 6-Wine Tasting Session', 'Italian Lakeside Dinner at Little Italy'],
        mealsIncluded: ['Breakfast', 'Italian Wine Dinner'],
        stayHotel: 'The Source at Sula Vineyards'
      },
      {
        dayNumber: 4,
        title: 'Trimbakeshwar & Return Drop-off',
        description: 'Visit the historic Trimbakeshwar Jyotirlinga temple before comfortable highway transfer back to Mumbai or Pune.',
        activities: ['Trimbakeshwar Temple Stop', 'Return Doorstep Drop-off'],
        mealsIncluded: ['Breakfast'],
        stayHotel: 'Check-out'
      }
    ],
    maxGroupSize: 12,
    availableDates: ['2026-09-19', '2026-10-03', '2026-10-17', '2026-11-07', '2026-11-28'],
    isFeatured: false
  },
  {
    id: 'pkg-bali-escape',
    destinationId: 'dest-bali',
    destinationName: 'Bali, Indonesia',
    title: 'Bali Tropical Luxury & Cultural Odyssey',
    tagline: '6 Days of Sacred Temples, Sunset Catamarans, Rice Terraces & Private Pool Villa',
    durationDays: 6,
    durationNights: 5,
    startingPrice: 88000,
    priceBreakdown: {
      hotelStay: 42000,
      transport: 15000,
      activities: 18000,
      meals: 13000,
      taxesAndFees: 6000,
      discount: 6000,
      totalPerPerson: 88000
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
    startingPrice: 245000,
    priceBreakdown: {
      hotelStay: 120000,
      transport: 55000,
      activities: 45000,
      meals: 32000,
      taxesAndFees: 13000,
      discount: 20000,
      totalPerPerson: 245000
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
    id: 'pkg-tokyo-future',
    destinationId: 'dest-tokyo',
    destinationName: 'Tokyo & Mt. Fuji, Japan',
    title: 'Japan Fusion: Tokyo Futurism & Mount Fuji Wonders',
    tagline: '7 Days of Shinkansen Bullet Trains, teamLab Digital Art, Mt Fuji & Wagyu Feast',
    durationDays: 7,
    durationNights: 6,
    startingPrice: 185000,
    priceBreakdown: {
      hotelStay: 90000,
      transport: 42000,
      activities: 35000,
      meals: 26000,
      taxesAndFees: 10000,
      discount: 18000,
      totalPerPerson: 185000
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
