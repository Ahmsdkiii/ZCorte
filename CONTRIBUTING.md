# Panduan Kolaborasi Tim (CONTRIBUTING)

Dokumen ini mengatur cara kerja harian 3 developer ZCorté di repository ini agar pekerjaan paralel tidak saling menimpa atau menimbulkan konflik. Untuk aturan arsitektur dan coding, ikuti [AGENTS.md](AGENTS.md).

## 1. Alur Kerja Git & Branch

- **Branch utama:** `main` (saat ini masih bernama `master` sampai diubah di GitHub Settings; CI berjalan otomatis untuk `main` dan `master`). Branch utama **wajib selalu hijau** dan dapat didemokan kapan saja.
- **Dilarang push langsung** ke `main`/`master` setelah branch protection aktif. Semua perubahan masuk melalui Pull Request.
- **Konvensi nama branch:**
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
- **Strategi Merge:** Gunakan **Squash and merge** dan hapus branch setelah ter-merge. Jika ada konflik saat akan merge, lakukan `git fetch origin && git rebase origin/master` (atau `origin/main`) di branch Anda, jalankan ulang cek, lalu push `--force-with-lease`.

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

- [ ] Berada di branch fitur/fix/docs tersendiri, bukan di branch utama.
- [ ] Dokumen fitur di `docs/features/<slug>.md` dibuat/diperbarui dan terdaftar di [docs/features/README.md](docs/features/README.md).
- [ ] `pnpm check` (`lint` + `format:check` + `typecheck`) dan `pnpm build` hijau di lokal.
- [ ] Test yang relevan sudah ditambahkan dan dijalankan (tidak ada `any`, tidak ada mock runtime untuk data inti).
- [ ] Jika menyentuh kontrak bersama, PR diberi label `contract` dan disetujui tim.
- [ ] Jika menyentuh UI, sudah dicek di mobile (320/390 px) hingga desktop (1440 px) dan navigasi keyboard.
