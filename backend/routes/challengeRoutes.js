import express from 'express';
import { getDailyChallenge, claimBadge } from '../controllers/challengeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/daily', protect, getDailyChallenge);
router.post('/claim', protect, claimBadge);

export default router;
