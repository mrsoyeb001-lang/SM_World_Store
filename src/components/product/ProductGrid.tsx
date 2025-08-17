import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { Card } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  images: string[];
  rating: number;
  review_count: number;
  stock_quantity: number;
}

interface ProductGridProps {
  categoryId?: string;
  searchQuery?: string;
  limit?: number;
}

export function ProductGrid({ categoryId, searchQuery, limit }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    if (limit) {
      query = query.limit(limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="p-4">
            <div className="aspect-square bg-muted animate-pulse rounded mb-4" />
            <div className="h-4 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 bg-muted animate-pulse rounded mb-2 w-3/4" />
            <div className="h-6 bg-muted animate-pulse rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">কোন পণ্য পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}