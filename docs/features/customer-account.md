# Customer Account Dashboard — Profile, Address Book & Orders

| Metadata         | Nilai                                        |
| ---------------- | -------------------------------------------- |
| Slug             | `customer-account`                           |
| Status           | `IN_PROGRESS`                                |
| Lane             | `Lane A`                                     |
| Owner            | `SIDQI (Frontend / Lane A)`                  |
| Reviewer         | `DINO / KANEKA`                              |
| Branch / PR      | `feat/customer-account`                      |
| Referensi PRD/FR | `prd/03-fr-customer.md` (`FR-011`, `FR-009`) |
| Dibuat           | `2026-11-24`                                 |
| Diperbarui       | `2026-11-24`                                 |

## 1. Masalah dan Outcome

Sebelumnya, pelanggan yang telah login atau mendaftar akun di ZCorté belum memiliki dashboard `/account` untuk mengelola profil, menyimpan beberapa alamat pengiriman, dan melihat riwayat pesanan mereka beserta status pelacakan.

Outcome yang dicapai:

1. Halaman `/account` dengan server session guard (otomatis redirect ke `/login?callbackUrl=/account` bagi pengunjung yang belum login).
2. Tiga tab utama yang terorganisir dan mendukung deep-link query parameter (`/account?tab=orders|addresses|profile`):
   - **Profil:** Manajemen nama, email (read-only), nomor telepon format Indonesia, dan preferensi personalisasi.
   - **Buku Alamat (`Addresses`):** Daftar alamat tersimpan, badge default, aksi set as default, hapus alamat, dan form tambah alamat baru.
   - **Riwayat Pesanan (`Orders`):** Daftar pesanan dengan nomor pesanan (`ZCT-YYMM-NNNN`), status badge real-time (`PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `COMPLETED`, `CANCELLED`), tanggal pembuatan, rincian item, dan total belanja.
3. Server Actions `src/actions/account.actions.ts` yang terhubung langsung ke Prisma `User`, `Address`, dan `Order`.
4. Kepatuhan Clean Code `NFR-06` (semua berkas baru ≤ 250 baris).

## 2. Scope

### In Scope (Task Frontend #8 — `FR-011`, `FR-009`)

- Route group `src/app/(account)/layout.tsx` dan `src/app/(account)/account/page.tsx`.
- Komponen navigasi dan section: `AccountNav.tsx`, `AccountProfileSection.tsx`, `AccountAddressesSection.tsx`, `AccountOrdersSection.tsx`.
- Hook ViewModel `useAccountViewModel.ts`.
- Server Actions `account.actions.ts` untuk update profil, CRUD alamat, dan query pesanan.

### Out of Scope

- Integrasi pelacakan kurir pihak ketiga melalui API eksternal (R0 hanya menyediakan tautan resi kurir sesuai PRD `FR-009`).
- Pembatalan pesanan pasca-pembayaran (pembatalan mandiri hanya saat `PENDING_PAYMENT` sesuai `FR-009`).

## 3. Acceptance Criteria

- [x] Given pengguna belum login, when mengakses `/account`, then diarahkan ke `/login?callbackUrl=/account`.
- [x] Given pengguna login, when membuka tab Addresses dan menambah alamat dengan nomor telepon/kode pos valid, then alamat tersimpan dan dapat diset sebagai default.
- [x] Given pengguna memiliki pesanan, when membuka tab Orders, then daftar pesanan tampil dengan status badge yang akurat dan total terformat IDR.
- [x] Given seluruh berkas implementasi, when diperiksa dengan `wc -l`, then tidak ada berkas yang melebihi 250 baris.
