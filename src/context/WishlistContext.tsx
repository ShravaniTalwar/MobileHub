import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      const res = await api.get<Product[]>('/wishlist');
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback((productId: number) => {
    return wishlist.some((item) => item.id === productId);
  }, [wishlist]);

  const toggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      toastError('Please sign in to save items to your wishlist');
      return;
    }
    const exists = isInWishlist(product.id);
    try {
      if (exists) {
        await api.delete(`/wishlist/${product.id}`);
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        success(`Removed ${product.name} from wishlist`);
      } else {
        await api.post(`/wishlist/${product.id}`);
        setWishlist((prev) => [...prev, product]);
        success(`Added ${product.name} to wishlist`);
      }
    } catch (err: any) {
      toastError('Could not update wishlist');
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      success('Item removed from wishlist');
    } catch (err: any) {
      toastError('Failed to remove from wishlist');
    }
  };

  const clearWishlist = async () => {
    try {
      await api.delete('/wishlist');
      setWishlist([]);
      success('Wishlist cleared');
    } catch (err: any) {
      toastError('Failed to clear wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
