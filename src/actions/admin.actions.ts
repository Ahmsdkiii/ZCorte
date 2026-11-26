"use server";

import { revalidatePath } from "next/cache";
import { Role, OrderStatus, ProductStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { requireRole } from "@/server/auth/guards";
import type {
  AdminDashboardDataDTO,
  AdminOrderStatus,
  AdminProductStatus,
} from "@/models/types/admin";

export interface AdminActionResult<T = void> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

async function requireOwner() {
  return requireRole(Role.OWNER);
}

export async function getAdminDashboardDataAction(): Promise<
  AdminActionResult<AdminDashboardDataDTO>
> {
  try {
    const session = await requireOwner();

    const [paidOrdersAggregate, pendingCount, orders, products] = await Promise.all([
      prisma.order.aggregate({
        where: { status: { in: [OrderStatus.PAID, OrderStatus.COMPLETED] } },
        _sum: { total: true },
        _count: { id: true },
      }),
      prisma.order.count({
        where: { status: OrderStatus.PENDING_PAYMENT },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
      }),
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          collection: { select: { name: true } },
          category: { select: { name: true } },
          colors: {
            include: {
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
            },
          },
          variants: { select: { stock: true } },
        },
      }),
    ]);

    const totalRevenue = paidOrdersAggregate._sum.total || 0;
    const paidOrdersCount = paidOrdersAggregate._count.id || 0;
    const averageOrderValue = paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0;

    const data: AdminDashboardDataDTO = {
      owner: {
        name: session.name || "ZCorté Owner",
        email: session.email,
      },
      kpi: {
        totalRevenue,
        paidOrdersCount,
        pendingOrdersCount: pendingCount,
        averageOrderValue,
      },
      products: products.map((p) => {
        const totalStock = p.variants.reduce(
          (acc: number, v: { stock: number }) => acc + v.stock,
          0
        );
        const primaryImage = p.colors[0]?.images[0]?.url || "/images/apex/campaign-main-0.jpeg";

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          status: p.status as AdminProductStatus,
          collectionName: p.collection.name,
          categoryName: p.category.name,
          totalStock,
          image: primaryImage,
          createdAt: p.createdAt.toISOString(),
        };
      }),
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.user.name || "Customer",
        customerEmail: o.user.email,
        status: o.status as AdminOrderStatus,
        total: o.total,
        shippingCourier: o.shippingCourier,
        trackingNumber: o.trackingNumber,
        itemCount: o.items.reduce((acc, item) => acc + item.quantity, 0),
        createdAt: o.createdAt.toISOString(),
      })),
    };

    return { success: true, data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load admin data";
    return { success: false, error: msg };
  }
}

export async function adminUpdateOrderStatusAction(params: {
  orderId: string;
  status: AdminOrderStatus;
  shippingCourier?: string;
  trackingNumber?: string;
}): Promise<AdminActionResult> {
  try {
    await requireOwner();

    await prisma.order.update({
      where: { id: params.orderId },
      data: {
        status: params.status as OrderStatus,
        shippingCourier: params.shippingCourier?.trim() || null,
        trackingNumber: params.trackingNumber?.trim() || null,
      },
    });

    revalidatePath("/admin");
    return { success: true, message: "Order updated successfully." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update order";
    return { success: false, error: msg };
  }
}

export async function adminUpdateProductStatusAction(params: {
  productId: string;
  status: AdminProductStatus;
}): Promise<AdminActionResult> {
  try {
    await requireOwner();

    await prisma.product.update({
      where: { id: params.productId },
      data: { status: params.status as ProductStatus },
    });

    revalidatePath("/admin");
    revalidatePath("/shop");
    return { success: true, message: "Product status updated." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update product";
    return { success: false, error: msg };
  }
}
