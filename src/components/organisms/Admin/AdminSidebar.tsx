"use client";

import { useEffect } from "react";
import type { FC } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import type { AdminOwnerDTO } from "@/models/types/admin";
import type { AdminTab } from "@/hooks/useAdminViewModel";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  owner: AdminOwnerDTO;
  pendingOrdersCount: number;
  lowStockCount: number;
  totalProductsCount: number;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

function getInitials(name: string): string {
  const [first, second] = name.trim().split(/\s+/).filter(Boolean);
  if (!first) return "ZO";
  if (!second) return first.slice(0, 2).toUpperCase();
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
}

export const AdminSidebar: FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  owner,
  pendingOrdersCount,
  lowStockCount,
  totalProductsCount,
  isOpen,
  onClose,
  onLogout,
  isLoggingOut,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const navItems: ReadonlyArray<{
    id: AdminTab;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: string;
    badgeTone?: "default" | "alert";
  }> = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} pending` : undefined,
      badgeTone: pendingOrdersCount > 0 ? "alert" : "default",
    },
    {
      id: "products",
      label: "Products & Stock",
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : String(totalProductsCount),
      badgeTone: lowStockCount > 0 ? "alert" : "default",
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-cinematic-bg text-cinematic-text">
      {/* BRAND HEADER */}
      <div className="flex h-16 items-center justify-between border-b border-cinematic-border px-6">
        <Link href="/admin" onClick={() => onSelectTab("overview")} className="group block">
          <span className="block font-display text-xl font-bold tracking-[-0.04em] text-cinematic-text">
            ZCORTÉ
          </span>
          <span className="block text-[9px] font-medium tracking-[0.2em] uppercase text-cinematic-muted/70">
            Owner Studio
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="p-1.5 text-cinematic-muted hover:text-cinematic-text lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav aria-label="Admin workspace navigation" className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-8">
          <div>
            <p className="mb-3 px-2 text-[9px] font-semibold tracking-[0.18em] uppercase text-cinematic-muted/60">
              Workspace
            </p>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const NavIcon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex w-full items-center justify-between border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                        isActive
                          ? "border-cinematic-text/30 bg-cinematic-raised text-cinematic-text"
                          : "border-transparent text-cinematic-muted hover:bg-cinematic-raised/50 hover:text-cinematic-text"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <NavIcon
                          size={15}
                          className={isActive ? "text-cinematic-text" : "text-cinematic-muted/80"}
                        />
                        <span className="tracking-[0.04em]">{item.label}</span>
                      </span>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase ${
                            item.badgeTone === "alert"
                              ? "border border-amber-400/40 bg-amber-500/15 text-amber-200"
                              : "bg-cinematic-border/60 text-cinematic-muted"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="mb-3 px-2 text-[9px] font-semibold tracking-[0.18em] uppercase text-cinematic-muted/60">
              Storefront
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="flex items-center justify-between border border-transparent px-3 py-2 text-xs text-cinematic-muted transition-colors hover:bg-cinematic-raised/50 hover:text-cinematic-text"
                >
                  <span className="flex items-center gap-3">
                    <Store size={15} className="text-cinematic-muted/80" />
                    <span>Live Storefront</span>
                  </span>
                  <ArrowUpRight size={13} className="text-cinematic-muted/60" />
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="flex items-center justify-between border border-transparent px-3 py-2 text-xs text-cinematic-muted transition-colors hover:bg-cinematic-raised/50 hover:text-cinematic-text"
                >
                  <span className="flex items-center gap-3">
                    <Package size={15} className="text-cinematic-muted/80" />
                    <span>Public Catalog</span>
                  </span>
                  <ArrowUpRight size={13} className="text-cinematic-muted/60" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* OWNER PROFILE FOOTER */}
      <div className="border-t border-cinematic-border p-4">
        <div className="mb-3 flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-cinematic-border bg-cinematic-raised font-display text-xs font-bold tracking-wider text-cinematic-text">
            {getInitials(owner.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-cinematic-text">{owner.name}</p>
            <p className="truncate text-[10px] text-cinematic-muted/80">{owner.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-center gap-2 border border-cinematic-border bg-cinematic-raised/70 px-3 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-cinematic-text transition-colors hover:border-cinematic-text/50 hover:bg-cinematic-raised disabled:opacity-50"
        >
          <LogOut size={13} />
          <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP FIXED SIDEBAR */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 lg:border-r lg:border-cinematic-border">
        {sidebarContent}
      </aside>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation menu"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative z-10 w-72 max-w-[85vw] border-r border-cinematic-border shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
