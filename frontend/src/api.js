import axios from 'axios';

// Bisa diatur lewat file .env Vite, misalnya:
// VITE_API_BASE_URL="http://localhost:4000/api"
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses - token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isPublicRoute = currentPath === '/login' || currentPath === '/';
      
      // Only clear token and redirect if we're in a protected route
      // Don't interfere with public routes trying to access data
      if (!isPublicRoute) {
        // Token expired or invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login
        window.location.href = '/login';
      }
      // For public routes, just let the error pass through
      // The component can handle 401 gracefully
    }
    return Promise.reject(error);
  }
);

export default api;


