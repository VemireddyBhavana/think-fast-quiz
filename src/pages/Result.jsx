import React, { useEffect, useState } from 'react';
import { Trophy, Home, RotateCcw, CheckCircle2, XCircle, Percent } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import CertificateView from '../components/CertificateView';

export default function Result({ result }) {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [certificate, setCertificate] = useState(null);

  // If no result is present (e.g. user refreshed the page), navigate home
  useEffect(() => {
    if (!result) navigate('/');
  }, [result, navigate]);

  if (!result) return null;

  const { score, total, answers, category, difficulty } = result;
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    const saveResult = async () => {
      try {
        await apiClient.post('/quiz-attempts', {
          score,
          percentage,
          category,
          difficulty,
          totalQuestions: total,
          correctAnswers: score
        });
        
        // Refresh user to get updated XP, Level, and Streaks
        if (refreshUser) {
          await refreshUser();
        }

        // Generate certificate if passing score (e.g., >= 70%)
        if (percentage >= 70) {
          const certRes = await apiClient.post('/certificates', {
            quizCategory: category || 'General Knowledge',
            score: percentage
          });
          setCertificate(certRes.data);
        }

        setSaved(true);
      } catch (error) {
        console.error("Failed to save quiz attempt or generate certificate:", error);
      }
    };

    if (!saved) {
      saveResult();
    }
  }, [score, percentage, category, difficulty, total, saved, refreshUser]);

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
          <p className="text-blue-100 text-lg">Great job, {user?.name}!</p>
          
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
              onClick={() => navigate('/')}
              className="flex-1 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/30"
           >
             <Home size={20} /> Back to Dashboard
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

        {/* Certificate Section */}
        {certificate && (
          <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">You Earned a Certificate!</h3>
            <p className="text-slate-500 mb-6 text-center">Congratulations on passing with a high score.</p>
            <CertificateView certificate={certificate} user={user} />
          </div>
        )}

      </div>
    </div>
  );
}
