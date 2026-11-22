# Panduan Memakai AI Coding Agent

Ketiga developer diperbolehkan memakai AI coding assistant (Claude, Cursor, Antigravity, Codex, dll.). Agar kode dari 3 developer tetap terasa seperti ditulis oleh satu tim dengan standar yang sama, ikuti panduan ini.

## 1. Aturan Dasar Bekerja dengan AI Agent

1. **Selalu arahkan agent ke `AGENTS.md` dan `docs/features/<slug>.md` terlebih dahulu.**
2. **Jangan minta agent mengerjakan lintas lane atau mengubah kontrak bersama secara diam-diam.** Jika butuh perubahan kontrak bersama (`schema.prisma`, `ErrorCode`, `ActionResult`, `AuthContext`), minta agent berhenti dan pisahkan menjadi PR `contract`.
3. **Satu sesi / satu branch = satu fitur atau bugfix kecil.** Jangan meminta agent melakukan refactor besar bersamaan dengan fitur.
4. **Dilarang meminta agent melemahkan aturan** (`@ts-ignore`, `eslint-disable`, `any`, atau melewati `pnpm check`).

## 2. Daftar Skill Proyek (`.agent/skills/`)

Jika agent Anda mendukung skills di `.agent/skills/`, arahkan agar membacanya sesuai tugas:

| Skill                       | Kapan Dipakai                                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `code-review-clean-code`    | Setiap implementasi & review agar mematuhi TypeScript strict, MVVM, dan modularitas                                                    |
| `nextjs-app-router`         | Saat membuat Server/Client Component, dynamic route, Server Action, atau caching Next.js 16                                            |
| `react-compound-components` | Saat membuat/mengubah `CartDrawer`, `ProductCard`, `ProductGallery`, `ChatPanel`, `SizeFinderDialog`                                   |
| `tailwind-css-v4`           | Saat menyentuh styling dan design token `@theme` di `globals.css`                                                                      |
| `seo-and-metadata`          | Saat menyentuh metadata, canonical, JSON-LD, sitemap, atau robots halaman publik                                                       |
| `web-accessibility-a11y`    | Saat membuat modal/drawer, form, fokus keyboard, dan `aria-live` _(catatan: target proyek ini adalah **WCAG 2.2 AA** sesuai PRD §K.1)_ |

## 3. Template Prompt Siap Pakai

### A. Memulai Fitur Baru (Buat Dokumen Desain Dulu)

```text
Baca AGENTS.md, docs/team/ownership.md, docs/guides/02-feature-recipe.md, dan prd/<file-fr>.md bagian <FR-xxx>.
Saya berada di <Lane A/B/C>. Buat docs/features/<slug>.md dari docs/features/_template.md dengan status DRAFT terlebih dahulu (jangan ubah kode dulu).
Pastikan semua Acceptance Criteria, pemetaan MVVM, alur Service→Repository, error cases, dan kontrak bersama yang disentuh tercatat jelas.
```

### B. Implementasi Fitur (Setelah `DRAFT` Disetujui)

```text
Implementasikan <FR-xxx> berdasarkan docs/features/<slug>.md dan AGENTS.md.
Batasan wajib:
- Jangan ubah file milik lane lain atau kontrak bersama di luar scope docs/features/<slug>.md.
- Gunakan ActionResult<T> & AppError dari kontrak PRD; tidak ada mock data runtime dan tidak ada `any`.
- Tambahkan unit & integration test sesuai docs/guides/04-testing-guide.md.
- Setelah selesai, jalankan `pnpm check` dan `pnpm build`, lalu perbarui docs/features/<slug>.md (hanya catat hasil command yang benar-benar dijalankan).
```

### C. Self-Review Sebelum Membuka PR

```text
Periksa `git diff` pada branch ini terhadap AGENTS.md, CONTRIBUTING.md, dan Acceptance Criteria <FR-xxx>:
1. Adakah import `@/server/*` dari client/hooks atau query Prisma di luar repository?
2. Adakah business rule/perhitungan harga di UI atau duplikasi logika?
3. Adakah perubahan tak sengaja pada file kontrak bersama atau lane lain?
4. Apakah docs/features/<slug>.md sudah sinkron dengan implementasi dan hasil verifikasi?
```

## 4. Checklist Verifikasi Manusia (Wajib Sebelum Commit/Push)

Jangan pernah langsung percaya ringkasan dari AI agent tanpa memeriksa 5 hal berikut:

- [ ] **Cek `git status` & `git diff`:** Pastikan hanya file yang relevan dengan task dan lane Anda yang berubah.
- [ ] **Cek bukti command:** Pastikan Anda melihat output asli `pnpm check` dan `pnpm build` hijau setelah edit terakhir.
- [ ] **Cek kebenaran data:** Pastikan tidak ada fallback ke `*.mock.ts`, data statis, atau `setTimeout` simulasi yang tertinggal.
- [ ] **Cek security dasar:** Pastikan input divalidasi Zod, otorisasi dicek di service layer, dan tidak ada secret atau PII yang masuk log/komponen client.
- [ ] **Uji manual di browser:** Jalankan `pnpm dev` dan coba langsung alur pengguna di desktop dan mobile (DevTools 390 px).
