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
      description: 'Generate a quick, to-the-point concise summary of your video for instant understanding.',
      color: 'text-green-500'
    },
    {
      icon: AlignLeft,
      title: 'Explanation',
      description: 'Dive deeper with comprehensive summaries covering all key details and insights.',
      color: 'text-purple-500'
    },
    {
      icon: BookOpen,
      title: 'Book Summary',
      description: 'Turn lengthy books into digestible, clean summaries to save time and boost your learning.',
      color: 'text-orange-500'
    },
    {
      icon: FileText,
      title: 'Document Summary',
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

        <div className="grid md:grid-cols-2 grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-4 md:gap-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 animate-slide-up group hover:-translate-y-2 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >

              <CardHeader>

                <div className="w-8 h-8 lg:w-12 lg:h-12 md:w-12 md:h-12 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-sm lg:text-xl lg:font-semibold md:font-semibold md:text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative px-8 pb-8">
                <CardDescription className="text-muted-foreground lg:text-sm text-[12px] mb-2 leading-relaxed">
                  {feature.description}
                </CardDescription>

                <Button
                  size="sm"
                  className="w-full rounded-md bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all px-4 py-2"
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
