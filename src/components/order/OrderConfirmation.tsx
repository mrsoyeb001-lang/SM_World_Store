import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck } from 'lucide-react';

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  image_url: string;
}

interface OrderConfirmationProps {
  orderId?: string;
  totalAmount?: number;
  orderItems?: OrderItem[];
}

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, totalAmount, orderItems } = location.state as OrderConfirmationProps || {};

  useEffect(() => {
    // অর্ডার কনফার্মেশন পেজ লোড হলে কার্ট ক্লিয়ার করা
    localStorage.removeItem('cart');
  }, []);

  // যদি অর্ডার ডেটা না থাকে
  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">অর্ডার তথ্য পাওয়া যায়নি</h1>
        <p className="mt-4">দয়া করে আপনার অর্ডার হিষ্ট্রি থেকে অর্ডারটি দেখুন</p>
        <Button asChild className="mt-6">
          <Link to="/dashboard/orders">আমার অর্ডারগুলো</Link>
        </Button>
      </div>
    );
  }

  const orderStatusSteps = [
    {
      title: "অর্ডার প্লেসড",
      description: "আপনার অর্ডারটি সফলভাবে প্লেস হয়েছে",
      icon: CheckCircle,
      status: "completed"
    },
    {
      title: "প্রসেসিং",
      description: "আমরা আপনার অর্ডারটি প্রসেস করছি",
      icon: Package,
      status: "current"
    },
    {
      title: "শিপিং",
      description: "আপনার অর্ডারটি শিপ করার জন্য প্রস্তুত",
      icon: Truck,
      status: "upcoming"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-green-600 mb-4">অর্ডার সফল!</h1>
        <p className="text-lg text-gray-600 mb-8">
          অর্ডার #<span className="font-semibold">{orderId.slice(0, 8)}</span> সফলভাবে প্লেস হয়েছে। 
          আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
        </p>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">অর্ডার সামারি</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderItems?.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-500">পরিমাণ: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>মোট</span>
                  <span>৳{totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">অর্ডার স্ট্যাটাস</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {orderStatusSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="flex items-start">
                    <div className={`flex-shrink-0 rounded-full p-2 mr-4 ${
                      step.status === 'completed' ? 'bg-green-100 text-green-600' : 
                      step.status === 'current' ? 'bg-blue-100 text-blue-600' : 
                      'bg-gray-100 text-gray-400'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <h3 className={`font-medium ${
                        step.status === 'completed' ? 'text-green-800' : 
                        step.status === 'current' ? 'text-blue-800' : 
                        'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/dashboard/orders">
              আমার অর্ডারগুলো দেখুন
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              আরও শপিং করুন
            </Link>
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            কোনো প্রশ্ন আছে? আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন: 
            <a href="tel:+8801624712851" className="font-semibold ml-1">+8801624712851</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
