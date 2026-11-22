# Alur Kerja Database & Protokol Migration (Tim 3 Orang)

PostgreSQL adalah **satu-satunya sumber kebenaran** semua data inti ZCorté (produk, varian, harga, gambar, stok, akun, pesanan, laporan, dan audit). Dokumen ini menjelaskan cara mengubah schema secara aman ketika 3 developer bekerja paralel.

## 1. Aturan Emas Database ZCorté

1. **Setelah Foundation P1 selesai, `prisma/schema.prisma` adalah sumber kebenaran teknis skema database.** Setiap perubahan `schema.prisma` wajib memperbarui dokumentasi di [prd/10-database.md](../../prd/10-database.md) di dalam PR yang sama.
2. **Dilarang runtime fallback ke mock/seed.** File `prisma/seed.ts` hanya dijalankan eksplisit melalui CLI (`pnpm db:seed`) dan wajib idempoten (`upsert`).
3. **Uang disimpan sebagai `Int` rupiah** (minor unit IDR, tanpa desimal/float).
4. **Stok hanya diubah lewat `InventoryService`** di dalam transaksi database bersama pencatatan `InventoryMovement`.

## 2. Siklus Normal Perubahan Schema

> Script `pnpm db:migrate` dan `pnpm db:seed` mulai tersedia setelah **Foundation P1** selesai.

```bash
# 1. Pastikan berada di atas commit terbaru branch utama
git fetch origin
git rebase origin/master # atau origin/main setelah rename

# 2. Edit prisma/schema.prisma

# 3. Buat migration dengan nama yang jelas
pnpm db:migrate --name add_order_expires_at

# 4. Commit schema.prisma + folder prisma/migrations/<timestamp>_... bersama-sama
```

---

## 3. Protokol Anti-Konflik Migration (5 Aturan Wajib)

Konflik `prisma/migrations/` terjadi apabila dua developer membuat migration di branch berbeda lalu me-merge keduanya. Ikuti 5 aturan ini untuk mencegahnya:

1. **Satu PR = Maksimal Satu Migration Baru.**
   Jika Anda membuat beberapa eksperimen schema selama coding lokal, gabungkan kembali menjadi satu migration yang bersih sebelum membuka PR.
2. **Rebase Tepat Sebelum Generate Migration.**
   Jangan pernah menjalankan `prisma migrate dev` sebelum menarik migration terbaru dari branch utama.
3. **Dilarang Mengedit atau Menghapus Migration yang Sudah Ter-Merge.**
   Jika ada kesalahan pada migration yang sudah masuk branch utama, buat **migration baru (forward-fix)** untuk memperbaikinya.
4. **Perubahan Schema Lintas Lane Wajib PR `contract`.**
   Bila PR Anda mengubah tabel/kolom yang dipakai lane lain (mis. `Order`, `ProductVariant`, `User`), diskusikan dan kirim sebagai PR kecil berlabel `contract` terlebih dahulu (lihat [docs/team/ownership.md](../team/ownership.md)).
5. **Dokumentasikan Rollback/Backfill.**
   Isi bagian `5.4 Data dan Migration` di `docs/features/<slug>.md` terkait.

## 4. Cara Mengatasi Konflik Migration di Branch Sendiri

Jika branch utama baru saja mendapat migration dari developer lain sementara PR Anda juga memiliki migration yang **belum di-merge**:

```bash
# 1. Hapus folder migration lokal Anda yang belum di-merge
rm -rf prisma/migrations/<timestamp_migration_lokal_anda>

# 2. Rebase ke branch utama terbaru agar mendapat migration resmi dari tim
git fetch origin
git rebase origin/master # atau origin/main

# 3. Reset database dev lokal (HANYA DB LOKAL PRIBADI, jangan pernah DB staging/prod)
pnpm prisma migrate reset --force

# 4. Generate ulang migration Anda di atas state terbaru
pnpm db:migrate --name <nama_intent>
pnpm db:seed
```

> **Peringatan Keras:** Jangan pernah menjalankan `migrate reset --force` pada database bersama, staging, atau produksi. Perintah tersebut hanya aman pada container `db` lokal pribadi Anda.

## 5. Aturan Seed & Bootstrap

- `prisma/seed.ts` memakai `upsert` sehingga aman dijalankan berulang kali saat menguji ulang data awal demo.
- Kode aplikasi di `src/` **dilarang mengimpor** `prisma/seed.ts` atau `src/models/data/*.mock.ts`.
- Setelah seed masuk, perubahan katalog demo dikelola melalui halaman Owner (`/admin/products`) atau Prisma Studio, dan dibaca langsung oleh storefront, assistant, serta cart.
