import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Home, Clock, MapPin, Phone, Mail, CreditCard, FileText, Calendar, User, Gift, HeadphonesIcon, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string;
  };
}

interface ShippingAddress {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  area?: string;
  sender_number?: string;
  transaction_id?: string;
}

interface OrderDetails {
  id: string;
  created_at: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  payment_method: string;
  status: string;
  notes?: string;
  promo_code?: string;
  order_items: OrderItem[];
  shipping_address: ShippingAddress;
}

export function OrderConfirmation() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderProgress, setOrderProgress] = useState(25);

  // Get order data from navigation state or fetch from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // If we have state from navigation, use it to fetch order details
        if (location.state?.orderId) {
          const { data: order, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (
                  name,
                  image_url
                )
              )
            `)
            .eq('id', location.state.orderId)
            .single();

          if (error) {
            console.error('Error fetching order:', error);
            toast({
              title: "ত্রুটি",
              description: "অর্ডার বিবরণ লোড করতে সমস্যা হয়েছে",
              variant: "destructive"
            });
          } else {
            setOrderDetails(order as OrderDetails);
            
            // Set progress based on status
            if (order.status === 'pending') setOrderProgress(25);
            else if (order.status === 'confirmed') setOrderProgress(50);
            else if (order.status === 'shipped') setOrderProgress(75);
            else if (order.status === 'delivered') setOrderProgress(100);
          }
        } else {
          // If no state, try to get the latest order for the user
          const { data: orders, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (
                  name,
                  image_url
                )
              )
            `)
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (error) {
            console.error('Error fetching latest order:', error);
          } else if (orders && orders.length > 0) {
            setOrderDetails(orders[0] as OrderDetails);
            
            // Set progress based on status
            if (orders[0].status === 'pending') setOrderProgress(25);
            else if (orders[0].status === 'confirmed') setOrderProgress(50);
            else if (orders[0].status === 'shipped') setOrderProgress(75);
            else if (orders[0].status === 'delivered') setOrderProgress(100);
          }
        }
      } catch (error) {
        console.error('Error in fetchOrderDetails:', error);
        toast({
          title: "ত্রুটি",
          description: "অর্ডার বিবরণ লোড করতে সমস্যা হয়েছে",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location.state, user, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-800">অর্ডার লোড হচ্ছে...</CardTitle>
            <p className="text-blue-600">আপনার অর্ডার বিবরণ প্রস্তুত করা হচ্ছে।</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl text-yellow-800">অর্ডার খুঁজে পাওয়া যায়নি</CardTitle>
            <p className="text-yellow-600">দুঃখিত, আমরা আপনার অর্ডার তথ্য খুঁজে পাইনি।</p>
            <Button asChild className="mt-4">
              <Link to="/user-dashboard">আমার অর্ডার দেখুন</Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'বিচারাধীন';
      case 'confirmed':
        return 'নিশ্চিতকৃত';
      case 'shipped':
        return 'শিপ করা হয়েছে';
      case 'delivered':
        return 'ডেলিভারি সম্পন্ন';
      default:
        return status;
    }
  };

  const getEstimatedDeliveryDate = () => {
    const orderDate = new Date(orderDetails.created_at);
    orderDate.setDate(orderDate.getDate() + 3); // Add 3 days for delivery
    return orderDate.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-green-50 border-green-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">অর্ডার সফল! 🎉</CardTitle>
          <p className="text-green-600">আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।</p>
          <Badge variant="outline" className="mt-2 bg-white text-green-800 border-green-300">
            অর্ডার নম্বর: #{orderDetails.id.slice(0, 8).toUpperCase()}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Progress */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              অর্ডার স্ট্যাটাস
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">অর্ডার প্রগ্রেস</span>
                <span className="text-sm font-medium text-green-600">{orderProgress}% সম্পূর্ণ</span>
              </div>
              <Progress value={orderProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-xs text-center mt-4">
              <div className={`flex flex-col items-center ${orderProgress >= 25 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderProgress >= 25 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <span className="mt-1">অর্ডার প্লেসড</span>
              </div>
              <div className={`flex flex-col items-center ${orderProgress >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderProgress >= 50 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="mt-1">কনফার্মড</span>
              </div>
              <div className={`flex flex-col items-center ${orderProgress >= 75 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderProgress >= 75 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <span className="mt-1">শিপড</span>
              </div>
              <div className={`flex flex-col items-center ${orderProgress >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderProgress >= 100 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Package className="w-4 h-4" />
                </div>
                <span className="mt-1">ডেলিভার্ড</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              অর্ডার সারাংশ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">অর্ডার তারিখ</p>
                <p className="font-medium">{new Date(orderDetails.created_at).toLocaleDateString('bn-BD')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">মোট পরিমাণ</p>
                <p className="font-medium text-green-600">৳{orderDetails.total_amount.toLocaleString('bn-BD')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">পেমেন্ট পদ্ধতি</p>
                <p className="font-medium">{getPaymentMethodText(orderDetails.payment_method)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">অর্ডার স্ট্যাটাস</p>
                <Badge 
                  className={
                    orderDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    orderDetails.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    orderDetails.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }
                >
                  {getStatusText(orderDetails.status)}
                </Badge>
              </div>
            </div>

            {orderDetails.payment_method !== 'cash_on_delivery' && orderDetails.shipping_address.transaction_id && (
              <div className="bg-blue-50 p-3 rounded border border-blue-100 mt-3">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">ট্রানজেকশন আইডি:</span> {orderDetails.shipping_address.transaction_id}
                </p>
                {orderDetails.shipping_address.sender_number && (
                  <p className="text-sm text-blue-800 mt-1">
                    <span className="font-medium">সেন্ডার নম্বর:</span> {orderDetails.shipping_address.sender_number}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-purple-500" />
              অর্ডারকৃত পণ্য
            </h3>
            
            <div className="space-y-4">
              {orderDetails.order_items.map((item, index) => (
                <div key={index} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="w-16 h-16 overflow-hidden rounded-lg mr-4 bg-gray-100 flex items-center justify-center">
                    {item.products.image_url ? (
                      <img 
                        src={item.products.image_url} 
                        alt={item.products.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.products.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm text-gray-600">পরিমাণ: {item.quantity}</div>
                      <div className="font-medium">৳{(item.price * item.quantity).toLocaleString('bn-BD')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">উপ-মোট:</span>
                <span className="font-medium">৳{(orderDetails.total_amount - orderDetails.shipping_cost + orderDetails.discount_amount).toLocaleString('bn-BD')}</span>
              </div>
              
              {orderDetails.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ছাড় {orderDetails.promo_code && `(${orderDetails.promo_code})`}:</span>
                  <span>-৳{orderDetails.discount_amount.toLocaleString('bn-BD')}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">ডেলিভারি চার্জ:</span>
                <span className="font-medium">৳{orderDetails.shipping_cost.toLocaleString('bn-BD')}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between text-lg font-bold mt-2">
                <span>মোট:</span>
                <span className="text-green-600">৳{orderDetails.total_amount.toLocaleString('bn-BD')}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-500" />
              ডেলিভারি তথ্য
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  গ্রাহকের নাম
                </p>
                <p className="font-medium">{orderDetails.shipping_address.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  মোবাইল নম্বর
                </p>
                <p className="font-medium">{orderDetails.shipping_address.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">ঠিকানা</p>
                <p className="font-medium">{orderDetails.shipping_address.address}, {orderDetails.shipping_address.city}</p>
              </div>
              {orderDetails.shipping_address.area && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">এলাকা</p>
                  <p className="font-medium">{orderDetails.shipping_address.area}</p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-lg mb-4 flex items-center text-blue-800">
              <Truck className="w-5 h-5 mr-2" />
              ডেলিভারি তথ্য
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700">আনুমানিক ডেলিভারি তারিখ</p>
                <p className="font-medium text-blue-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {getEstimatedDeliveryDate()}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">ডেলিভারি পার্টনার</p>
                <p className="font-medium text-blue-900">সুন্দরবন কুরিয়ার সার্ভিস</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded border">
              <h4 className="font-medium text-blue-900 mb-2">ডেলিভারি নির্দেশাবলী:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• ডেলিভারির সময় আপনার ফোনটি চালু রাখুন</li>
                <li>• অর্ডার কনফার্ম করার পর থেকে ২৪-৪৮ ঘন্টার মধ্যে ডেলিভারি হবে</li>
                <li>• ডেলিভারি চার্জ অর্ডার করা ঠিকানার উপর নির্ভর করে</li>
                <li>• কোন সমস্যা হলে কল করুন: <strong>১৬২৪৭</strong></li>
              </ul>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-lg mb-4 flex items-center text-purple-800">
              <Gift className="w-5 h-5 mr-2" />
              পরবর্তী পদক্ষেপ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  ইমেইল নিশ্চিতকরণ
                </h4>
                <p className="text-sm text-purple-700">
                  আপনার ইমেইলে একটি অর্ডার নিশ্চিতকরণ মেইল পাঠানো হয়েছে। আপনার অর্ডার সম্পর্কিত সকল তথ্য এই ইমেইলে রয়েছে।
                </p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                  <Truck className="w-4 h-4 mr-1" />
                  ট্র্যাকিং তথ্য
                </h4>
                <p className="text-sm text-purple-700">
                  আপনার অর্ডার শিপ হওয়ার পর, আপনি ট্র্যাকিং নম্বর সহ একটি ইমেইল পাবেন। আপনি আমাদের ওয়েবসাইট বা মোবাইল অ্যাপে অর্ডার ট্র্যাক করতে পারবেন।
                </p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  সহায়তা প্রয়োজন?
                </h4>
                <p className="text-sm text-purple-700">
                  আপনার কোন প্রশ্ন থাকলে বা সহায়তা প্রয়োজন হলে, আমাদের গ্রাহক সেবা টিমের সাথে যোগাযোগ করুন: <strong>+৮৮০ ৯৬১২ ৩৪৫৬৭৮৯</strong>
                </p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  রিটার্ন পলিসি
                </h4>
                <p className="text-sm text-purple-700">
                  আপনার পণ্য পাওয়ার ৭ দিনের মধ্যে রিটার্ন করতে পারবেন। রিটার্নের জন্য পণ্য অক্ষত এবং মূল প্যাকেজিংয়ে থাকতে হবে।
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1" variant="outline">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                হোমপেজ
              </Link>
            </Button>
            <Button asChild className="flex-1" variant="outline">
              <Link to="/user-dashboard/orders">
                <FileText className="w-4 h-4 mr-2" />
                অর্ডার ট্র্যাক করুন
              </Link>
            </Button>
            <Button asChild className="flex-1 btn-gradient">
              <Link to="/products">
                আরো কেনাকাটা করুন
              </Link>
            </Button>
          </div>

          {/* Support Information */}
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>আপনার অর্ডার সম্পর্কিত কোন আপডেট থাকলে আমরা আপনাকে ইমেইল বা এসএমএস এর মাধ্যমে জানাবো।</p>
            <p className="mt-1">ধন্যবাদ, <span className="text-indigo-600">ShopBangla</span> টিম</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
