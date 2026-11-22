# Backend - AI Chat Assistant API

Node.js + Express + MongoDB backend with OpenAI API integration.

## Features
- **Server-Sent Events (SSE)** for token streaming.
- **Mongoose Models**: `Conversation` and `Message`.
- Automatic title generation using OpenAI.
- Sliding context window (fetches recent conversation history).
- Centralized error handling and standardized API responses.
- Security with Helmet and CORS.

## Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/ai-chat-assistant
OPENAI_API_KEY=your_openai_api_key_here
DEFAULT_MODEL=gpt-4o-mini
```

## Available Scripts
- `npm run dev`: Start development server with nodemon.
- `npm start`: Start production server.
