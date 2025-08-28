import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Percent, DollarSign, Package, Users, Calendar, Hash, Search, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  image_url: string | null;
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [usageHistory, setUsageHistory] = useState<PromoCodeUsage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [activeTab, setActiveTab] = useState('codes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

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
      .select('id, name, price, category, image_url')
      .order('name');

    if (error) {
      console.error("পণ্য লোড করতে ব্যর্থ:", error);
      toast({
        title: "পণ্য লোড করতে ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setProducts(data || []);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  };

  const fetchUsageHistory = async (promoId: string) => {
    const { data, error } = await supabase
      .from('promo_code_usages')
      .select(`
        *,
        users:user_id (email),
        orders:order_id (total_amount)
      `)
      .eq('promo_code_id', promoId)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate min_order_amount for specific products
      let minOrderAmount = formData.min_order_amount;
      
      if (formData.applies_to === 'specific' && formData.product_ids.length > 0) {
        const selectedProducts = products.filter(p => formData.product_ids.includes(p.id));
        if (selectedProducts.length > 0) {
          // Set min order amount to the price of the cheapest selected product
          minOrderAmount = Math.min(...selectedProducts.map(p => p.price));
        }
      }

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
    setSearchTerm('');
    setSelectedCategory('all');
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

  const getCategories = () => {
    const categories = new Set(products.map(p => p.category));
    return ['all', ...Array.from(categories)];
  };

  const calculateMinOrderAmount = () => {
    if (formData.applies_to !== 'specific' || formData.product_ids.length === 0) {
      return formData.min_order_amount;
    }
    
    const selectedProducts = products.filter(p => formData.product_ids.includes(p.id));
    if (selectedProducts.length === 0) return 0;
    
    return Math.min(...selectedProducts.map(p => p.price));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">উন্নত প্রমো কোড ব্যবস্থাপনা</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              নতুন প্রমো কোড
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? 'প্রমো কোড সম্পাদনা' : 'নতুন প্রমো কোড'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="code">প্রমো কোড *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SAVE50"
                      required
                    />
                    <Button type="button" variant="outline" onClick={generateRandomCode}>
                      জেনারেট
                    </Button>
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
                      <SelectItem value="percentage">শতাংশ (%)</SelectItem>
                      <SelectItem value="fixed">নির্দিষ্ট পরিমাণ (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discount_value">
                    {formData.discount_type === 'percentage' ? 'ছাড়ের শতকরা হার *' : 'ছাড়ের পরিমাণ *'}
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

                {formData.applies_to === 'all' && (
                  <div>
                    <Label htmlFor="min_order_amount">নূন্যতম অর্ডার পরিমাণ (৳)</Label>
                    <Input
                      id="min_order_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.min_order_amount}
                      onChange={(e) => setFormData({ ...formData, min_order_amount: Number(e.target.value) })}
                      placeholder="500"
                    />
                  </div>
                )}

                {formData.applies_to === 'specific' && (
                  <div>
                    <Label htmlFor="min_order_amount">স্বয়ংক্রিয় নূন্যতম অর্ডার পরিমাণ</Label>
                    <Input
                      id="min_order_amount"
                      type="number"
                      value={calculateMinOrderAmount()}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      নির্বাচিত পণ্যগুলোর মধ্যে সর্বনিম্ন দাম অনুযায়ী সেট করা হয়েছে
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="max_uses">সর্বোচ্চ ব্যবহার (খালি রাখলে সীমাহীন)</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="0"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: Number(e.target.value) })}
                    placeholder="100"
                  />
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
                </div>

                <div className="col-span-2">
                  <Label htmlFor="applies_to">প্রযোজ্যতা</Label>
                  <Select 
                    value={formData.applies_to} 
                    onValueChange={(value) => setFormData({ ...formData, applies_to: value as 'all' | 'specific' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">সব পণ্যে</SelectItem>
                      <SelectItem value="specific">নির্দিষ্ট পণ্যে</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.applies_to === 'specific' && (
                  <div className="col-span-2">
                    <Label>পণ্য নির্বাচন করুন ({formData.product_ids.length} নির্বাচিত)</Label>
                    
                    <div className="mt-2 mb-3 flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="পণ্য খুঁজুন..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="ক্যাটাগরি" />
                        </SelectTrigger>
                        <SelectContent>
                          {getCategories().map(category => (
                            <SelectItem key={category} value={category}>
                              {category === 'all' ? 'সব ক্যাটাগরি' : category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
                      {filteredProducts.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          কোন পণ্য পাওয়া যায়নি
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          {filteredProducts.map(product => (
                            <div 
                              key={product.id} 
                              className={`flex items-start p-2 rounded-md border cursor-pointer ${
                                formData.product_ids?.includes(product.id) 
                                  ? 'bg-primary/10 border-primary' 
                                  : 'hover:bg-muted/50'
                              }`}
                              onClick={() => toggleProductSelection(product.id)}
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                {product.image_url && (
                                  <img 
                                    src={product.image_url} 
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">{product.category}</div>
                                </div>
                                <div className="font-bold">৳{product.price}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {formData.product_ids.length > 0 && (
                      <div className="mt-3">
                        <Label>নির্বাচিত পণ্যসমূহ:</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.product_ids.map(id => {
                            const product = products.find(p => p.id === id);
                            return product ? (
                              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                                {product.name}
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleProductSelection(product.id);
                                  }}
                                  className="ml-1 rounded-full hover:bg-muted"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">সক্রিয় প্রমো কোড</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'সেভ করা হচ্ছে...' : editingPromo ? 'আপডেট করুন' : 'তৈরি করুন'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="codes">প্রমো কোডসমূহ</TabsTrigger>
          <TabsTrigger value="usage">ব্যবহারের ইতিহাস</TabsTrigger>
        </TabsList>

        <TabsContent value="codes">
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">লোড হচ্ছে...</div>
            ) : promoCodes.length === 0 ? (
              <div className="text-center py-8">কোন প্রমো কোড পাওয়া যায়নি</div>
            ) : (
              promoCodes.map((promo) => (
                <Card key={promo.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl font-mono">{promo.code}</h3>
                        <Badge variant={promo.is_active ? "default" : "secondary"}>
                          {promo.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </Badge>
                        {promo.expires_at && new Date(promo.expires_at) < new Date() && (
                          <Badge variant="destructive">মেয়াদ শেষ</Badge>
                        )}
                        {promo.applies_to === 'specific' && (
                          <Badge variant="outline">
                            <Package className="w-3 h-3 mr-1" />
                            নির্দিষ্ট পণ্য
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          {promo.discount_type === 'percentage' ? (
                            <Percent className="w-4 h-4 text-green-600" />
                          ) : (
                            <DollarSign className="w-4 h-4 text-green-600" />
                          )}
                          <span>
                            {promo.discount_type === 'percentage' 
                              ? `${promo.discount_value}% ছাড়`
                              : `৳${promo.discount_value} ছাড়`
                            }
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">নূন্যতম অর্ডার:</span>
                          <span className="ml-1">৳{promo.min_order_amount}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {promo.used_count}/{promo.max_uses || '∞'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {promo.expires_at 
                              ? new Date(promo.expires_at).toLocaleDateString('bn-BD')
                              : 'সীমাহীন'
                            }
                          </span>
                        </div>
                      </div>

                      {promo.applies_to === 'specific' && promo.product_ids && promo.product_ids.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-muted-foreground">প্রযোজ্য পণ্য: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {promo.product_ids.slice(0, 3).map(id => {
                              const product = products.find(p => p.id === id);
                              return product ? (
                                <Badge key={id} variant="secondary" className="text-xs">
                                  {product.name}
                                </Badge>
                              ) : null;
                            })}
                            {promo.product_ids.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{promo.product_ids.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(promo)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchUsageHistory(promo.id)}
                      >
                        <Hash className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(promo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <Card className="p-4">
            <h3 className="font-bold text-lg mb-4">প্রমো কোড ব্যবহারের ইতিহাস</h3>
            {usageHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                কোন ব্যবহারের ইতিহাস পাওয়া যায়নি
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ব্যবহারকারী</TableHead>
                    <TableHead>অর্ডার আইডি</TableHead>
                    <TableHead>অর্ডার পরিমাণ</TableHead>
                    <TableHead>ব্যবহারের সময়</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageHistory.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell>{usage.users?.email || 'অজানা ব্যবহারকারী'}</TableCell>
                      <TableCell>{usage.order_id}</TableCell>
                      <TableCell>৳{usage.orders?.total_amount || 0}</TableCell>
                      <TableCell>
                        {new Date(usage.used_at).toLocaleString('bn-BD')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
