'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    } else if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      // Redirect to unauthorized if user doesn't have required role
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, router, requiredRole, user?.role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
}
