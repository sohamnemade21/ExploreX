import React from 'react';
import { Compass, ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail, Globe, Feather } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#242424] text-[#EEEEEE] pt-14 pb-10 border-t border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#333333]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab('home')}>
              <div className="w-7.5 h-7.5 rounded-md bg-white text-[#242424] flex items-center justify-center font-display text-base font-bold shadow-xs">
                X
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-display font-bold text-white tracking-tight">Explore<span className="text-[#B45F3C]">X</span></span>
                <span className="px-1.5 py-0.5 text-[8px] font-mono tracking-wider uppercase bg-[#333333] text-[#AAAAAA] rounded border border-[#444444]">
                  JOURNAL
                </span>
              </div>
            </div>
            <p className="text-xs text-[#AAAAAA] leading-relaxed max-w-sm">
              An independent travel atelier and intelligent expedition journal. Connecting conscious travelers to authentic cultural craft, under-visited sanctuaries, and local master guilds.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#5F7564]/25 border border-[#5F7564]/60 text-white text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5F7564]" />
              Verified Responsible Tourism Partner
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-[10.5px] font-mono font-bold text-white uppercase tracking-wider">Atlas & Itineraries</h4>
            <ul className="space-y-1.5 text-xs text-[#AAAAAA]">
              <li><button onClick={() => onSelectTab('destinations')} className="hover:text-white transition-colors cursor-pointer">Curated Sanctuaries</button></li>
              <li><button onClick={() => onSelectTab('packages')} className="hover:text-white transition-colors cursor-pointer">Bespoke Expeditions</button></li>
              <li><button onClick={() => onSelectTab('bookings')} className="hover:text-white transition-colors cursor-pointer">Transit & Stays</button></li>
              <li><button onClick={() => onSelectTab('explore')} className="hover:text-white transition-colors cursor-pointer">Interactive Atlas Map</button></li>
              <li><button onClick={() => onSelectTab('explorer')} className="hover:text-white transition-colors cursor-pointer">The Explorer Mobility</button></li>
            </ul>
          </div>

          {/* Concierge & Curations */}
          <div className="space-y-2.5">
            <h4 className="text-[10.5px] font-mono font-bold text-white uppercase tracking-wider">Concierge Salon</h4>
            <ul className="space-y-1.5 text-xs text-[#AAAAAA]">
              <li><button onClick={() => onSelectTab('ai')} className="hover:text-white transition-colors cursor-pointer">Travel Concierge</button></li>
              <li><button onClick={() => onSelectTab('ai')} className="hover:text-white transition-colors cursor-pointer">Slow Travel Assistant</button></li>
              <li><button onClick={() => onSelectTab('destinations')} className="hover:text-white transition-colors cursor-pointer">Demand Balancer</button></li>
              <li><button onClick={() => onSelectTab('profile')} className="hover:text-white transition-colors cursor-pointer">Traveler DNA</button></li>
              <li><button onClick={() => onSelectTab('moments')} className="hover:text-white transition-colors cursor-pointer">Moments Gallery</button></li>
            </ul>
          </div>

          {/* Services & Tools */}
          <div className="space-y-2.5">
            <h4 className="text-[10.5px] font-mono font-bold text-white uppercase tracking-wider">Expedition Ledger</h4>
            <ul className="space-y-1.5 text-xs text-[#AAAAAA]">
              <li><button onClick={() => onSelectTab('mytrips')} className="hover:text-white transition-colors cursor-pointer">My Journeys & Vouchers</button></li>
              <li><button onClick={() => onSelectTab('wallet')} className="hover:text-white transition-colors cursor-pointer">In-App Wallet</button></li>
              <li><button onClick={() => onSelectTab('wallet')} className="hover:text-white transition-colors cursor-pointer">Group Splitter</button></li>
              <li><button onClick={() => onSelectTab('profile')} className="hover:text-white transition-colors cursor-pointer">Curator Profile</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B6B67]">
          <p>© 2026 ExploreX Atelier. Designed for conscious exploration.</p>
          <div className="flex items-center gap-5 font-mono text-[10.5px]">
            <span className="hover:text-white cursor-pointer">Heritage Accord</span>
            <span className="hover:text-white cursor-pointer">Privacy Charter</span>
            <span className="hover:text-white cursor-pointer">Ethics & Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
