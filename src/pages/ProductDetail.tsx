import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  Star, 
  Play, 
  ShoppingCart, 
  Check, 
  ExternalLink,
  Shield,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await addItem(product, selectedPlan);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const getPlanPrice = (plan: 'monthly' | 'yearly' | 'lifetime') => {
    if (!product) return 0;
    
    switch (plan) {
      case 'monthly':
        return product.monthly_price || product.price;
      case 'yearly':
        return product.yearly_price || product.price * 10;
      case 'lifetime':
        return product.price;
      default:
        return product.price;
    }
  };

  const getPlanSavings = (plan: 'yearly' | 'lifetime') => {
    if (!product) return 0;
    
    const monthlyPrice = product.monthly_price || product.price;
    const planPrice = getPlanPrice(plan);
    
    if (plan === 'yearly') {
      const yearlyMonthlyTotal = monthlyPrice * 12;
      return ((yearlyMonthlyTotal - planPrice) / yearlyMonthlyTotal * 100).toFixed(0);
    }
    
    return 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-64 bg-white/10 rounded-lg" />
              <div className="h-6 bg-white/10 rounded" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-white/10 rounded" />
              <div className="h-32 bg-white/10 rounded" />
              <div className="h-12 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
        <Button onClick={() => navigate('/shop')} className="bg-primary-500 hover:bg-primary-600 text-white">
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/shop')}
        className="mb-8 border-white/20 text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Shop
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image and Info */}
        <div className="space-y-6">
          <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-accent-pink/20 rounded-2xl flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <Zap className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">AI Tool Preview</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {product.category && (
                <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                  {product.category.name}
                </Badge>
              )}
              {product.subscription_required && (
                <Badge className="bg-accent-pink/20 text-accent-pink border-accent-pink/30">
                  Subscription
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-white">{product.name}</h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/70">(4.8 out of 5)</span>
              <span className="text-white/70">•</span>
              <span className="text-white/70">1,234 users</span>
            </div>
            
            <p className="text-xl text-white/80 leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex space-x-4">
              {product.demo_url && (
                <Button 
                  onClick={() => window.open(product.demo_url, '_blank')}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Live Demo
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}
              <Button 
                onClick={() => toast.info('Free trial coming soon!')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Clock className="w-4 h-4 mr-2" />
                Free Trial
              </Button>
            </div>
          </div>
        </div>

        {/* Pricing and Purchase */}
        <div className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Choose Your Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Plan Selection */}
              <div className="grid grid-cols-1 gap-3">
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === 'monthly' 
                      ? 'border-accent-pink bg-accent-pink/10' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedPlan('monthly')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Monthly</h3>
                      <p className="text-white/70 text-sm">Pay as you go</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-xl">${getPlanPrice('monthly')}</p>
                      <p className="text-white/70 text-sm">per month</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${
                    selectedPlan === 'yearly' 
                      ? 'border-accent-blue bg-accent-blue/10' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedPlan('yearly')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Yearly</h3>
                      <p className="text-white/70 text-sm">Best value</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-xl">${getPlanPrice('yearly')}</p>
                      <p className="text-white/70 text-sm">per year</p>
                    </div>
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-accent-teal text-white">
                    Save {getPlanSavings('yearly')}%
                  </Badge>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === 'lifetime' 
                      ? 'border-accent-purple bg-accent-purple/10' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedPlan('lifetime')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Lifetime</h3>
                      <p className="text-white/70 text-sm">One-time payment</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-xl">${getPlanPrice('lifetime')}</p>
                      <p className="text-white/70 text-sm">forever</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-accent-pink hover:bg-accent-pink/80 text-white py-3 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - ${getPlanPrice(selectedPlan)}
              </Button>
              
              <div className="space-y-2 text-center text-white/70 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>24/7 customer support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="glass-panel border-white/20 mb-8">
            <TabsTrigger 
              value="features" 
              className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
            >
              Features
            </TabsTrigger>
            <TabsTrigger 
              value="specifications" 
              className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="features">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                {product.features && product.features.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/70">Feature details coming soon.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/70">Category:</span>
                      <span className="text-white">{product.category?.name || 'General'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Trial Period:</span>
                      <span className="text-white">{product.trial_days} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Subscription Required:</span>
                      <span className="text-white">{product.subscription_required ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Created:</span>
                      <span className="text-white">{new Date(product.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/70">API Access:</span>
                      <span className="text-white">REST & GraphQL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Rate Limits:</span>
                      <span className="text-white">1000 req/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Data Export:</span>
                      <span className="text-white">JSON, CSV, XML</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Integrations:</span>
                      <span className="text-white">50+ platforms</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b border-white/10 pb-6 last:border-b-0">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-pink rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">U</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">User {review}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-white/80">
                        This AI tool has been incredibly helpful for our team. The features are robust and the interface is intuitive.
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;