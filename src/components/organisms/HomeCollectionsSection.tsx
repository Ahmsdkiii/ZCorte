import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";

const ACTION_LINK =
  "group inline-flex min-h-12 items-center justify-between gap-[18px] md:gap-[25px] border-b border-control py-3.5 text-[9px] md:text-[10px] font-semibold tracking-[0.07em] transition-colors";

const HOME_COLLECTION_CARDS = [
  {
    collection: "tactix",
    badge: "01 / ZCORTÉ TACTIX",
    href: "/collections/tactix",
    image: "/images/apex/campaign-tactix-0.jpeg",
    imageAlt: "Utility clothing in a concrete passage.",
    objectPosition: "85% center",
    eyebrow: "READINESS / UTILITY",
    headline: "READY BY DESIGN.",
    description: "Utility, preparation, and function for the demands of everyday life.",
    ctaLabel: "EXPLORE TACTIX",
  },
  {
    collection: "apextive",
    badge: "02 / APEXTIVE",
    href: "/collections/apextive",
    image: "/images/apex/campaign-apextive-0.jpeg",
    imageAlt: "A runner accelerating at dawn.",
    objectPosition: "80% center",
    eyebrow: "MOVEMENT / PROGRESS",
    headline: "BUILT TO KEEP MOVING.",
    description: "A performance-focused expression shaped around movement and physical progress.",
    ctaLabel: "EXPLORE APEXTIVE",
  },
  {
    collection: "outdoor",
    badge: "03 / ZCORTÉ OUTDOOR",
    href: "/collections/outdoor",
    image: "/images/apex/campaign-outdoor-0.jpeg",
    imageAlt: "Layered mountain valleys beneath low cloud.",
    objectPosition: "50% center",
    eyebrow: "ELEMENTS / REACH",
    headline: "FORGED BY THE ELEMENTS.",
    description: "Adaptability, protection, and endurance for unpredictable terrain.",
    ctaLabel: "EXPLORE OUTDOOR",
  },
] as const;

export function HomeCollectionsSection() {
  return (
    <section
      id="collections"
      className="border-t border-line bg-surface-raised px-gutter py-[76px] md:py-[120px]"
    >
      <div className="mb-7 flex items-center justify-between md:mb-[38px]">
        <span className="eyebrow">02 / THE ZCORTÉ SYSTEM</span>
        <span className="eyebrow hidden md:inline">THREE WAYS FORWARD</span>
      </div>
      <h2 className="mb-[45px] text-[clamp(38px,5.5vw,88px)] md:mb-[65px]">
        ONE SYSTEM.
        <br />
        <span className="text-muted">THREE EXPRESSIONS.</span>
      </h2>

      <div className="grid grid-cols-1 gap-x-7 gap-y-16 md:grid-cols-3">
        {HOME_COLLECTION_CARDS.map((card) => (
          <article
            key={card.collection}
            data-collection={card.collection}
            className="flex flex-col"
          >
            <Link
              aria-label={`${card.badge} — explore collection`}
              href={card.href}
              className="theme-cinematic group relative mb-6 block aspect-[4/5] overflow-hidden border-b-8 border-[var(--accent)]"
            >
              <div className="relative h-full w-full overflow-hidden bg-cinematic-raised">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  style={{ objectPosition: card.objectPosition }}
                  className="object-cover transition-transform duration-1000 ease-zcorte group-hover:scale-[1.045]"
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />
              <span className="absolute bottom-[22px] left-[22px] z-1 text-[10px] tracking-[0.1em]">
                {card.badge}
              </span>
              <span className="absolute right-[22px] bottom-[18px] z-1">
                <Icon name="arrow-up-right" size={22} />
              </span>
            </Link>
            <p className="eyebrow flex items-center before:mr-2.5 before:inline-block before:h-[7px] before:w-[7px] before:border before:border-control before:bg-[var(--accent)]">
              {card.eyebrow}
            </p>
            <h3 className="my-4 text-[clamp(32px,3vw,46px)]">{card.headline}</h3>
            <p className="mb-5 max-w-[330px] text-[13px] text-muted">{card.description}</p>
            <Link className={`${ACTION_LINK} mt-auto self-start`} href={card.href}>
              <span>{card.ctaLabel}</span>
              <Icon
                name="arrow-up-right"
                size={17}
                className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
