"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms";
import { useHeaderViewModel } from "@/hooks/useHeaderViewModel";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const {
    pathname,
    isCommerce,
    totalCount,
    toggleCart,
    dialogRef,
    isMenuOpen,
    openMenu,
    closeMenu,
    handleDialogBackdropClick,
  } = useHeaderViewModel();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-line bg-surface/95 px-gutter text-ink backdrop-blur-md transition-colors duration-300",
        isCommerce ? "h-[76px]" : "h-[76px] md:h-[88px]"
      )}
    >
      <Link
        href="/"
        aria-label={`${SITE_NAME} home`}
        className={cn(
          "relative font-display font-black leading-none tracking-[-0.06em] [-webkit-text-stroke:1.1px_currentColor]",
          isCommerce ? "text-[30px] md:text-[34px]" : "text-[30px] md:text-[36px]"
        )}
      >
        {SITE_NAME}
      </Link>

      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-5 text-[10px] tracking-[0.06em] md:flex lg:gap-[34px]"
      >
        {NAV_ITEMS.map((link) => {
          const isCurrent = pathname === link.href;
          const hasCollection = "collection" in link && link.collection;
          return (
            <Link
              key={link.href}
              href={link.href}
              {...(hasCollection ? { "data-collection": link.collection } : {})}
              {...(isCurrent ? { "aria-current": "page" } : {})}
              className={cn(
                "border-b border-transparent py-4 transition-all",
                hasCollection
                  ? "hover:border-b-[var(--accent)] hover:shadow-[0_1px_var(--ink)] aria-[current=page]:border-b-[var(--accent)] aria-[current=page]:shadow-[0_1px_var(--ink)]"
                  : "hover:border-b-ink aria-[current=page]:border-b-ink"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3.5 max-[359px]:gap-2 md:gap-[22px]">
        <Link
          href="/shop"
          className={cn(
            "min-h-11 items-center gap-3 border border-control px-3 py-2.5 text-[10px] tracking-[0.06em] transition-colors hover:bg-ink hover:text-surface md:gap-[26px] md:px-4",
            isCommerce ? "hidden md:flex" : "flex"
          )}
        >
          <span>SHOP</span>
          <Icon name="arrow-up-right" size={14} />
        </Link>

        {/* ACCOUNT LINK */}
        <Link
          href="/account"
          aria-label="Account and client portal"
          className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap px-1.5 text-[10px] tracking-[0.08em] transition-opacity hover:opacity-80 md:text-[11px]"
        >
          <Icon name="user" size={15} />
          <span className="hidden sm:inline">ACCOUNT</span>
        </Link>

        <button
          type="button"
          onClick={toggleCart}
          aria-label={`Open bag, ${totalCount} ${totalCount === 1 ? "item" : "items"}`}
          className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap px-1.5 text-[10px] tracking-[0.08em] transition-opacity hover:opacity-80 md:text-[11px]"
        >
          <span>BAG</span>
          <span
            aria-live="polite"
            aria-atomic="true"
            className={cn(
              "inline-flex min-w-[22px] items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold leading-none tracking-normal transition-colors",
              totalCount > 0
                ? "bg-ink text-surface"
                : "border border-line bg-surface-raised text-muted"
            )}
          >
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={openMenu}
          aria-label="Open navigation"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation-dialog"
          className="flex h-11 w-11 items-center justify-center md:hidden"
        >
          <Icon name="menu" size={24} />
        </button>
      </div>

      <dialog
        id="mobile-navigation-dialog"
        ref={dialogRef}
        onClick={handleDialogBackdropClick}
        aria-label="Mobile navigation"
        className="fixed inset-0 z-50 m-0 h-svh max-h-svh w-full max-w-full border-0 bg-surface p-[30px] text-ink backdrop:bg-black/70"
      >
        <div className="mb-[70px] flex items-center justify-between">
          <span className="relative font-display text-[30px] font-black leading-none tracking-[-0.06em] [-webkit-text-stroke:1.1px_currentColor]">
            {SITE_NAME}
            <span className="absolute top-[3px] -right-3 text-[9px] font-bold tracking-normal [-webkit-text-stroke:0px]">
              ®
            </span>
          </span>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation"
            className="flex h-11 w-11 items-center justify-center"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <nav aria-label="Mobile links" className="my-6 mb-11 grid">
          {NAV_ITEMS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              {...("collection" in link && link.collection
                ? { "data-collection": link.collection }
                : {})}
              className="flex items-center gap-[18px] border-b border-line py-[23px] font-display text-[clamp(24px,6vw,40px)] font-bold tracking-[-0.04em] text-ink"
            >
              <span className="font-body text-[10px] font-normal tracking-widest text-muted">
                {link.num}
              </span>
              {link.label}
              <Icon name="arrow-up-right" size={18} className="ml-auto shrink-0" />
            </Link>
          ))}
          {/* Mobile Account Link */}
          <Link
            href="/account"
            onClick={closeMenu}
            className="flex items-center gap-[18px] border-b border-line py-[23px] font-display text-[clamp(24px,6vw,40px)] font-bold tracking-[-0.04em] text-ink"
          >
            <span className="font-body text-[10px] font-normal tracking-widest text-muted">05</span>
            Account / Sign In
            <Icon name="arrow-up-right" size={18} className="ml-auto shrink-0" />
          </Link>
          {/* Mobile Account Link */}
          <Link
            href="/account"
            onClick={closeMenu}
            className="flex items-center gap-[18px] border-b border-line py-[23px] font-display text-[clamp(24px,6vw,40px)] font-bold tracking-[-0.04em] text-ink"
          >
            <span className="font-body text-[10px] font-normal tracking-widest text-muted">05</span>
            Account / Sign In
            <Icon name="arrow-up-right" size={18} className="ml-auto shrink-0" />
          </Link>
        </nav>

        <Link
          href="/shop"
          onClick={closeMenu}
          className="inline-flex min-h-12 items-center justify-between gap-6 border border-button bg-button px-[22px] py-4 text-[10px] font-semibold tracking-[0.07em] text-button-text hover:bg-button-hover"
        >
          <span>SHOP THE SYSTEM</span>
          <Icon name="arrow-up-right" size={17} />
        </Link>
      </dialog>
    </header>
  );
}
