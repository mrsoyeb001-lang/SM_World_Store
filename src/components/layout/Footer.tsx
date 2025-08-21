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
  const [openSections, setOpenSections] = useState({
    quickLinks: false,
    customerService: false,
    contact: false
  });

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

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const currentYear = new Date().getFullYear();
  const brand = settings?.site?.name || "SM World Store";

  return (
    <footer className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand / About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
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
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition transform hover:scale-110"
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
                  className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-110"
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
                  className="p-2 rounded-full bg-sky-500 hover:bg-sky-600 transition transform hover:scale-110"
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
                  className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition transform hover:scale-110"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links with icons - Mobile Accordion */}
          <div className="md:hidden">
            <button 
              onClick={() => toggleSection('quickLinks')}
              className="flex items-center justify-between w-full py-2 font-semibold text-white"
            >
              <span>দ্রুত লিংক</span>
              {openSections.quickLinks ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSections.quickLinks ? 'max-h-96' : 'max-h-0'}`}>
              <nav aria-label="Quick links" className="pt-2 pb-4 pl-4">
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link to="/" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                      <Home className="w-4 h-4 text-blue-400" />
                      হোম
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                      <ShoppingBag className="w-4 h-4 text-blue-400" />
                      সকল পণ্য
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                      <Heart className="w-4 h-4 text-pink-400" />
                      পছন্দের তালিকা
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                      <LayoutDashboard className="w-4 h-4 text-purple-400" />
                      ড্যাশবোর্ড
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                      <Info className="w-4 h-4 text-cyan-400" />
                      আমাদের সম্পর্কে
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Quick Links - Desktop */}
          <nav aria-label="Quick links" className="hidden md:block">
            <h4 className="font-semibold text-white mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                  <Home className="w-4 h-4 text-blue-400" />
                  হোম
                </Link>
              </li>
              <li>
                <Link to="/products" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                  সকল পণ্য
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                  <Heart className="w-4 h-4 text-pink-400" />
                  পছন্দের তালিকা
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  ড্যাশবোর্ড
                </Link>
              </li>
              <li>
                <Link to="/about" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                  <Info className="w-4 h-4 text-cyan-400" />
                  আমাদের সম্পর্কে
                </Link>
              </li>
            </ul>
          </nav>

          {/* Customer Service with icons - Mobile Accordion */}
          <div className="md:hidden">
            <button 
              onClick={() => toggleSection('customerService')}
              className="flex items-center justify-between w-full py-2 font-semibold text-white"
            >
              <span>কাস্টমার সার্ভিস</span>
              {openSections.customerService ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSections.customerService ? 'max-h-96' : 'max-h-0'}`}>
              <nav aria-label="Customer service" className="pt-2 pb-4 pl-4">
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link to="/Support" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                      <HelpCircle className="w-4 h-4 text-yellow-400" />
                      সাপোর্ট / হেল্প সেন্টার
                    </Link>
                  </li>
                  <li>
                    <Link to="/return-policy" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                      <RotateCcw className="w-4 h-4 text-green-400" />
                      রিটার্ন পলিসি
                    </Link>
                  </li>
                  <li>
                    <Link to="/shipping-info" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                      <Truck className="w-4 h-4 text-orange-400" />
                      শিপিং তথ্য
                    </Link>
                  </li>
                  <li>
                    <Link to="/FAQ" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/warranty" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      ওয়ারেন্টি ও গ্যারান্টি
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Customer Service - Desktop */}
          <nav aria-label="Customer service" className="hidden md:block">
            <h4 className="font-semibold text-white mb-4">কাস্টমার সার্ভিস</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/Support" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                  <HelpCircle className="w-4 h-4 text-yellow-400" />
                  সাপোর্ট / হেল্প সেন্টার
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                  <RotateCcw className="w-4 h-4 text-green-400" />
                  রিটার্ন পলিসি
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                  <Truck className="w-4 h-4 text-orange-400" />
                  শিপিং তথ্য
                </Link>
              </li>
              <li>
                <Link to="/FAQ" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="group inline-flex items-center gap-2 hover:text-blue-300 transition">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  ওয়ারেন্টি ও গ্যারান্টি
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact – richer with icons & links - Mobile Accordion */}
          <div className="md:hidden">
            <button 
              onClick={() => toggleSection('contact')}
              className="flex items-center justify-between w-full py-2 font-semibold text-white"
            >
              <span>যোগাযোগ</span>
              {openSections.contact ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSections.contact ? 'max-h-96' : 'max-h-0'}`}>
              <section aria-label="Contact" className="pt-2 pb-4 pl-4">
                <div className="space-y-3 text-sm">
                  {settings?.contact?.phone && (
                    <a href={`tel:${settings.contact.phone}`} className="group flex items-center gap-2 hover:text-blue-300 transition">
                      <Phone className="w-4 h-4 text-green-400" />
                      <span>{settings.contact.phone}</span>
                    </a>
                  )}
                  {settings?.contact?.email && (
                    <a href={`mailto:${settings.contact.email}`} className="group flex items-center gap-2 hover:text-blue-300 transition">
                      <Mail className="w-4 h-4 text-red-400" />
                      <span>{settings.contact.email}</span>
                    </a>
                  )}
                  {settings?.contact?.website && (
                    <a
                      href={settings.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 hover:text-blue-300 transition"
                    >
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="inline-flex items-center gap-1">
                        {settings.contact.website}
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </span>
                    </a>
                  )}
                  {settings?.contact?.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-red-400" />
                      <span>{settings.contact.address}</span>
                    </div>
                  )}

                  {/* Optional richer contact actions */}
                  {settings?.contact?.whatsapp && (
                    <a
                      href={`https://wa.me/${settings.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 hover:text-blue-300 transition"
                    >
                      <PhoneCall className="w-4 h-4 text-green-400" />
                      WhatsApp
                    </a>
                  )}
                  {settings?.contact?.messenger && (
                    <a
                      href={settings.contact.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 hover:text-blue-300 transition"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      Messenger
                    </a>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Contact - Desktop */}
          <section aria-label="Contact" className="hidden md:block">
            <h4 className="font-semibold text-white mb-4">যোগাযোগ</h4>
            <div className="space-y-3 text-sm">
              {settings?.contact?.phone && (
                <a href={`tel:${settings.contact.phone}`} className="group flex items-center gap-2 hover:text-blue-300 transition">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span>{settings.contact.phone}</span>
                </a>
              )}
              {settings?.contact?.email && (
                <a href={`mailto:${settings.contact.email}`} className="group flex items-center gap-2 hover:text-blue-300 transition">
                  <Mail className="w-4 h-4 text-red-400" />
                  <span>{settings.contact.email}</span>
                </a>
              )}
              {settings?.contact?.website && (
                <a
                  href={settings.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-blue-300 transition"
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="inline-flex items-center gap-1">
                    {settings.contact.website}
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </span>
                </a>
              )}
              {settings?.contact?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-red-400" />
                  <span>{settings.contact.address}</span>
                </div>
              )}

              {/* Optional richer contact actions */}
              {settings?.contact?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 hover:text-blue-300 transition"
                >
                  <PhoneCall className="w-4 h-4 text-green-400" />
                  WhatsApp
                </a>
              )}
              {settings?.contact?.messenger && (
                <a
                  href={settings.contact.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 hover:text-blue-300 transition"
                >
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  Messenger
                </a>
              )}
            </div>
          </section>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h4 className="font-semibold text-white mb-4">পেমেন্ট মাধ্যম</h4>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { src: "/payments/bkash.png", alt: "bKash" },
              { src: "/payments/nagad.png", alt: "Nagad" },
              { src: "/payments/rocket.png", alt: "Rocket" },
              { src: "/payments/cashon.png", alt: "Cash on Delivery" },
            ].map((p) => (
              <div
                key={p.alt}
                className="inline-flex items-center justify-center bg-white rounded-md shadow-sm p-2 transition-transform hover:scale-105"
                title={p.alt}
              >
                <img src={p.src} alt={p.alt} className="h-6 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar with all policies as links */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70">
            {settings?.site?.footer_text ||
              `© ${currentYear} ${brand}. সকল অধিকার সংরক্ষিত।`}
          </p>
          <div className="flex flex-wrap gap-5 text-sm justify-center">
            <Link to="/privacy" className="inline-flex items-center gap-1 hover:text-blue-300 transition">
              <Lock className="w-4 h-4 text-purple-400" />
              প্রাইভেসি পলিসি
            </Link>
            <Link to="/terms" className="inline-flex items-center gap-1 hover:text-blue-300 transition">
              <FileText className="w-4 h-4 text-blue-400" />
              নিয়ম ও শর্তাবলী
            </Link>
            <Link to="/return-policy" className="inline-flex items-center gap-1 hover:text-blue-300 transition">
              <RotateCcw className="w-4 h-4 text-green-400" />
              রিফান্ড পলিসি
            </Link>
            <Link to="/seller-policy" className="inline-flex items-center gap-1 hover:text-blue-300 transition">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              সেলার পলিসি
            </Link>
            <Link to="/cookie-policy" className="inline-flex items-center gap-1 hover:text-blue-300 transition">
              <Info className="w-4 h-4 text-cyan-400" />
              কুকি পলিসি
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
