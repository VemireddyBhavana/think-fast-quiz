// Open Trivia DB API URL
const BASE_URL = 'https://opentdb.com/api.php';

/**
 * Fetches questions from OpenTDB
 * @param {number} amount 
 * @param {number} categoryId 
 * @param {string} difficulty 
 * @returns {Promise<Array>} List of questions
 */
export const fetchQuestions = async (amount = 10, categoryId = null, difficulty = null) => {
  let url = `${BASE_URL}?amount=${amount}&type=multiple`;
  
  if (categoryId) {
    url += `&category=${categoryId}`;
  }
  
  if (difficulty) {
    url += `&difficulty=${difficulty}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // OpenTDB Error Codes
    // 0 = Success
    // 1 = No Results
    // 2 = Invalid Parameter
    // 3 = Token Not Found
    // 4 = Token Empty
    // 5 = Rate Limit
    if (data.response_code !== 0) {
      if (data.response_code === 1) {
         throw new Error('No results found for these settings. Try a different category or difficulty.');
      } else if (data.response_code === 5) {
         throw new Error('Rate limit exceeded. Please wait a few seconds and try again.');
      } else {
         throw new Error(`API Error Code: ${data.response_code}`);
      }
    }
    
    return data.results;
  } catch (error) {
    throw error;
  }
};
