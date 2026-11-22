# Resep Membangun Fitur End-to-End

Dokumen ini adalah panduan praktis langkah demi langkah untuk mengubah satu **Functional Requirement (FR)** menjadi fitur lengkap yang mematuhi arsitektur **MVVM** + **Service–Repository** di **AGENTS.md** dan **PRD**.

> **Catatan:** Contoh kode di bawah adalah **blueprint referensi** dengan studi kasus **FR-009: Customer Membatalkan Pesanan `PENDING_PAYMENT` (`cancelMyOrder`)**. File server/DB aktual (`src/server/*`, `src/actions/*`, `src/validators/*`) mulai dibuat pada fase Foundation P1 dan implementasi fitur masing-masing lane.

## Peta Aliran Data (10 Langkah)

```text
0. Feature Doc (DRAFT)
   └─► 1. Kontrak Error/ActionResult (pakai yang sudah ada)
       └─► 2. Validator Zod (src/validators/*.schema.ts)
           └─► 3. Domain Rules Murni (src/models/domain/*.ts)
               └─► 4. Repository (src/server/repositories/*.repository.ts)
                   └─► 5. Service (src/server/services/*.service.ts)
                       └─► 6. Server Action / Route Handler (src/actions/*.actions.ts)
                           └─► 7. ViewModel (src/hooks/use*ViewModel.ts)
                               └─► 8. View + Server Page (src/components/ + src/app/)
                                   └─► 9. Test (Unit + Integration + E2E)
                                       └─► 10. pnpm check + Feature Doc (DONE)
```

---

## Langkah 0: Buat Feature Doc (`DRAFT`)

Sebelum menulis kode, salin [docs/features/_template.md](../features/_template.md) memakai slug resmi dari [docs/features/README.md](../features/README.md) (mis. `docs/features/order-tracking.md`), isi bagian masalah, scope, AC, dan pemetaan layer dengan status `DRAFT`.

## Langkah 1: Gunakan Kontrak Bersama (`AppError` & `ActionResult`)

Jangan membuat format respons baru. Gunakan `ActionResult<T>` dan `ErrorCode` dari [prd/11-api-spec.md](../../prd/11-api-spec.md):

```ts
// Kontrak bersama di src/lib/action-result.ts & src/server/lib/errors.ts (dibuat di P1)
export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: ErrorCode;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
```

## Langkah 2: Tulis Validator Zod (`src/validators/`)

Validasi input harus dapat dipakai ulang di server (dan boleh di client untuk UX cepat), menolak properti asing dengan `.strict()`.

```ts
// src/validators/order.schema.ts
import { z } from "zod";

export const cancelOrderSchema = z
  .object({
    orderNumber: z.string().regex(/^ZCT-\d{4}-\d{4,}$/, "Invalid order number format."),
    reason: z.string().trim().max(250).optional(),
  })
  .strict();

export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
```

## Langkah 3: Tulis Domain Rules Murni (`src/models/domain/`)

Aturan bisnis yang tidak memerlukan database diletakkan di `src/models/` sebagai fungsi murni (tanpa import React, Next.js, atau Prisma) agar mudah diuji dengan unit test.

```ts
// src/models/domain/orderRules.ts
import { ConflictError } from "@/models/errors"; // atau error domain murni

export type OrderStatus =
  "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export function canCustomerCancelOrder(status: OrderStatus): boolean {
  return status === "PENDING_PAYMENT";
}
```

## Langkah 4: Tulis Repository (`src/server/repositories/`)

Repository **hanya menjalankan query Prisma** dengan `select` eksplisit, menerima `Prisma.TransactionClient` (atau `PrismaClient`), dan **tidak** membuat keputusan bisnis/otorisasi.

```ts
// src/server/repositories/order.repository.ts
import "server-only";
import type { Prisma } from "@prisma/client";

export const orderRepository = {
  async findOwnedForCancel(tx: Prisma.TransactionClient, userId: string, orderNumber: string) {
    return tx.order.findFirst({
      where: { orderNumber, userId },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        items: { select: { variantId: true, quantity: true } },
      },
    });
  },
};
```

## Langkah 5: Tulis Service Layer (`src/server/services/`)

Service adalah **satu-satunya tempat** untuk otorisasi resource, state machine, transaksi DB atomik, idempotency, dan pencatatan event/audit.

```ts
// src/server/services/order.service.ts
import "server-only";
import { db } from "@/server/db";
import { ConflictError, NotFoundError } from "@/server/lib/errors";
import { canCustomerCancelOrder } from "@/models/domain/orderRules";
import { orderRepository } from "@/server/repositories/order.repository";
import { inventoryService } from "@/server/services/inventory.service";
import type { AuthContext } from "@/server/auth";
import type { CancelOrderInput } from "@/validators/order.schema";

export async function cancelMyOrder(ctx: AuthContext, input: CancelOrderInput) {
  return db.$transaction(async (tx) => {
    const order = await orderRepository.findOwnedForCancel(tx, ctx.userId, input.orderNumber);
    if (!order) {
      throw new NotFoundError("NOT_FOUND", "Order not found.");
    }
    if (!canCustomerCancelOrder(order.status)) {
      throw new ConflictError("INVALID_STATE_TRANSITION", "Only unpaid orders can be cancelled.");
    }

    await inventoryService.releaseForOrder(tx, order.id, order.items, ctx.userId);
    return orderRepository.markCancelled(tx, order.id, {
      actorUserId: ctx.userId,
      actorType: "CUSTOMER",
      reason: input.reason ?? "Cancelled by customer",
    });
  });
}
```

## Langkah 6: Buat Boundary Server Action (`src/actions/`)

Server Action hanya melakukan: auth session → parse Zod → panggil 1 use case service → invalidasi cache (`updateTag` di Next.js 16) → map `AppError` ke `ActionResult`.

```ts
// src/actions/order.actions.ts
"use server";

import { updateTag } from "next/cache";
import { requireUser } from "@/server/auth";
import { toActionError } from "@/server/lib/errors";
import { cancelOrderSchema } from "@/validators/order.schema";
import { cancelMyOrder } from "@/server/services/order.service";
import type { ActionResult } from "@/lib/action-result";

export async function cancelMyOrderAction(
  rawInput: unknown
): Promise<ActionResult<{ orderNumber: string; status: "CANCELLED" }>> {
  try {
    const ctx = await requireUser();
    const parsed = cancelOrderSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Invalid input.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const updated = await cancelMyOrder(ctx, parsed.data);
    updateTag(`order:${updated.orderNumber}`);
    updateTag("products");
    return { ok: true, data: { orderNumber: updated.orderNumber, status: "CANCELLED" } };
  } catch (error) {
    return toActionError(error);
  }
}
```

> **Catatan Cache Next.js 16:** Gunakan `updateTag(tag)` di **Server Actions** agar mutasi langsung terlihat oleh user (_read-your-own-writes_). Gunakan `revalidateTag(tag, "max")` hanya di **Route Handlers** (mis. webhook).

## Langkah 7: Buat ViewModel (`src/hooks/use*ViewModel.ts`)

ViewModel mengelola state UI lokal, derived state, dan pemanggilan Server Action. **Tidak merender JSX** dan tidak menyalin props ke `useEffect`.

```ts
// src/hooks/useOrderDetailViewModel.ts
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelMyOrderAction } from "@/actions/order.actions";
import type { OrderDetailDto } from "@/models/types/order";

export function useOrderDetailViewModel(order: OrderDetailDto) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canCancel = order.status === "PENDING_PAYMENT";

  const cancelOrder = (reason?: string) => {
    if (!canCancel || isPending) return;
    setErrorMessage(null);
    startTransition(async () => {
      const result = await cancelMyOrderAction({ orderNumber: order.orderNumber, reason });
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      router.refresh();
    });
  };

  return { canCancel, isCancelling: isPending, errorMessage, cancelOrder };
}
```

## Langkah 8: Susun View & Server Page (`src/components/` & `src/app/`)

- Server Component (`src/app/(account)/account/orders/[orderNumber]/page.tsx`) memanggil `OrderService` di server dan melempar DTO serializable (tanpa field sensitif) ke View.
- View (`OrderDetailView`) hanya merender HTML semantik, state loading/error/success, dan mengikat event ke ViewModel.

## Langkah 9: Tulis Pengujian

1. **Unit test** (`tests/unit/models/orderRules.test.ts`): uji `canCustomerCancelOrder` untuk seluruh 7 status pesanan.
2. **Integration test** (`tests/integration/services/order-cancel.test.ts`): jalankan `cancelMyOrder` terhadap PostgreSQL `db-test`, pastikan stok bertambah kembali satu kali, `InventoryMovement(RELEASE)` tercipta, dan user lain ditolak (`NotFoundError`).
3. **E2E test** (`tests/e2e/order-tracking.spec.ts`): uji flow klik tombol batalkan di UI, verifikasi keyboard focus & pesan konfirmasi.

## Langkah 10: Quality Gate & Finalisasi Dokumen

1. Jalankan `pnpm check` (`lint` + `format:check` + `typecheck`) dan `pnpm build`.
2. Perbarui `docs/features/order-tracking.md`: catat file terdampak, hasil test aktual di tabel validasi, dan ubah status ke `DONE` (dan update indeks di [docs/features/README.md](../features/README.md)).

---

## Anti-Pattern yang Harus Dihindari

| Jangan Lakukan Ini (Salah)                                                 | Lakukan Ini (Benar)                                                                                     |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Memanggil `prisma.order.findMany()` langsung di `page.tsx` atau `actions/` | Panggil `OrderService` dari Server Component / Server Action; hanya repository yang menyentuh Prisma    |
| Mengambil `total` atau `unitPrice` dari payload form checkout client       | Hitung ulang `subtotal`, `discount`, `shippingCost`, dan `total` di `OrderService` dari data PostgreSQL |
| `useEffect(() => { setTotal(qty * price); }, [qty, price])`                | Hitung derived state langsung saat render / di dalam ViewModel: `const total = qty * price`             |
| Menambah banyak boolean props (`isCompact`, `isCheckout`, `hideActions`)   | Gunakan komposisi **Compound Components** atau variant eksplisit yang menyusun subcomponent             |
| Mengimpor `@/server/*` dari komponen `"use client"` atau `src/hooks/`      | Panggil lewat Server Action atau Route Handler; ESLint memblokir import `@/server/*` di client          |
