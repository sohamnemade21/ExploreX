import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  CloudSun, 
  Calendar, 
  Wallet, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Users, 
  Camera, 
  Heart, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FileText,
  Plane,
  Train,
  Bus,
  Package,
  X,
  RefreshCw,
  Ticket,
  Printer
} from 'lucide-react';
import { Booking, Destination, MagicMomentPhoto, GroupTrip } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NavTab } from '../components/Navbar';
import { InvoiceModal } from '../components/InvoiceModal';
import { formatINR } from '../utils/currency';
import { Button } from '../components/ui/Button';

interface MyTripsDashboardViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
}

export const MyTripsDashboardView: React.FC<MyTripsDashboardViewProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activeTabFilter, setActiveTabFilter] = useState<'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('upcoming');
  const [selectedTripDetail, setSelectedTripDetail] = useState<Booking | null>(null);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelModalOpen, setConfirmCancelModalOpen] = useState<boolean>(false);
  const [tripToCancel, setTripToCancel] = useState<Booking | null>(null);

  const loadData = async () => {
    if (!isAuthenticated) return;
    try {
      const [bkgData, destData] = await Promise.all([
        api.getBookings(),
        api.getDestinations()
      ]);
      setBookings(bkgData || []);
      setDestinations(destData || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 bg-white">
        <div className="w-16 h-16 bg-[#F7F7F4] text-[#91482D] rounded-2xl flex items-center justify-center mx-auto border border-[#E4E4DF] shadow-2xs">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#91482D] font-bold">
            Traveler Records
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#242424]">
            Your Travel Folio & Reservations
          </h2>
          <p className="font-prose text-sm text-[#6B6B67] max-w-md mx-auto italic">
            Please sign in to access your confirmed journeys, active e-tickets, and travel vouchers.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('login')}
            className="bg-[#242424] hover:bg-[#91482D]"
          >
            Sign In to View Trips
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('signup')}
          >
            Create an Account
          </Button>
        </div>
      </div>
    );
  }

  // Categorize bookings by real date and status
  const now = Date.now();
  const upcomingTrips = bookings.filter(b => {
    if (b.status === 'cancelled') return false;
    const travelTime = new Date(b.travelDate).getTime();
    return (b.status === 'confirmed' || b.status === 'pending') && travelTime > now;
  });

  const ongoingTrips = bookings.filter(b => {
    if (b.status === 'cancelled') return false;
    const travelTime = new Date(b.travelDate).getTime();
    const returnTime = b.returnDate ? new Date(b.returnDate).getTime() : travelTime + (86400000 * 3);
    return b.status === 'confirmed' && travelTime <= now && returnTime >= now;
  });

  const completedTrips = bookings.filter(b => {
    if (b.status === 'cancelled') return false;
    if (b.status === 'completed') return true;
    const returnTime = b.returnDate ? new Date(b.returnDate).getTime() : new Date(b.travelDate).getTime() + 86400000;
    return b.status === 'confirmed' && returnTime < now;
  });

  const cancelledTrips = bookings.filter(b => b.status === 'cancelled' || b.paymentStatus === 'refunded');

  const getFilteredList = () => {
    switch (activeTabFilter) {
      case 'upcoming': return upcomingTrips;
      case 'ongoing': return ongoingTrips;
      case 'completed': return completedTrips;
      case 'cancelled': return cancelledTrips;
      default: return upcomingTrips;
    }
  };

  const currentList = getFilteredList();

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const res = await api.cancelBooking(bookingId);
      await refreshProfile();
      
      // Update local bookings state immediately
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled', paymentStatus: 'refunded' } : b));
      if (selectedTripDetail && selectedTripDetail.id === bookingId) {
        setSelectedTripDetail(prev => prev ? { ...prev, status: 'cancelled', paymentStatus: 'refunded' } : null);
      }

      success('Trip Cancelled & Refunded', `${formatINR(res.refundAmount)} credited instantly to your ExploreX Wallet.`);
      setConfirmCancelModalOpen(false);
      setTripToCancel(null);
    } catch (err: any) {
      error('Cancellation Failed', err.message || 'Could not cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'train': return Train;
      case 'bus': return Bus;
      default: return Package;
    }
  };

  return (
    <div className="page-container space-y-8 pb-16 bg-white">
      {/* 1. Header Greeting & Overview */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#91482D] font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            Traveler Folio & Expedition Journal
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#242424] tracking-tight mt-1">
            Welcome back, {user?.name || 'Traveler'}
          </h1>
          <p className="font-prose text-sm sm:text-base text-[#6B6B67] mt-1 italic">
            Track your verified reservations, manage live weather itineraries, download GST tax vouchers, and review carbon offsets.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('bookings')}
            leftIcon={<Plane className="w-3.5 h-3.5" />}
          >
            Book New Transit
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('wallet')}
            leftIcon={<Wallet className="w-3.5 h-3.5" />}
            className="bg-[#242424] hover:bg-[#91482D]"
          >
            Expedition Ledger
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Ledger Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#E4E4DF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B67]">Total Reservations</span>
            <Ticket className="w-4 h-4 text-[#91482D]" />
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-[#242424] mt-1">{bookings.length}</div>
          <div className="text-[11px] font-prose text-[#6B6B67] mt-0.5">Across all Indian sanctuaries</div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#E4E4DF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B67]">Upcoming Journeys</span>
            <Clock className="w-4 h-4 text-[#242424]" />
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-[#242424] mt-1">{upcomingTrips.length}</div>
          <div className="text-[11px] font-prose text-[#6B6B67] mt-0.5">Active & confirmed tickets</div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#E4E4DF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B67]">Wallet Balance</span>
            <Wallet className="w-4 h-4 text-[#91482D]" />
          </div>
          <div className="font-mono font-bold text-xl sm:text-2xl text-[#242424] mt-1">{formatINR(user?.walletBalance || 0)}</div>
          <div className="text-[11px] font-prose text-[#6B6B67] mt-0.5">Instant refund guarantee</div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#E4E4DF] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B67]">Eco & Handloom Retained</span>
            <ShieldCheck className="w-4 h-4 text-[#242424]" />
          </div>
          <div className="font-mono font-bold text-xl sm:text-2xl text-[#242424] mt-1">88% Direct</div>
          <div className="text-[11px] font-prose text-[#6B6B67] mt-0.5">Retained in local economy</div>
        </div>
      </div>

      {/* 3. Filter Tabs (Upcoming, Ongoing, Completed, Cancelled) */}
      <div className="flex items-center gap-1.5 border-b border-[#E4E4DF] pb-2 overflow-x-auto">
        {[
          { id: 'upcoming', label: 'Upcoming', count: upcomingTrips.length },
          { id: 'ongoing', label: 'Ongoing', count: ongoingTrips.length },
          { id: 'completed', label: 'Completed', count: completedTrips.length },
          { id: 'cancelled', label: 'Cancelled & Refunded', count: cancelledTrips.length }
        ].map(tab => {
          const isActive = activeTabFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabFilter(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#242424] text-[#FFFFFF] font-bold shadow-xs'
                  : 'text-[#6B6B67] hover:text-[#242424] hover:bg-[#F7F7F4]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                isActive ? 'bg-[#91482D] text-white' : 'bg-[#F7F7F4] text-[#6B6B67]'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

        {/* Trips List Feed */}
        {currentList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No {activeTabFilter} trips found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {activeTabFilter === 'upcoming'
                  ? 'You don’t have any upcoming reservations scheduled. Browse our verified flight, train, or bus itineraries.'
                  : activeTabFilter === 'ongoing'
                  ? 'No active journeys in progress right now.'
                  : activeTabFilter === 'cancelled'
                  ? 'You have zero cancelled reservations. All your booked trips remain confirmed!'
                  : 'No past completed trips recorded in this account yet.'}
              </p>
            </div>

            {activeTabFilter === 'upcoming' && (
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('bookings')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Book a Trip Now
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentList.map(trip => {
              const ServiceIcon = getServiceIcon(trip.serviceType);
              const isEligibleForCancel = (trip.status === 'confirmed' || trip.status === 'pending') && activeTabFilter === 'upcoming';

              return (
                <div
                  key={trip.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                          <ServiceIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block leading-tight">#{trip.id}</span>
                          <span className="text-xs font-bold text-slate-700 capitalize">{trip.serviceType} Booking</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          trip.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          trip.status === 'completed' ? 'bg-sky-100 text-sky-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {trip.status}
                        </span>
                        {trip.paymentStatus === 'refunded' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                            Refunded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Route */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{trip.title}</h3>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sky-600" /> {trip.destinationName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {trip.travelDate}</span>
                      </div>
                    </div>

                    {/* Details Box */}
                    {trip.details && (
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                        {trip.details.flightNumber && <div>✈️ Flight: <strong>{trip.details.airline} {trip.details.flightNumber}</strong> ({trip.details.seatClass || 'Economy'})</div>}
                        {trip.details.trainNumber && <div>🚆 Train: <strong>{trip.details.trainName} (#{trip.details.trainNumber})</strong></div>}
                        {trip.details.busOperator && <div>🚌 Bus: <strong>{trip.details.busOperator}</strong> ({trip.details.busType})</div>}
                        {trip.details.pnrNumber && <div>🎫 PNR / Ticket: <span className="font-mono font-bold text-slate-800">{trip.details.pnrNumber}</span></div>}
                        {trip.details.seatNumber && <div>💺 Seat / Berth: <span className="font-semibold text-slate-800">{trip.details.seatNumber}</span></div>}
                      </div>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Amount Paid</div>
                      <div className="text-base font-black text-slate-900">{formatINR(trip.totalAmount)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedTripDetail(trip)}
                        leftIcon={<FileText className="w-3.5 h-3.5" />}
                      >
                        Details
                      </Button>

                      {isEligibleForCancel && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setTripToCancel(trip);
                            setConfirmCancelModalOpen(true);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* 4. COMPREHENSIVE TRIP DETAIL & TIMELINE MODAL */}
      {selectedTripDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedTripDetail(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-semibold rounded-full border border-sky-400/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Trip Lifecycle & Manifest
              </div>
              <h3 className="text-xl font-bold text-white">{selectedTripDetail.title}</h3>
              <p className="text-xs text-slate-300 mt-1">
                Booking Reference: <span className="font-mono font-bold text-sky-400">{selectedTripDetail.id}</span>
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Status Timeline */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status Progression</h4>
                
                {selectedTripDetail.status === 'cancelled' ? (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Booked</span>
                    </div>
                    <div className="h-0.5 w-8 bg-slate-300" />
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Confirmed</span>
                    </div>
                    <div className="h-0.5 w-8 bg-rose-400" />
                    <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                      <X className="w-4 h-4 text-rose-600" />
                      <span>Cancelled</span>
                    </div>
                    <div className="h-0.5 w-8 bg-emerald-400" />
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span>100% Refunded</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Booked</span>
                    </div>
                    <div className="h-0.5 w-8 bg-emerald-500" />
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Confirmed</span>
                    </div>
                    <div className={`h-0.5 w-8 ${selectedTripDetail.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <div className={`flex items-center gap-1.5 ${
                      selectedTripDetail.status === 'completed' ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'
                    }`}>
                      <Clock className="w-4 h-4" />
                      <span>Ongoing</span>
                    </div>
                    <div className={`h-0.5 w-8 ${selectedTripDetail.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <div className={`flex items-center gap-1.5 ${
                      selectedTripDetail.status === 'completed' ? 'text-sky-600 font-bold' : 'text-slate-400 font-medium'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Passenger & Seat Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Passenger Manifest</h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Passenger Name</th>
                        <th className="p-3">Age</th>
                        <th className="p-3">Gender</th>
                        <th className="p-3">Seat / Berth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedTripDetail.passengerDetails || [{ name: user?.name || 'Primary Traveler', age: 28, gender: 'Male' }]).map((p, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                          <td className="p-3 text-slate-600">{p.age} yrs</td>
                          <td className="p-3 text-slate-600">{p.gender}</td>
                          <td className="p-3 font-mono font-bold text-sky-700">{p.seatNumber || selectedTripDetail.details?.seatNumber || `Seat ${idx + 1}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price & Invoice Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Transport Fare</span>
                  <span>{formatINR(selectedTripDetail.invoice?.baseFare || selectedTripDetail.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes & GST (18%)</span>
                  <span>{formatINR(selectedTripDetail.invoice?.taxes || 0)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Grand Total Paid</span>
                  <span className="text-sky-600">{formatINR(selectedTripDetail.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedInvoiceBooking(selectedTripDetail);
                  setSelectedTripDetail(null);
                }}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                View E-Ticket & Invoice
              </Button>

              {selectedTripDetail.status === 'confirmed' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setTripToCancel(selectedTripDetail);
                    setConfirmCancelModalOpen(true);
                  }}
                >
                  Cancel Trip & Refund
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. CANCELLATION CONFIRMATION DIALOG */}
      {confirmCancelModalOpen && tripToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Confirm Trip Cancellation?</h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel <strong>{tripToCancel.title}</strong>?
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 text-left space-y-1">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Instant Refund Policy</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                The full amount of <strong>{formatINR(tripToCancel.totalAmount)}</strong> will be credited directly to your ExploreX Wallet immediately.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => {
                  setConfirmCancelModalOpen(false);
                  setTripToCancel(null);
                }}
              >
                Keep Booking
              </Button>

              <Button
                variant="destructive"
                size="md"
                fullWidth
                isLoading={cancellingId === tripToCancel.id}
                onClick={() => handleCancelBooking(tripToCancel.id)}
              >
                Confirm & Refund
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Invoice & E-Ticket Modal */}
      <InvoiceModal
        booking={selectedInvoiceBooking}
        isOpen={!!selectedInvoiceBooking}
        onClose={() => setSelectedInvoiceBooking(null)}
        onBookingCancelled={() => {
          loadData();
          refreshProfile();
        }}
      />
    </div>
  );
};
