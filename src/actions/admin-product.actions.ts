"use server";

import { revalidatePath } from "next/cache";
import { Role, ProductStatus, ProductFit } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { getSession } from "@/server/auth/session";
import type { AdminActionResult } from "@/actions/admin.actions";

export async function adminCreateProductAction(params: {
  name: string;
  price: number;
  description: string;
  collectionSlug: string;
  categorySlug: string;
  material: string;
  fit: "SLIM" | "REGULAR" | "RELAXED";
  status: "ACTIVE" | "DRAFT";
}): Promise<AdminActionResult> {
  const session = await getSession();
  if (!session || session.role !== Role.OWNER) {
    return { success: false, error: "Unauthorized. Owner role required." };
  }

  const name = params.name.trim();
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (!name || name.length < 2) {
    return { success: false, error: "Product name is required (min 2 chars)." };
  }
  if (!params.price || params.price < 1000) {
    return { success: false, error: "Price must be at least Rp 1.000." };
  }

  try {
    const [collection, category] = await Promise.all([
      prisma.collection.findUnique({ where: { slug: params.collectionSlug } }),
      prisma.category.findUnique({ where: { slug: params.categorySlug } }),
    ]);

    if (!collection || !category) {
      return { success: false, error: "Collection or category not found." };
    }

    const created = await prisma.product.create({
      data: {
        name,
        slug,
        price: params.price,
        description: params.description.trim() || "ZCorté technical apparel.",
        material: params.material.trim() || "Technical Blend",
        fit: params.fit as ProductFit,
        status: params.status as ProductStatus,
        featured: false,
        collectionId: collection.id,
        categoryId: category.id,
        styleTags: ["new-arrival"],
        specifications: { origin: "Bandung, Indonesia", care: "Machine wash cold" },
      },
    });

    const defaultColor = await prisma.productColor.create({
      data: {
        productId: created.id,
        name: "Graphite",
        swatchHex: "#2B2B2A",
        family: "NEUTRAL",
      },
    });

    await prisma.productImage.create({
      data: {
        colorId: defaultColor.id,
        url: "/images/apex/campaign-main-0.jpeg",
        view: "FRONT",
        altText: `${name} in Graphite`,
        sortOrder: 0,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: created.id,
          colorId: defaultColor.id,
          size: "M",
          sku: `${slug.toUpperCase()}-GRP-M`,
          stock: 10,
        },
        {
          productId: created.id,
          colorId: defaultColor.id,
          size: "L",
          sku: `${slug.toUpperCase()}-GRP-L`,
          stock: 10,
        },
      ],
    });

    revalidatePath("/admin");
    revalidatePath("/shop");
    return { success: true, message: "Product created successfully." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create product.";
    return { success: false, error: msg };
  }
}
