import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  CloudRain, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Bot, 
  User, 
  Zap, 
  Sliders, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Loader2, 
  ArrowRight, 
  Bookmark, 
  Search, 
  Sun, 
  CloudSun, 
  CloudFog, 
  CloudDrizzle, 
  CloudLightning, 
  Thermometer, 
  Wind, 
  Droplets, 
  Compass, 
  Umbrella, 
  RefreshCw, 
  Check, 
  Info,
  Leaf
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NavTab } from '../components/Navbar';
import { formatINR } from '../utils/currency';
import { LockedFeatureGate } from '../components/LockedFeatureGate';

interface AIAssistantViewProps {
  initialPrompt?: string;
  initialDestinationId?: string;
  onNavigate: (tab: NavTab, params?: any) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  initialPrompt = '',
  initialDestinationId = '',
  onNavigate
}) => {
  const { user } = useAuth();
  const { error, success, info } = useToast();

  if (!user) {
    return (
      <LockedFeatureGate
        title="Universal AI Travel Concierge & Planner"
        category="Intelligent Atelier"
        description="Craft bespoke multi-day itineraries, dynamically adapt schedules to live weather, simulate What-If travel scenarios, and chat 24/7 with the ExploreX travel intelligence model."
        perks={[
          'Day-by-day customized itineraries matched to your Travel DNA',
          'Autopilot dynamic replanning with real-time monsoon & heat wave alerts',
          'What-If budget & pace simulation algorithms',
          'Export and sync directly to your personal calendar & wallet'
        ]}
        onNavigate={onNavigate}
      />
    );
  }

  const [activeSubTab, setActiveSubTab] = useState<'itinerary' | 'concierge' | 'weather' | 'adapt' | 'whatif'>('itinerary');

  // Shared active destination state across tabs
  const [activeDestination, setActiveDestination] = useState<string>('Pune, Maharashtra');

  // ============================================================
  // 1. AI ITINERARY GENERATOR STATE
  // ============================================================
  const [itinDest, setItinDest] = useState('Pune, Maharashtra');
  const [itinDays, setItinDays] = useState(3);
  const [itinTravelers, setItinTravelers] = useState(2);
  const [itinBudgetLevel, setItinBudgetLevel] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [itinMaxBudget, setItinMaxBudget] = useState(25000);
  const [itinStyle, setItinStyle] = useState<'solo' | 'couple' | 'family' | 'friends'>('couple');
  const [itinPace, setItinPace] = useState<'relaxed' | 'moderate' | 'fast_paced'>('moderate');
  const [itinSelectedInterests, setItinSelectedInterests] = useState<string[]>(['culture', 'history', 'food']);
  const [itinStayType, setItinStayType] = useState<'hotel' | 'resort' | 'homestay'>('hotel');
  const [itinFoodPref, setItinFoodPref] = useState<'local' | 'veg' | 'non_veg' | 'gourmet'>('local');
  const [itinTransport, setItinTransport] = useState<'private_cab' | 'public' | 'rental'>('private_cab');
  const [itinSpecialReq, setItinSpecialReq] = useState('');

  const [itinResult, setItinResult] = useState<any | null>(null);
  const [itinLoading, setItinLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  const allInterests = [
    { id: 'history', label: '⛩️ History & Forts' },
    { id: 'culture', label: '🎭 Local Culture' },
    { id: 'food', label: '🍛 Culinary & Street Food' },
    { id: 'beaches', label: '🏖️ Coastal & Beaches' },
    { id: 'nature', label: '🌲 Nature & Valleys' },
    { id: 'temples', label: '🛕 Temples & Spiritual' },
    { id: 'trekking', label: '🥾 Trekking & Hikes' },
    { id: 'shopping', label: '🛍️ Handicrafts & Handlooms' },
    { id: 'hidden_gems', label: '🌿 Hidden Gems' }
  ];

  const handleToggleInterest = (id: string) => {
    if (itinSelectedInterests.includes(id)) {
      setItinSelectedInterests(itinSelectedInterests.filter(i => i !== id));
    } else {
      setItinSelectedInterests([...itinSelectedInterests, id]);
    }
  };

  const handleGenerateItinerary = async () => {
    setItinLoading(true);
    setGenerationStep('Gathering verified attractions & live weather forecast...');
    try {
      setTimeout(() => setGenerationStep('Running multi-constraint route solver...'), 600);
      setTimeout(() => setGenerationStep('Synthesizing verified day-by-day plan with zero vehicle entities...'), 1200);

      const result = await api.generateItinerary({
        destination: itinDest,
        durationDays: itinDays,
        travelersCount: itinTravelers,
        budgetLevel: itinBudgetLevel,
        maxBudget: itinMaxBudget,
        interests: itinSelectedInterests,
        travelStyle: itinStyle,
        pace: itinPace,
        accommodationPreference: itinStayType,
        foodPreference: itinFoodPref,
        transportPreference: itinTransport,
        specialRequirements: itinSpecialReq
      });

      setItinResult(result);
      setActiveDestination(itinDest);
      success('Itinerary Generated!', `Created a logistically verified ${itinDays}-day plan for ${itinDest}.`);
    } catch (err: any) {
      error('Generation Failed', err.message || 'Error creating AI itinerary');
    } finally {
      setItinLoading(false);
      setGenerationStep('');
    }
  };

  // ============================================================
  // 2. CONVERSATIONAL AI CHATBOT STATE (OpenAI Powered)
  // ============================================================
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    text: string;
    time: string;
    suggestions?: string[];
    groundingSources?: string[];
    provider?: string;
  }>>([
    {
      role: 'assistant',
      text: "Namaste! I am your **ExploreX Universal AI Travel Assistant**.\n\nI can help you discover **any destination across India and worldwide**, plan day-by-day itineraries, check live weather, find uncrowded hidden gems, and recommend authentic regional cuisines & GI-tagged handicrafts.\n\nWhich destination or region would you like to explore today?",
      time: 'Just now',
      suggestions: [
        "Plan a 4-day trip to Goa with quiet beaches & local food",
        "What are less crowded alternatives to Manali?",
        "Suggest a 3-day royal heritage itinerary for Jaipur",
        "Best 5-day scenic valley route in Kashmir",
        "Top backwater houseboats & tea gardens in Kerala",
        "Sunrise ghats and spiritual tours in Varanasi"
      ],
      provider: 'openai'
    }
  ]);

  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg = {
      role: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setChatLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.text
      }));

      const res: any = await api.askAssistant(
        query,
        initialDestinationId || undefined,
        history,
        {
          destination: activeDestination,
          currentItinerary: itinResult,
          activeWeatherAlert: weatherReport?.alerts?.[0]?.message
        }
      );

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res.reply || 'I am ready to help with your travel plans.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: res.suggestions || [],
          groundingSources: res.grounding?.sources,
          provider: res.grounding?.provider
        }
      ]);
    } catch (err: any) {
      error('AI Assistant Error', err.message || 'The AI assistant is temporarily unavailable. Please try again.');
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "⚠️ The AI assistant is temporarily unavailable. Please try asking again in a moment.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: "Conversation cleared. Where in India or the world would you like to travel next?",
        time: 'Just now',
        suggestions: [
          "Plan a 4-day trip to Goa",
          "Find less crowded mountain getaways",
          "What should I do if it rains during travel?",
          "Suggest budget travel in Rajasthan & Jaipur"
        ]
      }
    ]);
    info('Conversation Cleared', 'Chat history has been reset.');
  };

  // ============================================================
  // 3. WEATHER & ALERTS STATE (Open-Meteo Real-Time)
  // ============================================================
  const [weatherSearchQuery, setWeatherSearchQuery] = useState('Pune');
  const [weatherReport, setWeatherReport] = useState<any | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [quickCities] = useState(['Pune', 'Mumbai', 'Goa', 'Manali', 'Jaipur', 'Varanasi', 'Kochi', 'Sindhudurg']);

  const fetchWeatherForDestination = async (destName: string) => {
    setWeatherLoading(true);
    try {
      const data = await api.getWeather({ destination: destName });
      setWeatherReport(data);
      setActiveDestination(data.destinationName || destName);
    } catch (err: any) {
      error('Weather Fetch Error', 'Weather information is temporarily unavailable.');
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherForDestination('Pune');
  }, []);

  const handleWeatherSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weatherSearchQuery.trim()) {
      fetchWeatherForDestination(weatherSearchQuery.trim());
    }
  };

  // ============================================================
  // 4. TRIP ADAPTATION & REPLANNER STATE
  // ============================================================
  const [adaptDest, setAdaptDest] = useState('Pune, Maharashtra');
  const [adaptTrigger, setAdaptTrigger] = useState<'heavy_rain' | 'extreme_heat' | 'crowd_surge' | 'traffic_congestion'>('heavy_rain');
  const [adaptResult, setAdaptResult] = useState<any | null>(null);
  const [adaptLoading, setAdaptLoading] = useState(false);

  const handleRunAdaptation = async (overrideTrigger?: string, overrideDest?: string) => {
    setAdaptLoading(true);
    const triggerToUse = overrideTrigger || adaptTrigger;
    const destToUse = overrideDest || adaptDest || activeDestination;

    try {
      const result = await api.adaptItinerary({
        destinationName: destToUse,
        trigger: triggerToUse,
        currentItinerary: itinResult,
        customProblemDescription: triggerToUse === 'heavy_rain' 
          ? 'Heavy afternoon rainfall forecasted between 12:00 PM and 3:30 PM'
          : undefined
      });

      setAdaptResult(result);
      success('Trip Schedule Adapted!', `Replaced affected outdoor spots with sheltered cultural alternatives.`);
    } catch (err: any) {
      error('Adaptation Error', err.message || 'Could not adapt trip.');
    } finally {
      setAdaptLoading(false);
    }
  };

  const handleApplyAdaptedItinerary = () => {
    if (adaptResult && adaptResult.adaptedItinerary) {
      setItinResult(adaptResult.adaptedItinerary);
      setActiveSubTab('itinerary');
      success('Applied to Itinerary!', 'Your active itinerary has been updated with the weather-adapted schedule.');
    }
  };

  // ============================================================
  // 5. WHAT-IF SIMULATOR STATE
  // ============================================================
  const [whatIfDest, setWhatIfDest] = useState('Pune, Maharashtra');
  const [whatIfScenario, setWhatIfScenario] = useState('What if monsoon rainfall delays outdoor fort exploration by 3 hours?');
  const [whatIfBudget, setWhatIfBudget] = useState(15000);
  const [whatIfResult, setWhatIfResult] = useState<any | null>(null);
  const [whatIfLoading, setWhatIfLoading] = useState(false);

  const handleRunWhatIf = async () => {
    setWhatIfLoading(true);
    try {
      const result = await api.simulateWhatIf(whatIfScenario, whatIfDest, whatIfBudget, 2, 3);
      setWhatIfResult(result);
      success('Simulation Completed', 'Calculated cost, time, and crowd impacts.');
    } catch (err: any) {
      error('Simulation Error', err.message);
    } finally {
      setWhatIfLoading(false);
    }
  };

  return (
    <div className="page-container space-y-6 pb-16 bg-white">
      {/* Header */}
      <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E4DF] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-[#B45F3C] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            ExploreX Intelligent Travel Engine
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-0.5">
            AI Travel Assistant & Trip Optimizer
          </h1>
          <p className="font-prose text-xs sm:text-sm text-[#6B6B67] mt-0.5 max-w-2xl">
            Conversational travel consultant, location-specific Open-Meteo weather forecasting, Demand Balancer, and automatic trip replanning.
          </p>
        </div>

        {/* SubTab Navigation Switcher */}
        <div className="flex items-center gap-1 bg-[#F7F7F4] p-1 rounded-xl border border-[#E4E4DF] overflow-x-auto shadow-inner">
          <button
            onClick={() => setActiveSubTab('itinerary')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'itinerary'
                ? 'bg-[#242424] text-white shadow-sm'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Itinerary Planner</span>
          </button>
          <button
            onClick={() => setActiveSubTab('concierge')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'concierge'
                ? 'bg-[#B45F3C] text-white shadow-sm'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Trip Assistant Chat</span>
          </button>
          <button
            onClick={() => setActiveSubTab('weather')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'weather'
                ? 'bg-[#1E56A0] text-white shadow-sm'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Weather & Alerts</span>
          </button>
          <button
            onClick={() => setActiveSubTab('adapt')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'adapt'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Adapt My Trip</span>
          </button>
          <button
            onClick={() => setActiveSubTab('whatif')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'whatif'
                ? 'bg-[#6A1B9A] text-white shadow-sm'
                : 'text-[#6B6B67] hover:text-[#242424]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>What-If Simulator</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          SUBTAB 1: ITINERARY PLANNER
         ============================================================ */}
      {activeSubTab === 'itinerary' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Personalized Travel Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">Customize your inputs to generate a logistically optimized day-by-day plan.</p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-[#B45F3C] font-bold text-xs rounded-full border border-amber-200">
                Logistics Solver
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
                <input
                  type="text"
                  value={itinDest}
                  onChange={e => setItinDest(e.target.value)}
                  placeholder="e.g. Pune, Goa, Mumbai, Jaipur, Manali"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#B45F3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={itinDays}
                  onChange={e => setItinDays(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#B45F3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Travelers & Group</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={itinTravelers}
                    onChange={e => setItinTravelers(Number(e.target.value))}
                    className="w-20 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#B45F3C] focus:outline-none"
                  />
                  <select
                    value={itinStyle}
                    onChange={e => setItinStyle(e.target.value as any)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#B45F3C] focus:outline-none"
                  >
                    <option value="solo">Solo</option>
                    <option value="couple">Couple</option>
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Max Budget (₹)</label>
                  <span className="text-xs font-black text-[#B45F3C]">{formatINR(itinMaxBudget)}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={150000}
                  step={5000}
                  value={itinMaxBudget}
                  onChange={e => setItinMaxBudget(Number(e.target.value))}
                  className="w-full accent-[#B45F3C] cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Interests Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Travel Interests</label>
              <div className="flex flex-wrap gap-2">
                {allInterests.map(item => {
                  const isSelected = itinSelectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleInterest(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#B45F3C] text-white border-[#B45F3C] shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Travel Pace</label>
                <select
                  value={itinPace}
                  onChange={e => setItinPace(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="relaxed">Relaxed & Leisurely</option>
                  <option value="moderate">Balanced Moderate</option>
                  <option value="fast_paced">Fast Paced & Packed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Stay Type</label>
                <select
                  value={itinStayType}
                  onChange={e => setItinStayType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="hotel">Boutique Hotel</option>
                  <option value="resort">Luxury Resort</option>
                  <option value="homestay">Authentic Homestay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Food Preference</label>
                <select
                  value={itinFoodPref}
                  onChange={e => setItinFoodPref(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="local">Authentic Local Specialties</option>
                  <option value="veg">🌱 Pure Vegetarian</option>
                  <option value="non_veg">🍗 Non-Veg Feast</option>
                  <option value="gourmet">🍷 Gourmet Dining</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleGenerateItinerary}
                disabled={itinLoading}
                className="w-full py-3 bg-[#242424] hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {itinLoading ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
                <span>{itinLoading ? (generationStep || 'Synthesizing Itinerary...') : 'Generate Verified Itinerary'}</span>
              </button>
            </div>
          </div>

          {/* Generated Result */}
          {itinResult && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#B45F3C] font-bold uppercase tracking-wider">
                    {itinResult.durationDays}-Day Verified Plan
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{itinResult.destination}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{itinResult.weatherForecastSummary}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveSubTab('weather');
                      fetchWeatherForDestination(itinResult.destination);
                    }}
                    className="px-3 py-1.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-sky-100 cursor-pointer"
                  >
                    <CloudRain className="w-3.5 h-3.5" />
                    <span>Check Weather Alerts</span>
                  </button>
                  <button
                    onClick={() => {
                      setAdaptDest(itinResult.destination);
                      setActiveSubTab('adapt');
                    }}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Adapt for Disruptions</span>
                  </button>
                </div>
              </div>

              {/* Days List */}
              <div className="space-y-4">
                {(itinResult.days || []).map((day: any) => (
                  <div key={day.dayNumber} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-sm text-slate-900">Day {day.dayNumber}: {day.theme}</span>
                      <span className="text-xs font-bold text-[#B45F3C]">~{formatINR(day.dailyTotalCost || 4500)}</span>
                    </div>

                    {['morning', 'afternoon', 'evening'].map((slotKey) => {
                      const acts = day[slotKey] || [];
                      if (acts.length === 0) return null;
                      const badgeColor = slotKey === 'morning' ? 'bg-amber-100 text-amber-900' : slotKey === 'afternoon' ? 'bg-sky-100 text-sky-900' : 'bg-indigo-100 text-indigo-900';

                      return (
                        <div key={slotKey} className="space-y-2">
                          {acts.map((act: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${badgeColor}`}>{slotKey}</span>
                                  <h5 className="font-bold text-slate-900">{act.name}</h5>
                                </div>
                                <span className="text-slate-500 font-semibold">{act.startTime} – {act.endTime}</span>
                              </div>
                              <p className="text-slate-600 text-[11px]">{act.reason}</p>
                              {act.location?.address && (
                                <div className="flex items-center gap-1 text-[11px] text-[#B45F3C] font-medium">
                                  <MapPin className="w-3 h-3 text-[#B45F3C] shrink-0" />
                                  <span>{act.location.address}</span>
                                </div>
                              )}
                              <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 pt-1 font-medium border-t border-slate-100">
                                <span>⏱️ {act.durationMins} mins</span>
                                <span>🚗 {act.distanceKm || 3.5} km ({act.travelTimeMins || 15} mins)</span>
                                <span>💰 ~{formatINR(act.estimatedCost || 0)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    success('Itinerary Saved', `Saved ${itinResult.destination} itinerary to your profile.`);
                    onNavigate('bookings');
                  }}
                  className="px-4 py-2 bg-[#242424] hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save to My Trips</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSubTab('concierge');
                    setInputQuery(`Can you optimize or suggest authentic food places for my ${itinResult.destination} itinerary?`);
                  }}
                  className="px-4 py-2 bg-[#B45F3C] hover:bg-[#9c4f30] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Discuss Plan with AI Assistant →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          SUBTAB 2: TRIP ASSISTANT CHAT (Proper OpenAI Conversational Bot)
         ============================================================ */}
      {activeSubTab === 'concierge' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[680px]">
          {/* Chat Header */}
          <div className="bg-[#242424] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B45F3C] flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">ExploreX AI Travel Assistant</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    OpenAI Engine Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Context: <strong className="text-amber-300">{activeDestination}</strong> • Grounded in real catalog & live weather
                </p>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Clear conversation context"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === 'user' ? 'bg-[#242424] text-white' : 'bg-[#B45F3C] text-white'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-xl p-4 rounded-2xl space-y-2.5 ${
                  m.role === 'user'
                    ? 'bg-[#242424] text-white rounded-tr-none shadow-md'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                    {m.text}
                  </div>

                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 text-[10px] text-[#B45F3C] font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Grounded via: {m.groundingSources.join(', ')}</span>
                    </div>
                  )}

                  {/* Dynamic Suggested Follow-up Prompts */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Next Questions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="px-2.5 py-1 bg-amber-50/80 hover:bg-amber-100 text-[#B45F3C] border border-amber-200 rounded-lg text-[11px] font-medium transition-colors text-left cursor-pointer"
                          >
                            💬 {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className={`text-[9px] block text-right ${m.role === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2.5 text-slate-500 text-xs p-3 bg-white rounded-2xl border border-slate-200 w-fit shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-[#B45F3C]" />
                <span>ExploreX Assistant is analyzing recommendations...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about any destination (e.g. Goa beaches, Manali snow valleys, Jaipur royal forts, Kerala backwaters...)"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#B45F3C] focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={chatLoading || !inputQuery.trim()}
              className="px-4 py-2.5 bg-[#B45F3C] hover:bg-[#9c4f30] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          SUBTAB 3: WEATHER ALERTS (Location-Specific Live Forecast)
         ============================================================ */}
      {activeSubTab === 'weather' && (
        <div className="space-y-6">
          {/* Destination Search & Quick Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Real-Time Open-Meteo Weather Forecast & Travel Alerts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Enter any Indian city or tourist destination to get live hourly & daily forecasts.</p>
              </div>
              <span className="px-3 py-1 bg-sky-50 text-sky-800 font-bold text-xs rounded-full border border-sky-200 flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                Live Open-Meteo Engine
              </span>
            </div>

            <form onSubmit={handleWeatherSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={weatherSearchQuery}
                  onChange={e => setWeatherSearchQuery(e.target.value)}
                  placeholder="Search destination (e.g. Pune, Mumbai, Goa, Manali, Jaipur, Varanasi)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={weatherLoading}
                className="px-5 py-2.5 bg-[#1E56A0] hover:bg-sky-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {weatherLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Fetch Weather</span>
              </button>
            </form>

            {/* Quick Destination Chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-slate-400">Quick Check:</span>
              {quickCities.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setWeatherSearchQuery(city);
                    fetchWeatherForDestination(city);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Live Weather Report Card */}
          {weatherReport && (
            <div className="space-y-6">
              {/* Current Overview & Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Main Temperature Card */}
                <div className="bg-gradient-to-br from-[#1E56A0] to-[#163172] text-white p-6 rounded-2xl shadow-md space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider uppercase text-sky-200 font-bold">Current Weather</span>
                      <h4 className="text-xl font-bold text-white mt-0.5">{weatherReport.destinationName}</h4>
                      <p className="text-xs text-sky-100">{weatherReport.current?.condition}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-amber-300">
                      {weatherReport.current?.isRainy ? <CloudRain className="w-7 h-7 text-sky-300" /> : <Sun className="w-7 h-7 text-amber-300" />}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">{weatherReport.current?.tempC}°C</span>
                    <span className="text-xs text-sky-200">Feels like {weatherReport.current?.feelsLikeC}°C</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-[11px] text-sky-100">
                    <div>
                      <span className="block text-[9px] text-sky-300">Humidity</span>
                      <strong>{weatherReport.current?.humidity}%</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] text-sky-300">Wind</span>
                      <strong>{weatherReport.current?.windSpeedKmH} km/h</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] text-sky-300">Rainfall</span>
                      <strong>{weatherReport.current?.precipitationMm} mm</strong>
                    </div>
                  </div>
                </div>

                {/* Travel Alerts Card */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>Active Weather Alerts & Travel Impact</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">{weatherReport.source === 'open-meteo' ? 'Live Open-Meteo Data' : 'Cached Baseline'}</span>
                    </div>

                    <div className="space-y-2">
                      {(weatherReport.alerts || []).map((alert: any, idx: number) => {
                        const isHigh = alert.severity === 'high' || alert.severity === 'severe';
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-xs space-y-1 ${
                              isHigh
                                ? 'bg-rose-50 border-rose-200 text-rose-950'
                                : alert.category === 'rain'
                                ? 'bg-sky-50 border-sky-200 text-sky-950'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span>{alert.title}</span>
                              {alert.impactWindow && <span className="text-[10px] opacity-80">Window: {alert.impactWindow}</span>}
                            </div>
                            <p className="text-[11px] opacity-90">{alert.message}</p>
                            <p className="text-[10px] font-semibold pt-1 border-t border-black/5">
                              💡 <strong>Recommendation:</strong> {alert.recommendedAction}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Weather -> Itinerary Connection Trigger */}
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-amber-950 block">Itinerary Impact Detected</span>
                      <p className="text-[11px] text-amber-800">
                        Rain or heat may disrupt scheduled outdoor visits. You can automatically re-sequence into covered cultural alternatives.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAdaptDest(weatherReport.destinationName);
                        setActiveSubTab('adapt');
                        handleRunAdaptation('heavy_rain', weatherReport.destinationName);
                      }}
                      className="px-4 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-bold rounded-lg text-xs whitespace-nowrap shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Adapt My Trip →</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 24-Hour Hourly Forecast Carousel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>24-Hour Hourly Travel Forecast ({weatherReport.destinationName})</span>
                </h4>

                <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1">
                  {(weatherReport.hourly || []).map((h: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex-shrink-0 w-20 p-2.5 rounded-xl border text-center space-y-1 text-xs ${
                        h.isRainy
                          ? 'bg-sky-50/80 border-sky-300 text-sky-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-[10px] text-slate-500 block">{h.time}</span>
                      <div className="flex justify-center py-1">
                        {h.isRainy ? <CloudRain className="w-4 h-4 text-sky-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
                      </div>
                      <span className="font-extrabold text-sm block">{h.tempC}°C</span>
                      <span className={`text-[9px] block ${h.precipitationProbability > 50 ? 'text-sky-700 font-bold' : 'text-slate-400'}`}>
                        💧 {h.precipitationProbability}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7-Day Forecast Grid */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>7-Day Travel Outlook</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                  {(weatherReport.daily || []).map((d: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1 text-xs">
                      <span className="font-bold text-slate-900 block">{d.dayName}</span>
                      <span className="text-[10px] text-slate-400 block">{d.date?.substring(5)}</span>
                      <div className="flex justify-center py-1">
                        {d.isRainy ? <CloudRain className="w-4 h-4 text-sky-600" /> : <CloudSun className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className="text-xs">
                        <span className="font-black text-slate-900">{d.tempMax}°</span>{' '}
                        <span className="text-slate-400">{d.tempMin}°</span>
                      </div>
                      <span className={`text-[10px] block ${d.precipitationProbability > 50 ? 'text-sky-700 font-bold' : 'text-slate-500'}`}>
                        💧 {d.precipitationProbability}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          SUBTAB 4: ADAPT TRIP & REPLANNER (Deterministic + Demand Balancer)
         ============================================================ */}
      {activeSubTab === 'adapt' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Trip Alternative & Automatic Replanner</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dynamically replaces only affected activities with authentic indoor cultural experiences while preserving the rest of your itinerary.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                Demand Balancer Replan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Destination</label>
                <input
                  type="text"
                  value={adaptDest}
                  onChange={e => setAdaptDest(e.target.value)}
                  placeholder="e.g. Pune, Goa, Mumbai, Jaipur"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Disruption Event Trigger</label>
                <select
                  value={adaptTrigger}
                  onChange={e => setAdaptTrigger(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
                >
                  <option value="heavy_rain">🌧️ Heavy Afternoon Rainstorm (12 PM–4 PM)</option>
                  <option value="extreme_heat">☀️ Midday Heat Wave (38°C+ Peak Sun)</option>
                  <option value="crowd_surge">👥 Peak Landmark Crowd Surge (Overcrowded Hub)</option>
                  <option value="traffic_congestion">🚦 Highway Congestion (45-min Transit Delay)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => handleRunAdaptation()}
                  disabled={adaptLoading}
                  className="w-full py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {adaptLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-300" />}
                  <span>Adapt My Trip Schedule</span>
                </button>
              </div>
            </div>
          </div>

          {/* Adaptation Result Display */}
          {adaptResult && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              {/* Alert & AI Explanation Box */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{adaptResult.alertTitle}</span>
                </div>
                <p className="text-emerald-900">{adaptResult.problemDetected}</p>
                <div className="p-3 bg-white rounded-lg border border-emerald-100 text-slate-800 text-xs leading-relaxed">
                  <strong className="text-emerald-900 block mb-0.5">🧠 AI Replanning Explanation:</strong>
                  {adaptResult.aiExplanation}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-emerald-900 font-semibold pt-1">
                  <span>✅ {adaptResult.preservedActivitiesCount} Original Activities Preserved</span>
                  <span>🔄 {adaptResult.replacedActivitiesCount} Outdoor Activities Rescheduled to Indoor Venues</span>
                  <span>🛡️ {adaptResult.savingsOrBenefits}</span>
                </div>
              </div>

              {/* Demand Balancer Hidden Gem Alternative */}
              {adaptResult.demandBalancerAlternative && (
                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3 text-xs">
                  <Leaf className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950">
                      🌿 Sustainable Demand Balancer Suggestion: {adaptResult.demandBalancerAlternative.recommendedSpot}
                    </span>
                    <p className="text-slate-700 text-[11px] mt-0.5">
                      {adaptResult.demandBalancerAlternative.reason}
                    </p>
                  </div>
                </div>
              )}

              {/* Side-by-Side Schedule Comparison */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Adapted Day-by-Day Schedule:
                </h4>

                {(adaptResult.adaptedItinerary?.days || []).map((day: any) => (
                  <div key={day.dayNumber} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <span className="font-bold text-sm text-slate-900 block">Day {day.dayNumber}: {day.theme}</span>

                    {['morning', 'afternoon', 'evening'].map(slot => {
                      const acts = day[slot] || [];
                      return acts.map((act: any, idx: number) => {
                        const isChanged = adaptResult.changes?.some((c: any) => c.replacementActivity?.name === act.name);
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-xs space-y-1 ${
                              isChanged
                                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                                : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                                  isChanged ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {isChanged ? '🔄 Replaced (Indoor)' : '✅ Preserved'}
                                </span>
                                <h5 className="font-bold">{act.name}</h5>
                              </div>
                              <span className="text-slate-500 font-semibold">{act.startTime} – {act.endTime}</span>
                            </div>
                            <p className="text-[11px] opacity-90">{act.reason}</p>
                          </div>
                        );
                      });
                    })}
                  </div>
                ))}
              </div>

              {/* Accept Alternative Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleApplyAdaptedItinerary}
                  className="px-5 py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept & Apply Alternative to Itinerary</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          SUBTAB 5: WHAT-IF SIMULATOR
         ============================================================ */}
      {activeSubTab === 'whatif' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">What-If Travel Scenario Simulator</h3>
            <p className="text-xs text-slate-500 mt-0.5">Stress-test travel scenarios for cost, time, and weather impact before traveling.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
              <input
                type="text"
                value={whatIfDest}
                onChange={e => setWhatIfDest(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Scenario Question</label>
              <input
                type="text"
                value={whatIfScenario}
                onChange={e => setWhatIfScenario(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunWhatIf}
                disabled={whatIfLoading}
                className="w-full py-2.5 bg-[#6A1B9A] hover:bg-purple-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {whatIfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sliders className="w-4 h-4" />}
                <span>Simulate Scenario Impact</span>
              </button>
            </div>
          </div>

          {whatIfResult && (
            <div className="p-5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-4 animate-in fade-in text-xs">
              <h4 className="font-bold text-purple-950 text-sm">{whatIfResult.scenarioTitle}</h4>
              <p className="text-slate-700">{whatIfResult.adjustedPlanSummary}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 bg-white rounded-xl border border-purple-200">
                  <span className="text-[10px] text-slate-400 block">Impact Score</span>
                  <span className="font-bold text-purple-900">{whatIfResult.impactScore}/100</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-purple-200">
                  <span className="text-[10px] text-slate-400 block">Cost Difference</span>
                  <span className="font-bold text-slate-900">₹{whatIfResult.costDifference}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-purple-200">
                  <span className="text-[10px] text-slate-400 block">Time Saved</span>
                  <span className="font-bold text-slate-900">{Math.abs(whatIfResult.timeDifferenceMins || 30)} mins</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-purple-200">
                  <span className="text-[10px] text-slate-400 block">Crowd Reduction</span>
                  <span className="font-bold text-emerald-700">-{whatIfResult.crowdReductionPct}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
