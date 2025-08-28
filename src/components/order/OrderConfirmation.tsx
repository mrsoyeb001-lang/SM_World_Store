import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Home, Clock, MapPin, Phone, Mail, CreditCard, FileText, Calendar, User, Star, Gift, HeadphonesIcon, Shield, MessageCircle } from 'lucide-react';
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

  // Get order data from navigation state or fetch from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (location.state?.orderId) {
          // Fetch order details from Supabase
          const { data: order, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                product:products (
                  name,
                  image_url
                )
              )
            `)
            .eq('id', location.state.orderId)
            .single();

          if (error) throw error;

          if (order) {
            setOrderDetails(order as OrderDetails);
            
            // Calculate estimated delivery date (3 days from now)
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3);
            setEstimatedDelivery(deliveryDate.toLocaleDateString('bn-BD', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
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
  }, [location.state, toast]);

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
            <Progress value={65} className="mt-4 w-1/2 mx-auto" />
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

  const getStatusPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'processing': return 75;
      case 'shipped': return 90;
      case 'delivered': return 100;
      default: return 25;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'বিচারাধীন';
      case 'confirmed': return 'নিশ্চিতকৃত';
      case 'processing': return 'প্রসেসিং';
      case 'shipped': return 'শিপ করা হয়েছে';
      case 'delivered': return 'ডেলিভারি সম্পন্ন';
      default: return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Confetti Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              animation: `confettiFall ${Math.random() * 3 + 2}s linear forwards`,
              animationDelay: `${Math.random() * 2}s`,
              transform: 'rotate(45deg)'
            }}
          />
        ))}
      </div>

      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-xl overflow-hidden">
        {/* Header with Celebration */}
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-green-400 to-blue-500 text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl">অর্ডার সফল! 🎉</CardTitle>
          <p className="text-white/90">আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।</p>
          <Badge variant="outline" className="mt-2 bg-white text-green-800 border-white">
            <Calendar className="w-4 h-4 mr-1" />
            অর্ডার নম্বর: #{orderDetails.id.slice(0, 8).toUpperCase()}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6 py-6">
          {/* Order Progress */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-500" />
              অর্ডার স্ট্যাটাস
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>অর্ডার প্রগ্রেস</span>
                <span>{getStatusPercentage(orderDetails.status)}% সম্পূর্ণ</span>
              </div>
              <Progress value={getStatusPercentage(orderDetails.status)} className="h-2" />
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-xs text-center mt-4">
              <div className={`flex flex-col items-center ${orderDetails.status !== 'pending' ? 'text-green-600' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderDetails.status !== 'pending' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {orderDetails.status !== 'pending' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span>1</span>
                  )}
                </div>
                <span className="mt-1">বিচারাধীন</span>
              </div>
              
              <div className={`flex flex-col items-center ${['confirmed', 'processing', 'shipped', 'delivered'].includes(orderDetails.status) ? 'text-green-600' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['confirmed', 'processing', 'shipped', 'delivered'].includes(orderDetails.status) ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {['confirmed', 'processing', 'shipped', 'delivered'].includes(orderDetails.status) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span>2</span>
                  )}
                </div>
                <span className="mt-1">নিশ্চিতকৃত</span>
              </div>
              
              <div className={`flex flex-col items-center ${['processing', 'shipped', 'delivered'].includes(orderDetails.status) ? 'text-green-600' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['processing', 'shipped', 'delivered'].includes(orderDetails.status) ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {['processing', 'shipped', 'delivered'].includes(orderDetails.status) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span>3</span>
                  )}
                </div>
                <span className="mt-1">প্রসেসিং</span>
              </div>
              
              <div className={`flex flex-col items-center ${['shipped', 'delivered'].includes(orderDetails.status) ? 'text-green-600' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['shipped', 'delivered'].includes(orderDetails.status) ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {['shipped', 'delivered'].includes(orderDetails.status) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span>4</span>
                  )}
                </div>
                <span className="mt-1">শিপ করা হয়েছে</span>
              </div>
              
              <div className={`flex flex-col items-center ${orderDetails.status === 'delivered' ? 'text-green-600' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderDetails.status === 'delivered' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {orderDetails.status === 'delivered' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span>5</span>
                  )}
                </div>
                <span className="mt-1">ডেলিভারি সম্পন্ন</span>
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
                    orderDetails.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                    orderDetails.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
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
                    {item.product.image_url ? (
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
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
              
              <div className="flex justify-between text-lg font-bold mt-2 pt-2">
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

          {/* Next Steps & Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery Estimate */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900">ডেলিভারি সময়</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      আপনার অর্ডারটি {estimatedDelivery} এর মধ্যে ডেলিভারি করা হবে।
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Information */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <HeadphonesIcon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-900">সহায়তা প্রয়োজন?</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      আমাদের গ্রাহক সেবা টিমের সাথে যোগাযোগ করুন: <strong>+৮৮০ ৯৬১২ ৩৪৫৬৭৮৯</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promo Code Info */}
            {orderDetails.promo_code && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Gift className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-900">প্রমো কোড প্রয়োগ হয়েছে</h4>
                      <p className="text-sm text-green-700 mt-1">
                        আপনি <strong>{orderDetails.promo_code}</strong> প্রমো কোড ব্যবহার করে <strong>৳{orderDetails.discount_amount.toLocaleString('bn-BD')}</strong> ছাড় পেয়েছেন।
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warranty Info */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-900">ওয়ারেন্টি তথ্য</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      সকল পণ্যের জন্য কোম্পানি ওয়ারেন্টি প্রযোজ্য। বিস্তারিত জানতে হেল্পলাইনে যোগাযোগ করুন।
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Notices */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-yellow-900 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                গুরুত্বপূর্ণ নোটিশ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• ডেলিভারির সময় অর্ডার নম্বর ও ট্রানজেকশন আইডি প্রদর্শন করতে হতে পারে</li>
                <li>• পণ্য ডেলিভারির সময় প্যাকেট খুলে যাচাই করে নিন</li>
                <li>• কোন সমস্যা থাকলে ডেলিভারি পার্সনকে জানান বা আমাদের হেল্পলাইনে কল করুন</li>
                <li>• রিটার্ন/রিফান্ডের জন্য ৭ কার্যদিবস সময় লাগতে পারে</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1" variant="outline" size="lg">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                হোমপেজ
              </Link>
            </Button>
            <Button 
              onClick={() => navigate('/user-dashboard/orders')} 
              className="flex-1" 
              variant="outline" 
              size="lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              অর্ডার ট্র্যাক করুন
            </Button>
            <Button asChild className="flex-1 btn-gradient" size="lg">
              <Link to="/products">
                আরো কেনাকাটা করুন
              </Link>
            </Button>
          </div>

          {/* Rating Prompt */}
          <Card className="bg-gray-50 border-gray-200 text-center">
            <CardContent className="p-6">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-800">আপনার অভিজ্ঞতা কী ছিল?</h3>
              <p className="text-sm text-gray-600 mt-1 mb-3">আমাদের সেবা নিয়ে আপনার মূল্যবান মতামত দিন</p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button key={star} variant="outline" size="icon" className="h-8 w-8">
                    <Star className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-100px) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
