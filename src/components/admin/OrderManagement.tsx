import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  shipping_address: any;
  payment_method: string;
  status: string;
  created_at: string;
  promo_code: string | null;
  notes: string | null;
  profiles: {
    full_name: string;
    phone: string;
  } | null;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    product_id: string;
    products: {
      name: string;
      images: string[];
    };
  }[];
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!user_id (full_name, phone),
          order_items (
            id, quantity, price, product_id,
            products (name, images)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as any) || []);
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "অর্ডার লোড করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "সফল",
        description: "অর্ডার স্ট্যাটাস আপডেট হয়েছে।"
      });
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'পেন্ডিং', variant: 'secondary' as const },
      confirmed: { label: 'কনফার্ম', variant: 'default' as const },
      shipped: { label: 'শিপ করা হয়েছে', variant: 'outline' as const },
      delivered: { label: 'ডেলিভার হয়েছে', variant: 'default' as const },
      cancelled: { label: 'বাতিল', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex justify-center p-8">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search">অর্ডার খুঁজুন</Label>
          <Input
            id="search"
            placeholder="অর্ডার ID, নাম বা ফোন নম্বর..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="status">স্ট্যাটাস ফিল্টার</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব অর্ডার</SelectItem>
              <SelectItem value="pending">পেন্ডিং</SelectItem>
              <SelectItem value="confirmed">কনফার্ম</SelectItem>
              <SelectItem value="shipped">শিপ করা হয়েছে</SelectItem>
              <SelectItem value="delivered">ডেলিভার হয়েছে</SelectItem>
              <SelectItem value="cancelled">বাতিল</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">অর্ডার #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString('bn-BD')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">৳{order.total_amount}</p>
                  <p className="text-sm text-muted-foreground">{order.payment_method === 'cash_on_delivery' ? 'ক্যাশ অন ডেলিভারি' : order.payment_method}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">গ্রাহকের তথ্য</h4>
                <p><strong>নাম:</strong> {order.profiles?.full_name || 'N/A'}</p>
                <p><strong>ফোন:</strong> {order.profiles?.phone || 'N/A'}</p>
                <p><strong>ঠিকানা:</strong> {order.shipping_address?.address}</p>
                <p><strong>শহর:</strong> {order.shipping_address?.city}</p>
                {order.notes && <p><strong>নোট:</strong> {order.notes}</p>}
              </div>

              <div>
                <h4 className="font-medium mb-2">অর্ডার আইটেম</h4>
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.products.name} x {item.quantity}</span>
                      <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>সাবটোটাল:</span>
                    <span>৳{(order.total_amount - order.shipping_cost + order.discount_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>শিপিং:</span>
                    <span>৳{order.shipping_cost}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>ছাড় ({order.promo_code}):</span>
                      <span>-৳{order.discount_amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>মোট:</span>
                    <span>৳{order.total_amount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-2">
                <Select
                  defaultValue={order.status}
                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">পেন্ডিং</SelectItem>
                    <SelectItem value="confirmed">কনফার্ম</SelectItem>
                    <SelectItem value="shipped">শিপ করা হয়েছে</SelectItem>
                    <SelectItem value="delivered">ডেলিভার হয়েছে</SelectItem>
                    <SelectItem value="cancelled">বাতিল</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">কোন অর্ডার পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}