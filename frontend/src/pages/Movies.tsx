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

// Hardcoded curated fallback movies — always shown if API fails
const FALLBACK_MOVIES: Record<string, Movie[]> = {
  Love: [
    { title: 'Sita Ramam',               genre: 'Romance / Drama',          language: 'Tamil / Telugu', rating: '8.6', poster: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80' },
    { title: '96',                        genre: 'Romance / Nostalgia',       language: 'Tamil',          rating: '8.5', poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80' },
    { title: 'Love Today',               genre: 'Rom-Com / Drama',           language: 'Tamil',          rating: '8.2', poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80' },
    { title: 'Hi Nanna',                 genre: 'Romance / Family',          language: 'Telugu / Tamil', rating: '8.3', poster: 'https://images.unsplash.com/photo-1535992165812-3f84e5e56399?w=600&auto=format&fit=crop&q=80' },
    { title: 'Vinnaithaandi Varuvaayaa', genre: 'Romance / Musical',         language: 'Tamil',          rating: '8.1', poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80' },
    { title: 'Oh My Kadavule',           genre: 'Fantasy / Romance',         language: 'Tamil',          rating: '8.1', poster: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80' },
    { title: 'Hridayam',                 genre: 'Musical / Romance',         language: 'Malayalam',      rating: '8.1', poster: 'https://images.unsplash.com/photo-1547355253-ff0680a6a5df?w=600&auto=format&fit=crop&q=80' },
    { title: 'Raja Rani',                genre: 'Romance / Drama',           language: 'Tamil',          rating: '8.0', poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80' },
    { title: 'Joe',                      genre: 'Romance / Emotional',       language: 'Tamil',          rating: '8.1', poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80' },
    { title: 'Pyaar Prema Kaadhal',      genre: 'Rom-Com',                   language: 'Tamil',          rating: '7.8', poster: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80' },
  ],
  Happy: [
    { title: 'Leo',                   genre: 'Action / Mass',          language: 'Tamil',       rating: '8.0', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80' },
    { title: 'Jailer',               genre: 'Action / Comedy',        language: 'Tamil',       rating: '8.1', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80' },
    { title: 'Master',               genre: 'Action / Entertainment', language: 'Tamil',       rating: '7.9', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80' },
    { title: 'Don',                  genre: 'Comedy / College',       language: 'Tamil',       rating: '7.5', poster: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=600&auto=format&fit=crop&q=80' },
    { title: 'Doctor',               genre: 'Dark Comedy / Action',   language: 'Tamil',       rating: '7.9', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
    { title: 'Good Night',           genre: 'Comedy / Slice of Life', language: 'Tamil',       rating: '8.0', poster: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80' },
    { title: 'Meesaya Murukku',      genre: 'Musical / Comedy',       language: 'Tamil',       rating: '7.8', poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80' },
    { title: 'Mark Antony',          genre: 'Sci-Fi / Action Comedy', language: 'Tamil',       rating: '7.6', poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80' },
    { title: 'Boss Engira Bhaskaran',genre: 'Classic Comedy',         language: 'Tamil',       rating: '7.8', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80' },
    { title: 'Varisu',               genre: 'Family / Action',        language: 'Tamil',       rating: '7.2', poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80' },
  ],
  Sad: [
    { title: 'Chitha',           genre: 'Drama / Emotional Thriller', language: 'Tamil', rating: '8.4', poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80' },
    { title: 'Jai Bhim',        genre: 'Legal / Drama',              language: 'Tamil', rating: '8.8', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80' },
    { title: 'Gargi',           genre: 'Emotional Mystery',          language: 'Tamil', rating: '8.2', poster: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80' },
    { title: 'Pariyerum Perumal',genre: 'Social Drama',             language: 'Tamil', rating: '8.7', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80' },
    { title: 'Irugapatru',      genre: 'Relationship Drama',         language: 'Tamil', rating: '8.3', poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80' },
    { title: 'Dada',            genre: 'Parenting / Emotional',      language: 'Tamil', rating: '8.2', poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80' },
    { title: '96',              genre: 'Romance / Nostalgia',        language: 'Tamil', rating: '8.5', poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80' },
    { title: 'Asuran',          genre: 'Revenge / Drama',            language: 'Tamil', rating: '8.5', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
    { title: 'Soorarai Pottru', genre: 'Biographical Drama',         language: 'Tamil', rating: '8.7', poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80' },
    { title: 'Joe',             genre: 'Romance / Emotional',        language: 'Tamil', rating: '8.1', poster: 'https://images.unsplash.com/photo-1535992165812-3f84e5e56399?w=600&auto=format&fit=crop&q=80' },
  ],
  Angry: [
    { title: 'Vikram',           genre: 'Action / Crime Thriller',    language: 'Tamil',          rating: '8.4', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80' },
    { title: 'Kaithi',          genre: 'Action / Thriller',          language: 'Tamil',          rating: '8.5', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
    { title: 'Sarpatta Parambarai',genre: 'Sports / Action / Period',language: 'Tamil',          rating: '8.6', poster: 'https://images.unsplash.com/photo-1517649763962-0c623266e804?w=600&auto=format&fit=crop&q=80' },
    { title: 'Soorarai Pottru', genre: 'Drama / Biography',          language: 'Tamil',          rating: '8.7', poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80' },
    { title: 'KGF: Chapter 2',  genre: 'Action / Crime',             language: 'Kannada / Tamil',rating: '8.3', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80' },
    { title: 'Vettaiyan',       genre: 'Action / Investigation',     language: 'Tamil',          rating: '7.7', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80' },
    { title: 'Asuran',          genre: 'Action / Revenge Drama',     language: 'Tamil',          rating: '8.5', poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80' },
    { title: 'Jawan',           genre: 'Action / Thriller',          language: 'Hindi / Tamil',  rating: '7.8', poster: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80' },
    { title: 'Maaveeran',       genre: 'Fantasy / Action',           language: 'Tamil',          rating: '7.8', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80' },
    { title: 'Thunivu',         genre: 'Action / Heist',             language: 'Tamil',          rating: '7.3', poster: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=600&auto=format&fit=crop&q=80' },
  ],
  Calm: [
    { title: 'Thiruchitrambalam',genre: 'Slice of Life / Heartwarming',language: 'Tamil',          rating: '8.0', poster: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80' },
    { title: 'OK Kanmani',       genre: 'Romance / Chill',            language: 'Tamil',          rating: '7.4', poster: 'https://images.unsplash.com/photo-1477233134080-a57e02d1c5c6?w=600&auto=format&fit=crop&q=80' },
    { title: 'Anbe Sivam',       genre: 'Classy Feel Good',           language: 'Tamil',          rating: '8.7', poster: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80' },
    { title: 'Kadaisi Vivasayi', genre: 'Slice of Life',              language: 'Tamil',          rating: '8.7', poster: 'https://images.unsplash.com/photo-1534388151737-fc1c5b16d1f3?w=600&auto=format&fit=crop&q=80' },
    { title: 'Good Night',       genre: 'Comedy / Chill',             language: 'Tamil',          rating: '8.0', poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80' },
    { title: 'Hridayam',         genre: 'Youth Musical',              language: 'Malayalam',      rating: '8.1', poster: 'https://images.unsplash.com/photo-1547355253-ff0680a6a5df?w=600&auto=format&fit=crop&q=80' },
    { title: 'Sita Ramam',       genre: 'Classic Drama',              language: 'Telugu / Tamil', rating: '8.6', poster: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80' },
    { title: 'Hi Nanna',         genre: 'Emotional Comfort',          language: 'Telugu / Tamil', rating: '8.3', poster: 'https://images.unsplash.com/photo-1535992165812-3f84e5e56399?w=600&auto=format&fit=crop&q=80' },
    { title: 'Abhiyum Naanum',   genre: 'Family / Peaceful',          language: 'Tamil',          rating: '7.9', poster: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=600&auto=format&fit=crop&q=80' },
    { title: '96',               genre: 'Nostalgic Romance',          language: 'Tamil',          rating: '8.5', poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80' },
  ],
  Motivated: [
    { title: 'Soorarai Pottru', genre: 'Biographical / Inspirational', language: 'Tamil',          rating: '8.7', poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80' },
    { title: 'Sarpatta Parambarai',genre: 'Sports / Inspirational',   language: 'Tamil',          rating: '8.6', poster: 'https://images.unsplash.com/photo-1517649763962-0c623266e804?w=600&auto=format&fit=crop&q=80' },
    { title: 'Vikram',           genre: 'Action / Thriller',           language: 'Tamil',          rating: '8.4', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80' },
    { title: 'Jai Bhim',        genre: 'Legal / Motivational',        language: 'Tamil',          rating: '8.8', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80' },
    { title: 'Kaithi',          genre: 'Action / Relentless',         language: 'Tamil',          rating: '8.5', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
    { title: 'Leo',             genre: 'Action / Mass',               language: 'Tamil',          rating: '8.0', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80' },
    { title: 'KGF: Chapter 2',  genre: 'Action / Epic',               language: 'Kannada / Tamil',rating: '8.3', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80' },
    { title: 'Asuran',          genre: 'Revenge / Determination',     language: 'Tamil',          rating: '8.5', poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80' },
    { title: 'Jailer',          genre: 'Action / Legend',             language: 'Tamil',          rating: '8.1', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80' },
    { title: 'Maaveeran',       genre: 'Fantasy / Hero Journey',      language: 'Tamil',          rating: '7.8', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80' },
  ],
  Nostalgic: [
    { title: '96',               genre: 'Nostalgia / Romance',    language: 'Tamil', rating: '8.5', poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80' },
    { title: 'Anbe Sivam',      genre: 'Classic / Friendship',   language: 'Tamil', rating: '8.7', poster: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80' },
    { title: 'Kaadhal',         genre: 'Classic Romance',        language: 'Tamil', rating: '8.3', poster: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80' },
    { title: 'Vinnaithaandi Varuvaayaa',genre: 'Musical Romance',language: 'Tamil', rating: '8.1', poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80' },
    { title: 'OK Kanmani',      genre: 'Modern Classic',         language: 'Tamil', rating: '7.4', poster: 'https://images.unsplash.com/photo-1477233134080-a57e02d1c5c6?w=600&auto=format&fit=crop&q=80' },
    { title: 'Abhiyum Naanum',  genre: 'Family / Warmth',        language: 'Tamil', rating: '7.9', poster: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=600&auto=format&fit=crop&q=80' },
    { title: 'Premam',          genre: 'Nostalgic Romance',      language: 'Malayalam', rating: '8.3', poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80' },
    { title: 'Thiruchitrambalam',genre: 'Slice of Life',         language: 'Tamil', rating: '8.0', poster: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80' },
    { title: 'Dada',            genre: 'Parenting / Warmth',     language: 'Tamil', rating: '8.2', poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80' },
    { title: 'Hridayam',        genre: 'Youth / Memory',         language: 'Malayalam', rating: '8.1', poster: 'https://images.unsplash.com/photo-1547355253-ff0680a6a5df?w=600&auto=format&fit=crop&q=80' },
  ],
  Excited: [
    { title: 'Leo',     genre: 'Mass Action',         language: 'Tamil',          rating: '8.0', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80' },
    { title: 'Vikram',  genre: 'Action / Thriller',   language: 'Tamil',          rating: '8.4', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80' },
    { title: 'Beast',   genre: 'Action / High Energy',language: 'Tamil',          rating: '7.4', poster: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop&q=80' },
    { title: 'Jailer',  genre: 'Action Celebration',  language: 'Tamil',          rating: '8.1', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80' },
    { title: 'Jawan',   genre: 'Action / Thriller',   language: 'Hindi / Tamil',  rating: '7.8', poster: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80' },
    { title: 'KGF: Chapter 2',genre: 'Epic Action',  language: 'Kannada / Tamil',rating: '8.3', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80' },
    { title: 'Master',  genre: 'High Octane Action',  language: 'Tamil',          rating: '7.9', poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80' },
    { title: 'Don',     genre: 'Thrilling College',   language: 'Tamil',          rating: '7.5', poster: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80' },
    { title: 'Vettaiyan',genre: 'Investigation Thrill',language: 'Tamil',         rating: '7.7', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80' },
    { title: 'Kaithi',  genre: 'Relentless Thriller', language: 'Tamil',          rating: '8.5', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
  ],
};

const Movies: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [selectedEmotion, setSelectedEmotion] = useState<string>(currentEmotion || 'Happy');
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
            poster: m.poster || fallback[i % fallback.length]?.poster || '',
          })));
        } else {
          setMovies(FALLBACK_MOVIES[selectedEmotion] || FALLBACK_MOVIES['Happy']);
        }
      } catch {
        // API unreachable — show rich curated fallback
        setMovies(FALLBACK_MOVIES[selectedEmotion] || FALLBACK_MOVIES['Happy']);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [selectedEmotion]);

  const languageColors: Record<string, string> = {
    tamil:     'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    hindi:     'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    english:   'bg-green-500/20 text-green-400 border border-green-500/30',
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
              {/* Poster */}
              <div
                className="w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-br from-accent/40 via-accent/10 to-transparent flex items-center justify-center relative overflow-hidden cursor-pointer"
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`, '_blank')}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                   <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50">
                      <Play size={24} className="text-white ml-1 fill-white" />
                   </div>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-tight group-hover:text-accent transition-colors">{movie.title}</h3>
                </div>
              </div>

              {/* Info */}
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
