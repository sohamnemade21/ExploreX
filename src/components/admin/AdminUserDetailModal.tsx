import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Wallet, 
  Compass, 
  Plane, 
  Building2, 
  Car, 
  Train,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { AdminUserDetail, Booking } from '../../types';
import { formatINR } from '../../utils/currency';

interface AdminUserDetailModalProps {
  detail: AdminUserDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking: (booking: Booking) => void;
}

export const AdminUserDetailModal: React.FC<AdminUserDetailModalProps> = ({
  detail,
  isOpen,
  onClose,
  onSelectBooking
}) => {
  if (!isOpen || !detail) return null;

  const { user, bookings, rides, totalSpent, tripCount } = detail;

  const serviceIcons: Record<string, any> = {
    flight: Plane,
    hotel: Building2,
    explorer: Car,
    package: Compass,
    train: Train,
    bus: Car
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-stone-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-stone-100 text-stone-700 rounded-xl">
              <User className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-stone-900">{user.name}</h3>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="font-mono">ID: {user.id}</span>
                <span>•</span>
                <span className="capitalize font-semibold text-stone-700">{user.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Profile Card & Registration Details */}
          <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Registration & Profile Dossier
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Zero Password/Credential Exposure
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold uppercase">
                  <Mail className="w-3 h-3" /> Email Address
                </div>
                <div className="font-semibold text-stone-900 mt-0.5 truncate">{user.email}</div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold uppercase">
                  <Phone className="w-3 h-3" /> Phone Contact
                </div>
                <div className="font-semibold text-stone-900 mt-0.5">{user.phone || 'Not recorded'}</div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold uppercase">
                  <MapPin className="w-3 h-3" /> Home Base
                </div>
                <div className="font-semibold text-stone-900 mt-0.5">{user.homeCity || 'India'}</div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold uppercase">
                  <Calendar className="w-3 h-3" /> Member Since
                </div>
                <div className="font-semibold text-stone-900 mt-0.5">{user.joinedDate || '2025'}</div>
              </div>
            </div>

            {/* Lifetime metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white rounded-lg border border-stone-200 text-center">
                <div className="text-[10px] uppercase font-bold text-stone-400">Total Lifetime Value</div>
                <div className="text-base font-bold text-stone-900 mt-0.5">{formatINR(totalSpent)}</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200 text-center">
                <div className="text-[10px] uppercase font-bold text-stone-400">Completed Trips</div>
                <div className="text-base font-bold text-stone-900 mt-0.5">{tripCount}</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200 text-center">
                <div className="text-[10px] uppercase font-bold text-stone-400">Wallet Balance</div>
                <div className="text-base font-bold text-emerald-700 mt-0.5">
                  {formatINR(typeof user.walletBalance === 'number' ? user.walletBalance : 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Complete Trip History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Full Trip & Booking Record ({bookings.length})
              </h4>
              <span className="text-[11px] text-stone-400">Ordered by travel schedule</span>
            </div>

            <div className="space-y-2">
              {bookings.map(bkg => {
                const Icon = serviceIcons[bkg.serviceType] || Compass;

                return (
                  <div
                    key={bkg.id}
                    onClick={() => onSelectBooking(bkg)}
                    className="p-3.5 bg-white hover:bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-stone-100 text-stone-700 rounded-lg shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">#{bkg.id}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                            bkg.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                            bkg.status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {bkg.status}
                          </span>
                        </div>
                        <div className="font-medium text-stone-800 mt-0.5">{bkg.title}</div>
                        <div className="text-[11px] text-stone-400">
                          {bkg.destinationName} • Travel date: {bkg.travelDate}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-stone-900">{formatINR(bkg.totalAmount)}</div>
                      <div className="text-[10px] text-stone-400 uppercase">{bkg.paymentMethod}</div>
                    </div>
                  </div>
                );
              })}

              {bookings.length === 0 && (
                <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  No reservations logged under this customer account.
                </div>
              )}
            </div>
          </div>

          {/* Explorer Cab Rides History */}
          {rides && rides.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Explorer Mobility Rides ({rides.length})
              </h4>
              <div className="space-y-2">
                {rides.map(r => (
                  <div key={r.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-stone-800">{r.pickupAddress} → {r.dropAddress}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {r.vehicleName} • {r.distanceKm} km • {new Date(r.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-stone-900">{formatINR(r.fare)}</div>
                      <span className="text-[10px] text-emerald-600 font-medium capitalize">{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close */}
          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-xl transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
