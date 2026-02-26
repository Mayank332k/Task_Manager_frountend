import api from './axios';

// POST /api/auth/signup  (backend uses "signup", not "register")
export const registerUser = (data) => api.post('/auth/signup', data);

// POST /api/auth/login
export const loginUser = (data) => api.post('/auth/login', data);

// GET /api/auth/me  (protected — verifies JWT cookie is still valid)
export const getMe = () => api.get('/auth/me');

// No /logout endpoint on backend — cookie expires naturally (7 days)
// Client-side logout just clears localStorage + state
