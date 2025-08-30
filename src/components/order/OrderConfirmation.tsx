import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Copy, Printer, Download, ArrowLeft } from 'lucide-react';

type OrderItem = {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

type ShippingAddress = {
  full_name: string;
  phone: string;
  address: string;
  city: string;
};

type OrderState = {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  finalTotal: number;
  promoCode?: string | null;
  paymentMethod?: string;
  shippingArea?: string;
  shippingEstimateDays?: number | null;
  shippingAddress?: ShippingAddress;
  notes?: string;
};

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as Partial<OrderState>;

  // fallback/mock when user directly lands on page without state
  const order = useMemo<OrderState>(() => ({
    orderId: state.orderId || `ORD-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    items: state.items || [],
    subtotal: typeof state.subtotal === 'number' ? state.subtotal : (state.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0),
    shippingCost: typeof state.shippingCost === 'number' ? state.shippingCost : (state.shippingCost || 0),
    discount: typeof state.discount === 'number' ? state.discount : (state.discount || 0),
    finalTotal: typeof state.finalTotal === 'number' ? state.finalTotal : (state.finalTotal || 0),
    promoCode: state.promoCode || null,
    paymentMethod: state.paymentMethod || 'cash_on_delivery',
    shippingArea: state.shippingArea || undefined,
    shippingEstimateDays: state.shippingEstimateDays || null,
    shippingAddress: state.shippingAddress || { full_name: '', phone: '', address: '', city: '' },
    notes: state.notes || '',
  }), [state]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('কপি হয়েছে।');
    } catch (e) {
      alert('কপি করা যায়নি — দয়া করে ম্যানুয়ালি কপি করুন।');
    }
  };

  const handlePrint = () => {
    const html = renderPrintableInvoice(order);
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      // Give the new window a moment to render then call print
      setTimeout(() => w.print(), 300);
    } else {
      alert('প্রিন্ট উইন্ডো খোলা যায়নি। পপ-আপ ব্লকার চেক করুন।');
    }
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${order.orderId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">অর্ডার কনফার্মেশন</h1>
            <p className="text-sm text-muted-foreground">ধন্যবাদ — আপনার অর্ডার সফলভাবে নেওয়া হয়েছে।</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2" /> ফিরে যান
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleCopy(order.orderId)}>
              <Copy className="mr-2" /> কপি অর্ডার আইডি
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Printer className="mr-2" /> প্রিন্ট ইনভয়েস
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownloadJSON}>
              <Download className="mr-2" /> ডাউনলোড
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
            <div>
              <h3 className="font-medium">অর্ডার নম্বর</h3>
              <p className="font-mono mt-1">{order.orderId}</p>
              <div className="mt-2">
                <Badge variant="outline">স্ট্যাটাস: pending</Badge>
              </div>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-sm text-muted-foreground">মোট পণ্য</span>
              <span className="font-semibold text-lg">{order.items.length}</span>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">পণ্য বিবরণ</h3>
            <div className="space-y-3">
              {order.items.length === 0 && (
                <p className="text-sm text-muted-foreground">পণ্য তালিকা খালি — সম্ভবত সরাসরি পেজে এসেছেন।</p>
              )}

              {order.items.map((it) => (
                <div key={it.product_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={it.image || '/placeholder.png'} alt={it.name} className="w-14 h-14 object-cover rounded" />
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-muted-foreground">পরিমাণ: {it.quantity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">৳{(it.price * it.quantity).toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">৳{it.price.toFixed(2)} / একক</div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>সাবটোটাল</span>
                <span>৳{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>শিপিং</span>
                <span>৳{order.shippingCost.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>ছাড় {order.promoCode ? `(${order.promoCode})` : ''}</span>
                  <span>-৳{order.discount.toFixed(2)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>মোট</span>
                <span>৳{order.finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">শিপিং ও পেমেন্ট</h3>

            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium">প্রাপক</div>
                <div className="text-muted-foreground">{order.shippingAddress?.full_name}</div>
                <div className="text-muted-foreground">{order.shippingAddress?.phone}</div>
              </div>

              <div>
                <div className="font-medium">ঠিকানা</div>
                <div className="text-muted-foreground">{order.shippingAddress?.address}, {order.shippingAddress?.city}</div>
              </div>

              <div>
                <div className="font-medium">শিপিং এলাকা</div>
                <div className="text-muted-foreground">{order.shippingArea || 'নির্ধারিত নেই'}</div>
                {order.shippingEstimateDays !== null && (
                  <div className="text-sm">আনুমানিক ডেলিভারি: {order.shippingEstimateDays} দিন</div>
                )}
              </div>

              <div>
                <div className="font-medium">পেমেন্ট মেথড</div>
                <div className="text-muted-foreground">{(order.paymentMethod || 'cash_on_delivery').replace('_', ' ').toUpperCase()}</div>
              </div>

              {order.notes && (
                <div>
                  <div className="font-medium">নোট</div>
                  <div className="text-muted-foreground">{order.notes}</div>
                </div>
              )}

              <Separator />

              <div className="flex gap-2">
                <Button onClick={() => navigate('/orders')}>আমার অর্ডার দেখুন</Button>
                <Button variant="ghost" onClick={() => navigate('/')}>হোমে ফিরুন</Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">বিজ্ঞপ্তি</h3>
          <p className="text-sm text-muted-foreground">
            আপনার অর্ডারটি এখন পেন্ডিং স্ট্যাটাসে আছে। রিকুইয়ার্ড ভেরিফিকেশন অথবা পেমেন্ট চেক করার পরে আমরা স্ট্যাটাস আপডেট করব এবং কনফার্মেশন মেসেজ পাঠাব।
          </p>
        </Card>
      </div>
    </div>
  );
}

// Helper to render a printable HTML invoice
function renderPrintableInvoice(order: OrderState) {
  const itemsHtml = order.items.map(it => `
    <tr>
      <td style="padding:8px;border:1px solid #e5e7eb">${it.name} x ${it.quantity}</td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">৳${(it.price * it.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice - ${order.orderId}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:24px; }
      .container { max-width:800px; margin:0 auto }
      table { width:100%; border-collapse:collapse }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>ইনভয়েস — ${order.orderId}</h2>
      <div>মোট: ৳${order.finalTotal.toFixed(2)}</div>
      <div style="margin-top:12px">
        <table>
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:left">পণ্য</th>
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:right">মূল্য</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>
      <div style="margin-top:18px">শিপিং ঠিকানা: ${order.shippingAddress?.full_name || ''} — ${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}</div>
    </div>
  </body>
  </html>
  `;
}
