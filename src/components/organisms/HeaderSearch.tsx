"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Search, X } from "lucide-react";
import type { ProductSearchResultDTO } from "@/models/types/search";
import { formatIDR } from "@/lib/utils";

interface HeaderSearchProps {
  onSelectResult?: () => void;
  className?: string;
  isMobile?: boolean;
}

export function HeaderSearch({
  onSelectResult,
  className = "",
  isMobile = false,
}: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSearchResultDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = (await res.json()) as { results: ProductSearchResultDTO[] };
          setResults(data.results || []);
          setIsOpen(true);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      setIsOpen(false);
      onSelectResult?.();
      startTransition(() => {
        router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      });
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-muted">
          {isLoading || isSearching ? (
            <Loader2 size={13} className="animate-spin text-ink" />
          ) : (
            <Search size={13} />
          )}
        </span>
        <input
          type="search"
          aria-label="Search garments and equipment"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full border border-line bg-surface py-2 pr-8 pl-8 text-xs text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none ${
            isMobile ? "text-sm" : "md:w-56 lg:w-64"
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2.5 text-muted hover:text-ink"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* AUTOCOMPLETE DROPDOWN */}
      {isOpen && query.trim().length >= 2 && (
        <div
          className={`absolute left-0 z-50 mt-1 border border-line bg-surface-raised shadow-xl ${
            isMobile ? "w-full" : "w-72 lg:w-80"
          }`}
        >
          {results.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-xs text-muted">
              <p>No products matching &ldquo;{query}&rdquo;.</p>
              <Link
                href="/shop"
                onClick={() => {
                  setIsOpen(false);
                  onSelectResult?.();
                }}
                className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wider text-ink underline"
              >
                Browse All Catalog
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-line">
              <div className="max-h-80 overflow-y-auto">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      onSelectResult?.();
                    }}
                    className="flex items-center gap-3 p-3 transition-colors hover:bg-surface"
                  >
                    <div className="relative h-11 w-9 shrink-0 overflow-hidden border border-line bg-surface">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold uppercase text-ink">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-muted">
                        {product.collectionName} · {product.categoryName}
                      </p>
                      <p className="tabular-nums text-xs font-medium text-ink">
                        {formatIDR(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onSelectResult?.();
                  router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
                }}
                className="flex w-full items-center justify-between bg-surface px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-surface-raised"
              >
                <span>View all results for &ldquo;{query}&rdquo;</span>
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
