# Deployment Guide

This guide covers deploying MoodVerse to production using standard PaaS providers (e.g., Vercel for Frontend, Render/Heroku for Backend).

## 1. Backend Deployment (Node.js/Express)

### Prerequisites
- A MongoDB Atlas cluster.
- A Gemini API Key.

### Steps (Render / Heroku)
1. Push the repository to GitHub.
2. Connect your PaaS to the repository.
3. Set the Root Directory to `backend/`.
4. Set the Build Command: `npm install && npm run build`
5. Set the Start Command: `npm start`
6. Configure Environment Variables in provider dashboard:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your_atlas_connection_string>`
   - `JWT_SECRET=<strong_random_string>`
   - `GEMINI_API_KEY=<your_api_key>`
   - `CLIENT_URL=https://your-frontend-domain.com`

## 2. Frontend Deployment (Vite/React)

### Steps (Vercel / Netlify)
1. Connect your PaaS to the same GitHub repository.
2. Set the Root Directory to `frontend/`.
3. Set the Build Command: `npm run build`
4. Set the Output Directory: `dist`
5. Configure Environment Variables:
   - `VITE_API_BASE_URL=https://your-backend-url.com/api`
   - `VITE_SOCKET_URL=https://your-backend-url.com`
