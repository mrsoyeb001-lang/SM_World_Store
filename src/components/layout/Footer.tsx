import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Globe,
  Home,
  ShoppingBag,
  Heart,
  LayoutDashboard,
  HelpCircle,
  RotateCcw,
  Truck,
  Info,
  ShieldCheck,
  FileText,
  Lock,
  MessageSquare,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

interface SiteSettings {
  contact: {
    phone: string;
    email: string;
    address: string;
    website: string;
    whatsapp?: string;
    messenger?: string;
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
    whatsapp?: string;
    tiktok?: string;
  };
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "site_settings")
      .maybeSingle();

    if (data?.value) {
      setSettings(data.value as unknown as SiteSettings);
    }
  };

  const currentYear = new Date().getFullYear();
  const brand = settings?.site?.name || "SM World Store";

  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-gray-200 relative overflow-hidden">
      {/* Background animation effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 animate-pulse"></div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand / About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">
                {brand}
              </h3>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              {settings?.site?.description ||
                "আপনার পছন্দের পণ্য সেরা দামে—বিশ্বস্ত ও দ্রুত ডেলিভারিতে।"}
            </p>

            {/* Socials Top */}
            <div className="flex gap-3 pt-2 flex-wrap">
              {settings?.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-blue-600 transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-white" />
                </a>
              )}
              {settings?.social?.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-pink-500 transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>
              )}
              {settings?.social?.twitter && (
                <a
                  href={settings.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-sky-500 transition"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4 text-white" />
                </a>
              )}
              {settings?.social?.youtube && (
                <a
                  href={settings.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-red-600 transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links with icons */}
          <nav aria-label="Quick links">
            <h4 className="font-semibold text-white mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="group inline-flex items-center gap-2 hover:underline">
                  <Home className="w-4 h-4" />
                  হোম
                </Link>
              </li>
              <li>
                <Link to="/products" className="group inline-flex items-center gap-2 hover:underline">
                  <ShoppingBag className="w-4 h-4" />
                  সকল পণ্য
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="group inline-flex items-center gap-2 hover:underline">
                  <Heart className="w-4 h-4" />
                  পছন্দের তালিকা
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="group inline-flex items-center gap-2 hover:underline">
                  <LayoutDashboard className="w-4 h-4" />
                  ড্যাশবোর্ড
                </Link>
              </li>
              <li>
                <Link to="/about" className="group inline-flex items-center gap-2 hover:underline">
                  <Info className="w-4 h-4" />
                  আমাদের সম্পর্কে
                </Link>
              </li>
            </ul>
          </nav>

          {/* Customer Service */}
          <nav aria-label="Customer service">
            <h4 className="font-semibold text-white mb-4">কাস্টমার সার্ভিস</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/support" className="group inline-flex items-center gap-2 hover:underline">
                  <HelpCircle className="w-4 h-4" />
                  সাপোর্ট / হেল্প সেন্টার
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="group inline-flex items-center gap-2 hover:underline">
                  <RotateCcw className="w-4 h-4" />
                  রিটার্ন পলিসি
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="group inline-flex items-center gap-2 hover:underline">
                  <Truck className="w-4 h-4" />
                  শিপিং তথ্য
                </Link>
              </li>
              <li>
                <Link to="/faq" className="group inline-flex items-center gap-2 hover:underline">
                  <FileText className="w-4 h-4" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="group inline-flex items-center gap-2 hover:underline">
                  <ShieldCheck className="w-4 h-4" />
                  ওয়ারেন্টি ও গ্যারান্টি
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <section aria-label="Contact">
            <h4 className="font-semibold text-white mb-4">যোগাযোগ</h4>
            <div className="space-y-3 text-sm">
              {settings?.contact?.phone && (
                <a href={`tel:${settings.contact.phone}`} className="group flex items-center gap-2 hover:underline">
                  <Phone className="w-4 h-4" />
                  <span>{settings.contact.phone}</span>
                </a>
              )}
              {settings?.contact?.email && (
                <a href={`mailto:${settings.contact.email}`} className="group flex items-center gap-2 hover:underline">
                  <Mail className="w-4 h-4" />
                  <span>{settings.contact.email}</span>
                </a>
              )}
              {settings?.contact?.website && (
                <a href={settings.contact.website} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:underline">
                  <Globe className="w-4 h-4" />
                  {settings.contact.website}
                </a>
              )}
              {settings?.contact?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{settings.contact.address}</span>
                </div>
              )}

              {/* Social Links with icons */}
              <div className="flex gap-3 pt-3 flex-wrap">
                {settings?.social?.whatsapp && (
                  <a href={`https://wa.me/${settings.social.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition">
                    <FaWhatsapp className="w-4 h-4 text-white" />
                  </a>
                )}
                {settings?.social?.tiktok && (
                  <a href={settings.social.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-black hover:bg-gray-800 transition">
                    <FaTiktok className="w-4 h-4 text-white" />
                  </a>
                )}
                {settings?.social?.instagram && (
                  <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-pink-500 hover:bg-pink-600 transition">
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                )}
                {settings?.social?.facebook && (
                  <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition">
                    <Facebook className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <h4 className="font-semibold text-white mb-4">Payment Methods</h4>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { src: "/payments/bkash.png", alt: "bKash" },
              { src: "/payments/nagad.png", alt: "Nagad" },
              { src: "/payments/rocket.png", alt: "Rocket" },
            ].map((p) => (
              <div key={p.alt} className="p-2 bg-white rounded-md shadow-md">
                <img src={p.src} alt={p.alt} className="h-8 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="opacity-70 text-center md:text-left">
            {settings?.site?.footer_text || `© ${currentYear} ${brand}. সকল অধিকার সংরক্ষিত।`}
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-5">
            <Link to="/privacy" className="inline-flex items-center gap-1 hover:underline">
              <Lock className="w-4 h-4" />
              প্রাইভেসি পলিসি
            </Link>
            <Link to="/terms" className="inline-flex items-center gap-1 hover:underline">
              <FileText className="w-4 h-4" />
              নিয়ম ও শর্তাবলী
            </Link>
            <Link to="/refund-policy" className="inline-flex items-center gap-1 hover:underline">
              <RotateCcw className="w-4 h-4" />
              রিফান্ড পলিসি
            </Link>
            <Link to="/seller-policy" className="inline-flex items-center gap-1 hover:underline">
              <ShieldCheck className="w-4 h-4" />
              সেলার পলিসি
            </Link>
            <Link to="/cookie-policy" className="inline-flex items-center gap-1 hover:underline">
              <Info className="w-4 h-4" />
              কুকি পলিসি
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
