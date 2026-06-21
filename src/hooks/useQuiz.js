import { useState, useCallback } from 'react';
import { fetchQuestions } from '../api/openTdb';
import { decodeHTMLEntities, shuffleArray } from '../utils/helpers';
import toast from 'react-hot-toast';

export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadQuestions = useCallback(async (amount, categoryId, difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const rawQuestions = await fetchQuestions(amount, categoryId, difficulty);
      
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
      return formattedQuestions;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch questions');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { questions, loading, error, loadQuestions };
};
