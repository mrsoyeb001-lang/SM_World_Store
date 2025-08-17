import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export default function Cart() {
  const { items, loading, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="max-w-md mx-auto p-8">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">কার্ট দেখতে লগইন করুন</h1>
          <Button asChild className="btn-gradient">
            <Link to="/auth">লগইন করুন</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-muted animate-pulse rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="max-w-md mx-auto p-8">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">আপনার কার্ট খালি</h1>
          <p className="text-muted-foreground mb-6">
            কেনাকাটা শুরু করতে পণ্য যোগ করুন
          </p>
          <Button asChild className="btn-gradient">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              কেনাকাটা করুন
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            কেনাকাটা চালিয়ে যান
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold mb-6">
            আপনার কার্ট ({itemCount} টি পণ্য)
          </h1>

          {items.map((item) => {
            const currentPrice = item.product.sale_price || item.product.price;
            const originalPrice = item.product.price;
            const hasDiscount = item.product.sale_price && item.product.sale_price < originalPrice;

            return (
              <Card key={item.id} className="p-6">
                <div className="flex items-center space-x-4">
                  <Link to={`/product/${item.product.id}`}>
                    <img
                      src={item.product.images[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link 
                      to={`/product/${item.product.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-primary">
                        ৳{currentPrice}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          ৳{originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <div className="font-bold">
                      ৳{(currentPrice * item.quantity).toLocaleString()}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-destructive hover:text-destructive mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">অর্ডার সারসংক্ষেপ</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>উপমোট ({itemCount} টি পণ্য)</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ</span>
                <span className="text-green-600">বিনামূল্যে</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>মোট</span>
                <span className="text-primary">৳{total.toLocaleString()}</span>
              </div>
            </div>

            <Button asChild className="w-full mt-6 btn-gradient" size="lg">
              <Link to="/checkout">
                চেকআউট করুন
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              নিরাপদ পেমেন্ট এবং দ্রুত ডেলিভারি
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}