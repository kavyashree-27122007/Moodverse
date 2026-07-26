import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const baseURL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;
const API = axios.create({ baseURL });

// Inject JWT token on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  points?: number;
  currentStreak?: number;
  aiPersonality?: string;
  achievements?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize user and token synchronously from localStorage so session is instant!
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mv_token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('mv_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Validate or refresh session with backend
  useEffect(() => {
    const storedToken = localStorage.getItem('mv_token');
    if (storedToken) {
      API.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('mv_user', JSON.stringify(res.data));
        })
        .catch((err) => {
          console.warn('[Auth] Server validation failed, using cached session:', err?.message);
          // If token fails, retain cached mv_user so the user is not kicked out unexpectedly!
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await API.post('/auth/login', { identifier, password });
    const userData = res.data;
    localStorage.setItem('mv_token', userData.token);
    localStorage.setItem('mv_user', JSON.stringify(userData));
    setToken(userData.token);
    setUser(userData);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await API.post('/auth/register', data);
    const userData = res.data;
    localStorage.setItem('mv_token', userData.token);
    localStorage.setItem('mv_user', JSON.stringify(userData));
    setToken(userData.token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mv_token');
    localStorage.removeItem('mv_user');
    setToken(null);
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export { API };
