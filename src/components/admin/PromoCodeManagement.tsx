import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '',
    max_uses: '',
    expires_at: '',
    is_active: true
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "প্রমো কোড লোড করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_amount: '',
      max_uses: '',
      expires_at: '',
      is_active: true
    });
    setEditingPromo(null);
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value.toString(),
      min_order_amount: promo.min_order_amount.toString(),
      max_uses: promo.max_uses?.toString() || '',
      expires_at: promo.expires_at ? new Date(promo.expires_at).toISOString().split('T')[0] : '',
      is_active: promo.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promoData = {
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_order_amount: parseFloat(formData.min_order_amount) || 0,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        is_active: formData.is_active
      };

      if (editingPromo) {
        const { error } = await supabase
          .from('promo_codes')
          .update(promoData)
          .eq('id', editingPromo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert(promoData);

        if (error) throw error;
      }

      toast({
        title: "সফল",
        description: editingPromo ? "প্রমো কোড আপডেট হয়েছে।" : "নতুন প্রমো কোড তৈরি হয়েছে।"
      });

      setIsDialogOpen(false);
      resetForm();
      fetchPromoCodes();
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: error.message || "প্রমো কোড সেভ করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই প্রমো কোডটি মুছে দিতে চান?')) return;

    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "সফল",
        description: "প্রমো কোড মুছে দেওয়া হয়েছে।"
      });

      fetchPromoCodes();
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "প্রমো কোড মুছতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "সফল",
        description: "প্রমো কোড স্ট্যাটাস আপডেট হয়েছে।"
      });

      fetchPromoCodes();
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? 'প্রমো কোড এডিট করুন' : 'নতুন প্রমো কোড তৈরি করুন'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">কোড *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="WELCOME10"
                  required
                />
              </div>

              <div>
                <Label htmlFor="discount_type">ছাড়ের ধরন *</Label>
                <Select value={formData.discount_type} onValueChange={(value) => setFormData({...formData, discount_type: value})}>
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
                  onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                  placeholder={formData.discount_type === 'percentage' ? '10' : '100'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="min_order_amount">সর্বনিম্ন অর্ডার পরিমাণ (৳)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({...formData, min_order_amount: e.target.value})}
                  placeholder="500"
                />
              </div>

              <div>
                <Label htmlFor="max_uses">সর্বোচ্চ ব্যবহার সংখ্যা</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                  placeholder="100"
                />
              </div>

              <div>
                <Label htmlFor="expires_at">মেয়াদ শেষ</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {promoCodes.map((promo) => (
          <Card key={promo.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{promo.code}</h3>
                  <Badge variant={promo.is_active ? "default" : "secondary"}>
                    {promo.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {promo.discount_type === 'percentage' 
                    ? `${promo.discount_value}% ছাড়` 
                    : `৳${promo.discount_value} ছাড়`}
                </p>
                <p className="text-sm">
                  সর্বনিম্ন অর্ডার: ৳{promo.min_order_amount}
                </p>
                {promo.max_uses && (
                  <p className="text-sm">
                    ব্যবহার: {promo.used_count}/{promo.max_uses}
                  </p>
                )}
                {promo.expires_at && (
                  <p className="text-sm">
                    মেয়াদ শেষ: {new Date(promo.expires_at).toLocaleDateString('bn-BD')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(promo.id, promo.is_active)}
                >
                  {promo.is_active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(promo)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(promo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {promoCodes.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">কোন প্রমো কোড পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}