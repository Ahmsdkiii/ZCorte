import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { CinemaStoryPinned } from "@/components/compound/CinemaStory";
import { ProductGridClient } from "@/components/organisms/ProductGridClient";
import { CollectionClosing } from "@/components/organisms/CollectionClosing";
import type { CollectionMeta } from "@/models/types/collection";
import type { StoryStep } from "@/models/types/story";
import type { Product, ProductCollection } from "@/models/types/product";

interface CollectionViewProps {
  collection: CollectionMeta;
  storySteps: StoryStep[];
  products: Product[];
}

const ACTION_LINK =
  "group inline-flex min-h-12 items-center justify-between gap-[18px] md:gap-[25px] border-b border-control py-3.5 text-[9px] md:text-[10px] font-semibold tracking-[0.07em] transition-colors";
const ACTION_PRIMARY =
  "group inline-flex min-h-12 items-center justify-between gap-[18px] md:gap-[25px] border border-button bg-button px-[17px] py-3.5 md:px-[22px] md:py-4 text-[9px] md:text-[10px] font-semibold tracking-[0.07em] text-button-text transition-colors hover:bg-button-hover";

export function CollectionView({ collection, storySteps, products }: CollectionViewProps) {
  const collectionKey = collection.id;
  const upperSlug = collection.id.toUpperCase();

  return (
    <main id="main" data-collection={collection.id} className="w-full flex-1">
      {/* HERO SECTION */}
      <section
        data-world={collection.id}
        className="theme-cinematic relative flex h-svh min-h-[740px] flex-col justify-center overflow-clip bg-cinematic-bg text-cinematic-text max-md:max-h-[1100px] md:min-h-[720px] lg:min-h-[760px]"
      >
        <div className="absolute inset-0 overflow-hidden bg-cinematic-raised">
          <Image
            src={collection.heroImage}
            alt={`${collection.name} hero visualization.`}
            fill
            priority
            sizes="(max-width: 767px) 180vh, 100vw"
            style={{ objectPosition: "85% center" }}
            className="object-cover"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,10,12,0.5)_0%,rgba(9,10,12,0.34)_45%,rgba(9,10,12,0.88)_100%),linear-gradient(90deg,rgba(9,10,12,0.86)_0%,rgba(9,10,12,0.48)_55%,rgba(9,10,12,0.12)_100%)]" />

        <div className="absolute inset-x-gutter top-[102px] flex justify-between text-[8px] tracking-[0.15em] text-cinematic-muted md:top-[124px] md:text-[9px]">
          <span>ZCORTÉ / {upperSlug}</span>
          <span className="hidden md:inline">01 / THREE EXPRESSIONS</span>
        </div>

        <div className="relative mt-[45px] w-full px-gutter pt-[90px] pb-[60px] md:mt-20 md:pt-[100px] md:pb-[30px] 3xl:mt-[120px]">
          <p className="eyebrow mb-6 flex items-center text-[8px] tracking-[0.12em] text-cinematic-muted before:mr-2.5 before:inline-block before:h-[7px] before:w-[7px] before:bg-[var(--accent)] md:text-[10px] md:tracking-[0.14em]">
            {collection.focus.toUpperCase()}
          </p>
          <h1 className="max-w-[900px] text-[clamp(53px,13vw,90px)] text-cinematic-text max-md:tracking-[-0.06em] md:text-[clamp(64px,10vw,110px)] lg:text-[clamp(58px,8.7vw,145px)]">
            {collection.tagline.toUpperCase()}
          </h1>
          <div className="mt-7 flex flex-col items-start justify-between gap-[25px] md:mt-[38px] md:gap-7 lg:flex-row lg:items-end lg:gap-[35px] 3xl:mt-[50px]">
            <p className="max-w-[300px] text-[13px] text-cinematic-muted md:max-w-[370px] md:text-[14px]">
              {collection.description}
            </p>
            <div className="flex flex-wrap items-start gap-x-5 gap-y-3 md:items-center md:gap-[26px]">
              <a
                className={`${ACTION_PRIMARY} border-cinematic-text bg-cinematic-text text-cinematic-bg hover:bg-cinematic-muted`}
                href="#introduction"
              >
                <span>EXPLORE {upperSlug}</span>
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <Link
                className={`${ACTION_LINK} border-cinematic-muted bg-black/35 px-4 text-cinematic-text backdrop-blur-xs hover:bg-black/55`}
                href={`/shop?collection=${collection.id}`}
              >
                <span>SHOP {upperSlug}</span>
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION PREMISE */}
      <section
        id="introduction"
        aria-labelledby="collection-premise"
        className="border-b border-line bg-surface px-gutter py-20 md:py-28"
      >
        <div className="mx-auto max-w-[1440px]">
          <p className="eyebrow mb-6 text-muted">PREMISE / {upperSlug}</p>
          <h2
            id="collection-premise"
            className="max-w-4xl text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {collection.description}
          </h2>
        </div>
      </section>

      {/* PINNED CINEMA STORY */}
      {storySteps.length > 0 && (
        <CinemaStoryPinned
          title={`${upperSlug} IN CONTEXT`}
          eyebrow={`ZCORTÉ / ${upperSlug}`}
          steps={storySteps}
          collectionId={collection.id as "tactix" | "apextive" | "outdoor"}
        />
      )}

      {/* COLLECTION CATALOG GRID */}
      <section
        id="catalog"
        aria-labelledby="collection-catalog"
        className="border-b border-line bg-surface px-gutter py-20 md:py-28"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <p className="eyebrow text-muted">THE ZCORTÉ SYSTEM / {upperSlug} CATALOG</p>
              <h2
                id="collection-catalog"
                className="mt-2 text-2xl font-bold tracking-tight uppercase sm:text-3xl"
              >
                Engineered Silhouettes
              </h2>
            </div>
            <Link
              href={`/shop?collection=${collection.id}`}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink"
            >
              <span>View In Full Storefront</span>
              <Icon name="arrow-up-right" size={14} />
            </Link>
          </div>

          <ProductGridClient products={products} />
        </div>
      </section>

      {/* COLLECTION SIGN-OFF CLOSING */}
      <CollectionClosing
        collection={collectionKey}
        statement={`ZCORTÉ ${upperSlug} IS CRAFTED FOR UNCOMPROMISING DEMANDS.`}
      />
    </main>
  );
}
