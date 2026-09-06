import React from 'react';
import { Lock, Sparkles, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavTab } from './Navbar';

interface LockedFeatureGateProps {
  title: string;
  category?: string;
  description: string;
  perks?: string[];
  onNavigate?: (tab: NavTab) => void;
}

export const LockedFeatureGate: React.FC<LockedFeatureGateProps> = ({
  title,
  category = 'Curator Exclusive',
  description,
  perks = [
    'Bespoke AI trip generation & live replanning',
    'Direct flight, hotel, train & cab reservations',
    'In-app wallet credits & split group expenses',
    'Curated Travel DNA profile & saved folios'
  ],
  onNavigate
}) => {
  const { openAuthModal } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="bg-white border border-[#E4E4DF] rounded-3xl p-8 sm:p-12 shadow-editorial relative overflow-hidden">
        {/* Subtle background badge decoration */}
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-[#F7F7F4] rounded-full -z-0 opacity-60 pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          {/* Lock Icon Emblem */}
          <div className="w-16 h-16 bg-[#F7F7F4] border border-[#E4E4DF] rounded-2xl flex items-center justify-center mx-auto text-[#B45F3C] shadow-2xs">
            <Lock className="w-7 h-7" />
          </div>

          {/* Heading info */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F7F7F4] text-[#B45F3C] border border-[#E4E4DF] rounded-full text-[10px] font-mono tracking-widest uppercase font-bold">
              <Compass className="w-3 h-3" />
              {category}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#242424] tracking-tight">
              {title}
            </h2>
            <p className="font-prose text-sm sm:text-base text-[#6B6B67] max-w-lg mx-auto italic">
              {description}
            </p>
          </div>

          {/* Member perks checklist */}
          <div className="bg-[#F7F7F4]/80 border border-[#E4E4DF] rounded-2xl p-4 sm:p-5 max-w-md mx-auto text-left space-y-2.5">
            <div className="text-[10.5px] font-mono uppercase tracking-wider text-[#242424] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B45F3C]" />
              Membership Unlocks:
            </div>
            <ul className="space-y-2">
              {perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#555555]">
                  <ShieldCheck className="w-4 h-4 text-[#5F7564] shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full sm:w-auto px-6 py-3 bg-[#242424] hover:bg-[#B45F3C] text-white text-xs font-mono uppercase tracking-wider font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#F7F7F4] text-[#242424] border border-[#E4E4DF] text-xs font-mono uppercase tracking-wider font-bold rounded-xl transition-colors cursor-pointer"
            >
              Sign In to Account
            </button>
          </div>

          {onNavigate && (
            <div className="pt-2">
              <button
                onClick={() => onNavigate('home')}
                className="text-xs font-mono text-[#6B6B67] hover:text-[#242424] underline cursor-pointer"
              >
                Return to Public Showcase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
