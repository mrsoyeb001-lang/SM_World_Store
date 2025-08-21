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
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  Users,
  Clock,
  HeadphonesIcon,
  Shield,
  Calendar,
  CreditCard,
  Package,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Send,
  AlertCircle
} from "lucide-react";

interface SiteSettings {
  contact: {
    phone: string;
    email: string;
    address: string;
    website: string;
    whatsapp?: string;
    messenger?: string;
    telegram?: string;
    viber?: string;
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
  business: {
    hours?: string;
    established?: string;
    employees?: string;
    satisfaction?: string;
  };
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({});
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState("");

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

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);
    setError("");
    
    try {
      // Simulate subscription API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      // Here you would typically send the email to your backend
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      setError(err.message || 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const brand = settings?.site?.name || "SM World Store";

  return (
    <footer className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-gray-300 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500 opacity-10 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-purple-500 opacity-10 blur-xl"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-12 shadow-lg transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">নিউজলেটার সাবস্ক্রাইব করুন</h3>
              <p className="text-blue-100">আমাদের বিশেষ অফার এবং নতুন পণ্যের তথ্য সবার আগে পান</p>
            </div>
            
            {subscribed ? (
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">ধন্যবাদ! আপনি সাবস্ক্রাইব করেছেন</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল ঠিকানা"
                    className="pl-10 pr-4 py-3 rounded-lg border-0 w-full focus:ring-2 focus:ring-white focus:outline-none text-gray-800"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {subscribing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      সাবমিট হচ্ছে...
                    </>
                  ) : (
                    <>
                      সাবস্ক্রাইব <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-200 bg-red-500/20 p-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Shield, text: "সুরক্ষিত পেমেন্ট", subtext: "100% সুরক্ষিত" },
            { icon: Truck, text: "দ্রুত ডেলিভারি", subtext: "সারা দেশে" },
            { icon: HeadphonesIcon, text: "২৪/৭ সাপোর্ট", subtext: "সর্বদা উপলব্ধ" },
            { icon: Award, text: "গুণগত মান", subtext: "প্রামাণিক পণ্য" },
          ].map((item, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:scale-105"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-2">
                <item.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">{item.text}</h4>
              <p className="text-xs opacity-70">{item.subtext}</p>
            </div>
          ))}
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand/About Section */}
          <div className="space-y-4">
            <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-200">
              <h3 className="text-2xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {brand}
              </h3>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              {settings?.site?.description ||
                "আপনার পছন্দের পণ্য সেরা দামে—বিশ্বস্ত ও দ্রুত ডেলিভারিতে।"}
            </p>

            {/* Business Info */}
            {settings?.business && (
              <div className="pt-2 space-y-2">
                {settings.business.established && (
                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <Calendar className="w-3 h-3" />
                    <span>স্থাপিত: {settings.business.established}</span>
                  </div>
                )}
                {settings.business.employees && (
                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <Users className="w-3 h-3" />
                    <span>{settings.business.employees}+ কর্মী</span>
                  </div>
                )}
                {settings.business.satisfaction && (
                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span>{settings.business.satisfaction}% সন্তুষ্টি</span>
                  </div>
                )}
                {settings.business.hours && (
                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <Clock className="w-3 h-3" />
                    <span>{settings.business.hours}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              {settings?.social?.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
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
                  className="p-2 rounded-full bg-white/10 hover:bg-pink-500 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
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
                  className="p-2 rounded-full bg-white/10 hover:bg-sky-500 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
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
                  className="p-2 rounded-full bg-white/10 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
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
                  className="p-2 rounded-full bg-white/10 hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links - Mobile Accordion */}
          <div className="md:hidden">
            <button 
              onClick={() => toggleSection('quickLinks')}
              className="flex items-center justify-between w-full py-3 font-semibold text-white border-b border-white/10"
            >
              <span>দ্রুত লিংক</span>
              {openSections.quickLinks ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {openSections.quickLinks && (
              <ul className="py-4 space-y-3 text-sm animate-fadeIn">
                <li>
                  <Link to="/" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <Home className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    হোম
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <ShoppingBag className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    সকল পণ্য
                  </Link>
                </li>
                <li>
                  <Link to="/favorites" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <Heart className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    পছন্দের তালিকা
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <LayoutDashboard className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    ড্যাশবোর্ড
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <Info className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    আমাদের সম্পর্কে
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Quick Links - Desktop */}
          <nav aria-label="Quick links" className="hidden md:block">
            <h4 className="font-semibold text-white mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <Home className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  হোম
                </Link>
              </li>
              <li>
                <Link to="/products" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <ShoppingBag className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  সকল পণ্য
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <Heart className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  পছন্দের তালিকা
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <LayoutDashboard className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  ড্যাশবোর্ড
                </Link>
              </li>
              <li>
                <Link to="/about" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <Info className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  আমাদের সম্পর্কে
                </Link>
              </li>
            </ul>
          </nav>

          {/* Customer Service - Mobile Accordion */}
          <div className="md:hidden">
            <button 
              onClick={() => toggleSection('customerService')}
              className="flex items-center justify-between w-full py-3 font-semibold text-white border-b border-white/10"
            >
              <span>কাস্টমার সার্ভিস</span>
              {openSections.customerService ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {openSections.customerService && (
              <ul className="py-4 space-y-3 text-sm animate-fadeIn">
                <li>
                  <Link to="/Support" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <HelpCircle className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    সাপোর্ট / হেল্প সেন্টার
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <RotateCcw className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    রিটার্ন পলিসি
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-info" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <Truck className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    শিপিং তথ্য
                  </Link>
                </li>
                <li>
                  <Link to="/FAQ" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <FileText className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/warranty" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <ShieldCheck className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    ওয়ারেন্টি ও গ্যারান্টি
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Customer Service - Desktop */}
          <nav aria-label="Customer service" className="hidden md:block">
            <h4 className="font-semibold text-white mb-4">কাস্টমার সার্ভিস</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/Support" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <HelpCircle className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  সাপোর্ট / হেল্প সেন্টার
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <RotateCcw className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  রিটার্ন পলিসি
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <Truck className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  শিপিং তথ্য
                </Link>
              </li>
              <li>
                <Link to="/FAQ" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <FileText className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="group inline-flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <ShieldCheck className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  ওয়ারেন্টি ও গ্যারান্টি
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact - Mobile Accordion */}
          <div className="md:hidden">
            <button 
              onClick={() => toggleSection('contact')}
              className="flex items-center justify-between w-full py-3 font-semibold text-white border-b border-white/10"
            >
              <span>যোগাযোগ</span>
              {openSections.contact ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {openSections.contact && (
              <div className="py-4 space-y-3 text-sm animate-fadeIn">
                {settings?.contact?.phone && (
                  <a href={`tel:${settings.contact.phone}`} className="group flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <Phone className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    <span>{settings.contact.phone}</span>
                  </a>
                )}
                {settings?.contact?.email && (
                  <a href={`mailto:${settings.contact.email}`} className="group flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <Mail className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    <span>{settings.contact.email}</span>
                  </a>
                )}
                {settings?.contact?.website && (
                  <a
                    href={settings.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 hover:text-blue-300 transition-colors"
                  >
                    <Globe className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                    <span className="inline-flex items-center gap-1">
                      {settings.contact.website.replace(/^https?:\/\//, '')}
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

                {/* Additional contact options */}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  {settings?.contact?.whatsapp && (
                    <a
                      href={`https://wa.me/${settings.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-xs bg-green-500/20 hover:bg-green-500/30 p-2 rounded transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      WhatsApp
                    </a>
                  )}
                  {settings?.contact?.messenger && (
                    <a
                      href={settings.contact.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-xs bg-blue-500/20 hover:bg-blue-500/30 p-2 rounded transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Messenger
                    </a>
                  )}
                  {settings?.contact?.telegram && (
                    <a
                      href={`https://t.me/${settings.contact.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-xs bg-sky-500/20 hover:bg-sky-500/30 p-2 rounded transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      Telegram
                    </a>
                  )}
                  {settings?.contact?.viber && (
                    <a
                      href={`viber://chat?number=${settings.contact.viber}`}
                      className="group inline-flex items-center gap-2 text-xs bg-purple-500/20 hover:bg-purple-500/30 p-2 rounded transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      Viber
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact - Desktop */}
          <section aria-label="Contact" className="hidden md:block">
            <h4 className="font-semibold text-white mb-4">যোগাযোগ</h4>
            <div className="space-y-3 text-sm">
              {settings?.contact?.phone && (
                <a href={`tel:${settings.contact.phone}`} className="group flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <Phone className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  <span>{settings.contact.phone}</span>
                </a>
              )}
              {settings?.contact?.email && (
                <a href={`mailto:${settings.contact.email}`} className="group flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <Mail className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  <span>{settings.contact.email}</span>
                </a>
              )}
              {settings?.contact?.website && (
                <a
                  href={settings.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-blue-300 transition-colors"
                >
                  <Globe className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                  <span className="inline-flex items-center gap-1">
                    {settings.contact.website.replace(/^https?:\/\//, '')}
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

              {/* Additional contact options */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                {settings?.contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs bg-green-500/20 hover:bg-green-500/30 p-2 rounded transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    WhatsApp
                  </a>
                )}
                {settings?.contact?.messenger && (
                  <a
                    href={settings.contact.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs bg-blue-500/20 hover:bg-blue-500/30 p-2 rounded transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Messenger
                  </a>
                )}
                {settings?.contact?.telegram && (
                  <a
                    href={`https://t.me/${settings.contact.telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs bg-sky-500/20 hover:bg-sky-500/30 p-2 rounded transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    Telegram
                  </a>
                )}
                {settings?.contact?.viber && (
                  <a
                    href={`viber://chat?number=${settings.contact.viber}`}
                    className="group inline-flex items-center gap-2 text-xs bg-purple-500/20 hover:bg-purple-500/30 p-2 rounded transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    Viber
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Payment Methods */}
<div className="mt-12 border-t border-white/10 pt-8">
  <h4 className="font-semibold text-white mb-4">Payment Methods</h4>
  <div className="flex items-center gap-3 flex-wrap">
    {[
      { src: "/payments/bkash.png", alt: "bKash" },
      { src: "/payments/nagad.png", alt: "Nagad" },
      { src: "/payments/rocket.png", alt: "Rocket" },
      { src: "/payments/cashon.png", alt: "Cash on Delivery" },
    ].map((p) => (
      <div
        key={p.alt}
        className="inline-flex items-center justify-center bg-white rounded-md shadow-sm ring-1 ring-black/5"
        title={p.alt}
      >
        <img src={p.src} alt={p.alt} className="h-8 w-auto object-contain" />
      </div>
    ))}
  </div>
</div>


        {/* Download Our App */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-white mb-2">আমাদের অ্যাপ ডাউনলোড করুন</h4>
              <p className="text-sm opacity-80">দ্রুত অর্ডার, এক্সক্লুসিভ অফার এবং আরও অনেক কিছু</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="inline-block">
                <img src="/app-store.svg" alt="Download on App Store" className="h-12 hover:scale-105 transition-transform" />
              </a>
              <a href="#" className="inline-block">
                <img src="/play-store.svg" alt="Get it on Google Play" className="h-12 hover:scale-105 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70 order-2 md:order-1 text-center md:text-left">
            {settings?.site?.footer_text ||
              `© ${currentYear} ${brand}. সকল অধিকার সংরক্ষিত।`}
          </p>
          <div className="flex flex-wrap gap-4 text-sm order-1 md:order-2 justify-center">
            <Link to="/privacy" className="inline-flex items-center gap-1 hover:text-blue-300 transition-colors">
              <Lock className="w-4 h-4" />
              প্রাইভেসি পলিসি
            </Link>
            <Link to="/terms" className="inline-flex items-center gap-1 hover:text-blue-300 transition-colors">
              <FileText className="w-4 h-4" />
              নিয়ম ও শর্তাবলী
            </Link>
            <Link to="/return-policy" className="inline-flex items-center gap-1 hover:text-blue-300 transition-colors">
              <RotateCcw className="w-4 h-4" />
              রিফান্ড পলিসি
            </Link>
          </div>
        </div>

        {/* Back to Top Button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

      {/* Add some custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </footer>
  );
}
