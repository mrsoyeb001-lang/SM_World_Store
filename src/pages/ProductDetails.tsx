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
import { useSession } from '@supabase/auth-helpers-react';
import ReactMarkdown from "react-markdown";

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
  const session = useSession();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      await addToCart(product.id);
    }
    
    toast({
      title: "কার্টে যোগ হয়েছে! 🛒",
      description: `${product.name} (${quantity}টি) কার্টে যোগ করা হয়েছে।`,
      duration: 3000,
    });
  };

  const handleBuyNow = async () => {
    if (!product) return;

    // লগইন চেক
    if (!session) {
      toast({
        title: "লগইন প্রয়োজন ⚠️",
        description: "এখনই কিনতে হলে প্রথমে লগইন করুন।",
        duration: 3000,
      });
      window.location.href = '/login';
      return;
    }
    
    await handleAddToCart();
    
    toast({
      title: "অর্ডার সফল! 🎉", 
      description: `${product.name} কার্টে যোগ করা হয়েছে। চেকআউট পেজে যাচ্ছেন...`,
      duration: 3000,
    });
    
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 1000);
  };

  const handleWishlist = async () => {
    if (!product) return;

    if (!session) {
      toast({
        title: "লগইন প্রয়োজন ❤️",
        description: "উইশলিস্টে যোগ করতে হলে লগইন করুন।",
      });
      window.location.href = '/login';
      return;
    }

    const { error } = await supabase
      .from("wishlist")
      .insert({ user_id: session.user.id, product_id: product.id });

    if (error) {
      toast({
        title: "ত্রুটি!",
        description: "উইশলিস্টে যোগ করা যায়নি।",
        variant: "destructive",
      });
    } else {
      toast({
        title: "যোগ হয়েছে ❤️",
        description: `${product.name} উইশলিস্টে যোগ হয়েছে।`,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted animate-pulse rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
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
      {/* Breadcrumb */}
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
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
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
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= product.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.review_count} রিভিউ)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">
                ৳{currentPrice}
              </span>
              {product.sale_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ৳{product.price}
                  </span>
                  <Badge variant="destructive">
                    -{discountPercentage}%
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock_quantity > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  স্টকে আছে ({product.stock_quantity} টি)
                </Badge>
              ) : (
                <Badge variant="destructive">
                  স্টক শেষ
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">পরিমাণ</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                disabled={product.stock_quantity <= 0}
                className="w-full btn-gradient"
                size="lg"
              >
                এখনই কিনুন
              </Button>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity <= 0}
                  variant="outline"
                  className="flex-1"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  কার্টে যোগ করুন
                </Button>
                <Button variant="outline" size="icon" onClick={handleWishlist}>
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">বিবরণ</h3>
            <div className="prose prose-sm text-muted-foreground leading-relaxed">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">আরো দেখুন</h2>
        <ProductGrid categoryId={product.category_id} limit={4} />
      </section>
    </div>
  );
}
