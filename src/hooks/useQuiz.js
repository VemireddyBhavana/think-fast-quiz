import { useState, useCallback, useEffect } from 'react';
import { fetchQuestions } from '../api/openTdb';
import { decodeHTMLEntities, shuffleArray } from '../utils/helpers';
import toast from 'react-hot-toast';

export const useQuiz = (config) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuizData = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    setError(null);
    try {
      const rawQuestions = await fetchQuestions(config.amount, config.category, config.difficulty);
      
      const formattedQuestions = rawQuestions.map((q) => {
        const decodedQuestion = decodeHTMLEntities(q.question);
        const decodedCorrect = decodeHTMLEntities(q.correct_answer);
        const decodedIncorrect = q.incorrect_answers.map(decodeHTMLEntities);
        
        // Combine and shuffle options
        const allOptions = shuffleArray([decodedCorrect, ...decodedIncorrect]);
        
        return {
          question: decodedQuestion,
          correct_answer: decodedCorrect,
          options: allOptions,
          category: decodeHTMLEntities(q.category),
          difficulty: q.difficulty
        };
      });

      setQuestions(formattedQuestions);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  return { questions, loading, error, retry: fetchQuizData };
};
