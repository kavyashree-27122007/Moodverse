import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API } from '../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EMOTION_COLORS: Record<string, string> = {
  Happy: 'bg-yellow-400', Sad: 'bg-blue-500', Angry: 'bg-red-500', Fear: 'bg-purple-600',
  Love: 'bg-pink-500', Excited: 'bg-purple-500', Calm: 'bg-emerald-500', Lonely: 'bg-slate-500',
  Confident: 'bg-blue-600', Hopeful: 'bg-sky-400', Motivated: 'bg-orange-500', Nostalgic: 'bg-amber-600',
  Anxious: 'bg-violet-500', Relaxed: 'bg-green-500', Bored: 'bg-gray-400', Frustrated: 'bg-red-600',
  Neutral: 'bg-purple-500'
};

interface RawMoodEntry {
  _id?: string;
  emotion: string;
  intensity: number;
  createdAt: string;
}

const MoodCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moods, setMoods] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      setLoading(true);
      let localData: RawMoodEntry[] = [];
      try {
        localData = JSON.parse(localStorage.getItem('mv_offline_moods') || '[]');
      } catch (e) {}

      let apiData: RawMoodEntry[] = [];
      try {
        const res = await API.get('/mood?limit=300');
        apiData = res.data;
      } catch (e) {}

      const allEntries = [...localData, ...apiData];
      
      // Map to dates (yyyy-mm-dd)
      const mapped: Record<string, string> = {};
      allEntries.forEach(entry => {
        const dateStr = new Date(entry.createdAt).toISOString().split('T')[0];
        // Only keep the first emotion logged that day for simplicity, or latest
        if (!mapped[dateStr]) {
          mapped[dateStr] = entry.emotion;
        }
      });
      
      setMoods(mapped);
      setLoading(false);
    };
    
    fetchMoods();
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const renderDays = () => {
    const days = [];
    
    // Empty slots before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 md:h-16 rounded-xl bg-white/5 opacity-50 border border-transparent"></div>);
    }
    
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const emotion = moods[dateStr];
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      
      days.push(
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.01 }}
          className={`h-12 md:h-16 rounded-xl flex flex-col items-center justify-center relative overflow-hidden transition-all group ${
            isToday ? 'border-2 border-white/50' : 'border border-white/10'
          } ${emotion ? (EMOTION_COLORS[emotion] || 'bg-white/20') : 'bg-surface/40 hover:bg-white/10'}`}
        >
          <span className={`text-sm md:text-base font-bold z-10 ${emotion ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`}>
            {i}
          </span>
          {emotion && (
            <div className="absolute bottom-1 text-[8px] md:text-[10px] font-semibold text-white/90 uppercase tracking-wider hidden md:block">
              {emotion}
            </div>
          )}
        </motion.div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Mood Calendar</h2>
          <p className="text-white/50 text-sm mt-1">Track your emotional consistency</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={20} className="text-white/70" />
          </button>
          <div className="font-semibold text-white min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronRight size={20} className="text-white/70" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-bold text-white/40 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {renderDays()}
        </div>
      )}
    </div>
  );
};

export default MoodCalendar;
