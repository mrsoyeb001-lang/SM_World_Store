"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { XCircle, Loader2 } from "lucide-react";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchOrder(id as string);
  }, [id]);

  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);

      // =====================
      // 🚀 Step 1: order fetch
      // =====================
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items:order_items(
            *,
            products:products(id, name, images, sale_price, price)
          )
        `)
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;

      let shippingRate = null;

      // =====================
      // 🚀 Step 2: shipping fetch
      // =====================
      if (orderData?.shipping_rate_id) {
        const { data, error: shippingError } = await supabase
          .from("shipping_rates")
          .select("*")
          .eq("id", orderData.shipping_rate_id)
          .single();

        if (!shippingError) {
          shippingRate = data;
        }
      }

      // merge shipping into order
      setOrder({
        ...orderData,
        shipping_area: shippingRate,
      });
    } catch (err: any) {
      console.error("Order fetch error:", err);
      setError(err.message || "কোনো সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">লোড হচ্ছে...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 mx-auto mt-10 max-w-lg border border-red-300 bg-red-100">
        <div className="flex items-center gap-3">
          <XCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">⚠️ সমস্যা হয়েছে</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">অর্ডার কনফার্মেশন</h1>

      <Card className="p-6 mb-6">
        <p className="mb-2 font-semibold">অর্ডার আইডি: {order.id}</p>
        <p className="mb-2">মোট মূল্য: ৳{order.total_amount}</p>
        {order.shipping_area && (
          <p className="mb-2">
            🚚 ডেলিভারি এরিয়া: {order.shipping_area.area_name} (
            ৳{order.shipping_area.rate})
          </p>
        )}
      </Card>

      <h2 className="text-xl font-semibold mb-4">পণ্যের তালিকা</h2>
      <div className="space-y-4">
        {order.order_items?.map((item: any) => (
          <Card key={item.id} className="p-4 flex items-center gap-4">
            <img
              src={item.products?.images?.[0] || "/placeholder.png"}
              alt={item.products?.name}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.products?.name}</h3>
              <p>পরিমাণ: {item.quantity}</p>
              <p>মূল্য: ৳{item.products?.sale_price || item.products?.price}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
