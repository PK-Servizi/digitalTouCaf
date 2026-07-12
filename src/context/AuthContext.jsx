import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

function normalizeUser(user) {
  const roleName = user?.role?.name || user?.roleName || 'backoffice';
  return {
    ...user,
    role: {
      ...(user?.role || {}),
      name: roleName,
      databaseName: user?.role?.databaseName || roleName,
    },
    databaseName: user?.databaseName || user?.role?.databaseName || roleName,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a stored token and fetch user
  useEffect(() => {
    const init = async () => {
      if (!authService.isAuthenticated()) {
        setLoading(false);
        return;
      }
      try {
        const userData = normalizeUser(await authService.me());
        setUser(userData);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(async (email, password) => {
    const userData = normalizeUser(await authService.login(email, password));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = { user, loading, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
