"use server";

import { Role } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { getSession } from "@/server/auth/session";
import type {
  OrderDetailDTO,
  OrderDetailStatus,
  OrderShippingAddressDTO,
} from "@/models/types/order-detail";

export interface OrderDetailActionResult<T = void> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

function parseShippingAddress(raw: unknown): OrderShippingAddressDTO {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const str = (key: string, fallback = ""): string =>
    typeof obj[key] === "string" ? (obj[key] as string) : fallback;

  return {
    recipientName: str("recipientName") || str("name") || "Recipient",
    phone: str("phone"),
    street: str("street") || str("address"),
    apartment: typeof obj["apartment"] === "string" ? (obj["apartment"] as string) : null,
    city: str("city"),
    province: str("province"),
    postalCode: str("postalCode"),
  };
}

export async function getOrderDetailAction(
  orderNumber: string
): Promise<OrderDetailActionResult<OrderDetailDTO>> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Authentication required." };
  }

  const trimmedOrderNumber = orderNumber.trim();
  if (!trimmedOrderNumber) {
    return { success: false, error: "Invalid order reference." };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: trimmedOrderNumber },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: {
              select: {
                slug: true,
                colors: {
                  take: 1,
                  include: {
                    images: { orderBy: { sortOrder: "asc" }, take: 1 },
                  },
                },
              },
            },
          },
        },
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
        statusHistory: { orderBy: { createdAt: "asc" } },
      },
    });

    // Anti-IDOR: Do not reveal existence of another user's order
    if (!order || (order.userId !== session.id && session.role !== Role.OWNER)) {
      return { success: false, error: "Order not found." };
    }

    const latestPayment = order.payments[0] ?? null;

    const dto: OrderDetailDTO = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status as OrderDetailStatus,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      discount: order.discount,
      total: order.total,
      shippingMethod: order.shippingMethod,
      shippingCourier: order.shippingCourier,
      trackingNumber: order.trackingNumber,
      shippingAddress: parseShippingAddress(order.shippingAddress),
      cancelReason: order.cancelReason,
      expiresAt: order.expiresAt.toISOString(),
      paidAt: order.paidAt ? order.paidAt.toISOString() : null,
      createdAt: order.createdAt.toISOString(),
      customerName: order.user.name || "Customer",
      customerEmail: order.user.email,
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.nameSnapshot,
        productSlug: item.product?.slug ?? null,
        colorName: item.colorSnapshot,
        size: item.sizeSnapshot,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
        image: item.product?.colors[0]?.images[0]?.url ?? null,
      })),
      payment: latestPayment
        ? {
            id: latestPayment.id,
            method: latestPayment.method,
            provider: latestPayment.provider,
            status: latestPayment.status,
            amount: latestPayment.amount,
            paidAt: latestPayment.paidAt ? latestPayment.paidAt.toISOString() : null,
          }
        : null,
      statusHistory: order.statusHistory.map((entry) => ({
        id: entry.id,
        fromStatus: entry.fromStatus as OrderDetailStatus | null,
        toStatus: entry.toStatus as OrderDetailStatus,
        actorType: entry.actorType,
        reason: entry.reason,
        createdAt: entry.createdAt.toISOString(),
      })),
    };

    return { success: true, data: dto };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load order details.";
    return { success: false, error: msg };
  }
}
