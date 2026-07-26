import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GlassCard } from '../components/ui/GlassCard';
import { Sparkles, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-white/10">
        {/* Left Side: Illustration */}
        <div className="hidden md:flex flex-1 bg-black/40 backdrop-blur-md p-12 flex-col justify-center items-center relative overflow-hidden border-r border-white/5">
           <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center z-10"
           >
             <Sparkles className="w-16 h-16 text-secondary mx-auto mb-6" />
             <h2 className="text-4xl font-bold text-white mb-4">Welcome back to MoodVerse</h2>
             <p className="text-white/60">Connect with your friends through movies and music based on your real-time mood.</p>
           </motion.div>
           {/* Animated background bubbles */}
           <motion.div 
             animate={{ y: [0, -20, 0] }} 
             transition={{ duration: 4, repeat: Infinity }} 
             className="absolute top-10 right-10 w-24 h-24 bg-primary/30 rounded-full blur-xl" 
           />
           <motion.div 
             animate={{ y: [0, 20, 0] }} 
             transition={{ duration: 5, repeat: Infinity }} 
             className="absolute bottom-10 left-10 w-32 h-32 bg-secondary/30 rounded-full blur-xl" 
           />
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
            <p className="text-white/60 mb-8">Enter your details to continue.</p>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm border border-red-500/50">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded bg-white/10 border-white/20 text-primary focus:ring-primary/50" />
                  <span className="text-sm text-white/70">Remember me</span>
                </label>
                <a href="#" className="text-sm text-secondary hover:text-secondary/80 transition-colors">Forgot password?</a>
              </div>

              <Button type="submit" className="w-full py-4 text-lg mt-4">
                Login
              </Button>
            </form>
            
            <p className="text-center text-white/60 mt-8 text-sm">
              Don't have an account? <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} className="text-primary hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
