import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine,
} from 'recharts';
import {
  Cloud, Sun, CloudRain, Wind, Droplets, ArrowRightLeft,
  Plane, Users, UserPlus, Crown, Edit3, Eye, TrendingDown, TrendingUp, RefreshCw,
} from 'lucide-react';

// ── Weather Data ──────────────────────────────────────────────────────────────
const WEATHER_DATA = [
  {
    city: 'Tokyo', country: 'Japan', emoji: '🇯🇵',
    img: 'https://images.unsplash.com/photo-1604912364280-4a5f295cd988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMG5pZ2h0JTIwY2l0eXNjYXBlJTIwbmVvbiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzgzODU3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    temp: 29, feelsLike: 33, condition: 'Partly Cloudy', icon: 'cloud',
    humidity: 78, wind: 12, uv: 8, forecast: [
      { day: 'Mon', hi: 30, lo: 24, icon: 'sun' },
      { day: 'Tue', hi: 28, lo: 23, icon: 'cloud' },
      { day: 'Wed', hi: 26, lo: 22, icon: 'rain' },
      { day: 'Thu', hi: 29, lo: 24, icon: 'sun' },
      { day: 'Fri', hi: 31, lo: 25, icon: 'sun' },
    ],
  },
  {
    city: 'Paris', country: 'France', emoji: '🇫🇷',
    img: 'https://images.unsplash.com/photo-1638560597507-6b46ddd1deea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyJTIwc3Vuc2V0JTIwZ29sZGVuJTIwaG91cnxlbnwxfHx8fDE3NzgzODU3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    temp: 22, feelsLike: 21, condition: 'Sunny', icon: 'sun',
    humidity: 55, wind: 8, uv: 6, forecast: [
      { day: 'Mon', hi: 23, lo: 15, icon: 'sun' },
      { day: 'Tue', hi: 24, lo: 16, icon: 'sun' },
      { day: 'Wed', hi: 21, lo: 14, icon: 'cloud' },
      { day: 'Thu', hi: 19, lo: 13, icon: 'rain' },
      { day: 'Fri', hi: 20, lo: 14, icon: 'rain' },
    ],
  },
];

function WeatherIcon({ type, size = 20, className = '' }: { type: string; size?: number; className?: string }) {
  if (type === 'rain') return <CloudRain size={size} className={`text-blue-400 ${className}`} />;
  if (type === 'cloud') return <Cloud size={size} className={`text-slate-400 ${className}`} />;
  return <Sun size={size} className={`text-[#F5B041] ${className}`} />;
}

// ── Currency Data ─────────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: 1 },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', rate: 149.5 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: 0.79 },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭', rate: 35.2 },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', rate: 1.35 },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.55 },
];

// ── Flight Price Data ─────────────────────────────────────────────────────────
const FLIGHT_PRICE_DATA = [
  { date: 'May 5', price: 1380 },
  { date: 'May 8', price: 1240 },
  { date: 'May 12', price: 1420 },
  { date: 'May 15', price: 1180 },
  { date: 'May 19', price: 1350 },
  { date: 'May 22', price: 1290 },
  { date: 'May 26', price: 1420 },
  { date: 'May 29', price: 1560 },
  { date: 'Jun 2', price: 1680 },
  { date: 'Jun 5', price: 1720 },
  { date: 'Jun 9', price: 1850 },
  { date: 'Jun 12', price: 1780 },
];

// ── Collaborators ─────────────────────────────────────────────────────────────
const COLLABORATORS = [
  { id: 1, name: 'Alex Chen', role: 'Owner', avatar: 'AC', color: 'bg-[#2A4D3A]', online: true, edits: 47 },
  { id: 2, name: 'Maya Patel', role: 'Editor', avatar: 'MP', color: 'bg-purple-500', online: true, edits: 23 },
  { id: 3, name: 'Jordan Kim', role: 'Viewer', avatar: 'JK', color: 'bg-blue-500', online: false, edits: 5 },
];

// ─────────────────────────────────────────────────────────────────────────────

export const Tools: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('JPY');
  const [amount, setAmount] = useState('100');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const fromRate = CURRENCIES.find(c => c.code === fromCurrency)?.rate ?? 1;
  const toRate = CURRENCIES.find(c => c.code === toCurrency)?.rate ?? 1;
  const converted = (parseFloat(amount || '0') / fromRate * toRate).toFixed(toCurrency === 'JPY' ? 0 : 2);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleInvite = () => {
    if (inviteEmail.includes('@')) {
      setInviteSent(true);
      setInviteEmail('');
      setTimeout(() => setInviteSent(false), 3000);
    }
  };

  const minPrice = Math.min(...FLIGHT_PRICE_DATA.map(d => d.price));
  const currentPrice = FLIGHT_PRICE_DATA[FLIGHT_PRICE_DATA.length - 1].price;
  const priceChange = currentPrice - FLIGHT_PRICE_DATA[FLIGHT_PRICE_DATA.length - 2].price;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-sm font-semibold text-[#2A4D3A]/60 uppercase tracking-wider mb-1">Smart Tools</h2>
        <h1 className="text-3xl font-bold text-[#2A4D3A]">Travel Toolkit</h1>
        <p className="text-slate-500 mt-1">Weather, currency, flights & collaborative planning.</p>
      </motion.div>

      {/* ── Weather Integration ────────────────────────────────────────────── */}
      <section>
        <h2 className="font-bold text-[#2A4D3A] text-lg mb-4 flex items-center gap-2">
          <Cloud size={20} className="text-blue-400" /> Weather Integration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEATHER_DATA.map((city, i) => (
            <motion.div
              key={city.city}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100"
            >
              {/* Background */}
              <img src={city.img} alt={city.city} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />

              {/* Content */}
              <div className="relative z-10 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{city.emoji}</span>
                      <span className="text-white font-bold text-lg">{city.city}</span>
                    </div>
                    <p className="text-white/70 text-sm">{city.condition}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-5xl font-thin">{city.temp}°</div>
                    <div className="text-white/60 text-sm">Feels {city.feelsLike}°C</div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-4 mt-4 mb-4">
                  {[
                    { icon: Droplets, label: `${city.humidity}%`, sub: 'Humidity' },
                    { icon: Wind, label: `${city.wind}km/h`, sub: 'Wind' },
                    { icon: Sun, label: `UV ${city.uv}`, sub: 'Index' },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={sub} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2">
                      <Icon size={14} className="text-white/80" />
                      <div>
                        <div className="text-white text-xs font-bold">{label}</div>
                        <div className="text-white/60 text-[10px]">{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 5-day forecast */}
                <div className="flex gap-2">
                  {city.forecast.map(day => (
                    <div key={day.day} className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
                      <div className="text-white/70 text-[10px] mb-1 font-medium">{day.day}</div>
                      <WeatherIcon type={day.icon} size={14} className="mx-auto mb-1" />
                      <div className="text-white text-[11px] font-bold">{day.hi}°</div>
                      <div className="text-white/50 text-[10px]">{day.lo}°</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Currency Converter + Flight Prices ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Currency Converter */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6"
        >
          <h2 className="font-bold text-[#2A4D3A] text-lg mb-5 flex items-center gap-2">
            <ArrowRightLeft size={20} className="text-[#F5B041]" /> Currency Converter
          </h2>

          <div className="space-y-3">
            {/* From */}
            <div className="bg-[#FDFBF7] rounded-2xl p-4 border border-slate-100">
              <label className="text-xs text-slate-400 font-semibold mb-2 block">FROM</label>
              <div className="flex items-center gap-3">
                <select
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value)}
                  className="flex-1 bg-transparent font-bold text-[#2A4D3A] focus:outline-none cursor-pointer text-sm"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-28 text-right text-xl font-bold text-[#2A4D3A] bg-transparent focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Swap button */}
            <div className="flex justify-center">
              <button
                onClick={swapCurrencies}
                className="p-2 bg-[#2A4D3A] rounded-xl text-white hover:bg-[#1f382a] transition-all active:scale-90 shadow-md"
              >
                <ArrowRightLeft size={18} />
              </button>
            </div>

            {/* To */}
            <div className="bg-[#2A4D3A]/5 rounded-2xl p-4 border border-[#2A4D3A]/10">
              <label className="text-xs text-slate-400 font-semibold mb-2 block">TO</label>
              <div className="flex items-center gap-3">
                <select
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value)}
                  className="flex-1 bg-transparent font-bold text-[#2A4D3A] focus:outline-none cursor-pointer text-sm"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#2A4D3A]">{converted}</div>
                </div>
              </div>
            </div>

            {/* Quick conversions */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[50, 100, 500].map(val => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className="py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-600 hover:border-[#F5B041] hover:text-[#F5B041] transition-colors"
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 text-center">
            Rates are indicative only · Last updated: May 10, 2026
          </p>
        </motion.section>

        {/* Flight Price Tracker */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-[#2A4D3A] text-lg flex items-center gap-2">
              <Plane size={20} className="text-[#F5B041]" /> Flight Price Tracker
            </h2>
            <button className="p-1.5 bg-slate-50 rounded-lg text-slate-400 hover:text-[#2A4D3A] transition-colors">
              <RefreshCw size={15} />
            </button>
          </div>
          <p className="text-slate-400 text-xs mb-4">JFK → NRT · Economy · 1 adult</p>

          {/* Price Hero */}
          <div className="flex items-end gap-3 mb-4">
            <div>
              <div className="text-4xl font-bold text-[#2A4D3A]">${currentPrice.toLocaleString()}</div>
              <div className={`flex items-center gap-1 text-sm font-semibold mt-1 ${priceChange > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {priceChange > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {priceChange > 0 ? '+' : ''}{priceChange} vs last week
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs text-slate-400 mb-1">30-day low</div>
              <div className="font-bold text-emerald-600">${minPrice.toLocaleString()}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FLIGHT_PRICE_DATA}>
                <XAxis key="flight-xaxis" dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} interval={3} />
                <YAxis key="flight-yaxis" hide domain={['auto', 'auto']} />
                <Tooltip
                  key="flight-tooltip"
                  formatter={(v) => [`$${v}`, 'Price']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <ReferenceLine key="flight-refline" y={minPrice} stroke="#10B981" strokeDasharray="3 3" strokeWidth={1} />
                <Line
                  key="flight-line"
                  type="monotone"
                  dataKey="price"
                  stroke="#2A4D3A"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#F5B041', stroke: '#2A4D3A', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-2 mt-3">
            <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <div className="text-xs text-emerald-600 font-semibold">Best Day to Book</div>
              <div className="font-bold text-emerald-700">Tuesday</div>
            </div>
            <div className="flex-1 bg-[#F5B041]/10 border border-[#F5B041]/20 rounded-xl p-3 text-center">
              <div className="text-xs text-[#F5B041] font-semibold">Price Alert</div>
              <div className="font-bold text-[#2A4D3A]">Active ✓</div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* ── Collaborative Trip Planning ───────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6"
      >
        <h2 className="font-bold text-[#2A4D3A] text-lg mb-6 flex items-center gap-2">
          <Users size={20} className="text-[#2A4D3A]" /> Collaborative Trip Planning
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Collaborators list */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Team Members</h3>
            <div className="space-y-3">
              {COLLABORATORS.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-[#FDFBF7] rounded-2xl border border-slate-100 hover:border-[#2A4D3A]/20 transition-colors">
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {c.avatar}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${c.online ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800 text-sm truncate">{c.name}</span>
                      {c.role === 'Owner' && <Crown size={12} className="text-[#F5B041] flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{c.online ? '🟢 Online' : '⚫ Offline'}</span>
                      <span>·</span>
                      <span>{c.edits} edits</span>
                    </div>
                  </div>
                  {/* Role badge */}
                  <div className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    c.role === 'Owner' ? 'bg-[#2A4D3A]/10 text-[#2A4D3A]' :
                    c.role === 'Editor' ? 'bg-purple-100 text-purple-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {c.role === 'Editor' ? <Edit3 size={10} /> : c.role === 'Viewer' ? <Eye size={10} /> : <Crown size={10} />}
                    {c.role}
                  </div>
                </div>
              ))}
            </div>

            {/* Activity summary */}
            <div className="mt-4 bg-[#2A4D3A]/5 rounded-2xl p-4 border border-[#2A4D3A]/10">
              <h4 className="text-xs font-semibold text-[#2A4D3A] uppercase tracking-wider mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {[
                  { user: 'MP', action: 'Added Paris day 5 activities', time: '2m ago' },
                  { user: 'AC', action: 'Updated budget allocation', time: '1h ago' },
                  { user: 'JK', action: 'Viewed packing checklist', time: '3h ago' },
                ].map((act, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 ${
                      act.user === 'AC' ? 'bg-[#2A4D3A]' : act.user === 'MP' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>{act.user}</div>
                    <span className="flex-1 truncate">{act.action}</span>
                    <span className="text-slate-400 flex-shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invite section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Invite Collaborators</h3>

            <div className="bg-gradient-to-br from-[#2A4D3A] to-[#1a3328] rounded-2xl p-5 text-white mb-4">
              <div className="flex -space-x-3 mb-4">
                {COLLABORATORS.map(c => (
                  <div key={c.id} className={`w-10 h-10 ${c.color} rounded-xl border-2 border-[#2A4D3A] flex items-center justify-center text-white font-bold text-sm`}>
                    {c.avatar}
                  </div>
                ))}
                <div className="w-10 h-10 bg-white/20 rounded-xl border-2 border-dashed border-white/40 flex items-center justify-center">
                  <UserPlus size={16} className="text-white/60" />
                </div>
              </div>
              <h4 className="font-bold mb-1">Planning is better together</h4>
              <p className="text-white/70 text-sm">Share your itinerary, split costs, and co-edit in real-time with your travel companions.</p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="flex-1 bg-[#FDFBF7] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2A4D3A]/40 transition-colors"
                />
                <button
                  onClick={handleInvite}
                  className="px-4 py-3 bg-[#F5B041] text-[#2A4D3A] rounded-xl font-bold text-sm hover:bg-[#e0a03a] transition-colors active:scale-95"
                >
                  Invite
                </button>
              </div>

              {inviteSent && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium"
                >
                  ✅ Invite sent successfully!
                </motion.div>
              )}

              {/* Permission options */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Viewer', icon: Eye, desc: 'Can view' },
                  { label: 'Editor', icon: Edit3, desc: 'Can edit' },
                  { label: 'Owner', icon: Crown, desc: 'Full access' },
                ].map(({ label, icon: Icon, desc }) => (
                  <div key={label} className="border border-slate-100 rounded-xl p-3 text-center hover:border-[#2A4D3A]/30 cursor-pointer transition-colors group">
                    <Icon size={16} className="mx-auto mb-1 text-slate-400 group-hover:text-[#2A4D3A] transition-colors" />
                    <div className="text-xs font-semibold text-slate-700">{label}</div>
                    <div className="text-[10px] text-slate-400">{desc}</div>
                  </div>
                ))}
              </div>

              {/* Share link */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="flex-1 text-xs text-slate-500 truncate font-mono">
                  traveloop.app/trip/asia-europe-j7k2
                </div>
                <button className="text-[#2A4D3A] text-xs font-bold hover:text-[#F5B041] transition-colors flex-shrink-0">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};