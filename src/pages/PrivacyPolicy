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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-violet-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10">
          <div className="grid items-center gap-8 md:grid-cols-[1.1fr_.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-sm font-medium text-white shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                প্রাইভেসি পলিসি — {CONTACT.SITE}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
                আপনার তথ্যের নিরাপত্তা, স্বচ্ছতা ও নিয়ন্ত্রণ
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                আমরা আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দিই। এই নীতিমালায় ব্যাখ্যা করা হয়েছে কোন ডেটা আমরা সংগ্রহ করি,
                কিভাবে ব্যবহার করি এবং আপনি কীভাবে আপনার তথ্য নিয়ন্ত্রণ করতে পারেন। শেষ আপডেট: {lastUpdated}
              </p>

              {/* Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  SSL সুরক্ষিত
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <FilePenLine className="h-4 w-4 text-indigo-600" />
                  স্বচ্ছ ডেটা নীতি
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <Globe className="h-4 w-4 text-blue-600" />
                  আন্তর্জাতিক মানদণ্ড
                </span>
              </div>
            </div>

            {/* Quick Card */}
            <div className="relative rounded-3xl border bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-200/40 via-white to-fuchsia-200/40" />
              <div className="overflow-hidden rounded-2xl border bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Privacy Snapshot</p>
                    <h3 className="mt-1 text-xl font-bold">আপনার নিয়ন্ত্রণে আপনার ডেটা</h3>
                  </div>
                  <Lock className="h-6 w-6 text-indigo-600" />
                </div>

                <ul className="mt-4 space-y-2 text-sm text-gray-700">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOC */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">দ্রুত নেভিগেশন</h2>
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100">
                {s.icon}
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <article id="summary" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-emerald-600" /> সারসংক্ষেপ</h3>
          <p className="text-gray-700 leading-relaxed">
            {CONTACT.SITE} ("আমরা", "আমাদের") আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ।
            এই নীতিমালাটি আমাদের ওয়েবসাইট, মোবাইল অ্যাপ, কাস্টমার সাপোর্ট এবং অন্যান্য পরিষেবা ব্যবহারের সময় প্রযোজ্য।
            এটি কোনো আইনি পরামর্শ নয়; আপনার প্রেক্ষাপটে বিশেষজ্ঞের সাথে পরামর্শ করুন।
          </p>
        </article>

        <article id="data-we-collect" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><Database className="h-6 w-6 text-indigo-600" /> কোন কোন ডেটা আমরা সংগ্রহ করি</h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>অ্যাকাউন্ট/আইডেন্টিটি ডেটা:</strong> নাম, ইমেইল, ফোন, ডেলিভারি ঠিকানা।</li>
              <li><strong>অর্ডার/লেনদেন ডেটা:</strong> অর্ডার আইডি, পেমেন্ট স্ট্যাটাস, ইনভয়েস তথ্য (কার্ড/ওয়ালেটের পূর্ণ নম্বর সংরক্ষণ করা হয় না)।</li>
              <li><strong>টেকনিক্যাল ডেটা:</strong> IP, ব্রাউজার/ডিভাইস info, কুকি আইডি, লগ।</li>
              <li><strong>ব্যবহার ডেটা:</strong> ভিজিট করা পেজ, সার্চ, কার্ট অ্যাক্টিভিটি, ইন্টারঅ্যাকশন।</li>
              <li><strong>কমিউনিকেশন ডেটা:</strong> ইমেইল/চ্যাট/কল রেকর্ড ও সাপোর্ট টিকিট।</li>
            </ul>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>মার্কেটিং পছন্দ:</strong> নিউজলেটার, নোটিফিকেশন সাবস্ক্রিপশন।</li>
              <li><strong>লোকেশন ডেটা (ঐচ্ছিক):</strong> ডেলিভারি/সার্ভিস উন্নত করতে অনুমতিনির্ভর।</li>
              <li><strong>সোশ্যাল লগইন:</strong> আপনি অনুমতি দিলে প্রোফাইলের নির্দিষ্ট ডেটা।</li>
              <li><strong>ইউজার জেনারেটেড কন্টেন্ট:</strong> রিভিউ, প্রশ্নোত্তর, ছবি/ভিডিও (আপলোড করলে)।</li>
            </ul>
          </div>
        </article>

        <article id="how-we-use" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><SquareGanttChart className="h-6 w-6 text-fuchsia-600" /> ডেটা ব্যবহারের উদ্দেশ্য</h3>
          <ul className="space-y-2 list-disc pl-5 text-gray-700">
            <li>অর্ডার প্রসেসিং, পেমেন্ট নিষ্পত্তি ও ডেলিভারি ম্যানেজমেন্ট।</li>
            <li>অ্যাকাউন্ট তৈরি/লগইন, কার্ট/উইশলিস্ট সিঙ্ক, কাস্টমার সাপোর্ট।</li>
            <li>সাইটের পারফরম্যান্স, ফ্রড প্রিভেনশন, নিরাপত্তা পর্যবেক্ষণ।</li>
            <li>ব্যক্তিগতকরণ (রেকমেন্ডেশন), প্রোমোশন ও নোটিফিকেশন পাঠানো (আপনার সম্মতিতে)।</li>
            <li>আইনগত বাধ্যবাধকতা পূরণ (ট্যাক্স, রেকর্ডকিপিং ইত্যাদি)।</li>
          </ul>
        </article>

        <article id="legal-basis" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><ServerCog className="h-6 w-6 text-blue-600" /> ডেটা প্রসেসিংয়ের আইনগত ভিত্তি</h3>
          <p className="text-gray-700 leading-relaxed mb-2">প্রযোজ্য আইন (যেমন GDPR অনুরূপ নীতিমালা) অনুযায়ী আমরা নিম্ন ভিত্তিতে ডেটা প্রসেস করি:</p>
          <ul className="space-y-2 list-disc pl-5 text-gray-700">
            <li>চুক্তি সম্পাদন ও সেবা প্রদানের প্রয়োজন (অর্ডার/ডেলিভারি)।</li>
            <li>আপনার <strong>সম্মতি</strong> (মার্কেটিং, কুকি প্রেফারেন্স)।</li>
            <li>আইনগত বাধ্যবাধকতা (ট্যাক্স/অডিট)।</li>
            <li>ন্যায্য স্বার্থ (সাইট সিকিউরিটি, ফ্রড প্রতিরোধ, সার্ভিস ইমপ্রুভমেন্ট)।</li>
          </ul>
        </article>

        <article id="cookies" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><Cookie className="h-6 w-6 text-orange-600" /> কুকি ও ট্র্যাকিং টেকনোলজি</h3>
          <p className="text-gray-700 leading-relaxed mb-3">আমরা ফাংশনাল, পারফরম্যান্স, অ্যানালিটিক্স ও মার্কেটিং কুকি ব্যবহার করি। আপনি ব্রাউজার সেটিংস বা কুকি ব্যানার/প্রেফারেন্স সেন্টার থেকে পছন্দ পরিবর্তন করতে পারেন। কুকি নিষ্ক্রিয় করলে কিছু ফিচার সীমিত হতে পারে।</p>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <ul className="space-y-2 list-disc pl-5"><li>সেশন/অথ কুকি</li><li>কার্ট/প্রেফারেন্স কুকি</li><li>অ্যানালিটিক্স (ভিজিট/ইভেন্ট)</li></ul>
            <ul className="space-y-2 list-disc pl-5"><li>অ্যাড ট্যাগ/রিমার্কেটিং (সম্মতিভিত্তিক)</li><li>থার্ড-পার্টি উইজেট (ভিডিও/ম্যাপ)</li></ul>
          </div>
        </article>

        <article id="third-parties" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><Eye className="h-6 w-6 text-violet-600" /> অ্যাডস, অ্যানালিটিক্স ও থার্ড-পার্টি শেয়ারিং</h3>
          <p className="text-gray-700 leading-relaxed mb-2">সীমিত প্রয়োজন ছাড়া আমরা ব্যক্তিগত ডেটা বিক্রি করি না। নিম্নলিখিত পার্টনারদের সাথে ডেটা শেয়ার হতে পারে:</p>
          <ul className="space-y-2 list-disc pl-5 text-gray-700">
            <li>পেমেন্ট গেটওয়ে ও ব্যাংকিং পার্টনার (লেনদেনের জন্য)।</li>
            <li>কুরিয়ার/লজিস্টিকস (ডেলিভারি ঠিকানা/ফোন)।</li>
            <li>অ্যানালিটিক্স/ক্র্যাশ রিপোর্টিং (এ্যাগ্রিগেটেড/পসিউডোনিমাইজড ডেটা)।</li>
            <li>মার্কেটিং সার্ভিস (আপনার সম্মতিতে)।</li>
            <li>আইনগত অনুরোধে রেগুলেটরি/ল’ এনফোর্সমেন্ট।</li>
          </ul>
        </article>

        <article id="retention" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><History className="h-6 w-6 text-pink-600" /> ডেটা রিটেনশন (সংরক্ষণকাল)</h3>
          <p className="text-gray-700 leading-relaxed">সেবা প্রদান, আইনগত বাধ্যবাধকতা ও বিরোধ নিষ্পত্তির প্রয়োজনে যতদিন দরকার ততদিন ডেটা সংরক্ষণ করা হয়। অর্ডার/হিসাব সংক্রান্ত রেকর্ড সাধারণত ৫–৭ বছর পর্যন্ত রাখা হতে পারে। আপনার অনুরোধে মুছে ফেলার আগে প্রযোজ্য আইন পর্যালোচনা করা হয়।</p>
        </article>

        <article id="security" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><Lock className="h-6 w-6 text-emerald-700" /> ডেটা সিকিউরিটি</h3>
          <ul className="space-y-2 list-disc pl-5 text-gray-700">
            <li>SSL/TLS এনক্রিপশন, রোল-বেসড অ্যাক্সেস, লগিং ও মনিটরিং।</li>
            <li>পেমেন্ট কার্ড ডিটেইলস স্টোর করা হয় না; PCI-সম্মত গেটওয়ে ব্যবহৃত।</li>
            <li>রেগুলার ব্যাকআপ, ভলনারেবিলিটি ম্যানেজমেন্ট ও ইন্ট্রুশন ডিটেকশন।</li>
          </ul>
        </article>

        <article id="your-rights" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><User className="h-6 w-6 text-violet-600" /> আপনার অধিকারসমূহ</h3>
          <p className="text-gray-700 leading-relaxed mb-2">প্রযোজ্য আইন অনুযায়ী আপনি নিম্ন অধিকারগুলো ব্যবহার করতে পারেন:</p>
          <ul className="space-y-2 list-disc pl-5 text-gray-700">
            <li>অ্যাক্সেস, কারেকশন, আপডেট বা ডিলিটের অনুরোধ।</li>
            <li>প্রসেসিং সীমিত/আপত্তি, ডেটা পোর্টেবিলিটি।</li>
            <li>সম্মতি প্রত্যাহার (যেখানে প্রযোজ্য)।</li>
          </ul>
          <p className="text-gray-700 mt-2">এই অনুরোধগুলির জন্য “যোগাযোগ” সেকশনে দেওয়া ইমেল/হোয়াটসঅ্যাপে যোগাযোগ করুন। আমরা পরিচয় যাচাইয়ের জন্য অতিরিক্ত তথ্য চাইতে পারি।</p>
        </article>

        <article id="children" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><FileWarning className="h-6 w-6 text-red-600" /> শিশুদের গোপনীয়তা</h3>
          <p className="text-gray-700 leading-relaxed">আমাদের সেবা ১৩ বছরের কম বয়সী শিশুদের উদ্দেশ্যে নয় এবং আমরা সচেতনভাবে শিশুদের কাছ থেকে ব্যক্তিগত ডেটা সংগ্রহ করি না। যদি আপনি মনে করেন যে কোনো শিশুর ডেটা আমাদের কাছে এসেছে, অবিলম্বে জানান—আমরা তা মুছে ফেলব।</p>
        </article>

        <article id="compliance" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><FileCheck2 className="h-6 w-6 text-green-600" /> কমপ্লায়েন্স ও রেগুলেশন</h3>
          <ul className="space-y-2 list-disc pl-5 text-gray-700">
            <li>বাংলাদেশের প্রযোজ্য ভোক্তা ও ডেটা-প্রটেকশন আইনের সাথে সামঞ্জস্য।</li>
            <li>আন্তর্জাতিক মানদণ্ড: সম্মতি-ভিত্তিক মার্কেটিং, ডেটা-মিনিমাইজেশন, পারপাস-লিমিটেশন।</li>
            <li>থার্ড-পার্টির সাথে ডেটা প্রসেসিং এগ্রিমেন্ট ও উপযুক্ত সিকিউরিটি কন্ট্রোল।</li>
          </ul>
        </article>

        <article id="changes" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><RefreshCcw className="h-6 w-6 text-sky-600" /> পলিসি আপডেট</h3>
          <p className="text-gray-700 leading-relaxed">আমরা সময়ে সময়ে এই প্রাইভেসি পলিসি আপডেট করতে পারি। গুরুত্বপূর্ণ পরিবর্তন হলে ওয়েবসাইটে নোটিস/ইমেইল/অ্যাপ নোটিফিকেশন দিয়ে জানানো হবে। “শেষ আপডেট” তারিখ উপরে দেখুন।</p>
        </article>

        <article id="contact" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><Bell className="h-6 w-6 text-indigo-600" /> কিভাবে যোগাযোগ করবেন</h3>
          <div className="grid md:grid-cols-3 gap-4 text-gray-700">
            <a href={`mailto:${CONTACT.MAIL}`} className="rounded-xl border p-4 hover:bg-gray-50 flex items-center gap-3">
              <Mail className="h-5 w-5 text-indigo-600" /> {CONTACT.MAIL}
            </a>
            <a href={`tel:${CONTACT.PHONE}`} className="rounded-xl border p-4 hover:bg-gray-50 flex items-center gap-3">
              <Phone className="h-5 w-5 text-emerald-600" /> {CONTACT.PHONE}
            </a>
            <a href={CONTACT.WHATSAPP} target="_blank" rel="noreferrer" className="rounded-xl border p-4 hover:bg-gray-50 flex items-center gap-3">
              <i className="fa-brands fa-whatsapp text-green-600"></i> WhatsApp
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-3">আইনি নোটিশ: এই ডকুমেন্টটি সাধারণ তথ্যের জন্য; এটি আইনগত পরামর্শ নয়।</p>
        </article>
      </section>
    </div>
  );
}
