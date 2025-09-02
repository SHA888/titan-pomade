import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { FeatureCard } from '@/components/common/feature-card';
import Link from 'next/link';
import { 
  Zap, 
  Shield, 
  Database, 
  Code, 
  Users, 
  Search,
  Layers,
  Smartphone,
  Cloud,
  BarChart3,
  Globe,
  Key,
  GitBranch,
  Palette
} from 'lucide-react';

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Performance",
      description: "Built with Next.js 14 for optimal performance and speed with server-side rendering and static site generation."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "JWT authentication, rate limiting, helmet security, and security best practices built-in."
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Database Ready",
      description: "Prisma ORM integration with PostgreSQL for type-safe database access and migrations."
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "TypeScript First",
      description: "Full TypeScript support across the entire stack for better developer experience and fewer bugs."
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Powerful Search",
      description: "MeiliSearch integration for fast and relevant search capabilities with typo tolerance."
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Modular Architecture",
      description: "Clean separation of concerns with NestJS modules and monorepo structure for scalability."
    }
  ];

  const frontendFeatures = [
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Responsive Design",
      description: "Mobile-first approach with Tailwind CSS utility classes for consistent UI across devices."
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "UI Components",
      description: "Pre-built, accessible UI components using Radix UI and styled with Tailwind CSS."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "SEO Optimized",
      description: "Built-in SEO best practices with meta tags, structured data, and sitemap generation."
    }
  ];

  const backendFeatures = [
    {
      icon: <GitBranch className="h-6 w-6" />,
      title: "API Documentation",
      description: "Swagger/OpenAPI integration for automatic API documentation and testing."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Monitoring & Logging",
      description: "Integrated logging, metrics, and health checks for production monitoring."
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "Authentication",
      description: "Complete JWT-based authentication system with role-based access control."
    }
  ];

  const devOpsFeatures = [
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Docker Support",
      description: "Docker-based deployment for easy scaling and management with docker-compose."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "CI/CD Ready",
      description: "Pre-configured GitHub Actions workflows for testing and deployment automation."
    }
  ];

  return (
    <MainLayout>
      <Section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Powerful Features
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              Everything you need to build modern, scalable web applications without starting from scratch.
            </p>
          </div>

          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Core Features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                The essential building blocks for any modern web application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight">
                  Frontend Features
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Modern React development with Next.js 14
                </p>
              </div>

              <div className="space-y-4">
                {frontendFeatures.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="text-primary">
                          {feature.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription>{feature.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight">
                  Backend Features
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Robust NestJS API with enterprise capabilities
                </p>
              </div>

              <div className="space-y-4">
                {backendFeatures.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="text-primary">
                          {feature.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription>{feature.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">
                DevOps Features
              </h2>
              <p className="mt-2 text-muted-foreground">
                Deployment and infrastructure ready
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devOpsFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-primary">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-primary-foreground/90 mb-8">
              Join thousands of developers who are already building production-ready applications with Titan Pomade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/dashboard">
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}