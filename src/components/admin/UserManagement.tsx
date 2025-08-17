import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck, UserX } from 'lucide-react';

interface User {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "ব্যবহারকারী তালিকা লোড করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !currentStatus } : user
      ));

      toast({
        title: "সফল",
        description: "ব্যবহারকারীর অ্যাডমিন স্ট্যাটাস আপডেট হয়েছে।"
      });
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm) ||
    user.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-8">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ব্যবহারকারী ব্যবস্থাপনা</h2>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="নাম, ফোন বা ঠিকানা দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">
                    {user.full_name || 'নাম নেই'}
                  </h3>
                  <Badge variant={user.is_admin ? "default" : "secondary"}>
                    {user.is_admin ? 'অ্যাডমিন' : 'সাধারণ ব্যবহারকারী'}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>ফোন:</strong> {user.phone || 'N/A'}</p>
                    <p><strong>ঠিকানা:</strong> {user.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>শহর:</strong> {user.city || 'N/A'}</p>
                    <p><strong>যোগদানের তারিখ:</strong> {new Date(user.created_at).toLocaleDateString('bn-BD')}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={user.is_admin ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                >
                  {user.is_admin ? (
                    <>
                      <UserX className="w-4 h-4 mr-2" />
                      অ্যাডমিন সরান
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      অ্যাডমিন বানান
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">কোন ব্যবহারকারী পাওয়া যায়নি।</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">মোট পরিসংখ্যান</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-medium">মোট ব্যবহারকারী</p>
            <p className="text-2xl font-bold text-primary">{users.length}</p>
          </div>
          <div>
            <p className="font-medium">অ্যাডমিন</p>
            <p className="text-2xl font-bold text-green-600">{users.filter(u => u.is_admin).length}</p>
          </div>
          <div>
            <p className="font-medium">সাধারণ ব্যবহারকারী</p>
            <p className="text-2xl font-bold text-blue-600">{users.filter(u => !u.is_admin).length}</p>
          </div>
          <div>
            <p className="font-medium">সম্পূর্ণ প্রোফাইল</p>
            <p className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.full_name && u.phone && u.address).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}