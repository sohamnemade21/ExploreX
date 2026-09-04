import fs from 'fs';
import path from 'path';
import { ALL_PACKAGES } from '../data/packagesData';
import { ALL_COMBINED_INITIAL_DESTINATIONS, db } from '../db';

const DB_FILE_PATH = path.join(process.cwd(), 'data_store.json');
let existingDb: any = {};
if (fs.existsSync(DB_FILE_PATH)) {
  try {
    existingDb = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
  } catch {}
}

const realisticBookings = [
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
    paymentMethod: 'card_demo',
    paymentStatus: 'paid',
    isSimulation: false,
    details: {
      flightNumber: 'AI-842',
      airline: 'Air India',
      seatClass: 'Economy Prime',
      departureTime: '09:45 AM',
      arrivalTime: '12:20 PM',
      duration: '2h 35m',
      pnrNumber: 'PNR-AI8923',
      baggage: '15kg Check-in + 7kg Cabin'
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
    isSimulation: false,
    details: {
      trainNumber: '20608',
      trainName: 'Vande Bharat Superfast Express',
      coach: 'Executive Chair Car (EC)',
      departureStation: 'Mumbai CSMT (05:25 AM)',
      arrivalStation: 'Madgaon Junction (01:10 PM)',
      duration: '7h 45m',
      pnrNumber: 'PNR-VB7741',
      quota: 'General'
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
    isSimulation: false,
    details: {
      busOperator: 'Zingbus Premium Electric',
      busType: 'Volvo 9600 Multi-Axle AC Sleeper (2+1)',
      boardingPoint: 'Majestic Terminal 1 (10:30 PM)',
      droppingPoint: 'Madikeri Private Bus Stand (05:45 AM)',
      duration: '7h 15m',
      pnrNumber: 'PNR-ZB9012'
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

existingDb.destinations = ALL_COMBINED_INITIAL_DESTINATIONS;
existingDb.packages = ALL_PACKAGES;
existingDb.bookings = realisticBookings;

fs.writeFileSync(DB_FILE_PATH, JSON.stringify(existingDb, null, 2), 'utf-8');
console.log('✅ Synchronized data_store.json with updated pricing & realistic multi-modal bookings');
