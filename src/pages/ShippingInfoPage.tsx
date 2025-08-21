import { motion } from "framer-motion";
import { MapPin, Truck, ShieldCheck, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-6">
      {/* Header Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          শিপিং তথ্য
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          আপনার পণ্য কীভাবে ডেলিভারি হবে তার সম্পূর্ণ গাইডলাইন
        </p>
      </motion.div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="shadow-xl rounded-2xl bg-white"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="mx-auto text-blue-600 w-12 h-12 mb-4" />
              <h2 className="text-xl font-bold mb-2">দ্রুত ডেলিভারি</h2>
              <p className="text-gray-600">
                দেশের যেকোনো প্রান্তে ২-৫ কর্মদিবসের মধ্যে পৌঁছে যাবে।
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="shadow-xl rounded-2xl bg-white"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <ShieldCheck className="mx-auto text-green-600 w-12 h-12 mb-4" />
              <h2 className="text-xl font-bold mb-2">নিরাপদ প্যাকেজিং</h2>
              <p className="text-gray-600">
                প্রতিটি পণ্য সুরক্ষিতভাবে প্যাকেজ করা হয় যাতে কোনো ক্ষতি না হয়।
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="shadow-xl rounded-2xl bg-white"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="mx-auto text-purple-600 w-12 h-12 mb-4" />
              <h2 className="text-xl font-bold mb-2">ট্র্যাকিং সুবিধা</h2>
              <p className="text-gray-600">
                অর্ডারের স্ট্যাটাস রিয়েল-টাইমে ট্র্যাক করতে পারবেন।
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="shadow-xl rounded-2xl bg-white"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="mx-auto text-red-600 w-12 h-12 mb-4" />
              <h2 className="text-xl font-bold mb-2">ডেলিভারি কাভারেজ</h2>
              <p className="text-gray-600">
                বাংলাদেশের প্রত্যন্ত এলাকাতেও শিপিং করা হয়।
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <h2 className="text-2xl font-semibold mb-6">
          আপনার অর্ডার এখনই ট্র্যাক করুন
        </h2>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">
          অর্ডার ট্র্যাক করুন
        </Button>
      </motion.div>
    </div>
  );
}
