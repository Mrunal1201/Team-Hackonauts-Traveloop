import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TripStatus = 'Upcoming' | 'Ongoing' | 'Completed';

export interface Activity {
  id: string;
  name: string;
  cost: number;
  duration: number; // in hours
}

export interface Stop {
  id: string;
  city: string;
  arrivalDate: string;
  departureDate: string;
  activities: Activity[];
}

export interface ChecklistItem {
  id: string;
  category: 'Clothes' | 'Documents' | 'Electronics' | 'Miscellaneous';
  name: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  stopId?: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  status: TripStatus;
  stops: Stop[];
  checklist: ChecklistItem[];
  notes: Note[];
}

export interface User {
  name: string;
  email: string;
  language: string;
}

interface TraveloopContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'stops' | 'checklist' | 'notes' | 'status'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
}

const initialUser: User = {
  name: 'Riya Sharma',
  email: 'riya@example.com',
  language: 'English',
};

const initialTrips: Trip[] = [
  {
    id: '1',
    name: 'Asia-Europe Loop',
    startDate: '2026-06-01',
    endDate: '2026-06-14',
    budget: 250000,
    description: 'A massive cross-continental adventure!',
    status: 'Upcoming',
    stops: [
      {
        id: 's1',
        city: 'Mumbai',
        arrivalDate: '2026-06-01',
        departureDate: '2026-06-02',
        activities: [],
      },
      {
        id: 's2',
        city: 'Tokyo',
        arrivalDate: '2026-06-02',
        departureDate: '2026-06-07',
        activities: [
          { id: 'a1', name: 'Shibuya Crossing', cost: 0, duration: 2 },
          { id: 'a2', name: 'Tsukiji Market', cost: 1200, duration: 3 },
          { id: 'a3', name: 'TeamLab Planets', cost: 3500, duration: 4 },
        ],
      },
      {
        id: 's3',
        city: 'Barcelona',
        arrivalDate: '2026-06-07',
        departureDate: '2026-06-14',
        activities: [
          { id: 'a4', name: 'Sagrada Família', cost: 2800, duration: 3 },
          { id: 'a5', name: 'La Boqueria', cost: 900, duration: 2 },
        ],
      },
    ],
    checklist: [
      { id: 'c1', category: 'Clothes', name: 'Jacket', completed: true },
      { id: 'c2', category: 'Clothes', name: 'T-Shirts', completed: false },
      { id: 'c3', category: 'Clothes', name: 'Jeans', completed: true },
      { id: 'c4', category: 'Documents', name: 'Passport', completed: true },
      { id: 'c5', category: 'Documents', name: 'Visa', completed: true },
      { id: 'c6', category: 'Documents', name: 'Tickets', completed: false },
      { id: 'c7', category: 'Electronics', name: 'Charger', completed: false },
      { id: 'c8', category: 'Electronics', name: 'Powerbank', completed: true },
      { id: 'c9', category: 'Electronics', name: 'Camera', completed: false },
    ],
    notes: [
      {
        id: 'n1',
        title: 'Sushi places in Tokyo',
        body: 'Make sure to check out Sushi Dai early in the morning.',
        timestamp: new Date().toISOString(),
        stopId: 's2',
      },
      {
        id: 'n2',
        title: 'Gaudi architecture',
        body: 'Book tickets for Park Güell in advance!',
        timestamp: new Date().toISOString(),
        stopId: 's3',
      },
    ],
  },
];

const TraveloopContext = createContext<TraveloopContextType | undefined>(undefined);

export const TraveloopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('traveloop_user');
    const storedTrips = localStorage.getItem('traveloop_trips');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Pre-seed user for prototype
      setUser(initialUser);
      localStorage.setItem('traveloop_user', JSON.stringify(initialUser));
    }

    if (storedTrips) {
      setTrips(JSON.parse(storedTrips));
    } else {
      setTrips(initialTrips);
      localStorage.setItem('traveloop_trips', JSON.stringify(initialTrips));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        localStorage.setItem('traveloop_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('traveloop_user');
      }
      localStorage.setItem('traveloop_trips', JSON.stringify(trips));
    }
  }, [user, trips, isLoaded]);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => {
    setUser(null);
    localStorage.removeItem('traveloop_user');
  };
  const updateUser = (newUser: User) => setUser(newUser);

  const addTrip = (tripData: Omit<Trip, 'id' | 'stops' | 'checklist' | 'notes' | 'status'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Upcoming',
      stops: [],
      checklist: [],
      notes: [],
    };
    setTrips([...trips, newTrip]);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  const deleteTrip = (id: string) => {
    setTrips(trips.filter((t) => t.id !== id));
  };

  return (
    <TraveloopContext.Provider
      value={{ user, login, logout, updateUser, trips, addTrip, updateTrip, deleteTrip }}
    >
      {children}
    </TraveloopContext.Provider>
  );
};

export const useTraveloop = () => {
  const context = useContext(TraveloopContext);
  if (context === undefined) {
    throw new Error('useTraveloop must be used within a TraveloopProvider');
  }
  return context;
};
