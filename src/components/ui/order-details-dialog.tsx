import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, CreditCard, Calendar, Truck } from 'lucide-react';

interface OrderItem {
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_method?: string;
  tracking_code?: string;
  shipping_address?: any;
  order_items: OrderItem[];
}

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function OrderDetailsDialog({ open, onOpenChange, order }: OrderDetailsDialogProps) {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'অপেক্ষমান', variant: 'outline' as const, color: 'text-yellow-600' },
      confirmed: { label: 'নিশ্চিত', variant: 'secondary' as const, color: 'text-blue-600' },
      shipped: { label: 'পাঠানো হয়েছে', variant: 'default' as const, color: 'text-purple-600' },
      delivered: { label: 'পৌঁছেছে', variant: 'default' as const, color: 'text-green-600' },
      cancelled: { label: 'বাতিল', variant: 'destructive' as const, color: 'text-red-600' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant} className={statusInfo.color}>{statusInfo.label}</Badge>;
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              অর্ডার #{order.id.slice(0, 8)}
            </div>
            {getStatusBadge(order.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">তারিখ:</span>
              <span>{new Date(order.created_at).toLocaleDateString('bn-BD')}</span>
            </div>
            {order.tracking_code && (
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">ট্র্যাকিং:</span>
                <span className="font-medium text-blue-600">{order.tracking_code}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              অর্ডারকৃত পণ্য
            </h4>
            <div className="space-y-3">
              {order.order_items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <img
                    src={item.product.images[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium">{item.product.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      পরিমাণ: {item.quantity} টি × ৳{item.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">৳{(item.quantity * item.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              পেমেন্ট তথ্য
            </h4>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>পেমেন্ট মেথড:</span>
                <span>{order.payment_method ? getPaymentMethodLabel(order.payment_method) : 'ক্যাশ অন ডেলিভারি'}</span>
              </div>
              {order.shipping_address?.transaction_id && (
                <div className="flex justify-between text-sm">
                  <span>ট্রানজেকশন আইডি:</span>
                  <span className="font-medium">{order.shipping_address.transaction_id}</span>
                </div>
              )}
              {order.shipping_address?.sender_number && (
                <div className="flex justify-between text-sm">
                  <span>পাঠানো নম্বর:</span>
                  <span>{order.shipping_address.sender_number}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>মোট পরিমাণ:</span>
                <span className="text-lg">৳{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  ডেলিভারি ঠিকানা
                </h4>
                <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
                  <p><strong>নাম:</strong> {order.shipping_address.full_name}</p>
                  <p><strong>ফোন:</strong> {order.shipping_address.phone}</p>
                  <p><strong>ঠিকানা:</strong> {order.shipping_address.address}</p>
                  {order.shipping_address.city && (
                    <p><strong>শহর:</strong> {order.shipping_address.city}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Order Status Timeline */}
          <div>
            <h4 className="font-semibold mb-3">অর্ডার স্ট্যাটাস</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">অর্ডার প্রদান করা হয়েছে</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString('bn-BD')}
                </span>
              </div>
              
              {order.status !== 'pending' && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">অর্ডার নিশ্চিত করা হয়েছে</span>
                </div>
              )}
              
              {(['shipped', 'delivered'].includes(order.status)) && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">পণ্য পাঠানো হয়েছে</span>
                  {order.tracking_code && (
                    <span className="text-xs font-medium text-blue-600">
                      ({order.tracking_code})
                    </span>
                  )}
                </div>
              )}
              
              {order.status === 'delivered' && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm">পণ্য ডেলিভার হয়েছে</span>
                </div>
              )}
              
              {order.status === 'cancelled' && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">অর্ডার বাতিল করা হয়েছে</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}