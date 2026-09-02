'use client';

import React, { createContext, useContext, useState, useSyncExternalStore, useCallback } from 'react';
import { Product, CartItem, OrderVerificationResponse, CurrencyCode } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotalUSD: number;
  subtotalNGN: number;
  subtotalKES: number;

  // UI states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  completedOrder: OrderVerificationResponse | null;
  setCompletedOrder: (order: OrderVerificationResponse | null) => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (usd: number, ngn: number, kes: number) => string;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// External store subscription for localStorage
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

let cachedCartString: string | null = null;
let cachedCart: CartItem[] = [];

function getCartSnapshot(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('maison_cart');
    if (raw !== cachedCartString) {
      cachedCartString = raw;
      cachedCart = raw ? JSON.parse(raw) : [];
    }
    return cachedCart;
  } catch {
    return [];
  }
}

const emptySnapshot: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return emptySnapshot;
}

function subscribeToCart(callback: () => void) {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

function writeCartToStorage(items: CartItem[]) {
  try {
    const raw = JSON.stringify(items);
    localStorage.setItem('maison_cart', raw);
    cachedCartString = raw;
    cachedCart = items;
    emitChange();
  } catch (e) {
    console.error('Error writing cart to localStorage', e);
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerSnapshot);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderVerificationResponse | null>(null);
  // KES is the primary currency (Paystack account default)
  const [currency, setCurrency] = useState<CurrencyCode>('KES');

  const addToCart = useCallback((product: Product, selectedSize?: string) => {
    const current = getCartSnapshot();
    const existing = current.find(item => item.product.id === product.id);
    let next: CartItem[];
    if (existing) {
      next = current.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1, selectedSize: selectedSize || item.selectedSize }
          : item
      );
    } else {
      next = [...current, { product, quantity: 1, selectedSize }];
    }
    writeCartToStorage(next);
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    const current = getCartSnapshot();
    const next = current.filter(item => item.product.id !== productId);
    writeCartToStorage(next);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const current = getCartSnapshot();
    if (quantity <= 0) {
      writeCartToStorage(current.filter(item => item.product.id !== productId));
      return;
    }
    const next = current.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    writeCartToStorage(next);
  }, []);

  const clearCart = useCallback(() => {
    writeCartToStorage([]);
  }, []);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalUSD = cart.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);
  const subtotalNGN = cart.reduce((sum, item) => sum + item.product.priceNGN * item.quantity, 0);
  const subtotalKES = cart.reduce((sum, item) => sum + item.product.priceKES * item.quantity, 0);

  const getSubtotal = useCallback(() => {
    if (currency === 'KES') return subtotalKES;
    if (currency === 'NGN') return subtotalNGN;
    return subtotalUSD;
  }, [currency, subtotalKES, subtotalNGN, subtotalUSD]);

  const formatPrice = useCallback((usd: number, ngn: number, kes: number) => {
    if (currency === 'KES') return `KES ${kes.toLocaleString()}`;
    if (currency === 'NGN') return `₦${ngn.toLocaleString()}`;
    return `$${usd.toLocaleString()}`;
  }, [currency]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotalUSD,
        subtotalNGN,
        subtotalKES,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        completedOrder,
        setCompletedOrder,
        currency,
        setCurrency,
        formatPrice,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
