import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ChevronRight, 
  MapPin, 
  Sparkles, 
  Layers, 
  Building, 
  Trees, 
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { Destination } from '../types';

interface HierarchyBrowserProps {
  onSelectDestination: (dest: Destination) => void;
  allDestinations: Destination[];
}

export const IndiaTravelHierarchyBrowser: React.FC<HierarchyBrowserProps> = ({
  onSelectDestination,
  allDestinations
}) => {
  const [hierarchyData, setHierarchyData] = useState<any>({});
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [tierFilter, setTierFilter] = useState<string>('all');

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const res = await fetch('/api/culture/hierarchy');
        if (res.ok) {
          const data = await res.json();
          setHierarchyData(data);
          // Set defaults
          const states = Object.keys(data);
          if (states.length > 0) {
            const firstState = states.includes('Maharashtra') ? 'Maharashtra' : states[0];
            setSelectedState(firstState);
            const regions = Object.keys(data[firstState]?.regions || {});
            if (regions.length > 0) {
              setSelectedRegion(regions[0]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load India hierarchy:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchy();
  }, []);

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const regions = Object.keys(hierarchyData[st]?.regions || {});
    if (regions.length > 0) {
      setSelectedRegion(regions[0]);
      const districts = Object.keys(hierarchyData[st]?.regions[regions[0]]?.districts || {});
      if (districts.length > 0) {
        setSelectedDistrict(districts[0]);
      }
    } else {
      setSelectedRegion('');
      setSelectedDistrict('');
    }
  };

  const stateObj = hierarchyData[selectedState];
  const regionObj = stateObj?.regions[selectedRegion];

  // Get active list of destinations for the selected state/region/tier
  let matchingDests = allDestinations.filter(d => {
    if (d.country !== 'India' && d.isInternational) return false;
    if (selectedState && (d.state !== selectedState && !d.stateOrRegion?.includes(selectedState))) return false;
    if (selectedRegion && d.region && d.region !== selectedRegion) return false;
    if (tierFilter !== 'all') {
      if (tierFilter === 'gem' && d.popularityTier !== 'gem') return false;
      if (tierFilter === 'rural' && d.tierCategory !== 'Rural/Village') return false;
      if (tierFilter === 'tier23' && d.tierCategory !== 'Tier-2' && d.tierCategory !== 'Tier-3') return false;
    }
    return true;
  });

  return (
    <div id="india-hierarchy-browser" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" /> India Travel Explorer
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            State &rarr; Region &rarr; District &rarr; Village Hierarchy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Navigate through India&apos;s administrative and cultural landscape. Uncover Tier-2, Tier-3, and rural craft hubs beyond standard tourist maps.
          </p>
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          {[
            { id: 'all', label: 'All Tiers' },
            { id: 'gem', label: '🌿 Hidden Gems' },
            { id: 'rural', label: '🌾 Rural Villages' },
            { id: 'tier23', label: '🏛️ Tier 2/3 Towns' }
          ].map(t => (
            <button
              key={t.id}
              id={`tier-filter-${t.id}`}
              onClick={() => setTierFilter(t.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                tierFilter === t.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* State & Region Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-6">
        {/* State Tabs */}
        <div className="md:col-span-4 border-r border-slate-100 pr-0 md:pr-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Step 1: Select State
          </label>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {Object.keys(hierarchyData).map(st => (
              <button
                key={st}
                id={`state-select-${st}`}
                onClick={() => handleStateChange(st)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  selectedState === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{st}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              </button>
            ))}
          </div>
        </div>

        {/* Region Tabs */}
        <div className="md:col-span-8">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Step 2: Select Cultural Region in {selectedState}
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {stateObj && Object.keys(stateObj.regions || {}).map(reg => (
              <button
                key={reg}
                id={`region-select-${reg}`}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedRegion === reg
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Destination Cards for this Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {matchingDests.map(dest => (
              <div
                key={dest.id}
                id={`hierarchy-dest-${dest.id}`}
                onClick={() => onSelectDestination(dest)}
                className="p-3.5 bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-xl cursor-pointer transition-all hover:bg-white hover:shadow-sm flex items-center gap-3 group"
              >
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                      {dest.name}
                    </h4>
                    {dest.tierCategory && (
                      <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded shrink-0">
                        {dest.tierCategory}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {dest.district ? `${dest.district} District • ` : ''}{dest.region || dest.stateOrRegion}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-600 mt-1">
                    <span>⭐ {dest.rating}</span>
                    <span className="text-emerald-700 font-semibold">🌿 {dest.localEconomicRetentionPct || 85}% Local</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
