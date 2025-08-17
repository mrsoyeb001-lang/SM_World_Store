-- Add tracking_code column to orders table
ALTER TABLE public.orders 
ADD COLUMN tracking_code TEXT;