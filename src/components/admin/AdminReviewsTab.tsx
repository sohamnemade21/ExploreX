import React, { useState } from 'react';
import { 
  Star, 
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { Review } from '../../types';

interface AdminReviewsTabProps {
  reviews: Review[];
  totalReviews: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  ratingFilter: number | null;
  onRatingFilterChange: (r: number | null) => void;
  onDeleteReview: (reviewId: string) => Promise<void>;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({
  reviews,
  totalReviews,
  searchQuery,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  onDeleteReview
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this review? This action will be audited.')) {
      return;
    }
    setDeletingId(id);
    try {
      await onDeleteReview(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Customer Reviews & Content Moderation</h3>
            <p className="text-xs text-stone-500">
              Audit and moderate traveler feedback, verify booking authentications, and prune spam or offensive commentary.
            </p>
          </div>

          <span className="text-xs font-mono font-medium text-stone-500">
            {reviews.length} reviews displayed
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer, review keywords, or destination..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-xs text-stone-800 transition focus:outline-hidden focus:border-stone-400"
            />
          </div>

          {/* Rating filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => onRatingFilterChange(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                ratingFilter === null ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Ratings
            </button>
            {[5, 4, 3, 2, 1].map(r => (
              <button
                key={r}
                onClick={() => onRatingFilterChange(r)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                  ratingFilter === r ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {r} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map(rev => (
          <div 
            key={rev.id}
            className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-stone-900">{rev.userName}</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500 font-medium capitalize">
                  {rev.targetName} ({rev.targetType})
                </span>
                {rev.verifiedBooking && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Verified Traveler
                  </span>
                )}
                <span className="text-stone-400 text-[10px] ml-auto sm:ml-0 font-mono">
                  {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star 
                    key={s} 
                    className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} 
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-stone-700 leading-relaxed font-sans text-xs pt-1">
                "{rev.reviewText}"
              </p>

              <div className="text-[10px] text-stone-400 font-mono pt-1">
                Review ID: {rev.id} • Author ID: {rev.userId}
              </div>
            </div>

            {/* Moderation Actions */}
            <div className="sm:border-l sm:border-stone-100 sm:pl-4 shrink-0 flex sm:flex-col justify-end gap-2">
              <button
                onClick={() => handleDelete(rev.id)}
                disabled={deletingId === rev.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-lg transition cursor-pointer text-xs disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deletingId === rev.id ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="p-12 text-center text-stone-400 bg-white rounded-2xl border border-stone-200">
            No customer reviews match your active filter.
          </div>
        )}
      </div>
    </div>
  );
};
