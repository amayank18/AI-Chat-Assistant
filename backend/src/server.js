import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security and utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'AI Chat Assistant API is running',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Connect to Database & Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer();

export default app;
