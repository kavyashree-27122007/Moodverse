import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Sparkles, Mail, Lock, User, Globe, Music } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'English',
    genre: 'Pop'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    setError('');
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.username, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
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
             <h2 className="text-4xl font-bold text-white mb-4">Join MoodVerse</h2>
             <p className="text-white/60">Your journey to AI-curated entertainment and shared experiences starts here.</p>
           </motion.div>
           {/* Animated background bubbles */}
           <motion.div 
             animate={{ x: [0, 20, 0] }} 
             transition={{ duration: 6, repeat: Infinity }} 
             className="absolute top-20 left-10 w-24 h-24 bg-primary/30 rounded-full blur-xl" 
           />
           <motion.div 
             animate={{ x: [0, -20, 0] }} 
             transition={{ duration: 5, repeat: Infinity }} 
             className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/30 rounded-full blur-xl" 
           />
        </div>

        {/* Right Side: Signup Form */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
            <p className="text-white/60 mb-6">Experience entertainment like never before.</p>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm border border-red-500/50">{error}</div>}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input 
                    type="text" name="username" placeholder="Choose a username" 
                    className="pl-10" value={formData.username} onChange={handleChange} required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input 
                    type="email" name="email" placeholder="Enter your email" 
                    className="pl-10" value={formData.email} onChange={handleChange} required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input 
                      type="password" name="password" placeholder="Password" 
                      className="pl-10" value={formData.password} onChange={handleChange} required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input 
                      type="password" name="confirmPassword" placeholder="Confirm" 
                      className="pl-10" value={formData.confirmPassword} onChange={handleChange} required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Favorite Language</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
                    <select 
                      name="language" value={formData.language} onChange={handleChange}
                      className="glass-input w-full pl-10 appearance-none bg-black/50"
                    >
                      <option value="English">English</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Tanglish">Tanglish</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Favorite Genre</label>
                  <div className="relative">
                    <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
                    <select 
                      name="genre" value={formData.genre} onChange={handleChange}
                      className="glass-input w-full pl-10 appearance-none bg-black/50"
                    >
                      <option value="Pop">Pop</option>
                      <option value="Melody">Melody</option>
                      <option value="Rock">Rock</option>
                      <option value="Sci-Fi">Sci-Fi (Movies)</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full py-4 text-lg mt-6">
                Sign Up
              </Button>
            </form>
            
            <p className="text-center text-white/60 mt-6 text-sm">
              Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-primary hover:underline">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
