import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Shirt, 
  Palette, 
  Sparkles, 
  Calendar, 
  ShoppingBag, 
  Compass, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  Tag,
  Gem
} from 'lucide-react';
import { CulturalSpecialties, Destination } from '../types';

interface CulturalDiscoveryProps {
  destination?: Destination;
  allDestinations?: Destination[];
  onSelectDestination?: (dest: Destination) => void;
}

type SpecialtyCategory = 
  | 'all' 
  | 'food' 
  | 'clothing' 
  | 'handicrafts' 
  | 'jewellery' 
  | 'artAndCulture' 
  | 'festivals' 
  | 'localShopping' 
  | 'uniqueExperiences';

const CATEGORY_TABS: { id: SpecialtyCategory; label: string; icon: string; desc: string }[] = [
  { id: 'all', label: 'All Specialties', icon: '✨', desc: 'Complete cultural tapestry & local treasures' },
  { id: 'food', label: 'Local Food', icon: '🍛', desc: 'Authentic cuisine, street food & signature dishes' },
  { id: 'clothing', label: 'Traditional Clothing', icon: '👕', desc: 'Regional attire, royal styles & heritage weaves' },
  { id: 'handicrafts', label: 'Handicrafts & Handlooms', icon: '🧵', desc: 'GI-tagged crafts, pottery & artisan guilds' },
  { id: 'jewellery', label: 'Jewellery & Metalcraft', icon: '💍', desc: 'Traditional ornaments & heritage metallurgy' },
  { id: 'artAndCulture', label: 'Art, Dance & Music', icon: '🎨', desc: 'Folk performances, painting styles & theatre' },
  { id: 'festivals', label: 'Festivals & Celebrations', icon: '🎉', desc: 'Grand religious & seasonal regional fairs' },
  { id: 'localShopping', label: 'Markets & Shopping', icon: '🛍️', desc: 'Bazaars, authentic shops & bargaining tips' },
  { id: 'uniqueExperiences', label: 'Unique Experiences', icon: '🏞️', desc: 'Immersive cultural workshops & nature trails' }
];

export const CulturalSpecialtyDiscovery: React.FC<CulturalDiscoveryProps> = ({
  destination,
  allDestinations = [],
  onSelectDestination
}) => {
  const [activeCategory, setActiveCategory] = useState<SpecialtyCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // If a specific destination is provided, render that destination's specialties directly.
  // Otherwise, use the `/api/culture/search` aggregator endpoint.
  useEffect(() => {
    if (destination && destination.culturalSpecialties) {
      // Local destination view
      return;
    }

    const fetchCultureData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (activeCategory !== 'all') params.append('category', activeCategory);
        if (selectedState !== 'all') params.append('state', selectedState);

        const res = await fetch(`/api/culture/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error('Failed to search cultural specialties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCultureData();
  }, [destination, activeCategory, searchQuery, selectedState]);

  // Specific single destination layout
  if (destination && destination.culturalSpecialties) {
    const specs = destination.culturalSpecialties;
    return (
      <div id={`whats-famous-${destination.id}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🍛</span> What&apos;s Famous in {destination.name}?
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Authentic Culture, Gastronomy & Handicrafts
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Curated local heritage of {destination.name}, {destination.state || destination.stateOrRegion}. Explore signature dishes, GI crafts, traditional garments, and village artisans.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 shrink-0">
            🌿 Local Retention: <strong className="text-emerald-700 font-bold">{destination.localEconomicRetentionPct || 85}%</strong>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-none border-b border-slate-100">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              id={`spec-tab-${tab.id}`}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Grid Content for Single Destination */}
        <div className="py-6 space-y-8">
          {/* 1. Food */}
          {(activeCategory === 'all' || activeCategory === 'food') && specs.food && specs.food.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span>🍛</span> Local Food & Traditional Cuisine
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specs.food.map((f, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">{f.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          f.isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {f.isVeg ? '🌱 Pure Veg' : '🍗 Non-Veg'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{f.description}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-700">
                      <strong className="text-slate-900">Must try at:</strong> {f.mustTryAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Clothing */}
          {(activeCategory === 'all' || activeCategory === 'clothing') && specs.clothing && specs.clothing.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span>👕</span> Traditional Clothing & Royal Attire
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specs.clothing.map((c, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{c.name}</h4>
                      <p className="text-xs text-slate-600 mb-2">{c.description}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-700 space-y-1">
                      <div><strong className="text-slate-900">Occasion:</strong> {c.occasion}</div>
                      {c.authenticHub && <div><strong className="text-slate-900">Authentic Hub:</strong> {c.authenticHub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Handicrafts */}
          {(activeCategory === 'all' || activeCategory === 'handicrafts') && specs.handicrafts && specs.handicrafts.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span>🧵</span> Handicrafts, Handlooms & GI-Tagged Treasures
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specs.handicrafts.map((h, i) => (
                  <div key={i} className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">{h.name}</h4>
                        {h.giTagged && (
                          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Tag className="w-3 h-3" /> GI Tagged
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{h.description}</p>
                    </div>
                    <div className="pt-2 border-t border-amber-200/50 text-[11px] text-slate-700 space-y-1">
                      {h.artisanCommunity && <div><strong className="text-slate-900">Artisan Guild:</strong> {h.artisanCommunity}</div>}
                      {h.buyingLocation && <div><strong className="text-slate-900">Direct From:</strong> {h.buyingLocation}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Jewellery */}
          {(activeCategory === 'all' || activeCategory === 'jewellery') && specs.jewellery && specs.jewellery.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span>💍</span> Traditional Jewellery & Metalcraft
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specs.jewellery.map((j, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{j.name}</h4>
                      <p className="text-xs text-slate-600 mb-2">{j.description}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-700 space-y-0.5">
                      {j.material && <div><strong className="text-slate-900">Material:</strong> {j.material}</div>}
                      {j.traditionalSignificance && <div><strong className="text-slate-900">Significance:</strong> {j.traditionalSignificance}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Art & Culture */}
          {(activeCategory === 'all' || activeCategory === 'artAndCulture') && specs.artAndCulture && specs.artAndCulture.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span>🎨</span> Performing Arts, Dance & Music
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specs.artAndCulture.map((a, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{a.name}</h4>
                      <span className="text-[10px] font-semibold bg-slate-200 text-slate-800 px-2 py-0.5 rounded capitalize">
                        {a.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{a.description}</p>
                    {a.whereToExperience && (
                      <div className="text-[11px] text-slate-700 pt-1 border-t border-slate-200/60">
                        <strong className="text-slate-900">Where to witness:</strong> {a.whereToExperience}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Festivals */}
          {(activeCategory === 'all' || activeCategory === 'festivals') && specs.festivals && specs.festivals.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span>🎉</span> Grand Local Festivals & Celebrations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specs.festivals.map((fest, i) => (
                  <div key={i} className="bg-amber-50/40 border border-amber-200/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{fest.name}</h4>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        🗓️ {fest.monthOrSeason}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{fest.culturalSignificance}</p>
                    <div className="text-[11px] text-amber-950 bg-white/80 p-2 rounded border border-amber-100">
                      <strong>Celebration Highlights:</strong> {fest.celebrationHighlights}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Local Shopping & Bazaars */}
          {(activeCategory === 'all' || activeCategory === 'localShopping') && specs.localShopping && specs.localShopping.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span>🛍️</span> Local Bazaars, Markets & Souvenirs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specs.localShopping.map((shop, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{shop.product}</h4>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {shop.priceRange}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mb-2">
                        <strong>Market:</strong> {shop.bestMarket}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded">
                      💡 <strong>Pro Tip:</strong> {shop.tip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Unique Experiences */}
          {(activeCategory === 'all' || activeCategory === 'uniqueExperiences') && specs.uniqueExperiences && specs.uniqueExperiences.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span>🏞️</span> Unique Local Experiences & Sustainable Tours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specs.uniqueExperiences.map((exp, i) => (
                  <div key={i} className="bg-emerald-50/40 border border-emerald-200/50 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{exp.title}</h4>
                    <p className="text-xs text-slate-600 mb-2">{exp.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-emerald-100 text-emerald-950 font-medium">
                      <div>🕒 <strong>Best Timing:</strong> {exp.bestTime}</div>
                      <div>🤝 <strong>Impact:</strong> {exp.localImpact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Cross-India Cultural Specialty Explorer view
  return (
    <div id="india-cultural-discovery" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-100">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
          <span>🇮🇳</span> Pan-India Culture & Heritage Search
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          What&apos;s Famous Where in India?
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Search across India for legendary regional gastronomy (Misal, Malvani Surmai, Siddu, Chettinad feasts), traditional royal clothing, GI-tagged handlooms, jewellery, and folk arts.
        </p>

        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-5">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="culture-search-input"
              type="text"
              placeholder="Search dishes (Misal, Solkadhi), crafts (Chadar, Chappal, Pattachitra), fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <select
              id="culture-state-filter"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="all">All States of India</option>
              <option value="Maharashtra">Maharashtra (Konkan, Desh, Khandesh)</option>
              <option value="Himachal Pradesh">Himachal Pradesh (Tirthan, Kullu)</option>
              <option value="Tamil Nadu">Tamil Nadu (Chettinad, Sivaganga)</option>
              <option value="Odisha">Odisha (Raghurajpur, Puri)</option>
              <option value="Rajasthan">Rajasthan (Jaipur, Shekhawati)</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pt-4 scrollbar-none">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              id={`culture-tab-${tab.id}`}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Item Results */}
      <div className="pt-6">
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent mb-2" />
            <p className="text-xs font-semibold text-slate-600">Discovering authentic Indian crafts & specialties...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-xl">
            <p className="text-sm font-semibold text-slate-700">No specialties matched &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for &ldquo;Misal&rdquo;, &ldquo;Saree&rdquo;, &ldquo;Chappal&rdquo;, or &ldquo;Toy&rdquo;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, idx) => {
              const matchedDest = allDestinations.find(d => d.id === item.destinationId);
              return (
                <div
                  key={idx}
                  id={`culture-item-${idx}`}
                  className="bg-slate-50 border border-slate-200 hover:border-amber-400 rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{item.title}</h4>
                      </div>
                      {item.giTagged && (
                        <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded shrink-0">
                          GI Tagged
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mb-3">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80">
                    {item.extraInfo && (
                      <div className="text-[11px] text-slate-700 mb-2 italic">
                        {item.extraInfo}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        {item.destinationName}, {item.state}
                      </span>
                      {matchedDest && onSelectDestination && (
                        <button
                          onClick={() => onSelectDestination(matchedDest)}
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-0.5"
                        >
                          Explore <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
