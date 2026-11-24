# Authentication UI — Login, Registration & Session Access

| Metadata         | Nilai                              |
| ---------------- | ---------------------------------- |
| Slug             | `auth-ui`                          |
| Status           | `IN_PROGRESS`                      |
| Lane             | `Lane A`                           |
| Owner            | `SIDQI (Frontend / Lane A)`        |
| Reviewer         | `DINO / KANEKA`                    |
| Branch / PR      | `feat/auth-ui`                     |
| Referensi PRD/FR | `prd/03-fr-customer.md` (`FR-010`) |
| Dibuat           | `2026-11-24`                       |
| Diperbarui       | `2026-11-24`                       |

## 1. Masalah dan Outcome

Sebelumnya storefront ZCorté belum memiliki halaman `/login` dan `/register` untuk otentikasi pembeli atau owner. Akses fitur akun, checkout resmi (`FR-007`), serta area owner `/admin` memerlukan kredensial login yang sah. Selain itu, diperlukan desain khusus login dan register bertema editorial luxury 50/50 split-screen tanpa Header dan Footer storefront agar pengunjung dapat fokus sepenuhnya pada proses autentikasi.

Outcome yang dicapai:

1. **Isolasi Layout via Route Groups:** Storefront dipindahkan ke route group `(storefront)` dengan `Header`, `Footer`, dan `CartDrawer`. Halaman autentikasi dipindahkan ke route group `(auth)` dengan layout clean tanpa Header dan Footer.
2. **50/50 Editorial Split Layout (`AuthSplitLayout`):**
   - Kolom kiri (Desktop `md:block`): Visual fashion editorial beresolusi tinggi (`campaign-main-1.jpeg` untuk login, `campaign-outdoor-mist.jpeg` untuk register), dark gradient luxury overlay, ZCorté wordmark, editorial eyebrow, display headline, dan brand tagline.
   - Kolom kanan: Navigasi cepat "← Back to store", form autentikasi berpusat secara ergonomis dan minimalis tanpa border kartu kaku.
3. Halaman `/login` (Sign In) bertema editorial ZCorté dengan input email, password, toggle visibility, dan helper tombol _"1-Click Demo Accounts"_ (Customer Demo & Owner Demo) untuk kenyamanan demonstrasi kompetisi.
4. Halaman `/register` (Create Account) dengan validasi nama lengkap, email unik, nomor telepon Indonesia (`+62`/`08`), dan password minimal 10 karakter sesuai `FR-010`.
5. Server Actions `loginAction`, `registerAction`, dan `logoutAction` pada `src/actions/auth.actions.ts` yang memverifikasi kredensial database PostgreSQL melalui Prisma dan `bcryptjs`.
6. Cookie sesi HTTP-only aman (`zcorte_session`) dengan masa aktif 7 hari.
7. Pemenuhan aturan Clean Code `NFR-06` (seluruh file berukuran ≤ 250 baris).

## 2. Scope

### In Scope (Task Frontend #7 — `FR-010`)

- Route groups `(storefront)` dan `(auth)` untuk isolasi navigasi/layout.
- Komponen `AuthSplitLayout.tsx` di `src/components/organisms/Auth/`.
- Halaman `/login` (`src/app/(auth)/login/page.tsx`) dan `/register` (`src/app/(auth)/register/page.tsx`).
- Organisms `LoginForm.tsx` dan `RegisterForm.tsx` di `src/components/organisms/Auth/`.
- Hook interaksi `useAuthViewModel.ts` dengan penanganan `callbackUrl`, toggle visibility, dan quick fill demo credentials.
- Server Action `auth.actions.ts` dan session management di `src/server/auth/session.ts`.
- Validasi Zod/Regex format nomor telepon Indonesia dan panjang password minimal 10 karakter.

### Out of Scope

- Google OAuth provider (sesuai PRD `prd/07-mvp-prototype-plan.md §Z.1`, tidak termasuk dalam R0).
- Reset password via email transaksional (direncanakan untuk R2).

### 2.3 Kontrak Bersama yang Disentuh

- [x] Tidak ada kontrak bersama yang berubah
- [ ] `prisma/schema.prisma`
- [ ] `ErrorCode` / `ActionResult`
- [ ] `AuthContext` / guard peran
- [ ] Environment variables (`src/config/env.ts`, `.env.example`)
- [ ] Design tokens (`src/app/globals.css`)

## 3. User Story dan Acceptance Criteria

**User story:** Sebagai pengunjung (Visitor) atau pemilik (Owner), saya ingin masuk ke akun ZCorté saya atau mendaftar akun baru melalui form yang aman dan mudah digunakan, sehingga saya dapat melakukan checkout, melihat pesanan, atau mengelola toko.

- [x] Given halaman `/login`, when pengguna mengklik tombol "Customer Demo" atau "Owner Demo", then field email dan password otomatis terisi dengan kredensial seed yang valid.
- [x] Given form registrasi, when pengguna memasukkan password kurang dari 10 karakter, then muncul pesan error inline "Password must be at least 10 characters long".
- [x] Given kredensial yang valid saat login, when submit berhasil, then cookie sesi `zcorte_session` diset sebagai `HttpOnly` dan pengguna diarahkan ke `callbackUrl` atau dashboard.
- [x] Given aturan Clean Code `NFR-06`, when ukuran file diperiksa, then seluruh berkas auth berukuran ≤ 250 baris.

## 4. Desain Teknis (Pemetaan Frontend MVVM)

| Lapisan            | File/Modul                                                   | Tanggung jawab                                                                       |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Model/Database     | `prisma/schema.prisma` (`User` model)                        | Model persistence akun pengguna (`CUSTOMER`, `OWNER`)                                |
| Server Boundary    | `src/actions/auth.actions.ts`, `src/server/auth/session.ts`  | Verifikasi bcrypt, query Prisma, pembuatan cookie sesi `zcorte_session`              |
| ViewModel          | `src/hooks/useAuthViewModel.ts`                              | State form, toggle password, quick fill demo, error handling inline                  |
| View (Organisms)   | `src/components/organisms/Auth/{LoginForm,RegisterForm}.tsx` | Komposisi antarmuka form login dan register, aksesibilitas alert, dan input semantik |
| Server composition | `src/app/login/page.tsx`, `src/app/register/page.tsx`        | Layout page, Schema.org Breadcrumb JSON-LD, dan SEO metadata ZCorté                  |

## 5. Hasil Validasi

| Pemeriksaan         | Hasil  | Catatan                                           |
| ------------------- | ------ | ------------------------------------------------- |
| `pnpm lint`         | `PASS` | 0 error, 0 warning                                |
| `pnpm format:check` | `PASS` | Seluruh file terformat rapi sesuai Prettier       |
| `pnpm typecheck`    | `PASS` | Lulus `tsc --noEmit` tanpa error                  |
| Batas ukuran file   | `PASS` | Seluruh berkas auth ≤ 250 baris (sesuai `NFR-06`) |
| `pnpm build`        | `PASS` | Next.js 16 (Turbopack) build production berhasil  |
