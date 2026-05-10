import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star, MapPin, Calendar, Users, Wallet, Sparkles,
  ChevronLeft, ChevronRight, X, Plus, Camera, Heart,
  TrendingUp, Globe,
} from 'lucide-react';
import { MEMORY_CARDS } from './communityData';

// ── Photo carousel ────────────────────────────────────────────────────────
const Carousel = ({ photos }: { photos: string[] }) => {
  const [idx, setIdx] = useState(0);
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={photos[idx]}
          alt=""
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
      {photos.length > 1 && (
        <>
          <button
            onClick={() => setIdx(p => (p - 1 + photos.length) % photos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIdx(p => (p + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {photos.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white scale-125' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Star rating ───────────────────────────────────────────────────────────
const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={12} fill={s <= Math.round(rating) ? '#F5B041' : 'none'} stroke={s <= Math.round(rating) ? '#F5B041' : '#cbd5e1'} />
    ))}
  </div>
);

// ── Full memory card modal ────────────────────────────────────────────────
const MemoryModal = ({ card, onClose }: { card: typeof MEMORY_CARDS[0]; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center sm:p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      onClick={e => e.stopPropagation()}
      className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto"
    >
      {/* Cover */}
      <div className="relative h-64 overflow-hidden rounded-t-3xl">
        <img src={card.coverImage} alt={card.destination} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors">
          <X size={18} />
        </button>
        {/* Mood */}
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm font-semibold">
          {card.mood}
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">{card.flag}</span>
                <div className="bg-[#F5B041] text-[#2A4D3A] text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles size={11} /> AI Memory Card
                </div>
              </div>
              <h2 className="text-white font-black text-2xl leading-tight">{card.destination}</h2>
              <p className="text-white/70 text-sm">{card.country}</p>
            </div>
            <div className="text-right">
              <div className="flex justify-end mb-1"><Stars rating={card.rating} /></div>
              <p className="text-white font-black text-2xl">{card.rating}</p>
              <p className="text-white/50 text-[10px]">/ 5.0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Key info strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Calendar,  label: 'Duration', value: card.duration, color: '#6C63FF' },
            { icon: Wallet,    label: 'Budget',   value: `$${card.budget.toLocaleString()}`, color: '#2ECC71' },
            { icon: Users,     label: 'With',     value: card.companions.length === 1 && card.companions[0] === 'Solo' ? 'Solo' : `${card.companions.length} people`, color: '#E84393' },
            { icon: MapPin,    label: 'Cities',   value: `${card.visited.length} cities`, color: '#F5A623' },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-2xl p-3.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + '20' }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{s.value}</p>
                <p className="text-slate-400 text-[10px]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dates + Companions */}
        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 rounded-2xl px-4 py-3">
          <Calendar size={15} className="text-slate-400" />
          <span>{card.dates}</span>
          {card.companions[0] !== 'Solo' && (
            <>
              <span className="text-slate-300">·</span>
              <Users size={15} className="text-slate-400" />
              <span>{card.companions.join(', ')}</span>
            </>
          )}
        </div>

        {/* Photo carousel */}
        <Carousel photos={card.photos} />

        {/* AI Summary */}
        <div className="bg-gradient-to-br from-[#2A4D3A]/8 to-[#F5B041]/5 rounded-2xl p-4 border border-[#2A4D3A]/10">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles size={14} className="text-[#2A4D3A]" />
            <p className="text-xs font-bold text-[#2A4D3A] uppercase tracking-wider">AI Trip Summary</p>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed italic">"{card.aiSummary}"</p>
        </div>

        {/* Highlights */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">⭐ Best Moments</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {card.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-2xl px-3 py-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#F5B041]/15 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={12} className="text-[#F5B041]" />
                </div>
                <span className="text-sm text-slate-700 font-medium">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Places visited */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📍 Places Explored</p>
          <div className="flex flex-wrap gap-2">
            {card.visited.map(v => (
              <span key={v} className="flex items-center gap-1.5 text-xs bg-[#2A4D3A]/8 text-[#2A4D3A] font-semibold px-3 py-1.5 rounded-full">
                <MapPin size={10} /> {v}
              </span>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5">
          {card.tags.map(t => (
            <span key={t} className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-medium">{t}</span>
          ))}
        </div>

        {/* Share strip */}
        <div className="flex gap-3 pt-1">
          <button className="flex-1 bg-[#2A4D3A] text-white font-bold py-3 rounded-2xl text-sm hover:bg-[#1f3d2d] transition-colors flex items-center justify-center gap-2">
            <Globe size={16} /> Share Memory
          </button>
          <button className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-2xl text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
            <Heart size={16} /> Save
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// ── Memory card preview ───────────────────────────────────────────────────
const MemoryCardPreview = ({ card, onClick }: { card: typeof MEMORY_CARDS[0]; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    onClick={onClick}
    className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer group"
  >
    {/* Cover image */}
    <div className="relative h-44 overflow-hidden">
      <img src={card.coverImage} alt={card.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      {/* Mood + AI badge */}
      <div className="absolute top-3 left-3 flex gap-2">
        <span className="bg-black/30 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">{card.mood}</span>
        <span className="bg-[#F5B041]/90 text-[#2A4D3A] text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <Sparkles size={9} /> AI
        </span>
      </div>
      {/* Rating */}
      <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
        <Star size={11} fill="#F5B041" stroke="#F5B041" />
        <span className="text-white font-bold text-xs">{card.rating}</span>
      </div>
      {/* Destination */}
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-white font-black text-lg leading-tight">{card.destination} {card.flag}</p>
        <p className="text-white/60 text-xs">{card.dates}</p>
      </div>
    </div>

    {/* Card body */}
    <div className="p-4">
      {/* Quick stats */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar size={12} className="text-slate-400" />
          <span>{card.duration}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Wallet size={12} className="text-slate-400" />
          <span>${card.budget.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={12} className="text-slate-400" />
          <span>{card.visited.length} cities</span>
        </div>
      </div>

      {/* Companions */}
      <div className="flex items-center gap-2 mb-3">
        <Users size={12} className="text-slate-400" />
        <span className="text-xs text-slate-500">
          {card.companions[0] === 'Solo' ? 'Solo trip' : `With ${card.companions.slice(0, 2).join(', ')}${card.companions.length > 2 ? ` +${card.companions.length - 2}` : ''}`}
        </span>
      </div>

      {/* AI summary preview */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 italic">
        "{card.aiSummary.slice(0, 110)}…"
      </p>

      {/* Tags */}
      <div className="flex gap-1.5 mt-3 flex-wrap">
        {card.tags.slice(0, 3).map(t => (
          <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>
        ))}
      </div>

      {/* Hover CTA */}
      <div className="mt-3 flex items-center gap-1 text-xs text-[#2A4D3A] font-bold group-hover:gap-2 transition-all">
        <span>Open Memory Card</span>
        <ChevronRight size={13} />
      </div>
    </div>
  </motion.div>
);

// ── Main Memories ─────────────────────────────────────────────────────────
export const MemoriesTab: React.FC = () => {
  const [selected, setSelected] = useState<typeof MEMORY_CARDS[0] | null>(null);
  const [filter, setFilter]     = useState('All');

  const filters = ['All', 'Solo', 'Group', 'Adventure', 'Luxury', 'Budget'];
  const filtered = filter === 'All' ? MEMORY_CARDS
    : filter === 'Solo' ? MEMORY_CARDS.filter(m => m.companions.includes('Solo'))
    : filter === 'Group' ? MEMORY_CARDS.filter(m => !m.companions.includes('Solo'))
    : MEMORY_CARDS.filter(m => m.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-slate-800 text-xl">Memory Cards</h2>
          <p className="text-slate-500 text-xs mt-0.5">{MEMORY_CARDS.length} trips preserved · AI-powered summaries</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-[#2A4D3A] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:bg-[#1f3d2d] transition-colors"
        >
          <Plus size={15} /> New Memory
        </motion.button>
      </motion.div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: '🗺️', label: 'Trips', value: MEMORY_CARDS.length },
          { icon: '⭐', label: 'Avg Rating', value: '4.9' },
          { icon: '💰', label: 'Total Spent', value: '$11.6k' },
          { icon: '📍', label: 'Cities', value: '28' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-3 text-center shadow-sm">
            <span className="text-lg">{s.icon}</span>
            <p className="font-black text-slate-800 text-base mt-0.5">{s.value}</p>
            <p className="text-slate-400 text-[9px] font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-2xl border transition-all ${
              filter === f
                ? 'bg-[#2A4D3A] text-white border-[#2A4D3A]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-[#2A4D3A]/40'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <MemoryCardPreview card={card} onClick={() => setSelected(card)} />
          </motion.div>
        ))}
      </div>

      {/* Create new CTA */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="border-2 border-dashed border-[#2A4D3A]/20 rounded-3xl p-8 text-center cursor-pointer hover:border-[#2A4D3A]/40 hover:bg-[#2A4D3A]/3 transition-all"
      >
        <Camera size={32} className="text-[#2A4D3A]/30 mx-auto mb-3" />
        <p className="font-bold text-slate-500">Create a New Memory Card</p>
        <p className="text-xs text-slate-400 mt-1">Document your next adventure with AI-powered summaries</p>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <MemoryModal card={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
};
