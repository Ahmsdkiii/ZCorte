---
name: seo-and-metadata
description: Rules for search engine optimization, Open Graph, Twitter Cards, JSON-LD structured data, sitemap generation, and semantic HTML markup.
---

# Technical SEO & Metadata Specifications

## Rules & Standards

1. **Dynamic Metadata per Route:**
   - Every public page must declare `title`, `description`, canonical link, Open Graph metadata, and Twitter Card tags.
   - Title standard: `[Page Name] — ZCorté` (with root template `%s — ZCorté`).
   - Private routes (`/admin/**`, `/account/**`, `/checkout`) must set `robots: { index: false, follow: false }`.
2. **Semantic HTML & Heading Structure:**
   - Exactly one `<h1>` tag per page, representing the primary topical focus.
   - Strict hierarchical order: `<h1>` -> `<h2>` -> `<h3>`. Never skip heading levels for styling.
3. **Structured Data (JSON-LD):**
   - Inject `<script type="application/ld+json">` on relevant public routes:
     - Root / Homepage: `Organization` & `WebSite` schema.
     - Product Detail Page (`/shop/[slug]`): `Product` schema with `offers` (price in IDR, real-time availability from PostgreSQL), `image`, `description`.
     - Sub-pages / Breadcrumbs: `BreadcrumbList` schema.
4. **Sitemap and Crawling:**
   - Maintain `src/app/sitemap.ts` returning absolute URLs for all public static routes plus published collections and products queried from PostgreSQL via `src/server/services/` (never hardcoded mock lists).
   - Maintain `src/app/robots.ts` allowing public storefront routes while disallowing `/admin`, `/account`, `/checkout`, and `/api`.
