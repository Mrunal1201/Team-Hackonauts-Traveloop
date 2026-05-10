import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Trash2, MapPin, Calendar, Wallet, Users, Edit2, Check,
  Utensils, Hotel, Train, Camera, ShoppingBag, Landmark, Moon,
  ArrowLeft, Zap, Clock, Save, Star, ChevronDown, ChevronUp,
  GripVertical, Mountain, X, RefreshCw, Settings,
} from 'lucide-react';
import { useAI } from '../context/AIContext';
import { callOpenAI, buildSuggestionsPrompt } from '../utils/aiService';
import { useTrips } from '../context/TripsContext';
import type { Trip } from '../data/tripsData';

// ── Types ──────────────────────────────────────────────────────────────────
type ActivityType = 'food' | 'hotel' | 'transport' | 'sightseeing' | 'shopping' | 'activity' | 'culture' | 'other';

interface Activity {
  id: string;
  time: string;
  title: string;
  type: ActivityType;
  cost: number;
  note: string;
  duration: string;
}

interface TripDay {
  id: string;
  day: number;
  city: string;
  date: string;
  activities: Activity[];
}

interface TripDetails {
  name: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  notes: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const ACTIVITY_TYPES: { type: ActivityType; icon: typeof Utensils; label: string; color: string; bg: string; border: string }[] = [
  { type: 'food', icon: Utensils, label: 'Food & Dining', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { type: 'hotel', icon: Hotel, label: 'Accommodation', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  { type: 'transport', icon: Train, label: 'Transport', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { type: 'sightseeing', icon: Camera, label: 'Sightseeing', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { type: 'culture', icon: Landmark, label: 'Culture & History', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { type: 'shopping', icon: ShoppingBag, label: 'Shopping', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  { type: 'activity', icon: Mountain, label: 'Adventure', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { type: 'other', icon: Star, label: 'Other', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
];

const getActivityStyle = (type: ActivityType) =>
  ACTIVITY_TYPES.find(a => a.type === type) ?? ACTIVITY_TYPES[ACTIVITY_TYPES.length - 1];

const AI_SUGGESTIONS: Record<string, string[]> = {
  Japan: [
    '🚇 Buy 48-hour Tokyo Metro pass for unlimited rides (¥850)',
    '⛩️ Visit Senso-ji at 6am — before the crowds arrive',
    '🍜 Ramen budget: ¥900-1,200 at Ichiran or Fuunji',
    '🎟️ teamLab Borderless — book 3 weeks ahead',
    '🚄 Reserve Shinkansen seats: Tokyo→Kyoto ¥13,850',
  ],
  Paris: [
    '🗼 Book Eiffel Tower summit 2 weeks ahead (€29.40)',
    '🎨 Louvre: enter via Richelieu wing to skip queues',
    '🚇 Navigo Week pass €30.75 — unlimited metro',
    '🥐 Best croissant: Maison Landemaine (multiple locations)',
    '🌃 Versailles is a must — half day trip from Paris',
  ],
  Bali: [
    '🛵 Rent a scooter: ₹400/day — best way to explore',
    '🌅 Mount Batur sunrise trek — arrange 1 day before',
    '🌿 Rice terrace walk in Tegallalang — arrive by 8am',
    '🐘 Only visit ethical elephant sanctuaries in Ubud',
    '💆 Balinese massage: ₹500-800/hour in Ubud',
  ],
};

const AI_DEFAULT_SUGGESTIONS = [
  '💡 Allocate 20% of budget as emergency buffer',
  '📱 Download city transit apps before arrival',
  '🏥 Get travel insurance for medical emergencies',
  '💳 Notify your bank before traveling internationally',
  '📷 Research local customs & photography rules',
];

// ── Initial Data ───────────────────────────────────────────────────────────
const DEFAULT_DAYS: TripDay[] = [
  {
    id: 'd1', day: 1, city: 'Tokyo', date: '2026-06-10',
    activities: [
      { id: 'a1', time: '3:00 PM', title: 'Hotel check-in — Shinjuku', type: 'hotel', cost: 5000, note: 'APA Hotel Shinjuku', duration: '30 min' },
      { id: 'a2', time: '5:00 PM', title: 'Shibuya Crossing', type: 'sightseeing', cost: 0, note: 'Iconic scramble crossing', duration: '1 hour' },
      { id: 'a3', time: '7:30 PM', title: 'Dinner — Ichiran Ramen', type: 'food', cost: 1200, note: 'Solo ramen booth experience', duration: '1 hour' },
    ],
  },
  {
    id: 'd2', day: 2, city: 'Tokyo', date: '2026-06-11',
    activities: [
      { id: 'a4', time: '6:00 AM', title: 'Senso-ji Temple at sunrise', type: 'culture', cost: 0, note: 'Asakusa, arrive early!', duration: '2 hours' },
      { id: 'a5', time: '10:00 AM', title: 'Akihabara exploration', type: 'shopping', cost: 3000, note: 'Electronics & anime', duration: '3 hours' },
    ],
  },
];

// ── Modal Component ────────────────────────────────────────────────────────
const AddActivityModal: React.FC<{
  onAdd: (activity: Omit<Activity, 'id'>) => void;
  onClose: () => void;
  dayCity: string;
}> = ({ onAdd, onClose, dayCity }) => {
  const [form, setForm] = useState<Omit<Activity, 'id'>>({
    time: '09:00 AM', title: '', type: 'sightseeing', cost: 0, note: '', duration: '2 hours',
  });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-[#2A4D3A] text-lg">Add Activity in {dayCity}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Activity Name *</label>
            <input
              autoFocus
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Visit Eiffel Tower"
              className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2A4D3A]/40 transition-colors"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITY_TYPES.map(at => (
                <button
                  key={at.type}
                  onClick={() => setForm(f => ({ ...f, type: at.type }))}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    form.type === at.type
                      ? `${at.bg} ${at.border} ${at.color}`
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <at.icon size={14} /> {at.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Time</label>
              <input
                type="time"
                value={form.time.replace(/ (AM|PM)/, '')}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-3 py-3 text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Duration</label>
              <select
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-3 py-3 text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40 transition-colors"
              >
                {['30 min', '1 hour', '1.5 hours', '2 hours', '3 hours', '4 hours', 'Half day', 'Full day'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Estimated Cost</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</span>
              <input
                type="number"
                value={form.cost}
                onChange={e => setForm(f => ({ ...f, cost: Number(e.target.value) }))}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 bg-[#FDFBF7] border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40 transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Notes (optional)</label>
            <textarea
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="Tips, reservations, reminders..."
              rows={2}
              className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2A4D3A]/40 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:border-slate-300 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${
              form.title.trim() ? 'bg-[#2A4D3A] text-white hover:bg-[#1f382a] shadow-md' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            <Plus size={18} /> Add Activity
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export const CustomBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { isAIEnabled, setShowSettings } = useAI();
  const { addTrip } = useTrips();
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    name: 'My Japan Adventure',
    destinations: ['Tokyo', 'Kyoto', 'Osaka'],
    startDate: '2026-06-10',
    endDate: '2026-06-15',
    travelers: 2,
    budget: 150000,
    currency: '₹',
    notes: '',
  });
  const [days, setDays] = useState<TripDay[]>(DEFAULT_DAYS);
  const [expandedDay, setExpandedDay] = useState<string | null>('d1');
  const [showAddModal, setShowAddModal] = useState<string | null>(null);
  const [editingDetails, setEditingDetails] = useState(false);
  const [newDest, setNewDest] = useState('');
  const [saved, setSaved] = useState(false);
  const [aiSuggestionsList, setAiSuggestionsList] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const totalSpent = days.flatMap(d => d.activities).reduce((s, a) => s + a.cost, 0);
  const budgetProgress = Math.min((totalSpent / tripDetails.budget) * 100, 100);

  const addDay = () => {
    const newDay: TripDay = {
      id: `d${Date.now()}`,
      day: days.length + 1,
      city: tripDetails.destinations[Math.min(days.length, tripDetails.destinations.length - 1)] || 'New City',
      date: '',
      activities: [],
    };
    setDays(prev => [...prev, newDay]);
    setExpandedDay(newDay.id);
  };

  const removeDay = (dayId: string) => {
    setDays(prev => prev.filter(d => d.id !== dayId).map((d, i) => ({ ...d, day: i + 1 })));
  };

  const addActivity = (dayId: string, activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = { ...activity, id: `a${Date.now()}` };
    setDays(prev => prev.map(d => d.id === dayId ? { ...d, activities: [...d.activities, newActivity] } : d));
  };

  const removeActivity = (dayId: string, actId: string) => {
    setDays(prev => prev.map(d => d.id === dayId ? { ...d, activities: d.activities.filter(a => a.id !== actId) } : d));
  };

  // Fetch real AI suggestions when destinations change
  const fetchAISuggestions = async (destinations: string[]) => {
    if (!isAIEnabled || destinations.length === 0) return;
    setLoadingSuggestions(true);
    try {
      const messages = buildSuggestionsPrompt(destinations);
      const raw = await callOpenAI(messages, { max_tokens: 400, temperature: 0.7 });
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setAiSuggestionsList(parsed);
      }
    } catch {
      // silently fall back to static suggestions
    }
    setLoadingSuggestions(false);
  };

  useEffect(() => {
    if (isAIEnabled && tripDetails.destinations.length > 0) {
      fetchAISuggestions(tripDetails.destinations);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAIEnabled]);

  const aiSuggestions = aiSuggestionsList.length > 0
    ? aiSuggestionsList
    : (tripDetails.destinations[0] && AI_SUGGESTIONS[tripDetails.destinations[0]])
      ? AI_SUGGESTIONS[tripDetails.destinations[0]]
      : AI_DEFAULT_SUGGESTIONS;

  const handleSave = () => {
    // Build a proper Trip object and save to context
    const tripId = `custom-${Date.now()}`;
    const newTrip: Trip = {
      id: tripId,
      title: tripDetails.name,
      destination: tripDetails.destinations.join(' → '),
      countries: tripDetails.destinations,
      cities: tripDetails.destinations,
      cover: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
      status: 'Draft',
      startDate: tripDetails.startDate || 'TBD',
      endDate: tripDetails.endDate || 'TBD',
      days: days.length,
      budget: tripDetails.budget,
      spent: totalSpent,
      travelers: tripDetails.travelers,
      travelType: tripDetails.travelers === 1 ? 'Solo' : tripDetails.travelers === 2 ? 'Couple' : 'Group',
      interests: [],
      progress: Math.min(Math.round((totalSpent / tripDetails.budget) * 100), 100),
      description: `Custom-built ${days.length}-day trip across ${tripDetails.destinations.join(', ')}.`,
      healthScore: 65,
      aiGenerated: false,
    };
    addTrip(newTrip);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate(`/trips/${tripId}`);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/plan')} className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#2A4D3A] hover:border-slate-200 transition-colors shadow-sm flex-shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          {editingDetails ? (
            <input
              autoFocus
              value={tripDetails.name}
              onChange={e => setTripDetails(f => ({ ...f, name: e.target.value }))}
              onBlur={() => setEditingDetails(false)}
              className="text-2xl font-bold text-[#2A4D3A] bg-transparent border-b-2 border-[#F5B041] focus:outline-none w-full"
            />
          ) : (
            <h1
              className="text-2xl font-bold text-[#2A4D3A] cursor-pointer flex items-center gap-2 group truncate"
              onClick={() => setEditingDetails(true)}
            >
              {tripDetails.name}
              <Edit2 size={16} className="text-slate-300 group-hover:text-[#F5B041] transition-colors flex-shrink-0" />
            </h1>
          )}
          <p className="text-slate-400 text-sm">{tripDetails.destinations.join(' → ')} · {days.length} days</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex-shrink-0 ${
            saved ? 'bg-emerald-500 text-white' : 'bg-[#2A4D3A] text-white hover:bg-[#1f382a] shadow-md'
          }`}
        >
          {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Trip</>}
        </button>
      </div>

      {/* Trip Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: MapPin, label: 'Cities', value: tripDetails.destinations.length, sub: tripDetails.destinations.slice(0, 2).join(', ') },
          { icon: Calendar, label: 'Days', value: days.length, sub: `${tripDetails.startDate || 'Set dates'}` },
          { icon: Users, label: 'Travelers', value: tripDetails.travelers, sub: 'people' },
          { icon: Wallet, label: 'Budget', value: `${tripDetails.currency}${(tripDetails.budget/1000).toFixed(0)}K`, sub: `${tripDetails.currency}${totalSpent.toLocaleString()} spent` },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon size={14} className="text-[#2A4D3A]" />
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="font-bold text-[#2A4D3A] text-xl">{stat.value}</div>
            <div className="text-xs text-slate-400 truncate">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Budget Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-600">Budget Usage</span>
          <span className={`text-sm font-bold ${budgetProgress > 85 ? 'text-red-500' : 'text-[#2A4D3A]'}`}>
            {tripDetails.currency}{totalSpent.toLocaleString()} / {tripDetails.currency}{tripDetails.budget.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${budgetProgress > 85 ? 'bg-red-400' : budgetProgress > 60 ? 'bg-[#F5B041]' : 'bg-[#2A4D3A]'}`}
            animate={{ width: `${budgetProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{budgetProgress.toFixed(0)}% used</span>
          <span>{tripDetails.currency}{Math.max(tripDetails.budget - totalSpent, 0).toLocaleString()} remaining</span>
        </div>
      </div>

      {/* Main Layout: Days + AI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Days Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Destination chips */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-[#2A4D3A]" />
              <span className="text-sm font-bold text-slate-600">Destinations</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tripDetails.destinations.map(dest => (
                <span key={dest} className="flex items-center gap-1.5 bg-[#2A4D3A]/10 text-[#2A4D3A] text-sm font-semibold px-3 py-1.5 rounded-full">
                  {dest}
                  <button onClick={() => setTripDetails(f => ({ ...f, destinations: f.destinations.filter(d => d !== dest) }))}
                    className="text-[#2A4D3A]/50 hover:text-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <div className="flex gap-1">
                <input
                  value={newDest}
                  onChange={e => setNewDest(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newDest.trim()) {
                      setTripDetails(f => ({ ...f, destinations: [...f.destinations, newDest.trim()] }));
                      setNewDest('');
                    }
                  }}
                  placeholder="+ Add city"
                  className="bg-slate-50 border border-dashed border-slate-200 rounded-full px-3 py-1.5 text-sm text-slate-500 focus:outline-none focus:border-[#2A4D3A]/40 w-24 transition-all focus:w-32"
                />
              </div>
            </div>
          </div>

          {/* Day Cards */}
          {days.map((day) => {
            const isExpanded = expandedDay === day.id;
            const dayTotal = day.activities.reduce((s, a) => s + a.cost, 0);

            return (
              <motion.div
                key={day.id}
                layout
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Day Header */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                >
                  <div className="w-14 h-14 bg-[#2A4D3A] rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-[9px] font-bold uppercase">Day</span>
                    <span className="text-white font-bold text-xl leading-none">{day.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <input
                        value={day.city}
                        onChange={e => setDays(prev => prev.map(d => d.id === day.id ? { ...d, city: e.target.value } : d))}
                        onClick={e => e.stopPropagation()}
                        className="font-bold text-slate-800 text-lg bg-transparent focus:outline-none border-b border-transparent focus:border-[#F5B041] transition-colors"
                      />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span>{day.activities.length} activities</span>
                      {dayTotal > 0 && <span className="text-[#2A4D3A] font-semibold">¥{dayTotal.toLocaleString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); removeDay(day.id); }}
                      className="p-2 hover:bg-red-50 rounded-xl text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </div>
                </div>

                {/* Day Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        {/* Timeline */}
                        <div className="relative space-y-3 mb-4">
                          {day.activities.length === 0 && (
                            <div className="text-center py-8 text-slate-400 text-sm">
                              <Plus size={24} className="mx-auto mb-2 text-slate-300" />
                              No activities yet — add your first one!
                            </div>
                          )}
                          {day.activities.map((act, ai) => {
                            const style = getActivityStyle(act.type);
                            return (
                              <motion.div
                                key={act.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: ai * 0.05 }}
                                className={`flex gap-3 p-3.5 rounded-2xl border ${style.bg} ${style.border} group`}
                              >
                                <div className="flex-shrink-0 text-center min-w-[56px]">
                                  <style.icon size={16} className={`${style.color} mx-auto mb-0.5`} />
                                  <div className="text-[10px] text-slate-400 font-semibold leading-tight">{act.time}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-slate-800 text-sm mb-0.5">{act.title}</div>
                                  {act.note && <p className="text-xs text-slate-400 italic truncate">{act.note}</p>}
                                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                                    <span className="text-slate-400 flex items-center gap-1"><Clock size={10} /> {act.duration}</span>
                                    {act.cost > 0 && <span className={`font-bold ${style.color}`}>¥{act.cost.toLocaleString()}</span>}
                                    {act.cost === 0 && <span className="font-bold text-emerald-600">Free</span>}
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeActivity(day.id, act.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg text-slate-300 hover:text-red-400 transition-all flex-shrink-0"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Add Activity Button */}
                        <button
                          onClick={() => setShowAddModal(day.id)}
                          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#2A4D3A]/20 rounded-2xl text-[#2A4D3A]/60 hover:border-[#2A4D3A]/40 hover:text-[#2A4D3A] hover:bg-[#2A4D3A]/5 transition-all text-sm font-semibold"
                        >
                          <Plus size={16} /> Add Activity
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Add Day Button */}
          <button
            onClick={addDay}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#2A4D3A]/25 rounded-3xl text-[#2A4D3A]/60 hover:border-[#2A4D3A]/40 hover:text-[#2A4D3A] hover:bg-[#2A4D3A]/5 transition-all font-bold"
          >
            <Plus size={18} /> Add Day {days.length + 1}
          </button>
        </div>

        {/* AI Suggestions Sidebar */}
        <div className="space-y-4">
          {/* AI Tips */}
          <div className="bg-gradient-to-b from-[#2A4D3A] to-[#1f382a] rounded-3xl p-5 shadow-lg sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-[#F5B041] rounded-lg">
                <Zap size={14} className="text-[#2A4D3A]" />
              </div>
              <h3 className="font-bold text-white flex-1">AI Suggestions</h3>
              {isAIEnabled ? (
                <button
                  onClick={() => fetchAISuggestions(tripDetails.destinations)}
                  disabled={loadingSuggestions}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh suggestions"
                >
                  <RefreshCw size={13} className={`text-[#F5B041] ${loadingSuggestions ? 'animate-spin' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-1 text-[9px] font-bold text-[#F5B041]/70 hover:text-[#F5B041] bg-white/5 px-2 py-1 rounded-lg transition-colors"
                >
                  <Settings size={10} /> Add Key
                </button>
              )}
            </div>

            {/* AI status pill */}
            <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3 w-fit ${
              isAIEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/8 text-white/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isAIEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
              {isAIEnabled ? (aiSuggestionsList.length > 0 ? 'GPT-Powered' : 'Loading…') : 'Offline tips'}
            </div>

            <div className="space-y-2.5">
              {loadingSuggestions ? (
                [1,2,3,4].map(i => (
                  <div key={i} className="bg-white/8 rounded-2xl p-3 animate-pulse">
                    <div className="h-3 bg-white/10 rounded-full mb-1" />
                    <div className="h-3 bg-white/5 rounded-full w-3/4" />
                  </div>
                ))
              ) : aiSuggestions.map((tip, i) => (
                <motion.div
                  key={`${i}-${tip.slice(0, 12)}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white/8 border border-white/10 rounded-2xl p-3 cursor-pointer hover:bg-white/15 transition-colors group"
                  onClick={() => {}}
                >
                  <p className="text-white/80 text-xs leading-relaxed group-hover:text-white transition-colors">{tip}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-2">Trip Summary</p>
              <div className="space-y-1.5">
                {[
                  { label: 'Total activities', value: days.flatMap(d => d.activities).length },
                  { label: 'Total cost logged', value: `¥${totalSpent.toLocaleString()}` },
                  { label: 'Cities planned', value: tripDetails.destinations.length },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-xs">
                    <span className="text-white/50">{item.label}</span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trip Settings */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-bold text-[#2A4D3A] mb-4 flex items-center gap-2">
              <Edit2 size={16} className="text-[#F5B041]" /> Trip Settings
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Total Budget</label>
                <div className="flex gap-2">
                  <select
                    value={tripDetails.currency}
                    onChange={e => setTripDetails(f => ({ ...f, currency: e.target.value }))}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-sm focus:outline-none"
                  >
                    {['₹', '$', '€', '£', '¥'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input
                    type="number"
                    value={tripDetails.budget}
                    onChange={e => setTripDetails(f => ({ ...f, budget: Number(e.target.value) }))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Start Date</label>
                <input
                  type="date"
                  value={tripDetails.startDate}
                  onChange={e => setTripDetails(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Travelers</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setTripDetails(f => ({ ...f, travelers: Math.max(1, f.travelers - 1) }))}
                    className="w-8 h-8 bg-slate-100 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors">−</button>
                  <span className="font-bold text-[#2A4D3A] text-lg w-8 text-center">{tripDetails.travelers}</span>
                  <button onClick={() => setTripDetails(f => ({ ...f, travelers: f.travelers + 1 }))}
                    className="w-8 h-8 bg-slate-100 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddActivityModal
            onAdd={activity => addActivity(showAddModal, activity)}
            onClose={() => setShowAddModal(null)}
            dayCity={days.find(d => d.id === showAddModal)?.city ?? 'City'}
          />
        )}
      </AnimatePresence>
    </div>
  );
};