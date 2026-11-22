import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

/**
 * List all conversations sorted by latest activity
 */
export const getAllConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json(ApiResponse.success(conversations));
  } catch (error) {
    next(error);
  }
};

/**
 * Get single conversation by ID with all its messages
 */
export const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id).lean();
    if (!conversation) {
      throw ApiError.notFound('Conversation not found');
    }

    const messages = await Message.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json(
      ApiResponse.success({
        conversation,
        messages,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (req, res, next) => {
  try {
    const { title, model, systemPrompt } = req.body;

    const conversation = await Conversation.create({
      title: title || 'New Chat',
      model: model || 'gpt-4o-mini',
      systemPrompt: systemPrompt || 'You are a helpful, thoughtful, and precise AI assistant.',
    });

    return res.status(201).json(ApiResponse.created(conversation));
  } catch (error) {
    next(error);
  }
};

/**
 * Update conversation title or settings
 */
export const updateConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, model, systemPrompt } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(
      id,
      {
        ...(title && { title: title.trim() }),
        ...(model && { model }),
        ...(systemPrompt && { systemPrompt }),
      },
      { new: true }
    );

    if (!conversation) {
      throw ApiError.notFound('Conversation not found');
    }

    return res.status(200).json(ApiResponse.success(conversation, 'Updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete conversation and its associated messages
 */
export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findByIdAndDelete(id);
    if (!conversation) {
      throw ApiError.notFound('Conversation not found');
    }

    // Delete all related messages
    await Message.deleteMany({ conversationId: id });

    return res.status(200).json(ApiResponse.success(null, 'Conversation deleted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Clear all conversations
 */
export const clearAllConversations = async (req, res, next) => {
  try {
    await Conversation.deleteMany({});
    await Message.deleteMany({});

    return res.status(200).json(ApiResponse.success(null, 'All conversations cleared successfully'));
  } catch (error) {
    next(error);
  }
};
