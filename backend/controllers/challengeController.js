import Question from '../models/Question.js';
import User from '../models/User.js';

export const getDailyChallenge = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 5 } }]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch daily challenge', error: error.message });
  }
};

export const claimBadge = async (req, res) => {
  try {
    const { badge } = req.body;
    if (!badge) return res.status(400).json({ message: 'Badge name required' });

    const user = await User.findById(req.user._id);
    if (!user.badges.includes(badge)) {
      user.badges.push(badge);
      await user.save();
    }
    
    res.json({ message: 'Badge claimed successfully', badges: user.badges });
  } catch (error) {
    res.status(500).json({ message: 'Failed to claim badge', error: error.message });
  }
};
