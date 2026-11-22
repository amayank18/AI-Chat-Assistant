import { Router } from 'express';
import { streamChat, sendChatMessage, getModels } from '../controllers/chat.controller.js';

const router = Router();

// POST /api/chat/stream - SSE Streaming response (Token-by-token)
router.post('/stream', streamChat);

// POST /api/chat/message - Standard non-streaming response
router.post('/message', sendChatMessage);

// GET /api/chat/models - List available models
router.get('/models', getModels);

export default router;
