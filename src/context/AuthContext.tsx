'use client';

import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import type { User } from '@/lib/types';
import { ThemeProvider } from './ThemeContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // ✅ Cambiamos la definición para aceptar una contraseña opcional
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('kinbi_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('kinbi_user');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Actualizamos la función para que reciba y use la contraseña
  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      // ✅ Pasamos la contraseña al servicio de autenticación
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      localStorage.setItem('kinbi_user', JSON.stringify(loggedInUser));
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    authService.logout().then(() => {
      setUser(null);
      localStorage.removeItem('kinbi_user');
      router.push('/login');
      setLoading(false);
    });
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
        <ThemeProvider>
         {children}
        </ThemeProvider>
    </AuthContext.Provider>
  );
}