import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Shield,
  AlertTriangle,
  Phone,
  UserCheck,
  MapPin,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Radio,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Users,
  HeartHandshake,
  Navigation,
  Car,
  Hotel,
  Moon,
  Info,
  Send,
  Check,
  Compass,
  Sparkles
} from 'lucide-react';
import { EmergencyContact, TravelerSafetyProfile, TravelMode, SafetyAlert } from '../types';
import { useAuth } from '../context/AuthContext';

interface TravelerSafetyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDestinationName?: string;
  activeCoordinates?: { lat: number; lng: number };
}

const COUNTRY_CALLING_CODES = [
  { code: '+91', country: 'India (IN)', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom (UK)', flag: '🇬🇧' },
  { code: '+61', country: 'Australia (AU)', flag: '🇦🇺' },
  { code: '+49', country: 'Germany (DE)', flag: '🇩🇪' },
  { code: '+33', country: 'France (FR)', flag: '🇫🇷' },
  { code: '+65', country: 'Singapore (SG)', flag: '🇸🇬' },
  { code: '+81', country: 'Japan (JP)', flag: '🇯🇵' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' }
];

type SafetyCenterTab = 
  | 'sos' 
  | 'contacts' 
  | 'checkin' 
  | 'solo_female' 
  | 'group_family' 
  | 'alerts' 
  | 'helplines' 
  | 'international';

export const TravelerSafetyCenterModal: React.FC<TravelerSafetyCenterModalProps> = ({
  isOpen,
  onClose,
  activeDestinationName = 'India',
  activeCoordinates
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SafetyCenterTab>('sos');
  const [safetyProfile, setSafetyProfile] = useState<TravelerSafetyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [sosConfirmOpen, setSosConfirmOpen] = useState(false);
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [sosActiveResult, setSosActiveResult] = useState<any>(null);
  const [discreetModeActive, setDiscreetModeActive] = useState(false);
  const [discreetToast, setDiscreetToast] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [alertFilter, setAlertFilter] = useState<string>('all');
  const [checkInSuccessMsg, setCheckInSuccessMsg] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [quickPingSuccess, setQuickPingSuccess] = useState<string | null>(null);
  const [groupStatuses, setGroupStatuses] = useState<any[]>([]);

  // New Contact Form State
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRel, setNewContactRel] = useState('Family / Guardian');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactCode, setNewContactCode] = useState('+91');

  // Currency Converter State for Discreet Mode
  const [discreetInrAmount, setDiscreetInrAmount] = useState<string>('2500');

  // Prevent background body scrolling when modal is open and restore completely on close
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Load Safety Profile, Dynamic Alerts, and Group Status
  useEffect(() => {
    if (isOpen && user) {
      loadProfileAndAlerts();
      loadGroupStatus();
    }
  }, [isOpen, user, activeDestinationName]);

  const loadProfileAndAlerts = async () => {
    setLoading(true);
    try {
      // Fetch safety profile
      const profRes = await fetch('/api/safety/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'x-user-id': user?.id || 'usr-current'
        }
      });
      if (profRes.ok) {
        const data = await profRes.json();
        setSafetyProfile(data);
        if (data.checkInStatus === 'sos_active') {
          setSosActiveResult({
            alertId: 'SOS-ACTIVE',
            status: 'active',
            messageDispatched: 'Active Emergency Alert in progress. Emergency contacts and tourist police notified.',
            shareableTripTrackerUrl: 'https://explorex.travel/live/trip-checkin',
            contactsNotified: data.emergencyContacts?.length || 1
          });
        }
      }

      // Fetch dynamic alerts
      const latParam = activeCoordinates?.lat ? `&lat=${activeCoordinates.lat}` : '';
      const lngParam = activeCoordinates?.lng ? `&lng=${activeCoordinates.lng}` : '';
      const modeParam = safetyProfile?.travelMode ? `&travelMode=${safetyProfile.travelMode}` : '';
      const alertsRes = await fetch(`/api/safety/alerts?destination=${encodeURIComponent(activeDestinationName)}${latParam}${lngParam}${modeParam}`);
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData);
      }
    } catch (err) {
      console.warn('Safety center load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadGroupStatus = async () => {
    try {
      const res = await fetch('/api/safety/group-status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'x-user-id': user?.id || 'usr-current'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setGroupStatuses(data);
      }
    } catch (err) {
      console.warn('Group status load notice:', err);
    }
  };

  const handleUpdateProfile = async (updates: Partial<TravelerSafetyProfile>) => {
    if (!safetyProfile) return;
    const updated = { ...safetyProfile, ...updates };
    setSafetyProfile(updated);

    try {
      await fetch('/api/safety/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'x-user-id': user?.id || 'usr-current'
        },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.warn('Update safety profile error:', err);
    }
  };

  // SOS Countdown Handler
  const startSosCountdown = () => {
    setSosConfirmOpen(false);
    setSosCountdown(5);
  };

  useEffect(() => {
    if (sosCountdown === null) return;
    if (sosCountdown > 0) {
      const timer = setTimeout(() => setSosCountdown(sosCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (sosCountdown === 0) {
      executeSosTrigger();
      setSosCountdown(null);
    }
  }, [sosCountdown]);

  const executeSosTrigger = async () => {
    try {
      const payload = {
        travelMode: safetyProfile?.travelMode || 'general',
        location: {
          destinationName: activeDestinationName,
          lat: activeCoordinates?.lat,
          lng: activeCoordinates?.lng
        },
        customMessage: 'Emergency Assistance Requested immediately via ExploreX Safety System.',
        isDiscreet: discreetModeActive,
        timestamp: new Date().toISOString()
      };

      const res = await fetch('/api/safety/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'x-user-id': user?.id || 'usr-current'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        setSosActiveResult(result);
        setSafetyProfile(prev => prev ? { ...prev, checkInStatus: 'sos_active' } : null);
        if (discreetModeActive) {
          setDiscreetToast('Calculated exchange rate: 1 USD ≈ 83.25 INR. Sync completed.');
          setTimeout(() => setDiscreetToast(null), 4000);
        }
      }
    } catch (err) {
      console.warn('SOS dispatch error:', err);
    }
  };

  const handleResolveSos = async () => {
    try {
      const res = await fetch('/api/safety/sos/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'x-user-id': user?.id || 'usr-current'
        }
      });
      if (res.ok) {
        setSosActiveResult(null);
        setSafetyProfile(prev => prev ? { ...prev, checkInStatus: 'safe', lastCheckInTime: new Date().toISOString() } : null);
      }
    } catch (err) {
      console.warn('Resolve SOS error:', err);
    }
  };

  const handleSafetyCheckIn = async (presetNote = 'Safe and sound on journey') => {
    try {
      const res = await fetch('/api/safety/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'x-user-id': user?.id || 'usr-current'
        },
        body: JSON.stringify({ status: 'safe', note: presetNote })
      });
      if (res.ok) {
        const data = await res.json();
        setCheckInSuccessMsg(`Check-in recorded at ${new Date(data.lastCheckInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
        setSafetyProfile(prev => prev ? { ...prev, checkInStatus: 'safe', lastCheckInTime: data.lastCheckInTime } : null);
        setTimeout(() => setCheckInSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.warn('Check-in error:', err);
    }
  };

  const handleQuickContactPing = async () => {
    try {
      const primary = safetyProfile?.emergencyContacts?.find(c => c.isPrimary) || safetyProfile?.emergencyContacts?.[0];
      const res = await fetch('/api/safety/contact-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'x-user-id': user?.id || 'usr-current'
        },
        body: JSON.stringify({
          contactId: primary?.id,
          note: `Quick Safety Ping: I am currently near ${activeDestinationName}. Everything is fine!`,
          location: { destinationName: activeDestinationName, lat: activeCoordinates?.lat, lng: activeCoordinates?.lng }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setQuickPingSuccess(`Reassurance ping sent to ${data.recipientName} (${data.phoneMasked})`);
        setTimeout(() => setQuickPingSuccess(null), 3500);
      }
    } catch (err) {
      console.warn('Quick ping error:', err);
    }
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const cleanDigits = newContactPhone.replace(/\D/g, '');
    if (cleanDigits.length < 7 || cleanDigits.length > 15) {
      alert('Please enter a valid phone number with 7 to 15 digits.');
      return;
    }

    const newContact: EmergencyContact = {
      id: `contact-${Date.now()}`,
      name: newContactName.trim(),
      relationship: newContactRel,
      phone: newContactPhone.trim(),
      countryCode: newContactCode,
      isPrimary: (safetyProfile?.emergencyContacts || []).length === 0
    };

    const updatedList = [...(safetyProfile?.emergencyContacts || []), newContact];
    handleUpdateProfile({ emergencyContacts: updatedList });

    setNewContactName('');
    setNewContactPhone('');
    setIsAddingContact(false);
  };

  const handleDeleteContact = (id: string) => {
    const updated = (safetyProfile?.emergencyContacts || []).filter(c => c.id !== id);
    handleUpdateProfile({ emergencyContacts: updated });
  };

  const handleSetPrimaryContact = (id: string) => {
    const updated = (safetyProfile?.emergencyContacts || []).map(c => ({
      ...c,
      isPrimary: c.id === id
    }));
    handleUpdateProfile({ emergencyContacts: updated });
  };

  const handleShareTrip = () => {
    const primary = safetyProfile?.emergencyContacts?.find(c => c.isPrimary) || safetyProfile?.emergencyContacts?.[0];
    const text = encodeURIComponent(`ExploreX Live Trip Tracker: I'm currently traveling near ${activeDestinationName}. Track my journey safely: https://explorex.travel/live/trip-checkin`);
    const phone = primary ? `${primary.countryCode}${primary.phone.replace(/\D/g, '')}` : '';
    
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    } else {
      navigator.clipboard.writeText(`https://explorex.travel/live/trip-checkin - Traveling near ${activeDestinationName}`);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  // Check if scheduled check-in is overdue
  const isMissedCheckIn = useMemo(() => {
    if (!safetyProfile?.lastCheckInTime) return false;
    const last = new Date(safetyProfile.lastCheckInTime).getTime();
    const intervalMs = (safetyProfile.checkInIntervalHours || 6) * 60 * 60 * 1000;
    return Date.now() > last + intervalMs && safetyProfile.checkInStatus !== 'sos_active';
  }, [safetyProfile?.lastCheckInTime, safetyProfile?.checkInIntervalHours, safetyProfile?.checkInStatus]);

  const overdueHours = useMemo(() => {
    if (!safetyProfile?.lastCheckInTime) return 0;
    const last = new Date(safetyProfile.lastCheckInTime).getTime();
    const intervalMs = (safetyProfile.checkInIntervalHours || 6) * 60 * 60 * 1000;
    const diff = Date.now() - (last + intervalMs);
    return Math.max(1, Math.round(diff / (60 * 60 * 1000)));
  }, [safetyProfile?.lastCheckInTime, safetyProfile?.checkInIntervalHours]);

  const filteredAlerts = useMemo(() => {
    if (alertFilter === 'all') return alerts;
    return alerts.filter(a => a.type === alertFilter);
  }, [alerts, alertFilter]);

  if (!isOpen || typeof document === 'undefined') return null;

  // ─────────────────────────────────────────────────────────────────────────────
  // DISCREET SOS MODE (Disguised Functional Travel Currency Calculator)
  // ─────────────────────────────────────────────────────────────────────────────
  if (discreetModeActive) {
    const inrVal = parseFloat(discreetInrAmount) || 0;
    const usdVal = (inrVal / 83.25).toFixed(2);
    const eurVal = (inrVal / 90.10).toFixed(2);
    const gbpVal = (inrVal / 105.40).toFixed(2);

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs text-stone-600 font-bold uppercase tracking-wider">Currency & Exchange Tool</span>
            </div>
            <button
              onClick={() => setDiscreetModeActive(false)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer"
              title="Exit tool"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[11px] text-stone-500 uppercase font-mono font-bold block mb-1">Enter Amount (INR ₹)</label>
              <input
                type="number"
                value={discreetInrAmount}
                onChange={e => setDiscreetInrAmount(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-lg font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] text-stone-500 font-mono block">USD ($)</span>
                <span className="font-mono font-bold text-stone-800 text-sm">${usdVal}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] text-stone-500 font-mono block">EUR (€)</span>
                <span className="font-mono font-bold text-stone-800 text-sm">€{eurVal}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] text-stone-500 font-mono block">GBP (£)</span>
                <span className="font-mono font-bold text-stone-800 text-sm">£{gbpVal}</span>
              </div>
            </div>

            {/* Silent Trigger Tap Zone */}
            <button
              onClick={executeSosTrigger}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 active:scale-98 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Convert & Sync Exchange Rate</span>
            </button>

            {discreetToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-mono text-emerald-800 animate-in fade-in">
                {discreetToast}
              </div>
            )}

            <p className="text-[10px] text-stone-400 text-center leading-relaxed">
              Discreet Safeguard: Tapping "Convert & Sync" silently transmits an emergency location alert to your trusted contacts with zero audible sounds or flashing alarms.
            </p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TRUE FULLSCREEN SAFETY CENTER MODAL
  // ─────────────────────────────────────────────────────────────────────────────
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center w-full h-full overflow-hidden p-0 sm:p-3 md:p-5 lg:p-6 animate-in fade-in duration-150">
      <div className="w-full h-full max-w-6xl max-h-full sm:max-h-[92vh] mx-auto bg-[#FAF9F5] rounded-none sm:rounded-2xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden">
        
        {/* TOP HEADER BAR */}
        <div className="bg-[#181816] text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-base sm:text-lg text-white">Traveler Safety & SOS Center</h1>
                {safetyProfile?.checkInStatus === 'sos_active' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-rose-600 text-white animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    SOS ACTIVE
                  </span>
                ) : isMissedCheckIn ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-amber-500 text-white flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    CHECK-IN OVERDUE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    STATUS: SAFE
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                24/7 Verified Tourist Police Support (1363 / 112) • Grounded in Official Ministry Guidelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDiscreetModeActive(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Activate Discreet Screen"
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Discreet Mode</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Safety Center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-[#E4E4DF] bg-white px-3 sm:px-6 gap-1 sm:gap-2 overflow-x-auto shrink-0 shadow-xs">
          {[
            { id: 'sos', label: 'Emergency SOS', icon: AlertTriangle, badge: safetyProfile?.checkInStatus === 'sos_active' ? '!' : undefined },
            { id: 'contacts', label: 'Trusted Contacts & Sharing', icon: Phone },
            { id: 'checkin', label: 'Safety Check-In', icon: UserCheck, badge: isMissedCheckIn ? '⚠️' : undefined },
            { id: 'solo_female', label: 'Female & Solo Traveler', icon: HeartHandshake },
            { id: 'group_family', label: 'Group & Family Safety', icon: Users },
            { id: 'alerts', label: 'Live Alerts', icon: AlertCircle, count: alerts.length },
            { id: 'helplines', label: 'Official Helplines', icon: Globe },
            { id: 'international', label: 'Foreign Visitor Guide', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SafetyCenterTab)}
                className={`py-3 px-2.5 sm:px-3 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#91482D] text-[#91482D] bg-stone-50/70 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#91482D]' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono flex items-center justify-center font-bold">
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[10px] font-bold text-rose-600 animate-pulse">{tab.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* MODAL BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ─────────────────────────────────────────────────────────────────────────────
              TAB 1: EMERGENCY SOS (Zero-scroll immediate action layout)
             ───────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'sos' && (
            <div className="space-y-4">
              
              {/* Active SOS Distress Banner */}
              {sosActiveResult && (
                <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-2.5 shadow-sm animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                      <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
                      <span>Distress Alert Broadcasted ({sosActiveResult.alertId})</span>
                    </div>
                    <button
                      onClick={handleResolveSos}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>I Am Safe Now (Resolve SOS)</span>
                    </button>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    {sosActiveResult.messageDispatched}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-rose-900 pt-1">
                    <span>• {sosActiveResult.contactsNotified || 1} trusted contact(s) notified</span>
                    <span>• Tourist Police (1363) alert dispatched</span>
                    <a href={sosActiveResult.shareableTripTrackerUrl} target="_blank" rel="noreferrer" className="underline font-bold text-rose-950 flex items-center gap-1">
                      <span>Open Live Tracker</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Countdown Active Notification */}
              {sosCountdown !== null && (
                <div className="p-5 bg-rose-600 text-white rounded-2xl text-center space-y-3 shadow-lg animate-pulse">
                  <h2 className="text-xl font-bold uppercase tracking-wider">Broadcasting Emergency SOS in {sosCountdown} seconds...</h2>
                  <p className="text-xs text-rose-100">
                    Your live GPS coordinates and distress broadcast will be dispatched to your trusted contacts and local tourist police.
                  </p>
                  <button
                    onClick={() => setSosCountdown(null)}
                    className="px-6 py-2 bg-white text-rose-700 rounded-xl font-bold text-xs hover:bg-rose-50 cursor-pointer shadow-md"
                  >
                    Cancel SOS Alert
                  </button>
                </div>
              )}

              {/* Responsive 2-Column SOS Main Grid (Entire interface visible immediately) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Left Column: SOS Trigger Card (lg: 7 cols) */}
                <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase font-bold text-rose-700 tracking-wider">Priority Emergency Response</span>
                      <span className="text-xs text-stone-500 font-mono">Near {activeDestinationName}</span>
                    </div>
                    <h2 className="font-display text-base sm:text-lg font-bold text-stone-900 mt-1">One-Tap Emergency Assistance</h2>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Instantly transmits your current GPS location to trusted contacts and connects with 24/7 tourist police.
                    </p>
                  </div>

                  {/* Big SOS Trigger Button */}
                  <div className="py-2 text-center">
                    <button
                      onClick={() => setSosConfirmOpen(true)}
                      className="w-36 h-36 sm:w-40 sm:h-40 mx-auto rounded-full bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-display font-black text-2xl tracking-wider shadow-xl flex flex-col items-center justify-center gap-1 border-4 border-rose-200/80 active:scale-95 transition-all cursor-pointer group"
                    >
                      <AlertTriangle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      <span>SOS</span>
                      <span className="text-[9px] font-mono uppercase tracking-normal font-medium text-rose-200">Tap to Trigger</span>
                    </button>
                  </div>

                  {/* Secondary Fast Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => setDiscreetModeActive(true)}
                      className="text-xs font-mono text-stone-600 hover:text-stone-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                      <span>Discreet Calculator SOS</span>
                    </button>
                    <button
                      onClick={handleQuickContactPing}
                      className="text-xs font-mono text-[#91482D] hover:text-[#78371E] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#91482D]/20 bg-[#91482D]/5 hover:bg-[#91482D]/10 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Quick Reassurance Ping</span>
                    </button>
                  </div>
                  {quickPingSuccess && (
                    <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2 rounded-lg text-center animate-in fade-in">
                      {quickPingSuccess}
                    </div>
                  )}
                </div>

                {/* Right Column: Direct Hotlines & Traveler Mode (lg: 5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                  
                  {/* Immediate Emergency Hotlines */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
                    <span className="text-[11px] font-mono uppercase font-bold text-stone-700 block">Immediate Direct Hotlines</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                      <a
                        href="tel:112"
                        className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                            112
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900">National Emergency</div>
                            <div className="text-[10px] text-stone-500">Police, Fire & Ambulance (24/7)</div>
                          </div>
                        </div>
                        <Phone className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                      </a>

                      <a
                        href="tel:1363"
                        className="p-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                            1363
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900">Tourist Police Helpline</div>
                            <div className="text-[10px] text-stone-500">Toll-Free in 12 Languages</div>
                          </div>
                        </div>
                        <Phone className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                      </a>

                      <a
                        href="tel:1091"
                        className="p-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                            1091
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900">Women Police Helpline</div>
                            <div className="text-[10px] text-stone-500">24/7 Female Distress Unit</div>
                          </div>
                        </div>
                        <Phone className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
                      </a>

                      <a
                        href="tel:108"
                        className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                            108
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900">Medical Ambulance</div>
                            <div className="text-[10px] text-stone-500">24/7 Paramedic Response</div>
                          </div>
                        </div>
                        <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>

                  {/* Active Traveler Mode Quick Select */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase font-bold text-stone-700">Traveler Mode</span>
                      <span className="text-[10px] text-stone-500">Adapts safety guidelines</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'general', label: '🛡️ General' },
                        { id: 'solo_female', label: '👩 Solo Female' },
                        { id: 'family', label: '👨‍👩‍👧 Family' },
                        { id: 'friends', label: '🎒 Friends' },
                        { id: 'solo_male', label: '👨 Solo Male' },
                        { id: 'female_group', label: '👥 Female Grp' }
                      ].map(mode => {
                        const isSelected = safetyProfile?.travelMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => handleUpdateProfile({ travelMode: mode.id as TravelMode })}
                            className={`p-1.5 rounded-lg text-center border text-[11px] font-medium transition-all cursor-pointer truncate ${
                              isSelected
                                ? 'border-[#91482D] bg-[#91482D]/10 text-[#91482D] font-bold'
                                : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                            }`}
                          >
                            {mode.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────────────────
              TAB 2: TRUSTED CONTACTS & TRIP SHARING
             ───────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'contacts' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-stone-900 text-sm">Emergency Trusted Contacts</h2>
                  <p className="text-xs text-stone-500">These contacts receive instant notifications when SOS is activated or during trip sharing.</p>
                </div>
                <button
                  onClick={() => setIsAddingContact(true)}
                  className="px-3.5 py-1.5 bg-[#91482D] hover:bg-[#78371E] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Contact</span>
                </button>
              </div>

              {/* One-Tap Share Trip Card */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-amber-700" />
                    <span>Share Live Journey & Verified Itinerary</span>
                  </div>
                  <div className="text-[11px] text-amber-800">
                    Sends your verified location near {activeDestinationName} and safety tracker directly via WhatsApp or secure link.
                  </div>
                </div>
                <button
                  onClick={handleShareTrip}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{shareSuccess ? 'Link Copied!' : 'Share Live Trip'}</span>
                </button>
              </div>

              {/* Add Contact Form Inline */}
              {isAddingContact && (
                <div className="p-4 bg-stone-50 border border-stone-300 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-stone-800 uppercase">New Trusted Contact</span>
                    <button onClick={() => setIsAddingContact(false)} className="text-stone-400 hover:text-stone-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={newContactName}
                        onChange={e => setNewContactName(e.target.value)}
                        placeholder="e.g. Maya Sharma"
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Relationship</label>
                      <select
                        value={newContactRel}
                        onChange={e => setNewContactRel(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-medium"
                      >
                        <option value="Family / Guardian">Family / Guardian</option>
                        <option value="Spouse / Partner">Spouse / Partner</option>
                        <option value="Friend">Friend</option>
                        <option value="Tour Leader / Guide">Tour Leader / Guide</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Mobile Phone Number</label>
                      <div className="flex gap-2">
                        <select
                          value={newContactCode}
                          onChange={e => setNewContactCode(e.target.value)}
                          className="w-36 p-2 bg-white border border-stone-200 rounded-lg text-xs font-medium shrink-0"
                        >
                          {COUNTRY_CALLING_CODES.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={newContactPhone}
                          onChange={e => setNewContactPhone(e.target.value)}
                          placeholder="e.g. 9876543210 (digits only)"
                          className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-medium font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setIsAddingContact(false)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddContact}
                      className="px-4 py-1.5 bg-[#91482D] text-white text-xs font-bold rounded-lg hover:bg-[#78371E] cursor-pointer"
                    >
                      Save Contact
                    </button>
                  </div>
                </div>
              )}

              {/* Contacts List */}
              <div className="space-y-2.5">
                {(safetyProfile?.emergencyContacts || []).length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 border border-dashed border-stone-200 rounded-2xl space-y-2">
                    <Phone className="w-8 h-8 text-stone-400 mx-auto" />
                    <div className="text-xs font-bold text-stone-700">No Emergency Contacts Added</div>
                    <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                      Add family members or close friends to receive instant alerts if you ever trigger Emergency SOS.
                    </p>
                  </div>
                ) : (
                  (safetyProfile?.emergencyContacts || []).map(contact => (
                    <div
                      key={contact.id}
                      className="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 hover:border-stone-400 transition-colors shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-700 text-xs">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">{contact.name}</span>
                            {contact.isPrimary && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-mono uppercase font-bold">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-stone-500">
                            {contact.countryCode} {contact.phone} • {contact.relationship}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!contact.isPrimary && (
                          <button
                            onClick={() => handleSetPrimaryContact(contact.id)}
                            className="px-2 py-1 text-[10px] text-stone-600 hover:bg-stone-100 rounded border border-stone-200 cursor-pointer"
                          >
                            Set Primary
                          </button>
                        )}
                        <a
                          href={`tel:${contact.countryCode}${contact.phone}`}
                          className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors"
                          title="Call contact"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────────────────
              TAB 3: SAFETY CHECK-IN & MISSED CHECK-IN ALERT
             ───────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'checkin' && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* Overdue Missed Check-In Alert Banner */}
              {isMissedCheckIn && (
                <div className="p-4 bg-amber-500 text-white rounded-2xl flex items-center justify-between gap-3 shadow-md animate-pulse">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-white shrink-0" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide">Missed Safety Check-In Alert</div>
                      <div className="text-[11px] text-amber-100">
                        Your scheduled check-in was due approximately {overdueHours} hour(s) ago. Log a check-in now to reassure your contacts.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSafetyCheckIn('All good, checked in after reminder')}
                    className="px-4 py-1.5 bg-white text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-50 cursor-pointer shrink-0 shadow-xs"
                  >
                    Check In Now
                  </button>
                </div>
              )}

              {/* Status & Quick Check-In Card */}
              <div className="p-5 bg-white border border-stone-200 rounded-2xl space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Traveler Safety Status: Safe & Protected</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">
                    Last logged: {safetyProfile?.lastCheckInTime ? new Date(safetyProfile.lastCheckInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </span>
                </div>
                
                <p className="text-xs text-stone-600 leading-relaxed">
                  Log periodic safety check-ins during long journeys, evening transit, or off-beat excursions. If a scheduled check-in is missed, you and your trusted contacts receive automatic reminder prompts.
                </p>

                {/* Preset Check-In Quick Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { label: '🏨 Hotel Safe', note: 'Arrived safely at accommodation' },
                    { label: '🚗 Transit On Schedule', note: 'Traveling on verified transit route' },
                    { label: '🏛️ Tour Active', note: 'Exploring tourist destination safely' },
                    { label: '🌙 Evening Settled', note: 'Concluded day tour safely' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSafetyCheckIn(preset.note)}
                      className="p-2.5 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 transition-colors text-left cursor-pointer"
                    >
                      <div className="font-bold text-stone-900 text-[11px]">{preset.label}</div>
                      <div className="text-[10px] text-stone-500 truncate">{preset.note}</div>
                    </button>
                  ))}
                </div>

                {checkInSuccessMsg && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-mono font-bold text-emerald-800 animate-in fade-in">
                    ✓ {checkInSuccessMsg}
                  </div>
                )}
              </div>

              {/* Check-In Frequency Selector */}
              <div className="border border-stone-200 rounded-2xl p-4 space-y-3 bg-white shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase font-bold text-stone-800">Check-In Frequency & Interval</span>
                    <p className="text-[11px] text-stone-500">Sets interval for missed check-in warnings.</p>
                  </div>
                  <Clock className="w-4 h-4 text-stone-400" />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[2, 4, 6, 8, 12, 24].map(hours => (
                    <button
                      key={hours}
                      onClick={() => handleUpdateProfile({ checkInIntervalHours: hours })}
                      className={`py-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                        safetyProfile?.checkInIntervalHours === hours
                          ? 'border-[#91482D] bg-[#91482D]/10 text-[#91482D]'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {hours} Hours
                    </button>
                  ))}
                </div>
              </div>

              {/* Safety Safeguards Configuration */}
              <div className="space-y-2 border border-stone-200 rounded-2xl p-4 bg-white shadow-xs">
                <span className="text-xs font-mono uppercase font-bold text-stone-800 block mb-2">Automated Traveler Safeguards</span>
                
                <label className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl cursor-pointer transition-colors">
                  <div className="space-y-0.5 pr-3">
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-stone-600" />
                      <span>Night-Travel Precaution (After 7:00 PM)</span>
                    </div>
                    <div className="text-[11px] text-stone-500">Warns when itinerary activities take place after dark in secluded zones.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={safetyProfile?.avoidNightTravel ?? true}
                    onChange={e => handleUpdateProfile({ avoidNightTravel: e.target.checked })}
                    className="w-4 h-4 text-[#91482D] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl cursor-pointer transition-colors">
                  <div className="space-y-0.5 pr-3">
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-stone-600" />
                      <span>Safer-Route Preference</span>
                    </div>
                    <div className="text-[11px] text-stone-500">Prioritizes well-lit, arterial roads and verified tourist corridors.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={safetyProfile?.saferRoutePreferred ?? true}
                    onChange={e => handleUpdateProfile({ saferRoutePreferred: e.target.checked })}
                    className="w-4 h-4 text-[#91482D] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl cursor-pointer transition-colors">
                  <div className="space-y-0.5 pr-3">
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-stone-600" />
                      <span>Safer Transport Preference</span>
                    </div>
                    <div className="text-[11px] text-stone-500">Filters towards verified GPS cabs, airport prepaid booths, and hotel transit.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={safetyProfile?.saferTransportPreferred ?? true}
                    onChange={e => handleUpdateProfile({ saferTransportPreferred: e.target.checked })}
                    className="w-4 h-4 text-[#91482D] rounded"
                  />
                </label>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────────────────
              TAB 4: FEMALE & SOLO TRAVELER SAFETY
             ───────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'solo_female' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-gradient-to-r from-purple-900 to-stone-900 text-white p-4 rounded-2xl space-y-1 shadow-sm">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-purple-300" />
                  <h2 className="font-display font-bold text-sm sm:text-base text-white">Female & Solo Traveler Protection Suite</h2>
                </div>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Dedicated protocols for solo female travelers, women tour groups, and independent explorers across India.
                </p>
              </div>

              {/* Female-Friendly Accommodation Indicator */}
              <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display font-bold text-stone-900 text-sm">
                    <Hotel className="w-4 h-4 text-[#91482D]" />
                    <span>Female-Friendly Verified Stay Criteria</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                    <span>Prioritize Criteria in Search</span>
                    <input
                      type="checkbox"
                      checked={safetyProfile?.femaleFriendlyStayPreferred ?? false}
                      onChange={e => handleUpdateProfile({ femaleFriendlyStayPreferred: e.target.checked })}
                      className="w-4 h-4 text-[#91482D] rounded"
                    />
                  </label>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Stays with verified criteria provide enhanced physical security. ExploreX never guarantees absolute safety for any provider, but prioritizes stays meeting the following verified data points:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-purple-950 block">24/7 Monitored Front Desk & CCTV</span>
                      <span className="text-purple-800 text-[11px]">Round-the-clock staffed reception in well-lit lobbies.</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-purple-950 block">Keycard Elevator & Floor Access</span>
                      <span className="text-purple-800 text-[11px]">Restricts guest floor access exclusively to checked-in residents.</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-purple-950 block">Secondary Deadbolts & Peepholes</span>
                      <span className="text-purple-800 text-[11px]">Secure interior door latches and viewing lenses on all guest rooms.</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-purple-950 block">Well-Lit Main Avenue Frontage</span>
                      <span className="text-purple-800 text-[11px]">Direct access to main thoroughfares without secluded unlit alleys.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solo Traveler Practical Guidance */}
              <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="font-display font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#91482D]" />
                  <span>Solo Explorer Safety Playbook</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900">🚕 Verified Transit Protocol</div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Use app-based cabs (Uber/Ola) with share-trip features enabled, or airport prepaid police booths. Check driver details and verify vehicle registration before boarding.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900">📍 Offline Maps & Battery Bank</div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Download offline regional Google Maps for your destination. Always carry an external 10,000mAh battery pack during day excursions.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900">👥 Group Sightseeing at Dusk</div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Join certified heritage walks and verified group tours for monuments and evening bazaars rather than wandering isolated alleyways alone after dusk.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900">📞 Dedicated Helplines on Speed Dial</div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Keep <strong>1091</strong> (Women Police Helpline) and <strong>7827170170</strong> (NCW 24/7) saved in your phone contacts offline.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────────────────
              TAB 5: GROUP & FAMILY SAFETY
             ───────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'group_family' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-stone-900 text-sm">Group & Family Safety Monitor</h2>
                    <p className="text-xs text-stone-500">Track check-ins and emergency alerts across traveling companions with individual privacy controls.</p>
                  </div>
                  <Users className="w-5 h-5 text-stone-400" />
                </div>

                {/* Granular Privacy Settings */}
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5">
                  <span className="text-[11px] font-mono uppercase font-bold text-stone-700 block">Your Personal Privacy Control</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'precise', label: 'Precise GPS Coordinates', desc: 'Share live pin with group members' },
                      { id: 'city_only', label: 'City & Destination Only', desc: 'Hide exact hotel or street location' },
                      { id: 'emergency_only', label: 'Emergency SOS Only', desc: 'Transmit location only during SOS distress' }
                    ].map(priv => (
                      <button
                        key={priv.id}
                        onClick={() => handleUpdateProfile({ privacyLocationLevel: priv.id as any })}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                          safetyProfile?.privacyLocationLevel === priv.id
                            ? 'border-[#91482D] bg-white ring-1 ring-[#91482D]'
                            : 'border-stone-200 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <div className="font-bold text-stone-900 text-xs">{priv.label}</div>
                        <div className="text-[10px] text-stone-500">{priv.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Traveling Group Member Statuses */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-mono uppercase font-bold text-stone-700 block">Traveling Companion Statuses</span>
                  {groupStatuses.length === 0 ? (
                    <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-500">
                      No active companion trips detected. Check-in status is synced with your primary emergency contact.
                    </div>
                  ) : (
                    groupStatuses.map(member => (
                      <div
                        key={member.userId}
                        className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-700 text-xs">
                            {member.name?.charAt(0) || 'M'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900">{member.name}</div>
                            <div className="text-[10px] text-stone-500">{member.locationSummary}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                          member.checkInStatus === 'sos_active'
                            ? 'bg-rose-500 text-white animate-pulse'
                            : member.checkInStatus === 'missed'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {member.checkInStatus === 'sos_active' ? 'Distress Active' : member.checkInStatus === 'missed' ? 'Check-in Overdue' : 'Status: Safe'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Family & Child Safety Safeguards */}
              <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 font-display font-bold text-stone-900 text-sm">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Family & Child Protection Essentials</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900">👶 Childline India (1098)</div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      24/7 free national helpline for children in need of medical care, emergency transit assistance, or lost child recovery in crowded attractions.
                    </p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="font-bold text-stone-900">🏥 Pediatric Emergency Readiness</div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Keep infant rehydration salts (ORS), prescribed pediatric medicines, and nearest district hospital contacts mapped before departing on journeys.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────────────────
              TAB 6: LIVE DESTINATION ALERTS
             ───────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'alerts' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display font-bold text-stone-900 text-sm">Active Destination Advisories</h2>
                  <p className="text-xs text-stone-500">Live conditions for {activeDestinationName} grounded in Open-Meteo & verified tourist guidelines.</p>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1.5 overflow-x-auto">
                  {['all', 'night_travel', 'weather', 'warning', 'advisory'].map(f => (
                    <button
                      key={f}
                      onClick={() => setAlertFilter(f)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase font-bold transition-colors cursor-pointer ${
                        alertFilter === f
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <div className="text-xs font-bold text-stone-800">All Clear in {activeDestinationName}</div>
                  <p className="text-[11px] text-stone-500">No severe weather disruptions or active security advisories recorded right now.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map(al => (
                    <div
                      key={al.id}
                      className={`p-4 rounded-2xl border space-y-2 ${
                        al.severity === 'high' || al.type === 'night_travel'
                          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                          : al.type === 'weather'
                          ? 'bg-sky-50/90 border-sky-300 text-sky-950'
                          : 'bg-white border-stone-200 text-stone-900 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{al.title}</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-white/80 border border-stone-200">
                          {al.type}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">{al.message}</p>
                      {al.actionRecommendation && (
                        <div className="text-[11px] font-semibold flex items-center gap-1.5 text-stone-800 bg-white/90 p-2 rounded-xl border border-stone-200/60">
                          <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Recommendation: {al.actionRecommendation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────────────────
              TAB 7: OFFICIAL HELPLINES & EMBASSIES
             ───────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'helplines' && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="font-display font-bold text-stone-900 text-sm">Verified Tourist Helpline Directory</h2>
                <p className="text-xs text-stone-500">Official Pan-India 24/7 tourist hotlines and diplomatic foreign embassy desks.</p>
              </div>

              {/* National Helplines */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-stone-700 block">Pan-India 24/7 Emergency Helplines</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { title: 'National Unified Emergency', number: '112', desc: 'Police, Ambulance & Fire across all states', badge: '24/7 Pan-India' },
                    { title: 'Tourist Police Helpline', number: '1363', desc: 'Ministry of Tourism free guidance in 12 languages', badge: 'Toll-Free' },
                    { title: 'Women Police Distress Unit', number: '1091', desc: 'Dedicated 24/7 response for female travelers', badge: 'Women 24/7' },
                    { title: 'National Commission for Women (NCW)', number: '7827170170', desc: 'Crisis intervention and women support', badge: 'NCW Desk' },
                    { title: 'Medical Ambulance Network', number: '108', desc: 'Emergency paramedic public ambulance fleet', badge: 'Paramedic' },
                    { title: 'Childline Welfare Helpline', number: '1098', desc: 'Free emergency support for children & families', badge: 'Children' },
                    { title: 'Railway Passenger Security', number: '139', desc: 'Train transit security and medical support', badge: 'Railways' },
                    { title: 'Highway Emergency Response', number: '1033', desc: 'NHAI 24/7 expressway assistance & towing', badge: 'Highways' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 shadow-xs hover:border-stone-400 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{item.title}</span>
                          <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[9px] font-mono uppercase font-bold">
                            {item.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">{item.desc}</div>
                      </div>
                      <a
                        href={`tel:${item.number}`}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-[#91482D] text-white text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{item.number}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foreign Embassies in New Delhi */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-bold text-stone-700">Foreign Consular Desks (New Delhi Chanakyapuri)</span>
                  <span className="text-[10px] text-stone-500 font-mono">24/7 Citizen Services</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
                    <span className="font-bold text-stone-900 block">🇺🇸 US Embassy</span>
                    <a href="tel:+911124198000" className="text-[11px] text-[#91482D] font-mono hover:underline block mt-0.5">+91 11 2419 8000</a>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
                    <span className="font-bold text-stone-900 block">🇬🇧 UK High Comm.</span>
                    <a href="tel:+911124192100" className="text-[11px] text-[#91482D] font-mono hover:underline block mt-0.5">+91 11 2419 2100</a>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
                    <span className="font-bold text-stone-900 block">🇦🇺 Australian HC</span>
                    <a href="tel:+911141399900" className="text-[11px] text-[#91482D] font-mono hover:underline block mt-0.5">+91 11 4139 9900</a>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
                    <span className="font-bold text-stone-900 block">🇨🇦 High Comm. Canada</span>
                    <a href="tel:+911141782000" className="text-[11px] text-[#91482D] font-mono hover:underline block mt-0.5">+91 11 4178 2000</a>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
                    <span className="font-bold text-stone-900 block">🇩🇪 German Embassy</span>
                    <a href="tel:+911144199199" className="text-[11px] text-[#91482D] font-mono hover:underline block mt-0.5">+91 11 4419 9199</a>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
                    <span className="font-bold text-stone-900 block">🇫🇷 French Embassy</span>
                    <a href="tel:+911143196100" className="text-[11px] text-[#91482D] font-mono hover:underline block mt-0.5">+91 11 4319 6100</a>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────────────────
              TAB 8: ESSENTIAL FOREIGN VISITOR GUIDE
             ───────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'international' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-gradient-to-r from-amber-900 to-stone-900 text-white p-4 rounded-2xl space-y-1 shadow-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-400" />
                  <h2 className="font-display font-bold text-sm sm:text-base text-white">Essential Guide for Foreign Visitors to India</h2>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Verified guidelines from the Ministry of Tourism & Bureau of Immigration for international tourists exploring India.
                </p>
              </div>

              {/* 1. Foreign Registration (e-FRRO) & Visas */}
              <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 bg-white shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display font-bold text-stone-900 text-sm">
                    <BookOpen className="w-4 h-4 text-[#91482D]" />
                    <span>Visa & Foreigners Registration (e-FRRO)</span>
                  </div>
                  <a
                    href="https://indianfrro.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#91482D] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Official e-FRRO Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-600">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-0.5">Stay Under 180 Days</span>
                    Standard tourist e-Visa holders staying under 180 days do NOT require local police registration.
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-0.5">Stay Exceeding 180 Days</span>
                    Must register online at the official e-FRRO portal within 14 days of arrival in India.
                  </div>
                </div>
              </div>

              {/* 2. Indian SIM & eSIM Connectivity */}
              <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-2.5 bg-white shadow-xs">
                <div className="flex items-center gap-2 font-display font-bold text-stone-900 text-sm">
                  <Phone className="w-4 h-4 text-[#91482D]" />
                  <span>Indian SIM & eSIM Setup for Tourists</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Tourist SIM cards (Airtel / Jio) are available at official airport arrival kiosks (Delhi DEL, Mumbai BOM, Bengaluru BLR). You will need:
                </p>
                <ul className="text-xs text-stone-600 list-disc list-inside space-y-1 pl-1">
                  <li>Original physical Passport and valid Indian e-Visa printout.</li>
                  <li>Local Indian address (your confirmed hotel or ExploreX itinerary voucher).</li>
                  <li>One digital passport-style photo (captured directly at the airport kiosk).</li>
                </ul>
                <p className="text-[11px] text-stone-500 font-mono">
                  Activation typically completes within 2 to 4 hours following electronic identity verification.
                </p>
              </div>

              {/* 3. Cultural Etiquette & Temple Customs */}
              <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 bg-white shadow-xs">
                <div className="flex items-center gap-2 font-display font-bold text-stone-900 text-sm">
                  <Shield className="w-4 h-4 text-[#91482D]" />
                  <span>Cultural Etiquette & Temple Customs</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="font-bold text-stone-900 mb-0.5">🛕 Temples & Religious Sanctums</div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Remove footwear outside sanctuaries. Dress modestly covering shoulders and knees. Remove leather belts before entering Jain and certain Hindu shrines.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="font-bold text-stone-900 mb-0.5">📷 Sacred Photography</div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Always ask permission before photographing monks, sadhus, or active rituals. Inner sanctums strictly prohibit cameras and smartphones.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="font-bold text-stone-900 mb-0.5">🙏 Greetings & Gestures</div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      "Namaste" with palms joined at chest level is universally respected. Use your right hand when receiving food, money, or exchanging gifts.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="font-bold text-stone-900 mb-0.5">🛍️ Bazaar Etiquette</div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Gentle, courteous bargaining is customary in street markets. Government emporiums and state craft pavilions operate strictly on fixed pricing.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Drinking Water & Street Food Safety */}
              <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-2.5 bg-white shadow-xs">
                <div className="flex items-center gap-2 font-display font-bold text-stone-900 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Health, Drinking Water & Street Food Safeguards</span>
                </div>
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Packaged Drinking Water:</strong> Drink only sealed bottled water from reputed brands (Bisleri, Kinley, Aquafina, Himalayan). Inspect that the plastic cap seal is unbroken.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span><strong>Tap Water:</strong> Do NOT drink tap water. Use purified bottled water even for brushing teeth in remote rural accommodations.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Street Food:</strong> Enjoy freshly cooked, piping-hot dishes from stalls with bustling local crowds. Avoid uncooked cut fruits or raw salads from unshaded roadside carts.</span>
                  </div>
                </div>
              </div>

              {/* 5. Currency & Payments (Strict INR ₹ & UPI One World) */}
              <div className="border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-2.5 bg-white shadow-xs">
                <div className="flex items-center gap-2 font-display font-bold text-stone-900 text-sm">
                  <Radio className="w-4 h-4 text-[#91482D]" />
                  <span>Currency Compliance (INR ₹ Only) & UPI One World</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  All transactions and bookings on ExploreX are legally processed strictly in <strong>Indian Rupees (INR ₹)</strong> as per RBI compliance.
                </p>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                  <span className="font-bold block mb-1">💡 "UPI One World" for International Visitors:</span>
                  Visiting foreign tourists can obtain prepaid UPI wallets at major international airports without an Indian bank account, allowing instant scan-and-pay at millions of Indian shops and cafes.
                </div>
              </div>

            </div>
          )}

        </div>

        {/* BOTTOM FOOTER BAR */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Encrypted Traveler Safety Protocol • 24/7 Verified Coverage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Close Safety Center
          </button>
        </div>

      </div>

      {/* SOS CONFIRMATION MODAL */}
      {sosConfirmOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-500 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-stone-900 text-base">Activate Emergency SOS Broadcast?</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                This immediately dispatches an urgent distress broadcast with your current location to all configured emergency contacts and local emergency services.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSosConfirmOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startSosCountdown}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md transition-colors"
              >
                Confirm SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};
