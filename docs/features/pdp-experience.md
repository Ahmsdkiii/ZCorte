# Product Detail Page (PDP) — Gallery, Variant Selector & Stock Availability

| Metadata         | Nilai                                                  |
| ---------------- | ------------------------------------------------------ |
| Slug             | `pdp-experience`                                       |
| Status           | `IN_PROGRESS`                                          |
| Lane             | `Lane A`                                               |
| Owner            | `SIDQI (Frontend / Lane A)`                            |
| Reviewer         | `DINO / KANEKA`                                        |
| Branch / PR      | `feat/product-detail-page`                             |
| Referensi PRD/FR | `prd/03-fr-customer.md` (`FR-005`, `FR-004`, `FR-036`) |
| Dibuat           | `2026-11-24`                                           |
| Diperbarui       | `2026-11-24`                                           |

## 1. Masalah dan Outcome

Halaman detail produk (`/shop/[slug]` — `FR-005`) sebelumnya membawa sisa identitas brand prototipe (`APEX`, disclaimer "Demo pricing & checkout not connected") serta belum menampilkan status ketersediaan stok atau validasi ukuran yang ramah pengguna.

Outcome yang dicapai:

1. Pembersihan total copy `APEX` digantikan narasi kurasi **ZCorté** ("_Designed in Bandung, West Java_").
2. Status ketersediaan stok (`IN STOCK`, `LOW STOCK: n LEFT`, `OUT OF STOCK`) yang reaktif terhadap kombinasi warna & ukuran yang dipilih.
3. Validasi pemilihan ukuran yang aksesibel (`role="alert"`, fokus keyboard ke selector ukuran) saat pengguna mencoba menambahkan ke bag tanpa memilih ukuran.
4. Nonaktifkan ukuran yang habis stok (`aria-disabled="true"`, line-through).
5. Schema.org JSON-LD `Product` & `BreadcrumbList` valid untuk SEO e-commerce.

## 2. Scope

### In Scope (Task Frontend #4 — `FR-005`)

- Penambahan tipe stok varian `stockBySize` & `stockOneSize` pada `ProductColorVariant` dan mapper DTO.
- Helper ketersediaan stok `getProductStock(product, colorId, size)` dan status `getStockStatus(stock)` di domain rules murni.
- Refactor `useProductDetailViewModel` mengelola derived stock, pembatasan kuantitas sesuai stok tersedia, dan validasi inline.
- Pembaruan `SizeSelector` mendukung penandaan ukuran habis stok (`isOutOfStock`).
- Pembaruan `ProductInfoSection` menyertakan badge ketersediaan stok, info kuantitas tersedia, dan tombol _Add to Bag_ dinamis.
- Pembaruan `ProductDetailView` & `src/app/shop/[slug]/page.tsx` membersihkan breadcrumb, copy section _Complete the Look_, dan JSON-LD Schema.org.

### Out of Scope

- Integrasi persistensi wishlist ke database (`FR-011` — Task Frontend #18).
- Smart Size recommendation interaktif (`FR-034`).
- Integrasi ke database Prisma secara langsung (menunggu Task Backend #4 selesai di-merge).

### 2.3 Kontrak Bersama yang Disentuh

- [x] Tidak ada kontrak bersama yang berubah
- [ ] `prisma/schema.prisma`
- [ ] `ErrorCode` / `ActionResult`
- [ ] `AuthContext` / guard peran
- [ ] Environment variables (`src/config/env.ts`, `.env.example`)
- [ ] Design tokens (`src/app/globals.css`)

## 3. User Story dan Acceptance Criteria

**User story:** Sebagai pengunjung (Visitor/Customer), saya ingin melihat foto detail produk ZCorté, memilih varian warna dan ukuran yang tersedia dengan informasi stok yang jelas, serta menambahkan item ke bag dengan validasi yang jelas agar saya yakin sebelum membeli.

- [x] Given halaman PDP `/shop/[slug]`, when halaman dimuat, then breadcrumb dan narasi menampilkan brand **ZCorté** tanpa sisa label prototipe `APEX`.
- [x] Given produk dengan variasi ukuran, when pengguna belum memilih ukuran dan menekan "ADD TO BAG", then pesan peringatan inline muncul dengan atribut `role="alert"` dan fokus berpindah ke selector ukuran.
- [x] Given varian dengan stok terbatas (≤ 3 pcs), when varian tersebut dipilih, then badge ketersediaan menampilkan `LOW STOCK — ONLY n LEFT`.
- [x] Given varian dengan stok 0, when diperiksa, then ukuran tersebut berstatus `disabled` (`line-through`) dan tombol berganti menjadi `OUT OF STOCK`.
- [x] Given aturan Clean Code `NFR-06`, when ukuran file diperiksa, then setiap komponen dan ViewModel berukuran ≤ 250 baris.

## 4. Desain Teknis (Pemetaan Frontend MVVM)

| Lapisan            | File/Modul                                                                     | Tanggung jawab                                                                                           |
| ------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Model/DTO          | `src/models/types/product.ts`, `src/models/domain/productRules.ts`             | Kontrak tipe `stockBySize`, rule murni `getProductStock`, `getStockStatus`                               |
| ViewModel          | `src/hooks/useProductDetailViewModel.ts`                                       | Derived stock status, validasi form ukuran, kuantitas clamp, interaksi galeri fullscreen                 |
| View (Organisms)   | `ProductInfoSection.tsx`, `ProductGallerySection.tsx`, `ProductDetailView.tsx` | Presentasi visual PDP, badge stok, swatch warna, selector ukuran aksesibel, akordeon spesifikasi, galeri |
| Server composition | `src/app/shop/[slug]/page.tsx`                                                 | `generateStaticParams`, SEO metadata, Schema.org JSON-LD, data related products                          |

## 5. Hasil Validasi

| Pemeriksaan         | Hasil  | Catatan                                                          |
| ------------------- | ------ | ---------------------------------------------------------------- |
| `pnpm lint`         | `PASS` | 0 error, 0 warning                                               |
| `pnpm format:check` | `PASS` | Seluruh file terformat rapi sesuai Prettier                      |
| `pnpm typecheck`    | `PASS` | Lulus `tsc --noEmit` tanpa error                                 |
| Batas ukuran file   | `PASS` | Seluruh file yang disentuh ≤ 250 baris (sesuai `NFR-06`)         |
| `pnpm build`        | `PASS` | Build Next.js 16 (Turbopack) sukses menghasilkan static page PDP |
