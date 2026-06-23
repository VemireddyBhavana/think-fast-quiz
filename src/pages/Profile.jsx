import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Mail, Save, LogOut, Star, Zap, Award, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../api/apiClient';

export default function Profile() {
  const { user, updateProfile, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ name, email });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-4 pb-12 flex flex-col items-center">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 mt-4">
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors font-medium"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800 md:col-span-1">
          <div className="text-center mb-8 relative group">
            <img src={user?.avatar} alt="Profile" className="w-32 h-32 rounded-full mx-auto shadow-md mb-4 object-cover border-4 border-slate-100 dark:border-slate-800" />
            <label className="absolute bottom-16 right-1/2 translate-x-12 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
              <User size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('avatar', file);
                
                // We'll need apiClient for this, let's assume it's imported above
                try {
                  toast.loading('Uploading avatar...', { id: 'avatar' });
                  const { data } = await apiClient.post('/auth/avatar', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  // Update context
                  updateProfile({ avatar: data.avatar });
                  toast.success('Avatar updated!', { id: 'avatar' });
                } catch (err) {
                  console.error(err);
                  toast.error('Failed to upload avatar', { id: 'avatar' });
                }
              }} />
            </label>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{user?.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Joined: {new Date(user?.createdAt).toLocaleDateString()}</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-2 rounded-full font-bold">
              <Star size={18} /> Level {user?.level || 1}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (name === user?.name && email === user?.email)}
              className="w-full py-3 mt-4 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Stats & Achievements */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                <Award className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{user?.xp || 0}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Total XP</p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-3">
                <Zap className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{user?.streak?.current || 0}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Day Streak</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                <Target className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{user?.totalQuizzesCompleted || 0}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Quizzes Done</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                <Star className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{user?.bestScore || 0}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Best Score</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Badges & Achievements</h2>
            <div className="text-slate-500 dark:text-slate-400 text-sm">
              {user?.badges?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">{badge}</span>
                  ))}
                </div>
              ) : (
                <p>Complete more quizzes to earn badges and achievements!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


