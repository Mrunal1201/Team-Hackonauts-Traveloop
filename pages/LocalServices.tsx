import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Hospital, Pill, Banknote, Shield, Globe, Phone, AlertTriangle, Zap,
  MapPin, Clock, Star, Navigation, Wifi, ExternalLink, ChevronRight,
  Wrench, Utensils, Car, ShoppingCart,
} from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap';

type City = 'tokyo' | 'paris';

// ── Emergency Contacts ─────────────────────────────────────────────────────
const EMERGENCY_CONTACTS = {
  tokyo: [
    { service: 'Police', number: '110', icon: Shield, color: '#3B82F6', desc: 'Report crime, emergency assistance', urgent: true },
    { service: 'Ambulance & Fire', number: '119', icon: Hospital, color: '#EF4444', desc: 'Medical emergencies & fire', urgent: true },
    { service: 'Tourist Helpline', number: '03-3503-2911', icon: Phone, color: '#10B981', desc: 'English-speaking travel assistance', urgent: false },
    { service: 'US Embassy Tokyo', number: '+81-3-3224-5000', icon: Globe, color: '#6366F1', desc: 'Passport, visa & citizen emergency', urgent: false },
    { service: 'Women\'s Safety', number: '03-5345-2103', icon: Shield, color: '#EC4899', desc: '24h women\'s counseling & support', urgent: false },
    { service: 'Japan Coast Guard', number: '118', icon: Navigation, color: '#F59E0B', desc: 'Maritime emergencies', urgent: false },
  ],
  paris: [
    { service: 'Police', number: '17', icon: Shield, color: '#3B82F6', desc: 'Report crime, emergency assistance', urgent: true },
    { service: 'SAMU (Ambulance)', number: '15', icon: Hospital, color: '#EF4444', desc: 'Medical emergencies, paramedics', urgent: true },
    { service: 'Fire Brigade (Pompiers)', number: '18', icon: AlertTriangle, color: '#F97316', desc: 'Fire & rescue emergencies', urgent: true },
    { service: 'EU Emergency', number: '112', icon: Phone, color: '#10B981', desc: 'All emergencies from any phone', urgent: true },
    { service: 'US Embassy Paris', number: '+33-1-43-12-22-22', icon: Globe, color: '#6366F1', desc: 'Passport, visa & citizen emergency', urgent: false },
    { service: 'Tourist Police', number: '01 53 73 53 73', icon: Shield, color: '#8B5CF6', desc: 'Tourist-specific police assistance', urgent: false },
  ],
};

// ── Nearby Services ────────────────────────────────────────────────────────
const NEARBY_SERVICES = {
  tokyo: [
    { name: 'Tokyo Medical University Hospital', type: 'hospital', icon: Hospital, distance: '1.2 km', open: '24/7 ER', rating: 4.6, desc: 'International patients welcome · English-speaking staff', urgent: false },
    { name: 'Welcia Pharmacy (Shinjuku)', type: 'pharmacy', icon: Pill, distance: '280 m', open: 'Open 24h', rating: 4.5, desc: 'Largest pharmacy chain · Stock English-label meds', urgent: false },
    { name: 'Shinjuku ATM (7-Eleven)', type: 'atm', icon: Banknote, distance: '120 m', open: '24/7', rating: 5.0, desc: 'International cards accepted · English menu', urgent: false },
    { name: 'Ichiran Ramen Shinjuku', type: 'food', icon: Utensils, distance: '350 m', open: '24h', rating: 4.8, desc: 'Solo ramen booths · English menu available', urgent: false },
    { name: 'Shinjuku Station Taxi Stand', type: 'taxi', icon: Car, distance: '200 m', open: '24/7', rating: 4.7, desc: 'Authorized taxi stand · Always available', urgent: false },
    { name: 'Yamada Denki Electronics', type: 'electronics', icon: Wrench, distance: '400 m', open: '10am–9pm', rating: 4.4, desc: 'Electronics repair, adapters, chargers', urgent: false },
    { name: 'FamilyMart Convenience Store', type: 'convenience', icon: ShoppingCart, distance: '50 m', open: '24h', rating: 4.8, desc: 'ATM, food, medicine, SIM cards, WiFi', urgent: false },
    { name: 'Shinjuku Police Box (Koban)', type: 'police', icon: Shield, distance: '180 m', open: '24/7', rating: 4.9, desc: 'Local police box · Can help with directions', urgent: false },
  ],
  paris: [
    { name: 'Hôpital Lariboisière', type: 'hospital', icon: Hospital, distance: '2.1 km', open: '24/7 ER', rating: 4.5, desc: 'Major Paris hospital · English-speaking ER staff', urgent: false },
    { name: 'Pharmacie de la Gare du Nord', type: 'pharmacy', icon: Pill, distance: '450 m', open: 'Open 24h', rating: 4.6, desc: '24h pharmacy · International medications stocked', urgent: false },
    { name: 'BNP Paribas ATM', type: 'atm', icon: Banknote, distance: '200 m', open: '24/7', rating: 4.8, desc: 'Accepts Visa/Mastercard/Amex · Low fees', urgent: false },
    { name: 'Café de Flore', type: 'food', icon: Utensils, distance: '800 m', open: '7:30am–1:30am', rating: 4.7, desc: 'Historic café · French classics · Wi-Fi', urgent: false },
    { name: 'G7 Taxi Station', type: 'taxi', icon: Car, distance: '300 m', open: '24/7', rating: 4.8, desc: 'Paris most reliable taxi service · English app', urgent: false },
    { name: 'FNAC Tech Repair', type: 'electronics', icon: Wrench, distance: '600 m', open: '10am–8pm', rating: 4.3, desc: 'Electronics repairs, cables, adapters', urgent: false },
    { name: 'Monoprix Supermarket', type: 'convenience', icon: ShoppingCart, distance: '150 m', open: '8:30am–10pm', rating: 4.6, desc: 'Groceries, pharmacy section, ATM', urgent: false },
    { name: 'Police Nationale Station', type: 'police', icon: Shield, distance: '500 m', open: '24/7', rating: 4.4, desc: 'Paris police station · Tourist reports', urgent: false },
  ],
};

// ── Safety Alerts ──────────────────────────────────────────────────────────
const SAFETY_ALERTS = {
  tokyo: [
    { type: 'weather', icon: '🌧️', text: 'Typhoon season: June–October. Check JMA forecasts daily.', level: 'info' },
    { type: 'safe', icon: '✅', text: 'Tokyo is ranked one of the safest cities globally. Low street crime.', level: 'safe' },
    { type: 'tip', icon: '🚨', text: 'In case of earthquake: Drop, Cover, Hold. Follow shelter instructions.', level: 'warning' },
    { type: 'tip', icon: '📱', text: 'Install NHK World app for English emergency broadcasts.', level: 'info' },
  ],
  paris: [
    { type: 'warning', icon: '⚠️', text: 'Pickpocket risk high near Eiffel Tower, Montmartre, and metro.', level: 'warning' },
    { type: 'safe', icon: '✅', text: 'Central Paris (1e–8e) is generally very safe during daytime.', level: 'safe' },
    { type: 'tip', icon: '🌙', text: 'Avoid isolated parts of the Bois de Boulogne after dark.', level: 'warning' },
    { type: 'tip', icon: '📱', text: 'Save the local emergency number 112 — works from any phone.', level: 'info' },
  ],
};

const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'hospital', label: '🏥 Hospital' },
  { id: 'pharmacy', label: '💊 Pharmacy' },
  { id: 'atm', label: '💳 ATM' },
  { id: 'food', label: '🍽️ Food' },
  { id: 'taxi', label: '🚕 Taxi' },
  { id: 'police', label: '🚔 Police' },
  { id: 'convenience', label: '🏪 Convenience' },
];

// ── Component ──────────────────────────────────────────────────────────────
export const LocalServices: React.FC = () => {
  const [city, setCity] = useState<City>('tokyo');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosTriggered, setSosTriggered] = useState(false);

  // SOS countdown
  useEffect(() => {
    if (!sosActive) { setSosCountdown(5); return; }
    if (sosCountdown === 0) { setSosTriggered(true); setSosActive(false); return; }
    const timer = setTimeout(() => setSosCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [sosActive, sosCountdown]);

  const contacts = EMERGENCY_CONTACTS[city];
  const services = NEARBY_SERVICES[city].filter(s => serviceFilter === 'all' || s.type === serviceFilter);
  const alerts = SAFETY_ALERTS[city];

  const ALERT_COLORS = {
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    safe: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-sm font-semibold text-[#2A4D3A]/60 uppercase tracking-wider mb-1">Local Intelligence</h2>
        <h1 className="text-3xl font-bold text-[#2A4D3A]">Safety & Local Services</h1>
        <p className="text-slate-500 mt-1">Emergency contacts, nearby services & safety intelligence.</p>
      </motion.div>

      {/* City Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
          {(['tokyo', 'paris'] as City[]).map(c => (
            <button
              key={c}
              onClick={() => { setCity(c); setSosTriggered(false); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                city === c ? 'bg-[#2A4D3A] text-white shadow-md' : 'text-slate-500 hover:text-[#2A4D3A]'
              }`}
            >
              {c === 'tokyo' ? '🇯🇵 Tokyo' : '🇫🇷 Paris'}
            </button>
          ))}
        </div>
      </div>

      {/* ── SOS Emergency Button ──────────────────────────────────────── */}
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <AlertTriangle size={22} className="text-red-100" />
                Emergency SOS
              </h3>
              <p className="text-red-100 text-sm mt-1">Hold the button for 5 seconds to alert emergency services.</p>
            </div>

            {/* SOS Button */}
            <div className="relative">
              {sosActive && (
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30 scale-150" />
              )}
              <motion.button
                onMouseDown={() => { setSosActive(true); setSosTriggered(false); }}
                onMouseUp={() => { if (!sosTriggered) setSosActive(false); }}
                onTouchStart={() => { setSosActive(true); setSosTriggered(false); }}
                onTouchEnd={() => { if (!sosTriggered) setSosActive(false); }}
                whileTap={{ scale: 0.93 }}
                className={`relative z-10 w-20 h-20 rounded-full border-4 border-white/40 flex items-center justify-center font-bold text-white shadow-2xl transition-colors ${
                  sosTriggered ? 'bg-emerald-500' : sosActive ? 'bg-red-400' : 'bg-red-700 hover:bg-red-600'
                }`}
                style={{ boxShadow: sosActive ? '0 0 30px 10px rgba(255,100,100,0.5)' : '' }}
              >
                {sosTriggered ? (
                  <span className="text-xs font-bold text-center">SENT ✓</span>
                ) : sosActive ? (
                  <span className="text-2xl font-black">{sosCountdown}</span>
                ) : (
                  <span className="text-sm font-black">SOS</span>
                )}
              </motion.button>
            </div>
          </div>

          {sosTriggered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30"
            >
              <p className="text-white font-bold text-sm">🆘 Emergency alert sent!</p>
              <p className="text-red-100 text-xs mt-0.5">
                Sharing your location with {city === 'tokyo' ? '119 (Ambulance)' : '15 (SAMU)'} and your emergency contacts.
              </p>
            </motion.div>
          )}
        </div>

        {/* Quick emergency numbers strip */}
        <div className="bg-red-700 px-6 py-3 flex gap-4 overflow-x-auto scrollbar-none">
          {contacts.filter(c => c.urgent).map(c => (
            <a
              key={c.service}
              href={`tel:${c.number}`}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors rounded-xl px-3 py-2 flex-shrink-0"
            >
              <c.icon size={14} className="text-red-100" />
              <div>
                <div className="text-white text-xs font-bold">{c.service}</div>
                <div className="text-red-200 text-[11px]">{c.number}</div>
              </div>
            </a>
          ))}
        </div>
      </motion.div>

      {/* ── Safety Alerts ─────────────────────────────────────────────── */}
      <div>
        <h2 className="font-bold text-[#2A4D3A] text-lg mb-3 flex items-center gap-2">
          <Zap size={18} className="text-[#F5B041]" /> AI Safety Intelligence
        </h2>
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-start gap-3 p-4 rounded-2xl border ${ALERT_COLORS[alert.level as keyof typeof ALERT_COLORS]}`}
            >
              <span className="text-xl flex-shrink-0">{alert.icon}</span>
              <p className="text-sm leading-relaxed font-medium">{alert.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Emergency Contacts ────────────────────────────────────────── */}
      <div>
        <h2 className="font-bold text-[#2A4D3A] text-lg mb-3 flex items-center gap-2">
          <Phone size={18} className="text-[#2A4D3A]" /> Emergency Contacts — {city === 'tokyo' ? 'Tokyo' : 'Paris'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contacts.map((contact, i) => (
            <motion.a
              key={contact.service}
              href={`tel:${contact.number}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md group ${
                contact.urgent
                  ? 'bg-red-50 border-red-100 hover:border-red-200'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                style={{ backgroundColor: `${contact.color}20` }}
              >
                <contact.icon size={22} style={{ color: contact.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-slate-800">{contact.service}</h4>
                  {contact.urgent && (
                    <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">URGENT</span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{contact.desc}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="font-bold text-lg" style={{ color: contact.color }}>{contact.number}</span>
                <ExternalLink size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* ── Interactive Map ───────────────────────────────────────────── */}
      <div>
        <h2 className="font-bold text-[#2A4D3A] text-lg mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-[#2A4D3A]" /> Live Services Map
        </h2>
        <InteractiveMap city={city} filterType="emergency" showFilters={true} height="h-72" />
      </div>

      {/* ── JustDial-Style Nearby Services ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-[#2A4D3A] text-lg flex items-center gap-2">
            <Navigation size={18} className="text-[#2A4D3A]" /> Nearby Services
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Location-aware
          </div>
        </div>

        {/* Service category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-4">
          {SERVICE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setServiceFilter(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all border ${
                serviceFilter === cat.id
                  ? 'bg-[#2A4D3A] text-white border-transparent'
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {services.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-md hover:border-[#2A4D3A]/20 transition-all flex items-center gap-4"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  service.type === 'hospital' ? 'bg-red-50 text-red-500' :
                  service.type === 'pharmacy' ? 'bg-green-50 text-green-600' :
                  service.type === 'atm' ? 'bg-emerald-50 text-emerald-600' :
                  service.type === 'police' ? 'bg-blue-50 text-blue-600' :
                  'bg-[#FDFBF7] text-[#2A4D3A]'
                }`}>
                  <service.icon size={22} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">{service.name}</h4>
                  <p className="text-xs text-slate-400 mb-1">{service.desc}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`font-semibold ${service.open.includes('24') ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {service.open.includes('24') ? '🟢' : '🕐'} {service.open}
                    </span>
                    <span className="flex items-center gap-0.5 text-slate-400">
                      <Star size={10} className="text-[#F5B041] fill-[#F5B041]" />
                      {service.rating}
                    </span>
                  </div>
                </div>

                {/* Distance + action */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs font-bold text-[#2A4D3A] bg-[#2A4D3A]/10 px-2 py-1 rounded-full">
                    <MapPin size={10} /> {service.distance}
                  </span>
                  <button className="p-1.5 bg-[#FDFBF7] border border-slate-100 rounded-lg text-slate-400 hover:text-[#2A4D3A] hover:border-[#2A4D3A]/20 transition-colors">
                    <Navigation size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Travel Insurance Reminder ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#2A4D3A] to-[#1a3328] rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={20} className="text-[#F5B041]" />
            <h3 className="font-bold">Travel Insurance Status</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Medical Cover', value: '$500K', status: 'Active' },
              { label: 'Trip Cancel', value: '$5,000', status: 'Active' },
              { label: 'Baggage', value: '$2,500', status: 'Active' },
            ].map(item => (
              <div key={item.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-white/70 text-[10px] mb-1">{item.label}</div>
                <div className="font-bold text-white">{item.value}</div>
                <div className="text-emerald-400 text-[10px] font-semibold">{item.status}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
            <span className="text-white/80 text-sm">Policy: World Nomads Explorer</span>
            <button className="flex items-center gap-1 text-[#F5B041] text-sm font-bold hover:underline">
              View Policy <ExternalLink size={12} />
            </button>
          </div>
        </div>
        <div className="absolute right-[-30px] bottom-[-30px] opacity-5">
          <Shield size={160} />
        </div>
      </motion.div>
    </div>
  );
};
