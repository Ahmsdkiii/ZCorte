# Product Overview & Scope

> Bagian A–F: ringkasan produk, masalah, visi, persona, scope MVP.  
> ← [Daftar dokumen](README.md)

## A. Product Overview

**ZCorté** adalah platform fashion e-commerce satu brand dengan identitas visual minimalis, editorial, dan konsisten. Platform terdiri dari tiga lapisan:

1. **Storefront pelanggan** — katalog, detail produk, bag, checkout, akun, pelacakan pesanan (berbasis prototype).
2. **Dashboard Owner** — pemilik toko mengelola produk, stok, pesanan, dan memantau penjualan.
3. **Lapisan inovasi** — **AI Shopping Assistant** untuk pelanggan dan **Telegram Business Assistant** untuk pemilik toko, ditambah rekomendasi outfit berbasis aturan dan **Brand Story & Local Craft** untuk subtema EKRAF.

Prinsip utama: *kualitas di atas kuantitas fitur*. Setiap fitur yang masuk MVP harus dapat didemonstrasikan end-to-end.

## B. Background & Problem Analysis

| Masalah | Pihak terdampak | Bukti/alasan | Solusi dalam produk |
|---|---|---|---|
| Pelanggan fashion online sulit memilih ukuran dan memadukan pakaian; retur karena ukuran adalah keluhan umum e-commerce fashion | Pelanggan | Prototype menampilkan ukuran S–XL tanpa panduan; tidak ada saran padu-padan | Smart Size (FR-034), Smart Outfit (FR-033), AI Assistant (FR-030) |
| Pelanggan perlu bertanya (cara beli, bahan, status pesanan) tetapi e-commerce kecil tidak punya CS 24 jam | Pelanggan, pemilik toko | Tidak ada kanal bantuan di prototype | AI Shopping Assistant berbasis data katalog nyata |
| Pemilik UMKM/toko kecil tidak selalu membuka dashboard; pesanan baru dan stok menipis terlambat diketahui | Owner/pemilik | Telegram sudah menjadi aplikasi harian pemilik usaha | Telegram Business Assistant (notifikasi + monitoring read-only) |
| Brand fashion lokal sulit membangun kredibilitas digital: cerita, proses, dan karakter brand tidak tersampaikan di toko online biasa | ZCorté, ekosistem EKRAF | Subtema kompetisi | Brand Story & Local Craft (FR-036) |
| Prototype hanya simulasi: tidak ada data nyata, akun, atau stok | Tim | Analisis §0.5 | Backend nyata (PostgreSQL + Prisma) |

> **Catatan jujur.** Klaim tingkat retur atau konversi tidak diberi angka karena tim belum memiliki data/sitasi. Metrik keberhasilan (§X) diukur dari uji demo dan data aplikasi sendiri, bukan dari asumsi pasar.

## C. Product Vision & Goals

**Visi.** Menjadi toko fashion digital yang terkurasi, tenang, dan personal, sekaligus memberi pemilik toko kendali bisnis lewat percakapan di Telegram.

| Goal | Ukuran keberhasilan (demonstrable) |
|---|---|
| G-1 Alur belanja end-to-end berfungsi | Pengunjung dapat browse → bag → login → checkout → bayar melalui simulator → melihat status pesanan tanpa error kritis |
| G-2 Asisten belanja bermanfaat & aman | 100% harga/stok kartu sesuai DB dan ≥ 90% jawaban set uji relevan (lihat §U.7) |
| G-3 Owner dapat memantau melalui percakapan | Semua perintah Simulator Telegram R0 menghasilkan angka identik dengan dashboard; kontrak yang sama dipakai bot R1 (§U.9) |
| G-4 Kualitas kode | ESLint 0 error/0 warning, JSCPD ≤ 3% duplikasi, TypeScript strict lolos, build hijau |
| G-5 UX responsif | Lighthouse Mobile: Performance ≥ 85, Accessibility ≥ 95 pada Home, Shop, PDP |

## D. Unique Value Proposition

1. **Belanja dibantu percakapan yang jujur** — asisten hanya berbicara berdasarkan data katalog nyata; tidak mengarang harga/stok.
2. **Toko yang bisa "ditanya"** — pemilik cukup mengetik `/summary` di Telegram.
3. **Padu-padan dan ukuran yang transparan** — rekomendasi berbasis aturan yang bisa dijelaskan, bukan kotak hitam.
4. **Cerita brand dan kerajinan lokal** — proses, bahan, dan pembuat di balik produk ditampilkan sebagai bagian dari ekosistem ekonomi kreatif.

### D.4 Decision Register

| ID | Keputusan | Status | Hasil / tindak lanjut |
|---|---|---|---|
| D-01 | Nama brand | **Decided** | **ZCorté** |
| D-02 | Nama koleksi (`TACTIX`, `APEXTIVE`, `OUTDOOR`) | Open | Pertahankan struktur tiga koleksi untuk R0; rename konten dapat dilakukan dari DB tanpa mengubah kode |
| D-03 | Bahasa UI | **Decided untuk R0** | Inggris mengikuti copy saat ini; teks baru disiapkan melalui kamus terpusat agar migrasi bahasa tidak menyentuh komponen |
| D-04 | Pembayaran R0 | **Decided** | Adapter simulasi; payment sandbox dievaluasi hanya untuk R1 |
| D-05 | Provider AI | **Decided untuk R0** | `ScriptedAssistant`; provider AI R1 dipilih lewat PoC kualitas tool-calling, biaya, dan latensi |
| D-06 | Target deployment | Open | Vercel atau VPS; keputusan diperlukan sebelum scheduler R1 dibuat |
| D-07 | Interpretasi subtema EKRAF | Open — blocking konten | Cocokkan dengan teks resmi buku panduan sebelum finalisasi narasi demo |
| D-08 | Tenggat dan kapasitas tim | Open — blocking roadmap | Isi tanggal, jumlah anggota, dan alokasi hari-orang sebelum sprint dimulai |
| D-09 | Penambahan katalog/aset | Open | Putuskan apakah aset di luar enam produk awal diperbolehkan dan memiliki hak pakai |
| D-10 | Baseline visual | **Decided** | Implementasi repository saat ini menjadi baseline; perubahan produk tetap mengikuti token dan pola desain yang ada |
| D-11 | Pemilik dan persetujuan konten | Open — blocking FR-036 | Tentukan anggota yang menulis serta menyetujui klaim proses, material, dan pembuat lokal |
| D-12 | Posisi brand untuk narasi EKRAF | Open — blocking konten | Tetapkan apakah ZCorté diposisikan sebagai brand lokal, independen, atau kategori lain berdasarkan fakta |
| D-13 | Peran staf operasional (`STAFF`) | **Future** | R0/R1 hanya `OWNER` dan `CUSTOMER` |

## E. Target Audience & User Personas

| Persona | Profil | Kebutuhan | Fitur kunci |
|---|---|---|---|
| **Alya (26)**, pekerja kreatif urban | Belanja via ponsel, menyukai gaya minimalis, ragu soal ukuran | Cepat menemukan produk, tahu ukuran yang pas, ide padu-padan | Search, Smart Size, Outfit, AI Assistant |
| **Raka (31)**, profesional sibuk | Beli sedikit tetapi berkualitas, tidak ingin proses panjang | Login cepat (email atau Google), alamat tersimpan, status pesanan jelas | Login ringan, alamat tersimpan, tracking |
| **Bu Dewi (40)**, pemilik toko (Owner) | Mengelola toko dari ponsel, jarang membuka laptop | Tahu pesanan masuk, stok menipis, dan penjualan terverifikasi | Telegram Business Assistant, dashboard Owner |

> Persona bersifat hipotesis perancangan, bukan hasil riset pengguna. Sebelum demo, lakukan uji tugas singkat kepada lima calon pengguna: menemukan produk, memilih varian, checkout, membaca status pesanan, serta memahami rekomendasi AI/outfit. Catat waktu, kegagalan tugas, dan komentar utama.

## F. Product Scope

### F.1 Matriks fitur & prioritas produk

`Must` berarti wajib untuk cerita demo R0. Fitur yang bergantung layanan eksternal wajib memiliki adapter simulasi pada R0 dan baru dihubungkan ke provider nyata pada R1.

| ID | Fitur | Asal | Area | Prioritas | Jenis |
|---|---|---|---|---|---|
| FR-001 | Homepage | [P+] | Customer | Must | — |
| FR-002 | Halaman Koleksi (dinamis) | [P+] | Customer | Must | — |
| FR-003 | Katalog, filter, sort | [P+] | Customer | Must | — |
| FR-004 | Search produk | [R] | Customer | Must | ⚙️ |
| FR-005 | Detail produk | [P+] | Customer | Must | — |
| FR-006 | Bag (cart drawer) & Quick Add | [P+] | Customer | Must | — |
| FR-007 | Checkout | [P+] | Customer | Must | — |
| FR-008 | Pembayaran | [P+] | Customer | Must | — |
| FR-009 | Konfirmasi & pelacakan pesanan | [R] | Customer | Must | — |
| FR-010 | Autentikasi & sesi | [R] | Customer/Owner | Must | — |
| FR-011 | Profil & alamat | [R] | Customer | Should | — |
| FR-012 | Wishlist | [R] | Customer | Should | — |
| FR-013 | Review & rating | [R] | Customer | Could | — |
| FR-020 | Owner dashboard & analitik | [R] | Owner | Must | — |
| FR-021 | Manajemen produk | [R] | Owner | Must | — |
| FR-022 | Manajemen kategori & koleksi | [R] | Owner | Should | — |
| FR-023 | Manajemen inventori | [R] | Owner | Must | — |
| FR-024 | Manajemen pesanan | [R] | Owner | Must | — |
| FR-025 | Manajemen pelanggan (read-only) | [R] | Owner | Should | — |
| FR-026 | Promosi (kode diskon) | [R] | Owner | Could | — |
| FR-027 | Pengaturan toko | [R] | Owner | Could | — |
| FR-030 | AI Shopping Assistant | [R] | Inovasi | Must | 🤖 |
| FR-031 | Panel chat AI di storefront (UI) | [R] | Inovasi | Must | — |
| FR-033 | Smart Outfit Recommendation | [R] | Inovasi | Must | ⚙️ |
| FR-034 | Smart Size Recommendation | [R] | Inovasi | Should | ⚙️ |
| FR-035 | Personalized Fashion Discovery | [R] | Inovasi | Could | ⚙️ |
| FR-036 | Brand Story & Local Craft | [R] | Inovasi/EKRAF | Must | — |
| FR-040 | Tautan akun Telegram owner | [R] | Telegram | Should (R1) | — |
| FR-041 | Perintah monitoring Telegram (read-only) | [R] | Telegram | Must | ⚙️ |
| FR-042 | Notifikasi otomatis Telegram | [R] | Telegram | Must | ⚙️ |
| FR-043 | Laporan terjadwal Telegram | [R] | Telegram | Should | ⚙️ |
| FR-044 | Audit log aktivitas owner | [R] | Telegram/Owner | Must | — |
| FR-045 | Aksi tulis via Telegram (konfirmasi) | [R] | Telegram | Future | ⚙️ |

### F.2 Di luar scope MVP

Multi-bahasa penuh, multi-mata uang, marketplace multi-vendor dengan payout, aplikasi mobile native, ulasan bergambar, program loyalitas, AI generatif untuk gambar/try-on, pengubahan data lewat Telegram (FR-045), rekomendasi berbasis machine learning.

### F.3 Vertical slice kompetisi

Demo dibangun di sekitar satu cerita: **pelanggan bertanya ke asisten → memilih produk/outfit → checkout → membayar melalui simulator → Owner menerima notifikasi di Simulator Telegram → mengetik `/sales_today` → memproses dan mengirim pesanan**.

Core R0 yang tidak boleh dipangkas: FR-001–010, FR-020, FR-023–024, FR-030–031, FR-036, perilaku FR-041–042 melalui simulator, dan FR-044. FR-021 dan FR-033 boleh dibuat dalam bentuk minimum yang cukup untuk demo. Koneksi Telegram nyata (FR-040), scheduled report (FR-043), Smart Size, wishlist, review, promosi, dan personalisasi mengikuti kapasitas atau R1.
