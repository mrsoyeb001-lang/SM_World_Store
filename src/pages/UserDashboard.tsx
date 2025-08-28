import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Clock,
  CreditCard,
  Truck,
  Home,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Shield,
  Download,
  Repeat,
  Heart,
  Gift
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { OrderDetailsDialog } from '@/components/ui/order-details-dialog';
import AffiliateSystem from '@/components/affiliate/AffiliateSystem';
import { AffiliateApplicationForm } from '@/components/affiliate/AffiliateApplicationForm';
import SupportSystem from '@/components/support/SupportSystem';
import { ProfileEditor } from '@/components/profile/ProfileEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

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
  const { profile, user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [affiliateApplication, setAffiliateApplication] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [notifications, setNotifications] = useState([]);
  const [userLevel, setUserLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(45);
  const { toast } = useToast();

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total_amount, 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    deliveredOrders: orders.filter(order => order.status === 'delivered').length,
    wishlistItems: 12,
    ongoingOrders: orders.filter(order => ['pending', 'confirmed', 'shipped'].includes(order.status)).length
  };

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    try {
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
        toast({
          title: "ত্রুটি",
          description: "অর্ডার লোড করতে সমস্যা হয়েছে",
          variant: "destructive"
        });
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const checkAffiliateApplication = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('affiliate_applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setAffiliateApplication(data);
    } catch (error) {
      console.error('Error checking affiliate application:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
    if (user) {
      checkAffiliateApplication();
      // Fetch notifications (placeholder)
      setNotifications([
        { id: 1, message: 'আপনার অর্ডার #1234 পাঠানো হয়েছে', time: '2 ঘন্টা আগে', read: false },
        { id: 2, message: 'আপনার অ্যাকাউন্টে 100 পয়েন্ট যোগ হয়েছে', time: '1 দিন আগে', read: true },
      ]);
    }
  }, [user, fetchOrders, checkAffiliateApplication]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'অপেক্ষমান', variant: 'outline', icon: Clock },
      confirmed: { label: 'নিশ্চিত', variant: 'secondary', icon: CheckCircle },
      shipped: { label: 'পাঠানো হয়েছে', variant: 'default', icon: Truck },
      delivered: { label: 'পৌঁছেছে', variant: 'success', icon: CheckCircle },
      cancelled: { label: 'বাতিল', variant: 'destructive', icon: XCircle }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const IconComponent = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "সাইন আউট সফল",
        description: "আপনি সফলভাবে সাইন আউট করেছেন",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const QuickActions = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <div className="p-2 bg-blue-100 rounded-full mb-2">
            <Home className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-medium text-sm">হোমপেজ</h3>
          <Button variant="link" className="h-4 p-0 text-blue-600" asChild>
            <Link to="/">যান</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <div className="p-2 bg-green-100 rounded-full mb-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="font-medium text-sm">কেনাকাটা</h3>
          <Button variant="link" className="h-4 p-0 text-green-600" asChild>
            <Link to="/products">শুরু করুন</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <div className="p-2 bg-purple-100 rounded-full mb-2">
            <Gift className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="font-medium text-sm">উইশলিস্ট</h3>
          <Button variant="link" className="h-4 p-0 text-purple-600" asChild>
            <Link to="/wishlist">দেখুন</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <div className="p-2 bg-amber-100 rounded-full mb-2">
            <HelpCircle className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="font-medium text-sm">সাহায্য</h3>
          <Button variant="link" className="h-4 p-0 text-amber-600" onClick={() => setActiveTab("support")}>
            পান
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">ব্যবহারকারী ড্যাশবোর্ড</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>নোটিফিকেশন</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{profile?.full_name || 'ব্যবহারকারী'}</p>
                      <p className="text-xs text-muted-foreground">{profile?.email || 'ইমেইল'}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      {profile?.full_name ? profile.full_name.charAt(0) : 'U'}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>হোমপেজ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>প্রোফাইল</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("support")} className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>সাহায্য</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>সাইন আউট</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">আপনার ড্যাশবোর্ড</h1>
              <p className="text-muted-foreground">
                স্বাগতম, <span className="font-semibold text-blue-600">{profile?.full_name || 'প্রিয় গ্রাহক'}!</span> আপনার অ্যাকাউন্ট সংক্রান্ত সকল তথ্য এখানে পাওয়া যাবে।
              </p>
            </div>
            <div className="flex gap-2">
              {profile?.is_affiliate ? (
                <Badge variant="default" className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500">
                  <TrendingUp className="w-4 h-4" />
                  অ্যাফিলিয়েট পার্টনার
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
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {affiliateApplication.status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                  affiliateApplication.status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                  <Clock className="w-4 h-4" />}
                  {affiliateApplication.status === 'approved' ? 'অনুমোদিত' :
                  affiliateApplication.status === 'rejected' ? 'প্রত্যাখ্যাত' : 'অপেক্ষমান'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <QuickActions />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">মোট অর্ডার</CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">সব সময়ের অর্ডার</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">মোট খরচ</CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{stats.totalSpent.toLocaleString('bn-BD')}</div>
              <p className="text-xs text-muted-foreground">সব সময়ের খরচ</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">চলমান অর্ডার</CardTitle>
              <div className="p-2 bg-amber-100 rounded-full">
                <Truck className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ongoingOrders}</div>
              <p className="text-xs text-muted-foreground">বিতরণাধীন</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">উইশলিস্ট</CardTitle>
              <div className="p-2 bg-purple-100 rounded-full">
                <Heart className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.wishlistItems}</div>
              <p className="text-xs text-muted-foreground">আইটেম সংরক্ষিত</p>
            </CardContent>
          </Card>
        </div>

        {/* User Level Card */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">লয়ালটি লেভেল: সিলভার</h3>
                <p className="text-indigo-100">পরবর্তী লেভেল পর্যন্ত {100 - levelProgress}% বাকি</p>
              </div>
              <Badge variant="secondary" className="bg-white text-indigo-600">
                লেভেল {userLevel}
              </Badge>
            </div>
            <Progress value={levelProgress} className="h-2 bg-indigo-700" />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-indigo-200">সিলভার</span>
              <span className="text-sm text-indigo-200">গোল্ড</span>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-6 bg-muted p-1">
            <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Package className="h-4 w-4" />
              <span className="hidden md:inline">আমার অর্ডার</span>
            </TabsTrigger>
            <TabsTrigger value="affiliate" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden md:inline">{profile?.is_affiliate ? 'এফিলিয়েট' : 'রেফারেল'}</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden md:inline">সাপোর্ট</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">প্রোফাইল</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">সুরক্ষা</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>সাম্প্রতিক অর্ডার</CardTitle>
                  <CardDescription>আপনার সর্বশেষ অর্ডারগুলির তালিকা</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/order-history">সমস্ত অর্ডার দেখুন</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="w-16 h-16 rounded" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
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
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">অর্ডার #{(order.id).substring(0, 8)}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('bn-BD', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">৳{order.total_amount.toLocaleString('bn-BD')}</div>
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

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="flex-1"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            বিস্তারিত দেখুন
                          </Button>
                          {(order.status === 'confirmed' || order.status === 'shipped') && (
                            <Button variant="outline" size="sm" className="flex-1">
                              <Truck className="mr-2 h-4 w-4" />
                              ট্র্যাক করুন
                            </Button>
                          )}
                        </div>
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
            <ProfileEditor />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  অ্যাকাউন্ট সুরক্ষা
                </CardTitle>
                <CardDescription>আপনার অ্যাকাউন্ট সুরক্ষা ব্যবস্থাপনা করুন</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">পাসওয়ার্ড</h4>
                    <p className="text-sm text-muted-foreground">শেষ পরিবর্তন: ৩ মাস আগে</p>
                  </div>
                  <Button variant="outline">পরিবর্তন করুন</Button>
                </div>
                
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">২-ফ্যাক্টর প্রমাণীকরণ</h4>
                    <p className="text-sm text-muted-foreground">অ্যাকাউন্ট সুরক্ষা বাড়ান</p>
                  </div>
                  <Button variant="outline">সক্রিয় করুন</Button>
                </div>
                
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">লগইন সেশন</h4>
                    <p className="text-sm text-muted-foreground">বর্তমানে ১টি ডিভাইস সক্রিয়</p>
                  </div>
                  <Button variant="outline">পরিচালনা করুন</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <OrderDetailsDialog 
          open={selectedOrder !== null}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
          order={selectedOrder}
        />
      </div>
    </div>
  );
}
