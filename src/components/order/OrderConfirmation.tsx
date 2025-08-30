import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Truck, MapPin, Phone, Mail, Clock, Shield, CreditCard, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function OrderConfirmation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // যদি লোকেশন স্টেট থেকে ডেটা থাকে
  const { orderId, total, shippingAddress } = location.state || {};

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!orderId) {
      navigate('/');
      return;
    }

    fetchOrderDetails();
  }, [user, orderId, navigate]);

  const fetchOrderDetails = async () => {
    try {
      // অর্ডার ডিটেইলস ফেচ করুন
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;

      setOrderDetails(order);

      // অর্ডার আইটেমস ফেচ করুন
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      setOrderItems(items || []);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>অর্ডার তথ্য লোড হচ্ছে...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">অর্ডার পাওয়া যায়নি</h1>
          <Button onClick={() => navigate('/')}>হোমপেজে ফিরে যান</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getPaymentMethodText = (method: string) => {
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
        return method;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* সাফল্য বার্তা */}
        <Card className="p-6 mb-8 bg-green-50 border-green-200">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">অর্ডার সফল হয়েছে!</h1>
              <p className="text-green-600">
                আপনার অর্ডারটি সফলভাবে প্লেস করা হয়েছে। অর্ডার নম্বর: #{orderDetails.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
          {/* মূল কন্টেন্ট */}
          <div className="md:col-span-2 space-y-8">
            {/* অর্ডার সামারি */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                অর্ডার সামারি
              </h2>

              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                        {item.product?.image_url ? (
                          <img 
                            src={item.product.image_url} 
                            alt={item.product.name}
                            className="h-12 w-12 object-contain"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs text-center">No Image</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.product?.name}</h3>
                        <p className="text-sm text-muted-foreground">পরিমাণ: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>পণ্যের মূল্য</span>
                  <span>৳{orderDetails.total_amount + orderDetails.discount_amount - orderDetails.shipping_cost}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>শিপিং খরচ</span>
                  <span>৳{orderDetails.shipping_cost.toFixed(2)}</span>
                </div>
                
                {orderDetails.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>ছাড়</span>
                    <span>-৳{orderDetails.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>মোট</span>
                  <span>৳{orderDetails.total_amount.toFixed(2)}</span>
                </div>

                {orderDetails.promo_code && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>প্রমো কোড</span>
                    <span>{orderDetails.promo_code}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* শিপিং ও পেমেন্ট তথ্য */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* শিপিং তথ্য */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  শিপিং তথ্য
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">ঠিকানা</p>
                      <p className="text-sm text-muted-foreground">
                        {orderDetails.shipping_address?.address}, {orderDetails.shipping_address?.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">ফোন নম্বর</p>
                      <p className="text-sm text-muted-foreground">{orderDetails.shipping_address?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">অনুমানিক ডেলিভারি সময়</p>
                      <p className="text-sm text-muted-foreground">৩-৫ কার্যদিবস</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* পেমেন্ট তথ্য */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  পেমেন্ট তথ্য
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">পেমেন্ট মেথড</p>
                      <p className="text-sm text-muted-foreground">
                        {getPaymentMethodText(orderDetails.payment_method)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">স্ট্যাটাস</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {orderDetails.payment_method === 'cash_on_delivery' ? 'ডেলিভারির সময় পেমেন্ট' : 'পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">অর্ডার তারিখ</p>
                      <p className="text-sm text-muted-foreground">{formatDate(orderDetails.created_at)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* অর্ডার ট্র্যাকিং */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">অর্ডার ট্র্যাকিং</h2>
              
              <div className="relative">
                {/* টাইমলাইন */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="h-16 w-1 bg-primary mt-2"></div>
                    </div>
                    <div>
                      <p className="font-semibold">অর্ডার কনফার্মড</p>
                      <p className="text-sm text-muted-foreground">আপনার অর্ডারটি সফলভাবে প্লেস করা হয়েছে</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
                      </div>
                      <div className="h-16 w-1 bg-muted mt-2"></div>
                    </div>
                    <div>
                      <p className="font-semibold">প্রসেসিং</p>
                      <p className="text-sm text-muted-foreground">আপনার অর্ডারটি প্রসেস করা হচ্ছে</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
                      </div>
                      <div className="h-16 w-1 bg-muted mt-2"></div>
                    </div>
                    <div>
                      <p className="font-semibold">শিপড</p>
                      <p className="text-sm text-muted-foreground">আপনার অর্ডারটি শিপ করা হয়েছে</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">ডেলিভার্ড</p>
                      <p className="text-sm text-muted-foreground">আপনার অর্ডারটি ডেলিভার করা হয়েছে</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* সাইডবার */}
          <div className="space-y-6">
            {/* সহায়তা */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">সহায়তা প্রয়োজন?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                আপনার অর্ডার সম্পর্কিত কোন প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+880 1624 712851</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">support@example.com</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                যোগাযোগ করুন
              </Button>
            </Card>

            {/* একশন বাটন */}
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/orders')} 
                className="w-full"
                variant="outline"
              >
                আমার অর্ডার দেখুন
              </Button>
              
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                হোমপেজে ফিরে যান
              </Button>
            </div>

            {/* গুরুত্বপূর্ণ তথ্য */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h2 className="font-semibold mb-3 text-blue-800">গুরুত্বপূর্ণ তথ্য</h2>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• অর্ডার ট্র্যাক করতে আপনার অর্ডার হিস্টরি দেখুন</li>
                <li>• ডেলিভারি সম্পর্কিত কোন সমস্যা হলে দ্রুত আমাদের জানান</li>
                <li>• অর্ডার কনফার্মেশন ইমেইল চেক করুন</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
