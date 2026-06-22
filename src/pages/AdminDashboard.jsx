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
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500">
                <HelpCircle className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Question Management</h3>
                <p>Use this interface to add, edit, and approve questions for the custom DB. (UI for CRUD operations would go here).</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
