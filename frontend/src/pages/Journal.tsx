import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BookOpen, PenLine, Calendar, Loader2, Send } from 'lucide-react';
import { API } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface JournalEntry {
  _id?: string;
  emotion: string;
  intensity: number;
  note: string;
  createdAt: string;
}

const emotionEmojis: Record<string, string> = {
  Happy: '😊', Sad: '😢', Angry: '😤', Calm: '😌', Anxious: '😰',
  Excited: '🤩', Love: '❤️', Motivated: '💪', Relaxed: '😎', Neutral: '😐',
  Fear: '😨', Disgust: '🤢', Surprised: '😲'
};

const Journal: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/mood?limit=50');
      // Only show entries with notes
      const withNotes = res.data.filter((e: JournalEntry) => e.note && e.note.trim().length > 0);
      setEntries(withNotes);
    } catch (err) {
      console.error('Failed to fetch journal', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAddEntry = async () => {
    if (!newNote.trim()) return;
    setSubmitting(true);
    try {
      await API.post('/mood', {
        emotion: currentEmotion,
        intensity: 5,
        note: newNote.trim()
      });
      setNewNote('');
      fetchHistory(); // refresh list
    } catch (err) {
      console.error('Failed to add journal entry', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <BookOpen className="text-accent" size={28} />
          Mood Journal
        </h1>
        <p className="text-white/50 mt-1">Your private emotional diary — every logged note, collected here</p>
      </motion.div>

      {/* New Journal Entry Input */}
      <div className="max-w-3xl flex gap-3">
        <input
          type="text"
          placeholder={`How are you feeling about being ${currentEmotion}?`}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddEntry()}
          style={{ color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          className="flex-1 px-5 py-3 rounded-xl border border-white/20 placeholder-white/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
        />
        <button
          onClick={handleAddEntry}
          disabled={submitting || !newNote.trim()}
          className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          Save
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-white/30 space-y-4"
        >
          <PenLine size={60} />
          <p className="text-lg text-center">No journal entries yet.<br />Log a mood with a note to start your journal.</p>
        </motion.div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {entries.map((entry, i) => (
            <motion.div
              key={entry._id || i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-accent/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{emotionEmojis[entry.emotion] || '🧠'}</span>
                  <div>
                    <p className="text-white font-semibold">{entry.emotion}</p>
                    <p className="text-white/40 text-xs">Intensity: {entry.intensity}/10</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/30 text-xs">
                  <Calendar size={12} />
                  {new Date(entry.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <p className="text-white/70 leading-relaxed italic">"{entry.note}"</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
