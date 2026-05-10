import React, { useState } from 'react';
import { useOutletContext } from 'react-router';
import { Trip } from '../../context/TraveloopContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapPin, Calendar, Clock, Share2, List, Activity as ActivityIcon } from 'lucide-react';
import { motion } from 'motion/react';

export const Itinerary = () => {
  const { trip } = useOutletContext<{ trip: Trip }>();
  const [view, setView] = useState<'timeline' | 'list'>('timeline');
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (trip.stops.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-serif font-bold text-foreground mb-2">Itinerary is empty</h3>
        <p className="text-muted-foreground">Go to Builder to add stops and activities.</p>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex bg-muted p-1 rounded-[12px]">
          <button
            onClick={() => setView('timeline')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-[8px] transition-colors ${
              view === 'timeline' ? 'bg-white shadow text-foreground' : 'text-muted-foreground'
            }`}
          >
            <ActivityIcon size={16} /> Timeline
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-[8px] transition-colors ${
              view === 'list' ? 'bg-white shadow text-foreground' : 'text-muted-foreground'
            }`}
          >
            <List size={16} /> List
          </button>
        </div>

        <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-white">
          <Share2 size={16} /> {shared ? 'Copied!' : 'Share'}
        </Button>
      </div>

      {view === 'timeline' ? (
        <div className="relative border-l-2 border-primary/30 ml-4 md:ml-8 space-y-12 pb-8">
          {trip.stops.map((stop, index) => (
            <motion.div 
              key={stop.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-primary ring-4 ring-background" />
              
              <div className="mb-4">
                <h3 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                  {stop.city || 'Unnamed City'}
                </h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-primary">
                    <Calendar size={14} /> 
                    {stop.arrivalDate ? new Date(stop.arrivalDate).toLocaleDateString() : '?'} - 
                    {stop.departureDate ? new Date(stop.departureDate).toLocaleDateString() : '?'}
                  </span>
                  <span>{stop.activities.length} activities</span>
                </div>
              </div>

              {stop.activities.length > 0 ? (
                <div className="space-y-4">
                  {stop.activities.map((act) => (
                    <Card key={act.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-accent shrink-0" />
                        <div>
                          <p className="font-bold text-foreground">{act.name || 'Unnamed Activity'}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock size={12} /> {act.duration} hours
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-bold bg-muted/50 px-3 py-1.5 rounded-lg self-start sm:self-auto shrink-0">
                        ₹{Number(act.cost).toLocaleString()}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No activities planned.</p>
              )}
            </motion.div>
          ))}
          {/* End marker */}
          <div className="absolute -left-[9px] bottom-0 w-4 h-4 rounded-full bg-primary/30 ring-4 ring-background" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trip.stops.map((stop) => (
            <Card key={stop.id} className="p-5 flex flex-col">
              <div className="flex items-start gap-3 mb-4 border-b border-border pb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold">{stop.city || 'Unnamed City'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {stop.arrivalDate} to {stop.departureDate}
                  </p>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {stop.activities.map((act) => (
                  <div key={act.id} className="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-foreground">{act.name || 'Unnamed Activity'}</span>
                    <div className="flex gap-3 text-muted-foreground">
                      <span>{act.duration}h</span>
                      <span className="font-bold text-foreground w-16 text-right">₹{act.cost}</span>
                    </div>
                  </div>
                ))}
                {stop.activities.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">No activities planned</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
