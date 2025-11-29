import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Check, Crown, Star, Zap } from 'lucide-react';

export const PricingSection = () => {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'Great for exploring the basics of our service',
      icon: Zap,
      features: [
        '80 daily credits',
        'Videos up to 45 minutes long',
        'Standard processing speed',
        'Email support',
      ],
      buttonText: 'Start for Free',
      popular: false,
      buttonVariant: 'outline' as const
    },
    {
      name: 'Student',
      price: '₹49',
      period: '/month',
      description: 'Special pricing for students',
      icon: Star,
      features: [
        '400 daily credits',
        'Videos up to 120 minutes long',
        'Premium processing speed',
        'Email support',
        'Export to pdf format'
      ],
      buttonText: 'Choose Student',
      popular: false,
      buttonVariant: 'outline' as const
    },
    {
      name: 'Pro',
      price: '₹249',
      period: '/month',
      description: 'Most popular for professionals',
      icon: Crown,
      features: [
        '2000 daily credits',
        'Videos up to 10 hours long',
        'Premium processing speed',
        'Email support assistance',
        '24/7 priority support',
        'Lightning fast processing',
        'Export to all formats',
        'Book Summary',
        'API access',
      ],
      buttonText: 'Go Pro',
      popular: true,
      buttonVariant: 'default' as const
    },
    {
      name: 'Enterprise',
      price: '₹2399',
      period: '/year',
      description: 'For large teams and organizations',
      icon: Crown,
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment option',
        'Advanced analytics',
        'Custom AI model training',
        'White-label solution'
      ],
      buttonText: 'Start now',
      popular: false,
      buttonVariant: 'outline' as const
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-hero dark:bg-zinc-900 text-black dark:text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6">
            Simple{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-base lg:text-2xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your video summarization needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-gradient-card border-border hover:shadow-card transition-all duration-300 animate-slide-up ${plan.popular ? 'ring-2 ring-primary scale-105 shadow-glow' : ''
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-accent/50 rounded-lg flex items-center justify-center">
                  <plan.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-4 w-4 text-primary mt-1 mr-3 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${plan.popular
                      ? 'bg-gradient-primary text-primary-foreground hover:shadow-glow'
                      : 'border-primary/20 hover:bg-primary/10 hover:border-primary'
                    } transition-all`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
