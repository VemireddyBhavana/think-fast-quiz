import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, CheckCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../api/apiClient';

export default function DailyChallenge() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
       <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
          
          <div className="h-48 bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden flex items-center justify-center">
             <button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 bg-black/20 text-white rounded-full hover:bg-black/30 transition-colors">
                <ArrowLeft size={20} />
             </button>
             <Trophy size={100} className="text-white opacity-20 absolute right-0 top-0 transform translate-x-1/4 -translate-y-1/4" />
             <div className="text-center z-10">
                <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Daily Challenge</h1>
                <p className="text-emerald-100 font-medium">Earn exclusive badges by completing tasks!</p>
             </div>
          </div>

          <div className="p-8">
             <div className="flex flex-col gap-4">
                <div className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-colors ${completed ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                         <Star size={24} />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-slate-800 dark:text-white">Early Bird</h3>
                         <p className="text-slate-500 text-sm">Score 50 points before 10 AM</p>
                      </div>
                   </div>
                   {completed ? (
                      <CheckCircle className="text-emerald-500" size={28} />
                   ) : (
                      <button 
                        onClick={async () => {
                           try {
                             await apiClient.post('/challenges/claim', { badge: 'Early Bird' });
                             setCompleted(true);
                             toast.success('Badge unlocked!', { icon: '🏆' });
                           } catch (err) {
                             toast.error('Failed to claim badge');
                           }
                        }}
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/30"
                      >
                         Claim
                      </button>
                   )}
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between opacity-75">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                         <Lock size={20} />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400">Night Owl</h3>
                         <p className="text-slate-400 text-sm">Play 3 multiplayer matches after 10 PM</p>
                      </div>
                   </div>
                </div>

             </div>
          </div>
       </div>
    </div>
  );
}
