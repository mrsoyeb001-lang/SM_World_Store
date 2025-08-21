import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot, User, Phone, Mail, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // যদি না থাকে, 'cn' বাদ দিয়েও className সরাসরি ব্যবহার করতে পারেন

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

// যদি নিজের ব্যাকএন্ড যুক্ত করতে চান, এটাকে true করুন এবং নিচের fetch কোড ব্যবহার করুন।
const USE_BACKEND = false;

async function askBackend(message: string): Promise<string> {
  // আপনার সার্ভার-সাইড API: /api/ai-chat → { reply: string }
  const res = await fetch("/api/ai-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  return data.reply ?? "দুঃখিত, আমি এখন উত্তর দিতে পারছি না। একটু পর চেষ্টা করুন।";
}

// খুব হালকা রুল-বেইজড উত্তর (বাংলা কনটেন্ট সহ)
function ruleBasedAnswer(q: string): string {
  const s = q.toLowerCase();

  if (/অর্ডার|order/.test(s)) {
    return `অর্ডার করতে প্রোডাক্টে যান → “Add to Cart” → “Checkout”। ঠিকানা ও পেমেন্ট দিয়ে অর্ডার কনফার্ম করুন। ট্র্যাক করতে Dashboard → “My Orders” দেখুন।`;
  }
  if (/ট্র্যাক|track/.test(s)) {
    return `অর্ডার ট্র্যাক করতে আপনার Dashboard → “My Orders” এ যান। প্রতিটি অর্ডারের পাশে স্ট্যাটাস দেখতে পাবেন।`;
  }
  if (/পেমেন্ট|payment|bkash|নগদ|rocket/.test(s)) {
    return `আমরা বিকাশ/নগদ/রকেট ও কার্ড পেমেন্ট গ্রহণ করি। ক্যাশ অন ডেলিভারিও আছে (লোকেশনভেদে)।`;
  }
  if (/ডেলিভারি|shipping|শিপিং/.test(s)) {
    return `ঢাকার ভেতরে ২৪–৪৮ ঘণ্টা, ঢাকার বাইরে সাধারণত ৩–৫ কর্মদিবস লাগে। বিস্তারিত: ${HANDOFF_LINKS.shipping}`;
  }
  if (/রিটার্ন|return/.test(s)) {
    return `৭ দিনের মধ্যে শর্তসাপেক্ষে রিটার্ন/এক্সচেঞ্জ করা যায়। বিস্তারিত: ${HANDOFF_LINKS.returnPolicy}`;
  }
  if (/ওয়ারেন্টি|গ্যারান্টি|warranty|guarantee/.test(s)) {
    return `বিভিন্ন ক্যাটেগরিতে ৬ মাস থেকে ১ বছরের ওয়ারেন্টি থাকে (ব্র্যান্ডভেদে ভিন্ন)। বিস্তারিত: ${HANDOFF_LINKS.warranty}`;
  }
  if (/হেল্প|সাপোর্ট|এজেন্ট|agent|live chat/.test(s)) {
    return `লাইভ এজেন্টে যেতে এখানে যান: ${HANDOFF_LINKS.live} অথবা কল করুন: ${HANDOFF_LINKS.tel}`;
  }
  if (/faq|প্রশ্ন/.test(s)) {
    return `সবচেয়ে বেশি জিজ্ঞেস করা প্রশ্ন: ${HANDOFF_LINKS.faq}`;
  }
  return "আমি বুঝেছি। একটু বিস্তারিত বলবেন? চাইলে আপনি লাইভ চ্যাট/কল/ইমেইলেও যেতে পারেন—বাটনগুলো উপরে আছে।";
}

export default function AIHelpAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("ai_helper_messages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "হ্যালো! আমি আপনার AI সহকারী। অর্ডার, ডেলিভারি, রিটার্ন, পেমেন্ট, ট্র্যাকিং—যেকোন প্রশ্ন করুন।",
            ts: Date.now(),
          },
        ];
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("ai_helper_messages", JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

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
      const reply = USE_BACKEND ? await askBackend(content) : ruleBasedAnswer(content);
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        ts: Date.now(),
      };
      setMessages((m) => [...m, botMsg]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "দুঃখিত, একটু সমস্যা হয়েছে। পরে আবার চেষ্টা করুন অথবা লাইভ এজেন্টে যান।",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const Header = useMemo(
    () => (
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold leading-none">AI সহকারী</p>
            <p className="text-xs text-muted-foreground">২৪/৭ সহায়তা</p>
          </div>
        </div>
        <button
          aria-label="Close"
          className="p-1 rounded-md hover:bg-muted"
          onClick={() => setOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    ),
    []
  );

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          aria-label="Open AI Assistant"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full px-4 py-3 shadow-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          <MessageCircle className="w-5 h-5" />
          AI Assistant
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] max-w-md rounded-2xl border bg-background shadow-xl overflow-hidden">
          {Header}

          {/* Handoff quick actions */}
          <div className="grid grid-cols-3 gap-2 p-3 border-b">
            <a href={HANDOFF_LINKS.tel} className="group rounded-xl border p-3 text-center hover:bg-muted transition">
              <Phone className="w-5 h-5 mx-auto" />
              <div className="text-xs mt-1 group-hover:underline">কল</div>
            </a>
            <a href={HANDOFF_LINKS.mail} className="group rounded-xl border p-3 text-center hover:bg-muted transition">
              <Mail className="w-5 h-5 mx-auto" />
              <div className="text-xs mt-1 group-hover:underline">ইমেইল</div>
            </a>
            <a href="/support#live-chat" className="group rounded-xl border p-3 text-center hover:bg-muted transition">
              <HelpCircle className="w-5 h-5 mx-auto" />
              <div className="text-xs mt-1 group-hover:underline">লাইভ চ্যাট</div>
            </a>
            <a href="https://wa.me/8801234567890" target="_blank" rel="noreferrer"
               className="group rounded-xl border p-3 text-center hover:bg-muted transition">
              <span className="text-lg leading-none">🟢</span>
              <div className="text-xs mt-1 group-hover:underline">WhatsApp</div>
            </a>
            <a href="https://t.me/yourtelegram" target="_blank" rel="noreferrer"
               className="group rounded-xl border p-3 text-center hover:bg-muted transition">
              <span className="text-lg leading-none">📨</span>
              <div className="text-xs mt-1 group-hover:underline">Telegram</div>
            </a>
            <a href="https://facebook.com/groups/yourgroup" target="_blank" rel="noreferrer"
               className="group rounded-xl border p-3 text-center hover:bg-muted transition">
              <span className="text-lg leading-none">📘</span>
              <div className="text-xs mt-1 group-hover:underline">FB Group</div>
            </a>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-72 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-start gap-2",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {m.role === "assistant" && (
                  <div className="shrink-0 mt-0.5 rounded-full border p-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm max-w-[80%] shadow-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
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
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                টাইপ করা হচ্ছে…
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-2">
            {QUICK_SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="shrink-0 rounded-full border px-3 py-1 text-xs hover:bg-muted"
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
              className="flex-1 rounded-xl border px-3 py-2 outline-none focus:ring focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-3 py-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              পাঠান
            </button>
          </form>
        </div>
      )}
    </>
  );
}
