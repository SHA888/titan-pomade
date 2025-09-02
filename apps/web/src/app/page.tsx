'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { FeatureCard } from '@/components/common/feature-card';
import { TestimonialCard } from '@/components/common/testimonial-card';
import { StatCard } from '@/components/common/stat-card';
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
  Github,
  Twitter,
  Linkedin,
  BarChart3,
  TrendingUp,
  Download,
  Globe
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Built with Next.js 14 for optimal performance and speed."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure by Default",
      description: "JWT authentication and security best practices built-in."
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Database Ready",
      description: "Prisma ORM integration with PostgreSQL for type-safe database access."
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "TypeScript First",
      description: "Full TypeScript support across the entire stack for better developer experience."
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Powerful Search",
      description: "MeiliSearch integration for fast and relevant search capabilities."
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Modular Architecture",
      description: "Clean separation of concerns with NestJS modules and monorepo structure."
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Frontend Developer",
      content: "Titan Pomade saved me weeks of setup time. The template is well-structured and follows modern best practices.",
      avatar: "AJ",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "CTO",
      content: "Our team was able to ship our MVP in half the time thanks to this excellent starter template.",
      avatar: "SW",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Full Stack Developer",
      content: "The integration between Next.js and NestJS is seamless. Highly recommended for any serious project.",
      avatar: "MC",
      rating: 4
    }
  ];

  const techStack = [
    { name: "Next.js 14", category: "Frontend" },
    { name: "NestJS", category: "Backend" },
    { name: "TypeScript", category: "Language" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Prisma", category: "ORM" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "MeiliSearch", category: "Search" },
    { name: "Docker", category: "Deployment" }
  ];

  const stats = [
    { title: "Active Users", value: "10,000+", description: "Trusted by developers worldwide", icon: <Users className="h-4 w-4" />, trend: "+12%" },
    { title: "Projects Built", value: "2,500+", description: "Applications deployed with Titan Pomade", icon: <Globe className="h-4 w-4" />, trend: "+25%" },
    { title: "Developer Hours", value: "50,000+", description: "Saved development time", icon: <TrendingUp className="h-4 w-4" />, trend: "+40%" },
    { title: "GitHub Stars", value: "1,200+", description: "Community appreciation", icon: <Github className="h-4 w-4" />, trend: "+8%" }
  ];

  const steps = [
    {
      number: 1,
      title: "Clone the Template",
      description: "Get started by cloning our GitHub repository with a single command.",
      icon: <Download className="h-6 w-6" />
    },
    {
      number: 2,
      title: "Customize Your App",
      description: "Modify the template to fit your specific business requirements.",
      icon: <Code className="h-6 w-6" />
    },
    {
      number: 3,
      title: "Deploy to Production",
      description: "Deploy your application with our Docker-based deployment process.",
      icon: <Rocket className="h-6 w-6" />
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <Section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge variant="secondary" className="mb-4">
              <span className="flex items-center">
                <Zap className="mr-1 h-3 w-3" />
                Just Launched v0.1.0
              </span>
            </Badge>
            <h1 className="display-0">
              Build Modern Web Apps
              <span className="text-primary"> Faster</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lead">
              Titan Pomade is a production-ready full-stack template with Next.js, NestJS, and Tailwind CSS. 
              Everything you need to build scalable web applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="py-8 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                trend={stat.trend}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section 
        id="features" 
        title="Powerful Features" 
        subtitle="Everything you need to build modern web applications"
        className="bg-background"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Section>

      {/* How It Works Section */}
      <Section 
        id="how-it-works" 
        title="How It Works" 
        subtitle="Get up and running in minutes, not weeks"
        className="bg-muted/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <span className="text-2xl font-bold text-primary">{step.number}</span>
              </div>
              <div className="mb-4 text-primary">
                {step.icon}
              </div>
              <h3 className="heading-2 mb-2">{step.title}</h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tech Stack Section */}
      <Section 
        id="tech-stack" 
        title="Modern Tech Stack" 
        subtitle="Built with the latest and greatest technologies"
        className="bg-background"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {techStack.map((tech, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow h-full border-2 border-primary/10">
              <CardHeader className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center display-3">{tech.name}</CardTitle>
                <CardDescription className="text-center heading-3 mt-2">{tech.category}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section 
        id="testimonials" 
        title="What Developers Say" 
        subtitle="Join thousands of satisfied developers"
        className="bg-muted/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-primary text-primary-foreground">
        <div className="flex flex-col items-center text-center">
          <h2 className="display-1 text-primary-foreground">
            Ready to Get Started?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-primary-foreground/90 mt-4 mb-8">
            Join thousands of developers who are already building amazing applications with Titan Pomade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">
                Start Building
                <Rocket className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link href="/docs">
                Read Documentation
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}