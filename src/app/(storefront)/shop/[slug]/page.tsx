import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/organisms/ProductDetailView";
import { ProductGridClient } from "@/components/organisms/ProductGridClient";
import {
  getProductBySlug,
  getRelatedProducts,
  getProducts,
} from "@/models/services/productService";
import { getProductColor } from "@/models/domain/productRules";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/jsonLd";
import { buildPageMetadata } from "@/lib/metadata";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const defaultColor = getProductColor(product);
  return buildPageMetadata({
    title: `${product.name} — ZCorté`,
    description: product.description,
    path: `/shop/${product.slug}`,
    image: defaultColor.images.front,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(slug);

  const productJsonLd = generateProductSchema(product);
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "ZCorté", url: "/" },
    { name: "Shop", url: "/shop" },
    {
      name: product.collection.toUpperCase(),
      url: `/shop?collection=${product.collection}`,
    },
    { name: product.name, url: `/shop/${product.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main
        id="main"
        className="w-full flex-1 px-gutter pt-[calc(var(--header-height)+38px)] pb-[55px] md:pt-[calc(var(--header-height)+64px)] md:pb-[110px]"
      >
        <ProductDetailView product={product} />

        {relatedProducts.length > 0 && (
          <section
            data-collection={product.collection}
            className="mt-24 border-t border-line pt-[76px] md:mt-36 md:pt-[110px]"
          >
            <div className="mb-7 flex items-center justify-between gap-5 md:mb-[38px]">
              <p className="eyebrow text-[8px] md:text-[10px]">ZCORTÉ / COMPLETE THE LOOK</p>
              <Link
                href={`/shop?collection=${product.collection}`}
                className="py-2 text-[10px] tracking-[0.08em] underline underline-offset-[5px] hover:text-muted transition-colors"
              >
                EXPLORE {product.collection.toUpperCase()} ↗
              </Link>
            </div>
            <h2 className="mb-5 text-[clamp(38px,5.5vw,88px)]">
              EQUIP YOUR
              <br />
              <span className="text-muted">NEXT MOVE.</span>
            </h2>
            <p className="mb-[35px] text-[11px] leading-[1.7] tracking-[0.015em] text-muted">
              Designed in Bandung, West Java &middot; High-spec technical textiles &middot;
              Small-batch craft
            </p>
            <ProductGridClient products={relatedProducts} />
          </section>
        )}
      </main>
    </>
  );
}
