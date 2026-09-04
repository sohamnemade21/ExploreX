import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plane, 
  Train, 
  Bus, 
  Building, 
  Search, 
  Calendar, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Download, 
  Printer, 
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Wifi,
  Zap,
  Luggage,
  MapPin,
  ChevronRight,
  Check,
  Star,
  Coffee,
  Waves,
  Utensils,
  Car
} from 'lucide-react';
import { Booking } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { BookingCheckoutModal } from '../components/BookingCheckoutModal';
import { formatINR } from '../utils/currency';
import { NavTab } from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { 
  generateDynamicFlights, 
  generateDynamicTrains, 
  generateDynamicBuses, 
  generateDynamicHotels,
  DynamicFlight,
  DynamicTrain,
  DynamicTrainClass,
  DynamicBus,
  DynamicHotel,
  cleanCityName
} from '../utils/transitGenerator';

interface BookingsViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
}

const POPULAR_ROUTES = [
  { label: 'Delhi ➔ Goa', origin: 'New Delhi (DEL)', destination: 'Goa (GOI)' },
  { label: 'Mumbai ➔ Pune', origin: 'Mumbai (BOM)', destination: 'Pune (PNQ)' },
  { label: 'Bengaluru ➔ Kochi', origin: 'Bengaluru (BLR)', destination: 'Kochi (COK)' },
  { label: 'Delhi ➔ Jaipur', origin: 'New Delhi (DEL)', destination: 'Jaipur (JAI)' },
  { label: 'Mumbai ➔ Sindhudurg', origin: 'Mumbai (BOM)', destination: 'Sindhudurg (SDW)' },
  { label: 'Kolkata ➔ Varanasi', origin: 'Kolkata (CCU)', destination: 'Varanasi (VNS)' },
  { label: 'Hyderabad ➔ Bengaluru', origin: 'Hyderabad (HYD)', destination: 'Bengaluru (BLR)' }
];


export const BookingsView: React.FC<BookingsViewProps> = ({ onNavigate }) => {
  const { user, refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [activeServiceTab, setActiveServiceTab] = useState<'flight' | 'train' | 'bus' | 'hotel'>('flight');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  // Search parameters
  const [origin, setOrigin] = useState('New Delhi (DEL)');
  const [destination, setDestination] = useState('Goa (GOI)');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Business'>('Economy');
  const [selectedHotelRooms, setSelectedHotelRooms] = useState<Record<string, number>>({});

  // Dynamic Reactive Inventories - updates immediately as soon as city names change!
  const liveFlights = React.useMemo(() => generateDynamicFlights(origin, destination), [origin, destination]);
  const liveTrains = React.useMemo(() => generateDynamicTrains(origin, destination), [origin, destination]);
  const liveBuses = React.useMemo(() => generateDynamicBuses(origin, destination), [origin, destination]);
  const liveHotels = React.useMemo(() => generateDynamicHotels(destination), [destination]);

  // Modal checkout state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutPayload, setCheckoutPayload] = useState<{
    serviceType: Booking['serviceType'];
    title: string;
    destinationName: string;
    basePrice: number;
    duration?: string;
    details: Record<string, any>;
  }>({
    serviceType: 'flight',
    title: '',
    destinationName: '',
    basePrice: 4650,
    details: {}
  });

  const loadBookings = async () => {
    try {
      const list = await api.getBookings();
      setBookings(list || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleBookFlight = (flight: DynamicFlight) => {
    const price = cabinClass === 'Business' ? flight.basePriceBusiness : flight.basePriceEconomy;
    const title = `${flight.airline} ${flight.flightNumber}: ${flight.originCity} ➔ ${flight.destinationCity}`;
    
    setCheckoutPayload({
      serviceType: 'flight',
      title,
      destinationName: flight.destinationCity,
      basePrice: price,
      details: {
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        seatClass: cabinClass,
        seatNumber: '12A, 12B',
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        duration: flight.duration,
        baggage: flight.baggage,
        refundable: flight.refundable,
        originCity: flight.originCity,
        destinationCity: flight.destinationCity
      }
    });
    setCheckoutModalOpen(true);
  };

  const handleBookTrain = (train: DynamicTrain, selectedClass: DynamicTrainClass) => {
    const cleanOrig = cleanCityName(origin);
    const cleanDest = cleanCityName(destination);
    const title = `${train.trainName} (${train.trainNumber}): ${cleanOrig} ➔ ${cleanDest}`;
    
    setCheckoutPayload({
      serviceType: 'train',
      title,
      destinationName: cleanDest,
      basePrice: selectedClass.price,
      details: {
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        coach: `${selectedClass.name} (${selectedClass.code})`,
        seatNumber: `Coach ${selectedClass.code}-1 / Berth 24 (Confirmed)`,
        departureStation: train.originStation,
        arrivalStation: train.destStation,
        duration: train.duration,
        quota: 'General Quota'
      }
    });
    setCheckoutModalOpen(true);
  };

  const handleBookBus = (bus: DynamicBus) => {
    const cleanOrig = cleanCityName(origin);
    const cleanDest = cleanCityName(destination);
    const title = `${bus.operator}: ${cleanOrig} ➔ ${cleanDest}`;
    
    setCheckoutPayload({
      serviceType: 'bus',
      title,
      destinationName: cleanDest,
      basePrice: bus.price,
      details: {
        busOperator: bus.operator,
        busType: bus.busType,
        seatNumber: 'Berth L4 (Lower Deck)',
        boardingPoint: bus.boardingPoint,
        droppingPoint: bus.droppingPoint,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        duration: bus.duration
      }
    });
    setCheckoutModalOpen(true);
  };

  const handleBookHotel = (hotel: DynamicHotel) => {
    const roomIndex = selectedHotelRooms[hotel.id] || 0;
    const selectedRoom = hotel.rooms[roomIndex] || hotel.rooms[0];
    const title = `${hotel.name} - ${selectedRoom.type}`;

    setCheckoutPayload({
      serviceType: 'hotel',
      title,
      destinationName: hotel.destination,
      basePrice: selectedRoom.pricePerNight * 2,
      duration: '2 Nights',
      details: {
        hotelName: hotel.name,
        roomType: selectedRoom.type,
        stars: hotel.stars,
        checkInDate: departureDate,
        checkOutDate: checkOutDate,
        checkInTime: '02:00 PM',
        checkOutTime: '11:00 AM',
        railwayProximity: hotel.proximity.railway,
        airportProximity: hotel.proximity.airport,
        landmarkProximity: hotel.proximity.landmarks.join(', '),
        amenities: hotel.amenities.join(', ')
      }
    });
    setCheckoutModalOpen(true);
  };

  const filteredBookings = bookings.filter(b => {
    if (historyFilter === 'all') return true;
    return b.status === historyFilter;
  });

  return (
    <div className="page-container space-y-10 pb-16 bg-white">
      {/* Header */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#B45F3C] font-bold">
            <Ticket className="w-3.5 h-3.5" />
            Transit & Stays
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-0.5">
            Book Flights, Trains, Buses & Hotels
          </h1>
          <p className="font-prose text-xs sm:text-sm text-[#6B6B67] mt-0.5">
            Search and book tickets and hotel rooms with instant confirmation and downloadable GST invoices.
          </p>
        </div>

        {/* Real Test Mode Pill */}
        <div className="flex items-center gap-2 bg-[#F7F7F4] border border-[#E4E4DF] text-[#5F7564] px-3 py-1.5 rounded-lg text-xs font-mono font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-[#5F7564]" />
          <span>Payment Test Mode Active</span>
        </div>
      </div>

      {/* 1. Dedicated Multi-Modal Search Container */}
      <div className="bg-white rounded-2xl border border-[#E4E4DF] shadow-editorial overflow-hidden">
        {/* Service Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#E4E4DF] bg-[#F7F7F4] p-2 gap-2 text-xs">
          {[
            { id: 'flight', label: 'Flights', icon: Plane, sub: 'Domestic & Regional' },
            { id: 'train', label: 'Trains', icon: Train, sub: 'IRCTC / Vande Bharat' },
            { id: 'bus', label: 'Intercity Coaches', icon: Bus, sub: 'Volvo & Electric AC' },
            { id: 'hotel', label: 'Heritage Stays', icon: Building, sub: 'Transit-Proximity Verified' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeServiceTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveServiceTab(tab.id as any)}
                className={`py-2.5 px-3 rounded-xl font-medium flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#242424] font-bold shadow-xs border border-[#E4E4DF]'
                    : 'text-[#6B6B67] hover:text-[#242424] hover:bg-white/60'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#242424] text-[#FFFFFF]' : 'bg-[#FFFFFF] text-[#6B6B67]'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="leading-tight text-xs font-semibold">{tab.label}</div>
                  <div className="text-[10px] font-mono text-[#6B6B67] hidden sm:block">{tab.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Search Filter Bar */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#91482D]" />
                {activeServiceTab === 'hotel' ? 'Destination City / Area' : 'From / Origin'}
              </label>
              <input
                type="text"
                value={activeServiceTab === 'hotel' ? destination : origin}
                onChange={e => activeServiceTab === 'hotel' ? setDestination(e.target.value) : setOrigin(e.target.value)}
                placeholder={activeServiceTab === 'hotel' ? 'e.g. South Goa, Pune, Kolkata' : 'e.g. New Delhi (DEL), Mumbai (BOM)'}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:border-[#242424] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#242424]" />
                {activeServiceTab === 'hotel' ? 'Key Landmark / Transit Hub' : 'To / Destination'}
              </label>
              <input
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder={activeServiceTab === 'hotel' ? 'Near Railway Station / Airport' : 'e.g. Goa (GOI), Bangalore (BLR)'}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:border-[#242424] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#91482D]" />
                {activeServiceTab === 'hotel' ? 'Check-In Date' : 'Travel Date'}
              </label>
              <input
                type="date"
                value={departureDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDepartureDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                {activeServiceTab === 'flight' ? 'Cabin Class & Travelers' : 'Guests / Passengers'}
              </label>
              {activeServiceTab === 'flight' ? (
                <div className="flex gap-2">
                  <select
                    value={cabinClass}
                    onChange={e => setCabinClass(e.target.value as any)}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPassengers(num)}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        passengers === num
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick-Select Popular Route Chips */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Popular Quick Routes:</span>
            {POPULAR_ROUTES.map((r, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setOrigin(r.origin);
                  setDestination(r.destination);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  origin === r.origin && destination === r.destination
                    ? 'bg-sky-600 text-white border-sky-600 shadow-2xs font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. REALISTIC LIVE SEARCH RESULTS FEED */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Available {activeServiceTab === 'flight' ? 'Flights' : activeServiceTab === 'train' ? 'Trains' : activeServiceTab === 'bus' ? 'Buses' : 'Verified Hotels'}</span>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                {activeServiceTab === 'hotel' ? destination : `${origin} ➔ ${destination}`}
              </span>
            </h2>
          </div>
          <span className="text-xs text-slate-500">Instant Razorpay checkout with GST invoice</span>
        </div>

        {/* 2A. FLIGHTS RESULT LIST */}
        {activeServiceTab === 'flight' && (
          <div className="space-y-3">
            {liveFlights.map(f => {
              const currentPrice = cabinClass === 'Business' ? f.basePriceBusiness : f.basePriceEconomy;

              return (
                <div
                  key={f.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-400 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-black text-sm shrink-0 border border-sky-100">
                      <Plane className="w-6 h-6 text-sky-600" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{f.airline}</span>
                        <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{f.flightNumber}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{f.refundable}</span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">{cabinClass} Class • {f.seatsAvailable} seats left</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>🧳 {f.baggage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route & Timing */}
                  <div className="flex items-center gap-4 text-center border-t border-b lg:border-t-0 lg:border-b-0 py-3 lg:py-0 border-slate-100">
                    <div>
                      <div className="text-base font-black text-slate-900">{f.departureTime}</div>
                      <div className="text-xs font-semibold text-slate-500">{f.origin} ({f.originCity})</div>
                    </div>

                    <div className="space-y-1 px-4">
                      <div className="text-[11px] text-slate-400 font-medium">{f.duration}</div>
                      <div className="w-24 h-0.5 bg-slate-200 relative">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-900" />
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold uppercase">{f.stops}</div>
                    </div>

                    <div>
                      <div className="text-base font-black text-slate-900">{f.arrivalTime}</div>
                      <div className="text-xs font-semibold text-slate-500">{f.destination} ({f.destinationCity})</div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Per Traveler ({cabinClass})</div>
                      <div className="text-xl font-black text-slate-900">{formatINR(currentPrice)}</div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleBookFlight(f)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Instant Book
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2B. TRAINS RESULT LIST */}
        {activeServiceTab === 'train' && (
          <div className="space-y-4">
            {liveTrains.map(t => (
              <div
                key={t.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-400 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-sm shrink-0 border border-amber-100">
                      <Train className="w-6 h-6 text-amber-600" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{t.trainName}</span>
                        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">#{t.trainNumber}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Runs: {t.runsOn}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {t.originStation} ➔ {t.destStation} • Duration: {t.duration}
                      </div>
                    </div>
                  </div>

                  {/* Route & Timings */}
                  <div className="flex items-center gap-4 text-xs text-slate-700">
                    <span className="font-semibold text-slate-800">{t.originStation}</span>
                    <span className="text-slate-300 font-bold">➔</span>
                    <span className="font-semibold text-slate-800">{t.destStation}</span>
                  </div>
                </div>

                {/* Class Availability Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {t.classes.map(c => (
                    <div
                      key={c.code}
                      onClick={() => handleBookTrain(t, c)}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-900">{c.code}</span>
                        <span className="text-xs font-black text-slate-900 group-hover:text-sky-700">{formatINR(c.price)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{c.name}</span>
                        <span className="font-bold text-emerald-600">{c.status}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-sky-600 font-bold opacity-80 group-hover:opacity-100">
                        <span>Instant Book</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2C. BUSES RESULT LIST */}
        {activeServiceTab === 'bus' && (
          <div className="space-y-3">
            {liveBuses.map(b => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-400 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-100">
                    <Bus className="w-6 h-6 text-emerald-600" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{b.operator}</span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">★ {b.rating}</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{b.busType}</div>
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 pt-0.5">
                      {b.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-600">
                          ✓ {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timing & Pickup */}
                <div className="text-xs text-slate-600 space-y-1 border-t border-b lg:border-t-0 lg:border-b-0 py-3 lg:py-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span><strong>{b.departureTime}</strong> ➔ <strong>{b.arrivalTime}</strong> ({b.duration})</span>
                  </div>
                  <div className="text-[11px] text-slate-500">📍 Pickup: {b.boardingPoint}</div>
                  <div className="text-[11px] text-slate-500">📍 Drop: {b.droppingPoint}</div>
                </div>

                {/* Price & Book */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">{b.seatsLeft} berths left</div>
                    <div className="text-xl font-black text-slate-900">{formatINR(b.price)}</div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleBookBus(b)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Instant Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2D. HOTELS RESULT LIST WITH TRANSIT PROXIMITY */}
        {activeServiceTab === 'hotel' && (
          <div className="space-y-4">
            {liveHotels.map(h => {
              const selectedRoomIdx = selectedHotelRooms[h.id] || 0;
              const currentRoom = h.rooms[selectedRoomIdx] || h.rooms[0];

              return (
                <div
                  key={h.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-400 transition-all overflow-hidden flex flex-col lg:flex-row"
                >
                  {/* Hotel Image Container */}
                  <div className="lg:w-72 h-56 lg:h-auto relative overflow-hidden shrink-0">
                    <img
                      src={h.image}
                      alt={h.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{h.stars}★ Verified Stay</span>
                    </div>
                  </div>

                  {/* Hotel Main Information */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{h.name}</h3>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-sky-600" />
                            <span>{h.destination}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                            ★ {h.rating} / 5
                          </span>
                          <span className="text-xs text-slate-500">({h.reviewCount} reviews)</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">{h.tagline}</p>

                      {/* 🌟 KEY TRANSIT & LANDMARK PROXIMITY BADGES (Hard Requirement) */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Transit & Landmark Proximity
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-0.5">
                          <div className="flex items-center gap-1.5">
                            <Train className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="font-semibold">{h.proximity.railway}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Plane className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span className="font-semibold">{h.proximity.airport}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-600 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>Nearby: <strong>{h.proximity.landmarks.join(' • ')}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Amenities Row */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {h.amenities.map((amenity, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Room Selector & Instant Checkout Row */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Room Category Pill Selector */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Select Room Category</div>
                        <div className="flex flex-wrap gap-1.5">
                          {h.rooms.map((room, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedHotelRooms(prev => ({ ...prev, [h.id]: idx }))}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                selectedRoomIdx === idx
                                  ? 'bg-slate-900 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {room.type} ({formatINR(room.pricePerNight)}/nt)
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price & Book */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                        <div className="text-left sm:text-right">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Price per night</div>
                          <div className="text-xl font-black text-slate-900">{formatINR(currentRoom.pricePerNight)}</div>
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleBookHotel(h)}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Book Room Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Unified Booking History & E-Tickets */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your E-Tickets & Tax Invoices</h2>
            <p className="text-xs text-slate-500">Access printable boarding passes, train PNR status & official invoices.</p>
          </div>

          {/* Status filter chips */}
          <div className="flex gap-1.5 overflow-x-auto">
            {(['all', 'confirmed', 'completed', 'cancelled'] as const).map(f => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  historyFilter === f
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No bookings in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Book a flight, train, bus, or hotel above to see your electronic tickets and tax invoices here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map(b => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-400 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'completed' ? 'bg-sky-100 text-sky-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {b.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">#{b.id}</span>
                    <span className="text-xs font-semibold text-slate-700 capitalize bg-slate-100 px-2 py-0.5 rounded-md">
                      {b.serviceType}
                    </span>
                    {b.details?.pnrNumber && (
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {b.details.pnrNumber}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span>📍 {b.destinationName}</span>
                    <span>📅 Travel: {b.travelDate}</span>
                    <span>👥 {b.passengersCount} Guest(s)</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 gap-2">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400 font-medium">Grand Total Paid</div>
                    <div className="text-base font-black text-slate-900">{formatINR(b.totalAmount)}</div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedInvoiceBooking(b)}
                    leftIcon={<FileText className="w-3.5 h-3.5" />}
                  >
                    E-Ticket & Invoice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Comprehensive Multi-Step OTA Checkout Modal */}
      {checkoutModalOpen && (
        <BookingCheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
          serviceType={checkoutPayload.serviceType}
          title={checkoutPayload.title}
          destinationName={checkoutPayload.destinationName}
          basePrice={checkoutPayload.basePrice}
          duration={checkoutPayload.duration}
          details={checkoutPayload.details}
          onBookingSuccess={(b) => {
            setBookings(prev => [b, ...prev]);
            loadBookings();
          }}
          onNavigateToMyTrips={() => onNavigate('mytrips')}
        />
      )}

      {/* Invoice & Cancellation Modal */}
      <InvoiceModal
        booking={selectedInvoiceBooking}
        isOpen={!!selectedInvoiceBooking}
        onClose={() => setSelectedInvoiceBooking(null)}
        onBookingCancelled={() => {
          loadBookings();
          refreshProfile();
        }}
      />
    </div>
  );
};
