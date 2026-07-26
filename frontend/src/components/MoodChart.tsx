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
  Overwhelmed: '#9333EA', Grateful: '#84CC16', Peaceful: '#14B8A6',
  Stressed: '#B91C1C', Optimistic: '#F59E0B', Pessimistic: '#475569',
  Neutral: '#A855F7', Surprised: '#D946EF',
};

interface MoodChartProps {
  refreshKey?: number;
}

interface RawMoodEntry {
  _id?: string;
  emotion: string;
  intensity: number;
  createdAt: string;
}

const MoodChart: React.FC<MoodChartProps> = ({ refreshKey }) => {
  const [rawEntries, setRawEntries] = useState<RawMoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    const fetchMoods = async () => {
      setLoading(true);
      try {
        // Try /mood/stats first (aggregated)
        const statsRes = await API.get(`/mood/stats?days=${timeRange}`);
        if (statsRes.data && statsRes.data.length > 0) {
          // Convert aggregated format into raw entries for charting
          const synth: RawMoodEntry[] = statsRes.data.map((s: any) => ({
            emotion: s._id?.emotion || 'Neutral',
            intensity: s.avgIntensity || 5,
            createdAt: s._id?.day ? `${s._id.day}T12:00:00Z` : new Date().toISOString(),
          }));
          setRawEntries(synth);
        } else {
          throw new Error('empty stats');
        }
      } catch {
        try {
          // Fallback: use raw /mood history
          const moodRes = await API.get(`/mood?limit=100`);
          if (moodRes.data && moodRes.data.length > 0) {
            setRawEntries(moodRes.data);
          } else {
            setRawEntries([]);
          }
        } catch {
          setRawEntries([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, [timeRange, refreshKey]);

  // Filter entries to the selected time range
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - timeRange);
  const filtered = rawEntries.filter(e => new Date(e.createdAt) >= cutoff);

  // ── Timeline: group by day, avg intensity
  const timelineData = (() => {
    const grouped: Record<string, { day: string; totalIntensity: number; count: number }> = {};
    filtered.forEach(e => {
      const day = e.createdAt.split('T')[0];
      if (!grouped[day]) grouped[day] = { day, totalIntensity: 0, count: 0 };
      grouped[day].totalIntensity += e.intensity;
      grouped[day].count += 1;
    });
    return Object.values(grouped)
      .sort((a, b) => a.day.localeCompare(b.day))
      .map(d => ({ day: d.day, avgIntensity: Math.round((d.totalIntensity / d.count) * 10) / 10, count: d.count }));
  })();

  // ── Pie: emotion frequency
  const pieData = (() => {
    const map: Record<string, number> = {};
    filtered.forEach(e => { map[e.emotion] = (map[e.emotion] || 0) + 1; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  })();

  // ── Bar: avg intensity per emotion
  const barData = (() => {
    const map: Record<string, { total: number; count: number }> = {};
    filtered.forEach(e => {
      if (!map[e.emotion]) map[e.emotion] = { total: 0, count: 0 };
      map[e.emotion].total += e.intensity;
      map[e.emotion].count += 1;
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

  // No mood data yet — show friendly empty state
  if (filtered.length === 0) {
    return (
      <div className="space-y-6">
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
        >
          <p className="text-5xl mb-4">📊</p>
          <h3 className="text-white font-bold text-xl mb-2">No mood data yet for this period</h3>
          <p className="text-white/40 text-sm">
            Log your mood from the Dashboard and come back to see your personal analytics!
          </p>
        </motion.div>
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
        {/* Area Chart - Mood Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-1">Mood Timeline</h3>
          <p className="text-white/35 text-xs mb-4">Your emotional intensity over the past {timeRange} days</p>
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
                domain={[0, 10]}
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
          <h3 className="text-white font-semibold mb-1">Emotion Distribution</h3>
          <p className="text-white/35 text-xs mb-4">Which emotions you felt most in the last {timeRange} days</p>
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
          <h3 className="text-white font-semibold mb-1">Average Intensity</h3>
          <p className="text-white/35 text-xs mb-4">How intensely you've felt each emotion</p>
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
