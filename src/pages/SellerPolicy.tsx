/* eslint-disable react/no-unescaped-entities */
import {
  ShieldCheck,
  BadgeCheck,
  FileBadge2,
  FileWarning,
  Handshake,
  Package,
  PackageCheck,
  PackageX,
  Tag,
  TicketPercent,
  DollarSign,
  Wallet,
  Banknote,
  Truck,
  TruckIcon,
  RefreshCcw,
  Timer,
  Ban,
  Gavel,
  Scale,
  Info,
  LifeBuoy,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  Lock,
  Users,
  ListChecks,
  History,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const CONTACT = {
  SITE: "SM World Store",
  EMAIL: "smworldstoreofficial@gmail.com",
  PHONE: "+8801624712851",
  WHATSAPP: "https://wa.me/+8801624712851",
};

export default function SellerPolicy() {
  const updated = new Date().toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sections = [
    { id: "overview", title: "সারসংক্ষেপ", icon: <ShieldCheck className="h-5 w-5 text-emerald-600" /> },
    { id: "eligibility", title: "সেলার যোগ্যতা ও ভেরিফিকেশন", icon: <BadgeCheck className="h-5 w-5 text-indigo-600" /> },
    { id: "listing", title: "প্রোডাক্ট লিস্টিং নীতি", icon: <Package className="h-5 w-5 text-blue-600" /> },
    { id: "pricing", title: "প্রাইসিং, ডিসকাউন্ট ও প্রমোশন", icon: <Tag className="h-5 w-5 text-fuchsia-600" /> },
    { id: "orders", title: "অর্ডার, ফালফিলমেন্ট ও SLA", icon: <PackageCheck className="h-5 w-5 text-emerald-700" /> },
    { id: "shipping", title: "শিপিং ও ডেলিভারি", icon: <Truck className="h-5 w-5 text-cyan-600" /> },
    { id: "payment", title: "কমিশন, পেআউট ও ইনভয়েসিং", icon: <Wallet className="h-5 w-5 text-violet-600" /> },
    { id: "return", title: "রিটার্ন, রিফান্ড ও বিতর্ক", icon: <RefreshCcw className="h-5 w-5 text-sky-600" /> },
    { id: "prohibited", title: "নিষিদ্ধ/সীমাবদ্ধ পণ্য", icon: <Ban className="h-5 w-5 text-red-600" /> },
    { id: "compliance", title: "কমপ্লায়েন্স, পেনাল্টি ও ব্যান", icon: <Gavel className="h-5 w-5 text-orange-600" /> },
    { id: "ip", title: "ব্র্যান্ড, কপিরাইট ও আইপি", icon: <Scale className="h-5 w-5 text-rose-600" /> },
    { id: "data", title: "ডেটা প্রাইভেসি ও সিকিউরিটি", icon: <Lock className="h-5 w-5 text-emerald-700" /> },
    { id: "changes", title: "নীতিমালা আপডেট", icon: <History className="h-5 w-5 text-gray-700" /> },
    { id: "support", title: "সাপোর্ট ও যোগাযোগ", icon: <LifeBuoy className="h-5 w-5 text-indigo-600" /> },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-fuchsia-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10">
          <div className="grid items-center gap-8 md:grid-cols-[1.05fr_.95fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-sm font-medium text-white shadow-sm">
                <Handshake className="h-4 w-4" />
                Seller Policy — {CONTACT.SITE}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
                পেশাদার বিক্রেতাদের জন্য স্বচ্ছ, নিরাপদ ও ন্যায্য নীতিমালা
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                আমাদের প্ল্যাটফর্মে সেলার হিসেবে কাজ করতে চাইলে নিচের নীতিমালা প্রযোজ্য। আমরা কাস্টমার এক্সপেরিয়েন্স,
                প্রোডাক্ট মান, এবং সময়মতো ডেলিভারিকে সর্বাধিক গুরুত্ব দিই। <span className="font-medium">শেষ আপডেট:</span> {updated}
              </p>

              {/* Hero Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <FileBadge2 className="h-4 w-4 text-purple-600" /> KYC ভেরিফায়েড সেলার
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <Timer className="h-4 w-4 text-emerald-600" /> SLA কমিটেড
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <Globe className="h-4 w-4 text-blue-600" /> ন্যাশনওয়াইড কভারেজ
                </span>
              </div>
            </div>

            {/* Snapshot Card */}
            <div className="relative rounded-3xl border bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-200/40 via-white to-fuchsia-200/40" />
              <div className="overflow-hidden rounded-2xl border bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Seller Snapshot</p>
                    <h3 className="mt-1 text-xl font-bold">আপনার গ্রোথ, আমাদের নীতি</h3>
                  </div>
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-emerald-600" /> মানসম্মত লিস্টিং ও সময়মতো ফালফিলমেন্ট
                  </li>
                  <li className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-violet-600" /> স্বচ্ছ কমিশন ও নির্ধারিত পেআউট সাইকেল
                  </li>
                  <li className="flex items-center gap-2">
                    <FileWarning className="h-4 w-4 text-orange-500" /> লঙ্ঘনে পেনাল্টি/ব্যান প্রযোজ্য
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
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
              >
                {s.icon}
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        {/* Overview */}
        <Article id="overview" icon={<ShieldCheck className="h-6 w-6 text-emerald-600" />} title="সারসংক্ষেপ">
          <p className="text-gray-700 leading-relaxed">
            {CONTACT.SITE} (“আমরা”, “প্ল্যাটফর্ম”)–এ সেলার হিসেবে যুক্ত হলে আপনি এই Seller Policy,{" "}
            <Link to="/terms" className="text-indigo-600 hover:underline">Terms</Link> এবং{" "}
            <Link to="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</Link>–এর অধীনে থাকবেন।
            কাস্টমার অভিজ্ঞতা, নিরাপত্তা ও আইনগত বাধ্যবাধকতা রক্ষাই আমাদের মূল উদ্দেশ্য।
          </p>
        </Article>

        {/* Eligibility & KYC */}
        <Article id="eligibility" icon={<BadgeCheck className="h-6 w-6 text-indigo-600" />} title="সেলার যোগ্যতা ও ভেরিফিকেশন">
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>সঠিক নাম, NID/Passport, ঠিকানা, সক্রিয় মোবাইল/ইমেইল—KYC আবশ্যক।</li>
            <li>একজন ব্যক্তি/ব্যবসা একটিই প্রাইমারি সেলার অ্যাকাউন্ট রাখতে পারবেন।</li>
            <li>ব্যবসায়িক ব্যাংক/মোবাইল ব্যাংকিং তথ্য যাচাইযোগ্য হতে হবে।</li>
            <li>ভুয়া/অসত্য তথ্য দিলে অ্যাকাউন্ট সাসপেন্ড/ব্যান হতে পারে।</li>
          </ul>
        </Article>

        {/* Listing */}
        <Article id="listing" icon={<Package className="h-6 w-6 text-blue-600" />} title="প্রোডাক্ট লিস্টিং নীতি">
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <ul className="list-disc pl-5 space-y-2">
              <li>অরিজিনাল/অনুমোদিত পণ্য—নকল/রেপ্লিকা নয়।</li>
              <li>শিরোনাম, বর্ণনা, ব্র্যান্ড, বৈশিষ্ট্য ও স্পেসিফিকেশন পরিষ্কারভাবে উল্লেখ করতে হবে।</li>
              <li>হাই-কোয়ালিটি ইমেজ (ওয়াটারমার্ক ছাড়া) ব্যবহার করতে হবে।</li>
              <li>স্টক আউট হলে তাৎক্ষণিকভাবে লিস্টিং আপডেট করা বাধ্যতামূলক।</li>
            </ul>
            <ul className="list-disc pl-5 space-y-2">
              <li>ভ্যারিয়্যান্ট (সাইজ/কালার/ওয়ারেন্টি) সঠিকভাবে সেট করতে হবে।</li>
              <li>ভুল দাবী (misleading claims) বা অতিরঞ্জিত মার্কেটিং নিষিদ্ধ।</li>
              <li>সিরিয়াল/IMEI থাকা আইটেমে বৈধ কাগজপত্র/ওয়ারেন্টি তথ্য সংযুক্ত করতে হবে।</li>
            </ul>
          </div>
        </Article>

        {/* Pricing */}
        <Article id="pricing" icon={<Tag className="h-6 w-6 text-fuchsia-600" />} title="প্রাইসিং, ডিসকাউন্ট ও প্রমোশন">
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>মূল্য VAT/Tax সহ (যদি প্রযোজ্য) স্বচ্ছভাবে প্রদর্শন করতে হবে।</li>
            <li>ভুল “মিথ্যা ডিসকাউন্ট” বা স্ট্রাইকথ্রু প্রাইসিং করা যাবে না।</li>
            <li>কুপন/ভাউচার/বুস্ট ক্যাম্পেইন শুধুমাত্র অনুমতিপ্রাপ্ত হলে ব্যবহারযোগ্য।</li>
          </ul>
        </Article>

        {/* Orders & SLA */}
        <Article id="orders" icon={<PackageCheck className="h-6 w-6 text-emerald-700" />} title="অর্ডার, ফালফিলমেন্ট ও SLA">
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>অর্ডার কনফার্মের পর <b>২৪ ঘণ্টার মধ্যে</b> প্যাকেট প্রস্তুত করতে হবে (ব্যবসায়িক দিন)।</li>
            <li>স্টক সমস্যা/ডিলে থাকলে কাস্টমারকে দ্রুত জানানো ও বিকল্প প্রস্তাব দেওয়া উত্তম।</li>
            <li>অর্ডার ক্যানসেল/রিশিপ/হারানো প্যাকেজ—প্ল্যাটফর্ম পলিসি অনুযায়ী নিষ্পত্তি হবে।</li>
            <li>SLA ভাঙলে রেটিং কমা/ভিজিবিলিটি কমা/পেনাল্টি প্রযোজ্য হতে পারে।</li>
          </ul>
        </Article>

        {/* Shipping */}
        <Article id="shipping" icon={<TruckIcon className="h-6 w-6 text-cyan-600" />} title="শিপিং ও ডেলিভারি">
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>অনুমোদিত কুরিয়ার/লজিস্টিক পার্টনারের মাধ্যমেই শিপমেন্ট পাঠাতে হবে।</li>
            <li>সঠিক প্যাকেজিং, ইনভয়েস/চালান ও ফ্র্যাজাইল আইটেমে উপযুক্ত সুরক্ষা আবশ্যক।</li>
            <li>ভুল ঠিকানা/ফোনের ক্ষেত্রে কাস্টমার/সাপোর্টের সঙ্গে সমন্বয় করবেন।</li>
          </ul>
        </Article>

        {/* Payment & Commission */}
        <Article id="payment" icon={<Wallet className="h-6 w-6 text-violet-600" />} title="কমিশন, পেআউট ও ইনভয়েসিং">
          <div className="text-gray-700 space-y-2">
            <p>প্রত্যেক সফল অর্ডারের উপর পূর্ব-ঘোষিত কমিশন কর্তন করা হয়। COD/গেটওয়ে ফি (যদি প্রযোজ্য) আলাদা থাকতে পারে।</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>পেআউট সাইকেল: সাপ্তাহিক/মাসিক (ড্যাশবোর্ডে প্রদর্শিত সময়সূচী)।</li>
              <li>রিটার্ন/চার্জব্যাক/ফ্রড কেসে সংশ্লিষ্ট এমাউন্ট হোল্ড হতে পারে।</li>
              <li>ব্যাংক/মোবাইল ব্যাংকিং তথ্য ঠিক না হলে পেআউট বিলম্বিত হবে।</li>
            </ul>
          </div>
        </Article>

        {/* Return & Dispute */}
        <Article id="return" icon={<RefreshCcw className="h-6 w-6 text-sky-600" />} title="রিটার্ন, রিফান্ড ও বিতর্ক নিষ্পত্তি">
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>ড্যামেজ/ভুল/মিসিং আইটেম—কাস্টমারের প্রমাণসহ রিটার্ন গ্রহণযোগ্য।</li>
            <li>রিটার্ন উইন্ডো প্ল্যাটফর্ম ক্যাটাগরি অনুযায়ী নির্ধারিত (সাধারণত ৭–১৪ দিন)।</li>
            <li>বিতর্ক হলে প্ল্যাটফর্মের সিদ্ধান্তই চূড়ান্ত; প্রয়োজনে ডকুমেন্ট/লগ যাচাই হবে।</li>
          </ul>
        </Article>

        {/* Prohibited */}
        <Article id="prohibited" icon={<Ban className="h-6 w-6 text-red-600" />} title="নিষিদ্ধ/সীমাবদ্ধ পণ্য">
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <ul className="list-disc pl-5 space-y-2">
              <li>নকল/পাইরেটেড/কপিরাইট-লঙ্ঘনকারী পণ্য</li>
              <li>অস্ত্র/বিস্ফোরক/ড্রাগ/হ্যাজার্ডাস কেমিক্যাল</li>
              <li>মেডিকেল/প্রেসক্রিপশন-নির্ভর পণ্য (অননুমোদিত)</li>
            </ul>
            <ul className="list-disc pl-5 space-y-2">
              <li>ঘৃণা/সহিংসতা/প্রাপ্তবয়স্ক কন্টেন্ট সম্পর্কিত আইটেম</li>
              <li>রিস্ট্রিকটেড ইলেকট্রনিক সার্ভেইলেন্স ডিভাইস</li>
              <li>যে কোনো আইন/রেগুলেশন-বিরোধী পণ্য</li>
            </ul>
          </div>
        </Article>

        {/* Compliance & Penalty */}
        <Article id="compliance" icon={<Gavel className="h-6 w-6 text-orange-600" />} title="কমপ্লায়েন্স, পেনাল্টি ও ব্যান">
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>পলিসি লঙ্ঘন করলে সতর্কতা, জরিমানা, লিস্টিং ডাউন, বা স্থায়ী ব্যান হতে পারে।</li>
            <li>ফেক অর্ডার/ভুয়া রিভিউ/ডাটা ম্যানিপুলেশন—শূন্য সহনশীলতা নীতি।</li>
            <li>আইনগত অনুরোধ/তদন্তে প্রয়োজনীয় তথ্য সরবরাহ করতে হবে।</li>
          </ul>
        </Article>

        {/* IP */}
        <Article id="ip" icon={<Scale className="h-6 w-6 text-rose-600" />} title="ব্র্যান্ড, কপিরাইট ও আইপি সুরক্ষা">
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>ব্র্যান্ডের অনুমতি ছাড়া ট্রেডমার্কড আইটেম বিক্রি নিষিদ্ধ।</li>
            <li>আইপি-টেকডাউন রিকোয়েস্ট পেলে লিস্টিং সাময়িকভাবে সাসপেন্ড হতে পারে।</li>
            <li>বারবার লঙ্ঘনে স্থায়ী নিষেধাজ্ঞা প্রযোজ্য।</li>
          </ul>
        </Article>

        {/* Data & Security */}
        <Article id="data" icon={<Lock className="h-6 w-6 text-emerald-700" />} title="ডেটা প্রাইভেসি ও সিকিউরিটি">
          <p className="text-gray-700">
            কাস্টমারের তথ্য শুধুমাত্র অর্ডার প্রসেসিংয়ের জন্য ব্যবহার করবেন; অন্য কোনো মার্কেটিং/শেয়ারিং কঠোরভাবে নিষিদ্ধ।
            আমাদের <Link to="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</Link> অনুসরণ করুন।
          </p>
        </Article>

        {/* Changes */}
        <Article id="changes" icon={<History className="h-6 w-6 text-gray-700" />} title="নীতিমালা আপডেট">
          <p className="text-gray-700">
            প্রয়োজন অনুসারে আমরা Seller Policy আপডেট করতে পারি। গুরুত্বপূর্ণ পরিবর্তনে ড্যাশবোর্ড নোটিস/ইমেইল করা হবে। “শেষ আপডেট” তারিখ উপরে দেখুন।
          </p>
        </Article>

        {/* Support */}
        <Article id="support" icon={<LifeBuoy className="h-6 w-6 text-indigo-600" />} title="সাপোর্ট ও যোগাযোগ">
          <div className="grid md:grid-cols-3 gap-4 text-gray-700">
            <a href={`mailto:${CONTACT.EMAIL}`} className="rounded-xl border p-4 hover:bg-gray-50 flex items-center gap-3">
              <Mail className="h-5 w-5 text-indigo-600" /> {CONTACT.EMAIL}
            </a>
            <a href={`tel:${CONTACT.PHONE}`} className="rounded-xl border p-4 hover:bg-gray-50 flex items-center gap-3">
              <Phone className="h-5 w-5 text-emerald-600" /> {CONTACT.PHONE}
            </a>
            <a href={CONTACT.WHATSAPP} target="_blank" rel="noreferrer" className="rounded-xl border p-4 hover:bg-gray-50 flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-green-600" /> WhatsApp
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-3">আইনি নোটিশ: এই ডকুমেন্ট সাধারণ তথ্যের জন্য; এটি আইনগত পরামর্শ নয়।</p>
        </Article>

        {/* CTA */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xl font-semibold">সেলার হতে প্রস্তুত?</h4>
            <p className="text-gray-600">নীতিমালা মেনে দ্রুত ভেরিফিকেশন সম্পন্ন করুন—আপনার ব্যবসা গ্রো করতে আমরা সাথে আছি।</p>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-white font-medium shadow hover:opacity-95"
          >
            সেলার রেজিস্ট্রেশন <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

/** ---------- Small Article Shell (for tidy markup) ---------- */
function Article({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article id={id} className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">{icon} {title}</h3>
      {children}
    </article>
  );
}
