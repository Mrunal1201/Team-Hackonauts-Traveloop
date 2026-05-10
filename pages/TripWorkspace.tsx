import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft, Map, Wallet, Package, Train, Compass, Shield,
  TrendingUp, Calendar, MapPin, Clock, Star, Edit3, Share2,
  Plus, CheckCircle2, Circle, ChevronDown, AlertTriangle,
  Zap, Sun, Users, Globe, Info, Trash2, Sparkles, Camera,
  Check, ChevronRight,
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TRIPS, ITINERARY_DAYS, BUDGET_BREAKDOWN, PACKING_LIST, type Trip } from '../data/tripsData';
import { useTrips } from '../context/TripsContext';
import { MemoriesTab } from '../components/MemoriesTab';

type Tab = 'itinerary' | 'budget' | 'packing' | 'transport' | 'discover' | 'safety' | 'insights' | 'memories';

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'itinerary', label: 'Itinerary',  icon: Calendar   },
  { key: 'budget',    label: 'Budget',     icon: Wallet     },
  { key: 'packing',   label: 'Packing',    icon: Package    },
  { key: 'transport', label: 'Transport',  icon: Train      },
  { key: 'discover',  label: 'Discover',   icon: Compass    },
  { key: 'safety',    label: 'Safety',     icon: Shield     },
  { key: 'insights',  label: 'Insights',   icon: TrendingUp },
  { key: 'memories',  label: 'Memories ✨', icon: Camera    },
];

const STATUS_COLOR: Record<string, string> = {
  Active:    'bg-emerald-100 text-emerald-700',
  Upcoming:  'bg-[#2A4D3A]/10 text-[#2A4D3A]',
  Draft:     'bg-slate-100 text-slate-500',
  Completed: 'bg-amber-100 text-amber-700',
};

const ACTIVITY_COLOR: Record<string, string> = {
  Transport: 'bg-blue-50 text-blue-600 border-blue-100',
  transport: 'bg-blue-50 text-blue-600 border-blue-100',
  Food:      'bg-orange-50 text-orange-600 border-orange-100',
  food:      'bg-orange-50 text-orange-600 border-orange-100',
  Culture:   'bg-violet-50 text-violet-600 border-violet-100',
  culture:   'bg-violet-50 text-violet-600 border-violet-100',
  Activity:  'bg-emerald-50 text-emerald-600 border-emerald-100',
  activity:  'bg-emerald-50 text-emerald-600 border-emerald-100',
  Nature:    'bg-green-50 text-green-600 border-green-100',
  nature:    'bg-green-50 text-green-600 border-green-100',
  hotel:     'bg-teal-50 text-teal-600 border-teal-100',
  Hotel:     'bg-teal-50 text-teal-600 border-teal-100',
  shopping:  'bg-pink-50 text-pink-600 border-pink-100',
  Shopping:  'bg-pink-50 text-pink-600 border-pink-100',
};

// ── Itinerary Tab ─────────────────────────────────────────────────────────────
const ItineraryTab = ({ trip }: { trip: Trip }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Prefer AI-generated days from trip object, fall back to static
  const hasAIDays = (trip.generatedDays?.length ?? 0) > 0;
  const staticDays = ITINERARY_DAYS[trip.id] || ITINERARY_DAYS['bali-getaway'] || [];

  if (hasAIDays) {
    const days = trip.generatedDays!;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-bold text-slate-800">{days.length} Days Planned</p>
          <div className="flex items-center gap-1.5 bg-[#F5B041]/15 border border-[#F5B041]/30 rounded-full px-3 py-1">
            <Sparkles size={12} className="text-[#2A4D3A]" />
            <span className="text-xs font-bold text-[#2A4D3A]">AI Generated</span>
          </div>
        </div>
        {days.map(day => (
          <div key={day.day} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
              className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2A4D3A] flex items-center justify-center flex-shrink-0">
                <span className="text-[#F5B041] font-black text-sm">D{day.day}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-slate-800 text-sm">{day.city}</p>
                <p className="text-slate-400 text-xs">{day.theme} · {(day.activities ?? []).length} activities</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2A4D3A]">
                  ${(day.activities ?? []).reduce((s, a) => s + (a.cost || 0), 0).toLocaleString()}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${expandedDay === day.day ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {expandedDay === day.day && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative px-4 pb-4">
                    <div className="absolute left-8 top-0 bottom-4 w-px bg-slate-100" />
                    <div className="space-y-3">
                      {(day.activities ?? []).map((act, i) => (
                        <div key={i} className="relative flex items-start gap-3 pl-6">
                          <div className="absolute left-0 w-3 h-3 rounded-full border-2 border-[#2A4D3A] bg-white flex-shrink-0" style={{ top: 14 }} />
                          <div className={`flex-1 flex items-start gap-3 border rounded-xl p-3 ${ACTIVITY_COLOR[act.type] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                            {act.emoji && <span className="text-xl flex-shrink-0">{act.emoji}</span>}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-sm">{act.title}</p>
                                {act.cost > 0 && <span className="text-xs font-bold flex-shrink-0">${act.cost.toLocaleString()}</span>}
                                {act.cost === 0 && <span className="text-xs font-bold text-emerald-600 flex-shrink-0">Free</span>}
                              </div>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-[10px] font-semibold opacity-70">{act.time}</span>
                                {act.tip && <span className="text-[10px] opacity-60 italic">💡 {act.tip}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Highlights if available */}
        {(trip.highlights?.length ?? 0) > 0 && (
          <div className="bg-[#2A4D3A]/5 border border-[#2A4D3A]/10 rounded-2xl p-4">
            <p className="font-bold text-[#2A4D3A] text-sm mb-3 flex items-center gap-2"><Star size={14} className="text-[#F5B041] fill-[#F5B041]" /> Trip Highlights</p>
            <div className="flex flex-wrap gap-2">
              {trip.highlights!.map((h, i) => (
                <span key={i} className="text-xs bg-white border border-[#F5B041]/30 text-[#2A4D3A] font-medium px-3 py-1.5 rounded-full">✨ {h}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fall back to static data
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-slate-800">{staticDays.length} Days Planned</p>
        <button className="flex items-center gap-1.5 text-[#2A4D3A] text-sm font-bold hover:underline">
          <Plus size={15} /> Add Day
        </button>
      </div>
      {staticDays.map(day => (
        <div key={day.day} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
            className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2A4D3A] flex items-center justify-center flex-shrink-0">
              <span className="text-[#F5B041] font-black text-sm">D{day.day}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-slate-800 text-sm">{day.date} · {day.city}</p>
              <p className="text-slate-400 text-xs">{day.activities.length} activities</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2A4D3A]">
                ${day.activities.reduce((s, a) => s + a.cost, 0)}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${expandedDay === day.day ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <AnimatePresence>
            {expandedDay === day.day && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative px-4 pb-4">
                  <div className="absolute left-8 top-0 bottom-4 w-px bg-slate-100" />
                  <div className="space-y-3">
                    {day.activities.map((act, i) => (
                      <div key={i} className="relative flex items-start gap-3 pl-6">
                        <div className="absolute left-0 w-3 h-3 rounded-full border-2 border-[#2A4D3A] bg-white flex-shrink-0" style={{ top: 14 }} />
                        <div className={`flex-1 flex items-start gap-3 border rounded-xl p-3 ${ACTIVITY_COLOR[act.type] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm">{act.title}</p>
                              {act.cost > 0 && <span className="text-xs font-bold flex-shrink-0">${act.cost}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-semibold opacity-70">{act.time}</span>
                              <Clock size={9} className="opacity-60" />
                              <span className="text-[10px] opacity-70">{act.duration}</span>
                              <span className="text-[10px] font-bold opacity-60 ml-1">{act.type}</span>
                            </div>
                            {act.note && <p className="text-[10px] mt-1 opacity-60 italic">{act.note}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      {staticDays.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">No itinerary yet</p>
          <button className="mt-3 text-[#2A4D3A] text-sm font-bold hover:underline">Add your first day →</button>
        </div>
      )}
    </div>
  );
};

// ── Budget Tab ────────────────────────────────────────────────────────────────
const BudgetTab = ({ trip }: { trip: Trip }) => {
  const [expenses, setExpenses] = useState<{ id: string; desc: string; amount: number; cat: string }[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newAmt, setNewAmt] = useState('');

  // Use AI budget items if available, else static breakdown
  const hasAIBudget = (trip.aiBudgetItems?.length ?? 0) > 0;
  const staticBreakdown = BUDGET_BREAKDOWN[trip.id] || BUDGET_BREAKDOWN['bali-getaway'] || [];

  const totalSpent = hasAIBudget
    ? expenses.reduce((s, e) => s + e.amount, 0)
    : staticBreakdown.reduce((s, c) => s + c.spent, 0) + expenses.reduce((s, e) => s + e.amount, 0);

  const pct = Math.min(Math.round((totalSpent / trip.budget) * 100) || 0, 100);

  // AI budget pie data
  const aiPieData = (trip.aiBudgetItems ?? []).map(item => ({
    name: item.label, value: item.value, color: item.color,
  }));

  // Static pie data
  const staticPieData = staticBreakdown.filter(c => c.spent > 0).map(c => ({
    name: c.category, value: c.spent, color: c.color,
  }));

  const pieData = hasAIBudget ? aiPieData : staticPieData;

  const addExpense = () => {
    if (!newDesc.trim() || !newAmt) return;
    setExpenses(prev => [...prev, { id: Date.now().toString(), desc: newDesc, amount: parseFloat(newAmt), cat: 'Other' }]);
    setNewDesc(''); setNewAmt(''); setShowAdd(false);
  };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: `$${trip.budget.toLocaleString()}`, color: 'text-[#2A4D3A]',  bg: 'bg-[#2A4D3A]/8'  },
          { label: 'Spent',        value: `$${totalSpent.toLocaleString()}`,  color: 'text-[#F5B041]',   bg: 'bg-[#F5B041]/10' },
          { label: 'Remaining',    value: `$${Math.max(trip.budget - totalSpent, 0).toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4 text-center`}>
            <p className={`font-black text-xl ${c.color}`}>{c.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex justify-between mb-2">
          <span className="font-semibold text-slate-700 text-sm">Budget Used</span>
          <span className={`font-black text-sm ${pct > 90 ? 'text-red-500' : 'text-[#2A4D3A]'}`}>{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${pct > 90 ? 'bg-red-400' : 'bg-gradient-to-r from-[#2A4D3A] to-[#F5B041]'}`}
          />
        </div>
        {pct > 85 && (
          <div className="flex items-center gap-2 mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
            <p className="text-amber-700 text-xs font-semibold">You've used {pct}% of your budget — consider cutting back.</p>
          </div>
        )}
      </div>

      {/* Budget breakdown chart */}
      {pieData.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-slate-800 text-sm">
              {hasAIBudget ? 'Planned Budget Breakdown' : 'Spending Breakdown'}
            </p>
            {hasAIBudget && (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-[#F5B041]/15 text-[#2A4D3A] px-2 py-0.5 rounded-full">
                <Sparkles size={9} /> AI Estimated
              </span>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div style={{ width: 180, height: 180, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2 w-full">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 truncate">{d.name}</p>
                    <p className="text-xs font-bold text-slate-700">${d.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Static breakdown bars (non-AI trips) */}
      {!hasAIBudget && staticBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <p className="font-bold text-slate-800 text-sm mb-4">Category Details</p>
          {staticBreakdown.map(c => {
            const catPct = Math.round((c.spent / c.budget) * 100) || 0;
            return (
              <div key={c.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.icon}</span>
                    <span className="text-sm font-semibold text-slate-700">{c.category}</span>
                  </div>
                  <p className="text-xs font-bold" style={{ color: c.color }}>${c.spent.toLocaleString()} <span className="text-slate-400 font-normal">/ ${c.budget.toLocaleString()}</span></p>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(catPct, 100)}%`, background: c.color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual expense tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-slate-800 text-sm">Track Expenses</p>
          <button onClick={() => setShowAdd(p => !p)} className="flex items-center gap-1.5 text-[#2A4D3A] text-xs font-bold hover:underline">
            <Plus size={14} /> Add Expense
          </button>
        </div>
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
              <div className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" className="flex-1 text-sm bg-transparent border-b border-slate-300 focus:outline-none focus:border-[#2A4D3A] px-1 py-1" />
                <input value={newAmt} onChange={e => setNewAmt(e.target.value)} type="number" placeholder="$0" className="w-20 text-sm bg-transparent border-b border-slate-300 focus:outline-none focus:border-[#2A4D3A] px-1 py-1" />
                <button onClick={addExpense} className="bg-[#2A4D3A] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#1f382a] transition-colors">Add</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {expenses.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">No expenses tracked yet — add your first!</p>
        ) : (
          <div className="space-y-2">
            {expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-700">{exp.desc}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#2A4D3A] text-sm">${exp.amount.toLocaleString()}</span>
                  <button onClick={() => setExpenses(prev => prev.filter(e => e.id !== exp.id))} className="text-slate-300 hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Packing Tab ───────────────────────────────────────────────────────────────
const PackingTab = ({ trip }: { trip: Trip }) => {
  const hasAIPacking = trip.aiPacking && Object.keys(trip.aiPacking).length > 0;

  // Convert AI packing to checklist format
  const aiPackingItems = useMemo(() => {
    if (!hasAIPacking) return [];
    const packing = trip.aiPacking!;
    const items: { id: string; category: string; item: string; packed: boolean; essential: boolean }[] = [];
    const catMap: Record<string, boolean> = { essentials: true, clothing: false, tech: false, health: true };
    Object.entries(packing).forEach(([cat, arr]) => {
      (arr as string[]).forEach((item, i) => {
        items.push({ id: `ai-${cat}-${i}`, category: cat.charAt(0).toUpperCase() + cat.slice(1), item, packed: false, essential: catMap[cat] ?? false });
      });
    });
    return items;
  }, [trip.aiPacking, hasAIPacking]);

  const staticItems = PACKING_LIST[trip.id] || PACKING_LIST['asia-europe-loop'] || [];
  const [items, setItems] = useState(hasAIPacking ? aiPackingItems : staticItems);

  const toggle = (id: string) => setItems(prev =>
    prev.map(item => item.id === id ? { ...item, packed: !item.packed } : item)
  );

  const categories = [...new Set(items.map(i => i.category))];
  const packedCount = items.filter(i => i.packed).length;
  const totalCount  = items.length;
  const pct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-bold text-slate-800">Packing Progress</p>
            <p className="text-slate-400 text-xs mt-0.5">{packedCount} of {totalCount} items packed</p>
          </div>
          <span className={`font-black text-2xl ${pct === 100 ? 'text-emerald-500' : 'text-[#2A4D3A]'}`}>{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#2A4D3A] to-[#F5B041]"
          />
        </div>
        {pct === 100 && (
          <div className="flex items-center gap-2 mt-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <p className="text-emerald-700 text-xs font-bold">All packed! You're ready to go 🎉</p>
          </div>
        )}
        {hasAIPacking && (
          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-[#2A4D3A] font-bold">
            <Sparkles size={10} /> AI-generated packing list for {trip.cities[0] || trip.destination}
          </div>
        )}
      </div>

      {/* Items by category */}
      {categories.map(cat => {
        const catItems = items.filter(i => i.category === cat);
        const catPacked = catItems.filter(i => i.packed).length;
        return (
          <div key={cat} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <p className="font-bold text-slate-700 text-sm">{cat}</p>
              <span className="text-xs text-slate-400">{catPacked}/{catItems.length}</span>
            </div>
            <div className="divide-y divide-slate-50">
              {catItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    item.packed ? 'bg-[#2A4D3A] border-[#2A4D3A]' : 'border-slate-300'
                  }`}>
                    {item.packed && <Check size={11} className="text-white" />}
                  </div>
                  <span className={`flex-1 text-sm ${item.packed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.item}
                  </span>
                  {item.essential && !item.packed && (
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-md flex-shrink-0">MUST</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* AI suggestion */}
      <div className="flex items-center gap-3 bg-[#2A4D3A]/8 border border-[#2A4D3A]/15 rounded-2xl p-4">
        <Sparkles size={18} className="text-[#2A4D3A] flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-[#2A4D3A]">AI Packing Tip</p>
          <p className="text-slate-500 text-xs mt-0.5">Always carry photocopies of your passport. Store digital copies in Google Drive or iCloud for emergencies.</p>
        </div>
      </div>
    </div>
  );
};

// ── Transport Tab ─────────────────────────────────────────────────────────────
const TransportTab = ({ trip }: { trip: Trip }) => {
  const cities = trip.cities.length >= 2 ? trip.cities : ['Origin', 'Destination'];
  const TRANSPORT = [
    { type: 'Flight', icon: '✈️', from: cities[0], to: cities[1] || cities[0], cost: '$320', duration: '7h 30m', class: 'Economy', status: 'Confirmed', color: 'border-l-blue-500' },
    { type: 'Train',  icon: '🚄', from: cities[1] || 'City 1', to: cities[2] || cities[1] || 'City 2', cost: '$85',  duration: '3h 45m', class: 'Standard', status: 'Book Now', color: 'border-l-green-500' },
    { type: 'Metro',  icon: '🚇', from: 'Airport', to: 'City Centre', cost: '$3',  duration: '45m', class: 'IC Card', status: 'Walk-in',  color: 'border-l-amber-500' },
    { type: 'Taxi',   icon: '🚕', from: 'Hotel', to: 'Historic District', cost: '$12', duration: '20m', class: 'Metered', status: 'On arrival', color: 'border-l-slate-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '✈️', label: 'Flights',      count: '2 booked'  },
          { icon: '🚄', label: 'Trains',       count: '1 pending' },
          { icon: '🚇', label: 'Metro Passes', count: '3 needed'  },
          { icon: '🚕', label: 'Transfers',    count: '4 local'   },
        ].map(t => (
          <div key={t.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <span className="text-2xl">{t.icon}</span>
            <div>
              <p className="font-bold text-slate-800 text-sm">{t.label}</p>
              <p className="text-slate-400 text-xs">{t.count}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {TRANSPORT.map((t, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${t.color} p-4`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{t.type}</p>
                  <p className="text-slate-500 text-xs">{t.from} → {t.to}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                t.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                t.status === 'Book Now'  ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-500'
              }`}>{t.status}</span>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Clock size={11} /> {t.duration}</span>
              <span className="font-bold text-[#2A4D3A]">{t.cost}</span>
              <span>{t.class}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add transport button */}
      <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#2A4D3A]/25 rounded-2xl text-[#2A4D3A]/60 hover:border-[#2A4D3A]/40 hover:text-[#2A4D3A] hover:bg-[#2A4D3A]/5 transition-all font-bold text-sm">
        <Plus size={16} /> Add Transport Leg
      </button>
    </div>
  );
};

// ── Discover Tab ──────────────────────────────────────────────────────────────
const DiscoverTab = ({ trip }: { trip: Trip }) => {
  const city = trip.cities[0] || 'Tokyo';
  const PLACES = [
    { name: 'Senso-ji Temple',      cat: 'Culture',   rating: 4.9, img: 'https://images.unsplash.com/photo-1617599137346-98e7c279ebe6?w=400&q=60', saved: false },
    { name: 'Ichiran Ramen',        cat: 'Food',      rating: 4.8, img: 'https://images.unsplash.com/photo-1762587757364-b9f8ed5ba39f?w=400&q=60',  saved: true  },
    { name: 'teamLab Borderless',   cat: 'Activity',  rating: 5.0, img: 'https://images.unsplash.com/photo-1770387795112-e2b476b15f71?w=400&q=60', saved: false },
    { name: 'Shibuya Sky Deck',     cat: 'Adventure', rating: 4.7, img: 'https://images.unsplash.com/photo-1752070493852-3c4554538293?w=400&q=60', saved: false },
  ];
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-[#2A4D3A]/8 rounded-2xl px-4 py-3">
        <Globe size={16} className="text-[#2A4D3A]" />
        <p className="text-sm font-semibold text-[#2A4D3A]">Exploring {city} & surroundings</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Culture', 'Food', 'Activity', 'Adventure', 'Hidden Gems'].map(cat => (
          <button key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
              activeFilter === cat ? 'bg-[#2A4D3A] text-white border-[#2A4D3A]' : 'bg-white border-slate-200 text-slate-500 hover:border-[#2A4D3A]/40 hover:text-[#2A4D3A]'
            }`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLACES.filter(p => activeFilter === 'All' || p.cat === activeFilter).map(p => (
          <div key={p.name} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group">
            <div className="relative h-32 overflow-hidden">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                <Star size={9} fill="#F5B041" stroke="#F5B041" />
                <span className="text-white text-[10px] font-bold">{p.rating}</span>
              </div>
              <button
                onClick={() => setSaved(prev => ({ ...prev, [p.name]: !prev[p.name] }))}
                className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md"
              >
                <span className="text-sm">{(saved[p.name] ?? p.saved) ? '❤️' : '🤍'}</span>
              </button>
            </div>
            <div className="p-3">
              <p className="font-bold text-slate-800 text-sm">{p.name}</p>
              <p className="text-slate-400 text-xs">{p.cat}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Safety Tab ────────────────────────────────────────────────────────────────
const SafetyTab = ({ trip }: { trip: Trip }) => {
  const city = trip.cities[0] || 'Tokyo';
  return (
    <div className="space-y-4">
      {/* Safety score */}
      <div className="bg-gradient-to-r from-[#2A4D3A] to-[#1B4332] rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Safety Score</p>
            <p className="text-4xl font-black mt-1">8.4<span className="text-xl text-white/50">/10</span></p>
            <p className="text-white/70 text-sm mt-1">{city} is generally very safe for tourists</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#F5B041]/20 flex items-center justify-center">
            <Shield size={28} className="text-[#F5B041]" />
          </div>
        </div>
      </div>

      {/* Emergency contacts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="font-bold text-slate-800 mb-3 text-sm">Emergency Numbers</p>
        <div className="space-y-2">
          {[
            { label: 'Police',     num: '110', icon: '🚔' },
            { label: 'Fire / EMT', num: '119', icon: '🚑' },
            { label: 'Embassy',    num: '+81-3-5562-5550', icon: '🏛️' },
            { label: 'Tourist Info', num: '03-3201-3331',  icon: 'ℹ️' },
          ].map(c => (
            <div key={c.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-2">
                <span>{c.icon}</span>
                <span className="text-sm text-slate-700 font-medium">{c.label}</span>
              </div>
              <a href={`tel:${c.num}`} className="text-sm font-bold text-[#2A4D3A] hover:underline">{c.num}</a>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {[
          { icon: '⚠️', title: 'Pickpocket Alert', desc: 'Stay aware in crowded areas. Keep bags in front and valuables close.', severity: 'warning' },
          { icon: '🌊', title: 'Weather Advisory',   desc: 'Check daily forecasts for your destination. Weather can change quickly.', severity: 'info'    },
          { icon: '✅', title: 'Travel Advisory',    desc: 'Your destination is currently rated as a safe travel zone.',           severity: 'safe'    },
        ].map(alert => (
          <div key={alert.title} className={`flex gap-3 p-4 rounded-2xl border ${
            alert.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
            alert.severity === 'info'    ? 'bg-blue-50 border-blue-200' :
            'bg-emerald-50 border-emerald-200'
          }`}>
            <span className="text-xl flex-shrink-0">{alert.icon}</span>
            <div>
              <p className={`font-bold text-sm ${
                alert.severity === 'warning' ? 'text-amber-800' :
                alert.severity === 'info'    ? 'text-blue-800' : 'text-emerald-800'
              }`}>{alert.title}</p>
              <p className={`text-xs mt-0.5 ${
                alert.severity === 'warning' ? 'text-amber-600' :
                alert.severity === 'info'    ? 'text-blue-600' : 'text-emerald-600'
              }`}>{alert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Insights Tab ──────────────────────────────────────────────────────────────
const InsightsTab = ({ trip }: { trip: Trip }) => {
  const hasAITips = (trip.aiTips?.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-[#2A4D3A]/8 rounded-2xl px-4 py-3">
        <Sparkles size={16} className="text-[#2A4D3A]" />
        <p className="text-sm font-bold text-[#2A4D3A]">AI-powered insights for {trip.title}</p>
      </div>

      {/* AI Tips from generation */}
      {hasAITips && (
        <div className="bg-gradient-to-r from-[#2A4D3A] to-[#1a3328] rounded-2xl p-5 shadow-lg">
          <p className="font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={16} className="text-[#F5B041]" /> Expert Tips for {trip.cities[0] || trip.destination}
          </p>
          <div className="space-y-3">
            {trip.aiTips!.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 bg-white/8 border border-white/10 rounded-xl p-3"
              >
                <p className="text-white/85 text-sm leading-relaxed">{tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* General insights */}
      {[
        { icon: Sun,    title: 'Best Time to Visit',  color: 'bg-amber-50 border-amber-200',     iconColor: 'text-amber-600',   tip: 'Research the optimal travel months for your destination to avoid peak crowds and extreme weather. Shoulder seasons often offer the best value.' },
        { icon: Wallet, title: 'Budget Optimization', color: 'bg-[#2A4D3A]/8 border-[#2A4D3A]/15', iconColor: 'text-[#2A4D3A]', tip: 'Consider booking flights 6-8 weeks in advance. Use local transport over taxis. Eat where locals eat for authentic food at a fraction of tourist prices.' },
        { icon: Users,  title: 'Crowd Prediction',    color: 'bg-blue-50 border-blue-200',        iconColor: 'text-blue-600',    tip: 'Visit popular attractions early morning or late afternoon. Weekdays are generally less crowded than weekends at major tourist sites.' },
        { icon: Globe,  title: 'Local Customs',       color: 'bg-violet-50 border-violet-200',    iconColor: 'text-violet-600',  tip: 'Research local customs, tipping culture, and dress codes before you travel. Respecting local norms enhances your experience and shows cultural sensitivity.' },
        { icon: Zap,    title: 'Trip Health Score',   color: 'bg-emerald-50 border-emerald-200',  iconColor: 'text-emerald-600', tip: `Your trip scores ${trip.healthScore}/100. ${trip.healthScore >= 80 ? 'Great planning!' : 'To improve: finalize accommodations, set a daily budget limit, and confirm transport between cities.'}` },
      ].map(({ icon: Icon, title, color, iconColor, tip }) => (
        <div key={title} className={`border rounded-2xl p-4 ${color}`}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Icon size={16} className={iconColor} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm mb-1">{title}</p>
              <p className="text-slate-600 text-xs leading-relaxed">{tip}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
export const TripWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTrip } = useTrips();
  const trip = getTrip(id ?? '') || TRIPS.find(t => t.id === id) || TRIPS[0];
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');

  return (
    <div className="space-y-5">

      {/* ── Back + header ── */}
      <Link to="/trips" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#2A4D3A] font-semibold transition-colors group">
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to My Trips
      </Link>

      {/* ── Hero card ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
        style={{ minHeight: 220 }}
      >
        <img src={trip.cover} alt={trip.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a12]/90 via-[#1B4332]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="relative p-6 md:p-8 flex flex-col h-full justify-between" style={{ minHeight: 220 }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${STATUS_COLOR[trip.status]}`}>
                  {trip.status}
                </span>
                {trip.aiGenerated && (
                  <span className="flex items-center gap-1 text-[10px] font-black bg-[#F5B041] text-[#2A4D3A] px-2.5 py-1 rounded-full">
                    <Sparkles size={9} /> AI Generated
                  </span>
                )}
                <span className="text-white/50 text-xs">{trip.travelType} · {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{trip.title}</h1>
              <p className="text-white/60 text-sm mt-1 flex items-center gap-1">
                <MapPin size={12} /> {trip.destination}
              </p>
              {(trip.highlights?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {trip.highlights!.slice(0, 3).map((h, i) => (
                    <span key={i} className="text-[10px] bg-white/10 backdrop-blur-sm text-white/80 px-2 py-0.5 rounded-full border border-white/15">✨ {h}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors border border-white/20">
                <Edit3 size={15} />
              </button>
              <button className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors border border-white/20">
                <Share2 size={15} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { icon: Calendar, label: `${trip.startDate} → ${trip.endDate}` },
              { icon: Clock,    label: `${trip.days} days`                    },
              { icon: Wallet,   label: `$${trip.budget.toLocaleString()} budget` },
              { icon: MapPin,   label: `${trip.cities.length} cities`         },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 text-white/80 text-xs bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/15">
                <s.icon size={11} /> {s.label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Trip Health ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#2A4D3A] flex items-center justify-center flex-shrink-0">
          <TrendingUp size={20} className="text-[#F5B041]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-bold text-slate-800 text-sm">Trip Health Score</p>
            <span className="font-black text-[#2A4D3A]">{trip.healthScore}/100</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${trip.healthScore}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#2A4D3A] to-[#F5B041]"
            />
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trip.healthScore >= 80 ? 'bg-emerald-100 text-emerald-700' : trip.healthScore >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
            {trip.healthScore >= 80 ? '🟢 Excellent' : trip.healthScore >= 60 ? '🟡 Good' : '🔴 Needs Work'}
          </span>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 overflow-x-auto scrollbar-none">
        <div className="flex gap-1 min-w-max">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === key
                  ? 'bg-[#2A4D3A] text-white shadow-sm'
                  : 'text-slate-400 hover:text-[#2A4D3A] hover:bg-[#2A4D3A]/5'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'itinerary' && <ItineraryTab trip={trip} />}
          {activeTab === 'budget'    && <BudgetTab trip={trip} />}
          {activeTab === 'packing'   && <PackingTab trip={trip} />}
          {activeTab === 'transport' && <TransportTab trip={trip} />}
          {activeTab === 'discover'  && <DiscoverTab trip={trip} />}
          {activeTab === 'safety'    && <SafetyTab trip={trip} />}
          {activeTab === 'insights'  && <InsightsTab trip={trip} />}
          {activeTab === 'memories'  && <MemoriesTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
