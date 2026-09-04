import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign, 
  Phone, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Zap, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { ExplorerVehicleOption, ExplorerRide } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MapComponent } from '../components/MapComponent';
import { NavTab } from '../components/Navbar';
import { formatINR } from '../utils/currency';

interface TheExplorerViewProps {
  initialDestination?: string;
  onNavigate: (tab: NavTab, params?: any) => void;
}

export const TheExplorerView: React.FC<TheExplorerViewProps> = ({ initialDestination = '', onNavigate }) => {
  const { user, refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [vehicles, setVehicles] = useState<ExplorerVehicleOption[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('sedan');
  const [pickupAddress, setPickupAddress] = useState<string>('Baga Beach Main Road, North Goa');
  const [dropAddress, setDropAddress] = useState<string>(initialDestination || 'Aguada Fort Heritage Point, Candolim');
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number }>({ lat: 15.5524, lng: 73.7517 });
  const [dropCoords, setDropCoords] = useState<{ lat: number; lng: number }>({ lat: 15.4989, lng: 73.7738 });

  const [fareEstimate, setFareEstimate] = useState<{
    distanceKm: number;
    fare: number;
    durationMins: number;
    etaMins: number;
  } | null>(null);

  const [activeRide, setActiveRide] = useState<ExplorerRide | null>(null);
  const [ridesHistory, setRidesHistory] = useState<ExplorerRide[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [vList, rList] = await Promise.all([
          api.getExplorerVehicles(),
          api.getRides()
        ]);
        setVehicles(vList);
        setRidesHistory(rList);
        if (rList.length > 0 && rList[0].status !== 'completed' && rList[0].status !== 'cancelled') {
          setActiveRide(rList[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // Update fare estimate
  useEffect(() => {
    const fetchFare = async () => {
      try {
        const res = await api.getFareEstimate({
          pickupCoords,
          dropCoords,
          vehicleType: selectedVehicleType
        });
        setFareEstimate(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFare();
  }, [pickupCoords, dropCoords, selectedVehicleType]);

  const handleBookRide = async () => {
    if (!fareEstimate) return;
    setBookingLoading(true);

    try {
      const newRide = await api.bookRide({
        vehicleType: selectedVehicleType,
        pickupAddress,
        dropAddress,
        pickupCoords,
        dropCoords,
        fare: fareEstimate.fare,
        distanceKm: fareEstimate.distanceKm,
        durationMins: fareEstimate.durationMins
      });

      setActiveRide(newRide);
      setRidesHistory(prev => [newRide, ...prev]);
      await refreshProfile();
      success('Explorer Ride Dispatched!', `Driver assigned: ${newRide.driver?.name}. OTP: ${newRide.otp}`);
    } catch (err: any) {
      error('Ride Booking Error', err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAdvanceStatus = async () => {
    if (!activeRide) return;
    try {
      const updated = await api.advanceRideStatus(activeRide.id);
      setActiveRide(updated);
      setRidesHistory(prev => prev.map(r => r.id === updated.id ? updated : r));
      success('Ride Status Updated', `Status changed to ${updated.status.replace('_', ' ').toUpperCase()}`);
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const handleCancelRide = async () => {
    if (!activeRide) return;
    try {
      const res = await api.cancelRide(activeRide.id);
      setActiveRide(null);
      setRidesHistory(prev => prev.map(r => r.id === res.ride.id ? res.ride : r));
      await refreshProfile();
      success('Ride Cancelled', `${formatINR(res.ride.fare)} refunded back to your ExploreX Wallet.`);
    } catch (err: any) {
      error('Cancellation Error', err.message);
    }
  };

  const selectedVehicle = vehicles.find(v => v.type === selectedVehicleType) || vehicles[0];

  return (
    <div className="page-container space-y-8 pb-16 bg-white">
      {/* Header */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#B45F3C] font-bold">
            <Car className="w-3.5 h-3.5" />
            Cabs & Local Transport
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-0.5">
            The Explorer: Local Cabs & Rentals
          </h1>
          <p className="font-prose text-xs sm:text-sm text-[#6B6B67] mt-0.5">
            Fixed per-kilometer rates and verified local drivers for sedans, autos, and scooters.
          </p>
        </div>

        {activeRide && (
          <div className="flex items-center gap-2 bg-[#EEF2ED] border border-[#5F7564]/20 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#5F7564]">
            <span className="w-2 h-2 rounded-full bg-[#5F7564] animate-pulse" />
            <span>Active ride in progress</span>
          </div>
        )}
      </div>

      {/* Main Booking & Tracking Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Booking Form or Active Tracking */}
        <div className="space-y-6">
          {activeRide && activeRide.status !== 'completed' && activeRide.status !== 'cancelled' ? (
            /* ACTIVE RIDE TRACKING CARD */
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {activeRide.status.replace('_', ' ')}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{activeRide.vehicleName}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-medium">Start OTP</span>
                  <div className="text-lg font-black text-slate-900 font-mono tracking-widest">{activeRide.otp}</div>
                </div>
              </div>

              {/* Driver Details */}
              {activeRide.driver && (
                <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <img
                    src={activeRide.driver.avatar}
                    alt={activeRide.driver.name}
                    className="w-12 h-12 rounded-xl object-cover border border-sky-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{activeRide.driver.name}</h4>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {activeRide.driver.rating}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {activeRide.driver.vehicleModel} • <span className="font-mono text-slate-700 font-bold">{activeRide.driver.vehicleNumber}</span>
                    </div>
                    <div className="text-[11px] text-sky-600 font-semibold mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {activeRide.driver.phone}
                    </div>
                  </div>
                </div>
              )}

              {/* Route Summary */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-sky-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Pickup Point</span>
                    <span className="font-semibold">{activeRide.pickupAddress}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Drop Point</span>
                    <span className="font-semibold">{activeRide.dropAddress}</span>
                  </div>
                </div>
              </div>

              {/* Simulation Driver Advance Button */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Interactive Simulation Control:
                </div>
                <button
                  onClick={handleAdvanceStatus}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm transition-all"
                >
                  Advance Ride Status (Simulate Driver Movement)
                </button>
              </div>

              {/* Cancel button */}
              <button
                onClick={handleCancelRide}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel Ride & Refund {formatINR(activeRide.fare)}
              </button>
            </div>
          ) : (
            /* NEW RIDE BOOKING FORM */
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900">Book an Explorer Vehicle</h3>

              {/* Pickup / Drop inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-sky-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={e => setPickupAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Drop Destination</label>
                  <div className="relative">
                    <Navigation className="w-4 h-4 text-rose-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={dropAddress}
                      onChange={e => setDropAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Options Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Select Vehicle Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {vehicles.map((v, i) => {
                    const isSelected = selectedVehicleType === v.type;
                    return (
                      <button
                        key={v.type || i}
                        type="button"
                        onClick={() => setSelectedVehicleType(v.type)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="text-xl mb-1">{v.icon}</div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">{v.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{formatINR(v.perKmRate)}/km</div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-1">⚡ {v.etaMins}m ETA</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fare & Distance estimate bar */}
              {fareEstimate && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Distance</span>
                    <span className="font-bold text-slate-900">{fareEstimate.distanceKm} km</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Trip Duration</span>
                    <span className="font-bold text-slate-900">~{fareEstimate.durationMins} mins</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Driver Pickup ETA</span>
                    <span className="font-bold text-emerald-600">{fareEstimate.etaMins} mins</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Total Fare</span>
                    <span className="text-sky-600">{formatINR(fareEstimate.fare)}</span>
                  </div>
                </div>
              )}

              {/* Book button */}
              <button
                onClick={handleBookRide}
                disabled={bookingLoading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Explorer {selectedVehicle?.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Wallet Balance Banner */}
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-medium block">ExploreX Wallet Balance</span>
              <span className="text-base font-black text-sky-900">{formatINR(user?.walletBalance || 0)}</span>
            </div>
            <button
              onClick={() => onNavigate('wallet')}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-colors"
            >
              + Reload
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Live Interactive Leaflet Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <MapComponent
              center={[pickupCoords.lat, pickupCoords.lng]}
              zoom={13}
              pickupCoords={pickupCoords}
              dropCoords={dropCoords}
              className="h-[480px] w-full rounded-2xl overflow-hidden"
            />

            <div className="p-3 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Point A: Pickup
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 ml-3" />
                Point B: Dropoff
              </span>
              <span>Live GPS Simulation</span>
            </div>
          </div>

          {/* Past Explorer Rides */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Explorer Ride Receipts ({ridesHistory.length})
            </h3>

            {ridesHistory.length === 0 ? (
              <p className="text-xs text-slate-400">No rides completed yet.</p>
            ) : (
              <div className="space-y-3">
                {(ridesHistory || []).slice(0, 4).map(r => (
                  <div
                    key={r.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{r.vehicleName}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">#{r.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          r.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {r.pickupAddress} ➔ {r.dropAddress} ({r.distanceKm} km)
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">{formatINR(r.fare)}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">OTP: {r.otp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
