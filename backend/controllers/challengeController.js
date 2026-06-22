import Question from '../models/Question.js';

export const getDailyChallenge = async (req, res) => {
  try {
    // Basic daily challenge: pick 5 random questions
    // In a real system, you might set a specific seed based on the date
    const questions = await Question.aggregate([{ $sample: { size: 5 } }]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch daily challenge', error: error.message });
  }
};
