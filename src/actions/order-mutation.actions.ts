"use server";

import { revalidatePath } from "next/cache";
import { InventoryMovementType, OrderActorType, OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { requireUser } from "@/server/auth/guards";
import type { OrderDetailActionResult } from "@/actions/order-detail.actions";

export async function cancelMyOrderAction(params: {
  orderNumber: string;
  reason?: string;
}): Promise<OrderDetailActionResult> {
  const session = await requireUser();
  if (!session) {
    return { success: false, error: "Authentication required." };
  }

  const orderNumber = params.orderNumber.trim();
  const reason = params.reason?.trim() || "Cancelled by customer prior to payment";

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      });

      if (!order || order.userId !== session.userId) {
        throw new Error("Order not found.");
      }

      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new Error("Only orders awaiting payment can be cancelled.");
      }

      // Conditional update ensures idempotency and single stock release
      const updated = await tx.order.updateMany({
        where: { id: order.id, status: OrderStatus.PENDING_PAYMENT },
        data: { status: OrderStatus.CANCELLED, cancelReason: reason },
      });

      if (updated.count === 0) {
        throw new Error("Order status has already changed.");
      }

      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
        await tx.inventoryMovement.create({
          data: {
            variantId: item.variantId,
            orderId: order.id,
            actorUserId: session.userId,
            type: InventoryMovementType.RELEASE,
            delta: item.quantity,
            reason: `Customer cancelled order ${order.orderNumber}: ${reason}`,
          },
        });
      }

      await tx.payment.updateMany({
        where: { orderId: order.id, status: PaymentStatus.PENDING },
        data: { status: PaymentStatus.EXPIRED },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: OrderStatus.PENDING_PAYMENT,
          toStatus: OrderStatus.CANCELLED,
          actorUserId: session.userId,
          actorType: OrderActorType.CUSTOMER,
          reason,
        },
      });
    });

    revalidatePath("/account");
    revalidatePath(`/account/orders/${orderNumber}`);
    revalidatePath("/admin");
    return { success: true, message: "Order cancelled and reserved stock released." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to cancel order.";
    return { success: false, error: msg };
  }
}

export async function simulateOrderPaymentAction(
  orderNumber: string
): Promise<OrderDetailActionResult> {
  const session = await requireUser();
  if (!session) {
    return { success: false, error: "Authentication required." };
  }

  const trimmed = orderNumber.trim();

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { orderNumber: trimmed } });
      if (!order || order.userId !== session.userId) {
        throw new Error("Order not found.");
      }
      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new Error("Order is not awaiting payment.");
      }

      const now = new Date();
      const updated = await tx.order.updateMany({
        where: { id: order.id, status: OrderStatus.PENDING_PAYMENT },
        data: { status: OrderStatus.PAID, paidAt: now },
      });
      if (updated.count === 0) {
        throw new Error("Order status has already changed.");
      }

      await tx.payment.updateMany({
        where: { orderId: order.id, status: PaymentStatus.PENDING },
        data: { status: PaymentStatus.PAID, paidAt: now },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: OrderStatus.PENDING_PAYMENT,
          toStatus: OrderStatus.PAID,
          actorUserId: session.userId,
          actorType: OrderActorType.CUSTOMER,
          reason: "Simulated settlement verified (R0 Demo)",
        },
      });
    });

    revalidatePath("/account");
    revalidatePath(`/account/orders/${trimmed}`);
    revalidatePath("/admin");
    return { success: true, message: "Payment confirmed. Order is now being prepared." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to process simulated payment.";
    return { success: false, error: msg };
  }
}
