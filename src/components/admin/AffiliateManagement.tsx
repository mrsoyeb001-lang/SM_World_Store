import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  Search 
} from 'lucide-react';

interface AffiliateApplication {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  nid_number: string;
  address: string;
  bank_account: string | null;
  mobile_banking: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  profiles?: {
    email: string;
  };
}

export function AffiliateManagement() {
  const [applications, setApplications] = useState<AffiliateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AffiliateApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('affiliate_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Manually fetch profiles for each application
      const applicationsWithProfiles = await Promise.all(
        (data || []).map(async (app) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', app.user_id)
            .maybeSingle();
          
          return {
            ...app,
            profiles: profile
          };
        })
      );
      
      setApplications(applicationsWithProfiles);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: string, 
    status: 'approved' | 'rejected',
    notes: string = ''
  ) => {
    try {
      const { error } = await supabase
        .from('affiliate_applications')
        .update({ 
          status,
          admin_notes: notes 
        })
        .eq('id', applicationId);

      if (error) throw error;

      // If approved, update user profile to affiliate
      if (status === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_affiliate: true })
            .eq('id', application.user_id);

          if (profileError) throw profileError;
        }
      }

      toast({
        title: status === 'approved' ? "আবেদন অনুমোদিত" : "আবেদন প্রত্যাখ্যাত",
        description: status === 'approved' 
          ? "এফিলিয়েট আবেদন সফলভাবে অনুমোদন করা হয়েছে।"
          : "এফিলিয়েট আবেদন প্রত্যাখ্যান করা হয়েছে।"
      });

      setSelectedApp(null);
      fetchApplications();
    } catch (error: any) {
      toast({
        title: "আপডেট ব্যর্থ",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'অপেক্ষমান', variant: 'outline' as const, icon: Clock },
      approved: { label: 'অনুমোদিত', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'প্রত্যাখ্যাত', variant: 'destructive' as const, icon: XCircle }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    const IconComponent = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const filteredApplications = applications.filter(app =>
    app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.phone.includes(searchQuery) ||
    app.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">মোট আবেদন</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">অপেক্ষমান</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">অনুমোদিত</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">প্রত্যাখ্যাত</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>এফিলিয়েট আবেদনসমূহ</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="নাম, ফোন বা ইমেইল দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">কোন এফিলিয়েট আবেদন পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{application.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {application.profiles?.email} • {application.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(application.status)}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedApp(application);
                              setAdminNotes(application.admin_notes || '');
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            বিস্তারিত
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>আবেদনের বিস্তারিত</DialogTitle>
                          </DialogHeader>
                          
                          {selectedApp && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>নাম</Label>
                                  <p className="text-sm">{selectedApp.full_name}</p>
                                </div>
                                <div>
                                  <Label>ফোন</Label>
                                  <p className="text-sm">{selectedApp.phone}</p>
                                </div>
                                <div>
                                  <Label>ইমেইল</Label>
                                  <p className="text-sm">{selectedApp.profiles?.email}</p>
                                </div>
                                <div>
                                  <Label>এনআইডি</Label>
                                  <p className="text-sm">{selectedApp.nid_number}</p>
                                </div>
                              </div>

                              <div>
                                <Label>ঠিকানা</Label>
                                <p className="text-sm">{selectedApp.address}</p>
                              </div>

                              {selectedApp.bank_account && (
                                <div>
                                  <Label>ব্যাংক অ্যাকাউন্ট</Label>
                                  <p className="text-sm">{selectedApp.bank_account}</p>
                                </div>
                              )}

                              {selectedApp.mobile_banking && (
                                <div>
                                  <Label>মোবাইল ব্যাংকিং</Label>
                                  <p className="text-sm">{selectedApp.mobile_banking}</p>
                                </div>
                              )}

                              <div>
                                <Label>আবেদনের তারিখ</Label>
                                <p className="text-sm">
                                  {new Date(selectedApp.created_at).toLocaleDateString('bn-BD')}
                                </p>
                              </div>

                              <div>
                                <Label htmlFor="admin_notes">এডমিন নোট</Label>
                                <Textarea
                                  id="admin_notes"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="এখানে নোট লিখুন..."
                                  rows={3}
                                />
                              </div>

                              {selectedApp.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => updateApplicationStatus(
                                      selectedApp.id, 
                                      'approved', 
                                      adminNotes
                                    )}
                                    className="flex-1"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    অনুমোদন করুন
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => updateApplicationStatus(
                                      selectedApp.id, 
                                      'rejected', 
                                      adminNotes
                                    )}
                                    className="flex-1"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    প্রত্যাখ্যান করুন
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    আবেদনের তারিখ: {new Date(application.created_at).toLocaleDateString('bn-BD')}
                  </div>
                  
                  {application.admin_notes && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <strong>এডমিন নোট:</strong> {application.admin_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}