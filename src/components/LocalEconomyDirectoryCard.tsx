import React from 'react';
import { 
  Home, 
  Utensils, 
  Palette, 
  UserCheck, 
  ShieldCheck, 
  TrendingUp, 
  ExternalLink,
  Phone,
  HeartHandshake
} from 'lucide-react';
import { LocalEconomyDirectory, Destination } from '../types';

interface LocalEconomyCardProps {
  destination: Destination;
}

export const LocalEconomyDirectoryCard: React.FC<LocalEconomyCardProps> = ({ destination }) => {
  const econ = destination.localEconomy;
  const retention = destination.localEconomicRetentionPct || 85;
  const impactScore = econ?.localImpactScore || destination.sustainabilityScore || 90;

  if (!econ) return null;

  return (
    <div id={`local-economy-${destination.id}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Header with Impact Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <HeartHandshake className="w-3.5 h-3.5" /> Local Economy & Direct Artisan Support
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            Direct-to-Community Tourism Directory
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Every booking and visit directly empowers grassroots families, master weavers, folk artists, and village homestays in {destination.name}.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl shrink-0">
          <div>
            <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">Local Economic Retention</div>
            <div className="text-xl font-black text-emerald-800">{retention}% Direct</div>
          </div>
          <div className="border-l border-emerald-300 pl-3">
            <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">Community Impact</div>
            <div className="text-xl font-black text-emerald-800">{impactScore}/100</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* 1. Verified Village Homestays */}
        {econ.homestays && econ.homestays.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Home className="w-4 h-4 text-emerald-700" />
              <h4 className="font-bold text-slate-900 text-sm">Certified Local Homestays</h4>
            </div>
            <div className="space-y-3">
              {econ.homestays.map((h, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-slate-900 text-xs">{h.name}</h5>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {h.priceRangePerNight}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">Host: <strong>{h.hostFamily}</strong> • {h.villageOrLocality}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 italic">&ldquo;{h.specialty}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Authentic Family Food Joints / Khanavals */}
        {econ.foodJoints && econ.foodJoints.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="w-4 h-4 text-amber-700" />
              <h4 className="font-bold text-slate-900 text-sm">Authentic Family Khanavals & Joints</h4>
            </div>
            <div className="space-y-3">
              {econ.foodJoints.map((j, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-slate-900 text-xs">{j.name}</h5>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Est. {j.establishedYear || 'Legacy'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1">Specialty: <strong>{j.dishSpecialty}</strong></p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{j.locationAddress}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Artisan Cooperatives */}
        {econ.artisanCooperatives && econ.artisanCooperatives.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-purple-700" />
              <h4 className="font-bold text-slate-900 text-sm">Artisan Guilds & Workshops</h4>
            </div>
            <div className="space-y-3">
              {econ.artisanCooperatives.map((art, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-slate-900 text-xs">{art.name}</h5>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {art.artisanCount}+ Artisans
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1">Craft: <strong>{art.craftType}</strong></p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Workshop: {art.workshopAddress}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Certified Local Tour Guides */}
        {econ.localGuides && econ.localGuides.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-blue-700" />
              <h4 className="font-bold text-slate-900 text-sm">Certified Local Heritage Guides</h4>
            </div>
            <div className="space-y-3">
              {econ.localGuides.map((g, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-slate-900 text-xs">{g.name}</h5>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {g.yearsOfExperience} yrs exp
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1">Expertise: <strong>{g.specialty}</strong></p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Languages: {g.languages.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
