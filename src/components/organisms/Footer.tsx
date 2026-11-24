import React from "react";
import Link from "next/link";
import {
  FOOTER_NAV_ITEMS,
  SITE_CONCEPT_DISCLAIMER,
  SITE_COPYRIGHT,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="theme-cinematic border-t border-cinematic-border bg-cinematic-bg text-cinematic-text">
      <div className="grid md:min-h-[480px] md:grid-cols-[0.34fr_0.66fr]">
        <div className="order-2 flex flex-col justify-between border-t border-cinematic-border px-gutter py-10 md:order-1 md:border-t-0 md:border-r md:py-16">
          <nav
            aria-label="Footer navigation"
            className="grid border-t border-cinematic-border text-[10px] tracking-[0.1em]"
          >
            {FOOTER_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-15 items-center justify-between border-b border-cinematic-border transition-colors hover:text-cinematic-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="mt-12 text-[10px] tracking-[0.12em] text-cinematic-muted">{SITE_TAGLINE}</p>
        </div>

        <div className="order-1 flex min-h-[280px] flex-col justify-between overflow-hidden px-gutter pt-14 pb-10 md:order-2 md:min-h-0 md:px-10 md:pt-16 md:pb-14 lg:px-16">
          <Link
            href="/"
            aria-label={`${SITE_NAME} home`}
            className="block font-display text-[clamp(72px,15vw,260px)] font-black leading-[0.78] tracking-[-0.08em]"
          >
            {SITE_NAME}
          </Link>
          <a
            href="#main"
            className="flex min-h-11 items-end self-end text-[9px] tracking-[0.1em] hover:text-cinematic-muted"
          >
            BACK TO TOP &uarr;
          </a>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-4 border-t border-cinematic-border px-gutter py-5 text-[8px] tracking-[0.05em] text-cinematic-muted md:text-[9px]">
        <span>{SITE_COPYRIGHT}</span>
        <p className="order-3 w-full md:order-none md:w-auto">{SITE_CONCEPT_DISCLAIMER}</p>
      </div>
    </footer>
  );
}
