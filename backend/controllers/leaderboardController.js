import User from '../models/User.js';

export const getGlobalLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ xp: { $gt: 0 } })
      .select('name avatar xp level bestScore totalQuizzesCompleted')
      .sort({ xp: -1 })
      .limit(100);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch global leaderboard', error: error.message });
  }
};
