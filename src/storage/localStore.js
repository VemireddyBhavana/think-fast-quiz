const HISTORY_KEY = 'thinkfast_history';
const USERNAME_KEY = 'thinkfast_user';
const THEME_KEY = 'thinkfast_theme';
const TOKEN_KEY = 'thinkfast_api_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getHistory = () => {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveQuizToHistory = (quizData) => {
  const history = getHistory();
  const newHistory = [quizData, ...history]; // newest first
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  return newHistory;
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const getUsername = () => {
  return localStorage.getItem(USERNAME_KEY) || '';
};

export const setUsername = (name) => {
  localStorage.setItem(USERNAME_KEY, name);
};

export const getTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};
