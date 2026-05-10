import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Rss, Compass, User, BookOpen, Map, Globe, Users, Sparkles,
} from 'lucide-react';
import { FeedTab }      from '../components/community/FeedTab';
import { DiscoverTab }  from '../components/community/DiscoverTab';
import { ProfileTab }   from '../components/community/ProfileTab';
import { MemoriesTab }  from '../components/community/MemoriesTab';
import { MapTab }       from '../components/community/MapTab';

// ── Tab config ────────────────────────────────────────────────────────────
const TABS = [
  { key: 'feed',      label: 'Feed',     icon: Rss,      badge: '5'  },
  { key: 'discover',  label: 'Discover', icon: Compass,  badge: null },
  { key: 'profile',   label: 'Profile',  icon: User,     badge: null },
  { key: 'memories',  label: 'Memories', icon: BookOpen, badge: '6'  },
  { key: 'map',       label: 'Map',      icon: Map,      badge: null },
];

type TabKey = 'feed' | 'discover' | 'profile' | 'memories' | 'map';

export const Community: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('feed');

  return (
    <div className="space-y-5">
      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#2A4D3A] via-[#1d3829] to-[#0f1f14] rounded-3xl overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#F5B041]/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-[#6C63FF]/10 blur-3xl" />
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative px-5 py-6">
          {/* Top strip */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#F5B041]/20 flex items-center justify-center">
                <Globe size={18} className="text-[#F5B041]" />
              </div>
              <div>
                <h1 className="text-white font-black text-lg leading-none">Traveloop Community</h1>
                <p className="text-white/50 text-[10px] mt-0.5">Social Travel Network · 480k Travelers</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-400/30 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-[10px] font-bold">Live</span>
            </div>
          </div>

          {/* Platform tagline */}
          <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-sm">
            Share stories, discover travelers, build memories — the world is your social network. 🌍
          </p>

          {/* Quick network stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { emoji: '✈️', value: '2.1M',   label: 'Stories'    },
              { emoji: '🌍', value: '148',     label: 'Countries'  },
              { emoji: '👥', value: '480k',   label: 'Travelers'  },
              { emoji: '📍', value: '94k',    label: 'Memories'   },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl py-2.5 px-2 text-center border border-white/10">
                <span className="text-base">{s.emoji}</span>
                <p className="text-white font-black text-sm mt-0.5">{s.value}</p>
                <p className="text-white/40 text-[9px]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Featured active travelers */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
            <div className="flex -space-x-2">
              {['#E84393','#6C63FF','#F5A623','#2ECC71','#FF6B6B'].map((color, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-[#2A4D3A] flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: color }}
                >
                  {['AS','YC','SR','AH','PN'][i]}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-xs">
              <span className="text-white font-semibold">12 travelers</span> from your network are active now
            </p>
            <div className="ml-auto">
              <Sparkles size={14} className="text-[#F5B041] animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Tab Navigation ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5 flex gap-1 sticky top-2 z-20">
        {TABS.map(({ key, label, icon: Icon, badge }) => (
          <button
            key={key}
            onClick={() => setTab(key as TabKey)}
            className={`relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
              tab === key
                ? 'bg-[#2A4D3A] text-white shadow-md'
                : 'text-slate-400 hover:text-[#2A4D3A] hover:bg-[#2A4D3A]/5'
            }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-[9px]">{label}</span>
            {badge && (
              <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-black flex items-center justify-center ${
                tab === key ? 'bg-[#F5B041] text-[#2A4D3A]' : 'bg-red-500 text-white'
              }`}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'feed'     && <FeedTab />}
          {tab === 'discover' && <DiscoverTab />}
          {tab === 'profile'  && <ProfileTab />}
          {tab === 'memories' && <MemoriesTab />}
          {tab === 'map'      && <MapTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};