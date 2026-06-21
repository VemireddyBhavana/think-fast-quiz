import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Will update for prod later
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('thinkfast_user_profile'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
