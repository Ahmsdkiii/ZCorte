# API & Server Actions

> Bagian Q.  
> ← [Daftar dokumen](README.md)

## Q. API & Server Actions Specification

**Aturan umum.** Semua input divalidasi Zod di server. Seluruh Server Action dan Route Handler JSON memakai kontrak tunggal **`ActionResult<T>`** dan katalog **`ErrorCode`** di bawah ini. Auth: **P** = publik, **U** = user login (Customer/Owner), **A** = Owner (area `/admin`).

```ts
export type ErrorCode =
  | "VALIDATION_ERROR" // 400 — input/Zod tidak valid
  | "UNAUTHENTICATED" // 401 — belum login / token webhook salah
  | "FORBIDDEN" // 403 — role tidak berizin
  | "NOT_FOUND" // 404 — tidak ada atau milik user lain (IDOR)
  | "CONFLICT" // 409 — konflik unik / duplikasi umum
  | "OUT_OF_STOCK" // 409 — stok varian tidak mencukupi
  | "INVALID_STATE_TRANSITION" // 409 — transisi status tidak sah
  | "PENDING_ORDER_LIMIT" // 409 — batas maks 3 pesanan PENDING_PAYMENT tercapai
  | "RATE_LIMITED" // 429 — batas request terlampaui
  | "PROVIDER_UNAVAILABLE" // 503 — provider eksternal timeout/gagal
  | "INTERNAL_ERROR"; // 500 — galat internal tak terduga

export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: ErrorCode;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
```

### Q.1 Server Actions (mutasi dari UI)

| Action                                                                       | Tujuan                                         | Auth                                   | Input                                                               | Output                               | Validasi / Galat                                                                            |
| ---------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `registerUser`                                                               | Buat akun                                      | P                                      | email, password, name                                               | `{ok}`                               | Zod; email unik → pesan generik                                                             |
| `addToCart`                                                                  | Tambah item ke bag server                      | U (Visitor memakai bag `localStorage`) | variantId, qty                                                      | cart ringkas                         | qty 1–10, stok; 409 jika stok kurang                                                        |
| `updateCartItem` / `removeCartItem`                                          | Ubah/hapus                                     | U                                      | itemId, qty                                                         | cart                                 | idem                                                                                        |
| `mergeGuestCart`                                                             | Gabung bag lokal saat login/checkout           | U                                      | items[{variantId, qty}]                                             | cart                                 | maks 20 baris                                                                               |
| `placeOrder`                                                                 | Buat pesanan                                   | U (login wajib)                        | CheckoutForm, shippingId, paymentMethod, promoCode?, idempotencyKey | `{orderNumber, paymentInstruction}`  | Server hitung ulang total; `OrderSequence`; 409 `OUT_OF_STOCK` / `PENDING_ORDER_LIMIT`      |
| `cancelMyOrder`                                                              | Batalkan pesanan sebelum bayar                 | U (pemilik order)                      | orderNumber, reason?                                                | `{orderNumber, status: "CANCELLED"}` | Hanya `PENDING_PAYMENT`; lepas stok atomik; 404 lintas user; 409 `INVALID_STATE_TRANSITION` |
| `retryPayment`                                                               | Buat instruksi pembayaran baru                 | U (pemilik order)                      | orderNumber, paymentMethod?                                         | `{orderNumber, paymentInstruction}`  | Hanya `PENDING_PAYMENT` & belum lewat `expiresAt`; batalkan `Payment(PENDING)` lama         |
| `simulatePayment`                                                            | Selesaikan/gagalkan pembayaran R0              | U (pemilik order; hanya mode demo)     | orderNumber, outcome                                                | status                               | 404 lintas user; ditolak bila adapter bukan `simulated`                                     |
| `toggleWishlist`                                                             | Simpan/hapus                                   | U                                      | productId                                                           | `{wishlisted}`                       | idempoten                                                                                   |
| `updateProfile`                                                              | Ubah nama & telepon profil                     | U                                      | name, phone?                                                        | `{user}`                             | Validasi Zod (FR-011)                                                                       |
| `saveAddress` / `deleteAddress` / `setDefaultAddress` / `updateOrderAddress` | Alamat (profil & pesanan sebelum `PROCESSING`) | U (pemilik)                            | AddressInput                                                        | alamat                               | maks 5; kepemilikan diverifikasi                                                            |
| `submitReview`                                                               | Ulasan                                         | U                                      | productId, rating, comment                                          | review                               | pembeli terverifikasi                                                                       |
| `adminSaveProduct` / `adminArchiveProduct`                                   | Produk                                         | A                                      | ProductInput                                                        | produk                               | lihat FR-021                                                                                |
| `adminAdjustStock`                                                           | Stok                                           | A                                      | variantId, delta/qty, reason                                        | variant                              | stok ≥ 0                                                                                    |
| `adminUpdateOrderStatus`                                                     | Status pesanan                                 | A                                      | orderId, toStatus, reason?, courier?, trackingNo?                   | order                                | state machine + aktor; tidak boleh menandai `PAID`                                          |
| `adminExpireOrdersNow`                                                       | Jalankan kedaluwarsa pesanan jatuh tempo       | A                                      | —                                                                   | `{expiredCount}`                     | Idempoten; lepas stok pesanan lewat `expiresAt`                                             |
| `adminConfirmManualRefund`                                                   | Catat refund manual                            | A                                      | orderId, amount, reference, note                                    | payment                              | hanya `REFUND_PENDING`; amount harus sesuai                                                 |
| `adminSaveCollection/Category/Promotion/Settings/BrandStory`                 | Master data                                    | A                                      | Input                                                               | entitas                              | Zod per entitas (`FR-027a`/`b`)                                                             |
| `adminCreateTelegramLink` / `adminRevokeTelegramLink`                        | Tautan bot                                     | A                                      | — / linkId                                                          | tautan/OK                            | token 10 menit                                                                              |
| `simulatorRunCommand`                                                        | Jalankan perintah Simulator Telegram R0        | A                                      | command                                                             | `{replyText, auditId}`               | Hanya Owner; memakai router & service sama dengan bot R1                                    |
| `simulatorSendDailyReport`                                                   | Picu laporan harian Simulator R0               | A                                      | date?                                                               | `{sent, dedupeKey}`                  | Dedupe per tanggal (`report:daily:YYYY-MM-DD`)                                              |

### Q.2 Route Handlers

| Method | Route                       | Tujuan                                              | Auth                                     | Input                                    | Output                              | Validasi / Galat                                                                          |
| ------ | --------------------------- | --------------------------------------------------- | ---------------------------------------- | ---------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| GET    | `/api/products/search`      | Saran pencarian                                     | P                                        | `q`                                      | `[{slug,name,price,image}]`         | q 2–60; 429                                                                               |
| POST   | `/api/cart/validate`        | Revalidasi guest bag (harga/stok)                   | P/U                                      | `{items:[{variantId,quantity}]}` maks 20 | cart ter-update                     | ID/qty divalidasi; server mengambil harga                                                 |
| POST   | `/api/ai/chat`              | Chat AI (stream)                                    | P (status pesanan: U)                    | `{sessionId, messages[≤10]}`             | stream teks + `productIds[]`        | pesan ≤ 500; Visitor 10/jam, Customer 20/jam; 429; 503 fallback                           |
| POST   | `/api/payments/webhook`     | Callback gateway R1                                 | Signature provider resmi                 | payload gateway                          | `{received:true}`                   | signature salah → 401 tanpa mutasi; valid/duplikat → 200; jumlah beda → `NEEDS_ATTENTION` |
| GET    | `/api/orders/[orderNumber]` | Detail pesanan                                      | U (pemilik)                              | —                                        | order                               | tak berhak → 404                                                                          |
| POST   | `/api/telegram/webhook`     | Update Telegram                                     | Header `X-Telegram-Bot-Api-Secret-Token` | Update                                   | 200                                 | secret salah → 401                                                                        |
| POST   | `/api/cron/daily            | weekly                                              | monthly`                                 | Laporan terjadwal                        | `Authorization: Bearer CRON_SECRET` | —                                                                                         | `{sent}` | 401 jika salah |
| POST   | `/api/cron/expire-orders`   | Kedaluwarsa pesanan & lepas stok                    | CRON_SECRET                              | —                                        | `{expired}`                         | idempoten                                                                                 |
| GET    | `/api/admin/reports/sales`  | Data grafik dashboard (opsional, bila grafik klien) | A                                        | `from,to,granularity`                    | deret waktu                         | rentang ≤ 366 hari                                                                        |
| GET    | `/api/health`               | Cek hidup + DB                                      | P                                        | —                                        | `{status}`                          | —                                                                                         |

> Tidak ada endpoint CRUD REST terpisah untuk produk/pesanan owner: mutasi memakai Server Actions, baca memakai Server Components → tidak ada endpoint tanpa kebutuhan fungsional.
