import React from 'react';
import { Product } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Star, Play, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showAddToCart = true }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (subscriptionType: 'monthly' | 'yearly' | 'lifetime') => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await addItem(product, subscriptionType);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const getPrice = (type: 'monthly' | 'yearly' | 'lifetime') => {
    switch (type) {
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

  return (
    <Card className="glass-card hover-lift group overflow-hidden border-white/20">
      <CardHeader className="pb-4">
        {product.image_url && (
          <div className="w-full h-48 bg-gradient-to-br from-primary-500/20 to-accent-pink/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">{product.name}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/60 text-sm">(4.8)</span>
            </div>
          </div>
          
          {product.subscription_required && (
            <Badge className="bg-accent-pink/20 text-accent-pink border-accent-pink/30">
              Subscription
            </Badge>
          )}
        </div>
        
        <CardDescription className="text-white/70 line-clamp-3">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        {product.features && product.features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-white font-medium mb-2">Key Features:</h4>
            <ul className="space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-white/70 text-sm flex items-center">
                  <div className="w-1.5 h-1.5 bg-accent-pink rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Monthly</span>
            <span className="text-white font-semibold">${getPrice('monthly')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Yearly</span>
            <span className="text-white font-semibold">${getPrice('yearly')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Lifetime</span>
            <span className="text-white font-semibold">${getPrice('lifetime')}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex w-full space-x-2">
          <Button 
            onClick={handleViewDetails}
            variant="outline" 
            size="sm" 
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            <Play className="w-4 h-4 mr-2" />
            View Details
          </Button>
          
          {product.demo_url && (
            <Button 
              onClick={() => window.open(product.demo_url, '_blank')}
              variant="outline" 
              size="sm" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              Demo
            </Button>
          )}
        </div>
        
        {showAddToCart && (
          <div className="flex w-full space-x-1">
            <Button 
              onClick={() => handleAddToCart('monthly')}
              size="sm" 
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Monthly
            </Button>
            <Button 
              onClick={() => handleAddToCart('yearly')}
              size="sm" 
              className="flex-1 bg-accent-purple hover:bg-accent-purple/80 text-white"
            >
              Yearly
            </Button>
            <Button 
              onClick={() => handleAddToCart('lifetime')}
              size="sm" 
              className="flex-1 bg-accent-pink hover:bg-accent-pink/80 text-white"
            >
              Lifetime
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;