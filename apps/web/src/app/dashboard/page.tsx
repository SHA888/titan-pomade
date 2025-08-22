'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UserDashboardPage() {
  const { user, logout } = useAuth();
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground">
        <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
          <div className="mb-4">
            <div className="text-sm text-muted-foreground">Signed in as</div>
            <div className="font-semibold truncate">{user?.name || user?.email}</div>
            <div className="text-xs text-muted-foreground">Role: {user?.role}</div>
          </div>
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="block rounded px-3 py-2 text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              Overview
            </Link>
            <Link
              href="/"
              className="block rounded px-3 py-2 text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/docs"
              className="block rounded px-3 py-2 text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              Docs
            </Link>
          </nav>
          <div className="mt-auto pt-4 border-t border-border">
            <Button variant="secondary" className="w-full" onClick={logout}>
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">User Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              {user?.name ? `Welcome, ${user.name}` : `Welcome, ${user?.email ?? 'User'}`}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-lg font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
              <p className="text-sm text-muted-foreground">Role: {user?.role}</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-lg font-semibold">Quick Links</h2>
              <div className="mt-2 space-x-3">
                <Link className="text-primary hover:underline" href="/">
                  Home
                </Link>
                <Link className="text-primary hover:underline" href="/docs">
                  Docs
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
