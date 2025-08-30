import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FileText, Printer, Share2 } from "lucide-react";

// Currency Formatter
const CurrencyBangla = (n: number) => `৳${n.toFixed(2)}`;

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image?: string | null;
};

type OrderData = {
  id: string;
  user_id: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  payment_method: string;
  promo_code?: string | null;
  notes?: string | null;
  status: string;
  created_at: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    sender_number?: string | null;
    transaction_id?: string | null;
  };
  items: OrderItem[];
  shipping_area?: {
    id: string;
    area_name: string;
    rate: number;
    estimated_days?: number;
  } | null;
};

export default function OrderConfirmation() {
  const { state } = useLocation() as any;
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderId = state?.orderId || null;

  useEffect(() => {
    if (!orderId) return;
    fetchOrder(orderId);
  }, [orderId]);

  // Order Fetcher
  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Main Query (with relationship)
      const { data: orderData, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items:order_items(
            *,
            products:products(id,name,images,sale_price,price)
          ),
          shipping_area:shipping_rates!orders_shipping_rate_id_fkey(*)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!orderData) throw new Error("Order not found");

      // Shape Items
      const items: OrderItem[] = (orderData.order_items || []).map((oi: any) => ({
        id: oi.id,
        product_id: oi.product_id,
        product_name: oi.products?.name || oi.product_name || "প্রোডাক্ট",
        quantity: oi.quantity,
        price: oi.price,
        image: oi.products?.images?.[0] || null,
      }));

      // Shipping Fallback (if relation fails)
      let shipping_area = orderData.shipping_area || null;
      if (!shipping_area && orderData.shipping_rate_id) {
        const { data: shippingRate } = await supabase
          .from("shipping_rates")
          .select("*")
          .eq("id", orderData.shipping_rate_id)
          .single();
        shipping_area = shippingRate;
      }

      const shaped: OrderData = {
        id: orderData.id,
        user_id: orderData.user_id,
        total_amount: orderData.total_amount,
        shipping_cost: orderData.shipping_cost,
        discount_amount: orderData.discount_amount || 0,
        payment_method: orderData.payment_method,
        promo_code: orderData.promo_code,
        notes: orderData.notes,
        status: orderData.status,
        created_at: orderData.created_at,
        shipping_address: orderData.shipping_address,
        items,
        shipping_area,
      };

      setOrder(shaped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "অর্ডার ফেচ করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const handleShare = async () => {
    if (!order) return;
    const shareData = {
      title: `অর্ডার #${order.id.slice(0, 8)} - SM World BD`,
      text: `আমি অর্ডার করেছি — মোট: ৳${order.total_amount.toFixed(2)}. অর্ডার আইডি: ${order.id}`,
    } as any;

    try {
      if ((navigator as any).share) {
        await (navigator as any).share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title} \n${shareData.text}`
        );
        alert(
          "অর্ডারের সারাংশ কপি করা হয়েছে। এখন আপনি পেস্ট করে শেয়ার করতে পারবেন।"
        );
      }
    } catch {
      alert("শেয়ার করতে সমস্যা হয়েছে");
    }
  };

  // No Order ID
  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="p-6 text-center">
          <h2 className="text-lg font-semibold">⚠️ কোনো অর্ডার আইডি পাওয়া যায়নি</h2>
          <p className="text-sm text-muted-foreground mt-2">
            আপনি যদি অর্ডার পেজে এসে থাকেন, তাহলে রিডাইরেক্টের সময় অর্ডার আইডি পাঠানো হয়নি।
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            <Button onClick={() => navigate("/")}>🏠 হোম</Button>
            <Button variant="outline" onClick={() => navigate("/orders")}>
              📦 আমার অর্ডারস
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">অর্ডার কনফার্মেশন</h1>
            <p className="text-sm text-muted-foreground mt-1">
              অর্ডার আইডি:{" "}
              <span className="font-mono">{orderId?.slice(0, 12)}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} size="sm">
              <Printer className="mr-2" /> প্রিন্ট
            </Button>
            <Button variant="ghost" onClick={handleShare} size="sm">
              <Share2 className="mr-2" /> শেয়ার
            </Button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <Card className="p-6 mb-4">
            <p>⏳ অর্ডার লোড হচ্ছে...</p>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card className="p-6 mb-4 border border-red-300 bg-red-100">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">⚠️ সমস্যা হয়েছে</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Success */}
        {order && (
          <>
            {/* Order Info */}
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">
                    🎉 ধন্যবাদ, {order.shipping_address.full_name}!
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।
                  </p>
                </div>

                <div className="text-right">
                  <Badge
                    variant={
                      order.status === "pending" ? "outline" : "secondary"
                    }
                  >
                    {order.status.toUpperCase()}
                  </Badge>
                  <p className="mt-2 text-sm text-muted-foreground">
                    অর্ডার তারিখ:{" "}
                    {new Date(order.created_at).toLocaleString("bn-BD")}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">📍 ডেলিভারি ঠিকানা</h3>
                  <p className="text-sm">{order.shipping_address.full_name}</p>
                  <p className="text-sm">{order.shipping_address.phone}</p>
                  <p className="text-sm">
                    {order.shipping_address.address},{" "}
                    {order.shipping_address.city}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">💳 পেমেন্ট</h3>
                  <p className="text-sm">
                    পদ্ধতি:{" "}
                    <strong className="capitalize">
                      {order.payment_method.replace(/_/g, " ")}
                    </strong>
                  </p>
                  {order.shipping_address.sender_number && (
                    <p className="text-sm">
                      সেন্ডার নম্বর: {order.shipping_address.sender_number}
                    </p>
                  )}
                  {order.shipping_address.transaction_id && (
                    <p className="text-sm">
                      ট্রানজেকশন আইডি: {order.shipping_address.transaction_id}
                    </p>
                  )}
                </div>
              </div>

              {order.notes && (
                <div className="mt-4">
                  <h4 className="font-medium">📝 নোট</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.notes}
                  </p>
                </div>
              )}
            </Card>

            {/* Items List */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  🛒 অর্ডার আইটেমস ({order.items.length})
                </h3>
                <div className="text-sm text-muted-foreground">
                  মোট: {CurrencyBangla(order.total_amount)}
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-4 p-3 rounded border"
                  >
                    <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.product_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                          📦
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{it.product_name}</div>
                          <div className="text-sm text-muted-foreground">
                            পরিমাণ: {it.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {CurrencyBangla(it.price * it.quantity)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {CurrencyBangla(it.price)} প্রতি
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span>
                    {CurrencyBangla(
                      order.total_amount - order.shipping_cost + order.discount_amount
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>শিপিং</span>
                  <span>{CurrencyBangla(order.shipping_cost)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      ছাড় {order.promo_code ? `(${order.promo_code})` : ""}
                    </span>
                    <span>-{CurrencyBangla(order.discount_amount)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>মোট পরিশোধ</span>
                  <span>{CurrencyBangla(order.total_amount)}</span>
                </div>
              </div>
            </Card>

            {/* Shipping & Receipt */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h4 className="font-medium mb-2">🚚 শিপিং ডিটেইলস</h4>
                {order.shipping_area ? (
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {order.shipping_area.area_name}
                        </div>
                        {order.shipping_area.estimated_days && (
                          <div className="text-sm text-muted-foreground">
                            আনুমানিক: {order.shipping_area.estimated_days} দিন
                          </div>
                        )}
                      </div>
                      <div className="font-semibold">
                        {CurrencyBangla(order.shipping_area.rate)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    শিপিং এলাকা তথ্য উপলব্ধ নেই
                  </p>
                )}

                <Separator className="my-4" />

                <div className="flex gap-2">
                  <Button onClick={() => navigate("/orders")}>
                    📦 আমার অর্ডারস দেখুন
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    🛍️ ব্রাউজ চালিয়ে যান
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-medium mb-2">📑 ডিজিটাল রসিদ</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  আপনি চাইলে অ্যাডমিনকে রসিদ ইমেইল করতে পারেন অথবা ডাউনলোড করতে পারেন।
                </p>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() =>
                      alert("ইমেইল সিস্টেম যুক্ত হলে এখানে API কল দিন")
                    }
                  >
                    <FileText className="mr-2" /> ইমেইল করা (অ্যাডমিন)
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => alert("পিডিএফ ডাউনলোড ফিচার যুক্ত করুন")}
                  >
                    ডাউনলোড রসিদ
                  </Button>
                </div>
              </Card>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              <p>
                ℹ️ যদি কোনো ভুল বা পরিবর্তন প্রয়োজন হয়, অনুগ্রহ করে কাস্টমার
                সার্ভিসে যোগাযোগ করুন।
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
