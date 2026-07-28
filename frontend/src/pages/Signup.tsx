import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { setEmotion } = useTheme();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Password strength checker
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score < 3) return { label: 'Weak', color: 'bg-red-500' };
    if (score < 5) return { label: 'Medium', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (Object.values(formData).some(val => !val)) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      setEmotion('Frustrated');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });
      setLoading(false);
      setEmotion('Happy');
      navigate('/dashboard'); // AuthContext stores token, navigate directly to dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
      setLoading(false);
      setEmotion('Anxious');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-12">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-background transition-colors duration-700" />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-accent/20 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-pink-500/10 rounded-full blur-[120px]" 
      />

      {/* Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 bg-surface/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl mx-4"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-white mb-2"
          >
            Join MoodVerse
          </motion.h1>
          <p className="text-white/60">Start tracking your emotional journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
              <input 
                name="fullName"
                type="text" 
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all hover:bg-white/10"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Username</label>
              <input 
                name="username"
                type="text" 
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all hover:bg-white/10"
                placeholder="@johndoe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
            <input 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all hover:bg-white/10"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
            <div className="relative">
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all hover:bg-white/10"
                placeholder="Create a strong password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-sm font-medium tracking-wide"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {formData.password && (
              <div className="mt-3 flex items-center space-x-3">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${strength.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: strength.label === 'Weak' ? '33%' : strength.label === 'Medium' ? '66%' : '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className={`text-xs font-medium tracking-wide ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Confirm Password</label>
            <input 
              name="confirmPassword"
              type={showPassword ? "text" : "password"} 
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all hover:bg-white/10"
              placeholder="Confirm your password"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full py-3.5 mt-4 rounded-xl font-semibold shadow-lg transition-all ${
              loading 
                ? 'bg-accent/50 cursor-not-allowed' 
                : 'bg-accent hover:bg-accent/90 hover:shadow-accent/25'
            } text-white relative overflow-hidden`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              'Sign Up'
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-white transition-colors font-medium">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
