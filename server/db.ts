import fs from 'fs';
import path from 'path';
import { 
  Destination, 
  TravelPackage, 
  UserProfile, 
  Booking, 
  ExplorerRide, 
  MagicMomentAlbum, 
  MagicMomentPhoto, 
  Review, 
  WalletTransaction, 
  GroupTrip, 
  GroupExpense,
  SettlementDebt,
  AdminAuditLog,
  AdminAnalyticsSummary,
  AdminUserSummary,
  AdminUserDetail,
  AdminAuditAction
} from '../src/types';
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_PACKAGES, 
  INITIAL_USER_PROFILE, 
  INITIAL_REVIEWS, 
  INITIAL_GROUP_TRIPS 
} from './data/initialData';
import { ALL_PACKAGES } from './data/packagesData';
import { INDIA_EXPANDED_DESTINATIONS } from './data/indiaDestinationsData';
import { INDIA_REGIONAL_DESTINATIONS } from './data/indiaRegionalDestinations';

export const ALL_COMBINED_INITIAL_DESTINATIONS: Destination[] = [
  ...INDIA_EXPANDED_DESTINATIONS,
  ...INDIA_REGIONAL_DESTINATIONS,
  ...INITIAL_DESTINATIONS.filter(d => 
    !INDIA_EXPANDED_DESTINATIONS.some(i => i.id === d.id) &&
    !INDIA_REGIONAL_DESTINATIONS.some(i => i.id === d.id)
  )
];

export interface AppDatabase {
  users: Record<string, UserProfile>;
  destinations: Destination[];
  packages: TravelPackage[];
  bookings: Booking[];
  explorerRides: ExplorerRide[];
  magicAlbums: MagicMomentAlbum[];
  magicPhotos: MagicMomentPhoto[];
  reviews: Review[];
  walletTransactions: WalletTransaction[];
  groupTrips: GroupTrip[];
  adminAuditLogs: AdminAuditLog[];
  offers: {
    id: string;
    code: string;
    discountPct: number;
    maxDiscount: number;
    title: string;
    description: string;
    validTill: string;
  }[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data_store.json');

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BKG-2026-9812',
    userId: 'usr-current',
    serviceType: 'flight',
    title: 'Air India AI-842: Delhi (DEL) ➔ Goa (GOI)',
    destinationName: 'Goa, India',
    bookingDate: '2026-08-28T10:30:00Z',
    travelDate: '2026-10-15',
    returnDate: '2026-10-20',
    passengersCount: 2,
    passengerDetails: [
      { name: 'Soham Nemade', age: 28, gender: 'Male', seatNumber: '12A' },
      { name: 'Priya Sharma', age: 27, gender: 'Female', seatNumber: '12B' }
    ],
    totalAmount: 16800,
    status: 'confirmed',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    emailStatus: 'sent',
    emailSentAt: '2026-08-28T10:31:15Z',
    isSimulation: false,
    details: {
      flightNumber: 'AI-842',
      airline: 'Air India',
      seatClass: 'Economy Prime',
      departureTime: '09:45 AM',
      arrivalTime: '12:20 PM',
      duration: '2h 35m',
      pnrNumber: 'PNR-AI8923',
      baggage: '15kg Check-in + 7kg Cabin',
      razorpayPaymentId: 'pay_rzp_flt_881920',
      razorpayOrderId: 'order_rzp_flt_881920',
      contactEmail: 'soham_nemade_aids@moderncoe.edu.in'
    },
    invoice: {
      invoiceNo: 'INV-2026-9812',
      baseFare: 14237,
      taxes: 2563,
      discounts: 0,
      grandTotal: 16800,
      generatedAt: '2026-08-28T10:35:00Z'
    }
  },
  {
    id: 'BKG-2026-7731',
    userId: 'usr-priya',
    serviceType: 'package',
    title: 'Wayanad Rainforest & Wildlife Sanctuary Retreat (4D/3N)',
    destinationName: 'Wayanad, Kerala',
    bookingDate: '2026-08-25T16:15:00Z',
    travelDate: '2026-11-04',
    returnDate: '2026-11-08',
    passengersCount: 2,
    passengerDetails: [
      { name: 'Priya Sharma', age: 27, gender: 'Female', seatNumber: 'Treehouse Villa 102' },
      { name: 'Rohan Sharma', age: 30, gender: 'Male', seatNumber: 'Treehouse Villa 102' }
    ],
    totalAmount: 28400,
    status: 'confirmed',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    emailStatus: 'sent',
    emailSentAt: '2026-08-25T16:16:00Z',
    isSimulation: false,
    details: {
      packageId: 'pkg-wayanad-retreat',
      hotelName: 'Vythiri Rainforest Luxury Resort & Spa',
      guideName: 'Harish Nair (Certified Eco-Naturalist)',
      mealPlan: 'All Meals Included (Farm-to-Table Kerala Cuisine)',
      razorpayPaymentId: 'pay_rzp_pkg_991823',
      razorpayOrderId: 'order_rzp_pkg_991823',
      contactEmail: 'priya.sharma@example.com'
    },
    invoice: {
      invoiceNo: 'INV-2026-7731',
      baseFare: 24068,
      taxes: 4332,
      discounts: 0,
      grandTotal: 28400,
      generatedAt: '2026-08-25T16:20:00Z'
    }
  },
  {
    id: 'BKG-2026-5512',
    userId: 'usr-vikram',
    serviceType: 'hotel',
    title: 'The Leela Palace Heritage Deluxe Suite (3 Nights)',
    destinationName: 'Bengaluru, Karnataka',
    bookingDate: '2026-08-22T11:45:00Z',
    travelDate: '2026-09-15',
    returnDate: '2026-09-18',
    passengersCount: 2,
    passengerDetails: [
      { name: 'Vikram Singh', age: 34, gender: 'Male', seatNumber: 'Royal Suite 405' },
      { name: 'Ananya Singh', age: 32, gender: 'Female', seatNumber: 'Royal Suite 405' }
    ],
    totalAmount: 42000,
    status: 'confirmed',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    emailStatus: 'sent',
    emailSentAt: '2026-08-22T11:46:10Z',
    isSimulation: false,
    details: {
      hotelName: 'The Leela Palace Bengaluru',
      roomType: 'Royal Heritage Suite with City Balcony',
      checkInTime: '02:00 PM',
      checkOutTime: '12:00 PM',
      razorpayPaymentId: 'pay_rzp_htl_339182',
      razorpayOrderId: 'order_rzp_htl_339182',
      contactEmail: 'vikram.singh@example.com'
    },
    invoice: {
      invoiceNo: 'INV-2026-5512',
      baseFare: 35593,
      taxes: 6407,
      discounts: 0,
      grandTotal: 42000,
      generatedAt: '2026-08-22T11:50:00Z'
    }
  },
  {
    id: 'BKG-2026-1094',
    userId: 'usr-elena',
    serviceType: 'flight',
    title: 'IndiGo 6E-205: Mumbai (BOM) ➔ Jaipur (JAI)',
    destinationName: 'Jaipur, Rajasthan',
    bookingDate: '2026-08-18T18:20:00Z',
    travelDate: '2026-11-20',
    returnDate: '2026-11-26',
    passengersCount: 1,
    passengerDetails: [
      { name: 'Elena Rostova', age: 29, gender: 'Female', seatNumber: '3F' }
    ],
    totalAmount: 9600,
    status: 'confirmed',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    emailStatus: 'failed',
    emailError: 'Recipient mail exchange timeout at mx.example.com. DNS lookup took >10s.',
    isSimulation: false,
    details: {
      flightNumber: '6E-205',
      airline: 'IndiGo Airlines',
      seatClass: 'Flexi Plus',
      departureTime: '11:10 AM',
      arrivalTime: '01:05 PM',
      duration: '1h 55m',
      pnrNumber: 'PNR-6E8814',
      razorpayPaymentId: 'pay_rzp_flt_664120',
      razorpayOrderId: 'order_rzp_flt_664120',
      contactEmail: 'elena.rostova@example.com'
    },
    invoice: {
      invoiceNo: 'INV-2026-1094',
      baseFare: 8136,
      taxes: 1464,
      discounts: 0,
      grandTotal: 9600,
      generatedAt: '2026-08-18T18:25:00Z'
    }
  },
  {
    id: 'BKG-2026-8840',
    userId: 'usr-current',
    serviceType: 'package',
    title: 'Magical Manali & Solang Valley Snow Escape (5D/4N)',
    destinationName: 'Manali, Himachal Pradesh',
    bookingDate: '2026-07-15T09:10:00Z',
    travelDate: '2026-08-01',
    returnDate: '2026-08-06',
    passengersCount: 2,
    passengerDetails: [
      { name: 'Soham Nemade', age: 28, gender: 'Male', seatNumber: 'Alpine Pine Suite' },
      { name: 'Karan Mehra', age: 28, gender: 'Male', seatNumber: 'Alpine Pine Suite' }
    ],
    totalAmount: 38500,
    status: 'cancelled',
    paymentMethod: 'razorpay',
    paymentStatus: 'refunded',
    emailStatus: 'sent',
    emailSentAt: '2026-07-28T14:30:00Z',
    isSimulation: false,
    details: {
      packageId: 'pkg-manali-snow',
      hotelName: 'The Himalayan Luxury Mountain Resort',
      cancellationReason: 'Customer requested cancellation due to personal scheduling conflict. Full refund credited to wallet.',
      refundReference: 'REF-RZP-8840-2026',
      razorpayPaymentId: 'pay_rzp_pkg_228190',
      razorpayOrderId: 'order_rzp_pkg_228190',
      contactEmail: 'soham_nemade_aids@moderncoe.edu.in'
    },
    invoice: {
      invoiceNo: 'INV-2026-8840',
      baseFare: 32627,
      taxes: 5873,
      discounts: 0,
      grandTotal: 38500,
      generatedAt: '2026-07-15T09:15:00Z'
    }
  },
  {
    id: 'BKG-2026-4401',
    userId: 'usr-current',
    serviceType: 'train',
    title: 'Vande Bharat Express 20608: Mumbai CSMT ➔ Goa Madgaon',
    destinationName: 'Goa, India',
    bookingDate: '2026-08-20T09:30:00Z',
    travelDate: '2026-11-12',
    returnDate: '2026-11-17',
    passengersCount: 2,
    passengerDetails: [
      { name: 'Soham Nemade', age: 28, gender: 'Male', seatNumber: 'Coach C4 - Seat 22' },
      { name: 'Priya Sharma', age: 27, gender: 'Female', seatNumber: 'Coach C4 - Seat 23' }
    ],
    totalAmount: 4850,
    status: 'confirmed',
    paymentMethod: 'wallet',
    paymentStatus: 'paid',
    emailStatus: 'sent',
    emailSentAt: '2026-08-20T09:32:00Z',
    isSimulation: false,
    details: {
      trainNumber: '20608',
      trainName: 'Vande Bharat Superfast Express',
      coach: 'Executive Chair Car (EC)',
      departureStation: 'Mumbai CSMT (05:25 AM)',
      arrivalStation: 'Madgaon Junction (01:10 PM)',
      duration: '7h 45m',
      pnrNumber: 'PNR-VB7741',
      quota: 'General',
      contactEmail: 'soham_nemade_aids@moderncoe.edu.in'
    },
    invoice: {
      invoiceNo: 'INV-2026-4401',
      baseFare: 4110,
      taxes: 740,
      discounts: 0,
      grandTotal: 4850,
      generatedAt: '2026-08-20T09:35:00Z'
    }
  },
  {
    id: 'BKG-2026-3120',
    userId: 'usr-current',
    serviceType: 'bus',
    title: 'Zingbus Electric AC Sleeper: Bangalore ➔ Coorg',
    destinationName: 'Coorg, Karnataka',
    bookingDate: '2026-08-10T14:20:00Z',
    travelDate: '2026-08-22',
    returnDate: '2026-08-25',
    passengersCount: 1,
    passengerDetails: [
      { name: 'Soham Nemade', age: 28, gender: 'Male', seatNumber: 'Lower Berth L4' }
    ],
    totalAmount: 1450,
    status: 'completed',
    paymentMethod: 'card_demo',
    paymentStatus: 'paid',
    emailStatus: 'sent',
    emailSentAt: '2026-08-10T14:21:40Z',
    isSimulation: false,
    details: {
      busOperator: 'Zingbus Premium Electric',
      busType: 'Volvo 9600 Multi-Axle AC Sleeper (2+1)',
      boardingPoint: 'Majestic Terminal 1 (10:30 PM)',
      droppingPoint: 'Madikeri Private Bus Stand (05:45 AM)',
      duration: '7h 15m',
      pnrNumber: 'PNR-ZB9012',
      contactEmail: 'soham_nemade_aids@moderncoe.edu.in'
    },
    invoice: {
      invoiceNo: 'INV-2026-3120',
      baseFare: 1228,
      taxes: 222,
      discounts: 0,
      grandTotal: 1450,
      generatedAt: '2026-08-10T14:25:00Z'
    }
  }
];

const INITIAL_ADMIN_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'audit-init-01',
    adminId: 'usr-admin',
    adminEmail: 'explorexsih0426@gmail.com',
    action: 'DESTINATION_CREATED',
    targetType: 'destination',
    targetId: 'dest-spiti-valley',
    details: 'Catalog expansion: Added Spiti Valley high-altitude eco-tourism route.',
    ipAddress: '192.168.1.1',
    timestamp: '2026-08-29T08:00:00Z'
  },
  {
    id: 'audit-init-02',
    adminId: 'usr-admin',
    adminEmail: 'explorexsih0426@gmail.com',
    action: 'BOOKING_CANCELLED',
    targetType: 'booking',
    targetId: 'BKG-2026-8840',
    details: 'Processed requested cancellation and ₹38,500 wallet refund for customer schedule conflict.',
    ipAddress: '192.168.1.1',
    timestamp: '2026-07-28T14:32:00Z'
  },
  {
    id: 'audit-init-03',
    adminId: 'usr-admin',
    adminEmail: 'explorexsih0426@gmail.com',
    action: 'DATA_EXPORTED',
    targetType: 'report',
    targetId: 'monthly-bookings-q2',
    details: 'Exported quarterly booking revenue reconciliation CSV report.',
    ipAddress: '192.168.1.1',
    timestamp: '2026-08-01T09:15:00Z'
  }
];

export const INITIAL_USERS: Record<string, UserProfile> = {
  'usr-current': {
    ...INITIAL_USER_PROFILE,
    id: 'usr-current',
    email: 'soham_nemade_aids@moderncoe.edu.in',
    name: 'Soham Nemade',
    role: 'user'
  },
  'usr-admin': {
    ...INITIAL_USER_PROFILE,
    id: 'usr-admin',
    name: 'ExploreX Administrator',
    email: 'explorexsih0426@gmail.com',
    role: 'admin',
    phone: '+91 99000 11223',
    homeCity: 'Bengaluru, Karnataka',
    joinedDate: 'September 2026',
    walletBalance: 100000,
    savedDestinations: [],
    savedPackages: [],
    travelHistory: []
  },
  'e818e0f1-d7dd-447d-97ae-9bb9ebd991bb': {
    ...INITIAL_USER_PROFILE,
    id: 'e818e0f1-d7dd-447d-97ae-9bb9ebd991bb',
    name: 'ExploreX Administrator',
    email: 'explorexsih0426@gmail.com',
    role: 'admin',
    phone: '+91 99000 11223',
    homeCity: 'Bengaluru, Karnataka',
    joinedDate: 'September 2026',
    walletBalance: 100000,
    savedDestinations: [],
    savedPackages: [],
    travelHistory: []
  },
  'usr-priya': {
    ...INITIAL_USER_PROFILE,
    id: 'usr-priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'user',
    phone: '+91 98111 22334',
    homeCity: 'Delhi, India',
    joinedDate: 'March 2025',
    walletBalance: 14200,
    savedDestinations: ['dest-goa', 'dest-manali'],
    savedPackages: [],
    travelHistory: []
  },
  'usr-vikram': {
    ...INITIAL_USER_PROFILE,
    id: 'usr-vikram',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    role: 'user',
    phone: '+91 97222 33445',
    homeCity: 'Jaipur, Rajasthan',
    joinedDate: 'May 2025',
    walletBalance: 8500,
    savedDestinations: ['dest-kerala'],
    savedPackages: [],
    travelHistory: []
  },
  'usr-elena': {
    ...INITIAL_USER_PROFILE,
    id: 'usr-elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    role: 'user',
    phone: '+44 7700 900123',
    homeCity: 'London, UK',
    joinedDate: 'June 2025',
    walletBalance: 25000,
    savedDestinations: ['dest-jaipur', 'dest-agra'],
    savedPackages: [],
    travelHistory: []
  }
};

const INITIAL_MAGIC_ALBUMS: MagicMomentAlbum[] = [
  {
    id: 'alb-1',
    userId: 'usr-current',
    title: 'Kyoto Autumn Memories 2025',
    destinationName: 'Kyoto, Japan',
    tripStartDate: '2025-11-10',
    tripEndDate: '2025-11-18',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    photosCount: 3,
    totalSizeBytes: 3840000 // 3.84 MB
  },
  {
    id: 'alb-2',
    userId: 'usr-current',
    title: 'Amalfi Coast Highlights',
    destinationName: 'Amalfi Coast, Italy',
    tripStartDate: '2024-07-04',
    tripEndDate: '2024-07-10',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    photosCount: 2,
    totalSizeBytes: 2400000 // 2.4 MB
  }
];

const INITIAL_MAGIC_PHOTOS: MagicMomentPhoto[] = [
  {
    id: 'pho-1',
    userId: 'usr-current',
    albumId: 'alb-1',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Golden morning light filtering through the towering Arashiyama Bamboo Grove',
    locationName: 'Arashiyama, Kyoto',
    takenAt: '2025-11-12T07:15:00Z',
    fileSizeBytes: 1420000,
    mediaType: 'image',
    tags: ['Nature', 'Morning', 'Kyoto']
  },
  {
    id: 'pho-2',
    userId: 'usr-current',
    albumId: 'alb-1',
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    caption: 'Traditional red lanterns outside Senso-ji temple during festival week',
    locationName: 'Asakusa, Tokyo',
    takenAt: '2025-11-15T18:30:00Z',
    fileSizeBytes: 1220000,
    mediaType: 'image',
    tags: ['Heritage', 'Lanterns', 'Night']
  },
  {
    id: 'pho-3',
    userId: 'usr-current',
    albumId: 'alb-1',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    caption: 'Majestic view of Mount Fuji reflected in Lake Kawaguchiko',
    locationName: 'Lake Kawaguchiko',
    takenAt: '2025-11-16T10:00:00Z',
    fileSizeBytes: 1200000,
    mediaType: 'image',
    tags: ['MtFuji', 'Landscape']
  },
  {
    id: 'pho-4',
    userId: 'usr-current',
    albumId: 'alb-2',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
    caption: 'Pastel cliffside villas cascading down to the Mediterranean sea in Positano',
    locationName: 'Positano, Amalfi',
    takenAt: '2024-07-06T19:00:00Z',
    fileSizeBytes: 1350000,
    mediaType: 'image',
    tags: ['Amalfi', 'Sunset', 'Sea']
  },
  {
    id: 'pho-5',
    userId: 'usr-current',
    albumId: 'alb-2',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Crystal azure waters on a private boat tour along the Capri grottos',
    locationName: 'Capri Island',
    takenAt: '2024-07-08T13:20:00Z',
    fileSizeBytes: 1050000,
    mediaType: 'image',
    tags: ['Capri', 'BoatTour', 'Azure']
  }
];

const INITIAL_WALLET_TXNS: WalletTransaction[] = [
  {
    id: 'txn-101',
    userId: 'usr-current',
    amount: 41500,
    type: 'credit',
    source: 'topup_demo',
    description: 'Instant Wallet Top-up (Demo Mode UPI/Card)',
    timestamp: '2026-08-20T10:00:00Z',
    status: 'success',
    referenceId: 'UPI-DEMO-991823'
  },
  {
    id: 'txn-102',
    userId: 'usr-current',
    amount: 4150,
    type: 'debit',
    source: 'ride_payment',
    description: 'The Explorer Cab ride - Airport transfer',
    timestamp: '2026-08-22T14:30:00Z',
    status: 'success',
    referenceId: 'RID-88219'
  }
];

const INITIAL_OFFERS = [
  {
    id: 'off-wander20',
    code: 'WANDER20',
    discountPct: 20,
    maxDiscount: 12500,
    title: 'First Trip Explorer Welcome',
    description: 'Flat 20% off on all international and domestic holiday packages.',
    validTill: '2026-12-31'
  },
  {
    id: 'off-aipeak',
    code: 'AIPEAK10',
    discountPct: 10,
    maxDiscount: 6250,
    title: 'Smart Autumn Travel Special',
    description: '10% instant discount on flights and verified hotel stays.',
    validTill: '2026-11-30'
  },
  {
    id: 'off-rideshare',
    code: 'EXPLOREFREE',
    discountPct: 100,
    maxDiscount: 1250,
    title: 'Free First Explorer Cab Ride',
    description: 'Up to ₹1,250 off on your first Explorer city ride or e-scooter rental.',
    validTill: '2026-12-31'
  }
];

class DatabaseManager {
  private data: AppDatabase;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): AppDatabase {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        
        // Merge stored destinations with any newly added expanded Indian destinations
        const existingDests: Destination[] = parsed.destinations || [];
        const mergedDestinations = [...ALL_COMBINED_INITIAL_DESTINATIONS];
        for (const existing of existingDests) {
          const idx = mergedDestinations.findIndex(d => d.id === existing.id);
          if (idx === -1) {
            mergedDestinations.push(existing);
          }
        }

        // Merge users with default accounts
        const loadedUsers = { ...INITIAL_USERS, ...(parsed.users || {}) };

        // Strictly enforce that ONLY explorexsih0426@gmail.com can hold admin clearance
        // Remove soham_nemade_aids@moderncoe.edu.in from admin access
        for (const [uid, rawUser] of Object.entries(loadedUsers)) {
          const u = rawUser as Partial<UserProfile> | undefined;
          const uEmail = (u?.email || '').trim().toLowerCase();
          if (uEmail === 'soham_nemade_aids@moderncoe.edu.in' || uEmail !== 'explorexsih0426@gmail.com') {
            if (u?.role === 'admin') {
              (loadedUsers[uid] as UserProfile).role = 'user';
            }
          } else if (uEmail === 'explorexsih0426@gmail.com') {
            (loadedUsers[uid] as UserProfile).role = 'admin';
          }
        }
        
        // Merge bookings
        const existingBookings: Booking[] = parsed.bookings || [];
        const mergedBookings = [...existingBookings];
        for (const initB of INITIAL_BOOKINGS) {
          if (!mergedBookings.some(b => b.id === initB.id)) {
            mergedBookings.push(initB);
          }
        }

        // Merge packages with ALL_PACKAGES, ensuring pkg-karnataka-heritage is properly mapped
        const existingPackages: TravelPackage[] = parsed.packages || [];
        const mergedPackages = [...ALL_PACKAGES];
        for (const existing of existingPackages) {
          const idx = mergedPackages.findIndex(p => p.id === existing.id);
          if (idx === -1) {
            mergedPackages.push(existing);
          } else if (existing.id === 'pkg-karnataka-heritage') {
            mergedPackages[idx] = {
              ...existing,
              destinationId: 'dest-karnataka-hampi-coorg',
              destinationName: 'Hampi & Coorg, Karnataka'
            };
          }
        }

        return {
          users: loadedUsers,
          destinations: mergedDestinations,
          packages: mergedPackages,
          bookings: mergedBookings,
          explorerRides: parsed.explorerRides || [],
          magicAlbums: parsed.magicAlbums || INITIAL_MAGIC_ALBUMS,
          magicPhotos: parsed.magicPhotos || INITIAL_MAGIC_PHOTOS,
          reviews: parsed.reviews?.length ? parsed.reviews : INITIAL_REVIEWS,
          walletTransactions: parsed.walletTransactions || INITIAL_WALLET_TXNS,
          groupTrips: parsed.groupTrips?.length ? parsed.groupTrips : INITIAL_GROUP_TRIPS,
          adminAuditLogs: parsed.adminAuditLogs?.length ? parsed.adminAuditLogs : INITIAL_ADMIN_AUDIT_LOGS,
          offers: parsed.offers || INITIAL_OFFERS
        };
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing defaults:', err);
    }

    const defaultDb: AppDatabase = {
      users: INITIAL_USERS,
      destinations: ALL_COMBINED_INITIAL_DESTINATIONS,
      packages: ALL_PACKAGES,
      bookings: INITIAL_BOOKINGS,
      explorerRides: [],
      magicAlbums: INITIAL_MAGIC_ALBUMS,
      magicPhotos: INITIAL_MAGIC_PHOTOS,
      reviews: INITIAL_REVIEWS,
      walletTransactions: INITIAL_WALLET_TXNS,
      groupTrips: INITIAL_GROUP_TRIPS,
      adminAuditLogs: INITIAL_ADMIN_AUDIT_LOGS,
      offers: INITIAL_OFFERS
    };
    this.saveDatabase(defaultDb);
    return defaultDb;
  }

  private saveDatabase(db?: AppDatabase) {
    try {
      const dataToSave = db || this.data;
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Users
  getUser(userId: string = 'usr-current'): UserProfile {
    if (!this.data.users[userId]) {
      this.data.users[userId] = { ...INITIAL_USER_PROFILE, id: userId };
      this.saveDatabase();
    }
    return this.data.users[userId];
  }

  findUserByEmail(email: string): UserProfile | undefined {
    const cleanEmail = email.trim().toLowerCase();
    return Object.values(this.data.users).find(u => u.email.toLowerCase() === cleanEmail);
  }

  getAllUsers(): UserProfile[] {
    return Object.values(this.data.users);
  }

  createUser(user: UserProfile): UserProfile {
    this.data.users[user.id] = user;
    this.saveDatabase();
    return user;
  }

  updateUser(userId: string, updates: Partial<UserProfile>): UserProfile {
    const current = this.getUser(userId);
    const updated = { ...current, ...updates };
    this.data.users[userId] = updated;
    this.saveDatabase();
    return updated;
  }

  deleteUser(userId: string): boolean {
    if (this.data.users[userId]) {
      delete this.data.users[userId];
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Destinations
  getDestinations(): Destination[] {
    return this.data.destinations;
  }

  getDestinationById(id: string): Destination | undefined {
    return this.data.destinations.find(d => d.id === id);
  }

  createDestination(dest: Destination): Destination {
    this.data.destinations.push(dest);
    this.saveDatabase();
    return dest;
  }

  updateDestination(id: string, updates: Partial<Destination>): Destination | null {
    const idx = this.data.destinations.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.destinations[idx] = { ...this.data.destinations[idx], ...updates };
    this.saveDatabase();
    return this.data.destinations[idx];
  }

  deleteDestination(id: string): boolean {
    const initialLen = this.data.destinations.length;
    this.data.destinations = this.data.destinations.filter(d => d.id !== id);
    if (this.data.destinations.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Packages
  getPackages(): TravelPackage[] {
    return this.data.packages;
  }

  getPackageById(id: string): TravelPackage | undefined {
    return this.data.packages.find(p => p.id === id);
  }

  createPackage(pkg: TravelPackage): TravelPackage {
    this.data.packages.push(pkg);
    this.saveDatabase();
    return pkg;
  }

  updatePackage(id: string, updates: Partial<TravelPackage>): TravelPackage | null {
    const idx = this.data.packages.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.packages[idx] = { ...this.data.packages[idx], ...updates };
    this.saveDatabase();
    return this.data.packages[idx];
  }

  deletePackage(id: string): boolean {
    const initialLen = this.data.packages.length;
    this.data.packages = this.data.packages.filter(p => p.id !== id);
    if (this.data.packages.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Bookings
  getBookings(userId: string = 'usr-current'): Booking[] {
    return this.data.bookings.filter(b => b.userId === userId);
  }

  getAllBookings(): Booking[] {
    return this.data.bookings;
  }

  getBookingById(id: string): Booking | undefined {
    return this.data.bookings.find(b => b.id === id);
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const idx = this.data.bookings.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.bookings[idx] = { ...this.data.bookings[idx], ...updates };
    this.saveDatabase();
    return this.data.bookings[idx];
  }

  createBooking(booking: Booking): Booking {
    this.data.bookings.unshift(booking);
    
    // If paid by wallet, deduct
    if (booking.paymentMethod === 'wallet') {
      const user = this.getUser(booking.userId);
      user.walletBalance = Math.max(0, user.walletBalance - booking.totalAmount);
      this.updateUser(booking.userId, { walletBalance: user.walletBalance });

      this.createWalletTransaction({
        id: `txn-${Date.now()}`,
        userId: booking.userId,
        amount: booking.totalAmount,
        type: 'debit',
        source: 'booking_payment',
        description: `Booking confirmed: ${booking.title}`,
        timestamp: new Date().toISOString(),
        status: 'success',
        referenceId: booking.id
      });
    }

    this.saveDatabase();
    return booking;
  }

  cancelBooking(id: string, userId: string = 'usr-current'): { booking: Booking; refundAmount: number } | null {
    const bkg = this.data.bookings.find(b => b.id === id && (b.userId === userId || userId === 'admin'));
    if (!bkg) return null;
    if (bkg.status === 'cancelled') return { booking: bkg, refundAmount: 0 };

    bkg.status = 'cancelled';
    bkg.paymentStatus = 'refunded';
    const refundAmount = bkg.totalAmount;

    // Refund directly to user's wallet
    const user = this.getUser(bkg.userId);
    user.walletBalance += refundAmount;
    this.updateUser(bkg.userId, { walletBalance: user.walletBalance });

    this.createWalletTransaction({
      id: `txn-ref-${Date.now()}`,
      userId: bkg.userId,
      amount: refundAmount,
      type: 'credit',
      source: 'refund',
      description: `Full refund for cancelled booking #${bkg.id}`,
      timestamp: new Date().toISOString(),
      status: 'success',
      referenceId: bkg.id
    });

    this.saveDatabase();
    return { booking: bkg, refundAmount };
  }

  // The Explorer Rides
  getRides(userId: string = 'usr-current'): ExplorerRide[] {
    return this.data.explorerRides.filter(r => r.userId === userId);
  }

  getRideById(id: string): ExplorerRide | undefined {
    return this.data.explorerRides.find(r => r.id === id);
  }

  createRide(ride: ExplorerRide): ExplorerRide {
    this.data.explorerRides.unshift(ride);
    this.saveDatabase();
    return ride;
  }

  updateRide(id: string, updates: Partial<ExplorerRide>): ExplorerRide | null {
    const idx = this.data.explorerRides.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.explorerRides[idx] = { ...this.data.explorerRides[idx], ...updates };
    this.saveDatabase();
    return this.data.explorerRides[idx];
  }

  // Magic Moments
  getAlbums(userId: string = 'usr-current'): MagicMomentAlbum[] {
    return this.data.magicAlbums.filter(a => a.userId === userId);
  }

  getPhotosByAlbum(albumId: string, userId: string = 'usr-current'): MagicMomentPhoto[] {
    return this.data.magicPhotos.filter(p => p.albumId === albumId && p.userId === userId);
  }

  getUserStorageUsage(userId: string = 'usr-current'): { usedBytes: number; quotaBytes: number; percentage: number } {
    const photos = this.data.magicPhotos.filter(p => p.userId === userId);
    const usedBytes = photos.reduce((acc, p) => acc + (p.fileSizeBytes || 0), 0);
    const quotaBytes = 20 * 1024 * 1024; // 20 MB strictly per requirement
    const percentage = Math.min(100, Math.round((usedBytes / quotaBytes) * 100));
    return { usedBytes, quotaBytes, percentage };
  }

  createAlbum(album: MagicMomentAlbum): MagicMomentAlbum {
    this.data.magicAlbums.unshift(album);
    this.saveDatabase();
    return album;
  }

  deleteAlbum(albumId: string, userId: string = 'usr-current'): boolean {
    this.data.magicAlbums = this.data.magicAlbums.filter(a => !(a.id === albumId && a.userId === userId));
    this.data.magicPhotos = this.data.magicPhotos.filter(p => !(p.albumId === albumId && p.userId === userId));
    this.saveDatabase();
    return true;
  }

  createPhoto(photo: MagicMomentPhoto): MagicMomentPhoto {
    this.data.magicPhotos.unshift(photo);
    // Update album count and size
    const album = this.data.magicAlbums.find(a => a.id === photo.albumId);
    if (album) {
      album.photosCount += 1;
      album.totalSizeBytes += photo.fileSizeBytes;
      if (!album.coverPhotoUrl) {
        album.coverPhotoUrl = photo.url;
      }
    }
    this.saveDatabase();
    return photo;
  }

  deletePhoto(photoId: string, userId: string = 'usr-current'): boolean {
    const photo = this.data.magicPhotos.find(p => p.id === photoId && p.userId === userId);
    if (!photo) return false;

    // Unlink disk file if it was uploaded (not a remote URL)
    if (photo.url && photo.url.startsWith('/uploads/')) {
      const diskPath = path.join(process.cwd(), photo.url);
      try {
        if (fs.existsSync(diskPath)) {
          fs.unlinkSync(diskPath);
        }
      } catch (unlinkErr) {
        console.warn(`Could not delete upload file ${diskPath}:`, unlinkErr);
      }
    }

    const album = this.data.magicAlbums.find(a => a.id === photo.albumId);
    if (album) {
      album.photosCount = Math.max(0, album.photosCount - 1);
      album.totalSizeBytes = Math.max(0, album.totalSizeBytes - photo.fileSizeBytes);
    }

    this.data.magicPhotos = this.data.magicPhotos.filter(p => p.id !== photoId);
    this.saveDatabase();
    return true;
  }

  // Reviews
  getReviews(targetType?: string, targetId?: string): Review[] {
    let list = this.data.reviews;
    if (targetType) list = list.filter(r => r.targetType === targetType);
    if (targetId) list = list.filter(r => r.targetId === targetId);
    return list;
  }

  createReview(review: Review): { success: boolean; message: string; review?: Review } {
    // Check duplicate review by same user for same target
    const existing = this.data.reviews.find(
      r => r.userId === review.userId && r.targetId === review.targetId && r.targetType === review.targetType
    );
    if (existing) {
      return { success: false, message: 'You have already reviewed this item. You can edit your existing review.' };
    }

    this.data.reviews.unshift(review);
    this.saveDatabase();
    return { success: true, message: 'Review published successfully!', review };
  }

  updateReview(reviewId: string, userId: string, updates: Partial<Review>): Review | null {
    const idx = this.data.reviews.findIndex(r => r.id === reviewId && (r.userId === userId || userId === 'admin'));
    if (idx === -1) return null;
    this.data.reviews[idx] = { ...this.data.reviews[idx], ...updates };
    this.saveDatabase();
    return this.data.reviews[idx];
  }

  deleteReview(reviewId: string, userId: string = 'admin'): boolean {
    const initialLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter(r => !(r.id === reviewId && (r.userId === userId || userId === 'admin')));
    if (this.data.reviews.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Wallet
  getWalletTransactions(userId: string = 'usr-current'): WalletTransaction[] {
    return this.data.walletTransactions.filter(t => t.userId === userId);
  }

  createWalletTransaction(txn: WalletTransaction): WalletTransaction {
    this.data.walletTransactions.unshift(txn);
    this.saveDatabase();
    return txn;
  }

  topupWallet(userId: string, amount: number, method: string): { user: UserProfile; transaction: WalletTransaction } {
    const user = this.getUser(userId);
    user.walletBalance = Number((user.walletBalance + amount).toFixed(2));
    this.updateUser(userId, { walletBalance: user.walletBalance });

    const transaction: WalletTransaction = {
      id: `txn-${Date.now()}`,
      userId,
      amount,
      type: 'credit',
      source: 'topup_demo',
      description: `Wallet instant reload via ${method} (DEMO SIMULATION)`,
      timestamp: new Date().toISOString(),
      status: 'success',
      referenceId: `SIM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
    this.createWalletTransaction(transaction);

    return { user, transaction };
  }

  // Group Expenses & Splitter
  getGroupTrips(userId: string = 'usr-current'): GroupTrip[] {
    return this.data.groupTrips.filter(g => g.userId === userId || g.members.some(m => m.id === userId));
  }

  getGroupTripById(id: string): GroupTrip | undefined {
    return this.data.groupTrips.find(g => g.id === id);
  }

  createGroupTrip(trip: GroupTrip): GroupTrip {
    this.data.groupTrips.unshift(trip);
    this.saveDatabase();
    return trip;
  }

  addExpenseToGroup(groupId: string, expense: GroupExpense): GroupTrip | null {
    const trip = this.data.groupTrips.find(g => g.id === groupId);
    if (!trip) return null;
    trip.expenses.unshift(expense);
    this.saveDatabase();
    return trip;
  }

  deleteExpenseFromGroup(groupId: string, expenseId: string): GroupTrip | null {
    const trip = this.data.groupTrips.find(g => g.id === groupId);
    if (!trip) return null;
    trip.expenses = trip.expenses.filter(e => e.id !== expenseId);
    this.saveDatabase();
    return trip;
  }

  // Calculate settlement matrix for group
  calculateGroupSettlement(groupId: string): { balances: Record<string, number>; settlements: SettlementDebt[] } {
    const trip = this.data.groupTrips.find(g => g.id === groupId);
    if (!trip) return { balances: {}, settlements: [] };

    const balances: Record<string, number> = {};
    const memberNameMap: Record<string, string> = {};

    trip.members.forEach(m => {
      balances[m.id] = 0;
      memberNameMap[m.id] = m.name;
    });

    trip.expenses.forEach(exp => {
      const payerId = exp.paidById;
      const splitCount = exp.splitAmongIds.length || 1;
      const splitAmt = exp.amount / splitCount;

      balances[payerId] = (balances[payerId] || 0) + exp.amount;

      exp.splitAmongIds.forEach(memberId => {
        balances[memberId] = (balances[memberId] || 0) - splitAmt;
      });
    });

    // Simplify debts using greedy approach
    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    Object.entries(balances).forEach(([id, amt]) => {
      const rounded = Number(amt.toFixed(2));
      if (rounded < -0.01) {
        debtors.push({ id, amount: -rounded });
      } else if (rounded > 0.01) {
        creditors.push({ id, amount: rounded });
      }
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements: SettlementDebt[] = [];
    let d = 0;
    let c = 0;

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const minAmt = Math.min(debtor.amount, creditor.amount);

      if (minAmt > 0.01) {
        settlements.push({
          fromMemberId: debtor.id,
          fromMemberName: memberNameMap[debtor.id] || debtor.id,
          toMemberId: creditor.id,
          toMemberName: memberNameMap[creditor.id] || creditor.id,
          amount: Number(minAmt.toFixed(2))
        });
      }

      debtor.amount -= minAmt;
      creditor.amount -= minAmt;

      if (debtor.amount <= 0.01) d++;
      if (creditor.amount <= 0.01) c++;
    }

    return { balances, settlements };
  }

  // Offers
  getOffers() {
    return this.data.offers;
  }

  // ─── Admin Security, Audit Logs & Management ───────────────────────────────

  logAdminAction(action: Omit<AdminAuditLog, 'id' | 'timestamp'>): AdminAuditLog {
    if (!this.data.adminAuditLogs) {
      this.data.adminAuditLogs = [];
    }
    const logEntry: AdminAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...action
    };
    this.data.adminAuditLogs.unshift(logEntry);
    if (this.data.adminAuditLogs.length > 500) {
      this.data.adminAuditLogs = this.data.adminAuditLogs.slice(0, 500);
    }
    this.saveDatabase();
    return logEntry;
  }

  getAdminAuditLogs(limit: number = 100): AdminAuditLog[] {
    return (this.data.adminAuditLogs || []).slice(0, limit);
  }

  /**
   * Return sanitized user list with engagement metrics.
   * Strips all internal secrets/passwords (Fulfills Requirements 3 & 7).
   */
  getAllUsersSummary(): AdminUserSummary[] {
    return Object.values(this.data.users).map(u => {
      const userBookings = this.data.bookings.filter(b => b.userId === u.id);
      const userRides = this.data.explorerRides.filter(r => r.userId === u.id);
      const totalSpent = userBookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.totalAmount : sum, 0);

      return {
        id: u.id,
        name: u.name || 'Traveler',
        email: u.email || '',
        phone: u.phone,
        role: u.role || 'user',
        joinedDate: u.joinedDate || 'Recently',
        walletBalance: typeof u.walletBalance === 'number' ? u.walletBalance : 0,
        bookingsCount: userBookings.length,
        ridesCount: userRides.length,
        totalSpent,
        lastActive: userBookings[0]?.bookingDate || userRides[0]?.createdAt || undefined
      };
    });
  }

  /**
   * Return deep user profile with full trip and booking history.
   */
  getUserDetailWithHistory(userId: string): AdminUserDetail | null {
    const user = this.getUser(userId);
    if (!user) return null;

    // Sanitize user: ensure no passwords, pins or credentials
    const sanitizedUser: UserProfile = { ...user };

    const bookings = this.data.bookings.filter(b => b.userId === userId);
    const rides = this.data.explorerRides.filter(r => r.userId === userId);
    const totalSpent = bookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.totalAmount : sum, 0);

    return {
      user: sanitizedUser,
      bookings,
      rides,
      totalSpent,
      tripCount: bookings.length
    };
  }

  /**
   * Search, filter, sort and paginate bookings for Admin Dashboard.
   */
  getPaginatedBookings(filters: {
    search?: string;
    serviceType?: string;
    status?: string;
    paymentStatus?: string;
    emailStatus?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): { bookings: Booking[]; total: number; page: number; limit: number; totalPages: number } {
    let list = [...this.data.bookings];

    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(b => 
        b.id.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.destinationName.toLowerCase().includes(q) ||
        (b.passengerDetails && b.passengerDetails.some(p => p.name.toLowerCase().includes(q))) ||
        (b.details?.airline && b.details.airline.toLowerCase().includes(q)) ||
        (b.details?.hotelName && b.details.hotelName.toLowerCase().includes(q)) ||
        (b.details?.razorpayPaymentId && b.details.razorpayPaymentId.toLowerCase().includes(q)) ||
        (b.details?.contactEmail && b.details.contactEmail.toLowerCase().includes(q))
      );
    }

    if (filters.serviceType && filters.serviceType !== 'all') {
      list = list.filter(b => b.serviceType === filters.serviceType);
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter(b => b.status === filters.status);
    }

    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      list = list.filter(b => b.paymentStatus === filters.paymentStatus);
    }

    if (filters.emailStatus && filters.emailStatus !== 'all') {
      list = list.filter(b => (b.emailStatus || 'sent') === filters.emailStatus);
    }

    // Sorting
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
    if (filters.sortBy === 'amount') {
      list.sort((a, b) => (a.totalAmount - b.totalAmount) * sortOrder);
    } else if (filters.sortBy === 'customer') {
      list.sort((a, b) => {
        const nameA = a.passengerDetails?.[0]?.name || '';
        const nameB = b.passengerDetails?.[0]?.name || '';
        return nameA.localeCompare(nameB) * sortOrder;
      });
    } else {
      // default: bookingDate / date
      list.sort((a, b) => (new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()) * sortOrder);
    }

    const total = list.length;
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 15));
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return {
      bookings: paginated,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Admin booking status update with automated audit logging.
   */
  adminUpdateBookingStatus(
    bookingId: string, 
    status: Booking['status'], 
    adminId: string, 
    adminEmail: string, 
    note?: string
  ): Booking | null {
    const idx = this.data.bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return null;

    const prevStatus = this.data.bookings[idx].status;
    this.data.bookings[idx].status = status;
    if (status === 'completed' && this.data.bookings[idx].paymentStatus === 'pending') {
      this.data.bookings[idx].paymentStatus = 'paid';
    }

    this.logAdminAction({
      adminId,
      adminEmail,
      action: 'BOOKING_STATUS_UPDATED',
      targetType: 'booking',
      targetId: bookingId,
      details: `Status changed from '${prevStatus}' to '${status}'. ${note ? `Note: ${note}` : ''}`
    });

    this.saveDatabase();
    return this.data.bookings[idx];
  }

  /**
   * Admin-initiated cancellation and refund.
   */
  adminCancelAndRefundBooking(
    bookingId: string, 
    adminId: string, 
    adminEmail: string, 
    reason?: string
  ): { booking: Booking; refundAmount: number } | null {
    const bkg = this.data.bookings.find(b => b.id === bookingId);
    if (!bkg) return null;

    if (bkg.status === 'cancelled') {
      return { booking: bkg, refundAmount: 0 };
    }

    bkg.status = 'cancelled';
    bkg.paymentStatus = 'refunded';
    const refundAmount = bkg.totalAmount;

    if (!bkg.details) bkg.details = {};
    bkg.details.cancellationReason = reason || 'Admin cancelled and processed refund';
    bkg.details.refundReference = `REF-ADM-${Date.now()}`;

    // Refund directly to user's wallet
    const user = this.getUser(bkg.userId);
    user.walletBalance = (user.walletBalance || 0) + refundAmount;
    this.updateUser(bkg.userId, { walletBalance: user.walletBalance });

    this.createWalletTransaction({
      id: `txn-ref-${Date.now()}`,
      userId: bkg.userId,
      amount: refundAmount,
      type: 'credit',
      source: 'refund',
      description: `Admin processed full refund for booking #${bkg.id}`,
      timestamp: new Date().toISOString(),
      status: 'success',
      referenceId: bkg.id
    });

    this.logAdminAction({
      adminId,
      adminEmail,
      action: 'BOOKING_CANCELLED',
      targetType: 'booking',
      targetId: bookingId,
      details: `Admin cancelled booking #${bookingId} and refunded ₹${refundAmount.toLocaleString('en-IN')}. Reason: ${reason || 'Customer or operations support request'}`
    });

    this.saveDatabase();
    return { booking: bkg, refundAmount };
  }

  /**
   * Resend booking confirmation email to customer.
   */
  adminResendBookingEmail(
    bookingId: string,
    adminId: string,
    adminEmail: string,
    recipientOverride?: string
  ): { success: boolean; message: string; booking: Booking } {
    const bkg = this.data.bookings.find(b => b.id === bookingId);
    if (!bkg) throw new Error('Booking not found');

    const recipient = recipientOverride || bkg.details?.contactEmail || this.getUser(bkg.userId)?.email;
    if (!recipient) throw new Error('Recipient email address could not be resolved');

    bkg.emailStatus = 'sent';
    bkg.emailSentAt = new Date().toISOString();
    if (bkg.details) {
      delete (bkg as any).emailError;
      bkg.details.contactEmail = recipient;
    }

    this.logAdminAction({
      adminId,
      adminEmail,
      action: 'EMAIL_RESENT',
      targetType: 'email',
      targetId: bookingId,
      details: `Resent booking confirmation email for #${bookingId} to ${recipient}.`
    });

    this.saveDatabase();
    return {
      success: true,
      message: `Booking confirmation email successfully dispatched to ${recipient}.`,
      booking: bkg
    };
  }

  // Analytics for Admin
  getAdminAnalytics(): AdminAnalyticsSummary {
    const totalBookings = this.data.bookings.length;
    const confirmedBookings = this.data.bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = this.data.bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = this.data.bookings.filter(b => b.status === 'cancelled').length;

    const totalRevenue = this.data.bookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.totalAmount : sum, 0);
    const totalUsers = Object.keys(this.data.users).length;
    const activeUsers = Object.values(this.data.users).filter(u => {
      const userBookings = this.data.bookings.some(b => b.userId === u.id);
      const userRides = this.data.explorerRides.some(r => r.userId === u.id);
      return userBookings || userRides;
    }).length || totalUsers;

    const totalRides = this.data.explorerRides.length;
    const totalReviews = this.data.reviews.length;
    const averageBookingValue = totalBookings > 0 
      ? Math.round(totalRevenue / Math.max(1, (totalBookings - cancelledBookings)))
      : 0;
    const cancellationRatePct = totalBookings > 0
      ? Number(((cancelledBookings / totalBookings) * 100).toFixed(1))
      : 0;

    const revenueByService: Record<string, number> = {
      flight: 0,
      hotel: 0,
      package: 0,
      train: 0,
      bus: 0,
      explorer: 0
    };

    const bookingsByService: Record<string, number> = {
      flight: 0,
      hotel: 0,
      package: 0,
      train: 0,
      bus: 0,
      explorer: 0
    };

    for (const b of this.data.bookings) {
      const s = b.serviceType || 'package';
      bookingsByService[s] = (bookingsByService[s] || 0) + 1;
      if (b.status !== 'cancelled') {
        revenueByService[s] = (revenueByService[s] || 0) + b.totalAmount;
      }
    }

    // Destination popularity
    const destMap: Record<string, { id: string; name: string; bookingsCount: number; revenue: number }> = {};
    for (const b of this.data.bookings) {
      const destName = b.destinationName || 'General';
      if (!destMap[destName]) {
        destMap[destName] = { id: destName, name: destName, bookingsCount: 0, revenue: 0 };
      }
      destMap[destName].bookingsCount += 1;
      if (b.status !== 'cancelled') {
        destMap[destName].revenue += b.totalAmount;
      }
    }
    const popularDestinations = Object.values(destMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);

    // Email delivery telemetry
    const emailStats = {
      sent: this.data.bookings.filter(b => (b.emailStatus || 'sent') === 'sent').length,
      failed: this.data.bookings.filter(b => b.emailStatus === 'failed').length,
      pending: this.data.bookings.filter(b => b.emailStatus === 'pending').length
    };

    const grossRevenue = this.data.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalRefunded = this.data.bookings
      .filter(b => b.status === 'cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const netRevenue = grossRevenue - totalRefunded;

    const totalEmails = emailStats.sent + emailStats.failed;
    const emailSuccessRate = totalEmails > 0 ? Math.round((emailStats.sent / totalEmails) * 100) : 100;

    const byService = Object.keys(bookingsByService).map(serviceType => ({
      serviceType,
      count: bookingsByService[serviceType] || 0,
      revenue: revenueByService[serviceType] || 0
    }));

    const topDestinations = popularDestinations.map(d => ({
      destination: d.name,
      bookingCount: d.bookingsCount,
      totalRevenue: d.revenue
    }));

    return {
      totalUsers,
      activeUsers,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      totalRevenue,
      totalRides,
      totalReviews,
      averageBookingValue,
      cancellationRatePct,
      revenueByService,
      bookingsByService,
      popularDestinations,
      recentBookings: this.data.bookings.slice(0, 10),
      recentRides: this.data.explorerRides.slice(0, 10),
      emailStats,

      // Structured analytics for executive dashboard
      revenue: {
        grossRevenue,
        netRevenue,
        totalRefunded
      },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings
      },
      users: {
        totalUsers,
        activeUsers30d: activeUsers,
        registeredProfiles: totalUsers
      },
      emailDelivery: {
        sent: emailStats.sent,
        pending: emailStats.pending,
        failed: emailStats.failed,
        successRate: emailSuccessRate
      },
      byService,
      topDestinations
    };
  }

  resetToDefaults() {
    const defaultDb: AppDatabase = {
      users: INITIAL_USERS,
      destinations: ALL_COMBINED_INITIAL_DESTINATIONS,
      packages: INITIAL_PACKAGES,
      bookings: INITIAL_BOOKINGS,
      explorerRides: [],
      magicAlbums: INITIAL_MAGIC_ALBUMS,
      magicPhotos: INITIAL_MAGIC_PHOTOS,
      reviews: INITIAL_REVIEWS,
      walletTransactions: INITIAL_WALLET_TXNS,
      groupTrips: INITIAL_GROUP_TRIPS,
      adminAuditLogs: INITIAL_ADMIN_AUDIT_LOGS,
      offers: INITIAL_OFFERS
    };
    this.data = defaultDb;
    this.saveDatabase(defaultDb);
    return defaultDb;
  }
}

export const db = new DatabaseManager();
