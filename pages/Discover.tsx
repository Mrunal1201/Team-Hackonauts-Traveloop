import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils, Hotel, ShoppingBag, Landmark, Star, MapPin, Clock, DollarSign,
  Leaf, ChevronRight, Zap, Filter, Tag, Heart, Globe,
} from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap';

type City = 'tokyo' | 'paris';
type Tab = 'food' | 'stay' | 'shopping' | 'culture';
type DietFilter = 'all' | 'veg' | 'vegan';
type BudgetFilter = 'all' | 'budget' | 'mid' | 'luxury';
type ShopFilter = 'all' | 'electronics' | 'fashion' | 'souvenirs' | 'luxury' | 'markets';

const CITY_IMG = {
  tokyo: {
    food: 'https://images.unsplash.com/photo-1763296378671-62542d4b29b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMHJhbWVuJTIwc3VzaGklMjBzdHJlZXQlMjBmb29kJTIwYm93bHxlbnwxfHx8fDE3NzgzODk2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    hotel: 'https://images.unsplash.com/photo-1718851972754-6638b49b4775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGx1eHVyeSUyMGhvdGVsJTIwcm9vbSUyMG1vZGVybiUyMGludGVyaW9yfGVufDF8fHx8MTc3ODM4OTY2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    shopping: 'https://images.unsplash.com/photo-1771804358926-555f9ad319d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxha2loYWJhcmElMjB0b2t5byUyMG5lb24lMjBsaWdodHMlMjBlbGVjdHJvbmljcyUyMG5pZ2h0fGVufDF8fHx8MTc3ODM4OTY3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    culture: 'https://images.unsplash.com/photo-1686933021139-69c8b4242198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5zby1qaSUyMGFzYWt1c2ElMjB0b2t5byUyMHRlbXBsZSUyMHBhZ29kYXxlbnwxfHx8fDE3NzgzODk2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  paris: {
    food: 'https://images.unsplash.com/photo-1584450149783-8073785c47f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGNhZmUlMjBjcm9pc3NhbnQlMjBmcmVuY2glMjBiaXN0cm98ZW58MXx8fHwxNzc4Mzg5NjY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    hotel: 'https://images.unsplash.com/photo-1544097935-e6d136448533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGJvdXRpcXVlJTIwaG90ZWwlMjBlbGVnYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc4Mzg5NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    shopping: 'https://images.unsplash.com/photo-1766847733845-330a163ab279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxlcmllcyUyMGxhZmF5ZXR0ZSUyMHBhcmlzJTIwbHV4dXJ5JTIwc2hvcHBpbmclMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzgzODk2NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    culture: 'https://images.unsplash.com/photo-1714391942356-2f21689a68af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3V2cmUlMjBtdXNldW0lMjBwYXJpcyUyMHB5cmFtaWQlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc4Mzg5Njc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
};

// ── Food Data ──────────────────────────────────────────────────────────────
const DISHES = {
  tokyo: [
    { name: 'Tonkotsu Ramen', emoji: '🍜', price: '¥900–1,200', diet: 'all', desc: 'Rich pork broth, chashu, soft-boiled egg', area: 'Ikebukuro / Shibuya', rating: 4.9 },
    { name: 'Omakase Sushi', emoji: '🍣', price: '¥3,000–15,000', diet: 'all', desc: 'Chef\'s choice fresh sushi, seasonal fish', area: 'Ginza / Tsukiji', rating: 5.0 },
    { name: 'Wagyu Yakiniku', emoji: '🥩', price: '¥4,000–12,000', diet: 'all', desc: 'A5 Wagyu grilled at the table', area: 'Roppongi / Shinjuku', rating: 4.8 },
    { name: 'Vegetable Tempura', emoji: '🥦', price: '¥1,200–2,500', diet: 'veg', desc: 'Light batter fried seasonal vegetables', area: 'Asakusa', rating: 4.6 },
    { name: 'Vegan Ramen', emoji: '🌱', price: '¥1,000–1,400', diet: 'vegan', desc: 'T\'s TanTan vegan soy milk broth', area: 'Tokyo Station', rating: 4.7 },
    { name: 'Takoyaki', emoji: '🐙', price: '¥500–800', diet: 'all', desc: 'Grilled octopus balls, street food classic', area: 'Asakusa / Ueno', rating: 4.5 },
  ],
  paris: [
    { name: 'Croque Madame', emoji: '🥪', price: '€10–16', diet: 'veg', desc: 'Ham, gruyère, béchamel, fried egg — French classic', area: 'Saint-Germain', rating: 4.7 },
    { name: 'Steak Frites', emoji: '🥩', price: '€18–35', diet: 'all', desc: 'Pan-seared entrecôte with crispy fries', area: 'Le Marais', rating: 4.8 },
    { name: 'Vegan Poke Bowl', emoji: '🌱', price: '€12–18', diet: 'vegan', desc: 'Organic bowl, Buddha-style, plant-based', area: 'Canal Saint-Martin', rating: 4.6 },
    { name: 'Pain au Chocolat', emoji: '🥐', price: '€1.50–3', diet: 'veg', desc: 'Flaky pastry, dark chocolate — best from boulangerie', area: 'Any boulangerie', rating: 4.9 },
    { name: 'Soupe à l\'Oignon', emoji: '🧅', price: '€8–14', diet: 'veg', desc: 'Caramelized onion soup with gruyère toast', area: 'Les Halles', rating: 4.7 },
    { name: 'Crêpes Sucrées', emoji: '🫓', price: '€4–8', diet: 'veg', desc: 'Sweet crêpe with Nutella, banana, or lemon', area: 'Montmartre', rating: 4.5 },
  ],
};

const RESTAURANTS = {
  tokyo: [
    { name: 'Ichiran Ramen', rating: 4.8, type: 'Ramen', price: '¥¥', area: 'Shibuya', highlight: 'Solo dining booths · 24h available', diet: 'all', img: '' },
    { name: 'Gonpachi Nishi-Azabu', rating: 4.6, type: 'Japanese', price: '¥¥¥', area: 'Roppongi', highlight: '"Kill Bill" inspiration · Traditional decor', diet: 'all', img: '' },
    { name: 'Ain Soph Journey', rating: 4.7, type: 'Vegan', price: '¥¥', area: 'Shinjuku', highlight: '100% vegan Japanese · Popular spot', diet: 'vegan', img: '' },
    { name: 'Uobei Sushi', rating: 4.5, type: 'Conveyor Sushi', price: '¥', area: 'Shibuya', highlight: 'Budget sushi · Order via touchscreen', diet: 'all', img: '' },
  ],
  paris: [
    { name: 'Bouillon Chartier', rating: 4.7, type: 'French Brasserie', price: '€€', area: '9e Arrondissement', highlight: 'Historic 1896 brasserie · Huge portions', diet: 'all', img: '' },
    { name: 'L\'As du Fallafel', rating: 4.8, type: 'Middle Eastern', price: '€', area: 'Le Marais', highlight: 'Best falafel in Paris · Famous globally', diet: 'veg', img: '' },
    { name: 'Septime', rating: 4.9, type: 'Modern French', price: '€€€€', area: 'Bastille', highlight: 'Michelin star · Book 6 weeks ahead', diet: 'all', img: '' },
    { name: 'Wild & The Moon', rating: 4.6, type: 'Vegan', price: '€€', area: 'Marais', highlight: 'Celebrity favourite · Organic, vegan', diet: 'vegan', img: '' },
  ],
};

// ── Stay Data ──────────────────────────────────────────────────────────────
const HOTELS = {
  tokyo: [
    { name: 'Park Hyatt Tokyo', tier: 'luxury', price: '$350+/night', rating: 4.9, area: 'Shinjuku', img: 'https://images.unsplash.com/photo-1718851972754-6638b49b4775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', perks: ['43rd-floor pool', 'Lost in Translation hotel', 'Michelin restaurant'], safe: true },
    { name: 'Andaz Tokyo', tier: 'luxury', price: '$280+/night', rating: 4.8, area: 'Toranomon', img: 'https://images.unsplash.com/photo-1718851972754-6638b49b4775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', perks: ['Tokyo Tower views', 'Rooftop bar', 'Free minibar'], safe: true },
    { name: 'Shinjuku Granbell', tier: 'mid', price: '$90–150/night', rating: 4.5, area: 'Shinjuku', img: 'https://images.unsplash.com/photo-1718851972754-6638b49b4775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', perks: ['Central location', 'Trendy design', 'Rooftop terrace'], safe: true },
    { name: 'APA Hotel Shinjuku', tier: 'budget', price: '$45–80/night', rating: 4.2, area: 'Kabukicho', img: 'https://images.unsplash.com/photo-1718851972754-6638b49b4775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', perks: ['Prime station access', 'Hot spring bath', 'Compact rooms'], safe: true },
    { name: 'Khaosan Tokyo Lab', tier: 'budget', price: '$30–50/night', rating: 4.3, area: 'Asakusa', img: 'https://images.unsplash.com/photo-1718851972754-6638b49b4775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', perks: ['Backpacker vibe', 'Social atmosphere', 'Near Senso-ji'], safe: true },
  ],
  paris: [
    { name: 'Hôtel de Crillon', tier: 'luxury', price: '$600+/night', rating: 5.0, area: 'Place de la Concorde', img: 'https://images.unsplash.com/photo-1544097935-e6d136448533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', perks: ['Palace-grade luxury', '18th century palace', 'Concierge service'], safe: true },
    { name: 'Hotel Fabric', tier: 'mid', price: '$130–200/night', rating: 4.7, area: 'Oberkampf', img: 'https://images.unsplash.com/photo-1544097935-e6d136448533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', perks: ['Design boutique', 'Rooftop bar', 'Near Canal St-Martin'], safe: true },
    { name: 'Hotel du Temps', tier: 'mid', price: '$110–170/night', rating: 4.6, area: 'Opera', img: 'https://images.unsplash.com/photo-1544097935-e6d136448533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', perks: ['Haussmann building', 'Art collections', 'Central location'], safe: true },
    { name: 'Generator Paris', tier: 'budget', price: '$25–45/night', rating: 4.2, area: '10e Arrondissement', img: 'https://images.unsplash.com/photo-1544097935-e6d136448533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', perks: ['Social hostel', 'Bar & café', 'Modern design'], safe: true },
  ],
};

const SAFE_AREAS = {
  tokyo: ['Shinjuku (west)', 'Marunouchi', 'Shibuya', 'Akasaka', 'Minato-ku'],
  paris: ['4e Arrondissement (Marais)', '6e (Saint-Germain)', '7e (Eiffel Tower)', '15e (Montparnasse)', '2e (Opéra)'],
};

// ── Shopping Data ──────────────────────────────────────────────────────────
const SHOPPING_DISTRICTS = {
  tokyo: [
    { name: 'Akihabara', category: 'electronics', emoji: '🔌', desc: 'Electronics, anime, manga, gaming gear. 7+ floors of tech.', hours: '10am–8pm', bestFor: 'Cameras, headphones, collectibles', priceRange: '¥–¥¥¥¥', img: 'https://images.unsplash.com/photo-1771804358926-555f9ad319d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', aiTip: 'Negotiate at smaller shops · Saturday afternoons most vibrant' },
    { name: 'Harajuku Takeshita St', category: 'fashion', emoji: '👗', desc: 'Extreme street fashion, kawaii culture, crepe stands', hours: '10am–9pm', bestFor: 'Unique fashion, cosplay', priceRange: '¥–¥¥', img: 'https://images.unsplash.com/photo-1771804358926-555f9ad319d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', aiTip: 'Weekend mornings are the most lively · Perfect for Instagram' },
    { name: 'Ginza District', category: 'luxury', emoji: '💎', desc: 'Flagship luxury stores: LV, Gucci, Hermès, Chanel, Apple', hours: '11am–8pm', bestFor: 'Designer brands, art galleries', priceRange: '¥¥¥¥', img: 'https://images.unsplash.com/photo-1771804358926-555f9ad319d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', aiTip: 'Visit on Saturday 3–11pm when main street is pedestrian-only' },
    { name: 'Asakusa Nakamise', category: 'souvenirs', emoji: '🏮', desc: 'Traditional crafts, daruma dolls, fans, matcha sets', hours: '9am–7pm', bestFor: 'Authentic Japanese souvenirs', priceRange: '¥–¥¥', img: 'https://images.unsplash.com/photo-1771804358926-555f9ad319d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', aiTip: 'Go early morning to beat tour groups · Best authentic goods' },
    { name: 'Ameya-Yokocho Market', category: 'markets', emoji: '🏪', desc: 'Open-air street market, food, fashion, accessories', hours: '10am–8pm daily', bestFor: 'Budget shopping, street food', priceRange: '¥–¥¥', img: 'https://images.unsplash.com/photo-1771804358926-555f9ad319d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', aiTip: 'Haggling welcome here! Open during New Year when others close' },
  ],
  paris: [
    { name: 'Galeries Lafayette', category: 'luxury', emoji: '🏛️', desc: 'Iconic 8-story department store, stunning dome, all brands', hours: '10am–8pm', bestFor: 'French luxury, fashion, cosmetics', priceRange: '€€–€€€€', img: 'https://images.unsplash.com/photo-1766847733845-330a163ab279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', aiTip: 'Free rooftop terrace with Eiffel views · Tax refund available' },
    { name: 'Le Marais Boutiques', category: 'fashion', emoji: '👜', desc: 'Independent boutiques, vintage, emerging designers', hours: '11am–7pm', bestFor: 'Unique fashion, gallery culture', priceRange: '€€–€€€', img: 'https://images.unsplash.com/photo-1692134991593-25520e11186e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', aiTip: 'Sunday open (rare in Paris!) · Café culture between shops' },
    { name: 'Marché aux Puces', category: 'markets', emoji: '🛒', desc: 'Europe\'s largest flea market, antiques, vintage, art', hours: 'Sat–Mon 9am–6pm', bestFor: 'Antiques, vintage finds, art', priceRange: '€–€€€', img: 'https://images.unsplash.com/photo-1692134991593-25520e11186e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', aiTip: 'Arrive early Saturday · Prices negotiable · Take Métro line 4' },
    { name: 'Champs-Élysées', category: 'luxury', emoji: '🌟', desc: 'World\'s most famous avenue: luxury flagships + cinemas', hours: '10am–8pm daily', bestFor: 'Flagship luxury, window shopping', priceRange: '€€€–€€€€', img: 'https://images.unsplash.com/photo-1766847733845-330a163ab279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', aiTip: 'Visit Christmas market in December · Avoid tourist-priced cafés' },
    { name: 'Rue de Rivoli', category: 'souvenirs', emoji: '🗼', desc: 'Eiffel Tower models, postcards, berets, wine — classic Paris gifts', hours: '10am–10pm', bestFor: 'Paris souvenirs, gifts', priceRange: '€–€€', img: 'https://images.unsplash.com/photo-1692134991593-25520e11186e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', aiTip: 'Same souvenirs 50% cheaper here vs. tower gift shops' },
  ],
};

// ── Culture Data ───────────────────────────────────────────────────────────
const HERITAGE_SITES = {
  tokyo: [
    { name: 'Senso-ji Temple', era: '628 AD', type: 'Buddhist Temple', entry: 'Free', bestTime: 'Sunrise (6am)', rating: 4.9, img: 'https://images.unsplash.com/photo-1686933021139-69c8b4242198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', desc: 'Tokyo\'s oldest temple. Iconic red gate, market stalls, incense clouds, and tranquil grounds.', aiTip: 'Arrive at 6am to experience without crowds · Try fortune stick (omikuji)' },
    { name: 'Meiji Jingu Shrine', era: '1920', type: 'Shinto Shrine', entry: 'Free', bestTime: 'Morning', rating: 4.8, img: 'https://images.unsplash.com/photo-1686933021139-69c8b4242198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', desc: 'Forested sanctuary honoring Emperor Meiji. 70,000 trees create a peaceful urban forest.', aiTip: 'Sunday mornings you might witness a traditional wedding ceremony' },
    { name: 'Imperial Palace', era: '1457 (castle)', type: 'Historical Palace', entry: 'Free (grounds)', bestTime: 'Spring (sakura)', rating: 4.7, img: 'https://images.unsplash.com/photo-1686933021139-69c8b4242198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', desc: 'Primary residence of Japan\'s Imperial Family. East Gardens open to public daily.', aiTip: 'Join free guided tour for access to inner palace · Book online' },
    { name: 'teamLab Planets', era: 'Contemporary', type: 'Digital Art Museum', entry: '¥3,200', bestTime: 'Weekday morning', rating: 4.9, img: 'https://images.unsplash.com/photo-1686933021139-69c8b4242198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', desc: 'Immersive digital art walk-through — infinity mirrors, water, floating lights.', aiTip: 'Book weeks in advance · Wear comfortable clothes, go barefoot' },
  ],
  paris: [
    { name: 'Musée du Louvre', era: '1190 (fortress)', type: 'World Museum', entry: '€20', bestTime: 'Wed/Fri evening', rating: 4.9, img: 'https://images.unsplash.com/photo-1714391942356-2f21689a68af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', desc: 'World\'s largest art museum. Home to the Mona Lisa, Venus de Milo, and 35,000 works.', aiTip: 'Enter from Richelieu wing to avoid main pyramid queues · Closed Tuesday' },
    { name: 'Château de Versailles', era: '1682', type: 'Royal Palace', entry: '€19.50', bestTime: 'Weekday 9am', rating: 4.8, img: 'https://images.unsplash.com/photo-1758648995546-fab2a8196718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', desc: 'Sun King\'s magnificent palace. Hall of Mirrors, formal gardens, Marie Antoinette\'s hamlet.', aiTip: 'Buy skip-the-line tickets · Fountain shows on weekends (extra €9)' },
    { name: 'Cathédrale Notre-Dame', era: '1163', type: 'Gothic Cathedral', entry: 'Free (exterior)', bestTime: 'Morning', rating: 4.9, img: 'https://images.unsplash.com/photo-1714391942356-2f21689a68af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', desc: 'Iconic Gothic masterpiece. Rebuilt after 2019 fire — interior reopened Dec 2024.', aiTip: 'UNESCO World Heritage · Join free guided tours on Saturdays' },
    { name: 'Musée d\'Orsay', era: '1900 (railway)', type: 'Impressionist Museum', entry: '€16', bestTime: 'Thursday evening', rating: 4.9, img: 'https://images.unsplash.com/photo-1714391942356-2f21689a68af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', desc: 'World\'s finest Impressionist collection. Monet, Renoir, Van Gogh in a stunning railway station.', aiTip: 'Thursday open until 9:45pm — least crowded · Free first Sunday of month' },
  ],
};

// ── Component ──────────────────────────────────────────────────────────────
export const Discover: React.FC = () => {
  const [city, setCity] = useState<City>('tokyo');
  const [tab, setTab] = useState<Tab>('food');
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');
  const [shopFilter, setShopFilter] = useState<ShopFilter>('all');
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => setSavedItems(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const TABS: { id: Tab; label: string; icon: typeof Utensils; color: string }[] = [
    { id: 'food', label: 'Food', icon: Utensils, color: '#F97316' },
    { id: 'stay', label: 'Stay', icon: Hotel, color: '#0D9488' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#EC4899' },
    { id: 'culture', label: 'Culture', icon: Landmark, color: '#7C3AED' },
  ];

  const TIER_CONFIG: Record<string, { label: string; color: string }> = {
    budget: { label: 'Budget', color: 'bg-green-100 text-green-700' },
    mid: { label: 'Mid-Range', color: 'bg-blue-100 text-blue-700' },
    luxury: { label: 'Luxury', color: 'bg-purple-100 text-purple-700' },
  };

  const SHOP_CATEGORIES: ShopFilter[] = ['all', 'electronics', 'fashion', 'luxury', 'souvenirs', 'markets'];

  const filteredDishes = DISHES[city].filter(d => dietFilter === 'all' || d.diet === dietFilter || (dietFilter === 'veg' && d.diet === 'veg'));
  const filteredHotels = HOTELS[city].filter(h => budgetFilter === 'all' || h.tier === budgetFilter);
  const filteredShops = SHOPPING_DISTRICTS[city].filter(s => shopFilter === 'all' || s.category === shopFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-sm font-semibold text-[#2A4D3A]/60 uppercase tracking-wider mb-1">AI Curated</h2>
        <h1 className="text-3xl font-bold text-[#2A4D3A]">Discover</h1>
        <p className="text-slate-500 mt-1">Food, stays, shopping & culture — AI recommended.</p>
      </motion.div>

      {/* City + Hero */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl h-44">
        <img src={CITY_IMG[city][tab]} alt="City" className="absolute inset-0 w-full h-full object-cover transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-black/30 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
              {(['tokyo', 'paris'] as City[]).map(c => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    city === c ? 'bg-white text-slate-900' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {c === 'tokyo' ? '🇯🇵 Tokyo' : '🇫🇷 Paris'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
              <Zap size={12} className="text-[#F5B041]" />
              <span className="text-white text-xs font-semibold">AI Curated</span>
            </div>
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold">{city === 'tokyo' ? 'Tokyo' : 'Paris'}</h2>
            <p className="text-white/70 text-sm capitalize">{tab} recommendations · {city === 'tokyo' ? '45 places' : '38 places'} curated</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {TABS.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all flex-shrink-0 border ${
              tab === id ? 'text-white border-transparent shadow-md' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
            }`}
            style={tab === id ? { backgroundColor: color } : {}}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── FOOD TAB ─────────────────────────────────────────────────── */}
        {tab === 'food' && (
          <motion.div key="food" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Diet filter */}
            <div className="flex gap-2">
              {(['all', 'veg', 'vegan'] as DietFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setDietFilter(f)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    dietFilter === f ? 'bg-[#F97316] text-white border-transparent' : 'bg-white text-slate-500 border-slate-100'
                  }`}
                >
                  {f === 'veg' || f === 'vegan' ? <Leaf size={14} /> : null}
                  {f === 'all' ? 'All Food' : f === 'veg' ? 'Vegetarian' : 'Vegan Only'}
                </button>
              ))}
            </div>

            {/* Signature Dishes */}
            <div>
              <h3 className="font-bold text-[#2A4D3A] mb-3">Signature Dishes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredDishes.map((dish, i) => (
                  <motion.div
                    key={dish.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-lg hover:border-orange-200/50 transition-all group cursor-pointer"
                  >
                    <div className="text-3xl mb-3">{dish.emoji}</div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{dish.name}</h4>
                    <p className="text-slate-400 text-xs mb-2 line-clamp-2 leading-relaxed">{dish.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F97316]">{dish.price}</span>
                      <div className="flex items-center gap-0.5">
                        <Star size={10} className="text-[#F5B041] fill-[#F5B041]" />
                        <span className="text-[10px] font-semibold text-slate-500">{dish.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                      <MapPin size={10} /> {dish.area}
                    </div>
                    {dish.diet !== 'all' && (
                      <span className={`mt-2 inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${dish.diet === 'vegan' ? 'bg-green-100 text-green-700' : 'bg-emerald-50 text-emerald-600'}`}>
                        <Leaf size={9} /> {dish.diet === 'vegan' ? 'VEGAN' : 'VEG'}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Restaurant Picks */}
            <div>
              <h3 className="font-bold text-[#2A4D3A] mb-3">Top Restaurant Picks</h3>
              <div className="space-y-3">
                {RESTAURANTS[city]
                  .filter(r => dietFilter === 'all' || r.diet === dietFilter || (dietFilter === 'veg' && r.diet === 'veg'))
                  .map((r, i) => (
                    <motion.div
                      key={r.name}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-orange-200/50 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                        <Utensils size={20} className="text-[#F97316]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-slate-800 truncate">{r.name}</h4>
                          {r.diet === 'vegan' && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">VEGAN</span>}
                        </div>
                        <p className="text-xs text-slate-400 mb-1">{r.type} · {r.area} · {r.price}</p>
                        <p className="text-xs text-slate-500 italic line-clamp-1">{r.highlight}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center gap-0.5">
                          <Star size={12} className="text-[#F5B041] fill-[#F5B041]" />
                          <span className="text-xs font-bold text-slate-700">{r.rating}</span>
                        </div>
                        <button
                          onClick={() => toggleSave(r.name)}
                          className={`p-1.5 rounded-lg transition-colors ${savedItems.has(r.name) ? 'bg-red-100 text-red-500' : 'bg-slate-50 text-slate-300 hover:text-red-400'}`}
                        >
                          <Heart size={14} className={savedItems.has(r.name) ? 'fill-red-500' : ''} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STAY TAB ──────────────────────────────────────────────── */}
        {tab === 'stay' && (
          <motion.div key="stay" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Budget filter */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'budget', 'mid', 'luxury'] as BudgetFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setBudgetFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border capitalize ${
                    budgetFilter === f ? 'bg-[#0D9488] text-white border-transparent' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {f === 'all' ? 'All Tiers' : f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHotels.map((hotel, i) => (
                <motion.div
                  key={hotel.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${TIER_CONFIG[hotel.tier].color}`}>
                        {TIER_CONFIG[hotel.tier].label}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div>
                        <h4 className="text-white font-bold">{hotel.name}</h4>
                        <p className="text-white/70 text-xs flex items-center gap-1">
                          <MapPin size={10} /> {hotel.area}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <Star size={11} className="text-[#F5B041] fill-[#F5B041]" />
                        <span className="text-white text-xs font-bold">{hotel.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-[#2A4D3A]">{hotel.price}</span>
                      <button
                        onClick={() => toggleSave(hotel.name)}
                        className={`p-1.5 rounded-lg transition-colors ${savedItems.has(hotel.name) ? 'bg-red-100 text-red-500' : 'bg-slate-50 text-slate-300 hover:text-red-400'}`}
                      >
                        <Heart size={14} className={savedItems.has(hotel.name) ? 'fill-red-500' : ''} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {hotel.perks.map(perk => (
                        <span key={perk} className="text-[10px] bg-[#FDFBF7] border border-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Safe Areas */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5">
              <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <Globe size={18} /> Safest Areas to Stay in {city === 'tokyo' ? 'Tokyo' : 'Paris'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {SAFE_AREAS[city].map(area => (
                  <span key={area} className="flex items-center gap-1.5 bg-white text-emerald-700 border border-emerald-200 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
                    ✅ {area}
                  </span>
                ))}
              </div>
              <p className="text-emerald-600 text-sm mt-3">
                {city === 'tokyo'
                  ? '🔒 Tokyo is one of the safest cities in the world. All areas listed are extremely safe, even late at night.'
                  : '🔒 Central Paris is generally safe. Avoid peripheral areas (18e, 19e) late at night. Keep valuables secure near tourist sites.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── SHOPPING TAB ─────────────────────────────────────────── */}
        {tab === 'shopping' && (
          <motion.div key="shopping" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {SHOP_CATEGORIES.map(f => (
                <button
                  key={f}
                  onClick={() => setShopFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border flex-shrink-0 capitalize ${
                    shopFilter === f ? 'bg-[#EC4899] text-white border-transparent' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {f === 'all' ? 'All Districts' : f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredShops.map((shop, i) => (
                <motion.div
                  key={shop.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all group cursor-pointer"
                >
                  <img src={shop.img} alt={shop.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative z-10 p-5 h-52 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <span className="text-3xl">{shop.emoji}</span>
                      <span className="text-[10px] font-bold bg-[#EC4899] text-white px-2.5 py-1 rounded-full capitalize">{shop.category}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{shop.name}</h4>
                      <p className="text-white/70 text-xs mb-2 line-clamp-2">{shop.desc}</p>
                      <div className="flex gap-2 mb-3">
                        <span className="flex items-center gap-1 text-white/70 text-[10px] bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Clock size={10} /> {shop.hours}
                        </span>
                        <span className="flex items-center gap-1 text-white/70 text-[10px] bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Tag size={10} /> {shop.priceRange}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 bg-black/30 backdrop-blur-sm rounded-xl p-2.5">
                        <Zap size={12} className="text-[#F5B041] flex-shrink-0 mt-0.5" />
                        <p className="text-white/90 text-[11px]">{shop.aiTip}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map of shopping districts */}
            <div>
              <h3 className="font-bold text-[#2A4D3A] mb-3">Shopping District Map</h3>
              <InteractiveMap city={city} filterType="shopping" showFilters={false} height="h-64" />
            </div>
          </motion.div>
        )}

        {/* ── CULTURE TAB ──────────────────────────────────────────── */}
        {tab === 'culture' && (
          <motion.div key="culture" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid grid-cols-1 gap-5">
              {HERITAGE_SITES[city].map((site, i) => (
                <motion.div
                  key={site.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={site.img} alt={site.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex gap-2">
                        <span className="text-[11px] font-bold bg-[#7C3AED] text-white px-2.5 py-1 rounded-full">{site.type}</span>
                        <span className="text-[11px] font-bold bg-black/40 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">{site.era}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-2xl mb-1">{site.name}</h3>
                        <p className="text-white/80 text-sm line-clamp-2">{site.desc}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => toggleSave(site.name)}
                        className={`p-2 rounded-xl backdrop-blur-sm transition-colors ${savedItems.has(site.name) ? 'bg-red-500' : 'bg-black/30 hover:bg-black/50'}`}
                      >
                        <Heart size={16} className={`text-white ${savedItems.has(site.name) ? 'fill-white' : ''}`} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-3 mb-4">
                      <div className="flex-1 bg-[#FDFBF7] rounded-xl p-3 text-center border border-slate-100">
                        <DollarSign size={14} className="text-[#F5B041] mx-auto mb-1" />
                        <div className="text-xs text-slate-400 mb-0.5">Entry</div>
                        <div className="font-bold text-[#2A4D3A] text-sm">{site.entry}</div>
                      </div>
                      <div className="flex-1 bg-[#FDFBF7] rounded-xl p-3 text-center border border-slate-100">
                        <Clock size={14} className="text-[#F5B041] mx-auto mb-1" />
                        <div className="text-xs text-slate-400 mb-0.5">Best Time</div>
                        <div className="font-bold text-[#2A4D3A] text-sm">{site.bestTime}</div>
                      </div>
                      <div className="flex-1 bg-[#FDFBF7] rounded-xl p-3 text-center border border-slate-100">
                        <Star size={14} className="text-[#F5B041] fill-[#F5B041] mx-auto mb-1" />
                        <div className="text-xs text-slate-400 mb-0.5">Rating</div>
                        <div className="font-bold text-[#2A4D3A] text-sm">{site.rating}/5</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-[#7C3AED]/5 border border-[#7C3AED]/15 rounded-xl p-3">
                      <Zap size={14} className="text-[#7C3AED] flex-shrink-0 mt-0.5" />
                      <p className="text-slate-600 text-sm">{site.aiTip}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
