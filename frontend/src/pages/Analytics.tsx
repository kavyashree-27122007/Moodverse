import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import MoodChart from '../components/MoodChart';
import { API } from '../context/AuthContext';
import { Sparkles, Loader2, TrendingUp, CalendarDays, BrainCircuit, Target, Activity, Heart, Lightbulb } from 'lucide-react';

interface AIInsights {
  currentState?: string;
  weeklyAnalysis?: string;
  monthlyProgress?: string;
  moodPattern?: string;
  triggers?: string;
  positiveActivities?: string;
  recommendation?: string;
  encouragement?: string;
}

const InsightCard = ({ title, content, icon: Icon, delay = 0, colorClass = "text-accent" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-surface/60 backdrop-blur-xl border border-white/5 hover:border-white/20 transition-colors rounded-3xl p-6 shadow-xl flex flex-col h-full"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2.5 rounded-xl bg-white/5 ${colorClass}`}>
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">{title}</h3>
    </div>
    <p className="text-white/90 leading-relaxed text-lg flex-grow">
      {content || "Analyzing patterns..."}
    </p>
  </motion.div>
);

const Analytics: React.FC = () => {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const insightsRes = await API.get('/ai/insights');
        setInsights(insightsRes.data.insights);
      } catch (err) {
        console.error('Failed to load AI data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAI();
  }, []);

  return (
    <div className="p-8 space-y-8 pb-20 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-accent to-purple-600 text-white shadow-lg shadow-accent/20">
          <Sparkles size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Psychological Insight</h1>
          <p className="text-white/50 mt-1">Your emotional journey, analyzed by Moody.</p>
        </div>
      </motion.div>

      {/* Mood Chart Section */}
      <div className="mb-8">
        <MoodChart />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <Loader2 className="animate-spin text-accent" size={48} />
          <p className="text-white/50 animate-pulse">Moody is analyzing your emotional memory...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Row: Current State & Encouragement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-surface to-surface/40 backdrop-blur-xl border border-accent/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <BrainCircuit size={24} className="text-accent" />
                <h2 className="text-xl font-bold text-white">Current Emotional State</h2>
              </div>
              <p className="text-2xl font-medium text-white/90 leading-tight relative z-10">
                {insights?.currentState || "Start logging moods to see insights!"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-pink-500/20 rounded-3xl p-8 shadow-2xl flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-2">
                <Heart size={20} className="text-pink-400" />
                <h3 className="text-sm font-bold text-pink-400/80 uppercase tracking-wider">A Word from Moody</h3>
              </div>
              <p className="text-xl font-medium text-white italic">
                "{insights?.encouragement || "Every step you take towards mindfulness is a victory."}"
              </p>
            </motion.div>
          </div>

          {/* Grid of 6 smaller insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InsightCard 
              title="Weekly Analysis" 
              content={insights?.weeklyAnalysis} 
              icon={TrendingUp} 
              colorClass="text-emerald-400"
              delay={0.2}
            />
            <InsightCard 
              title="Monthly Progress" 
              content={insights?.monthlyProgress} 
              icon={CalendarDays} 
              colorClass="text-blue-400"
              delay={0.3}
            />
            <InsightCard 
              title="Mood Pattern" 
              content={insights?.moodPattern} 
              icon={Activity} 
              colorClass="text-orange-400"
              delay={0.4}
            />
            <InsightCard 
              title="Trigger Detection" 
              content={insights?.triggers} 
              icon={Target} 
              colorClass="text-red-400"
              delay={0.5}
            />
            <InsightCard 
              title="Positive Activities" 
              content={insights?.positiveActivities} 
              icon={Sparkles} 
              colorClass="text-yellow-400"
              delay={0.6}
            />
            <InsightCard 
              title="Recommendation" 
              content={insights?.recommendation} 
              icon={Lightbulb} 
              colorClass="text-teal-400"
              delay={0.7}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

