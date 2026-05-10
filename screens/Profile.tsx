import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTraveloop } from '../context/TraveloopContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Settings, Globe, Heart, Trash2, LogOut, Camera } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser, logout } = useTraveloop();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: user?.language || 'English',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateUser({ ...user!, ...formData });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will erase all your trips.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const mockSavedDestinations = ['Kyoto, Japan', 'Amalfi Coast, Italy', 'Banff, Italy', 'Cape Town, Canada'];

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      <h1 className="text-4xl font-serif font-bold text-foreground">Profile & Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                <User size={24} className="text-primary" /> Personal Info
              </h2>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setFormData({ name: user!.name, email: user!.email, language: user!.language });
                    setIsEditing(false);
                  }}>Cancel</Button>
                  <Button size="sm" onClick={handleSave}>Save</Button>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8 pb-8 border-b border-border">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-accent text-white flex items-center justify-center text-4xl font-bold">
                  {user?.name.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-primary shadow-sm hover:bg-muted transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <div className="flex-1 w-full space-y-4">
                {isEditing ? (
                  <>
                    <Input 
                      label="Full Name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                    <Input 
                      label="Email Address" 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">Full Name</p>
                      <p className="text-lg font-bold text-foreground">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">Email Address</p>
                      <p className="text-lg font-bold text-foreground">{user?.email}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Settings size={20} className="text-muted-foreground" /> Preferences
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg text-foreground"><Globe size={20} /></div>
                  <div>
                    <p className="font-bold">Language</p>
                    <p className="text-sm text-muted-foreground">Select your preferred app language</p>
                  </div>
                </div>
                <select 
                  className="bg-input-background border border-border rounded-[12px] px-4 py-2 font-medium outline-none focus:ring-2 focus:ring-primary"
                  value={formData.language}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setFormData({...formData, language: newLang});
                    updateUser({ ...user!, language: newLang });
                  }}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Heart size={20} className="text-destructive" /> Saved Destinations
            </h3>
            <ul className="space-y-3">
              {mockSavedDestinations.map((dest, i) => (
                <li key={i} className="flex justify-between items-center text-sm font-medium p-2 hover:bg-muted rounded-[8px] cursor-pointer transition-colors">
                  {dest}
                  <Globe size={14} className="text-muted-foreground" />
                </li>
              ))}
            </ul>
            <Button variant="ghost" className="w-full mt-4 text-primary text-sm">View Map</Button>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-2">Account Actions</h3>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut size={18} /> Sign Out
            </Button>
            <Button variant="danger" className="w-full justify-start gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white" onClick={handleDeleteAccount}>
              <Trash2 size={18} /> Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
