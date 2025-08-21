import { useState } from "react";
import { Mail, Phone, MessageCircle, HeadphonesIcon, HelpCircle } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane, FaFacebookF, FaRobot } from "react-icons/fa";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Support() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "হ্যালো 👋 আমি আপনার AI Assistant। কীভাবে সাহায্য করতে পারি?" },
  ]);
  const [input, setInput] = useState("");

  // Dummy AI Reply
  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, { from: "user", text: input }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "🤖 আমি আপনার মেসেজ বুঝেছি: " + input },
      ]);
    }, 1000);
    setInput("");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <HeadphonesIcon className="w-16 h-16 mx-auto text-blue-500" />
        <h1 className="text-4xl font-bold">সাপোর্ট / হেল্প সেন্টার</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          আমাদের কাস্টমার সার্ভিস টিম ২৪/৭ আপনার পাশে আছে। নিচের মাধ্যমগুলো থেকে আপনার সুবিধামতো আমাদের সাথে যুক্ত হোন।
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <a href="mailto:smworldstoreofficial@gmail.com">
          <Card className="hover:shadow-xl transition hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-2">
              <Mail className="w-10 h-10 mx-auto text-purple-500" />
              <h2 className="text-xl font-semibold">ইমেইল সাপোর্ট</h2>
              <p className="text-muted-foreground">smworldstoreofficial@gmail.com</p>
            </CardContent>
          </Card>
        </a>

        <a href="tel:+8801624712851">
          <Card className="hover:shadow-xl transition hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-2">
              <Phone className="w-10 h-10 mx-auto text-green-500" />
              <h2 className="text-xl font-semibold">ফোন কল</h2>
              <p className="text-muted-foreground">+880 01624-712851</p>
            </CardContent>
          </Card>
        </a>

        <a href="/live-chat">
          <Card className="hover:shadow-xl transition hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-2">
              <MessageCircle className="w-10 h-10 mx-auto text-blue-500" />
              <h2 className="text-xl font-semibold">লাইভ চ্যাট</h2>
              <p className="text-muted-foreground">চ্যাটে এজেন্টের সাথে কথা বলুন</p>
            </CardContent>
          </Card>
        </a>

        <a href="https://wa.me/8801624712851" target="_blank" rel="noopener noreferrer">
          <Card className="hover:shadow-xl transition hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-2">
              <FaWhatsapp className="w-10 h-10 mx-auto text-green-600" />
              <h2 className="text-xl font-semibold">WhatsApp</h2>
              <p className="text-muted-foreground">ডাইরেক্ট হোয়াটসঅ্যাপে যান</p>
            </CardContent>
          </Card>
        </a>

        <a href="https://t.me/+ylw3CCVehHQ1NWQ9" target="_blank" rel="noopener noreferrer">
          <Card className="hover:shadow-xl transition hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-2">
              <FaTelegramPlane className="w-10 h-10 mx-auto text-sky-500" />
              <h2 className="text-xl font-semibold">Telegram</h2>
              <p className="text-muted-foreground">আমাদের Telegram গ্রুপে যোগ দিন</p>
            </CardContent>
          </Card>
        </a>

        <a href="https://www.facebook.com/profile.php?id=61579242700749" target="_blank" rel="noopener noreferrer">
          <Card className="hover:shadow-xl transition hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-2">
              <FaFacebookF className="w-10 h-10 mx-auto text-blue-600" />
              <h2 className="text-xl font-semibold">Facebook Page</h2>
              <p className="text-muted-foreground">আমাদের FB কমিউনিটিতে যুক্ত হোন</p>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Help Topics */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-500" /> হেল্প টপিক্স
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="item-1">
            <AccordionTrigger>অর্ডার কিভাবে করতে হয়?</AccordionTrigger>
            <AccordionContent>
              আমাদের ওয়েবসাইট থেকে প্রোডাক্ট সিলেক্ট করে কার্টে যুক্ত করুন। তারপর Checkout এ গিয়ে পেমেন্ট ও ঠিকানা দিন।
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>আমি কিভাবে অর্ডার ট্র্যাক করবো?</AccordionTrigger>
            <AccordionContent>
              আপনার Dashboard → My Orders এ গিয়ে অর্ডারের স্ট্যাটাস ট্র্যাক করতে পারবেন।
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>অর্ডার বাতিল করা যাবে কি?</AccordionTrigger>
            <AccordionContent>
              হ্যাঁ, পেমেন্ট করার আগে বা প্রসেসিং এ থাকলে আপনি অর্ডার বাতিল করতে পারবেন।
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6">
        {chatOpen ? (
          <div className="w-80 h-96 bg-white shadow-2xl rounded-2xl flex flex-col">
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-2xl">
              <span className="font-semibold">AI Assistant</span>
              <button onClick={() => setChatOpen(false)}>✖</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg max-w-[70%] ${
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
                className="flex-1 border rounded-lg px-2"
                placeholder="টাইপ করুন..."
              />
              <Button size="sm" onClick={handleSend}>
                পাঠান
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setChatOpen(true)}
            className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-blue-600 text-white"
          >
            <FaRobot className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
