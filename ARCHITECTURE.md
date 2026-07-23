# MoodVerse Architecture Summary

MoodVerse is built as a modern, decoupled Monorepo architecture designed for performance, scalability, and maintainability.

## 1. High-Level Architecture
- **Client (Frontend)**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Server (Backend)**: Node.js, Express, TypeScript, Socket.io
- **Database**: MongoDB (Mongoose ORM)
- **AI Engine**: Google Gemini API integration

## 2. Frontend Architecture
- **Routing**: `react-router-dom` with strict route-based code splitting using `React.lazy` and `Suspense`.
- **State Management**: React Context API (`AuthContext`, `ThemeContext`, `SocketContext`) optimized with `useMemo` and `useCallback` to prevent cascading re-renders.
- **Styling**: Tailwind CSS with custom global CSS variables (`--color-bg`, `--color-accent`) dynamically manipulated by the Theme Engine based on emotions.
- **Bundling**: Vite with advanced Rollup chunking strategies (separating `vendor`, `framer`, `ui`, and lazy-loaded routes).

## 3. Backend Architecture
- **API Layer**: Express REST API secured with Helmet, CORS, and Gzip compression.
- **Authentication**: JWT-based session management with robust bcrypt password hashing (rounds=12).
- **Caching**: Custom in-memory middleware that securely caches responses based on the unique combination of the user's ID and requested route.
- **Database Access**: Mongoose utilizing compound indexing and `.lean()` read queries for maximum query speed and reduced memory footprints.
- **Real-Time Layer**: Socket.io enabling bi-directional real-time communication for Friend Chat and Live Mood Syncing.

## 4. Intelligent Engine (AI)
The application fuses two intelligence pipelines:
1. **Generative AI (Gemini)**: Provides deep, empathetic emotional insights based on users' historic mood journal entries.
2. **Algorithmic Datasets (Heuristics)**: Fast, early-termination sampling algorithms that parse over 100,000 embedded movies and music tracks to instantly recommend entertainment matching the user's mood.
