# Gemini AI Chat Assistant - Full Stack Architecture

A modern, production-grade, and scalable full-stack AI Chat Assistant application built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB (Mongoose)**, and the **Google Gemini API** (`@google/generative-ai`).

---

## 🏗️ Architecture Overview

The project is structured with a decoupled **Frontend** and **Backend** architecture:

```
AI-Chat-Assistant/
├── backend/                         # Express.js REST & SSE API server
│   ├── src/
│   │   ├── config/                  # DB and Gemini API client configs
│   │   │   ├── db.js                # Mongoose connection logic
│   │   │   └── gemini.js            # Gemini client instance & model definitions
│   │   ├── controllers/             # Request handlers
│   │   │   ├── chat.controller.js   # SSE streaming & standard chat completions
│   │   │   └── conversation.controller.js # Conversation CRUD operations
│   │   ├── middleware/              # Express middlewares
│   │   │   ├── errorHandler.js      # Global API error handler
│   │   │   └── validate.js          # Request payload validation
│   │   ├── models/                  # Mongoose data schemas
│   │   │   ├── Conversation.js      # Conversation metadata, model, timestamp
│   │   │   └── Message.js           # Messages (role, content, token usage)
│   │   ├── routes/                  # API endpoint route definitions
│   │   │   ├── index.js             # Root API router (/api/health, /api/chat, etc.)
│   │   │   ├── chat.routes.js       # Streaming & chat endpoints
│   │   │   └── conversation.routes.js # Conversation history endpoints
│   │   ├── services/                # Business logic & 3rd-party services
│   │   │   ├── gemini.service.js    # Gemini SDK interaction (stream, prompt, title)
│   │   │   └── chat.service.js      # Orchestrator for chat context & DB operations
│   │   ├── utils/                   # Shared utilities
│   │   │   ├── apiResponse.js       # Standardized response envelopes
│   │   │   └── apiError.js          # Custom operational error classes
│   │   └── server.js                # App entrypoint (helmet, cors, morgan, routes)
│   ├── .env                         # Backend environment variables
│   ├── .env.example                 # Backend environment variable template
│   ├── package.json                 # Backend dependencies & scripts
│   └── README.md
│
├── frontend/                        # React 18 + Vite + Tailwind CSS Single Page App
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Modular UI components
│   │   │   ├── chat/                # Chat-specific components
│   │   │   │   ├── ChatContainer.jsx # Main container with message list & input
│   │   │   │   ├── ChatInput.jsx    # Textarea with auto-resize & keyboard shortcuts
│   │   │   │   ├── ChatMessage.jsx  # Markdown renderer with code copy button
│   │   │   │   ├── ModelSelector.jsx # Gemini model selector dropdown
│   │   │   │   └── EmptyState.jsx   # Starter prompts & welcome screen
│   │   │   ├── common/              # Reusable UI components
│   │   │   │   └── LoadingDots.jsx  # Pulsing bouncing loading indicator
│   │   │   ├── layout/              # Layout containers
│   │   │   │   ├── Header.jsx       # Top navigation bar
│   │   │   │   └── MainLayout.jsx   # Split responsive sidebar & chat view
│   │   │   └── sidebar/             # History & navigation components
│   │   │       ├── ConversationItem.jsx # Single conversation list item with delete
│   │   │       └── Sidebar.jsx      # Conversation history drawer & new chat CTA
│   │   ├── context/                 # React Context API for global state
│   │   │   └── ChatContext.jsx      # Chat state, active session, stream reader
│   │   ├── hooks/                   # Custom reusable React hooks
│   │   │   ├── useChat.js           # Hook to consume ChatContext
│   │   │   └── useAutoScroll.js     # Auto-scrolls message list on token stream
│   │   ├── services/                # Network service layer
│   │   │   └── api.js               # Fetch client & SSE stream chunk reader
│   │   ├── utils/                   # Constants and helpers
│   │   │   └── constants.js         # Supported Gemini models & prompt suggestions
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Vite React DOM entrypoint
│   │   └── index.css                # Tailwind directives & typography styling
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite config with API proxy to backend
│   ├── tailwind.config.js           # Tailwind CSS configuration & custom theme
│   ├── postcss.config.js            # PostCSS configuration
│   ├── .env.example                 # Frontend environment variables template
│   ├── package.json                 # Frontend dependencies & scripts
│   └── README.md
│
├── package.json                     # Monorepo runner scripts (concurrent dev)
├── .gitignore                       # Global gitignore
└── README.md                        # Documentation
```

---

## ⚡ Key Features

1. **Token-by-Token Streaming (Server-Sent Events)**:
   - Real-time token streaming directly from Google Gemini to the user interface with low latency.
   - Ability to halt/abort generation in real-time.
2. **Context-Aware Conversations**:
   - Automatically stores conversations and message histories in MongoDB.
   - Automatically crafts concise 3-6 word titles for conversations using Gemini Flash-Lite.
   - Supplies the previous message history as context to maintain conversational coherence.
3. **Markdown & Code Highlighting**:
   - Renders GitHub Flavored Markdown (tables, lists, blockquotes).
   - Dedicated code blocks with language badge and one-click clipboard copying.
4. **Multi-Model Support**:
   - Switch seamlessly between:
     - `gemini-flash-lite-latest` (Fast, lightweight, efficient)
     - `gemini-flash-latest` (Multimodal, high capability)
     - `gemini-pro-latest` (Complex reasoning)
5. **Modern Responsive UI**:
   - Dark mode design with sleek Tailwind styling.
   - Collapsible drawer for mobile devices and split-pane layout for desktops.
   - Auto-resizing textarea and `Enter`/`Shift+Enter` keyboard shortcuts.
6. **Robust Error Handling**:
   - Centralized Express error handler with custom `ApiError` class.
   - Graceful fallback for database disconnection or missing API keys.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas URI
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

### Step 1: Clone and Configure Environment

```bash
# In backend/.env
cd backend
cp .env.example .env
```
Update `backend/.env` with your Gemini API Key:
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/ai-chat-assistant
GEMINI_API_KEY=your_gemini_api_key_here
DEFAULT_MODEL=gemini-flash-lite-latest
```

```bash
# In frontend/.env
cd ../frontend
cp .env.example .env
```

---

### Step 2: Install Dependencies

You can install all dependencies from the root directory or inside each folder:

```bash
# Option A: Install everything from root
npm run install:all

# Option B: Install individually
cd backend && npm install
cd ../frontend && npm install
```

---

### Step 3: Run in Development Mode

#### Run Both Concurrently (Recommended):
From the root directory:
```bash
npm run dev
```

#### Run Individually:
- **Backend**:
  ```bash
  cd backend
  npm run dev
  # Server will run on http://localhost:5001
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  # Vite will run on http://localhost:5173
  ```

Visit **`http://localhost:5173`** in your browser to start chatting!

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `POST` | `/api/chat/stream` | Stream AI response via Server-Sent Events |
| `POST` | `/api/chat/message` | Standard non-streaming chat completion |
| `GET` | `/api/chat/models` | List supported Gemini models |
| `GET` | `/api/conversations` | Get all saved conversations |
| `POST` | `/api/conversations` | Create a new conversation |
| `GET` | `/api/conversations/:id` | Get specific conversation with its messages |
| `PATCH` | `/api/conversations/:id` | Update conversation title or settings |
| `DELETE` | `/api/conversations/:id` | Delete conversation and related messages |
| `DELETE` | `/api/conversations` | Clear all conversations |
