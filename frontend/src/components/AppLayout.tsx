import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MoodyMascot from './MoodyMascot';
import { motion, AnimatePresence } from 'framer-motion';

const AppLayout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden text-text selection:bg-accent/30 selection:text-white">
      {/* Dynamic Cosmic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle dot matrix grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />

        {/* Ambient Pulsing Orb 1 - Top Right */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full blur-[120px] bg-gradient-to-br from-accent/40 via-purple-600/30 to-transparent"
        />

        {/* Ambient Pulsing Orb 2 - Bottom Left */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 40, 0],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-transparent"
        />

        {/* Ambient Center Glow */}
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[160px] bg-accent/15"
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
      <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 pointer-events-none">
        <div className="pointer-events-auto scale-75 md:scale-100 origin-bottom-right">
          <MoodyMascot />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
