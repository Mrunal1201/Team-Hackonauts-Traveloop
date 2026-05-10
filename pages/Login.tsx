import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane, Mail, Lock, User, Eye, EyeOff, ArrowRight,
  Check, Sparkles, AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const BG = 'https://images.unsplash.com/photo-1751666021843-c238450c6fbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';
const SANTORINI = 'https://images.unsplash.com/photo-1743664039044-34898c6bed3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

type Mode = 'login' | 'signup' | 'forgot';

const STATS = [
  { value: '2.4M', label: 'Trips Planned' },
  { value: '195',  label: 'Countries'     },
  { value: '4.9 ★', label: 'App Rating'  },
];

export const Login: React.FC = () => {
  const navigate              = useNavigate();
  const { user, login, signup } = useAuth();

  const [mode, setMode]         = useState<Mode>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  // If already logged in, go to dashboard
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.includes('@'))       e.email    = 'Enter a valid email';
    if (mode !== 'forgot') {
      if (password.length < 6)      e.password = 'At least 6 characters';
      if (mode === 'signup') {
        if (!name.trim())           e.name     = 'Name is required';
        if (confirm !== password)   e.confirm  = 'Passwords do not match';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/', { replace: true });
      } else if (mode === 'signup') {
        await signup(email, password, name);
        navigate('/', { replace: true });
      } else if (mode === 'forgot') {
        // Forgot password is UI-only for now
        await new Promise(r => setTimeout(r, 1000));
        setServerError('');
        setMode('login');
      }
    } catch (err: any) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-white/10 border ${errors[field] ? 'border-red-400/60' : 'border-white/20'} rounded-2xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#F5B041]/60 focus:bg-white/15 transition-all text-sm`;

  return (
    <div className="min-h-screen w-full flex overflow-hidden">

      {/* ── Left panel ── */}
      <div className="relative hidden lg:flex lg:w-[55%] flex-col">
        <img src={BG} alt="travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0e]/85 via-[#1B4332]/70 to-[#2A4D3A]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Floating destination card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-20 right-10 glass-dark rounded-2xl p-4 shadow-2xl w-52 bg-black/30 backdrop-blur-md border border-white/10"
        >
          <img src={SANTORINI} alt="santorini" className="rounded-xl h-24 w-full object-cover mb-3" />
          <p className="text-white font-bold text-sm">Santorini, Greece</p>
          <p className="text-white/50 text-xs">⭐ 5.0 · From $1,400</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-32 left-10 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-2xl"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">✈️</span>
            <div>
              <p className="text-white font-bold text-sm">Tokyo → Paris</p>
              <p className="text-white/50 text-xs">Departs Jun 10 · 45 days</p>
            </div>
          </div>
        </motion.div>

        {/* Logo + Tagline */}
        <div className="relative p-10 mt-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-[#F5B041] flex items-center justify-center shadow-xl">
              <Plane size={20} className="text-[#2A4D3A] stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight leading-none">Traveloop</h1>
              <p className="text-white/50 text-xs mt-0.5">AI Travel Platform</p>
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-3 leading-tight">
            Plan the trip<br />
            <span className="text-[#F5B041]">you deserve.</span>
          </h2>
          <p className="text-white/60 mb-8 max-w-sm leading-relaxed">
            AI-powered itineraries, smart budgets, and a community of 480k travelers — all in one place.
          </p>
          <div className="flex gap-6">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-[#F5B041] font-black text-2xl">{s.value}</p>
                <p className="text-white/50 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — auth form ── */}
      <div className="flex-1 bg-[#0f1a12] flex items-center justify-center p-6 relative overflow-y-auto">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(42,77,58,.4) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(245,176,65,.08) 0%, transparent 60%)' }}
        />

        <div className="relative w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#F5B041] flex items-center justify-center">
              <Plane size={17} className="text-[#2A4D3A] stroke-[2.5]" />
            </div>
            <span className="text-xl font-black text-white">Traveloop</span>
          </div>

          {/* Mode switcher */}
          <AnimatePresence mode="wait">
            {mode !== 'forgot' ? (
              <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-8">
                {(['login', 'signup'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setErrors({}); setServerError(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                      mode === m
                        ? 'bg-[#F5B041] text-[#2A4D3A] shadow-lg'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {m === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-8">
                <button onClick={() => { setMode('login'); setErrors({}); setServerError(''); }}
                  className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors mb-4">
                  ← Back to Sign In
                </button>
              </div>
            )}
          </AnimatePresence>

          {/* Heading */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-black text-white leading-tight">
              {mode === 'login'  && 'Welcome back 👋'}
              {mode === 'signup' && 'Join 480k travelers'}
              {mode === 'forgot' && 'Reset your password'}
            </h2>
            <p className="text-white/40 text-sm mt-1.5">
              {mode === 'login'  && 'Sign in to continue planning your adventures.'}
              {mode === 'signup' && 'Create a free account and start your first trip today.'}
              {mode === 'forgot' && "We'll send a reset link to your email."}
            </p>
          </motion.div>

          {/* Server error banner */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-red-500/15 border border-red-500/30 rounded-2xl px-4 py-3 mb-5"
            >
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{serverError}</p>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            key={`form-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {mode === 'signup' && (
              <div>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Full name"
                    autoComplete="name"
                    className={`${inputClass('name')} pl-11`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1 pl-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className={`${inputClass('email')} pl-11`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 pl-1">{errors.email}</p>}
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className={`${inputClass('password')} pl-11 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1 pl-1">{errors.password}</p>}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    className={`${inputClass('confirm')} pl-11`}
                  />
                </div>
                {errors.confirm && <p className="text-red-400 text-xs mt-1 pl-1">{errors.confirm}</p>}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setRemember(p => !p)}
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      remember ? 'bg-[#F5B041] border-[#F5B041]' : 'border-white/20'
                    }`}
                  >
                    {remember && <Check size={10} className="text-[#2A4D3A] stroke-[3]" />}
                  </div>
                  <span className="text-white/50 text-xs">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setErrors({}); setServerError(''); }}
                  className="text-[#F5B041] text-xs hover:text-[#F5B041]/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#F5B041] hover:bg-[#e5a030] disabled:opacity-60 text-[#2A4D3A] font-black py-4 rounded-2xl transition-all shadow-xl shadow-[#F5B041]/20 active:scale-[.98] mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-[#2A4D3A]/30 border-t-[#2A4D3A] rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login'  && <>Sign In <ArrowRight size={18} /></>}
                  {mode === 'signup' && <>Create Account <Sparkles size={16} /></>}
                  {mode === 'forgot' && <>Send Reset Link <ArrowRight size={18} /></>}
                </>
              )}
            </button>
          </motion.form>

          {/* Features list for signup */}
          {mode === 'signup' && (
            <div className="mt-6 space-y-2">
              {['Free forever plan', 'AI trip generator included', 'Join 480k traveler community'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#F5B041]/20 flex items-center justify-center flex-shrink-0">
                    <Check size={9} className="text-[#F5B041]" />
                  </div>
                  <span className="text-white/40 text-xs">{f}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-white/20 text-[10px] text-center mt-8">
            By continuing, you agree to Traveloop's Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
