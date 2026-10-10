import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MoodyMascot from './MoodyMascot';
import { motion, AnimatePresence } from 'framer-motion';

const AppLayout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
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
