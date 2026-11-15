# Rencana R0 — Competition MVP

> Bagian Z: target pengerjaan pertama tanpa ketergantungan layanan eksternal.  
> ← [Daftar dokumen](README.md)

## Z. Rencana R0 (Core Nyata, Integrasi Eksternal Disimulasikan)

> Ini adalah target pengerjaan pertama dan sumber scope implementasi kompetisi. Dokumen lain tetap mendefinisikan perilaku lengkap R1/R2.

### Z.1 Tujuan & batasan

R0 membuktikan seluruh alur dapat dijalankan dan didemonstrasikan tanpa akun layanan eksternal. **Core bisnis tetap nyata**: Auth.js, Prisma/PostgreSQL, otorisasi server, transaksi stok, pesanan, audit, dan laporan. Hanya payment gateway, AI provider, Telegram Bot API, pengiriman pihak ketiga, email, serta upload cloud yang memakai adapter simulasi atau implementasi lokal.

| Termasuk | Tidak termasuk |
|---|---|
| Seluruh alur Visitor → Customer → pesanan → Owner | Payment gateway produksi, API kurir, provider AI, Telegram Bot API |
| Auth.js, `OWNER`/`CUSTOMER`, guard server, dan akun seed | Google OAuth, email transaksional, lupa password |
| PostgreSQL + Prisma sebagai sumber runtime untuk produk, stok, akun, pesanan, laporan, dan audit | Cloudinary; file repository hanya menyimpan aset gambar R0, bukan record produk |
| Pembayaran, AI, dan Telegram melalui adapter simulasi | Cron terjadwal nyata; laporan dapat dipicu manual saat demo |
| Pengiriman toko: tarif tetap, kurir, dan resi manual | Security/operasional produksi penuh dan multi-instance |

### Z.2 Dasar teknis

- Pakai implementasi Next.js + Tailwind saat ini dan pertahankan komponen, token, mapper, serta aturan domain yang masih relevan.
- Data inti, termasuk katalog produk dan varian, disimpan serta dibaca dari PostgreSQL melalui Prisma. Tidak ada fallback runtime ke mock/seed. `localStorage` hanya menyimpan bag Visitor (`variantId` + `quantity`) dan preferensi UI non-sensitif.
- Service nyata (`ProductService`, `OrderService`, `InventoryService`, `ReportService`, `AuditService`) berjalan di server. Integrasi eksternal berada di balik interface (`PaymentGateway`, `AssistantProvider`, `TelegramTransport`, `StorageProvider`).
- Data awal development/demo boleh dimasukkan lewat script seed/bootstrap yang melakukan `upsert` ke PostgreSQL. Script tersebut bukan data source aplikasi, tidak boleh diimpor oleh service/UI, dan reset hanya boleh dijalankan melalui CLI pada environment terproteksi.
- Validasi Zod dan aturan domain (`productRules`, state machine pesanan, perhitungan total) ditulis sekali dan dipakai ulang di versi produksi.

### Z.3 Simulasi per komponen

| Komponen | Cara disimulasikan | Aturan agar tetap jujur |
|---|---|---|
| **Login/daftar** | Auth.js Credentials + database; seed 1 `OWNER` dan 1 `CUSTOMER` demo | Password memakai hash produksi; guard peran dan kepemilikan berjalan di service server |
| **Pembayaran** | Halaman "Pembayaran (simulasi)" dengan tombol *Bayar sekarang* dan *Gagal*. Menekan *Bayar* memanggil `markPaid` | Total dihitung ulang di service, bukan dari UI; pesanan belum dibayar kedaluwarsa (timer demo dapat dipercepat) |
| **Pengiriman** | `ShippingProvider` tarif tetap (Standard gratis, Express Rp45.000 dari prototype) | Nama kurir + resi diisi Owner; tombol "Lacak di situs kurir" hanya tautan |
| **AI Assistant** | `ScriptedAssistant` memetakan intent demo ke service nyata (`searchProducts`, `OutfitService`, FAQ, status pesanan) | Harga/stok selalu dari DB; pertanyaan di luar data dijawab terbatas; Visitor tidak dapat membaca status pesanan |
| **Telegram** | Panel **"Simulator Telegram"** di area Owner. Perintah memanggil `ReportService`/`InventoryService` yang sama dengan dashboard; event domain membuat pesan simulasi | Hanya Owner dapat membuka panel; angka identik dengan dashboard; area Owner menandainya sebagai simulator |
| **Laporan terjadwal** | Tombol "Kirim laporan harian sekarang" di simulator | Dedupe per periode tetap diterapkan |

### Z.4 Halaman & alur yang dibangun

**Storefront (Visitor/Customer):** Home, Koleksi, Katalog (filter, sort, search), PDP (warna, ukuran, Complete the Look minimum), Bag, Login/Daftar, Checkout (alamat → pengiriman → periksa alamat), Pembayaran simulasi, Konfirmasi, `/account/orders` + detail, Brand Story (`/about`), dan panel asisten.

**Owner (`/admin`):** Dashboard (penjualan, produk terlaris, stok menipis), Pesanan (daftar, ubah status, input kurir + resi), Produk & Stok (CRUD sederhana, penyesuaian stok), Pengaturan toko (tarif pengiriman, ambang stok, konten Brand Story), Simulator Telegram.

### Alur demo utama (≤ 5 menit)

1. Visitor membuka katalog, bertanya ke **AI** ("kemeja anggaran 1 juta") → membuka produk.
2. Memilih warna dan ukuran → melihat **Complete the Look** minimum → Add to Bag. Smart Size hanya ditampilkan bila FR-034 ikut release.
3. Checkout → diarahkan **login** → alamat → pengiriman Standard → Periksa alamat → **Bayar (simulasi)**.
4. Beralih ke akun **Owner**: **Simulator Telegram** menampilkan notifikasi "pesanan dibayar"; Owner mengetik `/sales_today` → angka sama dengan dashboard.
5. Owner mengubah status Diproses → Dikirim (isi kurir + resi). Customer melihat timeline dan resi di `/account/orders`.
6. Stok produk turun di bawah ambang → notifikasi stok menipis muncul di simulator → `/low_stock`.

### Z.5 Urutan pengerjaan

| Tahap | Isi | Hasil |
|---|---|---|
| P1 | Prisma/PostgreSQL, migration, bootstrap data awal ke DB, Auth.js, guard, service/repository | Katalog dan akun dibaca dari database; tidak ada runtime mock |
| P2 | Katalog, search, PDP, guest bag, login, merge bag | Visitor → Customer berjalan |
| P3 | Checkout, transaksi `placeOrder`, pembayaran simulasi, konfirmasi, riwayat | Pesanan end-to-end dan stok konsisten |
| P4 | Owner: dashboard, pesanan, status, kurir/resi, inventori, pengaturan minimum | Owner dapat mengoperasikan demo |
| P5 | `ReportService`, audit, Simulator Telegram, dan notifikasi | Angka dashboard/simulator identik |
| P6 | Scripted Assistant, Outfit minimum, dan Brand Story | Inovasi dan EKRAF dapat didemonstrasikan |
| P7 | E2E, otorisasi, akurasi laporan, responsif 320–1440 px, a11y, dan quality gates | Siap demo |

Jika waktu terbatas, pangkas dengan urutan: scheduled report → Smart Size → wishlist/review → CRUD kategori/koleksi → Outfit versi lengkap. **Jangan memangkas** Brand Story, guard peran, transaksi stok, perhitungan total server, audit inti, atau akurasi laporan.

### Z.6 Kriteria selesai prototype

- Alur demo Z.4 berjalan tanpa akun layanan eksternal dan tanpa error kritis.
- Hanya Owner yang dapat membuka `/admin` dan Simulator Telegram (uji akses ditolak untuk Customer/Visitor).
- Visitor tidak bisa checkout; pesanan tidak bisa dibuat tanpa login.
- Total pesanan dan stok dihitung di service; angka dashboard = angka simulator Telegram.
- Tidak ada kunci/rahasia di kode; mode R0 tidak wajib melakukan panggilan ke layanan eksternal.
- Lint 0 warning, typecheck, JSCPD ≤ 3%, build hijau.

### Z.7 Jalur ke versi produksi

Core database, auth, service, dan repository tidak diganti. R1 hanya mengganti adapter: pembayaran simulasi → gateway sandbox; `ScriptedAssistant` → provider AI tool-calling; Simulator Telegram → webhook bot; aset lokal → storage provider bila dibutuhkan. Spesifikasi lengkap ada di `08`–`15`.
