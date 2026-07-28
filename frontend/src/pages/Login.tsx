import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setEmotion } = useTheme();
  const { login } = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!identifier || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await login(identifier, password);
      setLoading(false);
      setEmotion('Happy');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      setLoading(false);
      setEmotion('Anxious');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-background transition-colors duration-700" />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-accent/20 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] bg-blue-500/10 rounded-full blur-[120px]" 
      />

      {/* Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 bg-surface/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold tracking-tight text-white mb-2"
          >
            Welcome Back
          </motion.h1>
          <p className="text-white/60">Log in to your emotional universe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center justify-center text-center"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Username or Email</label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all hover:bg-white/10"
              placeholder="Enter your email or username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all hover:bg-white/10"
                placeholder="Enter your password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-sm font-medium tracking-wide"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm py-2">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" className="rounded border-white/10 bg-white/5 text-accent focus:ring-accent focus:ring-offset-0" />
              <span className="text-white/50 group-hover:text-white/90 transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-accent/80 hover:text-accent transition-colors">Forgot Password?</a>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full py-4 mt-2 rounded-2xl font-bold shadow-xl shadow-accent/20 transition-all ${
              loading 
                ? 'bg-accent/50 cursor-not-allowed' 
                : 'bg-accent hover:bg-accent/90 hover:shadow-accent/40'
            } text-white relative overflow-hidden`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm text-white/60">
          New to MoodVerse?{' '}
          <Link to="/signup" className="text-accent hover:text-white transition-colors font-medium">
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
