import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Map, Wallet, CheckSquare, FileText, Plane,
  Plus, Wand2, Globe, Search, Bell, ChevronRight, Settings,
  LogOut, Sparkles, Menu, X, MapPin, Briefcase, User,
  PlusCircle, ChevronDown,
} from 'lucide-react';
import { AIChatbot } from '../components/AIChatbot';
import { AIProvider } from '../context/AIContext';
import { useAuth } from '../context/AuthContext';

// ── Primary nav (simplified to 4 core screens) ──────────────────────────────
const PRIMARY_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/',          end: true  },
  { icon: Plane,           label: 'Plan Trip',  path: '/plan',      end: false },
  { icon: Briefcase,       label: 'My Trips',   path: '/trips',     end: false },
  { icon: Globe,           label: 'Community',  path: '/community', end: false },
];

const MOBILE_NAV = [
  { icon: LayoutDashboard, label: 'Home',      path: '/',          end: true  },
  { icon: PlusCircle,      label: 'Plan',      path: '/plan',      end: false },
  { icon: Briefcase,       label: 'My Trips',  path: '/trips',     end: false },
  { icon: Globe,           label: 'Community', path: '/community', end: false },
  { icon: User,            label: 'Profile',   path: '/profile',   end: false },
];

// ── Sidebar NavItem ───────────────────────────────────────────────────────────
const NavItem = ({ icon: Icon, label, path, end = false }: {
  icon: React.ElementType; label: string; path: string; end?: boolean;
}) => (
  <NavLink
    to={path}
    end={end}
    className={({ isActive }) =>
      `group flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
        isActive
          ? 'bg-[#F5B041] text-[#2A4D3A] shadow-sm'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon size={18} className={isActive ? 'text-[#2A4D3A]' : 'text-white/60 group-hover:text-white'} strokeWidth={isActive ? 2.5 : 2} />
        <span className="flex-1">{label}</span>
      </>
    )}
  </NavLink>
);

// ── Notifications ─────────────────────────────────────────────────────────────
const Notifications = () => {
  const [open, setOpen] = useState(false);
  const notes = [
    { icon: '✈️', text: 'Flight to Tokyo in 3 days',     time: '2h ago',  unread: true  },
    { icon: '💰', text: 'Budget alert: 85% used',        time: '5h ago',  unread: true  },
    { icon: '🌤️', text: 'Rain expected in Paris Jul 3',  time: '1d ago',  unread: false },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
      >
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
            onMouseLeave={() => setOpen(false)}
          >
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="font-bold text-slate-800">Notifications</p>
              <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">2 new</span>
            </div>
            {notes.map((n, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${n.unread ? 'bg-[#2A4D3A]/4' : ''}`}>
                <span className="text-xl flex-shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.unread ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                </div>
                {n.unread && <div className="w-2 h-2 rounded-full bg-[#2A4D3A] flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Profile button (top-right corner) ───────────────────────────────────────
const ProfileButton = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.initials ?? 'T';
  const displayName = user?.name ?? 'Traveler';
  const displayEmail = user?.email ?? '';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-2xl hover:bg-slate-100 transition-colors group"
      >
        <div className="w-8 h-8 rounded-xl bg-[#2A4D3A] flex items-center justify-center text-[#F5B041] text-xs font-black flex-shrink-0 shadow-sm">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-bold text-slate-800 leading-none">{displayName}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Pro Traveler</p>
        </div>
        <ChevronDown size={13} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''} hidden sm:block`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
            onMouseLeave={() => setOpen(false)}
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2A4D3A] flex items-center justify-center text-[#F5B041] text-sm font-black">{initials}</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{displayName}</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{displayEmail}</p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-[#2A4D3A]/5 hover:text-[#2A4D3A] transition-colors"
              >
                <User size={15} className="text-slate-400" /> My Profile
              </Link>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-[#2A4D3A]/5 hover:text-[#2A4D3A] transition-colors"
              >
                <Settings size={15} className="text-slate-400" /> Settings
              </Link>
              <Link
                to="/trips"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-[#2A4D3A]/5 hover:text-[#2A4D3A] transition-colors"
              >
                <Briefcase size={15} className="text-slate-400" /> My Trips
              </Link>
            </div>

            {/* Sign out */}
            <div className="border-t border-slate-100 pt-1 pb-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Search bar ────────────────────────────────────────────────────────────────
const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery]     = useState('');
  const navigate = useNavigate();
  const suggestions = ['Tokyo, Japan', 'Paris, France', 'Bali, Indonesia', 'Rome, Italy', 'Dubai, UAE'];
  const filtered = query ? suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <div className="relative flex-1 max-w-xs">
      <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
        focused ? 'bg-white border-[#2A4D3A]/40 shadow-md shadow-[#2A4D3A]/8' : 'bg-slate-100 border-transparent'
      }`}>
        <Search size={15} className={focused ? 'text-[#2A4D3A]' : 'text-slate-400'} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search destinations…"
          className="flex-1 text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
        />
        {query && <button onClick={() => setQuery('')} className="text-slate-300 hover:text-slate-500"><X size={13} /></button>}
      </div>
      <AnimatePresence>
        {focused && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50"
          >
            {filtered.map(s => (
              <button
                key={s}
                onMouseDown={() => { setQuery(s); navigate('/trips'); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-[#2A4D3A]/8 hover:text-[#2A4D3A] transition-colors text-left"
              >
                <MapPin size={13} className="text-slate-400 flex-shrink-0" /> {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Inner Layout ─────────────────────────────────────────────────────────────
const LayoutInner: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Auth guard — redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5B041] flex items-center justify-center shadow-xl">
            <Plane size={22} className="text-[#2A4D3A] stroke-[2.5]" />
          </div>
          <div className="w-6 h-6 border-2 border-[#2A4D3A]/20 border-t-[#2A4D3A] rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading Traveloop…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-none">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 flex-shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-[#F5B041] flex items-center justify-center shadow-lg shadow-[#F5B041]/30">
          <Plane size={20} className="text-[#2A4D3A] stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white leading-none">Traveloop</h1>
          <p className="text-white/40 text-[10px] font-medium mt-0.5">AI Travel Platform</p>
        </div>
      </div>

      {/* Plan trip CTA */}
      <div className="px-4 mb-6">
        <Link
          to="/plan"
          onClick={() => setMobileSidebarOpen(false)}
          className="flex items-center gap-3 w-full bg-[#F5B041] text-[#2A4D3A] text-sm font-black px-4 py-3.5 rounded-2xl hover:bg-[#e5a030] transition-colors shadow-lg shadow-[#F5B041]/25"
        >
          <PlusCircle size={20} />
          <span>Plan New Trip</span>
          <Sparkles size={14} className="ml-auto" />
        </Link>
      </div>

      {/* Main nav */}
      <div className="px-4 mb-2">
        <p className="text-white/25 text-[9px] font-black uppercase tracking-[0.2em] px-3 mb-2">Navigation</p>
        <nav className="space-y-1">
          {PRIMARY_NAV.map(item => (
            <div key={item.path} onClick={() => setMobileSidebarOpen(false)}>
              <NavItem {...item} />
            </div>
          ))}
        </nav>
      </div>

    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-[#FAFAF7] font-sans overflow-hidden">

      {/* ── Top Navbar ──────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-slate-200/80 flex items-center px-4 md:px-6 gap-4 z-30 shadow-sm">

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileSidebarOpen(p => !p)}
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500"
        >
          <Menu size={20} />
        </button>

        {/* Mobile logo */}
        <Link to="/" className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2A4D3A] flex items-center justify-center">
            <Plane size={14} className="text-[#F5B041] stroke-[2.5]" />
          </div>
          <span className="font-black text-slate-900">Traveloop</span>
        </Link>

        <div className="md:hidden flex-1" />

        {/* Search (desktop) */}
        <div className="hidden md:flex flex-1">
          <SearchBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <button className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
            <Search size={18} />
          </button>

          {/* Plan Trip (desktop) */}
          <Link
            to="/plan"
            className="hidden md:flex items-center gap-2 bg-[#2A4D3A] hover:bg-[#1f3d2d] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-md"
          >
            <Plus size={16} /> Plan Trip
          </Link>

          <Notifications />

          {/* Profile in top-right corner */}
          <ProfileButton />
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-[#2A4D3A] flex-shrink-0 overflow-hidden shadow-xl">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -272 }} animate={{ x: 0 }} exit={{ x: -272 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-68 bg-[#2A4D3A] z-50 shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F5B041] flex items-center justify-center">
                      <Plane size={15} className="text-[#2A4D3A] stroke-[2.5]" />
                    </div>
                    <span className="font-black text-white">Traveloop</span>
                  </div>
                  <button onClick={() => setMobileSidebarOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-none">
                  <SidebarContent />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-y-auto scrollbar-thin pb-20 md:pb-0">
            <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Nav ────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#2A4D3A] border-t border-white/10 z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.15)]">
        <div className="flex justify-around items-center h-16 px-2">
          {MOBILE_NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                  isActive ? 'text-[#F5B041]' : 'text-white/50'
                }`
              }
            >
              {({ isActive }) => (
                item.path === '/plan' ? (
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isActive ? 'bg-[#F5B041]' : 'bg-[#F5B041]/20'
                  }`}>
                    <item.icon size={20} className={isActive ? 'text-[#2A4D3A]' : 'text-[#F5B041]'} strokeWidth={2} />
                  </div>
                ) : (
                  <>
                    <item.icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                    <span className="text-[9px] font-bold">{item.label}</span>
                  </>
                )
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <AIChatbot />
    </div>
  );
};

export const MainLayout: React.FC = () => (
  <AIProvider>
    <LayoutInner />
  </AIProvider>
);