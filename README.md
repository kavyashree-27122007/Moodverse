<div align="center">

# 🌙 MoodVerse

### *Your AI-powered mood journal & music companion*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

*Track your moods. Discover music. Share the vibe.*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎭 **Mood Tracking** | Log your daily mood with detailed entries and notes |
| 🎵 **Music Discovery** | Get personalized music recommendations based on your mood |
| 🎬 **Watch Party** | Watch content together with friends in real-time via Socket.io |
| 🔐 **Auth System** | Secure JWT-based authentication with bcrypt password hashing |
| 📊 **Dashboard** | Visual mood history and insights at a glance |
| ⚡ **Real-time** | Live updates powered by Socket.io |

---

## 🗂️ Project Structure

```
MoodVerse/
├── 📁 frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   │   └── ui/       # Button, GlassCard, Input
│   │   ├── pages/        # App pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── WatchParty.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── 📁 backend/           # Node.js + Express API
    ├── models/
    │   ├── User.js
    │   └── MoodLog.js
    ├── data/
    │   └── media.js
    ├── server.js
    ├── db.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

---

### 🔧 Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Then edit .env with your values

# Start development server
npm run dev
```

The backend runs on **http://localhost:5000**

#### Backend Environment Variables (`.env`)

```env
PORT=5000
JWT_SECRET=your_super_secret_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

---

### 🎨 Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **TailwindCSS 3** | Utility-first styling |
| **Framer Motion** | Animations |
| **React Router v7** | Client-side routing |
| **Socket.io Client** | Real-time communication |
| **Axios** | HTTP requests |
| **Lucide React** | Icons |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | Server framework |
| **Socket.io 4** | WebSocket real-time events |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Supabase** | Cloud database & storage |
| **dotenv** | Environment configuration |
| **nodemon** | Dev auto-reload |

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    → Register a new user
POST   /api/auth/login       → Login and receive JWT token
```

### Mood Logs
```
GET    /api/moods            → Get all mood logs for user
POST   /api/moods            → Create a new mood log
DELETE /api/moods/:id        → Delete a mood log
```

### Media / Music
```
GET    /api/media            → Get mood-based music/media recommendations
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

Made with ❤️ by **Kavyashree**

⭐ Star this repo if you find it helpful!

</div>
