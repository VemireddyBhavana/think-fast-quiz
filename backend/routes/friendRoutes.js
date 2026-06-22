import express from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
  getFriends
} from '../controllers/friendController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/request', sendFriendRequest);
router.post('/request/:id/accept', acceptFriendRequest);
router.post('/request/:id/reject', rejectFriendRequest);
router.get('/requests', getPendingRequests);
router.get('/', getFriends);

export default router;
