import React from 'react';

/**
 * ProgressBar Component
 * Shows a animated, responsive progress bar representing the user's progress through the quiz.
 */
export default function ProgressBar({ current, total }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
          Quiz Progress
        </span>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 transition-colors">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-3 rounded-full overflow-hidden shadow-inner border border-slate-200/50 dark:border-slate-700/50 transition-colors">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 dark:from-violet-400 dark:to-indigo-500 rounded-full transition-all duration-500 ease-out shadow-md shadow-indigo-500/20"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
