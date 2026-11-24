"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type React from "react";
import { usePathname } from "next/navigation";
import { useCartViewModel } from "@/hooks/useCartViewModel";

export function useHeaderViewModel() {
  const pathname = usePathname();
  const isCommerce = pathname.startsWith("/shop") || pathname.startsWith("/checkout");
  const { totalCount, toggleCart } = useCartViewModel();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = useCallback(() => {
    dialogRef.current?.showModal();
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    dialogRef.current?.close();
    setIsMenuOpen(false);
  }, []);

  const handleDialogBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === dialogRef.current) {
        closeMenu();
      }
    },
    [closeMenu]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleNativeClose = () => setIsMenuOpen(false);
    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, []);

  return {
    pathname,
    isCommerce,
    totalCount,
    toggleCart,
    dialogRef,
    isMenuOpen,
    openMenu,
    closeMenu,
    handleDialogBackdropClick,
  };
}
