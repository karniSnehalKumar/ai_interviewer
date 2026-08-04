# PrepIQ

AI-powered mock interview platform. Upload your resume, choose your interview mode (HR or Technical), and get personalized questions with real-time voice interaction and AI feedback.

## Features

- Resume upload & parsing (PDF)
- AI-generated interview questions based on role, experience & skills
- Voice-based interview with speech synthesis & recognition
- Real-time AI feedback on confidence, communication & correctness
- Score report with question-wise breakdown
- Interview history

## Tech Stack

**Client:** React, Vite, Redux Toolkit, Framer Motion, Firebase Auth

**Server:** Node.js, Express, MongoDB, Gemini AI, JWT, Multer

## Getting Started

### Client

```bash
cd client
cp .env.example .env   # fill in VITE_FIREBASE_API_KEY and VITE_SERVER_URL
npm install
npm run dev
```

### Server

```bash
cd server
cp .env.example .env   # fill in MONGODB_URL, JWT_SECRET, GEMINI_API_KEY, CLIENT_URL
npm install
npm run dev
```
