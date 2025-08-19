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
      {/* ✅ Hero Section */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              স্বাগতম Badhon's World এ
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

      {/* ✅ Stats Section */}
      <section className="py-6 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-lg font-bold text-primary mb-1">১০০০+</div>
              <div className="text-xs text-muted-foreground">সন্তুষ্ট গ্রাহক</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-lg font-bold text-primary mb-1">৫০০+</div>
              <div className="text-xs text-muted-foreground">পণ্যের সংগ্রহ</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold text-primary ml-1">৪.৮</span>
              </div>
              <div className="text-xs text-muted-foreground">গড় রেটিং</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-lg font-bold text-primary mb-1">২৪/৭</div>
              <div className="text-xs text-muted-foreground">সাপোর্ট</div>
            </Card>
          </div>
        </div>
      </section>

      {/* ✅ Main Content */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <CategorySidebar />

              {/* ✅ Trending Products */}
              <Card className="p-4">
                <div className="flex items-center mb-3">
                  <TrendingUp className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-base font-semibold">জনপ্রিয় পণ্য</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <div className="w-14 h-14 bg-muted rounded mx-auto mb-1" />
                      <p className="text-xs font-medium">পণ্য {i}</p>
                      <p className="text-xs text-primary font-bold">৳৯৯৯</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">সর্বশেষ পণ্যসমূহ</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/products')}
                >
                  সব দেখুন
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {/* ✅ Mobile: 2 Columns | Desktop: 4 Columns */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <ProductGrid limit={12} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Features Section */}
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            কেন আমাদের বেছে নিবেন?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <Star className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="text-base font-semibold mb-1">উন্নত মান</h3>
              <p className="text-xs text-muted-foreground">
                আমরা শুধুমাত্র সেরা মানের পণ্য বিক্রি করি
              </p>
            </Card>

            <Card className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="text-base font-semibold mb-1">দ্রুত ডেলিভারি</h3>
              <p className="text-xs text-muted-foreground">
                সারাদেশে দ্রুত ও নিরাপদ ডেলিভারি সেবা
              </p>
            </Card>

            <Card className="p-4 text-center">
              <ArrowRight className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="text-base font-semibold mb-1">সহজ অর্ডার</h3>
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
