import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Compass } from 'lucide-react';
import { useTraveloop } from '../context/TraveloopContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { motion } from 'motion/react';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login } = useTraveloop();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!isLogin && !name) newErrors.name = 'Name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock auth
    login({
      name: isLogin ? 'Demo User' : name,
      email,
      language: 'English',
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* CSS Gradient Mesh Background */}
      <div 
        className="absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(27, 67, 50, 0.4) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(245, 158, 11, 0.4) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(27, 67, 50, 0.4) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(245, 158, 11, 0.4) 0px, transparent 50%)
          `,
          backgroundColor: '#FAFAF7'
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8 text-primary">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
            <Compass size={40} className="text-accent" />
          </div>
          <h1 className="font-serif text-5xl font-bold tracking-tight text-center">Traveloop</h1>
          <p className="text-foreground/80 mt-2 font-medium">Your multi-city journeys, simplified.</p>
        </div>

        <Card className="p-8 backdrop-blur-sm bg-white/90">
          <h2 className="text-2xl font-serif font-bold mb-6">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                label="Full Name"
                placeholder="Riya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
            )}
            <Input
              label="Email Address"
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            
            <Button type="submit" className="w-full mt-4" size="lg">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
