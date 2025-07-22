import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import ProductCard from '../components/ProductCard';
import TestimonialCarousel from '../components/TestimonialCarousel';
import SecurityGrid from '../components/SecurityGrid';
import CapabilityShowcase from '../components/CapabilityShowcase';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Star, 
  Users, 
  Globe, 
  Zap,
  Brain,
  Shield,
  BarChart3,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(6);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-pink/20 rounded-full blur-xl floating-element" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-blue/20 rounded-full blur-xl floating-element" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-purple/20 rounded-full blur-xl floating-element" style={{ animationDelay: '4s' }} />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-accent-pink/20 text-accent-pink rounded-full text-sm font-medium mb-6">
                🚀 Next-Generation AI Technology
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Transform Your Business with
                <span className="gradient-text block mt-2">AI Assistant Tool</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
                Unlock the power of artificial intelligence to automate workflows, 
                generate insights, and accelerate your business growth.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <Link to="/signup">
                <Button size="lg" className="bg-accent-pink hover:bg-accent-pink/80 text-white px-8 py-4 text-lg glow-effect">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => scrollToSection('demo')}
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-white/60">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-accent-teal" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-accent-teal" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-accent-teal" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="glass-card border-white/20 text-center hover-lift">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-accent-blue mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">50K+</h3>
                <p className="text-white/70">Active Users</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/20 text-center hover-lift">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 text-accent-teal mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">120+</h3>
                <p className="text-white/70">Countries</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/20 text-center hover-lift">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-accent-purple mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">99.9%</h3>
                <p className="text-white/70">Uptime</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/20 text-center hover-lift">
              <CardContent className="p-6">
                <Star className="w-12 h-12 text-accent-pink mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">4.9/5</h3>
                <p className="text-white/70">User Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About Our <span className="gradient-text">AI Technology</span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              We're pioneering the future of artificial intelligence with cutting-edge technology 
              that understands, learns, and adapts to your business needs. Our platform combines 
              advanced machine learning with intuitive design to deliver unprecedented results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-accent-blue/20 rounded-lg">
                  <Brain className="w-8 h-8 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Advanced Machine Learning</h3>
                  <p className="text-white/70">Our AI models are trained on vast datasets and continuously learn from interactions to provide increasingly accurate and relevant responses.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-accent-teal/20 rounded-lg">
                  <Shield className="w-8 h-8 text-accent-teal" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
                  <p className="text-white/70">Built with security-first architecture, featuring end-to-end encryption, compliance certifications, and robust access controls.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-accent-purple/20 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-accent-purple" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Real-time Analytics</h3>
                  <p className="text-white/70">Get instant insights and analytics from your AI interactions, helping you make data-driven decisions faster than ever.</p>
                </div>
              </div>
            </div>
            
            <div className="demo-container">
              <div className="aspect-video bg-gradient-to-br from-primary-500/30 to-accent-pink/30 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-white mx-auto mb-4 animate-pulse" />
                  <h4 className="text-white text-xl font-semibold mb-2">AI in Action</h4>
                  <p className="text-white/70">Experience the power of our AI technology</p>
                  <Button 
                    className="mt-4 bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => scrollToSection('demo')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful <span className="gradient-text">AI Features</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover the comprehensive suite of AI capabilities designed to transform 
              how you work, create, and innovate.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-white/20 hover-lift group">
              <CardHeader>
                <MessageCircle className="w-12 h-12 text-accent-blue mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-white text-xl">Natural Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">Engage in natural, context-aware conversations with advanced language understanding and multi-turn dialogue capabilities.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/20 hover-lift group">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-accent-teal mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-white text-xl">Data Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">Transform raw data into actionable insights with advanced analytics, visualization, and predictive modeling capabilities.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/20 hover-lift group">
              <CardHeader>
                <Brain className="w-12 h-12 text-accent-purple mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-white text-xl">Smart Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">Automate complex workflows and processes with intelligent decision-making and adaptive learning algorithms.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="gradient-text">AI Tools</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Choose from our comprehensive suite of AI-powered tools designed to meet 
              your specific business needs and drive growth.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card border-white/20 p-6 animate-pulse">
                  <div className="w-full h-48 bg-white/10 rounded-lg mb-4" />
                  <div className="h-6 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/10 rounded mb-4" />
                  <div className="h-10 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Experience AI <span className="gradient-text">Capabilities</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Explore our AI capabilities through interactive demonstrations. 
              See how our technology can transform your workflow.
            </p>
          </div>
          
          <CapabilityShowcase />
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Enterprise-Grade <span className="gradient-text">Security</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Your data security is our top priority. We implement industry-leading 
              security measures to protect your information and ensure compliance.
            </p>
          </div>
          
          <SecurityGrid />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our <span className="gradient-text">Customers Say</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have transformed their 
              businesses with our AI technology.
            </p>
          </div>
          
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="glass-panel border-white/20 text-center p-12">
            <CardContent>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Start your free trial today and discover how AI can revolutionize 
                your workflow, boost productivity, and drive growth.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/signup">
                  <Button size="lg" className="bg-accent-pink hover:bg-accent-pink/80 text-white px-8 py-4 text-lg pulse-glow">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center space-x-8 mt-8 text-white/60">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent-teal" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent-teal" />
                  <span>24/7 support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent-teal" />
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;