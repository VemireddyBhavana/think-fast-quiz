import express from 'express';
import { saveQuizAttempt, getQuizHistory } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All quiz routes require authentication
router.route('/')
  .post(protect, saveQuizAttempt)
  .get(protect, getQuizHistory);

export default router;
