# Telegram Business Assistant

> Bagian R.  
> ← [Daftar dokumen](README.md)

## R. Telegram Assistant Specification

Kontrak command, formatter, otorisasi, dan sumber data sama untuk dua transport: **Simulator Telegram pada R0** dan **Telegram Bot API pada R1**. Bagian setup webhook berikut hanya berlaku untuk R1.

### R.1 Setup R1

1. Buat bot lewat BotFather → token disimpan di `TELEGRAM_BOT_TOKEN` (env, server only).
2. Daftarkan webhook: `setWebhook(url=https://<domain>/api/telegram/webhook, secret_token=TELEGRAM_WEBHOOK_SECRET, allowed_updates=["message","callback_query"])`. Skrip `scripts/set-telegram-webhook.ts` menjalankan ini (idempoten).
3. Pengembangan lokal: tunnel HTTPS (mis. ngrok/cloudflared) atau `getUpdates` polling pada mode dev saja.

### R.2 Pipeline pemrosesan command

1. R0 memverifikasi sesi Owner; R1 memverifikasi header webhook secara konstan-waktu. Gagal → 401.
2. Parse & validasi struktur update dengan Zod (abaikan tipe selain `message` teks & `callback_query`).
3. **AuthN**: cari `TelegramAdminLink` aktif berdasar `from.id` **dan** `chat.type === "private"`. Tidak ada → balas generik ("Akses ditolak.") tanpa data; catat audit `TELEGRAM_DENIED`.
4. **AuthZ**: user pemilik link harus `role=OWNER` dan aktif.
5. Rate limit per owner (20/menit).
6. Router perintah → service → formatter → `sendMessage` (`parse_mode=HTML`, semua nilai dinamis di-escape).
7. Pada R1, respons webhook dikirim secepatnya; pekerjaan transport yang aman ditunda dapat memakai mekanisme background yang didukung hosting.
8. Catat audit untuk perintah penting (`/order`, `/summary`, dan semua aksi tautan).

### R.3 Katalog perintah (MVP read-only)

| Perintah | Sumber data | Isi respons |
|---|---|---|
| `/start [token]` | `TelegramLinkToken` | Tautkan akun (FR-040) atau sapaan + daftar perintah bila sudah tertaut |
| `/help` | statis | Daftar perintah |
| `/dashboard` | `ReportService.overview` | Penjualan terverifikasi hari/bulan ini, refund tertunda, pesanan, stok kritis, tautan dashboard |
| `/sales_today` `/sales_week` `/sales_month` | `ReportService.salesSummary(period)` | Penjualan terverifikasi, refund, jumlah pesanan, rata-rata nilai pesanan, status, produk terlaris, dan **perbandingan periode sebelumnya** |
| `/orders` | `OrderService.listRecent(5)` | 5 pesanan terbaru (nomor, total, status) |
| `/order <nomor>` | `OrderService.getByNumber` | Detail: item, total, status bayar, status; **tanpa alamat lengkap & telepon** |
| `/pending_orders` | `OrderService.listNeedingAction` | `PAID` belum diproses; `NEEDS_ATTENTION` |
| `/low_stock` | `InventoryService.listLow` | Varian stok ≤ ambang & stok 0, dikelompokkan per kategori |
| `/top_products` | `ReportService.topProducts` | 5 terlaris + 5 kurang diminati (30 hari); "paling banyak dilihat" hanya bila `ProductEvent` tersedia |
| `/summary` | gabungan | Ringkasan harian: penjualan, pesanan, stok, terlaris, hal butuh perhatian |

Contoh format (angka berasal dari DB; ini hanya ilustrasi):

```text
Ringkasan Penjualan Hari Ini
Penjualan Terverifikasi: Rp{verifiedSales}
Refund Tertunda: Rp{refundPending}
Total Pesanan: {orderCount}
Menunggu Pembayaran: {pendingPayment} · Menunggu Diproses: {paid} · Diproses: {processing} · Selesai: {done}

Produk Terlaris:
1. {product1}
2. {product2}
3. {product3}

vs kemarin: {deltaPercent}
Diperbarui: {timestampWIB}
```

### R.4 Notifikasi & anti-spam

Event dan kebijakan pada FR-042. `NotificationService.notify(event)` membentuk `dedupeKey`, membuat `NotificationLog(PENDING)`, lalu mengirim lewat transport aktif. Sukses → `SENT`; gagal → `FAILED` dengan `attemptCount` dan `nextAttemptAt`. Constraint `(recipientKey,dedupeKey)` mencegah duplikasi untuk inbox simulator maupun chat bot. Siklus low-stock direset setelah stok naik di atas ambang. Batas 30 pesan/jam/Owner; kelebihan digabung ke ringkasan.

### R.5 Laporan terjadwal & scheduler (R1)

| Lingkungan | Mekanisme | Catatan |
|---|---|---|
| Vercel | Vercel Cron memanggil `/api/cron/*` | Frekuensi & jumlah cron bergantung paket; verifikasi batasan paket sebelum bergantung padanya. Cron memakai UTC → 07:00 WIB = 00:00 UTC |
| VPS/Docker | Cron sistem / container `curl` ke endpoint, atau `node-cron` dalam proses | Pastikan satu instance saja yang menjalankan |
| Cadangan universal | GitHub Actions `schedule` memanggil endpoint dengan `CRON_SECRET` | Gratis, tidak terikat hosting; toleransi keterlambatan menit |

Semua endpoint cron: verifikasi `CRON_SECRET`, idempoten via `dedupeKey` periode, zona waktu `Asia/Jakarta`.

### R.6 Keamanan Telegram (ringkas; detail §T)

Token & secret hanya env; allowlist berbasis tautan DB (bukan input pengguna); tidak pernah mengirim password/token/secret; data pelanggan diminimalkan di pesan; audit semua perintah penting; cabut tautan = efek instan; mode grup **ditolak** (hanya `private`).

Pada R0, simulator tetap wajib menggunakan sesi Owner dan guard service; menyembunyikan link UI saja tidak dianggap sebagai otorisasi.

### R.7 Batasan MVP & aksi tulis (FR-045, Future)

MVP **read-only**. Bila kelak ditambahkan aksi tulis, risikonya: salah ketuk, akun Telegram Owner diambil alih, replay callback. Mitigasi wajib: (1) konfirmasi dua langkah dengan tombol inline, (2) token aksi 60 detik sekali pakai terikat user+aksi+entitas, (3) hanya daftar aksi sempit (mis. `PAID→PROCESSING`; **tidak** ada ubah harga/hapus), (4) audit log, (5) opsi PIN/TOTP untuk aksi sensitif.

### R.8 Menghindari duplikasi

Formatter Telegram (`integrations/telegram/formatter.ts`) hanya menyusun teks dari DTO service. Definisi penjualan terverifikasi, refund, periode, dan perbandingan hanya ada di `ReportService`; dashboard dan Telegram diuji dengan fixture yang sama (§U.9).
