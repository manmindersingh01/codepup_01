import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Login successful!');
      }
    } catch (error: any) {
      setError('Invalid email or password. Please try again.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent-pink/20 rounded-full blur-xl floating-element" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-blue/20 rounded-full blur-xl floating-element" style={{ animationDelay: '2s' }} />
      
      <Card className="glass-panel w-full max-w-md border-white/20 relative z-10">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-pink rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-white/70">
            Sign in to your AI Assistant account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 glass-card border-white/20 text-white placeholder-white/50 focus:border-accent-pink"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 glass-card border-white/20 text-white placeholder-white/50 focus:border-accent-pink"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="rounded border-white/20 bg-white/10 text-accent-pink focus:ring-accent-pink" 
                />
                <span className="text-white/70 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-accent-pink hover:text-accent-pink/80 text-sm">
                Forgot password?
              </a>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-accent-pink hover:bg-accent-pink/80 text-white py-3"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-white/70">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent-pink hover:text-accent-pink/80 font-medium">
                Sign up for free
              </Link>
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-white/60 text-sm mb-4">Or continue with</p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => toast.info('Social login coming soon!')}
                >
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => toast.info('Social login coming soon!')}
                >
                  GitHub
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;