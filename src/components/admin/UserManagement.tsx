import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  is_admin: boolean;
  created_at: string;
  _count?: {
    orders: number;
  };
}

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (searchQuery) {
      query = query.or(`full_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      // Fetch order counts for each user
      const usersWithCounts = await Promise.all(
        (data || []).map(async (user) => {
          const { count } = await supabase
            .from('orders')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id);
          
          return {
            ...user,
            _count: { orders: count || 0 }
          };
        })
      );
      
      setUsers(usersWithCounts);
    }
    setLoading(false);
  };

  const toggleAdminStatus = async (userId: string, currentAdminStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentAdminStatus })
      .eq('id', userId);

    if (error) {
      console.error('Error updating admin status:', error);
    } else {
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ব্যবহারকারী ব্যবস্থাপনা</h2>
        <div className="text-sm text-muted-foreground">
          মোট ব্যবহারকারী: {users.length}
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4">
        {users.length === 0 ? (
          <div className="text-center py-8">কোন ব্যবহারকারী পাওয়া যায়নি</div>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.full_name || 'নামহীন ব্যবহারকারী'}</h3>
                      {user.is_admin && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          এডমিন
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                      {user.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {user.city ? `${user.address}, ${user.city}` : user.address}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        যোগদান: {new Date(user.created_at).toLocaleDateString('bn-BD')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {user._count?.orders || 0} টি অর্ডার
                    </div>
                    <div className="text-xs text-muted-foreground">
                      #{user.id.slice(-8)}
                    </div>
                  </div>
                  
                  <Button
                    variant={user.is_admin ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                  >
                    {user.is_admin ? 'এডমিন বাতিল' : 'এডমিন বানান'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}