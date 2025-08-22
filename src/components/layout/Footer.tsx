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
  ChevronRight,
  CreditCard,
  MessageCircle,
  ThumbsUp,
  Award,
  Clock,
  Users,
  Star
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
    <footer className="bg-gradient-to-b from-[#0f172a] to-[#0a0e1c] text-gray-300 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-blue-900 opacity-20"></div>
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-purple-900 opacity-20"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {brand}
                </h3>
              </div>
            </Link>
            
            <p className="text-sm opacity-80 leading-relaxed">
              {settings?.site?.description ||
                "আপনার পছন্দের পণ্য সেরা দামে—বিশ্বস্ত ও দ্রুত ডেলিভারিতে।"}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                <ShieldCheck className="w-3 h-3 text-green-400" />
                <span className="text-xs">সুরক্ষিত</span>
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                <Clock className="w-3 h-3 text-blue-400" />
                <span className="text-xs">২৪/৭ সাপোর্ট</span>
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                <ThumbsUp className="w-3 h-3 text-yellow-400" />
                <span className="text-xs">গুণগত মান</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              {settings?.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/10 hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20"
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
                  className="p-3 rounded-full bg-white/10 hover:bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-pink-500/20"
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
                  className="p-3 rounded-full bg-white/10 hover:bg-sky-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-sky-500/20"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              )}
              {settings?.social?.youtube && (
                <a
                  href={settings.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/10 hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-red-500/20"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links" className="lg:pl-6">
            <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-blue-400" />
              দ্রুত লিংক
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="group inline-flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-blue-500/10 rounded-md group-hover:bg-blue-500/20 transition-colors">
                    <Home className="w-4 h-4 text-blue-400" />
                  </div>
                  <span>হোম</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="group inline-flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-purple-500/10 rounded-md group-hover:bg-purple-500/20 transition-colors">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>সকল পণ্য</span>
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="group inline-flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-pink-500/10 rounded-md group-hover:bg-pink-500/20 transition-colors">
                    <Heart className="w-4 h-4 text-pink-400" />
                  </div>
                  <span>পছন্দের তালিকা</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="group inline-flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-green-500/10 rounded-md group-hover:bg-green-500/20 transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-green-400" />
                  </div>
                  <span>ড্যাশবোর্ড</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="group inline-flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-amber-500/10 rounded-md group-hover:bg-amber-500/20 transition-colors">
                    <Info className="w-4 h-4 text-amber-400" />
                  </div>
                  <span>আমাদের সম্পর্কে</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Customer Service */}
          <nav aria-label="Customer service" className="lg:pl-6">
            <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-green-400" />
              কাস্টমার সার্ভিস
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/Support" className="group inline-flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-blue-500/10 rounded-md group-hover:bg-blue-500/20 transition-colors">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <span>সাপোর্ট / হেল্প সেন্টার</span>
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="group inline-flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-purple-500/10 rounded-md group-hover:bg-purple-500/20 transition-colors">
                    <RotateCcw className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>রিটার্ন পলিসি</span>
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="group inline-flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-amber-500/10 rounded-md group-hover:bg-amber-500/20 transition-colors">
                    <Truck className="w-4 h-4 text-amber-400" />
                  </div>
                  <span>শিপিং তথ্য</span>
                </Link>
              </li>
              <li>
                <Link to="/FAQ" className="group inline-flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-green-500/10 rounded-md group-hover:bg-green-500/20 transition-colors">
                    <FileText className="w-4 h-4 text-green-400" />
                  </div>
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="group inline-flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-red-500/10 rounded-md group-hover:bg-red-500/20 transition-colors">
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                  </div>
                  <span>ওয়ারেন্টি ও গ্যারান্টি</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact Information */}
          <section aria-label="Contact" className="lg:pl-6">
            <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-red-400" />
              যোগাযোগ
            </h4>
            <div className="space-y-4">
              {settings?.contact?.phone && (
                <a href={`tel:${settings.contact.phone}`} className="group flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-green-500/10 rounded-md group-hover:bg-green-500/20 transition-colors">
                    <Phone className="w-4 h-4 text-green-400" />
                  </div>
                  <span>{settings.contact.phone}</span>
                </a>
              )}
              {settings?.contact?.email && (
                <a href={`mailto:${settings.contact.email}`} className="group flex items-center gap-3 hover:text-white transition-colors py-1">
                  <div className="p-1.5 bg-blue-500/10 rounded-md group-hover:bg-blue-500/20 transition-colors">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <span>{settings.contact.email}</span>
                </a>
              )}
              {settings?.contact?.website && (
                <a
                  href={settings.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 hover:text-white transition-colors py-1"
                >
                  <div className="p-1.5 bg-purple-500/10 rounded-md group-hover:bg-purple-500/20 transition-colors">
                    <Globe className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="inline-flex items-center gap-1">
                    {settings.contact.website.replace(/^https?:\/\//, '')}
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </span>
                </a>
              )}
              {settings?.contact?.address && (
                <div className="flex items-start gap-3 py-1">
                  <div className="p-1.5 bg-amber-500/10 rounded-md mt-0.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                  <span>{settings.contact.address}</span>
                </div>
              )}

              {/* Social Media Contact Options */}
              <div className="pt-2">
                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">সোশ্যাল মিডিয়ায় আমরা</h5>
                <div className="flex gap-2">
                  {settings?.contact?.whatsapp && (
                    <a
                      href={`https://wa.me/${settings.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 px-3 py-2 rounded-md transition-colors group"
                    >
                      <MessageCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
                  )}
                  {settings?.contact?.messenger && (
                    <a
                      href={settings.contact.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-2 rounded-md transition-colors group"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Messenger</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

{/* Payment Methods Section */}
<div className="border-t border-white/10 pt-8 mb-8">
  <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
    <CreditCard className="w-5 h-5 text-blue-400" />
    পেমেন্ট Methods
  </h4>
  <div className="flex items-center gap-4 flex-wrap">
    {[
      { src: "/payments/bkash.png", alt: "bKash" },
      { src: "/payments/nagad.png", alt: "Nagad" },
      { src: "/payments/rocket.png", alt: "Rocket" },
      { src: "/payments/cashon.png", alt: "Cash on Delivery" },
    ].map((p) => (
      <div
        key={p.alt}
        className="inline-flex items-center justify-center bg-white rounded-md shadow-sm hover:shadow-lg transition duration-300"
        title={p.alt}
      >
        <img src={p.src} alt={p.alt} className="h-8 w-auto object-contain" />
      </div>
    ))}
  </div>
</div>


        {/* Copyright and Policies */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70 order-2 md:order-1">
            {settings?.site?.footer_text ||
              `© ${currentYear} ${brand}. সকল অধিকার সংরক্ষিত।`}
          </p>
          <div className="flex flex-wrap gap-4 text-sm order-1 md:order-2 mb-4 md:mb-0">
            <Link to="//privacy-policy" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <Lock className="w-4 h-4" />
              প্রাইভেসি পলিসি
            </Link>
            <Link to="/terms" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
              নিয়ম ও শর্তাবলী
            </Link>
            <Link to="/return-policy" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <RotateCcw className="w-4 h-4" />
              রিফান্ড পলিসি
            </Link>
            <Link to="/seller-policy" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
              সেলার পলিসি
            </Link>
            <Link to="/cookie-policy" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <Info className="w-4 h-4" />
              কুকি পলিসি
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
