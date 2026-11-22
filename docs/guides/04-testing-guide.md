# Panduan Pengujian (Testing Guide)

Dokumen ini menjelaskan strategi pengujian ZCorté sesuai [AGENTS.md §12](../../AGENTS.md) dan [prd/15-quality-security-testing.md §U](../../prd/15-quality-security-testing.md).

> **Status Tooling Saat Ini:** Harness `Vitest` (`pnpm test`) dan `Playwright` (`pnpm test:e2e`) ditambahkan pada fase **Foundation P1**. Saat ini script yang aktif adalah `pnpm check` (`lint` + `format:check` + `typecheck`) dan `pnpm build`. Jangan pernah mengklaim test telah lulus sebelum tool dan skenarionya benar-benar dijalankan.

## 1. Piramida Pengujian ZCorté

| Lapisan                 | Alat                                   | Lokasi File                      | Target & Aturan                                                                                                                                                                                                                               |
| ----------------------- | -------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Static Checks**       | ESLint, Prettier, `tsc`, JSCPD, `knip` | Konfigurasi root                 | `pnpm check` & `pnpm build` wajib hijau di setiap PR                                                                                                                                                                                          |
| **Unit Test**           | Vitest                                 | `tests/unit/**/*.test.ts`        | Aturan domain murni (`productRules`, `orderRules`, perhitungan harga/diskon, `OutfitService`, `SizeService`, validator Zod, `dedupeKey`, formatter Telegram). Cepat & tanpa DB                                                                |
| **Integration Test**    | Vitest + PostgreSQL (`db-test`)        | `tests/integration/**/*.test.ts` | Service + Repository terhadap PostgreSQL nyata (`DATABASE_URL_TEST` di port `5433`): transaksi `placeOrder`, balapan stok, idempotensi, otorisasi/IDOR, akurasi `ReportService` lintas zona waktu `Asia/Jakarta`, keamanan Simulator Telegram |
| **E2E & Accessibility** | Playwright + `@axe-core/playwright`    | `tests/e2e/**/*.spec.ts`         | Alur kritis R0 (browse → bag → login → checkout → bayar simulasi → Owner proses/kirim → Simulator Telegram), uji 5 viewport (320, 390, 768, 1024, 1440 px), keyboard focus, 0 error axe _serious/critical_                                    |

## 2. Isolasi Test Database (`db-test`)

- **Dilarang mocking Prisma Client** untuk menguji transaksi atau pengurangan stok. Perilaku `CHECK (stock >= 0)`, unique constraint, dan concurrent update harus diuji pada PostgreSQL sungguhan.
- Jalankan container test database terpisah dari database dev:

```bash
docker compose up -d db-test
```

- Database `db-test` berjalan di port **`5433`** memakai `tmpfs` (RAM) sehingga sangat cepat dan bersih dari data development.

## 3. Matriks "Ubah Apa → Wajib Uji Apa"

| Jenis Perubahan                                                              | Pengujian Minimum yang Wajib Ditambahkan/Dijalankan                                                                                      |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Ubah rule domain (`src/models/domain/`) atau validator (`src/validators/`)   | Unit test happy path + boundary + invalid input                                                                                          |
| Ubah Server Action, Service, atau Repository (`src/actions/`, `src/server/`) | Integration test terhadap `db-test` mencakup happy path, otorisasi ditolak (401/403/404 IDOR), konflik stok/state (409), dan idempotensi |
| Ubah skema database (`prisma/schema.prisma`)                                 | Verifikasi migration pada DB bersih + test constraint/race condition                                                                     |
| Ubah UI/ViewModel (`src/components/`, `src/hooks/`, `src/app/`)              | State loading/empty/error/success, navigasi keyboard, responsive 320–1440 px, dan E2E flow terkait bila memengaruhi alur utama           |
| Perbaikan bug                                                                | Regression test yang gagal sebelum perbaikan dan lulus setelah perbaikan                                                                 |

## 4. Kepemilikan Test per Lane

- **Lane A:** Unit test rule produk/cart, integration test auth/cart merge/search/alamat/wishlist, E2E browsing → PDP → bag → login.
- **Lane B:** Integration test `placeOrder` concurrent race condition, `cancelMyOrder`, `retryPayment`, `expireDueOrders`, `InventoryMovement` invariant, `ReportService` boundary `23:59` vs `00:01 WIB`, otorisasi `/admin/*`.
- **Lane C:** Set uji AI ≥ 40 prompt (`§S.7`), uji otorisasi & akurasi Simulator Telegram (`§U.8–U.9`), harness E2E end-to-end demo 5 menit, dan suite a11y + 5-viewport Playwright.

## 5. Cara Menjalankan (Target Setelah P1)

```bash
# Sebelum P1 (aktif sekarang):
pnpm check
pnpm build

# Setelah P1 (akan dikonfigurasi di package.json):
pnpm test                              # seluruh unit + integration test
pnpm test tests/unit/orderRules.test   # jalankan satu file test saja
pnpm test:e2e                          # seluruh skenario Playwright
```
