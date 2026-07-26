import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { API } from '../context/AuthContext';
import type { EmotionName } from '../utils/emotions';

const EMOTIONS: EmotionName[] = [
  'Happy', 'Sad', 'Angry', 'Fear', 'Love', 'Excited',
  'Calm', 'Lonely', 'Confident', 'Hopeful', 'Motivated',
  'Nostalgic', 'Anxious', 'Relaxed', 'Bored', 'Frustrated',
  'Overwhelmed', 'Grateful', 'Jealous', 'Insecure', 'Proud',
  'Inspired', 'Confused', 'Surprised', 'Stressed', 'Peaceful',
  'Optimistic', 'Pessimistic', 'Curious', 'Neutral',
];

const EMOTION_EMOJI: Record<string, string> = {
  Happy: '😊', Sad: '😢', Angry: '😠', Fear: '😨', Love: '❤️',
  Excited: '🤩', Calm: '😌', Lonely: '😔', Confident: '💪', Hopeful: '🌟',
  Motivated: '🔥', Nostalgic: '🌅', Anxious: '😰', Relaxed: '😎', Bored: '😑',
  Frustrated: '😤', Overwhelmed: '🌊', Grateful: '🙏', Jealous: '💚', Insecure: '😟',
  Proud: '🦁', Inspired: '✨', Confused: '🤔', Surprised: '😲', Stressed: '😓',
  Peaceful: '🕊️', Optimistic: '☀️', Pessimistic: '🌧️', Curious: '🧐', Neutral: '😐',
};

interface MoodInputProps {
  onMoodLogged?: () => void;
}

const MoodInput: React.FC<MoodInputProps> = ({ onMoodLogged }) => {
  const { setEmotion } = useTheme();
  const broadcastMood = useSocket()?.broadcastMood || (() => {});
  const [selected, setSelected] = useState<EmotionName | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSelect = (emotion: EmotionName) => {
    setSelected(emotion);
    setEmotion(emotion);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    
    // Always save to local storage immediately so it shows on the chart even if offline
    const tempEntry = { emotion: selected, intensity, note, createdAt: new Date().toISOString() };
    const local = JSON.parse(localStorage.getItem('mv_offline_moods') || '[]');
    local.push(tempEntry);
    localStorage.setItem('mv_offline_moods', JSON.stringify(local));

    try {
      await API.post('/mood', { emotion: selected, intensity, note });
    } catch (e) {
      // silently fail — backend not running in demo or sleeping, local storage covers it
    } finally {
      broadcastMood(selected, intensity);
      setSuccess(true);
      setNote('');
      setTimeout(() => {
        setSuccess(false);
        onMoodLogged?.();
      }, 1500);
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">How are you feeling right now?</h2>

      {/* Emotion Grid */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        {EMOTIONS.map((em) => (
          <motion.button
            key={em}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleSelect(em)}
            title={em}
            className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xl transition-all border ${
              selected === em
                ? 'bg-accent/30 border-accent scale-105 shadow-lg shadow-accent/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span>{EMOTION_EMOJI[em] || '🙂'}</span>
            <span className="text-[9px] text-white/60 mt-0.5 leading-none">{em}</span>
          </motion.button>
        ))}
      </div>

      {/* Intensity Slider */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div>
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Intensity</span>
                <span className="text-accent font-semibold">{intensity}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Add a note… (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none transition-all"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading || success}
              onClick={handleSubmit}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                success
                  ? 'bg-green-500/80'
                  : loading
                  ? 'bg-accent/40 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20'
              }`}
            >
              {success ? '✓ Mood Logged!' : loading ? 'Logging…' : `Log: ${EMOTION_EMOJI[selected]} ${selected}`}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodInput;
