import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  CircleCheckBig,
  Copy,
  CreditCard,
  Download,
  FileText,
  Info,
  MapPin,
  MessageCircle,
  PackageCheck,
  Printer,
  RefreshCcw,
  Share2,
  ShoppingCart,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * Advanced Order Confirmation / Configuration Page
 * ------------------------------------------------
 * - Reads orderId from router `state.orderId` OR `/orders/:orderId` param
 * - Fetches: order, order_items, product details, site/payment settings
 * - Shows: products, qty, unit, subtotal, shipping, discount, tax, grand total
 * - Shows: shipping area, ETA, payment method + reference, promo code
 * - Tools: print, copy, download (HTML->print to PDF), share, reorder
 * - Inline support contact + order activity timeline
 * - Fully responsive, clean modern UI (shadcn + Tailwind + framer-motion)
 */

// Types (align with your DB as used in Checkout page)
interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  image?: string | null;
  sku?: string | null;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number; // unit price captured at order time
  product?: Product | null;
}

interface ShippingAddress {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  sender_number?: string;
  transaction_id?: string;
}

interface OrderRow {
  id: string;
  user_id: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  payment_method: string; // "cash_on_delivery" | "bkash" | "rocket" | "nagad" | ...
  promo_code?: string | null;
  status: string; // pending, confirmed, processing, shipped, delivered, cancelled
  shipping_address: ShippingAddress;
  created_at: string;
  shipping_rate?: {
    area_name?: string;
    estimated_days?: number;
  } | null;
}

interface SiteSettings {
  brand?: { name?: string; logo?: string };
  tax?: { enabled?: boolean; rate?: number };
  support?: { phone?: string; email?: string; facebook?: string; whatsapp?: string };
  payment_methods?: {
    bkash?: { number?: string };
    rocket?: { number?: string };
    nagad?: { number?: string };
  };
}

function currency(n: number) {
  return `৳${(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-indigo-100 text-indigo-800";
    case "shipped":
      return "bg-cyan-100 text-cyan-800";
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function OrderConfirmation() {
  const { user } = useAuth();
  const { state } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const orderIdFromState: string | undefined = state?.orderId;
  const orderIdFromPath: string | undefined = params.orderId as string | undefined;
  const orderId = orderIdFromState || orderIdFromPath;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!orderId) {
      navigate("/orders");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        // Settings
        const { data: settingsRow } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "site_settings")
          .maybeSingle();
        if (settingsRow?.value) setSettings(settingsRow.value as SiteSettings);

        // Order
        const { data: orderRow, error: orderErr } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();
        if (orderErr) throw orderErr;
        setOrder(orderRow as unknown as OrderRow);

        // Items with product
        const { data: orderItems, error: itemErr } = await supabase
          .from("order_items")
          .select("*, product:products(*)")
          .eq("order_id", orderId);
        if (itemErr) throw itemErr;
        setItems((orderItems || []) as unknown as OrderItem[]);
      } catch (e: any) {
        toast({ title: "অর্ডার লোড করা যায়নি", description: e?.message ?? "Problem fetching order.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [user, orderId, navigate, toast]);

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);
  const taxRate = settings?.tax?.enabled ? (settings?.tax?.rate ?? 0) : 0; // e.g. 5 means 5%
  const taxAmount = useMemo(() => (subtotal * taxRate) / 100, [subtotal, taxRate]);
  const shipping = order?.shipping_cost ?? 0;
  const discount = order?.discount_amount ?? 0;
  const grand = useMemo(() => Math.max(0, subtotal + taxAmount + shipping - discount), [subtotal, taxAmount, shipping, discount]);

  const copyOrderId = async () => {
    if (!order?.id) return;
    await navigator.clipboard.writeText(order.id);
    toast({ title: "অর্ডার আইডি কপি হয়েছে", description: `#${order.id.slice(0, 8)}` });
  };

  const printInvoice = () => {
    window.print();
  };

  const shareOrder = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: settings?.brand?.name || "Order",
          text: `আমার অর্ডার #${order?.id?.slice(0, 8)}`,
          url: window.location.href,
        });
      } else {
        await copyOrderId();
      }
    } catch (e) {
      // ignore
    }
  };

  const updateNote = async () => {
    if (!order) return;
    const next = note.trim();
    try {
      const { error } = await supabase
        .from("orders")
        .update({ notes: next })
        .eq("id", order.id);
      if (error) throw error;
      toast({ title: "নোট আপডেট হয়েছে" });
    } catch (e: any) {
      toast({ title: "আপডেট ব্যর্থ", description: e?.message, variant: "destructive" });
    }
  };

  // Visual order timeline based on status
  const steps = [
    { key: "pending", label: "প্লেসড", icon: ShoppingCart },
    { key: "confirmed", label: "কনফার্মড", icon: CircleCheckBig },
    { key: "processing", label: "প্রসেসিং", icon: RefreshCcw },
    { key: "shipped", label: "শিপড", icon: Truck },
    { key: "delivered", label: "ডেলিভারড", icon: PackageCheck },
  ];

  const currentIndex = steps.findIndex((s) => s.key === order?.status);

  return (
    <div className="container mx-auto px-4 py-8 print:px-0">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="max-w-6xl mx-auto space-y-6" ref={printRef}>
          {/* Header / Success Banner */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 p-6 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8" />
                  <div>
                    <h1 className="text-2xl font-bold">অর্ডার কনফার্ম হয়েছে!</h1>
                    <p className="text-emerald-100 text-sm">{settings?.brand?.name || "SM World BD"} আপনাকে ধন্যবাদ 🫶</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`rounded-full ${statusColor(order?.status || "pending")}`}>{order?.status || "pending"}</Badge>
                  {order?.promo_code ? (
                    <Badge variant="secondary" className="rounded-full">Promo: {order.promo_code}</Badge>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 text-sm/6 opacity-90">
                অর্ডার আইডি: <span className="font-mono">#{order?.id?.slice(0, 8) || "—"}</span> • {new Date(order?.created_at || Date.now()).toLocaleString()}
              </div>
            </div>

            <CardContent className="p-6">
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={copyOrderId} className="rounded-2xl"><Copy className="mr-2 h-4 w-4"/>কপি আইডি</Button>
                <Button variant="outline" size="sm" onClick={printInvoice} className="rounded-2xl"><Printer className="mr-2 h-4 w-4"/>প্রিন্ট/পিডিএফ</Button>
                <Button variant="outline" size="sm" onClick={shareOrder} className="rounded-2xl"><Share2 className="mr-2 h-4 w-4"/>শেয়ার</Button>
                <Button variant="secondary" size="sm" className="rounded-2xl" onClick={() => navigate("/shop")}><RefreshCcw className="mr-2 h-4 w-4"/>আরেকটা কেনাকাটা</Button>
              </div>
            </CardContent>
          </Card>

          {/* Status timeline */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-lg">অর্ডার অগ্রগতি</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {steps.map((s, i) => {
                  const Icon = s.icon as any;
                  const done = currentIndex === -1 ? i === 0 : i <= currentIndex;
                  return (
                    <div key={s.key} className="flex flex-col items-center text-center">
                      <div className={`size-10 rounded-full flex items-center justify-center border-2 ${done ? "border-emerald-500" : "border-muted"}`}>
                        <Icon className={`h-5 w-5 ${done ? "text-emerald-600" : "text-muted-foreground"}`} />
                      </div>
                      <div className={`mt-2 text-xs ${done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Items & totals */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg">অর্ডার আইটেমসমূহ</CardTitle></CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="animate-pulse text-sm text-muted-foreground">লোড হচ্ছে...</div>
                  ) : items.length === 0 ? (
                    <div className="text-sm text-muted-foreground">কোন পণ্য পাওয়া যায়নি।</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-muted-foreground">
                            <th className="py-2">পণ্য</th>
                            <th className="py-2">SKU</th>
                            <th className="py-2">দাম</th>
                            <th className="py-2">পরিমাণ</th>
                            <th className="py-2 text-right">টোটাল</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((it) => (
                            <tr key={it.id} className="border-t">
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <div className="size-12 rounded-xl bg-muted overflow-hidden">
                                    {it.product?.image ? (
                                      <img src={it.product.image} alt={it.product?.name || "Product"} className="size-full object-cover" />
                                    ) : (
                                      <div className="size-full flex items-center justify-center text-xs text-muted-foreground">IMG</div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium line-clamp-1">{it.product?.name || "Product"}</div>
                                    <div className="text-xs text-muted-foreground">#{it.product_id.slice(0, 6)}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-muted-foreground">{it.product?.sku || "—"}</td>
                              <td className="py-3">{currency(it.price)}</td>
                              <td className="py-3">{it.quantity}</td>
                              <td className="py-3 text-right font-medium">{currency(it.price * it.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg">টোটাল সারাংশ</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm"><span>সাবটোটাল</span><span>{currency(subtotal)}</span></div>
                  {settings?.tax?.enabled ? (
                    <div className="flex justify-between text-sm"><span>ট্যাক্স ({taxRate}%)</span><span>{currency(taxAmount)}</span></div>
                  ) : null}
                  <div className="flex justify-between text-sm"><span>শিপিং</span><span>{currency(shipping)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600"><span>ছাড়{order?.promo_code ? ` (${order.promo_code})` : ""}</span><span>-{currency(discount)}</span></div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold"><span>মোট</span><span>{currency(grand)}</span></div>
                  <p className="text-xs text-muted-foreground">মোট টাকার মধ্যে সকল প্রযোজ্য চার্জ অন্তর্ভুক্ত।</p>
                </CardContent>
              </Card>
            </div>

            {/* Right: addresses, payment, shipping, support */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg">কাস্টমার ও শিপিং</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <div>
                      <div className="font-medium">{order?.shipping_address?.full_name}</div>
                      <div className="text-muted-foreground">{order?.shipping_address?.phone}</div>
                      <div className="text-muted-foreground">{order?.shipping_address?.address}</div>
                      <div className="text-muted-foreground">{order?.shipping_address?.city}</div>
                    </div>
                  </div>
                  {order?.shipping_rate?.area_name ? (
                    <div className="text-muted-foreground">এলাকা: {order.shipping_rate.area_name} {order.shipping_rate.estimated_days ? `• আনুমানিক ${order.shipping_rate.estimated_days} দিন` : ""}</div>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg">পেমেন্ট তথ্য</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2"><CreditCard className="h-4 w-4"/><span className="capitalize">{(order?.payment_method || "cash_on_delivery").replaceAll("_", " ")}</span></div>
                  {order?.payment_method !== "cash_on_delivery" ? (
                    <div className="space-y-1">
                      <div className="flex justify-between"><span className="text-muted-foreground">সেন্ডার নম্বর</span><span className="font-medium">{order?.shipping_address?.sender_number || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">ট্রানজেকশন আইডি</span><span className="font-medium">{order?.shipping_address?.transaction_id || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">পেমেন্ট নম্বর</span><span className="font-medium">{order?.payment_method === "bkash" ? (settings?.payment_methods?.bkash?.number || "01624712851") : order?.payment_method === "rocket" ? (settings?.payment_methods?.rocket?.number || "01624712851") : (settings?.payment_methods?.nagad?.number || "01624712851")}</span></div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground"><Wallet className="h-4 w-4"/>পণ্য হাতে পেয়ে টাকা দিন (COD)</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg">সাপোর্ট</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Info className="h-4 w-4"/>যদি কোন ভুল থাকে, সাথে সাথে আমাদের জানান।</div>
                  <div className="grid grid-cols-2 gap-2">
                    {settings?.support?.phone && (
                      <Button asChild variant="outline" className="rounded-2xl"><a href={`tel:${settings.support.phone}`}><PhoneIcon/> কল</a></Button>
                    )}
                    {settings?.support?.whatsapp && (
                      <Button asChild variant="outline" className="rounded-2xl"><a href={`https://wa.me/${settings.support.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4"/>WhatsApp</a></Button>
                    )}
                    {settings?.support?.facebook && (
                      <Button asChild variant="outline" className="rounded-2xl col-span-2"><a href={settings.support.facebook} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4"/>Facebook Message</a></Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg">অতিরিক্ত নোট</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="order-note">আপনার বার্তা</Label>
                    <Textarea id="order-note" placeholder="বিশেষ নির্দেশনা বা মন্তব্য..." value={note} onChange={(e) => setNote(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={updateNote} className="rounded-2xl"><FileText className="mr-2 h-4 w-4"/>নোট সংরক্ষণ</Button>
                    <Button size="sm" variant="outline" onClick={() => setNote("")} className="rounded-2xl"><XCircle className="mr-2 h-4 w-4"/>ক্লিয়ার</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Invoice footer for print */}
          <Card className="print:mt-6">
            <CardContent className="py-6 text-xs text-muted-foreground">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div>© {new Date().getFullYear()} {settings?.brand?.name || "SM World BD"}. সর্বস্বত্ব সংরক্ষিত।</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1"><Truck className="h-3.5 w-3.5"/>ফাস্ট ডেলিভারি</div>
                  <div className="flex items-center gap-1"><PackageCheck className="h-3.5 w-3.5"/>অরিজিনাল প্রোডাক্ট</div>
                  <div className="flex items-center gap-1"><ShieldIcon/>সিকিউর পেমেন্ট</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Print styles */}
      <style>{`
        @media print {
          .print:hidden { display: none !important; }
          .print:px-0 { padding-left: 0 !important; padding-right: 0 !important; }
          button, a { display: none !important; }
          .container { max-width: 100% !important; }
          img { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}

// Small icon wrappers (lucide doesn't export all named here)
function PhoneIcon() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.81.3 1.6.54 2.36a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.72-1.06a2 2 0 0 1 2.11-.45c.76.24 1.55.42 2.36.54A2 2 0 0 1 22 16.92z"/></svg>; }
function ShieldIcon() { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
