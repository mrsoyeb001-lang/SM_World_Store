import {
  ShieldCheck,
  FileText,
  Lock,
  RefreshCcw,
  Scale,
  Truck,
  Coins,
  CreditCard,
  Handshake,
  Megaphone,
  Globe,
  User,
  FileWarning,
  Receipt,
  PackageOpen,
  Undo2,
  BadgePercent,
  ExternalLink,
  MessageSquare,
  Gavel,
  CircleAlert,
  Mail,
  Phone,
} from "lucide-react";

/**
 * Bangla Terms & Conditions page for SM World Store
 * - Production‑ready React + Tailwind
 * - Matches the look/feel of your PrivacyPolicy component
 * - Covers: Orders, Pricing, Payment, Shipping, Returns, Warranty, Affiliate program,
 *   Promotions, IP, Liability, Disputes (Bangladesh law), Changes, and Contact.
 */

const CONTACT = {
  SITE: "SM World Store",
  URL: "https://smworldstore.vercel.app",
  MAIL: "smworldstoreofficial@gmail.com",
  PHONE: "+8801624712851",
  WHATSAPP: "https://wa.me/+8801624712851",
};

export default function TermsAndConditions() {
  const today = new Date();
  const lastUpdated = today.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sections = [
    { id: "about", title: "সারসংক্ষেপ ও ডেফিনিশন", icon: <ShieldCheck className="h-5 w-5 text-emerald-600" /> },
    { id: "eligibility", title: "যোগ্যতা ও অ্যাকাউন্ট", icon: <User className="h-5 w-5 text-indigo-600" /> },
    { id: "orders", title: "অর্ডার, মূল্য ও ইনভেন্টরি", icon: <Receipt className="h-5 w-5 text-blue-600" /> },
    { id: "payment", title: "পেমেন্ট নীতি", icon: <CreditCard className="h-5 w-5 text-fuchsia-600" /> },
    { id: "shipping", title: "শিপিং ও ডেলিভারি", icon: <Truck className="h-5 w-5 text-cyan-600" /> },
    { id: "returns", title: "রিটার্ন/রিফান্ড", icon: <Undo2 className="h-5 w-5 text-rose-600" /> },
    { id: "warranty", title: "ওয়ারেন্টি ও সার্ভিস", icon: <PackageOpen className="h-5 w-5 text-amber-600" /> },
    { id: "affiliate", title: "এফিলিয়েট/রেফারেল প্রোগ্রাম", icon: <Handshake className="h-5 w-5 text-green-600" /> },
    { id: "promo", title: "অফার, কুপন ও গিফট কার্ড", icon: <BadgePercent className="h-5 w-5 text-violet-600" /> },
    { id: "ip", title: "ইন্টেলেকচুয়াল প্রপার্টি", icon: <FileText className="h-5 w-5 text-slate-600" /> },
    { id: "conduct", title: "ব্যবহারকারীর আচরণ ও নিষিদ্ধ কাজ", icon: <CircleAlert className="h-5 w-5 text-orange-600" /> },
    { id: "privacy", title: "ডেটা প্রাইভেসি", icon: <Lock className="h-5 w-5 text-emerald-700" /> },
    { id: "liability", title: "দায় সীমাবদ্ধতা ও ইনডেমনিটি", icon: <Scale className="h-5 w-5 text-pink-600" /> },
    { id: "dispute", title: "বিবাদ নিষ্পত্তি ও আইন", icon: <Gavel className="h-5 w-5 text-sky-600" /> },
    { id: "changes", title: "টার্মস পরিবর্তন", icon: <RefreshCcw className="h-5 w-5 text-teal-600" /> },
    { id: "contact", title: "যোগাযোগ", icon: <MessageSquare className="h-5 w-5 text-indigo-600" /> },
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
                <FileText className="h-4 w-4" />
                শর্তাবলী — {CONTACT.SITE}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
                সেবার শর্তাবলী (Terms & Conditions)
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                আমাদের ওয়েবসাইট/অ্যাপ ও পরিষেবা ব্যবহারের পূর্বে অনুগ্রহ করে এই শর্তাবলী ভালোভাবে পড়ুন।
                এই শর্তাবলীর মাধ্যমে {CONTACT.SITE} এবং ব্যবহারকারীর মধ্যে একটি বাধ্যতামূলক চুক্তি সম্পাদিত হয়। শেষ আপডেট: {lastUpdated}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <Globe className="h-4 w-4 text-blue-600" /> {CONTACT.URL}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> বিশ্বস্ত ও নিরাপদ কেনাকাটা
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <Megaphone className="h-4 w-4 text-rose-600" /> স্বচ্ছ নীতি
                </span>
              </div>
            </div>

            {/* Quick card */}
            <div className="relative rounded-3xl border bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-200/40 via-white to-fuchsia-200/40" />
              <div className="overflow-hidden rounded-2xl border bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Quick Facts</p>
                    <h3 className="mt-1 text-xl font-bold">বিশ্বাস, স্বচ্ছতা ও সুবিধা</h3>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><Coins className="h-4 w-4" /> মূল্য পরিবর্তনশীল হতে পারে; চেকআউটের সময়কার মূল্য চূড়ান্ত।</li>
                  <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> কস্ট-ইফেক্টিভ শিপিং; ট্র্যাকিং প্রদান করা হতে পারে।</li>
                  <li className="flex items-center gap-2"><Undo2 className="h-4 w-4" /> যুক্তিসংগত শর্তে রিটার্ন/রিফান্ড উপলব্ধ।</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOC */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">দ্রুত নেভিগেশন</h2>
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
      <section className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        {/* 1. Summary */}
        <article id="about" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><ShieldCheck className="h-6 w-6 text-emerald-600" /> সারসংক্ষেপ ও ডেফিনিশন</h3>
          <p className="leading-relaxed text-gray-700">
            “আমরা/আমাদের/ওয়েবসাইট” বলতে {CONTACT.SITE} বোঝানো হয়েছে। “ব্যবহারকারী/আপনি” বলতে যেকোনো দর্শক, গ্রাহক বা অ্যাকাউন্টধারী।
            এই শর্তগুলো {CONTACT.URL} এবং সংযুক্ত মোবাইল/ওয়েব সেবার ক্ষেত্রে প্রযোজ্য। আমাদের নীতিমালা সময়ে সময়ে আপডেট হতে পারে।
          </p>
        </article>

        {/* 2. Eligibility */}
        <article id="eligibility" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><User className="h-6 w-6 text-indigo-600" /> যোগ্যতা ও অ্যাকাউন্ট</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>ব্যবহারকারীকে আইনত প্রাপ্তবয়স্ক/চুক্তিযোগ্য হতে হবে।</li>
            <li>অ্যাকাউন্ট তথ্য সঠিক, পূর্ণাঙ্গ ও আপডেটেড রাখতে হবে; নিরাপত্তার জন্য লগইন তথ্য গোপন রাখবেন।</li>
            <li>আমাদের নীতি ভঙ্গ বা ফ্রড সন্দেহ হলে অ্যাকাউন্ট সাময়িক/স্থায়ীভাবে স্থগিত করা হতে পারে।</li>
          </ul>
        </article>

        {/* 3. Orders */}
        <article id="orders" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><Receipt className="h-6 w-6 text-blue-600" /> অর্ডার, মূল্য ও ইনভেন্টরি</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>যেকোনো অর্ডার আমাদের গ্রহণ/ভেরিফিকেশনের উপর নির্ভরশীল। ভুল মূল্য/ভুল স্টকের ক্ষেত্রে অর্ডার বাতিল বা আপডেট হতে পারে।</li>
            <li>চেকআউটের সময়কার ট্যাক্স/ডেলিভারি চার্জসহ মোট মূল্যই প্রযোজ্য।</li>
            <li>প্রোডাক্টের ছবি/বিবরণ বাস্তবের সাথে সামান্য ভিন্ন হতে পারে; রঙ/লাইটিং/ব্যাচভেদে পার্থক্য সম্ভব।</li>
          </ul>
        </article>

        {/* 4. Payment */}
        <article id="payment" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><CreditCard className="h-6 w-6 text-fuchsia-600" /> পেমেন্ট নীতি</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>আমরা অনুমোদিত গেটওয়েতে পেমেন্ট গ্রহণ করি; কার্ড তথ্য আমাদের সার্ভারে সংরক্ষিত হয় না।</li>
            <li>প্রিপেইড/ক্যাশ-অন-ডেলিভারি (COD) (যেখানে প্রযোজ্য) — নির্দিষ্ট এলাকায়/অর্ডার ভ্যালুতে সীমাবদ্ধ হতে পারে।</li>
            <li>ফ্রড প্রতিরোধে অতিরিক্ত ভেরিফিকেশন বা অগ্রিম প্রদান চাওয়া হতে পারে।</li>
          </ul>
        </article>

        {/* 5. Shipping */}
        <article id="shipping" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><Truck className="h-6 w-6 text-cyan-600" /> শিপিং ও ডেলিভারি</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>ডেলিভারি সময় আনুমানিক; কুরিয়ার/লজিস্টিকসের কারণে বিলম্ব হতে পারে।</li>
            <li>শিপিং চার্জ/কভারেজ এরিয়া চেকআউটে দেখানো হবে; ট্র্যাকিং নম্বর (যেখানে সম্ভব) প্রদান করা হয়।</li>
            <li>ডেলিভারি নিতে ব্যর্থ হলে রি-ডেলিভারি/স্টোরেজ চার্জ প্রযোজ্য হতে পারে।</li>
          </ul>
        </article>

        {/* 6. Returns */}
        <article id="returns" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><Undo2 className="h-6 w-6 text-rose-600" /> রিটার্ন/রিফান্ড</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>ডেলিভারির পর যুক্তিসংগত সময়ে (যেমন ৭ দিন) অরিজিনাল কন্ডিশনে রিটার্ন গ্রহণ করা হতে পারে; হাইজিন/ডিজিটাল পণ্য ব্যতীত।</li>
            <li>ম্যানুফ্যাকচারিং ডিফেক্ট/ভুল পণ্য পেলে প্রমাণসহ সাপোর্টে জানান; পর্যালোচনার পর রিপ্লেস/রিফান্ড।</li>
            <li>শিপিং/হ্যান্ডলিং চার্জ সাধারণত ফেরতযোগ্য নয়; বিস্তারিত রিটার্ন নীতিতে দেখুন।</li>
          </ul>
        </article>

        {/* 7. Warranty */}
        <article id="warranty" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><PackageOpen className="h-6 w-6 text-amber-600" /> ওয়ারেন্টি ও সার্ভিস</h3>
          <p className="text-gray-700 leading-relaxed">
            নির্দিষ্ট পণ্যে ব্র্যান্ড/সাপ্লায়ার প্রদত্ত ওয়ারেন্টি প্রযোজ্য হতে পারে। ওয়ারেন্টি ক্লেইমের জন্য ইনভয়েস/প্যাকেজিং সংরক্ষণ করুন এবং নির্দেশনা অনুসরণ করুন।
          </p>
        </article>

        {/* 8. Affiliate */}
        <article id="affiliate" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><Handshake className="h-6 w-6 text-green-600" /> এফিলিয়েট/রেফারেল প্রোগ্রাম</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>অ্যাকাউন্ট ভেরিফিকেশন সাপেক্ষে এফিলিয়েট সক্রিয় করা হয়; ড্যাশবোর্ডে রেফারেল লিংক/কোড দেখবেন।</li>
            <li>আপনার রেফারেল লিংক দিয়ে সফল অর্ডারে বেস কমিশন (যেমন ৫%) প্রযোজ্য; ক্যাটাগরি/ক্যাম্পেইনভেদে পরিবর্তন হতে পারে।</li>
            <li>ক্যান্সেল/রিটার্ন/ফ্রড অর্ডার কমিশনযোগ্য নয়; কমপ্লায়েন্স ভঙ্গ হলে কমিশন বাতিল/অ্যাকাউন্ট স্থগিত হতে পারে।</li>
            <li>মাসিক সাইকেলে পেআউট; ন্যূনতম পেআউট থ্রেশহোল্ড/চার্জ প্রযোজ্য হতে পারে। সঠিক ব্যাংক/মোবাইল ব্যাংকিং তথ্য প্রদান করতে হবে।</li>
            <li>স্প্যাম, বিভ্রান্তিকর বিজ্ঞাপন, বেআইনি ট্রাফিক, কুকি স্টাফিং সম্পূর্ণ নিষিদ্ধ।</li>
          </ul>
        </article>

        {/* 9. Promo */}
        <article id="promo" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><BadgePercent className="h-6 w-6 text-violet-600" /> অফার, কুপন ও গিফট কার্ড</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>কুপন/ভাউচার/পয়েন্ট নির্দিষ্ট মেয়াদ ও শর্তসাপেক্ষ; নগদে রিডিম নয়।</li>
            <li>একাধিক অফার একসাথে প্রযোজ্য নাও হতে পারে; অপব্যবহারে অর্ডার বাতিলের অধিকার সংরক্ষিত।</li>
          </ul>
        </article>

        {/* 10. IP */}
        <article id="ip" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><FileText className="h-6 w-6 text-slate-600" /> ইন্টেলেকচুয়াল প্রপার্টি</h3>
          <p className="text-gray-700 leading-relaxed">
            সাইটের কনটেন্ট, লোগো, ডিজাইন, টেক্সট, গ্রাফিক্স এবং সফটওয়্যার {CONTACT.SITE}-এর বা সংশ্লিষ্ট লাইসেন্সদাতার মালিকানাধীন। লিখিত অনুমতি ছাড়া কোনো কন্টেন্ট কপি/রিপাবলিশ করা যাবে না।
          </p>
        </article>

        {/* 11. Conduct */}
        <article id="conduct" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><CircleAlert className="h-6 w-6 text-orange-600" /> ব্যবহারকারীর আচরণ ও নিষিদ্ধ কাজ</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>আইনবিরুদ্ধ, আপত্তিকর, হেট স্পিচ, পর্নোগ্রাফিক, সহিংস কনটেন্ট পোস্ট/শেয়ার নিষিদ্ধ।</li>
            <li>হ্যাকিং, স্ক্র্যাপিং, বট/অটোমেশন, অননুমোদিত অ্যাক্সেস নিষিদ্ধ।</li>
            <li>ভুয়া অর্ডার/রিভিউ/চার্জব্যাক অপব্যবহার করলে আইনগত ব্যবস্থা নেওয়া হতে পারে।</li>
          </ul>
        </article>

        {/* 12. Privacy */}
        <article id="privacy" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><Lock className="h-6 w-6 text-emerald-700" /> ডেটা প্রাইভেসি</h3>
          <p className="text-gray-700 leading-relaxed">
            আমরা আপনার তথ্য সুরক্ষায় প্রতিশ্রুতিবদ্ধ। আমাদের <a href="/privacy-policy" className="text-indigo-600 underline">প্রাইভেসি পলিসি</a> দেখুন—কোন ডেটা সংগ্রহ করি, কিভাবে ব্যবহার করি এবং আপনার অধিকারসমূহ।
          </p>
        </article>

        {/* 13. Liability */}
        <article id="liability" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><Scale className="h-6 w-6 text-pink-600" /> দায় সীমাবদ্ধতা ও ইনডেমনিটি</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>সাইট ব্যবহারের ফলে কোনো প্রত্যক্ষ/পরোক্ষ ক্ষতি, ডেটা লস, মুনাফা ক্ষতি ইত্যাদির জন্য {CONTACT.SITE} সাধারণত দায়ী নয়, আইন যেখানে সীমা নির্ধারণ করেছে তা ব্যতীত।</li>
            <li>আপনার অবহেলা/নীতি ভঙ্গ/বেআইনি কার্যকলাপের কারণে তৃতীয় পক্ষের দাবি হলে তার ক্ষতিপূরণ আপনাকে বহন করতে হতে পারে (ইনডেমনিটি)।</li>
          </ul>
        </article>

        {/* 14. Dispute */}
        <article id="dispute" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><Gavel className="h-6 w-6 text-sky-600" /> বিবাদ নিষ্পত্তি ও প্রযোজ্য আইন</h3>
          <p className="text-gray-700 leading-relaxed">
            আলোচনার মাধ্যমে সমস্যা সমাধানের চেষ্টা করা হবে; প্রয়োজন হলে বাংলাদেশের প্রযোজ্য আইন অনুযায়ী সালিশি/আদালত পর্যায়ে নিষ্পত্তি হবে। আদালতের এখতিয়ার—ঢাকা, বাংলাদেশ।
          </p>
        </article>

        {/* 15. Changes */}
        <article id="changes" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><RefreshCcw className="h-6 w-6 text-teal-600" /> টার্মস পরিবর্তন</h3>
          <p className="text-gray-700 leading-relaxed">
            আমরা সময়ে সময়ে এই শর্তাবলী আপডেট করতে পারি। পরিবর্তন কার্যকর হওয়ার পর সাইট ব্যবহার অব্যাহত রাখলে আপনি সংশোধিত শর্তাবলী মেনে নিয়েছেন বলে গণ্য হবে।
          </p>
        </article>

        {/* 16. Contact */}
        <article id="contact" className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold"><MessageSquare className="h-6 w-6 text-indigo-600" /> যোগাযোগ</h3>
          <div className="grid gap-4 md:grid-cols-3 text-gray-700">
            <a href={`mailto:${CONTACT.MAIL}`} className="flex items-center gap-3 rounded-xl border p-4 hover:bg-gray-50"><Mail className="h-5 w-5 text-indigo-600" /> {CONTACT.MAIL}</a>
            <a href={`tel:${CONTACT.PHONE}`} className="flex items-center gap-3 rounded-xl border p-4 hover:bg-gray-50"><Phone className="h-5 w-5 text-emerald-600" /> {CONTACT.PHONE}</a>
            <a href={CONTACT.WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border p-4 hover:bg-gray-50"><ExternalLink className="h-5 w-5 text-green-600" /> WhatsApp</a>
          </div>
          <p className="mt-3 text-xs text-gray-500">আইনি নোটিশ: এই ডকুমেন্টটি সাধারণ তথ্যের জন্য; এটি আইনগত পরামর্শ নয়। প্রয়োজনে আইন বিশেষজ্ঞের সহায়তা নিন।</p>
        </article>
      </section>
    </div>
  );
}
