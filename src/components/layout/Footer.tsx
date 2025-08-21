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

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof openSections]
    }));
  };

  const currentYear = new Date().getFullYear();
  const brand = settings?.site?.name || "SM World Store";

  return (
    <footer className="bg-[#0f172a] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand / About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-extrabold tracking-tight text-white">
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
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition"
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
                  className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition"
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
                  className="p-2 rounded-full bg-sky-500 hover:bg-sky-600 transition"
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
                  className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links with icons - Mobile Accordion */}
          <div className="md:hidden border-b border-white/10 pb-4">
            <button 
              onClick={() => toggleSection('quickLinks')}
              className="flex justify-between items-center w-full text-left"
            >
              <h4 className="font-semibold text-white">দ্রুত লিংক</h4>
              {openSections.quickLinks ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <div className={`mt-4 ${openSections.quickLinks ? 'block' : 'hidden'}`}>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/" className="group inline-flex items-center gap-2 hover:underline">
                    <Home className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    হোম
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="group inline-flex items-center gap-2 hover:underline">
                    <ShoppingBag className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                    সকল পণ্য
                  </Link>
                </li>
                <li>
                  <Link to="/favorites" className="group inline-flex items-center gap-2 hover:underline">
                    <Heart className="w-4 h-4 text-pink-400 group-hover:text-pink-300" />
                    পছন্দের তালিকা
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="group inline-flex items-center gap-2 hover:underline">
                    <LayoutDashboard className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                    ড্যাশবোর্ড
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="group inline-flex items-center gap-2 hover:underline">
                    <Info className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                    আমাদের সম্পর্কে
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Links - Desktop */}
          <nav aria-label="Quick links" className="hidden md:block">
            <h4 className="font-semibold text-white mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="group inline-flex items-center gap-2 hover:underline">
                  <Home className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                  হোম
                </Link>
              </li>
              <li>
                <Link to="/products" className="group inline-flex items-center gap-2 hover:underline">
                  <ShoppingBag className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                  সকল পণ্য
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="group inline-flex items-center gap-2 hover:underline">
                  <Heart className="w-4 h-4 text-pink-400 group-hover:text-pink-300" />
                  পছন্দের তালিকা
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="group inline-flex items-center gap-2 hover:underline">
                  <LayoutDashboard className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                  ড্যাশবোর্ড
                </Link>
              </li>
              <li>
                <Link to="/about" className="group inline-flex items-center gap-2 hover:underline">
                  <Info className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                  আমাদের সম্পর্কে
                </Link>
              </li>
            </ul>
          </nav>

          {/* Customer Service with icons - Mobile Accordion */}
          <div className="md:hidden border-b border-white/10 pb-4">
            <button 
              onClick={() => toggleSection('customerService')}
              className="flex justify-between items-center w-full text-left"
            >
              <h4 className="font-semibold text-white">কাস্টমার সার্ভিস</h4>
              {openSections.customerService ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <div className={`mt-4 ${openSections.customerService ? 'block' : 'hidden'}`}>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/Support" className="group inline-flex items-center gap-2 hover:underline">
                    <HelpCircle className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" />
                    সাপোর্ট / হেল্প সেন্টার
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" className="group inline-flex items-center gap-2 hover:underline">
                    <RotateCcw className="w-4 h-4 text-orange-400 group-hover:text-orange-300" />
                    রিটার্ন পলিসি
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-info" className="group inline-flex items-center gap-2 hover:underline">
                    <Truck className="w-4 h-4 text-teal-400 group-hover:text-teal-300" />
                    শিপিং তথ্য
                  </Link>
                </li>
                <li>
                  <Link to="/FAQ" className="group inline-flex items-center gap-2 hover:underline">
                    <FileText className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/warranty" className="group inline-flex items-center gap-2 hover:underline">
                    <ShieldCheck className="w-4 h-4 text-lime-400 group-hover:text-lime-300" />
                    ওয়ারেন্টি ও গ্যারান্টি
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Customer Service - Desktop */}
          <nav aria-label="Customer service" className="hidden md:block">
            <h4 className="font-semibold text-white mb-4">কাস্টমার সার্ভিস</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/Support" className="group inline-flex items-center gap-2 hover:underline">
                  <HelpCircle className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" />
                  সাপোর্ট / হেল্প সেন্টার
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="group inline-flex items-center gap-2 hover:underline">
                  <RotateCcw className="w-4 h-4 text-orange-400 group-hover:text-orange-300" />
                  রিটার্ন পলিসি
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="group inline-flex items-center gap-2 hover:underline">
                  <Truck className="w-4 h-4 text-teal-400 group-hover:text-teal-300" />
                  শিপিং তথ্য
                </Link>
              </li>
              <li>
                <Link to="/FAQ" className="group inline-flex items-center gap-2 hover:underline">
                  <FileText className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="group inline-flex items-center gap-2 hover:underline">
                  <ShieldCheck className="w-4 h-4 text-lime-400 group-hover:text-lime-300" />
                  ওয়ারেন্টি ও গ্যারান্টি
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact – richer with icons & links - Mobile Accordion */}
          <div className="md:hidden border-b border-white/10 pb-4">
            <button 
              onClick={() => toggleSection('contact')}
              className="flex justify-between items-center w-full text-left"
            >
              <h4 className="font-semibold text-white">যোগাযোগ</h4>
              {openSections.contact ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <div className={`mt-4 ${openSections.contact ? 'block' : 'hidden'}`}>
              <div className="space-y-3 text-sm">
                {settings?.contact?.phone && (
                  <a href={`tel:${settings.contact.phone}`} className="group flex items-center gap-2 hover:underline">
                    <Phone className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                    <span>{settings.contact.phone}</span>
                  </a>
                )}
                {settings?.contact?.email && (
                  <a href={`mailto:${settings.contact.email}`} className="group flex items-center gap-2 hover:underline">
                    <Mail className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                    <span>{settings.contact.email}</span>
                  </a>
                )}
                {settings?.contact?.website && (
                  <a
                    href={settings.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 hover:underline"
                  >
                    <Globe className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    <span className="inline-flex items-center gap-1">
                      {settings.contact.website}
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </span>
                  </a>
                )}
                {settings?.contact?.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-amber-400" />
                    <span>{settings.contact.address}</span>
                  </div>
                )}

                {/* Optional richer contact actions */}
                {settings?.contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 hover:underline"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                    WhatsApp
                  </a>
                )}
                {settings?.contact?.messenger && (
                  <a
                    href={settings.contact.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 hover:underline"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    Messenger
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact - Desktop */}
          <section aria-label="Contact" className="hidden md:block">
            <h4 className="font-semibold text-white mb-4">যোগাযোগ</h4>
            <div className="space-y-3 text-sm">
              {settings?.contact?.phone && (
                <a href={`tel:${settings.contact.phone}`} className="group flex items-center gap-2 hover:underline">
                  <Phone className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                  <span>{settings.contact.phone}</span>
                </a>
              )}
              {settings?.contact?.email && (
                <a href={`mailto:${settings.contact.email}`} className="group flex items-center gap-2 hover:underline">
                  <Mail className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                  <span>{settings.contact.email}</span>
                </a>
              )}
              {settings?.contact?.website && (
                <a
                  href={settings.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:underline"
                >
                  <Globe className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                  <span className="inline-flex items-center gap-1">
                    {settings.contact.website}
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </span>
                </a>
              )}
              {settings?.contact?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-amber-400" />
                  <span>{settings.contact.address}</span>
                </div>
              )}

              {/* Optional richer contact actions */}
              {settings?.contact?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 hover:underline"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                  WhatsApp
                </a>
              )}
              {settings?.contact?.messenger && (
                <a
                  href={settings.contact.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 hover:underline"
                >
                  <MessageSquare className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                  Messenger
                </a>
              )}
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
                className="inline-flex items-center justify-center bg-white rounded-md shadow-sm ring-1 ring-black/5 p-2"
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
            <Link to="/privacy" className="inline-flex items-center gap-1 hover:underline">
              <Lock className="w-4 h-4 text-violet-400" />
              প্রাইভেসি পলিসি
            </Link>
            <Link to="/terms" className="inline-flex items-center gap-1 hover:underline">
              <FileText className="w-4 h-4 text-blue-400" />
              নিয়ম ও শর্তাবলী
            </Link>
            <Link to="/return-policy" className="inline-flex items-center gap-1 hover:underline">
              <RotateCcw className="w-4 h-4 text-orange-400" />
              রিফান্ড পলিসি
            </Link>
            <Link to="/seller-policy" className="inline-flex items-center gap-1 hover:underline">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              সেলার পলিসি
            </Link>
            <Link to="/cookie-policy" className="inline-flex items-center gap-1 hover:underline">
              <Info className="w-4 h-4 text-cyan-400" />
              কুকি পলিসি
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
