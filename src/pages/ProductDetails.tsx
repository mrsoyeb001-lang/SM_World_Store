import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ProductGrid } from '@/components/product/ProductGrid';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Minus, 
  Plus,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  images: string[];
  rating: number;
  review_count: number;
  stock_quantity: number;
  category_id: string;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct();
      checkFavorite();
    }
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (!error) setProduct(data);
    setLoading(false);
  };

  // ✅ চেক করবো প্রোডাক্ট ফেভারিট করা আছে কিনা
  const checkFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', id)
      .single();

    setIsFavorite(!!data);
  };

  // ✅ ফেভারিট টগল
  const toggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "দয়া করে লগইন করুন", description: "ফেভারিট করতে লগইন থাকা প্রয়োজন" });
      return;
    }

    if (isFavorite) {
      await supabase.from('favorites').delete()
        .eq('user_id', user.id)
        .eq('product_id', id);
      setIsFavorite(false);
      toast({ title: "ফেভারিট থেকে সরানো হয়েছে" });
    } else {
      await supabase.from('favorites').insert([{ user_id: user.id, product_id: id }]);
      setIsFavorite(true);
      toast({ title: "ফেভারিটে যোগ হয়েছে ❤️" });
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) await addToCart(product.id);

    toast({
      title: "কার্টে যোগ হয়েছে! 🛒",
      description: `${product.name} (${quantity}টি) কার্টে যোগ করা হয়েছে।`,
      duration: 3000,
    });
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await handleAddToCart();
    setTimeout(() => { window.location.href = '/checkout'; }, 500);
  };

  if (loading) return <div className="p-10 text-center">লোড হচ্ছে...</div>;
  if (!product) return <div className="p-10 text-center">পণ্য পাওয়া যায়নি</div>;

  const discountPercentage = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const currentPrice = product.sale_price || product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            পেছনে যান
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.images[selectedImage] || '/placeholder.svg'}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground">
                ({product.review_count} রিভিউ)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">৳{currentPrice}</span>
              {product.sale_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">৳{product.price}</span>
                  <Badge variant="destructive">-{discountPercentage}%</Badge>
                </>
              )}
            </div>

            {/* Stock */}
            {product.stock_quantity > 0 ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                স্টকে আছে ({product.stock_quantity} টি)
              </Badge>
            ) : (
              <Badge variant="destructive">স্টক শেষ</Badge>
            )}
          </div>

          <Separator />

          {/* Quantity */}
          <div>
            <label className="text-sm font-medium mb-2 block">পরিমাণ</label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center"
                min="1"
                max={product.stock_quantity}
              />
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleBuyNow} disabled={product.stock_quantity <= 0} className="w-full btn-gradient" size="lg">
              এখনই কিনুন
            </Button>
            <div className="flex gap-3">
              <Button onClick={handleAddToCart} disabled={product.stock_quantity <= 0} variant="outline" className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                কার্টে যোগ করুন
              </Button>
              <Button onClick={toggleFavorite} variant={isFavorite ? "destructive" : "outline"} size="icon">
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>

          <Separator />

          {/* ✅ Professional Description */}
          <div className="bg-muted/30 p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-3">📖 বিবরণ</h3>
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none leading-relaxed text-muted-foreground">
              {product.description}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <section>
        <h2 className="text-2xl font-bold mb-6">আরো দেখুন</h2>
        <ProductGrid categoryId={product.category_id} limit={4} />
      </section>
    </div>
  );
}
