import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Play, Heart, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API } from '../context/AuthContext';

interface Track {
  id: string;
  name: string;
  artist: string;
  genre: string;
  mood: string;
  energy: number;
}

// Mood-to-genre mapping for filtering
const MOOD_GENRE_MAP: Record<string, string[]> = {
  Happy: ['pop', 'dance', 'disco', 'funk'],
  Sad: ['blues', 'soul', 'acoustic', 'indie'],
  Angry: ['rock', 'metal', 'punk', 'grunge'],
  Calm: ['ambient', 'classical', 'jazz', 'chill'],
  Excited: ['edm', 'pop', 'dance', 'electronic'],
  Love: ['r&b', 'soul', 'pop', 'romantic'],
  Motivated: ['hip-hop', 'rap', 'rock', 'electronic'],
  Nostalgic: ['classic rock', 'oldies', 'retro', 'folk'],
  Relaxed: ['lo-fi', 'ambient', 'acoustic', 'jazz'],
  Anxious: ['ambient', 'classical', 'chill', 'lo-fi'],
};



const Music: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'mood'>('mood');

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await API.get('/ai/recommendations');
        // Map backend tracks to frontend Track interface if needed, or use them directly
        const fetchedTracks = res.data.recommendations?.music || [];
        setTracks(fetchedTracks.map((t: any, i: number) => ({
          id: String(i),
          name: t.title || t,
          artist: t.artist || 'Unknown Artist',
          genre: t.genre || 'Various',
          mood: currentEmotion,
          energy: 0.5
        })));
      } catch {
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, [currentEmotion]);

  const filteredTracks = filter === 'mood'
    ? tracks.filter((t) => t.mood === currentEmotion || (MOOD_GENRE_MAP[currentEmotion] || []).includes(t.genre))
    : tracks;

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          <Headphones className="inline mr-2 text-accent" size={28} />
          Music for Your Mood
        </h1>
        <p className="text-white/50 mt-1">
          Curated tracks that match your <span className="text-accent font-medium">{currentEmotion}</span> vibe
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('mood')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === 'mood' ? 'bg-accent text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          Mood Match
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === 'all' ? 'bg-accent text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          All Tracks
        </button>
      </div>

      {/* Tracks Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTracks.map((track, i) => (
              <motion.div
                key={track.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-accent/30 transition-all group"
              >
                {/* Album Art Placeholder */}
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-accent/30 to-accent/5 mb-4 flex items-center justify-center relative overflow-hidden">
                  <Headphones size={40} className="text-white/20" />
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/40"
                    >
                      <Play size={20} className="text-white ml-0.5" />
                    </motion.div>
                  </div>
                </div>

                {/* Track Info */}
                <h3 className="text-white font-semibold text-sm truncate">{track.name}</h3>
                <p className="text-white/50 text-xs truncate mt-0.5">{track.artist}</p>

                {/* Tags & Actions */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                      {track.mood}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                      {track.genre}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleLike(track.id)}
                    className="text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Heart size={14} className={likedIds.has(track.id) ? 'fill-red-400 text-red-400' : ''} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredTracks.length === 0 && (
        <div className="text-center py-16">
          <Headphones size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40">No tracks match your current mood. Try switching to "All Tracks".</p>
        </div>
      )}
    </div>
  );
};

export default Music;
