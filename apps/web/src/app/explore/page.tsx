import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import Link from 'next/link';
import { 
  Zap, 
  Shield, 
  Database, 
  Code, 
  Users, 
  Search,
  Star,
  ArrowRight,
  CheckCircle,
  Rocket,
  Layers,
  Lock,
  Globe,
  Smartphone,
  Cloud,
  ShoppingCart,
  FileText
} from 'lucide-react';

export default function ExplorePage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Performance",
      description: "Optimized for speed with Next.js 14 and server-side rendering."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "JWT authentication, rate limiting, and security best practices."
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Database Integration",
      description: "Prisma ORM with PostgreSQL for type-safe database operations."
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "TypeScript Support",
      description: "Full TypeScript support across frontend and backend."
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Powerful Search",
      description: "MeiliSearch integration for fast and relevant search results."
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Modular Architecture",
      description: "Clean separation of concerns with NestJS modules."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Scalability",
      description: "Designed to scale from prototype to enterprise applications."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Responsive Design",
      description: "Mobile-first approach with Tailwind CSS utility classes."
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud Deployment",
      description: "Docker-based deployment for easy scaling and management."
    }
  ];

  const useCases = [
    {
      title: "E-commerce Platforms",
      description: "Build scalable online stores with product catalogs, shopping carts, and payment processing.",
      icon: <ShoppingCart className="h-6 w-6" />
    },
    {
      title: "SaaS Applications",
      description: "Create subscription-based software with user management and billing systems.",
      icon: <Globe className="h-6 w-6" />
    },
    {
      title: "Marketplace Solutions",
      description: "Develop multi-vendor platforms with complex user roles and commission systems.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Content Management",
      description: "Build custom CMS solutions with rich content editing and publishing workflows.",
      icon: <FileText className="h-6 w-6" />
    }
  ];

  return (
    <MainLayout>
      <Section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Explore Titan Pomade
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              Discover the powerful features and capabilities that make Titan Pomade the perfect foundation for your next web application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Perfect For Any Use Case
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Titan Pomade is designed to be flexible and adaptable to various application types.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-4 text-primary">
                      {useCase.icon}
                    </div>
                    <CardTitle>{useCase.title}</CardTitle>
                    <CardDescription>{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild>
                      <Link href={`/use-cases/${useCase.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
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
                  <Rocket className="ml-2 h-4 w-4" />
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