# Environment Setup Guide

MoodVerse requires environment variables to connect to its database, secure its tokens, and access AI providers.

## Backend Configuration (`backend/.env`)

Create a `.env` file in the `backend/` directory using `.env.example` as a template.

| Variable | Description | Default / Example | Required |
|----------|-------------|-------------------|----------|
| `PORT` | The port the Express server binds to | `5000` | No |
| `NODE_ENV` | Sets execution environment (`development`, `production`) | `development` | No |
| `MONGODB_URI` | Connection string for MongoDB (Atlas) | - | **No (Dev) / Yes (Prod)** |
| `JWT_SECRET` | Cryptographic secret for signing session tokens | `fallback_secret` | **Yes (Prod)** |
| `GEMINI_API_KEY`| Google Gemini API Key for AI Insights | - | **Yes** |
| `CLIENT_URL` | Used for strict CORS domain filtering | `http://localhost:5173` | No |

*Note: If `MONGODB_URI` is omitted during local development, MoodVerse automatically downloads and spins up an ephemeral in-memory MongoDB instance for zero-configuration testing.*

## Frontend Configuration (`frontend/.env.local`)

Create an `.env.local` file in the `frontend/` directory using `.env.example` as a template.

| Variable | Description | Default / Example | Required |
|----------|-------------|-------------------|----------|
| `VITE_API_BASE_URL`| Full URL to the backend API | `http://localhost:5000/api` | No |

## Getting a Gemini API Key
To power the AI Insights engine, you must obtain a free Gemini API key:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account.
3. Click "Get API Key" and generate a new key.
4. Paste it into your `backend/.env` file as `GEMINI_API_KEY=your_key`.
