import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, 
  Search, Trash2, Edit, Eye, Filter, X, Download,
  ChevronDown, ChevronUp, Hash, UserCheck, UserX
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  referral_code: string;
  is_admin: boolean;
  created_at: string;
  _count?: {
    orders: number;
  };
}

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    email: true,
    phone: true,
    address: true,
    city: true,
    referral_code: true,
    orders: true,
    created_at: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchQuery, activeFilter, sortField, sortDirection]);

  const fetchUsers = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
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

  const filterAndSortUsers = () => {
    let filtered = users;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.referral_code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilter === 'admin') {
      filtered = filtered.filter(user => user.is_admin);
    } else if (activeFilter === 'customer') {
      filtered = filtered.filter(user => !user.is_admin);
    } else if (activeFilter === 'withOrders') {
      filtered = filtered.filter(user => user._count?.orders && user._count.orders > 0);
    } else if (activeFilter === 'withoutOrders') {
      filtered = filtered.filter(user => !user._count?.orders || user._count.orders === 0);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'orders') {
        aValue = a._count?.orders || 0;
        bValue = b._count?.orders || 0;
      } else {
        aValue = a[sortField as keyof Profile] || '';
        bValue = b[sortField as keyof Profile] || '';
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredUsers(filtered);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
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

  const deleteUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
    } else {
      fetchUsers();
      setDeleteDialogOpen(false);
    }
  };

  const exportUsers = () => {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'Referral Code',
      'Orders',
      'Admin',
      'Joined Date'
    ];
    
    const data = filteredUsers.map(user => [
      user.id,
      user.full_name || 'N/A',
      user.email || 'N/A',
      user.phone || 'N/A',
      user.address || 'N/A',
      user.city || 'N/A',
      user.referral_code || 'N/A',
      user._count?.orders || 0,
      user.is_admin ? 'Yes' : 'No',
      new Date(user.created_at).toLocaleDateString('bn-BD')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'users_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3, 4, 5].map((i) => (
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
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">ব্যবহারকারী ব্যবস্থাপনা</h2>
        <div className="text-sm text-muted-foreground">
          মোট ব্যবহারকারী: {users.length} | প্রদর্শিত: {filteredUsers.length}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="আইডি, নাম, ইমেইল, ফোন, ঠিকানা বা রেফারেল কোড দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              ফিল্টার
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>ব্যবহারকারী ফিল্টার</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveFilter('all')}>
              সকল ব্যবহারকারী
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('admin')}>
              এডমিন ব্যবহারকারী
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('customer')}>
              সাধারণ ব্যবহারকারী
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('withOrders')}>
              অর্ডার আছে এমন
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('withoutOrders')}>
              অর্ডার নেই এমন
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              কলাম
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>কলাম ভিজিবিলিটি</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(visibleColumns).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={value}
                onCheckedChange={(checked) => 
                  setVisibleColumns({ ...visibleColumns, [key]: checked })
                }
              >
                {key === 'id' && 'আইডি'}
                {key === 'email' && 'ইমেইল'}
                {key === 'phone' && 'ফোন'}
                {key === 'address' && 'ঠিকানা'}
                {key === 'city' && 'শহর'}
                {key === 'referral_code' && 'রেফারেল কোড'}
                {key === 'orders' && 'অর্ডার'}
                {key === 'created_at' && 'যোগদানের তারিখ'}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={exportUsers} className="gap-1">
          <Download className="h-4 w-4" />
          এক্সপোর্ট
        </Button>
      </div>

      {activeFilter !== 'all' && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            {activeFilter === 'admin' && 'এডমিন ব্যবহারকারী'}
            {activeFilter === 'customer' && 'সাধারণ ব্যবহারকারী'}
            {activeFilter === 'withOrders' && 'অর্ডার আছে এমন'}
            {activeFilter === 'withoutOrders' && 'অর্ডার নেই এমন'}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1"
              onClick={() => setActiveFilter('all')}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    নাম
                  </div>
                </th>
                {visibleColumns.id && (
                  <th className="p-3 text-left font-medium">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 font-medium" 
                      onClick={() => handleSort('id')}
                    >
                      আইডি
                      <SortIcon field="id" />
                    </Button>
                  </th>
                )}
                {visibleColumns.email && (
                  <th className="p-3 text-left font-medium">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 font-medium" 
                      onClick={() => handleSort('email')}
                    >
                      ইমেইল
                      <SortIcon field="email" />
                    </Button>
                  </th>
                )}
                {visibleColumns.phone && (
                  <th className="p-3 text-left font-medium">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 font-medium" 
                      onClick={() => handleSort('phone')}
                    >
                      ফোন
                      <SortIcon field="phone" />
                    </Button>
                  </th>
                )}
                {visibleColumns.address && (
                  <th className="p-3 text-left font-medium">
                    ঠিকানা
                  </th>
                )}
                {visibleColumns.city && (
                  <th className="p-3 text-left font-medium">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 font-medium" 
                      onClick={() => handleSort('city')}
                    >
                      শহর
                      <SortIcon field="city" />
                    </Button>
                  </th>
                )}
                {visibleColumns.referral_code && (
                  <th className="p-3 text-left font-medium">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 font-medium" 
                      onClick={() => handleSort('referral_code')}
                    >
                      রেফারেল কোড
                      <SortIcon field="referral_code" />
                    </Button>
                  </th>
                )}
                {visibleColumns.orders && (
                  <th className="p-3 text-left font-medium">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 font-medium" 
                      onClick={() => handleSort('orders')}
                    >
                      অর্ডার
                      <SortIcon field="orders" />
                    </Button>
                  </th>
                )}
                {visibleColumns.created_at && (
                  <th className="p-3 text-left font-medium">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 font-medium" 
                      onClick={() => handleSort('created_at')}
                    >
                      যোগদান
                      <SortIcon field="created_at" />
                    </Button>
                  </th>
                )}
                <th className="p-3 text-left font-medium">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-muted-foreground">
                    {searchQuery ? 'কোন ব্যবহারকারী পাওয়া যায়নি' : 'কোন ব্যবহারকারী নেই'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{user.full_name || 'নামহীন ব্যবহারকারী'}</div>
                          {user.is_admin && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1 mt-1">
                              <Shield className="w-3 h-3" />
                              এডমিন
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    {visibleColumns.id && (
                      <td className="p-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs font-mono cursor-help truncate max-w-[120px]">
                                {user.id.slice(0, 8)}...
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{user.id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    )}
                    {visibleColumns.email && (
                      <td className="p-3">
                        {user.email ? (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </td>
                    )}
                    {visibleColumns.phone && (
                      <td className="p-3">
                        {user.phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </td>
                    )}
                    {visibleColumns.address && (
                      <td className="p-3">
                        {user.address ? (
                          <div className="flex items-center gap-1 max-w-[150px] truncate">
                            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">{user.address}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </td>
                    )}
                    {visibleColumns.city && (
                      <td className="p-3">
                        <span className="text-sm">{user.city || 'N/A'}</span>
                      </td>
                    )}
                    {visibleColumns.referral_code && (
                      <td className="p-3">
                        {user.referral_code ? (
                          <Badge variant="outline" className="font-mono text-xs">
                            {user.referral_code}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </td>
                    )}
                    {visibleColumns.orders && (
                      <td className="p-3">
                        <Badge variant={user._count?.orders ? "default" : "outline"} className="text-xs">
                          {user._count?.orders || 0} টি
                        </Badge>
                      </td>
                    )}
                    {visibleColumns.created_at && (
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(user.created_at).toLocaleDateString('bn-BD')}
                        </div>
                      </td>
                    )}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>বিস্তারিত দেখুন</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                              >
                                {user.is_admin ? (
                                  <UserX className="h-4 w-4 text-destructive" />
                                ) : (
                                  <UserCheck className="h-4 w-4 text-green-600" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{user.is_admin ? 'এডমিন বাতিল করুন' : 'এডমিন বানান'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>ডিলিট করুন</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ব্যবহারকারী ডিলিট করুন</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি নিশ্চিত যে আপনি "{selectedUser?.full_name || 'এই ব্যবহারকারী'}" কে ডিলিট করতে চান? 
              এই কাজটি undo করা যাবে না এবং ব্যবহারকারীর সকল ডেটা চিরতরে মুছে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedUser && deleteUser(selectedUser.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              ডিলিট করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>ব্যবহারকারীর বিস্তারিত তথ্য</AlertDialogTitle>
          </AlertDialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">ব্যবহারকারী আইডি</h4>
                  <p className="text-sm font-mono p-2 bg-muted rounded-md">{selectedUser.id}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">পূর্ণ নাম</h4>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedUser.full_name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">ইমেইল</h4>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedUser.email || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">ফোন নম্বর</h4>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedUser.phone || 'N/A'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">ঠিকানা</h4>
                <p className="text-sm p-2 bg-muted rounded-md">{selectedUser.address || 'N/A'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">শহর</h4>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedUser.city || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">রেফারেল কোড</h4>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedUser.referral_code || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">অর্ডার সংখ্যা</h4>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedUser._count?.orders || 0} টি</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">এডমিন স্ট্যাটাস</h4>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedUser.is_admin ? 'হ্যাঁ' : 'না'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">যোগদানের তারিখ</h4>
                <p className="text-sm p-2 bg-muted rounded-md">
                  {new Date(selectedUser.created_at).toLocaleDateString('bn-BD')}
                </p>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction>ঠিক আছে</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
