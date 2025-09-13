import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, StickyNote, BookOpen, AlignLeft, Languages, Sparkles } from 'lucide-react';

export const FeaturesSection = () => {
  
  const features = [
    {
      icon: FileText,
      title: 'Transcript',
      description: 'Get a clean, accurate transcript of your video content, ready for reference or analysis.',
      color: 'text-blue-500'
    },
    {
      icon: StickyNote,
      title: 'Short Summary',
      description: 'Generate a quick, to-the-point summary of your video for instant understanding.',
      color: 'text-green-500'
    },
    {
      icon: AlignLeft,
      title: 'Detailed Summary',
      description: 'Dive deeper with comprehensive summaries covering all key details and insights.',
      color: 'text-purple-500'
    },
    {
      icon: BookOpen,
      title: 'Book Summary (Coming Soon)',
      description: 'Turn lengthy books into digestible summaries to save time and boost learning.',
      color: 'text-orange-500'
    },
    {
      icon: FileText,
      title: 'Document Summary (Coming Soon)',
      description: 'Upload PDFs, docs, or research papers and get smart AI-powered summaries.',
      color: 'text-pink-500'
    },
    {
      icon: Sparkles,
      title: 'And More...',
      description: 'New AI capabilities like translations, highlights, and insights are on the way.',
      color: 'text-cyan-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Explore Our{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Capabilities
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful tools to transform videos, books, and documents into knowledge you can use
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 animate-slide-up group hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              
              <CardHeader>
                
                <div className="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </CardDescription>
                <Button
                  size="lg"
                  className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all px-8 py-4"
                >
                  {feature.title.includes('Coming Soon') ? 'Coming Soon' : 'Try Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
