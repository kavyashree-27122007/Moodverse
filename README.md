<div align="center">

# 🌌 MoodVerse 

<p align="center">
  <img src="https://img.shields.io/badge/MoodVerse-blueviolet?style=for-the-badge&logo=sparkles&logoColor=white" alt="MoodVerse "/>
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License">
</p>

### *An AI-Powered Emotional Wellness Platform that curates your Music, Movies, and Friends based on how you feel.*

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-moodverse--chi.vercel.app-7c3aed?style=for-the-badge)](https://moodverse-chi.vercel.app)
[![API](https://img.shields.io/badge/⚡%20Backend%20API-Render-10b981?style=for-the-badge)](https://moodverse-nyfd.onrender.com)

</div>

---

## 📖 About The Project

**MoodVerse** is a full-stack, responsive emotional wellness and tracking platform. Powered by **Google Gemini AI**, it goes beyond simple mood tracking by understanding the nuance of your emotions and curating personalized experiences. Whether you need an energetic Kuthu beat to celebrate, or a melancholic melody to reflect, MoodVerse provides it in a stunning, fully responsive dark-mode environment.

### 🌟 Key Features

*   🧠 **AI Mood Analysis:** Advanced context-aware emotional insights driven by Gemini.
*   🎵 **Mood-Matched Music:** Contextual links to YouTube Music tracks categorized perfectly for your current state.
*   🎬 **Movie Recommendations:** Handpicked Tamil, Telugu, Hindi, and English films tailored to your mood.
*   📓 **Secure Journaling:** A private space to reflect, powered by cloud-synced MongoDB.
*   👥 **Social Connections:** See how your friends are feeling and support each other.
*   📊 **Analytics Dashboard:** Beautiful, interactive charts tracking your emotional journey over time.
*   📱 **Fully Responsive UI:** Optimized for both Desktop and Mobile with sleek navigation bars.
*   🌙 **Glassmorphism Aesthetic:** A modern, premium dark-mode interface built with TailwindCSS and Framer Motion.

---

## 💻 Tech Stack

### Frontend Architecture
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*   **State Management & Routing:** React Router v6, Context API
*   **Animations:** Framer Motion
*   **Data Visualization:** Recharts
*   **Icons:** Lucide React

### Backend Architecture
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-black?style=flat-square&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

*   **Core:** Node.js, Express.js (TypeScript)
*   **Database:** MongoDB Atlas + Mongoose ODM
*   **AI Engine:** Google Gemini SDK (`@google/genai`)
*   **Real-time:** Socket.io
*   **Security:** bcrypt, JWT, CORS

---

## 🚀 Getting Started Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   **Node.js** (v18.x or higher)
*   **npm** (or yarn/pnpm)
*   A **MongoDB Atlas** Cluster (or local MongoDB)
*   *(Optional)* A **Google Gemini API Key** for AI features

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/kavyashree-27122007/Moodverse.git
   cd Moodverse
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open `http://localhost:5173` in your browser.

---

## 🌍 Cloud Deployment

MoodVerse is built for modern cloud infrastructure.

*   **Frontend:** Deployed globally on [Vercel](https://vercel.com). Routing is handled flawlessly via `vercel.json` rewrites.
*   **Backend:** Hosted on [Render](https://render.com). The API serves responses instantly and connects to our secure MongoDB Atlas cluster.

> Note: On Render's free tier, the backend may sleep after 15 minutes of inactivity. MoodVerse gracefully handles this by caching recent entries in your browser (`localStorage`) so your UI remains responsive!

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ and 🎵 by <b>Kavyashree</b></p>
  <p>If you like this project, please give it a ⭐ on GitHub!</p>
</div>
