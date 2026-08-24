import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService, RegisterPayload, LoginPayload } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('estate_token');
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (_) {
          localStorage.removeItem('estate_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    localStorage.setItem('estate_token', res.token);
    setUser(res.user);
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authService.register(payload);
    localStorage.setItem('estate_token', res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('estate_token');
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
