import { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getMe } from '../api/auth';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'tf_user';

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveUser(user) { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); }
function clearUser()    { localStorage.removeItem(STORAGE_KEY); }

export function AuthProvider({ children }) {
  // Restore from localStorage immediately (no flash / loading state)
  const [user, setUser]       = useState(() => loadUser());
  const [loading, setLoading] = useState(true);

  // Verify the cookie is still valid on mount using GET /auth/me
  // If expired → clear state and redirect to login (via 401 interceptor)
  useEffect(() => {
    getMe()
      .then(() => {
        // Cookie is valid — keep the localStorage profile as-is
      })
      .catch(() => {
        // Cookie missing / expired — sign the user out silently
        clearUser();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (data) => {
    const res = await registerUser(data);       // POST /auth/signup
    const profile = { name: data.name, email: data.email };
    saveUser(profile);
    setUser(profile);
    return res;
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await loginUser(credentials);   // POST /auth/login
    const profile = { email: credentials.email };
    saveUser(profile);
    setUser(profile);
    return res;
  }, []);

  // No server-side logout endpoint — clear client state only
  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
