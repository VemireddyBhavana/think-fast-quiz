import { useState, useCallback, useEffect } from 'react';
import { fetchQuestions } from '../api/openTdb';
import { decodeHTMLEntities, shuffleArray } from '../utils/helpers';
import toast from 'react-hot-toast';

export const useQuiz = (config) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuizData = useCallback(async (isMounted = { current: true }) => {
    if (!config) return;
    setLoading(true);
    setError(null);
    try {
      const rawQuestions = await fetchQuestions(config.amount, config.category, config.difficulty);
      
      if (!isMounted.current) return;

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
      if (!isMounted.current) return;
      setError(err.message);
      toast.error(err.message || 'Failed to fetch questions');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    const isMounted = { current: true };
    // Add a small debounce to prevent double-fetch in React Strict Mode
    const timeoutId = setTimeout(() => {
      fetchQuizData(isMounted);
    }, 100);

    return () => {
      isMounted.current = false;
      clearTimeout(timeoutId);
    };
  }, [fetchQuizData]);

  return { questions, loading, error, retry: () => fetchQuizData({ current: true }) };
};
