import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/organisms/CollectionView";
import { mockCollections } from "@/models/data/collections.mock";
import {
  mockTactixStorySteps,
  mockApextiveStorySteps,
  mockOutdoorStorySteps,
} from "@/models/data/stories.mock";
import { getProducts } from "@/models/services/productService";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/jsonLd";
import type { ProductCollection } from "@/models/types/product";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const VALID_SLUGS: ProductCollection[] = ["tactix", "apextive", "outdoor"];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = mockCollections[slug as keyof typeof mockCollections];

  if (!collection) {
    return buildPageMetadata({
      title: "Collection Not Found",
      description: "The requested ZCorté collection could not be found.",
      path: `/collections/${slug}`,
    });
  }

  return buildPageMetadata({
    title: collection.name,
    description: collection.description,
    path: `/collections/${slug}`,
    image: collection.heroImage,
  });
}

function getStoryStepsForSlug(slug: string) {
  switch (slug) {
    case "tactix":
      return mockTactixStorySteps;
    case "apextive":
      return mockApextiveStorySteps;
    case "outdoor":
      return mockOutdoorStorySteps;
    default:
      return [];
  }
}

export default async function DynamicCollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  if (!VALID_SLUGS.includes(slug as ProductCollection)) {
    notFound();
  }

  const collection = mockCollections[slug as keyof typeof mockCollections];
  const storySteps = getStoryStepsForSlug(slug);
  const products = await getProducts({ collection: slug as ProductCollection });

  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "ZCorté", url: "/" },
    { name: collection.name, url: `/collections/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CollectionView collection={collection} storySteps={storySteps} products={products} />
    </>
  );
}
