# Functional Requirements — Inovasi & Telegram

> Bagian H.3 dan H.4: FR-030 sampai FR-045.  
> ← [Daftar dokumen](README.md)

### H.3 Innovation (spesifikasi detail ada di §I, §R, §S)

#### FR-030 — AI Shopping Assistant `[R]` 🤖 · Must

| Field            | Isi                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description      | Asisten percakapan dengan _tool calling_ ke katalog nyata (10 kemampuan pada brief §6.A dipetakan di §S.3)                                                                                                                                                                                                                                                                                     |
| Objective        | Belanja lebih personal dan efisien tanpa halusinasi data                                                                                                                                                                                                                                                                                                                                       |
| User role        | Visitor, Customer, Owner (status pesanan butuh login)                                                                                                                                                                                                                                                                                                                                          |
| Preconditions    | Fitur aktif; R0 tidak memerlukan API key, R1 memerlukan konfigurasi provider                                                                                                                                                                                                                                                                                                                   |
| Main flow        | Pengguna mengetik → `POST /api/ai/chat` → validasi & rate limit → `AssistantProvider` memilih/memanggil tool → hasil ID produk → UI menampilkan kartu dari DB + teks → tautan ke PDP                                                                                                                                                                                                           |
| Alternative flow | A1: provider gagal/timeout 15 dtk → pesan "Asisten sedang tidak tersedia" + tombol saran berbasis aturan (FAQ, kategori). A2: pertanyaan di luar domain → penolakan sopan. A3: info tidak ada → asisten menyatakan keterbatasannya. A4: status pesanan tanpa login → ajakan login. A5: pembatasan: Visitor 10 pesan/jam, Customer 20 pesan/jam (angka awal, disesuaikan dengan kuota provider) |
| Validation       | Pesan ≤ 500 karakter; Visitor ≤ 10 dan Customer ≤ 20 pesan/jam; batas harian global `AI_DAILY_REQUEST_CAP`; riwayat dikirim ke model dibatasi 10 giliran                                                                                                                                                                                                                                       |
| Expected result  | Harga/stok/ukuran yang disebut selalu berasal dari hasil tool                                                                                                                                                                                                                                                                                                                                  |
| AC               | Lihat §S.7 (set uji validasi)                                                                                                                                                                                                                                                                                                                                                                  |

#### FR-031 — Panel Chat AI (UI) `[R]` · Must

Launcher mengambang (kanan-bawah; di mobile menjadi bottom sheet), daftar pesan, _streaming_, kartu produk inline, chip saran, state loading/empty/error/rate-limited, tautan "Buka produk", tombol "Mulai ulang". AC: operabel keyboard, `aria-live="polite"` pada pesan baru, fokus terkelola saat dibuka/ditutup, tidak menutupi tombol checkout di mobile.

#### FR-033 — Smart Outfit Recommendation `[R]` ⚙️ · Must

| Field            | Isi                                                                                                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description      | "Complete the Look" di PDP: kombinasi atasan/bawahan/alas kaki/aksesori dari produk **tersedia**                                                                                                |
| Objective        | Meningkatkan nilai keranjang dan membantu pelanggan                                                                                                                                             |
| Main flow        | `OutfitService.suggest(productId)` → tentukan slot yang kurang (mis. produk = atasan → cari bawahan, outer, aksesori) → skor kandidat → ambil teratas per slot → tampil dengan tombol "Add all" |
| Alternative flow | Tidak ada kandidat → section disembunyikan                                                                                                                                                      |
| Validation       | Hanya produk `ACTIVE` dengan stok varian > 0                                                                                                                                                    |
| AC               | Hasil deterministik untuk input sama; tiap saran memiliki alasan teks ("Warna senada", "Gaya sama"); aturan skor diuji unit                                                                     |
| Catatan          | Tanpa AI generatif; AI Assistant hanya _memanggil_ layanan ini                                                                                                                                  |

#### FR-034 — Smart Size Recommendation `[R]` ⚙️ · Should

| Field            | Isi                                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description      | Input tinggi, berat, preferensi (`slim/regular/relaxed`) → ukuran saran memakai size chart produk                                                               |
| Main flow        | Pilih "Find my size" di PDP → form → `SizeService.recommend` → tampilkan ukuran + catatan "estimasi" + ukuran alternatif                                        |
| Alternative flow | Di luar rentang chart → saran ukuran terdekat + peringatan; one-size → pesan "ukuran tunggal"                                                                   |
| Validation       | Tinggi 130–220 cm; berat 30–200 kg                                                                                                                              |
| AC               | Selalu menampilkan disclaimer estimasi; ukuran yang disarankan harus tersedia (stok > 0) atau diberi tanda; tinggi/berat tidak disimpan kecuali user menyetujui |

#### FR-035 — Personalized Fashion Discovery `[R]` ⚙️ · Could

Section "Picked for you" di Home/PDP berdasarkan sinyal: kategori sering dilihat, wishlist, riwayat beli. Skor sederhana (bobot: beli 5, wishlist 3, lihat 1, peluruhan waktu 30 hari). Hanya untuk user login dengan persetujuan; opsi "Matikan personalisasi" dan "Hapus data aktivitas". Fallback: produk featured. AC: tanpa sinyal → tampil featured; penghapusan data menghapus `ProductEvent` user.

#### FR-036 — Brand Story & Local Craft `[R]` · Must (subtema EKRAF)

| Field            | Isi                                                                                                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Description      | Halaman `/about` dan section di Home yang menampilkan cerita ZCorté: latar belakang, proses produksi, pembuat/penjahit lokal, asal bahan, dan cerita per koleksi. Memakai pola Pinned Cinematic Story. Badge "Made locally" hanya ditampilkan bila klaimnya telah diverifikasi |
| Objective        | Mewujudkan narasi ekonomi kreatif: kredibilitas brand lokal, transparansi proses, dan pembeda dari toko online generik                                                                                                                                                         |
| User role        | Visitor, Customer, Owner (lihat); Owner (kelola konten)                                                                                                                                                                                                                        |
| Preconditions    | Posisi brand dan konten faktual disetujui (D-11, D-12)                                                                                                                                                                                                                         |
| Main flow        | Owner mengisi konten brand & story steps di `/admin/settings` (`FR-027a`) → storefront menampilkan di `/about`, Home, dan tautan di PDP ("Lihat prosesnya")                                                                                                                    |
| Alternative flow | Konten kosong → section disembunyikan; halaman `/about` menampilkan versi singkat bawaan                                                                                                                                                                                       |
| Validation       | Cerita ≤ 1.200 karakter per bagian; setiap gambar memiliki alt text; klaim asal, material, pembuat, dan proses memiliki persetujuan pemilik konten (D-11)                                                                                                                      |
| AC               | (a) `/about` memiliki ≥ 3 section (cerita, proses, bahan/pembuat); (b) tersedia di navigasi/footer; (c) konten dapat diubah Owner tanpa deploy; (d) lolos a11y dan responsif                                                                                                   |
| Catatan          | Brand **tunggal**: tidak ada model `Brand` terpisah, halaman `/brands`, atau filter brand. Konten disimpan di `StoreSetting` + `StoryStep`                                                                                                                                     |

### H.4 Telegram Business Assistant (spesifikasi detail §R)

#### FR-040 — Tautan Akun Telegram Owner `[R]` · Should (R1)

| Field            | Isi                                                                                                                                                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description      | Pada R1, Owner menghubungkan akun Telegram dengan akun Owner lewat token sekali pakai. R0 tidak memerlukan link karena Simulator Telegram berada di area `/admin`                                                                                                                         |
| Main flow        | 1) Di dashboard klik "Hubungkan Telegram" → server membuat `TelegramLinkToken` (acak 32 byte, hash disimpan, berlaku 10 menit). 2) Tampil tautan `t.me/<bot>?start=<token>`. 3) Owner menekan Start → webhook menerima `/start <token>` → verifikasi → simpan `telegramUserId` + `chatId` |
| Alternative flow | Token kedaluwarsa/terpakai → bot membalas "Token tidak valid"; Owner dapat mencabut tautan dari dashboard                                                                                                                                                                                 |
| Validation       | Satu akun Telegram ↔ satu Owner; maks 1 tautan aktif (dapat dicabut dan diganti)                                                                                                                                                                                                          |
| AC               | `/start` tanpa token dari user tak dikenal → balasan generik tanpa data bisnis; pencabutan tautan langsung memblokir perintah                                                                                                                                                             |

#### FR-041 — Perintah Monitoring (read-only) `[R]` ⚙️ · Must

| Field            | Isi                                                                                                                                                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description      | `/start`, `/dashboard`, `/sales_today`, `/sales_week`, `/sales_month`, `/orders`, `/order <nomor>`, `/pending_orders`, `/low_stock`, `/top_products`, `/summary`, `/help`                                                                                                              |
| Main flow        | R0: Panel Simulator Telegram di `/admin/telegram` memanggil Server Action `simulatorRunCommand` → router perintah → service → formatter → hasil & `AuditLog(channel="SIMULATOR")`. R1: webhook → verifikasi secret/link aktif → router yang sama → service → formatter → `sendMessage` |
| Alternative flow | A1: pengguna tak berizin → respons generik & log. A2: tidak ada data → "Belum ada transaksi periode ini." A3: perintah tak dikenal → `/help`                                                                                                                                           |
| Validation       | Argumen `/order` cocok pola nomor pesanan; rate limit 20 perintah/menit/admin                                                                                                                                                                                                          |
| AC               | Format respons stabil; angka berasal dari DB dan identik dengan dashboard (§U.9); respons lokal R0 < 1 dtk dan respons R1 < 3 dtk pada kondisi normal                                                                                                                                  |

#### FR-042 — Notifikasi Otomatis `[R]` ⚙️ · Must

| Event                                                    | Dikirim?                             | Alasan                                 |
| -------------------------------------------------------- | ------------------------------------ | -------------------------------------- |
| Pesanan baru (`PENDING_PAYMENT` dibuat)                  | **Tidak** (digabung)                 | Banyak yang tidak dibayar → spam       |
| Pembayaran terverifikasi (`PAID`)                        | **Ya**                               | Pesanan siap diproses                  |
| Stok mencapai ambang                                     | **Ya**, sekali per varian per siklus | Dedupe via `NotificationLog.dedupeKey` |
| Stok habis                                               | **Ya**                               | Kritis                                 |
| Pesanan dibatalkan (oleh pelanggan/admin) setelah `PAID` | **Ya**                               | Perlu tindak lanjut                    |
| Pembayaran tidak cocok / `NEEDS_ATTENTION`               | **Ya**                               | Risiko finansial                       |
| Pesanan `PAID` belum diproses > 24 jam                   | **Ya**, 1×/hari dalam ringkasan      | Hindari spam                           |

| Field            | Isi                                                                                                                                                                                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main flow        | Event domain dicatat setelah transaksi commit → `NotificationService` membuat log `PENDING` + cek dedupe → transport simulator (`recipientKey = "simulator:" + ownerUserId`, inbox dibaca dari `NotificationLog` urut `createdAt DESC`) atau link bot aktif (R1) → status `SENT/FAILED` |
| Alternative flow | Telegram API gagal → retry eksponensial maks 3×; status `FAILED` tercatat; tidak menggagalkan transaksi bisnis                                                                                                                                                                          |
| AC               | Event ganda tidak mengirim pesan ganda; kegagalan notifikasi tidak memblokir checkout; tidak ada data pribadi pelanggan selain nama depan & nomor pesanan di pesan; inbox & riwayat perintah simulator R0 bertahan lintas refresh di PostgreSQL (`NotificationLog` + `AuditLog`)        |

#### FR-043 — Laporan Terjadwal `[R]` ⚙️ · Should (R1)

Ringkasan harian 07:00 WIB (hari sebelumnya), mingguan Senin 07:00, dan bulanan tanggal 1 07:00 memuat penjualan terverifikasi, refund tertunda, jumlah pesanan, perbandingan periode, produk terlaris, stok kritis, serta hal yang butuh perhatian. Pemicu: endpoint `/api/cron/*` terproteksi `CRON_SECRET`. AC: laporan tidak terkirim ganda untuk periode sama (`dedupeKey = report:daily:2026-11-13`) dan dapat dimatikan per Owner.

#### FR-044 — Audit Log `[R]` · Must

Mencatat: perintah Telegram, tautan/pencabutan Telegram, login owner, perubahan status pesanan, penyesuaian stok, perubahan harga. Field: actor, aksi, entitas, metadata (tanpa rahasia), IP/ID Telegram, waktu. AC: log tidak dapat diubah dari UI; halaman `/admin/audit` hanya baca.

#### FR-045 — Aksi Tulis via Telegram `[R]` · Future

Contoh: tandai pesanan `PROCESSING`/`SHIPPED`, ubah stok. Wajib: tombol konfirmasi inline dengan token aksi berlaku 60 detik, terikat `userId`+`aksi`, satu kali pakai, tercatat di audit. **Tidak masuk R0/R1** (lihat §R.7).
