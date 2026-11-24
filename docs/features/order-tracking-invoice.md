# Order Confirmation, Digital Invoice & Expedition Tracking (`FR-009`)

| Metadata         | Nilai                              |
| ---------------- | ---------------------------------- |
| Slug             | `order-tracking-invoice`           |
| Status           | `IN_PROGRESS`                      |
| Lane             | `Lane B / Frontend`                |
| Owner            | `SIDQI (Frontend Lead)`            |
| Reviewer         | `DINO / KANEKA`                    |
| Branch / PR      | `feat/order-tracking-invoice`      |
| Referensi PRD/FR | `prd/03-fr-customer.md` (`FR-009`) |
| Dibuat           | `2026-11-24`                       |
| Diperbarui       | `2026-11-24`                       |

## 1. Masalah dan Outcome

Sebelumnya, pelanggan yang telah membuat pesanan hanya melihat ringkasan daftar pesanan statis di `/account` tanpa halaman detail pesanan, tanpa invoice digital yang dapat dicetak, tanpa timeline pelacakan ekspedisi, dan tanpa cara membatalkan pesanan yang masih berstatus `PENDING_PAYMENT`.

Outcome yang dicapai:

1. Rute dinamis `/account/orders/[orderNumber]` dengan validasi autentikasi dan proteksi anti-IDOR ketat.
2. Invoice digital interaktif siap cetak (`Print / Save PDF`) menampilkan rincian pesanan, alamat pengiriman, metode pembayaran, daftar item, dan kalkulasi total dari PostgreSQL.
3. Timeline pelacakan 5 tahap (`PENDING_PAYMENT` → `PAID` → `PROCESSING` → `SHIPPED` → `COMPLETED`) lengkap dengan informasi kurir, tombol _Copy AWB_, tautan eksternal _Track on Courier Site_, dan log riwayat status (`OrderStatusHistory`).
4. Aksi **Cancel Order** khusus status `PENDING_PAYMENT` menggunakan transaksi database atomik (`prisma.$transaction`) yang melepas stok via `InventoryMovement(RELEASE)` tepat satu kali dan menandai pembayaran `PENDING` menjadi `EXPIRED`.
5. Aksi **Simulate Payment (R0 Demo)** opsional pada status `PENDING_PAYMENT` untuk mempermudah pengujian end-to-end.

## 2. Acceptance Criteria

- [x] Given Customer A mengakses `/account/orders/[orderNumber]` milik Customer B, when halaman dimuat, then mengembalikan 404 tanpa membocorkan eksistensi pesanan (anti-IDOR).
- [x] Given pesanan berstatus `PENDING_PAYMENT`, when Customer menekan **Cancel Order** dan mengonfirmasi, then status menjadi `CANCELLED`, stok kembali ke `ProductVariant` melalui `InventoryMovement(RELEASE)` tepat satu kali, dan tombol batal tidak lagi tampil.
- [x] Given pesanan berstatus `PAID` / `PROCESSING` / `SHIPPED` / `COMPLETED`, when Customer membuka detail pesanan, then tombol **Cancel Order** tidak ditampilkan dan mutasi pembatalan ditolak oleh server.
- [x] Given Owner mengisi kurir & nomor resi di `/admin`, when Customer membuka `/account/orders/[orderNumber]`, then nama kurir, nomor resi, tombol _Copy AWB_, dan tautan pelacakan kurir tampil akurat.
- [x] Given seluruh berkas implementasi, when diperiksa dengan `wc -l`, then seluruh berkas ≤ 250 baris (`NFR-06`).
