import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Camera, Star, Globe, Heart, Navigation } from 'lucide-react';
import { VISITED_PLACES, WISHLIST } from './communityData';

type Place = typeof VISITED_PLACES[0];

// ── Dot world map background ──────────────────────────────────────────────
// A grid of dots shaped into approximate continent outlines
const DOT_COLS = 100, DOT_ROWS = 48;

function getLandType(c: number, r: number): string | null {
  // North America
  if (c >= 8 && c <= 30 && r >= 6 && r <= 30) {
    if (c >= 8  && r >= 6  && c <= 22 && r <= 15) return 'na';
    if (c >= 10 && r >= 15 && c <= 28 && r <= 28) return 'na';
    if (c >= 13 && r >= 28 && c <= 22 && r <= 30) return 'na';
  }
  // Central America
  if (c >= 18 && c <= 23 && r >= 30 && r <= 35) return 'na';
  // South America
  if (c >= 22 && c <= 34 && r >= 33 && r <= 46) {
    if (c >= 24 && r >= 33 && c <= 34 && r <= 40) return 'sa';
    if (c >= 22 && r >= 40 && c <= 30 && r <= 46) return 'sa';
  }
  // Europe
  if (c >= 44 && c <= 58 && r >= 6 && r <= 20) {
    if (c >= 44 && r >= 6 && c <= 58 && r <= 16) return 'eu';
    if (c >= 44 && r >= 16 && c <= 52 && r <= 20) return 'eu';
  }
  // Africa
  if (c >= 44 && c <= 60 && r >= 20 && r <= 44) {
    if (c >= 44 && r >= 20 && c <= 60 && r <= 30) return 'af';
    if (c >= 45 && r >= 30 && c <= 58 && r <= 40) return 'af';
    if (c >= 46 && r >= 40 && c <= 55 && r <= 44) return 'af';
  }
  // Middle East / Arabian Peninsula
  if (c >= 56 && c <= 65 && r >= 20 && r <= 30) return 'me';
  // Asia - main block
  if (c >= 58 && c <= 90 && r >= 6 && r <= 32) {
    if (c >= 58 && r >= 6  && c <= 90 && r <= 18) return 'as';
    if (c >= 60 && r >= 18 && c <= 88 && r <= 26) return 'as';
    if (c >= 62 && r >= 26 && c <= 82 && r <= 30) return 'as';
    if (c >= 64 && r >= 30 && c <= 76 && r <= 34) return 'as';
  }
  // Southeast Asia (simplified)
  if (c >= 74 && c <= 82 && r >= 32 && r <= 38) return 'sea';
  // Japan
  if (c >= 84 && c <= 88 && r >= 14 && r <= 22) return 'jp';
  // Australia
  if (c >= 74 && c <= 88 && r >= 36 && r <= 44) {
    if (c >= 74 && r >= 36 && c <= 88 && r <= 42) return 'au';
    if (c >= 76 && r >= 42 && c <= 86 && r <= 44) return 'au';
  }
  // New Zealand
  if (c >= 90 && c <= 93 && r >= 40 && r <= 44) return 'nz';
  // Greenland
  if (c >= 30 && c <= 38 && r >= 2 && r <= 12) return 'gl';
  // UK / Ireland
  if (c >= 41 && c <= 44 && r >= 8 && r <= 14) return 'eu';
  // Scandinavia
  if (c >= 46 && c <= 54 && r >= 2 && r <= 10) return 'eu';

  return null;
}

// Visited regions based on our data
const VISITED_REGIONS = new Set(['jp', 'sea', 'as', 'af', 'eu', 'sa', 'me']);

const WorldMap = ({
  onPlaceClick,
}: { onPlaceClick: (p: Place) => void }) => {
  const [hovered, setHovered] = useState<Place | null>(null);

  return (
    <div className="relative w-full" style={{ paddingBottom: '52%' }}>
      <svg
        viewBox={`0 0 ${DOT_COLS * 3.2} ${DOT_ROWS * 3.2}`}
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dots */}
        {Array.from({ length: DOT_ROWS }).flatMap((_, r) =>
          Array.from({ length: DOT_COLS }).map((_, c) => {
            const lt = getLandType(c, r);
            if (!lt) return null;
            const visited = VISITED_REGIONS.has(lt);
            return (
              <circle
                key={`${c}-${r}`}
                cx={c * 3.2 + 1.6}
                cy={r * 3.2 + 1.6}
                r={1.1}
                fill={visited ? '#2A4D3A' : '#94a3b8'}
                opacity={visited ? 0.85 : 0.35}
              />
            );
          })
        )}

        {/* Visited place pins */}
        {VISITED_PLACES.map((place) => {
          const cx = (place.x / 100) * (DOT_COLS * 3.2);
          const cy = (place.y / 100) * (DOT_ROWS * 3.2);
          return (
            <g
              key={place.city}
              style={{ cursor: 'pointer' }}
              onClick={() => onPlaceClick(place)}
              onMouseEnter={() => setHovered(place)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Pulse ring */}
              <circle cx={cx} cy={cy} r={6} fill="#F5B041" opacity={0.2}>
                <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r={4} fill="#F5B041" opacity={0.95} />
              <circle cx={cx} cy={cy} r={2} fill="white" opacity={0.9} />
            </g>
          );
        })}

        {/* Wishlist pins */}
        {WISHLIST.map((w) => {
          const cx = (w.x / 100) * (DOT_COLS * 3.2);
          const cy = (w.y / 100) * (DOT_ROWS * 3.2);
          return (
            <g key={w.city}>
              <circle cx={cx} cy={cy} r={3.5} fill="none" stroke="#6C63FF" strokeWidth={1.5} opacity={0.8} strokeDasharray="2 1" />
              <circle cx={cx} cy={cy} r={1.5} fill="#6C63FF" opacity={0.7} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ── Place detail card ─────────────────────────────────────────────────────
const PlaceCard = ({ place, onClose }: { place: Place; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: 20 }}
    className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
  >
    <div className="relative h-32 overflow-hidden">
      <img src={place.image} alt={place.city} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 bg-black/30 rounded-full flex items-center justify-center text-white"
      >
        <X size={14} />
      </button>
      <div className="absolute bottom-3 left-3">
        <p className="text-white font-black text-lg leading-none">{place.city} {place.flag}</p>
        <p className="text-white/70 text-xs">{place.country}</p>
      </div>
    </div>
    <div className="p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Camera size={12} className="text-slate-400" />
          <span>{place.trips} trip{place.trips > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#F5B041]">
          <Star size={11} fill="#F5B041" />
          <span className="font-semibold">Visited</span>
        </div>
      </div>
      <button className="bg-[#2A4D3A] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
        <Camera size={12} /> View Memories
      </button>
    </div>
  </motion.div>
);

// ── Main Map Tab ──────────────────────────────────────────────────────────
export const MapTab: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [view, setView] = useState<'visited' | 'wishlist'>('visited');

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-black text-slate-800 text-xl">Interactive Travel Map</h2>
        <p className="text-slate-500 text-xs mt-0.5">Your personal journey across {VISITED_PLACES.length} destinations</p>
      </motion.div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: '🌍', label: 'Continents', value: '5' },
          { icon: '📍', label: 'Destinations', value: VISITED_PLACES.length },
          { icon: '💜', label: 'Wishlist', value: WISHLIST.length },
          { icon: '✈️', label: 'Countries', value: '34' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-3 text-center shadow-sm">
            <span className="text-base">{s.icon}</span>
            <p className="font-black text-slate-800 text-base mt-0.5">{s.value}</p>
            <p className="text-slate-400 text-[9px] font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Map container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-3xl overflow-hidden shadow-xl relative"
      >
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-bold text-sm">World Map</p>
              <p className="text-white/40 text-[10px]">Click golden pins to explore memories</p>
            </div>
            <div className="flex gap-3 text-[10px]">
              {[
                { color: '#F5B041', label: 'Visited' },
                { color: '#6C63FF', label: 'Wishlist', dashed: true },
                { color: '#2A4D3A', label: 'Region' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full`} style={{ background: l.color }} />
                  <span className="text-white/60">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <WorldMap onPlaceClick={p => setSelectedPlace(selectedPlace?.city === p.city ? null : p)} />
            <AnimatePresence>
              {selectedPlace && (
                <PlaceCard place={selectedPlace} onClose={() => setSelectedPlace(null)} />
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Continent coverage bar */}
        <div className="px-4 py-3 mt-1 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Continent Coverage</p>
            <p className="text-[#F5B041] text-[10px] font-bold">5 of 7</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { name: 'Asia', covered: true }, { name: 'Europe', covered: true },
              { name: 'Africa', covered: true }, { name: 'S. America', covered: true },
              { name: 'N. America', covered: true }, { name: 'Australia', covered: false },
              { name: 'Antarctica', covered: false },
            ].map(c => (
              <span key={c.name} className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${c.covered ? 'bg-[#2A4D3A] text-emerald-300' : 'bg-white/10 text-white/30'}`}>
                {c.covered ? '✓' : '○'} {c.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Visited places list */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {['visited', 'wishlist'].map(v => (
            <button
              key={v}
              onClick={() => setView(v as 'visited' | 'wishlist')}
              className={`flex-1 py-3 text-xs font-bold capitalize transition-colors ${view === v ? 'text-[#2A4D3A] border-b-2 border-[#2A4D3A]' : 'text-slate-400'}`}
            >
              {v === 'visited' ? `📍 Visited (${VISITED_PLACES.length})` : `💜 Wishlist (${WISHLIST.length})`}
            </button>
          ))}
        </div>
        <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
          {view === 'visited' ? (
            VISITED_PLACES.map((p, i) => (
              <motion.button
                key={p.city}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedPlace(p)}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={p.image} alt={p.city} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800 text-sm truncate">{p.city}</span>
                    <span>{p.flag}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{p.country}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#F5B041] font-semibold flex-shrink-0">
                  <Star size={11} fill="#F5B041" />
                  {p.trips} trip{p.trips > 1 ? 's' : ''}
                </div>
              </motion.button>
            ))
          ) : (
            WISHLIST.map((w, i) => (
              <motion.div
                key={w.city}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center text-xl flex-shrink-0">
                  {w.flag}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{w.city}</p>
                  <p className="text-slate-400 text-xs flex items-center gap-1">
                    <Heart size={9} className="text-[#6C63FF]" fill="#6C63FF" /> Bucket list
                  </p>
                </div>
                <button className="text-xs text-[#6C63FF] font-bold bg-[#6C63FF]/10 px-2.5 py-1 rounded-xl hover:bg-[#6C63FF]/20 transition-colors">
                  Plan
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
