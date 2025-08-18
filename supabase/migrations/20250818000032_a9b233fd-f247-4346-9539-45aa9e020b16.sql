-- Fix infinite recursion in profiles RLS policies by creating a security definer function
-- and updating the policies to use it

-- First, create a security definer function to check if a user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create new policies using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_current_user_admin());

-- Also update other policies that might reference profiles table
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.is_current_user_admin());

DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;
CREATE POLICY "Admins can update any order" 
ON public.orders 
FOR UPDATE 
USING (public.is_current_user_admin());

DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
USING (public.is_current_user_admin());

DROP POLICY IF EXISTS "Admins can manage promo codes" ON public.promo_codes;
CREATE POLICY "Admins can manage promo codes" 
ON public.promo_codes 
FOR ALL 
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

DROP POLICY IF EXISTS "Only admins can manage settings" ON public.settings;
CREATE POLICY "Only admins can manage settings" 
ON public.settings 
FOR ALL 
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

DROP POLICY IF EXISTS "Admins can manage shipping rates" ON public.shipping_rates;
CREATE POLICY "Admins can manage shipping rates" 
ON public.shipping_rates 
FOR ALL 
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

DROP POLICY IF EXISTS "Only admins can manage popups" ON public.popups;
CREATE POLICY "Only admins can manage popups" 
ON public.popups 
FOR ALL 
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Make sure the admin user exists and is properly set as admin
-- This ensures mrsoyeb001@gmail.com can login as admin
UPDATE public.profiles 
SET is_admin = true 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'mrsoyeb001@gmail.com'
);