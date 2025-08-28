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
import { MapPin, CreditCard, Truck, AlertCircle, CheckCircle } from 'lucide-react';

interface ShippingRate {
  id: string;
  area_name: string;
  rate: number;
  estimated_days?: number;
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
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cash_on_delivery',
    notes: '',
    senderNumber: '',
    transactionId: ''
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
    fetchPaymentSettings();
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

  const fetchPaymentSettings = async () => {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'site_settings')
      .maybeSingle();
    
    if (data?.value) {
      setPaymentSettings(data.value);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'পূর্ণ নাম প্রয়োজন';
    if (!formData.phone.trim()) errors.phone = 'ফোন নম্বর প্রয়োজন';
    if (!formData.address.trim()) errors.address = 'ঠিকানা প্রয়োজন';
    if (!formData.city.trim()) errors.city = 'শহর প্রয়োজন';
    if (!selectedShipping) errors.shipping = 'শিপিং এলাকা নির্বাচন করুন';
    
    if (formData.paymentMethod !== 'cash_on_delivery') {
      if (!formData.senderNumber.trim()) errors.senderNumber = 'সেন্ডার নম্বর প্রয়োজন';
      if (!formData.transactionId.trim()) errors.transactionId = 'ট্রানজেকশন আইডি প্রয়োজন';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingChange = (value: string) => {
    setSelectedShipping(value);
    const rate = shippingRates.find(r => r.id === value);
    setShippingCost(rate ? Number(rate.rate) : 0);
    // Clear shipping error when a selection is made
    if (formErrors.shipping) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.shipping;
        return newErrors;
      });
    }
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
    
    if (!validateForm()) {
      toast({
        title: "অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন",
        variant: "destructive"
      });
      return;
    }
    
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
            city: formData.city,
            sender_number: formData.senderNumber,
            transaction_id: formData.transactionId
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

      // Enhanced order confirmation
      toast({
        title: "অর্ডার সফল! 🎉",
        description: `অর্ডার #${order.id.slice(0, 8)} সফলভাবে প্লেস হয়েছে। মোট: ৳${finalTotal.toLocaleString()}। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।`,
        duration: 6000,
      });

      navigate('/order-confirmation', { 
        state: { 
          orderId: order.id,
          total: finalTotal,
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city
          }
        } 
      });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="flex items-center gap-1 mb-2">
                  পূর্ণ নাম <span className="text-red-500">*</span>
                  {formErrors.fullName && <AlertCircle className="h-4 w-4 text-red-500 ml-1" />}
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={formErrors.fullName ? "border-red-500" : ""}
                  required
                />
                {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-1 mb-2">
                  ফোন নম্বর <span className="text-red-500">*</span>
                  {formErrors.phone && <AlertCircle className="h-4 w-4 text-red-500 ml-1" />}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={formErrors.phone ? "border-red-500" : ""}
                  required
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="address" className="flex items-center gap-1 mb-2">
                  ঠিকানা <span className="text-red-500">*</span>
                  {formErrors.address && <AlertCircle className="h-4 w-4 text-red-500 ml-1" />}
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={formErrors.address ? "border-red-500" : ""}
                  required
                />
                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
              </div>

              <div>
                <Label htmlFor="city" className="flex items-center gap-1 mb-2">
                  শহর <span className="text-red-500">*</span>
                  {formErrors.city && <AlertCircle className="h-4 w-4 text-red-500 ml-1" />}
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={formErrors.city ? "border-red-500" : ""}
                  required
                />
                {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
              </div>

              {/* Advanced Shipping Area Section */}
              <div className="space-y-3">
                <Label className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  শিপিং এলাকা <span className="text-red-500">*</span>
                  {formErrors.shipping && <AlertCircle className="h-4 w-4 text-red-500 ml-1" />}
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shippingRates.map((rate) => (
                    <Card 
                      key={rate.id}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        selectedShipping === rate.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => handleShippingChange(rate.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{rate.area_name}</h3>
                          {rate.estimated_days && (
                            <p className="text-sm text-muted-foreground mt-1">
                              আনুমানিক ডেলিভারি: {rate.estimated_days} দিন
                            </p>
                          )}
                        </div>
                        <div className="font-semibold">৳{rate.rate}</div>
                      </div>
                      {selectedShipping === rate.id && (
                        <div className="flex items-center mt-2 text-primary">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">নির্বাচিত</span>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
                {formErrors.shipping && <p className="text-red-500 text-xs mt-1">{formErrors.shipping}</p>}
              </div>

              {/* Advanced Payment Method Section */}
              <div className="space-y-3">
                <Label className="flex items-center gap-1 mb-2">
                  <CreditCard className="h-4 w-4" />
                  পেমেন্ট মেথড
                </Label>
                
                <div className="grid grid-cols-2 gap-3">
                  <Card 
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      formData.paymentMethod === 'cash_on_delivery' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('paymentMethod', 'cash_on_delivery')}
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      <span>ক্যাশ অন ডেলিভারি</span>
                    </div>
                    {formData.paymentMethod === 'cash_on_delivery' && (
                      <div className="flex items-center mt-2 text-primary">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">নির্বাচিত</span>
                      </div>
                    )}
                  </Card>
                  
                  <Card 
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      formData.paymentMethod === 'bkash' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('paymentMethod', 'bkash')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-orange-500 rounded"></div>
                      <span>বিকাশ</span>
                    </div>
                    {formData.paymentMethod === 'bkash' && (
                      <div className="flex items-center mt-2 text-primary">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">নির্বাচিত</span>
                      </div>
                    )}
                  </Card>
                  
                  <Card 
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      formData.paymentMethod === 'rocket' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('paymentMethod', 'rocket')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-purple-500 rounded"></div>
                      <span>রকেট</span>
                    </div>
                    {formData.paymentMethod === 'rocket' && (
                      <div className="flex items-center mt-2 text-primary">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">নির্বাচিত</span>
                      </div>
                    )}
                  </Card>
                  
                  <Card 
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      formData.paymentMethod === 'nagad' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('paymentMethod', 'nagad')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-green-500 rounded"></div>
                      <span>নগদ</span>
                    </div>
                    {formData.paymentMethod === 'nagad' && (
                      <div className="flex items-center mt-2 text-primary">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">নির্বাচিত</span>
                      </div>
                    )}
                  </Card>
                </div>
              </div>

              {/* Payment Instructions */}
              {formData.paymentMethod !== 'cash_on_delivery' && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-blue-800">
                      {formData.paymentMethod === 'bkash' && 'বিকাশ পেমেন্ট'}
                      {formData.paymentMethod === 'rocket' && 'রকেট পেমেন্ট'}
                      {formData.paymentMethod === 'nagad' && 'নগদ পেমেন্ট'}
                    </h3>
                    
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm mb-2">পেমেন্ট করতে নিচের নম্বরে টাকা পাঠান:</p>
                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span className="font-mono text-lg">
                          {formData.paymentMethod === 'bkash' && (paymentSettings?.payment_methods?.bkash?.number || '01624712851')}
                          {formData.paymentMethod === 'rocket' && (paymentSettings?.payment_methods?.rocket?.number || '01624712851')}
                          {formData.paymentMethod === 'nagad' && (paymentSettings?.payment_methods?.nagad?.number || '01624712851')}
                        </span>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const number = formData.paymentMethod === 'bkash' ? paymentSettings?.payment_methods?.bkash?.number :
                                         formData.paymentMethod === 'rocket' ? paymentSettings?.payment_methods?.rocket?.number :
                                         paymentSettings?.payment_methods?.nagad?.number;
                            navigator.clipboard.writeText(number || '01624712851');
                          }}
                        >
                          কপি করুন
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        যে নম্বর থেকে টাকা পাঠিয়েছেন <span className="text-red-500">*</span>
                        {formErrors.senderNumber && <AlertCircle className="h-4 w-4 text-red-500 ml-1" />}
                      </Label>
                      <Input 
                        placeholder="01XXXXXXXXX"
                        value={formData.senderNumber || ''}
                        onChange={(e) => handleInputChange('senderNumber', e.target.value)}
                        className={formErrors.senderNumber ? "border-red-500" : ""}
                        required={formData.paymentMethod !== 'cash_on_delivery'}
                      />
                      {formErrors.senderNumber && <p className="text-red-500 text-xs mt-1">{formErrors.senderNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        ট্রানজেকশন আইডি <span className="text-red-500">*</span>
                        {formErrors.transactionId && <AlertCircle className="h-4 w-4 text-red-500 ml-1" />}
                      </Label>
                      <Input 
                        placeholder="ট্রানজেকশন আইডি লিখুন"
                        value={formData.transactionId || ''}
                        onChange={(e) => handleInputChange('transactionId', e.target.value)}
                        className={formErrors.transactionId ? "border-red-500" : ""}
                        required={formData.paymentMethod !== 'cash_on_delivery'}
                      />
                      {formErrors.transactionId && <p className="text-red-500 text-xs mt-1">{formErrors.transactionId}</p>}
                    </div>
                  </div>
                </Card>
              )}

              <div>
                <Label htmlFor="notes">অতিরিক্ত নোট (ঐচ্ছিক)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
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
