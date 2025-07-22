import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { 
  User, 
  ShoppingCart, 
  Star, 
  Calendar, 
  TrendingUp, 
  Activity,
  CreditCard,
  Settings,
  Bell,
  Download,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';
import { Order, Subscription, Product } from '../types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { itemCount } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeSubscriptions: 0,
    totalSpent: 0,
    usageThisMonth: 75
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const [ordersRes, subscriptionsRes, productsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('subscriptions')
          .select(`
            *,
            product:products(*)
          `)
          .eq('user_id', user.id)
          .eq('status', 'active'),
        supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .limit(4)
      ]);
      
      if (ordersRes.error) throw ordersRes.error;
      if (subscriptionsRes.error) throw subscriptionsRes.error;
      if (productsRes.error) throw productsRes.error;
      
      const ordersData = ordersRes.data || [];
      const subscriptionsData = subscriptionsRes.data || [];
      
      setOrders(ordersData);
      setSubscriptions(subscriptionsData);
      setRecentProducts(productsRes.data || []);
      
      const totalSpent = ordersData
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total_amount, 0);
      
      setStats({
        totalOrders: ordersData.length,
        activeSubscriptions: subscriptionsData.length,
        totalSpent,
        usageThisMonth: Math.floor(Math.random() * 40) + 60
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
      case 'trial':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card border-white/20 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-white/10 rounded mb-2" />
                <div className="h-8 bg-white/10 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {profile?.full_name || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-white/70">
          Here's what's happening with your AI tools today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-accent-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Active Subscriptions</p>
                <p className="text-2xl font-bold text-white">{stats.activeSubscriptions}</p>
              </div>
              <Star className="w-8 h-8 text-accent-teal" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-white">${stats.totalSpent.toFixed(2)}</p>
              </div>
              <CreditCard className="w-8 h-8 text-accent-purple" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Cart Items</p>
                <p className="text-2xl font-bold text-white">{itemCount}</p>
              </div>
              <Activity className="w-8 h-8 text-accent-pink" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card className="glass-card border-white/20 mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Monthly Usage
          </CardTitle>
          <CardDescription className="text-white/70">
            Your AI tool usage this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-white">
              <span>API Calls</span>
              <span>{stats.usageThisMonth}% of limit</span>
            </div>
            <Progress value={stats.usageThisMonth} className="h-2" />
            <p className="text-white/60 text-sm">
              {stats.usageThisMonth < 80 ? 
                'You\'re within your usage limits.' : 
                'Consider upgrading your plan for unlimited access.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subscriptions" className="space-y-6">
        <TabsList className="glass-panel border-white/20">
          <TabsTrigger 
            value="subscriptions" 
            className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
          >
            My Subscriptions
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
          >
            Recent Orders
          </TabsTrigger>
          <TabsTrigger 
            value="discover" 
            className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
          >
            Discover Tools
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription) => (
                <Card key={subscription.id} className="glass-card border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">
                        {subscription.product?.name || 'Unknown Product'}
                      </CardTitle>
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-white/70">
                      {subscription.product?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-white/80">
                        <span>Type:</span>
                        <span className="capitalize">{subscription.subscription_type}</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>Started:</span>
                        <span>{new Date(subscription.starts_at).toLocaleDateString()}</span>
                      </div>
                      {subscription.expires_at && (
                        <div className="flex justify-between text-white/80">
                          <span>Expires:</span>
                          <span>{new Date(subscription.expires_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                          onClick={() => toast.info('Tool access coming soon!')}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Use Tool
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => toast.info('Management coming soon!')}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="glass-card border-white/20 col-span-full">
                <CardContent className="p-8 text-center">
                  <Star className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">No Active Subscriptions</h3>
                  <p className="text-white/70 mb-4">Start your AI journey by subscribing to our powerful tools.</p>
                  <Link to="/shop">
                    <Button className="bg-accent-pink hover:bg-accent-pink/80 text-white">
                      Browse AI Tools
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} className="glass-card border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-accent-blue/20 rounded-lg">
                          <ShoppingCart className="w-6 h-6 text-accent-blue" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Order #{order.id.slice(-8)}</h3>
                          <p className="text-white/70 text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">${order.total_amount.toFixed(2)}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="glass-card border-white/20">
                <CardContent className="p-8 text-center">
                  <ShoppingCart className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-white/70 mb-4">Your order history will appear here once you make a purchase.</p>
                  <Link to="/shop">
                    <Button className="bg-accent-pink hover:bg-accent-pink/80 text-white">
                      Start Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="discover">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {recentProducts.map((product) => (
              <Card key={product.id} className="glass-card border-white/20 hover-lift">
                <CardHeader>
                  {product.image_url && (
                    <div className="w-full h-32 bg-gradient-to-br from-primary-500/20 to-accent-pink/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardTitle className="text-white">{product.name}</CardTitle>
                  <CardDescription className="text-white/70">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <span className="text-lg font-semibold">${product.price}</span>
                      <span className="text-white/70 text-sm ml-1">lifetime</span>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <Button size="sm" className="bg-primary-500 hover:bg-primary-600 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/shop">
              <Button size="lg" className="bg-accent-pink hover:bg-accent-pink/80 text-white">
                View All AI Tools
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;