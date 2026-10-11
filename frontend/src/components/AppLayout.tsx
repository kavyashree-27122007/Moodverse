import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MoodyMascot from './MoodyMascot';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { currentEmotion, theme } = useTheme();

  return (
    <div 
      className="flex min-h-screen relative overflow-hidden text-text selection:bg-accent/30 selection:text-white transition-colors duration-700"
      style={{
        backgroundColor: theme.bg || '#0F172A',
        backgroundImage: `
          radial-gradient(at 0% 0%, ${theme.accent}25 0px, transparent 55%),
          radial-gradient(at 100% 100%, ${theme.accent}20 0px, transparent 50%),
          radial-gradient(at 50% 50%, ${theme.accent}10 0px, transparent 65%)
        `
      }}
    >
      {/* Dynamic Cosmic Ambient Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle Starlight Dot Matrix Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-80" />

        {/* Ambient Pulsing Orb 1 - Top Right Glowing in Current Mood Color */}
        <motion.div
          key={`orb-1-${currentEmotion}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 30, 0],
            y: [0, -25, 0],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-[500px] h-[500px] md:w-[650px] md:h-[650px] rounded-full blur-[100px]"
          style={{
            background: `radial-gradient(circle, ${theme.accent} 0%, rgba(139, 92, 246, 0.35) 45%, transparent 70%)`
          }}
        />

        {/* Ambient Pulsing Orb 2 - Bottom Left Glowing in Secondary Tint */}
        <motion.div
          key={`orb-2-${currentEmotion}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -25, 0],
            y: [0, 30, 0],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-24 -left-24 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(circle, ${theme.accent} 0%, rgba(59, 130, 246, 0.25) 50%, transparent 75%)`
          }}
        />

        {/* Ambient Subtle Center Mood Beam */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[350px] rounded-full blur-[140px] opacity-20 pointer-events-none"
          style={{ backgroundColor: theme.accent }}
        />
      </div>

      <Sidebar />
      <main className="flex-1 md:ml-64 min-h-screen overflow-x-hidden overflow-y-auto pt-14 md:pt-0 pb-20 md:pb-0 z-10 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Moody Mascot */}
      <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 pointer-events-none">
        <div className="pointer-events-auto scale-75 md:scale-100 origin-bottom-right">
          <MoodyMascot />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
