import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Package, Truck, DollarSign, Ban, Phone } from "lucide-react";

export default function SellerPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">বিক্রেতা নীতি (Seller Policy)</h1>
          <p className="text-lg opacity-90">
            আমাদের প্ল্যাটফর্মে বিক্রেতা হিসেবে রেজিস্ট্রেশন করার মাধ্যমে, আপনি নিম্নলিখিত শর্তাবলী ও নীতিমালা মেনে চলতে সম্মত হচ্ছেন।
          </p>
        </div>

        {/* Account Policy */}
        <Card className="mb-6 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="text-purple-600" />
              <h2 className="text-2xl font-semibold">অ্যাকাউন্ট রেজিস্ট্রেশন ও ভেরিফিকেশন</h2>
            </div>
            <Separator className="mb-4" />
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>সঠিক নাম, ঠিকানা, ফোন নাম্বার ও বৈধ ডকুমেন্ট দিয়ে অ্যাকাউন্ট খুলতে হবে।</li>
              <li>একই ব্যক্তি একাধিক সেলার অ্যাকাউন্ট খুলতে পারবেন না।</li>
              <li>যেকোনো প্রকার ভুয়া তথ্য দিলে অ্যাকাউন্ট ব্যান হতে পারে।</li>
            </ul>
          </CardContent>
        </Card>

        {/* Product Policy */}
        <Card className="mb-6 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Package className="text-purple-600" />
              <h2 className="text-2xl font-semibold">প্রোডাক্ট লিস্টিং নিয়ম</h2>
            </div>
            <Separator className="mb-4" />
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>অরিজিনাল ও অনুমোদিত পণ্য বিক্রি করতে হবে।</li>
              <li>কপি/নকল, অবৈধ বা নিষিদ্ধ প্রোডাক্ট আপলোড করা যাবে না।</li>
              <li>সঠিক শিরোনাম, বর্ণনা, মূল্য ও ছবি ব্যবহার করতে হবে।</li>
              <li>স্টক আউট হলে সাথে সাথে লিস্টিং আপডেট করতে হবে।</li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment & Commission */}
        <Card className="mb-6 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="text-purple-600" />
              <h2 className="text-2xl font-semibold">পেমেন্ট ও কমিশন</h2>
            </div>
            <Separator className="mb-4" />
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>প্রত্যেক বিক্রির উপর নির্দিষ্ট কমিশন কর্তন করা হবে।</li>
              <li>পেমেন্ট সাপ্তাহিক/মাসিক নির্ধারিত সময়ে প্রদান করা হবে।</li>
              <li>ফেক অর্ডার বা কাস্টমারকে বিভ্রান্ত করার চেষ্টা করলে কমিশন ও পেমেন্ট আটকানো হবে।</li>
            </ul>
          </CardContent>
        </Card>

        {/* Shipping & Return */}
        <Card className="mb-6 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="text-purple-600" />
              <h2 className="text-2xl font-semibold">শিপিং ও রিটার্ন</h2>
            </div>
            <Separator className="mb-4" />
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>সেলারকে নির্ধারিত সময়ের মধ্যে প্রোডাক্ট শিপমেন্ট নিশ্চিত করতে হবে।</li>
              <li>ভুল বা ক্ষতিগ্রস্ত প্রোডাক্ট পাঠানো হলে সেলারকে রিটার্ন/রিফান্ড প্রক্রিয়া সম্পন্ন করতে হবে।</li>
              <li>ডেলিভারির বিলম্ব বা সাপোর্টের অভাবে সেলার দায়ী থাকবেন।</li>
            </ul>
          </CardContent>
        </Card>

        {/* Fraud & Penalty */}
        <Card className="mb-6 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Ban className="text-purple-600" />
              <h2 className="text-2xl font-semibold">প্রতারণা ও পেনাল্টি</h2>
            </div>
            <Separator className="mb-4" />
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>ফেক অর্ডার, নকল রিভিউ বা প্রতারণামূলক কার্যক্রম করলে অ্যাকাউন্ট ব্যান হবে।</li>
              <li>যেকোনো প্রকার আইন ভঙ্গ করলে প্রশাসনিক ব্যবস্থা নেওয়া হবে।</li>
              <li>অন্য বিক্রেতা বা ক্রেতাকে হয়রানি করা হলে কড়া শাস্তি দেওয়া হবে।</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="text-purple-600" />
              <h2 className="text-2xl font-semibold">সহায়তা প্রয়োজন?</h2>
            </div>
            <Separator className="mb-4" />
            <p className="text-gray-700 mb-2">
              আমাদের সেলার সাপোর্ট টিমের সাথে যোগাযোগ করতে পারেন যেকোনো প্রশ্ন, সমস্যা বা সাহায্যের জন্য।
            </p>
            <p className="text-gray-700">
              📞 ফোন: +8801XXXXXXXXX <br />
              📧 ইমেইল: seller-support@example.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
