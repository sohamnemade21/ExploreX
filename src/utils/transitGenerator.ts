/**
 * Dynamic Transit & Hotel Inventory Generator for ExploreX Bookings
 * Automatically generates realistic flights, trains, buses, and verified hotels
 * tailored instantaneously to the searched Origin and Destination cities.
 */

export interface DynamicFlight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  basePriceEconomy: number;
  basePriceBusiness: number;
  baggage: string;
  refundable: string;
  seatsAvailable: number;
}

export interface DynamicTrainClass {
  code: string;
  name: string;
  price: number;
  status: string;
  statusType: 'available' | 'rac' | 'wl';
}

export interface DynamicTrain {
  id: string;
  trainNumber: string;
  trainName: string;
  originStation: string;
  destStation: string;
  duration: string;
  runsOn: string;
  classes: DynamicTrainClass[];
}

export interface DynamicBus {
  id: string;
  operator: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  boardingPoint: string;
  droppingPoint: string;
  rating: number;
  price: number;
  seatsLeft: number;
  amenities: string[];
}

export interface DynamicHotelRoom {
  type: string;
  pricePerNight: number;
  capacity: string;
}

export interface DynamicHotel {
  id: string;
  name: string;
  destination: string;
  image: string;
  stars: number;
  rating: number;
  reviewCount: number;
  tagline: string;
  proximity: {
    railway: string;
    airport: string;
    landmarks: string[];
  };
  rooms: DynamicHotelRoom[];
  amenities: string[];
  cancellation: string;
}

const AIRPORT_CODE_MAP: Record<string, string> = {
  delhi: 'DEL',
  'new delhi': 'DEL',
  mumbai: 'BOM',
  bombay: 'BOM',
  goa: 'GOI',
  'north goa': 'GOX',
  'south goa': 'GOI',
  pune: 'PNQ',
  bengaluru: 'BLR',
  bangalore: 'BLR',
  hyderabad: 'HYD',
  kolkata: 'CCU',
  calcutta: 'CCU',
  chennai: 'MAA',
  madras: 'MAA',
  jaipur: 'JAI',
  kochi: 'COK',
  cochin: 'COK',
  ahmedabad: 'AMD',
  varanasi: 'VNS',
  srinagar: 'SXR',
  kashmir: 'SXR',
  sindhudurg: 'SDW',
  shimla: 'IXC',
  chandigarh: 'IXC',
  amritsar: 'ATQ',
  lucknow: 'LKO',
  guwahati: 'GAU',
  udaipur: 'UDR',
  bhubaneswar: 'BBI',
  indore: 'IDR'
};

const STATION_MAP: Record<string, string> = {
  delhi: 'New Delhi (NDLS)',
  'new delhi': 'New Delhi (NDLS)',
  mumbai: 'Mumbai CSMT (CSMT)',
  goa: 'Goa Madgaon (MAO)',
  'north goa': 'Goa Thivim (THVM)',
  'south goa': 'Goa Madgaon (MAO)',
  pune: 'Pune Junction (PUNE)',
  bengaluru: 'KSR Bengaluru (SBC)',
  bangalore: 'KSR Bengaluru (SBC)',
  hyderabad: 'Secunderabad Jn (SC)',
  kolkata: 'Howrah Junction (HWH)',
  chennai: 'MGR Chennai Central (MAS)',
  jaipur: 'Jaipur Junction (JP)',
  varanasi: 'Varanasi Junction (BSB)',
  kochi: 'Ernakulam Town (ERN)',
  sindhudurg: 'Kudal (KUDL)',
  ahmedabad: 'Ahmedabad Jn (ADI)',
  lucknow: 'Lucknow Charbagh (LKO)',
  amritsar: 'Amritsar Jn (ASR)',
  chandigarh: 'Chandigarh Jn (CDG)'
};

const BUS_TERMINALS_MAP: Record<string, { boarding: string; dropping: string }> = {
  delhi: { boarding: 'ISBT Kashmere Gate Bay 8', dropping: 'Anand Vihar Terminal' },
  'new delhi': { boarding: 'ISBT Kashmere Gate Bay 8', dropping: 'Anand Vihar Terminal' },
  mumbai: { boarding: 'Dadar TT Circle & Borivali West', dropping: 'Vashi Plaza Highway' },
  goa: { boarding: 'Panaji KTC Central Stand', dropping: 'Mapusa & Madgaon Bus Stand' },
  'north goa': { boarding: 'Mapusa Bus Stand', dropping: 'Calangute Circle' },
  'south goa': { boarding: 'Madgaon KTC Bus Stand', dropping: 'Colva Beach Road' },
  pune: { boarding: 'Swargate Bus Station / Wakad', dropping: 'Pune Station / Viman Nagar' },
  bengaluru: { boarding: 'Majestic Bus Stand Platform 12', dropping: 'Madiwala Silk Board Junction' },
  bangalore: { boarding: 'Majestic Bus Stand Platform 12', dropping: 'Madiwala Silk Board Junction' },
  hyderabad: { boarding: 'MGBS Central Bay 4', dropping: 'Gachibowli Outer Ring Road' },
  jaipur: { boarding: 'Sindhi Camp Central Terminal', dropping: 'Narayan Singh Circle' },
  kolkata: { boarding: 'Esplanade Bus Terminal', dropping: 'Karunamoyee Salt Lake' },
  chennai: { boarding: 'CMBT Koyambedu Bay 6', dropping: 'Guindy Kathipara Junction' },
  sindhudurg: { boarding: 'Kudal ST Stand', dropping: 'Malvan Bus Depot' },
  kochi: { boarding: 'Vyttila Mobility Hub', dropping: 'Aluva Flyover' }
};

export function cleanCityName(raw: string): string {
  if (!raw) return 'Destination';
  return raw.replace(/\(.*?\)/g, '').replace(/,/g, '').trim();
}

export function resolveAirportCode(city: string): string {
  const norm = cleanCityName(city).toLowerCase();
  for (const [k, v] of Object.entries(AIRPORT_CODE_MAP)) {
    if (norm.includes(k) || k.includes(norm)) return v;
  }
  return norm.substring(0, 3).toUpperCase();
}

export function resolveStationName(city: string): string {
  const norm = cleanCityName(city).toLowerCase();
  for (const [k, v] of Object.entries(STATION_MAP)) {
    if (norm.includes(k) || k.includes(norm)) return v;
  }
  const clean = cleanCityName(city);
  return `${clean} Junction (${clean.substring(0, 3).toUpperCase()})`;
}

export function resolveBusStops(city: string): { boarding: string; dropping: string } {
  const norm = cleanCityName(city).toLowerCase();
  for (const [k, v] of Object.entries(BUS_TERMINALS_MAP)) {
    if (norm.includes(k) || k.includes(norm)) return v;
  }
  const clean = cleanCityName(city);
  return {
    boarding: `${clean} Main Central Bus Station`,
    dropping: `${clean} City Center Circle & Highway Bypass`
  };
}

/**
 * Generate Dynamic Flights connecting Origin and Destination
 */
export function generateDynamicFlights(originRaw: string, destRaw: string): DynamicFlight[] {
  const originCity = cleanCityName(originRaw) || 'New Delhi';
  const destCity = cleanCityName(destRaw) || 'Goa';
  const originCode = resolveAirportCode(originCity);
  const destCode = resolveAirportCode(destCity);

  return [
    {
      id: `fl-6e-${originCode}-${destCode}`,
      airline: 'IndiGo',
      flightNumber: `6E-${Math.floor(200 + Math.random() * 400)}`,
      origin: originCode,
      originCity,
      destination: destCode,
      destinationCity: destCity,
      departureTime: '06:15 AM',
      arrivalTime: '08:45 AM',
      duration: '2h 30m',
      stops: 'Non-stop',
      basePriceEconomy: 4650,
      basePriceBusiness: 11200,
      baggage: '15kg Check-in • 7kg Cabin',
      refundable: 'Partially Refundable',
      seatsAvailable: 8
    },
    {
      id: `fl-ai-${originCode}-${destCode}`,
      airline: 'Air India',
      flightNumber: `AI-${Math.floor(800 + Math.random() * 100)}`,
      origin: originCode,
      originCity,
      destination: destCode,
      destinationCity: destCity,
      departureTime: '10:30 AM',
      arrivalTime: '01:05 PM',
      duration: '2h 35m',
      stops: 'Non-stop',
      basePriceEconomy: 5400,
      basePriceBusiness: 13500,
      baggage: '20kg Check-in • 7kg Cabin • Free Meals',
      refundable: '100% Refundable within 24h',
      seatsAvailable: 14
    },
    {
      id: `fl-uk-${originCode}-${destCode}`,
      airline: 'Vistara',
      flightNumber: `UK-${Math.floor(900 + Math.random() * 90)}`,
      origin: originCode,
      originCity,
      destination: destCode,
      destinationCity: destCity,
      departureTime: '04:45 PM',
      arrivalTime: '07:20 PM',
      duration: '2h 35m',
      stops: 'Non-stop',
      basePriceEconomy: 5850,
      basePriceBusiness: 14200,
      baggage: '15kg Check-in • 7kg Cabin • Gourmet Dining',
      refundable: 'Partially Refundable',
      seatsAvailable: 5
    },
    {
      id: `fl-qp-${originCode}-${destCode}`,
      airline: 'Akasa Air',
      flightNumber: `QP-${Math.floor(1100 + Math.random() * 100)}`,
      origin: originCode,
      originCity,
      destination: destCode,
      destinationCity: destCity,
      departureTime: '08:00 PM',
      arrivalTime: '10:35 PM',
      duration: '2h 35m',
      stops: 'Non-stop',
      basePriceEconomy: 4100,
      basePriceBusiness: 9800,
      baggage: '15kg Check-in • 7kg Cabin',
      refundable: 'Standard Policy',
      seatsAvailable: 12
    }
  ];
}

/**
 * Generate Dynamic Trains connecting Origin and Destination
 */
export function generateDynamicTrains(originRaw: string, destRaw: string): DynamicTrain[] {
  const originCity = cleanCityName(originRaw) || 'Mumbai';
  const destCity = cleanCityName(destRaw) || 'Goa';
  const originStation = resolveStationName(originCity);
  const destStation = resolveStationName(destCity);

  return [
    {
      id: `tr-vb-${Math.floor(20000 + Math.random() * 900)}`,
      trainNumber: `${Math.floor(20600 + Math.random() * 50)}`,
      trainName: `${destCity} Vande Bharat Express`,
      originStation: `${originStation} (05:25 AM)`,
      destStation: `${destStation} (01:10 PM)`,
      duration: '7h 45m',
      runsOn: 'M, T, W, F, S, S',
      classes: [
        { code: 'CC', name: 'Chair Car', price: 1650, status: 'AVAILABLE-48', statusType: 'available' },
        { code: 'EC', name: 'Executive Chair Car', price: 3180, status: 'AVAILABLE-12', statusType: 'available' }
      ]
    },
    {
      id: `tr-raj-${Math.floor(12000 + Math.random() * 900)}`,
      trainNumber: `${Math.floor(12950 + Math.random() * 40)}`,
      trainName: `${destCity} Tejas Rajdhani Express`,
      originStation: `${originStation} (05:00 PM)`,
      destStation: `${destStation} (04:15 AM)`,
      duration: '11h 15m',
      runsOn: 'Daily',
      classes: [
        { code: '3A', name: '3-Tier AC', price: 1850, status: 'AVAILABLE-24', statusType: 'available' },
        { code: '2A', name: '2-Tier AC', price: 2650, status: 'RAC-6', statusType: 'rac' },
        { code: '1A', name: 'First Class AC', price: 4200, status: 'WL-3', statusType: 'wl' }
      ]
    },
    {
      id: `tr-shat-${Math.floor(12000 + Math.random() * 900)}`,
      trainNumber: `${Math.floor(12050 + Math.random() * 30)}`,
      trainName: `${destCity} Jan Shatabdi Express`,
      originStation: `${originStation} (05:25 AM)`,
      destStation: `${destStation} (02:00 PM)`,
      duration: '8h 35m',
      runsOn: 'Daily',
      classes: [
        { code: '2S', name: 'Second Sitting', price: 340, status: 'AVAILABLE-95', statusType: 'available' },
        { code: 'CC', name: 'AC Chair Car', price: 1120, status: 'AVAILABLE-18', statusType: 'available' }
      ]
    },
    {
      id: `tr-sf-${Math.floor(12200 + Math.random() * 900)}`,
      trainNumber: `${Math.floor(12220 + Math.random() * 30)}`,
      trainName: `${destCity} Superfast Express`,
      originStation: `${originStation} (11:05 PM)`,
      destStation: `${destStation} (10:45 AM)`,
      duration: '11h 40m',
      runsOn: 'Daily',
      classes: [
        { code: 'SL', name: 'Sleeper Class', price: 540, status: 'AVAILABLE-32', statusType: 'available' },
        { code: '3A', name: '3-Tier AC', price: 1420, status: 'AVAILABLE-15', statusType: 'available' },
        { code: '2A', name: '2-Tier AC', price: 2080, status: 'RAC-4', statusType: 'rac' }
      ]
    }
  ];
}

/**
 * Generate Dynamic Buses connecting Origin and Destination
 */
export function generateDynamicBuses(originRaw: string, destRaw: string): DynamicBus[] {
  const originCity = cleanCityName(originRaw) || 'New Delhi';
  const destCity = cleanCityName(destRaw) || 'Goa';
  const originStops = resolveBusStops(originCity);
  const destStops = resolveBusStops(destCity);

  return [
    {
      id: `bs-zing-${Math.floor(100 + Math.random() * 800)}`,
      operator: 'Zingbus Electric Superfast',
      busType: 'Volvo 9600 Multi-Axle AC Sleeper (2+1)',
      departureTime: '08:30 PM',
      arrivalTime: '06:00 AM',
      duration: '9h 30m',
      boardingPoint: originStops.boarding,
      droppingPoint: destStops.dropping,
      rating: 4.85,
      price: 1250,
      seatsLeft: 14,
      amenities: ['Live GPS Tracking', 'USB Charging', 'Water Bottle', 'Blanket', 'Reading Light']
    },
    {
      id: `bs-intrcity-${Math.floor(100 + Math.random() * 800)}`,
      operator: 'IntrCity SmartBus Lounge',
      busType: 'BharatBenz Club Class AC Sleeper (2+1)',
      departureTime: '09:45 PM',
      arrivalTime: '07:15 AM',
      duration: '9h 30m',
      boardingPoint: `${originCity} Traveler Lounge Hub`,
      droppingPoint: destStops.dropping,
      rating: 4.9,
      price: 1480,
      seatsLeft: 8,
      amenities: ['AC Lounge Access', 'Clean Bedding', 'WiFi', 'CCTV Security', 'Punctual Guarantee']
    },
    {
      id: `bs-vrl-${Math.floor(100 + Math.random() * 800)}`,
      operator: 'VRL Travels Executive',
      busType: 'Scania Multi-Axle Semi-Sleeper AC',
      departureTime: '10:30 PM',
      arrivalTime: '08:00 AM',
      duration: '9h 30m',
      boardingPoint: originStops.boarding,
      droppingPoint: destStops.dropping,
      rating: 4.75,
      price: 980,
      seatsLeft: 22,
      amenities: ['Reclining Pushback Seats', 'Water Bottle', 'Night Dim Lights']
    },
    {
      id: `bs-st-${Math.floor(100 + Math.random() * 800)}`,
      operator: `${originCity} State Transport Diamond Class`,
      busType: 'Volvo Multi-Axle Diamond Class AC',
      departureTime: '11:15 PM',
      arrivalTime: '08:45 AM',
      duration: '9h 30m',
      boardingPoint: originStops.boarding,
      droppingPoint: destStops.dropping,
      rating: 4.8,
      price: 1100,
      seatsLeft: 16,
      amenities: ['Experienced Govt Captains', 'Spacious Legroom', 'Emergency SOS']
    }
  ];
}

/**
 * Generate Verified Hotels situated in the Destination City
 */
export function generateDynamicHotels(destRaw: string): DynamicHotel[] {
  const destCity = cleanCityName(destRaw) || 'Goa';
  const destStation = resolveStationName(destCity);
  const destAirportCode = resolveAirportCode(destCity);

  return [
    {
      id: `ht-leela-${destCity.toLowerCase()}`,
      name: `The Leela Palace ${destCity}`,
      destination: `Central / Waterfront, ${destCity}`,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      stars: 5,
      rating: 4.92,
      reviewCount: 1420,
      tagline: `Luxury 5-Star Haven surrounded by lush serene landscapes in the heart of ${destCity}`,
      proximity: {
        railway: `4.2 km from ${destStation}`,
        airport: `18.0 km from ${destCity} Airport (${destAirportCode})`,
        landmarks: [`1.5 km from ${destCity} Promenade`, `3.2 km from Historic City Center`]
      },
      rooms: [
        { type: 'Deluxe Palace View Room', pricePerNight: 8500, capacity: '2 Adults' },
        { type: 'Conservatory Premiere Suite', pricePerNight: 13500, capacity: '2 Adults + 1 Child' },
        { type: 'Royal Heritage Villa with Plunge Pool', pricePerNight: 22000, capacity: '4 Adults' }
      ],
      amenities: ['Infinity Swimming Pool', 'Ayurvedic Spa & Wellness', 'Free High-Speed WiFi', 'Airport Limousine Pickup', 'Fine Dining'],
      cancellation: 'Free cancellation up to 48 hours before check-in'
    },
    {
      id: `ht-taj-${destCity.toLowerCase()}`,
      name: `Taj Resort & Heritage Spa ${destCity}`,
      destination: `Hilltop / Sea View, ${destCity}`,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      stars: 5,
      rating: 4.88,
      reviewCount: 2100,
      tagline: `Iconic heritage grandeur overlooking panoramic vistas of ${destCity}`,
      proximity: {
        railway: `6.5 km from ${destStation}`,
        airport: `16.5 km from ${destCity} Airport (${destAirportCode})`,
        landmarks: [`800m from ${destCity} Heritage Landmark`, `2.0 km from Cultural Bazaar`]
      },
      rooms: [
        { type: 'Superior Heritage Room', pricePerNight: 7600, capacity: '2 Adults' },
        { type: 'Executive Luxury Cottage', pricePerNight: 11800, capacity: '2 Adults + 1 Child' }
      ],
      amenities: ['Jiva Ayurvedic Spa', 'Oceanview Sunset Deck', 'Complimentary Gourmet Breakfast', 'Concierge Tour Desk'],
      cancellation: 'Free cancellation up to 24 hours before check-in'
    },
    {
      id: `ht-conrad-${destCity.toLowerCase()}`,
      name: `Conrad & Marriott Luxury Suites ${destCity}`,
      destination: `Downtown Business & Leisure Hub, ${destCity}`,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      stars: 5,
      rating: 4.86,
      reviewCount: 1850,
      tagline: `Contemporary architectural masterpiece in the premier cultural quarter of ${destCity}`,
      proximity: {
        railway: `2.8 km from ${destStation}`,
        airport: `9.4 km from ${destCity} Airport (${destAirportCode})`,
        landmarks: [`1.8 km from Famous ${destCity} Monument`, `2.4 km from Shopping Promenade`]
      },
      rooms: [
        { type: 'Deluxe King Studio', pricePerNight: 6200, capacity: '2 Adults' },
        { type: 'Executive Suite with Lounge Access', pricePerNight: 9800, capacity: '2 Adults' }
      ],
      amenities: ['Temperature-Controlled Pool', 'Komorebi Spa', '24/7 Room Service', 'Valet Parking', 'Luxury Bath Amenities'],
      cancellation: 'Free cancellation up to 24 hours before check-in'
    },
    {
      id: `ht-bloom-${destCity.toLowerCase()}`,
      name: `Bloom Boutique Heritage Stay ${destCity}`,
      destination: `Old Town Cultural Quarter, ${destCity}`,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      stars: 4,
      rating: 4.74,
      reviewCount: 940,
      tagline: `Charming boutique comfort with cloud beds and vibrant cafe in ${destCity}`,
      proximity: {
        railway: `3.5 km from ${destStation}`,
        airport: `14.0 km from ${destCity} Airport (${destAirportCode})`,
        landmarks: [`600m from Central Market`, `1.5 km from Local Handicrafts Center`]
      },
      rooms: [
        { type: 'Cloud Bed Standard Room', pricePerNight: 2800, capacity: '2 Adults' },
        { type: 'Balcony Garden Deluxe', pricePerNight: 4200, capacity: '2 Adults' }
      ],
      amenities: ['Swimming Pool', 'Cloud Bed Mattress', 'Fresh Breakfast Included', 'High-Speed WiFi', 'Bike & Car Rental'],
      cancellation: 'Free cancellation up to 24 hours before check-in'
    }
  ];
}
