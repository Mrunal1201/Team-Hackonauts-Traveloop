import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  AreaChart, Area, XAxis, YAxis, ReferenceLine, CartesianGrid,
  BarChart, Bar,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, AlertTriangle, TrendingUp, Brain, X, Plus, Sparkles } from 'lucide-react';

const COLORS = ['#2A4D3A', '#F5B041', '#4F46E5', '#10B981', '#F43F5E'];

// Smart Budget Prediction data
const PROJECTION_DATA = [
  { week: 'Pre-trip', actual: 2150, predicted: 2150, budget: 5000 },
  { week: 'Wk 1', actual: null, predicted: 2600, budget: 5000 },
  { week: 'Wk 2', actual: null, predicted: 3050, budget: 5000 },
  { week: 'Wk 3', actual: null, predicted: 3450, budget: 5000 },
  { week: 'Wk 4', actual: null, predicted: 3800, budget: 5000 },
  { week: 'Wk 5', actual: null, predicted: 4100, budget: 5000 },
  { week: 'Wk 6', actual: null, predicted: 4300, budget: 5000 },
];

const AI_TIPS = [
  { id: 1, text: 'Book Paris museum passes online — save $28 vs. door price.', savings: 28, category: 'Activities' },
  { id: 2, text: 'Cook 2 meals/week in your Airbnb — saves ~$90 over the trip.', savings: 90, category: 'Food' },
  { id: 3, text: 'Travel between cities on Tuesday/Wednesday — avg 22% cheaper.', savings: 180, category: 'Transport' },
  { id: 4, text: 'Activate a travel credit card with no FX fees — save ~2.5% on all purchases.', savings: 54, category: 'Misc' },
];

export const Budget: React.FC = () => {
  const { activeTrip } = useTrip();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<'Flights' | 'Hotels' | 'Food' | 'Activities' | 'Miscellaneous'>('Food');
  const [showPrediction, setShowPrediction] = useState(true);
  const { addExpense } = useTrip();

  if (!activeTrip) return null;

  const expensesByCategory = activeTrip.expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByCategory).map(key => ({ name: key, value: expensesByCategory[key] }));
  const totalSpent = activeTrip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = activeTrip.budget - totalSpent;
  const percentSpent = (totalSpent / activeTrip.budget) * 100;
  const predictedTotal = 4300;
  const predictedSavings = activeTrip.budget - predictedTotal;
  const totalAISavings = AI_TIPS.reduce((s, t) => s + t.savings, 0);

  const handleAddExpense = () => {
    if (!newDesc || !newAmount) return;
    addExpense({
      id: `ex-${Date.now()}`,
      category: newCategory,
      amount: parseFloat(newAmount),
      date: new Date().toISOString().split('T')[0],
      description: newDesc,
    });
    setNewDesc('');
    setNewAmount('');
    setShowAddExpense(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#2A4D3A]">Budget Tracker</h1>
          <p className="text-slate-500 mt-1">AI-powered spending intelligence.</p>
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className="bg-[#2A4D3A] text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-[#1f382a] transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Expense</span>
        </button>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddExpense(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-[#2A4D3A]">Add Expense</h2>
                <button onClick={() => setShowAddExpense(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Description</label>
                  <input
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="e.g. Dinner in Shibuya"
                    className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Amount (USD)</label>
                    <input
                      type="number"
                      value={newAmount}
                      onChange={e => setNewAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Category</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-3 py-3 text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40 text-sm"
                    >
                      {['Flights', 'Hotels', 'Food', 'Activities', 'Miscellaneous'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddExpense}
                  className="w-full bg-[#2A4D3A] text-white py-3 rounded-xl font-bold hover:bg-[#1f382a] transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-[#2A4D3A] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <p className="text-white/80 font-medium mb-1">Total Budget</p>
          <h2 className="text-4xl font-bold">${activeTrip.budget.toLocaleString()}</h2>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <DollarSign size={120} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-medium mb-1">Total Spent</p>
          <h2 className="text-4xl font-bold text-slate-800">${totalSpent.toLocaleString()}</h2>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${percentSpent > 90 ? 'bg-red-500' : 'bg-[#F5B041]'}`}
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{percentSpent.toFixed(1)}% of budget used</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-slate-500 font-medium mb-1">Remaining</p>
            <h2 className={`text-4xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-[#10B981]'}`}>
              ${remaining.toLocaleString()}
            </h2>
          </div>
          {remaining < activeTrip.budget * 0.15 && (
            <div className="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 px-3 py-2 rounded-lg mt-4">
              <AlertTriangle size={16} />
              <span>Nearing budget limit!</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Smart Budget Prediction ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2A4D3A]/10 rounded-xl">
              <Brain size={20} className="text-[#2A4D3A]" />
            </div>
            <div>
              <h3 className="font-bold text-[#2A4D3A]">Smart Budget Prediction</h3>
              <p className="text-xs text-slate-400">AI-powered spend forecast for your 45-day trip</p>
            </div>
          </div>
          <button
            onClick={() => setShowPrediction(p => !p)}
            className="text-sm font-semibold text-[#F5B041] hover:underline"
          >
            {showPrediction ? 'Hide' : 'Show'}
          </button>
        </div>

        <AnimatePresence>
          {showPrediction && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                {/* Prediction summary */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                    <div className="text-xs text-emerald-600 font-semibold mb-1">AI Predicted Total</div>
                    <div className="font-bold text-emerald-700 text-2xl">${predictedTotal.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#F5B041]/10 border border-[#F5B041]/20 rounded-2xl p-4 text-center">
                    <div className="text-xs text-[#F5B041] font-semibold mb-1">Projected Savings</div>
                    <div className="font-bold text-[#2A4D3A] text-2xl">${predictedSavings.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#2A4D3A]/5 border border-[#2A4D3A]/10 rounded-2xl p-4 text-center">
                    <div className="text-xs text-[#2A4D3A] font-semibold mb-1">Daily Avg</div>
                    <div className="font-bold text-[#2A4D3A] text-2xl">$96</div>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PROJECTION_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                      <defs>
                        <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2A4D3A" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#2A4D3A" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F5B041" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#F5B041" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis hide domain={[0, 5500]} />
                      <RechartsTooltip
                        formatter={(v, name) => [v ? `$${v.toLocaleString()}` : '—', name === 'actual' ? 'Actual Spend' : name === 'predicted' ? 'AI Prediction' : 'Budget']}
                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                      />
                      <ReferenceLine y={5000} stroke="#F43F5E" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Budget Limit', fill: '#F43F5E', fontSize: 10, position: 'insideTopRight' }} />
                      <Area type="monotone" dataKey="predicted" stroke="#F5B041" strokeWidth={2} strokeDasharray="6 3" fill="url(#predGrad)" connectNulls={false} />
                      <Area type="monotone" dataKey="actual" stroke="#2A4D3A" strokeWidth={2.5} fill="url(#actualGrad)" connectNulls={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-[#2A4D3A] inline-block rounded" />Actual</span>
                  <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-[#F5B041] inline-block rounded" />AI Forecast</span>
                  <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-red-400 inline-block rounded border-dashed" />Budget Limit</span>
                </div>

                {/* AI savings tips */}
                <div className="mt-6 bg-gradient-to-r from-[#2A4D3A]/5 to-[#F5B041]/5 rounded-2xl p-4 border border-[#2A4D3A]/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-[#F5B041]" />
                    <h4 className="font-bold text-[#2A4D3A] text-sm">AI Savings Opportunities — save up to ${totalAISavings}</h4>
                  </div>
                  <div className="space-y-2">
                    {AI_TIPS.map(tip => (
                      <div key={tip.id} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-slate-100">
                        <div className="w-14 flex-shrink-0 bg-emerald-50 rounded-lg p-2 text-center">
                          <div className="text-xs font-bold text-emerald-600">+${tip.savings}</div>
                          <div className="text-[9px] text-emerald-500">saved</div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Charts area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center"
        >
          <h3 className="text-lg font-bold text-[#2A4D3A] w-full mb-4">By Category</h3>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `$${value}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-2 mt-2">
            {pieData.map((data, index) => (
              <div key={data.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-slate-600 font-medium">{data.name}</span>
                </div>
                <span className="font-semibold text-slate-800">${data.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#2A4D3A]">Recent Expenses</h3>
            <div className="p-2 bg-[#2A4D3A]/5 rounded-lg text-[#2A4D3A]">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="space-y-3">
            {activeTrip.expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-4 bg-[#FDFBF7] rounded-2xl border border-slate-100 hover:border-[#F5B041]/30 transition-colors">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800">{expense.description}</span>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full">{expense.category}</span>
                  </div>
                </div>
                <span className="font-bold text-[#2A4D3A] text-lg">${expense.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
