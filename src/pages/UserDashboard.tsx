import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  ShoppingCart, 
  User, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  Eye,
  MessageCircle,
  UserPlus,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { OrderDetailsDialog } from '@/components/ui/order-details-dialog';
import AffiliateSystem from '@/components/affiliate/AffiliateSystem';
import { AffiliateApplicationForm } from '@/components/affiliate/AffiliateApplicationForm';
import SupportSystem from '@/components/support/SupportSystem';
import { ProfileEditor } from '@/components/profile/ProfileEditor';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: {
    quantity: number;
    price: number;
    product: {
      name: string;
      images: string[];
    };
  }[];
}

export default function UserDashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { profile, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [affiliateApplication, setAffiliateApplication] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    fetchOrders();
    if (user) {
      checkAffiliateApplication();
    }
  }, [user]);

  const checkAffiliateApplication = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('affiliate_applications')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    setAffiliateApplication(data);
  };

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          quantity,
          price,
          product:products(name, images)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
      
      // Calculate stats
      const totalOrders = data?.length || 0;
      const totalSpent = data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const pendingOrders = data?.filter(order => order.status === 'pending').length || 0;
      
      setStats({ totalOrders, totalSpent, pendingOrders });
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'অপেক্ষমান', variant: 'outline' as const },
      confirmed: { label: 'নিশ্চিত', variant: 'secondary' as const },
      shipped: { label: 'পাঠানো হয়েছে', variant: 'default' as const },
      delivered: { label: 'পৌঁছেছে', variant: 'default' as const },
      cancelled: { label: 'বাতিল', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">ড্যাশবোর্ড</h1>
            <p className="text-muted-foreground">
              স্বাগতম, {profile?.full_name || 'ব্যবহারকারী'}!
            </p>
          </div>
          <div className="flex gap-2">
            {profile?.is_affiliate ? (
              <Badge variant="default" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                অ্যাফিলিয়েট
              </Badge>
            ) : !affiliateApplication ? (
              <AffiliateApplicationForm 
                onApplicationSubmitted={() => {
                  checkAffiliateApplication();
                }}
              />
            ) : (
              <Badge 
                variant={
                  affiliateApplication.status === 'approved' ? 'default' :
                  affiliateApplication.status === 'rejected' ? 'destructive' : 'secondary'
                }
                className="flex items-center gap-1"
              >
                {affiliateApplication.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                 affiliateApplication.status === 'rejected' ? <XCircle className="w-3 h-3" /> :
                 <Clock className="w-3 h-3" />}
                {affiliateApplication.status === 'approved' ? 'অনুমোদিত' :
                 affiliateApplication.status === 'rejected' ? 'প্রত্যাখ্যাত' : 'অপেক্ষমান'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট অর্ডার</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট খরচ</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.totalSpent.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">অপেক্ষমান</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">আমার অর্ডার</TabsTrigger>
          <TabsTrigger value="affiliate">{profile?.is_affiliate ? 'এফিলিয়েট' : 'রেফারেল'}</TabsTrigger>
          <TabsTrigger value="support">সাপোর্ট</TabsTrigger>
          <TabsTrigger value="profile">প্রোফাইল</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>সাম্প্রতিক অর্ডার</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted animate-pulse rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted animate-pulse rounded" />
                          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">আপনার কোন অর্ডার নেই</p>
                  <Button asChild className="btn-gradient">
                    <Link to="/">কেনাকাটা শুরু করুন</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">অর্ডার #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('bn-BD')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">৳{order.total_amount}</div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {order.order_items.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={item.product.images[0] || '/placeholder.svg'}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ))}
                        {order.order_items.length > 3 && (
                          <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center text-xs">
                            +{order.order_items.length - 3}
                          </div>
                        )}
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        বিস্তারিত দেখুন
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliate" className="space-y-4">
          <AffiliateSystem />
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <SupportSystem isAdmin={false} />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          {/* User ID Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                ব্যবহারকারী তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">ব্যবহারকারী আইডি</p>
                  <p className="font-mono text-sm">{user?.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">নাম</p>
                  <p className="font-medium">{profile?.full_name || 'নাম নেই'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ইমেইল</p>
                  <p className="font-medium">{profile?.email || 'ইমেইল নেই'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ফোন</p>
                  <p className="font-medium">{profile?.phone || 'ফোন নাম্বার নেই'}</p>
                </div>
                {(profile?.address || profile?.city) && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">ঠিকানা</p>
                    <p className="font-medium">
                      {profile?.address ? `${profile.address}${profile.city ? `, ${profile.city}` : ''}` : 'ঠিকানা নেই'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <ProfileEditor />
        </TabsContent>
      </Tabs>

      <OrderDetailsDialog 
        open={selectedOrder !== null}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}