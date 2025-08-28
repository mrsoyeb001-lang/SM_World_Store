import { useState, useEffect } from 'react';
import { CategorySidebar } from '@/components/layout/CategorySidebar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // স্লাইডার ইমেজ ডেটা
  const slides = [
    {
      id: 1,
      image: '/public/slaider27/slid1.png',
      title: 'স্বাগতম SM World Store এ',
      subtitle: 'সেরা মানের পণ্য, সাশ্রয়ী দাম'
    },
    {
      id: 2,
      image: '/public/slaider27/slid2.png',
      title: 'বিশেষ ছাড়',
      subtitle: 'নতুন গ্রাহকদের জন্য ২০% ছাড়'
    },
    {
      id: 3,
      image: '/public/slaider27/slid3.png',
      title: 'দ্রুত ডেলিভারি',
      subtitle: 'অর্ডার করুন আজই, পেয়ে যান আগামীকাল'
    },
    {
      id: 4,
      image: '/public/slaider27/slid4.png',
      title: 'নতুন পণ্যের সমাহার',
      subtitle: 'প্রতিদিন যোগ হচ্ছে নতুন নতুন পণ্য'
    }
  ];

  // অটোমেটিক স্লাইড পরিবর্তন
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Slider */}
      <section className="relative h-[300px] md:h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-6 opacity-90">
                  {slide.subtitle}
                </p>
                <Button size="lg" variant="secondary" className="shadow-glow">
                  কেনাকাটা শুরু করুন
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section - Compact */}
      <section className="py-6 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <div className="flex items-center bg-background rounded-lg p-3 min-w-[140px]">
              <div className="text-lg font-bold text-primary mr-2">১০০০+</div>
              <div className="text-xs text-muted-foreground">সন্তুষ্ট গ্রাহক</div>
            </div>
            
            <div className="flex items-center bg-background rounded-lg p-3 min-w-[140px]">
              <div className="text-lg font-bold text-primary mr-2">৫০০+</div>
              <div className="text-xs text-muted-foreground">পণ্যের সংগ্রহ</div>
            </div>
            
            <div className="flex items-center bg-background rounded-lg p-3 min-w-[140px]">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-lg font-bold text-primary mr-2">৪.৮</span>
              <div className="text-xs text-muted-foreground">গড় রেটিং</div>
            </div>
            
            <div className="flex items-center bg-background rounded-lg p-3 min-w-[140px]">
              <div className="text-lg font-bold text-primary mr-2">২৪/৭</div>
              <div className="text-xs text-muted-foreground">সাপোর্ট</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar and Trending Products - Hidden on mobile, visible on larger screens */}
            <div className="hidden lg:block w-full lg:w-1/4">
              <CategorySidebar />
              
              <Card className="p-4 mt-6">
                <div className="flex items-center mb-3">
                  <TrendingUp className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-md font-semibold">জনপ্রিয় পণ্য</h3>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-muted rounded" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium truncate">পণ্যের নাম {i}</p>
                        <p className="text-xs text-primary font-bold">৳৯৯৯</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Product Grid - Full width on mobile */}
            <div className="w-full lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">সর্বশেষ পণ্যসমূহ</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/products')}
                  className="hidden md:flex"
                >
                  সব দেখুন
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/products')}
                  className="md:hidden"
                >
                  সব
                </Button>
              </div>

              <ProductGrid limit={12} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Compact */}
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8">
            কেন আমাদের বেছে নিবেন?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-md font-semibold mb-2">উন্নত মান</h3>
              <p className="text-xs text-muted-foreground">
                আমরা শুধুমাত্র সেরা মানের পণ্য বিক্রি করি
              </p>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-md font-semibold mb-2">দ্রুত ডেলিভারি</h3>
              <p className="text-xs text-muted-foreground">
                সারাদেশে দ্রুত ও নিরাপদ ডেলিভারি
              </p>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-md font-semibold mb-2">সহজ অর্ডার</h3>
              <p className="text-xs text-muted-foreground">
                মাত্র কয়েক ক্লিকেই অর্ডার সম্পন্ন করুন
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
