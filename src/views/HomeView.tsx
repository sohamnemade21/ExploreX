import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Car, 
  ArrowRight, 
  Heart, 
  Star, 
  Clock, 
  Users, 
  CloudSun, 
  Compass, 
  Activity, 
  ChevronRight,
  Zap,
  TrendingDown,
  Utensils,
  ShoppingBag,
  Leaf,
  Layers,
  HeartHandshake,
  CheckCircle,
  BookOpen,
  Feather,
  Globe
} from 'lucide-react';
import { Destination, TravelPackage, Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/Navbar';
import { formatINR } from '../utils/currency';
import { Button } from '../components/ui/Button';

interface HomeViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
  onBookPackage: (pkg: TravelPackage) => void;
  onSelectDestination: (dest: Destination) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onBookPackage,
  onSelectDestination
}) => {
  const { user, toggleSaveDestination } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destData, pkgData, revData] = await Promise.all([
          api.getDestinations(),
          api.getPackages(),
          api.getReviews()
        ]);
        setDestinations(destData || []);
        setPackages(pkgData || []);
        setReviews((revData || []).slice(0, 3));
      } catch (err) {
        console.error('Home data load error:', err);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('destinations', { search: searchQuery, vibe: selectedVibe });
  };

  const vibes = [
    { id: 'all', label: 'All Trips' },
    { id: 'heritage', label: 'Heritage & Forts' },
    { id: 'culinary', label: 'Local Food' },
    { id: 'beach', label: 'Coastal & Beaches' },
    { id: 'nature', label: 'Mountains & Nature' },
    { id: 'wellness', label: 'Retreats & Stays' }
  ];

  // Curated Alternative Gems
  const hiddenGems = destinations.filter(d => d.whyAlternativeBetter || d.popularityTier === 'gem').slice(0, 4);

  return (
    <div className="space-y-16 pb-24 bg-white">
      {/* 1. HERO SECTION */}
      <section className="page-container pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Hero & Search */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 pr-0 lg:pr-4">
            <div className="space-y-4">
              {/* Top Tag */}
              <div className="inline-flex items-center gap-2 text-[10.5px] font-mono tracking-wider uppercase text-[#6B6B67] pb-1.5 border-b border-[#E4E4DF]">
                <span>TRAVEL GUIDE</span>
                <span className="w-1 h-1 rounded-full bg-[#B45F3C]" />
                <span>INDIA & BEYOND</span>
                <span className="w-1 h-1 rounded-full bg-[#B45F3C]" />
                <span>EXPLOREX</span>
              </div>

              {/* Master Headline */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#242424] leading-[1.12]">
                Find places worth <br />
                <span className="italic font-normal text-[#B45F3C]">taking the long way</span> to.
              </h1>

              {/* Natural Subtext */}
              <p className="font-prose text-base sm:text-lg text-[#555555] max-w-xl font-normal leading-relaxed">
                Explore quieter places, local food, heritage sites, and experiences that are easy to miss on regular tourist routes.
              </p>
            </div>

            {/* Search Box */}
            <div className="bg-white p-5 rounded-xl border border-[#E4E4DF] shadow-xs space-y-3.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B67] border-b border-[#F7F7F4] pb-1.5">
                Search destinations, food, and stays
              </div>
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-[#F7F7F4] rounded-lg border border-[#E4E4DF] w-full focus-within:border-[#242424] transition-colors">
                  <Search className="w-4 h-4 text-[#B45F3C] shrink-0" />
                  <input
                    id="home-search-input"
                    type="text"
                    placeholder="Search Sindhudurg, Chettinad, Hampi, Paithani silk, Misal..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-[#242424] focus:outline-none placeholder:text-[#999999]"
                  />
                </div>

                <select
                  id="home-vibe-select"
                  value={selectedVibe}
                  onChange={e => setSelectedVibe(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-[#F7F7F4] rounded-lg text-xs font-medium text-[#242424] border border-[#E4E4DF] focus:outline-none cursor-pointer"
                >
                  {vibes.map(v => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>

                <Button
                  id="home-search-btn"
                  type="submit"
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
                  className="w-full sm:w-auto bg-[#242424] hover:bg-[#B45F3C] text-white transition-colors px-5 rounded-lg text-xs font-semibold"
                >
                  Search
                </Button>
              </form>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B67]">Popular:</span>
                {[
                  'Sindhudurg coastal forts',
                  'Chettinad heritage houses',
                  'Pune old city walk',
                  'Solapur handloom weavers'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => onNavigate('ai', { initialPrompt: prompt })}
                    className="px-2 py-0.5 rounded bg-[#F7F7F4] hover:bg-[#E4E4DF] text-[#242424] border border-[#E4E4DF] text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Notes */}
            <div className="flex items-center gap-6 pt-1 text-xs text-[#6B6B67] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5F7564]" />
                <span>More of your spending stays local</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B45F3C]" />
                <span>Travel at your own pace</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Image */}
          <div className="lg:col-span-5 relative flex flex-col justify-end">
            <div className="relative rounded-xl overflow-hidden border border-[#E4E4DF] shadow-xs h-[460px] lg:h-full min-h-[420px] group">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85"
                alt="Coastal Sanctuary"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#242424]/80 via-transparent to-transparent" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded text-[10px] font-mono tracking-wider uppercase font-bold text-[#242424] border border-[#E4E4DF]">
                  FEATURED • SINDHUDURG COAST
                </span>
              </div>

              {/* Bottom Caption Card */}
              <div className="absolute bottom-3 left-3 right-3 p-4 bg-white/95 backdrop-blur-md rounded-lg border border-[#E4E4DF] text-[#242424] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[#6B6B67] uppercase">
                  <span>Featured this week</span>
                  <span className="text-[#B45F3C] font-bold">Usually much quieter than Goa</span>
                </div>
                <h3 className="font-display font-bold text-base leading-snug text-[#242424]">
                  Sindhudurg: A quieter side of the Konkan
                </h3>
                <p className="text-xs font-prose text-[#6B6B67] line-clamp-2 leading-relaxed">
                  Clear waters, 17th-century sea forts, and home-cooked Malvani food made by local families.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#242424]">From ₹4,500 / night</span>
                  <button 
                    onClick={() => onNavigate('destinations', { search: 'Sindhudurg' })}
                    className="text-xs font-mono font-bold text-[#B45F3C] hover:underline flex items-center gap-1"
                  >
                    <span>Explore Sindhudurg</span> &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ALTERNATIVE DESTINATIONS */}
      <section className="page-container space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4E4DF] pb-3.5">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-[#B45F3C] font-bold">
              <Compass className="w-3.5 h-3.5" />
              Alternative Destinations
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-0.5">
              Places with fewer crowds
            </h2>
            <p className="font-prose text-xs sm:text-sm text-[#6B6B67] mt-0.5 max-w-2xl">
              Try these destinations instead of the usual crowded tourist spots. Better local experiences and less rush.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('destinations', { tab: 'demand_balancer' })}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            className="rounded-lg text-xs"
          >
            View Alternatives
          </Button>
        </div>

        {/* Alternative Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {hiddenGems.map((gem, idx) => (
            <div
              key={gem.id}
              onClick={() => onSelectDestination(gem)}
              className="bg-white rounded-xl border border-[#E4E4DF] p-3.5 shadow-xs hover:border-[#242424] transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="relative h-40 rounded-lg overflow-hidden bg-[#F7F7F4]">
                  <img
                    src={gem.heroImage}
                    alt={gem.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#242424]/90 backdrop-blur-md text-white text-[8.5px] font-mono tracking-wider uppercase font-semibold rounded">
                    0{idx + 1} • {gem.state || 'India'}
                  </span>
                  {gem.whyAlternativeBetter && (
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-[#B45F3C] text-white text-[8.5px] font-semibold rounded">
                      Try instead of {gem.whyAlternativeBetter.replacesFamousSpot}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[#6B6B67] mb-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider">{gem.country}</span>
                    <span className="text-[#B45F3C] font-bold text-xs font-mono">★ {gem.rating}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#242424] group-hover:text-[#B45F3C] transition-colors leading-tight">
                    {gem.name}
                  </h3>
                  <p className="font-prose text-xs text-[#6B6B67] mt-1 line-clamp-2 leading-relaxed">
                    {gem.whyAlternativeBetter?.headline || gem.tagline}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F7F7F4] flex items-center justify-between text-xs">
                <div>
                  <div className="text-[8.5px] font-mono text-[#6B6B67] uppercase">From</div>
                  <div className="font-mono font-bold text-xs text-[#242424]">{formatINR(gem.startingPrice)}</div>
                </div>
                <span className="px-1.5 py-0.5 bg-[#EEF2ED] text-[#5F7564] text-[9.5px] font-mono font-semibold rounded border border-[#5F7564]/15">
                  -{gem.whyAlternativeBetter?.crowdReductionPct || 65}% Crowds
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LOCAL FOOD & CRAFTS */}
      <section className="page-container space-y-6">
        <div className="bg-white border border-[#E4E4DF] rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#E4E4DF]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#B45F3C] font-bold">
                <Utensils className="w-3.5 h-3.5" />
                Local Food & Crafts
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
                Handlooms, regional food, and local crafts
              </h2>
              <p className="font-prose text-xs sm:text-sm text-[#6B6B67] max-w-2xl leading-relaxed">
                Find traditional food spots, GI-certified weavers, brass artisans, and historic neighborhood walks.
              </p>
            </div>

            <button
              onClick={() => onNavigate('destinations', { tab: 'culture_discovery' })}
              className="px-4 py-2 bg-[#242424] hover:bg-[#B45F3C] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-lg transition-colors shrink-0 self-start lg:self-auto cursor-pointer"
            >
              Explore Local Directory &rarr;
            </button>
          </div>

          {/* 4 Cultural Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div 
              onClick={() => onNavigate('destinations', { tab: 'culture_discovery' })}
              className="p-4 bg-white border border-[#E4E4DF] rounded-lg cursor-pointer hover:border-[#242424] transition-all space-y-2 group shadow-xs"
            >
              <div className="w-8 h-8 rounded bg-white text-[#B45F3C] border border-[#E4E4DF] flex items-center justify-center font-display text-sm font-bold">
                01
              </div>
              <h3 className="font-display font-bold text-sm text-[#242424] group-hover:text-[#B45F3C] transition-colors">
                Regional Food & Specialties
              </h3>
              <p className="font-prose text-xs text-[#6B6B67] leading-relaxed">
                From Pune's iconic Misal Pav and Kolhapuri Rassa to Chettinad's traditional snacks and meals.
              </p>
              <div className="text-[10.5px] font-mono font-semibold text-[#B45F3C] pt-0.5">
                See Food Guide &rarr;
              </div>
            </div>

            <div 
              onClick={() => onNavigate('destinations', { tab: 'culture_discovery' })}
              className="p-4 bg-white border border-[#E4E4DF] rounded-lg cursor-pointer hover:border-[#242424] transition-all space-y-2 group shadow-xs"
            >
              <div className="w-8 h-8 rounded bg-white text-[#5F7564] border border-[#E4E4DF] flex items-center justify-center font-display text-sm font-bold">
                02
              </div>
              <h3 className="font-display font-bold text-sm text-[#242424] group-hover:text-[#5F7564] transition-colors">
                Traditional Handlooms
              </h3>
              <p className="font-prose text-xs text-[#6B6B67] leading-relaxed">
                Visit weaver workshops for Solapuri Jacquard, Paithani silk, Sambalpuri Ikat, and Kullu shawls.
              </p>
              <div className="text-[10.5px] font-mono font-semibold text-[#5F7564] pt-0.5">
                See Weavers' Guilds &rarr;
              </div>
            </div>

            <div 
              onClick={() => onNavigate('destinations', { tab: 'culture_discovery' })}
              className="p-4 bg-white border border-[#E4E4DF] rounded-lg cursor-pointer hover:border-[#242424] transition-all space-y-2 group shadow-xs"
            >
              <div className="w-8 h-8 rounded bg-white text-[#B45F3C] border border-[#E4E4DF] flex items-center justify-center font-display text-sm font-bold">
                03
              </div>
              <h3 className="font-display font-bold text-sm text-[#242424] group-hover:text-[#B45F3C] transition-colors">
                Crafts & Workshops
              </h3>
              <p className="font-prose text-xs text-[#6B6B67] leading-relaxed">
                Handcrafted Kolhapuri leather chappals, traditional jewellery, and Bidriware metal craft.
              </p>
              <div className="text-[10.5px] font-mono font-semibold text-[#B45F3C] pt-0.5">
                See Local Crafts &rarr;
              </div>
            </div>

            <div 
              onClick={() => onNavigate('destinations', { tab: 'culture_discovery' })}
              className="p-4 bg-white border border-[#E4E4DF] rounded-lg cursor-pointer hover:border-[#242424] transition-all space-y-2 group shadow-xs"
            >
              <div className="w-8 h-8 rounded bg-white text-[#5F7564] border border-[#E4E4DF] flex items-center justify-center font-display text-sm font-bold">
                04
              </div>
              <h3 className="font-display font-bold text-sm text-[#242424] group-hover:text-[#5F7564] transition-colors">
                Forts & Historic Sites
              </h3>
              <p className="font-prose text-xs text-[#6B6B67] leading-relaxed">
                Coastal sea forts in Sindhudurg, heritage temple towns, and historic old city trails.
              </p>
              <div className="text-[10.5px] font-mono font-semibold text-[#5F7564] pt-0.5">
                See Historic Sites &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CABS & LOCAL MOBILITY */}
      <section className="page-container">
        <div className="bg-[#242424] text-white p-6 sm:p-10 rounded-xl border border-[#333333] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 text-white text-[9.5px] font-mono tracking-wider uppercase rounded border border-white/10">
              <Car className="w-3 h-3 text-[#B45F3C]" />
              Cabs & Local Transport
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              The Explorer: Reliable Local Cabs
            </h3>
            <p className="font-prose text-xs sm:text-sm text-[#AAAAAA] leading-relaxed">
              Simple per-kilometer pricing for sedans, autos, and local rental cabs with verified drivers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="text-center sm:text-right font-mono">
              <div className="text-[9.5px] uppercase tracking-wider text-[#6B6B67]">Base Rate</div>
              <div className="font-bold text-xl text-white">₹12 <span className="text-xs font-normal text-[#6B6B67]">/ km</span></div>
            </div>
            <Button
              variant="accent"
              size="md"
              onClick={() => onNavigate('explorer')}
              rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
              className="bg-[#B45F3C] hover:bg-[#8D421E] rounded-lg"
            >
              Book a Ride
            </Button>
          </div>
        </div>
      </section>

      {/* 5. DESTINATIONS GALLERY */}
      <section className="page-container space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4E4DF] pb-3.5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#B45F3C] font-bold">
              <Globe className="w-3.5 h-3.5" />
              Destinations
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-0.5">
              Places to visit in India
            </h2>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('destinations')}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            className="text-xs"
          >
            View all destinations
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(destinations || []).slice(0, 6).map(dest => {
            const isSaved = user?.savedDestinations?.includes(dest.id);
            return (
              <div
                key={dest.id}
                className="bg-white rounded-xl border border-[#E4E4DF] overflow-hidden shadow-xs hover:border-[#242424] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-[#F7F7F4]">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#242424]/80 via-transparent to-transparent" />

                    {/* Top tags */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white/95 backdrop-blur-md rounded text-[9.5px] font-mono tracking-wider uppercase font-bold text-[#242424] border border-[#E4E4DF]">
                        {dest.state ? `${dest.state}, India` : dest.country}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveDestination(dest.id);
                        }}
                        className="p-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#242424] hover:text-[#B45F3C] transition-colors cursor-pointer border border-[#E4E4DF]"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'text-rose-600 fill-rose-600' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1.5 bg-[#242424]/80 backdrop-blur-md px-2 py-0.5 rounded text-[10.5px] font-mono border border-white/10">
                        <CloudSun className="w-3 h-3 text-[#B45F3C]" />
                        <span>{dest.currentWeather?.tempC || 27}°C {dest.currentWeather?.condition || 'Clear'}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-[#242424]/80 backdrop-blur-md px-2 py-0.5 rounded text-[10.5px] font-mono font-bold border border-white/10">
                        <Star className="w-3 h-3 text-[#B45F3C] fill-[#B45F3C]" />
                        <span>{dest.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-display text-lg font-bold text-[#242424] group-hover:text-[#B45F3C] transition-colors">
                      {dest.name}
                    </h3>
                    <p className="font-prose text-xs text-[#6B6B67] line-clamp-2 leading-relaxed">
                      {dest.tagline || dest.description}
                    </p>

                    {/* Vibe Chips */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {dest.vibe.slice(0, 3).map(v => (
                        <span key={v} className="px-1.5 py-0.5 bg-[#F7F7F4] text-[#6B6B67] border border-[#E4E4DF] rounded text-[9.5px] font-mono uppercase tracking-wider">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-3">
                  {/* Tonal Footprint */}
                  <div className="pt-2.5 border-t border-[#F7F7F4] grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#F7F7F4] p-2 rounded-lg border border-[#E4E4DF]">
                      <div className="text-[8.5px] font-mono text-[#6B6B67] uppercase tracking-wider">Crowds</div>
                      <div className="font-mono font-bold text-[#242424] text-[11px] capitalize flex items-center gap-1 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          dest.currentCapacityLoadPct && dest.currentCapacityLoadPct < 50 ? 'bg-[#5F7564]' :
                          dest.currentCapacityLoadPct && dest.currentCapacityLoadPct < 75 ? 'bg-[#B45F3C]' : 'bg-rose-600'
                        }`} />
                        <span>{dest.crowdPrediction?.currentStatus || 'Moderate'}</span>
                      </div>
                    </div>

                    <div className="bg-[#F7F7F4] p-2 rounded-lg border border-[#E4E4DF]">
                      <div className="text-[8.5px] font-mono text-[#6B6B67] uppercase tracking-wider">Local Impact</div>
                      <div className="font-mono font-bold text-[#5F7564] text-[11px] flex items-center gap-1 mt-0.5">
                        <HeartHandshake className="w-3 h-3 text-[#5F7564]" />
                        <span>{dest.localEconomicRetentionPct || 85}% Stays Local</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="text-[8.5px] font-mono text-[#6B6B67] uppercase">From</div>
                      <div className="font-mono font-bold text-sm text-[#242424]">{formatINR(dest.startingPrice)}</div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectDestination(dest)}
                      className="border-[#E4E4DF] hover:border-[#242424] text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CURATED TRAVEL PACKAGES */}
      <section className="page-container space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4E4DF] pb-3.5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#B45F3C] font-bold">
              <Feather className="w-3.5 h-3.5" />
              Trip Packages
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-0.5">
              Trip packages with itineraries
            </h2>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('packages')}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            className="text-xs"
          >
            View all packages
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.slice(0, 3).map(pkg => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl border border-[#E4E4DF] overflow-hidden shadow-xs hover:border-[#242424] transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-[#F7F7F4]">
                  <img
                    src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'}
                    alt={pkg.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242424]/70 to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md rounded text-[9.5px] font-mono tracking-wider font-bold text-[#242424]">
                    {pkg.durationDays}D / {pkg.durationNights}N
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-bold text-[#242424] group-hover:text-[#B45F3C] transition-colors leading-tight">
                      {pkg.title}
                    </h3>
                    <span className="text-[#B45F3C] font-bold text-xs font-mono">
                      ★ {pkg.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B67] line-clamp-2 leading-relaxed">{pkg.tagline || pkg.title}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[#F7F7F4] flex items-center justify-between">
                  <div>
                    <div className="text-[8.5px] font-mono text-[#6B6B67] uppercase">From</div>
                    <div className="font-mono text-base font-bold text-[#242424]">{formatINR(pkg.startingPrice)}</div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('packages')}
                    className="bg-[#242424] hover:bg-[#B45F3C] text-white text-xs rounded-lg"
                  >
                    View Itinerary
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
