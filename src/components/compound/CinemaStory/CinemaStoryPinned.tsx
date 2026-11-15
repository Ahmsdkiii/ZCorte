"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { mockStorySteps } from "@/models/data/stories.mock";
import { StoryStep } from "@/models/types/story";
import { cn } from "@/lib/utils";

export interface CinemaStoryPinnedProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  skipTarget?: string;
  skipLabel?: string;
  steps?: StoryStep[];
  collectionId?: "main" | "tactix" | "apextive" | "outdoor";
}

export function CinemaStoryPinned({
  id = "story-flow",
  eyebrow = "APEX / THE CONNECTED SYSTEM",
  title = "BEFORE THE PRODUCT, THERE IS A CONDITION.",
  skipTarget = "#collections",
  skipLabel = "SKIP CINEMATIC SEQUENCE",
  steps = mockStorySteps,
  collectionId = "main",
}: CinemaStoryPinnedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = el.offsetHeight - windowHeight;

    if (totalScrollable <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(0.9999, scrolled / totalScrollable));
    const exactStep = progress * steps.length;
    const stepIndex = Math.min(steps.length - 1, Math.floor(exactStep));
    const currentStepFraction = Math.max(0, Math.min(1, exactStep - stepIndex));

    setActiveStep(stepIndex);
    setStepProgress(currentStepFraction);
  }, [steps.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  const scrollToStep = (index: number) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = scrollTop + rect.top;
    const totalScrollable = el.offsetHeight - window.innerHeight;

    const targetProgress = (index + 0.25) / steps.length;
    const targetScroll = containerTop + Math.min(0.98, targetProgress) * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} id={id} className="relative h-[450vh] w-full bg-cinematic-bg">
      <section
        aria-label={`${eyebrow} cinematic sequence`}
        className="theme-cinematic sticky top-0 isolate h-svh w-full overflow-hidden bg-cinematic-bg text-cinematic-text"
      >
        <div className="absolute inset-x-0 top-[82px] z-10 flex items-center justify-between gap-5 px-gutter md:top-[98px]">
          <p className="eyebrow text-cinematic-muted">{eyebrow}</p>
          <a
            href={skipTarget}
            className="flex min-h-11 items-center text-[10px] tracking-[0.08em] text-cinematic-text hover:underline"
          >
            {skipLabel} &searr;
          </a>
        </div>

        <h2 className="absolute top-[126px] left-gutter z-10 max-w-[1100px] text-[12px] font-bold tracking-[0.1em] uppercase md:top-[155px] md:text-[14px]">
          {title}
        </h2>

        <div className="absolute inset-0 z-1">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <article
                key={step.numberStr}
                id={`${collectionId}-chapter-${idx}`}
                aria-hidden={!isActive}
                className={cn(
                  "absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-700 ease-apex",
                  isActive
                    ? "z-2 opacity-100 visible pointer-events-auto"
                    : "z-1 opacity-0 invisible pointer-events-none"
                )}
              >
                <div className="absolute inset-0">
                  <div className="relative h-full w-full overflow-hidden bg-cinematic-raised">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      priority={idx === 0}
                      sizes="100vw"
                      className={cn(
                        "object-cover object-center transition-all duration-1000 ease-apex",
                        isActive ? "scale-[1.06] translate-y-0" : "scale-100 translate-y-4"
                      )}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#00000040,#000000d9)] md:bg-[linear-gradient(90deg,#000000c7,#0000001f),linear-gradient(#0000_30%,#000000a6)]" />

                  <div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-[10%_7%_7%] z-1 transition-all duration-700 ease-apex md:inset-[22%_8%_18%]",
                      isActive ? "scale-100 opacity-100" : "scale-[0.97] opacity-0"
                    )}
                  >
                    <span className="absolute -top-[25px] right-0 font-mono text-[10px] tracking-[0.12em] text-cinematic-muted">
                      {collectionId === "main" ? "SYSTEM" : "CONTEXT"} / STUDY {step.numberStr}
                    </span>
                    <i className="absolute top-0 left-0 h-[22px] w-[22px] border-t border-l border-[#bcc4bd]/60" />
                    <i className="absolute top-0 right-0 h-[22px] w-[22px] border-t border-r border-[#bcc4bd]/60" />
                    <i className="absolute bottom-0 left-0 h-[22px] w-[22px] border-b border-l border-[#bcc4bd]/60" />
                    <i className="absolute right-0 bottom-0 h-[22px] w-[22px] border-r border-b border-[#bcc4bd]/60" />
                  </div>
                </div>

                <div className="absolute bottom-[84px] left-0 z-5 max-w-[780px] px-gutter md:bottom-[104px]">
                  <p
                    className={cn(
                      "eyebrow text-cinematic-muted transition-all duration-700 delay-75 ease-apex",
                      isActive ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                    )}
                  >
                    {step.numberStr} / {step.title.toUpperCase()}
                  </p>
                  <h3
                    className={cn(
                      "my-3.5 text-[clamp(38px,11vw,55px)] leading-none transition-all duration-700 delay-150 ease-apex md:my-[22px] md:text-[clamp(50px,7vw,108px)]",
                      collectionId === "tactix" && "tracking-[-0.04em]",
                      collectionId === "apextive" && "italic",
                      collectionId !== "tactix" && "tracking-[-0.055em]",
                      isActive ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
                    )}
                  >
                    <span className="inline-block">{step.headline}</span>
                  </h3>
                  <p
                    className={cn(
                      "max-w-[420px] text-[14px] leading-[1.55] text-[#e0e1dc] transition-all duration-700 delay-250 ease-apex md:text-[16px] md:leading-[1.7]",
                      isActive ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                    )}
                  >
                    {step.description}
                  </p>
                  <span
                    className={cn(
                      "mt-[18px] block text-[8px] tracking-[0.12em] text-[#c4c9c8] transition-all duration-700 delay-300 ease-apex md:mt-[35px]",
                      isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    )}
                  >
                    GENERATED CONCEPT STUDY / APEX
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <nav
          aria-label="Story chapter steps"
          className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-6 gap-1.5 bg-[#0a0b0bbf] px-gutter py-2.5 backdrop-blur-xs md:gap-4 md:py-[22px]"
        >
          {steps.map((s, idx) => {
            const isCurrent = activeStep === idx;
            const isPast = idx < activeStep;
            const fillScale = isPast ? 1 : isCurrent ? Math.max(0.08, stepProgress) : 0;

            return (
              <button
                key={s.numberStr}
                type="button"
                onClick={() => scrollToStep(idx)}
                aria-current={isCurrent ? "true" : undefined}
                className={cn(
                  "group relative min-h-[38px] truncate px-0.5 pt-2.5 pb-1.5 text-left text-[9px] transition-colors md:min-h-11 md:px-1 md:pt-3.5 md:pb-2 md:text-[11px]",
                  isCurrent ? "text-white" : "text-[#c3c8c8] hover:text-white"
                )}
              >
                {/* Track Bar */}
                <span
                  aria-hidden="true"
                  className=" absolute inset-x-0 top-0 h-[1.5px] bg-[#52595a] transition-colors group-hover:bg-white/50"
                />
                {/* Animated Progress Fill Bar */}
                <span
                  aria-hidden="true"
                  style={{ transform: `scaleX(${fillScale})` }}
                  className="absolute inset-x-0 top-0 h-[2px] origin-left bg-white transition-transform duration-150 ease-out"
                />
                <span className="mb-0.5 block text-[8px] text-[#92999b] md:mr-2.5 md:mb-0 md:inline md:text-[9px]">
                  {s.numberStr}
                </span>
                {s.title}
              </button>
            );
          })}
        </nav>
      </section>
    </div>
  );
}
