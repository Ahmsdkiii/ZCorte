"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, ProductColorId, ProductSize } from "@/models/types/product";
import { CartItem } from "@/models/types/cart";
import { buildCartItemId, getProductStock } from "@/models/domain/productRules";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    size: ProductSize | null,
    quantity?: number,
    colorId?: ProductColorId
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "zcorte_cart_v1";
const LEGACY_STORAGE_KEY = "apex_cart_session_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from localStorage on mount with backward-compatible migration
  useEffect(() => {
    try {
      let saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Fallback to legacy key
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          saved = legacy;
          localStorage.setItem(STORAGE_KEY, legacy);
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {}
    setHasLoaded(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!hasLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hasLoaded]);

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback(
    (
      product: Product,
      size: ProductSize | null,
      quantity = 1,
      colorId: ProductColorId = product.colors[0]?.id ?? "graphite"
    ) => {
      const availableStock = getProductStock(product, colorId, size);
      if (availableStock <= 0) {
        return;
      }

      setItems((prev) => {
        const itemId = buildCartItemId(product.id, colorId, size);
        const existing = prev.find((i) => i.id === itemId);

        if (existing) {
          const desiredQty = existing.quantity + quantity;
          const clampedQty = Math.min(desiredQty, availableStock, 10);
          return prev.map((i) => (i.id === itemId ? { ...i, quantity: clampedQty } : i));
        }

        const clampedQty = Math.min(quantity, availableStock, 10);
        return [...prev, { id: itemId, product, colorId, size, quantity: clampedQty }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        const availableStock = getProductStock(i.product, i.colorId, i.size);
        const clampedQty = Math.min(quantity, availableStock, 10);
        return { ...i, quantity: clampedQty };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalCount,
        subtotal,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return context;
}
