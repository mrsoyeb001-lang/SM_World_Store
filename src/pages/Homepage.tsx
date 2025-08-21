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
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              স্বাগতম SM World Store এ
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              সেরা মানের পণ্য, সাশ্রয়ী দাম
            </p>
            <Button size="lg" variant="secondary" className="shadow-glow">
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
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">১০০০+</div>
              <div className="text-sm text-muted-foreground">
                সন্তুষ্ট গ্রাহক
              </div>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">৫০০+</div>
              <div className="text-sm text-muted-foreground">
                পণ্যের সংগ্রহ
              </div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-primary ml-1">৪.৮</span>
              </div>
              <div className="text-sm text-muted-foreground">গড় রেটিং</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">২৪/৭</div>
              <div className="text-sm text-muted-foreground">সাপোর্ট</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:block lg:w-1/4">
              <CategorySidebar />

              {/* Trending Products - Hidden on mobile */}
              <Card className="p-6 mt-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold">জনপ্রিয় পণ্য</h3>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded" />
                      <div>
                        <p className="text-sm font-medium">পণ্যের নাম {i}</p>
                        <p className="text-sm text-primary font-bold">৳৯৯৯</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Product Grid */}
            <div className="w-full lg:w-3/4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">সর্বশেষ পণ্যসমূহ</h2>
                <Button
                  variant="outline"
                  onClick={() => navigate('/products')}
                >
                  সব দেখুন
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Modified ProductGrid with proper mobile responsiveness */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Sample product cards - these should be replaced with your actual ProductGrid component */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <Card key={item} className="overflow-hidden">
                    <div className="aspect-square bg-muted relative">
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -33%
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-1">Mini Hand Fan</h3>
                      <div className="flex items-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-xs ml-1 text-muted-foreground">(35)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-primary font-bold">৳৩,৩৯৯</span>
                          <span className="text-muted-foreground text-xs line-through ml-1">৳৫,৫৯৯</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Hidden on mobile and desktop */}
      <section className="py-16 bg-secondary/20 hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            কেন আমাদের বেছে নিবেন?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">উন্নত মান</h3>
              <p className="text-muted-foreground">
                আমরা শুধুমাত্র সেরা মানের পণ্য বিক্রি করি
              </p>
            </Card>

            <Card className="p-8 text-center card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">দ্রুত ডেলিভারি</h3>
              <p className="text-muted-foreground">
                সারাদেশে দ্রুত ও নিরাপদ ডেলিভারি সেবা
              </p>
            </Card>

            <Card className="p-8 text-center card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">সহজ অর্ডার</h3>
              <p className="text-muted-foreground">
                মাত্র কয়েক ক্লিকেই অর্ডার সম্পন্ন করুন
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
