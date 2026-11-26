"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { requireUser } from "@/server/auth/guards";
import type { AccountActionResult } from "@/actions/account.actions";

const PHONE_REGEX = /^(\+62|62|0)8[0-9]{8,12}$/;
const POSTAL_REGEX = /^\d{5}$/;

export async function createAddressAction(data: {
  recipientName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}): Promise<AccountActionResult> {
  const session = await requireUser();
  if (!session) {
    return { success: false, error: "Authentication required" };
  }

  if (!data.recipientName || data.recipientName.length < 2) {
    return { success: false, error: "Recipient name is required" };
  }
  if (!PHONE_REGEX.test(data.phone.trim())) {
    return { success: false, error: "Invalid Indonesian phone number format" };
  }
  if (!data.street || data.street.length < 5) {
    return { success: false, error: "Street address must be at least 5 characters" };
  }
  if (!data.city || !data.province) {
    return { success: false, error: "City and province are required" };
  }
  if (!POSTAL_REGEX.test(data.postalCode.trim())) {
    return { success: false, error: "Postal code must be exactly 5 digits" };
  }

  try {
    const count = await prisma.address.count({
      where: { userId: session.userId },
    });
    const shouldBeDefault = data.isDefault || count === 0;

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    await prisma.address.create({
      data: {
        userId: session.userId,
        recipientName: data.recipientName.trim(),
        phone: data.phone.trim(),
        street: data.street.trim(),
        apartment: data.apartment?.trim() || null,
        city: data.city.trim(),
        province: data.province.trim(),
        postalCode: data.postalCode.trim(),
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/account");
    return { success: true, message: "Address added successfully" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to add address";
    return { success: false, error: msg };
  }
}

export async function setDefaultAddressAction(addressId: string): Promise<AccountActionResult> {
  const session = await requireUser();
  if (!session) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.userId !== session.userId) {
      return { success: false, error: "Address not found or unauthorized" };
    }

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);

    revalidatePath("/account");
    return { success: true, message: "Default address updated" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to set default address";
    return { success: false, error: msg };
  }
}

export async function deleteAddressAction(addressId: string): Promise<AccountActionResult> {
  const session = await requireUser();
  if (!session) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address || address.userId !== session.userId) {
      return { success: false, error: "Address not found or unauthorized" };
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    if (address.isDefault) {
      const remaining = await prisma.address.findFirst({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
      });
      if (remaining) {
        await prisma.address.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath("/account");
    return { success: true, message: "Address removed" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to remove address";
    return { success: false, error: msg };
  }
}
