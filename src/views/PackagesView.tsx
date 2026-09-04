import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Check, 
  X, 
  Sparkles, 
  Star, 
  Heart, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  Columns, 
  Info,
  ChevronDown,
  Loader2,
  AlertCircle,
  RotateCcw,
  MapPin,
  Building2,
  Car,
  Clock
} from 'lucide-react';
import { TravelPackage, TravelVibe } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/Navbar';
import { formatINR } from '../utils/currency';
import { Button } from '../components/ui/Button';

interface PackagesViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
  onBookPackage: (pkg: TravelPackage) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  onNavigate,
  onBookPackage
}) => {
  const { user, toggleSavePackage } = useAuth();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [activeDetailPkg, setActiveDetailPkg] = useState<TravelPackage | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.getPackages({
        theme: selectedTheme !== 'all' ? selectedTheme : undefined,
        maxPrice,
        search: searchQuery.trim() || undefined
      });
      setPackages(list || []);
    } catch (err: any) {
      console.error('Failed to load packages:', err);
      setError(err.message || 'Unable to connect to packages database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [selectedTheme, maxPrice]);

  // Debounced search trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPackages();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTheme('all');
    setMaxPrice(200000);
  };

  const themes: { id: string; label: string }[] = [
    { id: 'all', label: 'All Trips' },
    { id: 'beach', label: 'Beach & Coastal' },
    { id: 'mountain', label: 'Mountains & Hills' },
    { id: 'heritage', label: 'Heritage & Culture' },
    { id: 'wellness', label: 'Ayurveda & Retreats' },
    { id: 'adventure', label: 'Adventure & Treks' },
    { id: 'culinary', label: 'Food & Culinary' },
    { id: 'urban', label: 'City Breaks' }
  ];

  const handleToggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(i => i !== id));
    } else {
      if (compareIds.length >= 3) {
        alert('You can compare up to 3 packages at a time.');
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const comparedPackages = packages.filter(p => compareIds.includes(p.id));

  return (
    <div className="page-container space-y-8 pb-16 bg-white">
      {/* Header */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#B45F3C] font-bold">
            <Package className="w-3.5 h-3.5" />
            Trip Packages
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-0.5">
            Curated Trips & Itineraries
          </h1>
          <p className="font-prose text-xs sm:text-sm text-[#6B6B67] mt-0.5 max-w-2xl">
            Multi-day trips with stays, transport, and local activities included.
          </p>
        </div>

        {/* Compare action bar toggle */}
        {compareIds.length > 0 && (
          <div className="flex items-center gap-3 bg-[#F7F7F4] border border-[#E4E4DF] px-4 py-2 rounded-xl shadow-2xs animate-in fade-in">
            <span className="text-xs font-mono font-bold text-[#242424]">
              {compareIds.length} package{compareIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setIsComparing(true)}
              className="px-3 py-1.5 bg-[#242424] hover:bg-[#91482D] text-[#FFFFFF] rounded-lg text-xs font-mono uppercase tracking-wider font-bold shadow-xs transition-colors cursor-pointer"
            >
              Compare Side-by-Side
            </button>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs font-mono text-[#6B6B67] hover:text-[#242424] cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4E4DF] shadow-editorial space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by destination (e.g. Goa, Kerala, Hampi, Kashmir) or expedition title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] placeholder:text-[#9A9A96] focus:outline-none focus:border-[#242424]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#242424] hover:bg-[#91482D] text-[#FFFFFF] rounded-xl text-xs font-mono uppercase tracking-wider font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Packages</span>
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#F7F7F4]">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5">Holiday Theme</label>
            <select
              value={selectedTheme}
              onChange={e => setSelectedTheme(e.target.value)}
              className="w-full p-2.5 bg-[#FFFFFF] border border-[#E4E4DF] rounded-xl text-xs font-medium text-[#242424] focus:outline-none focus:border-[#242424] cursor-pointer"
            >
              {themes.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 font-mono">
              <label className="text-[10px] uppercase tracking-wider text-[#6B6B67]">Max Budget Per Person</label>
              <span className="text-xs font-bold text-[#91482D]">{formatINR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={500000}
              step={5000}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#91482D] cursor-pointer"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => onNavigate('ai', { initialPrompt: 'Recommend the best bespoke expedition for a 1-week couple holiday with ₹60,000 budget' })}
              className="flex-1 py-2.5 bg-[#F7F7F4] hover:bg-[#E4E4DF] text-[#242424] border border-[#E4E4DF] rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#91482D]" />
              <span>Concierge Match</span>
            </button>
            <button
              onClick={handleResetFilters}
              title="Reset Filters"
              className="p-2.5 text-[#6B6B67] hover:text-[#242424] hover:bg-[#F7F7F4] rounded-xl transition-colors border border-[#E4E4DF] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Loading verified packages...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3 max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="text-base font-bold text-rose-900">Failed to Load Packages</h3>
          <p className="text-xs text-rose-700">{error}</p>
          <button
            onClick={fetchPackages}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && packages.length === 0 && (
        <div className="py-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto p-8 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Packages Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No packages match your current search query or budget criteria. Try broadening your filter range.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Packages Grid */}
      {!loading && !error && packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => {
            const isSaved = user?.savedPackages?.includes(pkg.id);
            const isSelectedForCompare = compareIds.includes(pkg.id);
            const heroImage = pkg.images?.[0] || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';
            const durationLabel = `${pkg.durationDays}D / ${pkg.durationNights}N`;

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  isSelectedForCompare ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={heroImage}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {durationLabel}
                      </span>
                      {pkg.isFeatured && (
                        <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full uppercase tracking-wider">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSavePackage(pkg.id)}
                        className="p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-rose-600 transition-colors shadow-sm"
                        title={isSaved ? 'Remove from Saved' : 'Save Package'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'text-rose-600 fill-rose-600' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom badges */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {pkg.theme}
                      </span>
                      <div className="flex items-center gap-1 text-amber-300 text-xs font-bold bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>{pkg.rating?.toFixed(1) || '4.9'}</span>
                        <span className="text-slate-400 text-[10px]">({pkg.reviewCount || 100}+)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-sky-600 uppercase tracking-wide">
                        <MapPin className="w-3 h-3" />
                        <span>{pkg.destinationName}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-0.5">{pkg.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pkg.tagline}</p>
                    </div>

                    {/* Key inclusions checklist */}
                    <div className="space-y-1.5 pt-1">
                      {(pkg.inclusions || []).slice(0, 3).map((item, i) => (
                        <div key={i} className="text-xs text-slate-600 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hotel Preview */}
                    {pkg.hotels && pkg.hotels.length > 0 && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] flex items-center gap-2 text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate font-medium">
                          <strong>Stay:</strong> {pkg.hotels[0].name} ({pkg.hotels[0].stars}★)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0 space-y-3">
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Starting From</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900">{formatINR(pkg.startingPrice)}</span>
                        <span className="text-[10px] text-slate-500">/ person</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant={isSelectedForCompare ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleCompare(pkg.id)}
                        className={isSelectedForCompare ? 'bg-sky-50 border-sky-300 text-sky-700' : ''}
                      >
                        {isSelectedForCompare ? '✓ Selected' : '+ Compare'}
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setActiveDetailPkg(pkg)}
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                      >
                        View Itinerary
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SIDE-BY-SIDE PACKAGE COMPARISON MATRIX MODAL */}
      {isComparing && comparedPackages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Columns className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold">Side-by-Side Package Comparison Matrix</h3>
              </div>
              <button onClick={() => setIsComparing(false)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 w-36 font-bold text-slate-500 uppercase tracking-wider">Feature</th>
                    {comparedPackages.map(p => (
                      <th key={p.id} className="p-3 font-bold text-slate-900 text-sm">
                        {p.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Destination</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3 font-bold text-sky-700">
                        {p.destinationName}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Price Per Person</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3 font-black text-slate-900 text-base">
                        {formatINR(p.startingPrice)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Duration</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3 font-medium text-slate-800">
                        {p.durationDays} Days / {p.durationNights} Nights
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Hotel Accommodation</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3 font-medium text-slate-800">
                        {p.hotels?.[0]?.name ? `${p.hotels[0].name} (${p.hotels[0].stars}★)` : 'Luxury Verified Stay'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Key Inclusions</td>
                    {comparedPackages.map(p => (
                      <td key={p.id} className="p-3">
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          {(p.inclusions || []).slice(0, 4).map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED ITINERARY MODAL */}
      {activeDetailPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="relative h-60 shrink-0">
              <img
                src={activeDetailPkg.images?.[0] || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'}
                alt={activeDetailPkg.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setActiveDetailPkg(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-slate-900 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {activeDetailPkg.theme}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {activeDetailPkg.durationDays} Days / {activeDetailPkg.durationNights} Nights • {activeDetailPkg.destinationName}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black">{activeDetailPkg.title}</h2>
                <p className="text-xs text-slate-300 line-clamp-1">{activeDetailPkg.tagline}</p>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Price Breakdown */}
              {activeDetailPkg.priceBreakdown && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-sky-600" />
                    Transparent Price Breakdown (Per Person)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">🏨 5★ Accommodation</span>
                      <span className="font-black text-slate-900">{formatINR(activeDetailPkg.priceBreakdown.hotelStay)}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">🚗 Transport & Transfers</span>
                      <span className="font-black text-slate-900">{formatINR(activeDetailPkg.priceBreakdown.transport)}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">🎟️ Guided Excursions</span>
                      <span className="font-black text-slate-900">{formatINR(activeDetailPkg.priceBreakdown.activities)}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">🍽️ Curated Meals</span>
                      <span className="font-black text-slate-900">{formatINR(activeDetailPkg.priceBreakdown.meals)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Day by Day schedule */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  Day-by-Day Detailed Itinerary
                </h3>
                <div className="space-y-3">
                  {(activeDetailPkg.itinerary || []).map(day => (
                    <div key={day.dayNumber} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md text-[11px]">
                          Day {day.dayNumber}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{day.title}</h4>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{day.description}</p>
                      
                      {day.activities && day.activities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {day.activities.map((act, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-medium text-slate-700">
                              • {act}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 font-medium border-t border-slate-200/60 mt-2">
                        {day.stayHotel && <span>🏨 Stay: <strong>{day.stayHotel}</strong></span>}
                        {day.mealsIncluded && day.mealsIncluded.length > 0 && (
                          <span>🍽️ Meals: <strong>{day.mealsIncluded.join(', ')}</strong></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions / Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-emerald-900 uppercase tracking-wider text-[11px]">Included in Package</h4>
                  <ul className="space-y-1.5 text-emerald-800">
                    {(activeDetailPkg.inclusions || []).map((inc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-2">
                  <h4 className="font-bold text-rose-900 uppercase tracking-wider text-[11px]">Exclusions</h4>
                  <ul className="space-y-1.5 text-rose-800">
                    {(activeDetailPkg.exclusions || []).map((exc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <X className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium uppercase">Starting Price Per Person</span>
                <span className="text-2xl font-black text-slate-900">
                  {formatINR(activeDetailPkg.startingPrice)} <span className="text-xs font-normal text-slate-500">/ person</span>
                </span>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setActiveDetailPkg(null);
                  onNavigate('bookings');
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Book Flights, Trains or Hotels
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
