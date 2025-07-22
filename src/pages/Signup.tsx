import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Building, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company: formData.company
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Account created successfully! Please check your email to verify your account.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create account. Please try again.');
      toast.error('Signup failed');
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full relative z-10">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Join the AI Revolution
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Transform your business with cutting-edge AI technology. 
              Start your free trial today and experience the future of work.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-accent-teal/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-accent-teal" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">14-Day Free Trial</h3>
                <p className="text-white/70">Full access to all features with no credit card required</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-accent-blue/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Enterprise Security</h3>
                <p className="text-white/70">Bank-level encryption and compliance certifications</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-accent-purple/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">24/7 Support</h3>
                <p className="text-white/70">Expert support team available whenever you need help</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-accent-pink/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-accent-pink" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Cancel Anytime</h3>
                <p className="text-white/70">No long-term contracts or hidden fees</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Signup Form */}
        <Card className="glass-panel border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-pink rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">AI</span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-white/70">
              Start your AI journey today with a free trial
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10 glass-card border-white/20 text-white placeholder-white/50 focus:border-accent-pink"
                      placeholder="John Doe"
                      required
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
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="pl-10 glass-card border-white/20 text-white placeholder-white/50 focus:border-accent-pink"
                      placeholder="Your Company"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 glass-card border-white/20 text-white placeholder-white/50 focus:border-accent-pink"
                    placeholder="john@company.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 glass-card border-white/20 text-white placeholder-white/50 focus:border-accent-pink"
                    placeholder="Create a strong password"
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 glass-card border-white/20 text-white placeholder-white/50 focus:border-accent-pink"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  id="terms"
                  className="mt-1 rounded border-white/20 bg-white/10 text-accent-pink focus:ring-accent-pink" 
                  required
                />
                <label htmlFor="terms" className="text-white/70 text-sm leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-accent-pink hover:text-accent-pink/80">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-accent-pink hover:text-accent-pink/80">
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-accent-pink hover:bg-accent-pink/80 text-white py-3"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating account...
                  </div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-white/70">
                Already have an account?{' '}
                <Link to="/login" className="text-accent-pink hover:text-accent-pink/80 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;