import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import { toast } from 'sonner';

type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest' | 'oldest';
type ViewMode = 'grid' | 'list';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('is_active', true),
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
      ]);
      
      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      
      // Set price range based on actual product prices
      const prices = (productsRes.data || []).map(p => p.price);
      if (prices.length > 0) {
        setPriceRange({
          min: Math.min(...prices),
          max: Math.max(...prices)
        });
      }
      
    } catch (error) {
      console.error('Error fetching shop data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('newest');
    const prices = products.map(p => p.price);
    if (prices.length > 0) {
      setPriceRange({
        min: Math.min(...prices),
        max: Math.max(...prices)
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass-card border-white/20 animate-pulse">
              <CardContent className="p-6">
                <div className="w-full h-48 bg-white/10 rounded-lg mb-4" />
                <div className="h-6 bg-white/10 rounded mb-2" />
                <div className="h-4 bg-white/10 rounded mb-4" />
                <div className="h-10 bg-white/10 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          AI Tools <span className="gradient-text">Marketplace</span>
        </h1>
        <p className="text-xl text-white/80">
          Discover powerful AI tools to transform your business and boost productivity.
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card border-white/20 mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                placeholder="Search AI tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-card border-white/20 text-white placeholder-white/50"
              />
            </div>
            
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="glass-card border-white/20 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="glass-panel border-white/20">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="glass-card border-white/20 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="glass-panel border-white/20">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name_asc">Name A-Z</SelectItem>
                <SelectItem value="name_desc">Name Z-A</SelectItem>
                <SelectItem value="price_asc">Price Low-High</SelectItem>
                <SelectItem value="price_desc">Price High-Low</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Mode */}
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 
                  'bg-primary-500 hover:bg-primary-600 text-white' : 
                  'border-white/20 text-white hover:bg-white/10'
                }
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 
                  'bg-primary-500 hover:bg-primary-600 text-white' : 
                  'border-white/20 text-white hover:bg-white/10'
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-white/70">
                {filteredProducts.length} of {products.length} products
              </span>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Clear Filters
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedCategory !== 'all' && (
                <Badge className="bg-accent-pink/20 text-accent-pink border-accent-pink/30">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </Badge>
              )}
              {searchTerm && (
                <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                  "{searchTerm}"
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {filteredProducts.length > 0 ? (
        <div className={viewMode === 'grid' ? 
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 
          'space-y-6'
        }>
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              showAddToCart={true}
            />
          ))}
        </div>
      ) : (
        <Card className="glass-card border-white/20">
          <CardContent className="p-12 text-center">
            <Filter className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">
              No products found
            </h3>
            <p className="text-white/70 mb-4">
              Try adjusting your search criteria or browse all products.
            </p>
            <Button 
              onClick={clearFilters}
              className="bg-accent-pink hover:bg-accent-pink/80 text-white"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Load More (if needed) */}
      {filteredProducts.length > 0 && filteredProducts.length < products.length && (
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-primary-500 hover:bg-primary-600 text-white"
            onClick={() => toast.info('Load more functionality coming soon!')}
          >
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default Shop;