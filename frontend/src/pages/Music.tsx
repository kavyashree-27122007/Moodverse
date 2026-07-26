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
  artwork: string;
  url: string;
}

const EMOTIONS = ['Love', 'Happy', 'Sad', 'Angry', 'Calm', 'Motivated', 'Nostalgic', 'Excited'];

// Pool of high quality unique music covers
const FALLBACK_ARTWORKS = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop&q=80'
];

const getFallbackArtwork = (title: string, index: number) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash += title.charCodeAt(i);
  return FALLBACK_ARTWORKS[(hash + index) % FALLBACK_ARTWORKS.length];
};

const Music: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [selectedEmotion, setSelectedEmotion] = useState<string>(currentEmotion || 'Love');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentEmotion && !EMOTIONS.includes(selectedEmotion)) {
      setSelectedEmotion(currentEmotion);
    }
  }, [currentEmotion]);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/ai/recommendations?emotion=${encodeURIComponent(selectedEmotion)}`);
        const fetchedTracks = res.data.recommendations?.music || [];
        
        setTracks(fetchedTracks.map((t: any, i: number) => ({
          id: String(i) + '-' + t.title,
          name: t.title || 'Track',
          artist: t.artist || 'Artist',
          genre: t.genre || 'Hit',
          mood: selectedEmotion,
          artwork: t.artwork || getFallbackArtwork(t.title || 'Track', i),
          url: t.url || `https://open.spotify.com/search/${encodeURIComponent((t.title || '') + ' ' + (t.artist || ''))}`
        })));
      } catch {
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [selectedEmotion]);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="p-8 space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Headphones className="text-accent" size={28} />
          Music for Your Mood
        </h1>
        <p className="text-white/50 mt-1">
          Curated modern tracks matched specifically for your <span className="text-accent font-medium">{selectedEmotion}</span> vibe
        </p>
      </motion.div>

      {/* Emotion Selector Pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {EMOTIONS.map((emo) => (
          <button
            key={emo}
            onClick={() => setSelectedEmotion(emo)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              selectedEmotion === emo
                ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                : 'bg-surface/80 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {emo}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {tracks.map((track, i) => (
              <motion.div
                key={track.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => window.open(track.url, '_blank')}
                className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Album Cover Art */}
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-accent/30 to-accent/5 mb-4 flex items-center justify-center relative overflow-hidden shadow-md">
                    <img
                      src={track.artwork}
                      alt={track.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getFallbackArtwork(track.name, i);
                      }}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Hover Play overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        className="w-13 h-13 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/50 text-white"
                      >
                        <Play size={22} className="ml-0.5 fill-white" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Track Info */}
                  <h3 className="text-white font-bold text-sm truncate group-hover:text-accent transition-colors">{track.name}</h3>
                  <p className="text-white/50 text-xs truncate mt-0.5">{track.artist}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/70 font-medium border border-white/10">
                    {track.genre}
                  </span>
                  <button
                    onClick={(e) => toggleLike(e, track.id)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-pink-500 transition-colors"
                  >
                    <Heart
                      size={16}
                      className={likedIds.has(track.id) ? 'fill-pink-500 text-pink-500' : ''}
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Music;
