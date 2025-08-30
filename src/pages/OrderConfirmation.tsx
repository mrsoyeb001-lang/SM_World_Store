import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Copy, Home, UserCheck, PackageCheck, Clock, CheckCircle, XCircle } from 'lucide-react';

// This component expects either:
// - location.state.orderId (recommended when navigating from checkout), OR
// - query param ?orderId=... (falls back to URL search)

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialOrderId = (location.state as any)?.orderId || query.get('orderId');

  const [orderId, setOrderId] = useState<string | null>(initialOrderId || null);
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // subscribe reference for cleanup
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return setLoading(false);

    let mounted = true;

    const fetchOrder = async () => {
      setLoading(true);

      // Fetch order (assumes orders table has shipping_address json, user_id, status, total_amount, created_at, promo_code)
      const { data: ord, error: ordErr } = await supabase
        .from('orders')
        .select(`*, user:users(id, full_name, email, phone), order_items(*, product:products(id, name, price, sale_price, thumbnail_url))`)
        .eq('id', orderId)
        .single();

      if (ordErr) {
        if (mounted) {
          setError('অর্ডার লোড করতে সমস্যা হয়েছে।');
          setLoading(false);
        }
        return;
      }

      if (mounted) {
        setOrder(ord);
        setItems(ord.order_items || []);
        setLoading(false);
      }
    };

    fetchOrder();

    // real-time subscription to order updates (status change etc.)
    const sub = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setOrder((prev: any) => ({ ...(prev || {}), ...payload.new }));
          }
        }
      )
      .subscribe();

    setSubscription(sub);

    return () => {
      mounted = false;
      if (sub) supabase.removeChannel(sub);
    };
  }, [orderId]);

  // Useful helpers
  const formatCurrency = (n: number) => `৳${n.toFixed(2)}`;
  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return d.toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return iso;
    }
  };

  const statusBadge = (status: string) => {
    const base = 'inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm';
    switch (status) {
      case 'processing':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}><Clock className="h-4 w-4"/> প্রক্রিয়াধীন</span>;
      case 'confirmed':
        return <span className={`${base} bg-green-100 text-green-800`}><CheckCircle className="h-4 w-4"/> নিশ্চিত</span>;
      case 'cancelled':
      case 'failed':
        return <span className={`${base} bg-red-100 text-red-800`}><XCircle className="h-4 w-4"/> বাতিল</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}><PackageCheck className="h-4 w-4"/> {status}</span>;
    }
  };

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-3">কোনো অর্ডার আইডি পাওয়া যায়নি</h2>
          <p className="text-sm text-muted-foreground mb-6">আপনি এই পেজে সরাসরি পৌঁছে গেছেন — যদি সদ্য অর্ডার করে থাকেন, চেকআউট থেকে "OrderConfirmation" রাউটটি স্টেট সহ পাঠানোর অনুরোধ করুন।</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate('/')}>হোমপেজ</Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>ড্যাশবোর্ড</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">অর্ডার কনফার্মেশন <span className="text-lg">🎉</span></h1>
              <p className="text-sm text-muted-foreground mt-1">ধন্যবাদ! আপনার অর্ডার গ্রহণ করা হয়েছে।</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">অর্ডার নম্বর</div>
              <div className="font-mono font-semibold">{order?.id?.slice(0, 12) || '-'}</div>
              <div className="mt-2">{statusBadge(order?.status || 'processing')}</div>
            </div>
          </div>

          <Separator className="my-4" />

          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner /> <span>লোড হচ্ছে...</span>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {/* Top info row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2"><UserCheck className="h-4 w-4"/> ইউজার তথ্য</h3>
                  <div className="text-sm text-muted-foreground">{order?.user?.full_name || order?.shipping_address?.full_name}</div>
                  <div className="text-sm">{order?.user?.email || '-'}</div>
                  <div className="text-sm">{order?.shipping_address?.phone || order?.user?.phone || '-'}</div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2"><Clock className="h-4 w-4"/> অর্ডার সময়</h3>
                  <div className="text-sm">{formatDate(order?.created_at)}</div>
                  <div className="text-sm text-muted-foreground">অবস্থা: {order?.status || 'processing'}</div>
                </div>
              </div>

              <Separator />

              {/* Shipping & Address */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2"><PackageCheck className="h-4 w-4"/> প্রডাক্টস</h3>

                <div className="space-y-3">
                  {items.length === 0 && (
                    <div className="text-sm text-muted-foreground">কোনো অর্ডার আইটেম নেই</div>
                  )}

                  {items.map((it) => {
                    const p = it.product || it.product_id || {};
                    const price = (p.sale_price ?? p.price ?? it.price ?? 0) * (it.quantity || 1);
                    return (
                      <div key={it.id || `${p.id}-${Math.random()}`} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* thumbnail if available */}
                          {p.thumbnail_url ? (
                            <img src={p.thumbnail_url} alt={p.name} className="h-12 w-12 rounded object-cover" />
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-sm">ছবি</div>
                          )}
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-muted-foreground">x {it.quantity}</div>
                          </div>
                        </div>
                        <div className="font-mono">{formatCurrency(Number(price))}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2 p-3 bg-gray-50 rounded border">
                  <div className="flex justify-between text-sm"><span>শিপিং মেথড</span><span>{order?.shipping_method || order?.shipping_address?.method || 'স্ট্যান্ডার্ড'}</span></div>
                  <div className="flex justify-between text-sm mt-1"><span>শিপিং খরচ</span><span>{formatCurrency(Number(order?.shipping_cost ?? 0))}</span></div>
                </div>

                {order?.promo_code && (
                  <div className="mt-2 p-3 bg-green-50 rounded border border-green-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">প্রমো কোড: {order.promo_code}</span>
                      <span className="text-sm text-muted-foreground">ডিসকাউন্ট অ্যাপ্লাই করা হয়েছে</span>
                    </div>
                    <div className="font-mono">-{formatCurrency(Number(order?.discount_amount ?? 0))}</div>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">সাবটোটাল</div>
                  <div className="font-mono">{formatCurrency(Number(order?.sub_total ?? order?.total_amount ?? 0) - Number(order?.shipping_cost ?? 0) + Number(order?.discount_amount ?? 0))}</div>
                </div>

                <div className="mt-1 flex items-center justify-between font-bold text-lg">
                  <div>মোট</div>
                  <div>{formatCurrency(Number(order?.total_amount ?? 0))}</div>
                </div>
              </div>

              <Separator />

              {/* Confirmation Message + Actions */}
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">অভিনন্দন! <span>✅</span></h3>
                  <p className="text-sm text-muted-foreground mt-1">আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে এবং বর্তমানে <strong>{order?.status || 'processing'}</strong> পর্যায়ে আছে। আমরা যত দ্রুত সম্ভব অর্ডারটি প্রক্রিয়াকরণ করব।</p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => { navigator.clipboard.writeText(order?.id || ''); toastCopy(); }} variant="outline">
                    <Copy className="h-4 w-4 mr-2"/> কপি অর্ডার আইডি
                  </Button>
                  <Button onClick={() => navigate('/')}><Home className="h-4 w-4 mr-2"/> হোম</Button>
                  <Button variant="ghost" onClick={() => navigate('/dashboard')}>ড্যাশবোর্ড</Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  // small toast fallback since this file doesn't import a toast hook - simple visual feedback
  function toastCopy() {
    try {
      // this is a minimal feedback; you can wire your app's toast
      // @ts-ignore
      if (window?.dispatchEvent) {
        const e = new CustomEvent('app-toast', { detail: { title: 'কপি হয়েছে', message: 'অর্ডার আইডি ক্লিপবোর্ডে কপি করা হয়েছে।' } });
        window.dispatchEvent(e);
      }
    } catch (e) {
      /* noop */
    }
  }
}
