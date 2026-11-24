# Panduan Kolaborasi Tim (CONTRIBUTING)

Dokumen ini mengatur cara kerja harian 3 developer ZCorté di repository ini agar pekerjaan paralel tidak saling menimpa atau menimbulkan konflik. Untuk aturan arsitektur dan coding, ikuti [AGENTS.md](AGENTS.md).

## 1. Alur Kerja Git & Strategi Branch (Develop-First)

Repository ini menerapkan alur **Develop-First** untuk menjaga branch produksi tetap stabil:

- **Branch produksi / rilis:** `main` (atau `master`). Branch ini **wajib selalu hijau, stabil, dan siap didemokan kapan saja**. Dilarang push langsung.
- **Branch integrasi harian:** `develop`. **Semua Pull Request fitur (`feat/*`), perbaikan (`fix/*`), dokumentasi (`docs/*`), dan kontrak (`contract/*`) WAJIB ditargetkan ke branch `develop`**.
- **Rilis ke `main`/`master`:** Hanya dilakukan saat satu fase (misalnya Foundation P1 atau Release R0) telah teruji dan selesai secara menyeluruh di `develop` melalui PR khusus rilis.
- **Konvensi nama branch kerja:**
  - Fitur: `feat/fr-007-place-order` atau `feat/<feature-slug>`
  - Bugfix: `fix/<deskripsi-singkat>`
  - Dokumentasi: `docs/<deskripsi-singkat>`
  - Tooling / housekeeping: `chore/<deskripsi-singkat>`
  - Perubahan kontrak bersama: `contract/<deskripsi-singkat>`

## 2. Conventional Commits

Gunakan format `<type>(<scope>): <ringkasan> [FR-xxx]`:

- `feat(order): reserve stock atomically in placeOrder [FR-007]`
- `fix(bag): clamp quantity to available variant stock [FR-006]`
- `docs(features): mark checkout-place-order as DONE [FR-007]`
- `refactor(collections): unify dynamic collection route [FR-002]`
- `test(report): verify Asia/Jakarta midnight boundary [FR-020]`
- `chore(ci): add workflow quality gates`

## 3. Aturan Pull Request & Code Review

- **Ukuran PR:** Fokus satu tujuan atau satu fitur. Usahakan diff di bawah ~400 baris di luar file lockfile atau SQL migration ter-generate.
- **Template PR wajib diisi:** Tautkan FR terkait, slug di `docs/features/<slug>.md`, dan hasil cek lokal.
- **Reviewer silang:** Minimal **1 approval dari developer di lane lain** (lihat matriks di [docs/team/ownership.md](docs/team/ownership.md)). Target waktu respons review maksimal 24 jam.
- **Target Branch PR:** Selalu arahkan base branch PR ke **`develop`** (bukan ke `master`/`main`).
- **Strategi Merge:** Gunakan **Squash and merge** dan hapus branch setelah ter-merge. Jika ada konflik saat akan merge, lakukan `git fetch origin && git rebase origin/develop` di branch Anda, jalankan ulang cek, lalu push `--force-with-lease`.

### 3.1 SOP Code Review & Perbaikan Pasca-Merge

Agar proses review antaranggota tim (`SIDQI`, `DINO`, `KANEKA`) tidak menimbulkan konflik branch, _stash_ yang menimpa file lama, atau _checksum mismatch_ pada database:

1. **Mode Review adalah Read-Only:**
   Saat Anda melakukan `git checkout <branch-rekan>` untuk memeriksa atau mencoba PR rekan di lokal, **jangan mengedit atau meng-commit perubahan langsung di branch rekan** tanpa kesepakatan eksplisit.
2. **Wajib Tunggu CI Hijau Sebelum Merge:**
   Jangan menekan tombol **Merge pull request** di GitHub apabila status check GitHub Actions (`Quality Gate — Lint, Format, Typecheck & Build`) masih merah atau belum selesai berjalan.
3. **Dua Jalur Resmi Jika Ditemukan Perbaikan saat Review:**
   - **Jalur A (PR belum di-merge):** Tuliskan temuan pada komentar review GitHub PR, lalu biarkan pemilik PR yang memperbaiki dan me-push ke branch PR tersebut.
   - **Jalur B (PR sudah telanjur di-merge ke `develop`):**
     1. Pindah ke `develop` dan tarik hasil merge terbaru: `git checkout develop && git pull --rebase origin develop`.
     2. Buat branch perbaikan baru dari `develop`: `git checkout -b fix/<nama-perbaikan>`.
     3. Terapkan perbaikan di branch `fix/*` tersebut. **Penting:** jangan pernah menggunakan `git stash apply` yang memodifikasi file `prisma/migrations/<migration_lama>/migration.sql` yang sudah ter-merge; buat migration baru (_forward-fix_) jika ada koreksi skema SQL.
     4. Jalankan `pnpm check && pnpm build`, lalu buka PR baru ke `develop`.

## 4. Aturan Kontrak Bersama (`contract` PR)

File-file berikut adalah **kontrak bersama** yang memengaruhi seluruh tim:

- `prisma/schema.prisma`
- `src/server/lib/errors.ts` (`AppError`, `ErrorCode`)
- `src/lib/action-result.ts` (`ActionResult<T>`)
- `src/server/auth/*` (`AuthContext`, `requireUser`, `requireRole`)
- `src/config/env.ts` & `.env.example`
- Design tokens di `src/app/globals.css`

**Aturan:**

1. Jangan mengubah file kontrak bersama secara diam-diam di dalam PR fitur biasa.
2. Ajukan perubahan kontrak bersama melalui PR kecil khusus berlabel `contract` (atau selesaikan saat Foundation P1) dan beri tahu dua developer lain di grup tim sebelum merge.
3. Jika fitur Anda terpaksa menyentuh file milik lane lain, tag pemilik lane tersebut sebagai reviewer (lihat [docs/team/ownership.md](docs/team/ownership.md)).

## 5. Ringkasan Protokol Prisma Migration

1. Satu PR maksimal satu migration baru.
2. Selalu `git pull --rebase` terhadap branch utama **tepat sebelum** menjalankan `prisma migrate dev`.
3. Jangan pernah mengedit file migration yang sudah ter-merge ke branch utama.
4. Perubahan schema lintas lane wajib didiskusikan terlebih dahulu.
5. Jika terjadi konflik migration, ikuti prosedur pemulihan di [docs/guides/03-database-workflow.md](docs/guides/03-database-workflow.md).

## 6. Sinkronisasi Harian

- Setiap pagi sebelum mulai coding: `git pull --rebase` dari branch utama dan cek GitHub Project board.
- Ambil task dengan meng-assign diri Anda pada GitHub Issue terkait dan pindahkan status ke **In Progress** agar tidak ada pekerjaan ganda.
- Jika memakai AI agent, ikuti [docs/guides/05-ai-agent-guide.md](docs/guides/05-ai-agent-guide.md).

## 7. Checklist Sebelum Membuka PR

- [ ] Berada di branch fitur/fix/docs tersendiri (dibuat dari `develop`), bukan di `develop` atau `main`/`master`.
- [ ] Base branch PR di GitHub diarahkan ke **`develop`**.
- [ ] Dokumen fitur di `docs/features/<slug>.md` dibuat/diperbarui dan terdaftar di [docs/features/README.md](docs/features/README.md).
- [ ] Jika menambah/mengubah Route Handler `src/app/api/**/route.ts`, file koleksi Postman/Apidog di [docs/api/zcorte.postman_collection.json](docs/api/zcorte.postman_collection.json) dan [docs/api/README.md](docs/api/README.md) sudah diperbarui.
- [ ] `pnpm check` (`lint` + `format:check` + `typecheck`) dan `pnpm build` hijau di lokal.
- [ ] Test yang relevan sudah ditambahkan dan dijalankan (tidak ada `any`, tidak ada mock runtime untuk data inti).
- [ ] Jika menyentuh kontrak bersama, PR diberi label `contract` dan disetujui tim.
- [ ] Jika menyentuh UI, sudah dicek di mobile (320/390 px) hingga desktop (1440 px) dan navigasi keyboard.
