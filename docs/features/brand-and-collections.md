# Brand Migration (APEX → ZCorté), Dynamic Collections & Debounced Search (`FR-002`, `FR-004`)

| Metadata         | Nilai                                        |
| ---------------- | -------------------------------------------- |
| Slug             | `brand-collections-search`                   |
| Status           | `IN_PROGRESS`                                |
| Lane             | `Lane A / Frontend`                          |
| Owner            | `SIDQI (Frontend Lead)`                      |
| Reviewer         | `DINO / KANEKA`                              |
| Branch / PR      | `feat/brand-collections-search`              |
| Referensi PRD/FR | `prd/03-fr-customer.md` (`FR-002`, `FR-004`) |
| Dibuat           | `2026-11-24`                                 |
| Diperbarui       | `2026-11-24`                                 |

## 1. Masalah dan Outcome

1. Sebelumnya masih terdapat residu nama brand prototipe lama `APEX` di beberapa komponen UI, metadata, dan mock data (seharusnya brand umbrella adalah **ZCorté**, dengan 3 koleksi: `tactix`, `apextive`, `outdoor`).
2. Rute koleksi terpecah menjadi 3 halaman hardcoded terpisah (`collections/tactix`, `collections/apextive`, `collections/outdoor`) yang menimbulkan duplikasi kode. Kini dikonsolidasikan menjadi satu rute dinamis `/collections/[slug]` menggunakan `generateStaticParams`.
3. Header belum memiliki fitur Search produk yang interaktif sesuai `FR-004`. Kini disediakan Route Handler `/api/products/search?q=` dengan PostgreSQL query dan komponen HeaderSearch debounced (300 ms) beserta dropdown saran produk.

## 2. Acceptance Criteria

- [x] Tidak ada lagi teks `APEX` yang berdiri sendiri sebagai nama brand utama (diganti menjadi `ZCORTÉ` / `THE ZCORTÉ SYSTEM`). Koleksi `APEXTIVE` tetap ada sebagai nama sub-koleksi.
- [x] Rute `/collections/[slug]` menangani seluruh koleksi (`tactix`, `apextive`, `outdoor`) secara dinamis, mengimplementasikan `generateStaticParams`, dan mengembalikan 404 jika slug tidak valid.
- [x] Route Handler `GET /api/products/search?q=` mencari produk aktif berdasarkan nama, deskripsi, koleksi, dan kategori dengan batas 2-60 karakter.
- [x] Komponen HeaderSearch melakukan debounce 300 ms, menampilkan dropdown live results dengan gambar, nama, dan harga, serta mendukung tombol Enter menuju `/shop?q=`.
- [x] Seluruh berkas memenuhi Clean Code `NFR-06` ($\le 250$ baris per berkas).
