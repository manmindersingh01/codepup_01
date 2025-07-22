import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MessageCircle, 
  Brain, 
  BarChart3, 
  FileText, 
  Code, 
  Image,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface Capability {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  demo: {
    input: string;
    output: string;
    processing: boolean;
  };
}

const capabilities: Capability[] = [
  {
    id: 'chat',
    title: 'Intelligent Conversations',
    description: 'Natural language processing with context awareness and multi-turn conversations.',
    icon: <MessageCircle className="w-6 h-6" />,
    demo: {
      input: "How can I improve my website's SEO performance?",
      output: "Here are 5 key strategies to boost your SEO:\n\n1. **Optimize page speed** - Compress images and minify CSS/JS\n2. **Create quality content** - Focus on user intent and value\n3. **Build backlinks** - Reach out to relevant websites\n4. **Improve mobile experience** - Ensure responsive design\n5. **Use structured data** - Help search engines understand your content\n\nWould you like me to elaborate on any of these strategies?",
      processing: false
    }
  },
  {
    id: 'analysis',
    title: 'Data Analysis',
    description: 'Advanced analytics and insights from complex datasets with visualization support.',
    icon: <BarChart3 className="w-6 h-6" />,
    demo: {
      input: "Analyze Q4 sales data trends",
      output: "📊 **Q4 Sales Analysis Results:**\n\n• **Total Revenue:** $2.4M (+15% vs Q3)\n• **Top Product:** AI Assistant Pro (35% of sales)\n• **Growth Rate:** 12% month-over-month\n• **Customer Acquisition:** 1,200 new customers\n\n**Key Insights:**\n- Enterprise segment showing strongest growth\n- Mobile conversions up 28%\n- Recommendation: Focus marketing on enterprise features",
      processing: false
    }
  },
  {
    id: 'content',
    title: 'Content Generation',
    description: 'Create high-quality content for blogs, marketing, and documentation.',
    icon: <FileText className="w-6 h-6" />,
    demo: {
      input: "Write a product description for an AI-powered project management tool",
      output: "**Transform Your Project Management with AI**\n\nStreamline workflows, predict bottlenecks, and boost team productivity with our intelligent project management platform.\n\n✨ **Key Features:**\n• Smart task prioritization based on deadlines and dependencies\n• Automated progress tracking and reporting\n• AI-powered risk assessment and mitigation suggestions\n• Intelligent resource allocation optimization\n\n**Perfect for teams of 5-500+** | **14-day free trial** | **No setup fees**",
      processing: false
    }
  },
  {
    id: 'code',
    title: 'Code Generation',
    description: 'Generate, debug, and optimize code across multiple programming languages.',
    icon: <Code className="w-6 h-6" />,
    demo: {
      input: "Create a React component for a user profile card",
      output: `interface UserProfileProps {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

const UserProfileCard: React.FC<UserProfileProps> = ({
  name, email, avatar, role
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <img 
          src={avatar || '/default-avatar.png'} 
          alt={name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-gray-600">{email}</p>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
};`,
      processing: false
    }
  }
];

const CapabilityShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoStates, setDemoStates] = useState<Record<string, any>>({});

  const runDemo = (capabilityId: string) => {
    setActiveDemo(capabilityId);
    setDemoStates(prev => ({ ...prev, [capabilityId]: { processing: true } }));
    
    // Simulate processing time
    setTimeout(() => {
      setDemoStates(prev => ({ ...prev, [capabilityId]: { processing: false } }));
      setActiveDemo(null);
    }, 2000);
  };

  const resetDemo = (capabilityId: string) => {
    setDemoStates(prev => ({ ...prev, [capabilityId]: { processing: false } }));
    setActiveDemo(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 glass-panel border-white/20">
          {capabilities.map((capability) => (
            <TabsTrigger 
              key={capability.id} 
              value={capability.id}
              className="data-[state=active]:bg-white/20 text-white/70 data-[state=active]:text-white"
            >
              <div className="flex items-center space-x-2">
                {capability.icon}
                <span className="hidden sm:inline">{capability.title}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {capabilities.map((capability) => (
          <TabsContent key={capability.id} value={capability.id} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-3">
                    {capability.icon}
                    <span>{capability.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-6 leading-relaxed">
                    {capability.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Try it out:</h4>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-white/90 text-sm">
                          {capability.demo.input}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => runDemo(capability.id)}
                        disabled={activeDemo === capability.id}
                        className="bg-primary-500 hover:bg-primary-600 text-white"
                      >
                        {activeDemo === capability.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Run Demo
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => resetDemo(capability.id)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">AI Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/20 rounded-lg p-4 border border-white/10 min-h-[300px]">
                    {demoStates[capability.id]?.processing ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <RefreshCw className="w-8 h-8 text-accent-pink animate-spin mx-auto mb-4" />
                          <p className="text-white/70">AI is thinking...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-white/90 text-sm leading-relaxed whitespace-pre-line">
                        {activeDemo === capability.id || demoStates[capability.id] ? 
                          capability.demo.output : 
                          "Click 'Run Demo' to see AI in action..."
                        }
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CapabilityShowcase;