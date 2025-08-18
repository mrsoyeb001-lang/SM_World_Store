import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2 } from 'lucide-react';

interface AffiliateApplicationFormProps {
  onApplicationSubmitted?: () => void;
}

export function AffiliateApplicationForm({ onApplicationSubmitted }: AffiliateApplicationFormProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    nid_number: '',
    address: profile?.address || '',
    bank_account: '',
    mobile_banking: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('affiliate_applications')
        .insert({
          user_id: user.id,
          ...formData
        });

      if (error) throw error;

      toast({
        title: "আবেদন সফল!",
        description: "আপনার অ্যাফিলিয়েট আবেদন জমা হয়েছে। আমরা শীঘ্রই যাচাই করে জানাবো।"
      });

      setOpen(false);
      onApplicationSubmitted?.();
    } catch (error: any) {
      toast({
        title: "আবেদন ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gradient">
          <UserPlus className="mr-2 h-4 w-4" />
          এফিলিয়েট যোগ দিন
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>এফিলিয়েট আবেদন</DialogTitle>
          <DialogDescription>
            এফিলিয়েট প্রোগ্রামে যোগ দিতে নিচের তথ্য সঠিকভাবে পূরণ করুন।
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="full_name">পূর্ণ নাম *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                  placeholder="আপনার পূর্ণ নাম"
                />
              </div>

              <div>
                <Label htmlFor="phone">ফোন নম্বর *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="০১XXXXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="nid_number">এনআইডি নম্বর *</Label>
                <Input
                  id="nid_number"
                  value={formData.nid_number}
                  onChange={(e) => setFormData({...formData, nid_number: e.target.value})}
                  required
                  placeholder="আপনার জাতীয় পরিচয়পত্র নম্বর"
                />
              </div>

              <div>
                <Label htmlFor="address">সম্পূর্ণ ঠিকানা *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  placeholder="আপনার সম্পূর্ণ ঠিকানা"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="bank_account">ব্যাংক অ্যাকাউন্ট তথ্য</Label>
                <Input
                  id="bank_account"
                  value={formData.bank_account}
                  onChange={(e) => setFormData({...formData, bank_account: e.target.value})}
                  placeholder="ব্যাংক নাম ও অ্যাকাউন্ট নম্বর (ঐচ্ছিক)"
                />
              </div>

              <div>
                <Label htmlFor="mobile_banking">মোবাইল ব্যাংকিং তথ্য</Label>
                <Input
                  id="mobile_banking"
                  value={formData.mobile_banking}
                  onChange={(e) => setFormData({...formData, mobile_banking: e.target.value})}
                  placeholder="বিকাশ/নগদ/রকেট নম্বর (ঐচ্ছিক)"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">এফিলিয়েট প্রোগ্রাম শর্তাবলী:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• প্রতি বিক্রয়ে ৫-৭% কমিশন পাবেন</li>
                  <li>• মাসিক উইথড্র করতে পারবেন</li>
                  <li>• সব তথ্য সঠিক ও যাচাইযোগ্য হতে হবে</li>
                  <li>• মিথ্যা তথ্য দিলে আবেদন বাতিল হবে</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full btn-gradient"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    আবেদন জমা দিচ্ছি...
                  </>
                ) : (
                  'আবেদন জমা দিন'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}