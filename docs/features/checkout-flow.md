# Checkout Form & Flow — Contact, Courier Dispatch & Settlement

| Metadata         | Nilai                                        |
| ---------------- | -------------------------------------------- |
| Slug             | `checkout-flow`                              |
| Status           | `IN_PROGRESS`                                |
| Lane             | `Lane B` (dikembangkan bersama Storefront)   |
| Owner            | `SIDQI / DINO`                               |
| Reviewer         | `KANEKA`                                     |
| Branch / PR      | `feat/checkout-flow`                         |
| Referensi PRD/FR | `prd/03-fr-customer.md` (`FR-007`, `FR-008`) |
| Dibuat           | `2026-11-24`                                 |
| Diperbarui       | `2026-11-24`                                 |

## 1. Masalah dan Outcome

Halaman `/checkout` (`FR-007`) sebelumnya memiliki satu berkas monolitik `CheckoutFormSection.tsx` berukuran 280 baris yang melanggar aturan Clean Code `NFR-06` (maksimal 250 baris). Selain itu, halaman masih memuat sisa copy prototipe `APEX`, placeholder `Raka Pratama`, "concept manifest receipt", dan format nomor pesanan lama `APX-2611-XXXX`.

Outcome yang dicapai pada task ini:

1. **Modularisasi Bersih Sesuai `NFR-06`:** Memecah form checkout menjadi 3 sub-bagian independen (`CheckoutAddressFields`, `CheckoutShippingFields`, `CheckoutPaymentFields`) di mana setiap berkas berukuran < 130 baris.
2. **Format Nomor Pesanan Resmi ZCorté:** Mengubah generator snapshot order menjadi `ZCT-2611-XXXX`.
3. **Validasi Form Ketat:** Validasi RFC email, regex nomor ponsel Indonesia (`^(\+62|62|0)8[0-9]{8,12}$`), kode pos 5 digit (`^\d{5}$`), serta nama dan alamat wajib.
4. **Pembersihan Total Brand Prototype:** Seluruh copy, metadata, breadcrumb, dan konfirmasi pesanan dimigrasikan ke narasi resmi **ZCorté** ("_Crafted in Bandung, West Java_").
5. **Integrasi Keranjang & Pengosongan Otomatis:** Mengambil data belanja dari `useCartViewModel` (`zcorte_cart_v1`) dan mengosongkan keranjang saat order sukses di-submit.

## 2. Scope

### In Scope (Task Frontend #6 — `FR-007`)

- Modularisasi `CheckoutFormSection.tsx` menjadi sub-komponen `CheckoutAddressFields.tsx`, `CheckoutShippingFields.tsx`, dan `CheckoutPaymentFields.tsx`.
- Validasi form ketat (email, nama, telepon Indonesia, alamat, kota, provinsi, kode pos 5 digit).
- Pilihan kurir ZCorté: Standard Ground (Complimentary — Rp0) & Express Priority (Rp45.000).
- Pilihan kanal pembayaran simulasi R0: Virtual Account, QRIS Instant Scan, dan Credit Card.
- Layar konfirmasi pesanan `CheckoutConfirmationSection.tsx` dengan nomor referensi `ZCT-2611-XXXX`.
- Pembersihan teks prototipe `APEX` pada `/checkout/page.tsx` dan `CheckoutView.tsx`.

### Out of Scope

- Integrasi Server Action `placeOrder` dengan Prisma database transaction (dikerjakan pada Task Backend #6 oleh DINO).
- Webhook payment gateway nyata (di luar scope R0).

### 2.3 Kontrak Bersama yang Disentuh

- [x] Tidak ada kontrak bersama yang berubah
- [ ] `prisma/schema.prisma`
- [ ] `ErrorCode` / `ActionResult`
- [ ] `AuthContext` / guard peran
- [ ] Environment variables (`src/config/env.ts`, `.env.example`)
- [ ] Design tokens (`src/app/globals.css`)

## 3. User Story dan Acceptance Criteria

**User story:** Sebagai pengunjung atau pelanggan ZCorté, saya ingin mengisi data kontak, alamat pengiriman, memilih kurir, dan memilih metode pembayaran simulasi pada form checkout yang tervalidasi dengan baik, sehingga saya mendapatkan nomor pesanan resmi ZCorté dan bukti manifest pemesanan yang jelas.

- [x] Given formulir checkout, when pengguna memasukkan nomor telepon yang tidak sesuai format Indonesia atau kode pos bukan 5 digit, then pesan error spesifik muncul di bawah field terkait.
- [x] Given pilihan kurir pengiriman, when pengguna memilih "Express Priority Courier", then ongkir Rp45.000 ditambahkan secara otomatis pada ringkasan pesanan.
- [x] Given pesanan berhasil dikonfirmasi, when layar konfirmasi muncul, then nomor pesanan memiliki format resmi `ZCT-2611-XXXX` dan keranjang belanja dikosongkan.
- [x] Given aturan Clean Code `NFR-06`, when ukuran berkas diperiksa, then seluruh komponen checkout berukuran ≤ 250 baris (`CheckoutFormSection` < 80 baris).

## 4. Desain Teknis (Pemetaan Frontend MVVM)

| Lapisan            | File/Modul                                                                                 | Tanggung jawab                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Model/DTO          | `src/models/types/checkout.ts`, `src/models/types/cart.ts`                                 | Definisi tipe `CheckoutFormData`, `ShippingMethodOption`, `PaymentMethodOption`, `SubmittedOrder` |
| ViewModel          | `src/hooks/useCheckoutViewModel.ts`                                                        | State form, validasi Zod/Regex, hitung subtotal & total ongkir, pembuatan order snapshot `ZCT`    |
| View (Sub-fields)  | `CheckoutAddressFields.tsx`, `CheckoutShippingFields.tsx`, `CheckoutPaymentFields.tsx`     | Presentasi visual input form per kategori dengan aksesibilitas keyboard dan `role="radio"`        |
| View (Organisms)   | `CheckoutFormSection.tsx`, `CheckoutSummarySection.tsx`, `CheckoutConfirmationSection.tsx` | Komposisi form checkout, ringkasan manifest, dan layar konfirmasi pesanan                         |
| Server composition | `src/app/checkout/page.tsx`                                                                | Layout page, Breadcrumb JSON-LD, dan SEO metadata ZCorté                                          |

## 5. Hasil Validasi

| Pemeriksaan         | Hasil  | Catatan                                                             |
| ------------------- | ------ | ------------------------------------------------------------------- |
| `pnpm lint`         | `PASS` | 0 error, 0 warning                                                  |
| `pnpm format:check` | `PASS` | Seluruh file terformat rapi sesuai Prettier                         |
| `pnpm typecheck`    | `PASS` | Lulus `tsc --noEmit` tanpa error                                    |
| Batas ukuran file   | `PASS` | Seluruh file yang disentuh ≤ 250 baris (sesuai `NFR-06`)            |
| `pnpm build`        | `PASS` | Next.js 16 (Turbopack) build berhasil me-render halaman `/checkout` |
