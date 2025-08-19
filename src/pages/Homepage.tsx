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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CategorySidebar />
              
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

      {/* Features Section */}
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
