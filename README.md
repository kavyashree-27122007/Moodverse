# MoodVerse

MoodVerse is a modern, AI-powered emotional intelligence platform and mood tracking application. It features "Moody", an interactive, magical emotional companion who guides users through their journey of self-reflection and growth.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment Guide](#deployment-guide)

## Features

- **Moody – Emotional Companion:** A fully interactive, animated SVG character built from scratch using Framer Motion. Moody blinks, breathes, tracks your cursor, reacts to your moods, and greets you based on the page you're visiting.
- **AI Psychological Insights:** Analyzes recent mood entries using a powerful AI engine to provide deeply personalized insights and long-term emotional memory tracking.
- **Mood Tracking & Journaling:** Log daily moods with intensity scales and write journal entries to reflect on your day.
- **Real-time Social Features:** Connect with friends, see their online status in real-time (via Socket.io), and support each other's mental health journey.
- **Emotional Memory System:** Moody remembers past interactions, favorite songs, movies, and triggers to provide a highly tailored experience.
- **Data Export:** Export your complete mood history and AI memory profile as a JSON file at any time for total data ownership.

## Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS + Vanilla CSS for animations
- **Animations:** Framer Motion (for physics-based SVGs and page transitions)
- **Routing:** React Router DOM v6
- **State/API:** Context API, Axios
- **Icons:** Lucide React

### Backend
- **Framework:** Node.js with Express
- **Database:** MongoDB (via Mongoose)
- **Real-time:** Socket.io
- **AI Integration:** Google Gemini API (or configurable LLM)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, bcrypt

## Project Structure

```
moodverse 2.0/
├── backend/            # Express.js REST API and Socket.io server
│   ├── src/
│   │   ├── controllers/# Route controllers (auth, mood, ai, etc.)
│   │   ├── models/     # Mongoose schemas (User, MoodEntry, EmotionalMemory)
│   │   ├── routes/     # Express routes
│   │   └── services/   # AI engine and dataset services
│   └── package.json
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components (MoodyMascot, etc.)
│   │   ├── context/    # React Context (Auth, Theme, Mascot, Socket)
│   │   ├── pages/      # Application pages (Dashboard, Settings, etc.)
│   │   └── utils/      # Helpers and utilities
│   └── package.json
└── README.md           # This file
```

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone or Extract the Project
Open the project directory in your terminal.

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure your environment variables (see [Environment Variables](#environment-variables)).
```bash
npm run dev
```
The backend will start on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Configure your frontend environment variables.
```bash
npm run dev
```
The frontend will start on `http://localhost:5173`.

## Environment Variables

Create a `.env` file in the **backend** directory:
```env
# Backend .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moodverse
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
AI_API_KEY=your_gemini_or_openai_key
```

Create a `.env` file in the **frontend** directory:
```env
# Frontend .env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Deployment Guide

### Deploying the Backend (e.g., Render, Railway, Heroku)
1. Push the `backend` folder to a GitHub repository (or use monorepo deployment tools).
2. Set the build command to: `npm install && npm run build`
3. Set the start command to: `npm start`
4. Add all Backend environment variables in the host's dashboard. (Make sure `CLIENT_URL` points to your deployed frontend URL).

### Deploying the Frontend (e.g., Vercel, Netlify, Cloudflare Pages)
1. Push the `frontend` folder to your repository.
2. Set the framework preset to `Vite`.
3. Set the build command to: `npm run build`
4. Set the output directory to: `dist`
5. Add Frontend environment variables (`VITE_API_BASE_URL` pointing to your deployed backend URL).

Enjoy building a more emotionally intelligent world with MoodVerse!
