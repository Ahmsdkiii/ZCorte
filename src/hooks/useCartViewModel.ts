"use client";

import { useCart } from "@/components/providers/CartProvider";

export function useCartViewModel() {
  const cart = useCart();

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
  };
}
