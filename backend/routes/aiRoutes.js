import express from 'express';
import { protect, teacherOrAdmin } from '../middleware/auth.js';
import { generateQuiz } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate', protect, teacherOrAdmin, generateQuiz);

export default router;
