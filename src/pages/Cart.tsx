import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  // Use the correct variable names from the hook
  const { cartItems: items, loading, updateQuantity, removeFromCart, totalPrice: total, totalItems: itemCount } = useCart();
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

          {items.map((item) => (
            <Card key={`${item.id}-${item.options?.color}-${item.options?.size}`} className="p-6">
              <div className="flex items-center space-x-4">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.images[0] || '/placeholder.svg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                </Link>

                <div className="flex-1">
                  <Link 
                    to={`/product/${item.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                  
                  {/* Display selected options */}
                  {(item.options?.color || item.options?.size) && (
                    <div className="mt-1 flex gap-2">
                      {item.options.color && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                          কালার: {item.options.color}
                        </Badge>
                      )}
                      {item.options.size && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                          সাইজ: {item.options.size}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-primary">
                      ৳{item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.options)}
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
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.options)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-right">
                  <div className="font-bold">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id, item.options)}
                    className="text-destructive hover:text-destructive mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
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
