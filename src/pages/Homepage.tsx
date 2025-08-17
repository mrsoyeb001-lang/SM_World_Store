import { useState } from 'react';
import { CategorySidebar } from '@/components/layout/CategorySidebar';
import { ProductGrid } from '@/components/product/ProductGrid';
import PopupMessage from '@/components/PopupMessage';

export default function Homepage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  return (
    <>
      <PopupMessage />
      <div className="flex min-h-screen">
        <CategorySidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                আমাদের পণ্য সমূহ
              </h1>
            </div>
            
            <ProductGrid categoryId={selectedCategory || undefined} />
          </div>
        </main>
      </div>
    </>
  );
}