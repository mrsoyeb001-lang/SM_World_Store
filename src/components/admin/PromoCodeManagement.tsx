import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Percent, DollarSign, Package, Users, Calendar, Hash, X, Check, Zap, Copy } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PromoCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  applies_to: 'all' | 'specific';
  product_ids: string[] | null;
  usage_per_user: number | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface PromoCodeUsage {
  id: string;
  promo_code_id: string;
  user_id: string;
  order_id: string;
  used_at: string;
  users: {
    email: string;
  } | null;
  orders: {
    total_amount: number;
  } | null;
}

export default function AdvancedPromoCodeManagement() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [usageHistory, setUsageHistory] = useState<PromoCodeUsage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [activeTab, setActiveTab] = useState('codes');
  const [selectedPromoForUsage, setSelectedPromoForUsage] = useState<PromoCode | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: 0,
    max_uses: 0,
    expires_at: '',
    is_active: true,
    applies_to: 'all',
    product_ids: [] as string[],
    usage_per_user: 1
  });

  useEffect(() => {
    fetchPromoCodes();
    fetchProducts();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "প্রমো কোড লোড করতে ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setPromoCodes(data || []);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, category')
      .order('name');

    if (error) {
      console.error("পণ্য লোড করতে ব্যর্থ:", error);
    } else {
      setProducts(data || []);
    }
  };

  const fetchUsageHistory = async (promo: PromoCode) => {
    setSelectedPromoForUsage(promo);
    const { data, error } = await supabase
      .from('promo_code_usages')
      .select(`
        *,
        users:user_id (email),
        orders:order_id (total_amount)
      `)
      .eq('promo_code_id', promo.id)
      .order('used_at', { ascending: false });

    if (error) {
      console.error("ব্যবহারের ইতিহাস লোড করতে ব্যর্থ:", error);
      toast({
        title: "ব্যবহারের ইতিহাস লোড করতে ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setUsageHistory(data || []);
      setActiveTab('usage');
    }
  };

  // Calculate minimum order amount for specific products
  const calculateMinOrderForSpecificProducts = () => {
    if (formData.applies_to === 'specific' && formData.product_ids.length > 0) {
      const selectedProducts = products.filter(p => formData.product_ids.includes(p.id));
      if (selectedProducts.length > 0) {
        return Math.max(...selectedProducts.map(p => p.price));
      }
    }
    return formData.min_order_amount;
  };

  const minOrderAmount = calculateMinOrderForSpecificProducts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promoData = {
        ...formData,
        min_order_amount: minOrderAmount,
        code: formData.code.toUpperCase(),
        max_uses: formData.max_uses > 0 ? formData.max_uses : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        product_ids: formData.applies_to === 'specific' ? formData.product_ids : null,
        usage_per_user: formData.usage_per_user > 0 ? formData.usage_per_user : null
      };

      if (editingPromo) {
        const { error } = await supabase
          .from('promo_codes')
          .update(promoData)
          .eq('id', editingPromo.id);

        if (error) throw error;
        
        toast({
          title: "প্রমো কোড আপডেট হয়েছে",
          description: "প্রমো কোডের তথ্য সফলভাবে আপডেট করা হয়েছে।"
        });
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert({ ...promoData, used_count: 0 });

        if (error) throw error;
        
        toast({
          title: "নতুন প্রমো কোড যোগ হয়েছে",
          description: "নতুন প্রমো কোড সফলভাবে তৈরি করা হয়েছে।"
        });
      }

      resetForm();
      fetchPromoCodes();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_order_amount: promo.min_order_amount,
      max_uses: promo.max_uses || 0,
      expires_at: promo.expires_at ? new Date(promo.expires_at).toISOString().split('T')[0] : '',
      is_active: promo.is_active,
      applies_to: promo.applies_to || 'all',
      product_ids: promo.product_ids || [],
      usage_per_user: promo.usage_per_user || 1
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই প্রমো কোডটি মুছে ফেলতে চান?')) return;

    const { error } = await supabase
      .from('promo_codes')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      toast({
        title: "ত্রুটি",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "প্রমো কোড নিষ্ক্রিয় করা হয়েছে",
        description: "প্রমো কোডটি সফলভাবে নিষ্ক্রিয় করা হয়েছে।"
      });
      fetchPromoCodes();
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      max_uses: 0,
      expires_at: '',
      is_active: true,
      applies_to: 'all',
      product_ids: [],
      usage_per_user: 1
    });
    setEditingPromo(null);
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData({ ...formData, code: result });
  };

  const toggleProductSelection = (productId: string) => {
    setFormData(prev => {
      const currentIds = prev.product_ids || [];
      if (currentIds.includes(productId)) {
        return {
          ...prev,
          product_ids: currentIds.filter(id => id !== productId)
        };
      } else {
        return {
          ...prev,
          product_ids: [...currentIds, productId]
        };
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "কপি করা হয়েছে",
      description: "প্রমো কোড ক্লিপবোর্ডে কপি করা হয়েছে"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">উন্নত প্রমো কোড ব্যবস্থাপনা</h2>
          <p className="text-muted-foreground">আপনার প্রমো কোডগুলি তৈরি, পরিচালনা এবং ট্র্যাক করুন</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              নতুন প্রমো কোড
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? 'প্রমো কোড সম্পাদনা' : 'নতুন প্রমো কোড তৈরি করুন'}
              </DialogTitle>
              <DialogDescription>
                {editingPromo 
                  ? 'আপনার প্রমো কোডের তথ্য আপডেট করুন' 
                  : 'একটি নতুন প্রমো কোড তৈরি করুন এবং এর বৈশিষ্ট্য কনফিগার করুন'
                }
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="code">প্রমো কোড *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SUMMER25"
                      required
                      className="font-mono"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button type="button" variant="outline" onClick={generateRandomCode}>
                            <Zap className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>র‍্যান্ডম কোড জেনারেট করুন</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div>
                  <Label htmlFor="discount_type">ছাড়ের ধরন *</Label>
                  <Select 
                    value={formData.discount_type} 
                    onValueChange={(value) => setFormData({ ...formData, discount_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        <div className="flex items-center">
                          <Percent className="w-4 h-4 mr-2" />
                          শতাংশ (%)
                        </div>
                      </SelectItem>
                      <SelectItem value="fixed">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          নির্দিষ্ট পরিমাণ
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discount_value">
                    {formData.discount_type === 'percentage' ? 'ছাড়ের শতকরা হার *' : 'ছাড়ের পরিমাণ (৳) *'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    min="0"
                    step={formData.discount_type === 'percentage' ? 1 : 0.01}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                    placeholder={formData.discount_type === 'percentage' ? '10' : '100'}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="min_order_amount">
                    {formData.applies_to === 'all' ? 'নূন্যতম অর্ডার পরিমাণ (৳)' : 'স্বয়ংক্রিয় ন্যূনতম অর্ডার'}
                  </Label>
                  <Input
                    id="min_order_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.applies_to === 'specific' ? minOrderAmount : formData.min_order_amount}
                    onChange={(e) => {
                      if (formData.applies_to === 'all') {
                        setFormData({ ...formData, min_order_amount: Number(e.target.value) });
                      }
                    }}
                    placeholder="500"
                    disabled={formData.applies_to === 'specific'}
                    className={formData.applies_to === 'specific' ? 'bg-muted' : ''}
                  />
                  {formData.applies_to === 'specific' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      নির্দিষ্ট পণ্যের জন্য স্বয়ংক্রিয়ভাবে সেট করা হয়েছে: ৳{minOrderAmount}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="max_uses">সর্বোচ্চ ব্যবহার</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="0"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: Number(e.target.value) })}
                    placeholder="সীমাহীন (খালি রাখুন)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">খালি রাখলে সীমাহীন ব্যবহার</p>
                </div>

                <div>
                  <Label htmlFor="usage_per_user">প্রতি ব্যবহারকারীর সর্বোচ্চ ব্যবহার</Label>
                  <Input
                    id="usage_per_user"
                    type="number"
                    min="1"
                    value={formData.usage_per_user}
                    onChange={(e) => setFormData({ ...formData, usage_per_user: Number(e.target.value) })}
                    placeholder="1"
                  />
                </div>

                <div>
                  <Label htmlFor="expires_at">মেয়াদ শেষের তারিখ</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-muted-foreground mt-1">খালি রাখলে সীমাহীন মেয়াদ</p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="applies_to">প্রযোজ্যতা</Label>
                  <Select 
                    value={formData.applies_to} 
                    onValueChange={(value) => setFormData({ ...formData, applies_to: value as 'all' | 'specific', product_ids: [] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          সব পণ্যে
                        </div>
                      </SelectItem>
                      <SelectItem value="specific">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          নির্দিষ্ট পণ্যে
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.applies_to === 'specific' && (
                  <div className="md:col-span-2">
                    <Label>পণ্য নির্বাচন করুন *</Label>
                    <div className="mt-2 border rounded-md p-3 max-h-48 overflow-y-auto">
                      {products.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          কোন পণ্য পাওয়া যায়নি
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {products.map(product => (
                            <div key={product.id} className="flex items-start space-x-2 py-2">
                              <input
                                type="checkbox"
                                id={`product-${product.id}`}
                                checked={formData.product_ids?.includes(product.id) || false}
                                onChange={() => toggleProductSelection(product.id)}
                                className="w-4 h-4 mt-1"
                              />
                              <Label htmlFor={`product-${product.id}`} className="flex-1 cursor-pointer">
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {product.category} • ৳{product.price}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {formData.product_ids.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        নির্বাচিত পণ্য: {formData.product_ids.length}টি | 
                        ন্যূনতম অর্ডার: ৳{minOrderAmount}
                      </p>
                    )}
                  </div>
                )}

                <div className="md:col-span-2 flex items-center space-x-2 p-3 bg-muted rounded-md">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active" className="flex-1">
                    <div className="font-medium">সক্রিয় প্রমো কোড</div>
                    <div className="text-sm text-muted-foreground">
                      {formData.is_active ? 'ব্যবহারকারীরা এই কোড ব্যবহার করতে পারবে' : 'এই কোডটি সাময়িকভাবে নিষ্ক্রিয় করা হয়েছে'}
                    </div>
                  </Label>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>সেভ করা হচ্ছে...</>
                  ) : editingPromo ? (
                    <>আপডেট করুন</>
                  ) : (
                    <>তৈরি করুন</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* বাকি কোড অপরিবর্তিত রাখুন */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* ... বাকি UI কোড ... */}
      </Tabs>
    </div>
  );
}
