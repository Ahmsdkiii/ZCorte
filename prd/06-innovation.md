# Inovasi & Prioritas

> Bagian I: evaluasi ide, matriks prioritas, kombinasi untuk kompetisi.  
> ← [Daftar dokumen](README.md)

## I. Innovation & Product Differentiation

### I.1 Evaluasi ide dari brief

| Inovasi                        | Masalah nyata                                      | Pembeda                                             | Jenis | Kompleksitas  | Risiko utama                            | Keputusan                       |
| ------------------------------ | -------------------------------------------------- | --------------------------------------------------- | ----- | ------------- | --------------------------------------- | ------------------------------- |
| A. AI Shopping Assistant       | Bantuan belanja & pertanyaan berulang              | Berbasis data katalog nyata, tanpa halusinasi harga | 🤖    | Tinggi        | Halusinasi, biaya API, prompt injection | **Must** (dengan batasan ketat) |
| B. Telegram Business Assistant | Pemilik tidak sempat membuka dashboard             | Kendali bisnis lewat chat; data nyata               | ⚙️    | Sedang        | Keamanan akses                          | **Must** (read-only)            |
| C. Smart Outfit                | Sulit memadukan pakaian                            | Aturan transparan + "Add all"                       | ⚙️    | Sedang        | Kualitas data atribut                   | **Must**                        |
| D. Smart Size                  | Ragu soal ukuran                                   | Berbasis size chart per produk                      | ⚙️    | Rendah–Sedang | Akurasi (estimasi)                      | **Should**                      |
| E. Personalized Discovery      | Katalog terasa generik                             | Sinyal perilaku sendiri                             | ⚙️    | Sedang        | Privasi, data sedikit saat demo         | **Could**                       |
| F. Brand Story & Local Craft   | Brand lokal kurang kredibel di toko online generik | Selaras EKRAF; cerita proses & pembuat              | —     | Rendah        | Konten brand belum ada                  | **Must**                        |

### I.2 Ide tambahan (G)

| Nama                                            | Masalah                          | Target           | Cara kerja                                                            | Nilai pembeda                                            | Kompleksitas       | Teknologi                 | Risiko                                 | Prioritas                  |
| ----------------------------------------------- | -------------------------------- | ---------------- | --------------------------------------------------------------------- | -------------------------------------------------------- | ------------------ | ------------------------- | -------------------------------------- | -------------------------- |
| **Shop the Look (bundle)**                      | Pelanggan menambah satu per satu | Alya             | Tombol "Add all" pada outfit; memasukkan semua varian terpilih ke bag | Memanfaatkan FR-033 tanpa fitur baru besar               | Rendah             | Server Action cart        | Stok sebagian habis → tangani per item | **Should** (bagian FR-033) |
| **Back-in-stock alert**                         | Produk habis → pelanggan pergi   | Raka             | Pelanggan mendaftar email; saat stok > 0 dikirim notifikasi           | Mengubah stok habis jadi peluang                         | Sedang             | Email (Resend/SMTP), cron | Ketergantungan layanan email           | Could                      |
| **Brand Story Cinema** (sudah ada di prototype) | Katalog tanpa cerita             | Semua            | Pinned story per koleksi & halaman brand                              | Pembeda visual; dipakai ulang untuk Brand Story (FR-036) | Rendah (sudah ada) | CSS/IntersectionObserver  | Performa pada ponsel lemah             | **Must** (dipertahankan)   |
| **Owner "Tanya Bisnis" di Telegram (NL query)** | Owner ingin bertanya bebas       | Bu Dewi          | Teks bebas → AI memilih laporan dari daftar tool read-only            | Natural                                                  | Sedang–Tinggi      | AI + tool                 | Salah interpretasi                     | Future                     |
| **Pre-order / limited drop**                    | Produksi terbatas/kecil          | Owner, pelanggan | Produk berstatus PREORDER dengan kuota & estimasi                     | Relevan EKRAF                                            | Sedang             | State produk tambahan     | Kompleksitas stok & komunikasi         | Future                     |

Ide lain (AR try-on, generator gambar AI, live-commerce) **ditolak**: biaya/risiko tinggi dan tidak menyelesaikan masalah yang sudah teridentifikasi.

### I.3 Matriks prioritas inovasi (skor 1–5; teknis/usaha: 5 = paling berat)

| Inovasi                                     | User value | Business value | Innovation | Tech complexity | Dev effort | Relevansi EKRAF | Kelompok   |
| ------------------------------------------- | :--------: | :------------: | :--------: | :-------------: | :--------: | :-------------: | ---------- |
| AI Shopping Assistant                       |     5      |       4        |     5      |        4        |     4      |        3        | **Must**   |
| Telegram Assistant (read-only + notifikasi) |     4      |       5        |     5      |        3        |     3      |        4        | **Must**   |
| Brand Story & Local Craft                   |     4      |       4        |     4      |        2        |     2      |        5        | **Must**   |
| Smart Outfit (aturan)                       |     4      |       4        |     4      |        3        |     3      |        3        | **Must**   |
| Smart Size (size chart)                     |     4      |       4        |     3      |        2        |     2      |        2        | **Should** |
| Scheduled Report                            |     3      |       4        |     3      |        2        |     2      |        3        | **Should** |
| Personalized Discovery                      |     3      |       3        |     3      |        3        |     3      |        3        | **Could**  |
| Back-in-stock alert                         |     3      |       4        |     2      |        3        |     3      |        2        | **Could**  |
| Telegram aksi tulis                         |     3      |       3        |     3      |        4        |     4      |        3        | **Future** |
| NL query owner                              |     3      |       3        |     4      |        4        |     4      |        3        | **Future** |
| Pre-order drop                              |     3      |       3        |     3      |        4        |     4      |        5        | **Future** |

**Kombinasi kompetisi R0:** Scripted Assistant + Simulator Telegram + Brand Story & Local Craft + Smart Outfit minimum. Smart Size hanya ditambahkan bila core end-to-end dan quality gates sudah hijau. Provider AI dan bot Telegram nyata meningkatkan R1, tetapi bukan syarat keberhasilan demo R0.
