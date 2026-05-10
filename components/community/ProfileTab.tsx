import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Edit3, Settings, Globe, Award, Camera, Heart,
  TrendingUp, Star, Share2, CheckCheck,
} from 'lucide-react';
import { BADGES, MEMORY_CARDS, TRAVELERS, IMG } from './communityData';

const ME = TRAVELERS[0]; // "You" = Arya Sharma for demo

// ── Stat box ──────────────────────────────────────────────────────────────
const Stat = ({ value, label, color = '#2A4D3A' }: { value: string | number; label: string; color?: string }) => (
  <div className="flex flex-col items-center gap-0.5">
    <span className="font-black text-xl" style={{ color }}>{value}</span>
    <span className="text-slate-500 text-[10px] font-semibold text-center leading-tight">{label}</span>
  </div>
);

// ── Badge card ────────────────────────────────────────────────────────────
const BadgeCard = ({ badge }: { badge: typeof BADGES[0] }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    className={`rounded-2xl p-3 text-center border transition-all ${
      badge.earned
        ? 'bg-white border-slate-100 shadow-sm'
        : 'bg-slate-50 border-dashed border-slate-200 opacity-50'
    }`}
  >
    <div
      className="w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center text-2xl shadow-sm"
      style={{ background: badge.earned ? badge.color + '20' : '#f1f5f9' }}
    >
      {badge.icon}
    </div>
    <p className="text-[10px] font-bold text-slate-700 leading-tight">{badge.label}</p>
    <p className="text-[9px] text-slate-400 mt-0.5">{badge.desc}</p>
    {badge.earned && (
      <div className="mt-1.5 flex items-center justify-center gap-0.5">
        <CheckCheck size={9} className="text-emerald-500" />
        <span className="text-[9px] text-emerald-600 font-semibold">Earned</span>
      </div>
    )}
  </motion.div>
);

// ── Mini trip card for grid ───────────────────────────────────────────────
const GridCard = ({ m, onClick }: { m: typeof MEMORY_CARDS[0]; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="relative rounded-2xl overflow-hidden aspect-square"
  >
    <img src={m.coverImage} alt={m.destination} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    <div className="absolute bottom-2 left-2 right-2">
      <p className="text-white font-bold text-xs truncate">{m.destination} {m.flag}</p>
      <p className="text-white/60 text-[9px]">{m.duration}</p>
    </div>
    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
      <Star size={8} className="text-[#F5B041]" fill="#F5B041" />
      <span className="text-white text-[9px] font-bold">{m.rating}</span>
    </div>
  </motion.button>
);

// ── Visited countries dots map (world regions) ────────────────────────────
const WORLD_REGIONS = [
  // North America
  { x: 15, y: 30, w: 20, h: 28, name: 'North America', visited: true, color: '#2A4D3A' },
  // South America
  { x: 22, y: 60, w: 13, h: 24, name: 'South America', visited: true, color: '#2A4D3A' },
  // Europe
  { x: 44, y: 22, w: 12, h: 14, name: 'Europe', visited: true, color: '#2A4D3A' },
  // Africa
  { x: 44, y: 38, w: 14, h: 26, name: 'Africa', visited: true, color: '#2A4D3A' },
  // Asia
  { x: 56, y: 18, w: 30, h: 26, name: 'Asia', visited: true, color: '#2A4D3A' },
  // Australia
  { x: 72, y: 60, w: 12, h: 10, name: 'Australia', visited: false, color: '#2A4D3A' },
];

const WorldDotMap = () => {
  const cols = 80, rows = 38;
  // Rough continent mask — 1 = land, 0 = sea
  const land = (c: number, r: number) => {
    if (c >= 8 && c <= 25 && r >= 8 && r <= 26) return 'na';
    if (c >= 18 && c <= 28 && r >= 26 && r <= 36) return 'sa';
    if (c >= 42 && c <= 53 && r >= 8 && r <= 19) return 'eu';
    if (c >= 43 && c <= 57 && r >= 19 && r <= 36) return 'af';
    if (c >= 54 && c <= 78 && r >= 7 && r <= 28) return 'as';
    if (c >= 68 && c <= 77 && r >= 28 && r <= 34) return 'au';
    return null;
  };
  const visited = ['na','sa','eu','af','as'];

  return (
    <div className="w-full" style={{ paddingBottom: '47%', position: 'relative' }}>
      <svg viewBox="0 0 320 152" className="absolute inset-0 w-full h-full">
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const region = land(c, r);
            if (!region) return null;
            const isVisited = visited.includes(region);
            return (
              <circle
                key={`${c}-${r}`}
                cx={c * 4 + 2}
                cy={r * 4 + 2}
                r={1.3}
                fill={isVisited ? '#2A4D3A' : '#d1fae5'}
                opacity={isVisited ? 0.9 : 0.6}
              />
            );
          })
        )}
        {/* Visit pins */}
        {[
          { cx: 212, cy: 80, label: '🇯🇵' },
          { cx: 200, cy: 112, label: '🇮🇩' },
          { cx: 132, cy: 52, label: '🇬🇷' },
          { cx: 120, cy: 60, label: '🇲🇦' },
          { cx: 105, cy: 28, label: '🇮🇸' },
          { cx: 72, cy: 120, label: '🇦🇷' },
          { cx: 187, cy: 64, label: '🇳🇵' },
        ].map((p, i) => (
          <g key={i}>
            <circle cx={p.cx} cy={p.cy} r={4} fill="#F5B041" opacity={0.9} />
            <circle cx={p.cx} cy={p.cy} r={7} fill="#F5B041" opacity={0.2} />
          </g>
        ))}
      </svg>
    </div>
  );
};

// ── Main Profile ──────────────────────────────────────────────────────────
export const ProfileTab: React.FC = () => {
  const [activeView, setActiveView] = useState<'grid' | 'badges' | 'map'>('grid');
  const [selectedMemory, setSelectedMemory] = useState<typeof MEMORY_CARDS[0] | null>(null);

  return (
    <div className="space-y-4">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
      >
        {/* Cover */}
        <div className="relative h-32 bg-gradient-to-br from-[#2A4D3A] via-[#1a3328] to-[#0f1f14] overflow-hidden">
          <img src={IMG.nepal} alt="cover" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <button className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-black/50 transition-colors">
            <Camera size={12} /> Edit Cover
          </button>
          {/* Travel style badge */}
          <div className="absolute bottom-3 left-4 bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {ME.style} · {ME.countries} Countries
          </div>
        </div>

        {/* Avatar + info */}
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-7 mb-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center font-black text-white text-xl"
                style={{ background: ME.color }}
              >
                {ME.initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2A4D3A] rounded-full flex items-center justify-center border-2 border-white">
                <CheckCheck size={9} className="text-[#F5B041]" />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5">
                <Share2 size={13} /> Share
              </button>
              <button className="bg-[#2A4D3A] hover:bg-[#1f3d2d] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5">
                <Edit3 size={13} /> Edit Profile
              </button>
            </div>
          </div>

          <h2 className="font-black text-slate-800 text-lg">{ME.name}</h2>
          <p className="text-slate-400 text-xs mb-1">{ME.handle}</p>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">{ME.bio}</p>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 py-3 border-y border-slate-100 mb-3">
            <Stat value={ME.trips} label="Trips" />
            <Stat value={ME.countries} label="Countries" color="#F5B041" />
            <Stat value="127k" label="km Traveled" color="#6C63FF" />
            <Stat value={(ME.followers / 1000).toFixed(1) + 'k'} label="Followers" color="#E84393" />
          </div>

          {/* Travel interests */}
          <div className="flex flex-wrap gap-2">
            {['🏔️ Mountains', '🍜 Street Food', '📸 Photography', '🎒 Backpacking', '🌊 Beaches'].map(tag => (
              <span key={tag} className="text-xs bg-[#2A4D3A]/8 text-[#2A4D3A] font-semibold px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab switcher */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 flex gap-1">
        {[
          { key: 'grid',   label: '📷 Trips', icon: Camera },
          { key: 'badges', label: '🏅 Badges', icon: Award },
          { key: 'map',    label: '🗺️ Map',   icon: Globe },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveView(key as 'grid' | 'badges' | 'map')}
            className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all ${
              activeView === key
                ? 'bg-[#2A4D3A] text-white shadow-sm'
                : 'text-slate-500 hover:text-[#2A4D3A]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid view */}
      <AnimatePresence mode="wait">
        {activeView === 'grid' && (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-3 gap-2">
              {MEMORY_CARDS.map(m => (
                <GridCard key={m.id} m={m} onClick={() => setSelectedMemory(m)} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Badges view */}
        {activeView === 'badges' && (
          <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="bg-gradient-to-r from-[#F5B041]/20 to-[#F5B041]/5 border border-[#F5B041]/30 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="font-bold text-slate-800">Explorer Rank: Gold</p>
                <p className="text-xs text-slate-500">6 badges earned · 2 to unlock</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-black text-2xl text-[#F5B041]">2,847</p>
                <p className="text-[10px] text-slate-400">Adventure Points</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BADGES.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <BadgeCard badge={b} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Map view */}
        {activeView === 'map' && (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-bold">Your Travel Map</p>
                  <p className="text-white/50 text-xs">{ME.countries} countries · {ME.trips} trips · 5 continents</p>
                </div>
                <div className="flex gap-3 text-[10px]">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#2A4D3A]" /><span className="text-white/60">Visited</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#F5B041]" /><span className="text-white/60">Pinned</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-200" /><span className="text-white/60">Unvisited</span></div>
                </div>
              </div>
              <WorldDotMap />
              {/* Countries grid */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {[
                  { flag: '🇮🇩', name: 'Indonesia' }, { flag: '🇯🇵', name: 'Japan' }, { flag: '🇬🇷', name: 'Greece' },
                  { flag: '🇲🇦', name: 'Morocco' }, { flag: '🇮🇸', name: 'Iceland' }, { flag: '🇲🇻', name: 'Maldives' },
                  { flag: '🇳🇵', name: 'Nepal' }, { flag: '🇦🇷', name: 'Argentina' }, { flag: '🇵🇪', name: 'Peru' },
                  { flag: '🇿🇦', name: 'South Africa' }, { flag: '🇹🇭', name: 'Thailand' }, { flag: '🇻🇳', name: 'Vietnam' },
                ].map(c => (
                  <span key={c.name} className="flex items-center gap-1 bg-white/10 text-white/80 text-[10px] px-2 py-1 rounded-full">
                    {c.flag} {c.name}
                  </span>
                ))}
                <span className="flex items-center gap-1 bg-[#F5B041]/20 text-[#F5B041] text-[10px] px-2 py-1 rounded-full font-semibold">
                  +22 more
                </span>
              </div>
            </div>

            {/* Bucket list */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 mt-3">
              <div className="flex items-center gap-2 mb-4">
                <Heart size={16} className="text-red-400" fill="#f87171" />
                <h3 className="font-bold text-slate-800">Bucket List</h3>
                <span className="ml-auto text-xs text-slate-400">12 destinations</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: 'Amalfi Coast, Italy', flag: '🇮🇹', priority: 'High' },
                  { name: 'Petra, Jordan', flag: '🇯🇴', priority: 'High' },
                  { name: 'Faroe Islands', flag: '🇫🇴', priority: 'Medium' },
                  { name: 'Angkor Wat, Cambodia', flag: '🇰🇭', priority: 'Medium' },
                  { name: 'Havana, Cuba', flag: '🇨🇺', priority: 'Low' },
                ].map((d, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                    <span className="text-xl">{d.flag}</span>
                    <span className="flex-1 text-sm font-medium text-slate-700">{d.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.priority === 'High' ? 'bg-red-100 text-red-600' :
                      d.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>{d.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto"
            >
              <div className="relative h-52 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
                <img src={selectedMemory.coverImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button onClick={() => setSelectedMemory(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white">✕</button>
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-black text-xl">{selectedMemory.destination} {selectedMemory.flag}</p>
                  <p className="text-white/70 text-xs">{selectedMemory.dates}</p>
                </div>
                <div className="absolute top-4 left-4 bg-[#F5B041] text-[#2A4D3A] text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={11} fill="currentColor" /> {selectedMemory.rating}
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[{ l: 'Duration', v: selectedMemory.duration }, { l: 'Budget', v: `$${selectedMemory.budget}` }, { l: 'Mood', v: selectedMemory.mood }].map(s => (
                    <div key={s.l} className="bg-slate-50 rounded-2xl p-3 text-center">
                      <p className="font-bold text-slate-800 text-sm">{s.v}</p>
                      <p className="text-slate-400 text-[10px]">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">✨ AI Trip Summary</p>
                  <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedMemory.aiSummary}"</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">📍 Places Visited</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMemory.visited.map(v => (
                      <span key={v} className="text-xs bg-[#2A4D3A]/8 text-[#2A4D3A] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                        <MapPin size={9} /> {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">⭐ Highlights</p>
                  <div className="space-y-1.5">
                    {selectedMemory.highlights.map(h => (
                      <div key={h} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="w-4 h-4 bg-[#F5B041]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <TrendingUp size={8} className="text-[#F5B041]" />
                        </span>
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
