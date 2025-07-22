import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc.",
    content: "This AI assistant has revolutionized how we handle customer inquiries. The automation capabilities are incredible and have saved us countless hours.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateCorp",
    content: "The integration was seamless and the results were immediate. Our team productivity increased by 40% within the first month of implementation.",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthLab",
    content: "Outstanding AI capabilities with excellent customer support. The tool adapts perfectly to our workflow and continues to learn from our processes.",
    rating: 5
  },
  {
    id: 4,
    name: "David Thompson",
    role: "CTO",
    company: "DataFlow Systems",
    content: "Security and reliability are top-notch. We've processed millions of requests without any issues. Highly recommend for enterprise use.",
    rating: 5
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Operations Manager",
    company: "StreamlineOps",
    content: "The ROI has been exceptional. What used to take our team hours now takes minutes. The AI assistant handles complex queries with remarkable accuracy.",
    rating: 5
  }
];

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0">
              <Card className="glass-card border-white/20 mx-4">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <Quote className="w-8 h-8 text-accent-pink flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-white/90 text-lg leading-relaxed mb-6">
                        {testimonial.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-pink rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{testimonial.name}</h4>
                            <p className="text-white/70 text-sm">
                              {testimonial.role} at {testimonial.company}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center mt-8 space-x-4">
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-accent-pink scale-110' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        
        <Button
          onClick={goToNext}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;