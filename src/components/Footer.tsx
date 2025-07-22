import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Lock, Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="glass-panel mt-20 mx-4 mb-4 rounded-2xl">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-white font-bold text-xl">AI Assistant Tool</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Empowering businesses with cutting-edge AI technology. 
              Transform your workflow with intelligent automation and insights.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-accent-pink" />
                <span className="text-white/70 text-sm">support@aiassistant.com</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Product</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <Link to="/shop" className="text-white/70 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('demo')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Demo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('security')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Security
                </button>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Company</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Testimonials
                </button>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Trust & Security</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 glass-card border-white/10 rounded-lg">
                <Shield className="w-8 h-8 text-accent-blue mb-2" />
                <span className="text-white/70 text-xs text-center">SOC 2 Certified</span>
              </div>
              <div className="flex flex-col items-center p-3 glass-card border-white/10 rounded-lg">
                <Lock className="w-8 h-8 text-accent-teal mb-2" />
                <span className="text-white/70 text-xs text-center">GDPR Compliant</span>
              </div>
              <div className="flex flex-col items-center p-3 glass-card border-white/10 rounded-lg">
                <Award className="w-8 h-8 text-accent-purple mb-2" />
                <span className="text-white/70 text-xs text-center">ISO 27001</span>
              </div>
              <div className="flex flex-col items-center p-3 glass-card border-white/10 rounded-lg">
                <Globe className="w-8 h-8 text-accent-pink mb-2" />
                <span className="text-white/70 text-xs text-center">Global CDN</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm">
              © 2024 AI Assistant Tool. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;