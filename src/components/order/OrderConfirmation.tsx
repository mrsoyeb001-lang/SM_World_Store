import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin, 
  Calendar,
  User,
  Phone,
  Mail,
  ArrowLeft,
  ShoppingBag,
  Download,
  Share2,
  Star,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data functions - replace with actual API calls
const fetchOrderDetails = async (orderId: string) => {
  // In a real app, you would fetch this from your API
  return {
    id: orderId,
    order_date: new Date().toISOString(),
    status: 'processing',
    total_amount: 2499.00,
    shipping_cost: 120.00,
    discount_amount: 200.00,
    payment_method: 'bkash',
    tracking_number: 'TRK' + orderId.slice(-8).toUpperCase(),
    estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    shipping_address: {
      full_name: 'রহিম আহমেদ',
      phone: '০১৭১২৩৪৫৬৭৮',
      address: '১২/৩, আজিমপুর রোড, ঢাকা',
      city: 'ঢাকা',
      area: 'মোহাম্মদপুর'
    },
    user: {
      name: 'রহিম আহমেদ',
      email: 'rahim@example.com',
      phone: '০১৭১২৩৪৫৬৭৮'
    },
    items: [
      {
        id: '1',
        product_name: 'সamsung Galaxy S23 Ultra',
        quantity: 1,
        price: 21999.00,
        image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        category: 'স্মার্টফোন'
      },
      {
        id: '2',
        product_name: 'সিলিকন কেস',
        quantity: 2,
        price: 450.00,
        image_url: 'https://images.unsplash.com/photo-1609091839311-d5365e5b0c0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        category: 'অ্যাকসেসরিজ'
      }
    ],
    status_history: [
      { status: 'ordered', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), description: 'অর্ডার প্লেস করা হয়েছে' },
      { status: 'confirmed', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), description: 'অর্ডার কনফার্ম করা হয়েছে' },
      { status: 'processing', timestamp: new Date().toISOString(), description: 'অর্ডার প্রসেসিং হচ্ছে' }
    ]
  };
};

const OrderStatusStepper = ({ status }) => {
  const statusSteps = [
    { id: 'ordered', label: 'অর্ডার্ড', icon: ShoppingBag },
    { id: 'confirmed', label: 'কনফার্মড', icon: CheckCircle },
    { id: 'processing', label: 'প্রসেসিং', icon: Package },
    { id: 'shipped', label: 'শিপড', icon: Truck },
    { id: 'delivered', label: 'ডেলিভার্ড', icon: CheckCircle }
  ];

  const currentStatusIndex = statusSteps.findIndex(step => step.id === status);

  return (
    <div className="relative">
      <div className="flex justify-between mb-3">
        {statusSteps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index < currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-500 text-white' : 
                isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <StepIcon size={18} />
              </div>
              <span className={`text-xs mt-1 ${isCompleted || isCurrent ? 'font-medium' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      <Progress value={(currentStatusIndex / (statusSteps.length - 1)) * 100} className="h-2" />
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          {status === 'processing' && 'আপনার অর্ডারটি প্রস্তুত করা হচ্ছে। শীঘ্রই শিপ করা হবে।'}
          {status === 'confirmed' && 'আপনার অর্ডারটি কনফার্ম করা হয়েছে। প্রসেসিং শুরু হবে শীঘ্রই।'}
          {status === 'ordered' && 'আপনার অর্ডারটি সফলভাবে প্লেস করা হয়েছে। কনফার্মেশন এর জন্য অপেক্ষা করুন।'}
        </p>
      </div>
    </div>
  );
};

const OrderTimeline = ({ history }) => {
  return (
    <div className="space-y-4">
      {history.map((event, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
            {index < history.length - 1 && <div className="w-0.5 h-16 bg-gray-200 my-1"></div>}
          </div>
          <div className="flex-1 pb-4">
            <p className="font-medium">{event.description}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(event.timestamp).toLocaleString('bn-BD')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export function OrderConfirmation() {
  const location = useLocation();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get order data from navigation state or fetch from API
  const orderId = location.state?.orderId || 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const totalAmount = location.state?.total || 0;

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        const orderData = await fetchOrderDetails(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error loading order details:', error);
        toast({
          title: "ত্রুটি",
          description: "অর্ডার বিবরণ লোড করতে সমস্যা হয়েছে",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, toast]);

  const handleDownloadInvoice = () => {
    toast({
      title: "ইনভয়েস ডাউনলোড",
      description: "ইনভয়েস ডাউনলোড শুরু হচ্ছে...",
    });
    // In a real app, this would download the PDF invoice
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'আমার অর্ডার বিবরণ',
        text: `আমি ${order?.items[0]?.product_name} এবং ${order?.items.length - 1} টি আরো পণ্য অর্ডার করেছি।`,
        url: window.location.href,
      })
      .catch(() => {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "লিংক কপি করা হয়েছে",
          description: "অর্ডার লিংক ক্লিপবোর্ডে কপি করা হয়েছে",
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "লিংক কপি করা হয়েছে",
        description: "অর্ডার লিংক ক্লিপবোর্ডে কপি করা হয়েছে",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">অর্ডার খুঁজে পাওয়া যায়নি</h2>
        <p className="text-muted-foreground mb-6">দুঃখিত, requested অর্ডারটি খুঁজে পাওয়া যায়নি।</p>
        <Button asChild>
          <Link to="/">হোমপেজে ফিরে যান</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-4">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> 
            পিছনে
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">অর্ডার কনফার্মেশন</h1>
      </div>

      {/* Success Alert */}
      <Card className="bg-green-50 border-green-200 mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-green-800">অর্ডার সফল! 🎉</CardTitle>
              <CardDescription className="text-green-700">
                আপনার অর্ডার সফলভাবে প্রদান করা হয়েছে। অর্ডার নম্বর: #{order.id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>অর্ডার স্ট্যাটাস</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusStepper status={order.status} />
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>অর্ডার আইটেমস</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                    <img 
                      src={item.image_url} 
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product_name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">Qty: {item.quantity}</Badge>
                        <Badge variant="secondary">৳{item.price.toFixed(2)}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span>৳{(order.total_amount - order.shipping_cost + order.discount_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>শিপিং</span>
                  <span>৳{order.shipping_cost.toFixed(2)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>ছাড়</span>
                    <span>-৳{order.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>মোট</span>
                  <span>৳{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>অর্ডার টাইমলাইন</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline history={order.status_history} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>অর্ডার সামারি</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">অর্ডার নম্বর</span>
                <span className="font-medium">#{order.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">অর্ডার তারিখ</span>
                <span className="font-medium">{new Date(order.order_date).toLocaleDateString('bn-BD')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">অনুমানিক ডেলিভারি</span>
                <span className="font-medium">{new Date(order.estimated_delivery).toLocaleDateString('bn-BD')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ট্র্যাকিং নম্বর</span>
                <span className="font-medium">{order.tracking_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">পেমেন্ট মেথড</span>
                <Badge>
                  {order.payment_method === 'bkash' && 'বিকাশ'}
                  {order.payment_method === 'rocket' && 'রকেট'}
                  {order.payment_method === 'nagad' && 'নগদ'}
                  {order.payment_method === 'cash_on_delivery' && 'ক্যাশ অন ডেলিভারি'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">স্ট্যাটাস</span>
                <Badge variant={
                  order.status === 'delivered' ? 'default' : 
                  order.status === 'processing' ? 'secondary' : 'outline'
                }>
                  {order.status === 'ordered' && 'অর্ডার্ড'}
                  {order.status === 'confirmed' && 'কনফার্মড'}
                  {order.status === 'processing' && 'প্রসেসিং'}
                  {order.status === 'shipped' && 'শিপড'}
                  {order.status === 'delivered' && 'ডেলিভার্ড'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                ডেলিভারি ঠিকানা
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.shipping_address.full_name}</p>
              <p className="text-sm">{order.shipping_address.address}</p>
              <p className="text-sm">{order.shipping_address.area}, {order.shipping_address.city}</p>
              <p className="text-sm mt-2 flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {order.shipping_address.phone}
              </p>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm">
                <User className="w-4 h-4 mr-2" />
                গ্রাহক তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.user.name}</p>
              <p className="text-sm flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {order.user.email}
              </p>
              <p className="text-sm flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {order.user.phone}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" onClick={handleDownloadInvoice}>
              <Download className="w-4 h-4 mr-2" />
              ইনভয়েস ডাউনলোড
            </Button>
            <Button variant="outline" className="w-full" onClick={handleShareOrder}>
              <Share2 className="w-4 h-4 mr-2" />
              শেয়ার করুন
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/support">
                সাপোর্টে যোগাযোগ করুন
              </Link>
            </Button>
          </div>

          {/* Support Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-medium flex items-center text-blue-800 mb-2">
                <Phone className="w-4 h-4 mr-2" />
                সাহায্যের প্রয়োজন?
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                আমাদের কাস্টমার কেয়ার টিম আপনার যেকোনো প্রশ্নের উত্তর দিতে প্রস্তুত।
              </p>
              <div className="text-sm">
                <p className="font-medium">কল করুন: <span className="text-blue-700">১৬৩৪৫</span></p>
                <p className="text-xs text-muted-foreground">(সকাল ৯টা - রাত ১১টা)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
