export type TravelVibe = 
  | 'beach' 
  | 'mountain' 
  | 'heritage' 
  | 'nature' 
  | 'urban' 
  | 'adventure' 
  | 'luxury' 
  | 'budget' 
  | 'wellness' 
  | 'culinary'
  | 'spiritual'
  | 'spirituality'
  | 'cultural'
  | 'eco_friendly'
  | 'shopping'
  | 'rural';

export interface UserPreferences {
  vibes: TravelVibe[];
  budgetLevel: 'budget' | 'moderate' | 'luxury' | 'ultra_luxury';
  pace: 'relaxed' | 'moderate' | 'fast_paced';
  dietary: string[];
  travelStyle: 'solo' | 'couple' | 'family' | 'friends';
  ecoFriendly: boolean;
  accommodationType: 'hotel' | 'resort' | 'hostel' | 'homestay' | 'villa';
}

export interface TravelHistoryItem {
  id: string;
  destination: string;
  country: string;
  image: string;
  year: number;
  durationDays: number;
  highlight: string;
  rating: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  countryCode: string;
  email?: string;
  isPrimary?: boolean;
}

export type TravelMode = 
  | 'solo_female' 
  | 'solo_male' 
  | 'female_group' 
  | 'family' 
  | 'friends' 
  | 'general';

export interface TravelerSafetyProfile {
  travelMode: TravelMode;
  travelerCountry: string; // ISO code or country name, e.g. 'IN', 'US', 'GB', 'AU'
  isInternational: boolean;
  emergencyContacts: EmergencyContact[];
  checkInStatus: 'safe' | 'checking_in_soon' | 'sos_active' | 'missed';
  lastCheckInTime?: string;
  checkInIntervalHours?: number;
  discreetSosEnabled?: boolean;
  saferTransportPreferred?: boolean;
  saferRoutePreferred?: boolean;
  avoidNightTravel?: boolean;
  nightWarningThresholdHour?: number;
  femaleFriendlyStayPreferred?: boolean;
  shareLiveTripWithContacts?: boolean;
  groupLocationSharing?: boolean;
  privacyLocationLevel?: 'precise' | 'city_only' | 'emergency_only';
  familyMembersCount?: number;
}

export interface SafetyAlert {
  id: string;
  type: 'advisory' | 'warning' | 'weather' | 'night_travel' | 'medical';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  message: string;
  location?: string;
  timestamp: string;
  actionRecommendation?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  phoneCountryCode?: string;
  country?: string;
  nationality?: string;
  travelerType?: 'indian' | 'international';
  avatar?: string;
  bio?: string;
  homeCity?: string;
  joinedDate: string;
  walletBalance: number;
  preferences: UserPreferences;
  savedDestinations: string[]; // destination IDs
  savedPackages: string[]; // package IDs
  travelHistory: TravelHistoryItem[];
  travelDNA: TravelDNA;
  safetyProfile?: TravelerSafetyProfile;
  role?: 'user' | 'admin';
}

export interface TravelDNA {
  culturalExplorer: number; // 0 - 100
  adventureSeeker: number;
  gastronomyLover: number;
  relaxationScore: number;
  ecoConscious: number;
  spontaneity: number;
  primaryArchetype: string;
  secondaryArchetype: string;
  description: string;
}

export interface Attraction {
  id: string;
  name: string;
  category: 'Sightseeing' | 'Heritage' | 'Adventure' | 'Food' | 'Nature' | 'Shopping';
  rating: number;
  reviewCount: number;
  estimatedTime: string;
  entryFee: number;
  image: string;
  description: string;
  lat: number;
  lng: number;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Peak';
  bestTimeToVisit: string;
  isOffbeat?: boolean;
}

export type POICategory = 
  | 'all'
  | 'Sightseeing' 
  | 'Heritage' 
  | 'Nature' 
  | 'Beach' 
  | 'Adventure' 
  | 'Food' 
  | 'Hotel' 
  | 'Cafe' 
  | 'Experience' 
  | 'Event' 
  | 'Craft' 
  | 'Shopping'
  | 'Cab'
  | 'Mobility';

export interface ExplorePOI {
  id: string;
  destinationId: string;
  destinationName: string;
  name: string;
  category: POICategory;
  tagline?: string;
  description: string;
  image: string;
  gallery?: string[];
  lat: number;
  lng: number;
  address?: string;
  rating: number;
  reviewCount: number;
  priceLevel: number; // in INR (₹)
  openingHours?: string;
  crowdLevel?: 'Low' | 'Moderate' | 'High' | 'Peak';
  isOffbeat?: boolean;
  isPopular?: boolean;
  famousInfo?: {
    type?: string;
    highlights?: string[];
    mustTryAt?: string;
    giTagged?: boolean;
    bestSeason?: string;
  };
}

export type ThematicTag = 
  | 'food' 
  | 'culture' 
  | 'clothing' 
  | 'shopping' 
  | 'nature' 
  | 'adventure' 
  | 'heritage' 
  | 'spirituality' 
  | 'beaches' 
  | 'festivals' 
  | 'rural_tribal';

export interface CulturalSpecialties {
  food: {
    name: string;
    description: string;
    mustTryAt?: string;
    isVeg: boolean;
    tag: string;
    image?: string;
  }[];
  clothing: {
    name: string;
    description: string;
    occasion: string;
    authenticHub?: string;
    image?: string;
  }[];
  handicrafts: {
    name: string;
    description: string;
    giTagged?: boolean;
    artisanCommunity?: string;
    image?: string;
  }[];
  jewellery: {
    name: string;
    description: string;
    material?: string;
    traditionalSignificance?: string;
    image?: string;
  }[];
  artAndCulture: {
    name: string;
    type: 'folk_dance' | 'painting' | 'music' | 'theatre' | 'heritage' | string;
    description: string;
  }[];
  festivals: {
    name: string;
    monthOrSeason: string;
    culturalSignificance: string;
    celebrationHighlights: string;
  }[];
  localShopping: {
    product: string;
    bestMarket: string;
    priceRange: string;
    tip: string;
  }[];
  uniqueExperiences: {
    title: string;
    description: string;
    bestTime: string;
    localImpact: string;
  }[];
}

export interface WhyAlternativeBetter {
  headline: string;
  replacesFamousSpot: string;
  crowdReductionPct: number;
  costSavingsPct: number;
  localAuthenticityScore: number;
  keyAdvantage: string;
  comparisonHighlights: {
    metric: string;
    famousSpot: string;
    hiddenGem: string;
  }[];
}

export interface LocalEconomyDirectory {
  localImpactScore: number; // 0 - 100
  economicRetentionExplainer: string;
  authenticHomestays: {
    name: string;
    hostName: string;
    village: string;
    pricePerNight: number;
    specialties: string[];
    rating: number;
    contactInfo?: string;
  }[];
  traditionalKhanavals: {
    name: string;
    signatureDish: string;
    location: string;
    avgMealCost: number;
    isFamilyRun: boolean;
  }[];
  communityGuides: {
    name: string;
    expertise: string;
    languages: string[];
    badge: string;
    dailyRate: number;
  }[];
  artisanCooperatives: {
    craft: string;
    guildName: string;
    village: string;
    directBuyingContact: string;
  }[];
  localTransportOptions: {
    mode: string;
    typicalRoute: string;
    approxFare: string;
    ecoFriendly: boolean;
  }[];
  craftTradition?: string;
}

export interface BestTimeEngineData {
  bestSeasonDescription: string;
  idealMonths: string[];
  timeOfDayGuide: {
    morning: { hours: string; recommendation: string; crowd: 'Low' | 'Moderate' | 'High' };
    afternoon: { hours: string; recommendation: string; crowd: 'Low' | 'Moderate' | 'High' };
    evening: { hours: string; recommendation: string; crowd: 'Low' | 'Moderate' | 'High' };
    night: { hours: string; recommendation: string; crowd: 'Low' | 'Moderate' | 'High' };
  };
  weatherIndexCurrent: number; // 0 - 100
  weatherForecastNarrative: string;
  budgetEstimator: {
    budgetTier: { stayPerDay: number; foodPerDay: number; transitPerDay: number; totalDaily: number };
    moderateTier: { stayPerDay: number; foodPerDay: number; transitPerDay: number; totalDaily: number };
    luxuryTier: { stayPerDay: number; foodPerDay: number; transitPerDay: number; totalDaily: number };
  };
  upcomingEvents: {
    name: string;
    dateRange: string;
    type: string;
    significance: string;
  }[];
}

export interface Destination {
  id: string;
  name: string;
  stateOrRegion: string;
  country: string;
  isInternational: boolean;
  tagline: string;
  description: string;
  highlights?: string[];
  heroImage: string;
  galleryImages: string[];
  vibe: TravelVibe[];
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  bestMonths: string[];
  currentWeather: {
    tempC: number;
    condition: string;
    icon: string;
    forecast: string;
    airQualityIndex: number;
  };
  safetyScore: {
    overall: number; // out of 100
    daySafety: number;
    nightSafety: number;
    emergencyContact: string;
    advisory: string;
  };
  crowdPrediction: {
    currentStatus: 'Low' | 'Moderate' | 'High' | 'Peak';
    peakHours: string;
    quietHours: string;
    recommendation: string;
  };
  popularAttractions: Attraction[];
  localCuisines: string[];
  startingPrice: number;

  // India-First Expanded Metadata
  state?: string;
  region?: string;
  district?: string;
  thematicTags?: ThematicTag[];
  tierCategory?: 'Tier-1' | 'Tier-2' | 'Tier-3' | 'Rural/Village' | 'Tribal/Eco-zone';
  popularityTier?: 'gem' | 'emerging' | 'popular';
  carryingCapacityDaily?: number;
  currentCapacityLoadPct?: number;
  isOvertouristed?: boolean;
  localEconomicRetentionPct?: number; // e.g. 88%
  sustainabilityScore?: number; // 0 - 100
  affordabilityIndex?: number; // 0 - 100

  // Cultural & Local Economy discovery modules
  culturalSpecialties?: CulturalSpecialties;
  alternativeTo?: string[]; // IDs or names of famous places this replaces (e.g. ['Goa', 'dest-goa'])
  whyAlternativeBetter?: WhyAlternativeBetter;
  localEconomy?: LocalEconomyDirectory;
  bestTimeEngine?: BestTimeEngineData;
}

export interface DemandBalancerQuery {
  vibes?: TravelVibe[];
  thematicTags?: ThematicTag[];
  seasonOrMonth?: string;
  budgetLevel?: 'budget' | 'moderate' | 'luxury' | 'ultra_luxury';
  maxBudgetPerDay?: number;
  statePreference?: string;
  preferHiddenGems?: boolean;
  avoidOvertouristed?: boolean;
  travelStyle?: 'solo' | 'couple' | 'family' | 'friends';
}

export interface DemandBalancerResult {
  destination: Destination;
  overallScore: number; // 0 - 100
  breakdown: {
    satisfactionScore: number;
    affordabilityScore: number;
    localEconomicBenefitScore: number;
    sustainabilityScore: number;
  };
  demandReliefReasoning: string;
  capacityUtilization: number;
  estimatedCrowdLevel: 'Low' | 'Moderate' | 'High';
  alternativeComparison?: {
    replacesFamousSpot: string;
    crowdSavedPct: number;
    costSavedPct: number;
  };
}

export interface PackagePriceBreakdown {
  hotelStay: number;
  transport: number;
  activities: number;
  meals: number;
  taxesAndFees: number;
  discount: number;
  totalPerPerson: number;
}

export interface PackageDayItinerary {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  mealsIncluded: string[];
  stayHotel: string;
  mapRoute?: { lat: number; lng: number; name: string }[];
}

export interface TravelPackage {
  id: string;
  destinationId: string;
  destinationName: string;
  title: string;
  tagline: string;
  durationDays: number;
  durationNights: number;
  startingPrice: number;
  priceBreakdown: PackagePriceBreakdown;
  images: string[];
  rating: number;
  reviewCount: number;
  theme: TravelVibe;
  inclusions: string[];
  exclusions: string[];
  hotels: {
    name: string;
    stars: number;
    roomType: string;
    address: string;
  }[];
  itinerary: PackageDayItinerary[];
  maxGroupSize: number;
  availableDates: string[];
  isFeatured?: boolean;
}

export type VehicleType = 'cab_sedan' | 'cab_suv' | 'cab_premium' | 'auto' | 'bike' | 'scooter';

export interface ExplorerVehicleOption {
  type: VehicleType;
  name: string;
  capacity: string;
  description: string;
  baseFare: number;
  perKmRate: number;
  icon: string;
  etaMins: number;
}

export interface ExplorerRide {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  vehicleName: string;
  pickupAddress: string;
  dropAddress: string;
  pickupCoords: { lat: number; lng: number };
  dropCoords: { lat: number; lng: number };
  distanceKm: number;
  fare: number;
  durationMins: number;
  status: 'searching' | 'driver_assigned' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  driver?: {
    name: string;
    phone: string;
    rating: number;
    vehicleNumber: string;
    vehicleModel: string;
    avatar: string;
    currentCoords?: { lat: number; lng: number };
  };
  otp: string;
}

export type BookingServiceType = 'flight' | 'train' | 'bus' | 'hotel' | 'explorer' | 'package';

export interface Booking {
  id: string;
  userId: string;
  serviceType: BookingServiceType;
  title: string;
  destinationName: string;
  bookingDate: string;
  travelDate: string;
  returnDate?: string;
  passengersCount: number;
  passengerDetails: {
    name: string;
    age: number;
    gender: string;
    seatNumber?: string;
  }[];
  totalAmount: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  paymentMethod: 'wallet' | 'card_demo' | 'upi_demo' | 'netbanking_demo' | 'razorpay';
  paymentStatus: 'paid' | 'refunded' | 'pending' | 'failed';
  isSimulation: boolean;
  details: {
    providerName?: string;
    airline?: string;
    flightNumber?: string;
    trainNumber?: string;
    trainName?: string;
    coach?: string;
    quota?: string;
    departureStation?: string;
    arrivalStation?: string;
    busOperator?: string;
    busType?: string;
    seatClass?: string;
    seatNumber?: string;
    departureTime?: string;
    arrivalTime?: string;
    duration?: string;
    baggage?: string;
    refundable?: string;
    originCity?: string;
    destinationCity?: string;
    hotelName?: string;
    roomType?: string;
    packageId?: string;
    packageDuration?: string;
    pnrNumber?: string;
    checkInTime?: string;
    checkOutTime?: string;
    boardingPoint?: string;
    droppingPoint?: string;
    paymentId?: string;
    simulateProviderFailure?: boolean;
    reconciliationRequired?: boolean;
    reconciliationReason?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    amountInINR?: number;
    currency?: string;
    [key: string]: any;
  };
  invoice: {
    invoiceNo: string;
    baseFare: number;
    taxes: number;
    discounts: number;
    grandTotal: number;
    generatedAt: string;
  };
  emailStatus?: 'sent' | 'failed' | 'pending';
  emailRecipient?: string;
  emailSentAt?: string;
  emailError?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetType: 'destination' | 'package' | 'hotel' | 'attraction' | 'explorer';
  targetId: string;
  targetName: string;
  rating: number; // 1 - 5
  reviewText: string; // Max 100 words
  createdAt: string;
  verifiedBooking: boolean;
  likes: number;
}

export interface MagicMomentPhoto {
  id: string;
  userId: string;
  albumId: string;
  url: string;
  thumbnailUrl?: string;
  caption: string;
  locationName: string;
  takenAt: string;
  fileSizeBytes: number;
  mediaType: 'image' | 'video';
  tags: string[];
}

export interface MagicMomentAlbum {
  id: string;
  userId: string;
  title: string;
  destinationName: string;
  tripStartDate: string;
  tripEndDate: string;
  coverPhotoUrl?: string;
  photosCount: number;
  totalSizeBytes: number;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  source: 'topup_demo' | 'booking_payment' | 'ride_payment' | 'refund' | 'group_settle';
  description: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  referenceId?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface GroupExpense {
  id: string;
  groupId: string;
  title: string;
  category: 'Stay' | 'Food' | 'Transport' | 'Activities' | 'Shopping' | 'Other';
  amount: number;
  paidById: string;
  paidByName: string;
  splitAmongIds: string[];
  splitType: 'equal' | 'exact';
  date: string;
  notes?: string;
}

export interface GroupTrip {
  id: string;
  userId: string;
  title: string;
  destinationName: string;
  members: GroupMember[];
  expenses: GroupExpense[];
  createdAt: string;
}

export interface SettlementDebt {
  fromMemberId: string;
  fromMemberName: string;
  toMemberId: string;
  toMemberName: string;
  amount: number;
}

export interface AutopilotNotification {
  id: string;
  type: 'weather_alert' | 'traffic_delay' | 'crowd_surge' | 'budget_saving' | 'recommendation';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent';
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'replan_itinerary' | 'book_cab' | 'switch_activity' | 'view_indoor';
  };
}

export interface WhatIfSimulationResult {
  scenarioTitle: string;
  originalPlanSummary: string;
  adjustedPlanSummary: string;
  impactScore: number; // 0 - 100
  costDifference: number;
  timeDifferenceMins: number;
  weatherFitScore: number;
  crowdReductionPct: number;
  recommendations: string[];
  dayWiseAdjustments: {
    day: number;
    originalActivity: string;
    proposedActivity: string;
    reason: string;
  }[];
}

// ─── ML Service Response Types ───────────────────────────────────────────────

export interface DynamicPriceResponse {
  destinationId: string;
  destinationName: string;
  date: string;
  month: string;
  predictedPrice: number;
  baseLine: number;
  changeVsBaseline: number;
  isHoliday: boolean;
  isBestMonth: boolean;
  popularityTier: string;
  topFactors: string[];
  featureImportances: Record<string, number>;
}

export interface ItineraryStopDetail {
  order: number;
  attractionId: string;
  name: string;
  category: string;
  indoorOutdoor: string;
  arrivalTime: string;
  departureTime: string;
  visitDurationMins: number;
  travelFromPrevMins: number;
  estimatedCost: number;
  lat: number;
  lng: number;
}

export interface ItineraryDayPlan {
  day: number;
  stops: ItineraryStopDetail[];
  totalTravelMins: number;
  totalVisitMins: number;
  totalCost: number;
  finishTime: string;
}

export interface OptimizedItineraryResponse {
  destinationId: string;
  solver: string;
  numDays: number;
  maxHoursPerDay: number;
  startTime: string;
  days: ItineraryDayPlan[];
  grandTotalCost: number;
  grandTotalTravelMins: number;
}

export interface AIGrounding {
  sources: string[];
  mlServiceAvailable: boolean;
}

export interface AIChatResponse {
  reply: string;
  grounding?: AIGrounding;
}

// ─── Admin Dashboard & Security Types ──────────────────────────────────────────

export type AdminAuditAction = 
  | 'BOOKING_CANCELLED'
  | 'BOOKING_STATUS_UPDATED'
  | 'EMAIL_RESENT'
  | 'REVIEW_DELETED'
  | 'DATA_EXPORTED'
  | 'DESTINATION_CREATED'
  | 'DESTINATION_DELETED'
  | 'USER_ROLE_UPDATED'
  | 'DATABASE_RESET';

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: AdminAuditAction;
  targetType: 'booking' | 'user' | 'review' | 'destination' | 'report' | 'email' | 'system';
  targetId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface AdminAnalyticsSummary {
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalRides: number;
  totalReviews: number;
  averageBookingValue: number;
  cancellationRatePct: number;
  revenueByService: Record<string, number>;
  bookingsByService: Record<string, number>;
  popularDestinations: { id: string; name: string; bookingsCount: number; revenue: number }[];
  recentBookings: Booking[];
  recentRides: ExplorerRide[];
  emailStats: { sent: number; failed: number; pending: number };

  // Structured KPI analytics used in Overview Dashboard
  revenue?: {
    grossRevenue: number;
    netRevenue: number;
    totalRefunded: number;
  };
  bookings?: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  users?: {
    totalUsers: number;
    activeUsers30d: number;
    registeredProfiles: number;
  };
  emailDelivery?: {
    sent: number;
    pending: number;
    failed: number;
    successRate: number;
  };
  byService?: Array<{ serviceType: string; count: number; revenue: number }>;
  topDestinations?: Array<{ destination: string; bookingCount: number; totalRevenue: number }>;
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  joinedDate: string;
  walletBalance: number;
  bookingsCount: number;
  ridesCount: number;
  totalSpent: number;
  lastActive?: string;
}

export interface AdminUserDetail {
  user: UserProfile;
  bookings: Booking[];
  rides: ExplorerRide[];
  totalSpent: number;
  tripCount: number;
}

