import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Popup {
  id: string;
  title: string;
  message: string;
  image_url: string | null;
  show_close_button: boolean;
  auto_hide_seconds: number | null;
}

export default function PopupMessage() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchActivePopup();
  }, []);

  useEffect(() => {
    if (popup && popup.auto_hide_seconds) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, popup.auto_hide_seconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [popup]);

  const fetchActivePopup = async () => {
    try {
      const { data, error } = await supabase
        .from('popups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPopup(data);
        setIsOpen(true);
      }
    } catch (error: any) {
      console.error('Error fetching popup:', error);
    }
  };

  if (!popup) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md p-0 gap-0">
        {popup.show_close_button && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 z-10"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        
        <div className="p-6 space-y-4">
          {popup.image_url && (
            <div className="w-full">
              <img 
                src={popup.image_url} 
                alt={popup.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="text-center space-y-3">
            <h2 className="text-xl font-bold text-primary">
              {popup.title}
            </h2>
            
            <p className="text-muted-foreground whitespace-pre-line">
              {popup.message}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}