import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || 'dummy-key';

export const genAI = new GoogleGenerativeAI(apiKey);

export const AVAILABLE_MODELS = [
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash-Lite', description: 'Ultra fast, responsive, and lightweight' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash', description: 'Fast, high-capability multimodal model' },
  { id: 'gemini-pro-latest', name: 'Gemini Pro', description: 'Advanced reasoning for complex problems' },
];

export const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'gemini-flash-lite-latest';
