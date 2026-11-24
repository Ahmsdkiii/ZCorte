"use client";

import { useCallback } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { CartItem } from "@/models/types/cart";
import { getProductStock } from "@/models/domain/productRules";

export function useCartViewModel() {
  const cart = useCart();

  const getItemMaxStock = useCallback((item: CartItem): number => {
    return getProductStock(item.product, item.colorId, item.size);
  }, []);

  const canIncreaseQuantity = useCallback(
    (item: CartItem): boolean => {
      const maxStock = getItemMaxStock(item);
      return item.quantity < maxStock && item.quantity < 10;
    },
    [getItemMaxStock]
  );

  return {
    items: cart.items,
    isOpen: cart.isOpen,
    totalCount: cart.totalCount,
    subtotal: cart.subtotal,
    openCart: cart.openCart,
    closeCart: cart.closeCart,
    toggleCart: cart.toggleCart,
    addItem: cart.addItem,
    removeItem: cart.removeItem,
    updateQuantity: cart.updateQuantity,
    clearCart: cart.clearCart,
    getItemMaxStock,
    canIncreaseQuantity,
  };
}
