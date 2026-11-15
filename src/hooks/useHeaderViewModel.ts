"use client";

import { useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useCartViewModel } from "@/hooks/useCartViewModel";

export function useHeaderViewModel() {
  const pathname = usePathname();
  const isCommerce = pathname.startsWith("/shop");
  const { totalCount, toggleCart } = useCartViewModel();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openMenu = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeMenu = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handler = () => closeMenu();
    dialog.addEventListener("close", handler);
    return () => dialog.removeEventListener("close", handler);
  }, [closeMenu]);

  return {
    pathname,
    isCommerce,
    totalCount,
    toggleCart,
    dialogRef,
    openMenu,
    closeMenu,
  };
}
