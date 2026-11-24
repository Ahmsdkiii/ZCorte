import React from "react";
import Image from "next/image";
import { Icon } from "@/components/atoms/Icon";

const ACTION_LINK =
  "group inline-flex min-h-12 items-center justify-between gap-[18px] md:gap-[25px] border-b border-control py-3.5 text-[9px] md:text-[10px] font-semibold tracking-[0.07em] transition-colors";
const ACTION_PRIMARY =
  "group inline-flex min-h-12 items-center justify-between gap-[18px] md:gap-[25px] border border-button bg-button px-[17px] py-3.5 md:px-[22px] md:py-4 text-[9px] md:text-[10px] font-semibold tracking-[0.07em] text-button-text transition-colors hover:bg-button-hover";

export function HomeHeroSection() {
  return (
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
        <span>ZCORTÉ / THE JOURNEY</span>
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
              <span>EXPLORE ZCORTÉ</span>
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
  );
}
