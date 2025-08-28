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
import { Edit, Trash2, Plus, Percent, DollarSign } from 'lucide-react';

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
}

export default function PromoCodeManagement() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: 0,
    max_uses: 0,
    expires_at: '',
    is_active: true
  });

  useEffect(() => {
    fetchPromoCodes();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promoData = {
        ...formData,
        code: formData.code.toUpperCase(),
        max_uses: formData.max_uses > 0 ? formData.max_uses : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
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
      is_active: promo.is_active
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
      is_active: true
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">প্রমো কোড ব্যবস্থাপনা</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              নতুন প্রমো কোড
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? 'প্রমো কোড সম্পাদনা' : 'নতুন প্রমো কোড'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
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
                <Label htmlFor="discount_value">ছাড়ের পরিমাণ *</Label>
                <Input
                  id="discount_value"
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                  placeholder={formData.discount_type === 'percentage' ? '10' : '100'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="min_order_amount">নূন্যতম অর্ডার পরিমাণ (৳)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: Number(e.target.value) })}
                  placeholder="500"
                />
              </div>

              <div>
                <Label htmlFor="max_uses">সর্বোচ্চ ব্যবহার (খালি রাখলে সীমাহীন)</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: Number(e.target.value) })}
                  placeholder="100"
                />
              </div>

              <div>
                <Label htmlFor="expires_at">মেয়াদ শেষের তারিখ</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active">সক্রিয় প্রমো কোড</Label>
              </div>

              <div className="flex justify-end space-x-2">
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
                    
                    <div>
                      <span className="text-muted-foreground">ব্যবহার:</span>
                      <span className="ml-1">
                        {promo.used_count}/{promo.max_uses || '∞'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">মেয়াদ:</span>
                      <span className="ml-1">
                        {promo.expires_at 
                          ? new Date(promo.expires_at).toLocaleDateString('bn-BD')
                          : 'সীমাহীন'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
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
    </div>
  );
}
