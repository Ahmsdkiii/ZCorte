"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { getSession } from "@/server/auth/session";
import type { CustomerAccountDataDTO } from "@/models/types/account";

const PHONE_REGEX = /^(\+62|62|0)8[0-9]{8,12}$/;

export interface AccountActionResult<T = void> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export async function getAccountDataAction(): Promise<AccountActionResult<CustomerAccountDataDTO>> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        },
        orders: {
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
      },
    });

    if (!user) {
      return { success: false, error: "User account not found" };
    }

    const data: CustomerAccountDataDTO = {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        personalizationOptIn: user.personalizationOptIn,
        createdAt: user.createdAt.toISOString(),
      },
      addresses: user.addresses.map((a) => ({
        id: a.id,
        recipientName: a.recipientName,
        phone: a.phone,
        street: a.street,
        apartment: a.apartment,
        city: a.city,
        province: a.province,
        postalCode: a.postalCode,
        isDefault: a.isDefault,
      })),
      orders: user.orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: o.total,
        shippingCost: o.shippingCost,
        courierName: o.shippingCourier,
        trackingNumber: o.trackingNumber,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i) => ({
          id: i.id,
          productName: i.nameSnapshot,
          colorName: i.colorSnapshot,
          size: i.sizeSnapshot,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal: i.unitPrice * i.quantity,
          image: null,
        })),
      })),
    };

    return { success: true, data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load account data";
    return { success: false, error: msg };
  }
}

export async function updateProfileAction(formData: {
  name: string;
  phone?: string;
  personalizationOptIn?: boolean;
}): Promise<AccountActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Authentication required" };
  }

  const name = formData.name.trim();
  const phone = formData.phone?.trim() || null;
  const personalizationOptIn = Boolean(formData.personalizationOptIn);

  if (!name || name.length < 2) {
    return { success: false, error: "Name must be at least 2 characters long" };
  }
  if (phone && !PHONE_REGEX.test(phone)) {
    return { success: false, error: "Invalid Indonesian phone format (+62/08...)" };
  }

  try {
    await prisma.user.update({
      where: { id: session.id },
      data: { name, phone, personalizationOptIn },
    });
    revalidatePath("/account");
    return { success: true, message: "Profile updated successfully" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update profile";
    return { success: false, error: msg };
  }
}
