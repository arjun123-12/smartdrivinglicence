import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await authService.me();
          setUser(res.user);
        } catch {
          // Token expired or invalid
          setUser(null);
          setToken(null);
          localStorage.removeItem('smartdriving_token');
          localStorage.removeItem('smartdriving_user');
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(formData);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('smartdriving_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin' || user?.is_admin === true,
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

