<div align="center">

<img src="https://img.shields.io/badge/MoodVerse-2.0-blueviolet?style=for-the-badge&logo=sparkles&logoColor=white" alt="MoodVerse 2.0"/>

# 🌌 MoodVerse 2.0

### *AI-Powered Emotional Wellness — Track · Discover · Connect*

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-moodverse--chi.vercel.app-7c3aed?style=for-the-badge)](https://moodverse-chi.vercel.app)
[![API](https://img.shields.io/badge/⚡%20Backend%20API-Render-10b981?style=for-the-badge)](https://moodverse-nyfd.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)

---

> **MoodVerse 2.0** is a full-stack emotional wellness platform that uses **Google Gemini AI** to understand your emotions and curate personalized experiences — music, movies, journal entries, and social connections — all in one stunning dark-mode app.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Mood Analysis** | Gemini-powered insights analyzing your emotional patterns over time |
| 🎵 **Mood-Matched Music** | Curated Indian & global tracks (Tamil, Hindi, Telugu, English) by emotion |
| 🎬 **Movie Recommendations** | Films handpicked for your exact vibe — from blockbusters to hidden gems |
| 📓 **Mood Journal** | Private emotional diary with offline save & auto-sync |
| 👥 **Friends & Social** | Connect with friends, share your emotional journey |
| 📊 **Analytics Dashboard** | Beautiful charts tracking your mood patterns over 7/30/90 days |
| 🏆 **Gamification** | Streaks, points, and achievements to keep you consistent |
| 🤖 **Moody Mascot** | Animated AI companion that reacts to your current mood |
| 🌙 **Dark Mode First** | Stunning glassmorphism UI — built for night owls |

---

## 🚀 Live Demo

🌐 **Frontend:** [https://moodverse-chi.vercel.app](https://moodverse-chi.vercel.app)  
⚡ **Backend API:** [https://moodverse-nyfd.onrender.com](https://moodverse-nyfd.onrender.com)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** — type-safe component architecture
- **Vite 8** — lightning-fast HMR build tool
- **Framer Motion** — smooth animations & micro-interactions
- **TailwindCSS** — utility-first responsive styling
- **Axios** — API communication with JWT interceptors
- **Recharts** — analytics data visualizations
- **Socket.io Client** — real-time friend notifications
- **Lucide React** — crisp icon library

### Backend
- **Node.js** + **Express** — fast REST API
- **TypeScript** — end-to-end type safety
- **MongoDB Atlas** + **Mongoose** — cloud database
- **Google Gemini AI** — emotion analysis & recommendations
- **Socket.io** — real-time messaging
- **JWT** — secure authentication
- **bcrypt** — password hashing

---

## 📁 Project Structure

```
moodverse/
├── frontend/                  # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx   # ✨ Hero intro page
│   │   │   ├── Dashboard.tsx     # Mood logging hub
│   │   │   ├── Music.tsx         # Emotion-curated music
│   │   │   ├── Movies.tsx        # Mood-matched films
│   │   │   ├── Journal.tsx       # Private mood diary
│   │   │   ├── Analytics.tsx     # Mood charts & trends
│   │   │   ├── Friends.tsx       # Social features
│   │   │   └── Achievements.tsx  # Gamification
│   │   ├── components/
│   │   │   ├── MoodyMascot.tsx   # Animated AI mascot
│   │   │   ├── AppLayout.tsx     # Sidebar navigation
│   │   │   └── ProtectedRoute.tsx
│   │   └── context/
│   │       ├── AuthContext.tsx   # JWT auth + Axios instance
│   │       ├── ThemeContext.tsx  # Emotion-driven theme
│   │       ├── SocketContext.tsx # Real-time events
│   │       └── MascotContext.tsx # Mascot state
│   └── vite.config.ts
│
└── backend/                   # Express + TypeScript
    └── src/
        ├── routes/
        │   ├── auth.ts          # Register/Login/Me
        │   ├── mood.ts          # Mood CRUD
        │   ├── ai.routes.ts     # AI insights & recs
        │   └── friends.ts       # Social
        ├── controllers/
        ├── models/
        │   ├── User.ts
        │   ├── MoodEntry.ts
        │   └── EmotionalMemory.ts
        └── services/
            ├── ai.service.ts    # Gemini + fallback engine
            └── dataset.service.ts # Curated Tamil/Indian data
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key (optional — fallback works without it)

### 1. Clone & Install

```bash
git clone https://github.com/kavyashree-27122007/Moodverse.git
cd Moodverse

# Install frontend
cd frontend && npm install

# Install backend
cd ../backend && npm install
```

### 2. Environment Variables

**Backend** — create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_google_gemini_api_key   # optional
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Locally

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173** 🎉

---

## 🌍 Deployment

### Frontend → Vercel
```bash
# Set environment variable in Vercel dashboard:
VITE_API_BASE_URL = https://your-render-api.onrender.com/api
```

### Backend → Render
```yaml
Build Command: npm install && npm run build
Start Command: node dist/index.js
Environment: NODE_ENV=production, MONGO_URI, JWT_SECRET, GEMINI_API_KEY
```

---

## 🎭 Emotion Categories

MoodVerse understands **8 core emotions**, each with curated content:

| Emotion | Music | Movies |
|---|---|---|
| ❤️ Love | Sid Sriram, A.R. Rahman | Sita Ramam, 96, VTV |
| 😊 Happy | Anirudh, Hiphop Tamizha | Leo, Jailer, Master |
| 😢 Sad | Melancholic melodies | Jai Bhim, Chitha |
| 😤 Angry | Mass anthems, EDM | Vikram, Kaithi, Sarpatta |
| 😌 Calm | Lo-fi, acoustic | Thiruchitrambalam, OK Kanmani |
| 💪 Motivated | Power tracks | Soorarai Pottru, Jai Bhim |
| 🌅 Nostalgic | Classics, retro hits | 96, Anbe Sivam, Premam |
| 🤩 Excited | Party & kuthu beats | Leo, Vikram, Beast |

---

## 📸 Screenshots

> Visit the live demo: [moodverse-chi.vercel.app](https://moodverse-chi.vercel.app)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ❤️ and lots of 🎵 by **Kavyashree**

⭐ **Star this repo if you love MoodVerse!** ⭐

</div>
