import express from 'express';
import { protect, teacherOrAdmin } from '../middleware/auth.js';
import { generateQuiz } from '../controllers/aiController.js';

import rateLimit from 'express-rate-limit';

const router = express.Router();

// Strict rate limit: Max 10 AI quizzes per hour per IP to prevent OpenAI cost drainage
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: 'AI generation rate limit exceeded. Please try again later.' }
});

router.post('/generate', protect, teacherOrAdmin, aiLimiter, generateQuiz);

export default router;
