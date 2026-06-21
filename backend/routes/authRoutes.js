import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Additional features like forgot password can be added here
router.post('/logout', (req, res) => {
  // Since we use stateless JWT, logout is primarily handled on frontend by removing token.
  // We just return a success message.
  res.json({ message: 'Logged out successfully' });
});

export default router;
