import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import Friends from './pages/Friends';
import DailyChallenge from './pages/DailyChallenge';

import MultiplayerLobby from './pages/MultiplayerLobby';
import MultiplayerRoom from './pages/MultiplayerRoom';

export default function App() {
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  return (
    <AuthProvider>
      <AppProvider>
        <SocketProvider>
          <div className="min-h-screen transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100">
            <Toaster position="top-center" />
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home setQuizConfig={setQuizConfig} />} />
                  <Route path="/quiz" element={<Quiz config={quizConfig} setQuizResult={setQuizResult} />} />
                  <Route path="/result" element={<Result result={quizResult} />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/friends" element={<Friends />} />
                  <Route path="/challenge" element={<DailyChallenge />} />
                  <Route path="/multiplayer" element={<MultiplayerLobby />} />
                  <Route path="/multiplayer/:roomId" element={<MultiplayerRoom />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </div>
        </SocketProvider>
      </AppProvider>
    </AuthProvider>
  );
}
