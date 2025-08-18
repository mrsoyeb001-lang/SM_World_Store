import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/product/ProductCard';
import { CategorySidebar } from '@/components/layout/CategorySidebar';

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  images: string[];
  rating: number;
  review_count: number;
  stock_quantity: number;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function Category() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    if (!categoryId) return;
    
    setLoading(true);
    
    // Fetch category info
    const { data: categoryData } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .maybeSingle();
    
    if (categoryData) {
      setCategory(categoryData);
    }
    
    // Fetch products in this category
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (productsData) {
      setProducts(productsData);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CategorySidebar />
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-muted animate-pulse rounded-lg h-80" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <CategorySidebar />
        </div>
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{category?.name || 'ক্যাটাগরি'}</h1>
            {category?.description && (
              <p className="text-muted-foreground mt-2">{category.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {products.length} টি পণ্য পাওয়া গেছে
            </p>
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">এই ক্যাটাগরিতে কোন পণ্য পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}