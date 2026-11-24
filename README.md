# ZCorté — Fashion E-Commerce Platform

Platform fashion e-commerce satu brand (**ZCorté**) oleh tim **ZeroCode** untuk Kompetisi Clean Code Web Programming (subtema EKRAF). Dibangun dengan Next.js 16 (App Router), React 19, TypeScript `strict`, Tailwind CSS v4, PostgreSQL, dan Prisma ORM.

Target saat ini adalah **Release 0 (R0 — Competition MVP)**: core e-commerce berjalan nyata di atas PostgreSQL + Prisma + Auth.js (autentikasi, otorisasi server, reservasi stok atomik, pesanan, audit, laporan), sedangkan integrasi eksternal (`PaymentGateway`, `AssistantProvider`, `TelegramTransport`, `StorageProvider`) memakai adapter simulasi deterministik tanpa ketergantungan jaringan eksternal.

## Quickstart (5 Langkah)

> **Catatan nama folder:** Clone ke folder ASCII `zcorte` (tanpa huruf `é`) agar Prisma CLI, Docker volume, dan path tool lintas OS tidak bermasalah.

```bash
git clone https://github.com/Ahmsdkiii/ZCorte.git zcorte
cd zcorte
git checkout develop
corepack enable && pnpm install
cp .env.example .env
docker compose up -d db
pnpm db:migrate && pnpm db:seed
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

> **Otomatisasi Prisma Client:** `pnpm install`, `pnpm typecheck`, dan `pnpm build` sudah otomatis menjalankan `prisma generate`, sehingga Anda tidak akan terkena error `Module '"@prisma/client"' has no exported member 'PrismaClient'`. Detail konfigurasi `.env` dan opsi database cloud lihat [Panduan Setup Lokal](docs/guides/01-local-setup.md).

## Daftar Script

| Command                       | Fungsi                                                                 | Status            |
| ----------------------------- | ---------------------------------------------------------------------- | ----------------- |
| `pnpm dev`                    | Jalankan server development (`next dev --turbopack`)                   | Aktif             |
| `pnpm build`                  | Generate Prisma Client + build production (`next build`)               | Aktif             |
| `pnpm start`                  | Jalankan hasil build production                                        | Aktif             |
| `pnpm lint`                   | Pemeriksaan ESLint (`@next/next` + `@typescript-eslint` + batas layer) | Aktif             |
| `pnpm lint:fix`               | Perbaiki issue ESLint otomatis bila memungkinkan                       | Aktif             |
| `pnpm format:check`           | Cek konsistensi format Prettier                                        | Aktif             |
| `pnpm format:write`           | Format seluruh file dengan Prettier                                    | Aktif             |
| `pnpm typecheck`              | Generate Prisma Client + type-check TypeScript (`tsc --noEmit`)        | Aktif             |
| `pnpm check`                  | Gabungan `lint` + `format:check` + `typecheck`                         | Aktif             |
| `pnpm db:generate`            | Generate Prisma Client dari `prisma/schema.prisma`                     | Aktif             |
| `pnpm db:migrate`             | Jalankan migrasi Prisma dev ke PostgreSQL                              | Aktif             |
| `pnpm db:seed`                | Jalankan bootstrap seed idempoten ke PostgreSQL                        | Aktif             |
| `pnpm db:studio`              | Buka GUI Prisma Studio untuk inspeksi tabel database                   | Aktif             |
| `pnpm test` / `pnpm test:e2e` | Vitest (unit/integrasi) & Playwright (E2E/a11y)                        | Ditambahkan di P1 |
| `pnpm jscpd` / `pnpm knip`    | Deteksi duplikasi (<= 3%) & dead code                                  | Ditambahkan di P1 |

## Mau Apa? Baca Ini

| Kebutuhan                                                           | Dokumen Tujuan                                                             |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Baru bergabung ke repo? Pahami peta proyek dalam 15 menit           | [docs/guides/00-start-here.md](docs/guides/00-start-here.md)               |
| Setup Docker, `.env`, VS Code, atau troubleshooting lokal           | [docs/guides/01-local-setup.md](docs/guides/01-local-setup.md)             |
| Membuat fitur dari FR sampai PR (lengkap dengan contoh kode)        | [docs/guides/02-feature-recipe.md](docs/guides/02-feature-recipe.md)       |
| Mengubah `schema.prisma`, membuat migration, atau mengatasi konflik | [docs/guides/03-database-workflow.md](docs/guides/03-database-workflow.md) |
| Menulis dan menjalankan unit, integration, & E2E test               | [docs/guides/04-testing-guide.md](docs/guides/04-testing-guide.md)         |
| Menguji endpoint `/api/*` dengan Postman / Apidog / Thunder Client  | [docs/api/README.md](docs/api/README.md)                                   |
| Bekerja bersama AI coding agent secara aman dan konsisten           | [docs/guides/05-ai-agent-guide.md](docs/guides/05-ai-agent-guide.md)       |
| Pembagian 3 lane paralel, folder owner, & kontrak bersama           | [docs/team/ownership.md](docs/team/ownership.md)                           |
| Aturan branch, commit, PR, review, & merge tim                      | [CONTRIBUTING.md](CONTRIBUTING.md)                                         |
| Aturan engineering lengkap (arahan arsitektur & larangan keras)     | [AGENTS.md](AGENTS.md)                                                     |
| Sumber kebenaran produk, FR, ERD, API spec, & R0 MVP                | [prd/README.md](prd/README.md)                                             |
| Registry slug & dokumen implementasi per fitur                      | [docs/features/README.md](docs/features/README.md)                         |

## Status Proyek

- **Fase saat ini:** Pra-P1 (dokumentasi, kontrak bersama, dan tooling repo siap; Foundation P1 berikutnya).
- **Target rilis aktif:** Release 0 (R0 — Competition MVP) — lihat [prd/07-mvp-prototype-plan.md](prd/07-mvp-prototype-plan.md) dan [docs/team/ownership.md](docs/team/ownership.md).
