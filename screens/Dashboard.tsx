import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Plus, Calendar, MapPin, Wallet, ArrowRight } from 'lucide-react';
import { useTraveloop, Trip } from '../context/TraveloopContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

export const Dashboard = () => {
  const { user, trips } = useTraveloop();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const calculateHealthScore = (trip: Trip) => {
    let checklistScore = 0;
    if (trip.checklist.length > 0) {
      const completed = trip.checklist.filter((i) => i.completed).length;
      checklistScore = (completed / trip.checklist.length) * 100;
    }

    let spent = 0;
    trip.stops.forEach((stop) => {
      stop.activities.forEach((act) => {
        spent += act.cost;
      });
    });
    
    let budgetScore = 100;
    if (trip.budget > 0) {
      const usage = (spent / trip.budget) * 100;
      budgetScore = usage > 100 ? 0 : 100 - usage; // higher score if under budget
    }

    // Weight: 40% checklist, 60% budget (if you're way over budget, health is bad)
    const totalHealth = Math.round((checklistScore * 0.4) + (budgetScore * 0.6));
    
    let color = '#EF4444'; // red
    if (totalHealth > 75) color = '#1B4332'; // green
    else if (totalHealth > 40) color = '#F59E0B'; // amber

    return { score: totalHealth, color };
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-[16px]" />
          <Skeleton className="h-40 rounded-[16px]" />
          <Skeleton className="h-40 rounded-[16px]" />
        </div>
      </div>
    );
  }

  // Get next upcoming trip
  const upcomingTrip = trips.find(t => t.status === 'Upcoming') || trips[0];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-2 text-lg">Ready for your next adventure?</p>
        </div>
        <Button onClick={() => navigate('/create-trip')} className="shrink-0 flex items-center gap-2">
          <Plus size={20} />
          Plan New Trip
        </Button>
      </div>

      {upcomingTrip && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main featured trip card */}
          <Card className="col-span-1 md:col-span-2 p-6 bg-primary text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
                  {upcomingTrip.status}
                </div>
                <h2 className="text-3xl font-serif font-bold mb-2">{upcomingTrip.name}</h2>
                <div className="flex items-center gap-4 text-white/80 mt-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={18} />
                    <span>{upcomingTrip.stops.length} stops</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={18} />
                    <span>{new Date(upcomingTrip.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate(`/trips/${upcomingTrip.id}/itinerary`)}
                  className="w-full md:w-auto"
                >
                  View Details <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Trip Health Score Widget */}
          <Card className="p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-serif text-lg font-bold text-foreground mb-6">Trip Health Score</h3>
            
            <div className="relative w-32 h-32 flex items-center justify-center">
              {(() => {
                const health = calculateHealthScore(upcomingTrip);
                const strokeDasharray = 283; // 2 * pi * 45
                const strokeDashoffset = strokeDasharray - (strokeDasharray * health.score) / 100;
                
                return (
                  <>
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="45" fill="none" stroke="var(--border)" strokeWidth="12" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="45" 
                        fill="none" 
                        stroke={health.color} 
                        strokeWidth="12" 
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-bold" style={{ color: health.color }}>
                        {health.score}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">/ 100</span>
                    </div>
                  </>
                );
              })()}
            </div>
            
            <p className="text-sm text-muted-foreground mt-6">
              Based on budget usage & packing completion.
            </p>
          </Card>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-serif font-bold text-foreground">Your Trips</h3>
          <Link to="/trips" className="text-primary font-bold hover:underline text-sm">View All</Link>
        </div>
        
        {trips.length === 0 ? (
          <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 bg-transparent shadow-none">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
              <MapPin size={32} />
            </div>
            <h4 className="text-xl font-serif font-bold mb-2">No trips yet</h4>
            <p className="text-muted-foreground mb-6">Start planning your first multi-city adventure!</p>
            <Button onClick={() => navigate('/create-trip')}>Plan New Trip</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map(trip => (
              <Card key={trip.id} className="p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/trips/${trip.id}/builder`)}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-serif font-bold truncate pr-4">{trip.name}</h4>
                  <span className="px-2 py-1 bg-muted text-xs font-bold rounded-md">{trip.status}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1"><MapPin size={16}/> {trip.stops.length} stops</div>
                  <div className="flex items-center gap-1"><Calendar size={16}/> {new Date(trip.startDate).toLocaleDateString()}</div>
                  <div className="flex items-center gap-1"><Wallet size={16}/> ₹{trip.budget.toLocaleString()}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
