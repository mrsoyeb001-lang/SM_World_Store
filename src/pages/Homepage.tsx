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
      {/* ================= Hero Section ================= */}
      <section 
        className="relative text-white py-32 md:py-40 bg-fixed bg-center bg-cover" 
        style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?shopping,store')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-wide drop-shadow-lg">
            স্বাগতম <span className="text-primary">SM World Store</span> এ
          </h1>
          <p className="text-lg md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            সেরা মানের পণ্য, আধুনিক ডিজাইন এবং সাশ্রয়ী মূল্যে — আপনার নির্ভরযোগ্য অনলাইন স্টোর
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="shadow-glow px-8 py-6 text-lg rounded-2xl transition-transform transform hover:scale-105"
            onClick={() => navigate('/products')}
          >
            কেনাকাটা শুরু করুন
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce text-white/70">
            <ArrowRight className="rotate-90 h-8 w-8" />
          </div>
        </div>
      </section>

      {/* ================= Stats Section ================= */}
      <section className="py-8 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">১০০০+</div>
              <div className="text-sm text-muted-foreground">সন্তুষ্ট গ্রাহক</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">৫০০+</div>
              <div className="text-sm text-muted-foreground">পণ্যের সংগ্রহ</div>
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

      {/* ================= Main Content ================= */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CategorySidebar />

              {/* Trending Products */}
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
            <div className="lg:col-span-3">
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

              <ProductGrid limit={12} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= Features Section ================= */}
      <section className="py-16 bg-secondary/20">
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
