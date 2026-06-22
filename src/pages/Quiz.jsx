import React, { useState, useEffect } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Skeleton } from '../components/ui/Skeleton';
import ProgressBar from '../components/ProgressBar';
import { AlertCircle, RefreshCw, XCircle, Timer, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Quiz({ config, setQuizResult }) {
  const { questions, loading, error, retry } = useQuiz(config);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    if (!config) {
      navigate('/');
    }
  }, [config, navigate]);

  useEffect(() => {
    if (loading || error || !questions || questions.length === 0 || isAnswered) return;

    if (timeLeft === 0) {
      handleAnswer(null); // time's up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, loading, error, questions]);

  if (!config) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800">
          <Skeleton className="h-6 w-full mb-8" />
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-20 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
            <AlertCircle className="text-rose-500 w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Oops! Something went wrong.</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{error || "No questions available for the selected criteria."}</p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => navigate('/')}
                className="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={retry}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/30"
              >
                <RefreshCw size={18} /> Retry
              </button>
            </div>
         </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (voiceEnabled && currentQuestion && !isAnswered && !loading && !error) {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentIndex, voiceEnabled, loading, error, isAnswered, currentQuestion]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleAnswer = (option) => {
    if (isAnswered) return;
    window.speechSynthesis.cancel();

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option !== null && option === currentQuestion.correct_answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success("Correct!", { icon: '🔥', duration: 1000 });
    } else {
      if (option === null) {
        toast.error("Time's up!", { icon: '⏰', duration: 1000 });
      } else {
        toast.error("Incorrect!", { icon: '❌', duration: 1000 });
      }
    }

    const answerRecord = {
      question: currentQuestion.question,
      selected: option || "Time's up",
      correct: currentQuestion.correct_answer,
      isCorrect
    };

    setUserAnswers(prev => [...prev, answerRecord]);

    // Delay for UI feedback
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setTimeLeft(15);
      } else {
        // Quiz finished
        setQuizResult({
          score: score + (isCorrect ? 1 : 0),
          total: questions.length,
          answers: [...userAnswers, answerRecord],
          category: currentQuestion.category || "Mixed",
          difficulty: config.difficulty || "Mixed"
        });
        navigate('/result');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl flex justify-between items-center mb-4 px-2">
         <button 
           onClick={() => {
             if (window.confirm("Are you sure you want to quit? Your progress will be lost.")) {
               navigate('/');
             }
           }}
           className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-2 transition-colors font-medium bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-lg"
         >
           <XCircle size={18} /> Quit
         </button>
         <div className="flex gap-3">
           <div className={`px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors ${timeLeft <= 5 ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-slate-600 dark:text-slate-300'}`}>
             <Timer size={16} /> 00:{timeLeft.toString().padStart(2, '0')}
           </div>
           <div className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-lg text-sm font-bold text-blue-600 dark:text-blue-400">
             Score: {score}
           </div>
           <button
             onClick={() => setVoiceEnabled(!voiceEnabled)}
             className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
             title={voiceEnabled ? "Disable Voice" : "Enable Voice"}
           >
             {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
           </button>
         </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        
        <div className="flex justify-between items-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 mt-4">
          <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{currentQuestion.category}</span>
          <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full capitalize">{currentQuestion.difficulty}</span>
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
