---
name: nextjs-app-router
description: Best practices and conventions for Next.js 16 App Router, React 19 Server and Client Components, Turbopack, and dynamic routing.
---

# Next.js 16 App Router Best Practices

## Core Architecture Principles

1. **Server Components by Default:**
   - Keep page-level and layout components as Server Components whenever possible.
   - Restrict `"use client"` directive strictly to boundary leaf components requiring browser APIs, interactive events, or custom React hooks.
2. **Metadata and Dynamic Routing:**
   - Always export a static `metadata` object or dynamic `generateMetadata()` function per route.
   - Use `generateStaticParams()` for dynamic segments (`/shop/[slug]`) to enable static generation at build time.
3. **Asset & Resource Optimization:**
   - Always use `next/image` with meaningful `alt`, explicit `sizes`, and `priority={true}` for Above-The-Fold / LCP elements.
   - Optimize Google Fonts using `next/font/google` (`display: "swap"`, preloading).
4. **Data Handling:**
   - Keep asynchronous data fetching inside Server Components or model service layers.
   - Pass serialized data down to Client Components through clean interfaces.
