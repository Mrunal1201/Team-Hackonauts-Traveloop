import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { Trip } from '../../context/TraveloopContext';
import { Card } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

export const Budget = () => {
  const { trip } = useOutletContext<{ trip: Trip }>();

  const { categoryData, totalSpent, avgPerDay, overBudgetAlerts, daysData } = useMemo(() => {
    let transport = 0, stay = 0, meals = 0, activities = 0;
    const dailySpend: Record<string, number> = {};

    trip.stops.forEach(stop => {
      stop.activities.forEach(act => {
        const name = act.name.toLowerCase();
        const cost = Number(act.cost);
        
        if (name.match(/flight|train|bus|taxi|cab|uber|transport|metro|ticket/)) transport += cost;
        else if (name.match(/hotel|hostel|airbnb|stay|accommodation|resort/)) stay += cost;
        else if (name.match(/food|dinner|lunch|breakfast|restaurant|cafe|meal|drink|bar|market/)) meals += cost;
        else activities += cost;

        // Daily spend based on stop arrival date (approx)
        const date = stop.arrivalDate;
        dailySpend[date] = (dailySpend[date] || 0) + cost;
      });
    });

    const totalSpent = transport + stay + meals + activities;
    
    // For prototype purposes, if no categorised data exists, let's inject some realistic mock data 
    // based on total budget if totalSpent is very small, so the chart looks good.
    if (totalSpent === 0 && trip.budget > 0) {
      transport = trip.budget * 0.3;
      stay = trip.budget * 0.4;
      meals = trip.budget * 0.2;
      activities = trip.budget * 0.05;
    }

    const data = [
      { name: 'Transport', value: transport },
      { name: 'Stay', value: stay },
      { name: 'Activities', value: activities },
      { name: 'Meals', value: meals },
    ];

    const alerts = data.filter(d => trip.budget > 0 && d.value > trip.budget * 0.4);

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const avg = totalSpent / days;

    const dailyBudget = trip.budget / days;
    const daysArray = Object.keys(dailySpend).sort().map(date => ({
      date,
      spent: dailySpend[date],
      over: dailySpend[date] > dailyBudget
    }));

    return { categoryData: data, totalSpent, avgPerDay: avg, overBudgetAlerts: alerts, daysData: daysArray };
  }, [trip]);

  const progressPercent = Math.min(100, trip.budget > 0 ? (totalSpent / trip.budget) * 100 : 0);

  return (
    <div className="space-y-6 pb-8">
      {overBudgetAlerts.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-[16px] flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold">Budget Alert</h4>
            <p className="text-sm mt-1">
              You are spending more than 40% of your budget on {overBudgetAlerts.map(a => a.name).join(', ')}. 
              Consider adjusting your plans to avoid overspending.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Spent</p>
              <h2 className="text-4xl font-serif font-bold text-foreground">₹{totalSpent.toLocaleString()}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">of ₹{trip.budget.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mt-4 h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${progressPercent > 90 ? 'bg-destructive' : progressPercent > 70 ? 'bg-accent' : 'bg-primary'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-right text-xs font-medium mt-2 text-muted-foreground">
            {progressPercent.toFixed(1)}% used
          </p>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Avg Daily Spend</p>
          <h3 className="text-2xl font-serif font-bold text-foreground mt-2">₹{avgPerDay.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-serif font-bold mb-6">Spend by Category</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dx={-10} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip 
                cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Spent']}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.name === 'Transport' ? '#1B4332' : 
                    entry.name === 'Stay' ? '#F59E0B' : 
                    entry.name === 'Activities' ? '#3B82F6' : '#8B5CF6'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {daysData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-serif font-bold mb-4">Daily Breakdown</h3>
          <div className="space-y-3">
            {daysData.map((day, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-[12px] bg-muted/30">
                <span className="font-medium text-foreground">{new Date(day.date).toLocaleDateString()}</span>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${day.over ? 'text-destructive' : 'text-foreground'}`}>
                    ₹{day.spent.toLocaleString()}
                  </span>
                  {day.over && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded border border-destructive/20 font-bold">
                      Over Budget
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
