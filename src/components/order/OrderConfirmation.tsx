// src/components/order/OrderConfirmation.tsx

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  Gift,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderState {
  orderId: string;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
}

interface OrderDetails {
  id: string;
  created_at: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  promo_code?: string | null;
  payment_method: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  order_items: {
    product: {
      name: string;
      price: number;
      sale_price: number | null;
    };
    quantity: number;
  }[];
}

const getPaymentMethodName = (method: string) => {
  switch (method) {
    case 'cash_on_delivery':
      return 'ক্যাশ অন ডেলিভারি';
    case 'bkash':
      return 'বিকাশ';
    case 'rocket':
      return 'রকেট';
    case 'nagad':
      return 'নগদ';
    default:
      return 'অজানা';
  }
};

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        message: 'অর্ডারটি প্রক্রিয়াধীন রয়েছে।',
        color: 'text-yellow-600',
        icon: <Package className="h-5 w-5 mr-2" />
      };
    case 'processing':
      return {
        message: 'আপনার অর্ডারটি প্রক্রিয়া করা হচ্ছে।',
        color: 'text-blue-600',
        icon: <Truck className="h-5 w-5 mr-2" />
      };
    case 'shipped':
      return {
        message: 'আপনার অর্ডারটি শিপিং-এর জন্য পাঠানো হয়েছে।',
        color: 'text-indigo-600',
        icon: <Truck className="h-5 w-5 mr-2" />
      };
    case 'delivered':
      return {
        message: 'আপনার অর্ডারটি সফলভাবে ডেলিভারি হয়েছে।',
        color: 'text-green-600',
        icon: <CheckCircle className="h-5 w-5 mr-2" />
      };
    case 'cancelled':
      return {
        message: 'আপনার অর্ডারটি বাতিল করা হয়েছে।',
        color: 'text-red-600',
        icon: <CheckCircle className="h-5 w-5 mr-2" />
      };
    default:
      return {
        message: 'অর্ডার স্ট্যাটাস অজানা।',
        color: 'text-gray-500',
        icon: <CheckCircle className="h-5 w-5 mr-2" />
      };
  }
};

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const state = location.state as OrderState;

  useEffect(() => {
    if (!state?.orderId) {
      navigate('/');
      return;
    }

    const fetchOrderDetails = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            product:products (
              name,
              price,
              sale_price
            )
          )
        `)
        .eq('id', state.orderId)
        .single();

      if (error || !data) {
        toast({
          title: "অর্ডার লোড করতে ব্যর্থ",
          description: "অর্ডার বিবরণ খুঁজে পাওয়া যায়নি।",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      setOrder(data as OrderDetails);
      setLoading(false);
    };

    fetchOrderDetails();

    // Set up real-time subscription for order status updates
    const channel = supabase
      .channel(`order_status_${state.orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${state.orderId}`,
        },
        (payload: any) => {
          setOrder(payload.new as OrderDetails);
          toast({
            title: "অর্ডার আপডেট",
            description: `আপনার অর্ডারের স্ট্যাটাস '${getStatusMessage(payload.new.status).message}' এ আপডেট হয়েছে।`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state, navigate, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">অর্ডার লোড হচ্ছে...</h1>
        <p>দয়া করে অপেক্ষা করুন।</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">ভুল!</h1>
        <p className="mb-4">অর্ডারটি খুঁজে পাওয়া যায়নি।</p>
        <Button onClick={() => navigate('/')}>হোমপেজে ফিরে যান</Button>
      </div>
    );
  }

  const statusInfo = getStatusMessage(order.status);
  const orderDate = new Date(order.created_at).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-green-700 mb-2">অভিনন্দন! 🎉</h1>
        <p className="text-lg text-gray-700 mb-6">আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।</p>
        <p className="text-sm text-gray-500 mb-6">অর্ডার আইডি: <span className="font-mono">{order.id.slice(0, 8)}</span></p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mt-8">
        {/* Order Details Card */}
        <Card className="p-6 shadow-lg">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center text-xl font-semibold gap-2">
              <Package className="h-5 w-5 text-primary" />
              অর্ডার বিবরণ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">স্ট্যাটাস</span>
              <div className={`font-semibold flex items-center ${statusInfo.color}`}>
                {statusInfo.icon}
                {statusInfo.message}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">অর্ডার তারিখ</span>
              <span className="font-semibold">{orderDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">পেমেন্ট মেথড</span>
              <span className="font-semibold flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                {getPaymentMethodName(order.payment_method)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Contact Details Card */}
        <Card className="p-6 shadow-lg">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center text-xl font-semibold gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              যোগাযোগ ও শিপিং তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">পূর্ণ নাম</p>
              <p className="font-semibold">{order.shipping_address.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ফোন</p>
              <p className="font-semibold">{order.shipping_address.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ঠিকানা</p>
              <p className="font-semibold">{order.shipping_address.address}, {order.shipping_address.city}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product & Summary Details */}
      <Card className="max-w-4xl mx-auto p-6 shadow-lg mt-8">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="flex items-center text-xl font-semibold gap-2">
            <Package className="h-5 w-5 text-primary" />
            অর্ডারের পণ্যসমূহ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          {order.order_items.map((item, index) => (
            <div key={index} className="flex justify-between items-center pb-2 border-b last:border-b-0 last:pb-0">
              <div className="flex-1">
                <p className="font-medium">{item.product.name} <span className="text-gray-500 text-sm">x {item.quantity}</span></p>
              </div>
              <span className="font-semibold">
                ৳{(item.quantity * (item.product.sale_price || item.product.price)).toFixed(2)}
              </span>
            </div>
          ))}

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">সাবটোটাল</span>
              <span className="font-semibold">৳{(order.total_amount - order.shipping_cost + order.discount_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">শিপিং খরচ</span>
              <span className="font-semibold">৳{order.shipping_cost.toFixed(2)}</span>
            </div>
            {order.promo_code && order.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="flex items-center gap-1">
                  <Gift className="h-4 w-4" />
                  ছাড় ({order.promo_code})
                </span>
                <span className="font-semibold">-৳{order.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-bold">
              <span>সর্বমোট</span>
              <span>৳{order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto mt-8 flex justify-center">
        <Button onClick={() => navigate('/')} variant="outline" size="lg">
          হোমপেজে ফিরে যান
        </Button>
      </div>
    </div>
  );
}
