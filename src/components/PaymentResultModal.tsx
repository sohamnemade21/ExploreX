import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, RefreshCw, XCircle, Clock, ShieldCheck, Download, ArrowRight, X } from 'lucide-react';
import { Booking } from '../types';
import { formatINR } from '../utils/currency';
import { Button } from './ui/Button';

interface PaymentResultModalProps {
  isOpen: boolean;
  status: 'confirmed' | 'pending_reconciliation' | 'failed' | 'cancelled' | null;
  booking: Booking | null;
  errorMessage?: string;
  onClose: () => void;
  onTryAgain?: () => void;
  onViewMyTrips?: () => void;
}

export const PaymentResultModal: React.FC<PaymentResultModalProps> = ({
  isOpen,
  status,
  booking,
  errorMessage,
  onClose,
  onTryAgain,
  onViewMyTrips
}) => {
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    if (!isOpen || status !== 'confirmed') return;
    if (countdown <= 0) {
      onClose();
      if (onViewMyTrips) onViewMyTrips();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [isOpen, status, countdown, onClose, onViewMyTrips]);

  if (!isOpen || !status) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242424]/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-editorial-lg border border-[#E4E4DF] overflow-hidden text-[#242424] my-8 p-6 sm:p-7 space-y-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#F7F7F4] hover:bg-[#E4E4DF] text-[#6B6B67] hover:text-[#242424] transition-colors cursor-pointer border border-[#E4E4DF]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 1. SUCCESS STATE (AMAZON-STYLE BOOKING CONFIRMATION) */}
          {status === 'confirmed' && (
            <div className="text-center space-y-4 pt-2">
              <div className="w-16 h-16 bg-[#EEF2ED] text-[#242424] rounded-full flex items-center justify-center mx-auto border-2 border-[#242424]/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#242424] font-bold block">
                  Booking Confirmed
                </span>
                <h3 className="font-display text-2xl font-bold text-[#242424] mt-1">
                  Your trip is confirmed!
                </h3>
                <p className="font-prose text-xs text-[#6B6B67] mt-1">
                  Your trip to <strong className="text-[#242424]">{booking?.destinationName || 'your destination'}</strong> is confirmed. A detailed confirmation voucher and invoice has been dispatched to your email.
                </p>
              </div>

              {booking && (
                <div className="p-4 bg-white rounded-xl border border-[#E4E4DF] text-left space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-[#F7F7F4] pb-2">
                    <span className="text-[#6B6B67] uppercase text-[10px]">Booking ID</span>
                    <span className="font-bold text-[#242424]">{booking.details?.pnrNumber || `EXX-${booking.id.slice(0, 8).toUpperCase()}`}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#F7F7F4] pb-2">
                    <span className="text-[#6B6B67] uppercase text-[10px]">Destination</span>
                    <span className="font-bold text-[#242424] font-sans">{booking.destinationName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#F7F7F4] pb-2">
                    <span className="text-[#6B6B67] uppercase text-[10px]">Payment</span>
                    <span className="font-bold text-[#242424]">{formatINR(booking.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6B67] uppercase text-[10px]">Status</span>
                    <span className="font-bold text-[#242424] inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#242424] inline-block" />
                      Payment Successful
                    </span>
                  </div>
                </div>
              )}

              <p className="font-prose text-xs text-[#6B6B67] italic">
                Your trip has been added to <strong>My Trips</strong>.
              </p>

              <div className="pt-1 flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    onClose();
                    if (onViewMyTrips) onViewMyTrips();
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-[#242424] hover:bg-[#91482D]"
                >
                  View My Trips {countdown > 0 && `(${countdown}s)`}
                </Button>

                {countdown > 0 && (
                  <div className="text-[11px] font-mono text-[#6B6B67]">
                    Redirecting automatically in {countdown} second{countdown === 1 ? '' : 's'}...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. PENDING RECONCILIATION STATE (Provider Failure Safety Net) */}
          {status === 'pending_reconciliation' && (
            <div className="text-center space-y-4 pt-2">
              <div className="w-14 h-14 bg-amber-50 text-[#91482D] rounded-xl flex items-center justify-center mx-auto border border-amber-200">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#91482D] font-bold block">Payment Received</span>
                <h3 className="font-display text-2xl font-bold text-[#242424] mt-1">Concierge Reconciliation Active</h3>
                <p className="font-prose text-xs text-[#6B6B67] mt-1 italic">
                  Your payment was verified cleanly, but the provider reservation experienced a brief delay.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#E4E4DF] text-left text-xs text-[#242424] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#91482D]">
                  <ShieldCheck className="w-4 h-4 text-[#91482D]" />
                  <span>Payment Record Preserved</span>
                </div>
                <p className="font-prose text-xs text-[#6B6B67] leading-relaxed">
                  Ref #: <strong className="font-mono">{booking?.id || `bk-${Date.now()}`}</strong>. Our 24/7 concierge has opened a priority ticket to resolve room/seat allocation or issue an instant 100% wallet refund.
                </p>
              </div>

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => {
                  onClose();
                  if (onViewMyTrips) onViewMyTrips();
                }}
              >
                Track in My Trips
              </Button>
            </div>
          )}

          {/* 3. FAILED STATE */}
          {status === 'failed' && (
            <div className="text-center space-y-4 pt-2">
              <div className="w-14 h-14 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center mx-auto border border-rose-200">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-rose-700 font-bold block">Payment Authorization Error</span>
                <h3 className="font-display text-2xl font-bold text-[#242424] mt-1">Payment Failed</h3>
                <p className="font-prose text-xs text-[#6B6B67] mt-1 italic">
                  {errorMessage || 'Your payment attempt could not be authorized by the card issuer / UPI network.'}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#E4E4DF] text-left text-xs space-y-1 text-[#6B6B67]">
                <span className="font-semibold text-[#242424] block">Suggested Actions:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-xs font-prose">
                  <li>Verify card details / UPI address</li>
                  <li>Try live UPI QR Code or netbanking option</li>
                  <li>Ensure sufficient balance or active online usage</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    onClose();
                    if (onTryAgain) onTryAgain();
                  }}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="bg-[#242424] hover:bg-[#91482D]"
                >
                  Try Payment Again
                </Button>
              </div>
            </div>
          )}

          {/* 4. CANCELLED STATE */}
          {status === 'cancelled' && (
            <div className="text-center space-y-4 pt-2">
              <div className="w-14 h-14 bg-[#F7F7F4] text-[#6B6B67] rounded-xl flex items-center justify-center mx-auto border border-[#E4E4DF]">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#6B6B67] font-bold block">Checkout Interrupted</span>
                <h3 className="font-display text-2xl font-bold text-[#242424] mt-1">Payment Cancelled</h3>
                <p className="font-prose text-xs text-[#6B6B67] mt-1 italic">
                  You closed the payment checkout session before completion. No charges were made.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={onClose}
                >
                  Return to Booking Checkout
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
