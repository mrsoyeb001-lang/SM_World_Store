// src/components/order/OrderConfirmation.tsx

import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MapPin, CreditCard, Box, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

// Defines the structure of the order data
interface OrderData {
  id: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    sender_number?: string;
    transaction_id?: string;
  };
  payment_method: string;
  promo_code: string | null;
  created_at: string;
  order_items: {
    quantity: number;
    price: number;
    product: {
      name: string;
      image: string; // Corrected column name to 'image' as a placeholder
    };
  }[];
}

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderIdFromState = location.state?.orderId;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderIdFromState) {
        setError('অর্ডারের কোনো তথ্য পাওয়া যায়নি।');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            product:products (
              name,
              image // Replace 'image' with your actual column name (e.g., 'image_url', 'product_image')
            )
          )
        `)
        .eq('id', orderIdFromState)
        .maybeSingle();

      if (error) {
        setError('অর্ডার লোড করতে সমস্যা হয়েছে: ' + error.message);
        setLoading(false);
      } else if (data) {
        setOrder(data as OrderData);
        setLoading(false);
      } else {
        setError('অর্ডারটি খুঁজে পাওয়া যায়নি।');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderIdFromState]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">অর্ডার লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">দুঃখিত! 😟</h1>
        <p className="text-lg text-muted-foreground mb-8">{error}</p>
        <Button onClick={() => navigate('/')}>
          হোমপেজে ফিরে যান
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-destructive">অর্ডার খুঁজে পাওয়া যায়নি 😥</h1>
        <p className="text-lg text-muted-foreground mb-8">
          এই অর্ডারের কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে আপনার অর্ডার হিস্টোরি চেক করুন।
        </p>
        <Button onClick={() => navigate('/')}>
          হোমপেজে ফিরে যান
        </Button>
      </div>
    );
  }

  const paymentMethodDisplayNames: Record<string, string> = {
    cash_on_delivery: 'ক্যাশ অন ডেলিভারি',
    bkash: 'বিকাশ',
    rocket: 'রকেট',
    nagad: 'নগদ',
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container max-w-4xl mx-auto px-4">
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
        
        <div className="my-12">
          <Separator />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
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
                <span className="text-primary font-mono">{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>তারিখ:</span>
                <span>{format(new Date(order.created_at), 'dd MMMM, yyyy')}</span>
              </div>
              <Separator />
              {order.order_items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={item.product.image || '/placeholder.png'}
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
                  <span>৳{(order.total_amount - order.shipping_cost + order.discount_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>শিপিং</span>
                  <span>৳{order.shipping_cost.toFixed(2)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>ছাড় ({order.promo_code || 'প্রয়োগকৃত'})</span>
                    <span>-৳{order.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>মোট</span>
                  <span>৳{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 bg-card shadow-md">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                শিপিং এবং পেমেন্ট
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">শিপিং ঠিকানা</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>পূর্ণ নাম:</strong> {order.shipping_address.full_name}</p>
                  <p><strong>ফোন:</strong> {order.shipping_address.phone}</p>
                  <p><strong>ঠিকানা:</strong> {order.shipping_address.address}</p>
                  <p><strong>শহর:</strong> {order.shipping_address.city}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-bold">পেমেন্ট মেথড</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">{paymentMethodDisplayNames[order.payment_method] || 'অন্যান্য'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
