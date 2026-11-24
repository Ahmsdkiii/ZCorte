# Catalog Browse — Homepage, Dynamic Collections & Shop Catalog

| Metadata         | Nilai                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Slug             | `catalog-browse`                                                 |
| Status           | `IN_PROGRESS`                                                    |
| Lane             | `Lane A`                                                         |
| Owner            | `SIDQI (Frontend / Lane A)`                                      |
| Reviewer         | `DINO / KANEKA`                                                  |
| Branch / PR      | `feat/landing-page-showcase`                                     |
| Referensi PRD/FR | `prd/03-fr-customer.md` (`FR-001`, `FR-002`, `FR-003`), `FR-036` |
| Dibuat           | `2026-11-24`                                                     |
| Diperbarui       | `2026-11-24`                                                     |

## 1. Masalah dan Outcome

Homepage (`FR-001`) membutuhkan komposisi Server Component yang bersih (≤ 250 baris sesuai `NFR-06`), bebas dari sisa nama brand prototype (`APEX`), menampilkan **Brand Story & Local Craft ZCorté** (`FR-036`), merender Pinned Cinematic Story yang aman terhadap data kosong, menampilkan 3 koleksi utama (`ZCORTÉ TACTIX`, `APEXTIVE`, `ZCORTÉ OUTDOOR`), serta menampilkan katalog produk featured dengan fallback empty state yang jelas.

## 2. Scope

### In Scope (Subtask 1 — Landing Page & Showcase `FR-001`)

- Modularisasi `src/app/page.tsx` menjadi Server Component komposisi (< 150 baris) dengan mengekstrak organism `HomeHeroSection`, `HomeBrandStorySection`, dan `HomeCollectionsSection`.
- Migrasi seluruh copy identitas `APEX` → `ZCorté` pada Homepage dan `CinemaStoryPinned`.
- Penambahan 3 pilar **Brand Story & Local Craft** (`01 / Quiet Form`, `02 / Small-Batch Process`, `03 / Technical Materials`) beserta CTA ke `/about` pada section `#brand`.
- Penanganan empty state pada section Featured Arrivals (`products.length === 0`) dan penyembunyian `CinemaStoryPinned` apabila `steps.length === 0`.

### Out of Scope (Akan Dikerjakan pada Subtask Berikutnya)

- Penggabungan halaman koleksi dinamis `/collections/[slug]` (`FR-002` — Task Frontend #11).
- Halaman katalog filter/sort/pagination `/shop` (`FR-003` — Task Frontend #3).
- Penyambungan `productService` & `storyService` ke repository Prisma (setelah Task Backend #4 oleh DINO/KANEKA selesai di-merge).

### 2.3 Kontrak Bersama yang Disentuh

- [x] Tidak ada kontrak bersama yang berubah
- [ ] `prisma/schema.prisma`
- [ ] `ErrorCode` / `ActionResult`
- [ ] `AuthContext` / guard peran
- [ ] Environment variables (`src/config/env.ts`, `.env.example`)
- [ ] Design tokens (`src/app/globals.css`)

## 3. User Story dan Acceptance Criteria

**User story:** Sebagai pengunjung (Visitor/Customer), saya ingin melihat beranda ZCorté yang menampilkan hero editorial, cerita brand & kerajinan lokal, 3 koleksi utama, dan daftar produk unggulan sehingga saya memahami karakter brand dan dapat langsung menjelajahi produk.

- [x] Given pengguna membuka `/`, when halaman di-render, then seluruh 6 section (Hero, Brand Story & Craft, Pinned Story, Featured Collections, Featured Arrivals, Closing) tampil dengan identitas **ZCorté**.
- [x] Given halaman `/`, when diperiksa struktur HTML dan SEO-nya, then hanya terdapat tepat satu elemen `<h1>` dan JSON-LD `Organization` + `WebSite` ter-inject dengan benar.
- [x] Given daftar produk featured kosong (`products.length === 0`), when halaman di-render, then section Featured Arrivals menampilkan empty state dengan CTA menuju `/shop`.
- [x] Given `storySteps` kosong (`steps.length === 0`), when `CinemaStoryPinned` dipanggil, then komponen mengembalikan `null` tanpa merusak layout halaman.
- [x] Given aturan Clean Code `NFR-06`, when ukuran file diperiksa, then `src/app/page.tsx` dan setiap organism baru memiliki ukuran ≤ 250 baris.

## 4. Desain Teknis (Pemetaan Frontend MVVM)

| Lapisan            | File/Modul                                                                                                | Tanggung jawab                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Model/DTO          | `src/models/types/product.ts`, `src/models/types/story.ts`                                                | Kontrak tipe `Product` dan `StoryStep`                                                          |
| ViewModel          | `useProductCardViewModel`, `useQuickAddViewModel` (di dalam `ProductGridClient`)                          | Interaksi pemilihan warna dan Quick Add pada grid produk featured                               |
| View (Organisms)   | `HomeHeroSection.tsx`, `HomeBrandStorySection.tsx`, `HomeCollectionsSection.tsx`, `CinemaStoryPinned.tsx` | Presentasi visual tiap section beranda, aksesibilitas heading, dan animasi `ease-zcorte`        |
| Server composition | `src/app/page.tsx`                                                                                        | Mengambil `products` & `storySteps` secara paralel (`Promise.all`), JSON-LD, dan komposisi page |

## 5. File Terdampak

- `src/app/page.tsx` — Server Component komposisi beranda ZCorté.
- `src/components/organisms/HomeHeroSection.tsx` — Hero banner editorial dengan gambar LCP `priority` dan `<h1>`.
- `src/components/organisms/HomeBrandStorySection.tsx` — Section `#brand` dengan 3 pilar Local Craft EKRAF dan CTA `/about`.
- `src/components/organisms/HomeCollectionsSection.tsx` — Section `#collections` 3 kolom (`ZCORTÉ TACTIX`, `APEXTIVE`, `ZCORTÉ OUTDOOR`).
- `src/components/compound/CinemaStory/CinemaStoryPinned.tsx` — Pinned story dengan brand ZCorté dan guard `steps.length === 0`.
- `docs/features/catalog-browse.md` & `docs/features/README.md` — Dokumentasi fitur `catalog-browse`.

## 6. Hasil Validasi

| Pemeriksaan         | Hasil  | Catatan                                                           |
| ------------------- | ------ | ----------------------------------------------------------------- |
| `pnpm lint`         | `PASS` | 0 error, 0 warning                                                |
| `pnpm format:check` | `PASS` | Seluruh file terformat Prettier                                   |
| `pnpm typecheck`    | `PASS` | Lulus `tsc --noEmit`                                              |
| Batas ukuran file   | `PASS` | `src/app/page.tsx` dan seluruh organism < 150 baris (batas ≤ 250) |
| `pnpm build`        | `PASS` | Build production Next.js 16 berhasil                              |
