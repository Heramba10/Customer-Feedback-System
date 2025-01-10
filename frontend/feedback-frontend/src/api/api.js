import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Backend base URL
  timeout: 5000, // Optional: Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json', // Default headers
    Accept: 'application/json',
  },
});

// Add a request interceptor (optional, for adding auth tokens)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
