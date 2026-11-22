import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'New Chat',
      maxLength: 100,
    },
    model: {
      type: String,
      default: 'gemini-flash-lite-latest',
    },
    systemPrompt: {
      type: String,
      default: 'You are a helpful, thoughtful, and precise AI assistant.',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly sort recent conversations
conversationSchema.index({ updatedAt: -1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);
