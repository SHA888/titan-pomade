import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import Link from 'next/link';
import { 
  Check,
  Rocket,
  Zap,
  Users,
  BarChart3,
  Shield,
  Database,
  Code,
  Globe
} from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals and small projects",
      features: [
        "Full template access",
        "Basic documentation",
        "Community support",
        "Single project usage",
        "Standard components"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$49",
      description: "For growing teams and businesses",
      features: [
        "Everything in Starter",
        "Priority support",
        "Advanced documentation",
        "Up to 5 projects",
        "Premium components",
        "Monthly updates",
        "Custom branding"
      ],
      cta: "Get Professional",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex needs",
      features: [
        "Everything in Professional",
        "24/7 dedicated support",
        "Custom development",
        "Unlimited projects",
        "Enterprise components",
        "Weekly updates",
        "White-label licensing",
        "Training & onboarding"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I use Titan Pomade for commercial projects?",
      answer: "Yes, all licenses allow for commercial use. The Professional and Enterprise licenses provide additional rights for redistribution and white-label usage."
    },
    {
      question: "Do you provide updates and bug fixes?",
      answer: "Yes, all paid plans include regular updates and bug fixes. Professional plan includes monthly updates, while Enterprise gets weekly updates."
    },
    {
      question: "Is there a trial period?",
      answer: "Yes, you can try the Starter plan for free indefinitely. Professional and Enterprise plans come with a 14-day money-back guarantee."
    },
    {
      question: "What kind of support do you offer?",
      answer: "Starter plan includes community support, Professional gets priority email support, and Enterprise receives 24/7 dedicated support with a named contact."
    }
  ];

  return (
    <MainLayout>
      <Section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              Choose the perfect plan for your needs. All plans include our core features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary/20 relative' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Free" && plan.price !== "Custom" && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href={plan.name === "Enterprise" ? "/contact" : "/auth/signup"}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-muted rounded-lg p-8 md:p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about the plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Get Started?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-primary-foreground/90 mb-8">
              Join thousands of developers who are already building amazing applications with Titan Pomade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/dashboard">
                  Start Building Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link href="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}