import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  CreditCard, 
  Truck, 
  Phone, 
  Mail,
  Globe,
  Save
} from 'lucide-react';

interface SiteSettings {
  payment_methods: {
    bkash: {
      enabled: boolean;
      number: string;
      instructions: string;
    };
    nagad: {
      enabled: boolean;
      number: string;
      instructions: string;
    };
    rocket: {
      enabled: boolean;
      number: string;
      instructions: string;
    };
    cash_on_delivery: {
      enabled: boolean;
      fee: number;
    };
  };
  shipping: {
    default_rate: number;
    free_shipping_threshold: number;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    website: string;
  };
  site: {
    name: string;
    description: string;
    footer_text: string;
  };
}

const defaultSettings: SiteSettings = {
  payment_methods: {
    bkash: {
      enabled: true,
      number: '',
      instructions: 'Send Money করুন এই নম্বরে এবং Transaction ID দিন।'
    },
    nagad: {
      enabled: true,
      number: '',
      instructions: 'Send Money করুন এই নম্বরে এবং Transaction ID দিন।'
    },
    rocket: {
      enabled: true,
      number: '',
      instructions: 'Send Money করুন এই নম্বরে এবং Transaction ID দিন।'
    },
    cash_on_delivery: {
      enabled: true,
      fee: 0
    }
  },
  shipping: {
    default_rate: 60,
    free_shipping_threshold: 1000
  },
  contact: {
    phone: '',
    email: '',
    address: '',
    website: ''
  },
  site: {
    name: "Badhon's World",
    description: 'আপনার পছন্দের পণ্যের দোকান',
    footer_text: '© 2024 Badhon\'s World. সকল অধিকার সংরক্ষিত।'
  }
};

export default function SiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .eq('key', 'site_settings')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
    } else if (data && typeof data.value === 'object' && data.value !== null) {
      setSettings({ ...defaultSettings, ...(data.value as unknown as SiteSettings) });
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'site_settings',
        value: settings as any,
        description: 'Site configuration settings'
      })
      .eq('key', 'site_settings');

    if (error) {
      toast({
        title: "সেটিংস সংরক্ষণ ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "সেটিংস সংরক্ষিত",
        description: "সাইট সেটিংস সফলভাবে আপডেট হয়েছে।"
      });
    }
    setSaving(false);
  };

  const updatePaymentMethod = (method: keyof SiteSettings['payment_methods'], field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      payment_methods: {
        ...prev.payment_methods,
        [method]: {
          ...prev.payment_methods[method],
          [field]: value
        }
      }
    }));
  };

  const updateShipping = (field: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        [field]: value
      }
    }));
  };

  const updateContact = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const updateSite = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      site: {
        ...prev.site,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">সাইট সেটিংস</h2>
        <Button onClick={saveSettings} disabled={saving} className="btn-gradient">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
        </Button>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            পেমেন্ট মেথড সেটিংস
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* bKash */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.payment_methods.bkash.enabled}
                onChange={(e) => updatePaymentMethod('bkash', 'enabled', e.target.checked)}
                className="w-4 h-4"
              />
              <Label className="text-lg font-medium text-pink-600">বিকাশ</Label>
            </div>
            {settings.payment_methods.bkash.enabled && (
              <div className="ml-6 space-y-3">
                <div>
                  <Label htmlFor="bkash-number">বিকাশ নম্বর</Label>
                  <Input
                    id="bkash-number"
                    value={settings.payment_methods.bkash.number}
                    onChange={(e) => updatePaymentMethod('bkash', 'number', e.target.value)}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="bkash-instructions">নির্দেশনা</Label>
                  <Textarea
                    id="bkash-instructions"
                    value={settings.payment_methods.bkash.instructions}
                    onChange={(e) => updatePaymentMethod('bkash', 'instructions', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Nagad */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.payment_methods.nagad.enabled}
                onChange={(e) => updatePaymentMethod('nagad', 'enabled', e.target.checked)}
                className="w-4 h-4"
              />
              <Label className="text-lg font-medium text-orange-600">নগদ</Label>
            </div>
            {settings.payment_methods.nagad.enabled && (
              <div className="ml-6 space-y-3">
                <div>
                  <Label htmlFor="nagad-number">নগদ নম্বর</Label>
                  <Input
                    id="nagad-number"
                    value={settings.payment_methods.nagad.number}
                    onChange={(e) => updatePaymentMethod('nagad', 'number', e.target.value)}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="nagad-instructions">নির্দেশনা</Label>
                  <Textarea
                    id="nagad-instructions"
                    value={settings.payment_methods.nagad.instructions}
                    onChange={(e) => updatePaymentMethod('nagad', 'instructions', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Rocket */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.payment_methods.rocket.enabled}
                onChange={(e) => updatePaymentMethod('rocket', 'enabled', e.target.checked)}
                className="w-4 h-4"
              />
              <Label className="text-lg font-medium text-purple-600">রকেট</Label>
            </div>
            {settings.payment_methods.rocket.enabled && (
              <div className="ml-6 space-y-3">
                <div>
                  <Label htmlFor="rocket-number">রকেট নম্বর</Label>
                  <Input
                    id="rocket-number"
                    value={settings.payment_methods.rocket.number}
                    onChange={(e) => updatePaymentMethod('rocket', 'number', e.target.value)}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="rocket-instructions">নির্দেশনা</Label>
                  <Textarea
                    id="rocket-instructions"
                    value={settings.payment_methods.rocket.instructions}
                    onChange={(e) => updatePaymentMethod('rocket', 'instructions', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Cash on Delivery */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.payment_methods.cash_on_delivery.enabled}
                onChange={(e) => updatePaymentMethod('cash_on_delivery', 'enabled', e.target.checked)}
                className="w-4 h-4"
              />
              <Label className="text-lg font-medium text-green-600">ক্যাশ অন ডেলিভারি</Label>
            </div>
            {settings.payment_methods.cash_on_delivery.enabled && (
              <div className="ml-6">
                <Label htmlFor="cod-fee">অতিরিক্ত ফি (৳)</Label>
                <Input
                  id="cod-fee"
                  type="number"
                  value={settings.payment_methods.cash_on_delivery.fee}
                  onChange={(e) => updatePaymentMethod('cash_on_delivery', 'fee', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            শিপিং সেটিংস
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping-rate">ডিফল্ট শিপিং চার্জ (৳)</Label>
              <Input
                id="shipping-rate"
                type="number"
                value={settings.shipping.default_rate}
                onChange={(e) => updateShipping('default_rate', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="free-shipping">ফ্রি শিপিং এর জন্য মিনিমাম অর্ডার (৳)</Label>
              <Input
                id="free-shipping"
                type="number"
                value={settings.shipping.free_shipping_threshold}
                onChange={(e) => updateShipping('free_shipping_threshold', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            যোগাযোগের তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact-phone">ফোন নম্বর</Label>
              <Input
                id="contact-phone"
                value={settings.contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <Label htmlFor="contact-email">ইমেইল</Label>
              <Input
                id="contact-email"
                type="email"
                value={settings.contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                placeholder="info@example.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="contact-address">ঠিকানা</Label>
            <Textarea
              id="contact-address"
              value={settings.contact.address}
              onChange={(e) => updateContact('address', e.target.value)}
              placeholder="সম্পূর্ণ ঠিকানা লিখুন"
            />
          </div>
          <div>
            <Label htmlFor="contact-website">ওয়েবসাইট</Label>
            <Input
              id="contact-website"
              value={settings.contact.website}
              onChange={(e) => updateContact('website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Site Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            সাইট তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="site-name">সাইটের নাম</Label>
            <Input
              id="site-name"
              value={settings.site.name}
              onChange={(e) => updateSite('name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="site-description">সাইটের বিবরণ</Label>
            <Textarea
              id="site-description"
              value={settings.site.description}
              onChange={(e) => updateSite('description', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="footer-text">ফুটার টেক্সট</Label>
            <Input
              id="footer-text"
              value={settings.site.footer_text}
              onChange={(e) => updateSite('footer_text', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}