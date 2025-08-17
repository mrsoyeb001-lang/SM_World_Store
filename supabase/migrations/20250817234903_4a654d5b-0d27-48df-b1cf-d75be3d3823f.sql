-- Fix the RLS policy for order_items table to allow inserting order items for authenticated users
DROP POLICY IF EXISTS "Admins can insert order items" ON public.order_items;

-- Create a proper policy that allows users to insert order items for their own orders
CREATE POLICY "Users can insert order items for their own orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Also allow admins to view all order items
CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);