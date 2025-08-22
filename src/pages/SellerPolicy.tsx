/* eslint-disable react/no-unescaped-entities */
import {
  ShieldCheck,
  BadgeCheck,
  Package,
  PackageCheck,
  Truck,
  RefreshCcw,
  Tag,
  Wallet,
  Gavel,
  Ban,
  Scale,
  Lock,
  LifeBuoy,
  Mail,
  Phone,
  MessageSquare,
  History,
  ListChecks,
  Timer,
  FileBadge2,
  ChevronRight,
  Globe,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

const CONTACT = {
  SITE: "SM World Store",
  URL: "https://smworldstore.vercel.app",
  MAIL: "smworldstoreofficial@gmail.com",
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
    { id: "eligibility", title: "সেলার যোগ্যতা ও যাচাই", icon: <BadgeCheck className="h-5 w-5 text-indigo-600" /> },
    { id: "listing", title: "প্রোডাক্ট লিস্টিং নীতি", icon: <Package className="h-5 w-5 text-blue-600" /> },
    { id: "pricing", title: "প্রাইসিং ও প্রমোশন", icon: <Tag className="h-5 w-5 text-fuchsia-600" /> },
    { id: "orders", title: "অর্ডার, ফালফিলমেন্ট ও SLA", icon: <PackageCheck className="h-5 w-5 text-emerald-700" /> },
    { id: "shipping", title: "শিপিং ও ডেলিভারি", icon: <Truck className="h-5 w-5 text-cyan-600" /> },
    { id: "payment", title: "কমিশন ও পেআউট", icon: <Wallet className="h-5 w-5 text-violet-600" /> },
    { id: "return", title: "রিটার্ন/রিফান্ড/বিতর্ক", icon: <RefreshCcw className="h-5 w-5 text-sky-600" /> },
    { id: "prohibited", title: "নিষিদ্ধ/সীমাবদ্ধ পণ্য", icon: <Ban className="h-5 w-5 text-red-600" /> },
    { id: "compliance", title: "কমপ্লায়েন্স ও পেনাল্টি", icon: <Gavel className="h-5 w-5 text-orange-600" /> },
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
                <FileBadge2 className="h-4 w-4" />
                Seller Policy — {CONTACT.SITE}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
                সেলারদের জন্য স্মার্ট, স্বচ্ছ ও প্রফেশনাল নীতিমালা
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {CONTACT.SITE}-এ বিক্রি করতে চাইলে নিচের নিয়মাবলি প্রযোজ্য। কাস্টমার এক্সপেরিয়েন্স, প্রডাক্ট
                কোয়ালিটি এবং সময়মতো ডেলিভারিই আমাদের অগ্রাধিকার। <span className="font-medium">শেষ আপডেট:</span> {updated}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Badge pill text="KYC ভেরিফায়েড" icon={<BadgeCheck className="h-4 w-4 text-white" />} />
                <Badge pill text="SLA কমিটেড" icon={<Timer className="h-4 w-4 text-white" />} />
                <Badge pill text="ন্যাশনওয়াইড কভারেজ" icon={<Globe className="h-4 w-4 text-white" />} />
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
                  <ListChecks className="h-6 w-6 text-indigo-600" />
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> মানসম্মত লিস্টিং ও সময়মতো ফালফিলমেন্ট
                  </li>
                  <li className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-violet-600" /> স্বচ্ছ কমিশন ও নির্ধারিত পেআউট সাইকেল
                  </li>
                  <li className="flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-orange-500" /> লঙ্ঘনে পেনাল্টি/ব্যান প্রযোজ্য
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hero CTA */}
          <div className="mt-8 flex gap-4">
            <a
              href={`${CONTACT.URL}/auth`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-white font-medium shadow hover:opacity-95"
            >
              <UserPlus className="h-5 w-5" />
              এফিলিয়েট যোগ দিন
            </a>
            <a
              href={`${CONTACT.URL}/auth`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 py-3 text-white font-medium shadow hover:opacity-95"
            >
              <ChevronRight className="h-5 w-5" />
              সেলার রেজিস্ট্রেশন
            </a>
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
        {/* এখানে উপরে দেওয়া সব Article সেকশন যাবে */}
        {/* তুমি আগের মতো সব কনটেন্ট রাখবে */}
      </section>
    </div>
  );
}

/* ---------- Reusable Bits ---------- */
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
      <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </article>
  );
}

function Badge({
  text,
  icon,
  pill = true,
}: {
  text: string;
  icon: React.ReactNode;
  pill?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${
        pill ? "rounded-full" : "rounded-md"
      } bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-sm font-medium text-white shadow`}
    >
      {icon}
      {text}
    </span>
  );
}
