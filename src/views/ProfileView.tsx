import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Check, 
  Heart, 
  Compass, 
  Save, 
  AlertTriangle,
  RotateCcw,
  Sliders,
  Phone,
  Globe,
  Radio,
  UserCheck,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NavTab } from '../components/Navbar';
import { TravelVibe, UserPreferences } from '../types';

interface ProfileViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { user, updateProfile, updatePreferences, updateTravelDNA, deleteAccount, logout } = useAuth();
  const { success, error } = useToast();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [homeCity, setHomeCity] = useState(user?.homeCity || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // International Traveler State
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [travelerType, setTravelerType] = useState<'indian' | 'international'>('indian');
  const [homeCountry, setHomeCountry] = useState('India');
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    if (user?.phone) {
      const trimmed = user.phone.trim();
      const matchedCode = ['+91', '+1', '+44', '+61', '+49', '+33', '+65', '+81', '+971'].find(c => trimmed.startsWith(c));
      if (matchedCode) {
        setPhoneCountryCode(matchedCode);
        setPhone(trimmed.replace(matchedCode, '').trim());
        if (matchedCode !== '+91') {
          setTravelerType('international');
        }
      } else {
        setPhone(trimmed);
      }
    }
  }, [user?.phone]);

  const handleQuickCheckIn = async () => {
    try {
      const res = await fetch('/api/safety/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'x-user-id': user?.id || 'usr-current'
        },
        body: JSON.stringify({ status: 'safe', note: 'All good from profile' })
      });
      if (res.ok) {
        const data = await res.json();
        setCheckInSuccess(`Check-in recorded at ${new Date(data.lastCheckInTime).toLocaleTimeString('en-IN')}`);
        success('Checked In', 'Your trusted contacts can see you are safe.');
        setTimeout(() => setCheckInSuccess(null), 4000);
      }
    } catch (err: any) {
      error('Check-in error', err.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 bg-white">
        <div className="w-16 h-16 bg-[#F7F7F4] text-[#91482D] rounded-2xl flex items-center justify-center mx-auto border border-[#E4E4DF] shadow-2xs">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#91482D] font-bold">
            Curator Profile
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#242424]">
            Traveler Profile & Travel DNA
          </h2>
          <p className="font-prose text-sm text-[#6B6B67] max-w-md mx-auto italic">
            Please sign in to view and customize your travel preferences, saved trips, and passport details.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-2.5 bg-[#242424] hover:bg-[#91482D] text-[#FFFFFF] text-xs font-mono uppercase tracking-wider font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="px-6 py-2.5 bg-white hover:bg-[#F7F7F4] text-[#242424] text-xs font-mono uppercase tracking-wider font-bold rounded-xl border border-[#E4E4DF] transition-colors cursor-pointer"
          >
            Create an Account
          </button>
        </div>
      </div>
    );
  }

  // Preferences State
  const [travelPace, setTravelPace] = useState<'relaxed' | 'moderate' | 'fast_paced'>(user?.preferences?.pace || 'moderate');
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'moderate' | 'luxury' | 'ultra_luxury'>(user?.preferences?.budgetLevel || 'moderate');
  const [travelStyle, setTravelStyle] = useState<'solo' | 'couple' | 'family' | 'friends'>(user?.preferences?.travelStyle || 'friends');
  const [dietary, setDietary] = useState<string[]>(user?.preferences?.dietary || ['Vegetarian Friendly']);
  const [vibes, setVibes] = useState<TravelVibe[]>(user?.preferences?.vibes || ['mountain', 'nature', 'beach']);
  const [accPref, setAccPref] = useState<'hotel' | 'resort' | 'hostel' | 'homestay' | 'villa'>(user?.preferences?.accommodationType || 'resort');
  const [ecoFriendly, setEcoFriendly] = useState<boolean>(user?.preferences?.ecoFriendly ?? true);

  // DNA Quiz State
  const [dnaQuizOpen, setDnaQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({
    weekendPreference: 'exploring_museums',
    foodApproach: 'local_street_stalls',
    mobilityStyle: 'electric_cabs_trains',
    pacingTolerance: 'moderate_3_spots',
    natureComfort: 'high_mountains_hikes'
  });

  // Delete account modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length > 0 && (cleanDigits.length < 7 || cleanDigits.length > 15)) {
      setPhoneError('Please enter a valid phone number (7 to 15 digits).');
      return;
    }
    setPhoneError(null);

    try {
      const fullPhone = cleanDigits.length > 0 ? `${phoneCountryCode} ${cleanDigits}` : '';
      await updateProfile({ name, email, phone: fullPhone, bio, homeCity, avatar });
      setIsEditingProfile(false);
      success('Profile Saved', 'Your account details and contact information have been updated.');
    } catch (err: any) {
      error('Update Error', err.message);
    }
  };

  const handleSavePreferences = async () => {
    try {
      const newPrefs: UserPreferences = {
        pace: travelPace,
        budgetLevel,
        travelStyle,
        dietary,
        vibes,
        accommodationType: accPref,
        ecoFriendly
      };
      await updatePreferences(newPrefs);
      success('Preferences Saved', 'AI recommendations will now prioritize your updated travel preferences.');
    } catch (err: any) {
      error('Preferences Error', err.message);
    }
  };

  const handleCalculateDNA = async () => {
    let culturalScore = 75;
    let gastroScore = 80;
    let ecoScore = 85;
    let adventScore = 70;
    let relaxScore = 65;

    if (quizAnswers.weekendPreference === 'exploring_museums') culturalScore += 15;
    if (quizAnswers.foodApproach === 'local_street_stalls') gastroScore += 15;
    if (quizAnswers.mobilityStyle === 'electric_cabs_trains') ecoScore += 10;
    if (quizAnswers.natureComfort === 'high_mountains_hikes') adventScore += 20;

    const calculatedArchetype = adventScore > 85 ? 'Wilderness Explorer & Pioneer' :
      gastroScore > 88 ? 'Epicurean Gastronomy Connoisseur' :
      culturalScore > 85 ? 'Authentic Heritage & Cultural Wanderer' : 'Curated Luxury & Slow Traveler';

    try {
      await updateTravelDNA({
        culturalExplorer: Math.min(culturalScore, 98),
        adventureSeeker: Math.min(adventScore, 98),
        gastronomyLover: Math.min(gastroScore, 98),
        relaxationScore: Math.min(relaxScore, 98),
        ecoConscious: Math.min(ecoScore, 98),
        spontaneity: 75,
        primaryArchetype: calculatedArchetype,
        secondaryArchetype: 'Scenic Alpine & Coastal Trailblazer',
        description: 'You prioritize deep cultural resonance and delicious hyper-local food.'
      });
      setDnaQuizOpen(false);
      success('Travel DNA Recalibrated!', `Assigned Archetype: ${calculatedArchetype}`);
    } catch (err: any) {
      error('DNA Calculation Error', err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      error('Confirmation Failed', 'Please type DELETE in all uppercase to confirm.');
      return;
    }
    try {
      await deleteAccount();
      logout();
      onNavigate('home');
      success('Account Deleted', 'Your profile and data have been wiped from the database.');
    } catch (err: any) {
      error('Deletion Error', err.message);
    }
  };

  const availableVibes: { key: TravelVibe; label: string }[] = [
    { key: 'mountain', label: 'Alpine & Highlands' },
    { key: 'beach', label: 'Coastal & Islands' },
    { key: 'heritage', label: 'Heritage & Living Ateliers' },
    { key: 'nature', label: 'Wilderness & Sanctuaries' },
    { key: 'culinary', label: 'Terroirs & Gastronomy' },
    { key: 'adventure', label: 'High Adventure' },
    { key: 'luxury', label: 'Curated Luxury' },
    { key: 'wellness', label: 'Ayurvedic Retreats' },
    { key: 'urban', label: 'Historic Quarters' }
  ];

  const availableDiets = ['Vegetarian Friendly', 'Vegan', 'Halal', 'Gluten-Free', 'Seafood', 'Kosher', 'Nut-Free'];

  return (
    <div className="page-container space-y-8 pb-16 bg-white">
      {/* Header */}
      <div className="pt-4 border-b border-[#E4E4DF] pb-6">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#91482D] font-bold">
          <User className="w-3.5 h-3.5" />
          The Curator Folio
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#242424] tracking-tight mt-1">
          Traveler Profile & Curator DNA
        </h1>
        <p className="font-prose text-sm sm:text-base text-[#6B6B67] mt-1 italic">
          Configure your personal travel archetype, dietary preferences, and pacing to calibrate AI recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E4E4DF] shadow-editorial space-y-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name}
                className="w-20 h-20 rounded-xl object-cover border border-[#E4E4DF] shadow-xs"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-display text-lg font-bold text-[#242424]">{user?.name}</h3>
                  <span className="px-2 py-0.5 bg-[#F7F7F4] text-[#242424] text-[10px] font-mono font-bold rounded uppercase border border-[#E4E4DF]">
                    {user?.role || 'user'}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#6B6B67]">{user?.email}</p>
                <p className="text-xs font-mono text-[#6B6B67]">{user?.phone || 'No phone added'}</p>
              </div>
            </div>

            {user?.bio && (
              <p className="text-xs font-prose text-[#6B6B67] italic bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E4E4DF]">
                "{user.bio}"
              </p>
            )}

            <div className="pt-4 border-t border-[#F7F7F4] flex items-center justify-between text-xs text-[#6B6B67] font-mono">
              <span>Member Since: {user?.joinedDate || '2025'}</span>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-3 py-1.5 bg-[#F7F7F4] hover:bg-[#E4E4DF] text-[#242424] rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Close' : 'Edit Profile'}</span>
              </button>
            </div>

            {/* Inline Profile Edit Form */}
            {isEditingProfile && (
              <form onSubmit={handleSaveProfile} className="pt-4 border-t border-slate-100 space-y-3 text-xs text-left">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">Mobile Phone Number</label>
                    <span className="text-[10px] text-stone-500 font-mono">For SOS & Bookings</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={phoneCountryCode}
                      onChange={e => setPhoneCountryCode(e.target.value)}
                      className="w-full sm:w-36 p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs shrink-0"
                    >
                      <option value="+91">🇮🇳 +91 (India)</option>
                      <option value="+1">🇺🇸 +1 (US/CA)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+61">🇦🇺 +61 (AU)</option>
                      <option value="+49">🇩🇪 +49 (DE)</option>
                      <option value="+33">🇫🇷 +33 (FR)</option>
                      <option value="+65">🇸🇬 +65 (SG)</option>
                      <option value="+81">🇯🇵 +81 (JP)</option>
                      <option value="+971">🇦🇪 +971 (UAE)</option>
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => {
                        setPhone(e.target.value);
                        setPhoneError(null);
                      }}
                      placeholder="e.g. 9876543210 (digits only)"
                      className={`w-full p-2 bg-slate-50 border rounded-xl font-medium font-mono text-xs ${
                        phoneError ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Traveler Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTravelerType('indian');
                        setHomeCountry('India');
                        setPhoneCountryCode('+91');
                      }}
                      className={`p-2 rounded-xl text-center border text-xs font-semibold cursor-pointer transition-all ${
                        travelerType === 'indian'
                          ? 'border-[#91482D] bg-[#91482D]/5 text-[#91482D]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🇮🇳 Indian Domestic
                    </button>
                    <button
                      type="button"
                      onClick={() => setTravelerType('international')}
                      className={`p-2 rounded-xl text-center border text-xs font-semibold cursor-pointer transition-all ${
                        travelerType === 'international'
                          ? 'border-[#91482D] bg-[#91482D]/5 text-[#91482D]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🌐 International Visitor
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Home City</label>
                  <input
                    type="text"
                    value={homeCity}
                    onChange={e => setHomeCity(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Choose Preset Avatar</label>
                  <div className="flex gap-2">
                    {avatarPresets.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="preset"
                        onClick={() => setAvatar(url)}
                        className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                          avatar === url ? 'border-sky-600 scale-105' : 'border-transparent opacity-70'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Account Information</span>
                </button>
              </form>
            )}
          </div>

          {/* Traveler Safety & SOS Center Card */}
          <div className="bg-white p-5 rounded-3xl border border-[#E4E4DF] shadow-xs space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F7F7F4]">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <Shield className="w-4 h-4 text-rose-600" />
                <span>Traveler Safety & Safeguards</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Protected
              </span>
            </div>

            <p className="text-stone-600 leading-relaxed text-[11px]">
              24/7 tourist safety suite with instant SOS broadcast, tourist police helplines (1363 / 112), and one-tap emergency contacts check-ins.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('explorex:open-safety'))}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Safety & SOS</span>
              </button>

              <button
                type="button"
                onClick={handleQuickCheckIn}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Log Check-in</span>
              </button>
            </div>

            {checkInSuccess && (
              <p className="text-[11px] text-emerald-700 font-bold text-center bg-emerald-50 py-1 rounded-lg border border-emerald-200">
                {checkInSuccess}
              </p>
            )}
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-rose-800 font-bold uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Danger Zone
            </div>
            <p className="text-rose-700 leading-relaxed">
              Permanently delete your profile, e-tickets, saved destinations, and photo vault.
            </p>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Travel Preferences & DNA Profiler */}
        <div className="lg:col-span-2 space-y-6">
          {/* Travel DNA Archetype Block */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Patented AI Profiler</span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  {user?.travelDNA?.primaryArchetype || 'Curious Culture & Culinary Voyager'}
                </h3>
              </div>

              <button
                onClick={() => setDnaQuizOpen(true)}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Take 60s DNA Assessment</span>
              </button>
            </div>

            {/* Progress breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Cultural Explorer</span>
                  <span className="font-bold text-white">{user?.travelDNA?.culturalExplorer || 88}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400" style={{ width: `${user?.travelDNA?.culturalExplorer || 88}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Gastronomy Passion</span>
                  <span className="font-bold text-white">{user?.travelDNA?.gastronomyLover || 92}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400" style={{ width: `${user?.travelDNA?.gastronomyLover || 92}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Eco-Conscious Mobility</span>
                  <span className="font-bold text-white">{user?.travelDNA?.ecoConscious || 85}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${user?.travelDNA?.ecoConscious || 85}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Adventure Tolerance</span>
                  <span className="font-bold text-white">{user?.travelDNA?.adventureSeeker || 76}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400" style={{ width: `${user?.travelDNA?.adventureSeeker || 76}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Travel Preferences Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Customized Travel Preferences</h3>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Preferences</span>
              </button>
            </div>

            {/* Travel Pace */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">Travel Itinerary Pace</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'relaxed', label: 'Relaxed (1-2 spots/day)' },
                  { key: 'moderate', label: 'Moderate (3-4 spots/day)' },
                  { key: 'fast_paced', label: 'Fast-Paced (Packed)' }
                ].map(p => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setTravelPace(p.key as any)}
                    className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                      travelPace === p.key
                        ? 'bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-2">Travel Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {['solo', 'couple', 'family', 'friends'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTravelStyle(st as any)}
                      className={`p-2.5 rounded-xl border text-center font-semibold capitalize transition-all ${
                        travelStyle === st ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Budget Tier</label>
                <div className="grid grid-cols-2 gap-2">
                  {['budget', 'moderate', 'luxury', 'ultra_luxury'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetLevel(b as any)}
                      className={`p-2.5 rounded-xl border text-center font-semibold capitalize transition-all ${
                        budgetLevel === b ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {b.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vibes multi-chips */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">Preferred Travel Vibes</label>
              <div className="flex flex-wrap gap-2">
                {availableVibes.map(v => {
                  const isSelected = vibes.includes(v.key);
                  return (
                    <button
                      key={v.key}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setVibes(vibes.filter(item => item !== v.key));
                        } else {
                          setVibes([...vibes, v.key]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{v.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accommodation Type */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">Preferred Lodging Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {['hotel', 'resort', 'hostel', 'homestay', 'villa'].map(acc => (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => setAccPref(acc as any)}
                    className={`p-2.5 rounded-xl border text-center font-semibold capitalize transition-all ${
                      accPref === acc
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {acc}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary tags */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">Dietary Restrictions</label>
              <div className="flex flex-wrap gap-2">
                {availableDiets.map(diet => {
                  const isSelected = dietary.includes(diet);
                  return (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setDietary(dietary.filter(d => d !== diet));
                        } else {
                          setDietary([...dietary, diet]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{diet}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DNA ASSESSMENT MODAL */}
      {dnaQuizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-black text-slate-900">AI Travel DNA Profiler</h3>
              </div>
              <button onClick={() => setDnaQuizOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                Cancel
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">1. On an ideal morning in a new city, you prefer:</label>
                <select
                  value={quizAnswers.weekendPreference}
                  onChange={e => setQuizAnswers({ ...quizAnswers, weekendPreference: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="exploring_museums">Visiting historic temples & art museums</option>
                  <option value="hiking_mountains">Sunrise hike to an isolated summit</option>
                  <option value="cozy_cafes">Sleeping in & sipping coffee at a boutique cafe</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">2. When it comes to dining and culinary experiences:</label>
                <select
                  value={quizAnswers.foodApproach}
                  onChange={e => setQuizAnswers({ ...quizAnswers, foodApproach: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="local_street_stalls">Hunting down vibrant night market stalls</option>
                  <option value="michelin_fine_dining">Reserved Michelin-starred tasting menus</option>
                  <option value="comfort_dining">Familiar casual restaurants & bakeries</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">3. Your daily movement & pacing tolerance:</label>
                <select
                  value={quizAnswers.pacingTolerance}
                  onChange={e => setQuizAnswers({ ...quizAnswers, pacingTolerance: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="moderate_3_spots">Balanced: 2-3 key highlights with downtime</option>
                  <option value="intense_6_spots">Packed: Maximize every single hour of daylight</option>
                  <option value="slow_1_spot">Slow Travel: 1 scenic spot per day, deep immersion</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCalculateDNA}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate & Update Travel DNA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-4">
            <h3 className="text-lg font-bold text-rose-900">Delete Account Confirmation</h3>
            <p className="text-xs text-slate-600">
              This action is permanent and cannot be reversed. To confirm deletion, type <strong className="text-rose-600">DELETE</strong> below:
            </p>

            <input
              type="text"
              placeholder="Type DELETE"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              className="w-full p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-900 focus:outline-none"
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-700"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
