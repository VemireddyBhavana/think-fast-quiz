import React, { useEffect } from 'react';
import { Trophy, Home, RotateCcw, CheckCircle2, XCircle, Percent } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { saveQuizToHistory } from '../storage/localStore';

export default function Result({ result, onRestart, onGoHome }) {
  const { username } = useAppContext();
  const { score, total, answers, category, difficulty } = result;
  const percentage = Math.round((score / total) * 100);

  // Save to history on mount
  useEffect(() => {
    saveQuizToHistory({
      date: new Date().toISOString(),
      category: category,
      difficulty: difficulty,
      score: score,
      total: total,
      percentage: percentage
    });
  }, [category, difficulty, percentage, score, total]);

  let feedbackMsg = "";
  if (percentage === 100) feedbackMsg = "Flawless Victory!";
  else if (percentage >= 80) feedbackMsg = "Outstanding Performance!";
  else if (percentage >= 50) feedbackMsg = "Good Effort!";
  else feedbackMsg = "Keep Practicing!";

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-8 animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl ring-4 ring-white/30">
            <Trophy size={48} className="text-yellow-400" />
          </div>
          
          <h2 className="text-3xl font-bold mb-2">{feedbackMsg}</h2>
          <p className="text-blue-100 text-lg">Great job, {username}!</p>
          
          <div className="mt-8 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-5xl font-black">{score}<span className="text-2xl text-blue-200">/{total}</span></p>
              <p className="text-sm text-blue-200 mt-1 uppercase tracking-wider font-semibold">Score</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <p className="text-5xl font-black flex items-center justify-center">{percentage}<Percent size={32}/></p>
              <p className="text-sm text-blue-200 mt-1 uppercase tracking-wider font-semibold">Accuracy</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 flex gap-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
           <button 
              onClick={onRestart}
              className="flex-1 py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center gap-2 hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm"
           >
             <RotateCcw size={20} /> Play Again
           </button>
           <button 
              onClick={onGoHome}
              className="flex-1 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/30"
           >
             <Home size={20} /> Back to Home
           </button>
        </div>

        {/* Review Answers */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Review Answers</h3>
          <div className="space-y-4">
            {answers.map((ans, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${ans.isCorrect ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30' : 'bg-rose-50/50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30'}`}>
                <p className="font-medium text-slate-800 dark:text-slate-200 mb-3">{idx + 1}. {ans.question}</p>
                <div className="space-y-2 text-sm">
                   {!ans.isCorrect && (
                     <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                       <XCircle size={18} className="shrink-0 mt-0.5" />
                       <p>Your answer: <strong>{ans.selected}</strong></p>
                     </div>
                   )}
                   <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-500">
                     <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                     <p>Correct answer: <strong>{ans.correct}</strong></p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
