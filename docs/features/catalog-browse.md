# Catalog Browse — Homepage, Dynamic Collections & Shop Catalog

| Metadata         | Nilai                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Slug             | `catalog-browse`                                                 |
| Status           | `IN_PROGRESS`                                                    |
| Lane             | `Lane A`                                                         |
| Owner            | `SIDQI (Frontend / Lane A)`                                      |
| Reviewer         | `DINO / KANEKA`                                                  |
| Branch / PR      | `feat/product-catalog-page`                                      |
| Referensi PRD/FR | `prd/03-fr-customer.md` (`FR-001`, `FR-002`, `FR-003`), `FR-036` |
| Dibuat           | `2026-11-24`                                                     |
| Diperbarui       | `2026-11-24`                                                     |

## 1. Masalah dan Outcome

1. **Homepage (`FR-001`):** Membutuhkan Server Component komposisi bersih (≤ 250 baris sesuai `NFR-06`), copy brand ZCorté, pilar Brand Story & Local Craft EKRAF (`FR-036`), dan integrasi Pinned Cinematic Story.
2. **Katalog Produk Responsif (`FR-003`):** Pengunjung membutuhkan halaman katalog `/shop` yang responsif dengan filter sidebar (kategori produk, ukuran, warna, preset range harga), sort selector (Featured, Termurah, Termahal, Nama), load more pagination, sinkronisasi state via URL query params (`collection`, `category`, `size`, `color`, `price`, `sort`, `page`), status bar aksesibel (`aria-live="polite"`), serta penanganan empty state jika tidak ada produk yang cocok.

## 2. Scope

### In Scope (Subtask 1 — Landing Page & Showcase `FR-001` — Selesai & Merged)

- Modularisasi `src/app/page.tsx` menjadi Server Component komposisi (< 150 baris) dengan mengekstrak organism `HomeHeroSection`, `HomeBrandStorySection`, dan `HomeCollectionsSection`.
- Migrasi seluruh copy identitas `APEX` → `ZCorté` pada Homepage dan `CinemaStoryPinned`.
- Penambahan 3 pilar **Brand Story & Local Craft** (`01 / Quiet Form`, `02 / Small-Batch Process`, `03 / Technical Materials`) beserta CTA ke `/about` pada section `#brand`.
- Penanganan empty state pada section Featured Arrivals (`products.length === 0`) dan penyembunyian `CinemaStoryPinned` apabila `steps.length === 0`.

### In Scope (Subtask 2 — Product Catalog Page `FR-003` — Current)

- Penambahan domain type `ProductCategory` (`tops`, `bottoms`, `outerwear`, `accessories`) pada `src/models/types/product.ts` dan mapper/mock data.
- Domain rules murni `filterAndSortProducts` dan preset harga `PRICE_RANGE_PRESETS` pada `src/models/domain/productRules.ts` tanpa dependency React/DOM.
- Refactor `useShopViewModel` menjadi URL-driven (`useSearchParams`), mendukung filter kategori, ukuran, warna, range harga, sort selector, load more pagination, dan toggle mobile filter drawer.
- Implementasi komponen filter sidebar desktop dan drawer mobile `ShopFilterSidebar.tsx` dengan elemen semantik, `fieldset`, `legend`, dan `aria-pressed`.
- Pembaruan `ShopBrowser.tsx` mengintegrasikan sidebar desktop, modal drawer mobile, sort selector, status bar `aria-live="polite"`, load more pagination, dan empty state ramah pengguna.
- Pembersihan copy brand `APEX` → `ZCorté` pada `src/app/shop/page.tsx` serta penyembunyian badge `CONCEPT` jika `isConcept: false`.

### Out of Scope (Akan Dikerjakan pada Subtask Berikutnya)

- Penggabungan halaman koleksi dinamis `/collections/[slug]` (`FR-002` — Task Frontend #11).
- Penyambungan `productService` ke Prisma repository secara penuh (setelah Task Backend #4 selesai di-merge).

### 2.3 Kontrak Bersama yang Disentuh

- [x] Tidak ada kontrak bersama yang berubah
- [ ] `prisma/schema.prisma`
- [ ] `ErrorCode` / `ActionResult`
- [ ] `AuthContext` / guard peran
- [ ] Environment variables (`src/config/env.ts`, `.env.example`)
- [ ] Design tokens (`src/app/globals.css`)

## 3. User Story dan Acceptance Criteria

**User story:** Sebagai pengunjung (Visitor/Customer), saya ingin memfilter dan mengurutkan katalog produk ZCorté berdasarkan kategori, ukuran, warna, dan range harga melalui sidebar responsif dengan tautan URL yang dapat dibagikan, sehingga saya dapat menemukan busana yang sesuai preferensi saya secara cepat.

- [x] Given halaman `/shop`, when dibuka dengan URL query params (misal `?category=outerwear&sort=price-asc`), then filter dan sort selector langsung aktif sesuai query params tanpa duplikasi state client.
- [x] Given filter aktif, when pengguna memilih opsi kategori, ukuran, warna, atau preset harga, then URL diperbarui via `router.replace` (`scroll: false`) dan daftar produk terfilter seketika.
- [x] Given tidak ada produk yang cocok dengan kombinasi filter, when hasil dihitung, then tampilan empty state muncul dengan tombol "CLEAR FILTERS".
- [x] Given tampilan mobile (< 768px), when tombol "FILTERS" ditekan, then filter drawer sheet terbuka dengan backdrop dan tombol tutup / "VIEW RESULTS".
- [x] Given daftar produk lebih dari 12 item, when tombol "LOAD MORE" ditekan, then halaman memuat 12 produk berikutnya dan memperbarui status bar `SHOWING n OF m PRODUCTS` (`aria-live="polite"`).
- [x] Given aturan Clean Code `NFR-06`, when ukuran file diperiksa, then `ShopBrowser.tsx`, `ShopFilterSidebar.tsx`, `useShopViewModel.ts`, dan `page.tsx` memiliki ukuran ≤ 250 baris.

## 4. Desain Teknis (Pemetaan Frontend MVVM)

| Lapisan            | File/Modul                                                         | Tanggung jawab                                                                                               |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Model/DTO          | `src/models/types/product.ts`, `src/models/domain/productRules.ts` | Kontrak tipe `ProductCategory`, rules murni `filterAndSortProducts`, dan `PRICE_RANGE_PRESETS`               |
| ViewModel          | `src/hooks/useShopViewModel.ts`                                    | Sinkronisasi filter/sort/pagination ke URL, pagination slice, status active filter, state mobile drawer      |
| View (Organisms)   | `ShopFilterSidebar.tsx`, `ShopBrowser.tsx`                         | Komposisi layout katalog, filter sidebar desktop, drawer modal mobile, sort selector, empty state, load more |
| Server composition | `src/app/shop/page.tsx`                                            | Mengambil data `initialProducts`, menyusun metadata ZCorté, JSON-LD breadcrumb, dan hero banner editorial    |

## 5. File Terdampak

- `src/models/types/product.ts` — Menambahkan tipe `ProductCategory` dan konstanta `ALL_CATEGORIES`.
- `src/models/domain/productRules.ts` — Rule murni `filterAndSortProducts`, `CATEGORY_LABELS`, dan `PRICE_RANGE_PRESETS`.
- `src/models/data/products.mock.ts` — Memberikan kategori eksplisit dan mematikan flag `isConcept`.
- `src/models/mappers/product.mapper.ts` — Mendukung pemetaan field `category`.
- `src/hooks/useShopViewModel.ts` — ViewModel terpadu URL-driven untuk filter, sort, dan pagination.
- `src/components/organisms/ShopFilterSidebar.tsx` — Organism filter sidebar desktop dan drawer mobile.
- `src/components/organisms/ShopBrowser.tsx` — Organism browser katalog dengan sidebar dan load more.
- `src/app/shop/page.tsx` — Server component katalog ZCorté.
- `src/components/compound/ProductCard/ProductCard.tsx` — Guard render tag `CONCEPT`.
- `docs/features/catalog-browse.md` — Dokumentasi teknis fitur `catalog-browse` Subtask 2.

## 6. Hasil Validasi

| Pemeriksaan         | Hasil  | Catatan                                                                |
| ------------------- | ------ | ---------------------------------------------------------------------- |
| `pnpm lint`         | `PASS` | 0 error, 0 warning                                                     |
| `pnpm format:check` | `PASS` | Seluruh file terformat Prettier                                        |
| `pnpm typecheck`    | `PASS` | Lulus `tsc --noEmit`                                                   |
| Batas ukuran file   | `PASS` | Seluruh file yang disentuh < 250 baris (sesuai `NFR-06`)               |
| `pnpm build`        | `PASS` | Build production Next.js 16 berhasil dengan static prerender & dynamic |
