# Foundation Database Schema

| Metadata         | Nilai                                                    |
| ---------------- | -------------------------------------------------------- |
| Slug             | `foundation`                                             |
| Status           | `IN_PROGRESS`                                            |
| Lane             | `P1 (Semua)`                                             |
| Owner            | `Backend Developer / Lane B`                             |
| Reviewer         | `Lead / developer lane lain`                             |
| Branch / PR      | `contract/foundation-prisma`                             |
| Referensi PRD/FR | `prd/10-database.md`, `prd/16-roadmap-risk.md`, `FR-010` |
| Dibuat           | `2026-11-24`                                             |
| Diperbarui       | `2026-11-28`                                             |

## 1. Masalah dan Outcome

Aplikasi membutuhkan sumber kebenaran PostgreSQL untuk akun, katalog, bag, pesanan, stok, pembayaran, audit, dan notifikasi. Outcome subtask ini adalah kontrak Prisma R0 yang tervalidasi dan dapat dimigrasikan secara repeatable tanpa mock runtime.

## 2. Scope

### In Scope

- Prisma datasource PostgreSQL dan Prisma Client generator.
- Model Auth.js, katalog, customer, order, inventory, notification, audit, dan infrastructure R0.
- Enum, relation, unique constraint, composite FK `(productId, colorId)`, index, GIN trigram index, functional unique index `COALESCE("size", 'ONE_SIZE')`, dan `CHECK` constraint SQL pada schema awal.
- Initial migration `foundation` pada database development lokal.
- Seed/bootstrap idempoten (`prisma/seed.ts`) untuk user demo (`OWNER`, `CUSTOMER`), koleksi, kategori, produk, warna, gambar (`.webp`/`.jpeg` + `CONTEXT`), varian, `InventoryMovement(INITIAL)`, `SizeChart`, `ProductRelation`, `StoryStep`, dan `StoreSetting`.
- Helper database server-only (`src/server/db/prisma.ts` dan `src/server/db/transaction.ts`).

### Out of Scope

- Auth.js adapter, session handler, dan guard (`P1-B`).
- Repository, service, action, dan API fitur.
- Data migration produksi atau backfill.

### 2.3 Kontrak Bersama yang Disentuh

- [ ] Tidak ada kontrak bersama yang berubah
- [x] `prisma/schema.prisma` (membutuhkan migration — lihat `docs/guides/03-database-workflow.md`)
- [x] `ErrorCode` / `ActionResult` (`src/server/lib/errors.ts`, `src/lib/action-result.ts`)
- [x] `AuthContext` / guard peran (`src/server/auth/*`)
- [x] Environment variables (`src/config/env.ts`, `.env.example`)
- [ ] Design tokens (`src/app/globals.css`) atau komponen lintas lane (`ProductCard`, `DataTable`, dll.)

## 3. User Story dan Acceptance Criteria

**User story:** Sebagai developer aplikasi, saya ingin model domain R0 tersimpan dalam PostgreSQL, sehingga fitur berikutnya dapat membaca dan mengubah data melalui Prisma.

- [x] Given database development lokal tersedia, when migration dijalankan, then seluruh tabel dan constraint R0 terbentuk.
- [x] Given schema Prisma, when `prisma validate` dan `prisma generate` dijalankan, then schema valid dan client berhasil dibuat.
- [x] Runtime source data tetap PostgreSQL melalui Prisma; tidak ada mock/seed fallback.
- [x] Seed demo dapat dijalankan berulang kali dengan `upsert` tanpa menggandakan record.

## 4. Alur Pengguna

Tidak ada user flow langsung. Alur teknisnya: schema Prisma → migration → PostgreSQL → Prisma Client untuk service pada subtask berikutnya.

## 5. Desain Teknis

### 5.1 Pemetaan Frontend MVVM

| Lapisan            | File/Modul                                                         | Tanggung jawab                                                                          |
| ------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Model/DTO          | `prisma/schema.prisma`, `src/lib/constants.ts`                     | Persistence model database serta konstanta identitas brand & navigasi terpusat ZCorté   |
| ViewModel          | `src/hooks/useHeaderViewModel.ts`                                  | State menu mobile (`isMenuOpen`), total item bag, serta handler dialog & cart drawer    |
| View               | `src/components/organisms/Header.tsx`, `Footer.tsx`, `globals.css` | Navbar responsif dengan Cart Counter badge (`aria-live`), Footer, & design tokens v4    |
| Server composition | `src/app/layout.tsx`                                               | RootLayout, font `Archivo` & `Geist`, metadata SEO/OpenGraph ZCorté, dan `CartProvider` |

### 5.2 Komposisi Komponen

- Atomic level yang digunakan: N/A.
- Compound Components: tidak.

### 5.3 Alur Backend

```text
Migration command → Prisma migration engine → PostgreSQL
                                      └────→ Prisma Client generation
Service → `src/server/db/transaction.ts` → `src/server/db/prisma.ts` → PostgreSQL
```

- Boundary dan validator: N/A.
- Service/use case: Service berikutnya mengimpor `prisma` dari `src/server/db/prisma.ts`.
- Authorization: N/A.
- Transaction boundary: Service memiliki boundary; `withTransaction` meneruskan typed `Prisma.TransactionClient`.
- Idempotency/concurrency: Migration diberi nama dan checksum Prisma; operasi bisnis berikutnya memakai transaction service.
- Domain/audit event: N/A.

### 5.4 Data dan Migration

- Model/field/constraint/index: seluruh model R0 pada `prisma/schema.prisma`, termasuk unique key akun, SKU, order, idempotency, cart, wishlist, review, notification, serta index katalog/order/stok.
- Migration/backfill: initial migration tanpa backfill karena database development masih foundation.
- Kompatibilitas data lama: tidak ada data aplikasi lama yang dipertahankan.
- Rollback atau forward-fix: migration belum di-merge; perubahan dilakukan dengan menghapus migration lokal dan generate ulang. Setelah merge, hanya forward-fix.
- Sumber data runtime: PostgreSQL melalui Prisma; tidak ada mock/seed fallback.

### 5.5 Kontrak API/Action

Tidak ada API atau Server Action pada subtask ini.

## 6. Security dan Privacy

- Authentication dan authorization: belum berlaku; akan diterapkan pada boundary/service berikutnya.
- Validasi/sanitasi input: constraint database dan validator fitur berikutnya.
- Data sensitif dan redaction log: token/password hash disimpan hanya pada field server-side; migration tidak memuat data.
- Rate limit/abuse prevention: model `RateLimitBucket` disediakan untuk subtask berikutnya.
- Threat/negative case utama: koneksi hanya diarahkan ke database development lokal melalui environment variable yang tidak di-commit.

## 7. Performance, Cache, dan Reliability

- Query dan index yang relevan: index status/featured, stock, order history, notification retry, dan foreign key access pattern.
- Strategi cache serta invalidasi: belum berlaku.
- Batas payload/pagination: diterapkan pada repository/query fitur berikutnya.
- Timeout/retry/deduplication: dedupe database tersedia untuk order, payment, notification, wishlist, dan review.
- Risiko race condition dan mitigasi: constraint unique dan stock check lanjutan akan dipakai service transaksi.

## 8. Error dan Edge Cases

- Input tidak valid: ditangani validator boundary fitur berikutnya dan constraint database.
- Belum login/role salah/resource bukan milik pengguna: ditangani auth/service fitur berikutnya.
- Data tidak ditemukan atau sudah berubah: ditangani repository/service fitur berikutnya.
- Stok habis/duplicate submit/concurrent update: unique constraint dan conditional stock update pada checkout.
- Database/provider gagal atau timeout: dipetakan ke error terkontrol pada server layer berikutnya.

## 9. Test Plan

### Unit

- [ ] Business rule belum ada pada subtask schema.

### Integration

- [ ] Prisma validate dan generate.
- [ ] Migration terhadap PostgreSQL development lokal.
- [ ] Constraint/index database diverifikasi pada repository/service berikutnya.

### E2E dan UI

- [ ] Tidak relevan pada subtask schema.

## 10. File Terdampak

- `prisma/schema.prisma` — kontrak model persistence R0.
- `prisma/migrations/` — initial migration PostgreSQL.
- `prisma/seed.ts` — bootstrap demo idempotent untuk user dan katalog.
- `.env.example` — placeholder password seed development.
- `package.json`, `pnpm-lock.yaml` — dependency `bcryptjs`.
- `src/server/db/prisma.ts` — Prisma Client singleton server-only.
- `src/server/db/transaction.ts` — helper transaction typed.
- `src/lib/action-result.ts` — kontrak `ActionResult<T>` dan katalog `ErrorCode`.
- `src/server/lib/errors.ts` — `AppError`, status mapping, dan sanitasi error.
- `src/config/env.ts` — parsing environment server melalui Zod.
- `src/config/env-schema.ts` — schema environment yang dapat diuji tanpa boundary server-only.
- `src/app/globals.css` — design tokens Tailwind CSS v4 (`--ease-zcorte`, `--color-cinematic-border`, status tokens).
- `src/lib/constants.ts` — identitas brand `ZCorté` dan item navigasi terpusat.
- `src/app/layout.tsx` — RootLayout dan metadata SEO/OpenGraph ZCorté.
- `src/hooks/useHeaderViewModel.ts` — ViewModel header (state `isMenuOpen`, `totalCount`, dialog controls).
- `src/components/organisms/Header.tsx` — Navbar responsif dengan Cart Counter badge & `aria-expanded` WCAG 2.2 AA.
- `src/components/organisms/Footer.tsx` — Footer editorial ZCorté berbasis token & konstanta terpusat.
- `docs/features/foundation.md` — dokumentasi implementasi foundation.

## 11. Hasil Validasi

| Pemeriksaan         | Hasil  | Catatan                                                                                                             |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| `pnpm lint`         | `PASS` | Lulus.                                                                                                              |
| `pnpm format:check` | `PASS` | Lulus.                                                                                                              |
| `pnpm typecheck`    | `PASS` | Lulus.                                                                                                              |
| Test relevan        | `PASS` | `prisma validate`, `prisma generate`, migration lokal, seed dua kali, verifikasi count, dan helper DB terkompilasi. |
| `pnpm build`        | `PASS` | Lulus.                                                                                                              |
| `pnpm test`         | `PASS` | 9 unit test untuk rate-limit, error contract, dan env schema.                                                       |

## 12. Keputusan dan Risiko Tersisa

- Keputusan penting: semua uang memakai integer minor unit rupiah; data shipping address dan metadata memakai JSON; Auth.js model disiapkan sejak initial schema.
- Trade-off: schema initial mencakup entitas R0 agar migration tidak terpecah lintas lane, meskipun sebagian model baru dipakai pada fitur berikutnya.
- Risiko tersisa: integrasi Auth.js (`P1-B`) serta migrasi service layer katalog (`Lane A`) masih berada pada subtask/PR berikutnya.
