import { useEffect } from 'react';
import { useOrderConfirmation } from '@/hooks/useOrderConfirmation';
import { useAffiliate } from '@/hooks/useAffiliate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderConfirmationProps {
  orderId: string;
  totalAmount: number;
  orderItems: Array<{
    product_name: string;
    quantity: number;
    price: number;
    image_url?: string;
  }>;
}

export function OrderConfirmation({ orderId, totalAmount, orderItems }: OrderConfirmationProps) {
  const { showOrderConfirmation } = useOrderConfirmation();
  const { createAffiliateEarning } = useAffiliate();

  useEffect(() => {
    // Show confirmation toast
    showOrderConfirmation(orderId, totalAmount);
    
    // Process affiliate earning
    createAffiliateEarning(orderId, totalAmount);
  }, [orderId, totalAmount, showOrderConfirmation, createAffiliateEarning]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">অর্ডার সফল! 🎉</CardTitle>
          <p className="text-green-600">আপনার অর্ডার সফলভাবে প্রদান করা হয়েছে।</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">অর্ডার বিবরণ</h3>
              <span className="text-sm text-muted-foreground">#{orderId.slice(0, 8)}</span>
            </div>
            
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.product_name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × ৳{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">৳{(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>মোট</span>
                <span>৳{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">পরবর্তী ধাপ</h4>
                <p className="text-sm text-blue-700">
                  আমরা আপনার অর্ডার প্রস্তুত করছি। আপনি ইমেইল বা SMS এর মাধ্যমে আপডেট পাবেন।
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900">ডেলিভারি তথ্য</h4>
                <p className="text-sm text-purple-700">
                  সাধারণত ২-৩ কার্যদিবসে ডেলিভারি হয়ে থাকে। জরুরি প্রয়োজনে যোগাযোগ করুন।
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button asChild className="flex-1" variant="outline">
              <Link to="/user-dashboard">
                <Package className="w-4 h-4 mr-2" />
                অর্ডার ট্র্যাক করুন
              </Link>
            </Button>
            <Button asChild className="flex-1 btn-gradient">
              <Link to="/">
                আরো কেনাকাটা করুন
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
