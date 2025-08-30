import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Home, Clock, MapPin, Phone, Mail, CreditCard, FileText, Calendar, User, Gift, HeadphonesIcon, Smartphone, Laptop, Camera, Watch } from 'lucide-react';
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
  product: {
    id: string;
    name: string;
    image_url?: string;
    category?: string;
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
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');
  const [orderProgress, setOrderProgress] = useState(30);

  // Calculate estimated delivery date and progress
  useEffect(() => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    setEstimatedDelivery(deliveryDate.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }));

    // Simulate progress animation
    const timer = setTimeout(() => {
      setOrderProgress(70);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Get order data from navigation state or fetch from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      let orderId = location.state?.orderId || localStorage.getItem('lastOrderId');
      
      if (orderId) {
        try {
          // Save orderId to localStorage as backup
          localStorage.setItem('lastOrderId', orderId);
          
          // Fetch order details from Supabase
          const { data: order, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                product:products (
                  id,
                  name,
                  image_url,
                  category
                )
              )
            `)
            .eq('id', orderId)
            .single();

          if (error) {
            console.error('Error fetching order:', error);
            toast({
              title: "ত্রুটি",
              description: "অর্ডার বিবরণ লোড করতে সমস্যা হয়েছে",
              variant: "destructive"
            });
          } else if (order) {
            setOrderDetails(order);
          }
        } catch (error) {
          console.error('Error:', error);
          toast({
            title: "ত্রুটি",
            description: "অর্ডার বিবরণ লোড করতে সমস্যা হয়েছে",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      } else {
        toast({
          title: "অর্ডার আইডি পাওয়া যায়নি",
          description: "আপনাকে অর্ডার পৃষ্ঠায় পুনর্নির্দেশিত করা হচ্ছে",
        });
        setTimeout(() => {
          navigate('/user-dashboard/orders');
        }, 2000);
      }
    };

    fetchOrderDetails();
  }, [location.state, navigate, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Package className="w-10 h-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-800">অর্ডার প্রস্তুত হচ্ছে...</CardTitle>
            <p className="text-blue-600 mt-2">আপনার অর্ডার বিবরণ লোড করা হচ্ছে</p>
            <div className="mt-6">
              <Progress value={orderProgress} className="h-2" />
              <p className="text-sm text-blue-600 mt-2">{orderProgress}% সম্পূর্ণ</p>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl text-yellow-800">অর্ডার খুঁজে পাওয়া যায়নি</CardTitle>
            <p className="text-yellow-600 mt-2">দুঃখিত, আমরা আপনার অর্ডার তথ্য খুঁজে পাইনি</p>
            <Button asChild className="mt-6 bg-yellow-600 hover:bg-yellow-700">
              <Link to="/user-dashboard/orders">আমার অর্ডার দেখুন</Link>
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

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash_on_delivery':
        return <CreditCard className="w-5 h-5 mr-2 text-blue-500" />;
      case 'bkash':
        return <div className="w-5 h-5 bg-orange-500 rounded mr-2 flex items-center justify-center text-white text-xs">b</div>;
      case 'rocket':
        return <div className="w-5 h-5 bg-purple-500 rounded mr-2 flex items-center justify-center text-white text-xs">R</div>;
      case 'nagad':
        return <div className="w-5 h-5 bg-green-500 rounded mr-2 flex items-center justify-center text-white text-xs">N</div>;
      default:
        return <CreditCard className="w-5 h-5 mr-2 text-blue-500" />;
    }
  };

  const getProductIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'phone':
        return <Smartphone className="w-6 h-6 text-blue-500" />;
      case 'laptop':
        return <Laptop className="w-6 h-6 text-purple-500" />;
      case 'camera':
        return <Camera className="w-6 h-6 text-amber-500" />;
      case 'watch':
        return <Watch className="w-6 h-6 text-green-500" />;
      case 'headphone':
        return <HeadphonesIcon className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'বিচারাধীন', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
      case 'confirmed':
        return { text: 'নিশ্চিতকৃত', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' };
      case 'processing':
        return { text: 'প্রসেসিং', color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' };
      case 'shipped':
        return { text: 'শিপ করা হয়েছে', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' };
      case 'delivered':
        return { text: 'ডেলিভারি সম্পন্ন', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
      default:
        return { text: status, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200' };
    }
  };

  const statusInfo = getStatusInfo(orderDetails.status);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Success Confetti Effect */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `confettiFall ${Math.random() * 3 + 2}s linear forwards`,
                top: '-10px',
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <style>
          {`
            @keyframes confettiFall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}
        </style>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">অর্ডার সফল!</h1>
          <p className="text-lg text-gray-600">আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Success Card */}
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200 shadow-xl overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className={`${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} px-3 py-1 text-sm`}>
                  {statusInfo.text}
                </Badge>
              </div>
              <CardHeader className="text-center pb-4 pt-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-800">ধন্যবাদ!</CardTitle>
                <p className="text-green-600 text-lg mt-2">আপনার অর্ডারটি সফলভাবে প্লেস হয়েছে</p>
                <Badge variant="outline" className="mt-4 bg-white text-green-800 border-green-300 py-2 px-4 text-base">
                  অর্ডার নম্বর: #{orderDetails.id.slice(0, 8).toUpperCase()}
                </Badge>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">অর্ডার তারিখ</p>
                        <p className="font-medium">{new Date(orderDetails.created_at).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(orderDetails.payment_method)}
                      <div>
                        <p className="text-sm text-gray-500">পেমেন্ট পদ্ধতি</p>
                        <p className="font-medium">{getPaymentMethodText(orderDetails.payment_method)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">আনুমানিক ডেলিভারি</p>
                        <p className="font-medium">{estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">মোট পরিমাণ</p>
                        <p className="font-medium text-xl text-green-600">৳{orderDetails.total_amount.toLocaleString('bn-BD')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <Package className="w-6 h-6 mr-2 text-blue-500" />
                  অর্ডারকৃত পণ্য ({orderDetails.order_items?.length || 0}টি)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.order_items && orderDetails.order_items.length > 0 ? (
                    orderDetails.order_items.map((item, index) => (
                      <div key={index} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="w-16 h-16 overflow-hidden rounded-lg mr-4 bg-gray-100 flex items-center justify-center">
                          {item.product?.image_url ? (
                            <img 
                              src={item.product.image_url} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getProductIcon(item.product?.category || '')
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.product?.name || 'Unknown Product'}</h4>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-gray-600 text-sm">পরিমাণ: {item.quantity} × ৳{item.price.toLocaleString('bn-BD')}</div>
                            <div className="font-medium text-gray-800">৳{(item.price * item.quantity).toLocaleString('bn-BD')}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">কোন পণ্য পাওয়া যায়নি</p>
                  )}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-3">
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
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>মোট:</span>
                    <span className="text-green-600">৳{orderDetails.total_amount.toLocaleString('bn-BD')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-red-500" />
                  ডেলিভারি তথ্য
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">গ্রাহকের নাম</p>
                      <p className="font-medium">{orderDetails.shipping_address?.full_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">মোবাইল নম্বর</p>
                      <p className="font-medium">{orderDetails.shipping_address?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-start">
                    <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">ঠিকানা</p>
                      <p className="font-medium">{orderDetails.shipping_address?.address || 'N/A'}, {orderDetails.shipping_address?.city || 'N/A'}</p>
                      {orderDetails.shipping_address?.area && (
                        <p className="text-sm text-gray-600 mt-1">এলাকা: {orderDetails.shipping_address.area}</p>
                      )}
                    </div>
                  </div>
                </div>

                {orderDetails.payment_method !== 'cash_on_delivery' && orderDetails.shipping_address?.transaction_id && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                    <h4 className="font-medium text-blue-800 mb-2">পেমেন্ট বিবরণ</h4>
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">ট্রানজেকশন আইডি:</span> {orderDetails.shipping_address.transaction_id}
                    </p>
                    {orderDetails.shipping_address?.sender_number && (
                      <p className="text-sm text-blue-700 mt-1">
                        <span className="font-medium">সেন্ডার নম্বর:</span> {orderDetails.shipping_address.sender_number}
                      </p>
                    )}
                  </div>
                )}

                {orderDetails.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                    <h4 className="font-medium text-gray-800 mb-2">বিশেষ নির্দেশনা</h4>
                    <p className="text-sm text-gray-700">"{orderDetails.notes}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Tracking */}
            <Card className="shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <Truck className="w-6 h-6 mr-2 text-blue-500" />
                  অর্ডার ট্র্যাকিং
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">অর্ডার প্লেসড</p>
                      <p className="text-sm text-gray-500">আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">প্রসেসিং</p>
                      <p className="text-sm text-gray-500">আপনার অর্ডারটি প্রসেসিং underway রয়েছে</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">শিপড</p>
                      <p className="text-sm text-gray-500">আপনার অর্ডারটি শিপ করা হবে</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">ডেলিভার্ড</p>
                      <p className="text-sm text-gray-500">আনুমানিক ডেলিভারি: {estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
                
                <Button asChild className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  <Link to="/user-dashboard/orders">
                    <FileText className="w-4 h-4 mr-2" />
                    অর্ডার ট্র্যাক করুন
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Support Information */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <Phone className="w-6 h-6 mr-2 text-blue-500" />
                  সহায়তা প্রয়োজন?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  আপনার অর্ডার সংক্রান্ত কোন প্রশ্ন থাকলে বা কোন সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">হেল্পলাইন নম্বর</p>
                      <p className="font-medium text-gray-800">+৮৮০ ১৬১১-১২৩৪৫৬</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">ইমেইল ঠিকানা</p>
                      <p className="font-medium text-gray-800">support@shopbangla.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">কাজের সময়</p>
                      <p className="font-medium text-gray-800">সকাল ৯টা - রাত ১০টা</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button asChild className="w-full py-3" variant="outline">
                    <Link to="/">
                      <Home className="w-5 h-5 mr-2" />
                      হোমপেজ
                    </Link>
                  </Button>
                  <Button asChild className="w-full py-3" variant="outline">
                    <Link to="/products">
                      <Package className="w-5 h-5 mr-2" />
                      আরো পণ্য দেখুন
                    </Link>
                  </Button>
                  <Button asChild className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link to="/user-dashboard/orders">
                      <FileText className="w-5 h-5 mr-2" />
                      আমার অর্ডারসমূহ
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Thank You Note */}
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200 shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Gift className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-800 mb-2">আপনার অর্ডার করার জন্য ধন্যবাদ!</h3>
                  <p className="text-green-700 text-sm">
                    আমরা আপনার শপিং অভিজ্ঞতাকে আরও উন্নত করতে প্রতিশ্রুতিবদ্ধ।
                  </p>
                  <p className="text-green-600 text-xs mt-3">
                    ShopBangla টিম
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
