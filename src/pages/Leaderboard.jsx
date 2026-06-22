import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Skeleton } from '../components/ui/Skeleton';
import { Trophy, Medal, Crown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await apiClient.get('/leaderboard/global');
        setLeaders(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <Trophy className="w-10 h-10 text-yellow-500" />
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Global Leaderboard</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Rank</th>
                    <th className="p-4 font-semibold">Player</th>
                    <th className="p-4 font-semibold text-center">Level</th>
                    <th className="p-4 font-semibold text-center">XP</th>
                    <th className="p-4 font-semibold text-center">Quizzes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {leaders.map((user, index) => (
                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold">
                          {index === 0 ? <Crown className="text-yellow-500" /> :
                           index === 1 ? <Medal className="text-slate-400" /> :
                           index === 2 ? <Medal className="text-amber-600" /> :
                           <span className="text-slate-500">{index + 1}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-medium text-slate-600 dark:text-slate-400">{user.level || 1}</td>
                      <td className="p-4 text-center font-bold text-blue-600 dark:text-blue-400">{user.xp || 0}</td>
                      <td className="p-4 text-center font-medium text-slate-600 dark:text-slate-400">{user.totalQuizzesCompleted || 0}</td>
                    </tr>
                  ))}
                  {leaders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">
                        No leaderboard data available yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
