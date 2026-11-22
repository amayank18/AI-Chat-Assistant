import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Connect to MongoDB database
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-chat-assistant';
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'ai-chat-assistant',
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    // Don't kill process immediately in dev mode to allow exploring without active mongo instance
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
