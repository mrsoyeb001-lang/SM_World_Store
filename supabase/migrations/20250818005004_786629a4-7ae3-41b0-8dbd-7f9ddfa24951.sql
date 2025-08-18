-- Fix search path for cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_support_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.support_messages 
  WHERE auto_delete_at IS NOT NULL 
    AND auto_delete_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;