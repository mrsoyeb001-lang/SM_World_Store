import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setFavorites(data.map(item => item.product_id));
    }
    setLoading(false);
  };

  const addToFavorites = async (productId: string) => {
    if (!user) {
      toast({
        title: "লগইন প্রয়োজন",
        description: "পছন্দের তালিকায় যোগ করতে লগইন করুন।",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }

      setFavorites(prev => [...prev, productId]);
      toast({
        title: "পছন্দের তালিকায় যোগ হয়েছে",
        description: "পণ্যটি আপনার পছন্দের তালিকায় যোগ করা হয়েছে।"
      });
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "পছন্দের তালিকায় যোগ করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setFavorites(prev => prev.filter(id => id !== productId));
      toast({
        title: "পছন্দের তালিকা থেকে সরানো হয়েছে",
        description: "পণ্যটি আপনার পছন্দের তালিকা থেকে সরানো হয়েছে।"
      });
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: "পছন্দের তালিকা থেকে সরাতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}