import bcrypt from "bcryptjs";
import {
  CategorySlot,
  InventoryMovementType,
  Prisma,
  PrismaClient,
  ProductColorFamily,
  ProductFit,
  ProductImageView,
  ProductStatus,
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

type ColorImageExtensions = {
  graphite?: string;
  olive?: string;
  oliveBack?: string;
};

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
  relatedProductSlugs: string[];
  hasSizeChart: boolean;
  colors: Array<{
    name: string;
    swatchHex: string;
    family: ProductColorFamily;
    images: Array<{ url: string; view: ProductImageView; altText: string; sortOrder: number }>;
    variants: Array<{ size: string | null; sku: string; stock: number }>;
  }>;
};

const apparelSizes = ["S", "M", "L", "XL"];
const defaultApparelSizeRows = [
  { size: "S", minHeight: 160, maxHeight: 170, minWeight: 50, maxWeight: 62 },
  { size: "M", minHeight: 168, maxHeight: 178, minWeight: 60, maxWeight: 74 },
  { size: "L", minHeight: 175, maxHeight: 185, minWeight: 72, maxWeight: 86 },
  { size: "XL", minHeight: 180, maxHeight: 192, minWeight: 84, maxWeight: 100 },
] as const;

const colorNames = [
  { name: "Graphite", swatchHex: "#343939", family: ProductColorFamily.NEUTRAL },
  { name: "Olive", swatchHex: "#676b4c", family: ProductColorFamily.EARTH },
] as const;

function colorsFor(
  slug: string,
  sizes: string[],
  options: {
    unavailableOliveSizes?: string[];
    ext?: ColorImageExtensions;
    contextImages?: string[];
  } = {}
) {
  const unavailableOliveSizes = options.unavailableOliveSizes ?? [];
  const graphiteExt = options.ext?.graphite ?? "webp";
  const oliveExt = options.ext?.olive ?? "webp";
  const oliveBackExt = options.ext?.oliveBack ?? oliveExt;
  const contextImages = options.contextImages ?? [];

  return colorNames.map((color, colorIndex) => {
    const frontExt = color.name === "Graphite" ? graphiteExt : oliveExt;
    const backExt = color.name === "Graphite" ? graphiteExt : oliveBackExt;
    const baseImages: Array<{
      url: string;
      view: ProductImageView;
      altText: string;
      sortOrder: number;
    }> = [
      {
        url: `/images/products/${slug}-${color.name.toLowerCase()}-front.${frontExt}`,
        view: ProductImageView.FRONT,
        altText: `${color.name} ${slug} front view`,
        sortOrder: 0,
      },
      {
        url: `/images/products/${slug}-${color.name.toLowerCase()}-back.${backExt}`,
        view: ProductImageView.BACK,
        altText: `${color.name} ${slug} back view`,
        sortOrder: 1,
      },
    ];

    if (colorIndex === 0) {
      contextImages.forEach((contextUrl, index) => {
        baseImages.push({
          url: contextUrl,
          view: ProductImageView.CONTEXT,
          altText: `${slug} editorial context ${index + 1}`,
          sortOrder: index + 2,
        });
      });
    }

    return {
      ...color,
      images: baseImages,
      variants: (sizes.length > 0 ? sizes : ["ONE_SIZE"])
        .filter((size) => color.name !== "Olive" || !unavailableOliveSizes.includes(size))
        .map((size) => ({
          size: sizes.length > 0 ? size : null,
          sku: `ZCT-${slug.toUpperCase()}-${color.name.slice(0, 3).toUpperCase()}-${size}`,
          stock: size === "XL" ? 4 : 12,
        })),
    };
  });
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
    specifications: {
      fit: "Relaxed articulated silhouette engineered for non-restrictive daily mobility and technical layering.",
      care: "Spot clean or gentle machine wash cold. Do not tumble dry. Line dry in shade.",
    },
    relatedProductSlugs: ["transit-sling", "movement-tee"],
    hasSizeChart: true,
    colors: colorsFor("utility-overshirt", apparelSizes, {
      unavailableOliveSizes: ["XL"],
      ext: { graphite: "jpeg" },
      contextImages: ["/images/apex/campaign-tactix-0.jpeg", "/images/apex/tactix-material.webp"],
    }),
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
    specifications: {
      fit: "One size. Adjustable crossbody strap with quick-release buckle for left or right carry.",
      care: "Wipe clean with a damp cloth. Air dry away from direct heat.",
    },
    relatedProductSlugs: ["utility-overshirt", "ridge-pack"],
    hasSizeChart: false,
    colors: colorsFor("transit-sling", [], {
      contextImages: ["/images/apex/tactix-context.webp"],
    }),
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
    specifications: {
      fit: "Athletic cut with ergonomic raglan patterning to maintain uninhibited shoulder rotation.",
      care: "Cold wash with technical sportswear detergent. Hang dry.",
    },
    relatedProductSlugs: ["training-shorts", "trail-shell"],
    hasSizeChart: true,
    colors: colorsFor("movement-tee", apparelSizes, {
      unavailableOliveSizes: ["XL"],
      contextImages: [
        "/images/apex/campaign-apextive-0.jpeg",
        "/images/apex/apextive-material.jpeg",
      ],
    }),
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
    specifications: {
      fit: "Mid-thigh length with an elastic waistband and integrated webbing belt.",
      care: "Machine wash cold. Do not iron the belt hardware. Line dry.",
    },
    relatedProductSlugs: ["movement-tee", "utility-overshirt"],
    hasSizeChart: true,
    colors: colorsFor("training-shorts", apparelSizes, {
      unavailableOliveSizes: ["XL"],
      contextImages: ["/images/apex/apextive-transition.jpeg"],
    }),
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
    specifications: {
      fit: "Storm-ready expedition profile with room for thermal midlayers and helmet-compatible hood.",
      care: "Machine wash delicate with DWR tech wash. Do not use fabric softener. Air dry.",
    },
    relatedProductSlugs: ["ridge-pack", "utility-overshirt"],
    hasSizeChart: true,
    colors: colorsFor("trail-shell", apparelSizes, {
      unavailableOliveSizes: ["XL"],
      contextImages: ["/images/apex/campaign-outdoor-0.jpeg", "/images/apex/outdoor-detail.jpeg"],
    }),
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
    specifications: {
      fit: "One size. Load-bearing hip belt, sternum strap, and ventilated mesh back panel.",
      care: "Hand wash with mild soap. Empty pockets and air dry fully open.",
    },
    relatedProductSlugs: ["trail-shell", "transit-sling"],
    hasSizeChart: false,
    colors: colorsFor("ridge-pack", [], {
      ext: { oliveBack: "jpeg" },
      contextImages: ["/images/apex/campaign-outdoor-2.jpeg"],
    }),
  },
];

type StoryStepSeed = {
  step: number;
  numberStr: string;
  title: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
};

const storyGroups: Array<{ collectionSlug: string | null; steps: StoryStepSeed[] }> = [
  {
    collectionSlug: null,
    steps: [
      {
        step: 0,
        numberStr: "01",
        title: "Condition",
        headline: "CONDITION.",
        description:
          "Every journey begins with a place. Read the terrain. Notice what the moment asks of you.",
        image: "/images/apex/campaign-main-0.jpeg",
        imageAlt: "A traveler overlooking a vast volcanic valley.",
      },
      {
        step: 1,
        numberStr: "02",
        title: "Friction",
        headline: "FRICTION.",
        description:
          "Different conditions bring different demands. No two ways forward are quite the same.",
        image: "/images/apex/campaign-main-1.jpeg",
        imageAlt: "A traveler facing a steep trail under cloud.",
      },
      {
        step: 2,
        numberStr: "03",
        title: "Response",
        headline: "RESPONSE.",
        description:
          "Readiness. Movement. Exploration. A connected system, shaped around the way you move.",
        image: "/images/apex/campaign-main-2.jpeg",
        imageAlt: "A traveler adjusting a backpack on a ridge.",
      },
      {
        step: 3,
        numberStr: "04",
        title: "Proof",
        headline: "PROOF.",
        description:
          "Look closer at materials, construction, and the interactions that give a detail its purpose.",
        image: "/images/apex/campaign-main-3.jpeg",
        imageAlt: "A close study of woven jacket fabric and seams.",
      },
      {
        step: 4,
        numberStr: "05",
        title: "Series",
        headline: "SERIES.",
        description: "TACTIX. APEXTIVE. OUTDOOR. Three distinct expressions. One shared direction.",
        image: "/images/apex/campaign-tactix-0.jpeg",
        imageAlt: "Utility clothing in a concrete passage.",
      },
      {
        step: 5,
        numberStr: "06",
        title: "Product",
        headline: "THE NEXT MOVE.",
        description: "Choose your expression. Explore the collection and its details.",
        image: "/images/apex/campaign-main-3.jpeg",
        imageAlt: "A close study of woven jacket fabric and seams.",
      },
    ],
  },
  {
    collectionSlug: "tactix",
    steps: [
      {
        step: 0,
        numberStr: "01",
        title: "Condition",
        headline: "CONDITION.",
        description:
          "Concrete, transit, the changing rhythm of a day. This is the field of everyday use.",
        image: "/images/apex/campaign-tactix-0.jpeg",
        imageAlt: "Utility clothing in a concrete passage.",
      },
      {
        step: 1,
        numberStr: "02",
        title: "Friction",
        headline: "FRICTION.",
        description: "A stairway. A full bag. The moment you need something close at hand.",
        image: "/images/apex/campaign-tactix-1.jpeg",
        imageAlt: "A commuter carrying a bag on stairs.",
      },
      {
        step: 2,
        numberStr: "03",
        title: "Response",
        headline: "RESPONSE.",
        description:
          "Readiness finds its meaning in practical interactions: carrying, reaching, opening, moving.",
        image: "/images/apex/campaign-tactix-2.webp",
        imageAlt: "Hands accessing a utility jacket pocket.",
      },
      {
        step: 3,
        numberStr: "04",
        title: "Proof",
        headline: "PROOF.",
        description:
          "A visual study of woven texture, closures, and the way construction comes together.",
        image: "/images/apex/campaign-tactix-3.webp",
        imageAlt: "A close study of a zipper and fabric construction.",
      },
      {
        step: 4,
        numberStr: "05",
        title: "Series",
        headline: "SERIES.",
        description: "ZCorté TACTIX. Readiness and utility, considered as one expression.",
        image: "/images/apex/campaign-tactix-0.jpeg",
        imageAlt: "Utility clothing in a concrete passage.",
      },
      {
        step: 5,
        numberStr: "06",
        title: "Product",
        headline: "THE NEXT MOVE.",
        description: "Take a closer look at the collection's material and access studies.",
        image: "/images/apex/campaign-tactix-3.webp",
        imageAlt: "A close study of a zipper and fabric construction.",
      },
    ],
  },
  {
    collectionSlug: "apextive",
    steps: [
      {
        step: 0,
        numberStr: "01",
        title: "Condition",
        headline: "CONDITION.",
        description: "An open track. The first light. A place to begin again.",
        image: "/images/apex/campaign-apextive-0.jpeg",
        imageAlt: "A runner accelerating at dawn.",
      },
      {
        step: 1,
        numberStr: "02",
        title: "Friction",
        headline: "FRICTION.",
        description: "The next step asks for effort. Progress takes shape in repetition.",
        image: "/images/apex/campaign-apextive-1.jpeg",
        imageAlt: "An athlete running up stadium stairs.",
      },
      {
        step: 2,
        numberStr: "03",
        title: "Response",
        headline: "RESPONSE.",
        description:
          "Follow the body through acceleration, a change of direction, and the space between efforts.",
        image: "/images/apex/campaign-apextive-2.jpeg",
        imageAlt: "An athlete changing direction on a track.",
      },
      {
        step: 3,
        numberStr: "04",
        title: "Proof",
        headline: "PROOF.",
        description:
          "A closer look at apparel folds, fit in motion, and visible seam construction.",
        image: "/images/apex/campaign-apextive-3.jpeg",
        imageAlt: "Apparel folds and seams across a moving torso.",
      },
      {
        step: 4,
        numberStr: "05",
        title: "Series",
        headline: "SERIES.",
        description: "APEXTIVE. An expression shaped by movement and physical progress.",
        image: "/images/apex/campaign-apextive-0.jpeg",
        imageAlt: "A runner accelerating at dawn.",
      },
      {
        step: 5,
        numberStr: "06",
        title: "Product",
        headline: "THE NEXT MOVE.",
        description: "Explore the collection through its movement and fabric studies.",
        image: "/images/apex/campaign-apextive-3.jpeg",
        imageAlt: "Apparel folds and seams across a moving torso.",
      },
    ],
  },
  {
    collectionSlug: "outdoor",
    steps: [
      {
        step: 0,
        numberStr: "01",
        title: "Condition",
        headline: "CONDITION.",
        description: "The landscape sets the scale. Terrain and weather shape the journey.",
        image: "/images/apex/campaign-outdoor-0.jpeg",
        imageAlt: "Layered mountain valleys beneath low cloud.",
      },
      {
        step: 1,
        numberStr: "02",
        title: "Friction",
        headline: "FRICTION.",
        description:
          "The ground shifts beneath your feet. Cloud changes the light. The route asks for attention.",
        image: "/images/apex/campaign-outdoor-1.jpeg",
        imageAlt: "A hiker crossing basalt terrain in mist.",
      },
      {
        step: 2,
        numberStr: "03",
        title: "Response",
        headline: "RESPONSE.",
        description:
          "A pause to adjust. Another step across the terrain. Adaptation happens along the way.",
        image: "/images/apex/campaign-outdoor-2.jpeg",
        imageAlt: "A hiker adjusting equipment on a ridge.",
      },
      {
        step: 3,
        numberStr: "04",
        title: "Proof",
        headline: "PROOF.",
        description:
          "Look closer at equipment interactions and the textures of apparel in context.",
        image: "/images/apex/campaign-outdoor-3.jpeg",
        imageAlt: "A hand holding a backpack strap outdoors.",
      },
      {
        step: 4,
        numberStr: "05",
        title: "Series",
        headline: "SERIES.",
        description: "ZCorté OUTDOOR. An expression shaped by environment and exploration.",
        image: "/images/apex/campaign-outdoor-0.jpeg",
        imageAlt: "Layered mountain valleys beneath low cloud.",
      },
      {
        step: 5,
        numberStr: "06",
        title: "Product",
        headline: "THE NEXT MOVE.",
        description: "Explore the collection's interactions with terrain and changing conditions.",
        image: "/images/apex/campaign-outdoor-3.jpeg",
        imageAlt: "A hand holding a backpack strap outdoors.",
      },
    ],
  },
];

const defaultStoreSettings: Array<{ key: string; value: Prisma.InputJsonValue }> = [
  {
    key: "shipping_rates",
    value: {
      standard: 25000,
      express: 50000,
    },
  },
  {
    key: "default_low_stock_threshold",
    value: 5,
  },
  {
    key: "brand_story",
    value: {
      headline: "QUIET FORM, CONSIDERED CRAFT.",
      story:
        "ZCorté is an editorial fashion platform focused on durable everyday silhouettes, transparent sizing, and purposeful layering.",
      process:
        "Every piece is developed through small-batch pattern studies, reinforced seam construction, and movement testing.",
      materialsAndMakers:
        "Crafted in collaboration with local textile workshops using technical wovens, cotton-nylon canvas, and recycled ripstop.",
    },
  },
];

function requiredSecret(name: string, devFallback: string) {
  const value = process.env[name]?.trim();
  if (value) {
    return value;
  }
  if (process.env.NODE_ENV !== "production") {
    return devFallback;
  }
  throw new Error(`${name} must be set before running the seed in production`);
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
  categoryIds: Map<string, string>,
  ownerUserId: string
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
      const savedVariant = await prisma.productVariant.upsert({
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

      const existingInitialMovement = await prisma.inventoryMovement.findFirst({
        where: {
          variantId: savedVariant.id,
          type: InventoryMovementType.INITIAL,
        },
      });

      if (!existingInitialMovement && variant.stock > 0) {
        await prisma.inventoryMovement.create({
          data: {
            variantId: savedVariant.id,
            actorUserId: ownerUserId,
            type: InventoryMovementType.INITIAL,
            delta: variant.stock,
            reason: "Initial bootstrap seed stock",
          },
        });
      }
    }
  }

  if (product.hasSizeChart) {
    const sizeChart = await prisma.sizeChart.upsert({
      where: { productId: savedProduct.id },
      update: {},
      create: { productId: savedProduct.id },
    });

    for (const row of defaultApparelSizeRows) {
      await prisma.sizeChartRow.upsert({
        where: { sizeChartId_size: { sizeChartId: sizeChart.id, size: row.size } },
        update: {
          minHeight: row.minHeight,
          maxHeight: row.maxHeight,
          minWeight: row.minWeight,
          maxWeight: row.maxWeight,
        },
        create: {
          sizeChartId: sizeChart.id,
          size: row.size,
          minHeight: row.minHeight,
          maxHeight: row.maxHeight,
          minWeight: row.minWeight,
          maxWeight: row.maxWeight,
        },
      });
    }
  }

  return savedProduct;
}

async function seedProductRelations(productIdsBySlug: Map<string, string>) {
  for (const product of products) {
    const sourceProductId = productIdsBySlug.get(product.slug);
    if (!sourceProductId) continue;

    for (const [index, targetSlug] of product.relatedProductSlugs.entries()) {
      const targetProductId = productIdsBySlug.get(targetSlug);
      if (!targetProductId || targetProductId === sourceProductId) continue;

      await prisma.productRelation.upsert({
        where: {
          sourceProductId_targetProductId: {
            sourceProductId,
            targetProductId,
          },
        },
        update: { sortOrder: index },
        create: {
          sourceProductId,
          targetProductId,
          sortOrder: index,
        },
      });
    }
  }
}

async function seedStorySteps(collectionIds: Map<string, string>) {
  for (const group of storyGroups) {
    const collectionId =
      group.collectionSlug === null ? null : (collectionIds.get(group.collectionSlug) ?? null);

    await prisma.storyStep.deleteMany({
      where: { collectionId },
    });

    await prisma.storyStep.createMany({
      data: group.steps.map((step) => ({
        ...step,
        collectionId,
      })),
    });
  }
}

async function seedStoreSettings(ownerUserId: string) {
  for (const setting of defaultStoreSettings) {
    await prisma.storeSetting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        updatedById: ownerUserId,
      },
      create: {
        key: setting.key,
        value: setting.value,
        updatedById: ownerUserId,
      },
    });
  }
}

async function main() {
  const ownerPassword = requiredSecret("SEED_OWNER_PASSWORD", "OwnerDemoPassword123!");
  const customerPassword = requiredSecret("SEED_CUSTOMER_PASSWORD", "CustomerDemoPassword123!");

  const owner = await seedUser("owner@zcorte.local", "ZCorté Owner", Role.OWNER, ownerPassword);
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

  const productIdsBySlug = new Map<string, string>();
  for (const product of products) {
    const saved = await seedProduct(product, collectionIds, categoryIds, owner.id);
    productIdsBySlug.set(product.slug, saved.id);
  }

  await seedProductRelations(productIdsBySlug);
  await seedStorySteps(collectionIds);
  await seedStoreSettings(owner.id);
}

main()
  .catch((error: unknown) => {
    process.exitCode = 1;
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
