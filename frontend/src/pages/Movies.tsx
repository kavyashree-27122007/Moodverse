import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Film, Star, ExternalLink, Loader2 } from 'lucide-react';
import { API } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface Movie {
  title: string;
  genre: string;
  language: string;
  rating: string;
}

const Movies: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await API.get('/ai/recommendations');
        setMovies(res.data.recommendations?.movies || []);
      } catch {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const languageColors: Record<string, string> = {
    tamil: 'bg-orange-500/20 text-orange-400',
    hindi: 'bg-blue-500/20 text-blue-400',
    english: 'bg-green-500/20 text-green-400',
    telugu: 'bg-purple-500/20 text-purple-400',
    malayalam: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="p-8 space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Film className="text-accent" size={28} />
          Movie Recommendations
        </h1>
        <p className="text-white/50 mt-1">
          Films curated for your current <span className="text-accent font-medium">{currentEmotion}</span> mood
        </p>
      </motion.div>

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
              transition={{ delay: i * 0.07 }}
              className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-accent/30 transition-all group"
            >
              {/* Poster placeholder */}
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-accent/40 via-accent/10 to-transparent flex items-center justify-center relative overflow-hidden">
                <Film size={60} className="text-white/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-tight">{movie.title}</h3>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {movie.genre && (
                    <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">
                      {movie.genre}
                    </span>
                  )}
                  {movie.language && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${languageColors[movie.language.toLowerCase()] || 'bg-white/10 text-white/60'}`}>
                      {movie.language}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  {movie.rating && movie.rating !== '-' ? (
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-semibold text-sm">{movie.rating}</span>
                      <span className="text-white/30 text-xs">/ 10</span>
                    </div>
                  ) : (
                    <span className="text-white/30 text-xs">Rating unavailable</span>
                  )}
                  <a
                    href={`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-white/40 hover:text-accent transition-colors group-hover:text-accent"
                  >
                    <ExternalLink size={12} />
                    IMDb
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <Film size={60} className="mb-4" />
          <p className="text-lg">No recommendations yet. Log a mood first!</p>
        </div>
      )}
    </div>
  );
};

export default Movies;
