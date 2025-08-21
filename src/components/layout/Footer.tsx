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
  Star,
  Award,
  ThumbsUp,
  Clock,
  HeadphonesIcon,
  CreditCard,
  Shield,
  TruckIcon,
  RefreshCw,
  CheckCircle
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
    <footer className="bg-gradient-to-b from-[#0f172a] to-[#1a243d] text-gray-300">
      {/* Trust Badges Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <TruckIcon className="w-6 h-6 text-yellow-300" />
              <span className="text-sm font-medium text-white">দ্রুত ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-yellow-300" />
              <span className="text-sm font-medium text-white">সুরক্ষিত পেমেন্ট</span>
            </div>
            <div className="flex items-center gap-2">
              <HeadphonesIcon className="w-6 h-6 text-yellow-300" />
              <span className="text-sm font-medium text-white">২৪/৭ সাপোর্ট</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-yellow-300" />
              <span className="text-sm font-medium text-white">সহজ রিটার্ন</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {brand}
              </h3>
            </Link>
            <p className="text-sm leading-relaxed opacity-90">
              {settings?.site?.description ||
                "আপনার পছন্দের পণ্য সেরা দামে—বিশ্বস্ত ও দ্রুত ডেলিভারিতে।"}
            </p>
            
            {/* Social Media */}
            <div className="pt-2">
              <h4 className="font-semibold text-white mb-3">আমাদের অনুসরণ করুন</h4>
              <div className="flex gap-3">
                {settings?.social?.facebook && (
                  <a
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-110 shadow-md"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                )}
                {settings?.social?.instagram && (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-110 shadow-md"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                )}
                {settings?.social?.twitter && (
                  <a
                    href={settings.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-sky-500 hover:bg-sky-600 transition-all transform hover:scale-110 shadow-md"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                )}
                {settings?.social?.youtube && (
                  <a
                    href={settings.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all transform hover:scale-110 shadow-md"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5 text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-lg flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Home className="w-5 h-5 text-white" />
              </span>
              দ্রুত লিংক
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition">
                    <Home className="w-4 h-4 text-blue-400 group-hover:text-white" />
                  </div>
                  <span>হোমপেজ</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition">
                    <ShoppingBag className="w-4 h-4 text-green-400 group-hover:text-white" />
                  </div>
                  <span>সকল পণ্য</span>
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center group-hover:bg-pink-500 transition">
                    <Heart className="w-4 h-4 text-pink-400 group-hover:text-white" />
                  </div>
                  <span>পছন্দের তালিকা</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition">
                    <LayoutDashboard className="w-4 h-4 text-purple-400 group-hover:text-white" />
                  </div>
                  <span>ড্যাশবোর্ড</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-500 transition">
                    <Info className="w-4 h-4 text-cyan-400 group-hover:text-white" />
                  </div>
                  <span>আমাদের সম্পর্কে</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-lg flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                <HeadphonesIcon className="w-5 h-5 text-white" />
              </span>
              গ্রাহক সেবা
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/Support" className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition">
                    <HelpCircle className="w-4 h-4 text-amber-400 group-hover:text-white" />
                  </div>
                  <span>সাপোর্ট সেন্টার</span>
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition">
                    <RotateCcw className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                  </div>
                  <span>রিটার্ন পলিসি</span>
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500 transition">
                    <Truck className="w-4 h-4 text-orange-400 group-hover:text-white" />
                  </div>
                  <span>শিপিং তথ্য</span>
                </Link>
              </li>
              <li>
                <Link to="/FAQ" className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition">
                    <FileText className="w-4 h-4 text-indigo-400 group-hover:text-white" />
                  </div>
                  <span>প্রশ্নোত্তর</span>
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center group-hover:bg-teal-500 transition">
                    <ShieldCheck className="w-4 h-4 text-teal-400 group-hover:text-white" />
                  </div>
                  <span>ওয়ারেন্টি</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-lg flex items-center gap-2">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg">
                <Phone className="w-5 h-5 text-white" />
              </span>
              যোগাযোগ
            </h4>
            <div className="space-y-4">
              {settings?.contact?.phone && (
                <a href={`tel:${settings.contact.phone}`} className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition">
                    <Phone className="w-4 h-4 text-green-400 group-hover:text-white" />
                  </div>
                  <span>{settings.contact.phone}</span>
                </a>
              )}
              {settings?.contact?.email && (
                <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-3 py-2 hover:text-blue-300 transition group">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition">
                    <Mail className="w-4 h-4 text-red-400 group-hover:text-white" />
                  </div>
                  <span>{settings.contact.email}</span>
                </a>
              )}
              {settings?.contact?.address && (
                <div className="flex items-start gap-3 py-2">
                  <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center mt-1">
                    <MapPin className="w-4 h-4 text-rose-400" />
                  </div>
                  <span>{settings.contact.address}</span>
                </div>
              )}
              {settings?.contact?.website && (
                <a
                  href={settings.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-2 hover:text-blue-300 transition group"
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition">
                    <Globe className="w-4 h-4 text-blue-400 group-hover:text-white" />
                  </div>
                  <span className="flex items-center gap-1">
                    আমাদের ওয়েবসাইট
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              )}

              {/* WhatsApp & Messenger */}
              <div className="flex gap-3 pt-2">
                {settings?.contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition flex-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">WhatsApp</span>
                  </a>
                )}
                {settings?.contact?.messenger && (
                  <a
                    href={settings.contact.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Messenger</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h4 className="font-semibold text-white mb-5 text-center">সুবিধাজনক পেমেন্ট মাধ্যম</h4>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {[
              { src: "/payments/bkash.png", alt: "bKash", name: "bKash" },
              { src: "/payments/nagad.png", alt: "Nagad", name: "Nagad" },
              { src: "/payments/rocket.png", alt: "Rocket", name: "Rocket" },
              { src: "/payments/visa.png", alt: "Visa", name: "Visa" },
              { src: "/payments/mastercard.png", alt: "MasterCard", name: "MasterCard" },
              { src: "/payments/amex.png", alt: "American Express", name: "Amex" },
              { src: "/payments/cashon.png", alt: "Cash on Delivery", name: "Cash on Delivery" },
            ].map((p) => (
              <div
                key={p.alt}
                className="flex flex-col items-center bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition group"
                title={p.alt}
              >
                <img src={p.src} alt={p.alt} className="h-6 w-auto object-contain mb-1" />
                <span className="text-xs opacity-70 group-hover:opacity-100">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Policies & Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70 text-center md:text-left">
            {settings?.site?.footer_text ||
              `© ${currentYear} ${brand}. সকল অধিকার সংরক্ষিত।`}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/privacy" className="inline-flex items-center gap-1 hover:text-blue-300 transition">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>গোপনীয়তা নীতি</span>
            </Link>
            <Link to="/terms" className="inline-flex items-center gap-1 hover:text-blue-300 transition">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>সেবার শর্তাবলী</span>
            </Link>
            <Link to="/return-policy" className="inline-flex items-center gap-1 hover:text-blue-300 transition">
              <RefreshCw className="w-4 h-4 text-green-400" />
              <span>রিটার্ন পলিসি</span>
            </Link>
          </div>
        </div>

        {/* Trust Seals */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span className="text-xs">১০০% সুরক্ষিত শপিং</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
            <Truck className="w-5 h-5 text-blue-400" />
            <span className="text-xs">সম্পূর্ণ বাংলাদেশে ডেলিভারি</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
            <CheckCircle className="w-5 h-5 text-amber-400" />
            <span className="text-xs">অথেন্টিক প্রোডাক্ট</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
