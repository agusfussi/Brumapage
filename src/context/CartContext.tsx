"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; imageUrl?: string | null; stock: number }, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "bruma_shopping_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading cart from localStorage:", e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Error saving cart to localStorage:", e);
      }
    }
  }, [items, isHydrated]);

  const addToCart = (product: { id: string; name: string; price: number; imageUrl?: string | null; stock: number }, quantity = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock || 99);
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: Math.min(quantity, product.stock || 99),
          stock: product.stock,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const validQty = Math.min(quantity, item.stock || 99);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
