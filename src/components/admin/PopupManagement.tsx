import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Popup {
  id: string;
  title: string;
  message: string;
  image_url: string | null;
  is_active: boolean;
  show_close_button: boolean;
  auto_hide_seconds: number | null;
  created_at: string;
}

export default function PopupManagement() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    image_url: '',
    is_active: true,
    show_close_button: true,
    auto_hide_seconds: ''
  });

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const { data, error } = await supabase
        .from('popups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPopups(data || []);
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "পপআপ লোড করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      image_url: '',
      is_active: true,
      show_close_button: true,
      auto_hide_seconds: ''
    });
    setEditingPopup(null);
  };

  const handleEdit = (popup: Popup) => {
    setEditingPopup(popup);
    setFormData({
      title: popup.title,
      message: popup.message,
      image_url: popup.image_url || '',
      is_active: popup.is_active,
      show_close_button: popup.show_close_button,
      auto_hide_seconds: popup.auto_hide_seconds?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const popupData = {
        title: formData.title,
        message: formData.message,
        image_url: formData.image_url || null,
        is_active: formData.is_active,
        show_close_button: formData.show_close_button,
        auto_hide_seconds: formData.auto_hide_seconds ? parseInt(formData.auto_hide_seconds) : null
      };

      if (editingPopup) {
        const { error } = await supabase
          .from('popups')
          .update(popupData)
          .eq('id', editingPopup.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('popups')
          .insert(popupData);

        if (error) throw error;
      }

      toast({
        title: "সফল",
        description: editingPopup ? "পপআপ আপডেট হয়েছে।" : "নতুন পপআপ তৈরি হয়েছে।"
      });

      setIsDialogOpen(false);
      resetForm();
      fetchPopups();
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: error.message || "পপআপ সেভ করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই পপআপটি মুছে দিতে চান?')) return;

    try {
      const { error } = await supabase
        .from('popups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "সফল",
        description: "পপআপ মুছে দেওয়া হয়েছে।"
      });

      fetchPopups();
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "পপআপ মুছতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('popups')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "সফল",
        description: "পপআপ স্ট্যাটাস আপডেট হয়েছে।"
      });

      fetchPopups();
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">পপআপ ব্যবস্থাপনা</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              নতুন পপআপ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPopup ? 'পপআপ এডিট করুন' : 'নতুন পপআপ তৈরি করুন'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">টাইটেল *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="স্বাগতম আমাদের ওয়েবসাইটে!"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">বার্তা *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="সেরা পণ্যের জন্য আমাদের সাথে থাকুন। ১০% ছাড় পেতে WELCOME10 কোড ব্যবহার করুন।"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image_url">ইমেজ URL (ঐচ্ছিক)</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="auto_hide_seconds">অটো বন্ধ (সেকেন্ড)</Label>
                <Input
                  id="auto_hide_seconds"
                  type="number"
                  value={formData.auto_hide_seconds}
                  onChange={(e) => setFormData({...formData, auto_hide_seconds: e.target.value})}
                  placeholder="5"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  খালি রাখলে ম্যানুয়াল বন্ধ করতে হবে
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show_close_button"
                  checked={formData.show_close_button}
                  onCheckedChange={(checked) => setFormData({...formData, show_close_button: checked})}
                />
                <Label htmlFor="show_close_button">বন্ধ করার বাটন দেখান</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">সক্রিয়</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {popups.map((popup) => (
          <Card key={popup.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{popup.title}</h3>
                  <Badge variant={popup.is_active ? "default" : "secondary"}>
                    {popup.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {popup.message}
                </p>
                {popup.image_url && (
                  <div className="mt-2">
                    <img 
                      src={popup.image_url} 
                      alt="Popup" 
                      className="w-32 h-20 object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>বন্ধ বাটন: {popup.show_close_button ? 'হ্যাঁ' : 'না'}</span>
                  {popup.auto_hide_seconds && (
                    <span>অটো বন্ধ: {popup.auto_hide_seconds}s</span>
                  )}
                  <span>তৈরি: {new Date(popup.created_at).toLocaleDateString('bn-BD')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(popup.id, popup.is_active)}
                >
                  {popup.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(popup)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(popup.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {popups.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">কোন পপআপ পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}