import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Home, Clock, MapPin, Phone, Mail, CreditCard, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url?: string;
  };
}

interface ShippingAddress {
  full_name: string;
  phone: string;
  address: string;
  city: string;
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
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Get order data from navigation state or fetch from API
  useEffect(() => {
    if (location.state) {
      // If we have state from navigation, use it
      const { orderId, total, shippingAddress } = location.state;
      
      // In a real app, you would fetch the complete order details using the orderId
      // For now, we'll create a mock order object
      const mockOrder: OrderDetails = {
        id: orderId,
        created_at: new Date().toISOString(),
        total_amount: total,
        shipping_cost: 60,
        discount_amount: 0,
        payment_method: 'cash_on_delivery',
        status: 'pending',
        order_items: [
          {
            product_id: 'prod_001',
            quantity: 1,
            price: total - 60,
            product: {
              name: 'সamsung Galaxy S21 Ultra',
              image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
            }
          }
        ],
        shipping_address: shippingAddress
      };
      
      setOrderDetails(mockOrder);
      setLoading(false);
    } else {
      // If no state, try to get the latest order for the user
      // This would be an API call in a real application
      setTimeout(() => {
        const mockOrder: OrderDetails = {
          id: 'ord_789012',
          created_at: new Date().toISOString(),
          total_amount: 4599,
          shipping_cost: 60,
          discount_amount: 0,
          payment_method: 'bkash',
          status: 'pending',
          order_items: [
            {
              product_id: 'prod_001',
              quantity: 1,
              price: 3999,
              product: {
                name: 'সamsung Galaxy S21 Ultra',
                image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
              }
            },
            {
              product_id: 'prod_002',
              quantity: 1,
              price: 600,
              product: {
                name: 'Sony WH-1000XM4 হেডফোন',
                image_url: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
              }
            }
          ],
          shipping_address: {
            full_name: 'আহমেদ রহমান',
            phone: '+8801712XXXXXX',
            address: '১২/৪, মিরপুর রোড, ঢাকা-১২১৬',
            city: 'ঢাকা',
            sender_number: '+8801712XXXXXX',
            transaction_id: 'TRX78901234'
          }
        };
        
        setOrderDetails(mockOrder);
        setLoading(false);
      }, 1000);
    }
  }, [location.state]);

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
                  {orderDetails.status === 'pending' && 'বিচারাধীন'}
                  {orderDetails.status === 'confirmed' && 'নিশ্চিতকৃত'}
                  {orderDetails.status === 'shipped' && 'শিপ করা হয়েছে'}
                  {orderDetails.status === 'delivered' && 'ডেলিভারি সম্পন্ন'}
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
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
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
                <p className="text-sm text-gray-500">গ্রাহকের নাম</p>
                <p className="font-medium">{orderDetails.shipping_address.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">মোবাইল নম্বর</p>
                <p className="font-medium flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {orderDetails.shipping_address.phone}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">ঠিকানা</p>
                <p className="font-medium">{orderDetails.shipping_address.address}, {orderDetails.shipping_address.city}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900">পরবর্তী ধাপ</h4>
                <p className="text-sm text-blue-700">
                  আমরা আপনার অর্ডার প্রস্তুত করছি। আপনি ইমেইল বা SMS এর মাধ্যমে আপডেট পাবেন।
                  সাধারণত ২-৩ কার্যদিবসে ডেলিভারি হয়ে থাকে। জরুরি প্রয়োজনে আমাদের হেল্পলাইনে যোগাযোগ করুন।
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
        </CardContent>
      </Card>
    </div>
  );
}
