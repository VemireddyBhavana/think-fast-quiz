import QuizAttempt from '../models/QuizAttempt.js';

// @desc    Save a quiz attempt
// @route   POST /api/quiz-attempts
// @access  Private
import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import Notification from '../models/Notification.js';

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

    // Update User Stats
    const user = await User.findById(req.user._id);
    
    // XP Calculation: Base score * 10 + difficulty multiplier
    let difficultyMultiplier = 1;
    if (difficulty === 'medium') difficultyMultiplier = 1.5;
    if (difficulty === 'hard') difficultyMultiplier = 2;
    const gainedXp = Math.floor(score * 10 * difficultyMultiplier);

    user.xp += gainedXp;
    user.totalQuizzesCompleted += 1;
    user.totalQuestionsAnswered += totalQuestions;
    user.correctAnswers += correctAnswers;

    if (score > user.bestScore) {
      user.bestScore = score;
    }

    // Level calculation (e.g., Level = Math.floor(sqrt(xp) * 0.1) + 1)
    user.level = Math.floor(Math.sqrt(user.xp) * 0.1) + 1;

    // Streak logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = user.streak.lastActive ? new Date(user.streak.lastActive) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);

    if (!lastActive) {
      user.streak.current = 1;
      user.streak.longest = 1;
    } else {
      const diffTime = Math.abs(today - lastActive);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak.current += 1;
        if (user.streak.current > user.streak.longest) {
          user.streak.longest = user.streak.current;
        }
      } else if (diffDays > 1) {
        user.streak.current = 1;
      }
    }
    user.streak.lastActive = new Date();

    await user.save();

    res.status(201).json({ attempt, gainedXp, newLevel: user.level, streak: user.streak.current });
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
