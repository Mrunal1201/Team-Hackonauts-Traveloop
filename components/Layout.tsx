import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import { Map, LayoutDashboard, User as UserIcon, LogOut, Compass } from 'lucide-react';
import { useTraveloop } from '../context/TraveloopContext';
import { motion, AnimatePresence } from 'motion/react';

export const Layout = () => {
  const { user, logout } = useTraveloop();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 flex flex-col md:flex-row">
      {/* Top Navbar (Mobile only) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-card shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-2 text-primary">
          <Compass size={24} />
          <span className="font-serif font-bold text-xl tracking-wide">Traveloop</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
          {user.name.charAt(0)}
        </div>
      </div>

      {/* Sidebar (Desktop only) */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2 text-primary border-b border-border">
          <Compass size={28} />
          <span className="font-serif font-bold text-2xl tracking-wide">Traveloop</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </NavLink>
          <NavLink
            to="/trips"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Map size={20} />
            <span className="font-medium">My Trips</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <UserIcon size={20} />
            <span className="font-medium">Profile</span>
          </NavLink>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-5xl mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-3 z-10 safe-area-bottom pb-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </NavLink>
        <NavLink
          to="/trips"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <Map size={24} />
          <span className="text-[10px] font-medium">Trips</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <UserIcon size={24} />
          <span className="text-[10px] font-medium">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};
