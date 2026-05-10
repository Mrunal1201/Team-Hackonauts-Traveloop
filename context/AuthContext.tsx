import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const SERVER_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-191b52e6`;

// LocalStorage keys
const LS_TOKEN = 'traveloop_access_token';
const LS_USER  = 'traveloop_user_v2';

export interface AuthUser {
  id:       string;
  email:    string;
  name:     string;
  initials: string;
}

interface AuthContextType {
  user:        AuthUser | null;
  accessToken: string | null;
  loading:     boolean;
  signup:        (email: string, password: string, name: string) => Promise<void>;
  login:         (email: string, password: string) => Promise<void>;
  logout:        () => Promise<void>;
  updateProfile: (profile: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildUser(raw: Record<string, any>): AuthUser {
  const name     = (raw.user_metadata?.name as string) || raw.email?.split('@')[0] || 'Traveler';
  const initials = name.split(' ').map((w: string) => w[0] ?? '').join('').toUpperCase().slice(0, 2) || 'T';
  return { id: raw.id, email: raw.email ?? '', name, initials };
}

function persistSession(token: string, user: AuthUser) {
  try {
    localStorage.setItem(LS_TOKEN, token);
    localStorage.setItem(LS_USER, JSON.stringify(user));
  } catch { /* ignore */ }
}

function clearSession() {
  try {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
  } catch { /* ignore */ }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user,        setUser]        = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading,     setLoading]     = useState(true);

  // ── Restore session from localStorage on mount ─────────────────────────────
  useEffect(() => {
    try {
      const token   = localStorage.getItem(LS_TOKEN);
      const stored  = localStorage.getItem(LS_USER);
      if (token && stored) {
        setAccessToken(token);
        setUser(JSON.parse(stored) as AuthUser);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  // ── Sign Up ────────────────────────────────────────────────────────────────
  const signup = async (email: string, password: string, name: string): Promise<void> => {
    const res  = await fetch(`${SERVER_BASE}/auth/signup`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body:    JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Signup failed');

    // Immediately sign in so we get a session token
    await login(email, password);
  };

  // ── Sign In ────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<void> => {
    const res  = await fetch(`${SERVER_BASE}/auth/signin`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Sign in failed');

    const authUser = buildUser(data.user);
    setUser(authUser);
    setAccessToken(data.access_token);
    persistSession(data.access_token, authUser);
  };

  // ── Sign Out ───────────────────────────────────────────────────────────────
  const logout = async (): Promise<void> => {
    setUser(null);
    setAccessToken(null);
    clearSession();
  };

  // ── Update local user info (after profile save) ────────────────────────────
  const updateProfile = (profile: Partial<AuthUser>): void => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...profile };
      try { localStorage.setItem(LS_USER, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
