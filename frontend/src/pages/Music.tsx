import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Play, Heart, Loader2, Search, ExternalLink, Volume2, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API } from '../context/AuthContext';

interface Track {
  id: string;
  name: string;
  artist: string;
  genre: string;
  mood: string;
  language?: string;
  artwork: string;
  url: string;
}

const EMOTIONS = ['Love', 'Happy', 'Sad', 'Angry', 'Calm', 'Motivated', 'Nostalgic', 'Excited'];
const LANGUAGES = ['All', 'Tamil', 'English', 'Hindi', 'Telugu'];

// Helper for Unsplash photos
const usp = (id: string) => `https://images.unsplash.com/photo-${id}?w=500&auto=format&fit=crop&q=80`;

// Rich curated tracks across Tamil, English, Hindi, and Telugu
const FALLBACK_TRACKS: Record<string, Omit<Track, 'id' | 'mood'>[]> = {
  Love: [
    { name: 'Kadhaippoma',        artist: 'Sid Sriram (Oh My Kadavule)',          genre: 'Romantic',         language: 'Tamil',   artwork: usp('1518199266791-5375a83190b7'), url: '' },
    { name: 'Cruel Summer',       artist: 'Taylor Swift (Lover)',                 genre: 'Pop Romance',      language: 'English', artwork: usp('1516450360452-9312f5e86fc7'), url: '' },
    { name: 'Kesariya',           artist: 'Arijit Singh, Pritam (Brahmastra)',    genre: 'Bollywood Melody', language: 'Hindi',   artwork: usp('1529626455594-4ff0802cfb7e'), url: '' },
    { name: 'Inkem Inkem',        artist: 'Sid Sriram (Geetha Govindam)',          genre: 'Classical Romance',language: 'Telugu',  artwork: usp('1485846234645-a62644f84728'), url: '' },
    { name: 'Maruvaarthai',       artist: 'Sid Sriram (ENPT)',                    genre: 'Soulful',          language: 'Tamil',   artwork: usp('1493225457124-a3eb161ffa5f'), url: '' },
    { name: 'Until I Found You',  artist: 'Stephen Sanchez',                      genre: 'Vintage Love',     language: 'English', artwork: usp('1470225620780-dba8ba36b745'), url: '' },
    { name: 'Apna Bana Le',       artist: 'Arijit Singh, Sachin-Jigar (Bhediya)', genre: 'Soulful Hindi',    language: 'Hindi',   artwork: usp('1511379938547-c1f69419868d'), url: '' },
    { name: 'Hayyoda',            artist: 'Anirudh Ravichander (Jawan)',           genre: 'Pop Romance',      language: 'Tamil',   artwork: usp('1514525253161-7a46d19cd819'), url: '' },
    { name: 'Perfect',            artist: 'Ed Sheeran (Divide)',                  genre: 'Ballad',           language: 'English', artwork: usp('1506905925346-21bda4d32df4'), url: '' },
    { name: 'Samayama',           artist: 'Anurag Kulkarni (Hi Nanna)',           genre: 'Melody',           language: 'Telugu',  artwork: usp('1477233134080-a57e02d1c5c6'), url: '' },
    { name: 'Hosanna',            artist: 'Vijay Prakash, A.R. Rahman (VTV)',      genre: 'Romantic Classic', language: 'Tamil',   artwork: usp('1511671782779-c97d3d27a1d4'), url: '' },
    { name: 'Golden Hour',        artist: 'JVKE',                                 genre: 'Dream Pop',        language: 'English', artwork: usp('1459749411175-04bf5292ceea'), url: '' },
  ],
  Happy: [
    { name: 'Naa Ready',           artist: 'Anirudh, Vijay (Leo)',                 genre: 'High Energy Party',language: 'Tamil',   artwork: usp('1492684223066-81342ee5ff30'), url: '' },
    { name: 'Blinding Lights',     artist: 'The Weeknd (After Hours)',             genre: 'Synth Pop',        language: 'English', artwork: usp('1514525253161-7a46d19cd819'), url: '' },
    { name: 'Chaleya',             artist: 'Arijit Singh, Shilpa Rao (Jawan)',     genre: 'Dance Beat',       language: 'Hindi',   artwork: usp('1501386761578-eac5c94b800a'), url: '' },
    { name: 'Ramuloo Ramulaa',     artist: 'Anurag Kulkarni (Ala Vaikunthapurramuloo)', genre: 'Folk Party',  language: 'Telugu',  artwork: usp('1516589178581-6cd7833ae3b2'), url: '' },
    { name: 'Arabic Kuthu',        artist: 'Anirudh, Jonita Gandhi (Beast)',       genre: 'Kuthu Beats',      language: 'Tamil',   artwork: usp('1470229722913-7c0e2dbbafd3'), url: '' },
    { name: 'Levitating',          artist: 'Dua Lipa (Future Nostalgia)',          genre: 'Disco Pop',        language: 'English', artwork: usp('1516450360452-9312f5e86fc7'), url: '' },
    { name: 'Tum Tum',             artist: 'Sri Vardhini (Enemy)',                 genre: 'Wedding Dance',    language: 'Tamil',   artwork: usp('1508700115892-45ecd05ae2ad'), url: '' },
    { name: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake',               genre: 'Happy Pop',        language: 'English', artwork: usp('1545128485-c400e7702796'), url: '' },
    { name: 'Aalaporaan Tamizhan', artist: 'A.R. Rahman, Kailash Kher (Mersal)',   genre: 'Celebration',      language: 'Tamil',   artwork: usp('1526478806334-5fd488fcaabc'), url: '' },
    { name: 'Kurchi Madathapetti', artist: 'Thaman S, Mahesh Babu (Guntur Kaaram)',genre: 'Mass Dance',      language: 'Telugu',  artwork: usp('1498038432885-c6f3f1b912ee'), url: '' },
  ],
  Sad: [
    { name: 'Life of Ram',          artist: 'Pradeep Kumar (96)',                  genre: 'Solitude Melody',  language: 'Tamil',   artwork: usp('1459749411175-04bf5292ceea'), url: '' },
    { name: 'Someone Like You',     artist: 'Adele (21)',                          genre: 'Piano Soul',       language: 'English', artwork: usp('1485846234645-a62644f84728'), url: '' },
    { name: 'Channa Mereya',        artist: 'Arijit Singh (Ae Dil Hai Mushkil)',   genre: 'Heartbreak',       language: 'Hindi',   artwork: usp('1493225457124-a3eb161ffa5f'), url: '' },
    { name: 'Po Nee Po',            artist: 'Anirudh, Mohit Chauhan (3)',          genre: 'Heartbreak Classic',language: 'Tamil',  artwork: usp('1518199266791-5375a83190b7'), url: '' },
    { name: 'Glimpse of Us',        artist: 'Joji',                                genre: 'Melancholic Lo-Fi',language: 'English', artwork: usp('1477233134080-a57e02d1c5c6'), url: '' },
    { name: 'Adiga Adiga',          artist: 'Sid Sriram (Ninnu Kori)',             genre: 'Emotional Telugu', language: 'Telugu',  artwork: usp('1506905925346-21bda4d32df4'), url: '' },
    { name: 'Marakkuma Nenjam',     artist: 'A.R. Rahman (VTK)',                  genre: 'Emotional Soul',   language: 'Tamil',   artwork: usp('1493891526223-acf7fee3dbf5'), url: '' },
    { name: 'Fix You',              artist: 'Coldplay (X&Y)',                      genre: 'Healing Alternative',language: 'English',artwork: usp('1484755560615-a4c64e778a6c'), url: '' },
    { name: 'Agar Tum Saath Ho',    artist: 'Arijit Singh, Alka Yagnik (Tamasha)', genre: 'Deep Emotional',  language: 'Hindi',   artwork: usp('1511379938547-c1f69419868d'), url: '' },
    { name: 'Kanave Kanave',        artist: 'Anirudh Ravichander (David)',         genre: 'Sad Rock',         language: 'Tamil',   artwork: usp('1514525253161-7a46d19cd819'), url: '' },
  ],
  Angry: [
    { name: 'Hukum - Thalaivar',    artist: 'Anirudh Ravichander (Jailer)',        genre: 'Rage Mass',        language: 'Tamil',   artwork: usp('1508700115892-45ecd05ae2ad'), url: '' },
    { name: 'Lose Yourself',        artist: 'Eminem (8 Mile)',                     genre: 'Intense Hip-Hop',  language: 'English', artwork: usp('1509198397868-475647b2a1e5'), url: '' },
    { name: 'Badass',               artist: 'Anirudh Ravichander (Leo)',           genre: 'Heavy Bass',       language: 'Tamil',   artwork: usp('1518709268805-4e9042af9f23'), url: '' },
    { name: 'Apna Time Aayega',     artist: 'Ranveer Singh, Divine (Gully Boy)',   genre: 'Desi Rap Power',   language: 'Hindi',   artwork: usp('1534447677768-be436bb09401'), url: '' },
    { name: 'Believer',             artist: 'Imagine Dragons',                     genre: 'Alt Rock Power',   language: 'English', artwork: usp('1501386761578-eac5c94b800a'), url: '' },
    { name: 'Ordinary Person',      artist: 'Anirudh Ravichander (Leo)',           genre: 'Dark Hype',        language: 'Tamil',   artwork: usp('1516450360452-9312f5e86fc7'), url: '' },
    { name: 'Animal Title Track',   artist: 'Manan Bhardwaj (Animal)',             genre: 'Aggressive Rock',  language: 'Hindi',   artwork: usp('1517649763962-0c623266e804'), url: '' },
    { name: 'Vikram Title Track',   artist: 'Anirudh Ravichander (Vikram)',        genre: 'Action EDM',       language: 'Tamil',   artwork: usp('1545128485-c400e7702796'), url: '' },
  ],
  Calm: [
    { name: 'Visiri',               artist: 'Sid Sriram (ENPT)',                   genre: 'Gentle Breeze',    language: 'Tamil',   artwork: usp('1459749411175-04bf5292ceea'), url: '' },
    { name: 'Weightless',           artist: 'Marconi Union',                       genre: 'Ambient Therapy',  language: 'English', artwork: usp('1477233134080-a57e02d1c5c6'), url: '' },
    { name: 'Kabira',               artist: 'Tochi Raina, Rekha Bhardwaj (YJHD)',  genre: 'Sufi Folk Peace',  language: 'Hindi',   artwork: usp('1506905925346-21bda4d32df4'), url: '' },
    { name: 'Megham Karukatha',     artist: 'Dhanush, Anirudh (Thiruchitrambalam)',genre: 'Lo-Fi Chill',     language: 'Tamil',   artwork: usp('1493891526223-acf7fee3dbf5'), url: '' },
    { name: 'Sunset Lover',         artist: 'Petit Biscuit',                       genre: 'Chill Tropical',   language: 'English', artwork: usp('1511671782779-c97d3d27a1d4'), url: '' },
    { name: 'Mental Manadhil',      artist: 'A.R. Rahman, Jonita (OK Kanmani)',    genre: 'Chilled Beats',    language: 'Tamil',   artwork: usp('1484755560615-a4c64e778a6c'), url: '' },
    { name: 'Iktara',               artist: 'Kavita Seth, Amit Trivedi (Wake Up)', genre: 'Peaceful Acoustic',language: 'Hindi',   artwork: usp('1511379938547-c1f69419868d'), url: '' },
    { name: 'Vaseegara',            artist: 'Bombay Jayashri, Harris Jayaraj',    genre: 'Smooth Serenity',  language: 'Tamil',   artwork: usp('1514525253161-7a46d19cd819'), url: '' },
  ],
  Motivated: [
    { name: 'Singappenney',         artist: 'A.R. Rahman (Bigil)',                 genre: 'Power Anthem',     language: 'Tamil',   artwork: usp('1492684223066-81342ee5ff30'), url: '' },
    { name: 'Hall of Fame',         artist: 'The Script, will.i.am',               genre: 'Global Motivation',language: 'English', artwork: usp('1516450360452-9312f5e86fc7'), url: '' },
    { name: 'Zinda',                artist: 'Siddharth Mahadevan (Bhaag Milkha)',  genre: 'Adrenaline Rush',  language: 'Hindi',   artwork: usp('1534447677768-be436bb09401'), url: '' },
    { name: 'Ethir Neechal',        artist: 'Hiphop Tamizha, Anirudh',            genre: 'Hustle Anthem',    language: 'Tamil',   artwork: usp('1501386761578-eac5c94b800a'), url: '' },
    { name: 'Eye of the Tiger',     artist: 'Survivor (Rocky III)',                genre: 'Classic Hype',     language: 'English', artwork: usp('1545128485-c400e7702796'), url: '' },
    { name: 'VIP Theme',            artist: 'Anirudh Ravichander',                 genre: 'Youth Anthem',     language: 'Tamil',   artwork: usp('1470229722913-7c0e2dbbafd3'), url: '' },
    { name: 'Kar Har Maidaan Fateh',artist: 'Sukhwinder Singh, Shreya (Sanju)',    genre: 'Inspiring Ballad', language: 'Hindi',   artwork: usp('1508700115892-45ecd05ae2ad'), url: '' },
    { name: 'Kaattu Payale',        artist: 'Dhee, G.V. Prakash (Soorarai)',      genre: 'Folk Energy',      language: 'Tamil',   artwork: usp('1514525253161-7a46d19cd819'), url: '' },
  ],
  Nostalgic: [
    { name: '96 - The Life of Ram', artist: 'Govind Vasantha, Pradeep Kumar',      genre: 'Pure Nostalgia',   language: 'Tamil',   artwork: usp('1485846234645-a62644f84728'), url: '' },
    { name: 'Photograph',           artist: 'Ed Sheeran (Multiply)',               genre: 'Warm Memories',    language: 'English', artwork: usp('1493225457124-a3eb161ffa5f'), url: '' },
    { name: 'Woh Din',              artist: 'Arijit Singh (Chhichhore)',           genre: 'College Nostalgia',language: 'Hindi',   artwork: usp('1518199266791-5375a83190b7'), url: '' },
    { name: 'New York Nagaram',     artist: 'A.R. Rahman (Sillunu Oru Kaadhal)',   genre: 'Timeless Classic', language: 'Tamil',   artwork: usp('1477233134080-a57e02d1c5c6'), url: '' },
    { name: 'Night Changes',        artist: 'One Direction (FOUR)',                genre: 'Memories Pop',     language: 'English', artwork: usp('1506905925346-21bda4d32df4'), url: '' },
    { name: 'Premam Theme',         artist: 'Rajesh Murugesan',                    genre: 'Retro Nostalgia',  language: 'Malayalam',artwork: usp('1493891526223-acf7fee3dbf5'), url: '' },
    { name: 'Khoon Chala',          artist: 'Mohit Chauhan, A.R. Rahman (RDB)',    genre: 'Classic Soul',     language: 'Hindi',   artwork: usp('1484755560615-a4c64e778a6c'), url: '' },
  ],
  Excited: [
    { name: 'Arabic Kuthu',        artist: 'Anirudh Ravichander (Beast)',         genre: 'Viral Dance',      language: 'Tamil',   artwork: usp('1470229722913-7c0e2dbbafd3'), url: '' },
    { name: 'Starboy',             artist: 'The Weeknd, Daft Punk',               genre: 'Electric Hype',    language: 'English', artwork: usp('1492684223066-81342ee5ff30'), url: '' },
    { name: 'Jhoome Jo Pathaan',   artist: 'Arijit Singh, Vishal-Shekhar',        genre: 'Bollywood Hype',   language: 'Hindi',   artwork: usp('1514525253161-7a46d19cd819'), url: '' },
    { name: 'Private Party',       artist: 'Anirudh, Jonita (Don)',               genre: 'Party Anthem',     language: 'Tamil',   artwork: usp('1516450360452-9312f5e86fc7'), url: '' },
    { name: 'Uptown Funk',         artist: 'Mark Ronson ft. Bruno Mars',          genre: 'Funk Pop Groove',  language: 'English', artwork: usp('1501386761578-eac5c94b800a'), url: '' },
    { name: 'Dippam Dappam',       artist: 'Anirudh (KRK)',                       genre: 'Kuthu Pop',        language: 'Tamil',   artwork: usp('1498038432885-c6f3f1b912ee'), url: '' },
  ]
};

const Music: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [selectedEmotion, setSelectedEmotion] = useState<string>(currentEmotion || 'Happy');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [nowPlayingTrack, setNowPlayingTrack] = useState<Track | null>(null);

  useEffect(() => {
    if (currentEmotion && EMOTIONS.includes(currentEmotion)) {
      setSelectedEmotion(currentEmotion);
    }
  }, [currentEmotion]);

  const buildTracks = (rawTracks: any[]): Track[] =>
    rawTracks.map((t, i) => ({
      id: `${selectedEmotion}-${i}-${t.name || t.title}`,
      name: t.name || t.title || 'Track',
      artist: t.artist || 'Artist',
      genre: t.genre || 'Hit',
      mood: selectedEmotion,
      language: t.language || 'Tamil',
      artwork: t.artwork || usp('1511671782779-c97d3d27a1d4'),
      url: t.url || `https://music.youtube.com/search?q=${encodeURIComponent((t.name || t.title || '') + ' ' + (t.artist || ''))}`,
    }));

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/ai/recommendations?emotion=${encodeURIComponent(selectedEmotion)}`);
        const fetched = res.data.recommendations?.music || [];
        if (fetched.length > 0) {
          setTracks(buildTracks(fetched));
        } else {
          const fb = FALLBACK_TRACKS[selectedEmotion] || FALLBACK_TRACKS['Happy'];
          setTracks(buildTracks(fb));
        }
      } catch {
        const fb = FALLBACK_TRACKS[selectedEmotion] || FALLBACK_TRACKS['Happy'];
        setTracks(buildTracks(fb));
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, [selectedEmotion]);

  // Filtered tracks based on Language and Search Query
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchLanguage = selectedLanguage === 'All' || (track.language && track.language.toLowerCase() === selectedLanguage.toLowerCase());
      const query = searchQuery.trim().toLowerCase();
      const matchSearch = !query || track.name.toLowerCase().includes(query) || track.artist.toLowerCase().includes(query) || track.genre.toLowerCase().includes(query);
      return matchLanguage && matchSearch;
    });
  }, [tracks, selectedLanguage, searchQuery]);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handlePlayTrack = (track: Track) => {
    setNowPlayingTrack(track);
  };

  const openInService = (track: Track, service: 'youtube' | 'spotify') => {
    const query = encodeURIComponent(`${track.name} ${track.artist}`);
    if (service === 'youtube') {
      window.open(`https://music.youtube.com/search?q=${query}`, '_blank');
    } else {
      window.open(`https://open.spotify.com/search/${query}`, '_blank');
    }
  };

  return (
    <div className="p-8 space-y-8 pb-32 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-accent to-pink-500 text-white shadow-lg shadow-accent/20">
              <Headphones size={24} />
            </div>
            Music For Your Mood
          </h1>
          <p className="text-white/50 mt-1">
            Curated hits in Tamil, Hindi & English for your <span className="text-accent font-semibold">{selectedEmotion}</span> vibe
          </p>
        </div>

        {/* Search bar */}
        <div className="relative min-w-[260px] md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search song, artist, genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface/70 backdrop-blur-xl border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent/60 transition-all shadow-inner"
          />
        </div>
      </motion.div>

      {/* Mood Selectors */}
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

      {/* Tracks Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-accent" size={44} />
        </div>
      ) : filteredTracks.length === 0 ? (
        <div className="bg-surface/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center text-white/50 space-y-3">
          <Sparkles className="mx-auto text-accent" size={32} />
          <p className="text-lg font-medium text-white">No tracks match your current filter</p>
          <p className="text-sm">Try clearing your search query or selecting "All" languages.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredTracks.map((track, i) => {
              const isSelected = nowPlayingTrack?.id === track.id;
              return (
                <motion.div
                  key={track.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => handlePlayTrack(track)}
                  className={`bg-surface/60 backdrop-blur-xl border rounded-2xl p-4 transition-all group cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-accent shadow-xl shadow-accent/20 ring-1 ring-accent'
                      : 'border-white/10 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10'
                  }`}
                >
                  <div>
                    {/* Album Cover Art */}
                    <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-accent/30 to-accent/5 mb-4 flex items-center justify-center relative overflow-hidden shadow-md">
                      <img
                        src={track.artwork}
                        alt={track.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = usp('1511671782779-c97d3d27a1d4');
                        }}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Equalizer Wave / Playing badge if active */}
                      {isSelected && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center gap-1.5 shadow-lg shadow-accent/50 z-10">
                          <Volume2 size={12} className="animate-pulse" />
                          <span>Active</span>
                        </div>
                      )}

                      {/* Hover Play overlay */}
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] gap-2.5">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/50 text-white"
                        >
                          <Play size={22} className="ml-0.5 fill-white" />
                        </motion.div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openInService(track, 'youtube');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            YouTube
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openInService(track, 'spotify');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-green-600/90 hover:bg-green-600 text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            Spotify
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Track Info */}
                    <h3 className="text-white font-bold text-sm truncate group-hover:text-accent transition-colors">
                      {track.name}
                    </h3>
                    <p className="text-white/50 text-xs truncate mt-0.5">{track.artist}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/70 font-medium border border-white/10">
                        {track.genre}
                      </span>
                      {track.language && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold border border-accent/20">
                          {track.language}
                        </span>
                      )}
                    </div>
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
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Now Playing Action Bar */}
      <AnimatePresence>
        {nowPlayingTrack && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-72 md:right-8 bg-surface/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-2xl z-40 flex flex-col sm:flex-row items-center justify-between gap-4 ring-1 ring-white/10"
          >
            <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
              {/* Rotating Mini Album Cover */}
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border border-white/20">
                <img
                  src={nowPlayingTrack.artwork}
                  alt={nowPlayingTrack.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Soundwave */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-bold text-sm truncate">{nowPlayingTrack.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-semibold border border-accent/30">
                    {nowPlayingTrack.genre}
                  </span>
                </div>
                <p className="text-white/50 text-xs truncate">{nowPlayingTrack.artist}</p>
              </div>

              {/* Animated Soundwave EQ Bars */}
              <div className="hidden lg:flex items-end gap-1 h-6 px-3">
                {[12, 22, 16, 24, 14, 20, 10, 18].map((height, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ height: [height * 0.4, height, height * 0.3] }}
                    transition={{
                      duration: 0.8 + (idx % 3) * 0.2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                    className="w-1 bg-accent rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Launch Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => openInService(nowPlayingTrack, 'youtube')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-600/30 transition-all cursor-pointer"
              >
                <Play size={14} className="fill-white" />
                <span>YouTube Music</span>
                <ExternalLink size={12} />
              </button>
              <button
                onClick={() => openInService(nowPlayingTrack, 'spotify')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Play size={14} className="fill-white" />
                <span>Spotify</span>
                <ExternalLink size={12} />
              </button>
              <button
                onClick={() => setNowPlayingTrack(null)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Music;
