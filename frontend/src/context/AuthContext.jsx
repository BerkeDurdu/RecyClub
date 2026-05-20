import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('rc_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem('rc_user');
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('rc_token'));
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('rc_guest') === 'true');

  useEffect(() => {
    if (token && !user) {
      api.get('/auth/me').then((r) => {
        setUser(r.data.user);
        localStorage.setItem('rc_user', JSON.stringify(r.data.user));
      }).catch(() => {});
    }
  }, [token, user]);

  async function login(email, password) {
    setLoading(true);
    try {
      const r = await api.post('/auth/login', { email, password });
      setToken(r.data.token);
      setUser(r.data.user);
      setIsGuest(false);
      localStorage.setItem('rc_token', r.data.token);
      localStorage.setItem('rc_user', JSON.stringify(r.data.user));
      localStorage.removeItem('rc_guest');
      return r.data.user;
    } finally { setLoading(false); }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const r = await api.post('/auth/register', payload);
      setToken(r.data.token);
      setUser(r.data.user);
      setIsGuest(false);
      localStorage.setItem('rc_token', r.data.token);
      localStorage.setItem('rc_user', JSON.stringify(r.data.user));
      localStorage.removeItem('rc_guest');
      return r.data.user;
    } finally { setLoading(false); }
  }

  function continueAsGuest() {
    setIsGuest(true);
    localStorage.setItem('rc_guest', 'true');
  }

  function logout() {
    setUser(null);
    setToken(null);
    setIsGuest(false);
    localStorage.removeItem('rc_token');
    localStorage.removeItem('rc_user');
    localStorage.removeItem('rc_guest');
  }

  async function refresh() {
    const r = await api.get('/auth/me');
    setUser(r.data.user);
    localStorage.setItem('rc_user', JSON.stringify(r.data.user));
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, isGuest, login, register, logout, continueAsGuest, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
