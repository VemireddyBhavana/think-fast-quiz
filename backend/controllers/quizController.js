import QuizAttempt from '../models/QuizAttempt.js';

// @desc    Save a quiz attempt
// @route   POST /api/quiz-attempts
// @access  Private
export const saveQuizAttempt = async (req, res) => {
  try {
    const { score, percentage, category, difficulty, totalQuestions, correctAnswers } = req.body;
    
    if (score === undefined || !percentage || !category || !difficulty || !totalQuestions) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      score,
      percentage,
      category,
      difficulty,
      totalQuestions,
      correctAnswers
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's quiz history
// @route   GET /api/quiz-attempts
// @access  Private
export const getQuizHistory = async (req, res) => {
  try {
    const history = await QuizAttempt.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
