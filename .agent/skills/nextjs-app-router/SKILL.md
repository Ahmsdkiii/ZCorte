---
name: nextjs-app-router
description: Best practices and conventions for Next.js 16 App Router, React 19 Server and Client Components, Turbopack, and dynamic routing.
---

# Next.js 16 App Router Best Practices

## Core Architecture Principles

1. **Server Components by Default:**
   - Keep page-level and layout components as Server Components whenever possible.
   - Restrict `"use client"` strictly to interactive boundaries requiring browser APIs, event handlers, context, or React hooks.
2. **Metadata, Dynamic Routing & Auth Proxy:**
   - Always export a static `metadata` object or dynamic `generateMetadata()` function per route.
   - Dynamic routes (`/collections/[slug]`, `/shop/[slug]`) must load published data from PostgreSQL via `src/server/services/`; never import mock or seed files at runtime.
   - Use `src/proxy.ts` (Next.js 16 convention replacing `middleware.ts`) only for coarse authentication redirects (`/admin`, `/account`); enforce authoritative authorization in `src/server/services/`.
3. **Caching & Revalidation (Next.js 16):**
   - In Server Actions, use `updateTag(tag)` so mutations are immediately visible (_read-your-own-writes_).
   - In Route Handlers and webhooks, use `revalidateTag(tag, "max")`.
4. **Asset & Font Optimization:**
   - Always use `next/image` with meaningful `alt`, explicit `sizes`, and `priority={true}` only for critical Above-The-Fold / LCP elements.
   - Prefer `next/font/local` (or self-hosted fonts) over remote font fetches during build so production builds remain resilient offline; always set `display: "swap"`.
5. **Data Handling & Layer Boundaries:**
   - Keep asynchronous server data fetching inside Server Components calling `src/server/services/`.
   - Keep `src/models/` pure (domain types, rules, mappers — no React, Next.js, Prisma, or HTTP imports).
   - Pass only serialized, safe DTOs down to Client Components (never raw Prisma records containing sensitive/internal fields).
