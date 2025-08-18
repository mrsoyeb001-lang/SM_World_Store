import { ProductGrid } from '@/components/product/ProductGrid';
import { CategorySidebar } from '@/components/layout/CategorySidebar';

export default function Products() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">সকল পণ্য</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <CategorySidebar />
        </div>
        
        <div className="lg:col-span-3">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}