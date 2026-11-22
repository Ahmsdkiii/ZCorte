# Panduan Setup Lokal

Panduan ini memastikan ketiga laptop anggota tim memakai environment yang konsisten untuk menjalankan dan menguji **ZCorté**.

## 1. Prasyarat

- **Node.js `>= 22.0.0`** (gunakan versi pada [.nvmrc](../../.nvmrc); disarankan memakai `nvm` / `fnm`).
- **pnpm `10.20.0`** (aktifkan lewat `corepack enable` setelah Node terpasang).
- **Docker & Docker Compose** untuk menjalankan PostgreSQL development (`db`, port `5432`) dan test (`db-test`, port `5433`).
  - _Alternatif tanpa Docker:_ Jika laptop tidak memungkinkan menjalankan Docker, gunakan layanan PostgreSQL cloud gratis (mis. **Neon** atau **Supabase**). **Setiap developer wajib memakai database masing-masing** (jangan berbagi satu DB dev bersama 3 orang agar migration dan test tidak saling menimpa).
- **Git** dan editor **VS Code** (direkomendasikan karena pengaturan workspace sudah disiapkan di `.vscode/`).

## 2. Langkah Setup Pertama Kali

1. **Clone ke folder ASCII (penting):**
   Jangan memakai nama folder dengan aksen `é` (`ZCorté`), karena beberapa versi Prisma CLI dan Docker volume memiliki kendala dengan karakter non-ASCII.

   ```bash
   git clone https://github.com/Ahmsdkiii/ZCorte.git zcorte
   cd zcorte
   ```

2. **Install dependency:**

   ```bash
   corepack enable
   pnpm install --frozen-lockfile
   ```

3. **Siapkan environment variables:**

   ```bash
   cp .env.example .env
   ```

   Buka `.env` dan pastikan nilai berikut terisi:
   - `DATABASE_URL` dan `DATABASE_URL_TEST`: default pada `.env.example` sudah cocok langsung dengan `docker-compose.yml`.
   - `AUTH_SECRET`: isi dengan string acak aman (bukan nilai placeholder):

     ```bash
     openssl rand -base64 32
     ```

   - Variabel `PAYMENT_MODE="simulated"`, `ASSISTANT_MODE="scripted"`, `TELEGRAM_MODE="simulator"`, `STORAGE_MODE="local"` dibiarkan pada nilai default R0.

4. **Jalankan PostgreSQL lokal via Docker:**

   ```bash
   docker compose up -d db
   docker compose ps
   ```

   Pastikan status container `zcorte-db` adalah `healthy`.

5. **(Setelah Foundation P1 ter-merge) Jalankan migration & seed:**

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

   > Pada commit pra-P1 saat ini, script `db:migrate` dan `db:seed` belum ada dan baru ditambahkan saat Foundation P1 selesai.

6. **Jalankan server development dan cek kualitas:**

   ```bash
   pnpm check
   pnpm dev
   ```

   Aplikasi dapat diakses di [http://localhost:3000](http://localhost:3000).

## 3. Pengaturan VS Code

Saat membuka folder `zcorte` di VS Code, klik **Install All** pada notifikasi rekomendasi ekstensi (dari [.vscode/extensions.json](../../.vscode/extensions.json)):

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- Prisma (`Prisma.prisma`)

[.vscode/settings.json](../../.vscode/settings.json) otomatis mengaktifkan _Format on Save_ memakai Prettier dan memakai versi TypeScript dari `node_modules`.

## 4. Troubleshooting Umum

| Masalah                                             | Penyebab                                               | Solusi                                                                                                           |
| --------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `prettier: not found` / `eslint: not found`         | Dependency belum terpasang                             | Jalankan `pnpm install --frozen-lockfile`                                                                        |
| Error port `5432` sudah dipakai                     | PostgreSQL bawaan OS sedang berjalan di host           | Matikan PostgreSQL lokal (`sudo systemctl stop postgresql`) atau ubah port host di `docker-compose.yml` & `.env` |
| Prisma CLI error path / Docker gagal mount          | Folder lokal mengandung huruf `é` (`ZCorté`)           | Rename/clone ulang ke folder ASCII `zcorte`                                                                      |
| Error Prisma Client belum ter-generate (setelah P1) | Perubahan `schema.prisma` baru ditarik dari remote     | Jalankan `pnpm prisma generate` dan `pnpm db:migrate`                                                            |
| Cache halaman atau tipe Next.js terasa nyangkut     | Cache `.next` lama tidak sinkron setelah pindah branch | Hapus `.next` (`rm -rf .next`) lalu jalankan ulang `pnpm dev`                                                    |
| `pnpm check` gagal di `format:check`                | Baris/spasi tidak sesuai `.prettierrc`                 | Jalankan `pnpm format:write` sebelum commit                                                                      |
