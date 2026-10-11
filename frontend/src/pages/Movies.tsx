import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Film, Star, ExternalLink, Loader2, Play, Search, Sparkles } from 'lucide-react';
import { API } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface Movie {
  title: string;
  genre: string;
  language: string;
  rating: string;
  year?: string;
  streamOn?: string;
  poster?: string;
}

const EMOTIONS = ['Love', 'Happy', 'Sad', 'Angry', 'Calm', 'Motivated', 'Nostalgic', 'Excited'];
const LANGUAGES = ['All', 'Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam'];

// Helper for Unsplash photos
const usp = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&auto=format&fit=crop&q=80`;

// Hardcoded curated fallback movies across languages
const FALLBACK_MOVIES: Record<string, Movie[]> = {
  Love: [
    { title: 'Sita Ramam',               genre: 'Romance / Drama',          language: 'Tamil / Telugu', rating: '8.6', year: '2022', streamOn: 'Prime',   poster: usp('1518199266791-5375a83190b7') },
    { title: 'La La Land',                genre: 'Musical / Romance',        language: 'English',        rating: '8.0', year: '2016', streamOn: 'Netflix', poster: usp('1516450360452-9312f5e86fc7') },
    { title: 'Yeh Jawaani Hai Deewani',   genre: 'Rom-Com / Coming of Age',  language: 'Hindi',          rating: '7.3', year: '2013', streamOn: 'Netflix', poster: usp('1529626455594-4ff0802cfb7e') },
    { title: '96',                        genre: 'Romance / Nostalgia',       language: 'Tamil',          rating: '8.5', year: '2018', streamOn: 'Hotstar', poster: usp('1485846234645-a62644f84728') },
    { title: 'Hi Nanna',                 genre: 'Romance / Emotional',       language: 'Telugu',         rating: '8.3', year: '2023', streamOn: 'Netflix', poster: usp('1535992165812-3f84e5e56399') },
    { title: 'About Time',                genre: 'Sci-Fi / Romance',         language: 'English',        rating: '7.8', year: '2013', streamOn: 'Prime',   poster: usp('1506905925346-21bda4d32df4') },
    { title: 'Jab We Met',                genre: 'Classic Rom-Com',          language: 'Hindi',          rating: '7.9', year: '2007', streamOn: 'Netflix', poster: usp('1470225620780-dba8ba36b745') },
    { title: 'Vinnaithaandi Varuvaayaa', genre: 'Romance / Musical',         language: 'Tamil',          rating: '8.1', year: '2010', streamOn: 'Hotstar', poster: usp('1514525253161-7a46d19cd819') },
    { title: 'Hridayam',                 genre: 'Musical / Romance',         language: 'Malayalam',      rating: '8.1', year: '2022', streamOn: 'Hotstar', poster: usp('1547355253-ff0680a6a5df') },
    { title: 'Love Today',               genre: 'Rom-Com / Comedy',          language: 'Tamil',          rating: '8.2', year: '2022', streamOn: 'Netflix', poster: usp('1511379938547-c1f69419868d') },
  ],
  Happy: [
    { title: 'Leo',                   genre: 'Action / Mass',          language: 'Tamil',       rating: '8.0', year: '2023', streamOn: 'Netflix', poster: usp('1534447677768-be436bb09401') },
    { title: 'Paddington 2',         genre: 'Family / Heartwarming',  language: 'English',     rating: '7.8', year: '2017', streamOn: 'Prime',   poster: usp('1579783902614-a3fb3927b675') },
    { title: '3 Idiots',             genre: 'Comedy / Life Drama',    language: 'Hindi',       rating: '8.4', year: '2009', streamOn: 'Prime',   poster: usp('1509198397868-475647b2a1e5') },
    { title: 'Jailer',               genre: 'Action / Entertainment', language: 'Tamil',       rating: '8.1', year: '2023', streamOn: 'Prime',   poster: usp('1526478806334-5fd488fcaabc') },
    { title: 'The Hangover',         genre: 'Comedy Riot',            language: 'English',     rating: '7.7', year: '2009', streamOn: 'Netflix', poster: usp('1518709268805-4e9042af9f23') },
    { title: 'Good Night',           genre: 'Feel Good Slice of Life',language: 'Tamil',       rating: '8.0', year: '2023', streamOn: 'Hotstar', poster: usp('1626785774573-4b799315345d') },
    { title: 'Doctor',               genre: 'Dark Comedy / Action',   language: 'Tamil',       rating: '7.9', year: '2021', streamOn: 'Netflix', poster: usp('1511671782779-c97d3d27a1d4') },
    { title: 'Zindagi Na Milegi Dobara', genre: 'Adventure / Comedy', language: 'Hindi',       rating: '8.2', year: '2011', streamOn: 'Netflix', poster: usp('1489599849927-2ee91cede3ba') },
    { title: 'Jathi Ratnalu',        genre: 'Laugh-Out-Loud Comedy',  language: 'Telugu',      rating: '7.4', year: '2021', streamOn: 'Prime',   poster: usp('1607604276583-eef5d076aa5f') },
  ],
  Sad: [
    { title: 'Interstellar',         genre: 'Sci-Fi / Emotional',     language: 'English',     rating: '8.7', year: '2014', streamOn: 'Prime',   poster: usp('1506905925346-21bda4d32df4') },
    { title: 'Chitha',               genre: 'Drama / Hard-Hitting',   language: 'Tamil',       rating: '8.4', year: '2023', streamOn: 'Hotstar', poster: usp('1485846234645-a62644f84728') },
    { title: 'The Pursuit of Happyness', genre: 'Biography / Drama',   language: 'English',     rating: '8.0', year: '2006', streamOn: 'Netflix', poster: usp('1534447677768-be436bb09401') },
    { title: 'Jai Bhim',            genre: 'Legal / Human Rights',   language: 'Tamil',       rating: '8.8', year: '2021', streamOn: 'Prime',   poster: usp('1518199266791-5375a83190b7') },
    { title: 'Taare Zameen Par',     genre: 'Emotional / Family',     language: 'Hindi',       rating: '8.4', year: '2007', streamOn: 'Netflix', poster: usp('1489599849927-2ee91cede3ba') },
    { title: 'Dada',                genre: 'Parenting / Emotional',  language: 'Tamil',       rating: '8.2', year: '2023', streamOn: 'Prime',   poster: usp('1470225620780-dba8ba36b745') },
    { title: 'Manchester by the Sea',genre: 'Grief / Deep Drama',     language: 'English',     rating: '7.8', year: '2016', streamOn: 'Prime',   poster: usp('1493225457124-a3eb161ffa5f') },
    { title: 'Gargi',               genre: 'Intense Drama',          language: 'Tamil',       rating: '8.2', year: '2022', streamOn: 'SonyLIV', poster: usp('1514525253161-7a46d19cd819') },
  ],
  Angry: [
    { title: 'The Dark Knight',      genre: 'Action / Crime Epic',    language: 'English',     rating: '9.0', year: '2008', streamOn: 'Prime',   poster: usp('1509198397868-475647b2a1e5') },
    { title: 'Vikram',               genre: 'Action / Crime Thriller',language: 'Tamil',       rating: '8.4', year: '2022', streamOn: 'Hotstar', poster: usp('1518709268805-4e9042af9f23') },
    { title: 'Gladiator',            genre: 'Historical Action',      language: 'English',     rating: '8.5', year: '2000', streamOn: 'Netflix', poster: usp('1517649763962-0c623266e804') },
    { title: 'Sarpatta Parambarai',  genre: 'Boxing / Rebellion',     language: 'Tamil',       rating: '8.6', year: '2021', streamOn: 'Prime',   poster: usp('1508700115892-45ecd05ae2ad') },
    { title: 'Gangs of Wasseypur',   genre: 'Crime / Vengeance',      language: 'Hindi',       rating: '8.2', year: '2012', streamOn: 'Netflix', poster: usp('1579783902614-a3fb3927b675') },
    { title: 'Kaithi',              genre: 'Relentless Thriller',    language: 'Tamil',       rating: '8.5', year: '2019', streamOn: 'Hotstar', poster: usp('1529626455594-4ff0802cfb7e') },
    { title: 'Fight Club',           genre: 'Psychological Action',   language: 'English',     rating: '8.8', year: '1999', streamOn: 'Prime',   poster: usp('1534447677768-be436bb09401') },
  ],
  Calm: [
    { title: 'Spirited Away',        genre: 'Animation / Wonder',     language: 'English / Japanese', rating: '8.6', year: '2001', streamOn: 'Netflix', poster: usp('1626785774573-4b799315345d') },
    { title: 'Thiruchitrambalam',    genre: 'Slice of Life / Warmth', language: 'Tamil',       rating: '8.0', year: '2022', streamOn: 'SunNXT',  poster: usp('1477233134080-a57e02d1c5c6') },
    { title: 'Amélie',               genre: 'Whimsical Comfort',      language: 'English / French', rating: '8.3', year: '2001', streamOn: 'Prime', poster: usp('1511379938547-c1f69419868d') },
    { title: 'Kadaisi Vivasayi',     genre: 'Peaceful Rural Life',    language: 'Tamil',       rating: '8.7', year: '2022', streamOn: 'SonyLIV', poster: usp('1534388151737-fc1c5b16d1f3') },
    { title: 'The Secret Life of Walter Mitty', genre: 'Adventure / Serenity', language: 'English', rating: '7.3', year: '2013', streamOn: 'Hotstar', poster: usp('1514525253161-7a46d19cd819') },
    { title: 'OK Kanmani',           genre: 'Romantic Breeze',        language: 'Tamil',       rating: '7.4', year: '2015', streamOn: 'Hotstar', poster: usp('1518199266791-5375a83190b7') },
  ],
  Motivated: [
    { title: 'Soorarai Pottru',     genre: 'Inspirational / Triumph',language: 'Tamil',       rating: '8.7', year: '2020', streamOn: 'Prime',   poster: usp('1508700115892-45ecd05ae2ad') },
    { title: 'Whiplash',            genre: 'Ambition / Relentless',  language: 'English',     rating: '8.5', year: '2014', streamOn: 'Netflix', poster: usp('1517649763962-0c623266e804') },
    { title: 'Dangal',              genre: 'Sports / Determination', language: 'Hindi',       rating: '8.3', year: '2016', streamOn: 'Netflix', poster: usp('1509198397868-475647b2a1e5') },
    { title: 'Jersey',              genre: 'Cricket / Second Chances',language: 'Telugu',      rating: '8.5', year: '2019', streamOn: 'Hotstar', poster: usp('1534447677768-be436bb09401') },
    { title: 'The Social Network',  genre: 'Hustle / Drama',         language: 'English',     rating: '7.8', year: '2010', streamOn: 'Netflix', poster: usp('1518709268805-4e9042af9f23') },
    { title: 'Guru',                genre: 'Business Legend',        language: 'Tamil / Hindi',rating: '7.7', year: '2007', streamOn: 'Netflix', poster: usp('1529626455594-4ff0802cfb7e') },
  ],
  Nostalgic: [
    { title: '96',                   genre: 'High School Memories',   language: 'Tamil',       rating: '8.5', year: '2018', streamOn: 'Hotstar', poster: usp('1485846234645-a62644f84728') },
    { title: 'Cinema Paradiso',      genre: 'Classic Nostalgia',      language: 'English',     rating: '8.5', year: '1988', streamOn: 'Prime',   poster: usp('1493225457124-a3eb161ffa5f') },
    { title: 'Premam',              genre: 'Three Chapters of Youth',language: 'Malayalam',   rating: '8.3', year: '2015', streamOn: 'Hotstar', poster: usp('1511379938547-c1f69419868d') },
    { title: 'Rockford',             genre: 'Boarding School Days',   language: 'Hindi',       rating: '7.8', year: '1999', streamOn: 'YouTube', poster: usp('1477233134080-a57e02d1c5c6') },
    { title: 'Stand by Me',          genre: 'Childhood Friendship',   language: 'English',     rating: '8.1', year: '1986', streamOn: 'Netflix', poster: usp('1458560871784-56d23406c091') },
  ],
  Excited: [
    { title: 'Spider-Man: Across the Spider-Verse', genre: 'Multiverse Action', language: 'English', rating: '8.6', year: '2023', streamOn: 'Netflix', poster: usp('1534447677768-be436bb09401') },
    { title: 'RRR',                 genre: 'Epic Spectacle',         language: 'Telugu / Tamil', rating: '7.8', year: '2022', streamOn: 'Netflix', poster: usp('1508700115892-45ecd05ae2ad') },
    { title: 'Top Gun: Maverick',   genre: 'High Flying Thrills',    language: 'English',     rating: '8.2', year: '2022', streamOn: 'Prime',   poster: usp('1509198397868-475647b2a1e5') },
    { title: 'Jawan',               genre: 'Mass Action Thriller',   language: 'Hindi / Tamil', rating: '7.0', year: '2023', streamOn: 'Netflix', poster: usp('1529626455594-4ff0802cfb7e') },
    { title: 'KGF: Chapter 2',      genre: 'Power Action Riot',      language: 'Kannada / Tamil', rating: '8.3', year: '2022', streamOn: 'Prime', poster: usp('1579783902614-a3fb3927b675') },
  ]
};

const Movies: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [selectedEmotion, setSelectedEmotion] = useState<string>(currentEmotion || 'Happy');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentEmotion && EMOTIONS.includes(currentEmotion)) {
      setSelectedEmotion(currentEmotion);
    }
  }, [currentEmotion]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/ai/recommendations?emotion=${encodeURIComponent(selectedEmotion)}`);
        const fetched = res.data.recommendations?.movies || [];
        if (fetched.length > 0) {
          const fallback = FALLBACK_MOVIES[selectedEmotion] || FALLBACK_MOVIES['Happy'];
          setMovies(fetched.map((m: any, i: number) => ({
            ...m,
            poster: m.poster || fallback[i % fallback.length]?.poster || usp('1485846234645-a62644f84728'),
            year: m.year || '2023',
            streamOn: m.streamOn || 'Popular OTT',
          })));
        } else {
          setMovies(FALLBACK_MOVIES[selectedEmotion] || FALLBACK_MOVIES['Happy']);
        }
      } catch {
        setMovies(FALLBACK_MOVIES[selectedEmotion] || FALLBACK_MOVIES['Happy']);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [selectedEmotion]);

  // Filter movies based on language and search query
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchLanguage = selectedLanguage === 'All' || movie.language.toLowerCase().includes(selectedLanguage.toLowerCase());
      const query = searchQuery.trim().toLowerCase();
      const matchSearch = !query || movie.title.toLowerCase().includes(query) || movie.genre.toLowerCase().includes(query);
      return matchLanguage && matchSearch;
    });
  }, [movies, selectedLanguage, searchQuery]);

  const languageColors: Record<string, string> = {
    tamil:     'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    hindi:     'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    english:   'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    telugu:    'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    malayalam: 'bg-red-500/20 text-red-400 border border-red-500/30',
    kannada:   'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  };

  const getLangColor = (lang: string) => {
    const lower = lang.toLowerCase();
    for (const key of Object.keys(languageColors)) {
      if (lower.includes(key)) return languageColors[key];
    }
    return 'bg-white/10 text-white/60';
  };

  const watchTrailer = (title: string) => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' official trailer')}`, '_blank');
  };

  return (
    <div className="p-8 space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-accent to-indigo-600 text-white shadow-lg shadow-accent/20">
              <Film size={24} />
            </div>
            Movie Recommendations
          </h1>
          <p className="text-white/50 mt-1">
            Top films in Tamil, Hollywood & Bollywood tailored for your <span className="text-accent font-semibold">{selectedEmotion}</span> mood
          </p>
        </div>

        {/* Search bar */}
        <div className="relative min-w-[260px] md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search movie, genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface/70 backdrop-blur-xl border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent/60 transition-all shadow-inner"
          />
        </div>
      </motion.div>

      {/* Mood Selector Pills */}
      <div className="space-y-3">
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

        {/* Language Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider mr-2">Language:</span>
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedLanguage === lang
                  ? 'bg-white/20 text-white font-semibold border border-white/30 shadow-sm'
                  : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Movies */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-accent" size={44} />
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="bg-surface/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center text-white/50 space-y-3">
          <Sparkles className="mx-auto text-accent" size={32} />
          <p className="text-lg font-medium text-white">No movies match your filters</p>
          <p className="text-sm">Try searching for a different keyword or select "All" languages.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie, i) => (
              <motion.div
                key={`${movie.title}-${i}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10 transition-all group flex flex-col justify-between"
              >
                {/* Poster */}
                <div
                  className="w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-br from-accent/40 via-accent/10 to-transparent flex items-center justify-center relative overflow-hidden cursor-pointer"
                  onClick={() => watchTrailer(movie.title)}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = usp('1485846234645-a62644f84728');
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                  {/* Top tags: Year & Streaming service */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    {movie.year && (
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white/80 text-[11px] font-semibold border border-white/10">
                        {movie.year}
                      </span>
                    )}
                    {movie.streamOn && (
                      <span className="px-2.5 py-1 rounded-lg bg-accent/80 backdrop-blur-md text-white text-[11px] font-bold shadow-md shadow-accent/40">
                        {movie.streamOn}
                      </span>
                    )}
                  </div>

                  {/* Hover Play Trailer Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px] gap-2">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-600/50 text-white"
                    >
                      <Play size={24} className="ml-1 fill-white" />
                    </motion.div>
                    <span className="text-xs font-semibold text-white tracking-wide">Watch Trailer</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-accent transition-colors">
                      {movie.title}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex flex-wrap gap-2">
                    {movie.genre && (
                      <span className="text-xs px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 font-medium">
                        {movie.genre}
                      </span>
                    )}
                    {movie.language && (
                      <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getLangColor(movie.language)}`}>
                        {movie.language}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-sm">
                      <Star size={16} className="fill-amber-400 text-amber-400" />
                      <span>{movie.rating}</span>
                      <span className="text-white/40 text-xs">/ 10</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => watchTrailer(movie.title)}
                        className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white font-semibold transition-colors cursor-pointer"
                      >
                        <Play size={12} className="fill-white" />
                        <span>Trailer</span>
                      </button>
                      <button
                        onClick={() => window.open(`https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}`, '_blank')}
                        className="flex items-center gap-1 text-xs text-accent hover:text-white transition-colors group/link cursor-pointer font-medium"
                      >
                        <span>IMDb</span>
                        <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Movies;
