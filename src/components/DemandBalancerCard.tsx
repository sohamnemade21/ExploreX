import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Leaf, 
  TrendingDown, 
  IndianRupee, 
  Calendar, 
  Compass, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  AlertCircle,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { DemandBalancerQuery, DemandBalancerResult, TravelVibe, ThematicTag, Destination } from '../types';

interface DemandBalancerProps {
  onSelectDestination: (destination: Destination) => void;
  onExploreCulture?: (destination: Destination) => void;
}

const POPULAR_VIBES: { id: TravelVibe; label: string; icon: string }[] = [
  { id: 'heritage', label: 'Royal & Heritage', icon: '🏰' },
  { id: 'culinary', label: 'Culinary Trails', icon: '🍛' },
  { id: 'beach', label: 'Coastal & Coral', icon: '🌊' },
  { id: 'nature', label: 'Nature & Valleys', icon: '🌿' },
  { id: 'wellness', label: 'Wellness & Serenity', icon: '🧘' },
  { id: 'spiritual', label: 'Spiritual & Sacred', icon: '🛕' },
  { id: 'adventure', label: 'Active Adventure', icon: '🧗' },
  { id: 'shopping', label: 'Handlooms & Craft', icon: '🛍️' }
];

const SEASONS_AND_MONTHS = [
  'October', 'November', 'December', 'January', 'February', 'March', 
  'April', 'May', 'June', 'July', 'August', 'September'
];

const STATES = [
  { id: 'all', label: 'All India' },
  { id: 'Maharashtra', label: 'Maharashtra' },
  { id: 'Himachal Pradesh', label: 'Himachal Pradesh' },
  { id: 'Tamil Nadu', label: 'Tamil Nadu' },
  { id: 'Odisha', label: 'Odisha' },
  { id: 'Rajasthan', label: 'Rajasthan' }
];

export const DemandBalancerCard: React.FC<DemandBalancerProps> = ({ 
  onSelectDestination, 
  onExploreCulture 
}) => {
  const [selectedVibes, setSelectedVibes] = useState<TravelVibe[]>(['heritage', 'culinary']);
  const [selectedSeason, setSelectedSeason] = useState<string>(
    new Date().toLocaleString('default', { month: 'long' })
  );
  const [maxBudget, setMaxBudget] = useState<number>(3500); // INR per day
  const [selectedState, setSelectedState] = useState<string>('all');
  const [preferHiddenGems, setPreferHiddenGems] = useState<boolean>(true);
  const [avoidOvertouristed, setAvoidOvertouristed] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<DemandBalancerResult[]>([]);
  const [activeViewMode, setActiveViewMode] = useState<'grid' | 'comparison'>('grid');

  const executeDemandBalancing = async () => {
    setLoading(true);
    try {
      const queryPayload: DemandBalancerQuery = {
        vibes: selectedVibes,
        seasonOrMonth: selectedSeason,
        maxBudgetPerDay: maxBudget,
        statePreference: selectedState,
        preferHiddenGems,
        avoidOvertouristed
      };

      const res = await fetch('/api/ai/demand-balancer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryPayload)
      });

      if (res.ok) {
        const data: DemandBalancerResult[] = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error('Demand Balancer fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeDemandBalancing();
  }, [selectedVibes, selectedSeason, maxBudget, selectedState, preferHiddenGems, avoidOvertouristed]);

  const toggleVibe = (vibe: TravelVibe) => {
    if (selectedVibes.includes(vibe)) {
      if (selectedVibes.length > 1) {
        setSelectedVibes(selectedVibes.filter(v => v !== vibe));
      }
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  return (
    <div id="ai-demand-balancer" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Tourism Demand Balancer
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Balanced & Sustainable India Travel Engine
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Optimizes across <strong className="text-slate-800">Tourist Satisfaction</strong>, <strong className="text-slate-800">Affordability</strong>, <strong className="text-slate-800">Local Economic Retention</strong>, and <strong className="text-slate-800">Carrying Capacity</strong>. Rerouting demand from saturated hotspots to pristine, culturally rich hidden gems.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          <button
            id="balancer-grid-view-btn"
            onClick={() => setActiveViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeViewMode === 'grid' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Ranked Gems ({results.length})
          </button>
          <button
            id="balancer-comparison-view-btn"
            onClick={() => setActiveViewMode('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeViewMode === 'comparison' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alternative vs Crowded Hubs
          </button>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 p-5 bg-slate-50 rounded-xl border border-slate-100">
        {/* Vibes Filter */}
        <div className="md:col-span-12">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Select Travel Experiences & Vibe
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_VIBES.map(v => {
              const isSelected = selectedVibes.includes(v.id);
              return (
                <button
                  key={v.id}
                  id={`vibe-btn-${v.id}`}
                  onClick={() => toggleVibe(v.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected 
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{v.icon}</span>
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Season / Month */}
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            2. Travel Month / Season
          </label>
          <div className="relative">
            <select
              id="balancer-month-select"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {SEASONS_AND_MONTHS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* State Preference */}
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            3. State or Region
          </label>
          <select
            id="balancer-state-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {STATES.map(st => (
              <option key={st.id} value={st.id}>{st.label}</option>
            ))}
          </select>
        </div>

        {/* Daily Budget Slider */}
        <div className="md:col-span-4">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              4. Max Budget (Per Day)
            </label>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              ₹{maxBudget.toLocaleString('en-IN')}/day
            </span>
          </div>
          <input
            id="balancer-budget-slider"
            type="range"
            min="1000"
            max="12000"
            step="500"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>₹1,000 (Budget Homestay)</span>
            <span>₹6,000</span>
            <span>₹12,000 (Heritage Palace)</span>
          </div>
        </div>

        {/* Sustainable Toggles */}
        <div className="md:col-span-12 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
              <input
                id="toggle-avoid-overtouristed"
                type="checkbox"
                checked={avoidOvertouristed}
                onChange={(e) => setAvoidOvertouristed(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>🚫 Avoid Saturated & Overtouristed Hotspots</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
              <input
                id="toggle-prefer-hidden-gems"
                type="checkbox"
                checked={preferHiddenGems}
                onChange={(e) => setPreferHiddenGems(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>🌿 Prioritize Rural / Tier-2/3 Authentic Villages</span>
            </label>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Formula: 30% Satisfaction + 25% Affordability + 25% Local Retention + 20% Carrying Capacity
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent mb-3" />
          <p className="text-sm font-semibold text-slate-700">AI Tourism Engine is balancing crowd capacity & local economic metrics...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">No destinations matched your strict filter criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try widening your daily budget or selecting &apos;All India&apos;.</p>
        </div>
      ) : activeViewMode === 'comparison' ? (
        /* ALTERNATIVE VS SATURATED HUBS COMPARISON */
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
            <Leaf className="w-5 h-5 text-emerald-700 shrink-0" />
            <p className="text-xs text-emerald-900">
              <strong>Demand Reliever Insight:</strong> Choosing offbeat alternatives prevents severe environmental erosion, provides 40-70% lower crowd density, and delivers 85%+ of your tourist spend straight to grassroots family homestays and artisans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.filter(r => r.destination.whyAlternativeBetter || r.alternativeComparison).map((res) => {
              const dest = res.destination;
              const alt = dest.whyAlternativeBetter;
              return (
                <div 
                  key={dest.id}
                  id={`comparison-card-${dest.id}`}
                  className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Recommended Gem
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">
                          {dest.name}, {dest.state || dest.stateOrRegion}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">AI Match Score</span>
                        <span className="text-lg font-extrabold text-emerald-600">{res.overallScore}/100</span>
                      </div>
                    </div>

                    {alt && (
                      <div className="bg-amber-50/80 border border-amber-200/70 rounded-lg p-3 my-2 text-xs">
                        <div className="font-semibold text-amber-900 flex items-center gap-1 mb-1">
                          <TrendingDown className="w-4 h-4 text-amber-700" />
                          Replaces Saturated: <span className="underline decoration-amber-500">{alt.replacesFamousSpot}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-amber-200/50 text-amber-950 font-medium">
                          <div className="bg-white/80 p-2 rounded">
                            <div className="text-[10px] text-slate-500 uppercase">Crowd Reduction</div>
                            <div className="text-sm font-bold text-emerald-700">-{alt.crowdReductionPct}% Fewer Crowds</div>
                          </div>
                          <div className="bg-white/80 p-2 rounded">
                            <div className="text-[10px] text-slate-500 uppercase">Trip Cost Savings</div>
                            <div className="text-sm font-bold text-blue-700">~{alt.costSavingsPct}% Cheaper</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-2 italic">
                          &ldquo;{alt.headline}&rdquo;
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {res.demandReliefReasoning}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100">
                    <button
                      id={`explore-culture-btn-${dest.id}`}
                      onClick={() => onExploreCulture ? onExploreCulture(dest) : onSelectDestination(dest)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                    >
                      🍛 What&apos;s Famous Here?
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`view-details-btn-${dest.id}`}
                      onClick={() => onSelectDestination(dest)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      View Destination
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* STANDARD BALANCED DESTINATIONS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((res, idx) => {
            const dest = res.destination;
            return (
              <div
                key={dest.id}
                id={`balancer-card-${dest.id}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image container with badges */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        #{idx + 1} Best Match
                      </span>
                      {dest.tierCategory && (
                        <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {dest.tierCategory}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/95 text-slate-900 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                        ⭐ {dest.rating}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[11px] flex justify-between items-center">
                      <span>🌡️ {dest.currentWeather?.tempC || 26}°C {dest.currentWeather?.condition || 'Clear'}</span>
                      <span>👥 Load: {res.capacityUtilization}% ({res.estimatedCrowdLevel})</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {dest.state || dest.stateOrRegion}, India
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {res.overallScore}/100
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {dest.tagline || dest.description}
                    </p>

                    {/* AI Score Pillar Bars */}
                    <div className="grid grid-cols-4 gap-1.5 my-3 pt-3 border-t border-slate-100 text-center">
                      <div className="bg-slate-50 p-1.5 rounded">
                        <div className="text-[9px] text-slate-500 font-semibold uppercase">Satisfaction</div>
                        <div className="text-xs font-bold text-slate-800">{res.breakdown.satisfactionScore}%</div>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded">
                        <div className="text-[9px] text-slate-500 font-semibold uppercase">Affordability</div>
                        <div className="text-xs font-bold text-blue-700">{res.breakdown.affordabilityScore}%</div>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded">
                        <div className="text-[9px] text-slate-500 font-semibold uppercase">Local Impact</div>
                        <div className="text-xs font-bold text-emerald-700">{res.breakdown.localEconomicBenefitScore}%</div>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded">
                        <div className="text-[9px] text-slate-500 font-semibold uppercase">Eco Relief</div>
                        <div className="text-xs font-bold text-teal-700">{res.breakdown.sustainabilityScore}%</div>
                      </div>
                    </div>

                    {/* Reasoning Snippet */}
                    <div className="text-[11px] text-slate-700 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                      {res.demandReliefReasoning}
                    </div>
                  </div>
                </div>

                {/* Footer CTAs */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                  <button
                    id={`card-culture-btn-${dest.id}`}
                    onClick={() => onExploreCulture ? onExploreCulture(dest) : onSelectDestination(dest)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 py-1.5"
                  >
                    🍛 Famous Specialties
                  </button>
                  <button
                    id={`card-view-dest-btn-${dest.id}`}
                    onClick={() => onSelectDestination(dest)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Explore & Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
