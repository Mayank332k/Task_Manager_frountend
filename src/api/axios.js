import axios from 'axios';

const api = axios.create({
  // Relative baseURL — requests go to the Vite dev server which proxies to Render.
  // This avoids CORS entirely during development.
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// If any protected call returns 401, the session has expired.
// Redirect to login and clear localStorage.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('tf_user');
      // Only redirect if not already on an auth page
      const { pathname } = window.location;
      if (pathname !== '/login' && pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
