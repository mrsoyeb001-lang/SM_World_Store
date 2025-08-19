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
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) console.error('Error fetching product:', error);
    else setProduct(data);

    setLoading(false);
  };

  // ✅ Login Check
  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      toast({
        title: "অনুগ্রহ করে লগইন করুন 🔐",
        description: "এই অ্যাকশনটি করতে হলে লগইন করতে হবে।",
        duration: 2500,
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 800);
      return false;
    }
    return true;
  };

  // ✅ Add to Cart
  const handleAddToCart = async () => {
    if (!product) return;
    const isAuth = await checkAuth();
    if (!isAuth) return;

    for (let i = 0; i < quantity; i++) {
      await addToCart(product.id);
    }

    toast({
      title: "কার্টে যোগ হয়েছে 🛒",
      description: `${product.name} (${quantity}টি) যোগ করা হয়েছে`,
    });
  };

  // ✅ Buy Now
  const handleBuyNow = async () => {
    if (!product) return;
    const isAuth = await checkAuth();
    if (!isAuth) return;

    await handleAddToCart();
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 1000);
  };

  // ✅ Wishlist Handler
  const handleWishlist = async () => {
    const isAuth = await checkAuth();
    if (!isAuth) return;

    const { error } = await supabase.from("wishlist").insert({
      product_id: product?.id,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      toast({
        title: "ইতিমধ্যে ফেভারিটে আছে ❤️",
        duration: 2000,
      });
    } else {
      toast({
        title: "ফেভারিটে যোগ হয়েছে ❤️",
        duration: 2000,
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">লোড হচ্ছে...</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">পণ্য পাওয়া যায়নি</h1>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            হোমে ফিরে যান
          </Link>
        </Button>
      </div>
    );
  }

  const discountPercentage = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const currentPrice = product.sale_price || product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            পেছনে যান
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.images[selectedImage] || '/placeholder.svg'}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 border rounded-lg overflow-hidden ${
                    selectedImage === i ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img src={image} alt={product.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map(star => (
              <Star key={star} className={`h-4 w-4 ${star <= product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-muted-foreground">
              ({product.review_count} রিভিউ)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">৳{currentPrice}</span>
            {product.sale_price && (
              <>
                <span className="text-xl line-through text-gray-400">৳{product.price}</span>
                <Badge variant="destructive">-{discountPercentage}%</Badge>
              </>
            )}
          </div>

          {/* Stock */}
          <div>
            {product.stock_quantity > 0 ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                স্টকে আছে ({product.stock_quantity})
              </Badge>
            ) : (
              <Badge variant="destructive">স্টক শেষ</Badge>
            )}
          </div>

          <Separator />

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <Button onClick={() => setQuantity(Math.max(1, quantity - 1))} variant="outline" size="sm">
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              min={1}
              max={product.stock_quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center"
            />
            <Button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={handleBuyNow} disabled={product.stock_quantity <= 0} className="w-full btn-gradient" size="lg">
              এখনই কিনুন
            </Button>
            <div className="flex gap-3">
              <Button onClick={handleAddToCart} disabled={product.stock_quantity <= 0} variant="outline" className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" /> কার্টে যোগ করুন
              </Button>
              <Button onClick={handleWishlist} variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">বিবরণ</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg shadow-sm">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Related */}
      <section>
        <h2 className="text-2xl font-bold mb-6">আরো দেখুন</h2>
        <ProductGrid categoryId={product.category_id} limit={4} />
      </section>
    </div>
  );
}
