require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { usersDB, moodsDB } = require('./db');
const mediaDB = require('./data/media');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// JWT Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await usersDB.findOne({ _id: decoded.id });
      if (!user) throw new Error('User not found');
      
      delete user.password;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ---------------- AUTH ROUTES ----------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await usersDB.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await usersDB.insert({ name, email, password: hashedPassword, createdAt: new Date() });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
    
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersDB.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
      res.json({ _id: user._id, name: user.name, email: user.email, token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------------- MOOD ROUTES ----------------
app.post('/api/mood/analyze', protect, async (req, res) => {
  const { text } = req.body;
  const textLower = text.toLowerCase();
  
  let emotion = 'Neutral';
  let score = 50;
  
  const kw = {
    Happy: ['happy', 'good', 'great', 'super', 'santhosham', 'santhoshama', 'jolly', 'mass', 'magizhchi', 'மகிழ்ச்சி', 'சந்தோஷம்', 'நன்று'],
    Sad: ['sad', 'bad', 'depressed', 'sogam', 'sogama', 'kastam', 'kastama', 'kavalai', 'stress', 'kaduppu', 'veruppu', 'break', 'breakup', 'broken', 'சோகம்', 'கவலை', 'வருத்தம்'],
    Romantic: ['love', 'kadhal', 'romance', 'azhagi', 'miss', 'romantic', 'காதல்', 'அன்பு'],
    Energetic: ['energetic', 'active', 'mass', 'gethu', 'fire', 'verithanam', 'வெறித்தனம்', 'உற்சாகம்'],
    Angry: ['angry', 'kaduppu', 'kovam', 'veruppu', 'frustrated', 'irritated', 'கோபம்'],
    Calm: ['calm', 'relax', 'peace', 'அமைதி'],
    Nostalgic: ['nostalgia', 'old days', 'childhood', '90s', 'pazhaya', 'school', 'college', 'retro', 'vintage'],
    Excited: ['excited', 'thrilled', 'eager', 'arvam', 'aarvam', 'pumped'],
    Motivated: ['motivated', 'inspired', 'determined', 'veri', 'focus'],
    Stressed: ['stressed', 'pressure', 'tension', 'overwhelmed'],
    Lonely: ['lonely', 'alone', 'thaniya', 'isolated'],
    Relaxed: ['relaxed', 'chill', 'free', 'nimmathi'],
    Confident: ['confident', 'strong', 'dhairiyam', 'nambikkai'],
    Fearful: ['fearful', 'scared', 'bayama', 'bayam', 'பயம்'],
    Surprised: ['surprised', 'shocked', 'shock', 'athirchi']
  };

  for (const [key, words] of Object.entries(kw)) {
    if (words.some(k => textLower.includes(k))) {
      emotion = key;
      score = key === 'Sad' || key === 'Angry' || key === 'Fearful' || key === 'Lonely' || key === 'Stressed' ? 20 : 90;
      break;
    }
  }

  try {
    await moodsDB.insert({ userId: req.user._id, emotion, score, text, createdAt: new Date() });
  } catch(e) {
    console.error('Failed to log mood:', e.message);
  }

  res.json({ emotion, score });
});

app.post('/api/recommendations', (req, res) => {
  const { mood } = req.body;
  const currentRec = mediaDB[mood] || mediaDB['Calm'];
  res.json({ movies: currentRec.movies, songs: currentRec.songs, reason: `Curated specially because you are feeling ${mood}` });
});

// ---------------- SOCKET.IO ----------------
const moods = {};
io.on('connection', (socket) => {
  socket.on('update_mood', (data) => {
    moods[socket.id] = data;
    io.emit('friends_mood_update', Object.values(moods));
  });
  socket.on('disconnect', () => {
    delete moods[socket.id];
    io.emit('friends_mood_update', Object.values(moods));
  });
});

// ---------------- ROOT & FALLBACK ROUTES ----------------
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MoodVerse API Server is running 🚀' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'API Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Production Server running on port ${PORT}`));
