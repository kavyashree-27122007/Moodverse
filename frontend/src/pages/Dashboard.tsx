import { useState, useMemo, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Activity } from 'lucide-react';
import MoodInput from '../components/MoodInput';
import MoodChart from '../components/MoodChart';
import FriendsList from '../components/FriendsList';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useMascot } from '../context/MascotContext';

const getGreetingTime = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const StatCard = memo(({ stat, i }: { stat: { label: string; value: string; icon: any; color: string }; i: number }) => (
  <motion.div
    key={stat.label}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * i }}
    className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
      <stat.icon size={20} />
    </div>
    <div>
      <p className="text-white/50 text-xs">{stat.label}</p>
      <p className="text-white text-lg font-semibold">{stat.value}</p>
    </div>
  </motion.div>
));

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentEmotion } = useTheme();
  const [chartRefreshKey, setChartRefreshKey] = useState(0);

  const greeting = useMemo(() => getGreetingTime(), []);

  const stats = useMemo(() => [
    { label: 'Current Mood', value: currentEmotion, icon: Activity, color: 'text-accent' },
    { label: 'Streak', value: `${user?.currentStreak || 0} Days`, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Total Points', value: `${user?.points || 0} ✨`, icon: Sparkles, color: 'text-yellow-400' },
    { label: 'AI Persona', value: user?.aiPersonality || 'Empathetic', icon: Activity, color: 'text-purple-400' },
  ], [currentEmotion, user?.currentStreak, user?.points, user?.aiPersonality]);

  const { setMascotState, showMessage } = useMascot();

  const handleMoodLogged = useCallback(() => {
    setChartRefreshKey((k) => k + 1);
    setMascotState('celebrating');
    showMessage('Yay! Thanks for checking in today!', 4000);
    setTimeout(() => setMascotState('idle'), 4000);
  }, [setMascotState, showMessage]);
  return (
    <div className="p-8 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {greeting}, <span className="text-accent">{user?.fullName?.split(' ')[0] || 'there'}</span>
          </h1>
          <p className="text-white/50 mt-1">
            You're currently feeling <span className="text-accent font-medium">{currentEmotion}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => alert("AI Engine is actively analyzing your moods to curate personalized recommendations and insights!")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 cursor-pointer hover:bg-accent/20 transition-all"
          >
            <Sparkles size={16} className="text-accent" />
            <span className="text-accent text-sm font-medium">AI Active</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} i={i} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Input + Charts: Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <MoodInput onMoodLogged={handleMoodLogged} />
          <MoodChart refreshKey={chartRefreshKey} />
        </div>

        {/* Friends Panel: Right 1/3 */}
        <div className="space-y-6">
          <FriendsList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
