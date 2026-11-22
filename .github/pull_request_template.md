## Ringkasan Perubahan

<!-- Jelaskan secara singkat apa yang diubah dan mengapa. -->

## Referensi

- **FR / PRD:** <!-- contoh: FR-007 (prd/03-fr-customer.md) -->
- **Feature Doc:** <!-- contoh: docs/features/checkout-place-order.md -->
- **Issue:** <!-- contoh: Closes #12 -->
- **Lane:** <!-- pilih salah satu: P1 Foundation / Lane A / Lane B / Lane C / Contract -->

## Dampak Kontrak Bersama & Database

- [ ] Tidak menyentuh kontrak bersama (`schema.prisma`, `ErrorCode`/`ActionResult`, `AuthContext`, `env.ts`, design tokens)
- [ ] Menyentuh kontrak bersama — PR diberi label `contract` dan sudah disepakati tim
- [ ] Menambah 1 Prisma migration baru yang dibuat setelah rebase ke branch utama (tanpa mengedit migration lama)

## Checklist Kualitas

- [ ] `pnpm check` (`lint` + `format:check` + `typecheck`) hijau di lokal
- [ ] `pnpm build` berhasil di lokal
- [ ] `docs/features/<slug>.md` dan indeks di `docs/features/README.md` diperbarui
- [ ] Tidak ada `any`, tidak ada mock/seed sebagai fallback runtime, tidak ada debug `console.log`
- [ ] Jika menyentuh UI: sudah dicek di viewport 320–1440 px, navigasi keyboard, dan state loading/empty/error/success

## Bukti Pengujian / Screenshot

<!-- Tempel output test yang dijalankan dan screenshot jika ada perubahan UI. -->
