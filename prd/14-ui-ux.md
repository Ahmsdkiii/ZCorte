# UI/UX

> Bagian K.  
> ← [Daftar dokumen](README.md)

## K. UI/UX Requirements

### K.1 Prinsip

1. **Struktur & konten prototype adalah acuan**; identitas visual (palet, tipografi, tata letak) mengikuti prototype; perubahan hanya lewat design tokens.
2. Visual editorial: whitespace besar, fotografi sebagai titik fokus, tipografi display tebal, garis tipis (`border-line`), minim dekorasi — sesuai karakter minimalis/timeless.
3. **Mobile-first**: breakpoint yang ada (`md` 768, `lg`, `3xl` 1600) dipertahankan; target sentuh ≥ 44 px; tidak ada scroll horizontal pada 320 px.
4. Komponen reusable mengikuti atomic design yang ada; shadcn/ui dipakai untuk primitif area Owner & form (Dialog, Table, Select, Tabs), dibungkus agar mengikuti token.
5. Aksesibilitas WCAG 2.2 AA: kontras ≥ 4,5:1, fokus terlihat, `SkipLink`, label form, `aria-live` untuk toast/chat, `prefers-reduced-motion` menonaktifkan pinned story & animasi.

### K.2 Daftar halaman

| Area       | Halaman                                                                                                                                                                                                                                                | Asal         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| Storefront | `/`, `/collections/[slug]`, `/shop`, `/shop/[slug]`, `/checkout`                                                                                                                                                                                       | [P]/[P+]/[R] |
| Storefront | `/about` (Brand Story & Local Craft)                                                                                                                                                                                                                   | [R]          |
| Akun       | `/login`, `/register`, `/account`, `/account/addresses`, `/account/orders`, `/account/orders/[orderNumber]`, `/account/wishlist`                                                                                                                       | [R]          |
| Owner      | `/admin` (dashboard), `/admin/products` (+ `/new`, `/[id]`), `/admin/collections`, `/admin/categories`, `/admin/inventory`, `/admin/orders` (+ `/[id]`), `/admin/customers`, `/admin/promotions`, `/admin/settings`, `/admin/telegram`, `/admin/audit` | [R]          |
| Sistem     | `not-found`, `error`, `loading` per segmen                                                                                                                                                                                                             | [R]          |

### K.3 Komponen baru yang dibutuhkan

| Komponen                                                                                            | Lapisan           | Dipakai di            |
| --------------------------------------------------------------------------------------------------- | ----------------- | --------------------- |
| `ChatLauncher`, `ChatPanel`, `ChatMessage`, `ChatProductCard`, `ChatSuggestions`                    | compound          | AI Assistant (FR-031) |
| `SearchDialog`, `SearchResultItem`                                                                  | compound          | FR-004                |
| `FilterBar` (extend `ShopBrowser`), `PriceRange`, `Pagination`                                      | organism/molecule | FR-003                |
| `WishlistButton`                                                                                    | molecule          | Kartu, PDP            |
| `OutfitSuggestion`                                                                                  | organism          | PDP (FR-033)          |
| `SizeFinderDialog`                                                                                  | compound          | PDP (FR-034)          |
| `StorySection`, `CraftHighlight`                                                                    | organism          | FR-036                |
| `DataTable`, `StatCard`, `SalesChart`, `StatusBadge`, `ConfirmDialog`, `ImageUploader`, `FormField` | owner             | FR-020–027            |
| `EmptyState`, `ErrorState`, `Skeleton`, `Toast`                                                     | atom/molecule     | Seluruh aplikasi      |

### K.4 State UI wajib

| State   | Aturan                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------- |
| Loading | Skeleton dengan dimensi sama dengan konten (hindari CLS); tombol submit menampilkan status "memproses" dan nonaktif |
| Empty   | Teks + tindakan lanjut (mis. bag kosong: "YOUR BAG IS EMPTY." dari prototype + tautan ke `/shop`)                   |
| Error   | Pesan manusiawi, tombol "Coba lagi", tanpa stack trace; galat form per kolom                                        |
| Success | Toast/confirm layar (mis. konfirmasi pesanan prototype)                                                             |

### K.5 Halaman inovasi

- **AI Assistant**: tombol 48 px di pojok kanan bawah; panel 380×560 di desktop, _bottom sheet_ 85% tinggi di mobile. Pesan pertama berisi 3–4 chip saran ("Cari outfit kerja", "Bantu pilih ukuran", "Cara checkout", "Cek pesanan saya"). Kartu produk memakai komponen `ProductCard` ringkas. Footer panel memuat catatan "Asisten dapat keliru; periksa detail di halaman produk."
- **Dashboard Owner**: sidebar (desktop) / drawer (mobile); baris KPI → grafik penjualan (toggle Hari/Minggu/Bulan) → dua tabel (Pesanan butuh perhatian, Stok menipis) → produk terlaris. Halaman `/admin/telegram` menampilkan status tautan, tombol hubungkan/cabut, dan preferensi notifikasi.
- **Telegram**: R0 memakai Simulator di `/admin/telegram`; R1 menambahkan status link, tombol hubungkan/cabut, dan preferensi notifikasi pada halaman yang sama.
