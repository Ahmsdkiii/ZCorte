import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { CinemaStoryPinned } from "@/components/compound/CinemaStory";
import { HomeBrandStorySection } from "@/components/organisms/HomeBrandStorySection";
import { HomeCollectionsSection } from "@/components/organisms/HomeCollectionsSection";
import { HomeHeroSection } from "@/components/organisms/HomeHeroSection";
import { ProductGridClient } from "@/components/organisms/ProductGridClient";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/jsonLd";
import { getProducts } from "@/models/services/productService";
import { getStorySteps } from "@/models/services/storyService";

const ACTION_LINK =
  "group inline-flex min-h-12 items-center justify-between gap-[18px] md:gap-[25px] border-b border-control py-3.5 text-[9px] md:text-[10px] font-semibold tracking-[0.07em] transition-colors";

export default async function HomePage() {
  const [products, storySteps] = await Promise.all([
    getProducts({ featured: true }),
    getStorySteps(),
  ]);
  const structuredData = [generateOrganizationSchema(), generateWebsiteSchema()];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main id="main" className="w-full flex-1">
        <HomeHeroSection />
        <HomeBrandStorySection />
        <CinemaStoryPinned steps={storySteps} />
        <HomeCollectionsSection />

        {/* SECTION 5: FEATURED ARRIVALS */}
        <section className="border-t border-line bg-surface px-gutter py-[76px] md:py-[110px]">
          <div className="mb-7 flex items-center justify-between gap-5 md:mb-[38px]">
            <p className="eyebrow text-[8px] md:text-[10px]">
              03 / THE ZCORTÉ SYSTEM — FEATURED ARRIVALS
            </p>
            <Link className={ACTION_LINK} href="/shop">
              <span>SHOP ALL</span>
              <Icon
                name="arrow-up-right"
                size={14}
                className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
          <h2 className="mb-5 text-[clamp(38px,5.5vw,88px)]">
            EQUIP YOUR
            <br />
            <span className="text-muted">NEXT MOVE.</span>
          </h2>
          <p className="mb-[35px] text-[11px] leading-[1.7] tracking-[0.015em] text-muted">
            Curated silhouettes &middot; Technical fabrics &middot; Built for daily movement
          </p>

          {products.length > 0 ? (
            <ProductGridClient products={products} />
          ) : (
            <div className="flex flex-col items-start justify-between gap-6 border border-line bg-surface-raised p-8 md:flex-row md:items-center md:p-12">
              <div>
                <p className="eyebrow text-muted">CATALOG UPDATE</p>
                <p className="mt-2 font-display text-[22px] font-bold tracking-[-0.03em]">
                  NO FEATURED RELEASES AVAILABLE AT THIS MOMENT.
                </p>
                <p className="mt-1 text-[13px] text-muted">
                  Explore the full ZCorté system catalog to view all active essentials and layers.
                </p>
              </div>
              <Link className={ACTION_LINK} href="/shop">
                <span>BROWSE FULL CATALOG</span>
                <Icon name="arrow-up-right" size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* SECTION 6: CLOSING */}
        <section className="theme-cinematic relative flex min-h-[600px] items-center px-gutter py-[75px] md:min-h-[650px] md:py-[100px]">
          <div className="absolute inset-0 overflow-hidden bg-cinematic-raised">
            <Image
              src="/images/apex/closing.jpeg"
              alt="A winding trail disappears into mist across volcanic highlands."
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#0008,#0001),linear-gradient(#0000_20%,#0009)] md:bg-[linear-gradient(90deg,#05070785,#0000_85%),linear-gradient(#05070755,#0000_35%,#050707b5)]" />
          <div className="relative w-full">
            <p className="eyebrow">YOUR EXPRESSION. YOUR DIRECTION.</p>
            <h2 className="my-[30px] max-w-[1100px] text-[54px] md:text-[clamp(46px,6.7vw,110px)]">
              THE NEXT MOVE
              <br />
              IS YOURS.
            </h2>
            <p className="text-[15px] text-[#d2d5d2]">Find the expression that moves with you.</p>
            <div className="mt-[25px] flex flex-col items-start gap-2.5 md:mt-8 md:flex-row md:gap-[42px]">
              <Link className={ACTION_LINK} href="/collections/tactix">
                <span>EXPLORE TACTIX</span>
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link className={ACTION_LINK} href="/collections/apextive">
                <span>EXPLORE APEXTIVE</span>
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link className={ACTION_LINK} href="/collections/outdoor">
                <span>EXPLORE OUTDOOR</span>
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
