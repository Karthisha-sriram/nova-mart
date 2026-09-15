import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartData } from '../types';
import { api } from '../services/api';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
  image?: string;
}

interface CartContextType {
  cart: CartData | null;
  loading: boolean;
  itemCount: number;
  cartAnimated: boolean;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  addToCart: (productId: number, quantity?: number, productName?: string, productImage?: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number, productName?: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartAnimated, setCartAnimated] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  }, [removeToast]);

  const refreshCart = useCallback(async () => {
    try {
      const res = await api.getCart();
      if (res.cart) {
        setCart(res.cart);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const triggerCartBadgeAnimation = () => {
    setCartAnimated(true);
    setTimeout(() => setCartAnimated(false), 600);
  };

  const addToCart = async (
    productId: number,
    quantity: number = 1,
    productName?: string,
    productImage?: string
  ) => {
    try {
      const res = await api.addToCart(productId, quantity);
      if (res.cart) {
        setCart(res.cart);
        triggerCartBadgeAnimation();
        showToast({
          title: 'Added to Cart',
          message: productName ? `${productName} added to your cart` : 'Item successfully added to cart',
          type: 'success',
          image: productImage
        });
      }
    } catch (err: any) {
      showToast({
        title: 'Could not add to cart',
        message: err.message || 'Error updating cart',
        type: 'error'
      });
      throw err;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const res = await api.updateCartItem(itemId, quantity);
      if (res.cart) {
        setCart(res.cart);
        triggerCartBadgeAnimation();
      }
    } catch (err: any) {
      showToast({
        title: 'Stock limit reached',
        message: err.message || 'Unable to update quantity',
        type: 'error'
      });
    }
  };

  const removeFromCart = async (itemId: number, productName?: string) => {
    try {
      const res = await api.removeCartItem(itemId);
      if (res.cart) {
        setCart(res.cart);
        triggerCartBadgeAnimation();
        showToast({
          title: 'Removed from Cart',
          message: productName ? `${productName} was removed` : 'Item removed from your cart',
          type: 'info'
        });
      }
    } catch (err: any) {
      showToast({
        title: 'Error removing item',
        message: err.message || 'Unable to remove item',
        type: 'error'
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount: cart?.itemCount || 0,
        cartAnimated,
        toasts,
        showToast,
        removeToast,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
