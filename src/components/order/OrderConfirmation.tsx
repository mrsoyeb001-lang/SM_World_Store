// src/components/order/OrderConfirmation.tsx

import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MapPin, CreditCard, ShoppingBag, Box, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url: string;
  };
}

interface OrderConfirmationState {
  orderId: string;
  total: number;
  shippingCost: number;
  discount: number;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
  promoCode: string | null;
}

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve order data from the navigation state
  const orderData = location.state as OrderConfirmationState;

  // Handle cases where orderData is missing
  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-destructive">দুঃখিত! 😟</h1>
        <p className="text-lg text-muted-foreground mb-8">
          অর্ডারের কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।
        </p>
        <Button onClick={() => navigate('/')}>
          হোমপেজে ফিরে যান
        </Button>
      </div>
    );
  }

  // Map payment method keys to display names
  const paymentMethodDisplayNames: Record<string, string> = {
    cash_on_delivery: 'ক্যাশ অন ডেলিভারি',
    bkash: 'বিকাশ',
    rocket: 'রকেট',
    nagad: 'নগদ',
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Main Confirmation Message */}
        <Card className="text-center p-8 bg-card shadow-lg border-primary/20">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে! 🎉</h1>
          <p className="text-lg text-muted-foreground">
            আপনার অর্ডারটি সফলভাবে প্লেস হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
          </p>
          <div className="mt-6 space-x-4">
            <Button size="lg" onClick={() => navigate('/')}>
              হোমপেজে ফিরে যান
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/my-orders')}>
              অর্ডার ট্র্যাক করুন
            </Button>
          </div>
        </Card>
        
        {/* A horizontal line to separate sections */}
        <div className="my-12">
          <Separator />
        </div>

        {/* Order Details & Summary */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary Card */}
          <Card className="p-6 bg-card shadow-md">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Box className="h-5 w-5 text-primary" />
                অর্ডার সামারি
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div className="flex justify-between font-medium">
                <span>অর্ডার নং:</span>
                <span className="text-primary font-mono">{orderData.orderId.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>তারিখ:</span>
                <span>{format(new Date(), 'dd MMMM, yyyy')}</span>
              </div>
              <Separator />
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.product.image_url || '/placeholder.png'}
                    alt={item.product.name}
                    className="h-12 w-12 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">পরিমাণ: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-sm">৳{item.price * item.quantity}</span>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>সাবটোটাল</span>
                  <span>৳{(orderData.total - orderData.shippingCost + orderData.discount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>শিপিং</span>
                  <span>৳{orderData.shippingCost.toFixed(2)}</span>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>ছাড় ({orderData.promoCode || 'প্রয়োগকৃত'})</span>
                    <span>-৳{orderData.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>মোট</span>
                  <span>৳{orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping and Payment Info Card */}
          <Card className="p-6 bg-card shadow-md">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                শিপিং এবং পেমেন্ট
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {/* Shipping Address */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold">শিপিং ঠিকানা</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>পূর্ণ নাম:</strong> {orderData.shippingAddress.fullName}</p>
                  <p><strong>ফোন:</strong> {orderData.shippingAddress.phone}</p>
                  <p><strong>ঠিকানা:</strong> {orderData.shippingAddress.address}</p>
                  <p><strong>শহর:</strong> {orderData.shippingAddress.city}</p>
                </div>
              </div>
              <Separator />
              {/* Payment Method */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold">পেমেন্ট মেথড</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">{paymentMethodDisplayNames[orderData.paymentMethod] || 'অন্যান্য'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
