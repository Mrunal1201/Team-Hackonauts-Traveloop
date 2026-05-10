import React, { createContext, useContext, useEffect, useState } from 'react';

export type ItineraryItem = {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  type: 'transport' | 'hotel' | 'activity' | 'food';
};

export type Expense = {
  id: string;
  category: 'Flights' | 'Hotels' | 'Food' | 'Activities' | 'Miscellaneous';
  amount: number;
  date: string;
  description: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  packed: boolean;
};

export type ChecklistCategory = {
  id: string;
  name: string;
  items: ChecklistItem[];
};

export type Note = {
  id: string;
  date: string;
  content: string;
};

export type Trip = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  budget: number;
  healthScore: number;
  itinerary: ItineraryItem[];
  expenses: Expense[];
  checklist: ChecklistCategory[];
  notes: Note[];
};

interface TripContextType {
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip) => void;
  updateItinerary: (items: ItineraryItem[]) => void;
  addExpense: (expense: Expense) => void;
  updateChecklistItem: (categoryId: string, itemId: string, packed: boolean) => void;
  saveNote: (note: Note) => void;
  isLoading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const SEED_DATA: Trip = {
  id: 'trip-1',
  name: 'Asia-Europe Loop',
  startDate: '2026-06-10',
  endDate: '2026-07-25',
  coverImage: 'https://images.unsplash.com/photo-1593839154339-377e24b3ba32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHl8ZW58MXx8fHwxNzc4MzY1NTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  budget: 5000,
  healthScore: 85,
  itinerary: [
    { id: 'it-1', day: 1, time: '10:00 AM', activity: 'Flight to Tokyo', location: 'JFK', type: 'transport' },
    { id: 'it-2', day: 1, time: '04:00 PM', activity: 'Check-in at Shinjuku Hotel', location: 'Tokyo', type: 'hotel' },
    { id: 'it-3', day: 2, time: '09:00 AM', activity: 'Tsukiji Fish Market', location: 'Tokyo', type: 'food' },
    { id: 'it-4', day: 3, time: '12:00 PM', activity: 'Flight to Paris', location: 'HND', type: 'transport' },
    { id: 'it-5', day: 4, time: '10:00 AM', activity: 'Eiffel Tower Tour', location: 'Paris', type: 'activity' },
  ],
  expenses: [
    { id: 'ex-1', category: 'Flights', amount: 1200, date: '2026-05-01', description: 'JFK to HND' },
    { id: 'ex-2', category: 'Hotels', amount: 800, date: '2026-05-05', description: 'Tokyo Hotel 3 nights' },
    { id: 'ex-3', category: 'Activities', amount: 150, date: '2026-05-10', description: 'Tours in Tokyo' },
  ],
  checklist: [
    {
      id: 'cat-1',
      name: 'Documents',
      items: [
        { id: 'item-1', text: 'Passport', packed: true },
        { id: 'item-2', text: 'Visas', packed: false },
        { id: 'item-3', text: 'Travel Insurance', packed: true },
      ],
    },
    {
      id: 'cat-2',
      name: 'Electronics',
      items: [
        { id: 'item-4', text: 'Universal Adapter', packed: false },
        { id: 'item-5', text: 'Power Bank', packed: false },
      ],
    },
  ],
  notes: [
    { id: 'n-1', date: '2026-05-15', content: 'Remember to book the bullet train tickets in advance.' },
    { id: 'n-2', date: '2026-05-18', content: 'Lookup vegetarian restaurants near the Eiffel Tower.' },
  ],
};

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTrip, setActiveTripState] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const stored = localStorage.getItem('traveloop_trip');
      if (stored) {
        try {
          setActiveTripState(JSON.parse(stored));
        } catch (e) {
          setActiveTripState(SEED_DATA);
          localStorage.setItem('traveloop_trip', JSON.stringify(SEED_DATA));
        }
      } else {
        setActiveTripState(SEED_DATA);
        localStorage.setItem('traveloop_trip', JSON.stringify(SEED_DATA));
      }
      
      // Simulate loading for skeletons
      setTimeout(() => setIsLoading(false), 800);
    };
    loadData();
  }, []);

  const setActiveTrip = (trip: Trip) => {
    setActiveTripState(trip);
    localStorage.setItem('traveloop_trip', JSON.stringify(trip));
  };

  const updateItinerary = (items: ItineraryItem[]) => {
    if (!activeTrip) return;
    const updated = { ...activeTrip, itinerary: items };
    setActiveTrip(updated);
  };

  const addExpense = (expense: Expense) => {
    if (!activeTrip) return;
    const updated = { ...activeTrip, expenses: [...activeTrip.expenses, expense] };
    setActiveTrip(updated);
  };

  const updateChecklistItem = (categoryId: string, itemId: string, packed: boolean) => {
    if (!activeTrip) return;
    const updatedChecklist = activeTrip.checklist.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => item.id === itemId ? { ...item, packed } : item)
      };
    });
    setActiveTrip({ ...activeTrip, checklist: updatedChecklist });
  };

  const saveNote = (note: Note) => {
    if (!activeTrip) return;
    const existing = activeTrip.notes.find(n => n.id === note.id);
    let updatedNotes;
    if (existing) {
      updatedNotes = activeTrip.notes.map(n => n.id === note.id ? note : n);
    } else {
      updatedNotes = [note, ...activeTrip.notes];
    }
    setActiveTrip({ ...activeTrip, notes: updatedNotes });
  };

  return (
    <TripContext.Provider value={{ activeTrip, setActiveTrip, updateItinerary, addExpense, updateChecklistItem, saveNote, isLoading }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
