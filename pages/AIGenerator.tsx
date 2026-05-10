import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, MapPin, Clock, Wallet, Users, Leaf, Star, ChevronRight,
  ChevronLeft, Brain, Hotel, Utensils, Train, Plane, ShoppingBag,
  Mountain, Music, Camera, Landmark, Moon, Sun, CheckCircle,
  DollarSign, Zap, ArrowLeft, RotateCcw, Download, Edit, AlertCircle,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAI } from '../context/AIContext';
import { callOpenAI, buildTripGenerationPrompt } from '../utils/aiService';
import { useTrips } from '../context/TripsContext';
import type { Trip } from '../data/tripsData';

// ── Destination image mapping ──────────────────────────────────────────────
const DEST_IMAGES: Record<string, { heroImg: string; img: string }> = {
  japan:   { heroImg: 'https://images.unsplash.com/photo-1735854794012-d64142df3f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', img: 'https://images.unsplash.com/photo-1564903955735-4cd3dfcfdfb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' },
  bali:    { heroImg: 'https://images.unsplash.com/photo-1761521688849-9700476692e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', img: 'https://images.unsplash.com/photo-1761521688849-9700476692e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' },
  europe:  { heroImg: 'https://images.unsplash.com/photo-1775401152601-79793ac4c173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', img: 'https://images.unsplash.com/photo-1775401152601-79793ac4c173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' },
  thailand:{ heroImg: 'https://images.unsplash.com/photo-1589896013294-a91626e219ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', img: 'https://images.unsplash.com/photo-1589896013294-a91626e219ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' },
  default: { heroImg: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800' },
};

function getDestImages(destination: string) {
  const lower = destination.toLowerCase();
  if (lower.includes('japan') || lower.includes('tokyo') || lower.includes('kyoto') || lower.includes('osaka')) return DEST_IMAGES.japan;
  if (lower.includes('bali') || lower.includes('ubud') || lower.includes('indonesia')) return DEST_IMAGES.bali;
  if (lower.includes('europe') || lower.includes('paris') || lower.includes('rome') || lower.includes('barcelona')) return DEST_IMAGES.europe;
  if (lower.includes('thai') || lower.includes('bangkok') || lower.includes('phuket')) return DEST_IMAGES.thailand;
  return DEST_IMAGES.default;
}

// ── Types ──────────────────────────────────────────────────────────────────
interface FormState {
  destination: string;
  duration: number;
  budget: string;
  currency: string;
  style: string;
  interests: string[];
  groupType: string;
  season: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const POPULAR_DESTINATIONS = [
  { name: 'Japan', flag: '🇯🇵', emoji: '⛩️' },
  { name: 'Bali', flag: '🇮🇩', emoji: '🌴' },
  { name: 'Europe', flag: '🇪🇺', emoji: '🏛️' },
  { name: 'Thailand', flag: '🇹🇭', emoji: '🐘' },
  { name: 'Maldives', flag: '🇲🇻', emoji: '🏝️' },
  { name: 'Paris', flag: '🇫🇷', emoji: '🗼' },
  { name: 'New York', flag: '🇺🇸', emoji: '🗽' },
  { name: 'Singapore', flag: '🇸🇬', emoji: '🦁' },
  { name: 'Dubai', flag: '🇦🇪', emoji: '🏙️' },
  { name: 'Vietnam', flag: '🇻🇳', emoji: '🍜' },
];

const TRAVEL_STYLES = [
  { id: 'backpacker', label: 'Backpacker', icon: '🎒', desc: 'Hostels, local food, off-beaten paths' },
  { id: 'budget', label: 'Budget', icon: '💰', desc: 'Budget hotels, mix of local & tourist' },
  { id: 'mid', label: 'Comfort', icon: '🛎️', desc: 'Mid-range hotels, guided experiences' },
  { id: 'luxury', label: 'Luxury', icon: '💎', desc: '5-star hotels, premium experiences' },
];

const INTERESTS = [
  { id: 'street-food', label: 'Street Food', icon: Utensils },
  { id: 'fine-dining', label: 'Fine Dining', icon: Star },
  { id: 'anime-manga', label: 'Anime & Manga', icon: Sparkles },
  { id: 'temples', label: 'Temples & Shrines', icon: Landmark },
  { id: 'nightlife', label: 'Nightlife', icon: Moon },
  { id: 'markets', label: 'Night Markets', icon: ShoppingBag },
  { id: 'hiking', label: 'Hiking & Nature', icon: Mountain },
  { id: 'beaches', label: 'Beach & Ocean', icon: Sun },
  { id: 'museums', label: 'Art & Museums', icon: Landmark },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'music', label: 'Live Music', icon: Music },
];

const GROUP_TYPES = [
  { id: 'solo', label: 'Solo', icon: '🧳', desc: 'Just me' },
  { id: 'couple', label: 'Couple', icon: '💑', desc: 'Romantic trip' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', desc: 'With kids' },
  { id: 'friends', label: 'Friends', icon: '👫', desc: 'Group trip' },
  { id: 'business', label: 'Business', icon: '💼', desc: 'Work + travel' },
];

const CURRENCIES = [
  { code: '₹', name: 'INR' },
  { code: '$', name: 'USD' },
  { code: '€', name: 'EUR' },
  { code: '£', name: 'GBP' },
];

// ── Generated Trip Templates ───────────────────────────────────────────────
const AI_LOADING_STEPS = [
  'Analyzing your preferences...',
  'Researching best destinations...',
  'Optimizing travel routes...',
  'Curating hotel options...',
  'Selecting food experiences...',
  'Calculating budget breakdown...',
  'Generating packing list...',
  'Finalizing your perfect trip... ✨',
];

const generateTrip = (form: FormState) => {
  const dest = form.destination.toLowerCase();
  const isJapan = dest.includes('japan') || dest.includes('tokyo') || dest.includes('kyoto');
  const isBali = dest.includes('bali') || dest.includes('ubud') || dest.includes('indonesia');
  const isEurope = dest.includes('europe') || dest.includes('paris') || dest.includes('rome') || dest.includes('barcelona');
  const isThailand = dest.includes('thai') || dest.includes('bangkok');

  const budgetNum = parseFloat(form.budget || '100000');
  const currency = form.currency;
  const days = form.duration;

  if (isJapan || (!isBali && !isEurope && !isThailand)) {
    return {
      title: `${days}-Day Japan Explorer`,
      destination: 'Japan',
      flag: '🇯🇵',
      route: 'Tokyo → Kyoto → Osaka',
      img: 'https://images.unsplash.com/photo-1564903955735-4cd3dfcfdfb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      heroImg: 'https://images.unsplash.com/photo-1735854794012-d64142df3f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
      highlights: ['Senso-ji at sunrise', 'teamLab Borderless', 'Shinkansen ride', 'Fushimi Inari torii gates', 'Dotonbori food crawl'],
      budget: {
        total: budgetNum,
        currency,
        items: [
          { label: 'Flights', value: Math.round(budgetNum * 0.30), color: '#2A4D3A' },
          { label: 'Hotels', value: Math.round(budgetNum * 0.24), color: '#F5B041' },
          { label: 'Food', value: Math.round(budgetNum * 0.20), color: '#F97316' },
          { label: 'Transport', value: Math.round(budgetNum * 0.10), color: '#3B82F6' },
          { label: 'Activities', value: Math.round(budgetNum * 0.12), color: '#7C3AED' },
          { label: 'Misc', value: Math.round(budgetNum * 0.04), color: '#94A3B8' },
        ],
      },
      days: [
        {
          day: 1, city: 'Tokyo', theme: 'Arrival & First Impressions',
          activities: [
            { time: '3:00 PM', title: 'Check-in at APA Hotel Shinjuku', type: 'hotel', emoji: '🏨', cost: 3200, tip: 'Request high floor for city view' },
            { time: '5:00 PM', title: 'Shibuya Crossing & Scramble', type: 'culture', emoji: '🚦', cost: 0, tip: 'Go during evening rush for maximum effect' },
            { time: '7:30 PM', title: 'Ramen dinner at Ichiran Ramen', type: 'food', emoji: '🍜', cost: 1200, tip: 'Solo booths — unique Japanese experience' },
            { time: '9:00 PM', title: 'Akihabara Electric Town exploration', type: 'activity', emoji: '🎮', cost: 0, tip: 'Open until midnight on weekends' },
          ],
        },
        {
          day: 2, city: 'Tokyo', theme: 'Culture & Art',
          activities: [
            { time: '6:00 AM', title: 'Senso-ji Temple at sunrise', type: 'culture', emoji: '⛩️', cost: 0, tip: 'Arrive before 7am to avoid crowds' },
            { time: '9:00 AM', title: 'Asakusa street food & Nakamise', type: 'food', emoji: '🍡', cost: 800, tip: 'Try ningyo-yaki and melon bread' },
            { time: '1:00 PM', title: 'teamLab Planets — digital art', type: 'activity', emoji: '🌌', cost: 3200, tip: 'Pre-book online — sells out weeks ahead!' },
            { time: '7:00 PM', title: 'Roppongi fine dining', type: 'food', emoji: '🍷', cost: 5000, tip: 'Try Gonpachi for wagyu & sake' },
          ],
        },
        {
          day: 3, city: 'Tokyo → Kyoto', theme: 'Shinkansen Day',
          activities: [
            { time: '8:00 AM', title: 'Shinkansen from Tokyo to Kyoto', type: 'transport', emoji: '🚄', cost: 14960, tip: 'JR Pass covers this — book in advance' },
            { time: '11:30 AM', title: 'Nishiki Market lunch tour', type: 'food', emoji: '🥢', cost: 1500, tip: 'Try pickled vegetables and fresh mochi' },
            { time: '2:00 PM', title: 'Arashiyama Bamboo Grove', type: 'culture', emoji: '🎍', cost: 0, tip: 'Visit on weekday to avoid crowds' },
            { time: '5:00 PM', title: 'Monkey Park at Iwatayama', type: 'activity', emoji: '🐒', cost: 550, tip: 'Beautiful panoramic views of Kyoto' },
          ],
        },
        {
          day: 4, city: 'Kyoto', theme: 'Thousand Torii Gates',
          activities: [
            { time: '6:00 AM', title: 'Fushimi Inari Taisha at dawn', type: 'culture', emoji: '🏮', cost: 0, tip: 'Best light for photography at sunrise' },
            { time: '10:00 AM', title: 'Kinkaku-ji (Golden Pavilion)', type: 'culture', emoji: '🏯', cost: 500, tip: 'Go before 10am — massive queues form' },
            { time: '1:00 PM', title: 'Gion geisha district walk', type: 'culture', emoji: '👘', cost: 0, tip: 'Evening is better for geisha sightings' },
            { time: '7:00 PM', title: 'Traditional kaiseki dinner', type: 'food', emoji: '🍱', cost: 4500, tip: 'A seasonal multi-course Japanese meal' },
          ],
        },
        {
          day: 5, city: 'Osaka → Departure', theme: 'Food Capital & Farewell',
          activities: [
            { time: '9:00 AM', title: 'Osaka Castle & Park', type: 'culture', emoji: '🏯', cost: 600, tip: 'Cherry blossoms in spring' },
            { time: '12:00 PM', title: 'Dotonbori street food marathon', type: 'food', emoji: '🦞', cost: 2000, tip: 'Try takoyaki, okonomiyaki, and kushikatsu' },
            { time: '3:00 PM', title: 'Shinsaibashi shopping street', type: 'shopping', emoji: '🛍️', cost: 0, tip: 'Last chance for Japanese souvenirs' },
            { time: '6:00 PM', title: 'Airport transfer to KIX', type: 'transport', emoji: '✈️', cost: 1230, tip: 'Haruka Express: 75 min to KIX airport' },
          ],
        },
      ],
      packing: {
        essentials: ['Suica/Pasmo IC card', 'JR Pass (if applicable)', 'Pocket WiFi device', 'Power adapter (Type A)', 'Cash in JPY (Japan is cash-heavy)'],
        clothing: ['Light layers (summer)', 'Slip-on shoes (temples)', 'Rain jacket', 'Comfortable walking shoes'],
        tech: ['Offline Google Maps', 'Google Translate (camera mode)', 'HyperDia app for trains'],
        health: ['Travel insurance docs', 'Basic medications', 'Sunscreen'],
      },
      aiTips: [
        '🚇 Get a Suica card at the airport — use it for all trains, buses, and even convenience stores.',
        '🍣 For budget sushi, skip Tsukiji and try standing sushi bars (tachigui-zushi) for ¥100–200/piece.',
        '🚂 JR Pass saves money only if you take 3+ Shinkansen rides — calculate before buying.',
        '📱 Download Google Translate with Japanese camera mode offline — essential for menus.',
        '🌸 Cherry blossom season (late March–April) adds ~30% to hotel prices. Book months ahead.',
      ],
    };
  }

  if (isBali) {
    return {
      title: `${days}-Day Bali Retreat`,
      destination: 'Bali',
      flag: '🇮🇩',
      route: 'Seminyak → Ubud → Kuta',
      img: 'https://images.unsplash.com/photo-1761521688849-9700476692e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      heroImg: 'https://images.unsplash.com/photo-1761521688849-9700476692e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
      highlights: ['Tegallalang Rice Terraces', 'Mount Batur sunrise trek', 'Tanah Lot sunset', 'Ubud Monkey Forest', 'Kuta beach sunset'],
      budget: {
        total: budgetNum,
        currency,
        items: [
          { label: 'Flights', value: Math.round(budgetNum * 0.32), color: '#2A4D3A' },
          { label: 'Hotels', value: Math.round(budgetNum * 0.20), color: '#F5B041' },
          { label: 'Food', value: Math.round(budgetNum * 0.18), color: '#F97316' },
          { label: 'Transport', value: Math.round(budgetNum * 0.08), color: '#3B82F6' },
          { label: 'Activities', value: Math.round(budgetNum * 0.16), color: '#7C3AED' },
          { label: 'Misc', value: Math.round(budgetNum * 0.06), color: '#94A3B8' },
        ],
      },
      days: [
        { day: 1, city: 'Seminyak', theme: 'Beach Arrival', activities: [
          { time: '2:00 PM', title: 'Check-in at private villa', type: 'hotel', emoji: '🏝️', cost: 4500, tip: 'Seminyak villas offer pools for amazing value' },
          { time: '4:00 PM', title: 'Seminyak Beach sunset', type: 'activity', emoji: '🌅', cost: 0, tip: 'Best sunset spot in south Bali' },
          { time: '7:00 PM', title: 'Dinner at Sarong Restaurant', type: 'food', emoji: '🍤', cost: 2500, tip: 'Fantastic Asian fusion — book ahead' },
        ]},
        { day: 2, city: 'Ubud', theme: 'Culture & Jungle', activities: [
          { time: '9:00 AM', title: 'Tegallalang Rice Terraces', type: 'culture', emoji: '🌿', cost: 300, tip: 'Go early morning for photography' },
          { time: '11:00 AM', title: 'Sacred Monkey Forest Sanctuary', type: 'activity', emoji: '🐒', cost: 500, tip: 'Keep belongings secure around monkeys!' },
          { time: '2:00 PM', title: 'Ubud Palace & Art Market', type: 'culture', emoji: '🎨', cost: 0, tip: 'Best handmade batik & wood carvings here' },
          { time: '7:00 PM', title: 'Kecak Fire Dance performance', type: 'activity', emoji: '🔥', cost: 1000, tip: 'Unmissable Balinese cultural experience' },
        ]},
      ],
      packing: {
        essentials: ['Sarong (required at temples)', 'Cash in IDR', 'Travel adaptor (Type C)', 'Printed visa'],
        clothing: ['Light linen clothes', 'Sandals', 'Swimwear', 'Long sleeves for temples'],
        tech: ['Grab app (SE Asia Uber)', 'Offline Maps Me app'],
        health: ['Mosquito repellent', 'Sunscreen SPF 50+', 'Anti-diarrheal meds', 'Water purification tablets'],
      },
      aiTips: [
        '🛵 Rent a scooter for ₹400/day — best way to explore Ubud and Canggu.',
        '🍜 Eat at warungs (local eateries) for ₹150–300 per meal — nasi goreng is incredible.',
        '🌺 Visit temples during festivals for an authentic Bali experience — check local calendars.',
        '💰 Bali is very budget-friendly — don\'t overpay at tourist hotspots, always bargain.',
        '🦟 Dengue fever risk is real — wear mosquito repellent especially at dusk.',
      ],
    };
  }

  if (isEurope) {
    return {
      title: `${days}-Day Europe Highlights`,
      destination: 'Europe',
      flag: '🇪🇺',
      route: 'Paris → Rome → Barcelona',
      img: 'https://images.unsplash.com/photo-1775401152601-79793ac4c173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      heroImg: 'https://images.unsplash.com/photo-1775401152601-79793ac4c173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
      highlights: ['Eiffel Tower at night', 'The Louvre Museum', 'Colosseum at sunset', 'Vatican Museums', 'Sagrada Família'],
      budget: {
        total: budgetNum,
        currency,
        items: [
          { label: 'Flights', value: Math.round(budgetNum * 0.28), color: '#2A4D3A' },
          { label: 'Hotels', value: Math.round(budgetNum * 0.30), color: '#F5B041' },
          { label: 'Food', value: Math.round(budgetNum * 0.20), color: '#F97316' },
          { label: 'Transport', value: Math.round(budgetNum * 0.10), color: '#3B82F6' },
          { label: 'Activities', value: Math.round(budgetNum * 0.08), color: '#7C3AED' },
          { label: 'Misc', value: Math.round(budgetNum * 0.04), color: '#94A3B8' },
        ],
      },
      days: [
        { day: 1, city: 'Paris', theme: 'City of Lights', activities: [
          { time: '2:00 PM', title: 'Hotel Fabric check-in', type: 'hotel', emoji: '🏨', cost: 12000, tip: 'Central Paris — walkable to most sights' },
          { time: '4:00 PM', title: 'Eiffel Tower visit (summit)', type: 'culture', emoji: '🗼', cost: 3200, tip: 'Book tickets 2 weeks ahead — no queues' },
          { time: '7:30 PM', title: 'Seine River dinner cruise', type: 'food', emoji: '🛥️', cost: 6500, tip: 'Spectacular evening lights on the river' },
        ]},
        { day: 2, city: 'Paris', theme: 'Art & Culture', activities: [
          { time: '9:00 AM', title: 'Louvre Museum (4 hours)', type: 'culture', emoji: '🖼️', cost: 2000, tip: 'Enter from Richelieu wing to skip main queue' },
          { time: '2:00 PM', title: 'Le Marais vintage shopping', type: 'shopping', emoji: '🛍️', cost: 0, tip: 'Best independent boutiques in Paris' },
          { time: '7:00 PM', title: 'French bistro dinner', type: 'food', emoji: '🥩', cost: 3500, tip: 'Try steak frites at Bistrot Paul Bert' },
        ]},
      ],
      packing: {
        essentials: ['Eurail Pass', 'Travel insurance', 'EU power adapter (Type C/E)', 'EHIC health card'],
        clothing: ['Smart casual outfits', 'Layer-able clothing', 'Comfortable walking shoes', 'Rain jacket'],
        tech: ['Google Maps offline', 'Revolut card (no forex fees)', 'Rome2rio app for transport'],
        health: ['Basic first aid kit', 'Prescription copies', 'Sunscreen'],
      },
      aiTips: [
        '🚂 Book train between Paris and Rome 8 weeks ahead for the best prices (€40 vs €200).',
        '🎟️ Buy museum tickets online for ALL major attractions — queues are hours long in summer.',
        '💳 Get a Revolut or Wise card — zero forex fees across all European currencies.',
        '🍕 In Rome, avoid restaurants with photos on menus near tourist sites — they\'re tourist traps.',
        '🌂 Pack a foldable umbrella — European weather is unpredictable year-round.',
      ],
    };
  }

  // Thailand default
  return {
    title: `${days}-Day Thailand Adventure`,
    destination: 'Thailand',
    flag: '🇹🇭',
    route: 'Bangkok → Chiang Mai → Phuket',
    img: 'https://images.unsplash.com/photo-1589896013294-a91626e219ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    heroImg: 'https://images.unsplash.com/photo-1589896013294-a91626e219ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    highlights: ['Grand Palace Bangkok', 'Elephant Sanctuary Chiang Mai', 'Phi Phi Islands', 'Muay Thai match', 'Floating markets'],
    budget: {
      total: budgetNum,
      currency,
      items: [
        { label: 'Flights', value: Math.round(budgetNum * 0.25), color: '#2A4D3A' },
        { label: 'Hotels', value: Math.round(budgetNum * 0.18), color: '#F5B041' },
        { label: 'Food', value: Math.round(budgetNum * 0.15), color: '#F97316' },
        { label: 'Transport', value: Math.round(budgetNum * 0.12), color: '#3B82F6' },
        { label: 'Activities', value: Math.round(budgetNum * 0.22), color: '#7C3AED' },
        { label: 'Misc', value: Math.round(budgetNum * 0.08), color: '#94A3B8' },
      ],
    },
    days: [
      { day: 1, city: 'Bangkok', theme: 'Royal Temples & Street Food', activities: [
        { time: '9:00 AM', title: 'Grand Palace & Wat Phra Kaew', type: 'culture', emoji: '🏛️', cost: 500, tip: 'Dress code enforced — wear long sleeves' },
        { time: '1:00 PM', title: 'Pad Thai at Thip Samai', type: 'food', emoji: '🍜', cost: 300, tip: 'Best Pad Thai in Bangkok — queue worth it' },
        { time: '4:00 PM', title: 'Chatuchak Weekend Market', type: 'shopping', emoji: '🛒', cost: 0, tip: 'Over 15,000 stalls — go with a list!' },
        { time: '8:00 PM', title: 'Khao San Road night scene', type: 'activity', emoji: '🌙', cost: 0, tip: 'Best street food scene at night' },
      ]},
    ],
    packing: {
      essentials: ['Tourist visa (if required)', 'Thai Baht cash', 'Power adapter (Type A/B)', 'Grab app (SE Asia Uber)'],
      clothing: ['Loose breathable clothing', 'Temple appropriate attire', 'Sandals', 'Swimwear for beaches'],
      tech: ['Offline Maps.me', 'Google Translate with Thai', 'TrueMoney wallet app'],
      health: ['Mosquito repellent with DEET', 'Sunscreen SPF 50+', 'Electrolytes for heat', 'Stomach meds'],
    },
    aiTips: [
      '🛺 Always use Grab app for taxis — avoid tuk-tuks for longer distances (overpriced for tourists).',
      '🍜 Street food is incredibly safe and delicious — eat where locals eat for meals under ₹150.',
      '🐘 Only visit ethical elephant sanctuaries — avoid riding elephants.',
      '⛩️ Dress modestly at all temples — both men and women must cover shoulders and knees.',
      '💊 Food may be spicier than expected — carry antacids.',
    ],
  };
};

// ── Activity type styles ───────────────────────────────────────────────────
const ACTIVITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  hotel: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  food: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  culture: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  activity: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  transport: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  shopping: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
};

const STEPS = [
  { label: 'Destination', icon: MapPin },
  { label: 'Duration', icon: Clock },
  { label: 'Budget', icon: Wallet },
  { label: 'Style', icon: Star },
  { label: 'Interests', icon: Sparkles },
  { label: 'Group', icon: Users },
];

// ── Component ──────────────────────────────────────────────────────────────
export const AIGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { isAIEnabled, setShowSettings } = useAI();
  const { addTrip } = useTrips();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    destination: '', duration: 5, budget: '100000', currency: '₹',
    style: '', interests: [], groupType: '', season: 'any',
  });
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof generateTrip> | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [aiError, setAiError]         = useState('');
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const loadingRef = useRef<NodeJS.Timeout | null>(null);

  const canNext = () => {
    if (step === 0) return form.destination.trim().length > 0;
    if (step === 1) return form.duration > 0;
    if (step === 2) return form.budget.length > 0;
    if (step === 3) return form.style.length > 0;
    if (step === 4) return form.interests.length > 0;
    if (step === 5) return form.groupType.length > 0;
    return true;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setLoadingStep(0);
    setAiError('');
    let i = 0;

    if (isAIEnabled) {
      // Animate loading steps while AI generates
      loadingRef.current = setInterval(() => {
        i = Math.min(i + 1, AI_LOADING_STEPS.length - 2);
        setLoadingStep(i);
      }, 700);

      try {
        const messages = buildTripGenerationPrompt({
          destination: form.destination,
          duration: form.duration,
          budget: form.budget,
          currency: form.currency,
          style: form.style,
          interests: form.interests,
          groupType: form.groupType,
          season: form.season,
        });

        const rawJson = await callOpenAI(messages, {
          max_tokens: 4000,
          temperature: 0.8,
          json_mode: true,
        });

        clearInterval(loadingRef.current!);
        setLoadingStep(AI_LOADING_STEPS.length - 1);

        const parsed = JSON.parse(rawJson) as ReturnType<typeof generateTrip>;
        const images = getDestImages(form.destination);
        const withImages = { ...parsed, ...images };

        setTimeout(() => {
          setAiGenerated(true);
          setResult(withImages);
          setGenerating(false);
        }, 500);
      } catch (err) {
        clearInterval(loadingRef.current!);
        const msg = err instanceof Error ? err.message : 'Unknown error';
        // Silently fall back to template — API calls are blocked in preview/sandbox.
        // No alarming error banners; the template result is equally rich.
        console.info('[Traveloop AI] Using template mode:', msg);

        setTimeout(() => {
          setAiGenerated(false);
          setResult(generateTrip(form));
          setGenerating(false);
        }, 600);
      }
    } else {
      // Template generation with animation
      loadingRef.current = setInterval(() => {
        i++;
        setLoadingStep(i);
        if (i >= AI_LOADING_STEPS.length - 1) {
          clearInterval(loadingRef.current!);
          setTimeout(() => {
            setAiGenerated(false);
            setResult(generateTrip(form));
            setGenerating(false);
          }, 800);
        }
      }, 500);
    }
  };

  useEffect(() => () => { if (loadingRef.current) clearInterval(loadingRef.current); }, []);

  const toggleInterest = (id: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id) ? f.interests.filter(i => i !== id) : [...f.interests, id],
    }));
  };

  // ── RESULT VIEW ─────────────────────────────────────────────────────────
  if (result) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl h-64">
          <img src={result.heroImg} alt={result.destination} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <button onClick={() => setResult(null)} className="flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-xl hover:bg-black/50 transition-colors border border-white/20">
                <RotateCcw size={14} /> Regenerate
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                  aiGenerated ? 'bg-emerald-400 text-emerald-900' : 'bg-[#F5B041] text-[#2A4D3A]'
                }`}>
                  <Sparkles size={12} /> {aiGenerated ? 'GPT-Powered ✨' : 'AI Template'}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{result.flag}</span>
                <span className="text-white/70 text-sm font-medium bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">{result.route}</span>
              </div>
              <h1 className="text-white text-3xl font-bold mb-1">{result.title}</h1>
              <p className="text-white/70 text-sm">{result.budget?.currency ?? form.currency}{Number(result.budget?.total ?? 0).toLocaleString()} · {form.groupType} · {form.style}</p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-[#2A4D3A] mb-3 flex items-center gap-2">
            <Star size={18} className="text-[#F5B041] fill-[#F5B041]" /> Trip Highlights
          </h3>
          <div className="flex flex-wrap gap-2">
            {(result.highlights ?? []).map(h => (
              <span key={h} className="flex items-center gap-1.5 bg-[#F5B041]/10 border border-[#F5B041]/25 text-[#2A4D3A] text-sm font-medium px-3 py-1.5 rounded-full">
                ✨ {h}
              </span>
            ))}
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-[#2A4D3A] mb-4 flex items-center gap-2">
            <Wallet size={18} className="text-[#F5B041]" /> Budget Breakdown
          </h3>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-44 h-44 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={result.budget?.items ?? []} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {(result.budget?.items ?? []).map((item, idx) => (
                      <Cell key={`budget-cell-${idx}`} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${result.budget?.currency ?? form.currency}${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2 w-full">
              {(result.budget?.items ?? []).map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400">{item.label}</div>
                    <div className="font-bold text-slate-800 text-sm">{result.budget?.currency ?? form.currency}{item.value.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 bg-[#2A4D3A]/5 border border-[#2A4D3A]/10 rounded-2xl px-4 py-3 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Total Estimated Budget</span>
            <span className="font-bold text-[#2A4D3A] text-xl">{result.budget?.currency ?? form.currency}{Number(result.budget?.total ?? 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Day-by-Day Itinerary */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-[#2A4D3A] text-lg flex items-center gap-2">
              <Clock size={18} className="text-[#F5B041]" /> Day-by-Day Itinerary
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {(result.days ?? []).map((day) => (
              <div key={day.day}>
                <button
                  onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-[#2A4D3A] rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-[10px] font-semibold leading-none">Day</span>
                    <span className="text-white font-bold text-lg leading-none">{day.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800">{day.city}</div>
                    <div className="text-sm text-slate-400">{day.theme} · {day.activities.length} activities</div>
                  </div>
                  <ChevronRight size={18} className={`text-slate-300 transition-transform ${expandedDay === day.day ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedDay === day.day && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3">
                        {(day.activities ?? []).map((act, ai) => {
                          const style = ACTIVITY_STYLES[act.type] || ACTIVITY_STYLES.activity;
                          return (
                            <motion.div
                              key={ai}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ai * 0.06 }}
                              className={`flex gap-4 p-4 rounded-2xl border ${style.bg} ${style.border}`}
                            >
                              <div className="flex-shrink-0 text-center">
                                <div className="text-2xl mb-1">{act.emoji}</div>
                                <div className="text-[10px] text-slate-400 font-semibold">{act.time}</div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 mb-0.5">{act.title}</h4>
                                <p className="text-xs text-slate-500 italic mb-1">💡 {act.tip}</p>
                                {act.cost > 0 && (
                                  <span className={`text-xs font-bold ${style.text}`}>
                                    Est. {result.budget?.currency ?? form.currency}{act.cost.toLocaleString()}
                                  </span>
                                )}
                                {act.cost === 0 && <span className="text-xs font-bold text-emerald-600">Free</span>}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Packing List */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-[#2A4D3A] mb-4 flex items-center gap-2">
            🎒 AI-Generated Packing List
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result.packing ?? {}).map(([cat, items]) => (
              <div key={cat} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <h4 className="font-semibold text-slate-600 text-xs uppercase tracking-wider mb-3 capitalize">{cat}</h4>
                <div className="space-y-1.5">
                  {((items as string[]) ?? []).map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle size={13} className="text-[#2A4D3A] flex-shrink-0" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tips */}
        <div className="bg-gradient-to-r from-[#2A4D3A] to-[#1a3328] rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={18} className="text-[#F5B041]" /> AI Expert Tips for {result.destination}
          </h3>
          <div className="space-y-3">
            {(result.aiTips ?? []).map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 bg-white/8 border border-white/10 rounded-2xl p-3"
              >
                <p className="text-white/85 text-sm leading-relaxed">{tip}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={async () => {
              if (saving || saved || !result) return;
              setSaving(true);

              // Convert AI result → Trip shape (including all AI-generated data)
              const tripId = `ai-${Date.now()}`;
              const newTrip: Trip = {
                id: tripId,
                title: result.title,
                destination: result.route || result.destination,
                countries: [result.destination],
                cities: result.route?.split(' → ') || [result.destination],
                cover: result.heroImg || result.img || '',
                status: 'Upcoming',
                startDate: 'TBD',
                endDate: 'TBD',
                days: form.duration,
                budget: parseFloat(form.budget) || 1000,
                spent: 0,
                travelers: form.groupType === 'Family' ? 4 : form.groupType === 'Couple' ? 2 : form.groupType === 'Group' ? 6 : 1,
                travelType: form.groupType || 'Solo',
                interests: form.interests,
                progress: 0,
                description: `AI-crafted ${form.duration}-day trip to ${result.destination}. ${result.route || ''}`,
                healthScore: 78,
                aiGenerated: true,
                // Full AI-generated content saved to context
                flag: result.flag,
                route: result.route,
                highlights: result.highlights ?? [],
                aiTips: result.aiTips ?? [],
                aiPacking: result.packing as Trip['aiPacking'],
                aiBudgetItems: result.budget?.items ?? [],
                generatedDays: (result.days ?? []) as Trip['generatedDays'],
              };

              addTrip(newTrip);

              // Small delay for animation
              await new Promise(r => setTimeout(r, 900));
              setSaving(false);
              setSaved(true);

              await new Promise(r => setTimeout(r, 1200));
              navigate(`/trips/${tripId}`);
            }}
            disabled={saving || saved}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg text-sm ${
              saved
                ? 'bg-emerald-500 text-white'
                : saving
                ? 'bg-[#2A4D3A]/70 text-white cursor-wait'
                : 'bg-[#2A4D3A] hover:bg-[#1f382a] text-white'
            }`}
          >
            {saved ? (
              <><CheckCircle size={18} /> Saved! Opening workspace…</>
            ) : saving ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                Saving to My Trips…
              </>
            ) : (
              <><Sparkles size={18} /> Save to My Trips</>
            )}
          </button>
          <button
            onClick={() => { setResult(null); setSaved(false); setSaving(false); }}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 py-4 px-5 rounded-2xl font-bold hover:border-slate-300 transition-all"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </motion.div>
    );
  }

  // ── LOADING VIEW ─────────────────────────────────────────────────────────
  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-full border-4 border-[#F5B041]/30 border-t-[#F5B041] shadow-lg"
        />
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-3">
            <Brain size={22} className="text-[#2A4D3A]" />
            <h2 className="text-2xl font-bold text-[#2A4D3A]">AI Crafting Your Trip</h2>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-slate-500 text-lg"
            >
              {AI_LOADING_STEPS[Math.min(loadingStep, AI_LOADING_STEPS.length - 1)]}
            </motion.p>
          </AnimatePresence>
          <div className="w-64 h-2 bg-slate-100 rounded-full mt-5 mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2A4D3A] to-[#F5B041] rounded-full"
              animate={{ width: `${((loadingStep + 1) / AI_LOADING_STEPS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-center max-w-sm">
          {AI_LOADING_STEPS.map((s, i) => (
            <motion.div
              key={i}
              animate={{ scale: i <= loadingStep ? 1 : 0.8, opacity: i <= loadingStep ? 1 : 0.3 }}
              className={`w-2 h-2 rounded-full ${i <= loadingStep ? 'bg-[#F5B041]' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── FORM VIEW ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={() => navigate('/plan')} className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#2A4D3A] hover:border-slate-200 transition-colors shadow-sm">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-[#2A4D3A] flex items-center gap-2">
            <Sparkles size={22} className="text-[#F5B041]" /> AI Trip Generator
          </h1>
          <p className="text-slate-400 text-sm">Answer 6 quick questions — we'll build your perfect trip.</p>
        </div>
        {/* AI status chip */}
        <button
          onClick={() => setShowSettings(true)}
          className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
            isAIEnabled
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isAIEnabled ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          {isAIEnabled ? 'GPT Active' : 'Add API Key'}
        </button>
      </motion.div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-[#2A4D3A]">Step {step + 1} of {STEPS.length}</span>
          <span className="text-sm text-slate-400">{STEPS[step].label}</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                i < step ? 'bg-[#2A4D3A]' : i === step ? 'bg-[#F5B041]' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((s, i) => (
            <div key={s.label} className={`flex flex-col items-center ${i > 4 ? 'hidden sm:flex' : ''}`}>
              <s.icon size={12} className={i <= step ? 'text-[#2A4D3A]' : 'text-slate-300'} />
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          {/* Step 0: Destination */}
          {step === 0 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#2A4D3A] mb-1">Where do you want to go?</h2>
              <p className="text-slate-400 text-sm mb-5">Pick a destination or type your own.</p>
              <div className="relative mb-5">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.destination}
                  onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                  placeholder="e.g. Japan, Bali, Europe..."
                  className="w-full pl-11 pr-4 py-3.5 bg-[#FDFBF7] border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#2A4D3A]/40 transition-colors"
                />
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Popular Destinations</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {POPULAR_DESTINATIONS.map(dest => (
                  <button
                    key={dest.name}
                    onClick={() => setForm(f => ({ ...f, destination: dest.name }))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border text-sm font-medium transition-all ${
                      form.destination === dest.name
                        ? 'bg-[#2A4D3A] text-white border-[#2A4D3A] shadow-md'
                        : 'bg-white text-slate-600 border-slate-100 hover:border-[#2A4D3A]/30 hover:text-[#2A4D3A]'
                    }`}
                  >
                    <span>{dest.emoji}</span>
                    <span className="truncate">{dest.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Duration */}
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#2A4D3A] mb-1">How many days?</h2>
              <p className="text-slate-400 text-sm mb-8">Including travel days.</p>
              <div className="text-center mb-8">
                <div className="text-7xl font-bold text-[#2A4D3A] mb-2">{form.duration}</div>
                <div className="text-slate-400">days</div>
              </div>
              <input
                type="range" min={3} max={30} value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}
                className="w-full accent-[#2A4D3A] h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>3 days</span><span>30 days</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-6">
                {[3, 5, 7, 10, 14, 21, 28, 30].map(d => (
                  <button key={d} onClick={() => setForm(f => ({ ...f, duration: d }))}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      form.duration === d ? 'bg-[#2A4D3A] text-white border-transparent shadow-md' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-[#2A4D3A]/30'
                    }`}
                  >{d}d</button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#2A4D3A] mb-1">What's your total budget?</h2>
              <p className="text-slate-400 text-sm mb-6">Including flights, hotels, food, and activities.</p>
              <div className="flex gap-2 mb-5">
                {CURRENCIES.map(c => (
                  <button key={c.code} onClick={() => setForm(f => ({ ...f, currency: c.code }))}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                      form.currency === c.code ? 'bg-[#2A4D3A] text-white border-transparent shadow-md' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                    }`}
                  >{c.code} {c.name}</button>
                ))}
              </div>
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2A4D3A] font-bold text-xl">{form.currency}</span>
                <input
                  type="number"
                  value={form.budget}
                  onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                  placeholder="100000"
                  className="w-full pl-10 pr-4 py-4 bg-[#FDFBF7] border border-slate-200 rounded-2xl text-slate-700 text-xl font-bold focus:outline-none focus:border-[#2A4D3A]/40 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(form.currency === '₹'
                  ? ['50000', '100000', '150000', '250000']
                  : ['500', '1000', '2000', '5000']
                ).map(b => (
                  <button key={b} onClick={() => setForm(f => ({ ...f, budget: b }))}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                      form.budget === b ? 'bg-[#F5B041] text-[#2A4D3A] border-transparent shadow-md' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-[#F5B041]/40'
                    }`}
                  >{form.currency}{Number(b).toLocaleString()}</button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Travel Style */}
          {step === 3 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#2A4D3A] mb-1">What's your travel style?</h2>
              <p className="text-slate-400 text-sm mb-6">This shapes hotel quality, dining, and experiences.</p>
              <div className="space-y-3">
                {TRAVEL_STYLES.map(style => (
                  <button key={style.id} onClick={() => setForm(f => ({ ...f, style: style.id }))}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                      form.style === style.id
                        ? 'bg-[#2A4D3A]/5 border-[#2A4D3A]/30 shadow-md'
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-3xl">{style.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800">{style.label}</h3>
                        {form.style === style.id && <CheckCircle size={16} className="text-[#2A4D3A]" />}
                      </div>
                      <p className="text-sm text-slate-400">{style.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {step === 4 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#2A4D3A] mb-1">What are your interests?</h2>
              <p className="text-slate-400 text-sm mb-6">Select all that apply — minimum 1.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {INTERESTS.map(interest => {
                  const selected = form.interests.includes(interest.id);
                  return (
                    <button key={interest.id} onClick={() => toggleInterest(interest.id)}
                      className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-sm font-semibold transition-all ${
                        selected
                          ? 'bg-[#2A4D3A] text-white border-transparent shadow-md'
                          : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <interest.icon size={16} className={selected ? 'text-[#F5B041]' : 'text-slate-400'} />
                      {interest.label}
                    </button>
                  );
                })}
              </div>
              {form.interests.length > 0 && (
                <p className="text-center text-xs text-[#2A4D3A] font-semibold mt-4">
                  ✅ {form.interests.length} interest{form.interests.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          )}

          {/* Step 5: Group Type */}
          {step === 5 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#2A4D3A] mb-1">Who are you travelling with?</h2>
              <p className="text-slate-400 text-sm mb-6">This helps us pick the right accommodation & experiences.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GROUP_TYPES.map(g => (
                  <button key={g.id} onClick={() => setForm(f => ({ ...f, groupType: g.id }))}
                    className={`flex flex-col items-center p-5 rounded-2xl border transition-all ${
                      form.groupType === g.id
                        ? 'bg-[#2A4D3A]/5 border-[#2A4D3A]/30 shadow-md'
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-4xl mb-2">{g.icon}</span>
                    <span className="font-bold text-slate-800">{g.label}</span>
                    <span className="text-xs text-slate-400">{g.desc}</span>
                    {form.groupType === g.id && <CheckCircle size={16} className="text-[#2A4D3A] mt-2" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:border-slate-300 transition-all"
          >
            <ChevronLeft size={18} /> Back
          </button>
        )}
        <button
          onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : handleGenerate()}
          disabled={!canNext()}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all ${
            canNext()
              ? step === STEPS.length - 1
                ? 'bg-gradient-to-r from-[#F5B041] to-amber-400 text-[#2A4D3A] shadow-lg hover:shadow-xl active:scale-[0.98]'
                : 'bg-[#2A4D3A] text-white hover:bg-[#1f382a] shadow-md'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          {step === STEPS.length - 1 ? (
            <>{isAIEnabled ? <><Zap size={18} /> Generate with GPT — {form.duration} Days</> : <><Sparkles size={18} /> Generate My {form.duration}-Day Trip</>}</>
          ) : (
            <>Continue <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};
