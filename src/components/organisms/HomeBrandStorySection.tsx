import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";

const CRAFT_PILLARS = [
  {
    num: "01",
    title: "QUIET FORM",
    description:
      "Considered proportions and articulated silhouettes engineered for uninhibited daily mobility.",
  },
  {
    num: "02",
    title: "SMALL-BATCH PROCESS",
    description:
      "Developed through iterative pattern studies, reinforced seam construction, and field testing.",
  },
  {
    num: "03",
    title: "TECHNICAL MATERIALS",
    description:
      "Cotton-nylon canvas, performance jersey, and weather-resistant shells chosen for longevity.",
  },
] as const;

export function HomeBrandStorySection() {
  return (
    <section
      id="brand"
      aria-labelledby="home-brand-heading"
      className="relative bg-surface px-gutter py-[76px] md:py-[120px]"
    >
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-x-[8vw]">
        <div>
          <p className="eyebrow">01 / BRAND STORY &amp; CRAFT</p>
          <h2
            id="home-brand-heading"
            className="my-8 text-[clamp(38px,11.5vw,54px)] md:text-[clamp(38px,5.5vw,88px)]"
          >
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
          <p className="mt-6 max-w-[400px] text-[13px] text-muted">
            Readiness. Movement. Exploration. ZCorté brings together three distinct expressions with
            transparent construction, durable materials, and purposeful design.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/about"
              className="group inline-flex min-h-12 items-center justify-between gap-[18px] border-b border-control py-3.5 text-[9px] font-semibold tracking-[0.07em] transition-colors hover:border-ink md:gap-[25px] md:text-[10px]"
            >
              <span>READ OUR CRAFT STORY</span>
              <Icon
                name="arrow-up-right"
                size={16}
                className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
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
            ZCORTÉ EDITORIAL STUDY — DIFFERENT WORLDS. A SHARED DIRECTION.
          </figcaption>
        </figure>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 border-t border-line pt-10 md:mt-20 md:grid-cols-3 md:gap-8 md:pt-12">
        {CRAFT_PILLARS.map((pillar) => (
          <div key={pillar.num} className="flex flex-col">
            <span className="eyebrow text-muted">
              {pillar.num} / {pillar.title}
            </span>
            <p className="mt-2.5 max-w-[340px] text-[13px] text-ink/90">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
