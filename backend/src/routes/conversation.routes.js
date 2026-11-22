import { Router } from 'express';
import {
  getAllConversations,
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversation,
  clearAllConversations,
} from '../controllers/conversation.controller.js';

const router = Router();

router.route('/')
  .get(getAllConversations)
  .post(createConversation)
  .delete(clearAllConversations);

router.route('/:id')
  .get(getConversationById)
  .patch(updateConversation)
  .delete(deleteConversation);

export default router;
