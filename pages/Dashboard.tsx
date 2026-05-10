import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, MapPin, Calendar, Wallet, Plane, Star,
  ArrowRight, Clock, ChevronRight, Compass, Sparkles,
  Shield, Train, Globe, Wand2, Plus, Sun, Cloud,
  CloudRain, Briefcase,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useTrips } from '../context/TripsContext';
import { useAuth } from '../context/AuthContext';

// ── Images ───────────────────────────────────────────────────────────────────
const IMG = {
  hero:      'https://images.unsplash.com/photo-1502922038-4e6b84cc16c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  rome:      'https://images.unsplash.com/photo-1698103182362-51abdc45d008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  nyc:       'https://images.unsplash.com/photo-1655845836463-facb2826510b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  dubai:     'https://images.unsplash.com/photo-1646231085802-528b62999428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  maldives:  'https://images.unsplash.com/photo-1622779536320-bb5f5b501a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  kyoto:     'https://images.unsplash.com/photo-1704026438453-fde2ceb923ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  bali:      'https://images.unsplash.com/photo-1675349673331-5bd6398000b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
};

// ── Trending destinations ─────────────────────────────────────────────────────
const TRENDING = [
  { name: 'Rome',     country: 'Italy',     flag: '🇮🇹', image: IMG.rome,     price: '$1,200', rating: 4.9, tag: 'Historic' },
  { name: 'Kyoto',    country: 'Japan',     flag: '🇯🇵', image: IMG.kyoto,    price: '$2,100', rating: 5.0, tag: 'Culture'  },
  { name: 'Bali',     country: 'Indonesia', flag: '🇮🇩', image: IMG.bali,     price: '$900',   rating: 4.8, tag: 'Tropical' },
  { name: 'New York', country: 'USA',       flag: '🇺🇸', image: IMG.nyc,      price: '$2,800', rating: 4.7, tag: 'Urban'    },
  { name: 'Dubai',    country: 'UAE',       flag: '🇦🇪', image: IMG.dubai,    price: '$1,800', rating: 4.8, tag: 'Luxury'   },
  { name: 'Maldives', country: 'Maldives',  flag: '🇲🇻', image: IMG.maldives, price: '$3,400', rating: 5.0, tag: 'Beach'    },
];

// ── Quick actions ─────────────────────────────────────────────────────────────
const ACTIONS = [
  { icon: Plane,    label: 'Plan Trip',  desc: 'AI or custom planner',   to: '/plan',       bg: 'bg-[#2A4D3A]/8',  txt: 'text-[#2A4D3A]',  badge: null  },
  { icon: Briefcase,label: 'My Trips',  desc: 'View all your journeys',  to: '/trips',      bg: 'bg-[#F5B041]/10', txt: 'text-amber-600',  badge: null  },
  { icon: Globe,    label: 'Community', desc: 'Connect with travelers',  to: '/community',  bg: 'bg-blue-50',      txt: 'text-blue-600',   badge: 'NEW' },
  { icon: Sparkles, label: 'AI Studio', desc: 'Generate travel content', to: '/ai-studio',  bg: 'bg-violet-50',    txt: 'text-violet-600', badge: 'AI'  },
  { icon: Compass,  label: 'Insights',  desc: 'Heatmaps & analytics',    to: '/insights',   bg: 'bg-emerald-50',   txt: 'text-emerald-600',badge: 'AI'  },
  { icon: Train,    label: 'Transport', desc: 'Metro, taxi & transfers', to: '/transport',  bg: 'bg-sky-50',       txt: 'text-sky-600',    badge: null  },
  { icon: Star,     label: 'Discover',  desc: 'Food, culture & stays',   to: '/discover',   bg: 'bg-amber-50',     txt: 'text-amber-600',  badge: null  },
  { icon: Shield,   label: 'Safety',    desc: 'Emergency & SOS',         to: '/local',      bg: 'bg-rose-50',      txt: 'text-rose-600',   badge: 'SOS' },
];

// ── City weather strip ────────────────────────────────────────────────────────
const WEATHER = [
  { city: 'Tokyo',  flag: '🇯🇵', temp: 29, cond: 'Partly Cloudy', icon: 'cloud'  },
  { city: 'Paris',  flag: '🇫🇷', temp: 22, cond: 'Sunny',          icon: 'sun'    },
  { city: 'Bali',   flag: '🇮🇩', temp: 31, cond: 'Tropical Rain',  icon: 'rain'   },
  { city: 'Rome',   flag: '🇮🇹', temp: 26, cond: 'Clear Sky',      icon: 'sun'    },
];

const STATUS_COLORS: Record<string, string> = {
  Active:    'bg-emerald-100 text-emerald-700',
  Upcoming:  'bg-indigo-100  text-indigo-700',
  Draft:     'bg-slate-100   text-slate-500',
  Completed: 'bg-amber-100   text-amber-700',
};

function WeatherIcon({ type }: { type: string }) {
  if (type === 'rain')  return <CloudRain size={16} className="text-sky-400" />;
  if (type === 'cloud') return <Cloud size={16} className="text-slate-400" />;
  return <Sun size={16} className="text-amber-400" />;
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export const Dashboard: React.FC = () => {
  const { trips } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const suggestions = ['Tokyo, Japan', 'Paris, France', 'Bali, Indonesia', 'Rome, Italy', 'Dubai, UAE'];
  const filtered = searchQuery ? suggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  // Use real trips from context
  const displayTrips = trips.slice(0, 3);
  const featuredTrip = trips.find(t => t.status === 'Active') || trips[0];

  return (
    <div className="space-y-8">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
        style={{ minHeight: 280 }}
      >
        <div className="absolute inset-0">
          <img src={IMG.hero} alt="hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a12]/90 via-[#1B4332]/75 to-[#2A4D3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a12]/60 to-transparent" />
        </div>
        <div className="absolute top-8 right-12 w-48 h-48 rounded-full bg-[#F5B041]/15 blur-3xl" />

        <div className="relative px-6 md:px-10 py-10 md:py-14">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👋</span>
              <span className="text-white/70 font-medium">Good morning, {user?.name?.split(' ')[0] ?? 'Traveler'}</span>
              <div className="ml-2 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 text-xs font-semibold">AI Active</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1 leading-tight">
              Where to <span className="text-[#F5B041]">next?</span>
            </h1>
            <p className="text-white/60 mb-6 max-w-md">Plan your perfect journey with AI-powered recommendations tailored just for you.</p>
          </motion.div>

          {/* Hero Search */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative max-w-xl">
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${searchFocused ? 'bg-white shadow-2xl' : 'bg-white/90 backdrop-blur-md shadow-xl'}`}>
              <Search size={20} className={searchFocused ? 'text-[#2A4D3A]' : 'text-slate-400'} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search destinations, cities, experiences…"
                className="flex-1 text-slate-800 bg-transparent focus:outline-none text-sm placeholder-slate-400"
              />
              <button onClick={() => navigate('/plan')} className="flex items-center gap-2 bg-[#2A4D3A] hover:bg-[#1f3d2d] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors flex-shrink-0">
                <Sparkles size={15} /> Explore
              </button>
            </div>
            <AnimatePresence>
              {searchFocused && filtered.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                  {filtered.map(s => (
                    <button key={s} onMouseDown={() => { setSearchQuery(s); navigate('/plan/ai'); }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-[#2A4D3A]/8 hover:text-[#2A4D3A] transition-colors text-left">
                      <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                      {s}
                      <ArrowRight size={13} className="ml-auto text-slate-300" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Hero stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="flex flex-wrap gap-4 mt-6">
            {[
              { icon: '✈️', label: `${trips.length} Trips Planned` },
              { icon: '🌍', label: '34 Countries Explored' },
              { icon: '💰', label: '$3.2k Saved' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <span>{s.icon}</span>
                <span className="text-white text-xs font-semibold">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Plane,  label: 'Total Trips',     value: trips.length.toString(),                                          sub: `${trips.filter(t=>t.status==='Active').length} active`,  color: 'text-[#2A4D3A]',   bg: 'bg-[#2A4D3A]/8',  border: 'border-[#2A4D3A]/12' },
          { icon: Globe,  label: 'Countries',       value: '34',                                                             sub: '5 continents',                                            color: 'text-[#F5B041]',   bg: 'bg-[#F5B041]/10', border: 'border-[#F5B041]/15'  },
          { icon: Wallet, label: 'Total Budget',    value: `$${Math.round(trips.reduce((s,t)=>s+t.budget,0)/1000)}k`,       sub: 'across all trips',                                        color: 'text-emerald-600', bg: 'bg-emerald-50',   border: 'border-emerald-100'   },
          { icon: Star,   label: 'Avg Trip Rating', value: '4.9 ★',                                                         sub: '68 reviews',                                              color: 'text-amber-600',   bg: 'bg-amber-50',     border: 'border-amber-100'     },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`bg-white rounded-2xl border ${s.border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className={`font-black text-2xl ${s.color}`}>{s.value}</p>
            <p className="font-semibold text-slate-800 text-sm mt-0.5">{s.label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Featured Trip + Weather ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {featuredTrip ? (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40 overflow-hidden">
              <img src={featuredTrip.cover} alt={featuredTrip.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332]/85 to-[#2A4D3A]/50" />
              <div className="absolute top-4 left-5">
                <span className={`text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 w-fit ${featuredTrip.status === 'Active' ? 'bg-emerald-400' : 'bg-[#F5B041]/80'}`}>
                  {featuredTrip.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  {featuredTrip.status}
                </span>
              </div>
              {featuredTrip.aiGenerated && (
                <div className="absolute top-4 right-5">
                  <span className="flex items-center gap-1 text-[9px] font-black bg-[#F5B041] text-[#2A4D3A] px-2 py-0.5 rounded-full">
                    <Sparkles size={8} /> AI Generated
                  </span>
                </div>
              )}
              <div className="absolute bottom-4 left-5 right-5">
                <p className="text-white/60 text-xs mb-0.5 font-semibold uppercase tracking-wider">Featured Trip</p>
                <h3 className="text-white font-black text-xl">{featuredTrip.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-white/70 text-xs"><Calendar size={11} /> {featuredTrip.startDate} → {featuredTrip.endDate}</div>
                  <div className="flex items-center gap-1 text-white/70 text-xs"><MapPin size={11} /> {featuredTrip.cities.length} cities</div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Trip Progress</span>
                <span className="font-black text-[#2A4D3A]">{featuredTrip.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                <motion.div initial={{ width: 0 }} animate={{ width: `${featuredTrip.progress}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#2A4D3A] to-[#F5B041]" />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Budget</p>
                  <p className="font-black text-slate-800">${featuredTrip.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Spent</p>
                  <p className="font-black text-emerald-600">${featuredTrip.spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Remaining</p>
                  <p className="font-black text-[#2A4D3A]">${(featuredTrip.budget - featuredTrip.spent).toLocaleString()}</p>
                </div>
              </div>
              <Link to={`/trips/${featuredTrip.id}`} className="flex items-center gap-2 text-sm font-bold text-[#2A4D3A] hover:text-[#1f3d2d] transition-colors group">
                Open Workspace <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center">
            <Plane size={40} className="text-slate-200 mb-4" />
            <p className="font-bold text-slate-500 text-lg mb-2">No active trips yet</p>
            <p className="text-slate-400 text-sm mb-5">Start planning your first adventure with AI assistance</p>
            <Link to="/plan/ai" className="flex items-center gap-2 bg-[#2A4D3A] text-white font-bold text-sm px-6 py-3 rounded-2xl hover:bg-[#1f3d2d] transition-colors shadow-lg">
              <Sparkles size={16} /> Generate a Trip with AI
            </Link>
          </motion.div>
        )}

        {/* Weather widget */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">City Weather</h3>
            <span className="text-xs text-slate-400">Live</span>
          </div>
          <div className="space-y-3">
            {WEATHER.map(w => (
              <div key={w.city} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <span className="text-xl">{w.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{w.city}</p>
                  <p className="text-xs text-slate-400">{w.cond}</p>
                </div>
                <div className="flex items-center gap-2">
                  <WeatherIcon type={w.icon} />
                  <span className="font-bold text-slate-800 text-sm">{w.temp}°C</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/tools" className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#2A4D3A] hover:text-[#1f3d2d] transition-colors">
            Full forecast <ChevronRight size={12} />
          </Link>
        </motion.div>
      </div>

      {/* ── My Trips ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-slate-900 text-xl">My Trips</h2>
            <p className="text-slate-500 text-sm">{trips.length} trips · {trips.filter(t=>t.status==='Active').length} active · {trips.filter(t=>t.status==='Upcoming').length} upcoming</p>
          </div>
          <Link to="/trips" className="flex items-center gap-1.5 text-sm font-bold text-[#2A4D3A] hover:text-[#1f3d2d] transition-colors group">
            View All <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {displayTrips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <Plane size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-600">No trips yet</p>
            <p className="text-slate-400 text-sm mt-1 mb-4">Start planning your first adventure!</p>
            <Link to="/plan" className="inline-flex items-center gap-2 bg-[#2A4D3A] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#1f3d2d] transition-colors">
              <Plus size={15} /> Plan a Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayTrips.map((trip, i) => (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <Link to={`/trips/${trip.id}`}>
                  <div className="relative h-36 overflow-hidden">
                    <img src={trip.cover} alt={trip.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[trip.status]}`}>{trip.status}</span>
                    </div>
                    {trip.aiGenerated && (
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1 text-[9px] font-black bg-[#F5B041] text-[#2A4D3A] px-2 py-0.5 rounded-full">
                          <Sparkles size={8} /> AI
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white font-bold text-sm">{trip.title}</p>
                      <p className="text-white/60 text-xs">{trip.startDate} → {trip.endDate}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1"><MapPin size={11} /> {trip.cities.length} cities</div>
                      <div className="flex items-center gap-1"><Wallet size={11} /> ${trip.budget.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#2A4D3A] to-[#F5B041]" style={{ width: `${trip.progress || 0}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-500">{trip.progress}%</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Access Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-slate-900 text-xl">Quick Access</h2>
          <span className="text-sm text-slate-400">8 features</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACTIONS.map((a, i) => (
            <motion.div key={a.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
              <Link to={a.to} className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-[#2A4D3A]/30 hover:shadow-md transition-all group">
                <div className={`w-10 h-10 ${a.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <a.icon size={18} className={a.txt} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="font-bold text-slate-800 text-sm">{a.label}</p>
                    {a.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${a.txt} ${a.bg}`}>{a.badge}</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-snug">{a.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Trending Destinations ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-slate-900 text-xl">Trending Destinations</h2>
            <p className="text-slate-500 text-sm">Popular with travelers this month</p>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {TRENDING.map((dest, i) => (
            <motion.div key={dest.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }}
              className="flex-shrink-0 w-52 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer group">
              <div className="relative h-36 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-[10px] font-bold">{dest.tag}</div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star size={9} fill="#FBBF24" stroke="#FBBF24" />
                  <span className="text-white text-[10px] font-bold">{dest.rating}</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white font-bold text-sm">{dest.name}</p>
                  <p className="text-white/70 text-xs">{dest.flag} {dest.country}</p>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">From</p>
                  <p className="font-black text-[#2A4D3A]">{dest.price}</p>
                </div>
                <Link to="/plan/ai" className="flex items-center gap-1 text-xs font-bold text-[#2A4D3A] bg-[#2A4D3A]/8 hover:bg-[#2A4D3A]/15 px-3 py-1.5 rounded-xl transition-colors">
                  <Plus size={12} /> Plan
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── AI Banner ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-[#2A4D3A] via-[#1B4332] to-[#0f1a12] rounded-3xl overflow-hidden p-6 md:p-8">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#F5B041]/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#F5B041]/20 flex items-center justify-center">
                <Sparkles size={16} className="text-[#F5B041]" />
              </div>
              <span className="text-white/80 text-sm font-bold uppercase tracking-wider">AI Powered</span>
            </div>
            <h3 className="text-white font-black text-2xl mb-2">Ready to plan your next adventure?</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              Our AI generates complete itineraries, budget breakdowns, packing lists, and insider tips — in seconds.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link to="/plan/ai" className="flex items-center justify-center gap-2 bg-[#F5B041] text-[#2A4D3A] font-black text-sm px-6 py-3.5 rounded-2xl hover:bg-[#e5a030] transition-colors shadow-xl">
              <Wand2 size={16} /> AI Generator
            </Link>
            <Link to="/plan/custom" className="flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-bold text-sm px-6 py-3.5 rounded-2xl hover:bg-white/25 transition-colors">
              <Plus size={16} /> Build Custom
            </Link>
          </div>
        </div>
      </motion.div>

    </div>
  );
};