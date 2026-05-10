import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Camera, BookOpen, Utensils, Mountain, Landmark,
  StickyNote, Heart, MapPin, Clock, Sparkles, Share2,
  ChevronLeft, ChevronRight, Grid3X3, List, PlayCircle,
  Smile, Wind, Zap, Star, Sunset, Moon, Coffee, Music,
  BarChart2, TrendingUp, Image, Download, Globe,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type MemoryType = 'photo' | 'journal' | 'food' | 'adventure' | 'cultural' | 'note';
type Mood = 'excited' | 'relaxed' | 'adventurous' | 'romantic' | 'peaceful' | 'emotional' | 'fun' | 'thrilling';
type ViewMode = 'feed' | 'polaroid' | 'timeline';

interface Memory {
  id: string;
  type: MemoryType;
  title: string;
  description: string;
  mood: Mood;
  city: string;
  place: string;
  time: string;
  day: number;
  date: string;
  images: string[];
  tags: string[];
  weather: string;
  likes: number;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const SAMPLE_MEMORIES: Memory[] = [
  {
    id: 'm1', type: 'photo', day: 1, date: 'Jun 10',
    title: 'Shibuya After Dark 🌙',
    description: 'Stood at the Shibuya crossing at midnight and just watched the world move in perfect choreography. 3,000 people crossing at once and somehow nobody collides. The neon lights reflecting off wet pavement — this is why I travel.',
    mood: 'thrilling', city: 'Tokyo', place: 'Shibuya Crossing', time: '11:45 PM',
    images: [
      'https://images.unsplash.com/photo-1752070493852-3c4554538293?w=800&q=80',
      'https://images.unsplash.com/photo-1770387795112-e2b476b15f71?w=800&q=80',
    ],
    tags: ['nightlife', 'tokyo', 'iconic', 'photography'], weather: '22°C · Clear', likes: 42,
  },
  {
    id: 'm2', type: 'food', day: 1, date: 'Jun 10',
    title: 'Best Ramen of My Life 🍜',
    description: 'Ichiran Ramen — solo booth, curtain drawn, tonkotsu broth so rich it feels like velvet. The flavour customisation sheet alone took me 5 minutes. Worth every yen, worth every calorie, worth the 40-minute queue.',
    mood: 'fun', city: 'Tokyo', place: 'Ichiran Ramen, Shinjuku', time: '1:30 PM',
    images: ['https://images.unsplash.com/photo-1762587757364-b9f8ed5ba39f?w=800&q=80'],
    tags: ['food', 'ramen', 'solo dining', 'must-try'], weather: '24°C · Sunny', likes: 28,
  },
  {
    id: 'm3', type: 'cultural', day: 2, date: 'Jun 11',
    title: 'Senso-ji at Sunrise 🏯',
    description: 'Arrived at 6am before the tourist crowds. Just me, a handful of locals praying, incense smoke curling into pale morning light. The five-storey pagoda glowed orange. I sat on the steps for an hour saying nothing — felt everything.',
    mood: 'peaceful', city: 'Tokyo', place: 'Senso-ji Temple, Asakusa', time: '6:15 AM',
    images: [
      'https://images.unsplash.com/photo-1617599137346-98e7c279ebe6?w=800&q=80',
      'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800&q=80',
    ],
    tags: ['temple', 'spiritual', 'sunrise', 'culture', 'asakusa'], weather: '19°C · Misty', likes: 61,
  },
  {
    id: 'm4', type: 'journal', day: 2, date: 'Jun 11',
    title: 'A Letter to Myself 📓',
    description: `Day 2 in Tokyo and I'm already changed. There's something about this city that makes you feel both anonymous and deeply seen. I got lost today — on purpose. Wandered into a tiny alley in Yanaka where time seems to have stopped. An old woman offered me mochi. We couldn't speak each other's language but we sat together in her doorway for twenty minutes smiling at pigeons.

That's the real Japan. Not the Shibuya crossing. Not the neon.

It's mochi with a stranger and the sound of temple bells at 8am.`,
    mood: 'emotional', city: 'Tokyo', place: 'Yanaka District', time: '3:00 PM',
    images: ['https://images.unsplash.com/photo-1771681625705-e6fcc490c8c9?w=800&q=80'],
    tags: ['journal', 'reflection', 'authentic', 'wandering'], weather: '21°C · Partly Cloudy', likes: 89,
  },
  {
    id: 'm5', type: 'adventure', day: 3, date: 'Jun 12',
    title: 'teamLab Borderless 🎨',
    description: 'Walking through walls of light and colour at teamLab. You lose all sense of where you are. The flower room made me cry (don\'t tell anyone). Pure art meets pure technology meets pure wonder. The best museum experience of my life, and I\'ve been to the Louvre.',
    mood: 'excited', city: 'Tokyo', place: 'teamLab Borderless, Odaiba', time: '2:00 PM',
    images: [
      'https://images.unsplash.com/photo-1770387795112-e2b476b15f71?w=800&q=80',
      'https://images.unsplash.com/photo-1752070493852-3c4554538293?w=800&q=80',
    ],
    tags: ['art', 'digital', 'immersive', 'unmissable'], weather: '23°C · Clear', likes: 73,
  },
];

const DAYS = [
  { day: 1, date: 'Jun 10', city: 'Tokyo', weather: '24°C ☀️', count: 2 },
  { day: 2, date: 'Jun 11', city: 'Tokyo', weather: '21°C 🌤️', count: 2 },
  { day: 3, date: 'Jun 12', city: 'Tokyo', weather: '23°C ☀️', count: 1 },
];

const MEMORY_TYPES: { type: MemoryType; icon: React.ElementType; label: string; color: string; bg: string }[] = [
  { type: 'photo',     icon: Camera,    label: 'Photo',     color: 'text-blue-600',    bg: 'bg-blue-50'   },
  { type: 'journal',   icon: BookOpen,  label: 'Journal',   color: 'text-violet-600',  bg: 'bg-violet-50' },
  { type: 'food',      icon: Utensils,  label: 'Food',      color: 'text-orange-600',  bg: 'bg-orange-50' },
  { type: 'adventure', icon: Mountain,  label: 'Adventure', color: 'text-emerald-600', bg: 'bg-emerald-50'},
  { type: 'cultural',  icon: Landmark,  label: 'Cultural',  color: 'text-amber-600',   bg: 'bg-amber-50'  },
  { type: 'note',      icon: StickyNote,label: 'Note',      color: 'text-slate-600',   bg: 'bg-slate-50'  },
];

const MOODS: { mood: Mood; emoji: string; label: string; color: string }[] = [
  { mood: 'excited',     emoji: '🤩', label: 'Excited',     color: 'bg-yellow-100 text-yellow-700 border-yellow-200'   },
  { mood: 'relaxed',     emoji: '😌', label: 'Relaxed',     color: 'bg-sky-100 text-sky-700 border-sky-200'           },
  { mood: 'adventurous', emoji: '🧗', label: 'Adventurous', color: 'bg-emerald-100 text-emerald-700 border-emerald-200'},
  { mood: 'romantic',    emoji: '🌹', label: 'Romantic',    color: 'bg-pink-100 text-pink-700 border-pink-200'         },
  { mood: 'peaceful',    emoji: '🕊️', label: 'Peaceful',    color: 'bg-teal-100 text-teal-700 border-teal-200'         },
  { mood: 'emotional',   emoji: '🥹', label: 'Emotional',   color: 'bg-purple-100 text-purple-700 border-purple-200'   },
  { mood: 'fun',         emoji: '🎉', label: 'Fun',         color: 'bg-orange-100 text-orange-700 border-orange-200'   },
  { mood: 'thrilling',   emoji: '⚡', label: 'Thrilling',   color: 'bg-red-100 text-red-700 border-red-200'            },
];

const TYPE_META: Record<MemoryType, { icon: React.ElementType; color: string; label: string }> = {
  photo:     { icon: Camera,    color: 'text-blue-500',   label: 'Photo Memory'     },
  journal:   { icon: BookOpen,  color: 'text-violet-500', label: 'Journal'          },
  food:      { icon: Utensils,  color: 'text-orange-500', label: 'Food Experience'  },
  adventure: { icon: Mountain,  color: 'text-emerald-500',label: 'Adventure'        },
  cultural:  { icon: Landmark,  color: 'text-amber-500',  label: 'Cultural Moment'  },
  note:      { icon: StickyNote,color: 'text-slate-500',  label: 'Quick Note'       },
};

// ── Story Viewer ──────────────────────────────────────────────────────────────
const StoryViewer = ({ memories, start, onClose }: {
  memories: Memory[]; start: number; onClose: () => void;
}) => {
  const [idx, setIdx] = useState(start);
  const [imgIdx, setImgIdx] = useState(0);
  const m = memories[idx];
  const mood = MOODS.find(mo => mo.mood === m.mood)!;

  const prev = () => { if (idx > 0) { setIdx(idx - 1); setImgIdx(0); } };
  const next = () => { if (idx < memories.length - 1) { setIdx(idx + 1); setImgIdx(0); } };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Background image */}
      <img src={m.images[imgIdx]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-4 z-10">
        {memories.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
            <div className={`h-full bg-white rounded-full transition-all duration-300 ${i < idx ? 'w-full' : i === idx ? 'w-1/2' : 'w-0'}`} />
          </div>
        ))}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white z-10 hover:bg-white/20 transition-colors"
      >
        <X size={20} />
      </button>

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-lg mx-auto px-4 mt-16 mb-8 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Image carousel */}
        {m.images.length > 0 && (
          <div className="relative rounded-3xl overflow-hidden mb-6 shadow-2xl" style={{ height: 280 }}>
            <img src={m.images[imgIdx]} alt={m.title} className="w-full h-full object-cover" />
            {m.images.length > 1 && (
              <>
                <button onClick={() => setImgIdx(p => Math.max(0, p - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setImgIdx(p => Math.min(m.images.length - 1, p + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white">
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {m.images.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-4' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
            <div className="absolute top-3 left-3">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${mood.color}`}>
                {mood.emoji} {mood.label}
              </span>
            </div>
          </div>
        )}

        {/* Text content */}
        <div className="text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={12} className="text-white/50" />
            <span className="text-white/60 text-xs">{m.place} · {m.time} · Day {m.day}</span>
          </div>
          <h2 className="text-2xl font-black mb-3">{m.title}</h2>
          <p className="text-white/80 text-sm leading-relaxed line-clamp-4">{m.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {m.tags.map(t => (
              <span key={t} className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">#{t}</span>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={prev} disabled={idx === 0}
            className="flex items-center gap-2 text-white/60 disabled:opacity-30 hover:text-white transition-colors text-sm font-semibold">
            <ChevronLeft size={18} /> Prev
          </button>
          <span className="text-white/40 text-xs">{idx + 1} / {memories.length}</span>
          <button onClick={next} disabled={idx === memories.length - 1}
            className="flex items-center gap-2 text-white/60 disabled:opacity-30 hover:text-white transition-colors text-sm font-semibold">
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Add Memory Modal ──────────────────────────────────────────────────────────
const AddMemoryModal = ({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (m: Memory) => void;
}) => {
  const [type, setType]     = useState<MemoryType>('photo');
  const [mood, setMood]     = useState<Mood>('excited');
  const [title, setTitle]   = useState('');
  const [desc, setDesc]     = useState('');
  const [city, setCity]     = useState('Tokyo');
  const [place, setPlace]   = useState('');
  const [step, setStep]     = useState<1 | 2 | 3>(1);

  const handleAdd = () => {
    if (!title.trim()) return;
    const newMem: Memory = {
      id: `m${Date.now()}`, type, mood, title, description: desc,
      city, place: place || city, time: 'Now',
      day: 1, date: 'Jun 10',
      images: [], tags: [], weather: '22°C', likes: 0,
    };
    onAdd(newMem);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#2A4D3A]">
          <div>
            <h3 className="font-black text-white text-lg">Add Memory ✨</h3>
            <p className="text-white/50 text-xs mt-0.5">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Step progress */}
        <div className="flex gap-1 px-6 pt-4">
          {[1,2,3].map(s => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-all ${step >= s ? 'bg-[#F5B041]' : 'bg-slate-100'}`} />
          ))}
        </div>

        <div className="px-6 pb-6 pt-5 space-y-5 max-h-[65vh] overflow-y-auto">
          {step === 1 && (
            <>
              {/* Memory type */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Memory Type</p>
                <div className="grid grid-cols-3 gap-2">
                  {MEMORY_TYPES.map(t => (
                    <button
                      key={t.type}
                      onClick={() => setType(t.type)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                        type === t.type ? `border-[#2A4D3A] ${t.bg}` : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <t.icon size={18} className={type === t.type ? t.color : 'text-slate-400'} />
                      <span className={`text-[10px] font-bold ${type === t.type ? t.color : 'text-slate-500'}`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</p>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="What was this moment? ✨"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A4D3A]/50 transition-colors"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Description */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Experience</p>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Tell the story of this moment. What happened? How did it feel? What did you see, taste, smell?..."
                  rows={5}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A4D3A]/50 transition-colors resize-none"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</p>
                  <input value={city} onChange={e => setCity(e.target.value)}
                    placeholder="City" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2A4D3A]/50 transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Place</p>
                  <input value={place} onChange={e => setPlace(e.target.value)}
                    placeholder="Place name" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2A4D3A]/50 transition-colors" />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Mood */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">How did it feel?</p>
                <div className="grid grid-cols-2 gap-2">
                  {MOODS.map(m => (
                    <button
                      key={m.mood}
                      onClick={() => setMood(m.mood)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                        mood === m.mood ? m.color + ' border-current' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-xs font-bold">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI caption */}
              <div className="bg-[#2A4D3A]/8 border border-[#2A4D3A]/15 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles size={14} className="text-[#2A4D3A]" />
                  <p className="text-xs font-bold text-[#2A4D3A]">AI Caption Suggestion</p>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "Where neon meets tradition — Tokyo at its most electric and timeless, all at once. ✨🗼"
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(p => Math.max(1, p - 1) as 1 | 2 | 3)}
              className="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-50 transition-colors text-sm">
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(p => Math.min(3, p + 1) as 1 | 2 | 3)}
              disabled={!title.trim()}
              className="flex-1 bg-[#2A4D3A] hover:bg-[#1f3d2d] disabled:opacity-50 text-white font-black py-3 rounded-2xl transition-colors text-sm"
            >
              Continue →
            </button>
          ) : (
            <button onClick={handleAdd}
              className="flex-1 bg-[#F5B041] hover:bg-[#e5a030] text-[#2A4D3A] font-black py-3 rounded-2xl transition-colors text-sm shadow-lg">
              Save Memory ✨
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Memory Card ───────────────────────────────────────────────────────────────
const MemoryCard = ({ memory, viewMode, onStory }: {
  memory: Memory; viewMode: ViewMode; onStory: () => void;
}) => {
  const [liked, setLiked] = useState(false);
  const mood  = MOODS.find(m => m.mood === memory.mood)!;
  const tmeta = TYPE_META[memory.type];

  if (viewMode === 'polaroid') {
    return (
      <motion.div
        initial={{ opacity: 0, rotate: -2 }}
        animate={{ opacity: 1, rotate: Math.random() > 0.5 ? 1.5 : -1.5 }}
        whileHover={{ rotate: 0, scale: 1.03, zIndex: 10 }}
        className="bg-white rounded-sm p-3 pb-10 shadow-xl cursor-pointer"
        style={{ boxShadow: '2px 4px 24px rgba(0,0,0,0.18)' }}
        onClick={onStory}
      >
        <div className="w-full aspect-square overflow-hidden rounded-sm bg-slate-100">
          {memory.images[0]
            ? <img src={memory.images[0]} alt={memory.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><tmeta.icon size={32} className={tmeta.color} /></div>
          }
        </div>
        <p className="mt-3 text-center text-xs font-bold text-slate-700 leading-snug px-1 line-clamp-2">{memory.title}</p>
        <p className="text-center text-[9px] text-slate-400 mt-0.5">{memory.city} · Day {memory.day}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group"
    >
      {/* Cover image */}
      {memory.images.length > 0 && (
        <div className="relative h-52 overflow-hidden cursor-pointer" onClick={onStory}>
          <img src={memory.images[0]} alt={memory.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Type badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
            <tmeta.icon size={11} className="text-white" />
            <span className="text-white text-[10px] font-bold">{tmeta.label}</span>
          </div>

          {/* Multiple images indicator */}
          {memory.images.length > 1 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
              <Grid3X3 size={10} className="text-white" />
              <span className="text-white text-[10px] font-bold">{memory.images.length}</span>
            </div>
          )}

          {/* Play story */}
          <button onClick={onStory}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/30">
            <PlayCircle size={18} />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-3 left-3">
            <h3 className="text-white font-black text-base leading-tight">{memory.title}</h3>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="p-4">
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><MapPin size={10} />{memory.place}</span>
          <span className="flex items-center gap-1"><Clock size={10} />{memory.time}</span>
          <span>{memory.weather}</span>
        </div>

        {!memory.images.length && (
          <h3 className="font-black text-slate-800 mb-2">{memory.title}</h3>
        )}

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-3">
          {memory.description}
        </p>

        {/* Mood + tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${mood.color}`}>
            {mood.emoji} {mood.label}
          </span>
          {memory.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">#{t}</span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiked(p => !p)}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
            >
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
              {memory.likes + (liked ? 1 : 0)}
            </button>
            <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#2A4D3A] font-semibold transition-colors">
              <Share2 size={14} /> Share
            </button>
          </div>
          <button onClick={onStory}
            className="text-[#2A4D3A] text-xs font-bold hover:underline flex items-center gap-1">
            Full story <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Insights Bar ──────────────────────────────────────────────────────────────
const MemoryInsights = ({ memories }: { memories: Memory[] }) => {
  const moodCounts = MOODS.map(m => ({
    ...m, count: memories.filter(mem => mem.mood === m.mood).length,
  })).filter(m => m.count > 0).sort((a, b) => b.count - a.count);

  const topMood = moodCounts[0];
  const cities = [...new Set(memories.map(m => m.city))];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {[
        { icon: Camera,   label: 'Total Memories', value: memories.length,  color: 'text-[#2A4D3A]', bg: 'bg-[#2A4D3A]/8' },
        { icon: Image,    label: 'Photos',         value: memories.reduce((s, m) => s + m.images.length, 0), color: 'text-blue-600', bg: 'bg-blue-50' },
        { icon: Globe,    label: 'Cities',         value: cities.length,    color: 'text-violet-600', bg: 'bg-violet-50' },
        { icon: Heart,    label: 'Top Mood',       value: topMood ? `${topMood.emoji} ${topMood.label}` : '—', color: 'text-pink-600', bg: 'bg-pink-50' },
      ].map(s => (
        <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
          <div className="flex items-center justify-center mb-1.5">
            <s.icon size={16} className={s.color} />
          </div>
          <p className={`font-black text-lg ${s.color}`}>{s.value}</p>
          <p className="text-slate-500 text-xs">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

// ── Day Section Header ─────────────────────────────────────────────────────────
const DayHeader = ({ day, date, city, weather, count }: {
  day: number; date: string; city: string; weather: string; count: number;
}) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 rounded-2xl bg-[#2A4D3A] flex flex-col items-center justify-center flex-shrink-0 shadow-md">
      <span className="text-[#F5B041] font-black text-xs leading-none">Day</span>
      <span className="text-white font-black text-lg leading-none">{day}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="font-black text-slate-800">{date} · {city}</h3>
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{weather}</span>
      </div>
      <p className="text-slate-400 text-xs">{count} memor{count === 1 ? 'y' : 'ies'} saved</p>
    </div>
    <div className="w-px h-8 bg-slate-200 hidden sm:block" />
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
export const MemoriesTab: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>(SAMPLE_MEMORIES);
  const [viewMode, setViewMode]   = useState<ViewMode>('feed');
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<MemoryType | 'all'>('all');
  const [showAdd, setShowAdd]     = useState(false);
  const [storyIdx, setStoryIdx]   = useState<number | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  const filtered = memories.filter(m => {
    if (filterDay !== 'all' && m.day !== filterDay) return false;
    if (filterType !== 'all' && m.type !== filterType) return false;
    return true;
  });

  const groupedByDay = DAYS.map(d => ({
    ...d,
    memories: filtered.filter(m => m.day === d.day),
  })).filter(d => d.memories.length > 0 || filterDay === 'all');

  const storyMemories = filtered;

  return (
    <div className="relative space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-slate-900 text-xl">Travel Memories</h2>
          <p className="text-slate-400 text-sm mt-0.5">Your journey, beautifully preserved</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInsights(p => !p)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all ${showInsights ? 'bg-[#2A4D3A] text-white border-[#2A4D3A]' : 'border-slate-200 text-slate-500 hover:border-[#2A4D3A]/40'}`}
          >
            <BarChart2 size={13} /> Insights
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-[#F5B041] hover:bg-[#e5a030] text-[#2A4D3A] text-sm font-black px-4 py-2 rounded-xl transition-colors shadow-md"
          >
            <Plus size={16} /> Add Memory
          </button>
        </div>
      </div>

      {/* ── Insights ── */}
      <AnimatePresence>
        {showInsights && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <MemoryInsights memories={memories} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls row ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Day filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none flex-1">
          <button onClick={() => setFilterDay('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterDay === 'all' ? 'bg-[#2A4D3A] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2A4D3A]/30'}`}>
            All Days
          </button>
          {DAYS.map(d => (
            <button key={d.day} onClick={() => setFilterDay(d.day)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterDay === d.day ? 'bg-[#2A4D3A] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2A4D3A]/30'}`}>
              Day {d.day} · {d.city}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 flex-shrink-0">
          {([['feed','Feed',List],['polaroid','Polaroid',Grid3X3],['timeline','Timeline',TrendingUp]] as const).map(([v, l, Icon]) => (
            <button key={v} onClick={() => setViewMode(v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === v ? 'bg-[#2A4D3A] text-white' : 'text-slate-400 hover:text-slate-600'}`}>
              <Icon size={13} /> <span className="hidden sm:inline">{l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Type filter ── */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        <button onClick={() => setFilterType('all')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filterType === 'all' ? 'bg-[#2A4D3A] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2A4D3A]/30'}`}>
          All Types
        </button>
        {MEMORY_TYPES.map(t => (
          <button key={t.type} onClick={() => setFilterType(t.type)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filterType === t.type ? `${t.bg} ${t.color} ring-1 ring-current` : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'}`}>
            <t.icon size={11} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Memory content ── */}
      {viewMode === 'polaroid' ? (
        <div>
          {groupedByDay.map(d => (
            <div key={d.day} className="mb-8">
              <DayHeader {...d} count={d.memories.length} />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {d.memories.map((m, i) => (
                  <MemoryCard key={m.id} memory={m} viewMode="polaroid"
                    onStory={() => setStoryIdx(filtered.findIndex(f => f.id === m.id))} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'timeline' ? (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
          <div className="space-y-6">
            {filtered.map((m, i) => {
              const tmeta = TYPE_META[m.type];
              const mood  = MOODS.find(mo => mo.mood === m.mood)!;
              return (
                <motion.div key={m.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }} className="relative flex gap-5 pl-12">
                  <div className={`absolute left-2.5 w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center flex-shrink-0 bg-white`}
                    style={{ top: 18 }}>
                    <tmeta.icon size={11} className={tmeta.color} />
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setStoryIdx(i)}>
                    <div className="flex items-start gap-3">
                      {m.images[0] && <img src={m.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm">{m.title}</p>
                        <p className="text-slate-400 text-xs">{m.date} · {m.city} · {m.time}</p>
                        <p className="text-slate-500 text-xs mt-1 line-clamp-2">{m.description}</p>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded-full border ${mood.color}`}>
                          {mood.emoji} {mood.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Feed view */
        <div className="space-y-8">
          {groupedByDay.map(d => (
            <div key={d.day}>
              <DayHeader {...d} count={d.memories.length} />
              <div className="space-y-4">
                {d.memories.map((m, i) => (
                  <MemoryCard key={m.id} memory={m} viewMode="feed"
                    onStory={() => setStoryIdx(filtered.findIndex(f => f.id === m.id))} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-[#2A4D3A]/8 rounded-3xl flex items-center justify-center mb-4">
            <Camera size={32} className="text-[#2A4D3A]/40" />
          </div>
          <p className="font-bold text-slate-600 mb-1">No memories yet</p>
          <p className="text-slate-400 text-sm mb-4">Start capturing your journey moments</p>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-[#2A4D3A] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#1f3d2d] transition-colors">
            <Plus size={16} /> Add First Memory
          </button>
        </motion.div>
      )}

      {/* AI day summary */}
      {filtered.length > 0 && (
        <div className="bg-gradient-to-r from-[#2A4D3A] to-[#1B4332] rounded-3xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#F5B041]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-[#F5B041]" />
          </div>
          <div>
            <p className="text-white font-bold mb-1">AI Memory Summary</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Day 1 in Tokyo was electric — you went from afternoon ramen at Ichiran to midnight chaos at Shibuya Crossing. Your dominant mood was <strong className="text-[#F5B041]">thrilling</strong>. Most active city: <strong className="text-[#F5B041]">Tokyo</strong>. You've captured <strong className="text-[#F5B041]">{memories.length} memories</strong> across {[...new Set(memories.map(m => m.city))].length} cities so far.
            </p>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <AnimatePresence>
        {showAdd && (
          <AddMemoryModal onClose={() => setShowAdd(false)} onAdd={m => setMemories(prev => [m, ...prev])} />
        )}
        {storyIdx !== null && storyMemories.length > 0 && (
          <StoryViewer memories={storyMemories} start={storyIdx} onClose={() => setStoryIdx(null)} />
        )}
      </AnimatePresence>

      {/* ── Floating add button (sticky) ── */}
      <div className="fixed bottom-24 md:bottom-8 right-6 z-30">
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2.5 bg-[#2A4D3A] text-white font-black text-sm px-5 py-3.5 rounded-2xl shadow-2xl hover:bg-[#1f3d2d] transition-colors"
          style={{ boxShadow: '0 8px 32px rgba(42,77,58,0.5)' }}
        >
          <Plus size={18} /> Memory
        </motion.button>
      </div>
    </div>
  );
};
