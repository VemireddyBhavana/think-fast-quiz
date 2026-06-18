import React, { useState } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Award,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

/**
 * Result Component - Phase 2
 * Displays summary details of the quiz: score, correct/incorrect/timeout counters,
 * selected category/difficulty parameters, Best Score comparisons,
 * and a collapsible question-by-question review panel.
 */
export default function Result({
  username,
  score,
  total,
  answers,
  onRestart,
  onGoHome,
  category,
  difficulty,
  bestScore
}) {
  const percentage = Math.round((score / total) * 100);
  const [showReview, setShowReview] = useState(false);

  // Compute stats details
  const correctCount = score;
  const incorrectCount = total - score;

  // Determine performance messaging
  let performanceText = '';
  let performanceSubtext = '';
  let badgeColor = '';
  let textColor = '';

  if (percentage >= 85) {
    performanceText = 'Excellent';
    performanceSubtext = `Sensational score, ${username || 'Champion'}! You demonstrated absolute mastery over these concepts.`;
    badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40';
    textColor = 'text-emerald-600 dark:text-emerald-400';
  } else if (percentage >= 70) {
    performanceText = 'Good';
    performanceSubtext = `Well played, ${username || 'Explorer'}! A solid display of knowledge, just a few steps away from perfection.`;
    badgeColor = 'bg-indigo-50 text-indigo-600 border-indigo-200/50 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40';
    textColor = 'text-indigo-600 dark:text-indigo-400';
  } else if (percentage >= 50) {
    performanceText = 'Average';
    performanceSubtext = `Nice try, ${username || 'Learner'}! You've got the basics down, but there's room to grow and level up.`;
    badgeColor = 'bg-amber-50 text-amber-600 border-amber-200/50 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40';
    textColor = 'text-amber-600 dark:text-amber-400';
  } else {
    performanceText = 'Needs Improvement';
    performanceSubtext = `Don't be discouraged, ${username || 'Apprentice'}. Every wrong answer is an opportunity to learn. Try again!`;
    badgeColor = 'bg-rose-50 text-rose-600 border-rose-200/50 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40';
    textColor = 'text-rose-600 dark:text-rose-400';
  }

  // Difficulty badge styling
  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-600 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'medium':
        return 'bg-amber-50 text-amber-600 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400';
      case 'hard':
        return 'bg-rose-50 text-rose-600 border-rose-250 dark:bg-rose-950/20 dark:text-rose-400';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-250 dark:bg-slate-950/20 dark:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Header */}
      <header className="w-full flex items-center justify-between py-6 px-4 md:px-8 max-w-5xl mx-auto border-b border-slate-100 dark:border-slate-800/80 transition-colors">
        <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
          ThinkFastQuiz
        </span>
        <button 
          onClick={onGoHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 cursor-pointer font-semibold"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 md:py-12 w-full flex flex-col items-center">
        
        {/* Scorecard Box */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-10 rounded-2xl shadow-xl shadow-slate-100/50 dark:shadow-none transition-all duration-300 text-center flex flex-col items-center mb-8">
          
          {/* Trophy Header */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shadow-inner">
              <Trophy className="w-12 h-12 text-amber-500 fill-amber-500/10 animate-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 p-1.5 rounded-lg text-white shadow-md">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wide border mb-4 shadow-sm ${badgeColor}`}>
            {performanceText}
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">
            Quiz Complete!
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mb-8 leading-relaxed">
            {performanceSubtext}
          </p>

          {/* Detailed Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl mb-8 text-left">
            <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-850 pb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">CATEGORY</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-white capitalize mt-0.5">{category}</span>
            </div>
            <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-850 pb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">DIFFICULTY</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-white capitalize mt-0.5">{difficulty}</span>
            </div>
            <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-850 pb-3 sm:border-b-0 sm:pb-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">BEST SCORE</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{bestScore} <span className="text-xs text-slate-400 font-normal">/ {total}</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">ACCURACY</span>
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{percentage}%</span>
            </div>
          </div>

          {/* Stats Breakdown Card Grid */}
          <div className="grid grid-cols-3 gap-4 w-full mb-8">
            <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-805 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold mb-1">SCORE</span>
              <span className="text-xl font-black text-slate-800 dark:text-white">
                {score} <span className="text-xs text-slate-400">/ {total}</span>
              </span>
            </div>
            <div className="flex flex-col items-center bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/20 p-3 rounded-xl">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mb-1">CORRECT</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{correctCount}</span>
            </div>
            <div className="flex flex-col items-center bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100/30 dark:border-rose-900/20 p-3 rounded-xl">
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold mb-1">INCORRECT</span>
              <span className="text-xl font-black text-rose-600 dark:text-rose-400">{incorrectCount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRestart}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={onGoHome}
              className="flex-1 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Category Dashboard
            </button>
          </div>

        </div>

        {/* Question Review Section */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xl shadow-slate-100/50 dark:shadow-none overflow-hidden transition-all duration-300">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full p-6 flex items-center justify-between font-bold text-slate-800 dark:text-white outline-none cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span>Detailed Question Review</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border border-slate-205">
                {total} Questions
              </span>
            </div>
            {showReview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showReview && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-6 max-h-[400px] overflow-y-auto">
              {answers.map((answer, index) => {
                const isCorrect = answer.isCorrect;
                const hasSelected = answer.selectedOption !== null;

                return (
                  <div 
                    key={index}
                    className={`p-4.5 rounded-xl border text-left transition-colors
                      ${isCorrect 
                        ? 'border-emerald-100 bg-emerald-50/10 dark:border-emerald-950/20 dark:bg-emerald-950/5' 
                        : hasSelected 
                          ? 'border-rose-100 bg-rose-50/10 dark:border-rose-950/20 dark:bg-rose-950/5'
                          : 'border-slate-200 bg-slate-50/20 dark:border-slate-800 dark:bg-slate-950/10'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm md:text-base leading-relaxed">
                        Q{index + 1}. {answer.question}
                      </h4>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : hasSelected ? (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3.5 text-xs md:text-sm">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/40 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-1.5">Correct Answer:</span>
                        {answer.answer}
                      </div>

                      <div className={`p-2 rounded-lg border 
                        ${isCorrect 
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100/40 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300' 
                          : hasSelected 
                            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-100/40 dark:border-rose-900/40 text-rose-900 dark:text-rose-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span className={`font-bold mr-1.5 
                          ${isCorrect 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : hasSelected 
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-550 dark:text-slate-450'
                          }`}
                        >
                          Your Pick:
                        </span>
                        {answer.selectedOption || '(Timed Out)'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
