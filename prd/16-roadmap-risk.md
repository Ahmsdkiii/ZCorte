# Roadmap, Risiko, Metrik, Definition of Done

> Bagian V–Y.  
> ← [Daftar dokumen](README.md)

## V. Development Roadmap

> Tanggal belum ditetapkan karena D-08 masih terbuka. Estimasi memakai **hari-orang** dan harus dikalibrasi melalui satu vertical slice pertama. Jangan menganggap pekerjaan `L` selesai dalam satu sprint tanpa memecahnya menjadi task yang dapat diuji.

| Fase | Fokus | Item utama | Ukuran | Dependensi | Deliverable | Risiko |
|---|---|---|---|---|---|---|
| **0 — Keputusan** | D-06–D-12 | Tenggat, kapasitas, subtema, konten, aset, hosting | 0.5–1 | — | Decision Register diperbarui | Keputusan konten terlambat |
| **1 — Foundation** | Core server | Prisma/PostgreSQL, migration/bootstrap DB, Auth.js, guard, error model, env, CI, quality gates, rename ZCorté | 3–5 | Fase 0 | Login demo + katalog dibaca eksklusif dari DB; CI hijau | Migrasi tipe dan versi library |
| **2 — Vertical Slice Order** | FR-003–010 | PDP, guest bag, merge cart, checkout, transaksi stok, payment simulator, order detail | 5–8 | Fase 1 | Customer membuat dan membayar order simulasi | Balapan stok/idempotensi |
| **3 — Owner Operations** | FR-020/023/024/044 | Dashboard minimum, inventory, order state, kurir/resi, audit | 4–6 | Fase 2 | Owner memproses order; laporan akurat | Scope dashboard melebar |
| **4 — Competition Story** | FR-030/031/033/036/041/042 | Scripted Assistant, Outfit minimum, Brand Story, Simulator Telegram | 4–6 | Fase 2–3 | Skenario demo ≤ 5 menit | Konten/aset demo belum siap |
| **5 — Hardening R0** | §U + NFR | E2E, otorisasi, akurasi laporan, a11y, responsive, performa, seed/reset, rehearsal | 3–5 | Fase 4 | Bug kritis 0; bukti pengujian | QA dilakukan terlalu akhir |
| **6 — R1 Opsional** | FR-040/043 + provider | AI provider, bot webhook, scheduler, payment sandbox/storage bila dibutuhkan | Estimasi setelah PoC | R0 stabil | Connected demo tanpa mengubah core | Akun, biaya, kuota, jaringan |

**Urutan pemangkasan:** koneksi R1 → scheduled report → personalisasi/review/promosi → Smart Size → wishlist/customer management → CRUD master data lengkap → Outfit versi lengkap. Jangan memangkas Brand Story, vertical slice order, guard server, transaksi stok, audit inti, akurasi laporan, atau pengujian otorisasi.

**Definition of Done per fase:** semua FR fase ber-AC lulus; CI hijau (lint 0 warning, typecheck, jscpd ≤ 3%, knip bersih, unit+integrasi, build); tanpa bug kritis terbuka; dokumentasi singkat diperbarui; demo internal berhasil.

## W. Risk & Technical Considerations

| ID | Risiko | Dampak | Kemungkinan | Mitigasi |
|---|---|---|---|---|
| R-01 | Halusinasi/ketidakakuratan AI R1 | Reputasi, nilai inovasi | Sedang | Kartu dari DB, post-check angka, tools read-only, set uji (§S) |
| R-02 | Biaya/kuota/latensi API AI | Connected demo gagal | Sedang | R0 scripted; R1 memakai cap, timeout, fallback, dan model stub |
| R-03 | Akses Telegram tidak sah | Kebocoran data bisnis | Rendah–Sedang | Secret webhook, allowlist DB, chat private, audit, cabut instan |
| R-04 | Spam notifikasi | Owner mengabaikan bot | Sedang | Kebijakan event + dedupe + rate global |
| R-05 | Oversell / balapan stok | Pesanan tak terpenuhi | Sedang | Update atomik `stock >= n`, constraint `CHECK`, uji balapan |
| R-06 | Provider pembayaran tidak tersedia/ditolak/berbiaya | Connected demo tidak berjalan | Sedang | R0 selalu memakai adapter simulasi; vendor hanya R1 |
| R-07 | Scheduler tidak sesuai hosting | Laporan tak terkirim | Sedang | Tiga opsi (§R.5), endpoint idempoten |
| R-08 | Duplikasi kode dari halaman koleksi/admin | Skor clean code turun | Sedang | Route dinamis, primitive tabel/form, JSCPD ≤ 3% sejak awal |
| R-09 | Dua jalur implementasi mock vs produksi | Rework pada auth/data/transaksi | Rendah setelah revisi | Core selalu DB nyata; hanya integrasi eksternal memakai adapter |
| R-10 | Perubahan perilaku versi Next.js/Auth.js/cache | Bug halus | Sedang | Kunci versi, cek dokumentasi versi yang dipakai, uji build dan auth |
| R-11 | Enam produk membuat Outfit/Assistant terasa lemah | Demo kurang meyakinkan | Tinggi | R0 sederhanakan slot ke top/bottom/outer/accessory; tambah 12–24 produk hanya bila D-09 dan hak aset selesai |
| R-12 | Hak cipta/ lisensi gambar & klaim "concept imagery" pada prototype | Masalah legal | Sedang | Pastikan hak pakai aset sebelum publikasi; hapus disclaimer hanya bila aset sah |
| R-13 | Privasi pada personalisasi/log AI | Kepatuhan | Rendah | Opt-in, mask PII, retensi, hapus data |
| R-14 | Cakupan terlalu luas untuk waktu kompetisi | Fitur setengah jadi | Tinggi | R0 vertical slice, budget hari-orang, urutan pemangkasan §V |
| R-15 | Klaim Brand Story tidak terverifikasi | Risiko reputasi/subtema | Sedang | D-11/D-12 wajib ditutup; hanya gunakan klaim yang disetujui |
| R-16 | Event notifikasi hilang setelah transaksi | Owner tidak mendapat informasi | Rendah–Sedang | `NotificationLog(PENDING/SENT/FAILED)`, retry R1, uji kegagalan transport |

## X. Success Metrics

| Metrik | Target | Cara ukur |
|---|---|---|
| Alur belanja end-to-end lulus E2E | 100% skenario Must | Playwright |
| Bug kritis saat demo | 0 | Uji regresi akhir |
| Skor kualitas kode | ESLint 0/0, JSCPD ≤ 3%, knip bersih, TS strict | CI |
| Akurasi laporan Telegram vs dashboard | Selisih 0 | §U.9 |
| Keamanan Telegram | 100% kasus tolak-akses lulus | §U.8 |
| Akurasi asisten | 100% harga/stok kartu sesuai DB; 0 kebocoran lintas user; ≥ 90% relevan | §S.7 |
| Performa | Lighthouse Mobile ≥ 85, A11y ≥ 95 | Lighthouse CI |
| Responsif | 320/390/768/1024/1440 tanpa cacat tata letak kritis | Playwright |
| Demo skenario lengkap | ≤ 5 menit tanpa intervensi manual | Rehearsal |
| Keterwakilan EKRAF | Halaman Brand Story lengkap (≥ 3 section: cerita, proses, bahan/pembuat) | Review konten + demo |

Metrik bisnis nyata (konversi, retensi) **tidak ditargetkan** karena tidak ada lalu lintas produksi selama kompetisi.

## Y. Definition of Done

Sebuah fitur dinyatakan **selesai** bila:

1. Semua *acceptance criteria* FR terkait terpenuhi dan terdokumentasi lulus uji.
2. Kode lolos `lint` (0 error/0 warning), `format:check`, `typecheck`, `jscpd ≤ 3%`, `knip`, unit/integration test relevan, dan `build`.
3. Tidak ada explicit `any` tanpa alasan, debug `console.log`, dead code, atau TODO tanpa owner/tiket.
4. Aturan layer (§P) tidak dilanggar; tidak ada logika bisnis di komponen/handler.
5. Produk, varian, harga, dan stok saat runtime hanya berasal dari PostgreSQL melalui Prisma; tidak ada import atau fallback mock/seed.
6. Input divalidasi Zod di server; otorisasi diuji (termasuk kasus ditolak).
7. State loading/empty/error/success tersedia; responsif 320–1440 px; lolos axe tanpa serious/critical.
8. Pengujian unit/integrasi/E2E relevan ditambahkan dan hijau di CI.
9. Tidak ada secret di repo; `.env.example` diperbarui.
10. Dokumentasi dan traceability FR↔test diperbarui; PR direview minimal satu anggota lain bila tim memiliki lebih dari satu developer.
11. Fitur inovasi dapat didemonstrasikan menggunakan data yang sudah tersimpan di database tanpa persiapan manual saat demo.
