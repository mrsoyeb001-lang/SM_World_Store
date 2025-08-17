import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    sale_price?: number;
    images: string[];
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        product:products(id, name, price, sale_price, images)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      toast({
        title: "লগইন প্রয়োজন",
        description: "কার্টে পণ্য যোগ করতে লগইন করুন",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await supabase
      .from('cart')
      .upsert({
        user_id: user.id,
        product_id: productId,
        quantity
      }, {
        onConflict: 'user_id,product_id'
      });

    if (error) {
      toast({
        title: "ত্রুটি",
        description: "কার্টে পণ্য যোগ করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    } else {
      toast({
        title: "সফল",
        description: "পণ্য কার্টে যোগ করা হয়েছে"
      });
      fetchCartItems();
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      toast({
        title: "ত্রুটি",
        description: "কার্ট থেকে পণ্য সরাতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    } else {
      fetchCartItems();
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const { error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      toast({
        title: "ত্রুটি",
        description: "পরিমাণ আপডেট করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    } else {
      fetchCartItems();
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart:', error);
    } else {
      setItems([]);
    }
  };

  const total = items.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}