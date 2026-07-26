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
  Fear: '😨', Disgust: '🤢', Surprised: '😲', Nostalgic: '🌅',
};

// Local storage key for offline/fallback journal entries
const LOCAL_KEY = 'mv_journal_entries';

const loadLocalEntries = (): JournalEntry[] => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveLocalEntry = (entry: JournalEntry) => {
  const existing = loadLocalEntries();
  existing.unshift(entry);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(existing.slice(0, 100)));
};

const Journal: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await API.get('/mood?limit=50');
      const withNotes = (res.data as JournalEntry[]).filter((e) => e.note && e.note.trim().length > 0);
      // Merge with local entries (avoid duplicates by _id)
      const local = loadLocalEntries();
      const serverIds = new Set(withNotes.map((e) => e._id).filter(Boolean));
      const uniqueLocal = local.filter((e) => !e._id || !serverIds.has(e._id));
      setEntries([...uniqueLocal, ...withNotes]);
    } catch {
      // Offline — show local only
      setEntries(loadLocalEntries());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleAddEntry = async () => {
    if (!newNote.trim()) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    const emotion = currentEmotion || 'Neutral';
    const tempEntry: JournalEntry = {
      emotion,
      intensity: 5,
      note: newNote.trim(),
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await API.post('/mood', { emotion, intensity: 5, note: newNote.trim() });
      // Save with server _id if returned
      const saved: JournalEntry = { ...tempEntry, _id: res.data?.entry?._id };
      saveLocalEntry(saved);
      setNewNote('');
      setSuccess('Journal entry saved! ✨');
      setTimeout(() => setSuccess(''), 3000);
      fetchHistory();
    } catch {
      // API fail — save locally so nothing is lost
      saveLocalEntry(tempEntry);
      setEntries((prev) => [tempEntry, ...prev]);
      setNewNote('');
      setSuccess('Saved locally ✓ (will sync when online)');
      setTimeout(() => setSuccess(''), 4000);
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
      <div className="max-w-3xl space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder={`How are you feeling about being ${currentEmotion || 'today'}?`}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddEntry()}
            style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.08)' }}
            className="flex-1 px-5 py-3 rounded-xl border border-white/20 placeholder-white/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
          <button
            onClick={handleAddEntry}
            disabled={submitting || !newNote.trim()}
            className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Save
          </button>
        </div>
        {success && <p className="text-emerald-400 text-sm font-medium">{success}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
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
          <p className="text-lg text-center">No journal entries yet.<br />Write something above to start your journal.</p>
        </motion.div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {entries.map((entry, i) => (
            <motion.div
              key={entry._id || `local-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
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
