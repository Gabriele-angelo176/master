import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('strive-blog-token') || '');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('strive-blog-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('strive-blog-token', token);
    } else {
      localStorage.removeItem('strive-blog-token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('strive-blog-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('strive-blog-user');
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    const userFromUrl = params.get('user');

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      if (userFromUrl) {
        try {
          const parsed = JSON.parse(decodeURIComponent(userFromUrl));
          setUser(parsed);
        } catch (error) {
          console.error('Failed to parse Google user from URL', error);
        }
      }
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchCurrentUser = async () => {
    if (!token) return null;

    try {
      const result = await apiFetch('/auth/me');
      setUser(result.user);
      return result.user;
    } catch (error) {
      setToken('');
      setUser(null);
      return null;
    }
  };

  const login = async (email, password) => {
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const register = async (name, email, password) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      register,
      logout,
      fetchCurrentUser,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
