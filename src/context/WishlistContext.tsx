import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WishlistItem, Product } from '../types';
import { api } from '../services/api';
import { useCart } from './CartContext';

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product | WishlistItem) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useCart();

  const refreshWishlist = useCallback(async () => {
    try {
      const res = await api.getWishlist();
      if (res.wishlist) {
        setWishlist(res.wishlist);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = async (product: Product | WishlistItem) => {
    const pId = 'productId' in product ? product.productId : product.id;
    const isPresent = isInWishlist(pId);

    try {
      if (isPresent) {
        await api.removeFromWishlist(pId);
        setWishlist((prev) => prev.filter((item) => item.productId !== pId));
        showToast({
          title: 'Removed from Wishlist',
          message: `${product.name} removed from your saved items`,
          type: 'info'
        });
      } else {
        await api.addToWishlist(pId);
        await refreshWishlist();
        const img = 'image_url' in product ? product.image_url : product.imageUrl;
        showToast({
          title: 'Saved to Wishlist',
          message: `${product.name} added to your wishlist`,
          type: 'success',
          image: img
        });
      }
    } catch (err: any) {
      showToast({
        title: 'Error updating wishlist',
        message: err.message || 'Could not update wishlist',
        type: 'error'
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        toggleWishlist,
        refreshWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
