import React from "react";

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed top-2.5 left-5 z-100 bg-ink px-4 py-3.5 text-xs font-semibold uppercase tracking-widest text-surface -translate-y-[200%] focus:translate-y-0 transition-transform"
    >
      Skip to main content
    </a>
  );
}
