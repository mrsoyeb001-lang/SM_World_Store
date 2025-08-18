import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, MapPin, Save, Loader2 } from 'lucide-react';

export function ProfileEditor() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "প্রোফাইল আপডেট সফল",
        description: "আপনার প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে।"
      });
    } catch (error: any) {
      toast({
        title: "প্রোফাইল আপডেট ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          প্রোফাইল সম্পাদনা
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">পূর্ণ নাম</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="আপনার পূর্ণ নাম লিখুন"
            />
          </div>

          <div>
            <Label htmlFor="email">ইমেইল (পরিবর্তনযোগ্য নয়)</Label>
            <Input
              id="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <Label htmlFor="phone">ফোন নম্বর</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="০১XXXXXXXXX"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="city">শহর</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              placeholder="আপনার শহরের নাম"
            />
          </div>

          <div>
            <Label htmlFor="address">সম্পূর্ণ ঠিকানা</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                className="pl-10 resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>ইউজার আইডি:</strong> {user?.id}
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                আপডেট করা হচ্ছে...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                প্রোফাইল আপডেট করুন
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}