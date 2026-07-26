# MoodVerse 2.0 — NLP-Powered Friend Mood Match, Movie & Music Recommendation Platform

MoodVerse is a production-ready emotional intelligence platform and mood tracking application featuring "Moody", an interactive, animated emotional companion that guides users through self-reflection, real-time social connections, and personalized entertainment recommendations.

## 📖 Documentation Sitemap

- [Installation Guide](docs/INSTALLATION.md)
- [Architecture & Design](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Environment Setup](docs/ENV_SETUP.md)
- [Release Notes (v1.0 RC)](docs/RELEASE_NOTES.md)
- [Limitations & Future Roadmap](docs/LIMITATIONS.md)
- [License](LICENSE)

---

## ✨ Features

- **Moody – Animated Emotional Companion:** An interactive SVG character built with Framer Motion that blinks, breathes, tracks cursor movement, reacts to user emotions, and offers guidance.
- **Dynamic Emotion Engine:** Beautiful HSL-tailored color themes and glassmorphism styling that repaints the interface dynamically for 36 supported emotions.
- **AI Psychological Insights:** Integrates with Google Gemini API to analyze mood history and deliver deep, empathetic psychological breakdowns.
- **Smart Music & Movie Recommendations:** Curated hits and movie picks with unique YouTube thumbnail posters and one-click Spotify and YouTube trailer links.
- **Real-Time Social Sync & Chat:** Powered by Socket.io, view live friend mood updates, online statuses, and chat via an unblocked standalone chat area.
- **Persistent Cloud Database:** Automatic connection to MongoDB Atlas with in-memory fallback for offline resilience.
- **Session & Chat Memory:** Complete authentication state and chat history saved permanently in `localStorage` across page reloads.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS + Vanilla CSS Token System
- **Animations:** Framer Motion
- **Routing:** React Router DOM v6 with code-splitting
- **State & API:** React Context API, Axios, Socket.io-client

### Backend
- **Framework:** Node.js with Express & TypeScript
- **Database:** MongoDB Atlas (Mongoose ORM)
- **Real-Time Engine:** Socket.io
- **AI Service:** Google Gemini API Integration
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs (rounds=12)

---

## 📁 Repository Structure

```text
Moodverse-NLP-powered-friend-mood-match-movie-and-music-recommendation-platform/
├── backend/            # Express.js REST API & Socket.io server
│   ├── src/
│   │   ├── config/     # Database setup & environment variables
│   │   ├── controllers/# Auth, Mood, AI, Friends Controllers
│   │   ├── models/     # Mongoose Schemas (User, MoodEntry, Memory)
│   │   ├── routes/     # Express API routes
│   │   └── services/   # AI Engine & Dataset Service
│   ├── .env.example
│   └── package.json
├── frontend/           # React 18 + Vite frontend
│   ├── src/
│   │   ├── components/ # UI components (MoodyMascot, FriendsList, ChatPanel, etc.)
│   │   ├── context/    # AuthContext, ThemeContext, SocketContext, MascotContext
│   │   ├── pages/      # Dashboard, Analytics, Music, Movies, Journal, Friends, etc.
│   │   └── utils/      # Emotions, color tokens, helpers
│   ├── .env.example
│   └── package.json
├── docs/               # Technical Documentation (API, Architecture, Deployment)
├── LICENSE             # MIT License
└── README.md           # Documentation Overview
```

---

## 🚀 Quick Start (Local Setup)

### 1. Clone Repository
```bash
git clone https://github.com/kavyashree-27122007/Moodverse-NLP-powered-friend-mood-match-movie-and-music-recommendation-platform-.git
cd Moodverse-NLP-powered-friend-mood-match-movie-and-music-recommendation-platform-
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
