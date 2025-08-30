import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  Gift,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string;
  };
}

interface OrderDetails {
  id: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  payment_method: string;
  promo_code: string | null;
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
  };
  order_items: OrderItem[];
  created_at: string;
  shipping_rates: {
    area_name: string;
    estimated_days: number;
  };
}

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const { orderId } = location.state || {};

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !user) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          id,
          total_amount,
          shipping_cost,
          discount_amount,
          payment_method,
          promo_code,
          shipping_address,
          created_at,
          order_items(
            id,
            quantity,
            price,
            products(name, image_url)
          ),
          shipping_rates(area_name, estimated_days)
        `
        )
        .eq('id', orderId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !data) {
        console.error('Failed to fetch order details:', error?.message);
        navigate('/cart');
        return;
      }

      setOrderDetails(data as unknown as OrderDetails);
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium text-gray-600">
          অর্ডার তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <CheckCircle2 className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">অর্ডার পাওয়া যায়নি</h1>
        <p className="text-muted-foreground mb-6">
          আপনার অর্ডারটি খুঁজে পাওয়া যায়নি। সম্ভবত কোনো সমস্যা হয়েছে।
        </p>
        <Button onClick={() => navigate('/')}>হোমপেজে ফিরে যান</Button>
      </div>
    );
  }

  const paymentMethodMap: Record<string, string> = {
    cash_on_delivery: 'ক্যাশ অন ডেলিভারি',
    bkash: 'বিকাশ',
    rocket: 'রকেট',
    nagad: 'নগদ',
  };

  const formattedDate = new Date(orderDetails.created_at).toLocaleDateString(
    'bn-BD',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
          আপনার অর্ডার সফল হয়েছে! 🎉
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          অর্ডারটি সফলভাবে প্লেস করা হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Order Details Card */}
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Package className="h-6 w-6" />
              অর্ডার বিবরণ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">অর্ডার আইডি:</span>
              <span className="font-mono">{orderDetails.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">অর্ডার তারিখ:</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">পণ্যসমূহ:</h3>
              {orderDetails.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.products.image_url || 'https://via.placeholder.com/60'}
                    alt={item.products.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.products.name}</p>
                    <p className="text-sm text-muted-foreground">
                      পরিমাণ: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary and Payment Card */}
        <Card className="p-6 h-fit">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              সামারি ও পেমেন্ট
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex justify-between">
              <span>সাবটোটাল</span>
              <span>৳{(orderDetails.total_amount - orderDetails.shipping_cost + orderDetails.discount_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>শিপিং খরচ</span>
              <span>৳{orderDetails.shipping_cost.toFixed(2)}</span>
            </div>
            {orderDetails.promo_code && (
              <div className="flex justify-between text-green-600">
                <span>
                  ছাড় <Gift className="inline h-4 w-4 ml-1" />
                </span>
                <span>-৳{orderDetails.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>মোট</span>
              <span>৳{orderDetails.total_amount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">পেমেন্ট ও ডেলিভারি:</h3>
              <p>
                <span className="font-medium">পেমেন্ট মেথড:</span>{' '}
                {paymentMethodMap[orderDetails.payment_method]}
              </p>
              {orderDetails.shipping_rates && (
                <>
                  <p>
                    <span className="font-medium">ডেলিভারি এরিয়া:</span>{' '}
                    {orderDetails.shipping_rates.area_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    আনুমানিক ডেলিভারি: {orderDetails.shipping_rates.estimated_days} দিন
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Details Card */}
        <Card className="p-6 col-span-1 md:col-span-2">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              শিপিং ঠিকানা
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2">
            <p>
              <span className="font-medium">নাম:</span>{' '}
              {orderDetails.shipping_address.full_name}
            </p>
            <p>
              <span className="font-medium">ফোন:</span>{' '}
              {orderDetails.shipping_address.phone}
            </p>
            <p>
              <span className="font-medium">ঠিকানা:</span>{' '}
              {orderDetails.shipping_address.address},{' '}
              {orderDetails.shipping_address.city}
            </p>
          </CardContent>
        </Card>

        <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            হোমপেজে ফিরে যান
          </Button>
        </div>
      </div>
    </div>
  );
}
