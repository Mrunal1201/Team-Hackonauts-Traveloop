import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { type Trip } from '../data/tripsData';
import { useAuth } from './AuthContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const SERVER_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-191b52e6`;

interface TripsContextType {
  trips:      Trip[];
  loading:    boolean;
  addTrip:    (trip: Trip) => Promise<void>;
  removeTrip: (id: string) => Promise<void>;
  updateTrip: (trip: Trip) => Promise<void>;
  getTrip:    (id: string) => Trip | undefined;
  refetch:    () => Promise<void>;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

// ── Helpers ────────────────────────────────────────────────────────────────────
const LS_KEY = 'traveloop_trips_v2';

const cacheTrips = (trips: Trip[]) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(trips)); } catch { /* ignore */ }
};

const readCache = (): Trip[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

// ── Provider ───────────────────────────────────────────────────────────────────
export const TripsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, accessToken } = useAuth();
  const [trips,   setTrips]   = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // ── API helper ───────────────────────────────────────────────────────────────
  const authHeader = useCallback(() => ({
    'Authorization': `Bearer ${accessToken ?? publicAnonKey}`,
    'Content-Type':  'application/json',
  }), [accessToken]);

  // ── Fetch from server ────────────────────────────────────────────────────────
  const fetchTrips = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res  = await fetch(`${SERVER_BASE}/trips`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) {
        console.log('Fetch trips error:', data.error);
        return;
      }
      const serverTrips: Trip[] = data.trips || [];
      setTrips(serverTrips);
      cacheTrips(serverTrips);
    } catch (e) {
      console.log('Fetch trips exception:', e);
      // Fall back to local cache on network error
      const cached = readCache();
      if (cached.length) setTrips(cached);
    }
  }, [accessToken, authHeader]);

  // ── Re-fetch when user changes ───────────────────────────────────────────────
  useEffect(() => {
    if (!user || !accessToken) {
      // Not logged in: clear trips
      setTrips([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchTrips().finally(() => setLoading(false));
  }, [user?.id, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── CRUD: Add trip ──────────────────────────────────────────────────────────
  const addTrip = useCallback(async (trip: Trip) => {
    // Optimistic update
    setTrips(prev => {
      if (prev.find(t => t.id === trip.id)) return prev;
      const next = [trip, ...prev];
      cacheTrips(next);
      return next;
    });

    if (!accessToken) return;
    try {
      const res = await fetch(`${SERVER_BASE}/trips`, {
        method:  'POST',
        headers: authHeader(),
        body:    JSON.stringify(trip),
      });
      if (!res.ok) {
        const d = await res.json();
        console.log('Create trip error:', d.error);
      }
    } catch (e) {
      console.log('Create trip exception:', e);
    }
  }, [accessToken, authHeader]);

  // ── CRUD: Remove trip ────────────────────────────────────────────────────────
  const removeTrip = useCallback(async (id: string) => {
    // Optimistic update
    setTrips(prev => {
      const next = prev.filter(t => t.id !== id);
      cacheTrips(next);
      return next;
    });

    if (!accessToken) return;
    try {
      const res = await fetch(`${SERVER_BASE}/trips/${id}`, {
        method:  'DELETE',
        headers: authHeader(),
      });
      if (!res.ok) {
        const d = await res.json();
        console.log('Delete trip error:', d.error);
      }
    } catch (e) {
      console.log('Delete trip exception:', e);
    }
  }, [accessToken, authHeader]);

  // ── CRUD: Update trip ────────────────────────────────────────────────────────
  const updateTrip = useCallback(async (trip: Trip) => {
    // Optimistic update
    setTrips(prev => {
      const next = prev.map(t => t.id === trip.id ? trip : t);
      cacheTrips(next);
      return next;
    });

    if (!accessToken) return;
    try {
      const res = await fetch(`${SERVER_BASE}/trips/${trip.id}`, {
        method:  'PUT',
        headers: authHeader(),
        body:    JSON.stringify(trip),
      });
      if (!res.ok) {
        const d = await res.json();
        console.log('Update trip error:', d.error);
      }
    } catch (e) {
      console.log('Update trip exception:', e);
    }
  }, [accessToken, authHeader]);

  const getTrip = useCallback((id: string) => trips.find(t => t.id === id), [trips]);

  return (
    <TripsContext.Provider value={{ trips, loading, addTrip, removeTrip, updateTrip, getTrip, refetch: fetchTrips }}>
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips must be used inside TripsProvider');
  return ctx;
};