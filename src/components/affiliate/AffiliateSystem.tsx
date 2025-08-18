import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  DollarSign, 
  Link, 
  Copy, 
  Trophy,
  UserPlus,
  Banknote
} from 'lucide-react';

interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  created_at: string;
  status: string;
  referred_profile: {
    full_name: string;
    phone: string;
  } | null;
}

interface Earning {
  id: string;
  commission_amount: number;
  commission_rate: number;
  created_at: string;
  status: string;
  order_id: string;
}

export default function AffiliateSystem() {
  const { profile, user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAffiliateData();
    }
  }, [user]);

  const fetchAffiliateData = async () => {
    if (!user) return;
    
    setLoading(true);

    try {
      // Fetch referrals first
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (referralError) {
        console.error('Error fetching referrals:', referralError);
      }

      // Fetch referred user profiles separately
      const referralsWithProfiles = await Promise.all(
        (referralData || []).map(async (referral) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', referral.referred_id)
            .single();

          return {
            ...referral,
            referred_profile: profileData
          };
        })
      );

      // Fetch earnings
      const { data: earningData, error: earningError } = await supabase
        .from('affiliate_earnings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (earningError) console.error('Error fetching earnings:', earningError);

      const referrals = referralsWithProfiles;
      const earnings = earningData || [];

      setReferrals(referrals);
      setEarnings(earnings);

      // Calculate stats
      const totalReferrals = referrals.length;
      const totalEarnings = earnings.reduce((sum, earning) => sum + Number(earning.commission_amount), 0);
      const pendingEarnings = earnings
        .filter(earning => earning.status === 'pending')
        .reduce((sum, earning) => sum + Number(earning.commission_amount), 0);

      setStats({ totalReferrals, totalEarnings, pendingEarnings });
    } catch (error) {
      console.error('Error fetching affiliate data:', error);
    }
    setLoading(false);
  };

  const copyReferralLink = () => {
    const referralCode = (profile as any)?.referral_code;
    if (!referralCode) return;
    
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "রেফারেল লিংক কপি হয়েছে!",
      description: "আপনার বন্ধুদের সাথে এই লিংক শেয়ার করুন।"
    });
  };

  const copyReferralCode = () => {
    const referralCode = (profile as any)?.referral_code;
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast({
        title: "রেফারেল কোড কপি হয়েছে!",
        description: `কোড: ${referralCode}`
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">অ্যাফিলিয়েট সিস্টেম</h2>
        <p className="text-muted-foreground">বন্ধুদের রেফার করুন এবং কমিশন আয় করুন!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট রেফারেল</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">সফল রেফারেল</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট আয়</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">সর্বমোট কমিশন</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">অপেক্ষমান আয়</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.pendingEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">অনুমোদনের অপেক্ষায়</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            আপনার রেফারেল তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>রেফারেল কোড</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={(profile as any)?.referral_code || ''}
                readOnly
                className="font-mono"
              />
              <Button variant="outline" size="sm" onClick={copyReferralCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>রেফারেল লিংক</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={`${window.location.origin}?ref=${(profile as any)?.referral_code || ''}`}
                readOnly
                className="text-sm"
              />
              <Button variant="outline" size="sm" onClick={copyReferralLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">কিভাবে কাজ করে?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• আপনার রেফারেল লিংক বন্ধুদের সাথে শেয়ার করুন</li>
              <li>• তারা আপনার লিংকে ক্লিক করে সাইনআপ করলে আপনি ৫% কমিশন পাবেন</li>
              <li>• প্রতিটি সফল অর্ডারে আপনার আয় হবে</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            আপনার রেফারেল তালিকা
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">এখনো কোন রেফারেল নেই</p>
              <p className="text-sm text-muted-foreground">বন্ধুদের আমন্ত্রণ জানান এবং কমিশন আয় করুন!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{referral.referred_profile?.full_name || 'নামহীন'}</h4>
                    <p className="text-sm text-muted-foreground">{referral.referred_profile?.phone}</p>
                    <p className="text-xs text-muted-foreground">
                      যোগদান: {new Date(referral.created_at).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                  <Badge variant={referral.status === 'confirmed' ? 'default' : 'secondary'}>
                    {referral.status === 'confirmed' ? 'সক্রিয়' : 'অপেক্ষমান'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earnings History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            আয়ের ইতিহাস
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.length === 0 ? (
            <div className="text-center py-8">
              <Banknote className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">এখনো কোন আয় নেই</p>
              <p className="text-sm text-muted-foreground">রেফারেল থেকে অর্ডার হলে আয় দেখাবে</p>
            </div>
          ) : (
            <div className="space-y-4">
              {earnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">৳{earning.commission_amount} ({earning.commission_rate * 100}% কমিশন)</h4>
                    <p className="text-sm text-muted-foreground">অর্ডার: #{earning.order_id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      তারিখ: {new Date(earning.created_at).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                  <Badge variant={earning.status === 'paid' ? 'default' : 'secondary'}>
                    {earning.status === 'paid' ? 'পেইড' : 'অপেক্ষমান'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}