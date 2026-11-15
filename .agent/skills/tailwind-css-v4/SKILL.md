---
name: tailwind-css-v4
description: Guidelines and patterns for Tailwind CSS v4 CSS-first configuration, @theme directive, container queries, and design token integration.
---

# Tailwind CSS v4 Engineering Guidelines

## Core Principles

1. **CSS-First Theme Configuration:**
   - Do not use `tailwind.config.js`. Use the `@theme` directive directly inside `src/app/globals.css`.
   - Extend colors, spacing, font families, and breakpoints using CSS custom properties inside `@theme`.
2. **Class Merging and Utilities:**
   - Always merge dynamic classes using the standard `cn()` helper (`clsx` + `tailwind-merge`).
   - Avoid string concatenation for classes with conditional variants.
3. **Responsive & Modern Styling:**
   - Mobile-first approach: unprefixed utilities apply to mobile screens; prefix with `md:`, `lg:`, etc. for larger viewports.
   - Respect user accessibility preferences by incorporating `motion-safe:` or `@media (prefers-reduced-motion: reduce)`.
   - Leverage native container queries (`@container`) for modular self-contained components.
