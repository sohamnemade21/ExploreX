import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Map, 
  Package, 
  Ticket, 
  Briefcase, 
  Car, 
  Sparkles, 
  User, 
  Wallet, 
  ShieldCheck, 
  Shield,
  Menu, 
  X, 
  Camera, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';
import { TravelerSafetyCenterModal } from './TravelerSafetyCenterModal';

export type NavTab = 
  | 'home' 
  | 'explore' 
  | 'destinations' 
  | 'packages' 
  | 'bookings' 
  | 'mytrips' 
  | 'explorer' 
  | 'ai' 
  | 'moments' 
  | 'wallet' 
  | 'profile' 
  | 'admin'
  | 'login'
  | 'signup';

interface NavbarProps {
  currentTab?: NavTab;
  activeTab?: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, activeTab, onSelectTab, onOpenAuth }) => {
  const effectiveTab = currentTab || activeTab || 'home';
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenSafety = () => setSafetyModalOpen(true);
    window.addEventListener('explorex:open-safety', handleOpenSafety);
    return () => window.removeEventListener('explorex:open-safety', handleOpenSafety);
  }, []);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    onSelectTab(mode);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'explore', label: 'Explore', icon: Map },
    { id: 'destinations', label: 'Destinations', icon: Compass },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'bookings', label: 'Bookings', icon: Ticket },
    { id: 'mytrips', label: 'My Trips', icon: Briefcase },
    { id: 'explorer', label: 'The Explorer', icon: Car },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles, badge: 'AI' }
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId as NavTab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E4E4DF] shadow-xs transition-colors w-full overflow-x-clip">
      <div className="w-full px-3 sm:px-4 xl:px-6 2xl:px-8 max-w-[1760px] mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-17 gap-2 xl:gap-3">
          
          {/* 1. LEFT SIDE — BRAND */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 bg-[#242424] text-white rounded-md flex items-center justify-center font-display text-sm sm:text-base font-bold group-hover:bg-[#B45F3C] transition-colors shrink-0">
              X
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#242424] whitespace-nowrap">
                  Explore<span className="text-[#B45F3C]">X</span>
                </span>
                <span className="hidden 2xl:inline-block px-1.5 py-0.5 text-[8px] font-mono tracking-wider uppercase bg-[#F7F7F4] text-[#6B6B67] rounded border border-[#E4E4DF]">
                  MAGAZINE
                </span>
              </div>
              <span className="text-[7.5px] sm:text-[8px] font-mono tracking-widest uppercase text-[#6B6B67] leading-none mt-0.5 hidden 2xl:block">
                TRAVEL JOURNAL & ATELIER
              </span>
            </div>
          </div>

          {/* 2. CENTER — MAIN NAVIGATION */}
          <nav className="hidden xl:flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 mx-1 xl:mx-2 shrink-0 min-w-0">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = effectiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`h-8.5 xl:h-9 px-2 xl:px-2.5 2xl:px-3 flex items-center gap-1.5 text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-medium rounded-lg transition-all relative shrink-0 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#242424] font-semibold bg-[#F7F7F4] border border-[#E4E4DF]'
                      : 'text-[#6B6B67] hover:text-[#242424] hover:bg-[#F7F7F4]/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-3.5 xl:h-3.5 shrink-0 ${isActive ? 'text-[#B45F3C]' : 'text-[#6B6B67]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-[#5F7564] text-white text-[8px] font-mono font-bold rounded leading-tight">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. RIGHT SIDE — USER CONTROLS */}
          <div className="hidden sm:flex items-center gap-1.5 xl:gap-2 2xl:gap-2.5 shrink-0">
            {isAuthenticated && user ? (
              <>
                {/* Wallet Balance Chip */}
                <button
                  onClick={() => handleNavClick('wallet')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F7F7F4] border border-[#E4E4DF] transition-all group shrink-0 cursor-pointer text-left whitespace-nowrap"
                  title="ExploreX In-App Wallet"
                >
                  <div className="w-5 h-5 rounded bg-[#F7F7F4] text-[#B45F3C] flex items-center justify-center border border-[#E4E4DF] shrink-0">
                    <Wallet className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-[7.5px] font-mono text-[#6B6B67] uppercase leading-none">Wallet</div>
                    <div className="text-[11.5px] font-mono font-bold text-[#242424] group-hover:text-[#B45F3C] leading-tight">
                      {formatINR(user.walletBalance || 0)}
                    </div>
                  </div>
                </button>

                {/* Traveler Safety & SOS Button */}
                <button
                  onClick={() => setSafetyModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-xs whitespace-nowrap"
                  title="Traveler Safety Center & 24/7 SOS"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider font-bold">Safety / SOS</span>
                </button>

                {/* ADMIN Badge (ONLY VISIBLE FOR ADMIN ROLE) */}
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 border transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                      effectiveTab === 'admin'
                        ? 'bg-[#242424] text-white border-[#242424]'
                        : 'bg-white text-[#555555] border-[#E4E4DF] hover:bg-[#F7F7F4] hover:text-[#242424]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B45F3C] shrink-0" />
                    <span>ADMIN</span>
                  </button>
                )}

                {/* User Profile Dropdown */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 pl-1.5 pr-2.5 rounded-lg hover:bg-[#F7F7F4] border border-[#E4E4DF] transition-colors bg-white cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-[#E4E4DF] shrink-0"
                    />
                    <span className="text-xs font-semibold text-[#242424] max-w-[70px] xl:max-w-[100px] 2xl:max-w-[130px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3 h-3 text-[#6B6B67] shrink-0" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-editorial border border-[#E4E4DF] py-1.5 z-50 animate-in fade-in">
                      <div className="px-4 py-2 border-b border-[#E4E4DF]">
                        <div className="text-xs font-display font-bold text-[#242424]">{user.name}</div>
                        <div className="text-[10px] font-mono text-[#6B6B67] truncate">{user.email}</div>
                      </div>

                      <button
                        onClick={() => {
                          handleNavClick('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#555555] hover:bg-[#F7F7F4] hover:text-[#242424] flex items-center gap-2.5 font-medium cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-[#6B6B67]" />
                        Curator Profile & DNA
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('mytrips');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#555555] hover:bg-[#F7F7F4] hover:text-[#242424] flex items-center gap-2.5 font-medium cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-[#6B6B67]" />
                        My Journeys & Vouchers
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('moments');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#555555] hover:bg-[#F7F7F4] hover:text-[#242424] flex items-center gap-2.5 font-medium cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#6B6B67]" />
                        Magic Moments
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('wallet');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#555555] hover:bg-[#F7F7F4] hover:text-[#242424] flex items-center gap-2.5 font-medium cursor-pointer"
                      >
                        <Wallet className="w-3.5 h-3.5 text-[#6B6B67]" />
                        Expedition Ledger & Split
                      </button>

                      <button
                        onClick={() => {
                          setSafetyModalOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 font-semibold cursor-pointer border-t border-[#F7F7F4] mt-0.5"
                      >
                        <Shield className="w-3.5 h-3.5 text-rose-600" />
                        Traveler Safety & SOS
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            handleNavClick('admin');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-[#B45F3C] hover:bg-[#F7F7F4] flex items-center gap-2.5 font-semibold cursor-pointer border-t border-[#F7F7F4] mt-1 pt-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#B45F3C]" />
                          Admin Console
                        </button>
                      )}

                      <div className="border-t border-[#E4E4DF] my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          handleNavClick('home');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 font-semibold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* LOGGED OUT / GUEST VISITOR CONTROLS */
              <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
                <button
                  onClick={() => setSafetyModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-xs whitespace-nowrap"
                  title="Traveler Safety Center & 24/7 SOS"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="font-mono text-[11px] uppercase tracking-wider font-bold">Safety / SOS</span>
                </button>
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3 xl:px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider font-bold text-[#242424] hover:text-[#B45F3C] hover:bg-[#F7F7F4] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-3 xl:px-3.5 py-1.5 bg-[#242424] hover:bg-[#B45F3C] text-white text-xs font-mono uppercase tracking-wider font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            {isAuthenticated && (
              <button
                onClick={() => handleNavClick('wallet')}
                className="p-2 rounded-xl bg-white border border-[#E4E4DF] text-[#91482D] cursor-pointer shadow-2xs shrink-0"
              >
                <Wallet className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-[#E4E4DF] text-[#242424] hover:bg-[#F7F7F4] transition-colors cursor-pointer shadow-2xs shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#E4E4DF] px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-4 shadow-xs">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = effectiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                  isActive 
                    ? 'bg-[#F7F7F4] text-[#242424] font-semibold border border-[#E4E4DF]' 
                    : 'text-[#6B6B67] hover:bg-[#F7F7F4] hover:text-[#242424]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B45F3C]' : 'text-[#6B6B67]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 bg-[#5F7564] text-white text-[9px] font-mono font-bold rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#E4E4DF] space-y-1">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => handleNavClick('moments')}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium text-[#6B6B67] hover:bg-[#F7F7F4] flex items-center gap-3 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#6B6B67]" />
                  <span>Magic Moments</span>
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium text-[#6B6B67] hover:bg-[#F7F7F4] flex items-center gap-3 cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#6B6B67]" />
                  <span>Profile & Travel DNA</span>
                </button>
                <button
                  onClick={() => {
                    setSafetyModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 flex items-center gap-3 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-rose-600" />
                  <span>Traveler Safety & SOS</span>
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-medium text-[#91482D] hover:bg-[#F7F7F4] flex items-center gap-3 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#91482D]" />
                    <span>Admin Command Console</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    handleNavClick('home');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 flex items-center gap-3 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out ({user.name})</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setSafetyModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-colors text-center cursor-pointer border border-rose-200 flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4 text-rose-600" />
                  <span>Traveler Safety & 24/7 SOS</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="w-full py-2.5 bg-[#F7F7F4] hover:bg-[#E4E4DF] text-[#242424] font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-colors text-center cursor-pointer border border-[#E4E4DF]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavClick('signup')}
                    className="w-full py-2.5 bg-[#242424] hover:bg-[#91482D] text-[#FFFFFF] font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-colors text-center cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Traveler Safety Center Modal */}
      <TravelerSafetyCenterModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
      />
    </header>
  );
};
