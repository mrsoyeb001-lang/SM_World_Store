import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <HelpCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">প্রশ্নোত্তর (FAQ)</h1>
        <p className="text-muted-foreground">
          আমাদের গ্রাহকদের সবচেয়ে বেশি করা কিছু প্রশ্নের উত্তর এখানে দেওয়া হলো।
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem
          value="item-1"
          className="border rounded-xl shadow-sm bg-white p-2"
        >
          <AccordionTrigger className="text-lg font-medium">
            আমি কিভাবে অর্ডার করতে পারি?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            আমাদের ওয়েবসাইটে লগইন করে পছন্দের পণ্যটি নির্বাচন করুন, কার্টে যোগ করুন
            এবং চেকআউট বাটনে ক্লিক করে অর্ডার সম্পন্ন করুন।
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-2"
          className="border rounded-xl shadow-sm bg-white p-2"
        >
          <AccordionTrigger className="text-lg font-medium">
            পেমেন্ট করার জন্য কি কি মাধ্যম আছে?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            আমরা বিকাশ, নগদ, রকেট সহ বিভিন্ন মোবাইল ব্যাংকিং সেবা গ্রহণ করি।
            এছাড়াও ক্যাশ অন ডেলিভারি সুবিধা রয়েছে।
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-3"
          className="border rounded-xl shadow-sm bg-white p-2"
        >
          <AccordionTrigger className="text-lg font-medium">
            ডেলিভারি কতদিনে হবে?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            ঢাকার ভেতরে ২৪-৪৮ ঘন্টার মধ্যে এবং ঢাকার বাইরে সাধারণত ৩-৫ কর্মদিবসের
            মধ্যে ডেলিভারি সম্পন্ন হয়।
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-4"
          className="border rounded-xl shadow-sm bg-white p-2"
        >
          <AccordionTrigger className="text-lg font-medium">
            আমি কি আমার অর্ডার ট্র্যাক করতে পারবো?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            হ্যাঁ, আপনি আপনার অ্যাকাউন্টের <strong>"আমার অর্ডার"</strong> সেকশনে
            গিয়ে প্রতিটি অর্ডারের ডেলিভারি স্ট্যাটাস ট্র্যাক করতে পারবেন।
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-5"
          className="border rounded-xl shadow-sm bg-white p-2"
        >
          <AccordionTrigger className="text-lg font-medium">
            অর্ডার ক্যান্সেল বা রিটার্ন করা যাবে কি?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            হ্যাঁ, আপনি অর্ডার করার ২৪ ঘন্টার মধ্যে ক্যান্সেল করতে পারবেন। পণ্য
            ডেলিভারির পর যদি কোন সমস্যা থাকে তাহলে আমাদের কাস্টমার সাপোর্টে
            যোগাযোগ করলে রিটার্ন/এক্সচেঞ্জ করা যাবে।
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-6"
          className="border rounded-xl shadow-sm bg-white p-2"
        >
          <AccordionTrigger className="text-lg font-medium">
            কাস্টমার সাপোর্টে কিভাবে যোগাযোগ করব?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            আপনি আমাদের <strong>যোগাযোগ</strong> পেজে গিয়ে সরাসরি মেসেজ করতে পারবেন
            অথবা support@bazar-bondhu.com এ ইমেইল করতে পারবেন।
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

