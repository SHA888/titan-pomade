import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight sm:text-7xl">404</h1>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Page Not Found
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn&#39;t find the page you&#39;re looking for. It might have been removed, renamed, or doesn&#39;t exist.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Search Site
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}