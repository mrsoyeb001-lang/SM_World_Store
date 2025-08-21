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
  ChevronUp,
  ChevronDown,
  Award,
  Users,
  Clock,
  Gift,
  HeadphonesIcon,
  CreditCard,
  Star,
  CheckCircle,
  ArrowUpRight,
  Calendar,
  Shield,
  Package,
  ThumbsUp,
  TruckIcon,
  RefreshCw,
  Leaf,
  Sparkles
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
  features: {
    free_shipping?: boolean;
    secure_payment?: boolean;
    easy_returns?: boolean;
    support?: string;
  };
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchSettings();
    
    // Scroll animation
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    
    // Time updater
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      clearInterval(timer);
    };
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

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const currentYear = new Date().getFullYear();
  const brand = settings?.site?.name || "SM World Store";
  
  const formattedTime = currentTime.toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const formattedDate = currentTime.toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <footer className="bg-gradient-to-b from-[#0f172a] to-[#0a101f] text-gray-300 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Trust badges/features section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg">
            <TruckIcon className="w-8 h-8 text-green-400 mb-2" />
            <h4 className="font-semibold text-white text-sm mb-1">দ্রুত ডেলিভারি</h4>
            <p className="text-xs opacity-80">২৪-৪৮ ঘন্টার মধ্যে</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg">
            <Shield className="w-8 h-8 text-blue-400 mb-2" />
            <h4 className="font-semibold text-white text-sm mb-1">সুরক্ষিত পেমেন্ট</h4>
            <p className="text-xs opacity-80">১০০% নিরাপদ</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg">
            <RefreshCw className="w-8 h-8 text-amber-400 mb-2" />
            <h4 className="font-semibold text-white text-sm mb-1">সহজ রিটার্ন</h4>
            <p className="text-xs opacity-80">৭ দিনের মধ্যে</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg">
            <HeadphonesIcon className="w-8 h-8 text-purple-400 mb-2" />
            <h4 className="font-semibold text-white text-sm mb-1">২৪/৭ সাপোর্ট</h4>
            <p className="text-xs opacity-80">সর্বদা উপলব্ধ</p>
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 mb-12 border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                নিউজলেটার সাবস্ক্রাইব করুন
              </h3>
              <p className="opacity-80">আপনার ইমেইলে এক্সক্লুসিভ অফার এবং নতুন পণ্যের তথ্য পান</p>
            </div>
            <div className="flex-1 w-full">
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="আপনার ইমেইল এড্রেস" 
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
                  সাবস্ক্রাইব
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand/About section */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <h3 className="text-2xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                {brand}
                <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full">Official</span>
              </h3>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              {settings?.site?.description ||
                "আপনার পছন্দের পণ্য সেরা দামে—বিশ্বস্ত ও দ্রুত ডেলিভারিতে।"}
            </p>

            {/* Live support status */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-white">লাইভ সাপোর্ট</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>বর্তমান সময়: {formattedTime}</span>
                <span className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded">Online</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 pt-2">
              {settings?.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {settings?.social?.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-pink-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {settings?.social?.twitter && (
                <a
                  href={settings.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-sky-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {settings?.social?.youtube && (
                <a
                  href={settings.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </a>
              )}
              {settings?.social?.linkedin && (
                <a
                  href={settings.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links - with mobile accordion */}
          <div className="md:border-l md:border-white/10 md:pl-6">
            <button 
              className="flex justify-between items-center w-full md:hidden py-2 font-semibold text-white"
              onClick={() => toggleSection('quickLinks')}
            >
              <span>দ্রুত লিংক</span>
              {openSections.quickLinks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <h4 className="font-semibold text-white mb-4 hidden md:block">দ্রুত লিংক</h4>
            <ul className={`space-y-3 text-sm ${openSections.quickLinks ? 'block' : 'hidden'} md:block transition-all duration-300`}>
              <li>
                <Link to="/" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <Home className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-blue-400 transition-colors" />
                  হোম
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/products" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <ShoppingBag className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-blue-400 transition-colors" />
                  সকল পণ্য
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <Heart className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-pink-400 transition-colors" />
                  পছন্দের তালিকা
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <LayoutDashboard className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-purple-400 transition-colors" />
                  ড্যাশবোর্ড
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <Info className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-amber-400 transition-colors" />
                  আমাদের সম্পর্কে
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <Truck className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-green-400 transition-colors" />
                  অর্ডার ট্র্যাক করুন
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service - with mobile accordion */}
          <div className="md:border-l md:border-white/10 md:pl-6">
            <button 
              className="flex justify-between items-center w-full md:hidden py-2 font-semibold text-white"
              onClick={() => toggleSection('customerService')}
            >
              <span>কাস্টমার সার্ভিস</span>
              {openSections.customerService ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <h4 className="font-semibold text-white mb-4 hidden md:block">কাস্টমার সার্ভিস</h4>
            <ul className={`space-y-3 text-sm ${openSections.customerService ? 'block' : 'hidden'} md:block transition-all duration-300`}>
              <li>
                <Link to="/Support" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <HelpCircle className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-blue-400 transition-colors" />
                  সাপোর্ট / হেল্প সেন্টার
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <RotateCcw className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-amber-400 transition-colors" />
                  রিটার্ন পলিসি
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <Truck className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-green-400 transition-colors" />
                  শিপিং তথ্য
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/FAQ" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <FileText className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-purple-400 transition-colors" />
                  FAQ
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <ShieldCheck className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-emerald-400 transition-colors" />
                  ওয়ারেন্টি ও গ্যারান্টি
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="group inline-flex items-center gap-2 hover:text-white transition-colors py-1">
                  <Users className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-pink-400 transition-colors" />
                  সাইজ গাইড
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact - with mobile accordion */}
          <div className="md:border-l md:border-white/10 md:pl-6">
            <button 
              className="flex justify-between items-center w-full md:hidden py-2 font-semibold text-white"
              onClick={() => toggleSection('contact')}
            >
              <span>যোগাযোগ</span>
              {openSections.contact ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <h4 className="font-semibold text-white mb-4 hidden md:block">যোগাযোগ</h4>
            <div className={`space-y-3 text-sm ${openSections.contact ? 'block' : 'hidden'} md:block transition-all duration-300`}>
              {settings?.contact?.phone && (
                <a href={`tel:${settings.contact.phone}`} className="group flex items-center gap-2 hover:text-white transition-colors py-1">
                  <Phone className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-green-400 transition-colors" />
                  <span>{settings.contact.phone}</span>
                </a>
              )}
              {settings?.contact?.email && (
                <a href={`mailto:${settings.contact.email}`} className="group flex items-center gap-2 hover:text-white transition-colors py-1">
                  <Mail className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-blue-400 transition-colors" />
                  <span>{settings.contact.email}</span>
                </a>
              )}
              {settings?.contact?.website && (
                <a
                  href={settings.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-white transition-colors py-1"
                >
                  <Globe className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:text-purple-400 transition-colors" />
                  <span className="inline-flex items-center gap-1">
                    {settings.contact.website.replace(/^https?:\/\//, '')}
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                  </span>
                </a>
              )}
              {settings?.contact?.address && (
                <div className="flex items-start gap-2 py-1">
                  <MapPin className="w-4 h-4 mt-0.5 opacity-80" />
                  <span>{settings.contact.address}</span>
                </div>
              )}

              {/* Live chat and support options */}
              <div className="pt-3 mt-3 border-t border-white/10">
                <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                  <HeadphonesIcon className="w-4 h-4 text-blue-400" />
                  দ্রুত সাহায্য
                </h5>
                <div className="space-y-2">
                  {settings?.contact?.whatsapp && (
                    <a
                      href={`https://wa.me/${settings.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 hover:text-white transition-colors text-xs bg-green-900/20 hover:bg-green-900/30 px-3 py-2 rounded-lg border border-green-800/30"
                    >
                      <MessageSquare className="w-3 h-3 opacity-80 group-hover:opacity-100" />
                      WhatsApp এ চ্যাট করুন
                      <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                    </a>
                  )}
                  {settings?.contact?.messenger && (
                    <a
                      href={settings.contact.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 hover:text-white transition-colors text-xs bg-blue-900/20 hover:bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-800/30"
                    >
                      <MessageSquare className="w-3 h-3 opacity-80 group-hover:opacity-100" />
                      Messenger এ চ্যাট করুন
                      <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                    </a>
                  )}
                  <Link to="/live-chat" className="group inline-flex items-center gap-2 hover:text-white transition-colors text-xs bg-purple-900/20 hover:bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-800/30">
                    <HeadphonesIcon className="w-3 h-3 opacity-80 group-hover:opacity-100" />
                    লাইভ চ্যাট
                    <ArrowUpRight className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            পেমেন্ট Methods
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
                className="inline-flex items-center justify-center bg-white rounded-md shadow-sm ring-1 ring-black/5 p-2 transition-all duration-300 hover:scale-105 hover:shadow-md"
                title={p.alt}
              >
                <img src={p.src} alt={p.alt} className="h-6 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Download our app section */}
        <div className="mt-8 border-t border-white/10 pt-8">
          <h4 className="font-semibold text-white mb-4">আমাদের অ্যাপ ডাউনলোড করুন</h4>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="group flex items-center gap-2 bg-black/30 hover:bg-black/40 border border-white/10 rounded-lg px-4 py-3 transition-all duration-300 hover:scale-105">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.924 17.315c-.057.174-.193.332-.348.367-.156.035-.343-.047-.483-.192-.674-.759-1.471-1.121-2.392-1.121-1.004 0-1.799.457-2.406 1.121-.151.155-.342.227-.5.192s-.291-.193-.348-.367c-.091-.273-.125-.663-.125-1.17 0-.507.034-.896.125-1.17.057-.174.193-.332.348-.367.158-.035.349.037.5.192.607.664 1.402 1.121 2.406 1.121.921 0 1.718-.362 2.392-1.121.14-.145.327-.227.483-.192.155.035.291.193.348.367.091.274.125.663.125 1.17 0 .507-.034.896-.125 1.17zm-3.924-6.315c-2.208 0-4-1.792-4-4s1.792-4 4-4 4 1.792 4 4-1.792 4-4 4zm6 10c0 1.105-.895 2-2 2h-14c-1.105 0-2-.895-2-2v-14c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2v14zm-10-12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"/>
              </svg>
              <div>
                <div className="text-xs opacity-70">Download on the</div>
                <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">App Store</div>
              </div>
            </a>
            
            <a href="#" className="group flex items-center gap-2 bg-black/30 hover:bg-black/40 border border-white/10 rounded-lg px-4 py-3 transition-all duration-300 hover:scale-105">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 2h16c1.103 0 2 .897 2 2v16c0 1.103-.897 2-2 2h-16c-1.103 0-2-.897-2-2v-16c0-1.103.897-2 2-2zm8 18c.553 0 1-.447 1-1s-.447-1-1-1-1 .447-1 1 .447 1 1 1zm6-5v2h-12v-2h12z"/>
              </svg>
              <div>
                <div className="text-xs opacity-70">GET IT ON</div>
                <div className="font-semibold text-white group-hover:text-green-300 transition-colors">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom bar with all policies */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </p>
          
          <p className="text-sm opacity-70">
            {settings?.site?.footer_text ||
              `© ${currentYear} ${brand}. সকল অধিকার সংরক্ষিত।`}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/privacy" className="inline-flex items-center gap-1 hover:text-white transition-colors group">
              <Lock className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
              প্রাইভেসি পলিসি
            </Link>
            <Link to="/terms" className="inline-flex items-center gap-1 hover:text-white transition-colors group">
              <FileText className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
              নিয়ম ও শর্তাবলী
            </Link>
            <Link to="/return-policy" className="inline-flex items-center gap-1 hover:text-white transition-colors group">
              <RotateCcw className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
              রিফান্ড পলিসি
            </Link>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 hover:-translate-y-1 animate-bounce"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
}
