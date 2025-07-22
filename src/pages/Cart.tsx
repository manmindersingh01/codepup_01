import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Shield,
  ArrowRight,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessingCheckout(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
        subscription_type: item.subscription_type
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create subscriptions for each item
      const subscriptions = items.map(item => {
        const startDate = new Date();
        let expiresAt = null;
        
        if (item.subscription_type === 'monthly') {
          expiresAt = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        } else if (item.subscription_type === 'yearly') {
          expiresAt = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
        }
        
        return {
          user_id: user.id,
          product_id: item.product_id,
          order_id: order.id,
          status: 'active',
          subscription_type: item.subscription_type,
          starts_at: startDate.toISOString(),
          expires_at: expiresAt?.toISOString(),
          auto_renew: item.subscription_type !== 'lifetime'
        };
      });

      const { error: subscriptionsError } = await supabase
        .from('subscriptions')
        .insert(subscriptions);

      if (subscriptionsError) throw subscriptionsError;

      // Update order status
      await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', order.id);

      // Clear cart
      await clearCart();

      toast.success('Order completed successfully!');
      navigate('/dashboard');

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setProcessingCheckout(false);
    }
  };

  const getItemPrice = (item: any) => {
    if (!item.product) return 0;
    
    switch (item.subscription_type) {
      case 'monthly':
        return item.product.monthly_price || item.product.price;
      case 'yearly':
        return item.product.yearly_price || item.product.price * 10;
      case 'lifetime':
        return item.product.price;
      default:
        return item.product.price;
    }
  };

  const getSubscriptionBadgeColor = (type: string) => {
    switch (type) {
      case 'monthly':
        return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
      case 'yearly':
        return 'bg-accent-purple/20 text-accent-purple border-accent-purple/30';
      case 'lifetime':
        return 'bg-accent-pink/20 text-accent-pink border-accent-pink/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/4" />
          <div className="h-32 bg-white/10 rounded" />
          <div className="h-32 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Shopping Cart
        </h1>
        <p className="text-white/70">
          {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="glass-card border-white/20">
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">
              Your cart is empty
            </h3>
            <p className="text-white/70 mb-6">
              Discover our AI tools and start building something amazing.
            </p>
            <Button 
              onClick={() => navigate('/shop')}
              className="bg-accent-pink hover:bg-accent-pink/80 text-white"
            >
              Browse AI Tools
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-accent-pink/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product?.image_url ? (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-white/50" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {item.product?.name || 'Unknown Product'}
                          </h3>
                          <p className="text-white/70 text-sm mb-2">
                            {item.product?.description}
                          </p>
                          <Badge className={getSubscriptionBadgeColor(item.subscription_type)}>
                            {item.subscription_type}
                          </Badge>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="border-white/20 text-white hover:bg-white/10 w-8 h-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center glass-card border-white/20 text-white"
                            min="1"
                          />
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="border-white/20 text-white hover:bg-white/10 w-8 h-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-white font-semibold text-lg">
                            ${(getItemPrice(item) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-white/60 text-sm">
                            ${getItemPrice(item)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/shop')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Continue Shopping
              </Button>
              
              <Button
                variant="outline"
                onClick={clearCart}
                className="border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                Clear Cart
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/70">
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span className="text-white">
                        ${(getItemPrice(item) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="bg-white/20" />
                
                <div className="flex justify-between">
                  <span className="text-white/70">Subtotal</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/70">Tax</span>
                  <span className="text-white">$0.00</span>
                </div>
                
                <Separator className="bg-white/20" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <Button 
                  onClick={handleCheckout}
                  disabled={processingCheckout || items.length === 0}
                  className="w-full bg-accent-pink hover:bg-accent-pink/80 text-white py-3 text-lg"
                >
                  {processingCheckout ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>
                
                <div className="mt-4 space-y-2 text-center text-white/60 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure checkout with 256-bit SSL</span>
                  </div>
                  <p>30-day money-back guarantee</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;