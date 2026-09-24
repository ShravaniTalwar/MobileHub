import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { Cart } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  appliedCoupon: string | null;
  addToCart: (productId: number, quantity?: number, color?: string, storage?: string, ram?: string) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  discountAmount: number;
  finalTotal: number;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  refreshCart: () => Promise<void>;
}

const defaultCart: Cart = {
  items: [],
  subtotal: 0,
  productDiscount: 0,
  couponDiscount: 0,
  estimatedTax: 0,
  shippingFee: 0,
  grandTotal: 0,
  totalItems: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const [cart, setCart] = useState<Cart | null>(defaultCart);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const fetchCart = useCallback(async (coupon?: string | null) => {
    if (!isAuthenticated) {
      setCart(defaultCart);
      return;
    }
    try {
      setIsLoading(true);
      const activeCoupon = coupon !== undefined ? coupon : appliedCoupon;
      const url = activeCoupon ? `/cart?couponCode=${encodeURIComponent(activeCoupon)}` : '/cart';
      const res = await api.get<Cart>(url);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, appliedCoupon]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (
    productId: number,
    quantity: number = 1,
    color?: string,
    storage?: string,
    ram?: string
  ) => {
    if (!isAuthenticated) {
      toastError('Please sign in to add products to your cart');
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.post<Cart>('/cart/items', {
        productId,
        quantity,
        selectedColor: color,
        selectedStorage: storage,
        selectedRam: ram,
      });
      setCart(res.data);
      success('Item added to cart successfully');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      toastError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const res = await api.put<Cart>(`/cart/items/${cartItemId}`, { quantity });
      setCart(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update quantity';
      toastError(msg);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      const res = await api.delete<Cart>(`/cart/items/${cartItemId}`);
      setCart(res.data);
      success('Item removed from cart');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to remove item';
      toastError(msg);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart(defaultCart);
      setAppliedCoupon(null);
    } catch (err: any) {
      toastError('Failed to clear cart');
    }
  };

  const applyCoupon = async (code: string) => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }
    try {
      const subtotal = cart?.subtotal || 0;
      const res = await api.post('/coupons/validate', null, {
        params: { code: code.trim(), orderAmount: subtotal },
      });

      if (res.data.valid) {
        setAppliedCoupon(code.trim().toUpperCase());
        await fetchCart(code.trim().toUpperCase());
        success(`Coupon ${code.toUpperCase()} applied! Saved ₹${res.data.discountAmount}`);
        return { success: true, message: res.data.message };
      } else {
        toastError(res.data.message);
        return { success: false, message: res.data.message };
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      toastError(msg);
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    fetchCart(null);
    success('Coupon removed');
  };

  const itemCount = cart?.totalItems || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isLoading,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        removeItem: removeFromCart,
        discountAmount: cart?.couponDiscount || 0,
        finalTotal: cart?.grandTotal || 0,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
