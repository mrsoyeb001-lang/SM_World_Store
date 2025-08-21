// src/pages/SupportPage.tsx
import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Phone,
  Mail,
  HelpCircle,
  Loader2,
  Star,
  Heart,
  Shield,
  Truck,
  CreditCard,
  Clock,
  RefreshCw,
  HeadphonesIcon
} from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

// SVG ইমোজি কম্পোনেন্টস
const SvgEmoji = {
  Smile: () => (
    <svg className="w-5 h-5 inline" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <circle cx="8" cy="10" r="1.5" fill="#fff" />
      <circle cx="16" cy="10" r="1.5" fill="#fff" />
      <path d="M8 16c1.5 1.5 3.5 2 5 2s3.5-.5 5-2" stroke="#fff" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  Wave: () => (
    <svg className="w-5 h-5 inline" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.5 12c0-.8-.6-1.4-1.4-1.4S4.6 11.2 4.6 12s.6 1.4 1.4 1.4S7.5 12.8 7.5 12zm5.7 0c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4.6 1.4 1.4 1.4 1.4-.6 1.4-1.4zm5.7 0c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4.6 1.4 1.4 1.4 1.4-.6 1.4-1.4z" />
    </svg>
  ),
  ThumbsUp: () => (
    <svg className="w-5 h-5 inline" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.5 9.5V20h-4v-9.5h4zM15 9h4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-4V9zM9 9H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h4V9zM10 4.5v2h4v-2h-4z" />
    </svg>
  ),
  Sparkle: () => (
    <svg className="w-5 h-5 inline" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.5 4.5h4.5l-3.5 3 1.5 4.5-3.5-3-3.5 3 1.5-4.5-3.5-3h4.5z" />
    </svg>
  )
};

const QUICK_SUGGESTIONS = [
  "অর্ডার কিভাবে করবো?",
  "ডেলিভারি কতদিনে হবে?",
  "রিটার্ন পলিসি জানতে চাই",
  "পেমেন্ট মেথড কী কী?",
  "অর্ডার ট্র্যাক করবো কীভাবে?",
  "ওয়ারেন্টি/গ্যারান্টি বিষয়ে জানতে চাই",
  "আপনাদের ফোন নাম্বার কী?",
  "WhatsApp লিংক দিন",
  "Facebook/TikTok লিংক দিন",
  "ডিসকাউন্ট বা অফার আছে?",
  "প্রোডাক্ট এভেলিবিলিটি চেক করবো কিভাবে?",
  "কাস্টমার রিভিউ দেখবো কোথায়?"
];

const HANDOFF_LINKS = {
  tel: "tel:+8801624712851",
  mail: "mailto:smworldstoreofficial@gmail.com",
  whatsapp: "https://wa.me/+8801624712851",
  telegram: "https://t.me/+ylw3CCVehHQ1NWQ9",
  facebook: "https://www.facebook.com/profile.php?id=61579242700749",
  tiktok: "https://www.tiktok.com/@smworldstore",
};

// 🧠 রুল-বেইজড AI উত্তর - আরো প্রশ্ন যোগ করা হয়েছে
function ruleBasedAnswer(q: string): string {
  const s = q.toLowerCase();

  if (/অর্ডার|order|কেনা|ক্রয়/.test(s)) {
    return `🛒 অর্ডার করতে প্রোডাক্ট পেজে যান → "Add to Cart" → "Checkout"। ঠিকানা ও পেমেন্ট মেথড সিলেক্ট করে অর্ডার কনফার্ম করুন।`;
  }
  if (/ট্র্যাক|track|অবস্থান/.test(s)) {
    return `📦 অর্ডার ট্র্যাক করতে আপনার Dashboard → "My Orders" এ যান এবং অর্ডার আইডি ক্লিক করুন।`;
  }
  if (/পেমেন্ট|payment|bkash|নগদ|rocket|visa|mastercard/.test(s)) {
    return `💳 আমরা বিকাশ/নগদ/রকেট, ভিসা/মাস্টারকার্ড এবং ক্যাশ অন ডেলিভারি গ্রহণ করি।`;
  }
  if (/ডেলিভারি|shipping|কতদিন|সময়|delivery/.test(s)) {
    return `🚚 ঢাকার ভেতরে ২৪–৪৮ ঘণ্টা, ঢাকার বাইরে ৩–৫ কর্মদিবস সময় লাগে। এক্সপ্রেস ডেলিভারি সার্ভিসও আছে।`;
  }
  if (/রিটার্ন|return|এক্সচেঞ্জ|exchange|বদল/.test(s)) {
    return `🔄 ৭ দিনের মধ্যে শর্তসাপেক্ষে রিটার্ন/এক্সচেঞ্জ করা যায়। প্রোডাক্ট আনওপেন্ড ও ট্যাগসহ থাকতে হবে।`;
  }
  if (/ওয়ারেন্টি|গ্যারান্টি|warranty|guarantee/.test(s)) {
    return `🛡️ বিভিন্ন প্রোডাক্টে ৬ মাস থেকে ১ বছরের ওয়ারেন্টি থাকে। ইলেকট্রনিক্স আইটেমে কমপক্ষে ৬ মাস গ্যারান্টি।`;
  }
  if (/ফোন|mobile|number|কল|contact/.test(s)) {
    return `📞 আমাদের কাস্টমার কেয়ার নাম্বার: +8801624712851 (সকাল ৯টা - রাত ১০টা)`;
  }
  if (/mail|ইমেইল|email/.test(s)) {
    return `📧 আমাদের ইমেইল: smworldstoreofficial@gmail.com - ২৪ ঘন্টার মধ্যে উত্তর দেয়া হয়`;
  }
  if (/whatsapp|ওয়াটসঅ্যাপ|হোয়াটসঅ্যাপ/.test(s)) {
    return `💬 আমাদের WhatsApp: ${HANDOFF_LINKS.whatsapp} - লাইভ চ্যাট সাপোর্ট`;
  }
  if (/telegram|টেলিগ্রাম|টেলিগ্রাম/.test(s)) {
    return `📨 আমাদের Telegram গ্রুপ: ${HANDOFF_LINKS.telegram} - এক্সক্লুসিভ অফার পেতে জয়েন করুন`;
  }
  if (/facebook|fb|ফেসবুক/.test(s)) {
    return `👍 আমাদের Facebook Page: ${HANDOFF_LINKS.facebook} - লাইভ ভিডিও এবং রিভিউ`;
  }
  if (/tiktok|টিকটক/.test(s)) {
    return `🎵 আমাদের TikTok: ${HANDOFF_LINKS.tiktok} - প্রোডাক্ট ডেমো এবং ট্রেন্ডিং কন্টেন্ট`;
  }
  if (/ডিসকাউন্ট|discount|অফার|offer|কুপন|coupon/.test(s)) {
    return `🎁 প্রথম অর্ডারে ১০% ডিসকাউন্ট পেতে "WELCOME10" কুপন ব্যবহার করুন। সাপ্তাহিক ফ্ল্যাশ সেল এবং সিজনাল অফার থাকে।`;
  }
  if (/এভেলিবিলিটি|availability|স্টক|stock/.test(s)) {
    return `📊 প্রোডাক্ট পেজে "স্টক আছে" বা "আউট অফ স্টক" দেখতে পাবেন। প্রি-অর্ডারের জন্য নোটিফিকেশন সেট করতে পারেন।`;
  }
  if (/রিভিউ|review|রেটিং|rating/.test(s)) {
    return `⭐ প্রতিটি প্রোডাক্ট পেজের নিচে কাস্টমার রিভিউ এবং রেটিং দেখতে পাবেন। ভেরিফাইড পারচেজ রিভিউ শো করা হয়।`;
  }
  if (/অ্যাকাউন্ট|account|প্রোফাইল|profile/.test(s)) {
    return `👤 আপনার অ্যাকাউন্টে অর্ডার হিস্টরি, উইশলিস্ট, এড্রেস বুক এবং পার্সোনাল ডিটেইলস ম্যানেজ করতে পারবেন।`;
  }
  if (/উইশলিস্ট|wishlist|সেভ|save/.test(s)) {
    return `❤️ প্রোডাক্ট হার্ট আইকনে ক্লিক করে উইশলিস্টে সেভ করতে পারেন। পরে দ্রুত এক্সেস করার জন্য।`;
  }
  if (/শিপিং|shipping|চার্জ|delivery/.test(s)) {
    return `📦 ৫০০৳+ অর্ডারে ঢাকার ভেতরে ফ্রি শিপিং। ঢাকার বাইরে শিপিং চার্জ অর্ডার ভ্যালু এবং লোকেশনের উপর নির্ভর করে।`;
  }
  if (/ক্যাশ|cash|ডেলিভারি|on delivery/.test(s)) {
    return `💵 ক্যাশ অন ডেলিভারি (COD) সার্ভিস আছে। ডেলিভারি সময় প্রোডাক্ট চেক করে পেমেন্ট করতে পারবেন।`;
  }
  if (/গিফট|gift|উপহার|মোড়ক/.test(s)) {
    return `🎁 গিফট মোড়ক এবং গিফট কার্ড সার্ভিস আছে। চেকআউট সময় গিফট র্যাপিং অপশন পাবেন।`;
  }

  return "ধন্যবাদ আপনার প্রশ্নের জন্য। একটু বিস্তারিত বলবেন? অথবা সরাসরি WhatsApp / Telegram / Facebook এ আমাদের সাথে যোগাযোগ করতে পারেন - আমরা ২৪/৭ আপনাকে সাহায্য করতে প্রস্তুত! " + SvgEmoji.Smile();
}

export default function SupportPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `হ্যালো! ${SvgEmoji.Wave()} আমি আপনার AI সহকারী (SM World Store)। অর্ডার, ডেলিভারি, রিটার্ন, পেমেন্ট, ট্র্যাকিং—যেকোন প্রশ্ন করুন। আমরা আপনাকে সাহায্য করতে এখানে আছি! ${SvgEmoji.Sparkle()}`,
      ts: Date.now(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      ts: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // সিমুলেট করা AI ডিলে
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    try {
      const reply = ruleBasedAnswer(content);
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        ts: Date.now(),
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Animated Header */}
        <div className="flex flex-col items-center gap-3 mb-10 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-3 bg-blue-100 rounded-full blur-md opacity-70 animate-pulse-slow"></div>
            <img 
              src="/logo.png" 
              alt="SM World Store Logo" 
              className="relative h-20 w-auto rounded-full shadow-lg transition-transform duration-500 hover:scale-105" 
            />
          </div>
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
            📞 SM World Store Support
          </h1>
          <p className="text-center text-gray-600 max-w-2xl leading-relaxed">
            যেকোনো প্রশ্ন, সমস্যা বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন। 
            আমরা ২৪/৭ আপনার সেবায় প্রস্তুত {SvgEmoji.ThumbsUp()}
          </p>
        </div>

        {/* Quick Support Options with Hover Effects */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <a href={HANDOFF_LINKS.tel} className="group rounded-xl border-2 border-blue-100 bg-white p-5 text-center transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-2">
              <Phone className="w-6 h-6" />
            </div>
            <div className="font-medium text-sm mt-1 group-hover:text-blue-600 transition-colors">কল করুন</div>
            <div className="text-xs text-gray-500 mt-1">সরাসরি কথা বলুন</div>
          </a>
          
          <a href={HANDOFF_LINKS.mail} className="group rounded-xl border-2 border-blue-100 bg-white p-5 text-center transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <div className="font-medium text-sm mt-1 group-hover:text-blue-600 transition-colors">ইমেইল করুন</div>
            <div className="text-xs text-gray-500 mt-1">২৪ ঘন্টার মধ্যে রিপ্লাই</div>
          </a>
          
          <a href={HANDOFF_LINKS.whatsapp} target="_blank" rel="noreferrer"
            className="group rounded-xl border-2 border-green-100 bg-white p-5 text-center transition-all duration-300 hover:border-green-400 hover:shadow-lg hover:-translate-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors mb-2">
              <span className="text-xl">💬</span>
            </div>
            <div className="font-medium text-sm mt-1 group-hover:text-green-600 transition-colors">WhatsApp</div>
            <div className="text-xs text-gray-500 mt-1">লাইভ চ্যাট</div>
          </a>
          
          <a href={HANDOFF_LINKS.telegram} target="_blank" rel="noreferrer"
            className="group rounded-xl border-2 border-blue-100 bg-white p-5 text-center transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-2">
              <span className="text-xl">📨</span>
            </div>
            <div className="font-medium text-sm mt-1 group-hover:text-blue-600 transition-colors">Telegram</div>
            <div className="text-xs text-gray-500 mt-1">এক্সক্লুসিভ অফার</div>
          </a>
          
          <a href={HANDOFF_LINKS.facebook} target="_blank" rel="noreferrer"
            className="group rounded-xl border-2 border-blue-100 bg-white p-5 text-center transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-2">
              <span className="text-xl">👍</span>
            </div>
            <div className="font-medium text-sm mt-1 group-hover:text-blue-600 transition-colors">Facebook</div>
            <div className="text-xs text-gray-500 mt-1">কমিউনিটি</div>
          </a>
          
          <a href={HANDOFF_LINKS.tiktok} target="_blank" rel="noreferrer"
            className="group rounded-xl border-2 border-pink-100 bg-white p-5 text-center transition-all duration-300 hover:border-pink-400 hover:shadow-lg hover:-translate-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors mb-2">
              <span className="text-xl">🎵</span>
            </div>
            <div className="font-medium text-sm mt-1 group-hover:text-pink-600 transition-colors">TikTok</div>
            <div className="text-xs text-gray-500 mt-1">ভিডিও কন্টেন্ট</div>
          </a>
        </div>

        {/* AI Assistant Chat Box with Enhanced Styling */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-white/30 rounded-full animate-ping opacity-75"></div>
                <div className="relative rounded-full border-2 border-white p-1.5 bg-blue-500">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="font-semibold leading-none">AI সহকারী</p>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                  এখনই অনলাইনে আছেন
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs bg-white/20 py-1 px-2 rounded-full">
              <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              <span>প্রিমিয়াম সাপোর্ট</span>
            </div>
          </div>

          {/* Messages Container */}
          <div ref={scrollRef} className="h-80 overflow-y-auto p-5 bg-gradient-to-b from-blue-50/30 to-white space-y-4">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : "justify-start"} animate-message-in`}
              >
                {m.role === "assistant" && (
                  <div className="shrink-0 mt-1 rounded-full border-2 border-blue-200 p-1.5 bg-white shadow-sm">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] shadow-sm transition-all duration-300 ${
                  m.role === "user" 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none" 
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                }`}>
                  {m.content}
                  <div className={`text-xs mt-1.5 opacity-70 ${m.role === "user" ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(m.ts).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {m.role === "user" && (
                  <div className="shrink-0 mt-1 rounded-full border-2 border-blue-200 p-1.5 bg-white shadow-sm">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                AI সহকারী টাইপ করছেন...
              </div>
            )}
          </div>

          {/* Quick Suggestions with Horizontal Scroll */}
          <div className="flex gap-2 overflow-x-auto px-4 py-3 border-t bg-gray-50">
            {QUICK_SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area with Enhanced Styling */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t p-4 bg-white"
          >
            <div className="relative flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="আপনার প্রশ্ন লিখুন…"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SvgEmoji.Smile />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              পাঠান
            </button>
          </form>
        </div>

        {/* Additional Support Information */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">২৪/৭ সাপোর্ট</h3>
            <p className="text-sm text-gray-600">সপ্তাহের ৭ দিন, আমরা আপনার পাশে আছি</p>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">১০০% সুরক্ষিত</h3>
            <p className="text-sm text-gray-600">আপনার ডেটা এবং লেনদেন সম্পূর্ণ সুরক্ষিত</p>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-3">
              <HeadphonesIcon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">দ্রুত প্রতিক্রিয়া</h3>
            <p className="text-sm text-gray-600">কোনো প্রশ্নে ৫ মিনিটের মধ্যে উত্তর</p>
          </div>
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes messageIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-message-in {
          animation: messageIn 0.3s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
