import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  UserPlus, Check, Users, TrendingUp, Globe, Flame, Hash,
  MapPin, ChevronRight, Sparkles,
} from 'lucide-react';
import {
  TRAVELERS, TRENDING_DESTINATIONS, COMMUNITIES, TRENDING_TAGS,
} from './communityData';

const Avatar = ({ t, size = 48 }: { t: typeof TRAVELERS[0]; size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
    style={{ width: size, height: size, background: t.color, fontSize: size * 0.32 }}
  >
    {t.initials}
  </div>
);

// ── Traveler card ─────────────────────────────────────────────────────────
const TravelerCard = ({ traveler }: { traveler: typeof TRAVELERS[0] }) => {
  const [followed, setFollowed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3"
    >
      {/* AI Match badge */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1.5 bg-[#2A4D3A]/8 rounded-full px-2.5 py-1">
          <Sparkles size={10} className="text-[#2A4D3A]" />
          <span className="text-[10px] font-bold text-[#2A4D3A]">{traveler.compatibility}% match</span>
        </div>
        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-200 animate-pulse" />
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar t={traveler} size={52} />
          {traveler.verified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#2A4D3A] rounded-full flex items-center justify-center">
              <Check size={8} className="text-[#F5B041]" strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-sm truncate">{traveler.name}</p>
          <p className="text-slate-400 text-xs">{traveler.handle}</p>
          <p className="text-[#2A4D3A] text-[10px] font-semibold mt-0.5">{traveler.style}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">{traveler.bio}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Countries', value: traveler.countries },
          { label: 'Followers', value: traveler.followers >= 1000 ? `${(traveler.followers/1000).toFixed(1)}k` : traveler.followers },
          { label: 'Trips', value: traveler.trips },
        ].map(s => (
          <div key={s.label} className="bg-slate-50 rounded-xl py-2 text-center">
            <p className="font-bold text-slate-800 text-sm">{s.value}</p>
            <p className="text-slate-400 text-[9px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="flex gap-1.5 flex-wrap">
        {traveler.badges.slice(0, 2).map(b => (
          <span key={b} className="text-[10px] bg-[#F5B041]/15 text-[#2A4D3A] px-2 py-0.5 rounded-full font-semibold">{b}</span>
        ))}
        {traveler.badges.length > 2 && (
          <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">+{traveler.badges.length - 2}</span>
        )}
      </div>

      {/* Mutual friends + CTA */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-slate-400">
          {traveler.mutualFriends} mutual friends · Planning: {traveler.dest}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setFollowed(p => !p)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-2xl transition-all ${
            followed
              ? 'bg-slate-100 text-slate-600'
              : 'bg-[#2A4D3A] text-white hover:bg-[#1f3d2d] shadow-sm'
          }`}
        >
          {followed ? <><Check size={13} /> Following</> : <><UserPlus size={13} /> Follow</>}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ── Trending destination card ──────────────────────────────────────────────
const DestCard = ({ d, delay }: { d: typeof TRENDING_DESTINATIONS[0]; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    className="relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 w-36 h-44"
  >
    <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div className="absolute top-2 right-2 bg-emerald-400/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
      <TrendingUp size={8} /> {d.trend}
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-2.5">
      <p className="text-white font-bold text-xs leading-tight">{d.name}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <Flame size={9} className="text-[#F5B041]" />
        <span className="text-white/70 text-[9px]">{d.posts} posts</span>
      </div>
    </div>
  </motion.div>
);

// ── Main Discover ─────────────────────────────────────────────────────────
export const DiscoverTab: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Solo', 'Budget', 'Luxury', 'Culture', 'Adventure'];

  const filtered = filter === 'All'
    ? TRAVELERS
    : TRAVELERS.filter(t => t.style.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* AI Recommendation banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#2A4D3A] to-[#1a3328] rounded-3xl p-5 text-white overflow-hidden relative"
      >
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-10 w-28 h-28 rounded-full bg-[#F5B041]/10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-[#F5B041]" />
            <span className="text-xs font-bold text-[#F5B041] uppercase tracking-wider">AI Networking</span>
          </div>
          <h3 className="font-bold text-lg leading-tight mb-1">6 travelers match your profile</h3>
          <p className="text-white/60 text-xs mb-4">Based on your travel style, budget range, and upcoming destinations</p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {TRAVELERS.slice(0, 4).map(t => (
                <div key={t.id} className="w-7 h-7 rounded-full border-2 border-[#2A4D3A] flex items-center justify-center text-[9px] font-bold text-white" style={{ background: t.color }}>
                  {t.initials}
                </div>
              ))}
            </div>
            <span className="text-white/70 text-xs">+2 more</span>
            <button className="ml-auto bg-[#F5B041] text-[#2A4D3A] font-bold text-xs px-4 py-2 rounded-2xl hover:bg-[#e5a030] transition-colors">
              View All
            </button>
          </div>
        </div>
      </motion.div>

      {/* Trending destinations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-[#F5B041]" />
            <h3 className="font-bold text-slate-800">Trending Now</h3>
          </div>
          <button className="text-xs text-[#2A4D3A] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See all <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {TRENDING_DESTINATIONS.map((d, i) => <DestCard key={d.name} d={d} delay={i * 0.06} />)}
        </div>
      </div>

      {/* Filter travelers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-[#2A4D3A]" />
          <h3 className="font-bold text-slate-800">Recommended Travelers</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-2xl border transition-all ${
                filter === f
                  ? 'bg-[#2A4D3A] text-white border-[#2A4D3A]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-[#2A4D3A]/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}>
              <TravelerCard traveler={t} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Communities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-[#2A4D3A]" />
            <h3 className="font-bold text-slate-800">Travel Communities</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COMMUNITIES.map((c, i) => (
            <motion.button
              key={c.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-slate-100 rounded-2xl p-4 text-left hover:border-[#2A4D3A]/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{c.icon}</span>
                {c.active && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              </div>
              <p className="font-semibold text-slate-800 text-xs mb-1 leading-tight">{c.name}</p>
              <p className="text-slate-400 text-[10px]">{(c.members / 1000).toFixed(1)}k members</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Trending Hashtags */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Hash size={16} className="text-[#2A4D3A]" />
          <h3 className="font-bold text-slate-800">Trending Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_TAGS.map((tag, i) => (
            <motion.button
              key={tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="text-xs bg-white border border-slate-200 text-slate-600 hover:bg-[#2A4D3A] hover:text-white hover:border-[#2A4D3A] rounded-full px-3 py-1.5 font-medium transition-all"
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};