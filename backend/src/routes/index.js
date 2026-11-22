import { Router } from 'express';
import chatRoutes from './chat.routes.js';
import conversationRoutes from './conversation.routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Modular Routes
router.use('/chat', chatRoutes);
router.use('/conversations', conversationRoutes);

export default router;
