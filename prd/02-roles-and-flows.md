# Peran & Alur Pengguna

> Bagian G dan J: peran, hak akses, dan alur.  
> ← [Daftar dokumen](README.md)

## G. User Roles & Permissions

Platform melayani **satu brand**. Hanya ada dua peran berakun, ditambah pengunjung anonim:

| Peran                     | Cara identifikasi                                         | Cakupan                                                                                                               |
| ------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Visitor** (tanpa login) | Tanpa sesi                                                | Browse, search, lihat Brand Story, bag (localStorage), AI Assistant untuk pertanyaan produk. **Tidak dapat checkout** |
| **Customer**              | Sesi Auth.js, `role=CUSTOMER`                             | Semua hak Visitor + checkout, alamat, riwayat & pelacakan pesanan, wishlist, review, status pesanan via AI            |
| **Owner**                 | `role=OWNER` (dibuat lewat seed, tanpa registrasi publik) | Seluruh area `/admin`, Telegram Business Assistant, audit log. Mencakup seluruh pengelolaan toko                      |

> Area pengelolaan tetap bernama `/admin` dan Server Action berawalan `admin*`; yang berhak mengaksesnya hanya peran `OWNER`. Peran `STAFF` (operasional pesanan/stok tanpa akses omzet) dicatat sebagai **Future** (D-13). Enum `Role` dibuat dapat ditambah tanpa mengubah guard.

| Kemampuan                                                           |        Visitor         |        Customer        |              Owner               |
| ------------------------------------------------------------------- | :--------------------: | :--------------------: | :------------------------------: |
| Browse / search / PDP / Brand Story                                 |           ✅           |           ✅           |                ✅                |
| Bag                                                                 |       ✅ (lokal)       | ✅ (tersimpan di akun) |                ✅                |
| Checkout & pembayaran                                               |  ❌ (diarahkan login)  |           ✅           |                ✅                |
| Wishlist, alamat, review                                            |           ❌           |           ✅           | ✅ (review dilarang untuk Owner) |
| Lihat pesanan sendiri                                               |           ❌           |           ✅           |                ✅                |
| Batalkan pesanan sendiri (saat `PENDING_PAYMENT`)                   |           ❌           |   ✅ (milik sendiri)   |                ✅                |
| AI: info produk/outfit/ukuran/FAQ                                   | ✅ (batas lebih ketat) |           ✅           |                ✅                |
| AI: status pesanan                                                  |           ❌           |   ✅ (milik sendiri)   |        ✅ (milik sendiri)        |
| Dashboard, CRUD produk/stok, ubah status pesanan, promo, pengaturan |           ❌           |           ❌           |                ✅                |
| Simulator/perintah/notifikasi Telegram, audit log                   |           ❌           |           ❌           |                ✅                |

Otorisasi ditegakkan di **service layer** lewat satu guard (`requireRole("OWNER")`, `requireUser()`); `proxy.ts` (konvensi middleware di Next.js 16) hanya lapisan pertama untuk `/admin` dan `/account`. Link "Dashboard" di header hanya tampil untuk Owner.

## J. User Flow

### J.1 Alur belanja (Visitor → Customer)

```mermaid
flowchart TD
  A[Home] --> B{Cari produk}
  B -->|Navigasi koleksi| C[Halaman Koleksi]
  B -->|Search / Filter| D[Katalog /shop]
  B -->|Tanya AI| AI[AI Assistant]
  C --> E[Detail Produk]
  D --> E
  AI -->|Tautan produk| E
  E --> F{Ukuran jelas?}
  F -->|Tidak| G[Find my size]
  G --> E
  F -->|Ya| H[Add to Bag]
  E --> O[Complete the Look]
  O --> H
  H --> I[Bag Drawer]
  I --> J[Checkout]
  J --> K{Sudah login?}
  K -->|Tidak| L[Login atau Daftar, bag terbawa]
  K -->|Ya| M[Pilih alamat tersimpan]
  L --> M
  M --> N[Pilih pengiriman & pembayaran]
  N --> N2[Periksa alamat]
  N2 --> P[placeOrder: transaksi + stok]
  P --> Q[Pembayaran]
  Q -->|Sukses adapter/webhook| R[Konfirmasi & Tracking di akun]
  Q -->|Gagal/kedaluwarsa| S[Bayar ulang / Batalkan / Expired stok dilepas]
```

### J.2 Alur owner & Telegram

```mermaid
flowchart LR
  subgraph Owner
    D1[Login Owner] --> D2[Dashboard]
    D2 --> D3[Produk / Stok / Pesanan]
    D2 --> D4[Simulator R0 / Hubungkan Bot R1]
  end
  subgraph Telegram
    T1[Notifikasi PAID / Stok / Batal] --> T2[Owner membaca]
    T2 --> T3["Perintah: /summary, /sales_today, /low_stock"]
  end
  D4 --> T3
  D3 -->|event domain| T1
```

### J.3 Alur AI Assistant

```mermaid
sequenceDiagram
  actor U as Pelanggan
  participant UI as Chat UI
  participant API as /api/ai/chat
  participant AP as Assistant Provider
  participant S as Service Layer
  participant DB as PostgreSQL
  U->>UI: "Kemeja kerja budget 1 juta"
  UI->>API: pesan + sessionId
  API->>API: validasi, rate limit, sanitasi
  API->>AP: pesan + tools yang diizinkan
  AP->>API: tool_call searchProducts(maxPrice=1000000)
  API->>S: ProductService.search (userId dari sesi, bukan dari model)
  S->>DB: query
  DB-->>S: produk aktual
  S-->>API: hasil terstruktur
  API->>AP: tool_result
  AP-->>API: teks + productIds
  API-->>UI: stream teks + kartu produk (data diambil ulang dari DB)
  UI-->>U: jawaban + tautan PDP
```

Pada R0, `Assistant Provider` adalah `ScriptedAssistant`; pada R1 dapat diganti model AI tanpa mengubah tool atau service. Prinsip yang sama berlaku untuk Simulator Telegram dan transport bot R1.
