export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin';
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  avatar_url?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  price: number;
  monthly_price?: number;
  yearly_price?: number;
  features: string[];
  image_url?: string;
  demo_url?: string;
  is_active: boolean;
  subscription_required: boolean;
  trial_days: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  subscription_type: 'monthly' | 'yearly' | 'lifetime';
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  payment_method?: string;
  payment_id?: string;
  billing_address?: Record<string, any>;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subscription_type?: 'monthly' | 'yearly' | 'lifetime';
  created_at: string;
  product?: Product;
}

export interface Subscription {
  id: string;
  user_id: string;
  product_id: string;
  order_id?: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  subscription_type: 'monthly' | 'yearly' | 'lifetime';
  starts_at: string;
  expires_at?: string;
  trial_ends_at?: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface User {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
  created_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  full_name: string;
  company?: string;
}

export interface ProfileUpdateForm {
  full_name?: string;
  company?: string;
  avatar_url?: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, subscriptionType: 'monthly' | 'yearly' | 'lifetime') => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
  loading: boolean;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

export type SubscriptionType = 'monthly' | 'yearly' | 'lifetime';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';
export type UserRole = 'user' | 'admin';
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';