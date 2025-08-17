import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function FavoriteButton({ productId, className, size = 'default' }: FavoriteButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      className={cn(
        "p-2 rounded-full hover:bg-background/80",
        className
      )}
      aria-label={isFavorite(productId) ? "পছন্দের তালিকা থেকে সরান" : "পছন্দের তালিকায় যোগ করুন"}
    >
      <Heart 
        className={cn(
          "w-5 h-5 transition-colors",
          isFavorite(productId) 
            ? "fill-red-500 text-red-500" 
            : "text-muted-foreground hover:text-red-500"
        )}
      />
    </Button>
  );
}