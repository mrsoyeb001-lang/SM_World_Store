import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MapPin, CreditCard, Truck, AlertCircle, CheckCircle, Info, Volume2, Wand2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// --- MOCK DEPENDENCIES TO MAKE THE COMPONENT RUNNABLE ---
const MOCK_USER = { id: 'mock-user-123' };
const MOCK_CART_ITEMS = [
  { id: '1', product: { name: 'Product A', price: 50 }, quantity: 1 },
  { id: '2', product: { name: 'Product B', price: 25, sale_price: 20 }, quantity: 2 },
];
const MOCK_CART_TOTAL = 90; // (1 * 50) + (2 * 20)

const mockUseAuth = () => ({ user: MOCK_USER });
const mockUseCart = () => {
  const [items, setItems] = useState(MOCK_CART_ITEMS);
  const [total, setTotal] = useState(MOCK_CART_TOTAL);
  const clearCart = () => {
    setItems([]);
    setTotal(0);
  };
  return { items, total, clearCart };
};

const mockUseToast = () => ({
  toast: ({ title, description, variant }) => {
    console.log(`Toast: ${title} - ${description} (Variant: ${variant || 'default'})`);
  }
});

const mockSupabase = {
  from: (table) => {
    let mockData = [];
    if (table === 'shipping_rates') {
      mockData = [
        { id: 'rate1', area_name: 'ঢাকা ভিতরে', rate: 80, estimated_days: 2 },
        { id: 'rate2', area_name: 'ঢাকা বাইরে', rate: 140, estimated_days: 4 },
      ];
    } else if (table === 'settings') {
      mockData = [{ value: { payment_methods: { bkash: { number: '01712345678', instructions: 'Send money to this number.' }, nagad: { number: '01812345678', instructions: 'Cash out to this number.' }, rocket: { number: '01912345678', instructions: 'Rocket number for payment.' } } } }];
    } else if (table === 'promo_codes') {
      mockData = [{ id: 'promo1', code: 'DISCOUNT10', discount_type: 'percentage', discount_value: 10, min_order_amount: 50, used_count: 0 }];
    }

    const mockSingle = (data) => ({ data: data[0] });

    return {
      select: () => ({
        eq: () => ({
          maybeSingle: () => mockSingle(mockData),
          single: () => mockSingle(mockData),
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => ({ data: { id: `order-${Math.random().toString(36).substr(2, 9)}`, ...mockData[0] }, error: null })
        })
      }),
      update: () => ({
        eq: () => ({ data: {}, error: null })
      })
    };
  }
};
const mockUseNavigate = () => {
  return (path) => {
    console.log(`Navigating to: ${path}`);
  };
};

const useAuth = mockUseAuth;
const useCart = mockUseCart;
const useToast = mockUseToast;
const supabase = mockSupabase;
const useNavigate = mockUseNavigate;
// -----------------------------------------------------------------

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
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: '',
    notes: '',
    senderNumber: '',
    transactionId: ''
  });

  // New states for Gemini API integration
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Helper function to convert PCM audio data to WAV format
  const pcmToWav = (pcmData, sampleRate) => {
    const pcm16 = new Int16Array(pcmData);
    const dataLength = pcm16.length * 2;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    let offset = 0;
    const writeString = (str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset++, str.charCodeAt(i));
      }
    };
    const writeUint32 = (num) => view.setUint32(offset, num, true);
    const writeUint16 = (num) => view.setUint16(offset, num, true);

    // RIFF header
    writeString('RIFF');
    writeUint32(36 + dataLength);
    writeString('WAVE');

    // fmt chunk
    writeString('fmt ');
    writeUint32(16);
    writeUint16(1); // Audio format (1 for PCM)
    writeUint16(1); // Number of channels (1)
    writeUint32(sampleRate);
    writeUint32(sampleRate * 2); // Byte rate
    writeUint16(2); // Block align
    writeUint16(16); // Bits per sample
    offset += 16;

    // data chunk
    writeString('data');
    writeUint32(dataLength);
    offset += 4;

    for (let i = 0; i < pcm16.length; i++) {
      view.setInt16(offset, pcm16[i], true);
      offset += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  const speakConfirmationMessage = async () => {
    setIsSpeaking(true);
    const confirmationText = 'অভিনন্দন! আপনার অর্ডারটি সফলভাবে সাবমিট করা হয়েছে।';

    const payload = {
      contents: [{
        parts: [{ text: confirmationText }]
      }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" }
          }
        }
      },
      model: "gemini-2.5-flash-preview-tts"
    };

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/")) {
        const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);
        const pcmData = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
        const wavBlob = pcmToWav(pcmData, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);
        const audio = new Audio(audioUrl);
        audio.play().then(() => setIsSpeaking(false));
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Error speaking message:', error);
      setIsSpeaking(false);
    }
  };

  const generateThankYouMessage = async () => {
    setIsGeneratingMessage(true);
    const orderDetails = orderSummary ? JSON.stringify(orderSummary.items) : 'an order';
    const systemPrompt = "You are a friendly e-commerce customer service assistant. Generate a short, personalized thank-you message for a customer. The message should be warm, professional, and thank them for their order.";
    const userQuery = `Generate a thank you message for a customer. Their order details are: ${orderDetails}.`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      tools: [{ "google_search": {} }],
      model: "gemini-2.5-flash-preview-05-20"
    };

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setGeneratedMessage(text);
      }
    } catch (error) {
      console.error('Error generating message:', error);
      setGeneratedMessage("Could not generate a message at this time.");
    } finally {
      setIsGeneratingMessage(false);
    }
  };

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
  }, [user, items]);

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
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'site_settings')
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
    } else if (data && typeof data.value === 'object' && data.value !== null) {
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
    if (!formData.paymentMethod) errors.paymentMethod = 'পেমেন্ট মেথড নির্বাচন করুন';
    
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

      // Set order summary for modal
      setOrderSummary({
        orderId: order.id.slice(0, 8),
        total: finalTotal,
        shippingCost: shippingCost,
        discount: discount,
        paymentMethod: formData.paymentMethod,
        shippingAddress: formData,
        items: items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: (item.product.sale_price || item.product.price) * item.quantity
        })),
        promoCode: appliedPromoCode?.code || null
      });

      // Open confirmation modal
      setIsConfirmationModalOpen(true);

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
    
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleModalClose = () => {
    setIsConfirmationModalOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8 font-['Inter', 'sans-serif']">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-primary-dark mb-8 md:mb-12">
          আপনার অর্ডার কনফার্ম করুন 🛒
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          {/* Shipping and Payment Form */}
          <div className="lg:col-span-2">
            <Card className="p-4 md:p-8 shadow-lg border-2 border-border/60">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" /> শিপিং এবং পেমেন্ট তথ্য
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                  {/* Shipping Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <Label htmlFor="fullName" className="flex items-center gap-1 mb-2 font-medium text-sm">
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
                      <Label htmlFor="phone" className="flex items-center gap-1 mb-2 font-medium text-sm">
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
                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="flex items-center gap-1 mb-2 font-medium text-sm">
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
                      <Label htmlFor="city" className="flex items-center gap-1 mb-2 font-medium text-sm">
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
                  </div>

                  {/* Shipping Area Selection */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base md:text-lg flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" /> শিপিং এলাকা নির্বাচন করুন <span className="text-red-500">*</span>
                      {formErrors.shipping && <AlertCircle className="h-4 w-4 text-red-500 ml-1" />}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {shippingRates.map((rate) => (
                        <Card 
                          key={rate.id}
                          className={`p-4 cursor-pointer transition-all border-2 rounded-lg ${
                            selectedShipping === rate.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => handleShippingChange(rate.id)}
                        >
                          <div className="flex flex-col items-start space-y-1">
                            <h4 className="font-bold text-sm">{rate.area_name}</h4>
                            <div className="flex justify-between items-center w-full">
                              <span className="font-semibold text-lg text-primary">৳{rate.rate}</span>
                              {selectedShipping === rate.id && <CheckCircle className="h-5 w-5 text-primary" />}
                            </div>
                            {rate.estimated_days && (
                              <p className="text-xs text-muted-foreground">
                                আনুমানিক: {rate.estimated_days} দিন
                              </p>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                    {formErrors.shipping && <p className="text-red-500 text-xs mt-1">{formErrors.shipping}</p>}
                  </div>

                  <Separator />

                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base md:text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" /> পেমেন্ট মেথড <span className="text-red-500">*</span>
                      {formErrors.paymentMethod && <AlertCircle className="h-4 w-4 text-red-500 ml-1" />}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {['cash_on_delivery', 'bkash', 'rocket', 'nagad'].map((method) => (
                        <Card 
                          key={method}
                          className={`p-4 cursor-pointer transition-all border-2 rounded-lg ${
                            formData.paymentMethod === method 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => handleInputChange('paymentMethod', method)}
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            {method === 'cash_on_delivery' && <Truck className="h-8 w-8 text-slate-600" />}
                            {method !== 'cash_on_delivery' && (
                              <img src={`/images/${method}.svg`} alt={method} className="h-8 w-8" />
                            )}
                            <span className="font-medium text-sm text-center">
                              {method === 'cash_on_delivery' ? 'ক্যাশ অন ডেলিভারি' : method.charAt(0).toUpperCase() + method.slice(1)}
                            </span>
                            {formData.paymentMethod === method && <CheckCircle className="h-4 w-4 text-primary" />}
                          </div>
                        </Card>
                      ))}
                    </div>
                    {formErrors.paymentMethod && <p className="text-red-500 text-xs mt-1">{formErrors.paymentMethod}</p>}
                  </div>

                  {/* Payment Instructions & Form */}
                  {formData.paymentMethod !== '' && formData.paymentMethod !== 'cash_on_delivery' && (
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <div className="space-y-4">
                        <div className="flex items-center text-blue-800">
                          <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                          <h3 className="font-semibold text-base md:text-lg">
                            {formData.paymentMethod === 'bkash' && 'বিকাশ পেমেন্ট'}
                            {formData.paymentMethod === 'rocket' && 'রকেট পেমেন্ট'}
                            {formData.paymentMethod === 'nagad' && 'নগদ পেমেন্ট'}
                          </h3>
                        </div>
                        
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-sm mb-2 font-medium">পেমেন্ট করতে নিচের নম্বরে টাকা পাঠান:</p>
                          <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                            <span className="font-mono text-base md:text-lg font-bold">
                              {formData.paymentMethod === 'bkash' && (paymentSettings?.payment_methods?.bkash?.number || '01XXXXXXXXX')}
                              {formData.paymentMethod === 'rocket' && (paymentSettings?.payment_methods?.rocket?.number || '01XXXXXXXXX')}
                              {formData.paymentMethod === 'nagad' && (paymentSettings?.payment_methods?.nagad?.number || '01XXXXXXXXX')}
                            </span>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const number = formData.paymentMethod === 'bkash' ? paymentSettings?.payment_methods?.bkash?.number :
                                               formData.paymentMethod === 'rocket' ? paymentSettings?.payment_methods?.rocket?.number :
                                               paymentSettings?.payment_methods?.nagad?.number;
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(number || '01XXXXXXXXX');
                                } else {
                                   const tempInput = document.createElement('input');
                                   tempInput.value = number || '01XXXXXXXXX';
                                   document.body.appendChild(tempInput);
                                   tempInput.select();
                                   document.execCommand('copy');
                                   document.body.removeChild(tempInput);
                                }
                                toast({ title: "নম্বর কপি করা হয়েছে" });
                              }}
                            >
                              কপি করুন
                            </Button>
                          </div>
                          {paymentSettings?.payment_methods?.[formData.paymentMethod]?.instructions && (
                            <p className="text-xs text-muted-foreground mt-2">
                              ** {paymentSettings.payment_methods[formData.paymentMethod].instructions}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="flex items-center gap-1 font-medium text-sm">
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
                            <Label className="flex items-center gap-1 font-medium text-sm">
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
                      </div>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-medium text-sm">অতিরিক্ত নোট (ঐচ্ছিক)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="যেমন: প্রোডাক্টের কালার, সাইজ, বা অন্য কোনো বিশেষ নির্দেশনা।"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <Card className="p-4 md:p-8 h-fit shadow-lg border-2 border-border/60 lg:sticky lg:top-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Info className="h-5 w-5 md:h-6 md:w-6 text-primary" /> অর্ডার সামারি
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-muted-foreground ml-2">x {item.quantity}</span>
                    </div>
                    <span className="font-semibold">৳{((item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-3 font-medium text-sm">
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
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg text-primary-dark">
                <span>মোট</span>
                <span>৳{finalTotal.toFixed(2)}</span>
              </div>
              
              {/* Promo Code Section */}
              <div className="mt-6 space-y-2">
                <Label className="font-medium text-sm">প্রমো কোড</Label>
                {appliedPromoCode ? (
                  <div className="flex items-center justify-between bg-green-50 text-green-700 p-2 rounded-lg border border-green-200">
                    <span>{appliedPromoCode.code} প্রয়োগ হয়েছে</span>
                    <Button variant="ghost" size="sm" onClick={removePromoCode} className="text-red-500 hover:text-red-700">
                      মুছুন
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="প্রমো কোড লিখুন"
                      className="flex-1 h-10"
                    />
                    <Button type="button" variant="outline" onClick={applyPromoCode} className="h-10">
                      প্রয়োগ
                    </Button>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={loading || !selectedShipping || !formData.paymentMethod}
                className="w-full mt-6 py-4 text-lg font-semibold transition-transform duration-200 active:scale-95"
                size="lg"
              >
                {loading ? "অর্ডার করা হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
        <DialogContent className="max-w-xs sm:max-w-md md:max-w-lg p-6 md:p-8">
          <DialogHeader className="text-center">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4 animate-bounce" />
            <DialogTitle className="text-xl sm:text-3xl font-bold text-green-700 flex items-center justify-center gap-2">
              অভিনন্দন! 🎉
              <Button variant="ghost" size="icon" onClick={speakConfirmationMessage} disabled={isSpeaking}>
                <Volume2 className={`h-5 w-5 ${isSpeaking ? 'text-gray-400' : 'text-blue-500'}`} />
              </Button>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              আপনার অর্ডারটি সফলভাবে সাবমিট করা হয়েছে। আমাদের টিম আপনার অর্ডারগুলো দেখে পর্যবেক্ষণ করে সবকিছু যাচাই-বাছাই করে আপনাকে জানানো হবে। আপনি আপনার সকল অর্ডার ড্যাশবোর্ডে দেখতে পাবেন।
            </DialogDescription>
          </DialogHeader>
          
          {orderSummary && (
            <div className="mt-4 space-y-4 p-4 border rounded-lg bg-gray-50 text-xs sm:text-sm">
              <div className="flex justify-between items-center font-medium">
                <span>অর্ডার আইডি:</span>
                <span className="font-mono text-primary font-bold">{orderSummary.orderId}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-semibold text-base mb-1">প্রোডাক্টের বিবরণ</h4>
                {orderSummary.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-xs sm:text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>৳{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2 font-medium">
                <div className="flex justify-between">
                  <span>সাবটোটাল:</span>
                  <span>৳{(orderSummary.total - orderSummary.shippingCost + orderSummary.discount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>শিপিং খরচ:</span>
                  <span>৳{orderSummary.shippingCost.toFixed(2)}</span>
                </div>
                {orderSummary.promoCode && (
                  <div className="flex justify-between text-green-600">
                    <span>প্রমো কোড ছাড় ({orderSummary.promoCode}):</span>
                    <span>-৳{orderSummary.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-base sm:text-lg text-primary-dark">
                <span>মোট পেমেন্ট:</span>
                <span>৳{orderSummary.total.toFixed(2)}</span>
              </div>
              
              <div className="mt-4 text-xs sm:text-sm space-y-1">
                <p className="font-semibold">পেমেন্ট মেথড: <span className="font-normal text-muted-foreground">{
                  orderSummary.paymentMethod === 'cash_on_delivery' ? 'ক্যাশ অন ডেলিভারি' :
                  orderSummary.paymentMethod === 'bkash' ? 'বিকাশ' :
                  orderSummary.paymentMethod === 'rocket' ? 'রকেট' :
                  'নগদ'
                }</span></p>
                <p className="font-semibold">ডেলিভারি ঠিকানা: <span className="font-normal text-muted-foreground">{orderSummary.shippingAddress.address}, {orderSummary.shippingAddress.city}</span></p>
              </div>

              <div className="mt-6 flex flex-col items-stretch gap-2">
                <Button 
                  onClick={generateThankYouMessage}
                  disabled={isGeneratingMessage}
                  className="w-full"
                >
                  {isGeneratingMessage ? 'মেসেজ তৈরি হচ্ছে...' : 'কাস্টমারের জন্য ধন্যবাদ বার্তা তৈরি করুন ✨'}
                </Button>
                {generatedMessage && (
                  <Textarea
                    value={generatedMessage}
                    readOnly
                    className="mt-2 text-xs"
                    placeholder="জেনারেট করা মেসেজ এখানে দেখা যাবে..."
                  />
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button onClick={handleModalClose} className="w-full py-4 text-lg">
              ওকে, ড্যাশবোর্ডে যান
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
