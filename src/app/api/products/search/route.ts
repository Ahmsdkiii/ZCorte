import { NextRequest, NextResponse } from "next/server";
import { ProductStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import type { ProductSearchResultDTO } from "@/models/types/search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = searchParams.get("q") ?? "";
    const query = rawQuery.trim();

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const sanitized = query.slice(0, 60);

    const products = await prisma.product.findMany({
      where: {
        status: ProductStatus.ACTIVE,
        OR: [
          { name: { contains: sanitized, mode: "insensitive" } },
          { description: { contains: sanitized, mode: "insensitive" } },
          { collection: { name: { contains: sanitized, mode: "insensitive" } } },
          { category: { name: { contains: sanitized, mode: "insensitive" } } },
        ],
      },
      take: 6,
      orderBy: { featured: "desc" },
      include: {
        collection: { select: { name: true } },
        category: { select: { name: true } },
        colors: {
          take: 1,
          include: {
            images: {
              take: 1,
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });

    const results: ProductSearchResultDTO[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      collectionName: p.collection.name,
      categoryName: p.category.name,
      image: p.colors[0]?.images[0]?.url ?? null,
    }));

    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Search error";
    return NextResponse.json({ error: msg, results: [] }, { status: 500 });
  }
}
