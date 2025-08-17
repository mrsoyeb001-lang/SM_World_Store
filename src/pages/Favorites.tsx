import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { ProductCard } from '@/components/product/ProductCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  images: string[];
  stock_quantity: number;
  rating: number;
  review_count: number;
}

export default function Favorites() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    if (user && favorites.length > 0) {
      fetchFavoriteProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [user, favorites]);

  const fetchFavoriteProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', favorites)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching favorite products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Card className="p-8 max-w-md mx-auto">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">পছন্দের তালিকা দেখুন</h2>
            <p className="text-muted-foreground mb-4">
              আপনার পছন্দের পণ্যগুলো দেখতে লগইন করুন
            </p>
            <Button asChild>
              <Link to="/auth">লগইন করুন</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">আমার পছন্দের পণ্য</h1>
        <p className="text-muted-foreground">
          আপনার পছন্দের {products.length}টি পণ্য
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-64 mb-4"></div>
              <div className="bg-muted rounded h-4 mb-2"></div>
              <div className="bg-muted rounded h-4 w-3/4"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Card className="p-8 max-w-md mx-auto">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">কোন পছন্দের পণ্য নেই</h2>
            <p className="text-muted-foreground mb-4">
              আপনি এখনো কোন পণ্য পছন্দের তালিকায় যোগ করেননি
            </p>
            <Button asChild>
              <Link to="/">কেনাকাটা শুরু করুন</Link>
            </Button>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}