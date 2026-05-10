import React, { useState } from 'react';
import { useOutletContext } from 'react-router';
import { useTraveloop, Trip, Note } from '../../context/TraveloopContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2, Edit2, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Notes = () => {
  const { trip } = useOutletContext<{ trip: Trip }>();
  const { updateTrip } = useTraveloop();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    stopId: ''
  });

  const sortedNotes = [...trip.notes].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const resetForm = () => {
    setFormData({ title: '', body: '', stopId: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;

    if (editingId) {
      const updatedNotes = trip.notes.map(n => 
        n.id === editingId ? { ...n, ...formData, timestamp: new Date().toISOString() } : n
      );
      updateTrip({ ...trip, notes: updatedNotes });
    } else {
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title.trim(),
        body: formData.body.trim(),
        stopId: formData.stopId || undefined,
        timestamp: new Date().toISOString()
      };
      updateTrip({ ...trip, notes: [...trip.notes, newNote] });
    }
    resetForm();
  };

  const handleEdit = (note: Note) => {
    setFormData({ title: note.title, body: note.body, stopId: note.stopId || '' });
    setEditingId(note.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this note?')) {
      updateTrip({ ...trip, notes: trip.notes.filter(n => n.id !== id) });
    }
  };

  const getStopName = (stopId?: string) => {
    if (!stopId) return 'General Note';
    const stop = trip.stops.find(s => s.id === stopId);
    return stop?.city || 'Unknown Stop';
  };

  return (
    <div className="pb-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold">Trip Notes</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
            <Plus size={16} /> New Note
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-serif font-bold mb-4">{editingId ? 'Edit Note' : 'Add Note'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  placeholder="Note Title" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                
                <select 
                  className="flex h-12 w-full rounded-[16px] border border-border bg-input-background px-4 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.stopId}
                  onChange={(e) => setFormData({ ...formData, stopId: e.target.value })}
                >
                  <option value="">General Note (No specific stop)</option>
                  {trip.stops.map(stop => (
                    <option key={stop.id} value={stop.id}>{stop.city}</option>
                  ))}
                </select>
                
                <textarea
                  rows={5}
                  placeholder="Write your thoughts, plans, or memories here..."
                  className="flex w-full rounded-[16px] border border-border bg-input-background px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                />
                
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                  <Button type="submit">{editingId ? 'Save Changes' : 'Add Note'}</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {sortedNotes.map(note => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-serif font-bold line-clamp-2 pr-4">{note.title}</h3>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleEdit(note)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(note.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-foreground/80 flex-1 whitespace-pre-wrap text-sm mb-6">{note.body}</p>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-border/50">
                  <span className="flex items-center gap-1.5 font-medium text-primary">
                    <MapPin size={12} /> {getStopName(note.stopId)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> {new Date(note.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sortedNotes.length === 0 && !isAdding && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Edit2 size={24} />
          </div>
          <h3 className="text-xl font-serif font-bold mb-2">No notes yet</h3>
          <p className="text-muted-foreground mb-6">Jot down your plans, ideas, or journal your memories.</p>
          <Button onClick={() => setIsAdding(true)}>Write First Note</Button>
        </div>
      )}
    </div>
  );
};
