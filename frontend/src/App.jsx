import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/Button';
import { GlassCard } from './components/ui/GlassCard';
import { Sparkles, Play, Users, Music } from 'lucide-react';

function App() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <div className="min-h-screen gradient-mesh relative overflow-hidden">
      {/* Aurora Lights Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[150px]"
        />
      </div>

      {/* Navbar Placeholder */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-secondary w-8 h-8" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            MoodVerse
          </span>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => navigate('/login')}>Login</Button>
          <Button variant="primary" onClick={() => navigate('/signup')}>Sign Up</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6">
            <span className="block text-white">Discover Your Mood.</span>
            <span className="block text-white/80 text-5xl md:text-7xl mt-2">Share It With Friends.</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-pink-500 mt-2">
              Watch & Listen Together.
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/70 max-w-2xl mb-10"
        >
          An AI-powered platform that detects your emotions and connects you with friends through perfectly matched movies and music.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Button variant="primary" onClick={() => navigate('/login')} className="text-lg px-8 py-4 flex items-center gap-2">
            Get Started <Sparkles className="w-5 h-5" />
          </Button>
          <Button variant="secondary" className="text-lg px-8 py-4 flex items-center gap-2">
            Explore Demo <Play className="w-5 h-5" />
          </Button>
        </motion.div>
        
        {/* Floating Cards (Parallax) */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
           <motion.div style={{ y: y1 }} className="absolute top-[20%] left-[10%]">
             <GlassCard className="p-4 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                 <Users className="text-primary w-5 h-5" />
               </div>
               <div>
                 <p className="text-sm font-semibold">Friend Match</p>
                 <p className="text-xs text-white/60">92% Compatible</p>
               </div>
             </GlassCard>
           </motion.div>
           
           <motion.div style={{ y: y2 }} className="absolute bottom-[25%] right-[15%]">
             <GlassCard className="p-4 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                 <Music className="text-secondary w-5 h-5" />
               </div>
               <div>
                 <p className="text-sm font-semibold">Chill Vibes</p>
                 <p className="text-xs text-white/60">Playing Now</p>
               </div>
             </GlassCard>
           </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;
