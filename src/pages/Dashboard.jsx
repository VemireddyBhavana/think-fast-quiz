import React, { useEffect, useState } from 'react';
import { getHistory } from '../storage/localStore';
import { calculateAnalytics } from '../services/analyticsService';
import { ArrowLeft, Trophy, Target, BarChart2, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard({ onGoHome }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const history = getHistory();
    setAnalytics(calculateAnalytics(history));
  }, []);

  if (!analytics) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800 transition-all duration-300 transform animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onGoHome}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            User Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<Target className="text-blue-500" />} title="Total Quizzes" value={analytics.totalQuizzes} />
          <StatCard icon={<Trophy className="text-yellow-500" />} title="Best Score" value={analytics.bestScore} />
          <StatCard icon={<BarChart2 className="text-indigo-500" />} title="Average Score" value={analytics.averageScore} />
          <StatCard icon={<CheckCircle className="text-emerald-500" />} title="Total Correct" value={analytics.totalCorrect} />
          <StatCard icon={<XCircle className="text-rose-500" />} title="Total Incorrect" value={analytics.totalIncorrect} />
          <StatCard icon={<Target className="text-purple-500" />} title="Accuracy" value={`${analytics.accuracy}%`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Best Category</h3>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{analytics.bestCategory}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Weakest Category</h3>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{analytics.weakestCategory}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}
