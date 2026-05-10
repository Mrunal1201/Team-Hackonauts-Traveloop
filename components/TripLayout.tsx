import React from 'react';
import { Outlet, useParams, NavLink, useNavigate } from 'react-router';
import { useTraveloop } from '../context/TraveloopContext';
import { ArrowLeft, Map, Calendar, Wallet, CheckSquare, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export const TripLayout = () => {
  const { id } = useParams<{ id: string }>();
  const { trips } = useTraveloop();
  const navigate = useNavigate();
  
  const trip = trips.find(t => t.id === id);

  if (!trip) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif font-bold text-foreground">Trip not found</h2>
        <button onClick={() => navigate('/trips')} className="mt-4 text-primary hover:underline">
          Return to My Trips
        </button>
      </div>
    );
  }

  const tabs = [
    { name: 'Builder', path: `/trips/${id}/builder`, icon: Map },
    { name: 'Itinerary', path: `/trips/${id}/itinerary`, icon: Calendar },
    { name: 'Budget', path: `/trips/${id}/budget`, icon: Wallet },
    { name: 'Checklist', path: `/trips/${id}/checklist`, icon: CheckSquare },
    { name: 'Notes', path: `/trips/${id}/notes`, icon: BookOpen },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/trips')}
          className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{trip.name}</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-border">
        <div className="flex space-x-2 min-w-max px-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-primary text-primary font-bold' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`
              }
            >
              <tab.icon size={18} />
              <span>{tab.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="pt-4 relative min-h-[50vh]">
        <Outlet context={{ trip }} />
      </div>
    </div>
  );
};
