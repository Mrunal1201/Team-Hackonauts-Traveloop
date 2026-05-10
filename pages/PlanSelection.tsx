import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Pencil, Sparkles, MapPin, Wallet, Clock, Hotel, Utensils, Train,
  CheckCircle, ChevronRight, ArrowRight, Zap, Brain, Users, TrendingUp,
} from 'lucide-react';

const CUSTOM_FEATURES = [
  { icon: MapPin, text: 'Pick any destinations & routes' },
  { icon: Clock, text: 'Set your own schedule & timeline' },
  { icon: Wallet, text: 'Define & control your budget' },
  { icon: Hotel, text: 'Choose your hotels & stays' },
  { icon: Utensils, text: 'Plan food & experiences' },
  { icon: Train, text: 'Build your own transport plan' },
];

const AI_FEATURES = [
  { icon: Brain, text: 'Full itinerary generated instantly' },
  { icon: MapPin, text: 'Optimized routes between cities' },
  { icon: Hotel, text: 'Hotels curated for your budget' },
  { icon: Utensils, text: 'Food & sightseeing recommended' },
  { icon: Train, text: 'Transport guidance included' },
  { icon: TrendingUp, text: 'Budget breakdown & estimates' },
];

const AI_EXAMPLES = [
  '"5-day Japan trip under ₹1 lakh"',
  '"7-day Bali retreat for two, ₹60,000"',
  '"10-day Europe for solo backpacker"',
  '"Weekend getaway in Bangkok"',
];

export const PlanSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
        <div className="inline-flex items-center gap-2 bg-[#F5B041]/15 border border-[#F5B041]/30 rounded-full px-4 py-2 mb-4">
          <Zap size={14} className="text-[#F5B041]" />
          <span className="text-sm font-bold text-[#2A4D3A]">Traveloop Trip Planner</span>
        </div>
        <h1 className="text-4xl font-bold text-[#2A4D3A] mb-3">How would you like to plan?</h1>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
          Choose how to build your perfect trip — take full control or let our AI handle everything for you.
        </p>
      </motion.div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Custom Trip Card ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="group cursor-pointer"
          onClick={() => navigate('/plan/custom')}
        >
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
            {/* Background image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1673540229523-ae909da944e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Custom planning"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A4D3A]/90 via-[#2A4D3A]/40 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <Pencil size={20} className="text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                    Full Control
                  </span>
                </div>
                <h2 className="text-white text-2xl font-bold leading-tight">Customize<br />Your Own Trip</h2>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white p-6">
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                Build your itinerary from scratch with complete flexibility. Add destinations, activities, hotels, and budgets exactly how you want them.
              </p>

              <div className="space-y-2.5 mb-6">
                {CUSTOM_FEATURES.map((feat) => (
                  <div key={feat.text} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#2A4D3A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feat.icon size={13} className="text-[#2A4D3A]" />
                    </div>
                    <span className="text-sm text-slate-600">{feat.text}</span>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-[#2A4D3A] hover:bg-[#1f382a] text-white py-3.5 rounded-2xl font-bold transition-all group-hover:shadow-lg active:scale-[0.98]">
                Start Building
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── AI Generated Card ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="group cursor-pointer"
          onClick={() => navigate('/plan/ai')}
        >
          <div className="relative rounded-3xl overflow-hidden border border-[#F5B041]/40 shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
            {/* Background image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1770169272345-9636d5ef2681?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="AI planning"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
              {/* Animated glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5B041]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-5 left-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-[#F5B041]/20 backdrop-blur-sm rounded-xl border border-[#F5B041]/40">
                    <Sparkles size={20} className="text-[#F5B041]" />
                  </div>
                  <span className="text-[#F5B041] text-sm font-bold bg-[#F5B041]/20 backdrop-blur-sm px-3 py-1 rounded-full border border-[#F5B041]/40">
                    ✨ AI Powered
                  </span>
                </div>
                <h2 className="text-white text-2xl font-bold leading-tight">AI Generated<br />Pre-Planned Trip</h2>
              </div>
            </div>

            {/* Content */}
            <div className="bg-[#1a1a2e] p-6">
              <p className="text-white/60 text-sm mb-5 leading-relaxed">
                Tell us your budget, style, and destination — our AI crafts a complete, optimized trip in seconds. No planning required.
              </p>

              <div className="space-y-2.5 mb-5">
                {AI_FEATURES.map((feat) => (
                  <div key={feat.text} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#F5B041]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feat.icon size={13} className="text-[#F5B041]" />
                    </div>
                    <span className="text-sm text-white/70">{feat.text}</span>
                  </div>
                ))}
              </div>

              {/* AI prompts ticker */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-5">
                <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-2">Try saying...</p>
                <div className="space-y-1">
                  {AI_EXAMPLES.slice(0, 2).map(ex => (
                    <p key={ex} className="text-[#F5B041]/80 text-xs font-medium italic">{ex}</p>
                  ))}
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-[#F5B041] hover:bg-[#e0a03a] text-[#1a1a2e] py-3.5 rounded-2xl font-bold transition-all group-hover:shadow-lg group-hover:shadow-[#F5B041]/30 active:scale-[0.98]">
                <Sparkles size={18} />
                Generate My Trip
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Trips Quick Access */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="font-bold text-[#2A4D3A] mb-4 flex items-center gap-2">
          <Clock size={18} className="text-[#F5B041]" /> Continue Planning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'Asia-Europe Loop', cities: 'Tokyo · Paris', progress: 85, days: 45, img: 'https://images.unsplash.com/photo-1735854794012-d64142df3f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', color: 'from-[#2A4D3A]/80' },
            { name: 'Bali Retreat', cities: 'Denpasar · Ubud', progress: 40, days: 7, img: 'https://images.unsplash.com/photo-1761521688849-9700476692e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', color: 'from-teal-800/80' },
            { name: 'Europe Sprint', cities: 'Rome · Paris · Barcelona', progress: 15, days: 10, img: 'https://images.unsplash.com/photo-1775401152601-79793ac4c173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', color: 'from-purple-900/80' },
          ].map((trip, i) => (
            <motion.button
              key={trip.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              onClick={() => navigate('/itinerary')}
              className="relative rounded-2xl overflow-hidden border border-slate-100 h-24 text-left group hover:shadow-lg transition-all"
            >
              <img src={trip.img} alt={trip.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-r ${trip.color} to-transparent`} />
              <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                <div>
                  <h4 className="text-white font-bold text-sm">{trip.name}</h4>
                  <p className="text-white/70 text-xs">{trip.cities} · {trip.days}d</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F5B041] rounded-full" style={{ width: `${trip.progress}%` }} />
                  </div>
                  <span className="text-white/70 text-[10px] font-semibold">{trip.progress}%</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-[#2A4D3A] text-lg">Which mode is right for you?</h3>
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          <div className="p-4 bg-slate-50" />
          <div className="p-4 text-center bg-[#2A4D3A]/5">
            <Pencil size={18} className="text-[#2A4D3A] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#2A4D3A]">Custom</span>
          </div>
          <div className="p-4 text-center bg-[#F5B041]/5">
            <Sparkles size={18} className="text-[#F5B041] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#2A4D3A]">AI Generated</span>
          </div>
        </div>
        {[
          { feature: 'Planning time', custom: '1–3 hours', ai: '< 30 seconds' },
          { feature: 'Full creative control', custom: '✅ Yes', ai: '⚙️ Editable after' },
          { feature: 'Destination research', custom: '❌ Manual', ai: '✅ Automatic' },
          { feature: 'Budget optimization', custom: '❌ Manual', ai: '✅ AI optimized' },
          { feature: 'Best for', custom: 'Planners', ai: 'Quick travelers' },
        ].map((row, i) => (
          <div key={row.feature} className={`grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
            <div className="p-3 px-4 text-sm text-slate-500 font-medium">{row.feature}</div>
            <div className="p-3 text-center text-sm text-slate-700">{row.custom}</div>
            <div className="p-3 text-center text-sm text-slate-700">{row.ai}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
