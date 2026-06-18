import React, { useState } from 'react';
import { 
  Zap, 
  Sun, 
  Moon, 
  Code, 
  Cpu, 
  Beaker, 
  BookOpen, 
  Compass, 
  Binary, 
  Play, 
  Trophy, 
  User,
  Shield,
  TrendingUp,
  Activity,
  CheckCircle2
} from 'lucide-react';

/**
 * Home Component - Phase 2
 * Dashboard layout containing user stats, category selector,
 * difficulty pills, name onboarding, and a locked Start button.
 */
export default function Home({
  username,
  setUsername,
  theme,
  toggleTheme,
  categories, // Count metadata is calculated in App.jsx
  onStartQuiz,
  stats
}) {
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState(null); // 'easy', 'medium', 'hard'

  // Icon and color mapping for categories
  const getCategoryMeta = (catName) => {
    switch (catName) {
      case 'Web Development':
      case 'HTML':
        return {
          icon: <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
          selectedBg: 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-400',
          hoverBg: 'hover:border-blue-300 dark:hover:border-blue-800',
          textColor: 'text-blue-700 dark:text-blue-400'
        };
      case 'Programming':
        return {
          icon: <Cpu className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
          selectedBg: 'border-violet-500 bg-violet-50/40 dark:bg-violet-950/20 dark:border-violet-400',
          hoverBg: 'hover:border-violet-300 dark:hover:border-violet-800',
          textColor: 'text-violet-700 dark:text-violet-400'
        };
      case 'JavaScript':
        return {
          icon: <Binary className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
          selectedBg: 'border-yellow-500 bg-yellow-50/40 dark:bg-yellow-950/20 dark:border-yellow-400',
          hoverBg: 'hover:border-yellow-300 dark:hover:border-yellow-800',
          textColor: 'text-yellow-700 dark:text-yellow-400'
        };
      case 'CSS':
        return {
          icon: <Beaker className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
          selectedBg: 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-400',
          hoverBg: 'hover:border-emerald-300 dark:hover:border-emerald-800',
          textColor: 'text-emerald-700 dark:text-emerald-400'
        };
      case 'React':
        return {
          icon: <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
          selectedBg: 'border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20 dark:border-cyan-400',
          hoverBg: 'hover:border-cyan-300 dark:hover:border-cyan-800',
          textColor: 'text-cyan-700 dark:text-cyan-400'
        };
      case 'General Knowledge':
        return {
          icon: <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
          selectedBg: 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-400',
          hoverBg: 'hover:border-amber-300 dark:hover:border-amber-800',
          textColor: 'text-amber-700 dark:text-amber-400'
        };
      default:
        return {
          icon: <Zap className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
          selectedBg: 'border-slate-500 bg-slate-50/40 dark:bg-slate-950/20 dark:border-slate-400',
          hoverBg: 'hover:border-slate-300 dark:hover:border-slate-800',
          textColor: 'text-slate-700 dark:text-slate-400'
        };
    }
  };

  const categoriesToShow = [
    'Programming',
    'JavaScript',
    'HTML',
    'CSS',
    'React',
    'General Knowledge'
  ];

  const canStart = selectedCat !== null && selectedDiff !== null;

  const handleBegin = () => {
    if (canStart) {
      onStartQuiz(selectedCat, selectedDiff);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Navigation Header */}
      <header className="w-full flex items-center justify-between py-6 px-4 md:px-8 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-800/80 transition-colors">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/25">
            <Zap className="w-6 h-6 text-white fill-white/10 animate-pulse" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            ThinkFastQuiz
          </span>
        </div>

        <button 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 transition-all duration-300 text-slate-600 dark:text-slate-300 cursor-pointer shadow-sm hover:shadow"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
        </button>
      </header>

      {/* Main Panel */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 md:py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Profile, Nickname & Stats Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          
          {/* Welcome Badge & Nickname input */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl shadow-slate-100/30 dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
                Player Profile
              </h3>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Enter your nickname below. Your high scores and games stats will be saved to your local dashboard.
            </p>

            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. SpeedRunner"
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950/80 outline-none text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:ring-indigo-400/10 dark:focus:border-indigo-400 transition-all duration-300 font-semibold"
            />
          </div>

          {/* Stats Dashboard */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl shadow-slate-100/30 dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/50">
                <Trophy className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
                Stats Dashboard
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* Stat Block: Played */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100/60 dark:border-slate-800/40">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Played</span>
                </div>
                <span className="text-xl font-black text-slate-800 dark:text-white">
                  {stats.total}
                </span>
              </div>

              {/* Stat Block: Best Score */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100/60 dark:border-slate-800/40">
                <div className="flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Best Score</span>
                </div>
                <span className="text-xl font-black text-slate-800 dark:text-white">
                  {stats.best} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </span>
              </div>

              {/* Stat Block: Last Score */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100/60 dark:border-slate-800/40">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Last Score</span>
                </div>
                <span className="text-xl font-black text-slate-800 dark:text-white">
                  {stats.last} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Right Hand: Category & Difficulty Selection Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          
          {/* Main selection container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-100/30 dark:shadow-none transition-all duration-300">
            
            {/* Step 1: Select Category */}
            <div className="mb-8 text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold dark:bg-indigo-500">
                    1
                  </span>
                  Select Category
                </h3>
                {selectedCat && (
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-md">
                    Selected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoriesToShow.map((catName, index) => {
                  const isSelected = selectedCat === catName;
                  const meta = getCategoryMeta(catName);

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedCat(catName)}
                      className={`p-4 text-left border rounded-xl flex items-center justify-between transition-all duration-300 outline-none cursor-pointer group hover:shadow-sm
                        ${isSelected 
                          ? `${meta.selectedBg} border-2 border-indigo-600 dark:border-indigo-400 shadow-md` 
                          : `border-slate-100 bg-white hover:bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/60 ${meta.hoverBg}`
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-105
                          ${isSelected ? 'bg-white/80 dark:bg-slate-950/30' : 'bg-slate-50 dark:bg-slate-950/40'}`}
                        >
                          {meta.icon}
                        </div>
                        <span className={`font-bold text-sm md:text-base ${isSelected ? 'text-indigo-950 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {catName}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Difficulty */}
            <div className="mb-8 text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold dark:bg-indigo-500">
                    2
                  </span>
                  Select Difficulty
                </h3>
                {selectedDiff && (
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-md capitalize">
                    {selectedDiff}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['easy', 'medium', 'hard'].map((diff) => {
                  const isSelected = selectedDiff === diff;
                  let borderStyle = '';
                  let badgeColors = '';

                  if (diff === 'easy') {
                    borderStyle = isSelected 
                      ? 'border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400' 
                      : 'border-slate-100 hover:border-emerald-200 dark:border-slate-800/80 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/5';
                    badgeColors = 'bg-emerald-500 text-white';
                  } else if (diff === 'medium') {
                    borderStyle = isSelected 
                      ? 'border-2 border-amber-500 bg-amber-50/20 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400' 
                      : 'border-slate-100 hover:border-amber-200 dark:border-slate-800/80 hover:bg-amber-50/10 dark:hover:bg-amber-950/5';
                    badgeColors = 'bg-amber-500 text-white';
                  } else {
                    borderStyle = isSelected 
                      ? 'border-2 border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 text-rose-700 dark:text-rose-400' 
                      : 'border-slate-100 hover:border-rose-200 dark:border-slate-800/80 hover:bg-rose-50/10 dark:hover:bg-rose-950/5';
                    badgeColors = 'bg-rose-500 text-white';
                  }

                  return (
                    <button
                      key={diff}
                      onClick={() => setSelectedDiff(diff)}
                      className={`p-3.5 rounded-xl border text-center font-bold text-sm md:text-base capitalize transition-all duration-300 outline-none cursor-pointer
                        ${borderStyle}`}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Launch Block */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
              <button
                disabled={!canStart}
                onClick={handleBegin}
                className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-black text-base md:text-lg shadow-md transition-all duration-300 cursor-pointer
                  ${canStart 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99]' 
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/20'}`}
              >
                <Play className={`w-5 h-5 fill-current ${canStart ? 'animate-pulse' : ''}`} />
                Begin Challenge
              </button>
              
              {!canStart && (
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3 font-semibold">
                  Select a category and difficulty level above to unlock the quiz.
                </p>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-100 dark:border-slate-900/60 mt-auto transition-colors">
        <p>&copy; {new Date().getFullYear()} ThinkFastQuiz. Designed for developer training and speed metrics.</p>
      </footer>
    </div>
  );
}
