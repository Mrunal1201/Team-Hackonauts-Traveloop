// ── Shared mock trip data used across My Trips & Trip Workspace ──────────────

export type TripStatus = 'Active' | 'Upcoming' | 'Draft' | 'Completed';

export interface GeneratedActivity {
  time: string;
  title: string;
  type: string;
  emoji: string;
  cost: number;
  tip: string;
}

export interface GeneratedDay {
  day: number;
  city: string;
  theme: string;
  activities: GeneratedActivity[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  countries: string[];
  cities: string[];
  cover: string;
  status: TripStatus;
  startDate: string;
  endDate: string;
  days: number;
  budget: number;
  spent: number;
  travelers: number;
  travelType: string;
  interests: string[];
  progress: number;
  rating?: number;
  description: string;
  healthScore: number;
  aiGenerated?: boolean;

  // AI-enriched data (populated when trip is AI-generated)
  flag?: string;
  route?: string;
  highlights?: string[];
  aiTips?: string[];
  aiPacking?: {
    essentials: string[];
    clothing: string[];
    tech: string[];
    health: string[];
  };
  aiBudgetItems?: {
    label: string;
    value: number;
    color: string;
  }[];
  generatedDays?: GeneratedDay[];
}

export const TRIPS: Trip[] = [
  {
    id: 'asia-europe-loop',
    title: 'Asia–Europe Loop',
    destination: 'Tokyo → Paris → Rome',
    countries: ['Japan', 'Thailand', 'France', 'Italy'],
    cities: ['Tokyo', 'Bangkok', 'Paris', 'Rome'],
    cover: 'https://images.unsplash.com/photo-1770387795112-e2b476b15f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    status: 'Active',
    startDate: 'Jun 10, 2025',
    endDate: 'Jul 25, 2025',
    days: 45,
    budget: 8420,
    spent: 7157,
    travelers: 2,
    travelType: 'Couple',
    interests: ['Culture', 'Food', 'Historical'],
    progress: 85,
    rating: 4.9,
    description: 'An epic journey through the heart of Asia and Europe, blending ancient temples with Eiffel Tower sunsets.',
    healthScore: 92,
  },
  {
    id: 'bali-getaway',
    title: 'Bali Getaway',
    destination: 'Ubud → Seminyak → Uluwatu',
    countries: ['Indonesia'],
    cities: ['Ubud', 'Seminyak', 'Uluwatu'],
    cover: 'https://images.unsplash.com/photo-1675349673331-5bd6398000b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    status: 'Upcoming',
    startDate: 'Aug 1, 2025',
    endDate: 'Aug 12, 2025',
    days: 12,
    budget: 2200,
    spent: 0,
    travelers: 1,
    travelType: 'Solo',
    interests: ['Nature', 'Relaxation', 'Food'],
    progress: 40,
    rating: undefined,
    description: 'A soul-recharging solo escape to the Island of Gods — rice terraces, beach clubs, and cliffside temples.',
    healthScore: 78,
  },
  {
    id: 'patagonia-trek',
    title: 'Patagonia Trek',
    destination: 'Buenos Aires → El Calafate → Puerto Natales',
    countries: ['Argentina', 'Chile'],
    cities: ['Buenos Aires', 'El Calafate', 'Puerto Natales'],
    cover: 'https://images.unsplash.com/photo-1608903661090-aa2d6e124151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    status: 'Draft',
    startDate: 'Nov 2, 2025',
    endDate: 'Nov 16, 2025',
    days: 14,
    budget: 3100,
    spent: 0,
    travelers: 3,
    travelType: 'Friends',
    interests: ['Adventure', 'Nature', 'Hiking'],
    progress: 15,
    rating: undefined,
    description: 'A raw, untamed adventure across one of the world\'s last wild frontiers — glaciers, condors, and infinite sky.',
    healthScore: 45,
  },
  {
    id: 'greece-island-hop',
    title: 'Greece Island Hop',
    destination: 'Athens → Santorini → Mykonos',
    countries: ['Greece'],
    cities: ['Athens', 'Santorini', 'Mykonos'],
    cover: 'https://images.unsplash.com/photo-1743664039044-34898c6bed3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    status: 'Completed',
    startDate: 'Apr 5, 2025',
    endDate: 'Apr 18, 2025',
    days: 13,
    budget: 4200,
    spent: 3980,
    travelers: 2,
    travelType: 'Couple',
    interests: ['Beach', 'Culture', 'Food', 'Luxury'],
    progress: 100,
    rating: 5.0,
    description: 'White-washed villages, cobalt blue seas, and the finest mezze on earth. A trip we will never forget.',
    healthScore: 98,
  },
];

// ── Itinerary days ─────────────────────────────────────────────────────────
export const ITINERARY_DAYS: Record<string, { day: number; date: string; city: string; activities: { time: string; title: string; type: string; cost: number; duration: string; note?: string }[] }[]> = {
  'asia-europe-loop': [
    {
      day: 1, date: 'Jun 10', city: 'Tokyo',
      activities: [
        { time: '09:00', title: 'Arrive at Narita Airport', type: 'Transport', cost: 0,   duration: '2h',   note: 'Take Narita Express to Shinjuku' },
        { time: '12:00', title: 'Lunch at Ichiran Ramen',   type: 'Food',      cost: 18,  duration: '1h'  },
        { time: '14:00', title: 'Meiji Shrine & Harajuku',  type: 'Culture',   cost: 0,   duration: '3h'  },
        { time: '18:00', title: 'Shibuya Crossing & dinner',type: 'Food',      cost: 35,  duration: '2h'  },
      ],
    },
    {
      day: 2, date: 'Jun 11', city: 'Tokyo',
      activities: [
        { time: '08:00', title: 'Tsukiji Fish Market',      type: 'Food',      cost: 25,  duration: '2h'  },
        { time: '11:00', title: 'Asakusa & Senso-ji Temple', type: 'Culture',  cost: 0,   duration: '2h'  },
        { time: '14:00', title: 'teamLab Borderless',       type: 'Activity',  cost: 30,  duration: '3h'  },
        { time: '19:00', title: 'Rooftop dinner in Ginza',  type: 'Food',      cost: 80,  duration: '2h'  },
      ],
    },
  ],
  'bali-getaway': [
    {
      day: 1, date: 'Aug 1', city: 'Ubud',
      activities: [
        { time: '10:00', title: 'Arrive at Ngurah Rai Airport', type: 'Transport', cost: 25, duration: '1.5h' },
        { time: '13:00', title: 'Sacred Monkey Forest',      type: 'Activity',  cost: 5,   duration: '2h'  },
        { time: '16:00', title: 'Rice Terrace Walk',         type: 'Nature',    cost: 0,   duration: '2h'  },
        { time: '19:00', title: 'Warung dinner in Ubud',     type: 'Food',      cost: 15,  duration: '1.5h' },
      ],
    },
  ],
};

// ── Budget breakdown ───────────────────────────────────────────────────────
export const BUDGET_BREAKDOWN: Record<string, { category: string; budget: number; spent: number; icon: string; color: string }[]> = {
  'asia-europe-loop': [
    { category: 'Accommodation', budget: 2500, spent: 2200, icon: '🏨', color: '#2A4D3A' },
    { category: 'Food & Dining',  budget: 1800, spent: 1650, icon: '🍜', color: '#F5B041' },
    { category: 'Activities',     budget: 1200, spent: 980,  icon: '🎭', color: '#3B82F6' },
    { category: 'Transport',      budget: 1500, spent: 1400, icon: '✈️', color: '#8B5CF6' },
    { category: 'Shopping',       budget: 800,  spent: 720,  icon: '🛍️', color: '#EC4899' },
    { category: 'Miscellaneous',  budget: 620,  spent: 207,  icon: '💼', color: '#6B7280' },
  ],
  'bali-getaway': [
    { category: 'Accommodation', budget: 800,  spent: 0,    icon: '🏨', color: '#2A4D3A' },
    { category: 'Food & Dining', budget: 400,  spent: 0,    icon: '🍜', color: '#F5B041' },
    { category: 'Activities',    budget: 500,  spent: 0,    icon: '🎭', color: '#3B82F6' },
    { category: 'Transport',     budget: 300,  spent: 0,    icon: '🛵', color: '#8B5CF6' },
    { category: 'Miscellaneous', budget: 200,  spent: 0,    icon: '💼', color: '#6B7280' },
  ],
};

// ── Packing list ────────────────────────────────────────────────────────────
export const PACKING_LIST: Record<string, { id: string; category: string; item: string; packed: boolean; essential: boolean }[]> = {
  'asia-europe-loop': [
    { id: 'p1', category: 'Documents',    item: 'Passport',               packed: true,  essential: true  },
    { id: 'p2', category: 'Documents',    item: 'Travel Insurance',       packed: true,  essential: true  },
    { id: 'p3', category: 'Documents',    item: 'Hotel Confirmations',    packed: true,  essential: true  },
    { id: 'p4', category: 'Electronics',  item: 'Camera + Lenses',        packed: true,  essential: false },
    { id: 'p5', category: 'Electronics',  item: 'Universal Adapter',      packed: true,  essential: true  },
    { id: 'p6', category: 'Electronics',  item: 'Portable Power Bank',    packed: false, essential: true  },
    { id: 'p7', category: 'Clothing',     item: 'Waterproof Jacket',      packed: true,  essential: false },
    { id: 'p8', category: 'Clothing',     item: 'Formal Outfit (Paris)',   packed: false, essential: false },
    { id: 'p9', category: 'Toiletries',   item: 'Sunscreen SPF 50',       packed: false, essential: true  },
    { id: 'p10', category: 'Essentials',  item: 'First Aid Kit',          packed: true,  essential: true  },
    { id: 'p11', category: 'Essentials',  item: 'Travel Pillow',          packed: false, essential: false },
    { id: 'p12', category: 'Toiletries',  item: 'Toiletry Bag',           packed: true,  essential: true  },
  ],
};