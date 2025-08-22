import { Card } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-6">শর্তাবলী</h1>
        
        <p className="mb-4">
          আমাদের ওয়েবসাইট ব্যবহারের আগে নিচের শর্তাবলী ভালোভাবে পড়ে নিন। 
          আমাদের ওয়েবসাইট ব্যবহার করা মানে আপনি এই শর্তাবলীতে সম্মতি দিচ্ছেন।
        </p>

        <h2 className="text-xl font-semibold mb-2">১. সেবার ব্যবহার</h2>
        <p className="mb-4">
          আপনি শুধুমাত্র বৈধ কাজে আমাদের ওয়েবসাইট ব্যবহার করতে পারবেন। 
          কোন প্রকার প্রতারণা, ক্ষতিকর কাজ বা অবৈধ কার্যক্রম নিষিদ্ধ।
        </p>

        <h2 className="text-xl font-semibold mb-2">২. অর্ডার এবং পেমেন্ট</h2>
        <p className="mb-4">
          আপনার অর্ডার কনফার্ম হওয়ার পর আমরা তা প্রক্রিয়া করি। 
          পেমেন্ট অবশ্যই আমাদের নির্ধারিত পদ্ধতিতে সম্পন্ন করতে হবে।
        </p>

        <h2 className="text-xl font-semibold mb-2">৩. রিটার্ন ও রিফান্ড</h2>
        <p className="mb-4">
          আমাদের রিটার্ন পলিসি অনুসারে পণ্য ফেরত দেয়া যাবে। 
          শর্তসাপেক্ষে রিফান্ড প্রসেস করা হবে।
        </p>

        <h2 className="text-xl font-semibold mb-2">৪. প্রাইভেসি</h2>
        <p className="mb-4">
          আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখি। বিস্তারিত জানার জন্য 
          আমাদের প্রাইভেসি পলিসি দেখুন।
        </p>

        <h2 className="text-xl font-semibold mb-2">৫. পরিবর্তন</h2>
        <p className="mb-4">
          আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করতে পারি। 
          তাই নিয়মিত চেক করা আপনার দায়িত্ব।
        </p>

        <p className="mt-6 font-semibold">
          ধন্যবাদ আমাদের সেবা ব্যবহার করার জন্য।
        </p>
      </Card>
    </div>
  );
}
