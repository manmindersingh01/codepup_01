import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Menu, User, ShoppingCart, LogOut, Settings, Home } from 'lucide-react';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="glass-panel fixed top-0 left-0 right-0 z-50 mx-4 mt-4 rounded-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-pink rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-white font-bold text-xl">AI Assistant Tool</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white/80 hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-white/80 hover:text-white transition-colors"
            >
              Features
            </button>
            <Link to="/shop" className="text-white/80 hover:text-white transition-colors">
              Shop
            </Link>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-white/80 hover:text-white transition-colors"
            >
              Testimonials
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <ShoppingCart className="w-5 h-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-panel border-white/20">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/10">
                      <Home className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="text-white hover:bg-white/10">
                      <Settings className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    {profile?.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="text-white hover:bg-white/10">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-white/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-accent-pink hover:bg-accent-pink/80 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-white/80 hover:text-white transition-colors py-2">
                Home
              </Link>
              <button
                onClick={() => {
                  scrollToSection('about');
                  setIsMenuOpen(false);
                }}
                className="text-white/80 hover:text-white transition-colors py-2 text-left"
              >
                About
              </button>
              <button
                onClick={() => {
                  scrollToSection('features');
                  setIsMenuOpen(false);
                }}
                className="text-white/80 hover:text-white transition-colors py-2 text-left"
              >
                Features
              </button>
              <Link to="/shop" className="text-white/80 hover:text-white transition-colors py-2">
                Shop
              </Link>
              <button
                onClick={() => {
                  scrollToSection('testimonials');
                  setIsMenuOpen(false);
                }}
                className="text-white/80 hover:text-white transition-colors py-2 text-left"
              >
                Testimonials
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;