'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'seroja-admin-auth';
const TOKEN_KEY = 'seroja-admin-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (stored === 'true' && storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, []);

  const login = useCallback((authToken: string) => {
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(TOKEN_KEY, authToken);
    setIsLoggedIn(true);
    setToken(authToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
