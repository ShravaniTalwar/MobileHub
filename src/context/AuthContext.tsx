import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { AuthResponse, User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: ((email: string, password: string) => Promise<void>) & ((creds: { email: string; password: string }) => Promise<void>);
  register: ((name: string, email: string, phone: string, password: string) => Promise<void>) & ((data: { name: string; email: string; phone?: string; password: string }) => Promise<void>);
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  demoLogin: (role: 'admin' | 'customer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mobilehub_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('mobilehub_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync token in localStorage & verify session
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('mobilehub_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('mobilehub_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Session expired or invalid token', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (emailOrCreds: string | { email: string; password: string }, pwd?: string) => {
    const payload = typeof emailOrCreds === 'object' ? emailOrCreds : { email: emailOrCreds, password: pwd! };
    const res = await api.post<AuthResponse>('/auth/login', payload);
    const { token, ...userData } = res.data;

    setToken(token);
    const userObj: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      roles: userData.roles,
      active: true,
    };

    setUser(userObj);
    localStorage.setItem('mobilehub_token', token);
    localStorage.setItem('mobilehub_user', JSON.stringify(userObj));
  };

  const register = async (
    nameOrData: string | { name: string; email: string; phone?: string; password: string },
    email?: string,
    phone?: string,
    password?: string
  ) => {
    const payload = typeof nameOrData === 'object' ? nameOrData : { name: nameOrData, email: email!, phone, password: password! };
    const res = await api.post<AuthResponse>('/auth/register', payload);
    const { token, ...userData } = res.data;

    setToken(token);
    const userObj: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      roles: userData.roles,
      active: true,
    };

    setUser(userObj);
    localStorage.setItem('mobilehub_token', token);
    localStorage.setItem('mobilehub_user', JSON.stringify(userObj));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mobilehub_token');
    localStorage.removeItem('mobilehub_user');
  };

  const updateUser = (updated: Partial<User>) => {
    if (!user) return;
    const next = { ...user, ...updated };
    setUser(next);
    localStorage.setItem('mobilehub_user', JSON.stringify(next));
  };

  const demoLogin = async (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      await login('admin@mobilehub.com', 'Admin@123');
    } else {
      await login('customer@mobilehub.com', 'Customer@123');
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
