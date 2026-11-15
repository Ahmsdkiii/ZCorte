# Analisis Prototype

> Bagian 0.  
> ← [Daftar dokumen](README.md)

## 0. Hasil Analisis Prototype (Dasar Seluruh Dokumen)

### 0.1 Inventaris halaman

| Rute | Isi / Section | Data dinamis | Catatan |
|---|---|---|---|
| `/` | (1) Hero sinematik full-bleed, (2) "The Premise" `#brand`, (3) Pinned cinematic story (6 langkah), (4) Tiga kolom koleksi `#collections`, (5) Katalog konsep (produk `featured`), (6) Closing + tautan ke 3 koleksi | Produk featured, story steps | JSON-LD Organization & WebSite |
| `/collections/{tactix,apextive,outdoor}` | Hero koleksi, Premise, Pinned story koleksi, "A Closer Look" (2 kolom), katalog koleksi, sign-off | Meta koleksi, story steps, produk per koleksi | Tiga halaman terpisah dengan struktur nyaris identik (**risiko duplikasi → lihat G8**) |
| `/shop` | Header katalog, filter koleksi, sort (featured / harga naik / harga turun), grid produk, "Clear filter", penghitung hasil | Produk | Filter & sort tersimpan di URL (`?collection=&sort=`) |
| `/shop/[slug]` | Galeri (front/back/context, fullscreen dialog, thumbnail), info produk (koleksi, nama, harga), pilih warna & ukuran, quantity, Add to Bag, akordeon Specifications / Materials & Care / Shipping & Returns, produk terkait | Produk, related | JSON-LD Product & Breadcrumb tersedia di `lib/jsonLd.ts` |
| `/checkout` | Form kontak, alamat pengiriman, metode pengiriman, metode pembayaran, ringkasan pesanan, layar konfirmasi pesanan | Cart, opsi pengiriman/pembayaran | **Seluruhnya disimulasikan di client** |
| Overlay | Header (desktop nav + dialog menu mobile), Cart Drawer ("YOUR BAG"), Quick-Add Modal (pilih ukuran), Fullscreen Gallery Dialog, Footer | Cart | `robots.ts`, `sitemap.ts` sudah ada |

### 0.2 Komponen & pola desain yang terlihat

- **Arsitektur komponen**: Atomic (`atoms` → `molecules` → `organisms`) + `compound` (ProductCard, CartDrawer, QuickAddModal, ProductGallery, CinemaStory).
- **Pola MVVM ringan**: setiap view memiliki hook view-model (`useShopViewModel`, `useCheckoutViewModel`, dst.), data lewat `models/services` → `mappers` → `types`, aturan domain di `models/domain/productRules.ts`.
- **Lapisan data siap-API**: `httpClient.ts` + `isApiConfigured()` dengan fallback ke mock. Ini aset penting: pola ini dipertahankan dan diganti implementasinya, bukan dibuang.
- **Design tokens** (Tailwind v4 `@theme`): surface/ink/muted/line/control/button, tema `cinematic` (gelap), aksen per koleksi, `--gutter` & `--header-height` responsif, font display + body, `ease-apex`.
- **Aksesibilitas yang sudah ada**: `SkipLink`, `aria-label` pada kontrol, `dialog` native untuk menu mobile, tombol sentuh ≥ 44px.

### 0.3 Model data yang terbaca dari prototype

| Entitas | Atribut penting |
|---|---|
| Product | id, slug, name, collection, price (IDR integer), featured, description, colors[], sizes[] (kosong = one-size), contextImages[], isConcept, specifications{concept, materials, fit, care}, relatedProductSlugs[] |
| ProductColorVariant | id (`graphite`/`olive`), name, swatch, images{front, back}, unavailableSizes[] |
| Cart item | id = `productId:colorId:size`, product, colorId, size, quantity (disimpan di `localStorage`) |
| Checkout | email, nama depan/belakang, telepon, alamat, apartemen, kota, provinsi, kode pos, catatan; shipping `standard` (gratis, 3–5 hari kerja) / `express` (Rp45.000, 1–2 hari kerja); payment `virtual_account` / `qris` / `card` |
| Collection | id, name, tagline, focus, description, accentColor, heroImage, keywords |
| StoryStep | step, numberStr, title, headline, description, image, imageAlt |

Seed katalog: **6 produk** (Utility Overshirt Rp1.250.000, Transit Sling Rp650.000, Movement Tee Rp450.000, Training Shorts Rp550.000, Trail Shell Rp1.750.000, Ridge Pack Rp950.000), 2 warna, ukuran S–XL (tas = one-size), 3 koleksi.

### 0.4 Peran pengguna yang terbaca

Hanya **pengunjung anonim** (belanja tanpa akun). Tidak ada autentikasi, profil, pengelolaan toko, atau pesanan tersimpan. Kebutuhan baru: **Customer** (login wajib saat checkout) dan **Owner** (pengelola toko). Platform ini adalah toko satu brand, **ZCorté**, bukan marketplace multi-brand.

### 0.5 Gap & keputusan produk yang dibutuhkan

| # | Temuan | Dampak | Rekomendasi |
|---|---|---|---|
| G2 | Nama brand lama "APEX" tertanam di banyak tempat (lihat Lampiran B) termasuk nama koleksi `APEX TACTIX`, `APEXTIVE`, `APEX OUTDOOR` | Penggantian ke ZCorté tidak sebatas teks | Checklist migrasi di Lampiran B; nama koleksi tetap keputusan D-02 |
| G3 | Seluruh produk bertanda `isConcept` ("CONCEPT", disclaimer "not an offer to sell") | Tidak cocok untuk toko yang benar-benar menjual | Ganti menjadi status katalog nyata (`ACTIVE`/`DRAFT`), hapus label & disclaimer konsep |
| G4 | Checkout, nomor pesanan (acak di client), dan pembayaran hanya simulasi | Tidak ada pesanan nyata | Pindah ke server: order, payment, stok (FR-007–FR-009) |
| G5 | Tidak ada search, wishlist, akun, alamat, review, pelacakan pesanan | Bagian dari scope brief | Ditambahkan sebagai **[R]** |
| G6 | Tidak ada konsep stok per varian; hanya `unavailableSizes` per warna | Monitoring stok & Telegram tidak mungkin | Tambah `ProductVariant` dengan `stock` |
| G7 | Validasi checkout minimal (email hanya cek `@`, tanpa format telepon/kode pos) | Data kotor | Zod schema bersama client & server |
| G8 | Tiga halaman koleksi hampir identik (kode berulang) | Menurunkan skor JSCPD | Satu route dinamis `collections/[slug]` + satu `CollectionView` |
| G9 | Konten UI berbahasa Inggris | Target pasar Indonesia | **Keputusan D-03** (lihat §D.4). Konten prototype tidak diubah tanpa persetujuan |
| G10 | `SITE_URL` menunjuk domain demo; `/shop` berjudul "Concept Catalog" | Metadata SEO salah | Dipindah ke env `NEXT_PUBLIC_SITE_URL` |
