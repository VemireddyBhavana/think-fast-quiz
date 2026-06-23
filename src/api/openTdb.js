import { getToken, setToken, clearToken } from '../storage/localStore';

// Open Trivia DB API URLs
const BASE_URL = 'https://opentdb.com/api.php';
const TOKEN_URL = 'https://opentdb.com/api_token.php';

export const fetchSessionToken = async () => {
  try {
    const response = await fetch(`${TOKEN_URL}?command=request`);
    const data = await response.json();
    if (data.response_code === 0) {
      setToken(data.token);
      return data.token;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch session token", error);
    return null;
  }
};

export const resetSessionToken = async (token) => {
  try {
    const response = await fetch(`${TOKEN_URL}?command=reset&token=${token}`);
    const data = await response.json();
    if (data.response_code === 0) {
      return data.token;
    }
    return null;
  } catch (error) {
    console.error("Failed to reset session token", error);
    return null;
  }
};

/**
 * Fetches questions from OpenTDB
 * @param {number} amount 
 * @param {number} categoryId 
 * @param {string} difficulty 
 * @returns {Promise<Array>} List of questions
 */
export const fetchQuestions = async (amount = 10, categoryId = null, difficulty = null, retryCount = 0) => {
  let token = getToken();
  if (!token && retryCount === 0) {
    token = await fetchSessionToken();
  }

  let url = `${BASE_URL}?amount=${amount}&type=multiple`;
  
  if (categoryId) {
    url += `&category=${categoryId}`;
  }
  
  if (difficulty) {
    url += `&difficulty=${difficulty}`;
  }

  if (token) {
    url += `&token=${token}`;
  }

  try {
    const response = await fetch(url);
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait 5 seconds and try again.');
    }
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Handle Session Token Expiration or Exhaustion
    if ((data.response_code === 3 || data.response_code === 4) && retryCount < 1) {
      if (data.response_code === 4) {
        // Token Empty: The user has exhausted all possible questions for this criteria
        // We must reset the token
        await resetSessionToken(token);
      } else {
        // Token Not Found: It may have expired due to 6 hours of inactivity
        await fetchSessionToken();
      }
      // Retry the fetch once with the fresh/reset token state
      return await fetchQuestions(amount, categoryId, difficulty, retryCount + 1);
    }
    
    // OpenTDB Error Codes
    // 0 = Success
    // 1 = No Results
    // 2 = Invalid Parameter
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
