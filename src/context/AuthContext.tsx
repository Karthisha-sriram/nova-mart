import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  demoLogin: (role?: 'customer' | 'admin') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('novamart_token');
      if (token) {
        try {
          const res = await api.getCurrentUser();
          if (res?.user) {
            setUser(res.user);
          }
        } catch (err) {
          localStorage.removeItem('novamart_token');
        }
      } else if (!localStorage.getItem('novamart_logged_out')) {
        // Auto-seed demo user into local storage so recruiter sees a signed-in state with past orders
        const demoUser: User = {
          id: 1,
          email: 'alex.sharma@example.com',
          fullName: 'Alex Sharma',
          phone: '+91 98765 43210',
          role: 'customer',
          street: '402 Cyber Heights, HSR Layout',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560102'
        };
        localStorage.setItem('novamart_token', 'demo_user_1');
        setUser(demoUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res.token && res.user) {
      localStorage.removeItem('novamart_logged_out');
      localStorage.setItem('novamart_token', res.token);
      setUser(res.user);
      setLoginModalOpen(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, phone?: string) => {
    const res = await api.register(fullName, email, password, phone);
    if (res.token && res.user) {
      localStorage.removeItem('novamart_logged_out');
      localStorage.setItem('novamart_token', res.token);
      setUser(res.user);
      setLoginModalOpen(false);
    }
  };

  const demoLogin = async (role: 'customer' | 'admin' = 'customer') => {
    localStorage.removeItem('novamart_logged_out');
    if (role === 'admin') {
      await login('admin@novamart.com', 'admin_hash_pwd_999');
    } else {
      await login('alex.sharma@example.com', 'demo_hash_pwd_123');
    }
  };

  const logout = () => {
    localStorage.removeItem('novamart_token');
    localStorage.setItem('novamart_logged_out', 'true');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginModalOpen,
        setLoginModalOpen,
        login,
        register,
        demoLogin,
        logout
      }}
    >
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
