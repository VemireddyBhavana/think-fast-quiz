import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Users, PlusCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MultiplayerLobby() {
  const { socket } = useContext(SocketContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = () => {
    if (!socket) {
      toast.error("Socket not connected. Please try again.");
      return;
    }
    
    setIsCreating(true);
    socket.emit('createRoom', { user, config: { categoryId: '', difficulty: '', amount: 10 } }, (response) => {
      setIsCreating(false);
      if (response.success) {
        navigate(`/multiplayer/${response.roomId}`);
      } else {
        toast.error("Failed to create room.");
      }
    });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinCode) return;
    navigate(`/multiplayer/${joinCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
        <Users className="w-16 h-16 text-blue-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">Multiplayer Quiz</h1>
        <p className="text-slate-500 mb-8">Challenge your friends in real-time!</p>

        <div className="space-y-6">
          <button 
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all"
          >
            <PlusCircle size={20} /> {isCreating ? 'Creating...' : 'Create New Room'}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR JOIN EXISTING</span>
            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
          </div>

          <form onSubmit={handleJoinRoom} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter Room Code" 
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-center font-mono uppercase tracking-widest outline-none focus:border-blue-500"
              maxLength={8}
            />
            <button 
              type="submit" 
              className="px-6 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold flex items-center justify-center transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
