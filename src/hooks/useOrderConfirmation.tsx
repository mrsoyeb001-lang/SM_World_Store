import { useToast } from '@/hooks/use-toast';

export function useOrderConfirmation() {
  const { toast } = useToast();

  const showOrderConfirmation = (orderId: string, totalAmount: number) => {
    toast({
      title: "অর্ডার সফল! 🎉",
      description: `আপনার অর্ডার #${orderId.slice(0, 8)} সফলভাবে প্রদান করা হয়েছে। মোট: ৳${totalAmount.toLocaleString()}`,
      duration: 5000,
    });
  };

  const showStatusUpdateConfirmation = (status: string) => {
    const statusLabels: Record<string, string> = {
      confirmed: 'নিশ্চিত করা হয়েছে',
      shipped: 'পাঠানো হয়েছে',
      delivered: 'ডেলিভার হয়েছে'
    };

    const label = statusLabels[status] || status;
    
    toast({
      title: "অর্ডার আপডেট",
      description: `আপনার অর্ডার ${label}!`,
      duration: 4000,
    });
  };

  return {
    showOrderConfirmation,
    showStatusUpdateConfirmation
  };
}