import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import PromoCodeManagement from './PromoCodeManagement';
import UserManagement from './UserManagement';
import SiteSettings from './SiteSettings';
import SupportSystem from '@/components/support/SupportSystem';
import { AffiliateManagement } from './AffiliateManagement';
import { ShoppingBag, Users, DollarSign, Package, TrendingUp, Clock, MessageCircle } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  todayOrders: number;
  thisMonthRevenue: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export default function EnhancedAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    todayOrders: 0,
    thisMonthRevenue: 0
  });
  
  const [orderStatusData, setOrderStatusData] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      // Fetch basic stats
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('*'),
        supabase.from('profiles').select('id', { count: 'exact' })
      ]);

      const orders = ordersRes.data || [];
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      
      // Calculate date-based stats
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().substring(0, 7);
      
      const todayOrders = orders.filter(order => 
        order.created_at.startsWith(today)
      ).length;
      
      const thisMonthRevenue = orders
        .filter(order => order.created_at.startsWith(thisMonth))
        .reduce((sum, order) => sum + Number(order.total_amount), 0);

      // Order status distribution
      const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        name: getStatusLabel(status),
        value: count
      }));

      // Revenue data for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const revenueByDay = last7Days.map(date => {
        const dayOrders = orders.filter(order => order.created_at.startsWith(date));
        return {
          date: new Date(date).toLocaleDateString('bn-BD', { weekday: 'short' }),
          revenue: dayOrders.reduce((sum, order) => sum + Number(order.total_amount), 0),
          orders: dayOrders.length
        };
      });

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: orders.length,
        totalUsers: usersRes.count || 0,
        totalRevenue,
        pendingOrders: statusCounts.pending || 0,
        deliveredOrders: statusCounts.delivered || 0,
        todayOrders,
        thisMonthRevenue
      });

      setOrderStatusData(statusData);
      setRevenueData(revenueByDay);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'পেন্ডিং',
      confirmed: 'কনফার্ম',
      shipped: 'শিপড',
      delivered: 'ডেলিভারড',
      cancelled: 'বাতিল'
    };
    return labels[status] || status;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">মোট পণ্য</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <Package className="h-12 w-12 text-blue-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">মোট অর্ডার</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-green-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">মোট ব্যবহারকারী</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="h-12 w-12 text-purple-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">মোট আয়</p>
              <p className="text-3xl font-bold">৳{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-12 w-12 text-orange-200" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">পেন্ডিং অর্ডার</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">ডেলিভারড অর্ডার</p>
              <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">আজকের অর্ডার</p>
              <p className="text-2xl font-bold text-blue-600">{stats.todayOrders}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">এই মাসের আয়</p>
              <p className="text-2xl font-bold text-purple-600">৳{stats.thisMonthRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">অর্ডার স্ট্যাটাস ডিস্ট্রিবিউশন</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">গত ৭ দিনের আয়</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? `৳${value.toLocaleString()}` : value, 
                  name === 'revenue' ? 'আয়' : 'অর্ডার'
                ]} 
              />
              <Bar dataKey="revenue" fill="#8884d8" />
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="products">পণ্য</TabsTrigger>
          <TabsTrigger value="orders">অর্ডার</TabsTrigger>
          <TabsTrigger value="promo">প্রমো কোড</TabsTrigger>
          <TabsTrigger value="users">ব্যবহারকারী</TabsTrigger>
          <TabsTrigger value="affiliate">এফিলিয়েট</TabsTrigger>
          <TabsTrigger value="support">সাপোর্ট</TabsTrigger>
          <TabsTrigger value="settings">সেটিংস</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
        
        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>
        
        <TabsContent value="promo">
          <PromoCodeManagement />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="affiliate">
          <AffiliateManagement />
        </TabsContent>
        
        <TabsContent value="support">
          <SupportSystem isAdmin={true} />
        </TabsContent>
        
        <TabsContent value="settings">
          <SiteSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}