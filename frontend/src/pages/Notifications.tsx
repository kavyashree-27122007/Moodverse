import { motion } from 'framer-motion';
import { Bell, Trophy, Users, Sparkles, CheckCheck, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import type { AppNotification } from '../context/SocketContext';

const getNotificationStyle = (type: AppNotification['type']) => {
  switch (type) {
    case 'insight': return { icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/20' };
    case 'achievement': return { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    case 'friend_mood': return { icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/20' };
    case 'message': return { icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-400/20' };
    default: return { icon: Bell, color: 'text-accent', bg: 'bg-accent/20' };
  }
};

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const socketCtx = useSocket();
  const notifications = socketCtx?.notifications || [];
  const markAsRead = socketCtx?.markNotificationAsRead || (() => {});

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
        {notifications.map((notif, i) => {
          const style = getNotificationStyle(notif.type);
          const Icon = style.icon;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => markAsRead(notif.id)}
              className={`bg-surface/60 backdrop-blur-xl border rounded-2xl p-4 flex items-start gap-4 transition-all cursor-pointer ${
                notif.read ? 'border-white/5 opacity-60' : 'border-accent/20 hover:border-accent/40'
              }`}
            >
              <div className={`p-3 rounded-xl flex-shrink-0 ${style.bg}`}>
                <Icon size={18} className={style.color} />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${notif.read ? 'text-white/60' : 'text-white font-medium'}`}>{notif.message}</p>
                <p className="text-xs text-white/30 mt-1">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              {notif.read && <CheckCheck size={14} className="text-white/20 mt-1 flex-shrink-0" />}
              {!notif.read && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1" />}
            </motion.div>
          );
        })}
        {notifications.length === 0 && (
           <p className="text-white/40 text-center py-10">No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
