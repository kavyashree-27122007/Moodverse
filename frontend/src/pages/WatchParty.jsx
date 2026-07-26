import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';

export default function WatchParty() {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Simulate joining the party and redirecting to dashboard
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-md p-12 rounded-3xl border border-white/10 text-center max-w-md w-full relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-full absolute -top-10 -left-10 opacity-50 blur-2xl"
        />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 relative">
             <Users className="w-10 h-10 text-primary" />
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute top-0 right-0"
             >
                <Sparkles className="w-5 h-5 text-secondary" />
             </motion.div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Joining Party...</h2>
          <p className="text-white/60 mb-6">Connecting you to session <span className="font-mono text-white/80">{id}</span></p>
          
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: "100%" }} 
              transition={{ duration: 2.8 }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
