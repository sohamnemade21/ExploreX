import React, { useState } from 'react';
import { Compass, Hotel, Utensils, Landmark, Sun } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackCategory?: string;
  onClick?: () => void;
}

const CURATED_FALLBACK_IMAGES: Record<string, string> = {
  heritage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
  temple: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  fort: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  beach: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  nature: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  mountain: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
  coffee: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
  food: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
};

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackCategory,
  onClick
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [hasFailedCurated, setHasFailedCurated] = useState<boolean>(false);

  const getCuratedFallback = (): string => {
    const cat = (fallbackCategory || alt || '').toLowerCase();
    if (cat.includes('hotel') || cat.includes('resort') || cat.includes('stay')) return CURATED_FALLBACK_IMAGES.hotel;
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('cafe')) return CURATED_FALLBACK_IMAGES.food;
    if (cat.includes('fort') || cat.includes('palace')) return CURATED_FALLBACK_IMAGES.fort;
    if (cat.includes('temple') || cat.includes('shrine') || cat.includes('spiritual')) return CURATED_FALLBACK_IMAGES.temple;
    if (cat.includes('heritage') || cat.includes('monument') || cat.includes('hampi')) return CURATED_FALLBACK_IMAGES.heritage;
    if (cat.includes('coffee') || cat.includes('coorg') || cat.includes('estate') || cat.includes('plantation')) return CURATED_FALLBACK_IMAGES.coffee;
    if (cat.includes('beach') || cat.includes('coastal') || cat.includes('sea')) return CURATED_FALLBACK_IMAGES.beach;
    if (cat.includes('mountain') || cat.includes('hill') || cat.includes('valley')) return CURATED_FALLBACK_IMAGES.mountain;
    return CURATED_FALLBACK_IMAGES.default;
  };

  const handleError = () => {
    const fallback = getCuratedFallback();
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    } else {
      setHasFailedCurated(true);
    }
  };

  const getFallbackIcon = () => {
    const cat = (fallbackCategory || '').toLowerCase();
    if (cat.includes('hotel') || cat.includes('stay')) return <Hotel className="w-8 h-8 text-sky-400" />;
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('cafe')) return <Utensils className="w-8 h-8 text-amber-400" />;
    if (cat.includes('heritage') || cat.includes('fort') || cat.includes('temple')) return <Landmark className="w-8 h-8 text-amber-500" />;
    if (cat.includes('beach') || cat.includes('nature')) return <Sun className="w-8 h-8 text-emerald-400" />;
    return <Compass className="w-8 h-8 text-sky-400" />;
  };

  if (hasFailedCurated || (!currentSrc && !src)) {
    return (
      <div
        onClick={onClick}
        className={`bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
      >
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-1 border border-white/10">
          {getFallbackIcon()}
        </div>
        <span className="text-[11px] font-bold text-slate-200 line-clamp-1">{alt}</span>
        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">ExploreX Verified Experience</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc || getCuratedFallback()}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={handleError}
      onClick={onClick}
      className={className}
    />
  );
};
