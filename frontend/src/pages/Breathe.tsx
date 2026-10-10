import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Wind, Heart, Play, Square } from 'lucide-react';

type Phase = 'idle' | 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const Breathe: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);

  // Box Breathing: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s
  useEffect(() => {
    if (phase === 'idle') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          if (phase === 'inhale') { setPhase('hold-in'); return 4; }
          if (phase === 'hold-in') { setPhase('exhale'); return 4; }
          if (phase === 'exhale') { setPhase('hold-out'); return 4; }
          if (phase === 'hold-out') { 
            setPhase('inhale'); 
            setCycles(c => c + 1);
            return 4; 
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const startBreathing = () => {
    setPhase('inhale');
    setTimeLeft(4);
    setCycles(0);
  };

  const stopBreathing = () => {
    setPhase('idle');
    setTimeLeft(0);
  };

  // Determine circle scale based on phase
  const getScale = () => {
    if (phase === 'idle') return 1;
    if (phase === 'inhale') return 1.5;
    if (phase === 'hold-in') return 1.5;
    if (phase === 'exhale') return 1;
    if (phase === 'hold-out') return 1;
    return 1;
  };

  const getMessage = () => {
    if (phase === 'idle') return "Ready to relax?";
    if (phase === 'inhale') return "Breathe In...";
    if (phase === 'hold-in') return "Hold...";
    if (phase === 'exhale') return "Breathe Out...";
    if (phase === 'hold-out') return "Hold...";
  };

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] space-y-12 text-center">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3 flex items-center justify-center gap-3">
          <Wind className="text-accent" size={36} /> Breathing Room
        </h1>
        <p className="text-white/60 text-lg">
          Take a moment to center yourself. You are feeling <span className="text-accent font-semibold">{currentEmotion}</span>.
        </p>
      </motion.div>

      <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 my-8">
        {/* Pulsing background ring */}
        {phase !== 'idle' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-accent/20 blur-2xl"
            animate={{ scale: getScale() }}
            transition={{ duration: 4, ease: "easeInOut" }}
          />
        )}
        
        {/* Main Breathing Circle */}
        <motion.div
          className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-accent/80 to-purple-600/80 shadow-[0_0_50px_rgba(var(--color-accent),0.5)] flex items-center justify-center backdrop-blur-md border border-white/20"
          animate={{ scale: getScale() }}
          transition={{ duration: 4, ease: "linear" }}
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={phase}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-2xl font-bold text-white tracking-widest uppercase"
            >
              {getMessage()}
            </motion.h2>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="space-y-6">
        {phase !== 'idle' && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl font-mono font-bold text-white">{timeLeft}s</div>
            <div className="text-white/50 text-sm">Cycles completed: {cycles}</div>
          </div>
        )}

        {phase === 'idle' ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startBreathing}
            className="flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-accent/20 transition-all"
          >
            <Play fill="currentColor" size={20} /> Start Breathing
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopBreathing}
            className="flex items-center gap-2 px-8 py-4 bg-surface border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold text-lg shadow-xl transition-all"
          >
            <Square fill="currentColor" size={20} /> Stop
          </motion.button>
        )}
      </div>

      <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 text-left max-w-lg w-full">
        <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
          <Heart size={18} className="text-pink-400" /> Why Box Breathing?
        </h3>
        <p className="text-white/60 text-sm leading-relaxed">
          Box breathing (4-4-4-4) is a powerful technique to hack your nervous system. By regulating your breath, you signal to your brain that you are safe, instantly lowering cortisol (stress) and returning you to a calm, focused state.
        </p>
      </div>
    </div>
  );
};

export default Breathe;
