# Deployment Guide

This guide covers deploying MoodVerse to production using standard PaaS providers (e.g., Vercel for Frontend, Render/Heroku for Backend).

## 1. Backend Deployment (Node.js/Express)

### Prerequisites
- A MongoDB Atlas cluster (free tier works fine).
- A Redis instance (optional, for scalable caching).
- A Gemini API Key.

### Steps (Render / Heroku)
1. Push the repository to GitHub.
2. Connect your PaaS to the repository.
3. Set the Root Directory to `backend/`.
4. Set the Build Command: `npm install && npm run build`
5. Set the Start Command: `npm start`
6. Configure the following Environment Variables in the provider's dashboard:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your_atlas_connection_string>`
   - `JWT_SECRET=<strong_random_string>`
   - `GEMINI_API_KEY=<your_api_key>`
   - `CLIENT_URL=https://your-frontend-domain.com`

*Wait for the deployment to finish and note the backend URL.*

## 2. Frontend Deployment (Vite/React)

### Steps (Vercel / Netlify)
1. Connect your PaaS to the same GitHub repository.
2. Set the Root Directory to `frontend/`.
3. Set the Build Command: `npm run build`
4. Set the Output Directory: `dist`
5. Configure the Environment Variable:
   - `VITE_API_BASE_URL=https://your-backend-url.com/api`

### Client-Side Routing Configuration
If you are not using Vercel (which handles this automatically via Next/React router presets), you must configure your static host to rewrite all 404s to `index.html`.

For example, on Netlify, create a `public/_redirects` file containing:
```
/* /index.html 200
```

## 3. Post-Deployment Verification
1. Open the deployed frontend URL.
2. Register a test account.
3. Verify that the AI recommendation engine successfully fetches data (which confirms the Gemini API Key is working).
4. Verify that logging a mood properly updates the charts (confirming the MongoDB connection).
