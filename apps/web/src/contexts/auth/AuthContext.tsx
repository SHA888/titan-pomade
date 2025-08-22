'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api, setTokens, clearTokens, getTokens } from '@/lib/api';
import { getErrorMessage } from '@/lib/error-utils';
import { User, AuthContextType, AuthTokens } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple cookie helpers for client-side cookie management
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Expires=${expires}; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    let aborted = false;
    const checkAuth = async () => {
      try {
        // Only attempt to fetch if we have an access token
        const tokens = getTokens();
        if (!tokens?.accessToken) {
          if (!aborted) setIsLoading(false);
          return;
        }

        const userData = await api.get<User>('/auth/me');
        setUser(userData);
        // Mirror role into a simple cookie for middleware-based gating
        setCookie('role', userData.role);
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
        deleteCookie('role');
      } finally {
        if (!aborted) setIsLoading(false);
      }
    };

    checkAuth();
    return () => {
      aborted = true;
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      // Get tokens and store them for subsequent requests
      const tokens = await api.post<AuthTokens>('/auth/signin', { email, password });
      setTokens(tokens);

      // Get user data after successful login
      const userData = await api.get<User>('/auth/me');
      setUser(userData);
      setCookie('role', userData.role);

      // Check if email is verified
      if (!userData.isEmailVerified) {
        toast.info('Please verify your email address');
        router.push('/auth/verify-email');
        return;
      }

      toast.success('Logged in successfully');
      // Redirect based on role
      if (userData.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error) || 'Invalid email or password';
      toast.error(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      await api.post('/auth/signup', { name, email, password });

      // Inform user to verify their email
      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/auth/verify-email');
    } catch (error: unknown) {
      const message = getErrorMessage(error) || 'Registration failed';
      toast.error(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear stored tokens and reset user state
    clearTokens();
    setUser(null);
    deleteCookie('role');
    router.push('/auth/login');
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const tokens = await api.post<AuthTokens>('/auth/refresh');
      return tokens.accessToken;
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
      return null;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email');
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Failed to send password reset email';
      toast.error(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      toast.success('Password reset successful. Please log in with your new password.');
      router.push('/auth/login');
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Failed to reset password';
      toast.error(errorMessage);
      throw err;
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
