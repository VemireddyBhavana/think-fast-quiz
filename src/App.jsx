import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';

// Pages
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

// Screen constants
const SCREEN_HOME = 'HOME';
const SCREEN_QUIZ = 'QUIZ';
const SCREEN_RESULT = 'RESULT';
const SCREEN_DASHBOARD = 'DASHBOARD';
const SCREEN_HISTORY = 'HISTORY';

export default function App() {
  const [screen, setScreen] = useState(SCREEN_HOME);
  
  // Quiz Setup State
  const [quizConfig, setQuizConfig] = useState({
    amount: 10,
    categoryId: '',
    difficulty: ''
  });
  
  // Quiz Result State
  const [quizResult, setQuizResult] = useState(null);

  const handleStartQuiz = (amount, categoryId, difficulty) => {
    setQuizConfig({ amount, categoryId, difficulty });
    setScreen(SCREEN_QUIZ);
  };

  const handleQuizFinished = (result) => {
    setQuizResult(result);
    setScreen(SCREEN_RESULT);
  };

  const handleRestartQuiz = () => {
    // Keep the same config and just go back to QUIZ screen
    setScreen(SCREEN_QUIZ);
  };

  return (
    <AppProvider>
      <div className="min-h-screen transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100">
        <Toaster position="top-center" />
        
        {screen === SCREEN_HOME && (
          <Home
            onStartQuiz={handleStartQuiz}
            onGoDashboard={() => setScreen(SCREEN_DASHBOARD)}
            onGoHistory={() => setScreen(SCREEN_HISTORY)}
          />
        )}
        
        {screen === SCREEN_QUIZ && (
          <Quiz
            amount={quizConfig.amount}
            categoryId={quizConfig.categoryId}
            difficulty={quizConfig.difficulty}
            onFinished={handleQuizFinished}
            onQuit={() => setScreen(SCREEN_HOME)}
          />
        )}

        {screen === SCREEN_RESULT && quizResult && (
          <Result
            result={quizResult}
            onRestart={handleRestartQuiz}
            onGoHome={() => setScreen(SCREEN_HOME)}
          />
        )}

        {screen === SCREEN_DASHBOARD && (
          <Dashboard onGoHome={() => setScreen(SCREEN_HOME)} />
        )}

        {screen === SCREEN_HISTORY && (
          <History onGoHome={() => setScreen(SCREEN_HOME)} />
        )}
        
      </div>
    </AppProvider>
  );
}
