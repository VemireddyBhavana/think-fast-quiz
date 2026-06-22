import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    // Cloudinary returns the secure_url
    const avatarUrl = req.file.path;
    
    const user = await User.findById(req.user._id);
    user.avatar = avatarUrl;
    await user.save();
    
    res.json({ message: 'Avatar updated successfully', avatar: avatarUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload avatar', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
