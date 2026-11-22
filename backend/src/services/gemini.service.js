import { genAI, DEFAULT_MODEL } from '../config/gemini.js';
import { ApiError } from '../utils/apiError.js';

export class GeminiService {
  /**
   * Helper to format generic chat messages for Gemini
   */
  static formatContents(messages) {
    let systemInstruction = 'You are a helpful, thoughtful, and precise AI assistant.';
    const contents = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = msg.content;
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Ensure contents start with user role if needed
    if (contents.length > 0 && contents[0].role === 'model') {
      contents.unshift({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    return { systemInstruction, contents };
  }

  /**
   * Non-streaming chat completion
   */
  static async createChatCompletion({ messages, model = DEFAULT_MODEL, temperature = 0.7 }) {
    try {
      const { systemInstruction, contents } = this.formatContents(messages);
      const targetModel = model || DEFAULT_MODEL;
      const generativeModel = genAI.getGenerativeModel({
        model: targetModel,
        systemInstruction,
        generationConfig: { temperature },
      });

      const response = await generativeModel.generateContent({ contents });
      const text = response.response.text();

      return {
        content: text || '',
      };
    } catch (error) {
      console.error('[Gemini Service Error]:', error.message);
      throw ApiError.internal(`Gemini API Error: ${error.message}`);
    }
  }

  /**
   * Streaming chat completion returning an async iterable stream of tokens
   */
  static async createChatStream({ messages, model = DEFAULT_MODEL, temperature = 0.7 }) {
    try {
      const { systemInstruction, contents } = this.formatContents(messages);
      const targetModel = model || DEFAULT_MODEL;
      const generativeModel = genAI.getGenerativeModel({
        model: targetModel,
        systemInstruction,
        generationConfig: { temperature },
      });

      const result = await generativeModel.generateContentStream({ contents });

      async function* generateStream() {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            yield text;
          }
        }
      }

      return generateStream();
    } catch (error) {
      console.error('[Gemini Stream Error]:', error.message);
      throw ApiError.internal(`Gemini Streaming Error: ${error.message}`);
    }
  }

  /**
   * Generate an automated concise title for a new conversation based on the initial message
   */
  static async generateTitle(firstUserMessage) {
    try {
      const generativeModel = genAI.getGenerativeModel({
        model: 'gemini-flash-lite-latest',
        systemInstruction: 'Generate a short, concise conversation title (3 to 6 words maximum, no quotes, no punctuation at end) describing the following user query.',
      });

      const response = await generativeModel.generateContent(firstUserMessage);
      const title = response.response.text().trim();
      return title || firstUserMessage.slice(0, 30);
    } catch (error) {
      return firstUserMessage.slice(0, 30);
    }
  }
}
