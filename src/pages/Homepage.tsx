import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductGrid from '@/components/product/ProductGrid';
import CategorySidebar from '@/components/layout/CategorySidebar';
import PopupMessage from '@/components/PopupMessage';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category_id: string;
}

export default function Homepage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('is_active', true);
    if (data) setProducts(data);
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <>
      <PopupMessage />
      <div className="flex min-h-screen">
        <CategorySidebar 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                আমাদের পণ্য সমূহ
              </h1>
              {selectedCategory && (
                <p className="text-gray-600">
                  {categories.find(cat => cat.id === selectedCategory)?.name} ক্যাটেগরির পণ্য সমূহ
                </p>
              )}
            </div>
            
            <ProductGrid products={filteredProducts} />
          </div>
        </main>
      </div>
    </>
  );
}
}