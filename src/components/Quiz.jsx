import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Timer, LogOut, CheckCircle2, Trophy, HelpCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';

/**
 * Quiz Component - Phase 2 (Bug Fixed, Synchronized & Safe Transitions)
 * Coordinates the 10-question session, counting down 30s per question,
 * auto-advancing on timeouts, updating live score tracking headers, and
 * displaying difficulty level tags.
 */
export default function Quiz({
  username,
  quizQuestions,
  onQuizFinished,
  onQuitQuiz,
  category,
  difficulty
}) {
  const totalQuestions = quizQuestions.length;
  
  // Active Question index
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Track answer selections: { selectedOption: string | null, isSubmitted: boolean }
  const [answersState, setAnswersState] = useState(
    Array.from({ length: totalQuestions }, () => ({
      selectedOption: null,
      isSubmitted: false
    }))
  );

  // Sync ref to read latest answersState inside setTimeout callbacks without closures locking
  const answersStateRef = useRef(answersState);
  useEffect(() => {
    answersStateRef.current = answersState;
  }, [answersState]);

  // Sync ref to track currentIdx safely in asynchronous setTimeout callbacks without side-effects in setters
  const currentIdxRef = useRef(currentIdx);
  useEffect(() => {
    currentIdxRef.current = currentIdx;
  }, [currentIdx]);

  // Overlay states
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  // Timer Configuration (30 seconds per question)
  const SECONDS_PER_QUESTION = 30;
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const timerRef = useRef(null);
  const transitionTimeoutRef = useRef(null); // Clears the 1.5s timeout on unmounts

  const currentQuestion = quizQuestions[currentIdx];
  const currentAnswerState = answersState[currentIdx];

  // Derive stats dynamically from answersState to prevent race conditions
  const currentScore = answersState.filter((ans, idx) => {
    return ans.isSubmitted && ans.selectedOption === quizQuestions[idx].answer;
  }).length;

  const progressPercentage = Math.round(((currentIdx + (currentAnswerState.isSubmitted ? 1 : 0)) / totalQuestions) * 100);

  // Start timer logic
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    setIsAutoAdvancing(false);

    // If this question is already submitted, lock timer at 0
    if (currentAnswerState.isSubmitted) {
      setTimeLeft(0);
      return;
    }

    // Reset countdown to default 30 seconds
    setTimeLeft(SECONDS_PER_QUESTION);

    // Set interval to count down
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0; // Return 0, the side-effect is handled by the dedicated useEffect
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [currentIdx, currentAnswerState.isSubmitted]);

  // Side-effect handler for when timeLeft hits 0 to trigger timeout auto-advance
  useEffect(() => {
    if (timeLeft === 0 && !currentAnswerState.isSubmitted && !isAutoAdvancing) {
      if (timerRef.current) clearInterval(timerRef.current);
      handleTimeoutTrigger();
    }
  }, [timeLeft, currentAnswerState.isSubmitted, isAutoAdvancing]);

  // Handle option selection
  const handleSelectOption = (option) => {
    if (currentAnswerState.isSubmitted || isAutoAdvancing) return; // Locked
    
    setAnswersState((prev) => {
      const copy = [...prev];
      copy[currentIdx] = {
        ...copy[currentIdx],
        selectedOption: option
      };
      return copy;
    });
  };

  // Submit Answer (manually clicked)
  const handleSubmitAnswer = () => {
    if (currentAnswerState.isSubmitted || isAutoAdvancing) return;
    if (!currentAnswerState.selectedOption) return; // Locked

    if (timerRef.current) clearInterval(timerRef.current);

    setAnswersState((prev) => {
      const copy = [...prev];
      copy[currentIdx] = {
        ...copy[currentIdx],
        isSubmitted: true
      };
      return copy;
    });
  };

  // Handle timer running out to zero
  const handleTimeoutTrigger = () => {
    setIsAutoAdvancing(true);
    
    // 1. Mark current question as submitted
    setAnswersState((prev) => {
      // If already submitted by a quick user double-trigger, do nothing
      if (prev[currentIdx].isSubmitted) return prev;

      const copy = [...prev];
      copy[currentIdx] = {
        ...copy[currentIdx],
        isSubmitted: true
      };
      return copy;
    });

    // 2. Wait 1.5 seconds so user can see correct feedback, then auto-advance
    transitionTimeoutRef.current = setTimeout(() => {
      autoAdvance();
    }, 1500);
  };

  // Auto-advance helper - Using refs to safely perform side-effects outside of state updaters
  const autoAdvance = () => {
    const idx = currentIdxRef.current;
    if (idx < totalQuestions - 1) {
      setTimeLeft(SECONDS_PER_QUESTION); // Reset timer state
      setCurrentIdx(idx + 1); // Advance page index
    } else {
      // Complete the quiz using latest ref answersState
      triggerFinishedQuiz();
    }
  };

  // Complete Quiz trigger
  const triggerFinishedQuiz = () => {
    const finalAnswers = quizQuestions.map((q, idx) => ({
      ...q,
      selectedOption: answersStateRef.current[idx].selectedOption,
      isCorrect: answersStateRef.current[idx].selectedOption === q.answer
    }));

    const computedScore = finalAnswers.filter((ans) => ans.isCorrect).length;

    onQuizFinished({
      score: computedScore,
      total: totalQuestions,
      answers: finalAnswers
    });
  };

  // Manual Next Navigation
  const handleNext = () => {
    if (!currentAnswerState.isSubmitted) return;

    if (currentIdx < totalQuestions - 1) {
      setTimeLeft(SECONDS_PER_QUESTION); // Reset timer state
      setCurrentIdx((prev) => prev + 1);
    } else {
      triggerFinishedQuiz();
    }
  };

  // Manual Previous Navigation
  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  // Difficulty badge coloring
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
      
      {/* Quiz Top Navbar Header */}
      <header className="w-full flex items-center justify-between py-5 px-4 md:px-8 max-w-5xl mx-auto border-b border-slate-100 dark:border-slate-800/80 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              ThinkFastQuiz
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              Player: {username || "Guest"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            <span className="text-xs font-semibold px-2 py-0.5 rounded border capitalize bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-850">
              {category}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border capitalize ${getDifficultyBadge(difficulty)}`}>
              {difficulty}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setShowQuitConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 cursor-pointer font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Quit
        </button>
      </header>

      {/* Main Content Dashboard Area */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 md:py-10 w-full flex flex-col items-center">
        
        {/* Progress HUD Panel */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm mb-6 transition-all duration-300">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center items-center justify-between text-xs font-bold text-slate-455 tracking-wider font-sans">
            
            {/* HUD: Question */}
            <div className="flex flex-col border-r border-slate-100 dark:border-slate-800">
              <span className="text-slate-450 dark:text-slate-500 text-[10px]">QUESTION</span>
              <span className="text-sm text-slate-800 dark:text-white mt-0.5">
                {currentIdx + 1} <span className="text-[10px] text-slate-400 font-normal">/ {totalQuestions}</span>
              </span>
            </div>

            {/* HUD: Remaining */}
            <div className="flex flex-col border-r border-slate-100 dark:border-slate-800">
              <span className="text-slate-455 dark:text-slate-500 text-[10px]">REMAINING</span>
              <span className="text-sm text-slate-800 dark:text-white mt-0.5">
                {totalQuestions - currentIdx - 1}
              </span>
            </div>

            {/* HUD: Live Score */}
            <div className="flex flex-col border-r border-slate-100 dark:border-slate-800">
              <span className="text-slate-455 dark:text-slate-500 text-[10px]">CURRENT SCORE</span>
              <span className="text-sm text-indigo-600 dark:text-indigo-400 mt-0.5">
                {currentScore} <span className="text-[10px] text-slate-400 font-normal">/ {totalQuestions}</span>
              </span>
            </div>

            {/* HUD: Accuracy */}
            <div className="flex flex-col">
              <span className="text-slate-455 dark:text-slate-500 text-[10px]">ACCURACY</span>
              <span className="text-sm text-slate-800 dark:text-white mt-0.5">
                {currentIdx > 0 ? Math.round((currentScore / (currentIdx + (currentAnswerState.isSubmitted ? 1 : 0))) * 100) : 0}%
              </span>
            </div>

          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <ProgressBar current={currentIdx + (currentAnswerState.isSubmitted ? 1 : 0)} total={totalQuestions} />
          </div>
        </div>

        {/* Timer Bar */}
        {!currentAnswerState.isSubmitted && !isAutoAdvancing && (
          <div className={`w-full flex items-center justify-between gap-4 py-3 px-5 rounded-2xl mb-6 border font-semibold text-sm transition-all duration-300 shadow-sm
            ${timeLeft <= 8 
              ? 'bg-rose-50 border-rose-250 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400 animate-pulse'
              : 'bg-indigo-50/50 border-indigo-100/20 text-indigo-700 dark:bg-indigo-950/10 dark:border-indigo-900/20 dark:text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Timer className={`w-4 h-4 ${timeLeft <= 8 ? 'animate-bounce text-rose-500' : 'text-indigo-500 dark:text-indigo-400'}`} />
              <span>Time Remaining: {timeLeft}s</span>
            </div>
            
            {/* Visual Mini Loading/Timer bar inside wrapper */}
            <div className="w-24 bg-slate-100 dark:bg-slate-950/50 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear rounded-full 
                  ${timeLeft <= 8 ? 'bg-rose-500' : 'bg-indigo-500 dark:bg-indigo-400'}`}
                style={{ width: `${(timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Timeout Indicator Overlay (for 1.5s delay transitions) */}
        {isAutoAdvancing && (
          <div className="w-full py-3 px-5 rounded-2xl mb-6 border bg-rose-50 border-rose-250 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400 font-bold text-sm animate-pulse text-center">
            ⌛ Time's Up! Advancing to the next question...
          </div>
        )}

        {/* Question Card Box */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-100/30 dark:shadow-none transition-all duration-300">
          <QuestionCard
            question={currentQuestion}
            selectedOption={currentAnswerState.selectedOption}
            onSelectOption={handleSelectOption}
            isSubmitted={currentAnswerState.isSubmitted}
          />
        </div>

        {/* Navigation Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentIdx === 0 || isAutoAdvancing}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl flex items-center justify-center gap-2 border font-bold text-sm transition-all duration-300 cursor-pointer
              ${(currentIdx === 0 || isAutoAdvancing) 
                ? 'border-slate-100 dark:border-slate-800/40 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                : 'border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow'
              }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Action Trigger: Submit or Next */}
          <div className="w-full sm:w-auto flex items-center gap-3">
            
            {/* Check/Submit Button */}
            {!currentAnswerState.isSubmitted && (
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswerState.selectedOption || isAutoAdvancing}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-sm transition-all duration-300 cursor-pointer
                  ${(!currentAnswerState.selectedOption || isAutoAdvancing)
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95'
                  }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Answer
              </button>
            )}

            {/* Next / Show Results */}
            {currentAnswerState.isSubmitted && (
              <button
                onClick={handleNext}
                disabled={isAutoAdvancing}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>
                  {currentIdx === totalQuestions - 1 ? 'View Results' : 'Next Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>

      </main>

      {/* Custom Confirmation Modal for Quit */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl max-w-sm w-full shadow-2xl text-center transform scale-100 transition-transform duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Quit Quiz?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to quit? Your current quiz progress will be lost and you will return to the home screen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowQuitConfirm(false);
                  onQuitQuiz();
                }}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm shadow-md shadow-rose-600/10 transition-all duration-300 cursor-pointer"
              >
                Yes, Quit
              </button>
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all duration-300 cursor-pointer shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
