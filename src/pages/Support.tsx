// src/pages/SupportPage.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  PhoneCall,
  Mail,
  Bot,
  UserRound,
  Loader2,
  SendHorizonal,
} from "lucide-react";
import { motion } from "framer-motion";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

const QUICK_SUGGESTIONS = [
  "অর্ডার কিভাবে করবো?",
  "ডেলিভারি কতদিনে হবে?",
  "রিটার্ন পলিসি জানতে চাই",
  "পেমেন্ট মেথড কী কী?",
  "অর্ডার ট্র্যাক করবো কীভাবে?",
  "ওয়ারেন্টি/গ্যারান্টি বিষয়ে জানতে চাই",
  "কাস্টমার কেয়ার নাম্বার চাই",
  "আপনাদের ফেসবুক পেজের লিংক দিন",
  "টিকটক লিংক দিন",
  "আপনাদের Whatsapp নাম্বার কী?",
  "অ্যাফিলিয়েট প্রোগ্রাম সম্পর্কে জানতে চাই",
  "আপনাদের মেইল আইডি দিন",
  "টেলিগ্রাম গ্রুপের লিংক দিন",
];

const HANDOFF_LINKS = {
  tel: "tel:+8801624712851",
  mail: "mailto:smworldstoreofficial@gmail.com",
  whatsapp: "https://wa.me/+8801624712851",
  telegram: "https://t.me/+ylw3CCVehHQ1NWQ9",
  facebook: "https://www.facebook.com/profile.php?id=61579242700749",
  tiktok: "https://www.tiktok.com/@smworldstore",
};

// Rule Based Answer
function ruleBasedAnswer(q: string): string {
  const s = q.toLowerCase();

  if (/অর্ডার|order/.test(s)) {
    return `✅ অর্ডার করতে প্রোডাক্টে যান → “Add to Cart” → “Checkout”।`;
  }
  if (/ট্র্যাক|track/.test(s)) {
    return `📦 Dashboard → “My Orders” এ গিয়ে অর্ডার ট্র্যাক করতে পারবেন।`;
  }
  if (/পেমেন্ট|payment|bkash|নগদ|rocket/.test(s)) {
    return `💳 বিকাশ/নগদ/রকেট, কার্ড পেমেন্ট এবং ক্যাশ অন ডেলিভারি সাপোর্ট করি।`;
  }
  if (/ডেলিভারি|shipping/.test(s)) {
    return `🚚 ঢাকার ভেতরে ২৪–৪৮ ঘণ্টা, ঢাকার বাইরে ৩–৫ কর্মদিবস লাগে।`;
  }
  if (/রিটার্ন|return/.test(s)) {
    return `↩️ ৭ দিনের মধ্যে শর্তসাপেক্ষে রিটার্ন/এক্সচেঞ্জ করা যায়।`;
  }
  if (/ওয়ারেন্টি|গ্যারান্টি|warranty/.test(s)) {
    return `🛡️ ক্যাটেগরিভেদে ৬ মাস থেকে ১ বছরের ওয়ারেন্টি থাকে।`;
  }
  if (/ফেসবুক|facebook/.test(s)) {
    return `📘 Facebook Page: ${HANDOFF_LINKS.facebook}`;
  }
  if (/টিকটক|tiktok/.test(s)) {
    return `🎵 TikTok: ${HANDOFF_LINKS.tiktok}`;
  }
  if (/whatsapp|ওয়াটসঅ্যাপ/.test(s)) {
    return `🟢 WhatsApp: ${HANDOFF_LINKS.whatsapp}`;
  }
  if (/টেলিগ্রাম|telegram/.test(s)) {
    return `📨 Telegram Group: ${HANDOFF_LINKS.telegram}`;
  }
  if (/কাস্টমার কেয়ার|customer care|phone/.test(s)) {
    return `📞 কাস্টমার কেয়ার: ${HANDOFF_LINKS.tel}`;
  }
  if (/mail|ইমেইল|gmail/.test(s)) {
    return `📧 ইমেইল: ${HANDOFF_LINKS.mail}`;
  }
  if (/অ্যাফিলিয়েট|affiliate/.test(s)) {
    return `🤝 আমাদের অ্যাফিলিয়েট প্রোগ্রামে যোগ দিন এবং ইনকাম শুরু করুন।`;
  }

  return "🤔 বুঝতে পারিনি, একটু বিস্তারিত বলবেন? চাইলে WhatsApp, Telegram, Facebook এ যোগাযোগ করতে পারেন।";
}

export default function SupportPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "👋 হ্যালো! আমি **SM World Store AI সহকারী**। অর্ডার, ডেলিভারি, রিটার্ন, পেমেন্ট, ট্র্যাকিং বা অন্য যেকোনো প্রশ্ন করুন।",
      ts: Date.now(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text?: string) => {
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

    setTimeout(() => {
      const reply = ruleBasedAnswer(content);
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        ts: Date.now(),
      };
      setMessages((m) => [...m, botMsg]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-10"
        >
          <img
            src="/logo.png"
            alt="SM World Store"
            className="w-20 h-20 mb-3 drop-shadow-xl"
          />
          <h1 className="text-4xl font-extrabold text-gray-800 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            SM World Store Support
          </h1>
          <p className="text-center text-gray-600 mt-2">
            যেকোনো প্রশ্ন, সমস্যা বা সাহায্যের জন্য যোগাযোগ করুন 💬
          </p>
        </motion.div>

        {/* Quick Support Options */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-10">
          {[
            { icon: <PhoneCall className="w-8 h-8 text-blue-600" />, text: "কল", link: HANDOFF_LINKS.tel },
            { icon: <Mail className="w-8 h-8 text-red-600" />, text: "ইমেইল", link: HANDOFF_LINKS.mail },
            {
              icon: (
                <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.7 14.3c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.1c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.5-1.6-.9-.8-1.6-1.7-1.8-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.6.1-.2.1-.3.2-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.3 4 .6.3 1.1.5 1.5.6.6.2 1.1.2 1.5.1.5-.1 1.8-.7 2-1.3.2-.6.2-1.1.2-1.2-.1 0-.3-.1-.6-.2z" />
                  <path d="M12 2C6.5 2 2 6.3 2 11.6c0 1.9.5 3.8 1.5 5.4L2 22l5.2-1.7c1.6.9 3.5 1.3 5.4 1.3 5.5 0 10-4.3 10-9.6S17.5 2 12 2z" />
                </svg>
              ),
              text: "WhatsApp",
              link: HANDOFF_LINKS.whatsapp,
            },
            {
              icon: (
                <svg className="w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 4.9 0 10.9c0 3.4 1.8 6.5 4.7 8.5v4.6l4.3-2.4c1 .3 2 .4 3 .4 6.6 0 12-4.9 12-10.9S18.6 0 12 0z" />
                </svg>
              ),
              text: "Telegram",
              link: HANDOFF_LINKS.telegram,
            },
            {
              icon: (
                <svg className="w-8 h-8 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.675 0H1.325C.593 0 0 .6 0 1.3v21.4C0 23.4.593 24 1.325 24h11.5V14.7h-3.1v-3.6h3.1V8.4c0-3.1 1.9-4.9 4.8-4.9 1.4 0 2.8.2 2.8.2v3h-1.6c-1.6 0-2.1 1-2.1 2v2.4h3.5l-.6 3.6h-2.9V24h5.7c.7 0 1.3-.6 1.3-1.3V1.3c0-.7-.6-1.3-1.3-1.3z" />
                </svg>
              ),
              text: "Facebook",
              link: HANDOFF_LINKS.facebook,
            },
            {
              icon: (
                <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.75 2h3.5v12.1c0 3.3-2.7 5.9-6 5.9s-6-2.6-6-5.9V9.9h3.5v4.2c0 1.3 1.1 2.4 2.5 2.4s2.5-1.1 2.5-2.4V2z" />
                </svg>
              ),
              text: "TikTok",
              link: HANDOFF_LINKS.tiktok,
            },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-2xl border p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl bg-white/70 backdrop-blur-md transition-all duration-300"
            >
              {item.icon}
              <span className="mt-2 text-sm font-semibold">{item.text}</span>
            </motion.a>
          ))}
        </div>
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <Bot className="w-6 h-6" />
            <div>
              <p className="font-semibold leading-none">AI সহকারী</p>
              <p className="text-xs opacity-90">২৪/৭ সহায়তা</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-2 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="shrink-0 mt-0.5 rounded-full border p-1 bg-blue-50">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 text-sm max-w-[80%] shadow-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="shrink-0 mt-0.5 rounded-full border p-1 bg-gray-50">
                    <UserRound className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                টাইপ করা হচ্ছে…
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-2 border-t bg-gray-50">
            {QUICK_SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="shrink-0 rounded-full border px-3 py-1 text-xs hover:bg-gray-200 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="আপনার প্রশ্ন লিখুন…"
              className="flex-1 rounded-xl border px-3 py-2 outline-none focus:ring focus:ring-blue-300"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 disabled:opacity-50"
            >
              <SendHorizonal className="w-4 h-4" />
              পাঠান
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
