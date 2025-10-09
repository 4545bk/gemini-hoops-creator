import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Image, Zap } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <span className="text-white/90 text-sm font-medium">
                ✨ Powered by Google Gemini AI
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Transform Into
              <span className="block gradient-accent bg-clip-text text-transparent mt-2">
                Anything You Imagine
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Turn your photos into NBA stars, football legends, wedding portraits, sketches, and more. 
              AI-powered transformations in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90 shadow-glow text-lg px-8 py-6"
              >
                Get Started Free
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/generator")}
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                See Examples
              </Button>
            </div>
            
            <div className="mt-8 text-white/80 text-sm">
              🎁 Get 3 free generations when you sign up
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Endless Creative Possibilities
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Image className="h-8 w-8" />}
              title="Multiple Styles"
              description="NBA players, footballers, wedding photos, sketches, paintings, and more"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Lightning Fast"
              description="Generate stunning transformations in seconds with cutting-edge AI"
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="High Quality"
              description="Professional-grade results powered by Google Gemini AI"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-dark">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Photos?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users creating amazing AI transformations
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="gradient-accent text-white hover:opacity-90 shadow-glow text-lg px-8 py-6"
          >
            Start Creating Now
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-xl bg-card shadow-elegant hover:shadow-glow transition-all duration-300">
    <div className="mb-4 text-primary">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Landing;
