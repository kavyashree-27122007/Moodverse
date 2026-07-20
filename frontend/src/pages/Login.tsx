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
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold tracking-tight text-white mb-2"
          >
            Welcome Back
          </motion.h1>
          <p className="text-white/60">Log in to your emotional universe</p>
          
          <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-xl">
            <p className="text-xs text-accent/80">
              <span className="font-bold">Note:</span> If the server recently restarted, the local database may have reset. If you can't log in, please <Link to="/signup" className="underline hover:text-white">Sign Up</Link> again to recreate your account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Username or Email</label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              placeholder="Enter your email or username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                placeholder="Enter your password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" className="rounded border-white/20 bg-white/5 text-accent focus:ring-accent" />
              <span className="text-white/60 group-hover:text-white transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-accent hover:text-accent/80 transition-colors">Forgot Password?</a>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-semibold shadow-lg transition-all ${
              loading 
                ? 'bg-accent/50 cursor-not-allowed' 
                : 'bg-accent hover:bg-accent/90 hover:shadow-accent/25'
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
