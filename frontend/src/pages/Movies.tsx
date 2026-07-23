import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Film, Star, ExternalLink, Loader2, Play } from 'lucide-react';
import { API } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface Movie {
  title: string;
  genre: string;
  language: string;
  rating: string;
  poster?: string;
}

const EMOTIONS = ['Love', 'Happy', 'Sad', 'Angry', 'Calm', 'Motivated', 'Nostalgic', 'Excited'];

// Pool of high quality unique movie poster fallback images
const FALLBACK_POSTERS = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535992165812-3f84e5e56399?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
];

const getFallbackPoster = (title: string, index: number) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash += title.charCodeAt(i);
  return FALLBACK_POSTERS[(hash + index) % FALLBACK_POSTERS.length];
};

const Movies: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [selectedEmotion, setSelectedEmotion] = useState<string>(currentEmotion || 'Love');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentEmotion && !EMOTIONS.includes(selectedEmotion)) {
      setSelectedEmotion(currentEmotion);
    }
  }, [currentEmotion]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/ai/recommendations?emotion=${encodeURIComponent(selectedEmotion)}`);
        const fetched = res.data.recommendations?.movies || [];
        setMovies(fetched.map((m: any, i: number) => ({
          ...m,
          poster: m.poster || getFallbackPoster(m.title || 'Movie', i)
        })));
      } catch {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [selectedEmotion]);

  const languageColors: Record<string, string> = {
    tamil: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    hindi: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    english: 'bg-green-500/20 text-green-400 border border-green-500/30',
    telugu: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    malayalam: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  return (
    <div className="p-8 space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Film className="text-accent" size={28} />
          Movie Recommendations
        </h1>
        <p className="text-white/50 mt-1">
          Blockbuster films curated for your <span className="text-accent font-medium">{selectedEmotion}</span> mood
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

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {movies.map((movie, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-accent/40 hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              {/* Poster Image Container */}
              <div 
                className="w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-br from-accent/40 via-accent/10 to-transparent flex items-center justify-center relative overflow-hidden cursor-pointer"
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`, '_blank')}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackPoster(movie.title, i);
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Play overlay for trailer */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                   <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50">
                      <Play size={24} className="text-white ml-1 fill-white" />
                   </div>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-tight group-hover:text-accent transition-colors">{movie.title}</h3>
                </div>
              </div>

              {/* Info & Tags */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex flex-wrap gap-2">
                  {movie.genre && (
                    <span className="text-xs px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 font-medium">
                      {movie.genre}
                    </span>
                  )}
                  {movie.language && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${languageColors[movie.language.toLowerCase()] || 'bg-white/10 text-white/60'}`}>
                      {movie.language}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-sm">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span>{movie.rating}</span>
                    <span className="text-white/40 text-xs">/ 10</span>
                  </div>

                  <button
                    onClick={() => window.open(`https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}`, '_blank')}
                    className="flex items-center gap-1.5 text-xs text-accent hover:text-white transition-colors group/link cursor-pointer font-medium"
                  >
                    <span>IMDb Page</span>
                    <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
