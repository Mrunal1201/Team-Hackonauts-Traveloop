// ── All shared mock data for the community platform ─────────────────────────

export const IMG = {
  bali:        'https://images.unsplash.com/photo-1675349673331-5bd6398000b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  tokyo:       'https://images.unsplash.com/photo-1730385835399-4d0f24898919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  santorini:   'https://images.unsplash.com/photo-1573481726566-9d98bb795fff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  morocco:     'https://images.unsplash.com/photo-1571392737007-0e292d258e17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  iceland:     'https://images.unsplash.com/photo-1681834418277-b01c30279693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  maldives:    'https://images.unsplash.com/photo-1622779536320-bb5f5b501a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  soloTrek:    'https://images.unsplash.com/photo-1666943907892-7de72bec15c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  groupTrip:   'https://images.unsplash.com/photo-1758599669009-5a9002c09487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  kyoto:       'https://images.unsplash.com/photo-1704026438453-fde2ceb923ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  patagonia:   'https://images.unsplash.com/photo-1777824256363-6ce664e60192?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  nepal:       'https://images.unsplash.com/photo-1690122601365-77d6ee21e998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  machuPicchu: 'https://images.unsplash.com/photo-1492693859998-63ccf2ddafd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  capeTown:    'https://images.unsplash.com/photo-1647550007211-83e234d91b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
};

export interface Traveler {
  id: number;
  name: string;
  handle: string;
  initials: string;
  color: string;
  bio: string;
  countries: number;
  followers: number;
  following: number;
  trips: number;
  verified: boolean;
  badges: string[];
  style: string;
  compatibility?: number;
  mutualFriends?: number;
  dest?: string;
}

export const TRAVELERS: Traveler[] = [
  { id: 1, name: 'Arya Sharma', handle: '@arya_explores', initials: 'AS', color: '#E84393', bio: 'Solo adventurer | 34 countries 🌍 | Mountain soul, beach heart', countries: 34, followers: 12400, following: 890, trips: 47, verified: true, badges: ['🏔️ Adventurer', '📸 Photographer', '🍜 Foodie'], style: 'Solo Backpacker', compatibility: 94, mutualFriends: 6, dest: 'Patagonia' },
  { id: 2, name: 'Yuki Chen', handle: '@yuki.wanders', initials: 'YC', color: '#6C63FF', bio: 'Japan local → World citizen | Street food philosopher 🍜', countries: 22, followers: 8700, following: 1200, trips: 31, verified: true, badges: ['🍣 Foodie Elite', '🌸 Culture Seeker', '🏙️ City Explorer'], style: 'Culture Traveler', compatibility: 88, mutualFriends: 3, dest: 'Morocco' },
  { id: 3, name: 'Sofia Reyes', handle: '@sofia.free', initials: 'SR', color: '#F5A623', bio: 'Budget travel queen 👑 | Making every dollar count across 29 nations', countries: 29, followers: 19200, following: 543, trips: 52, verified: true, badges: ['💰 Budget Pro', '🎒 Backpacker', '🤝 Community Star'], style: 'Budget Backpacker', compatibility: 81, mutualFriends: 8, dest: 'Southeast Asia' },
  { id: 4, name: 'Amir Hassan', handle: '@amir.horizon', initials: 'AH', color: '#2ECC71', bio: 'Architecture & culture hunter | Middle East ↔ Europe ✈️', countries: 18, followers: 5400, following: 720, trips: 24, verified: false, badges: ['🕌 Culture Hunter', '📐 Architecture Fan'], style: 'Cultural Explorer', compatibility: 76, mutualFriends: 2, dest: 'Italy' },
  { id: 5, name: 'Priya Nair', handle: '@priya.passport', initials: 'PN', color: '#FF6B6B', bio: 'Luxury meets adventure | Digital nomad ☕ | 41 countries & counting', countries: 41, followers: 34800, following: 612, trips: 68, verified: true, badges: ['💎 Luxury Traveler', '💻 Digital Nomad', '✈️ Frequent Flier'], style: 'Luxury Nomad', compatibility: 72, mutualFriends: 11, dest: 'Maldives' },
  { id: 6, name: 'Leo Ferreira', handle: '@leoadventures', initials: 'LF', color: '#1ABC9C', bio: 'Surfing every ocean 🏄 | Nature first | Brazil → everywhere', countries: 27, followers: 9100, following: 1050, trips: 39, verified: false, badges: ['🏄 Surf Explorer', '🌿 Eco Traveler', '🌊 Ocean Soul'], style: 'Adventure Seeker', compatibility: 69, mutualFriends: 4, dest: 'Bali' },
];

export interface Post {
  id: number;
  author: Traveler;
  location: string;
  flag: string;
  time: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  saved: number;
  hashtags: string[];
  tripDay: string;
  mood: string;
  liked?: boolean;
  bookmarked?: boolean;
}

export const POSTS: Post[] = [
  {
    id: 1, author: TRAVELERS[0], location: 'Ubud, Bali', flag: '🇮🇩', time: '2h ago',
    content: 'Golden hour at Tegalalang rice terraces hit different today. 4th day in Bali and I\'m not sure I want to leave. There\'s something magical about the way the light falls through the palm trees at dusk 🌅\n\nPro tip: arrive before 7am to beat the crowds — completely worth the 5am wake-up!',
    image: IMG.bali, likes: 847, comments: 63, shares: 28, saved: 156,
    hashtags: ['#BaliLife', '#RiceTerraces', '#GoldenHour', '#SoloTravel'],
    tripDay: 'Day 4 of 10', mood: '😍', liked: false, bookmarked: false,
  },
  {
    id: 2, author: TRAVELERS[1], location: 'Shinjuku, Tokyo', flag: '🇯🇵', time: '5h ago',
    content: 'Tokyo at midnight feels like the future. Neon reflections on wet streets, salary-men rushing home, vending machines glowing on every corner. This city never sleeps and honestly… neither do I 🗼',
    image: IMG.tokyo, likes: 1204, comments: 89, shares: 67, saved: 312,
    hashtags: ['#TokyoNights', '#Japan', '#NeonCity', '#UrbanExplorer'],
    tripDay: 'Day 2 of 7', mood: '🌃', liked: false, bookmarked: false,
  },
  {
    id: 3, author: TRAVELERS[2], location: 'Oia, Santorini', flag: '🇬🇷', time: '1d ago',
    content: 'Blue domes, whitewashed walls, and the Aegean stretching to infinity. Santorini is a cliché for a reason — because it\'s genuinely breathtaking. Budget tip: stay in Fira instead of Oia and walk the 10km cliff path at sunset instead of paying for a taxi! 💙',
    image: IMG.santorini, likes: 2341, comments: 147, shares: 203, saved: 891,
    hashtags: ['#Santorini', '#Greece', '#BudgetTravel', '#AegeanSea'],
    tripDay: 'Day 6 of 9', mood: '💙', liked: false, bookmarked: false,
  },
  {
    id: 4, author: TRAVELERS[3], location: 'Marrakech, Morocco', flag: '🇲🇦', time: '1d ago',
    content: 'Getting lost in the souks of Marrakech is the only way to truly experience this city. Every corner reveals a new colour, a new scent, a new story. The architecture here is genuinely humbling 🕌',
    image: IMG.morocco, likes: 678, comments: 44, shares: 31, saved: 223,
    hashtags: ['#Morocco', '#Marrakech', '#Souks', '#Architecture'],
    tripDay: 'Day 3 of 6', mood: '🕌', liked: false, bookmarked: false,
  },
  {
    id: 5, author: TRAVELERS[4], location: 'Reykjavik, Iceland', flag: '🇮🇸', time: '2d ago',
    content: 'Chasing auroras in Iceland is a patience game — but when they finally dance across the sky, every cold hour waiting is completely worth it. The silence under the Northern Lights is something no photo can capture 🌌',
    image: IMG.iceland, likes: 3102, comments: 218, shares: 445, saved: 1290,
    hashtags: ['#NorthernLights', '#Iceland', '#AuroraBorealis', '#BucketList'],
    tripDay: 'Day 5 of 8', mood: '🌌', liked: false, bookmarked: false,
  },
];

export interface MemoryCard {
  id: number;
  destination: string;
  country: string;
  flag: string;
  coverImage: string;
  dates: string;
  duration: string;
  companions: string[];
  mood: string;
  budget: number;
  currency: string;
  photos: string[];
  aiSummary: string;
  rating: number;
  highlights: string[];
  visited: string[];
  tags: string[];
}

export const MEMORY_CARDS: MemoryCard[] = [
  {
    id: 1, destination: 'Bali', country: 'Indonesia', flag: '🇮🇩',
    coverImage: IMG.bali,
    dates: 'Mar 10 – Mar 20, 2025', duration: '10 days',
    companions: ['Arya S.', 'Priya N.', 'Leo F.'],
    mood: '😍 Magical',
    budget: 1200, currency: 'USD',
    photos: [IMG.bali, IMG.kyoto, IMG.groupTrip],
    aiSummary: 'An unforgettable tropical escape through Bali\'s emerald rice terraces, sacred temples, and world-class surf breaks. This trip beautifully balanced spiritual discovery with pure adventure — from sunrise at Mount Batur to sunset ceremonies at Uluwatu.',
    rating: 4.9,
    highlights: ['Sunrise at Mount Batur', 'Tegalalang Rice Terraces', 'Uluwatu Temple Ceremony', 'Seminyak Beach Sunset'],
    visited: ['Ubud', 'Seminyak', 'Uluwatu', 'Kintamani', 'Canggu'],
    tags: ['#BaliTrip', '#Tropical', '#Culture', '#Adventure'],
  },
  {
    id: 2, destination: 'Japan Loop', country: 'Japan', flag: '🇯🇵',
    coverImage: IMG.kyoto,
    dates: 'Jan 4 – Jan 18, 2025', duration: '14 days',
    companions: ['Yuki C.'],
    mood: '🌸 Serene',
    budget: 2800, currency: 'USD',
    photos: [IMG.kyoto, IMG.tokyo, IMG.soloTrek],
    aiSummary: 'A journey through contrasts — from Tokyo\'s electric neon canyons to Kyoto\'s timeless bamboo groves. This 2-week Japan loop wove together ancient tradition and bleeding-edge modernity, leaving an indelible mark on the soul.',
    rating: 5.0,
    highlights: ['Arashiyama Bamboo Grove', 'Shibuya Crossing at night', 'Mt Fuji Dawn View', 'Fushimi Inari Shrine hike'],
    visited: ['Tokyo', 'Kyoto', 'Osaka', 'Nara', 'Hakone'],
    tags: ['#Japan', '#Kyoto', '#Tokyo', '#CherryBlossom'],
  },
  {
    id: 3, destination: 'Maldives Escape', country: 'Maldives', flag: '🇲🇻',
    coverImage: IMG.maldives,
    dates: 'Feb 14 – Feb 20, 2025', duration: '6 days',
    companions: ['Solo'],
    mood: '💆 Blissful',
    budget: 3500, currency: 'USD',
    photos: [IMG.maldives, IMG.capeTown],
    aiSummary: 'A soul-restoring week in paradise — turquoise lagoons, overwater bungalows, and the meditative rhythm of the ocean. Sometimes the most profound travel is the journey inward.',
    rating: 4.8,
    highlights: ['Snorkeling with Manta Rays', 'Private Sandbank Picnic', 'Underwater Dining', 'Dawn Kayaking'],
    visited: ['Malé', 'Rangali Island', 'Baa Atoll'],
    tags: ['#Maldives', '#Luxury', '#SoloRetreat', '#Ocean'],
  },
  {
    id: 4, destination: 'Patagonia Trek', country: 'Argentina/Chile', flag: '🇦🇷',
    coverImage: IMG.patagonia,
    dates: 'Nov 2 – Nov 16, 2024', duration: '14 days',
    companions: ['Arya S.', 'Leo F.', 'Sofia R.', '+2'],
    mood: '🏔️ Epic',
    budget: 2200, currency: 'USD',
    photos: [IMG.patagonia, IMG.soloTrek, IMG.nepal],
    aiSummary: 'The W Trek through Torres del Paine pushed every limit — physically, emotionally, spiritually. Glaciers, condors, and end-of-the-world wilderness that makes you feel both infinitely small and powerfully alive.',
    rating: 5.0,
    highlights: ['Torres del Paine Summit', 'Grey Glacier Trek', 'Condor Sighting', 'Wild Camping Under Stars'],
    visited: ['Puerto Natales', 'Torres del Paine', 'El Calafate', 'Perito Moreno'],
    tags: ['#Patagonia', '#Trekking', '#WildNature', '#GroupTrip'],
  },
  {
    id: 5, destination: 'Morocco Magic', country: 'Morocco', flag: '🇲🇦',
    coverImage: IMG.morocco,
    dates: 'Oct 8 – Oct 14, 2024', duration: '6 days',
    companions: ['Amir H.', 'Yuki C.'],
    mood: '🕌 Mystical',
    budget: 800, currency: 'USD',
    photos: [IMG.morocco, IMG.capeTown],
    aiSummary: 'Morocco is a feast for all senses — labyrinthine medinas, saffron-scented spice markets, Saharan sunsets, and tea served with ceremony. A cultural awakening wrapped in 1001 nights.',
    rating: 4.7,
    highlights: ['Sahara Desert Camel Trek', 'Marrakech Medina at Dusk', 'Atlas Mountains Drive', 'Fes Tanneries'],
    visited: ['Marrakech', 'Fes', 'Merzouga', 'Chefchaouen', 'Casablanca'],
    tags: ['#Morocco', '#Sahara', '#Culture', '#Budget'],
  },
  {
    id: 6, destination: 'Nepal Himalaya', country: 'Nepal', flag: '🇳🇵',
    coverImage: IMG.nepal,
    dates: 'Apr 1 – Apr 15, 2024', duration: '15 days',
    companions: ['Solo'],
    mood: '🙏 Spiritual',
    budget: 1100, currency: 'USD',
    photos: [IMG.nepal, IMG.machuPicchu, IMG.patagonia],
    aiSummary: 'Annapurna Base Camp at 4,130m — lungs burning, heart full. The Himalayas don\'t ask whether you\'re ready; they simply reveal who you are. This trek was less about the destination and entirely about the transformation.',
    rating: 5.0,
    highlights: ['Annapurna Base Camp', 'Poon Hill Sunrise', 'Pokhara Lakeside', 'Throng La Pass'],
    visited: ['Kathmandu', 'Pokhara', 'Ghorepani', 'Annapurna BC', 'Jomsom'],
    tags: ['#Nepal', '#Himalayas', '#Trekking', '#SoloTravel', '#Spiritual'],
  },
];

export const BADGES = [
  { id: 'explorer',   icon: '🗺️', label: 'World Explorer',    desc: 'Visited 30+ countries',     color: '#6C63FF', earned: true  },
  { id: 'foodie',     icon: '🍜', label: 'Foodie Traveler',    desc: 'Tried 50+ local dishes',    color: '#FF6B6B', earned: true  },
  { id: 'solo',       icon: '🎒', label: 'Solo Warrior',       desc: '10+ solo trips completed',  color: '#2ECC71', earned: true  },
  { id: 'hiker',      icon: '🏔️', label: 'Summit Seeker',      desc: 'Hiked 5 major peaks',       color: '#F5A623', earned: true  },
  { id: 'hidden',     icon: '💎', label: 'Hidden Gem Hunter',  desc: 'Discovered 20+ hidden gems',color: '#1ABC9C', earned: true  },
  { id: 'nomad',      icon: '💻', label: 'Digital Nomad',      desc: 'Worked remotely from 8+',   color: '#E84393', earned: true  },
  { id: 'culture',    icon: '🏛️', label: 'Culture Seeker',     desc: 'Visited 30+ UNESCO sites',  color: '#9B59B6', earned: false },
  { id: 'ultra',      icon: '🌍', label: 'Ultra Traveler',     desc: 'Visit all 7 continents',    color: '#3498DB', earned: false },
];

export const VISITED_PLACES = [
  { city: 'Tokyo',       country: 'Japan',       flag: '🇯🇵', x: 76, y: 32, trips: 3, image: IMG.tokyo      },
  { city: 'Bali',        country: 'Indonesia',   flag: '🇮🇩', x: 72, y: 52, trips: 2, image: IMG.bali       },
  { city: 'Santorini',   country: 'Greece',      flag: '🇬🇷', x: 51, y: 30, trips: 1, image: IMG.santorini  },
  { city: 'Marrakech',   country: 'Morocco',     flag: '🇲🇦', x: 46, y: 37, trips: 1, image: IMG.morocco    },
  { city: 'Reykjavik',   country: 'Iceland',     flag: '🇮🇸', x: 38, y: 15, trips: 1, image: IMG.iceland    },
  { city: 'Maldives',    country: 'Maldives',    flag: '🇲🇻', x: 64, y: 48, trips: 1, image: IMG.maldives   },
  { city: 'Kathmandu',   country: 'Nepal',       flag: '🇳🇵', x: 67, y: 36, trips: 1, image: IMG.nepal      },
  { city: 'Patagonia',   country: 'Argentina',   flag: '🇦🇷', x: 28, y: 78, trips: 1, image: IMG.patagonia  },
  { city: 'Machu Picchu',country: 'Peru',        flag: '🇵🇪', x: 24, y: 62, trips: 1, image: IMG.machuPicchu},
  { city: 'Cape Town',   country: 'South Africa',flag: '🇿🇦', x: 50, y: 72, trips: 1, image: IMG.capeTown   },
  { city: 'Kyoto',       country: 'Japan',       flag: '🇯🇵', x: 78, y: 34, trips: 2, image: IMG.kyoto      },
];

export const WISHLIST = [
  { city: 'Amalfi Coast', flag: '🇮🇹', x: 49, y: 30 },
  { city: 'Petra',        flag: '🇯🇴', x: 55, y: 37 },
  { city: 'Havana',       flag: '🇨🇺', x: 21, y: 40 },
  { city: 'Angkor Wat',   flag: '🇰🇭', x: 72, y: 46 },
  { city: 'Faroe Islands',flag: '🇫🇴', x: 42, y: 17 },
];

export const TRENDING_DESTINATIONS = [
  { name: 'Kyoto, Japan',      emoji: '🇯🇵', trend: '+24%', image: IMG.kyoto,       posts: '14.2k' },
  { name: 'Patagonia',         emoji: '🇦🇷', trend: '+31%', image: IMG.patagonia,   posts: '9.8k'  },
  { name: 'Cape Town',         emoji: '🇿🇦', trend: '+18%', image: IMG.capeTown,    posts: '7.3k'  },
  { name: 'Machu Picchu',      emoji: '🇵🇪', trend: '+15%', image: IMG.machuPicchu, posts: '11.1k' },
  { name: 'Maldives',          emoji: '🇲🇻', trend: '+28%', image: IMG.maldives,    posts: '19.4k' },
  { name: 'Nepal Himalayas',   emoji: '🇳🇵', trend: '+22%', image: IMG.nepal,       posts: '6.7k'  },
];

export const COMMUNITIES = [
  { name: 'Solo Backpackers',  icon: '🎒', members: 48200, active: true  },
  { name: 'Food Explorers',    icon: '🍜', members: 31700, active: true  },
  { name: 'Budget Travelers',  icon: '💰', members: 67400, active: false },
  { name: 'Luxury Nomads',     icon: '💎', members: 12900, active: true  },
  { name: 'Hiking & Trekking', icon: '🏔️', members: 29300, active: false },
  { name: 'Digital Nomads',    icon: '💻', members: 54100, active: true  },
];

export const TRENDING_TAGS = [
  '#SoloTravel', '#BudgetTravel', '#HiddenGems', '#BackpackingAsia',
  '#VanLife', '#TravelPhotography', '#FoodieTravel', '#AdventureAwaits',
  '#DigitalNomad', '#SustainableTravel', '#BucketList', '#WanderlustDiaries',
];
