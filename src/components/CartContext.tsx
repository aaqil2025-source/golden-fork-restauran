'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '@/data/menu';

export interface CartItem {
  item: MenuItem;
  qty: number;
}

interface CartContextType {
  cart: Record<number, CartItem>;
  addToCart: (item: MenuItem) => void;
  changeQty: (id: number, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<number, CartItem>>({});

  const addToCart = (item: MenuItem) => {
    setCart(prev => ({
      ...prev,
      [item.id]: { item, qty: (prev[item.id]?.qty ?? 0) + 1 },
    }));
  };

  const changeQty = (id: number, delta: number) => {
    setCart(prev => {
      const current = prev[id];
      if (!current) return prev;
      const newQty = current.qty + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...current, qty: newQty } };
    });
  };

  const clearCart = () => setCart({});

  const totalItems = Object.values(cart).reduce((s, c) => s + c.qty, 0);
  const totalPrice = Object.values(cart).reduce((s, c) => s + c.item.price * c.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, changeQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
