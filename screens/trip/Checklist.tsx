import React, { useState } from 'react';
import { useOutletContext } from 'react-router';
import { useTraveloop, Trip, ChecklistItem } from '../../context/TraveloopContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Trash2, Plus, RotateCcw, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['Clothes', 'Documents', 'Electronics', 'Miscellaneous'] as const;

export const Checklist = () => {
  const { trip } = useOutletContext<{ trip: Trip }>();
  const { updateTrip } = useTraveloop();
  const [activeTab, setActiveTab] = useState<typeof CATEGORIES[number]>('Clothes');
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const item: ChecklistItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: activeTab,
      name: newItem.trim(),
      completed: false
    };

    updateTrip({ ...trip, checklist: [...trip.checklist, item] });
    setNewItem('');
  };

  const toggleItem = (id: string) => {
    const updated = trip.checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updateTrip({ ...trip, checklist: updated });
  };

  const deleteItem = (id: string) => {
    updateTrip({ ...trip, checklist: trip.checklist.filter(item => item.id !== id) });
  };

  const resetAll = () => {
    if (window.confirm('Are you sure you want to uncheck all items?')) {
      const updated = trip.checklist.map(item => ({ ...item, completed: false }));
      updateTrip({ ...trip, checklist: updated });
    }
  };

  const getProgress = (category: string) => {
    const items = trip.checklist.filter(i => i.category === category);
    if (items.length === 0) return 0;
    const completed = items.filter(i => i.completed).length;
    return (completed / items.length) * 100;
  };

  const filteredItems = trip.checklist.filter(i => i.category === activeTab);

  return (
    <div className="pb-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold">Packing List</h2>
        <Button variant="ghost" onClick={resetAll} size="sm" className="text-muted-foreground flex items-center gap-2 hover:text-foreground">
          <RotateCcw size={16} /> Reset All
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => {
          const progress = getProgress(cat);
          return (
            <Card 
              key={cat} 
              className={`p-4 cursor-pointer transition-all ${activeTab === cat ? 'ring-2 ring-primary border-transparent' : 'hover:border-primary/50'}`}
              onClick={() => setActiveTab(cat)}
            >
              <h4 className="font-bold text-foreground mb-3">{cat}</h4>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-primary' : 'bg-accent'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-right text-xs mt-1 text-muted-foreground">{Math.round(progress)}%</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 min-h-[400px]">
        <h3 className="text-xl font-serif font-bold mb-6">{activeTab}</h3>

        <form onSubmit={handleAddItem} className="flex gap-3 mb-8">
          <Input 
            placeholder={`Add new item to ${activeTab}...`} 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="shrink-0"><Plus size={20} /></Button>
        </form>

        <div className="space-y-2">
          <AnimatePresence>
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
                className={`flex justify-between items-center p-3 rounded-[12px] transition-colors ${
                  item.completed ? 'bg-primary/5 text-muted-foreground' : 'bg-muted/30 text-foreground'
                }`}
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => toggleItem(item.id)}
                >
                  {item.completed ? (
                    <CheckCircle2 size={24} className="text-primary shrink-0" />
                  ) : (
                    <Circle size={24} className="text-muted-foreground shrink-0" />
                  )}
                  <span className={`font-medium ${item.completed ? 'line-through' : ''}`}>
                    {item.name}
                  </span>
                </div>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No items in this category yet.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
