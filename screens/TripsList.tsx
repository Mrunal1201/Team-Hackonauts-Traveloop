import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTraveloop, Trip } from '../context/TraveloopContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MapPin, Calendar, Wallet, Trash2, Edit, Eye, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TripsList = () => {
  const { trips, deleteTrip } = useTraveloop();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Completed'>('All');

  const filteredTrips = trips.filter(t => filter === 'All' || t.status === filter);

  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-serif font-bold text-foreground">My Trips</h1>
        <Button onClick={() => navigate('/create-trip')} className="flex items-center gap-2">
          <Plus size={20} /> Plan New Trip
        </Button>
      </div>

      <div className="flex bg-muted/50 p-1 rounded-[16px] w-fit">
        {['All', 'Upcoming', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 text-sm font-medium rounded-[12px] transition-colors ${
              filter === f ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredTrips.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 bg-transparent shadow-none mt-8">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
            <MapPin size={40} />
          </div>
          <h4 className="text-2xl font-serif font-bold mb-2">No trips found</h4>
          <p className="text-muted-foreground mb-6 max-w-md">
            {filter === 'All' 
              ? "You haven't planned any trips yet. Time to start dreaming!" 
              : `You don't have any ${filter.toLowerCase()} trips right now.`}
          </p>
          {filter === 'All' && <Button onClick={() => navigate('/create-trip')}>Start Planning</Button>}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTrips.map((trip) => (
              <motion.div
                key={trip.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                        {trip.status}
                      </div>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this trip?')) {
                            deleteTrip(trip.id);
                          }
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <h3 className="text-2xl font-serif font-bold mb-2 line-clamp-2">{trip.name}</h3>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{trip.description}</p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-foreground/80">
                        <Calendar size={18} className="text-primary" />
                        <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/80">
                        <MapPin size={18} className="text-accent" />
                        <span>{trip.stops.length} Stops planned</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/80">
                        <Wallet size={18} className="text-emerald-600" />
                        <span>₹{trip.budget.toLocaleString()} Budget</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border p-4 bg-muted/20 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => navigate(`/trips/${trip.id}/builder`)}
                    >
                      <Edit size={16} /> Edit
                    </Button>
                    <Button 
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
                    >
                      <Eye size={16} /> View
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
