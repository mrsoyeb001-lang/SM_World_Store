import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Package, Truck, CheckCircle, XCircle, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ... আপনার পূর্ববর্তী ইন্টারফেসগুলি রাখুন ...

export default function OrderManagement() {
  // ... আপনার পূর্ববর্তী স্টেটগুলি রাখুন ...
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // ... আপনার পূর্ববর্তী ফাংশনগুলি রাখুন ...

  const downloadOrderPDF = async (order: Order) => {
    setGeneratingPdf(true);
    setSelectedOrder(order);
    
    // সামান্য বিলম্ব করে নিশ্চিত করুন যে DOM আপডেট হয়েছে
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (pdfRef.current) {
      try {
        const canvas = await html2canvas(pdfRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // অতিরিক্ত পৃষ্ঠা যোগ করুন যদি প্রয়োজন হয়
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`order-${order.id.slice(-8)}.pdf`);
        
        toast({
          title: "পিডিএফ ডাউনলোড হয়েছে",
          description: "অর্ডারের পিডিএফ সফলভাবে ডাউনলোড হয়েছে।",
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
          title: "পিডিএফ তৈরি করতে সমস্যা",
          description: "দয়া করে পুনরায় চেষ্টা করুন।",
          variant: "destructive"
        });
      }
    }
    setGeneratingPdf(false);
  };

  return (
    <div className="space-y-6">
      {/* পিডিএফ টেম্পলেট (দৃশ্যমান নয়) */}
      <div className="fixed -left-[10000px] top-0">
        {selectedOrder && (
          <div ref={pdfRef} className="bg-white p-8 w-[210mm]">
            {/* হেডার */}
            <div className="flex justify-between items-center border-b-2 border-blue-500 pb-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-blue-700">আমাদের দোকান</h1>
                <p className="text-gray-600">আপনার বিশ্বস্ত শপিং পার্টনার</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-800">অর্ডার ইনভয়েস</h2>
                <p className="text-gray-600">তারিখ: {new Date(selectedOrder.created_at).toLocaleDateString('bn-BD')}</p>
              </div>
            </div>
            
            {/* অর্ডার এবং গ্রাহক তথ্য */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">অর্ডার তথ্য</h3>
                <p><span className="font-medium">অর্ডার নং:</span> #{selectedOrder.id.slice(-8)}</p>
                <p><span className="font-medium">অর্ডার তারিখ:</span> {new Date(selectedOrder.created_at).toLocaleDateString('bn-BD')}</p>
                <p><span className="font-medium">অবস্থা:</span> {selectedOrder.status}</p>
                {selectedOrder.tracking_code && (
                  <p><span className="font-medium">ট্র্যাকিং নং:</span> {selectedOrder.tracking_code}</p>
                )}
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">গ্রাহক তথ্য</h3>
                <p>{selectedOrder.shipping_address.full_name}</p>
                <p>{selectedOrder.shipping_address.phone}</p>
                <p>{selectedOrder.shipping_address.address}</p>
                <p>{selectedOrder.shipping_address.city}</p>
              </div>
            </div>
            
            {/* পেমেন্ট তথ্য */}
            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">পেমেন্ট তথ্য</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">পদ্ধতি:</span> {getPaymentMethodLabel(selectedOrder.payment_method)}</p>
                  {selectedOrder.shipping_address.sender_number && (
                    <p><span className="font-medium">সেন্ডার নং:</span> {selectedOrder.shipping_address.sender_number}</p>
                  )}
                </div>
                <div>
                  {selectedOrder.shipping_address.transaction_id && (
                    <p><span className="font-medium">ট্রানজেকশন আইডি:</span> {selectedOrder.shipping_address.transaction_id}</p>
                  )}
                  {selectedOrder.promo_code && (
                    <p><span className="font-medium">প্রোমো কোড:</span> {selectedOrder.promo_code}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* অর্ডার আইটেম */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">অর্ডার আইটেম</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left border">পণ্য</th>
                    <th className="p-2 text-center border">পরিমাণ</th>
                    <th className="p-2 text-right border">দাম</th>
                    <th className="p-2 text-right border">মোট</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.order_items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-2 border">{item.products.name}</td>
                      <td className="p-2 text-center border">{item.quantity}</td>
                      <td className="p-2 text-right border">৳{item.price.toFixed(2)}</td>
                      <td className="p-2 text-right border">৳{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* মূল্য সারাংশ */}
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">মূল্য সারাংশ</h3>
              <div className="grid grid-cols-2 gap-2 max-w-md ml-auto">
                <div className="text-right">সাবটোটাল:</div>
                <div className="text-right">৳{(selectedOrder.total_amount - selectedOrder.shipping_cost + selectedOrder.discount_amount).toFixed(2)}</div>
                
                <div className="text-right">শিপিং খরচ:</div>
                <div className="text-right">৳{selectedOrder.shipping_cost.toFixed(2)}</div>
                
                {selectedOrder.discount_amount > 0 && (
                  <>
                    <div className="text-right text-green-600">ছাড়:</div>
                    <div className="text-right text-green-600">-৳{selectedOrder.discount_amount.toFixed(2)}</div>
                  </>
                )}
                
                <div className="text-right font-bold border-t pt-2 mt-2">মোট:</div>
                <div className="text-right font-bold border-t pt-2 mt-2">৳{selectedOrder.total_amount.toFixed(2)}</div>
              </div>
            </div>
            
            {/* বিশেষ নির্দেশনা */}
            {selectedOrder.notes && (
              <div className="bg-pink-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-pink-800 mb-2">বিশেষ নির্দেশনা</h3>
                <p>{selectedOrder.notes}</p>
              </div>
            )}
            
            {/* ফুটার */}
            <div className="border-t-2 border-blue-500 pt-4 text-center text-gray-600">
              <p>আমাদের সাথে কেনাকাটা করার জন্য আপনাকে ধন্যবাদ!</p>
              <p>যোগাযোগ: example@email.com | ফোন: ০১৭১২৩৪৫৬৭৮</p>
              <p className="text-sm mt-2">এই ইনভয়েসটি কম্পিউটার দ্বারা তৈরি হয়েছে এবং স্বাক্ষরের প্রয়োজন নেই</p>
            </div>
          </div>
        )}
      </div>

      {/* মূল UI যা আগের মতোই থাকবে */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">অর্ডার ব্যবস্থাপনা</h2>
          <div className="text-sm text-muted-foreground">
            মোট অর্ডার: {orders.length}
          </div>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8">লোড হচ্ছে...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">কোন অর্ডার পাওয়া যায়নি</div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Order Info */}
                  <div className="md:col-span-2">
                    {/* ... আপনার পূর্ববর্তী অর্ডার তথ্য UI ... */}
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    {/* ... আপনার পূর্ববর্তী অ্যাকশন বাটনগুলি ... */}
                    
                    {/* পিডিএফ ডাউনলোড বাটন যোগ করুন */}
                    <Button 
                      onClick={() => downloadOrderPDF(order)}
                      disabled={generatingPdf}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {generatingPdf && selectedOrder?.id === order.id ? (
                        'পিডিএফ তৈরি হচ্ছে...'
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          পিডিএফ ডাউনলোড
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
