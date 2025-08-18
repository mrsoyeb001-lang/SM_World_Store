import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Globe
} from 'lucide-react';

interface SiteSettings {
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
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'site_settings')
      .maybeSingle();
    
    if (data?.value) {
      setSettings(data.value as unknown as SiteSettings);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{settings?.site?.name || "Badhon's World"}</h3>
            <p className="text-sm opacity-80">
              {settings?.site?.description || 'আপনার পছন্দের পণ্যের দোকান'}
            </p>
            <div className="flex gap-2">
              {settings?.social?.facebook && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {settings?.social?.instagram && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {settings?.social?.twitter && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {settings?.social?.youtube && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:underline">হোম</a></li>
              <li><a href="/products" className="hover:underline">সকল পণ্য</a></li>
              <li><a href="/favorites" className="hover:underline">পছন্দের তালিকা</a></li>
              <li><a href="/dashboard" className="hover:underline">ড্যাশবোর্ড</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold">কাস্টমার সার্ভিস</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard?tab=support" className="hover:underline">সাপোর্ট</a></li>
              <li><span>রিটার্ন পলিসি</span></li>
              <li><span>শিপিং তথ্য</span></li>
              <li><span>FAQ</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">যোগাযোগ</h4>
            <div className="space-y-2 text-sm">
              {settings?.contact?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{settings.contact.phone}</span>
                </div>
              )}
              {settings?.contact?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{settings.contact.email}</span>
                </div>
              )}
              {settings?.contact?.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{settings.contact.address}</span>
                </div>
              )}
              {settings?.contact?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <a href={settings.contact.website} className="hover:underline">
                    {settings.contact.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-80">
              {settings?.site?.footer_text || `© ${currentYear} Badhon's World. সকল অধিকার সংরক্ষিত।`}
            </p>
            <div className="flex gap-4 text-sm">
              <span>প্রাইভেসি পলিসি</span>
              <span>নিয়ম ও শর্তাবলী</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}