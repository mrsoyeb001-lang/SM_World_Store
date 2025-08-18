import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}

export function useAffiliate() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0
  });

  const processReferralSignup = async (referralCode: string) => {
    if (!user || !referralCode) return;

    try {
      // Find the referrer
      const { data: referrer, error: referrerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .single();

      if (referrerError || !referrer) return;

      // Check if this user is already referred
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_id', user.id)
        .single();

      if (existingReferral) return; // Already referred

      // Create referral record
      const { error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrer.id,
          referred_id: user.id,
          referral_code: referralCode,
          status: 'confirmed'
        });

      if (referralError) {
        console.error('Error creating referral:', referralError);
      }
    } catch (error) {
      console.error('Error processing referral:', error);
    }
  };

  const createAffiliateEarning = async (orderId: string, orderAmount: number) => {
    if (!user) return;

    try {
      // Check if user was referred
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .select('referrer_id, referral_code')
        .eq('referred_id', user.id)
        .eq('status', 'confirmed')
        .single();

      if (referralError || !referral) return;

      const commissionRate = 0.05; // 5%
      const commissionAmount = orderAmount * commissionRate;

      // Create earning record
      const { error: earningError } = await supabase
        .from('affiliate_earnings')
        .insert({
          user_id: referral.referrer_id,
          referral_id: referral.referrer_id,
          order_id: orderId,
          commission_amount: commissionAmount,
          commission_rate: commissionRate,
          status: 'pending'
        });

      if (earningError) {
        console.error('Error creating affiliate earning:', earningError);
      } else {
        // Notify referrer (optional - could use push notifications)
        toast({
          title: "কমিশন অর্জিত!",
          description: `৳${commissionAmount.toFixed(2)} কমিশন আয় হয়েছে।`
        });
      }
    } catch (error) {
      console.error('Error creating affiliate earning:', error);
    }
  };

  const fetchAffiliateStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch referrals count
      const { count: referralCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact' })
        .eq('referrer_id', user.id);

      // Fetch earnings
      const { data: earnings, error: earningsError } = await supabase
        .from('affiliate_earnings')
        .select('commission_amount, status')
        .eq('user_id', user.id);

      if (earningsError) {
        console.error('Error fetching earnings:', earningsError);
        return;
      }

      const totalEarnings = earnings?.reduce((sum, earning) => sum + Number(earning.commission_amount), 0) || 0;
      const pendingEarnings = earnings?.filter(e => e.status === 'pending').reduce((sum, earning) => sum + Number(earning.commission_amount), 0) || 0;

      setStats({
        totalReferrals: referralCount || 0,
        totalEarnings,
        pendingEarnings
      });
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check for referral code in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode && user) {
      processReferralSignup(refCode);
      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [user]);

  return {
    stats,
    loading,
    processReferralSignup,
    createAffiliateEarning,
    fetchAffiliateStats
  };
}