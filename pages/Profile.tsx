import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Phone, MapPin, Edit3, Camera, Globe, Star,
  Plane, Calendar, Wallet, Award, Lock,
  LogOut, ChevronRight, Check, Shield,
} from 'lucide-react';
import { useTrips } from '../context/TripsContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const SERVER_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-191b52e6`;

const AVATAR_BG = 'https://images.unsplash.com/photo-1743664039044-34898c6bed3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

const BADGES = [
  { icon: '✈️', label: 'Frequent Flyer',   desc: '10+ trips',     earned: true  },
  { icon: '🌍', label: 'Globetrotter',     desc: '20+ countries', earned: true  },
  { icon: '🏔️', label: 'Adventure Seeker', desc: '5 treks',       earned: true  },
  { icon: '📸', label: 'Memory Maker',     desc: '100+ photos',   earned: true  },
  { icon: '💰', label: 'Budget Master',    desc: 'Under budget',  earned: false },
  { icon: '🤝', label: 'Community Star',   desc: '50+ shares',    earned: false },
];

const COUNTRIES = ['🇯🇵 Japan', '🇫🇷 France', '🇮🇹 Italy', '🇹🇭 Thailand', '🇮🇩 Indonesia', '🇬🇷 Greece', '🇦🇷 Argentina', '🇦🇪 UAE'];

type ProfileSection = 'overview' | 'settings' | 'privacy';

export const Profile: React.FC = () => {
  const { trips }                            = useTrips();
  const { user, accessToken, logout, updateProfile } = useAuth();
  const navigate                             = useNavigate();
  const [section, setSection]   = useState<ProfileSection>('overview');
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);

  // Editable profile fields — seeded from auth user
  const [name, setName]         = useState(user?.name ?? '');
  const [bio, setBio]           = useState('Travel addict & coffee lover. Always planning the next escape. 🌏');
  const [email, setEmail]       = useState(user?.email ?? '');
  const [phone, setPhone]       = useState('');
  const [location, setLocation] = useState('');

  const [notifTrip, setNotifTrip]       = useState(true);
  const [notifWeather, setNotifWeather] = useState(true);
  const [notifCom, setNotifCom]         = useState(false);
  const [pubProfile, setPubProfile]     = useState(true);

  // Load saved profile from DB
  useEffect(() => {
    if (!accessToken) return;
    fetch(`${SERVER_BASE}/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(r => r.json())
      .then(({ profile }) => {
        if (!profile) return;
        if (profile.name)     setName(profile.name);
        if (profile.bio)      setBio(profile.bio);
        if (profile.phone)    setPhone(profile.phone);
        if (profile.location) setLocation(profile.location);
      })
      .catch(e => console.log('Load profile error:', e));
  }, [accessToken]);

  // Sync name/email from auth user when they load
  useEffect(() => {
    if (user?.name)  setName(n  => n  || user.name);
    if (user?.email) setEmail(e => e  || user.email);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const profileData = { name, bio, email, phone, location };
      if (accessToken) {
        await fetch(`${SERVER_BASE}/profile`, {
          method:  'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body:    JSON.stringify(profileData),
        });
      }
      updateProfile({ name });
    } catch (e) {
      console.log('Save profile error:', e);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const completedTrips = trips.filter(t => t.status === 'Completed').length;
  const totalBudget    = trips.reduce((s, t) => s + t.budget, 0);
  const totalDays      = trips.reduce((s, t) => s + t.days, 0);
  const initials       = user?.initials ?? (name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'T');

  const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
    <button
      onClick={toggle}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${on ? 'bg-[#2A4D3A]' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* ── Profile hero card ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Cover */}
        <div className="relative h-32 overflow-hidden">
          <img src={AVATAR_BG} alt="cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A4D3A]/80 to-[#1B4332]/60" />
          <button className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-black/50 transition-colors border border-white/20">
            <Camera size={12} /> Edit Cover
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#2A4D3A] flex items-center justify-center border-4 border-white shadow-xl">
                <span className="text-3xl font-black text-[#F5B041]">{initials}</span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[#F5B041] flex items-center justify-center shadow-md hover:bg-[#e5a030] transition-colors">
                <Camera size={13} className="text-[#2A4D3A]" />
              </button>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
              className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-60 ${
                editing ? 'bg-[#2A4D3A] text-white' : 'border border-slate-200 text-slate-600 hover:border-[#2A4D3A]/40'
              }`}
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : editing ? (
                <><Check size={14} /> Save</>
              ) : (
                <><Edit3 size={14} /> Edit Profile</>
              )}
            </button>
          </div>

          {/* Name + bio */}
          {editing ? (
            <div className="space-y-3">
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full text-xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2A4D3A]/40"
              />
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2}
                className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2A4D3A]/40 resize-none"
              />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-slate-900">{name || 'Traveler'}</h1>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">{bio}</p>
            </>
          )}

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {[
              { icon: Mail,   value: email,    setter: setEmail    },
              { icon: Phone,  value: phone,    setter: setPhone    },
              { icon: MapPin, value: location, setter: setLocation },
            ].map(({ icon: Icon, value, setter }) => (
              <div key={value || Icon.displayName} className="flex items-center gap-2.5 text-sm text-slate-600">
                <Icon size={14} className="text-slate-400 flex-shrink-0" />
                {editing
                  ? <input value={value} onChange={e => setter(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2A4D3A]/40"
                    />
                  : <span className="text-xs">{value || <span className="text-slate-300 italic">Not set</span>}</span>
                }
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Plane,    label: 'Total Trips',   value: trips.length,     color: 'text-[#2A4D3A]', bg: 'bg-[#2A4D3A]/8' },
          { icon: Globe,    label: 'Countries',     value: COUNTRIES.length, color: 'text-blue-600',  bg: 'bg-blue-50'      },
          { icon: Calendar, label: 'Days Traveled', value: `${totalDays}d`,  color: 'text-violet-600',bg: 'bg-violet-50'    },
          { icon: Star,     label: 'Avg Rating',    value: '4.9 ★',         color: 'text-[#F5B041]', bg: 'bg-[#F5B041]/10' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center"
          >
            <div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <s.icon size={15} className={s.color} />
            </div>
            <p className={`font-black text-xl ${s.color}`}>{s.value}</p>
            <p className="text-slate-400 text-xs">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Section nav ── */}
      <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-1.5">
        {([['overview', 'Overview'], ['settings', 'Settings'], ['privacy', 'Privacy']] as const).map(([s, l]) => (
          <button key={s} onClick={() => setSection(s)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${section === s ? 'bg-[#2A4D3A] text-white shadow-sm' : 'text-slate-400 hover:text-[#2A4D3A]'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ── Section content ── */}
      <AnimatePresence mode="wait">
        {section === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="font-bold text-slate-800 mb-4">Travel Badges</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {BADGES.map(b => (
                  <div key={b.label} className={`flex flex-col items-center gap-1 p-3 rounded-2xl text-center ${b.earned ? 'bg-[#2A4D3A]/8' : 'bg-slate-50 opacity-50'}`}>
                    <span className="text-2xl">{b.icon}</span>
                    <p className="text-[10px] font-bold text-slate-700 leading-tight">{b.label}</p>
                    <p className="text-[9px] text-slate-400">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="font-bold text-slate-800 mb-3">Countries Visited <span className="text-slate-400 font-normal text-sm">({COUNTRIES.length})</span></p>
              <div className="flex flex-wrap gap-2">
                {COUNTRIES.map(c => (
                  <span key={c} className="text-xs bg-[#2A4D3A]/8 text-[#2A4D3A] font-semibold px-3 py-1.5 rounded-full">{c}</span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#2A4D3A] to-[#1B4332] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5B041]/20 flex items-center justify-center">
                  <Award size={20} className="text-[#F5B041]" />
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider font-bold">Travel Personality</p>
                  <p className="font-black text-lg">The Explorer 🧭</p>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">You love diving deep into cultures, seeking out hidden gems, and building multi-city adventures. You're the trip planner everyone relies on.</p>
            </div>
          </motion.div>
        )}

        {section === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100"
          >
            <div className="px-5 py-4">
              <p className="font-bold text-slate-800 text-sm mb-3">Notifications</p>
              {[
                { label: 'Trip reminders',    sub: 'Alerts before departures',   on: notifTrip,    toggle: () => setNotifTrip(p => !p)    },
                { label: 'Weather alerts',    sub: 'Forecast for your cities',   on: notifWeather, toggle: () => setNotifWeather(p => !p) },
                { label: 'Community updates', sub: 'Replies and mentions',       on: notifCom,     toggle: () => setNotifCom(p => !p)     },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                  <Toggle on={item.on} toggle={item.toggle} />
                </div>
              ))}
            </div>
            <div className="px-5 py-4">
              <p className="font-bold text-slate-800 text-sm mb-3">Account</p>
              {[
                { icon: Lock,   label: 'Change Password', sub: 'Update your password'       },
                { icon: Globe,  label: 'Language',        sub: 'English (US)'               },
                { icon: Wallet, label: 'Subscription',    sub: 'Pro Plan · $9.99/mo'        },
              ].map(({ icon: Icon, label, sub }) => (
                <button key={label} className="w-full flex items-center justify-between py-3 hover:bg-slate-50 -mx-1 px-1 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Icon size={15} className="text-slate-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-700">{label}</p>
                      <p className="text-xs text-slate-400">{sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              ))}
            </div>
            <div className="px-5 py-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 py-3 text-red-500 hover:bg-red-50 -mx-1 px-1 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                  <LogOut size={15} className="text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Sign Out</p>
                  <p className="text-xs text-red-300">You'll need to sign in again</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {section === 'privacy' && (
          <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100"
          >
            <div className="px-5 py-4">
              <p className="font-bold text-slate-800 text-sm mb-3">Visibility</p>
              {[
                { label: 'Public Profile', sub: 'Other travelers can view your profile', on: pubProfile, toggle: () => setPubProfile(p => !p) },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                  <Toggle on={item.on} toggle={item.toggle} />
                </div>
              ))}
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <Shield size={20} className="text-[#2A4D3A] flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Data & Privacy</p>
                  <p className="text-slate-400 text-xs">Traveloop stores your data securely on Supabase. We never share your personal information with third parties.</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-4">
              <button className="text-red-500 text-sm font-semibold hover:underline">Delete Account</button>
              <p className="text-slate-400 text-xs mt-1">This will permanently delete all your trips, data and memories.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Remove the duplicate stub functions at the bottom ──