import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, Lock, Eye, Server, Key, ShieldCheck } from 'lucide-react';

interface SecurityFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
}

const securityFeatures: SecurityFeature[] = [
  {
    icon: <Shield className="w-8 h-8 text-accent-blue" />,
    title: "End-to-End Encryption",
    description: "Military-grade encryption protects all your data in transit and at rest.",
    details: [
      "AES-256 encryption standard",
      "Zero-knowledge architecture",
      "Encrypted data transmission"
    ]
  },
  {
    icon: <Lock className="w-8 h-8 text-accent-teal" />,
    title: "Multi-Factor Authentication",
    description: "Advanced authentication layers ensure only authorized access.",
    details: [
      "Biometric authentication",
      "Time-based OTP tokens",
      "Hardware security keys"
    ]
  },
  {
    icon: <Eye className="w-8 h-8 text-accent-purple" />,
    title: "Privacy by Design",
    description: "Built with privacy at its core, ensuring your data remains yours.",
    details: [
      "No data mining or selling",
      "GDPR & CCPA compliant",
      "Transparent data policies"
    ]
  },
  {
    icon: <Server className="w-8 h-8 text-accent-pink" />,
    title: "Secure Infrastructure",
    description: "Enterprise-grade infrastructure with 99.9% uptime guarantee.",
    details: [
      "ISO 27001 certified",
      "SOC 2 Type II compliant",
      "Regular security audits"
    ]
  },
  {
    icon: <Key className="w-8 h-8 text-primary-500" />,
    title: "Access Control",
    description: "Granular permissions and role-based access management.",
    details: [
      "Role-based permissions",
      "Session management",
      "Activity monitoring"
    ]
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-accent-blue" />,
    title: "Compliance Ready",
    description: "Meet industry standards and regulatory requirements.",
    details: [
      "HIPAA compliance",
      "PCI DSS certified",
      "Regular compliance audits"
    ]
  }
];

const SecurityGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {securityFeatures.map((feature, index) => (
        <Card 
          key={index} 
          className="glass-card hover-lift border-white/20 group"
        >
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                {feature.icon}
              </div>
              <CardTitle className="text-white text-lg">
                {feature.title}
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-white/80 mb-4 leading-relaxed">
              {feature.description}
            </p>
            
            <ul className="space-y-2">
              {feature.details.map((detail, detailIndex) => (
                <li key={detailIndex} className="flex items-center text-white/70 text-sm">
                  <div className="w-1.5 h-1.5 bg-accent-pink rounded-full mr-3 flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SecurityGrid;