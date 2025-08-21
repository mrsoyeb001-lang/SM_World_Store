import { useState } from "react";
import { Mail, Phone, MessageCircle, HeadphonesIcon, HelpCircle } from "lucide-react";
import { FaWhatsapp, FaTelegram, FaFacebook, FaRobot } from "react-icons/fa6";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Support() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "হ্যালো 👋 আমি আপনার AI Assistant। কীভাবে সাহায্য করতে পারি?" },
  ]);
  const [input, setInput] = useState("");

  // Dummy AI reply (পরে OpenAI/Backend দিয়ে রিয়েল করে নেবেন)
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    const userMsg = input;
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: `🤖 আমি বুঝেছি: “${userMsg}”. আরও জানতে মেনু থেকে একটি টপিক বেছে নিন অথবা নির্দিষ্ট প্রশ্ন করুন।` },
      ]);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
      {/* Hero */}
      <div className="relative text-center space-y-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-10 rounded-2xl shadow-lg">
        <HeadphonesIcon className="w-20 h-20 mx-auto text-blue-600" />
        <h1 className="text-5xl font-extrabold">সাপোর্ট / হেল্প সেন্টার</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          আমাদের কাস্টমার সার্ভিস টিম ২৪/৭ আপনার পাশে আছে। নিচের মাধ্যমে সহজেই আমাদের সাথে যোগাযোগ করুন।
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Email */}
        <a href="mailto:smworldstoreofficial@gmail.com">
          <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-r from-purple-50 to-white">
            <CardContent className="p-8 text-center space-y-3">
              <Mail className="w-12 h-12 mx-auto text-purple-500" />
              <h2 className="text-2xl font-bold">ইমেইল সাপোর্ট</h2>
              <p className="text-muted-foreground">smworldstoreofficial@gmail.com</p>
            </CardContent>
          </Card>
        </a>

        {/* Phone */}
        <a href="tel:+8801624712851">
          <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-r from-green-50 to-white">
            <CardContent className="p-8 text-center space-y-3">
              <Phone className="w-12 h-12 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold">ফোন কল</h2>
              <p className="text-muted-foreground">+880 01624-712851</p>
            </CardContent>
          </Card>
        </a>

        {/* Live Chat (internal route) */}
        <a href="/live-chat">
          <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-r from-blue-50 to-white">
            <CardContent className="p-8 text-center space-y-3">
              <MessageCircle className="w-12 h-12 mx-auto text-blue-500" />
              <h2 className="text-2xl font-bold">লাইভ চ্যাট</h2>
              <p className="text-muted-foreground">চ্যাটে এজেন্টের সাথে কথা বলুন</p>
            </CardContent>
          </Card>
        </a>

        {/* WhatsApp */}
        <a href="https://wa.me/8801624712851" target="_blank" rel="noopener noreferrer">
          <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-r from-green-100 to-white">
            <CardContent className="p-8 text-center space-y-3">
              <FaWhatsapp className="w-12 h-12 mx-auto" />
              <h2 className="text-2xl font-bold">WhatsApp</h2>
              <p className="text-muted-foreground">ডাইরেক্ট হোয়াটসঅ্যাপে যান</p>
            </CardContent>
          </Card>
        </a>

        {/* Telegram */}
        <a href="https://t.me/+ylw3CCVehHQ1NWQ9" target="_blank" rel="noopener noreferrer">
          <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-r from-sky-50 to-white">
            <CardContent className="p-8 text-center space-y-3">
              <FaTelegram className="w-12 h-12 mx-auto" />
              <h2 className="text-2xl font-bold">Telegram</h2>
              <p className="text-muted-foreground">আমাদের Telegram গ্রুপে যোগ দিন</p>
            </CardContent>
          </Card>
        </a>

        {/* Facebook Page */}
        <a href="https://www.facebook.com/profile.php?id=61579242700749" target="_blank" rel="noopener noreferrer">
          <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-r from-blue-100 to-white">
            <CardContent className="p-8 text-center space-y-3">
              <FaFacebook className="w-12 h-12 mx-auto" />
              <h2 className="text-2xl font-bold">Facebook Page</h2>
              <p className="text-muted-foreground">আমাদের FB কমিউনিটিতে যুক্ত হোন</p>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Help Topics */}
      <div>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <HelpCircle className="w-7 h-7 text-blue-500" /> হেল্প টপিক্স
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="item-1">
            <AccordionTrigger>অর্ডার কিভাবে করতে হয়?</AccordionTrigger>
            <AccordionContent>
              প্রোডাক্ট সিলেক্ট করে কার্টে যোগ করুন → Checkout → ঠিকানা/পেমেন্ট দিন → কনফার্ম।
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>আমি কিভাবে অর্ডার ট্র্যাক করবো?</AccordionTrigger>
            <AccordionContent>
              Dashboard → My Orders এ গিয়ে প্রতিটি অর্ডারের স্ট্যাটাস দেখতে পারবেন।
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>অর্ডার বাতিল করা যাবে কি?</AccordionTrigger>
            <AccordionContent>
              পেমেন্টের আগে বা প্রসেসিং অবস্থায় থাকলে বাতিল সম্ভব। শিপড হলে কুরিয়ার রিটার্ন প্রক্রিয়া ফলো করুন।
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Floating AI Chat Widget (fixed at bottom-right) */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen ? (
          <div className="w-80 h-96 bg-white shadow-2xl rounded-2xl flex flex-col border">
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-2xl">
              <span className="font-semibold flex items-center gap-2"><FaRobot /> AI Assistant</span>
              <button onClick={() => setChatOpen(false)} aria-label="Close">✖</button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                    msg.from === "user"
                      ? "bg-blue-100 ml-auto"
                      : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="p-2 border-t flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-lg px-3 h-10"
                placeholder="আপনার প্রশ্ন লিখুন..."
              />
              <Button size="sm" onClick={handleSend}>পাঠান</Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setChatOpen(true)}
            className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-blue-600 text-white"
            aria-label="Open chat"
          >
            <FaRobot className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
