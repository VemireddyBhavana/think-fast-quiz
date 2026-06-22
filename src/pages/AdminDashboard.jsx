import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, HelpCircle, BarChart3, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);

  useEffect(() => {
    if (user && !['admin', 'teacher'].includes(user.role)) {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }

    if (user && user.role === 'teacher' && activeTab === 'users') {
      setActiveTab('analytics');
    }

    fetchData();
  }, [user, navigate, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const { data } = await apiClient.get('/admin/analytics');
        setAnalytics(data);
      } else if (activeTab === 'users' && user.role === 'admin') {
        const { data } = await apiClient.get('/admin/users');
        setUsers(data);
      } else if (activeTab === 'questions') {
        const { data } = await apiClient.get('/admin/questions');
        setQuestions(data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUser(userId);
    try {
      await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingUser(null);
    }
  };

  if (!user || !['admin', 'teacher'].includes(user.role)) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-8 px-2">
          <Shield className="text-indigo-600 dark:text-indigo-400" size={32} />
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 size={20} /> Analytics
          </button>
          {user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === 'users' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Users size={20} /> Manage Users
            </button>
          )}
          <button
            onClick={() => setActiveTab('questions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'questions' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle size={20} /> Manage Questions
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 capitalize">{activeTab}</h2>

        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : (
          <div>
            {activeTab === 'analytics' && analytics && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">Total Users</h3>
                  <p className="text-4xl font-bold text-slate-800 dark:text-white">{analytics.totalUsers}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">Total Quizzes</h3>
                  <p className="text-4xl font-bold text-slate-800 dark:text-white">{analytics.totalQuizzes}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-2">Total Questions</h3>
                  <p className="text-4xl font-bold text-slate-800 dark:text-white">{analytics.totalQuestions}</p>
                </div>
              </div>
            )}

            {activeTab === 'users' && user.role === 'admin' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm uppercase">
                        <th className="p-4 font-semibold">Name</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Current Role</th>
                        <th className="p-4 font-semibold">Change Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="p-4 text-slate-800 dark:text-slate-200 font-medium">{u.name}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              u.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                              : u.role === 'teacher' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <select 
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              disabled={updatingUser === u._id || u._id === user._id}
                              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 disabled:opacity-50 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="user">User</option>
                              <option value="teacher">Teacher</option>
                              <option value="admin">Admin</option>
                            </select>
                            {updatingUser === u._id && <RefreshCw size={14} className="inline ml-2 animate-spin text-indigo-500" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><HelpCircle /> AI Quiz Builder</h3>
                  <p className="text-indigo-100 mb-6">Generate custom quiz questions instantly using OpenAI.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="text" 
                      id="ai-topic"
                      placeholder="Enter a topic (e.g. 'JavaScript Basics', 'World War II')"
                      className="flex-1 px-4 py-3 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <select id="ai-difficulty" className="px-4 py-3 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-purple-300">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <button 
                      onClick={async () => {
                        const topic = document.getElementById('ai-topic').value;
                        const difficulty = document.getElementById('ai-difficulty').value;
                        if (!topic) return toast.error('Please enter a topic');
                        
                        toast.loading('Generating with AI...', { id: 'ai-gen' });
                        try {
                          const { data } = await apiClient.post('/ai/generate', { topic, difficulty, amount: 5 });
                          setQuestions([...data, ...questions]);
                          toast.success('Questions generated!', { id: 'ai-gen' });
                        } catch (err) {
                          toast.error('Failed to generate questions', { id: 'ai-gen' });
                        }
                      }}
                      className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 p-6">
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Generated Questions Database</h3>
                   {questions.length === 0 ? (
                     <p className="text-slate-500">No generated questions yet.</p>
                   ) : (
                     <div className="space-y-4">
                       {questions.map((q, idx) => (
                         <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                           <p className="font-bold text-slate-800 dark:text-white mb-2">{q.question}</p>
                           <div className="text-sm">
                             <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Correct: {q.correct_answer}</p>
                             <p className="text-rose-500 dark:text-rose-400">Incorrect: {q.incorrect_answers?.join(', ')}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
