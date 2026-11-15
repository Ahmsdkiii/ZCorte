import {
  Product,
  ProductCollection,
  ProductColorId,
  ProductColorVariant,
  ProductSize,
  ProductSpecification,
} from "../types/product";
import { StoryStep } from "../types/story";

export interface ProductColorVariantDto {
  id: ProductColorId;
  name: string;
  swatch?: string;
  hex?: string;
  front_image?: string;
  back_image?: string;
  images?: {
    front: string;
    back: string;
  };
  unavailable_sizes?: ProductSize[];
  unavailableSizes?: ProductSize[];
}

export interface ProductDto {
  id: string;
  slug: string;
  name: string;
  collection: ProductCollection;
  price: number;
  featured: boolean;
  description: string;
  sizes: ProductSize[];
  colors: ProductColorVariantDto[];
  context_images?: string[];
  contextImages?: string[];
  is_concept?: boolean;
  isConcept?: boolean;
  specifications: ProductSpecification;
  related_product_slugs?: string[];
  relatedProductSlugs?: string[];
}

export interface StoryStepDto {
  step?: number;
  number_str?: string;
  numberStr?: string;
  title: string;
  headline: string;
  description: string;
  image: string;
  image_alt?: string;
  imageAlt?: string;
}

export function mapProductColorDtoToDomain(dto: ProductColorVariantDto): ProductColorVariant {
  return {
    id: dto.id,
    name: dto.name,
    swatch: dto.swatch ?? dto.hex ?? "#343939",
    images: {
      front: dto.images?.front ?? dto.front_image ?? "",
      back: dto.images?.back ?? dto.back_image ?? "",
    },
    unavailableSizes: dto.unavailableSizes ?? dto.unavailable_sizes,
  };
}

export function mapProductDtoToDomain(dto: ProductDto): Product {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    collection: dto.collection,
    price: dto.price,
    featured: dto.featured,
    description: dto.description,
    sizes: dto.sizes,
    colors: dto.colors.map(mapProductColorDtoToDomain),
    contextImages: dto.contextImages ?? dto.context_images ?? [],
    isConcept: dto.isConcept ?? dto.is_concept ?? true,
    specifications: dto.specifications,
    relatedProductSlugs: dto.relatedProductSlugs ?? dto.related_product_slugs ?? [],
  };
}

export function mapStoryStepDtoToDomain(dto: StoryStepDto, index = 0): StoryStep {
  return {
    step: dto.step ?? index,
    numberStr: dto.numberStr ?? dto.number_str ?? String(index + 1).padStart(2, "0"),
    title: dto.title,
    headline: dto.headline,
    description: dto.description,
    image: dto.image,
    imageAlt: dto.imageAlt ?? dto.image_alt ?? dto.headline,
  };
}
