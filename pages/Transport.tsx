import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Train, Bus, Plane, Car, CreditCard, Clock, DollarSign, ArrowRight,
  Zap, MapPin, Navigation, Info, ChevronRight, Wifi, Star,
} from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap';

type City = 'tokyo' | 'paris';
type TransportTab = 'metro' | 'bus' | 'airport' | 'taxi' | 'passes';

// ── Data ──────────────────────────────────────────────────────────────────────
const METRO_LINES = {
  tokyo: [
    { name: 'Yamanote Line', code: 'JY', color: '#22C55E', stations: ['Shinjuku', 'Shibuya', 'Osaki', 'Tamachi', 'Shinagawa', 'Tokyo', 'Akihabara', 'Ueno', 'Ikebukuro'], freq: '2-3 min', fare: '¥140-200', hours: '4:30am-1am', tip: 'Circular line — covers all major hubs' },
    { name: 'Ginza Line', code: 'G', color: '#F5B041', stations: ['Shibuya', 'Omote-sando', 'Ginza', 'Nihombashi', 'Kyobashi', 'Asakusa'], freq: '3-4 min', fare: '¥170-220', hours: '5:00am-12:30am', tip: 'Tokyo\'s oldest line — great for sightseeing' },
    { name: 'Chiyoda Line', code: 'C', color: '#22D3EE', stations: ['Yoyogi-uehara', 'Meiji-jingumae', 'Otemachi', 'Nishi-nippori', 'Kita-senju'], freq: '3-5 min', fare: '¥180-230', hours: '5:00am-1am', tip: 'Best for Imperial Palace area' },
    { name: 'Toei Oedo Line', code: 'E', color: '#DB2777', stations: ['Shinjuku-nishi', 'Tochomae', 'Roppongi', 'Tsukishima', 'Ryogoku'], freq: '4-5 min', fare: '¥180-320', hours: '5:00am-12:30am', tip: 'Connects Roppongi & Shinjuku fast' },
  ],
  paris: [
    { name: 'Line 1 (Yellow)', code: '1', color: '#F5B041', stations: ['La Défense', 'Charles de Gaulle-Étoile', 'Champs-Élysées', 'Concorde', 'Louvre-Rivoli', 'Châtelet', 'Nation'], freq: '2-3 min', fare: '€2.15', hours: '5:30am-1:15am', tip: 'Covers all major tourist spots — best single line' },
    { name: 'Line 4 (Purple)', code: '4', color: '#7C3AED', stations: ['Porte de Clignancourt', 'Gare du Nord', 'Les Halles', 'Cité', 'Saint-Germain', 'Montrouge'], freq: '3-4 min', fare: '€2.15', hours: '5:30am-1:15am', tip: 'Essential for north-south travel through center' },
    { name: 'RER A', code: 'A', color: '#EF4444', stations: ['CDG Airport', 'Gare du Nord', 'Châtelet', 'Gare de Lyon', 'Vincennes'], freq: '8-12 min', fare: '€11.80', hours: '5:00am-1am', tip: 'Fastest from CDG airport to city center' },
    { name: 'Line 6 (Green)', code: '6', color: '#22C55E', stations: ['Charles de Gaulle-Étoile', 'Trocadéro', 'Bir-Hakeim', 'Montparnasse', 'Nation'], freq: '4-5 min', fare: '€2.15', hours: '5:30am-1:15am', tip: 'Eiffel Tower views above ground!' },
  ],
};

const AIRPORT_TRANSFERS = {
  tokyo: [
    { name: 'Narita Express (NEX)', icon: '🚄', duration: '53 min', cost: '¥3,070', from: 'Narita (NRT)', to: 'Tokyo Station', highlight: true, tip: 'Most reliable, no luggage hassle' },
    { name: 'Limousine Bus', icon: '🚌', duration: '90-120 min', cost: '¥3,200', from: 'Narita (NRT)', to: 'Multiple Hotels', highlight: false, tip: 'Door-to-door, good for heavy luggage' },
    { name: 'Keisei Skyliner', icon: '🚅', duration: '41 min', cost: '¥2,570', from: 'Narita (NRT)', to: 'Ueno / Nippori', highlight: false, tip: 'Fastest to Ueno area' },
    { name: 'Keikyu Line', icon: '🚆', duration: '36 min', cost: '¥660', from: 'Haneda (HND)', to: 'Shinagawa', highlight: false, tip: 'Budget pick from Haneda — very convenient' },
    { name: 'Airport Taxi', icon: '🚕', duration: '60-90 min', cost: '¥25,000+', from: 'Narita (NRT)', to: 'Central Tokyo', highlight: false, tip: 'Premium, traffic risk, book in advance' },
  ],
  paris: [
    { name: 'CDG Express (RER B)', icon: '🚄', duration: '35-50 min', cost: '€11.80', from: 'CDG Airport', to: 'Paris North', highlight: true, tip: 'Cheapest, reliable, runs every 10-15 min' },
    { name: 'Le Bus Direct', icon: '🚌', duration: '45-75 min', cost: '€21', from: 'CDG Airport', to: 'Eiffel/Opéra', highlight: false, tip: 'Good for heavy luggage, no metro stress' },
    { name: 'Paris Shuttles', icon: '🚐', duration: '60-90 min', cost: '€23', from: 'CDG Airport', to: 'Hotel Door', highlight: false, tip: 'Shared shuttle — book 24h ahead' },
    { name: 'Official Taxi', icon: '🚕', duration: '40-60 min', cost: '€53 (fixed)', from: 'CDG Airport', to: 'Any Paris Hotel', highlight: false, tip: 'Fixed rate from CDG — safe choice' },
    { name: 'Uber/Bolt', icon: '📱', duration: '45-70 min', cost: '€40-60', from: 'CDG Airport', to: 'Any Address', highlight: false, tip: 'Convenient but surge pricing possible' },
  ],
};

const PASSES = {
  tokyo: [
    { name: 'Suica IC Card', price: '¥2,000 (¥500 deposit)', duration: 'Rechargeable', coverage: '95% of Tokyo transit + convenience stores', recommended: true, color: '#22C55E' },
    { name: '24h Tokyo Metro', price: '¥600', duration: '24 hours', coverage: 'All 9 Tokyo Metro lines', recommended: false, color: '#3B82F6' },
    { name: '48h Tokyo Metro', price: '¥850', duration: '48 hours', coverage: 'All 9 Tokyo Metro lines', recommended: true, color: '#3B82F6' },
    { name: '72h Tokyo Metro', price: '¥1,200', duration: '72 hours', coverage: 'All 9 Tokyo Metro lines', recommended: false, color: '#3B82F6' },
    { name: 'JR Tokyo Wide Pass', price: '¥15,000', duration: '3 days', coverage: 'All JR trains + Shinkansen in Kanto area', recommended: false, color: '#F5B041' },
  ],
  paris: [
    { name: 'Navigo Easy Card', price: '€2 card fee', duration: 'Rechargeable', coverage: 'Load single tickets or packs (zones 1-5)', recommended: true, color: '#7C3AED' },
    { name: 'Navigo Day Pass', price: '€8.65/day', duration: '1 day', coverage: 'Unlimited metro + RER + bus (zones 1-3)', recommended: false, color: '#EC4899' },
    { name: 'Navigo Week Pass', price: '€30.75/week', duration: 'Mon–Sun', coverage: 'Unlimited all zones — best for 5+ days', recommended: true, color: '#EC4899' },
    { name: 'Paris Visite 3-Day', price: '€40.60', duration: '3 days', coverage: 'Tourist pass with museum discounts', recommended: false, color: '#F97316' },
    { name: 'Book of 10 tickets', price: '€17.35', duration: 'No expiry', coverage: '10 single tickets, any metro line', recommended: false, color: '#22C55E' },
  ],
};

const TAXI_SERVICES = {
  tokyo: [
    { name: 'GO (タクシーGO)', type: 'App', rating: 4.7, basefare: '¥500', perKm: '¥80-100', wait: '3-8 min', available: true, highlight: true },
    { name: 'Uber Japan', type: 'App', rating: 4.5, basefare: '¥520', perKm: '¥85-110', wait: '5-12 min', available: true, highlight: false },
    { name: 'Didi Japan', type: 'App', rating: 4.4, basefare: '¥500', perKm: '¥80-95', wait: '4-10 min', available: true, highlight: false },
    { name: 'Street Taxi', type: 'Street hail', rating: 4.8, basefare: '¥420', perKm: '¥80/237m', wait: '1-5 min', available: true, highlight: false },
  ],
  paris: [
    { name: 'G7 Taxi', type: 'App/Phone', rating: 4.8, basefare: '€4.18', perKm: '€1.12-1.48', wait: '5-10 min', available: true, highlight: true },
    { name: 'Uber', type: 'App', rating: 4.5, basefare: '€2.40', perKm: '€1.05-1.65', wait: '3-8 min', available: true, highlight: false },
    { name: 'Bolt', type: 'App', rating: 4.3, basefare: '€1.99', perKm: '€0.95-1.45', wait: '4-9 min', available: true, highlight: false },
    { name: 'Marcel VTC', type: 'App', rating: 4.9, basefare: '€5', perKm: '€1.50', wait: '8-15 min', available: true, highlight: false },
  ],
};

const AI_TRANSPORT_TIPS = {
  tokyo: [
    '🚇 Metro is 60% cheaper than taxis for most routes.',
    '🎫 48-hour Tokyo Metro pass pays off if you make 3+ rides/day.',
    '🕐 Last Yamanote trains at ~11:50 PM — taxi costs spike after midnight.',
    '📱 Download "Japan Official Travel App" for real-time route planning.',
    '🚦 Avoid rush hour (7:30–9:30 AM & 5:30–7:30 PM) on metro.',
  ],
  paris: [
    '🚇 RER B from CDG is €11.80 — taxi is €53. Same arrival time in off-peak.',
    '🎫 Navigo week pass (€30.75) beats buying individual tickets after 15 rides.',
    '🕐 Last metro around 1:15 AM (until 2 AM on weekends).',
    '🚲 Vélib\' bike-sharing is excellent for Seine riverbank rides (€8/day).',
    '⚡ Electric scooters (Lime, Bird) are great for short trips under 3km.',
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────
export const Transport: React.FC = () => {
  const [city, setCity] = useState<City>('tokyo');
  const [tab, setTab] = useState<TransportTab>('metro');
  const [activeLine, setActiveLine] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [routeResult, setRouteResult] = useState<null | { duration: string; cost: string; transfers: number; tip: string }>(null);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(i => (i + 1) % AI_TRANSPORT_TIPS[city].length);
    }, 5000);
    return () => clearInterval(interval);
  }, [city]);

  const handleRoute = () => {
    if (from && to) {
      setRouteResult({
        duration: city === 'tokyo' ? '28 min' : '19 min',
        cost: city === 'tokyo' ? '¥240' : '€2.15',
        transfers: 1,
        tip: city === 'tokyo' ? 'Take Yamanote → transfer to Ginza at Shibuya' : 'Line 1 direct, no transfer needed',
      });
    }
  };

  const tabs: { id: TransportTab; label: string; icon: typeof Train }[] = [
    { id: 'metro', label: 'Metro', icon: Train },
    { id: 'bus', label: 'Bus', icon: Bus },
    { id: 'airport', label: 'Airport', icon: Plane },
    { id: 'taxi', label: 'Cab', icon: Car },
    { id: 'passes', label: 'Passes', icon: CreditCard },
  ];

  const lines = METRO_LINES[city];
  const currentLine = lines[activeLine];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-sm font-semibold text-[#2A4D3A]/60 uppercase tracking-wider mb-1">Smart Navigation</h2>
        <h1 className="text-3xl font-bold text-[#2A4D3A]">Local Transport</h1>
        <p className="text-slate-500 mt-1">AI-powered city navigation for Tokyo & Paris.</p>
      </motion.div>

      {/* City Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
          {(['tokyo', 'paris'] as City[]).map(c => (
            <button
              key={c}
              onClick={() => { setCity(c); setActiveLine(0); setRouteResult(null); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                city === c
                  ? 'bg-[#2A4D3A] text-white shadow-md'
                  : 'text-slate-500 hover:text-[#2A4D3A]'
              }`}
            >
              {c === 'tokyo' ? '🇯🇵 Tokyo' : '🇫🇷 Paris'}
            </button>
          ))}
        </div>
        {/* Live status */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">All systems operational</span>
        </div>
      </div>

      {/* AI Tip Ticker */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tipIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gradient-to-r from-[#2A4D3A] to-[#1a3328] rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg"
        >
          <div className="p-1.5 bg-[#F5B041] rounded-lg flex-shrink-0">
            <Zap size={16} className="text-[#2A4D3A]" />
          </div>
          <p className="text-white text-sm font-medium">{AI_TRANSPORT_TIPS[city][tipIndex]}</p>
        </motion.div>
      </AnimatePresence>

      {/* Interactive Map */}
      <InteractiveMap city={city} filterType="transport" showFilters={false} height="h-56" />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Train, label: 'Metro Lines', value: city === 'tokyo' ? '13 Lines' : '16 Lines', color: 'text-[#2A4D3A] bg-[#2A4D3A]/10' },
          { icon: Clock, label: 'Avg Frequency', value: city === 'tokyo' ? '3 min' : '4 min', color: 'text-[#F5B041] bg-[#F5B041]/10' },
          { icon: DollarSign, label: 'Min Fare', value: city === 'tokyo' ? '¥140' : '€2.15', color: 'text-emerald-600 bg-emerald-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon size={20} />
            </div>
            <p className="text-slate-500 text-xs mb-0.5">{stat.label}</p>
            <p className="font-bold text-[#2A4D3A]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Transport Type Tabs */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold transition-colors relative min-w-[80px] ${
                tab === id ? 'text-[#2A4D3A]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
              {tab === id && (
                <motion.div layoutId="transport-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5B041]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* METRO TAB */}
            {tab === 'metro' && (
              <motion.div key="metro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Route finder */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <h3 className="font-bold text-[#2A4D3A] mb-3 flex items-center gap-2">
                    <Navigation size={18} className="text-[#F5B041]" /> Route Planner
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={from}
                      onChange={e => setFrom(e.target.value)}
                      placeholder={city === 'tokyo' ? 'From: e.g. Shinjuku' : 'From: e.g. Châtelet'}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2A4D3A]/40"
                    />
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#2A4D3A] transition-colors">
                      <ArrowRight size={16} />
                    </button>
                    <input
                      value={to}
                      onChange={e => setTo(e.target.value)}
                      placeholder={city === 'tokyo' ? 'To: e.g. Asakusa' : 'To: e.g. Eiffel Tower'}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2A4D3A]/40"
                    />
                    <button
                      onClick={handleRoute}
                      className="px-4 py-2.5 bg-[#2A4D3A] text-white rounded-xl font-bold text-sm hover:bg-[#1f382a] transition-colors"
                    >
                      Go
                    </button>
                  </div>
                  <AnimatePresence>
                    {routeResult && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white border border-[#F5B041]/30 rounded-xl p-4 flex gap-4">
                        {[
                          { label: 'Duration', value: routeResult.duration, icon: Clock },
                          { label: 'Cost', value: routeResult.cost, icon: DollarSign },
                          { label: 'Transfers', value: `${routeResult.transfers}x`, icon: ArrowRight },
                        ].map(({ label, value, icon: Icon }) => (
                          <div key={label} className="flex-1 text-center">
                            <Icon size={16} className="text-[#F5B041] mx-auto mb-1" />
                            <div className="font-bold text-[#2A4D3A]">{value}</div>
                            <div className="text-xs text-slate-400">{label}</div>
                          </div>
                        ))}
                        <div className="flex-[2] text-sm text-slate-600 border-l border-slate-100 pl-4 flex items-center">
                          💡 {routeResult.tip}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Metro Lines */}
                <div>
                  <h3 className="font-bold text-[#2A4D3A] mb-3">Metro Lines</h3>
                  <div className="space-y-3">
                    {lines.map((line, i) => (
                      <motion.div
                        key={line.code}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => setActiveLine(i)}
                        className={`rounded-2xl border cursor-pointer transition-all ${
                          activeLine === i
                            ? 'border-transparent shadow-md'
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                        }`}
                        style={activeLine === i ? { backgroundColor: `${line.color}15`, borderColor: `${line.color}40` } : {}}
                      >
                        {/* Line header */}
                        <div className="flex items-center gap-3 p-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-md"
                            style={{ backgroundColor: line.color }}
                          >
                            {line.code}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800">{line.name}</h4>
                            <div className="flex gap-3 text-xs text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1"><Clock size={10} /> {line.freq}</span>
                              <span className="flex items-center gap-1"><DollarSign size={10} /> {line.fare}</span>
                            </div>
                          </div>
                          <ChevronRight size={16} className={`text-slate-300 transition-transform ${activeLine === i ? 'rotate-90' : ''}`} />
                        </div>

                        {/* Expanded: animated line + stations */}
                        <AnimatePresence>
                          {activeLine === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4">
                                {/* Animated train track */}
                                <div className="relative h-8 mb-3 overflow-hidden rounded-full" style={{ backgroundColor: `${line.color}20` }}>
                                  {/* Track line */}
                                  <div className="absolute top-1/2 left-2 right-2 h-1 rounded-full -translate-y-1/2" style={{ backgroundColor: line.color, opacity: 0.4 }} />
                                  {/* Animated train */}
                                  <div
                                    className="absolute top-1/2 -translate-y-1/2 w-8 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg animate-train"
                                    style={{ backgroundColor: line.color }}
                                  >
                                    🚇
                                  </div>
                                  {/* Station dots */}
                                  {line.stations.slice(0, 6).map((_, si) => (
                                    <div
                                      key={si}
                                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full border-2 shadow-sm"
                                      style={{ left: `${12 + si * (76 / Math.min(line.stations.length - 1, 5))}%`, borderColor: line.color }}
                                    />
                                  ))}
                                </div>

                                {/* Stations list */}
                                <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
                                  {line.stations.map((station, si) => (
                                    <div key={station} className="flex items-center gap-1 flex-shrink-0">
                                      <div className="flex flex-col items-center">
                                        <div className="w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: line.color }} />
                                        <span className="text-[9px] text-slate-500 mt-1 text-center max-w-[50px] leading-tight">{station}</span>
                                      </div>
                                      {si < line.stations.length - 1 && (
                                        <div className="w-4 h-0.5 mb-3" style={{ backgroundColor: line.color }} />
                                      )}
                                    </div>
                                  ))}
                                </div>

                                <div className="flex gap-3 mt-3">
                                  <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-1.5 text-xs border border-slate-100">
                                    <Clock size={12} className="text-slate-400" />
                                    <span className="text-slate-600">{line.hours}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 bg-[#F5B041]/10 rounded-lg px-3 py-1.5 text-xs border border-[#F5B041]/20">
                                    <Info size={12} className="text-[#F5B041]" />
                                    <span className="text-slate-600">{line.tip}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* BUS TAB */}
            {tab === 'bus' && (
              <motion.div key="bus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(city === 'tokyo' ? [
                    { route: 'Toei Bus', number: 'RH01', from: 'Shinjuku', to: 'Roppongi', duration: '25 min', fare: '¥210', freq: '10 min', color: '#3B82F6' },
                    { route: 'Toei Bus', number: 'T01', from: 'Shibuya', to: 'Tachikawa', duration: '60 min', fare: '¥220', freq: '15 min', color: '#22C55E' },
                    { route: 'Tokyo Bus', number: 'A50', from: 'Tokyo Sta.', to: 'Akihabara', duration: '12 min', fare: '¥210', freq: '8 min', color: '#F97316' },
                    { route: 'Night Bus', number: 'N12', from: 'Shinjuku', to: 'Multiple', duration: 'varies', fare: '¥210', freq: 'Every 30 min', color: '#7C3AED' },
                  ] : [
                    { route: 'RATP Bus', number: '29', from: 'Gare de Lyon', to: 'Opéra', duration: '28 min', fare: '€2.15', freq: '8 min', color: '#3B82F6' },
                    { route: 'RATP Bus', number: '63', from: 'Eiffel Tower', to: 'Latin Quarter', duration: '35 min', fare: '€2.15', freq: '10 min', color: '#22C55E' },
                    { route: 'Night Bus', number: 'N01', from: 'Châtelet', to: 'Suburbs', duration: 'varies', fare: '€2.15', freq: 'Every hour', color: '#7C3AED' },
                    { route: 'Airport Bus', number: 'B2', from: 'CDG', to: 'Gare de l\'Est', duration: '75 min', fare: '€21', freq: '15 min', color: '#F97316' },
                  ]).map((bus, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-md transition-all hover:border-slate-200 group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: bus.color }}>
                          {bus.number}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{bus.route}</h4>
                          <p className="text-xs text-slate-400">{bus.freq} frequency</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{bus.from}</span>
                        <ArrowRight size={12} className="text-slate-300 flex-shrink-0" />
                        <span className="text-sm font-medium text-[#2A4D3A]">{bus.to}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-xs bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
                          <Clock size={11} className="text-slate-400" /> {bus.duration}
                        </span>
                        <span className="flex items-center gap-1 text-xs bg-[#F5B041]/10 border border-[#F5B041]/20 rounded-lg px-2 py-1 text-[#2A4D3A] font-semibold">
                          <DollarSign size={11} /> {bus.fare}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                  <Bus size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-700 text-sm">AI Tip: Bus vs Metro</p>
                    <p className="text-blue-600 text-sm mt-1">
                      {city === 'tokyo'
                        ? 'Buses in Tokyo run less frequently but cover more surface streets. Ideal for when metro is congested. Night buses are essential after 1 AM.'
                        : 'Paris buses are slower than metro but give above-ground city views. Line 29 is a tourist favorite passing major landmarks.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AIRPORT TAB */}
            {tab === 'airport' && (
              <motion.div key="airport" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <h3 className="font-bold text-[#2A4D3A] mb-4 flex items-center gap-2">
                  <Plane size={18} className="text-[#F5B041]" />
                  {city === 'tokyo' ? 'Narita (NRT) & Haneda (HND) Transfers' : 'CDG Airport Transfers'}
                </h3>
                {AIRPORT_TRANSFERS[city].map((option, i) => (
                  <motion.div
                    key={option.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-2xl p-4 border flex items-center gap-4 transition-all hover:shadow-md ${
                      option.highlight
                        ? 'bg-[#2A4D3A]/5 border-[#2A4D3A]/20'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-3xl flex-shrink-0">{option.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800">{option.name}</h4>
                        {option.highlight && (
                          <span className="text-[10px] bg-[#F5B041] text-[#2A4D3A] px-2 py-0.5 rounded-full font-bold">RECOMMENDED</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {option.from} → {option.to}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 italic">💡 {option.tip}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-[#2A4D3A]">{option.cost}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                        <Clock size={10} /> {option.duration}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* TAXI TAB */}
            {tab === 'taxi' && (
              <motion.div key="taxi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="font-bold text-[#2A4D3A] mb-4 flex items-center gap-2">
                  <Car size={18} className="text-[#F5B041]" /> Cab & Ride Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TAXI_SERVICES[city].map((service, i) => (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`rounded-2xl p-5 border hover:shadow-lg transition-all relative overflow-hidden ${
                        service.highlight ? 'border-[#F5B041]/40 bg-[#F5B041]/5' : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      {service.highlight && (
                        <div className="absolute top-3 right-3">
                          <Star size={14} className="text-[#F5B041] fill-[#F5B041]" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-[#2A4D3A]/10 flex items-center justify-center">
                          <Car size={22} className="text-[#2A4D3A]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{service.name}</h4>
                          <div className="flex items-center gap-1">
                            <Star size={11} className="text-[#F5B041] fill-[#F5B041]" />
                            <span className="text-xs text-slate-500">{service.rating} · {service.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-50 rounded-xl p-2">
                          <div className="text-xs text-slate-400">Base</div>
                          <div className="font-bold text-slate-700 text-sm">{service.basefare}</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2">
                          <div className="text-xs text-slate-400">Per km</div>
                          <div className="font-bold text-slate-700 text-sm">{service.perKm}</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-2">
                          <div className="text-xs text-emerald-500">Wait</div>
                          <div className="font-bold text-emerald-700 text-sm">{service.wait}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                  <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-700 text-sm">
                    <strong>AI Insight:</strong> {city === 'tokyo'
                      ? 'Metro is 60-80% cheaper than taxis in Tokyo. Use taxis only after midnight or for groups of 4+ where cost per person equals metro.'
                      : 'Paris taxis have fixed rates from airports. For city rides, Uber and Bolt are typically 20% cheaper than G7. Avoid taxis on Bastille Day.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* PASSES TAB */}
            {tab === 'passes' && (
              <motion.div key="passes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="font-bold text-[#2A4D3A] mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#F5B041]" /> Transport Passes & Cards
                </h3>
                <div className="space-y-3">
                  {PASSES[city].map((pass, i) => (
                    <motion.div
                      key={pass.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`rounded-2xl p-4 border flex items-start gap-4 hover:shadow-md transition-all ${
                        pass.recommended ? 'bg-[#2A4D3A]/5 border-[#2A4D3A]/20' : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className="w-4 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: pass.color }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800">{pass.name}</h4>
                          {pass.recommended && (
                            <span className="text-[10px] bg-[#F5B041] text-[#2A4D3A] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <Zap size={9} /> AI PICK
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mb-1">{pass.coverage}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs flex items-center gap-1 text-slate-400"><Clock size={10} /> {pass.duration}</span>
                          <span className="font-bold text-[#2A4D3A]">{pass.price}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
