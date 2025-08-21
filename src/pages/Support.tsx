import { Mail, Phone, MessageCircle, HelpCircle, HeadphonesIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function Support() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <HeadphonesIcon className="w-16 h-16 mx-auto text-blue-500" />
        <h1 className="text-4xl font-bold">সাপোর্ট / হেল্প সেন্টার</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          আমাদের কাস্টমার সার্ভিস টিম ২৪/৭ আপনার পাশে আছে। কোনো সমস্যা বা প্রশ্ন থাকলে এখান থেকে যোগাযোগ করুন।
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6 text-center space-y-2">
            <Mail className="w-10 h-10 mx-auto text-purple-500" />
            <h2 className="text-xl font-semibold">ইমেইল সাপোর্ট</h2>
            <p className="text-muted-foreground">support@yourshop.com</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6 text-center space-y-2">
            <Phone className="w-10 h-10 mx-auto text-green-500" />
            <h2 className="text-xl font-semibold">ফোন সাপোর্ট</h2>
            <p className="text-muted-foreground">+880 1234 567 890</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6 text-center space-y-2">
            <MessageCircle className="w-10 h-10 mx-auto text-blue-500" />
            <h2 className="text-xl font-semibold">লাইভ চ্যাট</h2>
            <p className="text-muted-foreground">চ্যাটে এজেন্টের সাথে কথা বলুন</p>
          </CardContent>
        </Card>
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

      {/* Mini FAQ */}
      <div>
        <h2 className="text-2xl font-bold mb-6">সাধারণ প্রশ্নোত্তর</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">ডেলিভারি কতদিনে হয়?</h3>
              <p className="text-muted-foreground">ঢাকার ভিতরে ২-৩ দিন, ঢাকার বাইরে ৩-৫ দিন।</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">রিটার্ন পলিসি কেমন?</h3>
              <p className="text-muted-foreground">৭ দিনের মধ্যে পণ্য ফেরত দেওয়া যাবে, শর্ত প্রযোজ্য।</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

