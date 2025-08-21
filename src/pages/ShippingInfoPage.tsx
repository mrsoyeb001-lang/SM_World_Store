// src/pages/ShippingInfoPage.tsx
import { motion } from "framer-motion";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  CreditCard,
  ShieldCheck,
  Fingerprint,
  Lock,
  BadgeCheck,
  Route,
  Phone,
  Mail,
  MessageCircle,
  Send,
  Facebook,
  MessageSquare,
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-violet-50">
      {/* ============= HERO ============= */}
      <section className="relative overflow-hidden">
        {/* colorful blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid items-center gap-8 md:grid-cols-[1.1fr_.9fr]"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-sm font-medium text-white shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                বিশ্বস্ত ও নিরাপদ ডেলিভারি
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
                🚚 শিপিং তথ্য — দ্রুত, নিরাপদ, এবং
                <span className="bg-gradient-to-r from-fuchsia-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}
                  সারা বাংলাদেশে
                </span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {CONTACT.SITE} আপনার অর্ডারকে ট্র্যাকযোগ্য, বীমাকৃত এবং সময়মতো পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ।
                ঢাকায় ১–২ দিন, ঢাকার বাইরে ২–৫ কর্মদিবসেই ডেলিভারি।
              </p>

              {/* Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <Fingerprint className="h-4 w-4 text-violet-600" />
                  ভেরিফায়েড সেলার
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  SSL সিকিউর পেমেন্ট
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200">
                  <BadgeCheck className="h-4 w-4 text-blue-600" />
                  মান নিয়ন্ত্রণকৃত প্যাকেজিং
                </span>
              </div>
            </motion.div>

            {/* Animated Truck Card */}
            <motion.div
              variants={fadeUp}
              className="relative rounded-3xl border bg-white/80 p-6 shadow-xl backdrop-blur"
            >
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-200/40 via-white to-fuchsia-200/40" />
              <div className="overflow-hidden rounded-2xl border bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      Live Logistics
                    </p>
                    <h3 className="mt-1 text-xl font-bold">Shipment #SW-{new Date().getFullYear()}</h3>
                  </div>
                  <Route className="h-6 w-6 text-indigo-600" />
                </div>

                <div className="mt-6 h-24 w-full rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 p-3">
                  <motion.div
                    initial={{ x: -40 }}
                    animate={{ x: ["-10%", "80%"] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    className="flex w-max items-center gap-2"
                  >
                    <Truck className="h-9 w-9 text-indigo-600" />
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-medium shadow">
                      On the way…
                    </span>
                  </motion.div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="font-semibold">ঢাকা</p>
                    <p className="text-xs text-gray-500">১–২ দিন</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="font-semibold">ঢাকার বাইরে</p>
                    <p className="text-xs text-gray-500">২–৫ দিন</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="font-semibold">রিমোট</p>
                    <p className="text-xs text-gray-500">৩–৭ দিন</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============= KPI CARDS ============= */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid gap-5 md:grid-cols-3"
        >
          {[
            {
              icon: <Clock className="h-6 w-6 text-blue-600" />,
              title: "সময়মতো ডেলিভারি",
              desc: "৯৫% অর্ডার নির্ধারিত সময়ের আগেই পৌঁছে দেওয়া হয়।",
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
              title: "বীমাকৃত শিপিং",
              desc: "পথে ক্ষতি/হারালে সম্পূর্ণ কভারেজ নীতিমালা প্রযোজ্য।",
            },
            {
              icon: <Package className="h-6 w-6 text-fuchsia-600" />,
              title: "সুরক্ষিত প্যাকেজিং",
              desc: "ডাবল-লেয়ার বক্স, বুদবুদ র‍্যাপ ও সীল-ট্যাম্পার ব্যান্ড।",
            },
          ].map((c, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-2xl border bg-white p-6 shadow hover:shadow-lg transition"
            >
              <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-gray-50 p-3">
                {c.icon}
              </div>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-gray-600">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============= MAP ============= */}
      <section className="relative mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">🗺️ কভারেজ ম্যাপ</h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700 ring-1 ring-emerald-200">
            সারা বাংলাদেশ
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border shadow-lg">
          {/* Google Maps embed (no API key required) */}
          <iframe
            title="SM World Store Shipping Coverage"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689915.2489848156!2d88.01096450560616!3d23.68499404040459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37543ea4df3c6b27%3A0xeff9c6817!2sBangladesh!5e0!3m2!1sen!2sbd!4v1700000000000"
            width="100%"
            height="380"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <p className="mt-3 text-center text-sm text-gray-500">
          * লোকেশনভেদে ডেলিভারি টাইম/চার্জ ভিন্ন হতে পারে।
        </p>
      </section>

      {/* ============= TIMELINE ============= */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-center text-2xl font-bold">📦 ডেলিভারি প্রসেস (স্টেপ-বাই-স্টেপ)</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              icon: <CreditCard className="h-8 w-8 text-indigo-600" />,
              title: "অর্ডার কনফার্ম",
              desc: "ওয়েবসাইটে পেমেন্ট/ COD নির্বাচন করুন।",
            },
            {
              icon: <Package className="h-8 w-8 text-fuchsia-600" />,
              title: "প্যাকেজিং",
              desc: "মান নিয়ন্ত্রিত সুরক্ষিত প্যাকিং সম্পন্ন।",
            },
            {
              icon: <Truck className="h-8 w-8 text-orange-600" />,
              title: "শিপিং",
              desc: "কুরিয়ার হাবে হ্যান্ডওভার ও ট্র্যাকিং সক্রিয়।",
            },
            {
              icon: <MapPin className="h-8 w-8 text-emerald-600" />,
              title: "ডেলিভারি",
              desc: "আপনার ঠিকানায় নিরাপদে পৌঁছে দেওয়া।",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="absolute left-0 top-1/2 hidden h-1 w-full -translate-y-1/2 bg-gradient-to-r from-indigo-200 to-fuchsia-200 md:block" />
              <div className="relative z-10">
                <div className="mb-3 inline-flex rounded-xl bg-gray-50 p-3">{s.icon}</div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-gray-600">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============= RATE TABLE ============= */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <h2 className="mb-4 text-2xl font-bold">💰 ডেলিভারি চার্জ</h2>
        <div className="overflow-hidden rounded-2xl border bg-white shadow">
          <table className="w-full table-auto text-left">
            <thead className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
              <tr>
                <th className="px-4 py-3">এরিয়া</th>
                <th className="px-4 py-3">টাইম (অনুমান)</th>
                <th className="px-4 py-3">চার্জ</th>
                <th className="px-4 py-3">নোট</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">ঢাকা সিটি</td>
                <td className="px-4 py-3">১–২ কর্মদিবস</td>
                <td className="px-4 py-3">৳ 60</td>
                <td className="px-4 py-3">এক্সপ্রেস ডেলিভারি সম্ভব*</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">ঢাকার বাইরে</td>
                <td className="px-4 py-3">২–৫ কর্মদিবস</td>
                <td className="px-4 py-3">৳ 100–150</td>
                <td className="px-4 py-3">কুরিয়ার লোকেশন অনুযায়ী</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">রিমোট/হার্ড টু রিচ</td>
                <td className="px-4 py-3">৩–৭ কর্মদিবস</td>
                <td className="px-4 py-3">৳ 150–220</td>
                <td className="px-4 py-3">বিশেষ শর্ত প্রযোজ্য</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-gray-500">* এক্সপ্রেস ডেলিভারির জন্য WhatsApp এ যোগাযোগ করুন।</p>
      </section>

      {/* ============= SECURITY & PAYMENT ============= */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Lock className="h-7 w-7 text-emerald-600" />,
              title: "SSL সিকিউর পেমেন্ট",
              desc: "আপনার কার্ড/মোবাইল পেমেন্ট সম্পূর্ণ এনক্রিপ্টেড ও নিরাপদ।",
            },
            {
              icon: <CreditCard className="h-7 w-7 text-indigo-600" />,
              title: "বহু পেমেন্ট অপশন",
              desc: "বিকাশ/নগদ/রকেট, ডেবিট/ক্রেডিট কার্ড ও COD সাপোর্ট।",
            },
            {
              icon: <ShieldCheck className="h-7 w-7 text-fuchsia-600" />,
              title: "ক্রেতা সুরক্ষা",
              desc: "ভুল/ত্রুটিপূর্ণ পণ্য হলে সহজ রিটার্ন/রিপ্লেসমেন্ট।",
            },
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border bg-white p-6 shadow hover:shadow-lg transition"
            >
              <div className="mb-3 inline-flex rounded-xl bg-gray-50 p-3">{b.icon}</div>
              <h3 className="text-lg font-semibold">{b.title}</h3>
              <p className="mt-1 text-gray-600">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============= SHIPPING FAQ (short) ============= */}
      <section className="mx-auto max-w-6xl px-4 pb-6">
        <h2 className="mb-4 text-2xl font-bold">❓ শিপিং সম্পর্কিত সাধারণ প্রশ্ন</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              q: "কিভাবে অর্ডার ট্র্যাক করবো?",
              a: "আপনার Dashboard → My Orders এ গিয়ে ট্র্যাকিং স্ট্যাটাস দেখুন। SMS/ইমেইলেও আপডেট পাবেন।",
            },
            {
              q: "পণ্য ভাঙা/ত্রুটিপূর্ণ হলে কি করবেন?",
              a: "প্রাপ্তির ২৪ ঘণ্টার মধ্যে ছবি/ভিডিওসহ WhatsApp বা ইমেইলে জানান—দ্রুত রিপ্লেসমেন্ট প্রক্রিয়া শুরু হবে।",
            },
            {
              q: "COD কি সব জায়গায় আছে?",
              a: "বেশিরভাগ এলাকায় আছে, কিছু রিমোট লোকেশনে অগ্রিম চার্জ প্রযোজ্য হতে পারে।",
            },
            {
              q: "একই দিনে ডেলিভারি?",
              a: "ঢাকার মধ্যে বিশেষ ক্ষেত্রে এক্সপ্রেস (সেইম-ডে) সম্ভব—WhatsApp এ যোগাযোগ করুন।",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="group rounded-xl border bg-white p-4 shadow-sm open:shadow-md"
            >
              <summary className="cursor-pointer select-none list-none text-base font-semibold">
                {item.q}
              </summary>
              <p className="mt-2 text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============= CTA ============= */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16">
        <div className="overflow-hidden rounded-3xl border bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-blue-600 p-1 shadow-xl">
          <div className="rounded-[22px] bg-white/95 p-6 md:p-8">
            <div className="grid items-center gap-6 md:grid-cols-[1.2fr_.8fr]">
              <div>
                <h3 className="text-2xl font-bold">শিপিং নিয়ে সাহায্য দরকার?</h3>
                <p className="mt-1 text-gray-600">
                  আমরা ২৪/৭ সাপোর্ট দেই—কল, ইমেইল অথবা লাইভ মেসেজে যোগাযোগ করুন।
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`tel:${CONTACT.PHONE}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:opacity-95"
                  >
                    <Phone className="h-4 w-4" /> কল: {CONTACT.PHONE}
                  </a>
                  <a
                    href={`mailto:${CONTACT.MAIL}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:opacity-95"
                  >
                    <Mail className="h-4 w-4" /> ইমেইল
                  </a>
                  <a
                    href={CONTACT.WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white shadow hover:opacity-95"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a
                    href={CONTACT.TELEGRAM}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-white shadow hover:opacity-95"
                  >
                    <Send className="h-4 w-4" /> Telegram
                  </a>
                  <a
                    href={CONTACT.FACEBOOK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-white shadow hover:opacity-95"
                  >
                    <Facebook className="h-4 w-4" /> Facebook
                  </a>
                  <a
                    href={CONTACT.TIKTOK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-white shadow hover:opacity-95"
                  >
                    <MessageSquare className="h-4 w-4" /> TikTok
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">ETA Estimator</p>
                    <h4 className="text-lg font-semibold">আনুমানিক ডেলিভারি</h4>
                  </div>
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-semibold">ঢাকা</p>
                    <p className="text-xs text-gray-500">১–২ দিন</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-semibold">বাইরে</p>
                    <p className="text-xs text-gray-500">২–৫ দিন</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-semibold">রিমোট</p>
                    <p className="text-xs text-gray-500">৩–৭ দিন</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    বীমা-সুরক্ষিত শিপিং
                  </div>
                  <Truck className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
