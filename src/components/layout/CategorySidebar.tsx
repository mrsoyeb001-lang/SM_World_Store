import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">ক্যাটাগরিসমূহ</h3>
      <div className="space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-between text-left h-auto p-3"
          asChild
        >
          <Link to="/">
            <span>সব পণ্য</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="w-full justify-between text-left h-auto p-3"
            asChild
          >
            <Link to={`/category/${category.id}`}>
              <span>{category.name}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        ))}
      </div>
    </Card>
  );
}