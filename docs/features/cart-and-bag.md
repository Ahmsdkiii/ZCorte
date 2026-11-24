# Shopping Bag & Quick Add — Cart Drawer, Stock Bounds & Session Persistence

| Metadata         | Nilai                                        |
| ---------------- | -------------------------------------------- |
| Slug             | `cart-and-bag`                               |
| Status           | `IN_PROGRESS`                                |
| Lane             | `Lane A`                                     |
| Owner            | `SIDQI (Frontend / Lane A)`                  |
| Reviewer         | `DINO / KANEKA`                              |
| Branch / PR      | `feat/cart-drawer-quickadd`                  |
| Referensi PRD/FR | `prd/03-fr-customer.md` (`FR-006`, `FR-005`) |
| Dibuat           | `2026-11-24`                                 |
| Diperbarui       | `2026-11-24`                                 |

## 1. Masalah dan Outcome

Drawer keranjang belanja (`CartDrawer.tsx`) dan modal _Quick Add_ (`QuickAddModal.tsx`) sebelumnya memuat identitas prototipe lama (`APEX`, disclaimer "Demo availability & no real order fulfillment") dan menggunakan kunci localStorage `apex_cart_session_v2`. Selain itu, kuantitas penambahan barang di keranjang belum dibatasi oleh ketersediaan stok fisik per varian, serta ukuran yang habis stok belum ditandai secara visual pada Quick Add modal.

Outcome yang dicapai pada task ini:

1. Migrasi kunci penyimpanan localStorage ke `zcorte_cart_v1` dengan auto-migration transparan dari `apex_cart_session_v2`.
2. Validasi batas kuantitas stok: `CartProvider` dan `useCartViewModel` membatasi kuantitas item di bag (rentang 1–10, `≤ availableStock`). Tombol penambahan kuantitas dinonaktifkan (`disabled`) saat kuantitas mencapai stok maksimal varian.
3. Quick Add modal terhubung ke data stok riil: Ukuran yang habis stok (`stock <= 0`) berstatus `disabled` dan bertanda `line-through`.
4. Pembersihan total copy dan disclaimer prototipe, digantikan oleh narasi resmi **ZCorté** ("_Crafted in Bandung, West Java &middot; Small-batch production_").
5. Aksesibilitas penuh (WCAG 2.2 AA): screen reader live-region (`aria-live="polite"`), semantic lists (`role="list"`, `role="listitem"`), serta penanganan dialog backdrop click dan Escape key.

## 2. Scope

### In Scope (Task Frontend #5 — `FR-006`)

- Migrasi localStorage key ke `zcorte_cart_v1` di `CartProvider.tsx`.
- Validasi kuantitas stok di `CartProvider.tsx`, `useCartViewModel.ts`, dan `useQuickAddViewModel.ts`.
- Indikator "MAX STOCK REACHED" di `CartDrawer.tsx` ketika kuantitas mencapai batas stok.
- Penandaan ukuran habis stok pada `QuickAddModal.tsx` via `sizesWithStock`.
- Pembersihan seluruh teks `APEX` pada `CartDrawer` dan `QuickAddModal`.
- Memperbarui `ProductGridClient.tsx` mengalirkan `currentStock` dan `stockStatus`.

### Out of Scope

- Sinkronisasi cart ke database via Server Actions (Task Backend #5 oleh DINO/KANEKA).
- Alur Checkout lengkap (`FR-007` — Task #6).

### 2.3 Kontrak Bersama yang Disentuh

- [x] Tidak ada kontrak bersama yang berubah
- [ ] `prisma/schema.prisma`
- [ ] `ErrorCode` / `ActionResult`
- [ ] `AuthContext` / guard peran
- [ ] Environment variables (`src/config/env.ts`, `.env.example`)
- [ ] Design tokens (`src/app/globals.css`)

## 3. User Story dan Acceptance Criteria

**User story:** Sebagai pengunjung (Visitor/Customer), saya ingin dapat menambahkan produk ke keranjang belanja secara cepat melalui Quick Add modal dan mengelola item di Cart Drawer dengan kuantitas yang dibatasi oleh stok yang tersedia, sehingga saya tidak memesan barang melebihi stok yang ada.

- [x] Given pengguna menambahkan item ke keranjang, when diperiksa di browser storage, then data tersimpan di key `zcorte_cart_v1`.
- [x] Given pengguna memiliki data keranjang di key lama `apex_cart_session_v2`, when aplikasi dibuka, then data dimigrasikan secara otomatis ke `zcorte_cart_v1` tanpa kehilangan item.
- [x] Given item di dalam keranjang, when kuantitas item mencapai batas stok varian (`currentStock`), then tombol penambahan kuantitas dinonaktifkan dan muncul indikator "MAX STOCK REACHED".
- [x] Given Quick Add modal, when salah satu ukuran habis stok (`stock === 0`), then tombol ukuran tersebut tidak dapat diklik (`line-through` & `aria-disabled="true"`).
- [x] Given aturan Clean Code `NFR-06`, when ukuran file diperiksa, then seluruh file yang disentuh berukuran ≤ 250 baris.

## 4. Desain Teknis (Pemetaan Frontend MVVM)

| Lapisan         | File/Modul                                                      | Tanggung jawab                                                                                       |
| --------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Model/DTO       | `src/models/types/cart.ts`, `src/models/domain/productRules.ts` | Kontrak tipe `CartItem`, fungsi `getProductStock`, `buildCartItemId`                                 |
| Provider        | `src/components/providers/CartProvider.tsx`                     | Manajemen state keranjang, migrasi localStorage `zcorte_cart_v1`, clamp kuantitas terhadap stok      |
| ViewModel       | `useCartViewModel.ts`, `useQuickAddViewModel.ts`                | Derived status batas stok per item (`getItemMaxStock`, `canIncreaseQuantity`), state Quick Add       |
| View (Compound) | `CartDrawer.tsx`, `QuickAddModal.tsx`                           | Presentasi visual drawer bag ZCorté, dialog modal aksesibel, seleksi warna/ukuran, kontrol kuantitas |

## 5. Hasil Validasi

| Pemeriksaan         | Hasil  | Catatan                                                  |
| ------------------- | ------ | -------------------------------------------------------- |
| `pnpm lint`         | `PASS` | 0 error, 0 warning                                       |
| `pnpm format:check` | `PASS` | Seluruh file terformat rapi sesuai Prettier              |
| `pnpm typecheck`    | `PASS` | Lulus `tsc --noEmit` tanpa error                         |
| Batas ukuran file   | `PASS` | Seluruh file yang disentuh ≤ 250 baris (sesuai `NFR-06`) |
| `pnpm build`        | `PASS` | Next.js 16 (Turbopack) build berhasil tanpa kendala      |
