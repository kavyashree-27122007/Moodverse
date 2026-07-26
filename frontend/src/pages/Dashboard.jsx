import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Send, Film, Music, Users, LogOut, Flame, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [moodText, setMoodText] = useState('');
  const [mood, setMood] = useState(null);
  const [recommendations, setRecommendations] = useState({
    reason: "Trending this week in the MoodVerse",
    movies: [
      { title: 'The Grand Budapest Hotel', genre: 'Comedy', rating: '8.1', poster: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg' },
      { title: 'Leo', genre: 'Action/Thriller', rating: '7.8', poster: 'https://image.tmdb.org/t/p/w500/pD6sL4vwnI4kOUl4uTAyBqB1c8m.jpg' },
      { title: 'The Hangover', genre: 'Comedy', rating: '7.7', poster: 'https://image.tmdb.org/t/p/w500/jjCU4XkP2LTLz8zUuXUuR1kGgO3.jpg' },
      { title: 'Panchatanthiram', genre: 'Comedy', rating: '8.4', poster: 'https://image.tmdb.org/t/p/w500/bA4U4k284o33R7CifB9rY5u7g4i.jpg' }
    ],
    songs: [
      { title: 'Aalaporan Thamizhan', artist: 'A.R. Rahman', youtubeId: 'x1jP_Gg-RQA' },
      { title: 'Happy', artist: 'Pharrell Williams', youtubeId: 'ZbZSe6N_BXs' },
      { title: 'Idhu Varai', artist: 'Yuvan Shankar Raja', youtubeId: 'v8Jq3H1k-K8' },
      { title: 'Walking on Sunshine', artist: 'Katrina & The Waves', youtubeId: 'iPUmE-tne5U' }
    ]
  });
  const [socket, setSocket] = useState(null);
  const [friendsMoods, setFriendsMoods] = useState([]);
  const [playingSong, setPlayingSong] = useState(null);
  const [watchParty, setWatchParty] = useState(false);
  const [copied, setCopied] = useState(false);
  const [streak, setStreak] = useState(12);
  const [moodHistory, setMoodHistory] = useState([
    { day: 'Mon', score: 70, emotion: 'Happy' },
    { day: 'Tue', score: 40, emotion: 'Sad' },
    { day: 'Wed', score: 60, emotion: 'Neutral' },
    { day: 'Thu', score: 85, emotion: 'Happy' },
    { day: 'Fri', score: 90, emotion: 'Happy' },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    // Connect to Socket.IO on backend URL
    const newSocket = io(API_BASE_URL || undefined);
    setSocket(newSocket);

    newSocket.on('friends_mood_update', (data) => {
      // Filter out self if we wanted to, but let's show all for demo
      setFriendsMoods(data);
    });

    return () => newSocket.close();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!moodText) return;
    
    // Clear currently playing song on new search
    setPlayingSong(null);
    
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    
    // Call backend
    try {
      const res = await fetch(`${API_BASE_URL}/api/mood/analyze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: moodText })
      });
      const data = await res.json();
      setMood(data);
      
      // Update mood history
      setMoodHistory(prev => {
        const newHistory = [...prev.slice(1), { day: 'Today', score: data.score, emotion: data.emotion }];
        return newHistory;
      });
      setStreak(13);
      
      // Fetch recommendations
      const recRes = await fetch(`${API_BASE_URL}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: data.emotion })
      });
      const recData = await recRes.json();
      setRecommendations(recData);
      
      // Update socket
      if (socket && user) {
        socket.emit('update_mood', { 
          name: user.name, 
          emotion: data.emotion, 
          status: moodText 
        });
      }
      
      setMoodText('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen gradient-mesh p-6 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          MoodVerse
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold">{streak} Day Streak</span>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="px-4 py-2 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Chat & Mood */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-8">
            <h2 className="text-3xl font-bold mb-2">Good Evening, {user.name} 👋</h2>
            <p className="text-white/60 mb-8">How are you feeling today?</p>
            
            <form onSubmit={handleAnalyze} className="relative">
              <Input 
                value={moodText}
                onChange={(e) => setMoodText(e.target.value)}
                placeholder="Tell me how you're feeling... (English, Tamil, Tanglish)" 
                className="pr-16 py-4 rounded-2xl text-lg"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 p-3 rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            
            {mood && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(255,255,255,0.2)] ${mood.emotion === 'Happy' ? 'bg-green-500/20' : mood.emotion === 'Sad' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                  {mood.emotion === 'Happy' ? '😄' : mood.emotion === 'Sad' ? '😢' : '😌'}
                </div>
                <div>
                  <h3 className="text-xl font-bold">Current Mood: {mood.emotion}</h3>
                  <p className="text-white/60">Mood Score: {mood.score}/100</p>
                </div>
              </motion.div>
            )}
          </GlassCard>

          {recommendations && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="text-secondary" /> AI Recommendations</h3>
              <p className="text-white/60">{recommendations.reason}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2"><Film className="text-pink-500" /> Movie Match</h4>
                  <div className="space-y-4">
                  {recommendations.movies.map((m, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className="w-20 h-28 bg-white/10 rounded-lg flex-shrink-0 overflow-hidden relative border border-white/5">
                        {m.poster ? (
                          <img 
                            src={m.poster} 
                            alt={m.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            onError={(e) => { 
                              e.target.onerror = null; 
                              e.target.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' style='background:%231a1a2e'%3E%3Ctext x='50%25' y='50%25' fill='%23ffffff' font-family='sans-serif' font-size='40' text-anchor='middle' alignment-baseline='middle'%3ENo Poster%3C/text%3E%3C/svg%3E"; 
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center text-xs text-center text-white/50 p-2 border border-white/10">No Poster</div>
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold group-hover:text-primary transition-colors">{m.title}</h5>
                        <p className="text-sm text-white/60">{m.genre}</p>
                        <div className="mt-2 text-xs bg-white/10 inline-block px-2 py-1 rounded">⭐ {m.rating}</div>
                      </div>
                    </div>
                  ))}
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2"><Music className="text-secondary" /> Song Match</h4>
                  <div className="space-y-4">
                  {recommendations.songs.map((s, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer border ${playingSong?.title === s.title ? 'bg-primary/20 border-primary/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                      onClick={() => setPlayingSong(s)}
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 group">
                        {playingSong?.title === s.title ? (
                          <div className="flex gap-1">
                            <span className="w-1 h-3 bg-secondary animate-pulse rounded-full"></span>
                            <span className="w-1 h-4 bg-secondary animate-pulse delay-75 rounded-full"></span>
                            <span className="w-1 h-2 bg-secondary animate-pulse delay-150 rounded-full"></span>
                          </div>
                        ) : (
                          <Music className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold truncate group-hover:text-secondary transition-colors">{s.title}</h5>
                        <p className="text-sm text-white/60 truncate">{s.artist}</p>
                      </div>
                    </div>
                  ))}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Mood Tracker */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Flame className="text-orange-500" /> Mood Tracker</h3>
            <div className="flex items-end justify-between h-32 mb-2 gap-2">
              {moodHistory.map((m, i) => (
                <div key={i} className="flex flex-col items-center justify-end w-full group">
                  <div 
                    className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 relative"
                    style={{ height: `${m.score}%`, backgroundColor: m.emotion === 'Happy' ? '#22c55e' : m.emotion === 'Sad' ? '#3b82f6' : '#a855f7' }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-10 whitespace-nowrap">
                      {m.score}/100
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-white/50 border-t border-white/10 pt-2">
              {moodHistory.map((m, i) => <span key={i} className="w-full text-center">{m.day}</span>)}
            </div>
          </GlassCard>

          {/* Live Friends */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="text-primary" /> Live Friend Moods</h3>
            
            <div className="space-y-4">
              {friendsMoods.length === 0 ? (
                <p className="text-white/50 text-center py-10">No friends online right now.</p>
              ) : (
                friendsMoods.map((friend, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-sm">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="font-bold">{friend.name}</h5>
                        <p className="text-xs text-white/60 italic truncate max-w-[120px]">"{friend.status}"</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">
                      {friend.emotion}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {friendsMoods.length > 0 && mood && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-center text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-secondary">
                  Friend Blend Mode: Active
                </p>
                <Button onClick={() => setWatchParty(true)} className="w-full mt-4 py-2 text-sm">Start Watch Party</Button>
              </div>
            )}
          </GlassCard>
        </div>

      </div>

      {/* Watch Party Modal */}
      {watchParty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full">
            <GlassCard className="p-8 text-center border-primary/50 border">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Watch Party Started!</h3>
              <p className="text-white/60 mb-6">Your friend blend session is active. Share this link with your friends to sync your movies and music.</p>
              
              <div className="bg-black/50 p-3 rounded-lg flex items-center justify-between mb-6 border border-white/10">
                <span className="text-sm font-mono text-white/80 truncate">{`${window.location.origin}/party/xyz-123`}</span>
                <Button 
                  variant="secondary" 
                  className="px-3 py-1 text-xs ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/party/xyz-123`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>

              <Button onClick={() => setWatchParty(false)} className="w-full">Close</Button>
            </GlassCard>
          </motion.div>
        </div>
      )}

      {/* Mini Player */}
      {playingSong && playingSong.youtubeId && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 flex justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl pointer-events-auto"
          >
            <GlassCard className="p-3 flex items-center justify-between gap-4 border-t border-white/20 bg-black/80 backdrop-blur-xl">
              <div className="flex items-center gap-4 pl-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/60 font-bold tracking-wider">NOW PLAYING</p>
                  <h4 className="font-bold text-md leading-tight">{playingSong.title}</h4>
                  <p className="text-xs text-white/80">{playingSong.artist}</p>
                </div>
              </div>
              
              <div className="w-64 h-20 rounded-lg overflow-hidden bg-black/50 relative group">
                 <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${playingSong.youtubeId}?autoplay=1&controls=0&modestbranding=1`}
                    title={playingSong.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={`https://youtube.com/watch?v=${playingSong.youtubeId}`} target="_blank" rel="noreferrer" className="text-[10px] bg-red-600 px-3 py-1 rounded-full font-bold">Watch on YouTube ↗</a>
                  </div>
              </div>
              
              <button 
                onClick={() => setPlayingSong(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center mr-2 transition-colors"
              >
                ✕
              </button>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
