import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopBrowser } from "@/components/organisms/ShopBrowser";
import { getProducts } from "@/models/services/productService";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/jsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop the ZCorté Collection",
  description:
    "Explore ZCorté equipment and apparel built around readiness, movement, and resilience. Discover technical outerwear, tees, bottoms, and modular gear.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = await getProducts();
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "ZCorté", url: "/" },
    { name: "Shop", url: "/shop" },
  ]);

  return (
    <main id="main" className="w-full flex-1 pb-[55px] md:pb-[110px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="theme-cinematic grid min-h-[460px] grid-cols-1 bg-cinematic-bg px-gutter pt-[calc(var(--header-height)+56px)] pb-14 md:grid-cols-12 md:items-end md:gap-7 md:pt-[calc(var(--header-height)+90px)] md:pb-20">
        <div className="md:col-span-8">
          <p className="eyebrow mb-8 text-cinematic-muted">ZCORTÉ / CATALOG EDIT</p>
          <h1 className="text-[clamp(50px,13vw,78px)] uppercase md:text-[clamp(72px,8.5vw,138px)]">
            EQUIPMENT FOR
            <br />
            THE JOURNEY.
          </h1>
        </div>
        <div className="mt-10 border-t border-[#52595a] pt-6 md:col-span-4 md:mt-0">
          <p className="text-[14px] text-cinematic-muted md:text-[16px]">
            Explore the ZCorté catalog, engineered around quiet form,
            <br className="hidden md:inline" /> small-batch craft, and technical resilience.
          </p>
          <span className="eyebrow mt-8 block text-cinematic-muted">01 — 06 / CORE COLLECTION</span>
          <p className="mt-3 text-[11px] leading-[1.7] tracking-[0.015em] text-cinematic-muted">
            Crafted in Bandung, West Java &middot; High-spec Indonesian technical textile
          </p>
        </div>
      </section>

      <div className="px-gutter pt-8 md:pt-12">
        <Suspense
          fallback={<div className="min-h-[40vh] border-t border-line" aria-hidden="true" />}
        >
          <ShopBrowser initialProducts={products} />
        </Suspense>
      </div>
    </main>
  );
}
