import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { FavoriteButton } from '@/components/favorites/FavoriteButton';

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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const discountPercentage = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  return (
    <Card className="group relative overflow-hidden card-hover">
      <Link to={`/product/${product.id}`}>
        {/* Product Image */}
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <FavoriteButton productId={product.id} />
          </div>
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
              -{discountPercentage}%
            </Badge>
          )}
          {product.stock_quantity <= 0 && (
            <Badge className="absolute bottom-2 left-2 bg-muted text-muted-foreground">
              স্টক শেষ
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= product.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.review_count})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">
              ৳{product.sale_price || product.price}
            </span>
            {product.sale_price && (
              <span className="text-sm text-muted-foreground line-through">
                ৳{product.price}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
              className="flex-1 btn-gradient"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              কার্টে যোগ করুন
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}