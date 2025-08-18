-- Fix RLS policies for admin order access and create affiliate system

-- Add email to profiles for better user management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Create referrals table for affiliate system
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referred_id UUID NOT NULL,
  referral_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  status TEXT NOT NULL DEFAULT 'pending',
  UNIQUE(referred_id),
  UNIQUE(referral_code)
);

-- Create affiliate earnings table
CREATE TABLE IF NOT EXISTS public.affiliate_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  referral_id UUID NOT NULL,
  order_id UUID NOT NULL,
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  commission_rate NUMERIC NOT NULL DEFAULT 0.05,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS on new tables
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_earnings ENABLE ROW LEVEL SECURITY;

-- RLS policies for referrals
CREATE POLICY "Users can view their referrals" 
ON public.referrals 
FOR SELECT 
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals" 
ON public.referrals 
FOR INSERT 
WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins can view all referrals" 
ON public.referrals 
FOR SELECT 
USING (is_current_user_admin());

-- RLS policies for affiliate earnings
CREATE POLICY "Users can view their earnings" 
ON public.affiliate_earnings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all earnings" 
ON public.affiliate_earnings 
FOR SELECT 
USING (is_current_user_admin());

CREATE POLICY "System can create earnings" 
ON public.affiliate_earnings 
FOR INSERT 
WITH CHECK (true);

-- Add referral_code to profiles for easier tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := 'REF' || UPPER(substr(md5(random()::text), 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Trigger to auto-generate referral code for new users
CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_referral_code();