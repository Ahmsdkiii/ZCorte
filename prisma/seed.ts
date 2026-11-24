import bcrypt from "bcryptjs";
import {
  PrismaClient,
  ProductColorFamily,
  ProductFit,
  ProductImageView,
  ProductStatus,
  CategorySlot,
  Role,
} from "@prisma/client";

const prisma = new PrismaClient();
const PASSWORD_COST = 12;

const collections = [
  {
    slug: "tactix",
    name: "APEX TACTIX",
    tagline: "READY BY DESIGN.",
    focus: "Readiness & Modern Utility",
    description: "Utility clothing for daily movement and functional layering.",
    accentColor: "#777d63",
    heroImage: "/images/apex/campaign-tactix-0.jpeg",
    keywords: ["Daily Utility", "Range", "Deploy", "Readiness"],
  },
  {
    slug: "apextive",
    name: "APEXTIVE",
    tagline: "BUILT TO KEEP MOVING.",
    focus: "Movement & Physical Progress",
    description: "Active essentials engineered for physical progress without restriction.",
    accentColor: "#b8d943",
    heroImage: "/images/apex/campaign-apextive-0.jpeg",
    keywords: ["All Day", "Performance", "Motion", "Endurance"],
  },
  {
    slug: "outdoor",
    name: "APEX OUTDOOR",
    tagline: "MEET THE ELEMENTS.",
    focus: "Environment & Exploration",
    description: "Exploration layers engineered for changing alpine environments.",
    accentColor: "#8ca4b0",
    heroImage: "/images/apex/campaign-outdoor-0.jpeg",
    keywords: ["Weather", "Discover", "Expedition", "Alpine"],
  },
] as const;

const categories = [
  { slug: "tops", name: "Tops", slot: CategorySlot.TOP },
  { slug: "bottoms", name: "Bottoms", slot: CategorySlot.BOTTOM },
  { slug: "outerwear", name: "Outerwear", slot: CategorySlot.OUTER },
  { slug: "accessories", name: "Accessories", slot: CategorySlot.ACCESSORY },
] as const;

type ProductSeed = {
  slug: string;
  name: string;
  collectionSlug: string;
  categorySlug: string;
  price: number;
  featured: boolean;
  fit: ProductFit;
  material: string;
  description: string;
  styleTags: string[];
  specifications: Record<string, string>;
  colors: Array<{
    name: string;
    swatchHex: string;
    family: ProductColorFamily;
    images: Array<{ url: string; view: ProductImageView; altText: string; sortOrder: number }>;
    variants: Array<{ size: string | null; sku: string; stock: number }>;
  }>;
};

const apparelSizes = ["S", "M", "L", "XL"];
const colorNames = [
  { name: "Graphite", swatchHex: "#343939", family: ProductColorFamily.NEUTRAL },
  { name: "Olive", swatchHex: "#676b4c", family: ProductColorFamily.EARTH },
] as const;

function colorsFor(slug: string, sizes: string[], unavailableOliveSizes: string[] = []) {
  return colorNames.map((color) => ({
    ...color,
    images: [
      {
        url: `/images/products/${slug}-${color.name.toLowerCase()}-front.webp`,
        view: ProductImageView.FRONT,
        altText: `${color.name} ${slug} front view`,
        sortOrder: 0,
      },
      {
        url: `/images/products/${slug}-${color.name.toLowerCase()}-back.webp`,
        view: ProductImageView.BACK,
        altText: `${color.name} ${slug} back view`,
        sortOrder: 1,
      },
    ],
    variants: (sizes.length > 0 ? sizes : ["ONE_SIZE"])
      .filter((size) => color.name !== "Olive" || !unavailableOliveSizes.includes(size))
      .map((size) => ({
        size: sizes.length > 0 ? size : null,
        sku: `ZCT-${slug.toUpperCase()}-${color.name.slice(0, 3).toUpperCase()}-${size}`,
        stock: size === "XL" ? 4 : 12,
      })),
  }));
}

const products: ProductSeed[] = [
  {
    slug: "utility-overshirt",
    name: "Utility Overshirt",
    collectionSlug: "tactix",
    categorySlug: "outerwear",
    price: 1250000,
    featured: true,
    fit: ProductFit.RELAXED,
    material: "Cotton nylon canvas",
    description:
      "An everyday overshirt built around quiet form, considered proportions, and functional layering.",
    styleTags: ["utility", "layering", "daily"],
    specifications: { fit: "Relaxed", care: "Gentle wash cold; line dry" },
    colors: colorsFor("utility-overshirt", apparelSizes, ["XL"]),
  },
  {
    slug: "transit-sling",
    name: "Transit Sling",
    collectionSlug: "tactix",
    categorySlug: "accessories",
    price: 650000,
    featured: false,
    fit: ProductFit.REGULAR,
    material: "Recycled ripstop nylon",
    description:
      "An adjustable crossbody sling with quick access for the changing rhythm of a day.",
    styleTags: ["carry", "utility", "transit"],
    specifications: { fit: "One size", care: "Wipe clean with a damp cloth" },
    colors: colorsFor("transit-sling", []),
  },
  {
    slug: "movement-tee",
    name: "Movement Tee",
    collectionSlug: "apextive",
    categorySlug: "tops",
    price: 450000,
    featured: true,
    fit: ProductFit.SLIM,
    material: "Technical jersey",
    description: "A lightweight athletic tee with ergonomic patterning for uninhibited movement.",
    styleTags: ["performance", "movement", "training"],
    specifications: { fit: "Athletic", care: "Cold wash; hang dry" },
    colors: colorsFor("movement-tee", apparelSizes),
  },
  {
    slug: "training-shorts",
    name: "Training Shorts",
    collectionSlug: "apextive",
    categorySlug: "bottoms",
    price: 550000,
    featured: false,
    fit: ProductFit.REGULAR,
    material: "Stretch performance woven",
    description: "Mid-thigh training shorts with an elastic waistband and integrated webbing belt.",
    styleTags: ["performance", "training", "lightweight"],
    specifications: { fit: "Regular", care: "Machine wash cold; line dry" },
    colors: colorsFor("training-shorts", apparelSizes),
  },
  {
    slug: "trail-shell",
    name: "Trail Shell",
    collectionSlug: "outdoor",
    categorySlug: "outerwear",
    price: 1750000,
    featured: true,
    fit: ProductFit.RELAXED,
    material: "Waterproof three-layer shell",
    description:
      "A storm-ready expedition profile with room for thermal midlayers and a helmet-compatible hood.",
    styleTags: ["weather", "expedition", "protection"],
    specifications: { fit: "Relaxed", care: "Technical wash; air dry" },
    colors: colorsFor("trail-shell", apparelSizes),
  },
  {
    slug: "ridge-pack",
    name: "Ridge Pack",
    collectionSlug: "outdoor",
    categorySlug: "accessories",
    price: 950000,
    featured: false,
    fit: ProductFit.REGULAR,
    material: "Recycled technical nylon",
    description: "A one-size pack with load-bearing support and a ventilated mesh back panel.",
    styleTags: ["carry", "expedition", "outdoor"],
    specifications: { fit: "One size", care: "Hand wash; air dry fully open" },
    colors: colorsFor("ridge-pack", []),
  },
];

function requiredSecret(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set before running the seed`);
  }
  return value;
}

async function seedUser(email: string, name: string, role: Role, password: string) {
  const passwordHash = await bcrypt.hash(password, PASSWORD_COST);
  return prisma.user.upsert({
    where: { email },
    update: { name, role, passwordHash },
    create: { email, name, role, passwordHash },
  });
}

async function seedProduct(
  product: ProductSeed,
  collectionIds: Map<string, string>,
  categoryIds: Map<string, string>
) {
  const savedProduct = await prisma.product.upsert({
    where: { slug: product.slug },
    update: {
      name: product.name,
      price: product.price,
      description: product.description,
      status: ProductStatus.ACTIVE,
      featured: product.featured,
      fit: product.fit,
      material: product.material,
      styleTags: product.styleTags,
      specifications: product.specifications,
      collectionId: collectionIds.get(product.collectionSlug) ?? "",
      categoryId: categoryIds.get(product.categorySlug) ?? "",
    },
    create: {
      slug: product.slug,
      name: product.name,
      price: product.price,
      description: product.description,
      status: ProductStatus.ACTIVE,
      featured: product.featured,
      fit: product.fit,
      material: product.material,
      styleTags: product.styleTags,
      specifications: product.specifications,
      collectionId: collectionIds.get(product.collectionSlug) ?? "",
      categoryId: categoryIds.get(product.categorySlug) ?? "",
    },
  });

  for (const color of product.colors) {
    const savedColor = await prisma.productColor.upsert({
      where: { productId_name: { productId: savedProduct.id, name: color.name } },
      update: { swatchHex: color.swatchHex, family: color.family },
      create: {
        productId: savedProduct.id,
        name: color.name,
        swatchHex: color.swatchHex,
        family: color.family,
      },
    });

    await prisma.productImage.deleteMany({ where: { colorId: savedColor.id } });
    await prisma.productImage.createMany({
      data: color.images.map((image) => ({ ...image, colorId: savedColor.id })),
    });

    for (const variant of color.variants) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: {
          productId: savedProduct.id,
          colorId: savedColor.id,
          size: variant.size,
          stock: variant.stock,
        },
        create: {
          productId: savedProduct.id,
          colorId: savedColor.id,
          size: variant.size,
          sku: variant.sku,
          stock: variant.stock,
        },
      });
    }
  }

  return savedProduct;
}

async function main() {
  const ownerPassword = requiredSecret("SEED_OWNER_PASSWORD");
  const customerPassword = requiredSecret("SEED_CUSTOMER_PASSWORD");

  await seedUser("owner@zcorte.local", "ZCorté Owner", Role.OWNER, ownerPassword);
  await seedUser("customer@zcorte.local", "ZCorté Customer", Role.CUSTOMER, customerPassword);

  const collectionIds = new Map<string, string>();
  for (const collection of collections) {
    const saved = await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: collection,
      create: collection,
    });
    collectionIds.set(collection.slug, saved.id);
  }

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryIds.set(category.slug, saved.id);
  }

  for (const product of products) {
    await seedProduct(product, collectionIds, categoryIds);
  }
}

main()
  .catch((error: unknown) => {
    process.exitCode = 1;
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
