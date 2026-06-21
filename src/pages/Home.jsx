import React, { useState } from 'react';
import { Play, User, Brain, BarChart3, History as HistoryIcon, Moon, Sun } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES, AMOUNTS } from '../utils/constants';
import { useAppContext } from '../context/AppContext';

export default function Home({ onStartQuiz, onGoDashboard, onGoHistory }) {
  const { theme, toggleTheme, username, setUsername } = useAppContext();
  
  const [selectedCategory, setSelectedCategory] = useState(''); // empty = Any Category
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [selectedAmount, setSelectedAmount] = useState(10);

  const handleStart = () => {
    if (!username.trim()) {
      alert("Please enter a username first!");
      return;
    }
    onStartQuiz(selectedAmount, selectedCategory, selectedDifficulty);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-6 right-6 flex gap-4">
        <button
          onClick={onGoHistory}
          className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="Quiz History"
        >
          <HistoryIcon size={24} />
        </button>
        <button
          onClick={onGoDashboard}
          className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          title="User Dashboard"
        >
          <BarChart3 size={24} />
        </button>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-slate-600 dark:text-slate-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800 transition-all duration-300 transform animate-in fade-in zoom-in-95">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 rotate-3">
            <Brain size={40} className="text-white -rotate-3" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            QuizMaster
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Test your knowledge dynamically</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 block">
              Player Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 block">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Any Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 block">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer capitalize"
              >
                <option value="">Any Difficulty</option>
                {DIFFICULTIES.map((diff) => (
                  <option key={diff.id} value={diff.id}>{diff.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 block">
                Amount
              </label>
              <select
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {AMOUNTS.map((amt) => (
                  <option key={amt} value={amt}>{amt} Questions</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!username.trim()}
            className="w-full mt-4 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
          >
            <Play size={24} fill="currentColor" />
            <span>Start Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}
