import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Search, 
  Filter, 
  Compass, 
  CloudSun, 
  Car, 
  ArrowRight, 
  Star, 
  MapPin,
  Utensils,
  Hotel,
  Sparkles,
  ShoppingBag,
  Calendar,
  DollarSign,
  Info,
  Clock,
  Loader2,
  AlertCircle,
  RotateCcw,
  Tag,
  Award,
  Layers,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { Destination, ExplorePOI, POICategory } from '../types';
import { api } from '../services/api';
import { MapComponent, MapMarker } from '../components/MapComponent';
import { NavTab } from '../components/Navbar';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { formatINR } from '../utils/currency';

interface ExploreViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
  onSelectDestination: (dest: Destination) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onNavigate,
  onSelectDestination
}) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [pois, setPois] = useState<ExplorePOI[]>([]);
  const [whatsFamous, setWhatsFamous] = useState<any | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [selectedDestId, setSelectedDestId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [popularityFilter, setPopularityFilter] = useState<'all' | 'popular' | 'offbeat'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [activeTabSection, setActiveTabSection] = useState<'map' | 'famous' | 'list'>('map');

  // Categories list
  const categories = [
    { id: 'all', label: 'All Markers', icon: '📍' },
    { id: 'Cab', label: '🚕 Cabs & Mobility', icon: '🚕' },
    { id: 'Sightseeing', label: '🏛️ Sightseeing', icon: '🏛️' },
    { id: 'Heritage', label: '⛩️ Heritage & Temples', icon: '⛩️' },
    { id: 'Nature', label: '🌲 Nature & Parks', icon: '🌲' },
    { id: 'Beach', label: '🏖️ Beaches', icon: '🏖️' },
    { id: 'Adventure', label: '🪂 Adventure', icon: '🪂' },
    { id: 'Food', label: '🍛 Local Food & Eateries', icon: '🍛' },
    { id: 'Hotel', label: '🏨 Stays & Homestays', icon: '🏨' },
    { id: 'Craft', label: '🧶 GI Crafts & Artisans', icon: '🧶' },
    { id: 'Experience', label: '✨ Unique Experiences', icon: '✨' },
    { id: 'Event', label: '🎉 Festivals & Events', icon: '🎉' }
  ];

  // Initial load destinations
  useEffect(() => {
    const init = async () => {
      try {
        const dests = await api.getDestinations();
        setDestinations(dests);
        if (dests.length > 0) {
          setSelectedDestId(dests[0].id);
        }
      } catch (err: any) {
        console.error('Failed to load destinations:', err);
        setError('Unable to load destination data.');
      }
    };
    init();
  }, []);

  // Fetch POIs and "What's Famous" when filters change
  const fetchExploreData = async () => {
    setLoading(true);
    setError(null);
    try {
      const poiList = await api.getExplorePOIs({
        destinationId: selectedDestId || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
        minRating: minRating > 0 ? minRating : undefined,
        isOffbeat: popularityFilter === 'offbeat' ? true : undefined,
        isPopular: popularityFilter === 'popular' ? true : undefined
      });
      setPois(poiList || []);

      if (selectedDestId) {
        const famousData = await api.getWhatsFamous(selectedDestId).catch(() => null);
        setWhatsFamous(famousData);
      }
    } catch (err: any) {
      console.error('Failed to load explore data:', err);
      setError(err.message || 'Error connecting to Explore POI service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDestId) {
      fetchExploreData();
    }
  }, [selectedDestId, selectedCategory, popularityFilter, minRating]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExploreData();
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPopularityFilter('all');
    setMinRating(0);
  };

  const currentDest = destinations.find(d => d.id === selectedDestId) || destinations[0];

  // Convert POIs into MapMarkers
  const markers: MapMarker[] = [];
  if (currentDest) {
    // Primary destination marker
    markers.push({
      id: `dest-center-${currentDest.id}`,
      lat: currentDest.lat,
      lng: currentDest.lng,
      title: `${currentDest.name} Center`,
      category: 'Destination Center',
      rating: currentDest.rating,
      image: currentDest.heroImage,
      description: currentDest.tagline
    });

    // POI markers
    pois.forEach(poi => {
      markers.push({
        id: poi.id,
        lat: poi.lat,
        lng: poi.lng,
        title: poi.name,
        category: poi.category,
        rating: poi.rating,
        image: poi.image,
        price: poi.priceLevel,
        description: poi.description
      });
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Map className="w-4 h-4" />
            Interactive Spatial Exploration & POI Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Global Travel Map, Attractions & Local Discoveries
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Discover verified attractions, 5★ stays, authentic food stalls, GI-tagged artisan crafts, and hidden gems.
          </p>
        </div>

        {/* Destination Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Focus Region:</label>
          <select
            value={selectedDestId}
            onChange={e => {
              setSelectedDestId(e.target.value);
              setSelectedMarker(null);
            }}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            {destinations.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.state || d.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search attractions, local food, GI crafts, homestays, festivals..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={popularityFilter}
              onChange={e => setPopularityFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="all">All Spots</option>
              <option value="popular">🔥 Famous Hotspots</option>
              <option value="offbeat">🌿 Hidden Gems</option>
            </select>

            <select
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value={0}>Any Rating</option>
              <option value={4.0}>★ 4.0+</option>
              <option value={4.5}>★ 4.5+</option>
              <option value={4.8}>★ 4.8+ Top Rated</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="p-2 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map & View Container */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section Selector Tabs */}
          <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTabSection('map')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTabSection === 'map'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Map className="w-3.5 h-3.5 text-sky-400" />
                <span>Interactive Map</span>
              </button>
              <button
                onClick={() => setActiveTabSection('famous')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTabSection === 'famous'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>What's Famous Here?</span>
              </button>
              <button
                onClick={() => setActiveTabSection('list')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTabSection === 'list'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>POI Grid ({pois.length})</span>
              </button>
            </div>

            {currentDest?.currentWeather && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-semibold px-3 py-1 bg-amber-50 rounded-xl border border-amber-200/60">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <span>{currentDest.currentWeather.tempC}°C {currentDest.currentWeather.condition}</span>
              </div>
            )}
          </div>

          {/* TAB 1: INTERACTIVE MAP */}
          {activeTabSection === 'map' && (
            <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              {loading ? (
                <div className="h-[540px] flex flex-col items-center justify-center space-y-2 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                  <p className="text-xs font-bold">Loading spatial map markers...</p>
                </div>
              ) : currentDest ? (
                <MapComponent
                  center={[currentDest.lat, currentDest.lng]}
                  zoom={11}
                  markers={markers}
                  className="h-[540px] w-full rounded-2xl overflow-hidden"
                  onMarkerClick={m => setSelectedMarker(m)}
                />
              ) : null}

              {/* Map Footer status */}
              <div className="pt-2 px-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  {markers.length} Verified POIs Loaded for {currentDest?.name}
                </span>

                <button
                  onClick={() => onNavigate('explorer', { destination: currentDest?.name })}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Car className="w-3.5 h-3.5 text-sky-400" />
                  <span>Call Explorer Cab Here</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WHAT'S FAMOUS HERE? */}
          {activeTabSection === 'famous' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Cultural Anthropology & Local Pride</span>
                  <h3 className="text-xl font-black text-slate-900">What's Famous in {currentDest?.name}?</h3>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-200">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
              </div>

              {/* Local Food Specialties */}
              {whatsFamous?.food && whatsFamous.food.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    Authentic Local Food Specialties
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {whatsFamous.food.map((f: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-xs">{f.name}</h5>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${f.isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {f.isVeg ? '🌱 Veg' : '🍗 Non-Veg'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{f.description}</p>
                        {f.mustTryAt && (
                          <div className="text-[10px] font-semibold text-emerald-900 pt-1">
                            📍 Recommended Spot: <strong>{f.mustTryAt}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GI-Tagged Handicrafts */}
              {whatsFamous?.handicrafts && whatsFamous.handicrafts.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-indigo-600" />
                    GI-Tagged Handicrafts & Artisan Guilds
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {whatsFamous.handicrafts.map((craft: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-xs">{craft.name}</h5>
                          {craft.giTagged && (
                            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded-full text-[9px]">
                              🏅 GI-Tagged
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600">{craft.description}</p>
                        {craft.artisanCommunity && (
                          <span className="text-[10px] text-indigo-800 block font-medium">
                            Guild: {craft.artisanCommunity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Festivals & Seasons */}
              {whatsFamous?.festivals && whatsFamous.festivals.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    Grand Cultural Festivals
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {whatsFamous.festivals.map((fest: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-xs">{fest.name}</h5>
                          <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                            {fest.monthOrSeason}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{fest.culturalSignificance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cab & Mobility Stands in Region */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-emerald-600" />
                  Explore Cabs & Micro-Mobility Stands
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pois.filter(p => p.category === 'Cab').map(cabPoi => (
                    <div key={cabPoi.id} className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-900 text-xs">{cabPoi.name}</h5>
                        <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded-full text-[9px]">
                          ₹{cabPoi.priceLevel}/km
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{cabPoi.description}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-500 font-medium">📍 {cabPoi.address}</span>
                        <button
                          onClick={() => onNavigate('explorer', { destination: cabPoi.name })}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Car className="w-3 h-3 text-sky-400" />
                          <span>Book Ride</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POI GRID */}
          {activeTabSection === 'list' && (
            <div className="space-y-4">
              {pois.length === 0 ? (
                <div className="py-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3 p-8">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">No POIs Match Current Filters</h4>
                  <p className="text-xs text-slate-500">Try broadening your search query or switching categories.</p>
                  <button onClick={handleResetFilters} className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold">
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pois.map(poi => (
                    <div
                      key={poi.id}
                      onClick={() => {
                        setSelectedMarker({
                          id: poi.id,
                          lat: poi.lat,
                          lng: poi.lng,
                          title: poi.name,
                          category: poi.category,
                          rating: poi.rating,
                          image: poi.image,
                          price: poi.priceLevel,
                          description: poi.description
                        });
                        setActiveTabSection('map');
                      }}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="relative h-36 rounded-xl overflow-hidden">
                          <ImageWithFallback src={poi.image} alt={poi.name} fallbackCategory={poi.category} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                            {poi.category}
                          </span>
                          {poi.isOffbeat && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase">
                              🌿 Hidden Gem
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{poi.name}</h4>
                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{poi.rating}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{poi.description}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                        <span>{poi.openingHours || 'Open Today'}</span>
                        <span className="font-bold text-sky-600">View on Map →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar Drawer: Selected POI Details / Highlights */}
        <div className="space-y-4">
          {selectedMarker ? (
            <div className="bg-white p-6 rounded-3xl border border-sky-200 ring-2 ring-sky-500/10 shadow-lg space-y-4 animate-in fade-in">
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <img
                  src={selectedMarker.image}
                  alt={selectedMarker.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                  {selectedMarker.category || 'POI Highlight'}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{selectedMarker.title}</h3>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedMarker.rating || 4.8}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {selectedMarker.description || currentDest?.overview}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Estimated Cost</span>
                  <span className="font-bold text-slate-900">
                    {selectedMarker.category === 'Cab'
                      ? `₹${selectedMarker.price || 14}/km`
                      : (selectedMarker.price && selectedMarker.price > 0 ? formatINR(selectedMarker.price) : 'Free Entry')}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Coordinates</span>
                  <span className="font-semibold text-slate-700 text-[10px]">
                    {selectedMarker.lat.toFixed(3)}, {selectedMarker.lng.toFixed(3)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onNavigate('explorer', { destination: selectedMarker.title, lat: selectedMarker.lat, lng: selectedMarker.lng })}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Car className="w-3.5 h-3.5 text-sky-400" />
                  <span>Call Explorer Cab to Spot</span>
                </button>

                <button
                  onClick={() => onNavigate('ai', { destinationId: currentDest?.id, initialPrompt: `Tell me detailed travel tips, best visiting times, and local etiquette for ${selectedMarker.title} in ${currentDest?.name}.` })}
                  className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Concierge About Spot</span>
                </button>
              </div>
            </div>
          ) : (
            currentDest && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="relative h-44 rounded-2xl overflow-hidden">
                  <img
                    src={currentDest.heroImage}
                    alt={currentDest.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                    {currentDest.tierCategory || 'Featured Region'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">{currentDest.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{currentDest.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                    {currentDest.description || currentDest.tagline}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Safety Score</span>
                    <span className="font-bold text-emerald-700">{currentDest.safetyScore?.overall || 92}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Crowd Prediction</span>
                    <span className="font-bold text-slate-800 capitalize">{currentDest.crowdPrediction?.currentStatus || 'Moderate'}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectDestination(currentDest)}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Destination Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          )}

          {/* Quick Highlights list */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Must-Visit POIs in {currentDest?.name}
            </h4>
            <div className="space-y-2">
              {pois.slice(0, 4).map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedMarker({
                      id: p.id,
                      lat: p.lat,
                      lng: p.lng,
                      title: p.name,
                      category: p.category,
                      rating: p.rating,
                      image: p.image,
                      price: p.priceLevel,
                      description: p.description
                    });
                    setActiveTabSection('map');
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                >
                  <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">{p.name}</h5>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span>{p.category}</span>
                      <span>•</span>
                      <span className="text-amber-600 font-bold">★ {p.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
