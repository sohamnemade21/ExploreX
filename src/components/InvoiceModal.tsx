import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, AlertTriangle, ShieldCheck, Ticket, CheckCircle2, QrCode } from 'lucide-react';
import { Booking } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/currency';

interface InvoiceModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingCancelled?: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  booking,
  isOpen,
  onClose,
  onBookingCancelled
}) => {
  const { refreshProfile } = useAuth();
  const { success, error } = useToast();
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen || !booking) return null;

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      const res = await api.cancelBooking(booking.id);
      await refreshProfile();
      success('Booking Cancelled', `${formatINR(res.refundAmount)} refunded instantly to your ExploreX Wallet.`);
      setShowCancelConfirm(false);
      if (onBookingCancelled) onBookingCancelled();
      onClose();
    } catch (err: any) {
      error('Cancellation Failed', err.message);
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto print:bg-white print:p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:shadow-none print:border-none print:m-0"
        >
          {/* Header Action Bar */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Ticket className="w-4 h-4" />
              Verified Electronic Ticket & Tax Invoice
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="p-8 space-y-6 text-slate-800" id="printable-invoice">
            {/* Top Brand Banner */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span>Explore</span>
                  <span className="text-sky-600 font-extrabold">X</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">AI-Powered Personalized Tourism Platform</p>
                <div className="mt-2 text-[11px] text-slate-400">
                  GST / Tax ID: EX-TAX-9941829 • Support: support@explorex.com
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                  booking.status === 'completed' ? 'bg-sky-100 text-sky-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {booking.status}
                </span>
                <div className="text-xs text-slate-500 mt-2 font-mono">Invoice #{booking.invoice?.invoiceNo || 'INV-001'}</div>
                <div className="text-xs text-slate-400">Booking Ref: <span className="font-bold text-slate-700 font-mono">{booking.id}</span></div>
              </div>
            </div>

            {/* Travel Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <div className="text-slate-400 font-medium">Service</div>
                <div className="font-bold text-slate-900 capitalize mt-0.5">{booking.serviceType}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">Travel Date</div>
                <div className="font-bold text-slate-900 mt-0.5">{booking.travelDate}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">Destination</div>
                <div className="font-bold text-slate-900 mt-0.5">{booking.destinationName}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">Payment Status</div>
                <div className="font-bold text-emerald-600 mt-0.5 uppercase">{booking.paymentStatus}</div>
              </div>
            </div>

            {/* Booking Title & Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">{booking.title}</h3>
              {booking.details && (
                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  {booking.details.hotelName && <div>🏨 Hotel: <span className="font-semibold text-slate-800">{booking.details.hotelName}</span></div>}
                  {booking.details.packageDuration && <div>⏱️ Duration: <span className="font-semibold text-slate-800">{booking.details.packageDuration}</span></div>}
                  {booking.details.pnrNumber && <div>🎫 PNR / Code: <span className="font-semibold text-slate-800 font-mono">{booking.details.pnrNumber}</span></div>}
                  {booking.details.boardingPoint && <div>🚗 Pickup: <span className="font-semibold text-slate-800">{booking.details.boardingPoint}</span></div>}
                </div>
              )}
            </div>

            {/* Passenger List */}
            {booking.passengerDetails && booking.passengerDetails.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Guest / Passenger Manifest</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Name</th>
                        <th className="p-2.5">Age</th>
                        <th className="p-2.5">Gender</th>
                        <th className="p-2.5">Seat / Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {booking.passengerDetails.map((p, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-medium text-slate-900">{p.name}</td>
                          <td className="p-2.5 text-slate-600">{p.age} yrs</td>
                          <td className="p-2.5 text-slate-600">{p.gender}</td>
                          <td className="p-2.5 text-slate-600 font-mono">{p.seatNumber || `Confirmed Slot ${idx + 1}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Itemized Price Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Itemized Charges</h4>
              <div className="space-y-2 text-xs border-t border-b border-slate-200 py-3">
                <div className="flex justify-between text-slate-600">
                  <span>Base Fare ({booking.passengersCount} traveler{booking.passengersCount > 1 ? 's' : ''})</span>
                  <span>{formatINR(booking.invoice?.baseFare ?? booking.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes & Tourism Verification (8%)</span>
                  <span>{formatINR(booking.invoice?.taxes ?? 0)}</span>
                </div>
                {(booking.invoice?.discounts || 0) > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Special Offer Discount</span>
                    <span>-{formatINR(booking.invoice?.discounts ?? 0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Paid ({booking.paymentMethod.replace('_', ' ')})</span>
                  <span className="text-sky-600">{formatINR(booking.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Footer Notice & QR Simulation */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-500 max-w-sm">
                <p className="font-semibold text-slate-700">Cancellation Policy:</p>
                <p>Free instant cancellation up to 24 hours prior to departure. 100% refund credited back to your ExploreX Wallet balance.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center p-1 mx-auto">
                  <QrCode className="w-12 h-12 text-slate-700" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">Scan e-Ticket</span>
              </div>
            </div>
          </div>

          {/* Cancellation section */}
          {booking.status === 'confirmed' && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 print:hidden flex items-center justify-between">
              {showCancelConfirm ? (
                <div className="flex items-center justify-between w-full gap-3">
                  <div className="text-xs text-rose-700 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Confirm cancellation? {formatINR(booking.totalAmount)} will be refunded to your ExploreX Wallet.
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                    >
                      Keep Booking
                    </button>
                    <button
                      onClick={handleCancelBooking}
                      disabled={cancelling}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      {cancelling ? 'Refunding...' : 'Confirm & Refund'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-slate-500">Need to change plans?</span>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Cancel Booking & Refund
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
