import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CinemaStoryPinned } from "@/components/compound/CinemaStory";
import { ProductGridClient } from "@/components/organisms/ProductGridClient";
import { getProducts } from "@/models/services/productService";
import { mockCollections } from "@/models/data/collections.mock";
import { mockTactixStorySteps } from "@/models/data/stories.mock";
import { Icon } from "@/components/atoms/Icon";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/jsonLd";

const ACTION_LINK =
  "group inline-flex min-h-12 items-center justify-between gap-[18px] md:gap-[25px] border-b border-control py-3.5 text-[9px] md:text-[10px] font-semibold tracking-[0.07em] transition-colors";
const ACTION_PRIMARY =
  "group inline-flex min-h-12 items-center justify-between gap-[18px] md:gap-[25px] border border-button bg-button px-[17px] py-3.5 md:px-[22px] md:py-4 text-[9px] md:text-[10px] font-semibold tracking-[0.07em] text-button-text transition-colors hover:bg-button-hover";

export const metadata: Metadata = buildPageMetadata({
  title: "APEX TACTIX",
  description:
    "Readiness and modern utility for daily, training, and operational contexts. Purposeful articulation and modular carry systems.",
  path: "/collections/tactix",
  image: "/images/apex/campaign-tactix-0.jpeg",
});

export default async function TactixCollectionPage() {
  const collection = mockCollections.tactix;
  const products = await getProducts({ collection: "tactix" });
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "APEX", url: "/" },
    { name: "TACTIX", url: "/collections/tactix" },
  ]);

  return (
    <main id="main" data-collection="tactix" className="w-full flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* SECTION 1: FULL-BLEED DARK CINEMATIC HERO */}
      <section
        data-world="tactix"
        className="theme-cinematic relative flex h-svh min-h-[740px] flex-col justify-center overflow-clip bg-cinematic-bg text-cinematic-text max-md:max-h-[1100px] md:min-h-[720px] lg:min-h-[760px]"
      >
        <div className="absolute inset-0 overflow-hidden bg-cinematic-raised">
          <Image
            src={collection.heroImage}
            alt="Utility clothing in a concrete passage."
            fill
            priority
            sizes="(max-width: 767px) 180vh, 100vw"
            style={{ objectPosition: "85% center" }}
            className="object-cover"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,10,12,0.5)_0%,rgba(9,10,12,0.34)_45%,rgba(9,10,12,0.88)_100%),linear-gradient(90deg,rgba(9,10,12,0.86)_0%,rgba(9,10,12,0.48)_55%,rgba(9,10,12,0.12)_100%)]" />

        <div className="absolute inset-x-gutter top-[102px] flex justify-between text-[8px] tracking-[0.15em] text-cinematic-muted md:top-[124px] md:text-[9px]">
          <span>APEX / TACTIX</span>
          <span className="hidden md:inline">01 / THREE EXPRESSIONS</span>
        </div>

        <div className="relative mt-[45px] w-full px-gutter pt-[90px] pb-[60px] md:mt-20 md:pt-[100px] md:pb-[30px] 3xl:mt-[120px]">
          <p className="eyebrow mb-6 flex items-center text-[8px] tracking-[0.12em] text-cinematic-muted before:mr-2.5 before:inline-block before:h-[7px] before:w-[7px] before:bg-[var(--accent)] md:text-[10px] md:tracking-[0.14em]">
            READINESS / UTILITY
          </p>
          <h1 className="max-w-[900px] text-[clamp(53px,13vw,90px)] text-cinematic-text max-md:tracking-[-0.06em] md:text-[clamp(64px,10vw,110px)] lg:text-[clamp(58px,8.7vw,145px)]">
            READY BY DESIGN.
          </h1>
          <div className="mt-7 flex flex-col items-start justify-between gap-[25px] md:mt-[38px] md:gap-7 lg:flex-row lg:items-end lg:gap-[35px] 3xl:mt-[50px]">
            <p className="max-w-[300px] text-[13px] text-cinematic-muted md:max-w-[370px] md:text-[14px]">
              Utility, preparation, and function for the demands of everyday life.
            </p>
            <div className="flex flex-wrap items-start gap-x-5 gap-y-3 md:items-center md:gap-[26px]">
              <a
                className={`${ACTION_PRIMARY} border-cinematic-text bg-cinematic-text text-cinematic-bg hover:bg-cinematic-muted`}
                href="#introduction"
              >
                <span>EXPLORE TACTIX</span>
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <Link
                className={`${ACTION_LINK} border-cinematic-muted bg-black/35 px-4 text-cinematic-text backdrop-blur-xs hover:bg-black/55`}
                href="/shop?collection=tactix"
              >
                <span>SHOP TACTIX</span>
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-gutter bottom-6 flex justify-between border-t border-white/20 pt-4 text-[8px] tracking-[0.12em] text-cinematic-muted md:bottom-[30px] md:text-[9px]">
          <a href="#introduction" className="flex items-center gap-3 hover:text-white">
            <Icon name="arrow-down" size={14} className="animate-scroll-cue" /> SCROLL TO DISCOVER
          </a>
          <span className="hidden md:inline">01 / TACTIX</span>
        </div>
      </section>

      {/* SECTION 2: THE PREMISE (#introduction) */}
      <section
        id="introduction"
        className="relative grid grid-cols-1 items-center gap-10 bg-surface px-gutter py-[76px] md:grid-cols-2 md:gap-12 md:py-[120px] lg:gap-x-[8vw]"
      >
        <div>
          <p className="eyebrow">01 / THE PREMISE</p>
          <h2 className="my-8 text-[clamp(38px,11.5vw,54px)] md:text-[clamp(38px,5.5vw,88px)]">
            FUNCTION WITH PURPOSE.
          </h2>
          <p className="max-w-[510px] text-[clamp(17px,1.5vw,22px)]">
            Readiness starts with paying attention. To the day ahead. To what you carry. To the
            moments when a small detail takes on a bigger role. TACTIX brings a considered approach
            to everyday utility.
          </p>
        </div>
        <figure className="flex flex-col">
          <div className="relative h-[440px] w-full overflow-hidden bg-surface-raised md:h-[520px] lg:h-[600px] 3xl:h-[700px]">
            <Image
              src="/images/apex/tactix-context.webp"
              alt="A person accessing a crossbody bag in a concrete setting."
              fill
              sizes="(max-width: 767px) 100vw, 48vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3.5 text-[8px] tracking-[0.12em] text-muted md:text-[9px]">
            APEX / TACTIX &mdash; A STUDY IN CONTEXT
          </figcaption>
        </figure>
      </section>

      {/* SECTION 3: PINNED CINEMATIC STORY */}
      <CinemaStoryPinned
        id="tactix-cinema"
        eyebrow="TACTIX IN CONTEXT"
        title="PURPOSE IN EVERY DETAIL."
        skipTarget="#collection-details"
        steps={mockTactixStorySteps}
        collectionId="tactix"
      />

      {/* SECTION 4: A CLOSER LOOK (#collection-details) — BALANCED 2-COLUMN GRID */}
      <section
        id="collection-details"
        className="border-t border-line bg-surface-raised px-gutter py-[76px] md:py-[120px]"
      >
        <div className="mb-7 flex items-center justify-between md:mb-[38px]">
          <p className="eyebrow">03 / A CLOSER LOOK</p>
          <p className="eyebrow hidden md:inline">CONCEPT STUDIES</p>
        </div>
        <h2 className="mb-[35px] max-w-[850px] text-[clamp(38px,5.5vw,88px)] md:mb-[55px]">
          THE DETAILS HAVE A ROLE.
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          <figure className="flex flex-col">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
              <Image
                src="/images/apex/tactix-access.jpeg"
                alt="A hand opening the pocket of an unbranded utility jacket."
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="border-b border-line py-[22px]">
              <span className="eyebrow">ACCESS</span>
              <p className="mt-2 text-xs text-muted">A closer look at the everyday interaction.</p>
            </figcaption>
          </figure>
          <figure className="flex flex-col">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
              <Image
                src="/images/apex/tactix-material.webp"
                alt="Close view of woven fabric and seam construction."
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="border-b border-line py-[22px]">
              <span className="eyebrow">MATERIAL / CONSTRUCTION</span>
              <p className="mt-2 text-xs text-muted">
                Texture, seams, and the way things come together.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* SECTION 5: CATALOG */}
      <section className="border-t border-line bg-surface px-gutter py-[76px] md:py-[110px]">
        <div className="mb-7 flex items-center justify-between gap-5 md:mb-[38px]">
          <p className="eyebrow text-[8px] md:text-[10px]">THE APEX SYSTEM / TACTIX CATALOG</p>
          <Link className={ACTION_LINK} href="/shop?collection=tactix">
            <span>SHOP TACTIX</span>
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
          Concept products &middot; Generated imagery &middot; Demo pricing
        </p>
        <ProductGridClient products={products} />
      </section>

      {/* SECTION 6: SIGN-OFF */}
      <section className="flex min-h-[400px] items-center border-t-8 border-t-[var(--accent)] bg-surface-secondary px-gutter py-[75px] md:min-h-[480px] md:py-[100px]">
        <div className="relative w-full">
          <p className="eyebrow">THE JOURNEY CONTINUES</p>
          <h2 className="my-[30px] max-w-[1000px] text-[46px] md:text-[clamp(44px,6vw,90px)]">
            MADE FOR WHAT COMES NEXT.
          </h2>
          <Link className={`${ACTION_LINK} mt-[18px]`} href="/">
            <Icon name="arrow-left" size={16} />
            <span>BACK TO APEX</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
