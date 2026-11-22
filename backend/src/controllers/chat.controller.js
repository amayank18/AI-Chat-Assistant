import { ChatService } from '../services/chat.service.js';
import { GeminiService } from '../services/gemini.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AVAILABLE_MODELS } from '../config/gemini.js';

/**
 * Handle Streaming Chat Completion via Server-Sent Events (SSE)
 */
export const streamChat = async (req, res, next) => {
  try {
    const { conversationId, message, model, systemPrompt } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const {
      conversation,
      userMessage,
      formattedMessages,
      model: selectedModel,
    } = await ChatService.prepareChatContext({
      conversationId,
      message,
      model,
      systemPrompt,
    });

    // Setup headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Send metadata event (conversation info, user message info)
    res.write(
      `data: ${JSON.stringify({
        type: 'meta',
        conversation: {
          id: conversation._id,
          title: conversation.title,
          model: selectedModel,
        },
        userMessage: {
          id: userMessage._id,
          role: userMessage.role,
          content: userMessage.content,
          createdAt: userMessage.createdAt,
        },
      })}\n\n`
    );

    // Call Gemini streaming API
    const stream = await GeminiService.createChatStream({
      messages: formattedMessages,
      model: selectedModel,
    });

    let fullAssistantResponse = '';

    for await (const token of stream) {
      if (token) {
        fullAssistantResponse += token;
        res.write(`data: ${JSON.stringify({ type: 'token', token })}\n\n`);
      }
    }

    // Save final assistant response to database
    const assistantMessage = await ChatService.saveAssistantMessage({
      conversationId: conversation._id,
      content: fullAssistantResponse,
      model: selectedModel,
    });

    // Send final completion event
    res.write(
      `data: ${JSON.stringify({
        type: 'done',
        assistantMessage: {
          id: assistantMessage._id,
          role: assistantMessage.role,
          content: assistantMessage.content,
          createdAt: assistantMessage.createdAt,
        },
      })}\n\n`
    );

    res.end();
  } catch (error) {
    console.error('[Stream Controller Error]:', error);
    if (!res.headersSent) {
      return next(error);
    }
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
    res.end();
  }
};

/**
 * Handle Standard (non-streaming) Chat Completion
 */
export const sendChatMessage = async (req, res, next) => {
  try {
    const { conversationId, message, model, systemPrompt } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const {
      conversation,
      userMessage,
      formattedMessages,
      model: selectedModel,
    } = await ChatService.prepareChatContext({
      conversationId,
      message,
      model,
      systemPrompt,
    });

    const completion = await GeminiService.createChatCompletion({
      messages: formattedMessages,
      model: selectedModel,
    });

    const assistantMessage = await ChatService.saveAssistantMessage({
      conversationId: conversation._id,
      content: completion.content,
      model: selectedModel,
    });

    return res.status(200).json(
      ApiResponse.success({
        conversation: {
          id: conversation._id,
          title: conversation.title,
          model: selectedModel,
        },
        userMessage,
        assistantMessage,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get available Gemini models list
 */
export const getModels = (req, res) => {
  return res.status(200).json(ApiResponse.success(AVAILABLE_MODELS));
};
