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
  AlertCircle,
  FileText,
  HeadphonesIcon
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
    payment_status: 'paid',
    tracking_number: 'TRK' + orderId.slice(-8).toUpperCase(),
    estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    shipping_address: {
      full_name: 'রহিম আহমেদ',
      phone: '০১৭১২৩৪৫৬৭৮',
      address: '১২/৩, আজিমপুর রোড, ঢাকা',
      city: 'ঢাকা',
      area: 'মোহাম্মদপুর',
      postal_code: '1207'
    },
    user: {
      name: 'রহিম আহমেদ',
      email: 'rahim@example.com',
      phone: '০১৭১২৩৪৫৬৭৮',
      member_since: '২০২৩-০১-১৫'
    },
    items: [
      {
        id: '1',
        product_name: 'Samsung Galaxy S23 Ultra',
        quantity: 1,
        price: 21999.00,
        image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        category: 'স্মার্টফোন',
        variant: 'কালো, 256GB'
      },
      {
        id: '2',
        product_name: 'সিলিকন কেস',
        quantity: 2,
        price: 450.00,
        image_url: 'https://images.unsplash.com/photo-1609091839311-d5365e5b0c0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        category: 'অ্যাকসেসরিজ',
        variant: 'ট্রান্সপারেন্ট'
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
    { id: 'ordered', label: 'অর্ডার্ড', icon: ShoppingBag, description: 'অর্ডার প্লেস করা হয়েছে' },
    { id: 'confirmed', label: 'কনফার্মড', icon: CheckCircle, description: 'অর্ডার কনফার্ম করা হয়েছে' },
    { id: 'processing', label: 'প্রসেসিং', icon: Package, description: 'অর্ডার প্রস্তুত করা হচ্ছে' },
    { id: 'shipped', label: 'শিপড', icon: Truck, description: 'অর্ডার শিপ করা হয়েছে' },
    { id: 'delivered', label: 'ডেলিভার্ড', icon: CheckCircle, description: 'অর্ডার ডেলিভার করা হয়েছে' }
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
            <div key={step.id} className="flex flex-col items-center relative z-10">
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
      
      <div className="mt-4 text-center p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">
          {statusSteps[currentStatusIndex]?.description || 'অর্ডার স্ট্যাটাস আপডেট হচ্ছে...'}
        </p>
        {status === 'processing' && (
          <p className="text-xs text-blue-600 mt-1">
            আনুমানিক ডেলিভারি: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('bn-BD')}
          </p>
        )}
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
              {new Date(event.timestamp).toLocaleString('bn-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductRating = ({ productId, productName }) => {
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const handleRateProduct = (selectedRating) => {
    setRating(selectedRating);
    toast({
      title: "রেটিং সাবমিট হয়েছে",
      description: `${productName} - ${selectedRating} স্টার রেটিং দেওয়া হয়েছে`,
    });
  };

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium mb-2">পণ্যটি রেট করুন</p>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-5 h-5 cursor-pointer ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => handleRateProduct(star)}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">({rating}/5)</span>
      </div>
    </div>
  );
};

export function OrderConfirmation() {
  const location = useLocation();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="ghost" asChild className="mr-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> 
              পিছনে
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">অর্ডার কনফার্মেশন</h1>
        </div>
        <Badge variant="outline" className="text-base px-3 py-1">
          অর্ডার #: {order.id}
        </Badge>
      </div>

      {/* Success Alert */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-8">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4 mb-4 md:mb-0">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-green-800">অর্ডার সফল! 🎉</CardTitle>
              <CardDescription className="text-green-700 text-base">
                আপনার অর্ডার সফলভাবে প্রদান করা হয়েছে। একটি কনফার্মেশন ইমেইল আপনার ইমেইল ঠিকানায় পাঠানো হয়েছে।
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="details">অর্ডার বিবরণ</TabsTrigger>
          <TabsTrigger value="status">অর্ডার স্ট্যাটাস</TabsTrigger>
          <TabsTrigger value="payment">পেমেন্ট তথ্য</TabsTrigger>
          <TabsTrigger value="support">সাপোর্ট</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    অর্ডার আইটেমস
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 py-4 border-b last:border-b-0">
                        <img 
                          src={item.image_url} 
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{item.product_name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline">{item.category}</Badge>
                            {item.variant && <Badge variant="secondary">{item.variant}</Badge>}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">Qty: {item.quantity}</Badge>
                              <span className="text-muted-foreground">৳{item.price.toFixed(2)}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-lg">৳{(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                          </div>
                          <ProductRating productId={item.id} productName={item.product_name} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-3">
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
                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                      <span>মোট</span>
                      <span>৳{order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    ডেলিভারি ঠিকানা
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{order.shipping_address.full_name}</p>
                  <p className="text-sm mt-2">{order.shipping_address.address}</p>
                  <p className="text-sm">{order.shipping_address.area}, {order.shipping_address.city} - {order.shipping_address.postal_code}</p>
                  <p className="text-sm mt-2 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {order.shipping_address.phone}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-2" />
                    গ্রাহক তথ্য
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{order.user.name}</p>
                  <p className="text-sm flex items-center mt-2">
                    <Mail className="w-3 h-3 mr-1" />
                    {order.user.email}
                  </p>
                  <p className="text-sm flex items-center mt-1">
                    <Phone className="w-3 h-3 mr-1" />
                    {order.user.phone}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    সদস্য sejak: {new Date(order.user.member_since).toLocaleDateString('bn-BD')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="status">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>অর্ডার স্ট্যাটাস</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderStatusStepper status={order.status} />
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>অর্ডার টাইমলাইন</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderTimeline history={order.status_history} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">ট্র্যাকিং তথ্য</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-muted-foreground">ট্র্যাকিং নম্বর</span>
                    <span className="font-medium">{order.tracking_number}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">অনুমানিক ডেলিভারি</span>
                    <span className="font-medium">{new Date(order.estimated_delivery).toLocaleDateString('bn-BD')}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <h3 className="font-medium flex items-center text-amber-800 mb-2">
                    <Truck className="w-4 h-4 mr-2" />
                    ডেলিভারি নোট
                  </h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• ডেলিভারির সময় ফোনে উপলব্ধ থাকুন</li>
                    <li>• অর্ডার কনফার্ম করতে OTP প্রদান করতে হতে পারে</li>
                    <li>• পণ্য গ্রহণের পূর্বে ভালোভাবে পরীক্ষা করুন</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    পেমেন্ট তথ্য
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">পেমেন্ট মেথড</p>
                      <p className="font-medium">
                        {order.payment_method === 'bkash' && 'বিকাশ'}
                        {order.payment_method === 'rocket' && 'রকেট'}
                        {order.payment_method === 'nagad' && 'নগদ'}
                        {order.payment_method === 'cash_on_delivery' && 'ক্যাশ অন ডেলিভারি'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">পেমেন্ট স্ট্যাটাস</p>
                      <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                        {order.payment_status === 'paid' ? 'পেড' : 'Pending'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">পেমেন্ট তারিখ</p>
                      <p className="font-medium">{new Date(order.order_date).toLocaleDateString('bn-BD')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">মোট Amount</p>
                      <p className="font-medium">৳{order.total_amount.toFixed(2)}</p>
                    </div>
                  </div>

                  {order.payment_method !== 'cash_on_delivery' && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">পেমেন্ট রেফারেন্স</h4>
                      <p className="text-sm text-blue-700">
                        আপনার পেমেন্ট সফলভাবে প্রসেস করা হয়েছে। ট্রানজেকশন রেফারেন্স নম্বর: TXN{order.id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">অর্ডার সামারি</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">অর্ডার নম্বর</span>
                    <span className="font-medium">#{order.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">অর্ডার তারিখ</span>
                    <span className="font-medium">{new Date(order.order_date).toLocaleDateString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">পেমেন্ট মেথড</span>
                    <Badge>
                      {order.payment_method === 'bkash' && 'বিকাশ'}
                      {order.payment_method === 'rocket' && 'রকেট'}
                      {order.payment_method === 'nagad' && 'নগদ'}
                      {order.payment_method === 'cash_on_delivery' && 'ক্যাশ অন ডেলিভারি'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button className="w-full" onClick={handleDownloadInvoice}>
                  <Download className="w-4 h-4 mr-2" />
                  ইনভয়েস ডাউনলোড
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShareOrder}>
                  <Share2 className="w-4 h-4 mr-2" />
                  অর্ডার শেয়ার করুন
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="support">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HeadphonesIcon className="w-5 h-5 mr-2" />
                  কাস্টমার সাপোর্ট
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">সাহায্যের প্রয়োজন?</h4>
                    <p className="text-sm text-blue-700">
                      আমাদের কাস্টমার কেয়ার টিম আপনার যেকোনো প্রশ্নের উত্তর দিতে প্রস্তুত।
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">কল করুন</p>
                        <p className="text-lg text-blue-700">১৬৩৪৫</p>
                        <p className="text-xs text-muted-foreground">(সকাল ৯টা - রাত ১১টা)</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">ইমেইল করুন</p>
                        <p className="text-blue-700">support@eshop.com</p>
                        <p className="text-xs text-muted-foreground">(২৪ ঘন্টার মধ্যে উত্তর)</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button asChild className="w-full">
                      <Link to="/support/ticket">
                        সাপোর্ট টিকেট তৈরি করুন
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>সচাল জিজ্ঞাসা</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">আমার অর্ডার কখন ডেলিভারি হবে?</h4>
                    <p className="text-sm text-muted-foreground">
                      সাধারণত অর্ডার কনফার্ম হওয়ার পর ২-৩ কার্যদিবসে ডেলিভারি হয়ে থাকে। আপনি আপনার অর্ডার স্ট্যাটাস পেজে আনুমানিক ডেলিভারি তারিখ দেখতে পারেন।
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">আমি কিভাবে আমার অর্ডার ট্র্যাক করব?</h4>
                    <p className="text-sm text-muted-foreground">
                      অর্ডার ট্র্যাক করতে আপনার অর্ডার নম্বর বা ট্র্যাকিং নম্বর ব্যবহার করুন। ডেলিভারি পার্টনার ওয়েবসাইটে ট্র্যাকিং নম্বর দিয়েও আপনি ট্র্যাক করতে পারেন।
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">রিটার্ন পলিসি কি?</h4>
                    <p className="text-sm text-muted-foreground">
                      পণ্য ডেলিভারির ৭ দিনের মধ্যে রিটার্ন করতে পারবেন। পণ্য অক্ষত ও আসল প্যাকেটে থাকতে হবে। কিছু পণ্য রিটার্নের অযোগ্য (আন্ডারওয়্যার, পার্সোনাল কেয়ার)।
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Fixed Call to Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-10">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-medium">অর্ডার #: {order.id}</p>
              <p className="text-sm text-muted-foreground">মোট: ৳{order.total_amount.toFixed(2)}</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to="/user-dashboard/orders">
                  <FileText className="w-4 h-4 mr-2" />
                  আমার অর্ডার
                </Link>
              </Button>
              <Button asChild className="btn-gradient">
                <Link to="/">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  আরো কেনাকাটা করুন
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
