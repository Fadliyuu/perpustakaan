import axios from 'axios';

/**
 * URL backend. Prioritas: .env (VITE_API_BASE_URL).
 * Di dev, jika Anda buka frontend lewat IP LAN (mis. http://192.168.1.5:5173),
 * tanpa .env request ke localhost akan mengarah ke perangkat itu sendiri — gagal.
 * Fallback: host yang sama dengan halaman, port 4000 (backend di PC yang sama).
 */
function resolveApiBase() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv) return fromEnv;

  // Di dev HTTPS + proxy Vite: gunakan path relatif supaya tidak mixed-content.
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return '/api';
  }

  // Fallback produksi
  return `${window?.location?.origin ?? 'http://localhost:4000'}/api`;
}

const API_BASE = resolveApiBase();

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

