# Backend - Gemini AI Chat Assistant API

Node.js + Express + MongoDB backend with Google Gemini API integration (`@google/generative-ai`).

## Features
- **Server-Sent Events (SSE)** for token streaming.
- **Mongoose Models**: `Conversation` and `Message`.
- Automatic title generation using Gemini.
- Sliding context window (fetches recent conversation history).
- Centralized error handling and standardized API responses.
- Security with Helmet and CORS.

## Environment Variables (.env)
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/ai-chat-assistant
GEMINI_API_KEY=your_gemini_api_key_here
DEFAULT_MODEL=gemini-flash-lite-latest
```

## Available Scripts
- `npm run dev`: Start development server with nodemon.
- `npm start`: Start production server.
