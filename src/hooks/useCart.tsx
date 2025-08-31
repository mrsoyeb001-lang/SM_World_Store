import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/integrations/supabase/types';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  options?: { // নতুন যোগ করা হয়েছে
    color?: string;
    size?: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity: number, options?: { color?: string, size?: string }) => void;
  removeFromCart: (itemId: string, options?: { color?: string, size?: string }) => void;
  updateQuantity: (itemId: string, quantity: number, options?: { color?: string, size?: string }) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from local storage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number, options?: { color?: string, size?: string }) => {
    setCartItems((prevItems) => {
      // Find item in cart based on both product ID and options
      const existingItem = prevItems.find(
        (item) => item.id === product.id &&
        (item.options?.color === options?.color) &&
        (item.options?.size === options?.size)
      );

      if (existingItem) {
        return prevItems.map((item) =>
          (item.id === product.id && (item.options?.color === options?.color) && (item.options?.size === options?.size))
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.sale_price || product.price,
            quantity,
            images: product.images,
            options: options,
          },
        ];
      }
    });
    toast({ title: "সফল!", description: "পণ্য কার্টে যোগ করা হয়েছে" });
  };

  const removeFromCart = (itemId: string, options?: { color?: string, size?: string }) => {
    setCartItems((prevItems) => 
      prevItems.filter(
        (item) => !(item.id === itemId &&
          (item.options?.color === options?.color) &&
          (item.options?.size === options?.size))
      )
    );
    toast({ title: "মুছে ফেলা হয়েছে", description: "পণ্যটি কার্ট থেকে সরানো হয়েছে" });
  };

  const updateQuantity = (itemId: string, quantity: number, options?: { color?: string, size?: string }) => {
    if (quantity <= 0) {
      removeFromCart(itemId, options);
      return;
    }
    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        (item.id === itemId && (item.options?.color === options?.color) && (item.options?.size === options?.size))
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
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
