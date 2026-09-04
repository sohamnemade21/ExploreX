import React from 'react';
import { 
  Clock, 
  Calendar, 
  Sun, 
  CloudRain, 
  IndianRupee, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { BestTimeEngineData, Destination } from '../types';
import { formatINR } from '../utils/currency';

interface BestTimeEngineProps {
  destination: Destination;
}

export const BestTimeEngineCard: React.FC<BestTimeEngineProps> = ({ destination }) => {
  const engine = destination.bestTimeEngine;

  return (
    <div id={`best-time-engine-${destination.id}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" /> AI Best-Time & Timing Engine
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ideal Months, Daily Crowd Windows & Budget Estimator
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Data-backed planning for {destination.name}: avoid peak crowd bottlenecks and optimize travel costs.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center shrink-0">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Best Months</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">
            {destination.bestMonths.slice(0, 3).join(', ')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6">
        {/* 1. Daily Crowd Windows & Peak Hours */}
        <div className="md:col-span-6 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-indigo-600" />
              Time-of-Day Crowd Strategy
            </h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900">Quiet & Golden Hours</div>
                  <div className="text-xs text-emerald-800 mt-0.5">
                    {engine?.hourlyCrowdTimeline?.morningQuietWindow || destination.crowdPrediction.quietHours}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-900">Peak Tourist Hours</div>
                  <div className="text-xs text-amber-800 mt-0.5">
                    {engine?.hourlyCrowdTimeline?.middayPeak || destination.crowdPrediction.peakHours}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-lg flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-purple-900">Sunset / Evening Experience</div>
                  <div className="text-xs text-purple-800 mt-0.5">
                    {engine?.hourlyCrowdTimeline?.eveningVibe || '4:30 PM - 7:00 PM (Sunset vistas & illuminated monuments)'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-700 bg-white p-3 rounded-lg">
            💡 <strong>Recommendation:</strong> {destination.crowdPrediction.recommendation}
          </div>
        </div>

        {/* 2. Budget Estimator (Budget, Mid-range, Luxury) */}
        <div className="md:col-span-6 bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
            <IndianRupee className="w-4 h-4 text-emerald-700" />
            Estimated Daily Cost Per Person (INR)
          </h4>

          {engine?.budgetEstimator ? (
            <div className="space-y-2.5">
              {/* Budget tier */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-900">🎒 Budget Traveler (Homestay & Street Eats)</span>
                  <span className="text-xs font-extrabold text-emerald-700">₹{engine.budgetEstimator.budgetTier.totalDaily}/day</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Stay: ₹{engine.budgetEstimator.budgetTier.stay} • Food: ₹{engine.budgetEstimator.budgetTier.food} • Transit: ₹{engine.budgetEstimator.budgetTier.transit}
                </div>
              </div>

              {/* Mid-range tier */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-900">🏨 Comfort Traveler (Boutique Hotel & Cabs)</span>
                  <span className="text-xs font-extrabold text-blue-700">₹{engine.budgetEstimator.midTier.totalDaily}/day</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Stay: ₹{engine.budgetEstimator.midTier.stay} • Food: ₹{engine.budgetEstimator.midTier.food} • Transit: ₹{engine.budgetEstimator.midTier.transit}
                </div>
              </div>

              {/* Luxury tier */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-900">👑 Heritage Luxury (Palace/Villa Resort)</span>
                  <span className="text-xs font-extrabold text-purple-700">₹{engine.budgetEstimator.luxuryTier.totalDaily}/day</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Stay: ₹{engine.budgetEstimator.luxuryTier.stay} • Food: ₹{engine.budgetEstimator.luxuryTier.food} • Transit: ₹{engine.budgetEstimator.luxuryTier.transit}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span>Budget Homestay Tier:</span>
                <span className="font-bold text-emerald-700">{formatINR(Math.round(destination.startingPrice * 0.35))}/day</span>
              </div>
              <div className="flex justify-between">
                <span>Comfort Boutique Tier:</span>
                <span className="font-bold text-blue-700">{formatINR(Math.round(destination.startingPrice * 0.70))}/day</span>
              </div>
            </div>
          )}

          {/* Current Live Weather card */}
          <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs font-bold text-blue-950">Live Weather: {destination.currentWeather?.tempC || 27}°C</div>
                <div className="text-[11px] text-blue-800">{destination.currentWeather?.forecast || 'Pleasant and sunny'}</div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-white text-blue-900 px-2 py-1 rounded shadow-2xs">
              AQI: {destination.currentWeather?.airQualityIndex || 32} (Good)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
