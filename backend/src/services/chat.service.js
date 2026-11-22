import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { GeminiService } from './gemini.service.js';
import { DEFAULT_MODEL } from '../config/gemini.js';
import { ApiError } from '../utils/apiError.js';

export class ChatService {
  /**
   * Get or create conversation, save user message, prepare message context
   */
  static async prepareChatContext({ conversationId, message, model, systemPrompt }) {
    let conversation;
    const selectedModel = model && model.startsWith('gemini') ? model : DEFAULT_MODEL;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw ApiError.notFound('Conversation not found');
      }
      if (model && model.startsWith('gemini')) {
        conversation.model = model;
      }
    } else {
      // Auto-generate title for new conversation
      const generatedTitle = await GeminiService.generateTitle(message);
      conversation = await Conversation.create({
        title: generatedTitle,
        model: selectedModel,
        systemPrompt: systemPrompt || 'You are a helpful, thoughtful, and precise AI assistant.',
      });
    }

    // Save User Message to MongoDB
    const userMessage = await Message.create({
      conversationId: conversation._id,
      role: 'user',
      content: message,
      model: selectedModel,
    });

    // Update conversation last message timestamp
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Fetch conversation message history (last 20 messages for context)
    const history = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean();

    // Build messages payload for API
    const formattedMessages = [
      {
        role: 'system',
        content: conversation.systemPrompt || 'You are a helpful AI assistant.',
      },
      ...history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    return {
      conversation,
      userMessage,
      formattedMessages,
      model: selectedModel,
    };
  }

  /**
   * Save assistant message to DB after stream completion or response
   */
  static async saveAssistantMessage({ conversationId, content, model, tokensUsed }) {
    const assistantMessage = await Message.create({
      conversationId,
      role: 'assistant',
      content,
      model,
      tokensUsed: tokensUsed || {},
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessageAt: new Date(),
    });

    return assistantMessage;
  }
}
