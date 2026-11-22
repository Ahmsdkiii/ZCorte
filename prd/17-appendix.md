# Lampiran

> Kriteria penilaian, migrasi brand, pertanyaan terbuka.  
> ← [Daftar dokumen](README.md)

## Lampiran A — Pemetaan Kriteria Penilaian ke Persyaratan

| Kriteria (bobot)                | Bukti dalam PRD                                                                                                                                                         | Pemeriksaan             |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Clean Code & Arsitektur (35%)   | Struktur folder (§P), aturan layer ESLint, service layer tunggal (§N), route koleksi dinamis (G8), `DataTable`/`FormField` generik, JSCPD ≤ 3%, knip, NFR-05/06, DoD §Y | CI otomatis             |
| Inovasi & Subtema (25%)         | AI Assistant jujur-data, Telegram Business Assistant, Brand Story & Local Craft (EKRAF), Outfit/Size transparan (§I)                                                    | Demo skenario §F.3      |
| UI/UX & Responsif (20%)         | Mengikuti prototype editorial, state lengkap (§K.4), 5 viewport (§U.5), a11y                                                                                            | Playwright + Lighthouse |
| Fungsionalitas & Performa (20%) | Alur Must end-to-end, transaksi atomik, laporan akurat, NFR-01–03                                                                                                       | E2E + Lighthouse        |

## Lampiran B — Checklist Migrasi Brand "APEX" → **ZCorté**

> D-01 sudah diputuskan. Ganti identitas brand secara terkontrol; jangan mengubah fakta produk atau menghapus disclaimer aset sebelum hak pakainya jelas.

| Lokasi di prototype                                       | Isi lama                                                                                  | Tindakan                                                                               |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `lib/constants.ts`                                        | `SITE_NAME = "APEX"`, `SITE_TAGLINE`, `SITE_DESCRIPTION`, `SITE_URL` (domain demo)        | Ganti nama; tagline/deskripsi tetap kecuali menyebut brand lama; URL → env             |
| `Header.tsx`, `Footer.tsx`                                | Logotype teks "APEX", `aria-label="APEX home"`, "© 2026 APEX", disclaimer concept imagery | Ganti menjadi ZCorté; disclaimer hanya dihapus bila hak aset jelas (R-12)              |
| `collections.mock.ts` / DB                                | `APEX TACTIX`, `APEXTIVE`, `APEX OUTDOOR`                                                 | D-02                                                                                   |
| `products.mock.ts`                                        | `CONCEPT_NOTE` ("A design study for the APEX system…")                                    | Ganti/hapus (G3)                                                                       |
| `stories.mock.ts`, `CinemaStoryPinned.tsx`                | "GENERATED CONCEPT STUDY / APEX"                                                          | Ganti nama brand                                                                       |
| `app/page.tsx`, halaman koleksi                           | Eyebrow "THE APEX SYSTEM / CONCEPT CATALOG", dll.                                         | Ganti kemunculan nama brand saja                                                       |
| `CartProvider.tsx`                                        | `apex_cart_session_v2`                                                                    | Migrasikan ke `zcorte_cart_v1`; baca kunci lama satu kali bila bag perlu dipertahankan |
| `useCheckoutViewModel.ts`                                 | Prefiks nomor pesanan `APX-`                                                              | Pindah ke server; default prefiks `ZCT-`, dapat dikonfigurasi                          |
| `lib/metadata.ts`, `jsonLd.ts`, `sitemap.ts`, `robots.ts` | Nama/URL/gambar OG                                                                        | Ambil dari config                                                                      |
| `public/images/apex/`                                     | Nama folder                                                                               | Rename hanya jika seluruh referensi dan cache aman; bukan syarat fungsional            |
| `package.json`, `README`                                  | `apex-prototype`                                                                          | Ganti menjadi nama paket ASCII, mis. `zcorte-store`                                    |
| CSS (`globals.css`)                                       | `--ease-apex`, nama token berprefiks apex                                                 | Ganti nama token                                                                       |

## Lampiran C — Pertanyaan Terbuka

| ID   | Pertanyaan                                                                                | Dampak                                                                                         |
| ---- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| D-06 | Target deploy R0/R1: Vercel atau VPS?                                                     | Scheduler, DB connection, dan mekanisme background                                             |
| D-07 | Apa bunyi resmi subtema EKRAF dan bukti apa yang diminta juri?                            | Narasi Brand Story dan demo                                                                    |
| D-08 | Kapan tenggat, siapa nama lengkap & username GitHub 3 anggota tim ZeroCode?               | Struktur 3 lane sudah ditetapkan di `docs/team/ownership.md`; tenggat & nama masih perlu diisi |
| D-09 | Bolehkah menambah produk/foto di luar enam produk awal, dan bagaimana bukti hak pakainya? | Kualitas Outfit/Assistant dan risiko aset                                                      |
| D-11 | Siapa penulis dan approver konten Brand Story?                                            | Akurasi klaim                                                                                  |
| D-12 | Apa posisi faktual ZCorté dalam ekosistem EKRAF?                                          | Copy, badge, dan presentasi juri                                                               |

> Teks brief yang diterima sebelumnya terpotong pada bagian akhir §17 ("Memiliki prior…"). PRD mengasumsikan butir tersebut meminta prioritas dan roadmap, yang telah dicakup §F.1, §I.3, dan §V. Cocokkan kembali dengan buku panduan resmi.

## Lampiran D — Traceability minimum R0

| Capability                       | FR                      | Lane       | Service utama                                                                         | Data utama                        | Bukti uji                 |
| -------------------------------- | ----------------------- | ---------- | ------------------------------------------------------------------------------------- | --------------------------------- | ------------------------- |
| Browse dan pilih varian          | FR-001–006              | Lane A     | `ProductService`, `CartService`                                                       | Product/Variant/Cart              | E2E katalog→bag           |
| Checkout, batal & bayar simulasi | FR-007–008              | Lane B     | `OrderService`, `InventoryService`, `PaymentService`                                  | Order/Payment/Movement            | Integrasi transaksi + E2E |
| Tracking pelanggan               | FR-009–010              | Lane A / B | `OrderService`, Auth guard                                                            | Order/History/User                | E2E + IDOR                |
| Operasional Owner                | FR-020/023/024/027a/044 | Lane B     | `ReportService`, `InventoryService`, `OrderService`, `SettingService`, `AuditService` | Order/Movement/StoreSetting/Audit | Integrasi + E2E Owner     |
| Asisten belanja                  | FR-030/031              | Lane C     | `AssistantService`, `ProductService`                                                  | Product/Order milik user          | Set prompt §S.7           |
| Cerita EKRAF                     | FR-036                  | Lane C     | `StoryService`, `SettingService`                                                      | StoreSetting/StoryStep            | Review konten + a11y      |
| Simulator Telegram               | FR-041/042              | Lane C     | `ReportService`, `NotificationService`                                                | Report DTO/NotificationLog        | Akurasi §U.9              |

_— Akhir dokumen —_
