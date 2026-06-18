import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';

// Screen constants
const SCREEN_HOME = 'HOME';
const SCREEN_QUIZ = 'QUIZ';
const SCREEN_RESULT = 'RESULT';

/**
 * App Component
 * Coordinates the application state, active screen routing,
 * dark theme toggling, username caching, and game session resets.
 */
export default function App() {
  // Global States
  const [screen, setScreen] = useState(SCREEN_HOME);
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('thinkfast_user') || '';
  });
  
  // Theme state: defaults to dark or system preference, saved to localStorage
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('thinkfast_theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Local Storage Statistics state
  const [stats, setStats] = useState(() => {
    const best = parseInt(localStorage.getItem('thinkfast_best_score') || '0', 10);
    const last = parseInt(localStorage.getItem('thinkfast_last_score') || '0', 10);
    const total = parseInt(localStorage.getItem('thinkfast_total_played') || '0', 10);
    return { best, last, total };
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  // Sync theme changes with HTML class element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0b0f19'; // Keep background matching slate-950/dark layout
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc'; // Keep light background matching slate-50
    }
    localStorage.setItem('thinkfast_theme', theme);
  }, [theme]);

  // Sync username changes with localStorage
  useEffect(() => {
    localStorage.setItem('thinkfast_user', username);
  }, [username]);

  // Extract list of categories and counts dynamically
  const categoriesList = React.useMemo(() => {
    const names = Array.from(new Set(questions.map((q) => q.category)));
    return names.map((name) => ({
      name,
      count: questions.filter((q) => q.category === name).length
    }));
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Start the Quiz with category & difficulty parameters
  const handleStartQuiz = (category, difficulty) => {
    setSelectedCategory(category);
    setSelectedDifficulty(difficulty);
    
    // 1. Filter questions by the selected category
    let categoryPool = questions.filter((q) => q.category === category);
    
    // 2. Separate matching difficulty questions and other difficulties
    const matchingDifficultySet = categoryPool.filter((q) => q.difficulty === difficulty);
    const otherDifficultiesSet = categoryPool.filter((q) => q.difficulty !== difficulty);
    
    // 3. Shuffle both lists separately
    const shuffledMatching = [...matchingDifficultySet].sort(() => 0.5 - Math.random());
    const shuffledOthers = [...otherDifficultiesSet].sort(() => 0.5 - Math.random());
    
    // 4. Combine matching first, then backfill, and select exactly 10 questions
    let selectedSet = [...shuffledMatching, ...shuffledOthers].slice(0, 10);
    
    // 5. Shuffle the selected 10 questions list to prevent predictable patterns
    selectedSet = selectedSet.sort(() => 0.5 - Math.random());
    
    // 6. Randomize options within each question
    const randomizedQuestions = selectedSet.map((q) => {
      const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());
      return {
        ...q,
        options: shuffledOptions
      };
    });

    setQuizQuestions(randomizedQuestions);
    setScreen(SCREEN_QUIZ);
  };

  // Quiz completes: Update Statistics in local storage
  const handleQuizFinished = (result) => {
    setQuizResult(result);
    
    setStats((prev) => {
      const newBest = Math.max(prev.best, result.score);
      const newTotal = prev.total + 1;
      
      localStorage.setItem('thinkfast_best_score', newBest.toString());
      localStorage.setItem('thinkfast_last_score', result.score.toString());
      localStorage.setItem('thinkfast_total_played', newTotal.toString());
      
      return {
        best: newBest,
        last: result.score,
        total: newTotal
      };
    });

    setScreen(SCREEN_RESULT);
  };

  // Restart from result page
  const handleRestartQuiz = () => {
    // Re-initialize with same category & difficulty settings
    handleStartQuiz(selectedCategory, selectedDifficulty);
  };

  // Quit back to home
  const handleQuitQuiz = () => {
    setScreen(SCREEN_HOME);
  };

  const handleGoHome = () => {
    setScreen(SCREEN_HOME);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {screen === SCREEN_HOME && (
        <Home
          username={username}
          setUsername={setUsername}
          theme={theme}
          toggleTheme={toggleTheme}
          categories={categoriesList}
          onStartQuiz={handleStartQuiz}
          stats={stats}
        />
      )}
      
      {screen === SCREEN_QUIZ && (
        <Quiz
          username={username}
          quizQuestions={quizQuestions}
          onQuizFinished={handleQuizFinished}
          onQuitQuiz={handleQuitQuiz}
          category={selectedCategory}
          difficulty={selectedDifficulty}
        />
      )}

      {screen === SCREEN_RESULT && (
        <Result
          username={username}
          score={quizResult.score}
          total={quizResult.total}
          answers={quizResult.answers}
          onRestart={handleRestartQuiz}
          onGoHome={handleGoHome}
          category={selectedCategory}
          difficulty={selectedDifficulty}
          bestScore={stats.best}
        />
      )}
    </div>
  );
}
