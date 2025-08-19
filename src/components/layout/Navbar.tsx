import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  Heart,
  LogOut,
  Settings,
  Package,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { AffiliateApplicationForm } from '@/components/affiliate/AffiliateApplicationForm';

// 🔹 তোমার লোগো এখানে ইমপোর্ট করো (Step–0 অনুযায়ী রাখলে কাজ করবে)
import logo from '@/assets/logo.png';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut, isAdmin, profile } = useAuth();
  const { itemCount } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b text-white bg-gradient-to-r from-pink-600 to-fuchsia-600">
      <div className="container mx-auto px-3">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Menu + Logo + Name */}
          <div className="flex items-center gap-2">
            {/* Mobile Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="mt-6 flex flex-col space-y-2">
                  <Link to="/" className="p-2 rounded-md hover:bg-accent">হোম</Link>
                  <Link to="/products" className="p-2 rounded-md hover:bg-accent">সব পণ্য</Link>
                  <Link to="/categories" className="p-2 rounded-md hover:bg-accent">ক্যাটাগরি</Link>
                  <Link to="/favorites" className="p-2 rounded-md hover:bg-accent">পছন্দের তালিকা</Link>
                  <Link to="/cart" className="p-2 rounded-md hover:bg-accent">কার্ট</Link>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo + Brand */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="SM WORLD STORE"
                className="h-8 w-8 rounded-md bg-white p-1"
              />
              <span className="text-lg font-extrabold leading-none">SM WORLD STORE</span>
            </Link>
          </div>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70" />
              <Input
                type="search"
                placeholder="পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white text-black"
              />
            </div>
          </form>

          {/* Right side buttons */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white"
              onClick={() => navigate('/cart')}
              aria-label="কার্ট"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white"
              onClick={() => navigate('/favorites')}
              aria-label="পছন্দের তালিকা"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
                >
                  {favorites.length}
                </Badge>
              )}
            </Button>

            {/* Affiliate CTA (যদি অ্যাফিলিয়েট না হয়) */}
            {user && !profile?.is_affiliate && (
              <div className="hidden sm:block">
                <AffiliateApplicationForm />
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="text-sm font-medium">{profile?.full_name || 'ব্যবহারকারী'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin ? (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      অ্যাডমিন ড্যাশবোর্ড
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      ড্যাশবোর্ড
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    আমার অর্ডার
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    লগ আউট
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="outline" className="bg-white text-pink-600">
                লগইন
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70" />
            <Input
              type="search"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white text-black"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
