export const calculateAnalytics = (history) => {
  if (!history || history.length === 0) {
    return {
      totalQuizzes: 0,
      bestScore: 0,
      averageScore: 0,
      lastScore: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      accuracy: 0,
      bestCategory: 'N/A',
      weakestCategory: 'N/A',
    };
  }

  let totalQuizzes = history.length;
  let bestScore = 0;
  let totalScore = 0;
  let lastScore = history[0].score;
  let totalCorrect = 0;
  let totalIncorrect = 0;

  // Track category performance
  const categoryStats = {};

  history.forEach(game => {
    // Basic stats
    if (game.score > bestScore) bestScore = game.score;
    totalScore += game.score;
    totalCorrect += game.score;
    totalIncorrect += (game.total - game.score);

    // Category stats
    if (!categoryStats[game.category]) {
      categoryStats[game.category] = { correct: 0, total: 0 };
    }
    categoryStats[game.category].correct += game.score;
    categoryStats[game.category].total += game.total;
  });

  const averageScore = Math.round(totalScore / totalQuizzes);
  const totalQuestions = totalCorrect + totalIncorrect;
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Determine best and weakest categories based on accuracy
  let bestCategory = 'N/A';
  let weakestCategory = 'N/A';
  let highestAcc = -1;
  let lowestAcc = 101;

  Object.entries(categoryStats).forEach(([cat, stats]) => {
    if (stats.total > 0) {
      const acc = stats.correct / stats.total;
      if (acc > highestAcc) {
        highestAcc = acc;
        bestCategory = cat;
      }
      if (acc < lowestAcc) {
        lowestAcc = acc;
        weakestCategory = cat;
      }
    }
  });

  return {
    totalQuizzes,
    bestScore,
    averageScore,
    lastScore,
    totalCorrect,
    totalIncorrect,
    accuracy,
    bestCategory,
    weakestCategory
  };
};
