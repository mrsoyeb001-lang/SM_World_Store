import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, User, MapPin, CreditCard, Tag, Clock } from "lucide-react";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  payment_method: string;
  notes: string | null;
  promo_code: string | null;
  status: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    sender_number?: string;
    transaction_id?: string;
  };
  order_items: OrderItem[];
}

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate("/cart");
      return;
    }

    // Real-time order fetch & subscription
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, product(name))")
        .eq("id", orderId)
        .single();

      if (data) setOrder(data);
      setLoading(false);
    };

    fetchOrder();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload) => {
          setOrder((prev) => (prev ? { ...prev, ...payload.new } as Order : null));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Clock className="h-8 w-8 animate-spin mx-auto mb-3 text-gray-500" />
        <p>অর্ডার লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">অর্ডার খুঁজে পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Success Message */}
      <div className="text-center mb-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold mt-4">🎉 অভিনন্দন! আপনার অর্ডার কনফার্ম হয়েছে</h1>
        <p className="text-gray-600 mt-2">অর্ডার স্ট্যাটাস: {order.status === "pending" ? "⏳ প্রসেসিং" : "✅ " + order.status}</p>
      </div>

      {/* Order Info */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Package className="h-5 w-5 text-primary" /> অর্ডার তথ্য
          </h2>
          <p>অর্ডার আইডি: <span className="font-mono">{order.id.slice(0, 8)}</span></p>
          <p>তারিখ: {new Date(order.created_at).toLocaleString()}</p>
        </div>

        <Separator />

        {/* User Info */}
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 text-primary" /> ইউজার তথ্য
          </h2>
          <p>👤 {order.shipping_address.full_name}</p>
          <p>📞 {order.shipping_address.phone}</p>
          <p>📍 {order.shipping_address.address}, {order.shipping_address.city}</p>
        </div>

        <Separator />

        {/* Payment Info */}
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <CreditCard className="h-5 w-5 text-primary" /> পেমেন্ট ডিটেলস
          </h2>
          <p>💳 পেমেন্ট মেথড: {order.payment_method === "cash_on_delivery" ? "ক্যাশ অন ডেলিভারি" : order.payment_method}</p>
          {order.payment_method !== "cash_on_delivery" && (
            <>
              <p>📱 সেন্ডার নাম্বার: {order.shipping_address.sender_number}</p>
              <p>🔑 ট্রানজেকশন আইডি: {order.shipping_address.transaction_id}</p>
            </>
          )}
        </div>

        <Separator />

        {/* Product Info */}
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            🛒 প্রোডাক্ট ডিটেলস
          </h2>
          <div className="space-y-2 mt-2">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product.name} × {item.quantity}</span>
                <span>৳{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Summary */}
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-primary" /> শিপিং ও টোটাল
          </h2>
          <p>🚚 শিপিং খরচ: ৳{order.shipping_cost.toFixed(2)}</p>
          {order.promo_code && order.discount_amount > 0 && (
            <p className="text-green-600 flex items-center gap-1">
              <Tag className="h-4 w-4" /> প্রোমো কোড {order.promo_code}: -৳{order.discount_amount.toFixed(2)}
            </p>
          )}
          <p className="font-bold text-lg mt-2">💰 মোট: ৳{order.total_amount.toFixed(2)}</p>
        </div>
      </Card>
    </div>
  );
}
