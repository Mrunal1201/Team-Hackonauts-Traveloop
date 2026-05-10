import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTraveloop } from '../context/TraveloopContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ArrowLeft } from 'lucide-react';

export const CreateTrip = () => {
  const navigate = useNavigate();
  const { addTrip, trips } = useTraveloop();
  
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Trip name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.budget || isNaN(Number(formData.budget))) newErrors.budget = 'Valid budget amount is required';
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Capture current trips count to find the newly added one
    const currentCount = trips.length;
    
    addTrip({
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: Number(formData.budget),
      description: formData.description
    });
    
    // In a real app we'd get the ID back from addTrip, but context adds it synchronously.
    // We can navigate to trips list or use a timeout to get the newest trip.
    setTimeout(() => {
      // The newest trip will be at the end, but we shouldn't rely purely on context update inside setTimeout
      // So let's just go to /trips for now to be safe, or we could modify addTrip to return the ID.
      // Modifying context is better but let's just go to /trips
      navigate('/trips');
    }, 100);
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </button>
      
      <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Plan a New Trip</h1>
      
      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Trip Name"
            name="name"
            placeholder="e.g. Summer in Europe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
            />
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
            />
          </div>
          
          <Input
            label="Total Budget (₹)"
            type="number"
            name="budget"
            placeholder="e.g. 150000"
            value={formData.budget}
            onChange={handleChange}
            error={errors.budget}
          />
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-foreground">Description (Optional)</label>
            <textarea
              name="description"
              rows={3}
              className="flex w-full rounded-[16px] border border-border bg-input-background px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="What's the vibe?"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" size="lg" className="w-full md:w-auto">
              Create Trip & Start Building
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
