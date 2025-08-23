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
  Package
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { AffiliateApplicationForm } from '@/components/affiliate/AffiliateApplicationForm';

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png"
              alt="SM World Store Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-gradient">SM World Store</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex flex-1 max-w-lg mx-8"
          >
            <div className="flex w-full rounded-lg border overflow-hidden">
              <Input
                type="search"
                placeholder="Search by Categories (Appliances, Electronics, etc...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 px-4"
              />
              <Button type="submit" className="rounded-none">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/favorites')}
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {favorites.length}
                </Badge>
              )}
            </Button>

            {/* Affiliate Application Button (Desktop Only) */}
            {user && !profile?.is_affiliate && (
              <div className="hidden md:block">
                <AffiliateApplicationForm />
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
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
              <Button onClick={() => navigate('/auth')} variant="outline">
                লগইন
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="flex w-full rounded-lg border overflow-hidden">
                      <Input
                        type="search"
                        placeholder="পণ্য খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 border-0 focus-visible:ring-0 px-4"
                      />
                      <Button type="submit" className="rounded-none">
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <div className="flex flex-col space-y-2">
                    <Link to="/" className="text-lg font-medium p-2 hover:bg-accent rounded-md">
                      হোম
                    </Link>
                    <Link to="/products" className="text-lg font-medium p-2 hover:bg-accent rounded-md">
                      সব পণ্য
                    </Link>
                    <Link to="/categories" className="text-lg font-medium p-2 hover:bg-accent rounded-md">
                      ক্যাটাগরি
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
