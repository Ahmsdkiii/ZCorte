# Owner Admin Dashboard UI — Analytics, Products & Orders

| Metadata         | Nilai                                               |
| ---------------- | --------------------------------------------------- |
| Slug             | `owner-dashboard-ui`                                |
| Status           | `IN_PROGRESS`                                       |
| Lane             | `Lane B / Lane A Frontend`                          |
| Owner            | `SIDQI (Frontend Lead)`                             |
| Reviewer         | `DINO / KANEKA`                                     |
| Branch / PR      | `feat/admin-dashboard-ui`                           |
| Referensi PRD/FR | `prd/04-fr-owner.md` (`FR-020`, `FR-021`, `FR-024`) |
| Dibuat           | `2026-11-24`                                        |
| Diperbarui       | `2026-11-24`                                        |

## 1. Masalah dan Outcome

Sebelumnya, toko ZCorté belum memiliki antarmuka back-office `/admin` untuk role `OWNER`. Pemilik toko memerlukan satu pusat komando untuk memantau performa penjualan, mengelola katalog produk, dan memproses pesanan masuk.

Outcome yang dicapai:

1. Route group `src/app/(owner)/` dengan layout khusus yang terisolasi dan diproteksi server guard (`Role.OWNER`).
2. Empat kartu metrik KPI bisnis real-time teragregasi dari PostgreSQL:
   - Total Omzet Terverifikasi (IDR)
   - Jumlah Pesanan Terbayar
   - Jumlah Pesanan Menunggu Pembayaran
   - Rata-rata Nilai Pesanan (AOV)
3. Tabel Manajemen Katalog Produk lengkap dengan filter status, info varian & stok, serta modal form untuk menambah produk baru.
4. Tabel Manajemen Pesanan Masuk dengan pembaruan status pemrosesan (`PROCESSING`, `SHIPPED`, `COMPLETED`), input nama kurir, dan nomor resi pengiriman.
5. Pemenuhan aturan Clean Code `NFR-06` (semua berkas ≤ 250 baris).

## 2. Scope

### In Scope (Task Frontend #9 — `FR-020`, `FR-021`, `FR-024`)

- Layout admin `src/app/(owner)/layout.tsx` dengan Server Role Guard.
- Halaman dashboard `src/app/(owner)/admin/page.tsx`.
- Komponen admin: `AdminHeader.tsx`, `AdminKpiSection.tsx`, `AdminProductsTable.tsx`, `AdminOrdersTable.tsx`, `ProductFormModal.tsx`.
- ViewModel `useAdminViewModel.ts`.
- Server Actions `admin.actions.ts`.

### Out of Scope

- Telegram bot webhook connected integration (masuk di task simulator Telegram R0).
- Cloudinary storage upload (R0 menggunakan allowlist aset lokal `/images/products/*`).

## 3. Acceptance Criteria

- [x] Given pengguna bukan role `OWNER`, when mengakses `/admin`, then otomatis ditolak / dialihkan ke `/login`.
- [x] Given pengguna dengan role `OWNER`, when membuka `/admin`, then kartu KPI, tabel produk, dan tabel pesanan tampil dengan data nyata dari PostgreSQL.
- [x] Given pesanan berstatus `PAID`, when Owner memasukkan nama kurir & nomor resi lalu mengubah status menjadi `SHIPPED`, then data tersimpan dan tercermin secara real-time.
- [x] Given seluruh file implementasi, when diuji dengan `wc -l`, then seluruh file ≤ 250 baris.
