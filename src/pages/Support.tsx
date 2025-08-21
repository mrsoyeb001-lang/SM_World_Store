// src/pages/SupportPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";

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
];

const HANDOFF_LINKS = {
  tel: "tel:+8801234567890",
  mail: "mailto:support@yourshop.com",
  live: "/support#live-chat",
  faq: "/faq",
  returnPolicy: "/return-policy",
  shipping: "/shipping-info",
  warranty: "/warranty",
};

// হালকা রুল-বেইজড উত্তর
function ruleBasedAnswer(q: string): string {
  const s = q.toLowerCase();

  if (/অর্ডার|order/.test(s)) {
    return `অর্ডার করতে প্রোডাক্টে যান → “Add to Cart” → “Checkout”। ঠিকানা ও পেমেন্ট দিয়ে অর্ডার কনফার্ম করুন।`;
  }
  if (/ট্র্যাক|track/.test(s)) {
    return `অর্ডার ট্র্যাক করতে Dashboard → “My Orders” এ যান।`;
  }
  if (/পেমেন্ট|payment|bkash|নগদ|rocket/.test(s)) {
    return `আমরা বিকাশ/নগদ/রকেট ও কার্ড পেমেন্ট গ্রহণ করি। ক্যাশ অন ডেলিভারিও আছে।`;
  }
  if (/ডেলিভারি|shipping/.test(s)) {
    return `ঢাকার ভেতরে ২৪–৪৮ ঘণ্টা, ঢাকার বাইরে ৩–৫ কর্মদিবস লাগে।`;
  }
  if (/রিটার্ন|return/.test(s)) {
    return `৭ দিনের মধ্যে শর্তসাপেক্ষে রিটার্ন/এক্সচেঞ্জ করা যায়।`;
  }
  if (/ওয়ারেন্টি|গ্যারান্টি|warranty/.test(s)) {
    return `বিভিন্ন ক্যাটেগরিতে ৬ মাস থেকে ১ বছরের ওয়ারেন্টি থাকে।`;
  }
  return "আমি বুঝেছি। একটু বিস্তারিত বলবেন? চাইলে লাইভ চ্যাট/কল/ইমেইলেও যেতে পারেন।";
}

export default function SupportPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "হ্যালো! আমি আপনার AI সহকারী। অর্ডার, ডেলিভারি, রিটার্ন, পেমেন্ট, ট্র্যাকিং—যেকোন প্রশ্ন করুন।",
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6">📞 সাপোর্ট সেন্টার</h1>
        <p className="text-center text-gray-600 mb-10">
          যেকোনো প্রশ্ন, সমস্যা বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন
        </p>

        {/* Quick Support Options */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <a
            href={HANDOFF_LINKS.tel}
            className="group rounded-xl border p-5 text-center hover:bg-blue-100 transition"
          >
            <Phone className="w-6 h-6 mx-auto" />
            <div className="text-sm mt-2 group-hover:underline">কল</div>
          </a>
          <a
            href={HANDOFF_LINKS.mail}
            className="group rounded-xl border p-5 text-center hover:bg-blue-100 transition"
          >
            <Mail className="w-6 h-6 mx-auto" />
            <div className="text-sm mt-2 group-hover:underline">ইমেইল</div>
          </a>
          <a
            href="/support#live-chat"
            className="group rounded-xl border p-5 text-center hover:bg-blue-100 transition"
          >
            <HelpCircle className="w-6 h-6 mx-auto" />
            <div className="text-sm mt-2 group-hover:underline">লাইভ চ্যাট</div>
          </a>
          <a
            href="https://wa.me/8801234567890"
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border p-5 text-center hover:bg-blue-100 transition"
          >
            <span className="text-2xl">🟢</span>
            <div className="text-sm mt-2 group-hover:underline">WhatsApp</div>
          </a>
          <a
            href="https://t.me/yourtelegram"
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border p-5 text-center hover:bg-blue-100 transition"
          >
            <span className="text-2xl">📨</span>
            <div className="text-sm mt-2 group-hover:underline">Telegram</div>
          </a>
          <a
            href="https://facebook.com/groups/yourgroup"
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border p-5 text-center hover:bg-blue-100 transition"
          >
            <span className="text-2xl">📘</span>
            <div className="text-sm mt-2 group-hover:underline">FB Group</div>
          </a>
        </div>

        {/* AI Assistant Chat Box */}
        <div className="rounded-2xl border bg-white shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <p className="font-semibold leading-none">AI সহকারী</p>
                <p className="text-xs opacity-90">২৪/৭ সহায়তা</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="shrink-0 mt-0.5 rounded-full border p-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 text-sm max-w-[80%] shadow-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="shrink-0 mt-0.5 rounded-full border p-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
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
                className="shrink-0 rounded-full border px-3 py-1 text-xs hover:bg-gray-200"
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
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-3 py-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              পাঠান
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
