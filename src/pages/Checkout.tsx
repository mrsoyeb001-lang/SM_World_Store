import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface ShippingRate {
  id: string;
  area_name: string;
  rate: number;
}

interface PromoCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  used_count: number | null;
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [shippingCost, setShippingCost] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null);
  const [discount, setDiscount] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cash_on_delivery',
    notes: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    fetchShippingRates();
  }, [user, items, navigate]);

  const fetchShippingRates = async () => {
    const { data } = await supabase
      .from('shipping_rates')
      .select('*')
      .eq('is_active', true);
    
    if (data) {
      setShippingRates(data);
    }
  };

  const handleShippingChange = (value: string) => {
    setSelectedShipping(value);
    const rate = shippingRates.find(r => r.id === value);
    setShippingCost(rate ? Number(rate.rate) : 0);
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    const { data: promo } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promoCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (!promo) {
      toast({
        title: "ভুল প্রমো কোড",
        description: "এই প্রমো কোডটি বৈধ নয়।",
        variant: "destructive"
      });
      return;
    }

    if (promo.min_order_amount > total) {
      toast({
        title: "অপর্যাপ্ত অর্ডার পরিমাণ",
        description: `এই প্রমো কোড ব্যবহারের জন্য কমপক্ষে ৳${promo.min_order_amount} অর্ডার করতে হবে।`,
        variant: "destructive"
      });
      return;
    }

    setAppliedPromoCode(promo);
    
    const discountAmount = promo.discount_type === 'percentage' 
      ? (total * promo.discount_value) / 100
      : promo.discount_value;
    
    setDiscount(discountAmount);
    
    toast({
      title: "প্রমো কোড প্রয়োগ হয়েছে",
      description: `৳${discountAmount} ছাড় পেয়েছেন!`
    });
  };

  const removePromoCode = () => {
    setAppliedPromoCode(null);
    setDiscount(0);
    setPromoCode('');
  };

  const finalTotal = total + shippingCost - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          total_amount: finalTotal,
          shipping_cost: shippingCost,
          discount_amount: discount,
          shipping_address: {
            full_name: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city
          },
          payment_method: formData.paymentMethod,
          notes: formData.notes,
          promo_code: appliedPromoCode?.code || null,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.sale_price || item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update promo code usage
      if (appliedPromoCode) {
        await supabase
          .from('promo_codes')
          .update({ used_count: (appliedPromoCode.used_count || 0) + 1 })
          .eq('id', appliedPromoCode.id);
      }

      // Clear cart
      await clearCart();

      toast({
        title: "অর্ডার সফল!",
        description: "আপনার অর্ডারটি সফলভাবে প্লেস হয়েছে।"
      });

      navigate('/dashboard');

    } catch (error: any) {
      toast({
        title: "অর্ডার ব্যর্থ",
        description: error.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">চেকআউট</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">শিপিং তথ্য</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">পূর্ণ নাম *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">ফোন নম্বর *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">ঠিকানা *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">শহর *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="shipping">শিপিং এলাকা *</Label>
                <Select value={selectedShipping} onValueChange={handleShippingChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="শিপিং এলাকা নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingRates.map((rate) => (
                      <SelectItem key={rate.id} value={rate.id}>
                        {rate.area_name} - ৳{rate.rate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentMethod">পেমেন্ট মেথড</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash_on_delivery">ক্যাশ অন ডেলিভারি</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">অতিরিক্ত নোট</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="বিশেষ নির্দেশনা..."
                />
              </div>
            </form>
          </Card>

          {/* Order Summary */}
          <Card className="p-6 h-fit">
            <h2 className="text-xl font-semibold mb-6">অর্ডার সামারি</h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>৳{((item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between">
                <span>সাবটোটাল</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>শিপিং</span>
                <span>৳{shippingCost.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ছাড় ({appliedPromoCode?.code})</span>
                  <span>-৳{discount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>মোট</span>
                <span>৳{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="mt-6 space-y-3">
              <Label>প্রমো কোড</Label>
              {appliedPromoCode ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded">
                  <span className="text-green-700">{appliedPromoCode.code} প্রয়োগ হয়েছে</span>
                  <Button variant="ghost" size="sm" onClick={removePromoCode}>
                    মুছুন
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="প্রমো কোড লিখুন"
                  />
                  <Button type="button" variant="outline" onClick={applyPromoCode}>
                    প্রয়োগ
                  </Button>
                </div>
              )}
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={loading || !selectedShipping}
              className="w-full mt-6"
              size="lg"
            >
              {loading ? "অর্ডার করা হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}