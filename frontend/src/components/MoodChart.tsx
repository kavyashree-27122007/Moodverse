import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from 'recharts';
import { API } from '../context/AuthContext';

const EMOTION_COLORS: Record<string, string> = {
  Happy: '#FACC15', Sad: '#3B82F6', Angry: '#EF4444', Fear: '#7C3AED',
  Love: '#EC4899', Excited: '#A855F7', Calm: '#10B981', Lonely: '#64748B',
  Confident: '#2563EB', Hopeful: '#0EA5E9', Motivated: '#F97316', Nostalgic: '#D97706',
  Anxious: '#8B5CF6', Relaxed: '#22C55E', Bored: '#9CA3AF', Frustrated: '#DC2626',
  Overwhelmed: '#9333EA', Grateful: '#84CC16', Jealous: '#15803D', Insecure: '#A3A3A3',
  Proud: '#6366F1', Inspired: '#EAB308', Confused: '#71717A', Surprised: '#D946EF',
  Stressed: '#B91C1C', Peaceful: '#14B8A6', Optimistic: '#F59E0B', Pessimistic: '#475569',
  Curious: '#818CF8', Neutral: '#A855F7',
};

interface MoodChartProps {
  refreshKey?: number;
}

const MoodChart: React.FC<MoodChartProps> = ({ refreshKey }) => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/mood/stats?days=${timeRange}`);
        setStats(res.data);
      } catch {
        // Use demo data if backend is unavailable
        setStats(generateDemoData(timeRange));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [timeRange, refreshKey]);

  // Generate demo data for visualization when backend is not connected
  const generateDemoData = (days: number) => {
    const emotions = ['Happy', 'Calm', 'Motivated', 'Anxious', 'Sad', 'Excited', 'Peaceful'];
    const data: any[] = [];
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const em = emotions[Math.floor(Math.random() * emotions.length)];
      data.push({
        _id: { emotion: em, day: dayStr },
        count: Math.floor(Math.random() * 4) + 1,
        avgIntensity: Math.round((Math.random() * 5 + 4) * 10) / 10,
      });
    }
    return data;
  };

  // Transform aggregated stats into chart-friendly format
  const timelineData = (() => {
    const grouped: Record<string, { day: string; count: number; avgIntensity: number; emotions: string[] }> = {};
    stats.forEach((s) => {
      const day = s._id.day;
      if (!grouped[day]) grouped[day] = { day, count: 0, avgIntensity: 0, emotions: [] };
      grouped[day].count += s.count;
      grouped[day].avgIntensity = s.avgIntensity;
      grouped[day].emotions.push(s._id.emotion);
    });
    return Object.values(grouped).sort((a, b) => a.day.localeCompare(b.day));
  })();

  const pieData = (() => {
    const map: Record<string, number> = {};
    stats.forEach((s) => {
      map[s._id.emotion] = (map[s._id.emotion] || 0) + s.count;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  })();

  const barData = (() => {
    const map: Record<string, { total: number; count: number }> = {};
    stats.forEach((s) => {
      if (!map[s._id.emotion]) map[s._id.emotion] = { total: 0, count: 0 };
      map[s._id.emotion].total += s.avgIntensity * s.count;
      map[s._id.emotion].count += s.count;
    });
    return Object.entries(map)
      .map(([name, { total, count }]) => ({ name, intensity: Math.round((total / count) * 10) / 10 }))
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 8);
  })();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-surface/90 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-white text-sm font-medium">
            {p.name}: <span className="text-accent">{p.value}</span>
          </p>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`bg-surface/60 rounded-2xl border border-white/10 p-6 ${i === 1 ? 'lg:col-span-2' : ''}`}>
            <div className="h-6 w-40 bg-white/10 rounded-lg mb-4 animate-pulse" />
            <div className="h-48 bg-white/5 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time range selector */}
      <div className="flex gap-2">
        {[7, 14, 30].map((d) => (
          <button
            key={d}
            onClick={() => setTimeRange(d)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              timeRange === d
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {d}d
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart - Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4">Mood Timeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="avgIntensity"
                name="Avg Intensity"
                stroke="var(--color-accent)"
                fill="url(#colorIntensity)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Entries"
                stroke="#64748B"
                fill="transparent"
                strokeWidth={1.5}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart - Emotion Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4">Emotion Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={EMOTION_COLORS[entry.name] || '#A855F7'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map((e) => (
              <span key={e.name} className="flex items-center gap-1 text-xs text-white/60">
                <span className="w-2 h-2 rounded-full" style={{ background: EMOTION_COLORS[e.name] || '#A855F7' }} />
                {e.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart - Intensity by Emotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4">Average Intensity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="intensity" name="Intensity" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={EMOTION_COLORS[entry.name] || '#A855F7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodChart;
