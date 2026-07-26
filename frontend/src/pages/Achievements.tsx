import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Trophy, Flame, Zap, Star, Lock } from 'lucide-react';

const allAchievements = [
  { id: 'First Log', label: 'First Log', description: 'Logged your very first mood', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/20', points: 10 },
  { id: '3-Day Streak', label: '3-Day Streak', description: 'Logged moods 3 days in a row', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/20', points: 30 },
  { id: '7-Day Streak', label: '7-Day Streak', description: 'Logged moods 7 days in a row', icon: Flame, color: 'text-red-400', bg: 'bg-red-400/20', points: 70 },
  { id: 'Chatty', label: 'Chatty', description: 'Sent your first message to a friend', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/20', points: 20 },
  { id: 'Zen Master', label: 'Zen Master', description: 'Logged Calm mood 5 times', icon: Trophy, color: 'text-green-400', bg: 'bg-green-400/20', points: 50 },
];

const Achievements: React.FC = () => {
  const { user } = useAuth();
  const unlocked = new Set<string>((user?.achievements as string[]) || []);
  const totalPoints = user?.points || 0;

  return (
    <div className="p-8 space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Trophy className="text-yellow-400" size={28} />
          Achievements
        </h1>
        <p className="text-white/50 mt-1">Your wellness milestones and emotional growth</p>
      </motion.div>

      {/* Points Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-accent/30 via-accent/10 to-transparent border border-accent/20 rounded-3xl p-6 flex items-center gap-6"
      >
        <div className="p-4 rounded-2xl bg-accent/20 text-accent">
          <Star size={32} />
        </div>
        <div>
          <p className="text-white/60 text-sm">Total XP Points</p>
          <p className="text-5xl font-black text-white">{totalPoints}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-white/60 text-sm">Streak</p>
          <p className="text-3xl font-bold text-orange-400">{user?.currentStreak || 0} 🔥</p>
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {allAchievements.map((ach, i) => {
          const isUnlocked = unlocked.has(ach.id);
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative bg-surface/60 backdrop-blur-xl border rounded-2xl p-5 transition-all ${
                isUnlocked ? 'border-white/15 hover:border-accent/30' : 'border-white/5 opacity-50'
              }`}
            >
              {!isUnlocked && (
                <div className="absolute top-3 right-3">
                  <Lock size={14} className="text-white/20" />
                </div>
              )}
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-xl ${isUnlocked ? ach.bg : 'bg-white/5'}`}>
                  <ach.icon size={22} className={isUnlocked ? ach.color : 'text-white/20'} />
                </div>
                <div>
                  <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-white/30'}`}>{ach.label}</h3>
                  <p className={`text-xs ${isUnlocked ? 'text-white/50' : 'text-white/20'}`}>{ach.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isUnlocked ? 'bg-accent/10 text-accent' : 'bg-white/5 text-white/20'}`}>
                  +{ach.points} XP
                </span>
                {isUnlocked && <span className="text-xs text-green-400 font-semibold">✓ Unlocked</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
