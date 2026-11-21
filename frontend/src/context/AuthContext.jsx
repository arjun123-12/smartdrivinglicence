import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const [siteStatusLoaded, setSiteStatusLoaded] = useState(false);

  // Check development mode and load user session on startup
  useEffect(() => {
    async function initAuth() {
      // 1. Fetch live site status
      try {
        const statusRes = await authService.getSiteStatus();
        if (typeof statusRes?.development_mode === 'boolean') {
          setIsDevelopmentMode(statusRes.development_mode);
        }
      } catch (err) {
        console.warn('Could not fetch site development mode status:', err);
      } finally {
        setSiteStatusLoaded(true);
      }

      // 2. If token exists, load current user
      if (token) {
        try {
          const res = await authService.me();
          if (res?.user) {
            setUser(res.user);
          }
        } catch (err) {
          // Invalidate token if rejected by server
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('smartdriving_token');
            localStorage.removeItem('smartdriving_user');
          }
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, [token]);

  const login = async (credentials, options = {}) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials, options);
      const loggedUser = data.user;

      // If secure preview login requested, verify admin or authorized tester privileges
      if (options.isSecureLogin || options.require_preview) {
        const isAdminUser = loggedUser?.is_admin || loggedUser?.role === 'admin';
        const isTesterUser = loggedUser?.is_tester || loggedUser?.role === 'tester' || loggedUser?.can_preview ||
          (loggedUser?.email && ['tester@smartdriving.com.au', 'stripetest@smartdriving.com.au'].includes(loggedUser.email.toLowerCase()));

        if (!isAdminUser && !isTesterUser) {
          localStorage.removeItem('smartdriving_token');
          localStorage.removeItem('smartdriving_user');
          setUser(null);
          setToken(null);
          const error = new Error('Access denied: Only administrators and explicitly authorized testers have preview access during development mode.');
          error.response = { status: 403, data: { message: error.message } };
          throw error;
        }
      }

      setUser(loggedUser);
      setToken(data.token);
      if (typeof data.development_mode === 'boolean') {
        setIsDevelopmentMode(data.development_mode);
      }
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
      localStorage.removeItem('smartdriving_token');
      localStorage.removeItem('smartdriving_user');
      setIsLoading(false);
    }
  };

  const setAuthSession = (newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('smartdriving_token', newToken);
    } else {
      localStorage.removeItem('smartdriving_token');
    }
    if (newUser) {
      localStorage.setItem('smartdriving_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('smartdriving_user');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('smartdriving_user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === 'admin' || user?.is_admin === true;
  const isTester = user?.is_tester === true || user?.role === 'tester' ||
    (user?.email && ['tester@smartdriving.com.au', 'stripetest@smartdriving.com.au'].includes(user.email.toLowerCase()));
  const canPreview = isAdmin || isTester || user?.can_preview === true;
  const hasPreviewAccess = !isDevelopmentMode || (!!token && !!user && canPreview);

  const value = {
    user,
    token,
    isLoading,
    siteStatusLoaded,
    isDevelopmentMode,
    canPreview,
    hasPreviewAccess,
    login,
    register,
    logout,
    updateUser,
    setAuthSession,
    isAuthenticated: !!token && !!user,
    isAdmin,
    isCustomer: user?.role === 'customer',
    isInstructor: user?.role === 'instructor',
    isTester,
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
