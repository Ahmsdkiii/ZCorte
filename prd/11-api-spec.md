# API & Server Actions

> Bagian Q.  
> ← [Daftar dokumen](README.md)

## Q. API & Server Actions Specification

**Aturan umum.** Semua input divalidasi Zod di server. Respons galat seragam: `{ "ok": false, "code": "VALIDATION_ERROR", "message": "…", "fieldErrors": {…} }`. Kode: 400 validasi, 401 belum login, 403 tidak berizin, 404 tidak ada, 409 konflik (stok/state), 429 rate limit, 500 tak terduga. Auth: **P** = publik, **U** = user login (Customer/Owner), **A** = Owner (area `/admin`).

### Q.1 Server Actions (mutasi dari UI)

| Action | Tujuan | Auth | Input | Output | Validasi / Galat |
|---|---|---|---|---|---|
| `registerUser` | Buat akun | P | email, password, name | `{ok}` | Zod; email unik → pesan generik |
| `addToCart` | Tambah item ke bag server | U (Visitor memakai bag `localStorage`) | variantId, qty | cart ringkas | qty 1–10, stok; 409 jika stok kurang |
| `updateCartItem` / `removeCartItem` | Ubah/hapus | U | itemId, qty | cart | idem |
| `mergeGuestCart` | Gabung bag lokal saat login/checkout | U | items[{variantId, qty}] | cart | maks 20 baris |
| `placeOrder` | Buat pesanan | U (login wajib) | CheckoutForm, shippingId, paymentMethod, promoCode?, idempotencyKey | `{orderNumber, paymentInstruction}` | Server hitung ulang total; 409 stok |
| `simulatePayment` | Selesaikan/gagalkan pembayaran R0 | U (pemilik order; hanya mode demo) | orderNumber, outcome | status | 404 lintas user; ditolak bila adapter bukan `simulated` |
| `toggleWishlist` | Simpan/hapus | U | productId | `{wishlisted}` | idempoten |
| `saveAddress` / `deleteAddress` / `setDefaultAddress` / `updateOrderAddress` | Alamat (profil & pesanan sebelum `PROCESSING`) | U (pemilik) | AddressInput | alamat | maks 5; kepemilikan diverifikasi |
| `submitReview` | Ulasan | U | productId, rating, comment | review | pembeli terverifikasi |
| `adminSaveProduct` / `adminArchiveProduct` | Produk | A | ProductInput | produk | lihat FR-021 |
| `adminAdjustStock` | Stok | A | variantId, delta/qty, reason | variant | stok ≥ 0 |
| `adminUpdateOrderStatus` | Status pesanan | A | orderId, toStatus, reason?, courier?, trackingNo? | order | state machine + aktor; tidak boleh menandai `PAID` |
| `adminConfirmManualRefund` | Catat refund manual | A | orderId, amount, reference, note | payment | hanya `REFUND_PENDING`; amount harus sesuai |
| `adminSaveCollection/Category/Promotion/Settings/BrandStory` | Master data | A | Input | entitas | Zod per entitas |
| `adminCreateTelegramLink` / `adminRevokeTelegramLink` | Tautan bot | A | — / linkId | tautan/OK | token 10 menit |

### Q.2 Route Handlers

| Method | Route | Tujuan | Auth | Input | Output | Validasi / Galat |
|---|---|---|---|---|---|---|
| GET | `/api/products/search` | Saran pencarian | P | `q` | `[{slug,name,price,image}]` | q 2–60; 429 |
| POST | `/api/cart/validate` | Revalidasi guest bag (harga/stok) | P/U | `{items:[{variantId,quantity}]}` maks 20 | cart ter-update | ID/qty divalidasi; server mengambil harga |
| POST | `/api/ai/chat` | Chat AI (stream) | P (status pesanan: U) | `{sessionId, messages[≤10]}` | stream teks + `productIds[]` | pesan ≤ 500; Visitor 10/jam, Customer 20/jam; 429; 503 fallback |
| POST | `/api/payments/webhook` | Callback gateway R1 | Signature provider resmi | payload gateway | `{received:true}` | signature salah → 401 tanpa mutasi; valid/duplikat → 200; jumlah beda → `NEEDS_ATTENTION` |
| GET | `/api/orders/[orderNumber]` | Detail pesanan | U (pemilik) | — | order | tak berhak → 404 |
| POST | `/api/telegram/webhook` | Update Telegram | Header `X-Telegram-Bot-Api-Secret-Token` | Update | 200 | secret salah → 401 |
| POST | `/api/cron/daily|weekly|monthly` | Laporan terjadwal | `Authorization: Bearer CRON_SECRET` | — | `{sent}` | 401 jika salah |
| POST | `/api/cron/expire-orders` | Kedaluwarsa pesanan & lepas stok | CRON_SECRET | — | `{expired}` | idempoten |
| GET | `/api/admin/reports/sales` | Data grafik dashboard (opsional, bila grafik klien) | A | `from,to,granularity` | deret waktu | rentang ≤ 366 hari |
| GET | `/api/health` | Cek hidup + DB | P | — | `{status}` | — |

> Tidak ada endpoint CRUD REST terpisah untuk produk/pesanan owner: mutasi memakai Server Actions, baca memakai Server Components → tidak ada endpoint tanpa kebutuhan fungsional.
