# Mulai di Sini — Peta Proyek ZCorté

Selamat datang di tim **ZeroCode**. Dokumen ini dirancang agar developer baru (dan AI agent yang dipakainya) memahami peta codebase, istilah, dan arsitektur **ZCorté** dalam waktu kurang dari 15 menit.

## 1. Urutan Baca Sesuai Peran

| Peran               | Baca Berurutan (Maks ~15 Menit)                                                                                                                                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Developer Baru**  | 1. [README.md](../../README.md) → 2. Dokumen ini → 3. [01-local-setup.md](01-local-setup.md) → 4. [docs/team/ownership.md](../team/ownership.md) (termasuk pembagian paralel `P1-A/B/C` & [.github/CODEOWNERS](../../.github/CODEOWNERS)) → 5. PRD FR lane Anda → 6. [02-feature-recipe.md](02-feature-recipe.md) |
| **Code Reviewer**   | 1. [CONTRIBUTING.md](../../CONTRIBUTING.md) → 2. `docs/features/<slug>.md` pada PR → 3. [AGENTS.md](../../AGENTS.md) (§5–§10)                                                                                                                                                                                     |
| **AI Coding Agent** | 1. [AGENTS.md](../../AGENTS.md) → 2. [05-ai-agent-guide.md](05-ai-agent-guide.md) → 3. `docs/features/<slug>.md` terkait → 4. PRD terkait                                                                                                                                                                         |

## 2. Peta Cepat PRD ("Cari Topik X → Buka File Y")

Tidak perlu membaca seluruh 19 file PRD sekaligus. Gunakan tabel ini:

| Topik yang Dicari                                                               | Dokumen & Bagian                                                               |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Visi produk, daftar seluruh FR, & Decision Register (`D-01` s.d. `D-16`)        | [prd/01-overview.md](../../prd/01-overview.md)                                 |
| Hak akses Visitor / Customer / Owner & diagram alur belanja/AI/Telegram         | [prd/02-roles-and-flows.md](../../prd/02-roles-and-flows.md)                   |
| Acceptance Criteria fitur Customer (`FR-001` s.d. `FR-013`)                     | [prd/03-fr-customer.md](../../prd/03-fr-customer.md)                           |
| Acceptance Criteria fitur Owner (`FR-020` s.d. `FR-027a/b`)                     | [prd/04-fr-owner.md](../../prd/04-fr-owner.md)                                 |
| Acceptance Criteria AI, Outfit, Size, EKRAF & Telegram (`FR-030` s.d. `FR-045`) | [prd/05-fr-innovation-telegram.md](../../prd/05-fr-innovation-telegram.md)     |
| Target pengerjaan MVP R0 & skenario demo 5 menit                                | [prd/07-mvp-prototype-plan.md](../../prd/07-mvp-prototype-plan.md)             |
| Arsitektur modular, Next.js 16 caching, & struktur folder target                | [prd/08-architecture.md](../../prd/08-architecture.md)                         |
| ERD, enum, field Order, `OrderSequence`, `RateLimitBucket`, & state machine     | [prd/10-database.md](../../prd/10-database.md)                                 |
| Kontrak `ActionResult<T>`, katalog `ErrorCode`, Server Actions & API routes     | [prd/11-api-spec.md](../../prd/11-api-spec.md)                                 |
| Spesifikasi Simulator & Bot Telegram                                            | [prd/12-telegram.md](../../prd/12-telegram.md)                                 |
| Spesifikasi AI Shopping Assistant & set uji prompt                              | [prd/13-ai-assistant.md](../../prd/13-ai-assistant.md)                         |
| Panduan UI/UX, state wajib, halaman & komponen                                  | [prd/14-ui-ux.md](../../prd/14-ui-ux.md)                                       |
| NFR, keamanan (`SEC-01`–`15`), dan strategi testing (`U.1`–`U.12`)              | [prd/15-quality-security-testing.md](../../prd/15-quality-security-testing.md) |
| Roadmap, manajemen risiko, & **Definition of Done tunggal (§Y)**                | [prd/16-roadmap-risk.md](../../prd/16-roadmap-risk.md)                         |
| Checklist migrasi brand `APEX` → `ZCorté`                                       | [prd/17-appendix.md](../../prd/17-appendix.md)                                 |

## 3. Glosarium Istilah Proyek

| Istilah                            | Arti di ZCorté                                                                                                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R0 (Competition MVP)**           | Target rilis utama saat ini: DB PostgreSQL + Prisma + Auth + transaksi stok nyata; payment/AI/Telegram memakai adapter simulasi lokal.                                |
| **R1 / R2**                        | **R1** = Connected Demo (provider AI, bot Telegram webhook, sandbox payment terhubung). **R2** = Production Readiness.                                                |
| **Visitor / Customer / Owner**     | Pengunjung tanpa login (**Visitor**, tidak bisa checkout), pembeli login (`CUSTOMER`), pemilik toko (`OWNER`).                                                        |
| **Lane (A / B / C)**               | Pembagian area kerja paralel untuk 3 developer ([docs/team/ownership.md](../team/ownership.md)).                                                                      |
| **FR & AC**                        | _Functional Requirement_ (`FR-001`–`FR-045`) dan _Acceptance Criteria_ yang dapat diuji.                                                                              |
| **MVVM Pragmatis**                 | Pemisahan frontend: **Model** (`src/models/` murni), **ViewModel** (`src/hooks/use*ViewModel.ts`), **View** (`src/components/`), **Server Composition** (`src/app/`). |
| **Service & Repository**           | `src/server/services/` (seluruh business logic, otorisasi, transaksi) dan `src/server/repositories/` (query Prisma eksplisit tanpa business logic).                   |
| **Adapter / Integration**          | `src/server/integrations/` — kontrak interface untuk provider eksternal yang bisa ditukar antara R0 (simulasi) dan R1 (nyata).                                        |
| **`ActionResult<T>` & `AppError`** | Kontrak error domain di server (`AppError`) dan bentuk respons standar Server Action/API ke client (`ActionResult<T>`).                                               |
| **`idempotencyKey` & `dedupeKey`** | Kunci pencegah duplikasi order pada checkout (`Order`) dan anti-spam notifikasi (`NotificationLog`).                                                                  |

## 4. Transisi Kode Prototype → Arsitektur Target (Wajib Dibaca!)

Kode awal di `src/` berasal dari fase prototype UI ("APEX") sebelum backend PostgreSQL ditambahkan. **Jangan menyalin pola lama yang melanggar aturan arsitektur baru.** Gunakan tabel berikut sebagai acuan saat menyentuh kode yang ada:

| Lokasi di Prototype Saat Ini                               | Masalah Terhadap Aturan Target                                                               | Target pada P1 / Implementasi                                                                                                                   |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/models/services/productService.ts`, `storyService.ts` | Melakukan fetch / fallback ke mock data di dalam folder `src/models/`                        | Pindah ke `src/server/services/product.service.ts` dan `story.service.ts`. Folder `src/models/` hanya boleh berisi tipe, rule murni, dan mapper |
| `src/models/api/httpClient.ts`                             | Transport HTTP di dalam `src/models/`                                                        | Dihapus setelah service layer membaca PostgreSQL via Prisma repository                                                                          |
| `src/models/data/*.mock.ts`                                | Data produk, koleksi, dan story statis di runtime                                            | Dipakai hanya sebagai data awal di `prisma/seed.ts` (CLI), lalu dihapus dari seluruh import aplikasi                                            |
| `src/components/providers/CartProvider.tsx`                | Memakai kunci `apex_cart_session_v2` dan menyimpan salinan objek `Product` di `localStorage` | Gunakan kunci `zcorte_cart_v1`; Visitor hanya menyimpan `variantId` + `quantity`, dan harga/stok selalu direvalidasi ke server                  |
| `src/hooks/useCheckoutViewModel.ts`                        | Menghasilkan nomor pesanan `APX-` di client dan simulasi `setTimeout`                        | Memanggil Server Action `placeOrder` dengan `idempotencyKey`; nomor pesanan `ZCT-YYMM-NNNN` dibuat atomik di server                             |
| `src/app/collections/{tactix,apextive,outdoor}/page.tsx`   | Tiga file halaman koleksi hampir identik (duplikasi kode)                                    | Digabung menjadi satu route dinamis `src/app/(storefront)/collections/[slug]/page.tsx` + `CollectionView`                                       |
| Brand `"APEX"` & `isConcept` di komponen                   | Identitas brand lama & label konsep                                                          | Dimigrasi ke **ZCorté** sesuai checklist [prd/17-appendix.md](../../prd/17-appendix.md) Lampiran B                                              |
