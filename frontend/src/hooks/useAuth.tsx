import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem('token'),
    user: (() => {
      try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    })(),
  });

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setState({ token, user });
  };

  const logout = () => {
    localStorage.clear();
    setState({ token: null, user: null });
  };

  useEffect(() => {
    if (!state.token) setState({ token: null, user: null });
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isAdmin: state.user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
