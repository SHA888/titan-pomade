import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import Link from 'next/link';
import { 
  BookOpen, 
  Code, 
  Database, 
  Zap, 
  Shield, 
  Search,
  Download,
  Play,
  FileText,
  Terminal,
  GitBranch
} from 'lucide-react';

export default function DocsPage() {
  const docsSections = [
    {
      icon: <Download className="h-8 w-8" />,
      title: "Getting Started",
      description: "Learn how to set up and run Titan Pomade on your local machine.",
      link: "/docs/getting-started"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Frontend Guide",
      description: "Explore the Next.js frontend architecture and components.",
      link: "/docs/frontend"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Backend Guide",
      description: "Understand the NestJS backend structure and API endpoints.",
      link: "/docs/backend"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Deployment",
      description: "Learn how to deploy your application to production.",
      link: "/docs/deployment"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security",
      description: "Understand the security measures and best practices.",
      link: "/docs/security"
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "API Reference",
      description: "Detailed documentation for all available API endpoints.",
      link: "/docs/api"
    }
  ];

  const quickStartSteps = [
    {
      title: "Prerequisites",
      description: "Ensure you have Node.js 18+, Docker, and PostgreSQL installed.",
      icon: <Terminal className="h-6 w-6" />
    },
    {
      title: "Clone Repository",
      description: "git clone https://github.com/your-org/titan-pomade.git",
      icon: <GitBranch className="h-6 w-6" />
    },
    {
      title: "Install Dependencies",
      description: "cd titan-pomade && npm install",
      icon: <Download className="h-6 w-6" />
    },
    {
      title: "Configure Environment",
      description: "Copy .env.example to .env and update values",
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: "Run Database",
      description: "docker-compose up -d postgres redis meilisearch",
      icon: <Database className="h-6 w-6" />
    },
    {
      title: "Start Development",
      description: "npm run dev",
      icon: <Play className="h-6 w-6" />
    }
  ];

  return (
    <MainLayout>
      <Section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Documentation
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              Everything you need to know about building with Titan Pomade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {docsSections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-4 text-primary">
                    {section.icon}
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild>
                    <Link href={section.link}>
                      Read Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted rounded-lg p-8 md:p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Quick Start Guide
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Get up and running with Titan Pomade in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickStartSteps.map((step, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-primary">
                        {step.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can&#39;t find what you&#39;re looking for? Check out our community resources or contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/support">
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/community">
                  Join Community
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}