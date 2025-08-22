/* eslint-disable react/no-unescaped-entities */
import {
  Cookie,
  Shield,
  Settings,
  LineChart,
  BellRing,
  Globe,
  Timer,
  Lock,
  CheckCircle2,
  Info,
  Wrench,
  Mail,
  Phone,
  ExternalLink,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

const CONTACT = {
  SITE: "SM World Store",
  URL: "https://smworldstore.vercel.app",
  MAIL: "smworldstoreofficial@gmail.com",
  PHONE: "+8801624712851",
  WHATSAPP: "https://wa.me/+8801624712851",
};

export default function CookiePolicy() {
  const updated = new Date().toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const toc = [
    { id: "about", icon: <Cookie className="h-4 w-4" />, label: "কুকি কী ও কেন" },
    { id: "types", icon: <Settings className="h-4 w-4" />, label: "আমরা কোন কোন কুকি ব্যবহার করি" },
    { id: "third", icon: <Globe className="h-4 w-4" />, label: "থার্ড-পার্টি কুকি" },
    { id: "duration", icon: <Timer className="h-4 w-4" />, label: "কুকির মেয়াদ" },
    { id: "manage", icon: <Wrench className="h-4 w-4" />, label: "কুকি ম্যানেজমেন্ট" },
    { id: "privacy", icon: <Lock className="h-4 w-4" />, label: "ডেটা প্রাইভেসি ও সিকিউরিটি" },
    { id: "consent", icon: <CheckCircle2 className="h-4 w-4" />, label: "সম্মতি ও সেটিংস" },
    { id: "update", icon: <FileCheck2 className="h-4 w-4" />, label: "পলিসি আপডেট" },
    { id: "contact", icon: <Mail className="h-4 w-4" />, label: "যোগাযোগ" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* --- Decorative SVG Backgrounds --- */}
      <BgBlobs />
      <GridPattern />

      <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* HERO */}
        <header className="relative overflow-hidden rounded-3xl border bg-white/70 shadow-lg backdrop-blur">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="relative p-8 md:p-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-xs font-medium text-white shadow">
              <ShieldCheck className="h-4 w-4" />
              Cookie Policy — {CONTACT.SITE}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              🍪 কুকি পলিসি: স্বচ্ছতা, নিয়ন্ত্রণ ও নিরাপত্তা
            </h1>
            <p className="mt-3 text-gray-600 md:text-lg">
              আমরা আপনার অভিজ্ঞতা উন্নত করতে, পারফরম্যান্স মাপতে এবং কনটেন্ট/অ্যাডস পার্সোনালাইজ করতে কুকি ব্যবহার করি।
              আপনি যেকোনো সময় আপনার পছন্দ পরিবর্তন করতে পারবেন। <span className="font-medium">শেষ আপডেট:</span> {updated}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge text="সম্মতিভিত্তিক ব্যবহার" icon={<Shield className="h-4 w-4" />} />
              <Badge text="কুকি পছন্দ নিয়ন্ত্রণযোগ্য" icon={<Settings className="h-4 w-4" />} />
              <Badge text="আন্তর্জাতিক মানদণ্ড" icon={<Globe className="h-4 w-4" />} />
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="mt-10 grid gap-6 md:grid-cols-[260px_1fr]">
          {/* TOC */}
          <aside className="md:sticky md:top-6 h-max">
            <nav className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">দ্রুত নেভিগেশন</h3>
              <ul className="space-y-1">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="group flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <span className="text-indigo-600">{t.icon}</span>
                      <span className="group-hover:text-gray-900">{t.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Quick Actions */}
            <div className="mt-4 rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur">
              <h4 className="text-sm font-semibold text-gray-800">দ্রুত একশন</h4>
              <div className="mt-3 grid gap-2">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-sm font-medium text-white shadow hover:opacity-95"
                >
                  কুকি পছন্দ ম্যানেজ করুন <Settings className="h-4 w-4" />
                </Link>
                <Link
                  to="/privacy-policy"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  প্রাইভেসি পলিসি <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="space-y-8">
            <Article id="about" icon={<Info className="h-6 w-6 text-indigo-600" />} title="কুকি কী ও কেন আমরা ব্যবহার করি">
              <p className="text-gray-700">
                কুকি হলো ছোট টেক্সট ফাইল যা আপনার ব্রাউজারে সেভ হয়। এগুলো ওয়েবসাইটকে সঠিকভাবে চালাতে, লগইন/কার্ট মনে রাখতে,
                পারফরম্যান্স বুঝতে ও পার্সোনালাইজড কনটেন্ট দিতে সাহায্য করে। কুকি আপনার ডিভাইসের কোনো ক্ষতি করে না।
              </p>
            </Article>

            <Article id="types" icon={<Settings className="h-6 w-6 text-emerald-600" />} title="আমরা কোন কোন কুকি ব্যবহার করি">
              <div className="grid gap-4 md:grid-cols-2">
                <FeatureCard
                  icon={<Shield className="h-5 w-5 text-indigo-600" />}
                  title="Essential / Functional"
                  desc="লগইন, সেশন ম্যানেজমেন্ট, সিকিউরিটি ও কার্টের মতো মৌলিক ফিচারের জন্য আবশ্যক।"
                  badge="Required"
                />
                <FeatureCard
                  icon={<LineChart className="h-5 w-5 text-fuchsia-600" />}
                  title="Analytics / Performance"
                  desc="পেজ ভিজিট, ইভেন্ট, কনভার্সন ইত্যাদির অ্যানালিটিক্স—সাইট উন্নত করতে সহায়ক।"
                  badge="Optional"
                />
                <FeatureCard
                  icon={<BellRing className="h-5 w-5 text-orange-600" />}
                  title="Marketing / Ads"
                  desc="রিমার্কেটিং ও প্রাসঙ্গিক অফার দেখাতে ব্যবহৃত—সবসময় সম্মতিভিত্তিক।"
                  badge="Consent"
                />
                <FeatureCard
                  icon={<Globe className="h-5 w-5 text-cyan-600" />}
                  title="Preferences"
                  desc="ভাষা, অঞ্চল, থিম, নোটিফিকেশন সেটিংসের মতো প্রেফারেন্স মনে রাখে।"
                  badge="Optional"
                />
              </div>
            </Article>

            <Article id="third" icon={<Globe className="h-6 w-6 text-blue-600" />} title="থার্ড-পার্টি কুকি">
              <p className="text-gray-700">
                আমরা Google Analytics, Facebook Pixel, TikTok Pixel ইত্যাদির মতো সার্ভিস ব্যবহার করতে পারি যা আপনার ব্রাউজারে
                কুকি সেট করে। এগুলোর নিজস্ব প্রাইভেসি পলিসি প্রযোজ্য এবং ডেটা সংগ্রহ/প্রসেসিং তারা নির্দিষ্ট উদ্দেশ্যে করে।
              </p>
            </Article>

            <Article id="duration" icon={<Timer className="h-6 w-6 text-orange-600" />} title="কুকির মেয়াদ">
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li><b>Session Cookies:</b> ব্রাউজার বন্ধ করলে মুছে যায়।</li>
                <li><b>Persistent Cookies:</b> নির্দিষ্ট সময় পর্যন্ত থাকে বা আপনি ম্যানুয়ালি ডিলিট না করা পর্যন্ত থাকবে।</li>
              </ul>
            </Article>

            <Article id="manage" icon={<Wrench className="h-6 w-6 text-pink-600" />} title="কিভাবে কুকি ম্যানেজ করবেন">
              <p className="text-gray-700">
                আপনি ব্রাউজার সেটিংস থেকে কুকি ব্লক/ডিলিট করতে পারেন। মনে রাখবেন, কিছু কুকি বন্ধ করলে সাইটের কিছু ফিচার কাজ
                কমপ্লিট নাও করতে পারে।
              </p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <Tip text="Chrome: Settings → Privacy & security → Cookies and other site data" />
                <Tip text="Firefox: Settings → Privacy & Security → Cookies and Site Data" />
                <Tip text="Safari: Preferences → Privacy → Manage Website Data" />
                <Tip text="Edge: Settings → Privacy, search, and services" />
              </div>
              <div className="mt-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-white font-medium shadow hover:opacity-95"
                >
                  কুকি পছন্দ সেট করুন <Settings className="h-4 w-4" />
                </Link>
              </div>
            </Article>

            <Article id="privacy" icon={<Lock className="h-6 w-6 text-emerald-700" />} title="ডেটা প্রাইভেসি ও সিকিউরিটি">
              <p className="text-gray-700">
                কুকির মাধ্যমে সংগৃহীত ডেটা আমরা নিরাপদে সংরক্ষণ করি এবং শুধুমাত্র উল্লিখিত উদ্দেশ্যে ব্যবহার করি।
                বিস্তারিত জানতে আমাদের{" "}
                <Link to="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</Link> দেখুন।
              </p>
            </Article>

            <Article id="consent" icon={<CheckCircle2 className="h-6 w-6 text-green-600" />} title="সম্মতি ও পছন্দ পরিবর্তন">
              <p className="text-gray-700">
                প্রথমবার ভিজিটের সময় আপনি কুকি ব্যানারে সম্মতি দিতে পারবেন। পরবর্তীতে যেকোনো সময় উপরের বাটন থেকে আপনার পছন্দ
                আপডেট/প্রত্যাহার করতে পারবেন।
              </p>
              <Callout
                icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
                text="কিছু কুকি (Essential) সাইট চালাতে অপরিহার্য—এগুলো অফ করলে সাইটের মূল ফিচার কাজ নাও করতে পারে।"
              />
            </Article>

            <Article id="update" icon={<FileCheck2 className="h-6 w-6 text-sky-600" />} title="পলিসি আপডেট">
              <p className="text-gray-700">
                প্রযুক্তি, আইন বা আমাদের সার্ভিসে পরিবর্তন হলে এই কুকি পলিসি আপডেট হতে পারে। বড় আপডেট হলে ওয়েবসাইট/ইমেইলে
                নোটিস দেওয়া হবে। “শেষ আপডেট” তারিখ উপরে দেখুন।
              </p>
            </Article>

            <Article id="contact" icon={<Mail className="h-6 w-6 text-indigo-600" />} title="যোগাযোগ">
              <div className="grid gap-3 md:grid-cols-3 text-gray-700">
                <a href={`mailto:${CONTACT.MAIL}`} className="rounded-xl border p-4 hover:bg-gray-50 flex items-center gap-3">
                  <Mail className="h-5 w-5 text-indigo-600" /> {CONTACT.MAIL}
                </a>
                <a href={`tel:${CONTACT.PHONE}`} className="rounded-xl border p-4 hover:bg-gray-50 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-600" /> {CONTACT.PHONE}
                </a>
                <a href={CONTACT.URL} target="_blank" rel="noreferrer" className="rounded-xl border p-4 hover:bg-gray-50 flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-600" /> ওয়েবসাইট <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                আইনি নোটিশ: এই ডকুমেন্ট সাধারণ তথ্যের জন্য; এটি আইনগত পরামর্শ নয়।
              </p>
            </Article>

            {/* CTA */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold">আপনার কুকি পছন্দ আপডেট করবেন?</h4>
                <p className="text-gray-600">যেকোনো সময় আপনার সম্মতি পরিবর্তন/প্রত্যাহার করতে পারেন।</p>
              </div>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-white font-medium shadow hover:opacity-95"
              >
                এখনই সেট করুন <Settings className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Reusable UI ----------------- */
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
    <article id={id} className="rounded-2xl border bg-white/90 p-6 shadow-sm backdrop-blur">
      <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-gray-900">
        {icon} {title}
      </h3>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </article>
  );
}

function Badge({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-sm font-medium text-white shadow">
      {icon} {text}
    </span>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow transition">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        </div>
        {badge && (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-700">{desc}</p>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border bg-gray-50 p-3 text-sm">
      <Info className="mt-0.5 h-4 w-4 text-indigo-600" />
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function Callout({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
      {icon}
      <span className="text-amber-900">{text}</span>
    </div>
  );
}

/* --- Decorative SVG Bits --- */
function BgBlobs() {
  return (
    <>
      <div className="pointer-events-none absolute -top-28 -left-28 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
    </>
  );
}

function GridPattern() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.08]"
    >
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0v32" fill="none" stroke="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}
