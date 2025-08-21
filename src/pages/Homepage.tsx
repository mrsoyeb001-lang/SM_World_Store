import { useState, useEffect } from 'react';
import { CategorySidebar } from '@/components/layout/CategorySidebar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Star, TrendingUp, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState([]);

  // ট্রেন্ডিং প্রোডাক্টস ফেচ করার সিমুলেশন
  useEffect(() => {
    // এখানে আসলে API কল হবে
    const mockTrendingProducts = [
      { id: 1, name: 'স্মার্টফোন এক্স১', price: ১৫৯৯৯, image: '/placeholder.jpg' },
      { id: 2, name: 'ওয়্যারলেস হেডফোন', price: ৩৫০০, image: '/placeholder.jpg' },
      { id: 3, name: 'পাওয়ার ব্যাংক', price: ২২০০, image: '/placeholder.jpg' },
      { id: 4, name: 'স্মার্টওয়াচ', price: ৪৫০০, image: '/placeholder.jpg' }
    ];
    setTrendingProducts(mockTrendingProducts);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image Background */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="SM World Store" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
              স্বাগতম SM World Store এ
            </h1>
            <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
              সেরা মানের পণ্য, সাশ্রয়ী দাম
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white shadow-glow px-6 py-3"
              onClick={() => navigate('/products')}
            >
              কেনাকাটা শুরু করুন
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 md:p-6 text-center">
              <div className="text-xl md:text-2xl font-bold text-primary mb-2">১০০০+</div>
              <div className="text-xs md:text-sm text-muted-foreground">
                সন্তুষ্ট গ্রাহক
              </div>
            </Card>

            <Card className="p-4 md:p-6 text-center">
              <div className="text-xl md:text-2xl font-bold text-primary mb-2">৫০০+</div>
              <div className="text-xs md:text-sm text-muted-foreground">
                পণ্যের সংগ্রহ
              </div>
            </Card>

            <Card className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 md:h-6 md:w-6 fill-yellow-400 text-yellow-400" />
                <span className="text-xl md:text-2xl font-bold text-primary ml-1">৪.৮</span>
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">গড় রেটিং</div>
            </Card>

            <Card className="p-4 md:p-6 text-center">
              <div className="text-xl md:text-2xl font-bold text-primary mb-2">২৪/৭</div>
              <div className="text-xs md:text-sm text-muted-foreground">সাপোর্ট</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CategorySidebar />

              {/* Trending Products */}
              <Card className="p-4 md:p-6 mt-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold">জনপ্রিয় পণ্য</h3>
                </div>

                <div className="space-y-4">
                  {trendingProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <div className="w-12 h-12 bg-muted rounded flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-sm text-primary font-bold">৳{product.price.toLocaleString('bn-BD')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">সর্বশেষ পণ্যসমূহ</h2>
                <Button
                  variant="outline"
                  onClick={() => navigate('/products')}
                  className="hidden sm:flex"
                >
                  সব দেখুন
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/products')}
                  className="sm:hidden"
                >
                  সব
                </Button>
              </div>

              <ProductGrid 
                limit={12} 
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            আমাদের সেবাসমূহ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center flex flex-col items-center card-hover">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">দ্রুত ডেলিভারি</h3>
              <p className="text-muted-foreground text-sm">
                অর্ডার করলে ২৪-৪৮ ঘন্টার মধ্যে পণ্য পেয়ে যাবেন
              </p>
            </Card>

            <Card className="p-6 text-center flex flex-col items-center card-hover">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">অরিজিনাল প্রোডাক্ট</h3>
              <p className="text-muted-foreground text-sm">
                ১০০% অরিজিনাল ও গ্যারান্টিযুক্ত পণ্য সরবরাহ
              </p>
            </Card>

            <Card className="p-6 text-center flex flex-col items-center card-hover">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <HeadphonesIcon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">২৪/৭ সাপোর্ট</h3>
              <p className="text-muted-foreground text-sm">
                যেকোনো সমস্যায় আমাদের সাথে যোগাযোগ করুন যেকোনো সময়
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
