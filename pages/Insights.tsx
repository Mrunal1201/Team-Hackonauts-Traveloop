import React, { useState, useEffect, useRef } from 'react';
import { useTrip } from '../context/TripContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import {
  Flame, Globe, TrendingUp, AlertTriangle, Zap, Navigation, MapPin,
  Activity, Radio, ChevronRight, Clock,
} from 'lucide-react';

const DESTINATIONS = [
  { city: 'Tokyo', country: 'Japan', emoji: '🇯🇵', lat: 35.7, lng: 139.7, heat: 92, days: 3, spend: 1950, crowding: 78 },
  { city: 'Paris', country: 'France', emoji: '🇫🇷', lat: 48.9, lng: 2.3, heat: 85, days: 4, spend: 2100, crowding: 91 },
];

const HEATMAP_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CROWD_DATA = {
  Tokyo: [40, 45, 60, 72, 80, 88, 95, 92, 75, 65, 50, 45],
  Paris: [35, 38, 55, 68, 78, 88, 97, 94, 72, 60, 42, 38],
};

const LIVE_INSIGHTS = [
  { id: 1, type: 'alert', icon: '⚡', text: 'Tokyo Yamanote line: minor delays expected June 12–14', time: '2m ago', urgent: true },
  { id: 2, type: 'tip', icon: '💡', text: 'Paris museum free entry: first Sunday of each month', time: '5m ago', urgent: false },
  { id: 3, type: 'price', icon: '📉', text: 'JFK→NRT fares dropped 12% — cheapest window closes in 3 days', time: '11m ago', urgent: true },
  { id: 4, type: 'weather', icon: '🌧️', text: 'Rain forecast in Paris July 3–5 — schedule indoor visits', time: '18m ago', urgent: false },
  { id: 5, type: 'tip', icon: '🍣', text: 'Tsukiji outer market hours: 6am–2pm (closed Wednesdays)', time: '25m ago', urgent: false },
  { id: 6, type: 'alert', icon: '🔴', text: 'Peak tourist season starts June 15 — expect 40% more crowds', time: '1h ago', urgent: true },
  { id: 7, type: 'tip', icon: '🚇', text: 'Suica card accepted at 95% of Tokyo transit + convenience stores', time: '1h ago', urgent: false },
  { id: 8, type: 'price', icon: '🏨', text: 'Hotel prices in Paris rising — book now to save ~$180 on avg', time: '2h ago', urgent: false },
];

const ANALYTICS_DATA = [
  { subject: 'Budget Health', A: 82 },
  { subject: 'Packing', A: 55 },
  { subject: 'Itinerary', A: 70 },
  { subject: 'Bookings', A: 90 },
  { subject: 'Wellness', A: 75 },
  { subject: 'Flexibility', A: 65 },
];

const MONTHLY_SPEND = [
  { month: 'May', actual: 2150, predicted: 2150 },
  { month: 'Jun', actual: null, predicted: 3200 },
  { month: 'Jul', actual: null, predicted: 4300 },
];

function HeatCell({ value, month, city }: { value: number; month: string; city: string }) {
  const getColor = (v: number) => {
    if (v < 50) return 'bg-emerald-100 text-emerald-700';
    if (v < 70) return 'bg-yellow-100 text-yellow-700';
    if (v < 85) return 'bg-orange-200 text-orange-700';
    return 'bg-red-200 text-red-700';
  };
  return (
    <div
      className={`rounded-lg ${getColor(value)} flex items-center justify-center aspect-square cursor-default group relative`}
      title={`${city} in ${month}: ${value}% crowded`}
    >
      <span className="text-[10px] font-bold">{value}</span>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
        {month}: {value}%
      </div>
    </div>
  );
}

export const Insights: React.FC = () => {
  const { activeTrip } = useTrip();
  const [activeTab, setActiveTab] = useState<'heatmap' | 'analytics' | 'live'>('heatmap');
  const [liveCount, setLiveCount] = useState(LIVE_INSIGHTS);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Simulate new insights arriving
  useEffect(() => {
    const interval = setInterval(() => {
      const newInsight = {
        id: Date.now(),
        type: 'tip',
        icon: ['🌍', '💰', '🗺️', '✈️'][Math.floor(Math.random() * 4)],
        text: [
          'AI model updated travel risk scores for your route',
          'Currency exchange rates favorable for JPY conversion',
          'New direct route announced: NRT → CDG starting June 2026',
          'Travel advisory: pack light rain jacket for both destinations',
        ][Math.floor(Math.random() * 4)],
        time: 'just now',
        urgent: false,
      };
      setLiveCount(prev => [newInsight, ...prev.slice(0, 9)]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  if (!activeTrip) return null;

  const TABS = [
    { id: 'heatmap', label: 'Heatmap', icon: Flame },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'live', label: 'Live Feed', icon: Radio },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h2 className="text-sm font-semibold text-[#2A4D3A]/60 uppercase tracking-wider mb-1">AI-Powered</h2>
          <h1 className="text-3xl font-bold text-[#2A4D3A]">Travel Insights</h1>
          <p className="text-slate-500 mt-1">Real-time intelligence for your Asia-Europe Loop.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">Live · 8 alerts</span>
        </div>
      </motion.div>

      {/* Destination Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DESTINATIONS.map((dest, i) => (
          <motion.div
            key={dest.city}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{dest.emoji}</span>
                  <div>
                    <h3 className="font-bold text-[#2A4D3A] text-lg">{dest.city}</h3>
                    <p className="text-slate-500 text-sm">{dest.country} · {dest.days} days planned</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-1">Crowd Index</div>
                  <div className={`text-lg font-bold ${dest.crowding > 85 ? 'text-red-500' : 'text-[#F5B041]'}`}>
                    {dest.crowding}%
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FDFBF7] rounded-xl p-3 text-center">
                  <Flame size={16} className="text-orange-500 mx-auto mb-1" />
                  <div className="font-bold text-sm text-slate-800">{dest.heat}/100</div>
                  <div className="text-[10px] text-slate-500">Heat Index</div>
                </div>
                <div className="bg-[#FDFBF7] rounded-xl p-3 text-center">
                  <TrendingUp size={16} className="text-[#2A4D3A] mx-auto mb-1" />
                  <div className="font-bold text-sm text-slate-800">${dest.spend.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">Est. Spend</div>
                </div>
                <div className="bg-[#FDFBF7] rounded-xl p-3 text-center">
                  <Navigation size={16} className="text-[#F5B041] mx-auto mb-1" />
                  <div className="font-bold text-sm text-slate-800">{dest.days * 3}</div>
                  <div className="text-[10px] text-slate-500">Activities</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === id ? 'text-[#2A4D3A]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
              {activeTab === id && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5B041]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* HEATMAP TAB */}
            {activeTab === 'heatmap' && (
              <motion.div key="heatmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#2A4D3A]">Monthly Crowd Heatmap</h3>
                    <p className="text-slate-500 text-sm">Best months to visit each destination (lower = better)</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-100 inline-block" />Quiet</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-yellow-100 inline-block" />Busy</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-200 inline-block" />Packed</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {DESTINATIONS.map(dest => (
                    <div key={dest.city}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{dest.emoji}</span>
                        <span className="font-semibold text-slate-700 text-sm">{dest.city}</span>
                        {/* Trip indicator */}
                        <div className="flex items-center gap-1 bg-[#F5B041]/15 px-2 py-0.5 rounded-full">
                          <Clock size={11} className="text-[#F5B041]" />
                          <span className="text-[10px] text-[#F5B041] font-bold">Your trip: Jun–Jul</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-1">
                        {HEATMAP_MONTHS.map((month, mi) => (
                          <div key={month} className="space-y-1">
                            <HeatCell
                              value={CROWD_DATA[dest.city as keyof typeof CROWD_DATA][mi]}
                              month={month}
                              city={dest.city}
                            />
                            <div className="text-[8px] text-center text-slate-400 font-medium">{month.slice(0, 1)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Route Map Visual */}
                <div className="mt-8 bg-gradient-to-br from-[#2A4D3A]/5 to-[#F5B041]/5 rounded-2xl p-5 border border-[#2A4D3A]/10">
                  <h4 className="font-bold text-[#2A4D3A] mb-4 flex items-center gap-2">
                    <Globe size={18} /> Auto Route Optimization
                  </h4>
                  <div className="flex items-center justify-between gap-2 overflow-x-auto">
                    {[
                      { emoji: '🇺🇸', city: 'New York', code: 'JFK', type: 'Origin' },
                      { emoji: '→', city: '', code: '', type: '' },
                      { emoji: '🇯🇵', city: 'Tokyo', code: 'NRT', type: 'Stop 1' },
                      { emoji: '→', city: '', code: '', type: '' },
                      { emoji: '🇫🇷', city: 'Paris', code: 'CDG', type: 'Stop 2' },
                      { emoji: '→', city: '', code: '', type: '' },
                      { emoji: '🇺🇸', city: 'New York', code: 'JFK', type: 'Return' },
                    ].map((stop, i) => (
                      stop.emoji === '→' ? (
                        <div key={i} className="text-[#F5B041] font-bold text-xl flex-shrink-0">→</div>
                      ) : (
                        <div key={i} className="flex flex-col items-center flex-shrink-0">
                          <span className="text-2xl mb-1">{stop.emoji}</span>
                          <span className="font-bold text-[#2A4D3A] text-xs">{stop.code}</span>
                          <span className="text-slate-500 text-[10px]">{stop.type}</span>
                        </div>
                      )
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                    <Zap size={16} className="text-emerald-500 flex-shrink-0" />
                    <span>Route optimized! Current path saves <strong>2h 15min</strong> vs. alternative via Dubai direct.</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <h3 className="font-bold text-[#2A4D3A]">Trip Readiness Radar</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={ANALYTICS_DATA}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Trip Score"
                        dataKey="A"
                        stroke="#2A4D3A"
                        fill="#2A4D3A"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-bold text-[#2A4D3A] mb-4">Spend by Destination</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DESTINATIONS} barSize={36}>
                        <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis hide />
                        <Tooltip formatter={(v) => `$${v}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                        <Bar dataKey="spend" radius={[8, 8, 0, 0]} fill="#2A4D3A" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#2A4D3A] mb-4">Smart Budget Projection</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Start', actual: 0, predicted: 0, budget: 5000 },
                        { name: 'Week 2', actual: 800, predicted: 850, budget: 5000 },
                        { name: 'Week 4', actual: 2150, predicted: 2200, budget: 5000 },
                        { name: 'Week 5', actual: null, predicted: 2900, budget: 5000 },
                        { name: 'Week 6', actual: null, predicted: 3600, budget: 5000 },
                        { name: 'End', actual: null, predicted: 4300, budget: 5000 },
                      ]}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis hide />
                        <Tooltip formatter={(v) => v ? `$${v}` : 'N/A'} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                        <Area type="monotone" dataKey="budget" stroke="#e2e8f0" fill="#f8fafc" strokeWidth={1.5} strokeDasharray="4 4" />
                        <Area type="monotone" dataKey="predicted" stroke="#F5B041" fill="#F5B041" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 3" />
                        <Area type="monotone" dataKey="actual" stroke="#2A4D3A" fill="#2A4D3A" fillOpacity={0.15} strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-[#2A4D3A] inline-block rounded" />Actual</span>
                    <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-[#F5B041] inline-block rounded border-dashed" />AI Predicted</span>
                    <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-slate-300 inline-block rounded" />Budget Limit</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LIVE FEED TAB */}
            {activeTab === 'live' && (
              <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#2A4D3A]">Real-Time Travel Intelligence</h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    LIVE
                  </div>
                </div>
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  <AnimatePresence>
                    {liveCount.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex gap-3 p-4 rounded-2xl border transition-all ${
                          item.urgent
                            ? 'bg-red-50 border-red-100'
                            : 'bg-[#FDFBF7] border-slate-100'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${item.urgent ? 'text-red-800 font-medium' : 'text-slate-700'}`}>
                            {item.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={11} className="text-slate-400" />
                            <span className="text-[11px] text-slate-400">{item.time}</span>
                            {item.urgent && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                                <AlertTriangle size={10} /> Action needed
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 flex-shrink-0 self-center" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
