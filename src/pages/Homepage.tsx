import { CategorySidebar } from '@/components/layout/CategorySidebar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
          alt="SM World Store" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
              স্বাগতম SM World Store এ
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-95">
              সেরা মানের পণ্য, সাশ্রয়ী দাম
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="shadow-glow"
              onClick={() => navigate('/products')}
            >
              কেনাকাটা শুরু করুন
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-secondary/20">
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
              <div className="hidden lg:block">
                <CategorySidebar />

                {/* Trending Products */}
                <Card className="p-6 mt-6">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">জনপ্রিয় পণ্য</h3>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/product/' + i)}>
                        <div className="w-12 h-12 bg-muted rounded flex-shrink-0">
                          <img 
                            src={`https://picsum.photos/100?random=${i}`} 
                            alt={`Product ${i}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">পণ্যের নাম {i}</p>
                          <p className="text-sm text-primary font-bold">৳৯৯৯</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
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
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>

              <ProductGrid 
                limit={12} 
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
