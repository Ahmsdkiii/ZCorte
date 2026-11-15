import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="theme-cinematic border-t border-[#383a3e] bg-cinematic-bg text-cinematic-text">
      <div className="grid md:min-h-[480px] md:grid-cols-[0.34fr_0.66fr]">
        <div className="order-2 flex flex-col justify-between border-t border-[#383a3e] px-gutter py-10 md:order-1 md:border-t-0 md:border-r md:py-16">
          <nav
            aria-label="Footer navigation"
            className="grid border-t border-[#383a3e] text-[10px] tracking-[0.1em]"
          >
            <Link
              href="/shop"
              className="flex min-h-15 items-center justify-between border-b border-[#383a3e] transition-colors hover:text-cinematic-muted"
            >
              SHOP ALL
            </Link>
            <Link
              href="/collections/tactix"
              className="flex min-h-15 items-center justify-between border-b border-[#383a3e] transition-colors hover:text-cinematic-muted"
            >
              TACTIX
            </Link>
            <Link
              href="/collections/apextive"
              className="flex min-h-15 items-center justify-between border-b border-[#383a3e] transition-colors hover:text-cinematic-muted"
            >
              APEXTIVE
            </Link>
            <Link
              href="/collections/outdoor"
              className="flex min-h-15 items-center justify-between border-b border-[#383a3e] transition-colors hover:text-cinematic-muted"
            >
              OUTDOOR
            </Link>
          </nav>
          <p className="mt-12 text-[10px] tracking-[0.12em] text-cinematic-muted">
            HERE, THE JOURNEY BEGINS.
          </p>
        </div>

        <div className="order-1 flex min-h-[280px] flex-col justify-between overflow-hidden px-gutter pt-14 pb-10 md:order-2 md:min-h-0 md:px-10 md:pt-16 md:pb-14 lg:px-16">
          <Link
            href="/"
            aria-label="APEX home"
            className="block font-display text-[clamp(86px,18vw,310px)] font-black leading-[0.72] tracking-[-0.08em]"
          >
            APEX
          </Link>
          <a
            href="#main"
            className="flex min-h-11 items-end self-end text-[9px] tracking-[0.1em] hover:text-cinematic-muted"
          >
            BACK TO TOP &uarr;
          </a>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-4 border-t border-[#383a3e] px-gutter py-5 text-[8px] tracking-[0.05em] text-cinematic-muted md:text-[9px]">
        <span>&copy; 2026 APEX</span>
        <p className="order-3 w-full md:order-none md:w-auto">
          Concept imagery — not official APEX product photography.
        </p>
      </div>
    </footer>
  );
}
