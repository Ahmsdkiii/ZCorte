# Functional Requirements — Owner

> Bagian H.2: FR-020 sampai FR-027.  
> ← [Daftar dokumen](README.md)

### H.2 Owner / Store Management

#### FR-020 — Owner Dashboard & Analitik `[R]` · Must

| Field | Isi |
|---|---|
| Description | Kartu KPI (penjualan terverifikasi, jumlah pesanan terbayar, rata-rata nilai pesanan), grafik per hari/minggu/bulan, perbandingan periode, produk terlaris, stok menipis, pesanan butuh perhatian, dan refund tertunda |
| Objective | Satu sumber kebenaran bisnis — **dipakai juga oleh Telegram** (§N.4) |
| User role | Owner |
| Main flow | Server Component → `ReportService` → agregasi SQL |
| Alternative flow | Tidak ada data → empty state |
| Validation | Rentang tanggal ≤ 366 hari; zona waktu `Asia/Jakarta` |
| AC | "Penjualan terverifikasi" dihitung dari Payment `PAID`; Payment `REFUNDED` dikeluarkan, sedangkan `REFUND_PENDING` ditampilkan terpisah. Agregasi memakai `paidAt` dalam zona `Asia/Jakarta`; angka dashboard = angka Telegram pada fixture yang sama |

#### FR-021 — Manajemen Produk `[R]` · Must

| Field | Isi |
|---|---|
| Description | CRUD produk, varian (warna×ukuran), referensi gambar, koleksi, kategori, atribut gaya (`styleTags`, `fit`, `material`), status `DRAFT/ACTIVE/ARCHIVED`, flag featured. R0 memilih aset repository; upload cloud masuk R1 |
| Objective | Owner mengelola katalog tanpa deploy |
| Main flow | Form (React Hook Form + Zod) → Server Action → service → repository |
| Alternative flow | Hapus produk yang pernah dipesan → hanya `ARCHIVED` (soft delete) |
| Validation | Nama 2–100; slug unik otomatis dari nama; harga integer ≥ 1000; ≥ 1 gambar sebelum `ACTIVE`; gambar ≤ 5 MB (jpeg/webp/png) |
| AC | Perubahan tampil di storefront ≤ 60 detik (revalidasi tag); `OrderItem` lama tidak berubah saat harga produk diubah |

#### FR-022 — Kategori & Koleksi `[R]` · Should

CRUD kategori (hirarki 1 level) dan koleksi (nama, tagline, focus, deskripsi, warna aksen, hero image — field prototype `CollectionMeta`). Validasi: slug unik; tidak bisa menghapus yang masih memiliki produk aktif. AC: perubahan koleksi tercermin pada `/collections/[slug]` dan navigasi.

#### FR-023 — Manajemen Inventori `[R]` · Must

| Field | Isi |
|---|---|
| Description | Tabel stok per varian, penyesuaian stok manual (dengan alasan), ambang minimum per varian (default 5), riwayat pergerakan stok |
| Objective | Mencegah oversell; sumber data notifikasi stok |
| Main flow | Semua perubahan kuantitas tersedia melalui `InventoryService` → `InventoryMovement(delta)` tercatat → jika `stock ≤ threshold` memicu event `LOW_STOCK` |
| Alternative flow | Stok negatif ditolak |
| Validation | Stok integer ≥ 0; alasan wajib ≥ 3 karakter |
| AC | Stok awal, reserve (`delta < 0`), release (`delta > 0`), dan adjustment memiliki `InventoryMovement`; pembayaran tidak mengurangi stok untuk kedua kali. `ProductVariant.stock` harus sama dengan jumlah seluruh delta movement |

#### FR-024 — Manajemen Pesanan `[R]` · Must

| Field | Isi |
|---|---|
| Description | Daftar & filter pesanan (status, tanggal, pencarian nomor/email), detail, ubah status, **input nama kurir + nomor resi** (pengiriman dilakukan toko sendiri), batalkan |
| Main flow | Owner membuka pesanan → memilih transisi yang diizinkan → service memvalidasi state machine → tersimpan + `OrderStatusHistory` |
| Alternative flow | Pembatalan setelah `PAID` hanya oleh Owner dengan alasan: Order → `CANCELLED`, stok dilepas, Payment → `REFUND_PENDING`; konfirmasi refund manual mengubahnya menjadi `REFUNDED` |
| Validation | `PENDING_PAYMENT→PAID` hanya oleh `PaymentService`/adapter simulasi; Owner dapat `PAID→PROCESSING`, `PROCESSING→SHIPPED`, `SHIPPED→COMPLETED`, serta membatalkan sebelum selesai dengan alasan. `SHIPPED→CANCELLED` tidak diizinkan pada R0 |
| AC | Transisi tidak sah mengembalikan 409; Owner tidak dapat menandai `PAID` secara manual di luar mode simulasi; setiap perubahan mencatat aktor, waktu, alasan, efek stok, dan efek pembayaran |

#### FR-025 — Manajemen Pelanggan (read-only) `[R]` · Should

Daftar pelanggan, jumlah & total pesanan, detail pesanan per pelanggan. Tanpa menampilkan hash password. AC: hanya Owner; pencarian dengan paginasi.

#### FR-026 — Promosi `[R]` · Could

Kode diskon persentase/nominal, periode, kuota, minimal belanja. Validasi server-side saat checkout; satu kode per pesanan. AC: kode kedaluwarsa/kuota habis ditolak dengan pesan jelas.

#### FR-027 — Pengaturan Toko `[R]` · Could

Nama toko, kontak, biaya & ETA pengiriman (`standard`, `express`), ambang stok default, zona waktu laporan. AC: perubahan biaya pengiriman langsung dipakai checkout.
