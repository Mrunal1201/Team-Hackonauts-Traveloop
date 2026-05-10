import React, { useState } from 'react';
import { useTrip, ItineraryItem } from '../context/TripContext';
import { Reorder } from 'motion/react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, GripVertical, Plus, Plane, Hotel, Utensils, Navigation, Zap, X, CheckCircle } from 'lucide-react';

const iconMap = {
  transport: Plane,
  hotel: Hotel,
  food: Utensils,
  activity: Navigation,
};

const colorMap = {
  transport: 'bg-blue-100 text-blue-600',
  hotel: 'bg-purple-100 text-purple-600',
  food: 'bg-orange-100 text-orange-600',
  activity: 'bg-green-100 text-green-600',
};

type ItemType = 'transport' | 'hotel' | 'activity' | 'food';

function parseTime(timeStr: string): number {
  const lower = timeStr.toLowerCase();
  const [timePart, period] = lower.split(' ');
  const [hours, minutes] = timePart.split(':').map(Number);
  let h = hours;
  if (period === 'pm' && h !== 12) h += 12;
  if (period === 'am' && h === 12) h = 0;
  return h * 60 + (minutes || 0);
}

function optimizeItems(items: ItineraryItem[]): ItineraryItem[] {
  return [...items].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return parseTime(a.time) - parseTime(b.time);
  });
}

export const Itinerary: React.FC = () => {
  const { activeTrip, updateItinerary } = useTrip();
  const [items, setItems] = useState<ItineraryItem[]>(activeTrip?.itinerary || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [optimizeStatus, setOptimizeStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [newActivity, setNewActivity] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDay, setNewDay] = useState('1');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newType, setNewType] = useState<ItemType>('activity');

  if (!activeTrip) return null;

  const handleReorder = (newOrder: ItineraryItem[]) => {
    setItems(newOrder);
    updateItinerary(newOrder);
  };

  const handleOptimize = () => {
    setOptimizeStatus('running');
    setTimeout(() => {
      const optimized = optimizeItems(items);
      setItems(optimized);
      updateItinerary(optimized);
      setOptimizeStatus('done');
      setTimeout(() => setOptimizeStatus('idle'), 2500);
    }, 1400);
  };

  const handleAddItem = () => {
    if (!newActivity || !newLocation) return;
    const newItem: ItineraryItem = {
      id: `it-${Date.now()}`,
      day: parseInt(newDay) || 1,
      time: newTime,
      activity: newActivity,
      location: newLocation,
      type: newType,
    };
    const updated = [...items, newItem];
    setItems(updated);
    updateItinerary(updated);
    setNewActivity('');
    setNewLocation('');
    setShowAddModal(false);
  };

  // Group by day for display
  const dayGroups = items.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  const uniqueDays = Object.keys(dayGroups).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2A4D3A]">Itinerary Builder</h1>
          <p className="text-slate-500 mt-1">Drag to rearrange · AI-optimized routing.</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={handleOptimize}
            disabled={optimizeStatus !== 'idle'}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all border ${
              optimizeStatus === 'done'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : optimizeStatus === 'running'
                ? 'bg-[#F5B041]/20 border-[#F5B041]/30 text-[#2A4D3A] cursor-wait'
                : 'bg-[#F5B041]/10 border-[#F5B041]/30 text-[#2A4D3A] hover:bg-[#F5B041]/20'
            }`}
          >
            {optimizeStatus === 'running' ? (
              <>
                <Zap size={16} className="animate-pulse" />
                <span className="hidden sm:inline">Optimizing…</span>
              </>
            ) : optimizeStatus === 'done' ? (
              <>
                <CheckCircle size={16} />
                <span className="hidden sm:inline">Optimized!</span>
              </>
            ) : (
              <>
                <Zap size={16} className="text-[#F5B041]" />
                <span className="hidden sm:inline">Auto-Optimize</span>
              </>
            )}
          </motion.button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#2A4D3A] text-white p-2.5 sm:px-4 sm:py-2 rounded-xl hover:bg-[#1f382a] transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline font-medium">Add Activity</span>
          </button>
        </div>
      </div>

      {/* Optimize running banner */}
      <AnimatePresence>
        {optimizeStatus === 'running' && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-[#F5B041]/15 border border-[#F5B041]/30 rounded-2xl p-4 flex items-center gap-3"
          >
            <Zap size={18} className="text-[#F5B041] animate-bounce" />
            <div>
              <p className="font-semibold text-[#2A4D3A] text-sm">AI Route Optimizer running…</p>
              <p className="text-slate-500 text-xs">Sorting by day and time for the most efficient route.</p>
            </div>
          </motion.div>
        )}
        {optimizeStatus === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle size={18} className="text-emerald-500" />
            <div>
              <p className="font-semibold text-emerald-700 text-sm">Route optimized successfully!</p>
              <p className="text-emerald-600 text-xs">Items sorted chronologically for maximum efficiency.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day-grouped view */}
      <div className="space-y-4">
        {uniqueDays.map(day => (
          <div key={day}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A4D3A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                D{day}
              </div>
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs text-slate-400 font-medium">{dayGroups[day].length} event{dayGroups[day].length !== 1 ? 's' : ''}</span>
            </div>

            <div className="bg-white rounded-3xl p-2 sm:p-4 shadow-sm border border-slate-100">
              <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-2">
                {dayGroups[day].map(item => {
                  const IconComponent = iconMap[item.type];
                  return (
                    <Reorder.Item
                      key={item.id}
                      value={item}
                      className="bg-[#FDFBF7] border border-slate-200 rounded-2xl p-4 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all hover:border-[#2A4D3A]/20 relative overflow-hidden"
                    >
                      <div className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0">
                        <GripVertical size={18} />
                      </div>

                      <div className={`p-2.5 rounded-xl flex-shrink-0 ${colorMap[item.type]}`}>
                        <IconComponent size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-1 sm:gap-4 mb-1">
                          <h3 className="font-semibold text-[#2A4D3A] truncate w-full">{item.activity}</h3>
                          <div className="flex items-center text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100 whitespace-nowrap flex-shrink-0">
                            <Clock size={12} className="mr-1 text-[#F5B041]" />
                            {item.time}
                          </div>
                        </div>
                        <div className="flex items-center text-slate-400 text-sm">
                          <MapPin size={13} className="mr-1 opacity-70 flex-shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </div>
          </div>
        ))}
      </div>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-[#2A4D3A]">Add Activity</h2>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Activity Name</label>
                  <input
                    value={newActivity}
                    onChange={e => setNewActivity(e.target.value)}
                    placeholder="e.g. Visit Senso-ji Temple"
                    className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Location</label>
                  <input
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="e.g. Asakusa, Tokyo"
                    className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40 text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Day</label>
                    <input
                      type="number"
                      value={newDay}
                      onChange={e => setNewDay(e.target.value)}
                      min="1"
                      className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-3 py-3 text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Time</label>
                    <input
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      placeholder="09:00 AM"
                      className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-3 py-3 text-slate-700 focus:outline-none focus:border-[#2A4D3A]/40 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Type</label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as ItemType)}
                      className="w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-2 py-3 text-slate-700 focus:outline-none text-sm"
                    >
                      <option value="activity">Activity</option>
                      <option value="food">Food</option>
                      <option value="transport">Transport</option>
                      <option value="hotel">Hotel</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddItem}
                  className="w-full bg-[#2A4D3A] text-white py-3 rounded-xl font-bold hover:bg-[#1f382a] transition-colors"
                >
                  Add to Itinerary
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
