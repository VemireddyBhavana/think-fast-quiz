import express from 'express';
import { getDailyChallenge } from '../controllers/challengeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/daily', protect, getDailyChallenge);

export default router;
