"use client";

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  apiForgotPassword,
  apiLogin,
  apiLoginByEmail,
  apiLogout,
  apiRefreshToken,
  apiRegister,
  apiResetPassword,
  apiSendOtp,
} from '~/features/auth/api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      setUser(data.authenticated ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSession();
  }, [loadSession]);

  const login = useCallback(async (username, password) => {
    const result = await apiLogin(username, password);
    if (result.success) setUser(result.data.user);
    return result;
  }, []);

  const loginByEmail = useCallback(async (email, password) => {
    const result = await apiLoginByEmail(email, password);
    if (result.success) setUser(result.data.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginByEmail,
    sendOtp: apiSendOtp,
    register: apiRegister,
    forgotPassword: apiForgotPassword,
    resetPassword: apiResetPassword,
    refresh: apiRefreshToken,
    logout,
    reloadSession: loadSession,
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
