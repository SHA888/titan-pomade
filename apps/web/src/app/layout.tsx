import type { Metadata, Viewport } from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { cn } from '@/lib/utils';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: 'Titan Pomade Stack',
    template: '%s | Titan Pomade Stack',
  },
  description: 'A modern full-stack web application template with Next.js, NestJS, and more.',

  keywords: [
    'Next.js',
    'React',
    'TypeScript',
    'NestJS',
    'Tailwind CSS',
    'Full Stack',
    'Titan Pomade Stack',
  ],
  authors: [
    {
      name: 'Kresna Sucandra',
      url: 'https://kresnasucandra.com',
    },
  ],
  creator: 'Kresna Sucandra',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://github.com/SHA888/titan-pomade',
    title: 'Titan Pomade Stack',
    description: 'A modern full-stack web application template',
    siteName: 'Titan Pomade Stack',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Titan Pomade Stack',
    description: 'A modern full-stack web application template',
    creator: '@ks_sha888',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={cn(
        'min-h-screen bg-background font-sans antialiased text-foreground',
        'scroll-smooth transition-smooth',
        GeistSans.variable,
        GeistMono.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
