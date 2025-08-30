import { CheckCircle, Truck, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl border border-gray-200">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <CardTitle className="text-2xl font-bold text-gray-800 mt-4">
            আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে 🎉
          </CardTitle>
          <p className="text-gray-500 mt-2">
            ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে। আমরা শীঘ্রই শিপমেন্ট প্রসেস শুরু করবো।
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6">
            {/* Order Summary */}
            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-indigo-500" />
                <div>
                  <h3 className="font-semibold text-gray-800">অর্ডার নম্বর</h3>
                  <p className="text-gray-500 text-sm">#ORD-20250901</p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-indigo-500" />
                <div>
                  <h3 className="font-semibold text-gray-800">ডেলিভারি তথ্য</h3>
                  <p className="text-gray-500 text-sm">
                    আপনার পণ্যটি ৩-৫ দিনের মধ্যে আপনার ঠিকানায় পাঠানো হবে।
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => navigate("/shop")}
                className="rounded-xl px-6"
              >
                আরও কেনাকাটা করুন
              </Button>
              <Button
                onClick={() => navigate("/orders")}
                className="rounded-xl px-6 flex items-center gap-2"
              >
                আমার অর্ডার দেখুন <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
