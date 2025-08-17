import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  description: string;
}

export default function SettingsManagement() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
      });
      
      setSettings(settingsMap);
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "সেটিংস লোড করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key,
          value: JSON.stringify(value),
          description: getSettingDescription(key)
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      throw error;
    }
  };

  const getSettingDescription = (key: string) => {
    const descriptions: Record<string, string> = {
      'payment_bkash_number': 'বিকাশ নাম্বার',
      'payment_rocket_number': 'রকেট নাম্বার', 
      'payment_nagad_number': 'নগদ নাম্বার',
      'website_title': 'ওয়েবসাইট টাইটেল',
      'website_description': 'ওয়েবসাইট বিবরণ'
    };
    return descriptions[key] || key;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save all settings
      await Promise.all([
        updateSetting('payment_bkash_number', settings.payment_bkash_number || ''),
        updateSetting('payment_rocket_number', settings.payment_rocket_number || ''),
        updateSetting('payment_nagad_number', settings.payment_nagad_number || ''),
        updateSetting('website_title', settings.website_title || ''),
        updateSetting('website_description', settings.website_description || '')
      ]);

      toast({
        title: "সফল",
        description: "সেটিংস সেভ হয়েছে।"
      });
    } catch (error: any) {
      toast({
        title: "ত্রুটি", 
        description: "সেটিংস সেভ করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">সেটিংস ব্যবস্থাপনা</h2>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">ওয়েবসাইট তথ্য</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="website_title">ওয়েবসাইট টাইটেল</Label>
              <Input
                id="website_title"
                value={settings.website_title || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, website_title: e.target.value }))}
                placeholder="আমার ই-কমার্স"
              />
            </div>
            <div>
              <Label htmlFor="website_description">ওয়েবসাইট বিবরণ</Label>
              <Textarea
                id="website_description"
                value={settings.website_description || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, website_description: e.target.value }))}
                placeholder="সেরা পণ্যের জন্য আমাদের সাথে থাকুন"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">পেমেন্ট নাম্বার</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bkash_number">বিকাশ নাম্বার</Label>
              <Input
                id="bkash_number"
                value={settings.payment_bkash_number || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, payment_bkash_number: e.target.value }))}
                placeholder="01XXXXXXXXX"
              />
              <p className="text-sm text-muted-foreground mt-1">
                গ্রাহকরা এই নাম্বারে বিকাশ পেমেন্ট পাঠাবেন
              </p>
            </div>
            <div>
              <Label htmlFor="rocket_number">রকেট নাম্বার</Label>
              <Input
                id="rocket_number"
                value={settings.payment_rocket_number || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, payment_rocket_number: e.target.value }))}
                placeholder="01XXXXXXXXX"
              />
              <p className="text-sm text-muted-foreground mt-1">
                গ্রাহকরা এই নাম্বারে রকেট পেমেন্ট পাঠাবেন
              </p>
            </div>
            <div>
              <Label htmlFor="nagad_number">নগদ নাম্বার</Label>
              <Input
                id="nagad_number"
                value={settings.payment_nagad_number || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, payment_nagad_number: e.target.value }))}
                placeholder="01XXXXXXXXX"
              />
              <p className="text-sm text-muted-foreground mt-1">
                গ্রাহকরা এই নাম্বারে নগদ পেমেন্ট পাঠাবেন
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">গুরুত্বপূর্ণ নির্দেশনা</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• পেমেন্ট নাম্বার পরিবর্তন করার পর চেকআউট পেজে সেই নাম্বার দেখানো হবে।</p>
            <p>• গ্রাহকরা পেমেন্ট করার সময় এই নাম্বারগুলো দেখতে পাবেন।</p>
            <p>• সেটিংস পরিবর্তন করার পর অবশ্যই সেভ বাটনে ক্লিক করুন।</p>
          </div>
        </Card>
      </div>
    </div>
  );
}