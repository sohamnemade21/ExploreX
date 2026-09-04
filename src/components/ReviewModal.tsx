import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Review } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'destination' | 'package' | 'hotel' | 'explorer';
  targetId: string;
  targetName: string;
  onReviewAdded: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
  onReviewAdded
}) => {
  const { success, error } = useToast();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const words = reviewText.trim() ? reviewText.trim().split(/\s+/).length : 0;
  const isTooLong = words > 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTooLong) {
      error('Review Too Long', 'Please limit your review to 100 words or less.');
      return;
    }

    setLoading(true);
    try {
      const created = await api.createReview({
        targetType,
        targetId,
        targetName,
        rating,
        reviewText
      });
      success('Review Published!', 'Thank you for sharing your authentic feedback.');
      onReviewAdded(created);
      onClose();
    } catch (err: any) {
      error('Review Error', err.message || 'Could not submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">Leave a Review</span>
            <h3 className="text-lg font-bold text-white mt-1">{targetName}</h3>
            <p className="text-xs text-slate-400 capitalize">Category: {targetType}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Star selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Overall Rating (1 - 5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-slate-700 ml-2">{rating}.0 / 5.0</span>
              </div>
            </div>

            {/* Review text */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                  Your Experience Feedback
                </label>
                <span className={`text-[11px] font-mono font-medium ${isTooLong ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                  {words}/100 words
                </span>
              </div>
              <textarea
                required
                rows={4}
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Describe the atmosphere, service, accessibility, highlights, or tips for fellow travelers..."
                className={`w-full p-3 bg-slate-50 border rounded-2xl text-xs leading-relaxed focus:outline-none focus:bg-white transition-all ${
                  isTooLong ? 'border-rose-500 focus:ring-2 focus:ring-rose-400' : 'border-slate-200 focus:ring-2 focus:ring-sky-500'
                }`}
              />
              {isTooLong && (
                <div className="text-[11px] text-rose-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Please trim your review to stay under the 100-word limit.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || isTooLong}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {loading ? 'Publishing...' : 'Submit Verified Review'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
