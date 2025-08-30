import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Truck, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Package,
  Home,
  ShoppingBag,
  Phone,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url: string;
  };
}

interface OrderDetails {
  id: string;
  created_at: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  payment_method: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
  };
  status: string;
  promo_code: string | null;
  order_items: OrderItem[];
}

export default function OrderConfirmation() {
  const { user } = useAuth();
  const location = useLocation();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // If coming from checkout, use passed data
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          price,
          product:product_id (
            name,
            image_url
          )
        `)
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      setOrder({
        ...orderData,
        order_items: itemsData as OrderItem[]
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>অর্ডার তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">অর্ডার খুঁজে পাওয়া যায়নি</h1>
          <p className="mb-6">দুঃখিত, আপনার অর্ডারটি লোড করতে সমস্যা হয়েছে।</p>
          <Button asChild>
            <Link to="/">হোমপেজে ফিরে যান</Link>
          </Button>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const paymentMethodLabels: Record<string, string> = {
    'cash_on_delivery': 'ক্যাশ অন ডেলিভারি',
    'bkash': 'বিকাশ',
    'rocket': 'রকেট',
    'nagad': 'নগদ'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">অর্ডার সফল হয়েছে!</h1>
          <p className="text-muted-foreground">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। অর্ডার নম্বর: <span className="font-medium">{order.id.slice(0, 8)}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                অর্ডার সামারি
              </h2>
              
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-2">
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                        {item.product.image_url ? (
                          <img 
                            src={item.product.image_url} 
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">পরিমাণ: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span>৳{(order.total_amount + order.discount_amount - order.shipping_cost).toFixed(2)}</span>
                </div>
                
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>ছাড় {order.promo_code && `(${order.promo_code})`}</span>
                    <span>-৳{order.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>শিপিং খরচ</span>
                  <span>৳{order.shipping_cost.toFixed(2)}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>মোট</span>
                  <span>৳{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Shipping Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                শিপিং তথ্য
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Home className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">ঠিকানা</p>
                    <p className="text-muted-foreground">
                      {order.shipping_address.address}, {order.shipping_address.city}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">ফোন নম্বর</p>
                    <p className="text-muted-foreground">{order.shipping_address.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">শিপিং মেথড</p>
                    <p className="text-muted-foreground">সাধারণ ডেলিভারি</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">অর্ডার তারিখ</p>
                    <p className="text-muted-foreground">{orderDate}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Status & Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">অর্ডার স্ট্যাটাস</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${order.status === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">অর্ডার নিশ্চিত</p>
                    <p className="text-sm text-muted-foreground">আপনার অর্ডারটি গ্রহণ করা হয়েছে</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 opacity-50">
                  <div className="p-2 rounded-full bg-gray-100 text-gray-400">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">প্রসেসিং</p>
                    <p className="text-sm text-muted-foreground">আপনার অর্ডারটি প্রস্তুত করা হচ্ছে</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 opacity-50">
                  <div className="p-2 rounded-full bg-gray-100 text-gray-400">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">শিপড</p>
                    <p className="text-sm text-muted-foreground">আপনার অর্ডারটি পাঠানো হয়েছে</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 opacity-50">
                  <div className="p-2 rounded-full bg-gray-100 text-gray-400">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">ডেলিভার্ড</p>
                    <p className="text-sm text-muted-foreground">আপনার অর্ডারটি ডেলিভার করা হয়েছে</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                পেমেন্ট তথ্য
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>পেমেন্ট মেথড</span>
                  <span className="font-medium">{paymentMethodLabels[order.payment_method] || order.payment_method}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>স্ট্যাটাস</span>
                  <span className="font-medium text-green-600">পেমেন্ট সফল</span>
                </div>
                
                <div className="flex justify-between">
                  <span>মোট পরিশোধিত</span>
                  <span className="font-medium">৳{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-3">সহায়তা প্রয়োজন?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                আপনার অর্ডার সম্পর্কে কোন প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করতে নির্দ্বিধায় কল করুন।
              </p>
              
              <div className="flex items-center gap-2 text-sm mb-2">
                <Phone className="h-4 w-4" />
                <span>+880 1624 712851</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@example.com</span>
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/">শপিং চালিয়ে যান</Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/orders">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  আমার অর্ডার দেখুন
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
