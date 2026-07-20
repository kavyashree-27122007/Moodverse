import { motion } from 'framer-motion';
import { Bell, Trophy, Users, Sparkles, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Notifications: React.FC = () => {
  const { user } = useAuth();

  const notifications = [
    { icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/20', text: 'Your AI Psychological Insight is ready to view', time: 'Just now', read: false },
    { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/20', text: `You earned the "First Log" achievement! +10 XP`, time: 'Today', read: false },
    { icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/20', text: 'A friend updated their mood status to Happy 😊', time: '1h ago', read: true },
    { icon: Bell, color: 'text-accent', bg: 'bg-accent/20', text: "Don't forget to log your mood today to maintain your streak! 🔥", time: 'Yesterday', read: true },
  ];

  return (
    <div className="p-8 space-y-8 pb-20 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Bell className="text-accent" size={28} />
          Notifications
        </h1>
        <p className="text-white/50 mt-1">Activity and updates for {user?.fullName?.split(' ')[0] || 'you'}</p>
      </motion.div>

      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`bg-surface/60 backdrop-blur-xl border rounded-2xl p-4 flex items-start gap-4 transition-all ${
              notif.read ? 'border-white/5 opacity-60' : 'border-accent/20'
            }`}
          >
            <div className={`p-3 rounded-xl flex-shrink-0 ${notif.bg}`}>
              <notif.icon size={18} className={notif.color} />
            </div>
            <div className="flex-1">
              <p className={`text-sm ${notif.read ? 'text-white/60' : 'text-white'}`}>{notif.text}</p>
              <p className="text-xs text-white/30 mt-1">{notif.time}</p>
            </div>
            {notif.read && <CheckCheck size={14} className="text-white/20 mt-1 flex-shrink-0" />}
            {!notif.read && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
