import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { CinemaStoryPinned } from "@/components/compound/CinemaStory";
import { ProductGridClient } from "@/components/organisms/ProductGridClient";
import { getProducts } from "@/models/services/productService";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/jsonLd";

const ACTION_LINK =
  "group inline-flex min-h-12 items-center justify-between gap-[18px] md:gap-[25px] border-b border-control py-3.5 text-[9px] md:text-[10px] font-semibold tracking-[0.07em] transition-colors";
const ACTION_PRIMARY =
  "group inline-flex min-h-12 items-center justify-between gap-[18px] md:gap-[25px] border border-button bg-button px-[17px] py-3.5 md:px-[22px] md:py-4 text-[9px] md:text-[10px] font-semibold tracking-[0.07em] text-button-text transition-colors hover:bg-button-hover";

export default async function HomePage() {
  const products = await getProducts({ featured: true });
  const structuredData = [generateOrganizationSchema(), generateWebsiteSchema()];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main id="main" className="w-full flex-1">
        {/* SECTION 1: FULL-BLEED DARK CINEMATIC HERO */}
        <section
          data-world="main"
          className="theme-cinematic relative flex h-svh min-h-[740px] flex-col justify-center overflow-clip bg-cinematic-bg text-cinematic-text max-md:max-h-[1100px] md:min-h-[720px] lg:min-h-[760px]"
        >
          <div className="absolute inset-0 overflow-hidden bg-cinematic-raised">
            <Image
              src="/images/apex/campaign-main-0.jpeg"
              alt="A traveler overlooking a vast volcanic valley."
              fill
              priority
              sizes="(max-width: 767px) 180vh, 100vw"
              style={{ objectPosition: "80% center" }}
              className="object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,10,12,0.48)_0%,rgba(9,10,12,0.32)_45%,rgba(9,10,12,0.88)_100%),linear-gradient(90deg,rgba(9,10,12,0.84)_0%,rgba(9,10,12,0.46)_52%,rgba(9,10,12,0.1)_100%)]" />

          <div className="absolute inset-x-gutter top-[102px] flex justify-between text-[8px] tracking-[0.15em] text-cinematic-muted md:top-[124px] md:text-[9px]">
            <span>APEX / THE JOURNEY</span>
            <span className="hidden md:inline">DESIGNED TO GO FORWARD</span>
          </div>

          <div className="relative mt-[45px] w-full px-gutter pt-[90px] pb-[60px] md:mt-20 md:pt-[100px] md:pb-[30px] 3xl:mt-[120px]">
            <p className="eyebrow mb-6 flex items-center text-[8px] tracking-[0.12em] text-cinematic-muted before:mr-2.5 before:inline-block before:h-[7px] before:w-[7px] before:bg-cinematic-text md:text-[10px] md:tracking-[0.14em]">
              A CONNECTED SYSTEM. AN OPEN HORIZON.
            </p>
            <h1 className="max-w-[1200px] text-[clamp(47px,10.6vw,78px)] text-cinematic-text max-md:tracking-[-0.06em] md:text-[clamp(64px,10vw,110px)] lg:text-[clamp(58px,8.7vw,145px)]">
              HERE, THE
              <br />
              JOURNEY BEGINS.
            </h1>

            <div className="mt-7 flex flex-col items-start justify-between gap-[25px] md:mt-[38px] md:gap-7 lg:flex-row lg:items-end lg:gap-[35px] 3xl:mt-[50px]">
              <p className="max-w-[300px] text-[13px] text-cinematic-muted md:max-w-[370px] md:text-[14px]">
                A system for people moving toward something—built to adapt, perform, and keep going.
              </p>
              <div className="flex flex-wrap items-start gap-x-5 gap-y-3 md:items-center md:gap-[26px]">
                <a
                  className={`${ACTION_PRIMARY} border-cinematic-text bg-cinematic-text text-cinematic-bg hover:bg-cinematic-muted`}
                  href="#brand"
                >
                  <span>EXPLORE APEX</span>
                  <Icon
                    name="arrow-up-right"
                    size={17}
                    className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <a
                  className={`${ACTION_LINK} border-cinematic-muted bg-black/35 px-4 text-cinematic-text backdrop-blur-xs hover:bg-black/55`}
                  href="#collections"
                >
                  <span>EXPLORE COLLECTIONS</span>
                  <Icon
                    name="arrow-up-right"
                    size={17}
                    className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-gutter bottom-6 flex justify-between border-t border-white/20 pt-4 text-[8px] tracking-[0.12em] text-cinematic-muted md:bottom-[30px] md:text-[9px]">
            <a href="#brand" className="flex items-center gap-3 hover:text-white">
              <Icon name="arrow-down" size={14} className="animate-scroll-cue" /> SCROLL TO DISCOVER
            </a>
            <span className="hidden md:inline">01 — 03 / ONE SYSTEM</span>
          </div>
        </section>

        {/* SECTION 2: THE PREMISE (#brand) */}
        <section
          id="brand"
          className="relative grid grid-cols-1 items-center gap-10 bg-surface px-gutter py-[76px] md:grid-cols-2 md:gap-12 md:py-[120px] lg:gap-x-[8vw]"
        >
          <div>
            <p className="eyebrow">01 / THE WAY FORWARD</p>
            <h2 className="my-8 text-[clamp(38px,11.5vw,54px)] md:text-[clamp(38px,5.5vw,88px)]">
              BUILT FOR
              <br />
              THE WAY
              <br />
              <span className="text-muted">FORWARD.</span>
            </h2>
            <p className="max-w-[510px] text-[clamp(17px,1.5vw,22px)]">
              Different conditions. Different demands.
              <br />
              One connected system.
            </p>
            <p className="mt-6 max-w-[360px] text-[13px] text-muted">
              Readiness. Movement. Exploration. Three distinct expressions, connected by a shared
              intent: to meet what comes next.
            </p>
          </div>
          <figure className="flex flex-col">
            <div className="relative h-[440px] w-full overflow-hidden bg-surface-raised md:h-[520px] lg:h-[600px] 3xl:h-[700px]">
              <Image
                src="/images/apex/premise.jpeg"
                alt="A person moving from concrete architecture toward open rocky terrain."
                fill
                sizes="(max-width: 767px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3.5 text-[8px] tracking-[0.12em] text-muted md:text-[9px]">
              DIFFERENT WORLDS. A SHARED DIRECTION.
            </figcaption>
          </figure>
        </section>

        {/* SECTION 3: PINNED CINEMATIC STORY */}
        <CinemaStoryPinned />

        {/* SECTION 4: THE APEX SYSTEM (#collections) — BALANCED 3-COLUMN GRID */}
        <section
          id="collections"
          className="border-t border-line bg-surface-raised px-gutter py-[76px] md:py-[120px]"
        >
          <div className="mb-7 flex items-center justify-between md:mb-[38px]">
            <span className="eyebrow">02 / THE APEX SYSTEM</span>
            <span className="eyebrow hidden md:inline">THREE WAYS FORWARD</span>
          </div>
          <h2 className="mb-[45px] text-[clamp(38px,5.5vw,88px)] md:mb-[65px]">
            ONE SYSTEM.
            <br />
            <span className="text-muted">THREE EXPRESSIONS.</span>
          </h2>

          <div className="grid grid-cols-1 gap-x-7 gap-y-16 md:grid-cols-3">
            <article data-collection="tactix" className="flex flex-col">
              <Link
                aria-label="01 / APEX TACTIX — explore collection"
                href="/collections/tactix"
                className="theme-cinematic group relative mb-6 block aspect-[4/5] overflow-hidden border-b-8 border-[var(--accent)]"
              >
                <div className="relative h-full w-full overflow-hidden bg-cinematic-raised">
                  <Image
                    src="/images/apex/campaign-tactix-0.jpeg"
                    alt="Utility clothing in a concrete passage."
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    style={{ objectPosition: "85% center" }}
                    className="object-cover transition-transform duration-1000 ease-apex group-hover:scale-[1.045]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />
                <span className="absolute bottom-[22px] left-[22px] z-1 text-[10px] tracking-[0.1em]">
                  01 / APEX TACTIX
                </span>
                <span className="absolute right-[22px] bottom-[18px] z-1">
                  <Icon name="arrow-up-right" size={22} />
                </span>
              </Link>
              <p className="eyebrow flex items-center before:mr-2.5 before:inline-block before:h-[7px] before:w-[7px] before:border before:border-control before:bg-[var(--accent)]">
                READINESS / UTILITY
              </p>
              <h3 className="my-4 text-[clamp(32px,3vw,46px)]">READY BY DESIGN.</h3>
              <p className="mb-5 max-w-[330px] text-[13px] text-muted">
                Utility, preparation, and function for the demands of everyday life.
              </p>
              <Link className={`${ACTION_LINK} mt-auto self-start`} href="/collections/tactix">
                <span>EXPLORE TACTIX</span>
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </article>

            <article data-collection="apextive" className="flex flex-col">
              <Link
                aria-label="02 / APEXTIVE — explore collection"
                href="/collections/apextive"
                className="theme-cinematic group relative mb-6 block aspect-[4/5] overflow-hidden border-b-8 border-[var(--accent)]"
              >
                <div className="relative h-full w-full overflow-hidden bg-cinematic-raised">
                  <Image
                    src="/images/apex/campaign-apextive-0.jpeg"
                    alt="A runner accelerating at dawn."
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    style={{ objectPosition: "80% center" }}
                    className="object-cover transition-transform duration-1000 ease-apex group-hover:scale-[1.045]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />
                <span className="absolute bottom-[22px] left-[22px] z-1 text-[10px] tracking-[0.1em]">
                  02 / APEXTIVE
                </span>
                <span className="absolute right-[22px] bottom-[18px] z-1">
                  <Icon name="arrow-up-right" size={22} />
                </span>
              </Link>
              <p className="eyebrow flex items-center before:mr-2.5 before:inline-block before:h-[7px] before:w-[7px] before:border before:border-control before:bg-[var(--accent)]">
                MOVEMENT / PROGRESS
              </p>
              <h3 className="my-4 text-[clamp(32px,3vw,46px)]">BUILT TO KEEP MOVING.</h3>
              <p className="mb-5 max-w-[330px] text-[13px] text-muted">
                A performance-focused expression shaped around movement and physical progress.
              </p>
              <Link className={`${ACTION_LINK} mt-auto self-start`} href="/collections/apextive">
                <span>EXPLORE APEXTIVE</span>
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </article>

            <article data-collection="outdoor" className="flex flex-col">
              <Link
                aria-label="03 / APEX OUTDOOR — explore collection"
                href="/collections/outdoor"
                className="theme-cinematic group relative mb-6 block aspect-[4/5] overflow-hidden border-b-8 border-[var(--accent)]"
              >
                <div className="relative h-full w-full overflow-hidden bg-cinematic-raised">
                  <Image
                    src="/images/apex/campaign-outdoor-0.jpeg"
                    alt="Layered mountain valleys beneath low cloud."
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-1000 ease-apex group-hover:scale-[1.045]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />
                <span className="absolute bottom-[22px] left-[22px] z-1 text-[10px] tracking-[0.1em]">
                  03 / APEX OUTDOOR
                </span>
                <span className="absolute right-[22px] bottom-[18px] z-1">
                  <Icon name="arrow-up-right" size={22} />
                </span>
              </Link>
              <p className="eyebrow flex items-center before:mr-2.5 before:inline-block before:h-[7px] before:w-[7px] before:border before:border-control before:bg-[var(--accent)]">
                ELEMENTS / REACH
              </p>
              <h3 className="my-4 text-[clamp(32px,3vw,46px)]">FORGED BY THE ELEMENTS.</h3>
              <p className="mb-5 max-w-[330px] text-[13px] text-muted">
                Adaptability, protection, and endurance for unpredictable terrain.
              </p>
              <Link className={`${ACTION_LINK} mt-auto self-start`} href="/collections/outdoor">
                <span>EXPLORE OUTDOOR</span>
                <Icon
                  name="arrow-up-right"
                  size={17}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </article>
          </div>
        </section>

        {/* SECTION 5: CONCEPT CATALOG */}
        <section className="border-t border-line bg-surface px-gutter py-[76px] md:py-[110px]">
          <div className="mb-7 flex items-center justify-between gap-5 md:mb-[38px]">
            <p className="eyebrow text-[8px] md:text-[10px]">THE APEX SYSTEM / CONCEPT CATALOG</p>
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
            Concept products &middot; Generated imagery &middot; Demo pricing
          </p>
          <ProductGridClient products={products} />
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
