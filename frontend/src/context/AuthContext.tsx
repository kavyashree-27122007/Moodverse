import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api' });

// Inject JWT on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mv_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('mv_token'));
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('mv_token');
    if (storedToken) {
      API.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('mv_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Memoize callbacks so consumers only re-render if auth state changes
  const login = useCallback(async (identifier: string, password: string) => {
    const res = await API.post('/auth/login', { identifier, password });
    localStorage.setItem('mv_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('mv_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mv_token');
    setToken(null);
    setUser(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders of all consumers
  const contextValue = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export { API };
