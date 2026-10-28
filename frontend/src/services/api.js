import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to attach Sanctum Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartdriving_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiry and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401 Unauthorized: token expired or invalid
      if (error.response.status === 401) {
        localStorage.removeItem('smartdriving_token');
        localStorage.removeItem('smartdriving_user');
        // If not already on login page, emit custom event or allow app to redirect
        if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin')) {
          window.location.href = '/login?expired=1';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

