import React, { useState } from 'react';
import { 
  X, 
  Plane, 
  Building2, 
  Car, 
  Compass, 
  Train, 
  CreditCard, 
  Mail, 
  FileText, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  User,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Booking } from '../../types';
import { formatINR } from '../../utils/currency';

interface AdminBookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string, note?: string) => Promise<void>;
  onCancelAndRefund: (id: string, reason: string) => Promise<void>;
  onResendEmail: (id: string, recipientEmail?: string) => Promise<void>;
  onInspectCustomer: (userId: string) => void;
}

export const AdminBookingDetailModal: React.FC<AdminBookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
  onUpdateStatus,
  onCancelAndRefund,
  onResendEmail,
  onInspectCustomer
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !booking) return null;

  const baseFare = booking.invoice?.baseFare || Math.round(booking.totalAmount * 0.82);
  const taxes = booking.invoice?.taxes || Math.round(booking.totalAmount * 0.18);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please specify an administrative cancellation reason for audit trail.');
      return;
    }
    setIsProcessing(true);
    try {
      await onCancelAndRefund(booking.id, cancelReason);
      setShowCancelPrompt(false);
      setCancelReason('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResend = async () => {
    setIsProcessing(true);
    try {
      await onResendEmail(booking.id, customEmail || undefined);
      setShowEmailPrompt(false);
      setCustomEmail('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async (targetStatus: string) => {
    setIsProcessing(true);
    try {
      await onUpdateStatus(booking.id, targetStatus, statusUpdateNote || undefined);
      setNewStatus('');
      setStatusUpdateNote('');
    } finally {
      setIsProcessing(false);
    }
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
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 uppercase">
              #{booking.id}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
              booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              booking.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
              'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {booking.status}
            </span>
            <span className="text-xs text-stone-400 capitalize font-medium">
              {booking.serviceType} Reservation
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Title & Key Specs */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-xl font-bold text-stone-900">{booking.title}</h3>
              <p className="text-xs text-stone-500 mt-1">
                Destination: <span className="font-semibold text-stone-700">{booking.destinationName}</span>
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-stone-600">
                <span>Booked: {new Date(booking.bookingDate).toLocaleDateString('en-IN')}</span>
                <span>•</span>
                <span>Travel Date: {booking.travelDate}</span>
                {booking.returnDate && (
                  <>
                    <span>•</span>
                    <span>Return: {booking.returnDate}</span>
                  </>
                )}
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-stone-100 sm:pl-6">
              <div className="text-xs uppercase tracking-wider text-stone-400 font-medium">Grand Total Paid</div>
              <div className="text-2xl font-bold text-stone-900">{formatINR(booking.totalAmount)}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                Base: {formatINR(baseFare)} + GST: {formatINR(taxes)}
              </div>
            </div>
          </div>

          {/* Customer & Passenger Manifest */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-stone-600" />
                Customer & Passenger Manifest
              </div>
              <button
                onClick={() => onInspectCustomer(booking.userId)}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 underline cursor-pointer"
              >
                Inspect Customer Profile #{booking.userId}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <div className="text-stone-400 text-[10px] uppercase font-bold">Primary Account ID</div>
                <div className="font-medium text-stone-800 mt-0.5">{booking.userId}</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <div className="text-stone-400 text-[10px] uppercase font-bold">Party Size</div>
                <div className="font-medium text-stone-800 mt-0.5">{booking.passengersCount} Guest(s)</div>
              </div>
            </div>

            {booking.passengerDetails && booking.passengerDetails.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="text-[11px] font-semibold text-stone-700">Passenger Names & Assigned Seats:</div>
                <div className="divide-y divide-stone-200/60 bg-white rounded-lg border border-stone-200 text-xs">
                  {booking.passengerDetails.map((p, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between">
                      <span className="font-medium text-stone-800">{p.name} ({p.gender}, {p.age} yrs)</span>
                      <span className="font-mono text-stone-500 text-[11px]">Seat: {p.seatNumber || 'Standard'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Service Provider & Itinerary Specifics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Vertical Service Logistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {booking.details?.airline && (
                <div className="p-3 rounded-lg border border-stone-200 bg-white">
                  <span className="text-stone-400 text-[10px] uppercase font-bold">Airline & Flight</span>
                  <div className="font-semibold text-stone-800 mt-0.5">{booking.details.airline} • {booking.details.flightNumber || 'Direct'}</div>
                </div>
              )}
              {booking.details?.hotelName && (
                <div className="p-3 rounded-lg border border-stone-200 bg-white">
                  <span className="text-stone-400 text-[10px] uppercase font-bold">Hotel Property</span>
                  <div className="font-semibold text-stone-800 mt-0.5">{booking.details.hotelName}</div>
                </div>
              )}
              {booking.details?.roomType && (
                <div className="p-3 rounded-lg border border-stone-200 bg-white">
                  <span className="text-stone-400 text-[10px] uppercase font-bold">Room Category</span>
                  <div className="font-semibold text-stone-800 mt-0.5">{booking.details.roomType}</div>
                </div>
              )}
              {booking.details?.pnrNumber && (
                <div className="p-3 rounded-lg border border-stone-200 bg-white">
                  <span className="text-stone-400 text-[10px] uppercase font-bold">Carrier PNR</span>
                  <div className="font-mono font-bold text-stone-800 mt-0.5">{booking.details.pnrNumber}</div>
                </div>
              )}
              {booking.details?.departureStation && (
                <div className="p-3 rounded-lg border border-stone-200 bg-white">
                  <span className="text-stone-400 text-[10px] uppercase font-bold">Origin Station</span>
                  <div className="font-medium text-stone-800 mt-0.5">{booking.details.departureStation}</div>
                </div>
              )}
              {booking.details?.arrivalStation && (
                <div className="p-3 rounded-lg border border-stone-200 bg-white">
                  <span className="text-stone-400 text-[10px] uppercase font-bold">Destination Station</span>
                  <div className="font-medium text-stone-800 mt-0.5">{booking.details.arrivalStation}</div>
                </div>
              )}
            </div>
          </div>

          {/* Secure Payment & Razorpay Gateway Details */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5 text-stone-600" />
                Payment Gateway & Settlement Reference
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Zero Sensitive Credentials Exposed
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <div className="text-stone-400 text-[10px] uppercase font-bold">Payment Method</div>
                <div className="font-medium text-stone-800 mt-0.5 uppercase">{booking.paymentMethod}</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <div className="text-stone-400 text-[10px] uppercase font-bold">Payment Status</div>
                <div className={`font-semibold mt-0.5 capitalize ${
                  booking.paymentStatus === 'paid' ? 'text-emerald-700' :
                  booking.paymentStatus === 'refunded' ? 'text-blue-700' : 'text-amber-700'
                }`}>
                  {booking.paymentStatus}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <div className="text-stone-400 text-[10px] uppercase font-bold">Tax Invoice No.</div>
                <div className="font-mono text-stone-800 mt-0.5">{booking.invoice?.invoiceNo || `EXP-INV-${booking.id}`}</div>
              </div>
            </div>

            {/* Razorpay specific IDs */}
            <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1 text-xs">
              <div className="text-stone-400 text-[10px] uppercase font-bold">Razorpay Transaction Identifiers</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700 font-mono text-[11px]">
                <div>
                  <span className="text-stone-400 font-sans">Payment ID: </span>
                  <span className="font-semibold">{booking.details?.razorpayPaymentId || booking.details?.paymentId || 'pay_exp_verified_demo'}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-sans">Order ID: </span>
                  <span className="font-semibold">{booking.details?.razorpayOrderId || 'order_exp_verified_demo'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Notification Dispatch Status */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-stone-600" />
                Email Confirmation & Notification Log
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                booking.emailStatus === 'sent' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                booking.emailStatus === 'failed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                'bg-stone-100 text-stone-600'
              }`}>
                Status: {booking.emailStatus || 'sent'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200">
              <div>
                <div className="text-stone-500">Recipient Dispatch:</div>
                <div className="font-medium text-stone-800">{booking.emailRecipient || 'traveler@explorex.com'}</div>
                {booking.emailSentAt && (
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    Dispatched on {new Date(booking.emailSentAt).toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowEmailPrompt(!showEmailPrompt)}
                className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-800 rounded-lg border border-stone-300 transition cursor-pointer self-start sm:self-auto"
              >
                Resend Confirmation Email
              </button>
            </div>

            {showEmailPrompt && (
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2 text-xs">
                <div className="font-medium text-blue-900">Resend Confirmation & PDF Itinerary:</div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter custom email or leave blank for default"
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={handleResend}
                    disabled={isProcessing}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition cursor-pointer disabled:opacity-50"
                  >
                    Dispatch Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cancellation & Refund Block */}
          {booking.status !== 'cancelled' ? (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Administrative Cancellation & Refund
                </div>
              </div>
              <p className="text-xs text-rose-700">
                Cancelling this booking will immediately return {formatINR(booking.totalAmount)} into the customer's wallet and record a permanent audit entry.
              </p>

              {!showCancelPrompt ? (
                <button
                  onClick={() => setShowCancelPrompt(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition cursor-pointer"
                >
                  Initiate Full Refund & Cancel
                </button>
              ) : (
                <div className="space-y-2 pt-2 border-t border-rose-200">
                  <label className="text-xs font-semibold text-rose-900 block">
                    Reason for cancellation (required for compliance audit log):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Flight schedule disruption / Traveler medical waiver"
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    className="w-full p-2.5 bg-white border border-rose-300 rounded-lg text-xs text-stone-900"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={isProcessing || !cancelReason.trim()}
                      className="px-4 py-1.5 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing Refund...' : 'Confirm & Issue Refund'}
                    </button>
                    <button
                      onClick={() => setShowCancelPrompt(false)}
                      className="px-3 py-1.5 bg-white text-stone-600 hover:text-stone-800 text-xs rounded-lg border border-stone-200 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-600 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-stone-400" />
              <span>This booking was cancelled and refunded. Settlement reconciliation complete.</span>
            </div>
          )}

          {/* Quick PDF Invoice & Direct Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
            <a
              href={`/api/v1/bookings/${booking.id}/invoice.pdf`}
              download
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900 underline cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Download GST Tax Invoice PDF
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
