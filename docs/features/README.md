# Dokumentasi Fitur ZCorté

Folder ini menyimpan catatan implementasi per fitur. Dokumen fitur menjembatani PRD dengan kode: PRD tetap menjadi sumber kebenaran produk, sedangkan file di sini menjelaskan scope teknis, keputusan arsitektur, kontrak, dan bukti validasi implementasinya.

## Aturan Penggunaan

1. Untuk setiap fitur baru atau perubahan perilaku fitur, salin `_template.md` menjadi `<feature-slug>.md` dengan nama `kebab-case`.
2. Buat dokumen berstatus `DRAFT` sebelum implementasi agar scope dan acceptance criteria jelas.
3. Cantumkan referensi PRD/FR yang relevan. Feature doc tidak boleh mengubah keputusan produk secara diam-diam.
4. Perbarui dokumen dalam perubahan yang sama ketika kontrak, schema, flow, risiko, atau test berubah.
5. Satu fitur memiliki satu dokumen utama. Perluasan fitur memperbarui dokumen yang sama; jangan membuat dokumen duplikat dengan nama berbeda.
6. Ubah status menjadi `DONE` hanya setelah acceptance criteria dan quality gates relevan telah diverifikasi.

## Kapan Wajib Dibuat

Feature doc wajib untuk:

- fitur baru frontend, backend, atau end-to-end;
- perubahan perilaku pengguna atau aturan bisnis;
- endpoint/Server Action baru atau perubahan kontrak;
- perubahan schema, migration, transaction, authorization, atau integrasi eksternal;
- refactor arsitektur yang mengubah dependency atau tanggung jawab layer.

Perbaikan typo, formatting, atau housekeeping murni tidak memerlukan dokumen baru. Bugfix harus memperbarui feature doc terkait jika mengubah perilaku, kontrak, risiko, atau skenario pengujian.

## Alur Kerja

```text
PRD/FR → Feature Doc (DRAFT) → Implementasi → Test/Validasi → Feature Doc (DONE)
```

Gunakan [`_template.md`](_template.md) dan hapus instruksi placeholder yang tidak relevan setelah dokumen diisi.

## Indeks & Registry Slug Fitur Resmi R0

Gunakan slug resmi pada tabel berikut untuk mencegah duplikasi dokumen antar developer. Ubah kolom `Status` menjadi `DRAFT`, `IN_PROGRESS`, atau `DONE` saat Anda membuat/menyelesaikan `docs/features/<slug>.md`.

| Slug (`docs/features/<slug>.md`) | Fitur                                                  | Referensi FR                   | Lane       | Status        |
| -------------------------------- | ------------------------------------------------------ | ------------------------------ | ---------- | ------------- |
| `foundation`                     | Database, Auth, Guard, Error Model & Brand Migration   | FR-010, Lampiran B             | P1 (Semua) | `NOT_STARTED` |
| `catalog-browse`                 | Homepage, Koleksi Dinamis & Katalog Filter/Sort        | FR-001, FR-002, FR-003         | Lane A     | `NOT_STARTED` |
| `product-search`                 | Pencarian Produk (`ILIKE` + Trigram)                   | FR-004                         | Lane A     | `NOT_STARTED` |
| `product-detail`                 | Halaman Detail Produk (PDP) & Galeri                   | FR-005                         | Lane A     | `NOT_STARTED` |
| `bag`                            | Guest Bag, Server Cart & Merge saat Login              | FR-006                         | Lane A     | `NOT_STARTED` |
| `auth-and-profile`               | Registrasi, Login, Profil & Buku Alamat                | FR-010, FR-011                 | Lane A     | `NOT_STARTED` |
| `wishlist-and-reviews`           | Wishlist & Review Pembeli Terverifikasi                | FR-012, FR-013                 | Lane A     | `NOT_STARTED` |
| `checkout-place-order`           | Checkout, Reservasi Stok Atomik & Expiry               | FR-007                         | Lane B     | `NOT_STARTED` |
| `payment-simulated`              | Pembayaran Simulasi R0 & Retry Payment                 | FR-008                         | Lane B     | `NOT_STARTED` |
| `order-tracking`                 | Detail Pesanan, Ubah Alamat & Batal Pesanan            | FR-009                         | Lane B     | `NOT_STARTED` |
| `owner-dashboard`                | Dashboard Analitik Owner & `ReportService`             | FR-020                         | Lane B     | `NOT_STARTED` |
| `owner-catalog-inventory`        | Manajemen Produk, Koleksi, Kategori & Inventori        | FR-021, FR-022, FR-023         | Lane B     | `NOT_STARTED` |
| `owner-orders`                   | Manajemen Pesanan, Kurir/Resi & Refund Manual          | FR-024, FR-025                 | Lane B     | `NOT_STARTED` |
| `store-settings-and-promo`       | Pengaturan Toko (`FR-027a`/`b`) & Promosi              | FR-026, FR-027a, FR-027b       | Lane B     | `NOT_STARTED` |
| `audit-log`                      | Audit Log Aktivitas Owner & Telegram                   | FR-044                         | Lane B     | `NOT_STARTED` |
| `shopping-assistant`             | AI Shopping Assistant (`ScriptedAssistant` & Panel UI) | FR-030, FR-031                 | Lane C     | `NOT_STARTED` |
| `outfit-and-size`                | Smart Outfit ("Complete the Look") & Smart Size        | FR-033, FR-034, FR-035         | Lane C     | `NOT_STARTED` |
| `brand-story`                    | Brand Story & Local Craft (`/about` & Home EKRAF)      | FR-036                         | Lane C     | `NOT_STARTED` |
| `telegram-simulator`             | Simulator Telegram R0, Perintah & Notifikasi           | FR-040, FR-041, FR-042, FR-043 | Lane C     | `NOT_STARTED` |
