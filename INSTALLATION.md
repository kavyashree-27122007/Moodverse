# Installation Guide

Welcome to MoodVerse! Follow these steps to set up the project on your local machine.

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**

## 1. Clone the Repository
```bash
git clone https://github.com/kavyashree-27122007/Moodverse-NLP-powered-friend-mood-match-movie-and-music-recommendation-platform-.git
cd Moodverse-NLP-powered-friend-mood-match-movie-and-music-recommendation-platform-
```

## 2. Install Backend Dependencies
```bash
cd backend
npm install
```

## 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## 4. Environment Setup
Copy `.env.example` to `.env` in `backend/` and configure your settings.
```bash
cd ../backend
cp .env.example .env
```

## 5. Run the Application
Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend client:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.
