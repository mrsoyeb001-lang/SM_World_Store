import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Clock, User, CheckCircle, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SupportMessage {
  id: string;
  user_id: string;
  admin_id: string | null;
  subject: string;
  message: string;
  contact_method: 'whatsapp' | 'gmail' | 'phone';
  contact_info: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  admin_response?: string;
  created_at: string;
  updated_at: string;
  auto_delete_at?: string;
  profiles?: {
    full_name: string;
    phone: string;
    email: string;
  };
}

interface SupportSystemProps {
  isAdmin?: boolean;
}

export default function SupportSystem({ isAdmin = false }: SupportSystemProps) {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    contact_method: 'whatsapp' as const,
    contact_info: '',
    priority: 'medium' as const,
    auto_delete_hours: 24
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('support_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // If admin, check admin status first
      if (isAdmin) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();
        
        if (!profile?.is_admin) {
          toast({
            title: "অ্যাক্সেস নিষেধ",
            description: "সাপোর্ট ব্যবস্থাপনার জন্য এডমিন অনুমতি প্রয়োজন।",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }

      const response = await fetch(`https://regnbhyxkfpeojnhltkj.supabase.co/rest/v1/support_messages?${isAdmin ? '' : `user_id=eq.${user.id}&`}select=*,profiles(full_name,phone,email)&order=created_at.desc`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZ25iaHl4a2ZwZW9qbmhsdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjQ2NDcsImV4cCI6MjA3MTA0MDY0N30.3Eh2JoWCA0QtbzBFo5oNtoDvFJ4Xiq0rs6BnHXT-VFM',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data || []);
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        toast({
          title: "মেসেজ লোড ব্যর্থ",
          description: "সাপোর্ট মেসেজ লোড করতে সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "মেসেজ লোড ব্যর্থ", 
        description: "নেটওয়ার্ক সমস্যা। দয়া করে ইন্টারনেট সংযোগ চেক করুন।",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const submitMessage = async () => {
    if (!formData.subject.trim() || !formData.message.trim() || !formData.contact_info.trim()) {
      toast({
        title: "সব ফিল্ড পূরণ করুন",
        description: "দয়া করে সব প্রয়োজনীয় তথ্য দিন।",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const autoDeleteAt = new Date();
    autoDeleteAt.setHours(autoDeleteAt.getHours() + formData.auto_delete_hours);

    const response = await fetch(`https://regnbhyxkfpeojnhltkj.supabase.co/rest/v1/support_messages`, {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZ25iaHl4a2ZwZW9qbmhsdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjQ2NDcsImV4cCI6MjA3MTA0MDY0N30.3Eh2JoWCA0QtbzBFo5oNtoDvFJ4Xiq0rs6BnHXT-VFM',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user.id,
        subject: formData.subject,
        message: formData.message,
        contact_method: formData.contact_method,
        contact_info: formData.contact_info,
        priority: formData.priority,
        auto_delete_at: autoDeleteAt.toISOString()
      })
    });

    if (response.ok) {
      toast({
        title: "মেসেজ পাঠানো হয়েছে",
        description: "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
      });
      setFormData({
        subject: '',
        message: '',
        contact_method: 'whatsapp',
        contact_info: '',
        priority: 'medium',
        auto_delete_hours: 24
      });
      fetchMessages();
    } else {
      toast({
        title: "মেসেজ পাঠানো ব্যর্থ",
        description: "দয়া করে পুনরায় চেষ্টা করুন।",
        variant: "destructive"
      });
    }
  };

  const respondToMessage = async (messageId: string) => {
    if (!adminResponse.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const response = await fetch(`https://regnbhyxkfpeojnhltkj.supabase.co/rest/v1/support_messages?id=eq.${messageId}`, {
      method: 'PATCH',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZ25iaHl4a2ZwZW9qbmhsdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjQ2NDcsImV4cCI6MjA3MTA0MDY0N30.3Eh2JoWCA0QtbzBFo5oNtoDvFJ4Xiq0rs6BnHXT-VFM',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        admin_id: user.id,
        admin_response: adminResponse,
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
    });

    if (response.ok) {
      toast({
        title: "রিপ্লাই পাঠানো হয়েছে",
        description: "গ্রাহকের সাথে যোগাযোগ করুন।"
      });
      setAdminResponse('');
      setIsDialogOpen(false);
      fetchMessages();
    } else {
      toast({
        title: "রিপ্লাই ব্যর্থ",
        description: "দয়া করে পুনরায় চেষ্টা করুন।",
        variant: "destructive"
      });
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    const response = await fetch(`https://regnbhyxkfpeojnhltkj.supabase.co/rest/v1/support_messages?id=eq.${messageId}`, {
      method: 'PATCH',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZ25iaHl4a2ZwZW9qbmhsdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjQ2NDcsImV4cCI6MjA3MTA0MDY0N30.3Eh2JoWCA0QtbzBFo5oNtoDvFJ4Xiq0rs6BnHXT-VFM',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, updated_at: new Date().toISOString() })
    });

    if (response.ok) {
      fetchMessages();
    } else {
      toast({
        title: "স্ট্যাটাস আপডেট ব্যর্থ",
        description: "দয়া করে পুনরায় চেষ্টা করুন।",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    const response = await fetch(`https://regnbhyxkfpeojnhltkj.supabase.co/rest/v1/support_messages?id=eq.${messageId}`, {
      method: 'DELETE',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZ25iaHl4a2ZwZW9qbmhsdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjQ2NDcsImV4cCI6MjA3MTA0MDY0N30.3Eh2JoWCA0QtbzBFo5oNtoDvFJ4Xiq0rs6BnHXT-VFM',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      toast({
        title: "মেসেজ মুছে ফেলা হয়েছে"
      });
      fetchMessages();
    } else {
      toast({
        title: "মেসেজ মুছা ব্যর্থ",
        description: "দয়া করে পুনরায় চেষ্টা করুন।",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'অপেক্ষমান', variant: 'secondary' as const },
      in_progress: { label: 'প্রক্রিয়াধীন', variant: 'default' as const },
      resolved: { label: 'সমাধান', variant: 'default' as const },
      closed: { label: 'বন্ধ', variant: 'outline' as const }
    };
    const { label, variant } = config[status as keyof typeof config] || config.pending;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      low: { label: 'কম', variant: 'outline' as const },
      medium: { label: 'মাঝারি', variant: 'secondary' as const },
      high: { label: 'উচ্চ', variant: 'default' as const },
      urgent: { label: 'জরুরি', variant: 'destructive' as const }
    };
    const { label, variant } = config[priority as keyof typeof config] || config.medium;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'whatsapp': return '💬';
      case 'gmail': return '📧';
      case 'phone': return '📞';
      default: return '💬';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          {isAdmin ? 'সাপোর্ট সিস্টেম' : 'সাহায্য ও সাপোর্ট'}
        </h2>
        {!isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Send className="w-4 h-4 mr-2" />
                নতুন মেসেজ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>সাপোর্ট মেসেজ পাঠান</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>বিষয়</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="সমস্যার বিষয়"
                  />
                </div>
                <div>
                  <Label>বিস্তারিত</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="আপনার সমস্যার বিস্তারিত লিখুন"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>যোগাযোগের মাধ্যম</Label>
                    <Select value={formData.contact_method} onValueChange={(value: any) => setFormData(prev => ({ ...prev, contact_method: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="gmail">Gmail</SelectItem>
                        <SelectItem value="phone">ফোন</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>যোগাযোগের তথ্য</Label>
                    <Input
                      value={formData.contact_info}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))}
                      placeholder="নম্বর বা ইমেইল"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>অগ্রাধিকার</Label>
                    <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">কম</SelectItem>
                        <SelectItem value="medium">মাঝারি</SelectItem>
                        <SelectItem value="high">উচ্চ</SelectItem>
                        <SelectItem value="urgent">জরুরি</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>অটো ডিলিট (ঘন্টা)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      value={formData.auto_delete_hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, auto_delete_hours: parseInt(e.target.value) || 24 }))}
                    />
                  </div>
                </div>
                <Button onClick={submitMessage} className="w-full btn-gradient">
                  <Send className="w-4 h-4 mr-2" />
                  মেসেজ পাঠান
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">লোড হচ্ছে...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">কোন মেসেজ পাওয়া যায়নি</p>
          </div>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">
                      {isAdmin ? (message.profiles?.full_name || 'ইউজার') : 'আমার মেসেজ'}
                    </span>
                  </div>
                  {getStatusBadge(message.status)}
                  {getPriorityBadge(message.priority)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(message.created_at).toLocaleDateString('bn-BD')}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="font-semibold">{message.subject}</h3>
                <p className="text-sm text-muted-foreground">{message.message}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span>{getContactMethodIcon(message.contact_method)}</span>
                    {message.contact_method}
                  </span>
                  <span>{message.contact_info}</span>
                  {message.auto_delete_at && (
                    <span className="text-orange-600">
                      অটো ডিলিট: {new Date(message.auto_delete_at).toLocaleString('bn-BD')}
                    </span>
                  )}
                </div>
              </div>

              {message.admin_response && (
                <div className="bg-muted p-3 rounded mb-4">
                  <h4 className="font-medium text-sm mb-1">এডমিনের জবাব:</h4>
                  <p className="text-sm">{message.admin_response}</p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {isAdmin ? (
                  <>
                    <Dialog open={isDialogOpen && selectedMessage?.id === message.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedMessage(message)}>
                          <Send className="w-3 h-3 mr-1" />
                          জবাব দিন
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>এডমিন জবাব</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            placeholder="গ্রাহকের জবাব লিখুন..."
                            rows={4}
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              বাতিল
                            </Button>
                            <Button onClick={() => respondToMessage(message.id)}>
                              পাঠান
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Select onValueChange={(value) => updateMessageStatus(message.id, value)}>
                      <SelectTrigger className="w-auto">
                        <SelectValue placeholder="স্ট্যাটাস" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">অপেক্ষমান</SelectItem>
                        <SelectItem value="in_progress">প্রক্রিয়াধীন</SelectItem>
                        <SelectItem value="resolved">সমাধান</SelectItem>
                        <SelectItem value="closed">বন্ধ</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      মুছুন
                    </Button>

                    <a
                      href={message.contact_method === 'whatsapp' 
                        ? `https://wa.me/${message.contact_info.replace(/[^\d]/g, '')}`
                        : message.contact_method === 'gmail' 
                        ? `mailto:${message.contact_info}`
                        : `tel:${message.contact_info}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      {getContactMethodIcon(message.contact_method)} যোগাযোগ করুন
                    </a>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMessage(message.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    মুছুন
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}