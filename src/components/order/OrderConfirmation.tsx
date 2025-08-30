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
  product: {
    id: string;
    name: string;
    image_url?: string;
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

  // Calculate estimated delivery date (3 days from now)
  useEffect(() => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    setEstimatedDelivery(deliveryDate.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }));
  }, []);

  // Get order data from navigation state or fetch from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (location.state?.orderId) {
        try {
          // Fetch order details from Supabase
          const { data: order, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                product:product_id (id, name, image_url)
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
          } else if (order) {
            // Transform the data to match our interface
            const transformedOrder: OrderDetails = {
              ...order,
              shipping_address: order.shipping_address || {
                full_name: '',
                phone: '',
                address: '',
                city: ''
              },
              order_items: order.order_items || []
            };
            setOrderDetails(transformedOrder);
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
        // If no orderId in state, try to get from localStorage
        const lastOrderId = localStorage.getItem('lastOrderId');
        if (lastOrderId) {
          navigate(0, { state: { orderId: lastOrderId } });
          return;
        }
        
        // If no orderId in state or localStorage, redirect to orders page
        toast({
          title: "অর্ডার আইডি পাওয়া যায়নি",
          description: "আপনাকে অর্ডার পৃষ্ঠায় পুনর্নির্দেশিত করা হচ্ছে",
        });
        navigate('/user-dashboard/orders');
      }
    };

    fetchOrderDetails();
  }, [location.state, navigate, toast]);

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
            <Progress value={33} className="mt-4" />
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
        return <CreditCard className="w-4 h-4 mr-1" />;
      case 'bkash':
        return <div className="w-4 h-4 bg-orange-500 rounded mr-1"></div>;
      case 'rocket':
        return <div className="w-4 h-4 bg-purple-500 rounded mr-1"></div>;
      case 'nagad':
        return <div className="w-4 h-4 bg-green-500 rounded mr-1"></div>;
      default:
        return <CreditCard className="w-4 h-4 mr-1" />;
    }
  };

  const getProductIcon = (productName: string) => {
    if (productName.toLowerCase().includes('phone') || productName.toLowerCase().includes('mobile')) {
      return <Smartphone className="w-5 h-5 text-blue-500" />;
    } else if (productName.toLowerCase().includes('headphone') || productName.toLowerCase().includes('earphone')) {
      return <HeadphonesIcon className="w-5 h-5 text-purple-500" />;
    }
    return <Package className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Confetti Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              animation: `confettiFall ${Math.random() * 3 + 2}s linear forwards`,
              top: '-10px',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}
      </style>

      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-800">অর্ডার সফলভাবে সম্পন্ন হয়েছে! 🎉</CardTitle>
          <p className="text-green-600 text-lg mt-2">আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে এবং প্রসেসিং underway রয়েছে</p>
          <Badge variant="outline" className="mt-4 bg-white text-green-800 border-green-300 py-2 px-4 text-base">
            অর্ডার নম্বর: #{orderDetails.id.slice(0, 8).toUpperCase()}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-xl mb-5 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-500" />
              অর্ডার সারাংশ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">অর্ডার তারিখ</p>
                  <p className="font-medium">{new Date(orderDetails.created_at).toLocaleDateString('bn-BD', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">পেমেন্ট পদ্ধতি</p>
                  <p className="font-medium flex items-center">
                    {getPaymentMethodIcon(orderDetails.payment_method)}
                    {getPaymentMethodText(orderDetails.payment_method)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">মোট পরিমাণ</p>
                <p className="font-medium text-2xl text-green-600">৳{orderDetails.total_amount.toLocaleString('bn-BD')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">অর্ডার স্ট্যাটাস</p>
                <Badge 
                  className={
                    orderDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800 text-base py-1 px-3' :
                    orderDetails.status === 'confirmed' ? 'bg-blue-100 text-blue-800 text-base py-1 px-3' :
                    orderDetails.status === 'shipped' ? 'bg-purple-100 text-purple-800 text-base py-1 px-3' :
                    'bg-green-100 text-green-800 text-base py-1 px-3'
                  }
                >
                  {orderDetails.status === 'pending' && 'বিচারাধীন'}
                  {orderDetails.status === 'confirmed' && 'নিশ্চিতকৃত'}
                  {orderDetails.status === 'shipped' && 'শিপ করা হয়েছে'}
                  {orderDetails.status === 'delivered' && 'ডেলিভারি সম্পন্ন'}
                </Badge>
              </div>
            </div>

            {orderDetails.payment_method !== 'cash_on_delivery' && orderDetails.shipping_address.transaction_id && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                <h4 className="font-medium text-blue-800 mb-2">পেমেন্ট বিবরণ</h4>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">ট্রানজেকশন আইডি:</span> {orderDetails.shipping_address.transaction_id}
                </p>
                {orderDetails.shipping_address.sender_number && (
                  <p className="text-sm text-blue-700 mt-1">
                    <span className="font-medium">সেন্ডার নম্বর:</span> {orderDetails.shipping_address.sender_number}
                  </p>
                )}
              </div>
            )}

            {orderDetails.notes && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                <h4 className="font-medium text-gray-800 mb-2">আপনার বিশেষ নির্দেশনা</h4>
                <p className="text-sm text-gray-700">"{orderDetails.notes}"</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-xl mb-5 flex items-center">
              <Package className="w-6 h-6 mr-2 text-purple-500" />
              অর্ডারকৃত পণ্য
            </h3>
            
            <div className="space-y-5">
              {orderDetails.order_items && orderDetails.order_items.length > 0 ? (
                orderDetails.order_items.map((item, index) => (
                  <div key={index} className="flex items-center border-b pb-5 last:border-b-0 last:pb-0">
                    <div className="w-20 h-20 overflow-hidden rounded-lg mr-4 bg-gray-100 flex items-center justify-center">
                      {item.product?.image_url ? (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getProductIcon(item.product?.name || '')
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{item.product?.name || 'Unknown Product'}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-gray-600">পরিমাণ: {item.quantity}</div>
                        <div className="font-medium text-lg">৳{(item.price * item.quantity).toLocaleString('bn-BD')}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">কোন পণ্য পাওয়া যায়নি</p>
              )}
            </div>
            
            <Separator className="my-5" />
            
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
          </div>

          {/* Shipping Information */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-xl mb-5 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-red-500" />
              ডেলিভারি তথ্য
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">গ্রাহকের নাম</p>
                  <p className="font-medium">{orderDetails.shipping_address.full_name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">মোবাইল নম্বর</p>
                  <p className="font-medium">{orderDetails.shipping_address.phone}</p>
                </div>
              </div>
              <div className="md:col-span-2 flex items-start">
                <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">ঠিকানা</p>
                  <p className="font-medium">{orderDetails.shipping_address.address}, {orderDetails.shipping_address.city}</p>
                  {orderDetails.shipping_address.area && (
                    <p className="text-sm text-gray-600 mt-1">এলাকা: {orderDetails.shipping_address.area}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps & Tracking */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-xl mb-4 text-blue-800 flex items-center">
              <Truck className="w-6 h-6 mr-2" />
              পরবর্তী পদক্ষেপ ও ট্র্যাকিং
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  আনুমানিক ডেলিভারি তারিখ
                </h4>
                <p className="text-blue-700 bg-blue-100 py-2 px-4 rounded-lg inline-block font-medium">
                  {estimatedDelivery}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  আমরা আপনার অর্ডারটি দ্রুততম সময়ে ডেলিভারির জন্য প্রস্তুত করছি।
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  আপডেট পাবেন কীভাবে?
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• SMS এর মাধ্যমে অর্ডার স্ট্যাটাস আপডেট</li>
                  <li>• ইমেইলে ডেলিভারি কনফার্মেশন</li>
                  <li>• অ্যাপে পুশ নোটিফিকেশন</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-5 p-4 bg-white rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">অর্ডার ট্র্যাক করুন</h4>
              <p className="text-sm text-blue-700 mb-3">
                আপনার অর্ডারের বর্তমান স্ট্যাটাস এবং ডেলিভারি আপডেট ট্র্যাক করতে নিচের বাটনে ক্লিক করুন।
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/user-dashboard/orders">
                  <FileText className="w-4 h-4 mr-2" />
                  অর্ডার ট্র্যাক করুন
                </Link>
              </Button>
            </div>
          </div>

          {/* Support Information */}
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
            <h3 className="font-semibold text-xl mb-4 text-yellow-800">সহায়তা প্রয়োজন?</h3>
            <p className="text-yellow-700 mb-3">
              আপনার অর্ডার সংক্রান্ত কোন প্রশ্ন থাকলে বা কোন সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm text-yellow-600">হেল্পলাইন নম্বর</p>
                  <p className="font-medium text-yellow-800">+৮৮০ ১৬১১-১২৩৪৫৬</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm text-yellow-600">ইমেইল ঠিকানা</p>
                  <p className="font-medium text-yellow-800">support@shopbangla.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1 py-3 text-base" variant="outline">
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                হোমপেজ
              </Link>
            </Button>
            <Button asChild className="flex-1 py-3 text-base" variant="outline">
              <Link to="/products">
                <Package className="w-5 h-5 mr-2" />
                আরো পণ্য দেখুন
              </Link>
            </Button>
            <Button asChild className="flex-1 py-3 text-base btn-gradient">
              <Link to="/user-dashboard/orders">
                <FileText className="w-5 h-5 mr-2" />
                আমার অর্ডারসমূহ
              </Link>
            </Button>
          </div>

          {/* Thank You Note */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              আপনার অর্ডার করার জন্য ধন্যবাদ! আমরা আপনার শপিং অভিজ্ঞতাকে আরও উন্নত করতে প্রতিশ্রুতিবদ্ধ।
            </p>
            <p className="text-gray-500 text-sm mt-2">
              ShopBangla টিম
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
