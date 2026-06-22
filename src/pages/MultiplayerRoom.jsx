import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Users, Send, Crown, Play, X, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MultiplayerRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useAuth();
  
  const [roomState, setRoomState] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', { roomId, user }, (response) => {
      if (!response.success) {
        toast.error(response.message);
        navigate('/multiplayer');
      } else {
        setRoomState(response.roomState);
      }
    });

    socket.on('roomUpdated', (state) => {
      setRoomState(state);
    });

    socket.on('quizStarted', (state) => {
      setRoomState(state);
      toast.success("Quiz is starting!");
      // Logic to actually transition to the live quiz view goes here
    });

    socket.on('newChatMessage', (message) => {
      setRoomState(prev => ({
        ...prev,
        chat: [...prev.chat, message]
      }));
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 10);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('roomUpdated');
      socket.off('quizStarted');
      socket.off('newChatMessage');
    };
  }, [socket, roomId, user, navigate]);

  const handleStartQuiz = () => {
    socket.emit('startQuiz', roomId, (response) => {
      if (!response.success) toast.error(response.message);
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    socket.emit('sendChatMessage', { roomId, user, text: chatInput });
    setChatInput('');
  };

  if (!roomState) return <div className="p-8 text-center">Loading Room...</div>;

  const isHost = roomState.host._id === user._id;

  return (
    <div className="max-w-6xl mx-auto p-4 py-8 grid lg:grid-cols-3 gap-8">
      
      {/* Main Room View */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Room Code: <span className="font-mono text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">{roomId}</span>
            </h1>
            <p className="text-slate-500 mt-2">Status: <span className="font-semibold uppercase text-emerald-500">{roomState.status}</span></p>
          </div>
          {isHost && roomState.status === 'waiting' && (
            <button 
              onClick={handleStartQuiz}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105"
            >
              <Play fill="currentColor" /> Start Quiz
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users /> Participants ({roomState.participants.length})</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {roomState.participants.map(p => (
              <div key={p._id} className={`flex items-center gap-4 p-4 rounded-xl border ${p._id === user._id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-lg relative">
                  {p.name.charAt(0)}
                  {p._id === roomState.host._id && (
                    <Crown className="absolute -top-3 -right-2 text-yellow-500 w-6 h-6 rotate-12 drop-shadow-md" fill="currentColor" />
                  )}
                </div>
                <div>
                  <p className="font-bold flex items-center gap-2">
                    {p.name} {p._id === user._id && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>}
                  </p>
                  <p className="text-sm text-slate-500">Level {p.level || 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[600px] overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 font-bold">
          <MessageSquare size={20} /> Room Chat
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4" ref={chatRef}>
          {roomState.chat.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">No messages yet. Say hi! 👋</div>
          ) : (
            roomState.chat.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.user._id === user._id ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-slate-400 mb-1">{msg.user.name}</span>
                <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${msg.user._id === user._id ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-100 dark:bg-slate-700 rounded-bl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex gap-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 outline-none focus:border-blue-500"
          />
          <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
            <Send size={20} />
          </button>
        </form>
      </div>

    </div>
  );
}
