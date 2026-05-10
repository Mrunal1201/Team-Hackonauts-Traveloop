import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Grid3X3, List, Calendar, Wallet,
  MapPin, Clock, Star, MoreVertical, Edit3, Trash2, Copy,
  Share2, ExternalLink, ChevronRight, Plane, SlidersHorizontal,
  CheckCircle, Zap, Sparkles,
} from 'lucide-react';
import { Link } from 'react-router';
import { type Trip, type TripStatus } from '../data/tripsData';
import { useTrips } from '../context/TripsContext';

type ViewMode = 'grid' | 'list' | 'timeline';

const STATUS_STYLE: Record<TripStatus, { bg: string; text: string; dot: string; label: string }> = {
  Active:    { bg: 'bg-emerald-100',     text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Active'    },
  Upcoming:  { bg: 'bg-[#2A4D3A]/10',   text: 'text-[#2A4D3A]',  dot: 'bg-[#2A4D3A]',  label: 'Upcoming'  },
  Draft:     { bg: 'bg-slate-100',       text: 'text-slate-500',   dot: 'bg-slate-400',   label: 'Draft'     },
  Completed: { bg: 'bg-[#F5B041]/15',   text: 'text-amber-700',   dot: 'bg-[#F5B041]',   label: 'Completed' },
};

const FILTER_STATUSES: (TripStatus | 'All')[] = ['All', 'Active', 'Upcoming', 'Draft', 'Completed'];

// ── Trip card (grid) ────────────────────────────────────────────────────────
const TripCard = ({ trip }: { trip: Trip }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const s = STATUS_STYLE[trip.status];
  const pct = Math.round((trip.spent / trip.budget) * 100) || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group relative"
    >
      {/* Cover */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={trip.cover}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${trip.status === 'Active' ? 'animate-pulse' : ''}`} />
            {s.label}
          </span>
        </div>

        {/* AI badge */}
        {(trip as any).aiGenerated && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <span className="flex items-center gap-1 text-[9px] font-black bg-[#F5B041] text-[#2A4D3A] px-2 py-0.5 rounded-full shadow">
              <Sparkles size={8} /> AI
            </span>
          </div>
        )}

        {/* More menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={(e) => { e.preventDefault(); setMenuOpen(p => !p); }}
              className="w-8 h-8 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
            >
              <MoreVertical size={15} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-full mt-1 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-20"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {[
                    { icon: Edit3,      label: 'Edit',      color: 'text-slate-600' },
                    { icon: Copy,       label: 'Duplicate', color: 'text-slate-600' },
                    { icon: Share2,     label: 'Share',     color: 'text-slate-600' },
                    { icon: Trash2,     label: 'Delete',    color: 'text-red-500'   },
                  ].map(({ icon: Icon, label, color }) => (
                    <button key={label}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm ${color} hover:bg-slate-50 transition-colors text-left`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Rating */}
        {trip.rating && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
            <Star size={10} fill="#F5B041" stroke="#F5B041" />
            <span className="text-white text-[10px] font-bold">{trip.rating}</span>
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-3 left-3">
          <h3 className="text-white font-black text-base leading-tight">{trip.title}</h3>
          <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
            <MapPin size={9} /> {trip.destination}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={11} className="text-[#2A4D3A]" />
            <span>{trip.days}d</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={11} className="text-[#2A4D3A]" />
            <span>{trip.cities.length} cities</span>
          </div>
          <div className="flex items-center gap-1">
            <Wallet size={11} className="text-[#2A4D3A]" />
            <span>${(trip.budget / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* Budget bar */}
        {trip.spent > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Budget used</span>
              <span className={pct > 90 ? 'text-red-500 font-bold' : 'text-[#2A4D3A] font-bold'}>{pct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-red-400' : 'bg-gradient-to-r from-[#2A4D3A] to-[#F5B041]'}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Date range */}
        <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
          <Clock size={10} /> {trip.startDate} → {trip.endDate}
        </p>

        {/* Open button */}
        <Link
          to={`/trips/${trip.id}`}
          className="flex items-center justify-center gap-2 w-full bg-[#2A4D3A] hover:bg-[#1f3d2d] text-white text-xs font-bold py-2.5 rounded-xl transition-colors group/btn"
        >
          Open Workspace <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

// ── Trip row (list) ──────────────────────────────────────────────────────────
const TripRow = ({ trip }: { trip: Trip }) => {
  const s = STATUS_STYLE[trip.status];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow group"
    >
      <img src={trip.cover} alt={trip.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-slate-800 text-sm truncate">{trip.title}</h3>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${s.bg} ${s.text}`}>{s.label}</span>
        </div>
        <p className="text-slate-400 text-xs flex items-center gap-1 truncate">
          <MapPin size={10} /> {trip.destination}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-xs text-slate-500 flex-shrink-0">
        <div className="text-center">
          <p className="font-bold text-slate-700">{trip.days}d</p>
          <p className="text-slate-400">Days</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-[#2A4D3A]">${trip.budget.toLocaleString()}</p>
          <p className="text-slate-400">Budget</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-700">{trip.startDate}</p>
          <p className="text-slate-400">Start</p>
        </div>
      </div>
      <Link
        to={`/trips/${trip.id}`}
        className="flex-shrink-0 flex items-center gap-1.5 bg-[#2A4D3A] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#1f3d2d] transition-colors"
      >
        Open <ExternalLink size={12} />
      </Link>
    </motion.div>
  );
};

// ── Timeline view ────────────────────────────────────────────────────────────
const TripTimeline = ({ trips }: { trips: Trip[] }) => (
  <div className="relative">
    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
    <div className="space-y-4">
      {trips.map((trip, i) => {
        const s = STATUS_STYLE[trip.status];
        return (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="relative flex items-start gap-5 pl-14"
          >
            <div className={`absolute left-4 w-4 h-4 rounded-full border-2 border-white shadow-md flex-shrink-0 ${s.dot}`}
              style={{ top: 18 }}
            />
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
              <img src={trip.cover} alt={trip.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm">{trip.title}</p>
                <p className="text-slate-400 text-xs">{trip.startDate} → {trip.endDate}</p>
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
              <Link to={`/trips/${trip.id}`}
                className="text-[#2A4D3A] hover:text-[#1f3d2d] flex-shrink-0"
              ><ChevronRight size={18} /></Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

// ── Main component ───────────────────────────────────────────────────────────
export const MyTrips: React.FC = () => {
  const { trips, removeTrip } = useTrips();
  const [view, setView]           = useState<ViewMode>('grid');
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState<TripStatus | 'All'>('All');
  const [sortBy, setSortBy]       = useState<'newest' | 'budget' | 'duration'>('newest');
  const [filterOpen, setFilter]   = useState(false);

  const filtered = useMemo(() => {
    let list = [...trips];
    if (statusFilter !== 'All') list = list.filter(t => t.status === statusFilter);
    if (search) list = list.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'budget')   list.sort((a, b) => b.budget - a.budget);
    if (sortBy === 'duration') list.sort((a, b) => b.days - a.days);
    return list;
  }, [trips, search, statusFilter, sortBy]);

  const counts = useMemo(() => ({
    all:       trips.length,
    active:    trips.filter(t => t.status === 'Active').length,
    upcoming:  trips.filter(t => t.status === 'Upcoming').length,
    completed: trips.filter(t => t.status === 'Completed').length,
  }), [trips]);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Trips</h1>
          <p className="text-slate-500 mt-1">{counts.all} trips · {counts.active} active · {counts.upcoming} upcoming</p>
        </div>
        <Link
          to="/plan"
          className="inline-flex items-center gap-2 bg-[#2A4D3A] hover:bg-[#1f3d2d] text-white text-sm font-bold px-5 py-3 rounded-2xl transition-colors shadow-md flex-shrink-0"
        >
          <Plus size={17} /> Plan New Trip
        </Link>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Trips',   value: counts.all,       icon: Plane,       color: 'text-[#2A4D3A]', bg: 'bg-[#2A4D3A]/8'   },
          { label: 'Active',        value: counts.active,    icon: Zap,         color: 'text-emerald-600', bg: 'bg-emerald-50'   },
          { label: 'Upcoming',      value: counts.upcoming,  icon: Calendar,    color: 'text-blue-600',   bg: 'bg-blue-50'       },
          { label: 'Completed',     value: counts.completed, icon: CheckCircle, color: 'text-[#F5B041]',  bg: 'bg-[#F5B041]/10' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
          >
            <div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mb-2`}>
              <s.icon size={15} className={s.color} />
            </div>
            <p className={`font-black text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-xs">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trips, destinations…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A4D3A]/40 focus:shadow-sm transition-all"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <button
            onClick={() => setFilter(p => !p)}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 hover:border-[#2A4D3A]/40 transition-colors"
          >
            <SlidersHorizontal size={15} /> Filter
          </button>
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-20"
                onMouseLeave={() => setFilter(false)}
              >
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Sort by</p>
                {[['newest','Newest First'],['budget','Highest Budget'],['duration','Longest Trip']].map(([k,l]) => (
                  <button key={k} onClick={() => { setSortBy(k as typeof sortBy); setFilter(false); }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm transition-colors text-left ${sortBy === k ? 'bg-[#2A4D3A]/8 text-[#2A4D3A] font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {sortBy === k && <Check size={13} />} {l}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View toggle */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1">
          {([['grid', Grid3X3], ['list', List], ['timeline', Calendar]] as const).map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`w-9 h-8 rounded-lg flex items-center justify-center transition-all ${
                view === v ? 'bg-[#2A4D3A] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Status filter pills ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FILTER_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              statusFilter === s
                ? 'bg-[#2A4D3A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2A4D3A]/40'
            }`}
          >
            {s === 'All' ? `All (${counts.all})` : s}
          </button>
        ))}
      </div>

      {/* ── Trip list ── */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-16 h-16 bg-[#2A4D3A]/8 rounded-3xl flex items-center justify-center mb-4">
            <Plane size={28} className="text-[#2A4D3A]/40" />
          </div>
          <p className="font-bold text-slate-600">No trips found</p>
          <p className="text-slate-400 text-sm mt-1 mb-4">Try adjusting your search or filter</p>
          <Link to="/plan" className="text-[#2A4D3A] font-bold text-sm hover:underline">Plan a new trip →</Link>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'grid' && (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map(trip => <TripCard key={trip.id} trip={trip} />)}
            </motion.div>
          )}
          {view === 'list' && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filtered.map(trip => <TripRow key={trip.id} trip={trip} />)}
            </motion.div>
          )}
          {view === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TripTimeline trips={filtered} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── AI nudge banner ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative bg-gradient-to-r from-[#2A4D3A] to-[#1B4332] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-[#F5B041]/10 blur-3xl" />
        <div className="w-10 h-10 rounded-2xl bg-[#F5B041]/20 flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} className="text-[#F5B041]" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold">Let AI plan your next trip</p>
          <p className="text-white/50 text-sm">Get a complete itinerary, budget breakdown & packing list in seconds.</p>
        </div>
        <Link
          to="/plan/ai"
          className="flex-shrink-0 flex items-center gap-2 bg-[#F5B041] text-[#2A4D3A] font-black text-sm px-5 py-2.5 rounded-xl hover:bg-[#e5a030] transition-colors"
        >
          Try AI Generator <Sparkles size={14} />
        </Link>
      </motion.div>
    </div>
  );
};

function Check({ size, className }: { size: number; className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>;
}