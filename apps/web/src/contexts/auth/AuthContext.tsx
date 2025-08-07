'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { User, AuthContextType, AuthTokens } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await api.get<User>('/auth/me');
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await api.post<AuthTokens>('/auth/signin', { email, password });
      
      // Store tokens in local storage (handled by api.ts)
      // The api client will handle setting the tokens
      
      // Get user data
      const userData = await api.get<User>('/auth/me');
      setUser(userData);
      
      toast.success('Logged in successfully');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      await api.post('/auth/signup', { name, email, password });
      
      // Auto-login after registration
      await login(email, password);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // The api client will handle clearing the tokens
    setUser(null);
    router.push('/auth/login');
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const tokens = await api.post<AuthTokens>('/auth/refresh');
      return tokens.accessToken;
    } catch (error) {
      logout();
      return null;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send password reset email');
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      toast.success('Password reset successful. Please log in with your new password.');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Failed to reset password');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
