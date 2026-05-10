import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import { useTraveloop, Trip, Stop, Activity } from '../../context/TraveloopContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MapPin, Plus, Trash2, ChevronUp, ChevronDown, Clock, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Builder = () => {
  const { trip } = useOutletContext<{ trip: Trip }>();
  const { updateTrip } = useTraveloop();
  const navigate = useNavigate();

  const handleAddStop = () => {
    const newStop: Stop = {
      id: Math.random().toString(36).substr(2, 9),
      city: '',
      arrivalDate: trip.startDate,
      departureDate: trip.startDate,
      activities: []
    };
    updateTrip({ ...trip, stops: [...trip.stops, newStop] });
  };

  const handleUpdateStop = (stopId: string, field: keyof Stop, value: string) => {
    const updatedStops = trip.stops.map(s => 
      s.id === stopId ? { ...s, [field]: value } : s
    );
    updateTrip({ ...trip, stops: updatedStops });
  };

  const handleDeleteStop = (stopId: string) => {
    updateTrip({ ...trip, stops: trip.stops.filter(s => s.id !== stopId) });
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === trip.stops.length - 1) return;

    const newStops = [...trip.stops];
    const temp = newStops[index];
    if (direction === 'up') {
      newStops[index] = newStops[index - 1];
      newStops[index - 1] = temp;
    } else {
      newStops[index] = newStops[index + 1];
      newStops[index + 1] = temp;
    }
    updateTrip({ ...trip, stops: newStops });
  };

  const handleAddActivity = (stopId: string) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      cost: 0,
      duration: 1
    };
    const updatedStops = trip.stops.map(s => {
      if (s.id === stopId) {
        return { ...s, activities: [...s.activities, newActivity] };
      }
      return s;
    });
    updateTrip({ ...trip, stops: updatedStops });
  };

  const handleUpdateActivity = (stopId: string, activityId: string, field: keyof Activity, value: any) => {
    const updatedStops = trip.stops.map(s => {
      if (s.id === stopId) {
        const updatedActivities = s.activities.map(a => 
          a.id === activityId ? { ...a, [field]: field === 'cost' || field === 'duration' ? Number(value) : value } : a
        );
        return { ...s, activities: updatedActivities };
      }
      return s;
    });
    updateTrip({ ...trip, stops: updatedStops });
  };

  const handleDeleteActivity = (stopId: string, activityId: string) => {
    const updatedStops = trip.stops.map(s => {
      if (s.id === stopId) {
        return { ...s, activities: s.activities.filter(a => a.id !== activityId) };
      }
      return s;
    });
    updateTrip({ ...trip, stops: updatedStops });
  };

  // Calculate totals
  let totalCost = 0;
  trip.stops.forEach(s => s.activities.forEach(a => { totalCost += Number(a.cost); }));

  return (
    <div className="pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold">Itinerary Builder</h2>
        <Button onClick={handleAddStop} size="sm" className="flex items-center gap-2">
          <Plus size={16} /> Add Stop
        </Button>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {trip.stops.map((stop, index) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4 md:p-6 border-l-4 border-l-primary">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
                  <div className="flex flex-col items-center gap-1 bg-muted p-1 rounded-lg">
                    <button 
                      onClick={() => handleMoveStop(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-white rounded text-foreground disabled:opacity-30"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
                    <button 
                      onClick={() => handleMoveStop(index, 'down')}
                      disabled={index === trip.stops.length - 1}
                      className="p-1 hover:bg-white rounded text-foreground disabled:opacity-30"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <Input 
                      placeholder="City Name" 
                      value={stop.city} 
                      onChange={(e) => handleUpdateStop(stop.id, 'city', e.target.value)}
                    />
                    <Input 
                      type="date" 
                      value={stop.arrivalDate}
                      onChange={(e) => handleUpdateStop(stop.id, 'arrivalDate', e.target.value)}
                    />
                    <Input 
                      type="date" 
                      value={stop.departureDate}
                      onChange={(e) => handleUpdateStop(stop.id, 'departureDate', e.target.value)}
                    />
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteStop(stop.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors self-end md:self-auto"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="pl-0 md:pl-12 space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={14} /> Activities
                  </h4>
                  
                  <div className="space-y-3">
                    {stop.activities.map((activity) => (
                      <div key={activity.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-muted/30 p-3 rounded-[12px]">
                        <div className="flex-1 w-full">
                          <Input 
                            placeholder="Activity name" 
                            className="h-10 bg-white"
                            value={activity.name}
                            onChange={(e) => handleUpdateActivity(stop.id, activity.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="flex w-full sm:w-auto gap-3">
                          <div className="relative w-full sm:w-32">
                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                            <Input 
                              type="number" 
                              placeholder="Cost" 
                              className="h-10 pl-9 bg-white"
                              value={activity.cost || ''}
                              onChange={(e) => handleUpdateActivity(stop.id, activity.id, 'cost', e.target.value)}
                            />
                          </div>
                          <div className="relative w-full sm:w-28">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                            <Input 
                              type="number" 
                              placeholder="Hrs" 
                              className="h-10 pl-9 bg-white"
                              value={activity.duration || ''}
                              onChange={(e) => handleUpdateActivity(stop.id, activity.id, 'duration', e.target.value)}
                            />
                          </div>
                          <button 
                            onClick={() => handleDeleteActivity(stop.id, activity.id)}
                            className="p-2 text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleAddActivity(stop.id)}
                    className="text-primary hover:text-primary mt-2 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Activity
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {trip.stops.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-[16px] border-2 border-dashed border-border">
            <MapPin size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-serif font-bold text-foreground mb-2">No stops added yet</h3>
            <p className="text-muted-foreground mb-4">Add your first destination to start building your itinerary.</p>
            <Button onClick={handleAddStop}>Add First Stop</Button>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-[72px] md:bottom-0 left-0 right-0 md:left-64 bg-card border-t border-border p-4 z-20 flex flex-col sm:flex-row justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:pb-4 gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-muted-foreground">Running Total</span>
          <div className="flex items-end gap-2">
            <span className={`text-2xl font-bold ${totalCost > trip.budget ? 'text-destructive' : 'text-foreground'}`}>
              ₹{totalCost.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground mb-1">/ ₹{trip.budget.toLocaleString()}</span>
          </div>
        </div>
        
        <Button onClick={() => navigate(`/trips/${trip.id}/itinerary`)} size="lg" className="w-full sm:w-auto">
          View Itinerary
        </Button>
      </div>
    </div>
  );
};
