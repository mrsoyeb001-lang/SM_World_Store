import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">সার্চ ফলাফল</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {searchQuery ? (
          <div>
            <p className="text-muted-foreground mb-6">
              "{searchQuery}" এর জন্য সার্চ ফলাফল
            </p>
            <ProductGrid searchQuery={searchQuery} />
          </div>
        ) : (
          <div className="text-center py-8">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">কোন পণ্য খুঁজতে উপরের সার্চ বক্স ব্যবহার করুন</p>
          </div>
        )}
      </div>
    </div>
  );
}