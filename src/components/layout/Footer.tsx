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
  MessageCircle,
  Linkedin,
  Pinterest,
  Tiktok,
  CreditCard
} from "lucide-react";

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
    linkedin?: string;
    pinterest?: string;
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
    <footer className="bg-gradient-to-b from-[#0f172a] to-[#0a0e1d] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand / About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-extrabold tracking-tight text-white bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {brand}
              </h3>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              {settings?.site?.description ||
                "আপনার পছন্দের পণ্য সেরা দামে—বিশ্বস্ত ও দ্রুত ডেলিভারিতে।"}
            </p>

            {/* Socials */}
            <div className="flex gap-3 pt-1">
              {settings?.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1"
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
                  className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 transform hover:-translate-y-1"
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
                  className="p-2 rounded-full bg-white/10 hover:bg-sky-500 transition-all duration-300 transform hover:-translate-y-1"
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
                  className="p-2 rounded-full bg-white/10 hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-white" />
                </a>
              )}
              {settings?.social?.linkedin && (
                <a
                  href={settings.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-white" />
                </a>
              )}
              {settings?.social?.pinterest && (
                <a
                  href={settings.social.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-red-500 transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Pinterest"
                >
                  <Pinterest className="w-4 h-4 text-white" />
                </a>
              )}
              {settings?.social?.tiktok && (
                <a
                  href={settings.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-black transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="TikTok"
                >
                  <Tiktok className="w-4 h-4 text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links with icons */}
          <nav aria-label="Quick links">
            <h4 className="font-semibold text-white mb-4 text-lg border-l-4 border-cyan-400 pl-2">দ্রুত লিংক</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="group inline-flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <Home className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  হোম
                </Link>
              </li>
              <li>
                <Link to="/products" className="group inline-flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <ShoppingBag className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  সকল পণ্য
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="group inline-flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <Heart className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  পছন্দের তালিকা
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="group inline-flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <LayoutDashboard className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  ড্যাশবোর্ড
                </Link>
              </li>
              <li>
                <Link to="/about" className="group inline-flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <Info className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  আমাদের সম্পর্কে
                </Link>
              </li>
            </ul>
          </nav>

          {/* Customer Service with icons */}
          <nav aria-label="Customer service">
            <h4 className="font-semibold text-white mb-4 text-lg border-l-4 border-cyan-400 pl-2">কাস্টমার সার্ভিস</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/Support" className="group inline-flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <HelpCircle className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  সাপোর্ট / হেল্প সেন্টার
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="group inline-flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <RotateCcw className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  রিটার্ন পলিসি
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="group inline-flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <Truck className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  শিপিং তথ্য
                </Link>
              </li>
              <li>
                <Link to="/FAQ" className="group inline-flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <FileText className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="group inline-flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <ShieldCheck className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  ওয়ারেন্টি ও গ্যারান্টি
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact – richer with icons & links */}
          <section aria-label="Contact">
            <h4 className="font-semibold text-white mb-4 text-lg border-l-4 border-cyan-400 pl-2">যোগাযোগ</h4>
            <div className="space-y-3 text-sm">
              {settings?.contact?.phone && (
                <a href={`tel:${settings.contact.phone}`} className="group flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <Phone className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  <span>{settings.contact.phone}</span>
                </a>
              )}
              {settings?.contact?.email && (
                <a href={`mailto:${settings.contact.email}`} className="group flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200">
                  <Mail className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  <span>{settings.contact.email}</span>
                </a>
              )}
              {settings?.contact?.website && (
                <a
                  href={settings.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200"
                >
                  <Globe className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-all duration-200" />
                  <span className="inline-flex items-center gap-1">
                    {settings.contact.website}
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </span>
                </a>
              )}
              {settings?.contact?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 opacity-80" />
                  <span>{settings.contact.address}</span>
                </div>
              )}

              {/* Optional richer contact actions */}
              <div className="flex gap-3 pt-2">
                {settings?.contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-3 py-1 rounded-md bg-green-600/20 hover:bg-green-600/40 transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs">WhatsApp</span>
                  </a>
                )}
                {settings?.contact?.messenger && (
                  <a
                    href={settings.contact.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/40 transition-all duration-300"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-xs">Messenger</span>
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            Payment Methods
          </h4>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { src: "/payments/bkash.png", alt: "bKash" },
              { src: "/payments/nagad.png", alt: "Nagad" },
              { src: "/payments/rocket.png", alt: "Rocket" },
              { src: "/payments/cashon.png", alt: "Cash on Delivery" },
              { src: "/payments/visa.png", alt: "Visa" },
              { src: "/payments/mastercard.png", alt: "Mastercard" },
              { src: "/payments/amex.png", alt: "American Express" },
            ].map((p) => (
              <div
                key={p.alt}
                className="inline-flex items-center justify-center bg-white p-2 rounded-md shadow-sm ring-1 ring-black/5 hover:scale-105 transition-transform duration-200"
                title={p.alt}
              >
                <img src={p.src} alt={p.alt} className="h-6 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar with all policies as links */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70 order-2 md:order-1 text-center md:text-left">
            {settings?.site?.footer_text ||
              `© ${currentYear} ${brand}. সকল অধিকার সংরক্ষিত।`}
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-sm order-1 md:order-2 mb-4 md:mb-0">
            <Link to="/privacy" className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors duration-200">
              <Lock className="w-4 h-4" />
              প্রাইভেসি পলিসি
            </Link>
            <Link to="/terms" className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors duration-200">
              <FileText className="w-4 h-4" />
              নিয়ম ও শর্তাবলী
            </Link>
            <Link to="/return-policy" className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors duration-200">
              <RotateCcw className="w-4 h-4" />
              রিফান্ড পলিসি
            </Link>
            <Link to="/seller-policy" className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors duration-200">
              <ShieldCheck className="w-4 h-4" />
              সেলার পলিসি
            </Link>
            <Link to="/cookie-policy" className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors duration-200">
              <Info className="w-4 h-4" />
              কুকি পলিসি
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
