import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Utensils, Hotel, ShoppingBag, Landmark, Shield, Train, X } from 'lucide-react';

type City = 'tokyo' | 'paris';

interface District {
  id: string; x: number; y: number; rx: number; ry: number;
  color: string; label: string; type: string;
}

interface MapPin2 {
  id: string; x: number; y: number; type: string; label: string; detail: string;
}

interface Road { x1: number; y1: number; x2: number; y2: number; color: string; width: number; }

const FILTER_TYPES = [
  { id: 'all', label: 'All', icon: MapPin, color: '#2A4D3A' },
  { id: 'food', label: 'Food', icon: Utensils, color: '#F97316' },
  { id: 'hotel', label: 'Stay', icon: Hotel, color: '#0D9488' },
  { id: 'shopping', label: 'Shop', icon: ShoppingBag, color: '#EC4899' },
  { id: 'culture', label: 'Culture', icon: Landmark, color: '#7C3AED' },
  { id: 'transport', label: 'Transit', icon: Train, color: '#3B82F6' },
  { id: 'emergency', label: 'Safety', icon: Shield, color: '#EF4444' },
];

const CITY_DATA: Record<City, { districts: District[]; pins: MapPin2[]; roads: Road[] }> = {
  tokyo: {
    districts: [
      { id: 'shinjuku', x: 22, y: 45, rx: 9, ry: 7, color: '#3B82F6', label: 'Shinjuku', type: 'transport' },
      { id: 'shibuya', x: 28, y: 62, rx: 8, ry: 6, color: '#EC4899', label: 'Shibuya', type: 'shopping' },
      { id: 'harajuku', x: 30, y: 55, rx: 6, ry: 5, color: '#DB2777', label: 'Harajuku', type: 'shopping' },
      { id: 'akihabara', x: 62, y: 38, rx: 8, ry: 6, color: '#F5B041', label: 'Akihabara', type: 'shopping' },
      { id: 'asakusa', x: 72, y: 22, rx: 9, ry: 7, color: '#7C3AED', label: 'Asakusa', type: 'culture' },
      { id: 'ueno', x: 62, y: 25, rx: 8, ry: 6, color: '#059669', label: 'Ueno', type: 'culture' },
      { id: 'ginza', x: 63, y: 58, rx: 8, ry: 6, color: '#6D28D9', label: 'Ginza', type: 'shopping' },
      { id: 'roppongi', x: 46, y: 65, rx: 7, ry: 5, color: '#F97316', label: 'Roppongi', type: 'food' },
      { id: 'tokyo-st', x: 55, y: 48, rx: 9, ry: 6, color: '#1D4ED8', label: 'Tokyo Sta.', type: 'transport' },
      { id: 'odaiba', x: 68, y: 80, rx: 10, ry: 6, color: '#14B8A6', label: 'Odaiba', type: 'culture' },
    ],
    pins: [
      { id: 'p1', x: 22, y: 45, type: 'transport', label: 'Shinjuku Station', detail: 'Busiest station · 3.6M daily · Yamanote + 200 exits' },
      { id: 'p2', x: 62, y: 38, type: 'shopping', label: 'Akihabara', detail: 'Electronics paradise · Anime/Manga · Open 10am-8pm' },
      { id: 'p3', x: 72, y: 22, type: 'culture', label: 'Senso-ji Temple', detail: '628 AD · Free entry · Open 24h · Best at sunrise' },
      { id: 'p4', x: 55, y: 48, type: 'transport', label: 'Tokyo Station', detail: 'Shinkansen hub · JR lines · Marunouchi district' },
      { id: 'p5', x: 28, y: 62, type: 'shopping', label: 'Shibuya Crossing', detail: 'Iconic crossing · Shopping · Nightlife · 109 Dept Store' },
      { id: 'p6', x: 46, y: 65, type: 'food', label: 'Roppongi', detail: 'Fine dining · International cuisine · Nightlife hub' },
      { id: 'p7', x: 62, y: 58, type: 'shopping', label: 'Ginza', detail: 'Luxury brands · Art galleries · Premium dining' },
      { id: 'p8', x: 30, y: 35, type: 'emergency', label: 'Hospital', detail: 'Tokyo Medical University · 24/7 Emergency · EN staff' },
      { id: 'p9', x: 62, y: 25, type: 'culture', label: 'Ueno Park', detail: 'Tokyo National Museum · Zoo · Cherry blossoms' },
      { id: 'p10', x: 68, y: 80, type: 'hotel', label: 'Odaiba Hotels', detail: 'Waterfront stays · Futuristic views · Great transport' },
    ],
    roads: [
      { x1: 22, y1: 45, x2: 55, y2: 48, color: '#22C55E', width: 2 }, // Yamanote
      { x1: 55, y1: 48, x2: 62, y2: 38, color: '#22C55E', width: 2 },
      { x1: 62, y1: 38, x2: 62, y2: 25, color: '#22C55E', width: 2 },
      { x1: 62, y1: 25, x2: 72, y2: 22, color: '#22C55E', width: 1.5 },
      { x1: 22, y1: 45, x2: 28, y2: 62, color: '#94A3B8', width: 1.5 }, // Road
      { x1: 28, y1: 62, x2: 46, y2: 65, color: '#94A3B8', width: 1.5 },
      { x1: 46, y1: 65, x2: 63, y2: 58, color: '#94A3B8', width: 1.5 },
      { x1: 55, y1: 48, x2: 63, y2: 58, color: '#F5B041', width: 2 }, // Ginza line
      { x1: 63, y1: 58, x2: 68, y2: 80, color: '#94A3B8', width: 1 },
    ],
  },
  paris: {
    districts: [
      { id: 'eiffel', x: 28, y: 60, rx: 9, ry: 7, color: '#2A4D3A', label: 'Eiffel Tower', type: 'culture' },
      { id: 'louvre', x: 50, y: 42, rx: 9, ry: 7, color: '#7C3AED', label: 'Louvre', type: 'culture' },
      { id: 'champs', x: 35, y: 40, rx: 10, ry: 7, color: '#1E40AF', label: 'Champs-Élysées', type: 'shopping' },
      { id: 'marais', x: 60, y: 40, rx: 8, ry: 6, color: '#EC4899', label: 'Le Marais', type: 'shopping' },
      { id: 'montmartre', x: 46, y: 20, rx: 9, ry: 7, color: '#F5B041', label: 'Montmartre', type: 'culture' },
      { id: 'saint-g', x: 46, y: 60, rx: 9, ry: 7, color: '#059669', label: 'Saint-Germain', type: 'food' },
      { id: 'latin', x: 56, y: 60, rx: 8, ry: 6, color: '#F97316', label: 'Latin Quarter', type: 'food' },
      { id: 'defense', x: 16, y: 38, rx: 8, ry: 6, color: '#3B82F6', label: 'La Défense', type: 'transport' },
      { id: 'nation', x: 72, y: 52, rx: 7, ry: 5, color: '#14B8A6', label: 'Nation', type: 'transport' },
    ],
    pins: [
      { id: 'p1', x: 28, y: 60, type: 'culture', label: 'Eiffel Tower', detail: '330m tall · Book summit online · Best at night lit up' },
      { id: 'p2', x: 50, y: 42, type: 'culture', label: 'Louvre Museum', detail: 'World\'s largest · €20 entry · Closed Tuesday · Book ahead' },
      { id: 'p3', x: 35, y: 40, type: 'shopping', label: 'Champs-Élysées', detail: 'Luxury flagships · LV, Dior, Cartier · 24h buzz' },
      { id: 'p4', x: 60, y: 40, type: 'shopping', label: 'Le Marais', detail: 'Vintage shops · Independent boutiques · Falafel street' },
      { id: 'p5', x: 46, y: 20, type: 'culture', label: 'Montmartre', detail: 'Sacré-Cœur · Artist village · Best sunset views' },
      { id: 'p6', x: 46, y: 60, type: 'food', label: 'Saint-Germain', detail: 'Cafes, brasseries · Les Deux Magots · Boulangeries' },
      { id: 'p7', x: 56, y: 60, type: 'food', label: 'Latin Quarter', detail: 'Student energy · Budget eats · Rue Mouffetard market' },
      { id: 'p8', x: 16, y: 38, type: 'transport', label: 'La Défense', detail: 'Business district · RER A terminal · Grand Arche' },
      { id: 'p9', x: 55, y: 28, type: 'emergency', label: 'Hospital', detail: 'Hôpital Lariboisière · 24/7 ER · EN service · Metro: Gare du Nord' },
      { id: 'p10', x: 44, y: 50, type: 'hotel', label: 'Best Stay Zone', detail: 'Central Paris · 4e Arrondissement · Safe, walkable, beautiful' },
    ],
    roads: [
      { x1: 16, y1: 38, x2: 35, y2: 40, color: '#F5B041', width: 2 }, // Line 1
      { x1: 35, y1: 40, x2: 50, y2: 42, color: '#F5B041', width: 2 },
      { x1: 50, y1: 42, x2: 72, y2: 52, color: '#F5B041', width: 2 },
      { x1: 46, y1: 20, x2: 46, y2: 60, color: '#94A3B8', width: 1.5 }, // Blvd
      { x1: 28, y1: 60, x2: 46, y2: 60, color: '#94A3B8', width: 1.5 },
      { x1: 46, y1: 60, x2: 56, y2: 60, color: '#94A3B8', width: 1.5 },
      { x1: 60, y1: 40, x2: 56, y2: 60, color: '#EC4899', width: 1.5 }, // Marais
      { x1: 35, y1: 40, x2: 28, y2: 60, color: '#2A4D3A', width: 1.5 }, // South road
    ],
  },
};

const TYPE_COLOR: Record<string, string> = {
  food: '#F97316', hotel: '#0D9488', shopping: '#EC4899',
  culture: '#7C3AED', transport: '#3B82F6', emergency: '#EF4444', all: '#2A4D3A',
};

interface Props {
  city?: City;
  filterType?: string;
  showFilters?: boolean;
  height?: string;
}

export const InteractiveMap: React.FC<Props> = ({
  city: initialCity = 'tokyo',
  filterType: initialFilter = 'all',
  showFilters = true,
  height = 'h-80',
}) => {
  const [city, setCity] = useState<City>(initialCity);
  const [filter, setFilter] = useState(initialFilter);
  const [hovered, setHovered] = useState<MapPin2 | null>(null);

  const data = CITY_DATA[city];
  const visiblePins = filter === 'all' ? data.pins : data.pins.filter(p => p.type === filter);

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-lg bg-slate-900">
      {/* Map Toolbar */}
      <div className="bg-slate-800/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3 border-b border-white/10">
        {/* City toggle */}
        <div className="flex gap-1 bg-slate-700/60 rounded-xl p-1">
          {(['tokyo', 'paris'] as City[]).map(c => (
            <button
              key={c}
              onClick={() => { setCity(c); setHovered(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                city === c ? 'bg-[#F5B041] text-[#2A4D3A]' : 'text-white/60 hover:text-white'
              }`}
            >
              {c === 'tokyo' ? '🇯🇵 Tokyo' : '🇫🇷 Paris'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/50 text-[11px]">Live Map</span>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-slate-800/70 px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none border-b border-white/5">
          {FILTER_TYPES.map(ft => {
            const Icon = ft.icon;
            return (
              <button
                key={ft.id}
                onClick={() => setFilter(ft.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex-shrink-0 border ${
                  filter === ft.id
                    ? 'text-white border-transparent'
                    : 'text-white/50 border-white/10 hover:text-white/80'
                }`}
                style={{ backgroundColor: filter === ft.id ? ft.color : 'transparent' }}
              >
                <Icon size={11} />
                {ft.label}
              </button>
            );
          })}
        </div>
      )}

      {/* SVG Map Canvas */}
      <div className={`relative ${height} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden`}>
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#64748b" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* SVG for districts + roads */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Roads/Transit lines */}
          {data.roads.map((road, i) => (
            <line
              key={i}
              x1={`${road.x1}%`} y1={`${road.y1}%`}
              x2={`${road.x2}%`} y2={`${road.y2}%`}
              stroke={road.color} strokeWidth={road.width * 0.15}
              strokeOpacity={0.6}
              className="animate-route"
            />
          ))}

          {/* Districts */}
          {data.districts.map(d => {
            const isFiltered = filter !== 'all' && d.type !== filter;
            return (
              <ellipse
                key={d.id}
                cx={`${d.x}%`} cy={`${d.y}%`}
                rx={`${d.rx * 0.8}%`} ry={`${d.ry * 1.5}%`}
                fill={d.color}
                fillOpacity={isFiltered ? 0.05 : 0.15}
                stroke={d.color}
                strokeWidth="0.2"
                strokeOpacity={isFiltered ? 0.1 : 0.4}
              />
            );
          })}
        </svg>

        {/* Pins - using absolute positioned divs for better interaction */}
        {visiblePins.map((pin, i) => {
          const color = TYPE_COLOR[pin.type] || '#2A4D3A';
          return (
            <div
              key={pin.id}
              className="absolute cursor-pointer"
              style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHovered(pin)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Radar rings */}
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: color, opacity: 0.2, transform: 'scale(2)' }}
              />
              {/* Main pin */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 400 }}
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative z-10"
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.6 }}
              />
            </div>
          );
        })}

        {/* Hover tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              className="absolute z-50 pointer-events-none"
              style={{
                left: `${Math.min(hovered.x + 4, 68)}%`,
                top: `${Math.max(hovered.y - 18, 5)}%`,
              }}
            >
              <div className="bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-2xl min-w-[180px] max-w-[220px]">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: TYPE_COLOR[hovered.type] }}
                  />
                  <span className="text-white font-bold text-sm">{hovered.label}</span>
                </div>
                <p className="text-white/60 text-[11px] leading-relaxed">{hovered.detail}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* District labels */}
        {data.districts
          .filter(d => filter === 'all' || d.type === filter)
          .map(d => (
            <div
              key={`label-${d.id}`}
              className="absolute pointer-events-none"
              style={{ left: `${d.x}%`, top: `${d.y - 5}%`, transform: 'translateX(-50%)' }}
            >
              <span className="text-[9px] font-bold text-white/50 whitespace-nowrap">{d.label}</span>
            </div>
          ))}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/10">
            <div className="w-3 h-0.5 bg-[#F5B041] rounded" />
            <span className="text-[10px] text-white/50">Metro Line</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/10">
            <div className="w-3 h-0.5 bg-slate-400 rounded" />
            <span className="text-[10px] text-white/50">Road</span>
          </div>
        </div>
      </div>
    </div>
  );
};
