-- Create support messages table
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  admin_id UUID,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('whatsapp', 'gmail', 'phone')),
  contact_info TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  admin_response TEXT,
  auto_delete_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own messages" 
ON public.support_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own messages" 
ON public.support_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" 
ON public.support_messages 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all messages" 
ON public.support_messages 
FOR SELECT 
USING (is_current_user_admin());

CREATE POLICY "Admins can update all messages" 
ON public.support_messages 
FOR UPDATE 
USING (is_current_user_admin());

CREATE POLICY "Admins can delete all messages" 
ON public.support_messages 
FOR DELETE 
USING (is_current_user_admin());

-- Auto-delete trigger function
CREATE OR REPLACE FUNCTION public.cleanup_expired_support_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.support_messages 
  WHERE auto_delete_at IS NOT NULL 
    AND auto_delete_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER update_support_messages_updated_at
  BEFORE UPDATE ON public.support_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER TABLE public.support_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;