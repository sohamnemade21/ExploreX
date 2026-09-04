import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  CloudSun, 
  ShieldCheck, 
  Star, 
  Heart, 
  ArrowRight, 
  Compass, 
  X, 
  Sparkles, 
  Clock, 
  Utensils, 
  AlertTriangle, 
  MessageSquare,
  ChevronRight,
  TrendingDown,
  Layers,
  Leaf,
  IndianRupee,
  ShoppingBag,
  Palette,
  Shirt,
  Calendar
} from 'lucide-react';
import { Destination, TravelPackage, Review, DynamicPriceResponse } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/Navbar';
import { ReviewModal } from '../components/ReviewModal';
import { DemandBalancerCard } from '../components/DemandBalancerCard';
import { CulturalSpecialtyDiscovery } from '../components/CulturalSpecialtyDiscovery';
import { IndiaTravelHierarchyBrowser } from '../components/IndiaTravelHierarchyBrowser';
import { LocalEconomyDirectoryCard } from '../components/LocalEconomyDirectoryCard';
import { BestTimeEngineCard } from '../components/BestTimeEngineCard';
import { formatINR } from '../utils/currency';

interface DestinationsViewProps {
  initialSearch?: string;
  initialVibe?: string;
  onNavigate: (tab: NavTab, params?: any) => void;
  onBookPackage: (pkg: TravelPackage) => void;
  selectedDestinationFromParent?: Destination | null;
  onClearSelectedDestination?: () => void;
}

type DestinationSubTab = 'catalog' | 'demand_balancer' | 'culture_discovery' | 'india_explorer';

export const DestinationsView: React.FC<DestinationsViewProps> = ({
  initialSearch = '',
  initialVibe = 'all',
  onNavigate,
  onBookPackage,
  selectedDestinationFromParent,
  onClearSelectedDestination
}) => {
  const { user, toggleSaveDestination } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState<string>(initialSearch);
  const [selectedVibe, setSelectedVibe] = useState<string>(initialVibe);
  const [selectedType, setSelectedType] = useState<'all' | 'domestic' | 'international'>('all');
  const [activeSubTab, setActiveSubTab] = useState<DestinationSubTab>('catalog');
  
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(selectedDestinationFromParent || null);
  const [modalTab, setModalTab] = useState<'overview' | 'culture' | 'local_economy' | 'best_time' | 'packages' | 'reviews'>('overview');
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [contextualSuggestions, setContextualSuggestions] = useState<any[]>([]);
  const [dynamicPrices, setDynamicPrices] = useState<Record<string, DynamicPriceResponse>>({});

  // Fetch dynamic prices for visible destinations (lazy, cached)
  useEffect(() => {
    if (destinations.length === 0) return;
    const uncached = destinations.filter(d => !(d.id in dynamicPrices));
    if (uncached.length === 0) return;

    uncached.forEach(d => {
      api.getDynamicPrice(d.id).then(price => {
        setDynamicPrices(prev => ({ ...prev, [d.id]: price }));
      }).catch(() => {});
    });
  }, [destinations]);

  useEffect(() => {
    if (selectedDestinationFromParent) {
      setActiveModalDest(selectedDestinationFromParent);
      setModalTab('overview');
    }
  }, [selectedDestinationFromParent]);

  useEffect(() => {
    const load = async () => {
      try {
        const [destList, pkgList] = await Promise.all([
          api.getDestinations({ search, vibe: selectedVibe, type: selectedType }),
          api.getPackages()
        ]);
        setDestinations(destList);
        setPackages(pkgList);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      }
    };
    load();
  }, [search, selectedVibe, selectedType]);

  // Load reviews & suggestions when active destination modal opens
  useEffect(() => {
    if (activeModalDest) {
      api.getReviews('destination', activeModalDest.id).then(setReviews).catch(() => {});
      api.getContextualSuggestions(activeModalDest.id).then(setContextualSuggestions).catch(() => {});
    }
  }, [activeModalDest]);

  const vibes = [
    { id: 'all', label: 'All Experiences' },
    { id: 'heritage', label: '🏰 Heritage & Forts' },
    { id: 'culinary', label: '🍛 Culinary & Food' },
    { id: 'beach', label: '🏖️ Coastal & Coral' },
    { id: 'nature', label: '🌿 Nature & Valleys' },
    { id: 'wellness', label: '🧘 Wellness & Serenity' },
    { id: 'spiritual', label: '🛕 Spiritual Temples' },
    { id: 'adventure', label: '🧗 Scuba & Trekking' },
    { id: 'shopping', label: '🛍️ GI Handlooms' }
  ];

  const handleSelectFromExplorer = (dest: Destination) => {
    setActiveModalDest(dest);
    setModalTab('overview');
  };

  const handleExploreCultureFromChild = (dest: Destination) => {
    setActiveModalDest(dest);
    setModalTab('culture');
  };

  return (
    <div className="page-container space-y-8 pb-16 bg-white">
      {/* Top View Header & Navigation Switcher */}
      <div className="pt-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#B45F3C] font-bold">
              <Compass className="w-3.5 h-3.5" />
              Places to Visit
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-0.5">
              Destinations & Local Culture
            </h1>
            <p className="font-prose text-xs sm:text-sm text-[#6B6B67] mt-0.5 max-w-2xl">
              Explore smaller towns, heritage sites, regional food, and traditional crafts across India.
            </p>
          </div>

          {/* Primary Functional Tabs */}
          <div className="flex flex-wrap items-center bg-[#F7F7F4] p-1 rounded-lg border border-[#E4E4DF] self-start md:self-auto">
            <button
              id="subtab-catalog"
              onClick={() => setActiveSubTab('catalog')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeSubTab === 'catalog'
                  ? 'bg-[#242424] text-white font-semibold'
                  : 'text-[#6B6B67] hover:text-[#242424]'
              }`}
            >
              All Destinations
            </button>
            <button
              id="subtab-balancer"
              onClick={() => setActiveSubTab('demand_balancer')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeSubTab === 'demand_balancer'
                  ? 'bg-[#5F7564] text-white font-semibold'
                  : 'text-[#6B6B67] hover:text-[#242424]'
              }`}
            >
              Crowd Balancer
            </button>
            <button
              id="subtab-culture"
              onClick={() => setActiveSubTab('culture_discovery')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeSubTab === 'culture_discovery'
                  ? 'bg-[#B45F3C] text-white font-semibold'
                  : 'text-[#6B6B67] hover:text-[#242424]'
              }`}
            >
              Food & Crafts
            </button>
            <button
              id="subtab-hierarchy"
              onClick={() => setActiveSubTab('india_explorer')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeSubTab === 'india_explorer'
                  ? 'bg-[#242424] text-white font-semibold'
                  : 'text-[#6B6B67] hover:text-[#242424]'
              }`}
            >
              State Directory
            </button>
          </div>
        </div>

        {/* Search & Filter Bar (Shown in Catalog mode) */}
        {activeSubTab === 'catalog' && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="destinations-search-input"
                  type="text"
                  placeholder="Search destinations (Sindhudurg, Pune, Kolhapur, Chettinad, Bali, crafts)..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:border-[#242424] focus:outline-none shadow-2xs placeholder:text-[#9A9A96]"
                />
              </div>

              <div className="sm:col-span-4 flex gap-2">
                <select
                  id="destinations-vibe-filter"
                  value={selectedVibe}
                  onChange={e => setSelectedVibe(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#E4E4DF] rounded-xl text-xs font-medium text-[#242424] focus:border-[#242424] focus:outline-none shadow-2xs cursor-pointer"
                >
                  {vibes.map(v => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub-Filters: Domestic/International & Scope */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-[#6B6B67]">Scope:</span>
                {(['all', 'domestic', 'international'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedType === type
                        ? 'bg-[#242424] text-[#FFFFFF] font-bold shadow-2xs'
                        : 'bg-[#F7F7F4] text-[#6B6B67] hover:text-[#242424] border border-[#E4E4DF]'
                    }`}
                  >
                    {type === 'domestic' ? 'India Domestic' : type === 'international' ? 'International' : 'All Curations'}
                  </button>
                ))}
              </div>

              <div className="text-[#6B6B67] text-[11px] font-mono">
                Showing <strong>{destinations.length}</strong> verified sanctuaries
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RENDER ACTIVE TAB CONTENT */}
      {activeSubTab === 'demand_balancer' ? (
        <DemandBalancerCard
          onSelectDestination={handleSelectFromExplorer}
          onExploreCulture={handleExploreCultureFromChild}
        />
      ) : activeSubTab === 'culture_discovery' ? (
        <CulturalSpecialtyDiscovery
          allDestinations={destinations}
          onSelectDestination={handleSelectFromExplorer}
        />
      ) : activeSubTab === 'india_explorer' ? (
        <IndiaTravelHierarchyBrowser
          allDestinations={destinations}
          onSelectDestination={handleSelectFromExplorer}
        />
      ) : (
        /* STANDARD DESTINATIONS CATALOG GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map(dest => {
            const isSaved = user?.savedDestinations?.includes(dest.id);
            return (
              <div
                key={dest.id}
                id={`dest-card-${dest.id}`}
                onClick={() => {
                  setActiveModalDest(dest);
                  setModalTab('overview');
                }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-slate-900 shadow-2xs">
                          {dest.state ? `${dest.state}, India` : dest.country}
                        </span>
                        {dest.tierCategory && (
                          <span className="px-2 py-1 bg-emerald-600/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-white shadow-2xs">
                            {dest.tierCategory}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveDestination(dest.id);
                        }}
                        className="p-1.5 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-rose-600 transition-colors shadow-2xs"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'text-rose-600 fill-rose-600' : ''}`} />
                      </button>
                    </div>

                    {/* Crowds & Weather Badge */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px]">
                        <CloudSun className="w-3.5 h-3.5 text-amber-300" />
                        <span>{dest.currentWeather?.tempC || 27}°C {dest.currentWeather?.condition || 'Clear'}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-900/70 backdrop-blur-md px-2 py-1 rounded-md text-[11px]">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="font-bold">{dest.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {dest.tagline || dest.description}
                      </p>

                      {/* Alternatives / Relief hint */}
                      {dest.whyAlternativeBetter && (
                        <div className="mt-2.5 p-2 bg-amber-50 rounded-lg border border-amber-200/60 text-[11px] text-amber-900 flex items-center gap-1.5 font-medium">
                          <TrendingDown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>Alternative to <strong>{dest.whyAlternativeBetter.replacesFamousSpot}</strong> (-{dest.whyAlternativeBetter.crowdReductionPct}% crowds)</span>
                        </div>
                      )}

                      {/* Vibe Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {dest.vibe.slice(0, 4).map(v => (
                          <span key={v} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Starting Price</span>
                      <span className="text-sm font-black text-slate-900">
                        {formatINR(dest.startingPrice)}
                      </span>
                      {dynamicPrices[dest.id] && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] font-bold text-emerald-700">
                            📈 {formatINR(dynamicPrices[dest.id].predictedPrice)}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">ML</span>
                          {dynamicPrices[dest.id].changeVsBaseline !== 0 && (
                            <span className={`text-[9px] font-bold ${dynamicPrices[dest.id].changeVsBaseline > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                              {dynamicPrices[dest.id].changeVsBaseline > 0 ? '↑' : '↓'}{Math.abs(dynamicPrices[dest.id].changeVsBaseline)}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {dest.culturalSpecialties && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                          🍛 Specialties
                        </span>
                      )}
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DESTINATION DETAILED MODAL */}
      {activeModalDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            {/* Header banner */}
            <div className="relative h-60 sm:h-72 shrink-0 bg-slate-900">
              <img
                src={activeModalDest.heroImage}
                alt={activeModalDest.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                id="modal-close-btn"
                onClick={() => {
                  setActiveModalDest(null);
                  if (onClearSelectedDestination) onClearSelectedDestination();
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-5 left-6 right-6 text-white space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-full">
                    {activeModalDest.state ? `${activeModalDest.state}, India` : activeModalDest.country}
                  </span>
                  {activeModalDest.tierCategory && (
                    <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full">
                      {activeModalDest.tierCategory}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full">
                    Best Time: {activeModalDest.bestMonths.slice(0, 3).join(', ')}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">{activeModalDest.name}</h2>
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">{activeModalDest.tagline || activeModalDest.description}</p>
              </div>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex gap-2 px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0">
              {[
                { id: 'overview', label: '📌 Overview & POIs' },
                { id: 'culture', label: "🍛 What's Famous Here?" },
                { id: 'local_economy', label: '🌿 Local Economy & Homestays' },
                { id: 'best_time', label: '⏰ Best-Time & Budgets' },
                { id: 'packages', label: '📦 Tour Packages' },
                { id: 'reviews', label: `⭐ Reviews (${reviews.length})` }
              ].map(t => (
                <button
                  key={t.id}
                  id={`modal-tab-${t.id}`}
                  onClick={() => setModalTab(t.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    modalTab === t.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              {/* TAB 1: OVERVIEW */}
              {modalTab === 'overview' && (
                <div className="space-y-6">
                  {/* Why alternative is better callout */}
                  {activeModalDest.whyAlternativeBetter && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                        <TrendingDown className="w-4 h-4 text-amber-700" />
                        AI Demand Relief: Alternative to {activeModalDest.whyAlternativeBetter.replacesFamousSpot}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                        {activeModalDest.whyAlternativeBetter.headline}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-amber-200/60 text-xs">
                        <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                          <div className="text-[10px] text-slate-500 font-semibold uppercase">Crowd Reduction</div>
                          <div className="text-sm font-extrabold text-emerald-700">-{activeModalDest.whyAlternativeBetter.crowdReductionPct}% Crowds</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                          <div className="text-[10px] text-slate-500 font-semibold uppercase">Cost Savings</div>
                          <div className="text-sm font-extrabold text-blue-700">~{activeModalDest.whyAlternativeBetter.costSavingsPct}% Savings</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-amber-100 col-span-2 sm:col-span-1">
                          <div className="text-[10px] text-slate-500 font-semibold uppercase">Local Economic Retention</div>
                          <div className="text-sm font-extrabold text-purple-700">{activeModalDest.localEconomicRetentionPct || 85}% Direct</div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                        {activeModalDest.whyAlternativeBetter.environmentalBenefit}
                      </p>
                    </div>
                  )}

                  {/* Weather, Crowd & Safety score overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-slate-400 font-semibold block">Live Weather</span>
                      <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                        <CloudSun className="w-4 h-4 text-amber-500" />
                        {activeModalDest.currentWeather?.tempC || 27}°C, {activeModalDest.currentWeather?.condition || 'Pleasant'}
                      </div>
                      <span className="text-[11px] text-slate-500">AQI: {activeModalDest.currentWeather?.airQualityIndex || 30} (Good)</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-slate-400 font-semibold block">Crowd Forecast</span>
                      <div className="text-base font-bold text-slate-900 capitalize flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        {activeModalDest.crowdPrediction?.currentLevel || 'Moderate'} ({activeModalDest.currentCapacityLoadPct || 45}% load)
                      </div>
                      <span className="text-[11px] text-slate-500">Peak: {activeModalDest.crowdPrediction?.peakHours || '11am - 2pm'}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-slate-400 font-semibold block">Verified Safety</span>
                      <div className="text-base font-bold text-emerald-700 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        {activeModalDest.safetyScore?.overall || 90} / 100
                      </div>
                      <span className="text-[11px] text-slate-500">{activeModalDest.safetyScore?.advisory || 'Safe for families and solo travelers.'}</span>
                    </div>
                  </div>

                  {/* Popular Attractions & POIs */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Must-Visit Heritage Landmarks & Attractions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(activeModalDest.popularAttractions || []).map(attr => (
                        <div key={attr.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3">
                          <img
                            src={attr.image}
                            alt={attr.name}
                            referrerPolicy="no-referrer"
                            className="w-20 h-20 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-slate-900 truncate">{attr.name}</h4>
                              <span className="text-amber-600 font-bold">★ {attr.rating}</span>
                            </div>
                            <p className="text-slate-500 line-clamp-2">{attr.description}</p>
                            <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate-700">
                              <span>⏱️ {attr.estimatedTime}</span>
                              <span>💸 {attr.entryFee > 0 ? formatINR(attr.entryFee) : 'Free Entry'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: WHAT'S FAMOUS HERE */}
              {modalTab === 'culture' && (
                <CulturalSpecialtyDiscovery destination={activeModalDest} />
              )}

              {/* TAB 3: LOCAL ECONOMY & HOMESTAYS */}
              {modalTab === 'local_economy' && (
                <LocalEconomyDirectoryCard destination={activeModalDest} />
              )}

              {/* TAB 4: BEST-TIME & BUDGETS */}
              {modalTab === 'best_time' && (
                <BestTimeEngineCard destination={activeModalDest} />
              )}

              {/* TAB 5: TOUR PACKAGES */}
              {modalTab === 'packages' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Verified Packages for {activeModalDest.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packages.filter(p => p.destinationId === activeModalDest.id || p.destinationId === activeModalDest.name.toLowerCase()).map(pkg => (
                      <div key={pkg.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900">{pkg.title}</h4>
                            <span className="text-xs font-extrabold text-emerald-700">{formatINR(pkg.startingPrice)}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-xs text-slate-600 font-medium">⏱️ {pkg.durationDays}D / {pkg.durationNights}N</span>
                          <button
                            onClick={() => {
                              setActiveModalDest(null);
                              onBookPackage(pkg);
                            }}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                          >
                            Book Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: REVIEWS */}
              {modalTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                      Traveler Reviews ({reviews.length})
                    </h3>

                    <button
                      onClick={() => setReviewModalOpen(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Write a Review
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reviews.map(rev => (
                      <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={rev.userAvatar}
                              alt={rev.userName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="font-bold text-slate-900">{rev.userName}</span>
                          </div>
                          <span className="text-amber-600 font-bold">★ {rev.rating} / 5</span>
                        </div>
                        <p className="text-slate-700">{rev.reviewText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModalOpen && activeModalDest && (
        <ReviewModal
          isOpen={reviewModalOpen}
          targetType="destination"
          targetId={activeModalDest.id}
          targetName={activeModalDest.name}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => {
            setReviewModalOpen(false);
            api.getReviews('destination', activeModalDest.id).then(setReviews);
          }}
        />
      )}
    </div>
  );
};
