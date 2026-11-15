# PRD — ZCorté Fashion E-Commerce Platform

| | |
|---|---|
| Tim | ZeroCode |
| Konteks | Kompetisi Clean Code Web Programming, subtema EKRAF |
| Versi | **1.2 — Baseline implementasi** |
| Tanggal | 15 November 2026 |
| Tumpukan utama | Next.js (App Router), React, TypeScript strict, Tailwind CSS |
| Sumber desain | Implementasi visual yang saat ini ada di repository; aset dan design token yang sah dipertahankan |
| Brand | **ZCorté** |
| Status dokumen | Siap menjadi baseline; keputusan operasional yang belum final dicatat eksplisit di D.4 |

## Ringkasan

ZCorté adalah toko fashion online **satu brand** dengan dua peran berakun (**Owner** dan **Customer**). Pengunjung dapat menjelajah, memakai asisten belanja, dan mengisi bag tanpa login; **checkout wajib login**. Pengiriman dilakukan toko sendiri dengan tarif tetap, sedangkan kurir dan resi diisi Owner. Pembeda utama produk adalah **AI Shopping Assistant** berbasis katalog nyata, **Telegram Business Assistant** khusus Owner, **Smart Outfit**, dan **Brand Story & Local Craft** untuk subtema EKRAF.

**Target pertama adalah Release 0 (R0) — Competition MVP** (bagian Z): core e-commerce memakai backend dan database nyata, sedangkan layanan eksternal (AI provider, payment gateway, dan Telegram Bot API) dijalankan melalui adapter simulasi. Dengan demikian autentikasi, otorisasi, transaksi stok, pesanan, audit, dan laporan tetap dapat diuji secara nyata tanpa bergantung pada jaringan.

### Hirarki sumber kebenaran

1. Dokumen ini menentukan scope, prioritas, release, dan keputusan produk.
2. Dokumen FR (`03`–`05`) menentukan perilaku serta acceptance criteria.
3. Dokumen teknis (`08`–`15`) menentukan kontrak implementasi.
4. Implementasi visual repository menjadi baseline UI. Brief historis seperti `redesain.md` tetap berguna sebagai referensi art direction, tetapi tidak menggantikan scope dan keputusan produk pada PRD ini.

## Keputusan Final

| Topik | Keputusan |
|---|---|
| Brand | **ZCorté** |
| Jenis toko | Satu brand, bukan marketplace |
| Peran | `OWNER` dan `CUSTOMER` (Visitor = pengunjung tanpa akun). Peran `STAFF` = Future |
| Checkout | **Wajib login**; Visitor boleh browse, AI (pertanyaan produk), dan bag |
| Pengiriman | Dilakukan toko sendiri; tarif tetap (Standard gratis, Express Rp45.000 dari prototype); Owner mengisi nama kurir + resi; pelanggan memakai tautan ke situs kurir |
| Data inti R0 | PostgreSQL + Prisma sebagai satu-satunya sumber data runtime, termasuk produk; `localStorage` hanya untuk bag Visitor dan preferensi UI non-sensitif |
| Pembayaran | R0 memakai adapter simulasi. Sandbox gateway hanya evaluasi R1; tanpa COD |
| AI | R0 memakai `ScriptedAssistant` yang memanggil service nyata; R1 dapat memakai provider AI dengan tools read-only |
| Telegram | R0 memakai Simulator Telegram khusus Owner; R1 memakai bot webhook read-only |
| Visual | Implementasi repository saat ini menjadi baseline; fitur baru mengikuti design token dan art direction yang sama |
| Akun | Owner dibuat lewat seed; registrasi publik selalu `CUSTOMER` |

## Model release

| Release | Tujuan | Ketergantungan eksternal |
|---|---|---|
| **R0 — Competition MVP** | Skenario demo end-to-end dan core backend nyata; katalog runtime selalu dibaca dari PostgreSQL | Tidak wajib; AI, payment, Telegram disimulasikan lewat adapter |
| **R1 — Connected Demo** | Menghubungkan AI provider, Telegram Bot API, dan bila perlu payment sandbox | Memerlukan akun/kunci API dan jaringan |
| **R2 — Production Readiness** | Hardening operasional, provider produksi, backup, observability, kebijakan privasi | Memerlukan keputusan bisnis dan infrastruktur produksi |

> **Aturan sumber data produk:** storefront dan seluruh service dilarang membaca `products.mock.ts`, JSON statis, atau file seed saat runtime. Script seed/bootstrap hanya boleh melakukan `INSERT/UPSERT` satu kali ke PostgreSQL untuk environment development/demo. Setelah data masuk, produk dikelola melalui Prisma dan halaman Owner; aplikasi hanya membaca tabel database.

## Cara membaca

**Fokus R0**: baca `01`, `02`, `03`, `04`, `05`, dan `07`, kemudian kontrak teknis `08`, `10`, `11`, dan `15`. Label asal fitur: **[P]** ada di prototype, **[P+]** ditingkatkan, **[R]** tambahan rekomendasi. Prioritas memakai MoSCoW. Nomor FR dikelompokkan per area (001–013 Customer, 020–027 Owner, 030–036 Inovasi, 040–045 Telegram).

## Daftar Dokumen

| File | Isi | Bagian |
|---|---|---|
| [01-overview.md](01-overview.md) | Product Overview & Scope | A–F: ringkasan produk, masalah, visi, persona, scope MVP. |
| [02-roles-and-flows.md](02-roles-and-flows.md) | Peran & Alur Pengguna | G dan J: peran, hak akses, dan alur. |
| [03-fr-customer.md](03-fr-customer.md) | Functional Requirements — Customer | H.1: FR-001 sampai FR-013. |
| [04-fr-owner.md](04-fr-owner.md) | Functional Requirements — Owner | H.2: FR-020 sampai FR-027. |
| [05-fr-innovation-telegram.md](05-fr-innovation-telegram.md) | Functional Requirements — Inovasi & Telegram | H.3 dan H.4: FR-030 sampai FR-045. |
| [06-innovation.md](06-innovation.md) | Inovasi & Prioritas | I: evaluasi ide, matriks prioritas, kombinasi untuk kompetisi. |
| [07-mvp-prototype-plan.md](07-mvp-prototype-plan.md) | Rencana R0 Competition MVP | Z: target pengerjaan pertama tanpa ketergantungan layanan eksternal. |
| [08-architecture.md](08-architecture.md) | Arsitektur Sistem & Struktur Proyek | N dan P. |
| [09-tech-stack.md](09-tech-stack.md) | Technology Stack | O. |
| [10-database.md](10-database.md) | Database & ERD | M. |
| [11-api-spec.md](11-api-spec.md) | API & Server Actions | Q. |
| [12-telegram.md](12-telegram.md) | Telegram Business Assistant | R. |
| [13-ai-assistant.md](13-ai-assistant.md) | AI Shopping Assistant | S. |
| [14-ui-ux.md](14-ui-ux.md) | UI/UX | K. |
| [15-quality-security-testing.md](15-quality-security-testing.md) | Non-Functional, Keamanan, Pengujian | L, T, U. |
| [16-roadmap-risk.md](16-roadmap-risk.md) | Roadmap, Risiko, Metrik, Definition of Done | V–Y. |
| [17-appendix.md](17-appendix.md) | Lampiran | Kriteria penilaian, migrasi brand, pertanyaan terbuka. |
| [18-prototype-analysis.md](18-prototype-analysis.md) | Analisis Prototype | 0. |

## Urutan baca untuk implementasi R0

1. `01-overview.md` dan `02-roles-and-flows.md`.
2. `03-fr-customer.md`, `04-fr-owner.md`, dan `05-fr-innovation-telegram.md`.
3. `07-mvp-prototype-plan.md`.
4. `08-architecture.md`, `10-database.md`, `11-api-spec.md`, dan `15-quality-security-testing.md`.
