import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Users, Send, Crown, Play, MessageSquare, Timer } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchQuestions } from '../api/openTdb';
import { decodeHTMLEntities, shuffleArray } from '../utils/helpers';
import ProgressBar from '../components/ProgressBar';

export default function MultiplayerRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useAuth();
  
  const [roomState, setRoomState] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const chatRef = useRef(null);

  // Live Quiz State
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

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
      toast.success("Quiz is starting!", { icon: '🔥' });
      resetRound();
    });

    socket.on('nextQuestion', (state) => {
      setRoomState(state);
      resetRound();
    });

    socket.on('quizFinished', (state) => {
      setRoomState(state);
      toast.success("Quiz finished!", { icon: '🎉' });
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
      socket.off('nextQuestion');
      socket.off('quizFinished');
      socket.off('newChatMessage');
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [socket, roomId, user, navigate]);

  // Live timer logic
  useEffect(() => {
    if (roomState?.status === 'in-progress' && !isAnswered) {
      if (timeLeft <= 0) {
        handleAnswer(null); // time's up
        return;
      }
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [roomState?.status, timeLeft, isAnswered]);

  const resetRound = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(15);
  };

  const [isStarting, setIsStarting] = useState(false);

  const handleStartQuiz = async () => {
    if (isStarting) return;
    try {
      setIsStarting(true);
      toast.loading("Fetching questions...", { id: 'quiz-fetch' });
      const rawQuestions = await fetchQuestions(roomState.config.amount, roomState.config.categoryId, roomState.config.difficulty);
      
      const formattedQuestions = rawQuestions.map((q) => {
        const decodedQuestion = decodeHTMLEntities(q.question);
        const decodedCorrect = decodeHTMLEntities(q.correct_answer);
        const decodedIncorrect = q.incorrect_answers.map(decodeHTMLEntities);
        const allOptions = shuffleArray([decodedCorrect, ...decodedIncorrect]);
        return {
          question: decodedQuestion,
          correct_answer: decodedCorrect,
          options: allOptions,
          category: decodeHTMLEntities(q.category),
          difficulty: q.difficulty
        };
      });

      socket.emit('startQuiz', { roomId, questions: formattedQuestions }, (response) => {
        toast.dismiss('quiz-fetch');
        setIsStarting(false);
        if (!response.success) toast.error(response.message);
      });
    } catch (err) {
      setIsStarting(false);
      toast.error(err.message || "Failed to fetch questions");
      toast.dismiss('quiz-fetch');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    socket.emit('sendChatMessage', { roomId, user, text: chatInput });
    setChatInput('');
  };

  const handleAnswer = (option) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQuestion = roomState.questions[roomState.currentQuestionIndex];
    const isCorrect = option !== null && option === currentQuestion.correct_answer;
    
    const scoreDelta = isCorrect ? 10 : 0; // Simple scoring
    socket.emit('submitAnswer', { roomId, userId: user._id, scoreDelta });
  };

  if (!roomState) return <div className="p-8 text-center">Loading Room...</div>;

  const isHost = roomState.host._id === user._id;

  // Render Live Quiz
  if (roomState.status === 'in-progress' && roomState.questions) {
    const currentQuestion = roomState.questions[roomState.currentQuestionIndex];
    
    return (
      <div className="max-w-4xl mx-auto p-4 py-8 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4 px-2">
           <div className="flex gap-2 items-center bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200">
             <Users size={18} /> {roomState.participants.length} Players
           </div>
           <div className="flex gap-3">
             <div className={`px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors ${timeLeft <= 5 && !isAnswered ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-slate-600 dark:text-slate-300'}`}>
               <Timer size={16} /> 00:{timeLeft.toString().padStart(2, '0')}
             </div>
             <div className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-lg text-sm font-bold text-blue-600 dark:text-blue-400">
               My Score: {roomState.participants.find(p => p._id === user._id)?.score || 0}
             </div>
           </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 w-full rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800 transition-all duration-300">
          <ProgressBar current={roomState.currentQuestionIndex + 1} total={roomState.questions.length} />
          
          <div className="flex justify-between items-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 mt-4">
            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{currentQuestion.category}</span>
            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              Waiting on {roomState.participants.length - roomState.answersCount} players...
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
               {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let buttonClass = "w-full text-left p-4 rounded-xl border-2 font-medium transition-all duration-300 transform ";
              
              if (!isAnswered) {
                buttonClass += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20";
              } else {
                if (option === currentQuestion.correct_answer) {
                  buttonClass += "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.02] z-10";
                } else if (option === selectedOption) {
                  buttonClass += "bg-rose-500 border-rose-500 text-white opacity-90";
                } else {
                  buttonClass += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(option)}
                  className={buttonClass}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Render Finished State
  if (roomState.status === 'finished') {
    // Sort participants by score descending
    const sortedPlayers = [...roomState.participants].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
      <div className="max-w-3xl mx-auto p-4 py-8 text-center space-y-8">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white">Match Over!</h1>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-4 relative">
            <Crown className="text-white w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{winner?.name} Won!</h2>
          <p className="text-slate-500 mb-8">Score: {winner?.score}</p>

          <div className="space-y-3 max-w-md mx-auto text-left">
            {sortedPlayers.map((p, idx) => (
              <div key={p._id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-400 w-4">{idx + 1}.</span>
                  <span className="font-bold">{p.name}</span>
                </div>
                <span className="font-mono bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-lg">
                  {p.score} pts
                </span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/multiplayer')}
            className="mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  // Render Lobby View
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
              disabled={isStarting}
              className={`px-8 py-3 font-bold rounded-xl flex items-center gap-2 shadow-lg transition-transform ${isStarting ? 'bg-emerald-400 cursor-not-allowed opacity-70 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 hover:scale-105'}`}
            >
              <Play fill="currentColor" /> {isStarting ? 'Loading...' : 'Start Quiz'}
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
