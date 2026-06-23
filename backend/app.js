import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';

import adminRoutes from './routes/adminRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';

const app = express();

// Middleware (Must be first for Preflight requests)
app.use(cors());
app.use(express.json());

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use('/api', limiter);

import friendRoutes from './routes/friendRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz-attempts', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
