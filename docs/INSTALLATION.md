# Installation Guide

Welcome to MoodVerse! Follow these steps to set up the project on your local machine.

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**

## 1. Clone the Repository
```bash
git clone https://github.com/your-username/moodverse.git
cd moodverse
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

## 4. Initial Environment Setup
Copy the example environment files to their actual locations.

**Backend**:
```bash
cd ../backend
cp .env.example .env
```
*(Open `.env` and fill in your actual credentials, specifically the `GEMINI_API_KEY`)*

**Frontend**:
```bash
cd ../frontend
cp .env.example .env.local
```

You are now ready to run MoodVerse locally. Please refer to the [Environment Setup Guide](ENV_SETUP.md) for detailed configuration, or run `npm run dev` in both folders.
