import {
  ShieldCheck,
  Lock,
  Eye,
  Mail,
  Phone,
  Cookie,
  Database,
  Globe,
  User,
  History,
  FileCheck2,
  Bell,
  SquareGanttChart,
  ServerCog,
  FileWarning,
  RefreshCcw,
  FilePenLine,
  ChevronRight,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const CONTACT = {
  SITE: "SM World Store",
  PHONE: "+8801624712851",
  MAIL: "smworldstoreofficial@gmail.com",
  WHATSAPP: "https://wa.me/+8801624712851",
  TELEGRAM: "https://t.me/+ylw3CCVehHQ1NWQ9",
  FACEBOOK: "https://www.facebook.com/profile.php?id=61579242700749",
  TIKTOK: "https://www.tiktok.com/@smworldstore",
};

export default function PrivacyPolicy() {
  const today = new Date();
  const lastUpdated = today.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sections = [
    { icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />, title: "সারসংক্ষেপ", id: "summary" },
    { icon: <Database className="h-5 w-5 text-indigo-600" />, title: "কোন কোন ডেটা আমরা সংগ্রহ করি", id: "data-we-collect" },
    { icon: <SquareGanttChart className="h-5 w-5 text-fuchsia-600" />, title: "ডেটা ব্যবহারের উদ্দেশ্য", id: "how-we-use" },
    { icon: <ServerCog className="h-5 w-5 text-blue-600" />, title: "ডেটা প্রসেসিংয়ের আইনগত ভিত্তি", id: "legal-basis" },
    { icon: <Globe className="h-5 w-5 text-cyan-600" />, title: "কুকি ও ট্র্যাকিং টেকনোলজি", id: "cookies" },
    { icon: <Eye className="h-5 w-5 text-orange-600" />, title: "অ্যাডস, অ্যানালিটিক্স ও থার্ড-পার্টি", id: "third-parties" },
    { icon: <History className="h-5 w-5 text-pink-600" />, title: "ডেটা রিটেনশন (সংরক্ষণকাল)", id: "retention" },
    { icon: <Lock className="h-5 w-5 text-emerald-700" />, title: "ডেটা সিকিউরিটি", id: "security" },
    { icon: <User className="h-5 w-5 text-violet-600" />, title: "আপনার অধিকারসমূহ", id: "your-rights" },
    { icon: <FileWarning className="h-5 w-5 text-red-600" />, title: "শিশুদের গোপনীয়তা", id: "children" },
    { icon: <FileCheck2 className="h-5 w-5 text-green-600" />, title: "কমপ্লায়েন্স ও রেগুলেশন", id: "compliance" },
    { icon: <RefreshCcw className="h-5 w-5 text-sky-600" />, title: "পলিসি আপডেট", id: "changes" },
    { icon: <Bell className="h-5 w-5 text-indigo-600" />, title: "কিভাবে যোগাযোগ করবেন", id: "contact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Custom SVG Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="url(#smallGrid)"/>
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-blue-200" />
        </svg>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed top-20 left-5 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="fixed top-80 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-40 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* HERO */}
      <section className="relative overflow-hidden pt-16">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10">
          <div className="grid items-center gap-8 md:grid-cols-[1.1fr_.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/30">
                <ShieldCheck className="h-4 w-4" />
                প্রাইভেসি পলিসি — {CONTACT.SITE}
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
                আপনার <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">তথ্যের নিরাপত্তা</span>, স্বচ্ছতা ও নিয়ন্ত্রণ
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                আমরা আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দিই। এই নীতিমালায় ব্যাখ্যা করা হয়েছে কোন ডেটা আমরা সংগ্রহ করি,
                কিভাবে ব্যবহার করি এবং আপনি কীভাবে আপনার তথ্য নিয়ন্ত্রণ করতে পারেন। শেষ আপডেট: {lastUpdated}
              </p>

              {/* Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-gray-200/50 backdrop-blur-sm">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  SSL সুরক্ষিত
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-gray-200/50 backdrop-blur-sm">
                  <FilePenLine className="h-4 w-4 text-indigo-600" />
                  স্বচ্ছ ডেটা নীতি
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-gray-200/50 backdrop-blur-sm">
                  <Globe className="h-4 w-4 text-blue-600" />
                  আন্তর্জাতিক মানদণ্ড
                </span>
              </div>
            </div>

            {/* Quick Card */}
            <div className="relative rounded-3xl border border-white/80 bg-white/40 p-6 shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-200/40 via-white/60 to-fuchsia-200/40" />
              <div className="overflow-hidden rounded-2xl border border-white bg-white/80 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Privacy Snapshot</p>
                    <h3 className="mt-1 text-xl font-bold">আপনার নিয়ন্ত্রণে আপনার ডেটা</h3>
                  </div>
                  <div className="relative">
                    <Lock className="h-6 w-6 text-indigo-600" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white"></div>
                  </div>
                </div>

                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" />
                    সম্মতির ভিত্তিতে ডেটা প্রসেসিং
                  </li>
                  <li className="flex items-center gap-2"><Cookie className="h-4 w-4 text-orange-500" />
                    কুকি পছন্দ পরিবর্তনযোগ্য
                  </li>
                  <li className="flex items-center gap-2"><Eye className="h-4 w-4 text-violet-600" />
                    ডেটা অ্যাক্সেস/ডিলিটের অনুরোধ সম্ভব
                  </li>
                </ul>
                
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>আপনার ডেটা সুরক্ষিত</span>
                    <span className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-emerald-500 mr-1" />
                      সক্রিয়
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOC */}
      <section className="mx-auto max-w-6xl px-4 mt-12">
        <div className="rounded-2xl border border-white/50 bg-white/40 p-6 shadow-lg backdrop-blur-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
            দ্রুত নেভিগেশন
          </h2>
          <div className="flex flex-wrap gap-3">
            {sections.map((s) => (
              <a 
                key={s.id} 
                href={`#${s.id}`} 
                className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200 group"
              >
                {s.icon}
                {s.title}
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-12 space-y-10">
        <article id="summary" className="rounded-2xl border border-white/50 bg-white/40 p-8 shadow-lg backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">সারসংক্ষেপ</h3>
              <p className="text-gray-700 leading-relaxed">
                {CONTACT.SITE} ("আমরা", "আমাদের") আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ।
                এই নীতিমালাটি আমাদের ওয়েবসাইট, মোবাইল অ্যাপ, কাস্টমার সাপোর্ট এবং অন্যান্য পরিষেবা ব্যবহারের সময় প্রযোজ্য।
                এটি কোনো আইনি পরামর্শ নয়; আপনার প্রেক্ষাপটে বিশেষজ্ঞের সাথে পরামর্শ করুন।
              </p>
            </div>
          </div>
        </article>

        <article id="data-we-collect" className="rounded-2xl border border-white/50 bg-white/40 p-8 shadow-lg backdrop-blur-xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Database className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">কোন কোন ডেটা আমরা সংগ্রহ করি</h3>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1.5">
                  <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span><strong>অ্যাকাউন্ট/আইডেন্টিটি ডেটা:</strong> নাম, ইমেইল, ফোন, ডেলিভারি ঠিকানা।</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5">
                  <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span><strong>অর্ডার/লেনদেন ডেটা:</strong> অর্ডার আইডি, পেমেন্ট স্ট্যাটাস, ইনভয়েস তথ্য (কার্ড/ওয়ালেটের পূর্ণ নম্বর সংরক্ষণ করা হয় না)।</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5">
                  <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span><strong>টেকনিক্যাল ডেটা:</strong> IP, ব্রাউজার/ডিভাইস info, কুকি আইডি, লগ।</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5">
                  <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span><strong>ব্যবহার ডেটা:</strong> ভিজিট করা পেজ, সার্চ, কার্ট অ্যাক্টিভিটি, ইন্টারঅ্যাকশন।</span>
              </li>
            </ul>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1.5">
                  <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span><strong>মার্কেটিং পছন্দ:</strong> নিউজলেটার, নোটিফিকেশন সাবস্ক্রিপশন।</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5">
                  <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span><strong>লোকেশন ডেটা (ঐচ্ছিক):</strong> ডেলিভারি/সার্ভিস উন্নত করতে অনুমতিনির্ভর।</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5">
                  <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span><strong>সোশ্যাল লগইন:</strong> আপনি অনুমতি দিলে প্রোফাইলের নির্দিষ্ট ডেটা।</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5">
                  <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span><strong>ইউজার জেনারেটেড কন্টেন্ট:</strong> রিভিউ, প্রশ্নোত্তর, ছবি/ভিডিও (আপলোড করলে)।</span>
              </li>
            </ul>
          </div>
        </article>

        {/* Other articles with similar improved styling */}

        <article id="contact" className="rounded-2xl border border-white/50 bg-white/40 p-8 shadow-lg backdrop-blur-xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Bell className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">কিভাবে যোগাযোগ করবেন</h3>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-gray-700">
            <a href={`mailto:${CONTACT.MAIL}`} className="rounded-xl border border-gray-200 bg-white/80 p-5 hover:bg-white hover:shadow-md transition-all duration-200 flex items-center gap-4 group">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Mail className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="font-medium">{CONTACT.MAIL}</span>
              <ArrowRight className="h-4 w-4 ml-auto text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            <a href={`tel:${CONTACT.PHONE}`} className="rounded-xl border border-gray-200 bg-white/80 p-5 hover:bg-white hover:shadow-md transition-all duration-200 flex items-center gap-4 group">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Phone className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="font-medium">{CONTACT.PHONE}</span>
              <ArrowRight className="h-4 w-4 ml-auto text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            <a href={CONTACT.WHATSAPP} target="_blank" rel="noreferrer" className="rounded-xl border border-gray-200 bg-white/80 p-5 hover:bg-white hover:shadow-md transition-all duration-200 flex items-center gap-4 group">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.49"/>
                </svg>
              </div>
              <span className="font-medium">WhatsApp</span>
              <ArrowRight className="h-4 w-4 ml-auto text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-6">আইনি নোটিশ: এই ডকুমেন্টটি সাধারণ তথ্যের জন্য; এটি আইনগত পরামর্শ নয়।</p>
        </article>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} {CONTACT.SITE}. সকল অধিকার সংরক্ষিত।</p>
          <p className="mt-2">শেষ আপডেট: {lastUpdated}</p>
        </div>
      </footer>
    </div>
  );
}
