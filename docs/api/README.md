# Panduan Testing Backend & Pemeliharaan API Collection (Postman / Apidog)

Folder ini menyimpan koleksi resmi pengujian endpoint HTTP/REST ZCorté ([`zcorte.postman_collection.json`](zcorte.postman_collection.json)) yang mengacu pada kontrak [prd/11-api-spec.md](../../prd/11-api-spec.md). File JSON tersebut menggunakan standar **Postman Collection v2.1** sehingga kompatibel 100% saat di-import ke **Postman**, **Apidog**, **Bruno**, maupun ekstensi **Thunder Client** di VS Code.

---

## 1. Aturan Wajib Tim (SOP Pembaruan Collection)

Agar pengujian backend selalu sinkron bagi **SIDQI**, **DINO**, dan **KANEKA**:

1. **Setiap PR yang menambah atau mengubah Route Handler (`src/app/api/**/route.ts`) WAJIB memperbarui [`docs/api/zcorte.postman_collection.json`](zcorte.postman_collection.json) dan tabel status di dokumen ini pada PR yang sama.**
2. Hal yang wajib diperbarui saat mengubah endpoint:
   - Path URL, query params (`?q=...`), dan HTTP Method (`GET`, `POST`, dll.).
   - Header wajib (mis. `Origin`, `Authorization: Bearer {{cronSecret}}`, `X-Telegram-Bot-Api-Secret-Token`).
   - Contoh payload request JSON (`body.raw`) yang valid sesuai schema Zod di `src/validators/`.
   - Mengubah kolom **Status Implementasi** pada tabel §4 di bawah menjadi `READY`.
3. Saat melakukan Code Review, reviewer wajib menolak PR endpoint `/api/*` apabila perubahan kontraknya belum tercermin di `zcorte.postman_collection.json`.

---

## 2. Cara Import & Pakai di Postman / Apidog / Thunder Client

1. Buka aplikasi **Postman**, **Apidog**, **Bruno**, atau **Thunder Client (VS Code)**.
2. Klik **Import** → pilih file [`docs/api/zcorte.postman_collection.json`](zcorte.postman_collection.json) dari folder repository Anda.
3. Pastikan server lokal sedang berjalan (`pnpm dev` di `http://localhost:3000`).
4. Sesuaikan **Collection Variables** bila diperlukan:
   - `baseUrl`: `http://localhost:3000` (default)
   - `variantId`: salin salah satu `id` dari tabel `product_variants` (bisa dilihat lewat `pnpm db:studio` atau DBeaver)
   - `orderNumber`: nomor pesanan yang ingin diuji (mis. `ZCT-2611-0001`)
   - `cronSecret`: samakan dengan nilai `CRON_SECRET` di file `.env` Anda

> **Catatan Header `Origin` untuk Endpoint `POST` Berbasis Sesi:**
> Sesuai aturan keamanan CSRF di [AGENTS.md §10](../../AGENTS.md), Route Handler yang menerima mutasi berbasis cookie memeriksa header `Origin`/`Host`. Pada collection ini, header `Origin: {{baseUrl}}` sudah dipasang otomatis.

---

## 3. Cara Menguji Backend: Route Handlers (`/api/*`) vs Server Actions (`src/actions/*`)

Arsitektur Next.js 16 ZCorté membagi backend menjadi 2 lapisan dengan cara uji sebagai berikut:

| Jenis Backend                                                                                                                              | Lokasi Kode                                                     | Cara Testing Sebelum UI Frontend Selesai                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. HTTP Route Handlers** (Search, Cart Validate, AI Chat, Webhook, Cron, Health)                                                         | `src/app/api/**/route.ts`                                       | Tembak langsung lewat **Postman / Apidog** menggunakan [`zcorte.postman_collection.json`](zcorte.postman_collection.json).                                                                                                        |
| **2. Server Actions & Service Layer** (`placeOrder`, `cancelMyOrder`, `adminSaveProduct`, `adminAdjustStock`, `simulatorRunCommand`, dll.) | `src/server/services/*.service.ts` & `src/actions/*.actions.ts` | Jalankan **Integration Test Vitest (`pnpm test`)** yang memanggil fungsi service langsung ke PostgreSQL (`db-test` port `5433`), lalu inspeksi hasil tabelnya di **Prisma Studio (`pnpm db:studio`)** atau **DBeaver / pgAdmin**. |

> **Mengapa Server Actions tidak di-expose sebagai REST endpoint `/api/*` tambahan?**
> Sesuai [prd/11-api-spec.md](../../prd/11-api-spec.md) baris 75, mutasi form UI memakai Next.js Server Actions dengan kontrak tunggal `ActionResult<T>` agar permukaan serangan HTTP publik tetap minimal dan tipe TypeScript ujung-ke-ujung terjaga.

---

## 4. Registry Status Endpoint `/api/*`

Perbarui kolom **Status** (`PLANNED` → `IN_PROGRESS` → `READY`) dan **PR / PIC** setiap kali endpoint selesai dibuat:

| Method & Route                  | Tujuan                                                | Auth            | Lane       | Status    | PIC / PR |
| ------------------------------- | ----------------------------------------------------- | --------------- | ---------- | --------- | -------- |
| `GET /api/health`               | Cek status aplikasi & koneksi PostgreSQL              | Publik          | P1 / Semua | `PLANNED` | —        |
| `GET /api/products/search`      | Saran pencarian produk (`ILIKE` + trigram)            | Publik          | Lane A     | `PLANNED` | —        |
| `POST /api/cart/validate`       | Revalidasi harga & stok guest bag dari DB             | Publik / User   | Lane A     | `PLANNED` | —        |
| `GET /api/orders/[orderNumber]` | Detail pesanan milik pengguna (anti-IDOR)             | User Login      | Lane B     | `PLANNED` | —        |
| `GET /api/admin/reports/sales`  | Deret waktu grafik penjualan dashboard Owner          | Owner (`OWNER`) | Lane B     | `PLANNED` | —        |
| `POST /api/payments/webhook`    | Callback payment gateway (R1)                         | Signature       | Lane B     | `PLANNED` | —        |
| `POST /api/ai/chat`             | Chat AI Shopping Assistant (`ScriptedAssistant` / AI) | Publik / User   | Lane C     | `PLANNED` | —        |
| `POST /api/cron/expire-orders`  | Kedaluwarsa pesanan jatuh tempo & lepas stok          | `CRON_SECRET`   | Lane B / C | `PLANNED` | —        |
| `POST /api/cron/daily`          | Laporan harian terjadwal Telegram                     | `CRON_SECRET`   | Lane C     | `PLANNED` | —        |
| `POST /api/telegram/webhook`    | Webhook update Telegram Bot (R1)                      | Secret Token    | Lane C     | `PLANNED` | —        |
