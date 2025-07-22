import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  CreditCard, 
  Shield,
  Bell,
  Settings,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { Order, Subscription } from '../types';

const Profile: React.FC = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company: profile?.company || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        company: profile.company || '',
        email: user?.email || ''
      });
    }
  }, [profile, user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const [ordersRes, subscriptionsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('subscriptions')
          .select(`
            *,
            product:products(*)
          `)
          .eq('user_id', user.id)
      ]);
      
      if (ordersRes.error) throw ordersRes.error;
      if (subscriptionsRes.error) throw subscriptionsRes.error;
      
      setOrders(ordersRes.data || []);
      setSubscriptions(subscriptionsRes.data || []);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          company: formData.company
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('Failed to update password');
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-accent-purple/20 text-accent-purple border-accent-purple/30';
      case 'pro':
        return 'bg-accent-pink/20 text-accent-pink border-accent-pink/30';
      case 'basic':
        return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-white/70">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="glass-card border-white/20">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              
              <h3 className="text-white font-semibold text-lg mb-1">
                {profile?.full_name || 'User'}
              </h3>
              
              <p className="text-white/70 text-sm mb-3">
                {user?.email}
              </p>
              
              <Badge className={getTierColor(profile?.subscription_tier || 'free')}>
                {profile?.subscription_tier || 'Free'} Plan
              </Badge>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user?.created_at || '').toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="glass-panel border-white/20">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="subscriptions" 
                className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Subscriptions
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                  <CardDescription className="text-white/70">
                    Update your personal details and contact information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-white">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                          <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="pl-10 glass-card border-white/20 text-white placeholder-white/50"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-white">
                          Company
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="pl-10 glass-card border-white/20 text-white placeholder-white/50"
                            placeholder="Enter your company"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          id="email"
                          value={formData.email}
                          disabled
                          className="pl-10 glass-card border-white/20 text-white/50 bg-white/5"
                        />
                      </div>
                      <p className="text-white/60 text-sm">
                        Email cannot be changed. Contact support if you need to update it.
                      </p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-accent-pink hover:bg-accent-pink/80 text-white"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Saving...
                        </div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Change Password</CardTitle>
                  <CardDescription className="text-white/70">
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="current_password" className="text-white">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="current_password"
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="pr-10 glass-card border-white/20 text-white placeholder-white/50"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new_password" className="text-white">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="new_password"
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="pr-10 glass-card border-white/20 text-white placeholder-white/50"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password" className="text-white">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm_password"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="pr-10 glass-card border-white/20 text-white placeholder-white/50"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-accent-pink hover:bg-accent-pink/80 text-white"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Updating...
                        </div>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscriptions">
              <div className="space-y-6">
                {subscriptions.length > 0 ? (
                  subscriptions.map((subscription) => (
                    <Card key={subscription.id} className="glass-card border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-pink/20 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-accent-pink" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">
                                {subscription.product?.name || 'Unknown Product'}
                              </h3>
                              <p className="text-white/70 text-sm">
                                {subscription.subscription_type} subscription
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <Badge className={getStatusColor(subscription.status)}>
                              {subscription.status}
                            </Badge>
                            <p className="text-white/70 text-sm mt-1">
                              {subscription.expires_at 
                                ? `Expires ${new Date(subscription.expires_at).toLocaleDateString()}`
                                : 'Lifetime access'
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="glass-card border-white/20">
                    <CardContent className="p-8 text-center">
                      <CreditCard className="w-12 h-12 text-white/30 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-semibold mb-2">No Active Subscriptions</h3>
                      <p className="text-white/70">You don't have any active subscriptions yet.</p>
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
                            <div className="w-12 h-12 bg-gradient-to-br from-accent-blue/20 to-accent-teal/20 rounded-lg flex items-center justify-center">
                              <Settings className="w-6 h-6 text-accent-blue" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">
                                Order #{order.id.slice(-8)}
                              </h3>
                              <p className="text-white/70 text-sm">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-white font-semibold">
                              ${order.total_amount.toFixed(2)}
                            </p>
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
                      <Settings className="w-12 h-12 text-white/30 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-semibold mb-2">No Orders Yet</h3>
                      <p className="text-white/70">Your order history will appear here.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;