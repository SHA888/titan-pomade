'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Role } from '@prisma/client';
import { hasRole } from '@/utils/roles';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  // Check if user has admin role
  if (!hasRole(user.role, [Role.ADMIN])) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 space-y-4 text-center bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 bg-card shadow-md border-r border-border flex flex-col">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-2">
          <ul>
            <li>
              <a
                href="/admin/dashboard"
                className="block px-4 py-2 text-foreground/80 hover:bg-accent hover:text-foreground"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/admin/users"
                className="block px-4 py-2 text-foreground/80 hover:bg-accent hover:text-foreground"
              >
                Users
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-auto p-4 border-t border-border">
          <Button variant="destructive" className="w-full" onClick={logout}>
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
