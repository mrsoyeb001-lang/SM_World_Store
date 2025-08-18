import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShippingAddress {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  sender_number?: string;
  transaction_id?: string;
}

interface Order {
  id: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  notes: string | null;
  promo_code: string | null;
  tracking_code: string | null;
  shipping_address: ShippingAddress;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    products: {
      name: string;
      images: string[];
    };
  }[];
  profiles: {
    full_name: string;
    phone: string;
  };
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Get current user info
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "লগইন প্রয়োজন",
          description: "অর্ডার দেখার জন্য লগইন করুন।",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profile?.is_admin) {
        toast({
          title: "অ্যাক্সেস নিষেধ",
          description: "অর্ডার দেখার জন্য এডমিন অনুমতি প্রয়োজন।",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (full_name, phone, email),
          order_items (
            id,
            quantity,
            price,
            products (name, images)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Order fetch error:', error);
        toast({
          title: "অর্ডার লোড করতে ব্যর্থ",
          description: `Database Error: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Orders fetched successfully:', data);
        // Type cast the data properly
        const typedOrders = (data || []).map(order => ({
          ...order,
          shipping_address: order.shipping_address as unknown as ShippingAddress,
          order_items: order.order_items.map(item => ({
            ...item,
            products: item.products as unknown as { name: string; images: string[] }
          })),
          profiles: order.profiles as unknown as { full_name: string; phone: string }
        })) as Order[];
        
        setOrders(typedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "অর্ডার লোড করতে সমস্যা",
        description: "দয়া করে পুনরায় চেষ্টা করুন। যদি সমস্যা থাকে তাহলে পেজ রিফ্রেশ করুন।",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "স্ট্যাটাস আপডেট ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "স্ট্যাটাস আপডেট হয়েছে",
        description: "অর্ডারের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।"
      });
      fetchOrders();
    }
  };

  const addTrackingCode = async (orderId: string) => {
    if (!trackingCode.trim()) {
      toast({
        title: "ট্র্যাকিং কোড প্রয়োজন",
        description: "অনুগ্রহ করে ট্র্যাকিং কোড লিখুন।",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('orders')
      .update({ 
        tracking_code: trackingCode,
        status: 'shipped'
      })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "ট্র্যাকিং কোড যোগ ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "ট্র্যাকিং কোড যোগ হয়েছে",
        description: "অর্ডারটি শিপমেন্টের জন্য প্রস্তুত।"
      });
      setTrackingCode('');
      setIsDialogOpen(false);
      fetchOrders();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'পেন্ডিং', variant: 'secondary' as const, icon: Package },
      confirmed: { label: 'কনফার্ম', variant: 'default' as const, icon: CheckCircle },
      shipped: { label: 'শিপড', variant: 'outline' as const, icon: Truck },
      delivered: { label: 'ডেলিভারড', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'বাতিল', variant: 'destructive' as const, icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      cash_on_delivery: 'ক্যাশ অন ডেলিভারি',
      bkash: 'বিকাশ',
      rocket: 'রকেট',
      nagad: 'নগদ'
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">অর্ডার ব্যবস্থাপনা</h2>
        <div className="text-sm text-muted-foreground">
          মোট অর্ডার: {orders.length}
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">লোড হচ্ছে...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">কোন অর্ডার পাওয়া যায়নি</div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Order Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">অর্ডার #{order.id.slice(-8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">গ্রাহক তথ্য</h4>
                      <p className="text-sm">{order.shipping_address.full_name}</p>
                      <p className="text-sm">{order.shipping_address.phone}</p>
                      <p className="text-sm">{order.shipping_address.address}, {order.shipping_address.city}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">পেমেন্ট তথ্য</h4>
                      <p className="text-sm">{getPaymentMethodLabel(order.payment_method)}</p>
                      {order.shipping_address.sender_number && (
                        <p className="text-sm">পাঠানো নম্বর: {order.shipping_address.sender_number}</p>
                      )}
                      {order.shipping_address.transaction_id && (
                        <p className="text-sm">ট্রানজেকশন: {order.shipping_address.transaction_id}</p>
                      )}
                      {order.tracking_code && (
                        <p className="text-sm font-medium text-blue-600">
                          ট্র্যাকিং: {order.tracking_code}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">অর্ডার আইটেম</h4>
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        {item.products.images?.[0] && (
                          <img 
                            src={item.products.images[0]} 
                            alt={item.products.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <span>{item.products.name} x {item.quantity}</span>
                        <span className="ml-auto">৳{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>সাবটোটাল:</span>
                        <span>৳{(order.total_amount - order.shipping_cost + order.discount_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>শিপিং:</span>
                        <span>৳{order.shipping_cost.toFixed(2)}</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>ছাড়:</span>
                          <span>-৳{order.discount_amount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>মোট:</span>
                        <span>৳{order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>স্ট্যাটাস পরিবর্তন</Label>
                    <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">পেন্ডিং</SelectItem>
                        <SelectItem value="confirmed">কনফার্ম</SelectItem>
                        <SelectItem value="shipped">শিপড</SelectItem>
                        <SelectItem value="delivered">ডেলিভারড</SelectItem>
                        <SelectItem value="cancelled">বাতিল</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {order.status === 'confirmed' && !order.tracking_code && (
                    <Dialog open={isDialogOpen && selectedOrder?.id === order.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          ট্র্যাকিং কোড যোগ করুন
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>ট্র্যাকিং কোড যোগ করুন</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="trackingCode">ট্র্যাকিং কোড</Label>
                            <Input
                              id="trackingCode"
                              value={trackingCode}
                              onChange={(e) => setTrackingCode(e.target.value)}
                              placeholder="ট্র্যাকিং কোড লিখুন"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              বাতিল
                            </Button>
                            <Button onClick={() => addTrackingCode(order.id)}>
                              যোগ করুন
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        বিস্তারিত দেখুন
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>অর্ডার বিস্তারিত</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">গ্রাহক তথ্য</h4>
                          <div className="bg-muted p-3 rounded text-sm">
                            <p><strong>নাম:</strong> {order.shipping_address.full_name}</p>
                            <p><strong>ফোন:</strong> {order.shipping_address.phone}</p>
                            <p><strong>ঠিকানা:</strong> {order.shipping_address.address}</p>
                            <p><strong>শহর:</strong> {order.shipping_address.city}</p>
                          </div>
                        </div>
                        
                        {order.notes && (
                          <div>
                            <h4 className="font-medium mb-2">বিশেষ নির্দেশনা</h4>
                            <div className="bg-muted p-3 rounded text-sm">
                              {order.notes}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}