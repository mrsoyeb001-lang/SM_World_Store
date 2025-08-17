import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (method: string, details?: any) => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [paymentDetails, setPaymentDetails] = useState({
    senderNumber: '',
    transactionId: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .in('key', ['payment_bkash_number', 'payment_rocket_number', 'payment_nagad_number']);

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
      });
      
      setSettings(settingsMap);
    } catch (error: any) {
      console.error('Error fetching payment settings:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "কপি হয়েছে",
      description: "নাম্বারটি কপি করা হয়েছে।"
    });
  };

  const handleMethodChange = (method: string) => {
    onChange(method, method !== 'cash_on_delivery' ? paymentDetails : undefined);
  };

  const handleDetailsChange = (field: string, value: string) => {
    const newDetails = { ...paymentDetails, [field]: value };
    setPaymentDetails(newDetails);
    if (value !== 'cash_on_delivery') {
      onChange(value, newDetails);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="paymentMethod">পেমেন্ট মেথড</Label>
        <Select value={value} onValueChange={handleMethodChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash_on_delivery">ক্যাশ অন ডেলিভারি</SelectItem>
            <SelectItem value="bkash">বিকাশ</SelectItem>
            <SelectItem value="rocket">রকেট</SelectItem>
            <SelectItem value="nagad">নগদ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {value === 'bkash' && settings.payment_bkash_number && (
        <Card className="p-4 bg-pink-50 border-pink-200">
          <h4 className="font-semibold text-pink-800 mb-2">বিকাশ পেমেন্ট</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded border">
              <div>
                <p className="text-sm text-gray-600">বিকাশ নাম্বার</p>
                <p className="font-mono font-semibold">{settings.payment_bkash_number}</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard(settings.payment_bkash_number)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <Label htmlFor="senderNumber">যে নাম্বার থেকে টাকা পাঠিয়েছেন *</Label>
              <Input
                id="senderNumber"
                value={paymentDetails.senderNumber}
                onChange={(e) => handleDetailsChange('senderNumber', e.target.value)}
                placeholder="01XXXXXXXXX"
                required
              />
            </div>
            <div>
              <Label htmlFor="transactionId">ট্রানজেকশন আইডি *</Label>
              <Input
                id="transactionId"
                value={paymentDetails.transactionId}
                onChange={(e) => handleDetailsChange('transactionId', e.target.value)}
                placeholder="8A45DF78XX"
                required
              />
            </div>
          </div>
        </Card>
      )}

      {value === 'rocket' && settings.payment_rocket_number && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2">রকেট পেমেন্ট</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded border">
              <div>
                <p className="text-sm text-gray-600">রকেট নাম্বার</p>
                <p className="font-mono font-semibold">{settings.payment_rocket_number}</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard(settings.payment_rocket_number)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <Label htmlFor="senderNumber">যে নাম্বার থেকে টাকা পাঠিয়েছেন *</Label>
              <Input
                id="senderNumber"
                value={paymentDetails.senderNumber}
                onChange={(e) => handleDetailsChange('senderNumber', e.target.value)}
                placeholder="01XXXXXXXXX"
                required
              />
            </div>
            <div>
              <Label htmlFor="transactionId">ট্রানজেকশন আইডি *</Label>
              <Input
                id="transactionId"
                value={paymentDetails.transactionId}
                onChange={(e) => handleDetailsChange('transactionId', e.target.value)}
                placeholder="RXX123456789"
                required
              />
            </div>
          </div>
        </Card>
      )}

      {value === 'nagad' && settings.payment_nagad_number && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-2">নগদ পেমেন্ট</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded border">
              <div>
                <p className="text-sm text-gray-600">নগদ নাম্বার</p>
                <p className="font-mono font-semibold">{settings.payment_nagad_number}</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard(settings.payment_nagad_number)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <Label htmlFor="senderNumber">যে নাম্বার থেকে টাকা পাঠিয়েছেন *</Label>
              <Input
                id="senderNumber"
                value={paymentDetails.senderNumber}
                onChange={(e) => handleDetailsChange('senderNumber', e.target.value)}
                placeholder="01XXXXXXXXX"
                required
              />
            </div>
            <div>
              <Label htmlFor="transactionId">ট্রানজেকশন আইডি *</Label>
              <Input
                id="transactionId"
                value={paymentDetails.transactionId}
                onChange={(e) => handleDetailsChange('transactionId', e.target.value)}
                placeholder="NGD123456789"
                required
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}