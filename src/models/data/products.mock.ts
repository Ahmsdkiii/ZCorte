import { Product, ProductColorVariant, ProductSize } from "../types/product";

const IMG = "/images/products";
const APPAREL_SIZES: ProductSize[] = ["S", "M", "L", "XL"];

const CONCEPT_NOTE =
  "A design study for the APEX system. Product names, imagery, prices, and variant availability are demonstration data, not an offer to sell.";
const MATERIALS_NOTE =
  "Final materials, measurements, care instructions, and performance specifications will be provided with the approved catalog release.";

function colorways(
  slug: string,
  ext: { graphite?: string; olive?: string; oliveBack?: string } = {},
  stock: {
    graphiteStock?: Partial<Record<ProductSize, number>>;
    oliveStock?: Partial<Record<ProductSize, number>>;
    graphiteOneSize?: number;
    oliveOneSize?: number;
  } = {}
): ProductColorVariant[] {
  const g = ext.graphite ?? "webp";
  const o = ext.olive ?? "webp";
  return [
    {
      id: "graphite",
      name: "Graphite",
      swatch: "#343939",
      images: {
        front: `${IMG}/${slug}-graphite-front.${g}`,
        back: `${IMG}/${slug}-graphite-back.${g}`,
      },
      stockBySize: stock.graphiteStock ?? { S: 12, M: 8, L: 4, XL: 2 },
      stockOneSize: stock.graphiteOneSize ?? 15,
    },
    {
      id: "olive",
      name: "Olive",
      swatch: "#676b4c",
      images: {
        front: `${IMG}/${slug}-olive-front.${o}`,
        back: `${IMG}/${slug}-olive-back.${ext.oliveBack ?? o}`,
      },
      unavailableSizes: ["XL"],
      stockBySize: stock.oliveStock ?? { S: 5, M: 2, L: 0, XL: 0 },
      stockOneSize: stock.oliveOneSize ?? 3,
    },
  ];
}

export const mockProducts: Product[] = [
  {
    id: "prod-utility-overshirt",
    slug: "utility-overshirt",
    name: "Utility Overshirt",
    collection: "tactix",
    category: "outerwear",
    price: 1250000,
    featured: true,
    description:
      "An exploration of everyday readiness. A study in quiet form, considered proportions, and the ZCorté design language.",
    colors: colorways("utility-overshirt", { graphite: "jpeg" }),
    sizes: APPAREL_SIZES,
    contextImages: ["/images/apex/campaign-tactix-0.jpeg", "/images/apex/tactix-material.webp"],
    isConcept: false,
    specifications: {
      concept: CONCEPT_NOTE,
      materials: MATERIALS_NOTE,
      fit: "Relaxed articulated silhouette engineered for non-restrictive daily mobility and technical layering.",
      care: "Spot clean or gentle machine wash cold. Do not tumble dry. Line dry in shade.",
    },
    relatedProductSlugs: ["transit-sling", "movement-tee"],
  },
  {
    id: "prod-transit-sling",
    slug: "transit-sling",
    name: "Transit Sling",
    collection: "tactix",
    category: "accessories",
    price: 650000,
    featured: false,
    description:
      "An exploration of everyday readiness. A study in quiet form, considered proportions, and the ZCorté design language.",
    colors: colorways("transit-sling"),
    sizes: [],
    contextImages: ["/images/apex/tactix-context.webp"],
    isConcept: false,
    specifications: {
      concept: CONCEPT_NOTE,
      materials: MATERIALS_NOTE,
      fit: "One size. Adjustable crossbody strap with quick-release buckle for left or right carry.",
      care: "Wipe clean with a damp cloth. Air dry away from direct heat.",
    },
    relatedProductSlugs: ["utility-overshirt", "ridge-pack"],
  },
  {
    id: "prod-movement-tee",
    slug: "movement-tee",
    name: "Movement Tee",
    collection: "apextive",
    category: "tops",
    price: 450000,
    featured: true,
    description:
      "An exploration of movement. A study in quiet form, considered proportions, and the ZCorté design language.",
    colors: colorways("movement-tee"),
    sizes: APPAREL_SIZES,
    contextImages: ["/images/apex/campaign-apextive-0.jpeg", "/images/apex/apextive-material.jpeg"],
    isConcept: false,
    specifications: {
      concept: CONCEPT_NOTE,
      materials: MATERIALS_NOTE,
      fit: "Athletic cut with ergonomic raglan patterning to maintain uninhibited shoulder rotation.",
      care: "Cold wash with technical sportswear detergent. Hang dry.",
    },
    relatedProductSlugs: ["training-shorts", "trail-shell"],
  },
  {
    id: "prod-training-shorts",
    slug: "training-shorts",
    name: "Training Shorts",
    collection: "apextive",
    category: "bottoms",
    price: 550000,
    featured: false,
    description:
      "An exploration of movement. A study in quiet form, considered proportions, and the ZCorté design language.",
    colors: colorways("training-shorts"),
    sizes: APPAREL_SIZES,
    contextImages: ["/images/apex/apextive-transition.jpeg"],
    isConcept: false,
    specifications: {
      concept: CONCEPT_NOTE,
      materials: MATERIALS_NOTE,
      fit: "Mid-thigh length with an elastic waistband and integrated webbing belt.",
      care: "Machine wash cold. Do not iron the belt hardware. Line dry.",
    },
    relatedProductSlugs: ["movement-tee", "utility-overshirt"],
  },
  {
    id: "prod-trail-shell",
    slug: "trail-shell",
    name: "Trail Shell",
    collection: "outdoor",
    category: "outerwear",
    price: 1750000,
    featured: true,
    description:
      "An exploration of the journey outdoors. A study in quiet form, considered proportions, and the ZCorté design language.",
    colors: colorways("trail-shell"),
    sizes: APPAREL_SIZES,
    contextImages: ["/images/apex/campaign-outdoor-0.jpeg", "/images/apex/outdoor-detail.jpeg"],
    isConcept: false,
    specifications: {
      concept: CONCEPT_NOTE,
      materials: MATERIALS_NOTE,
      fit: "Storm-ready expedition profile with room for thermal midlayers and helmet-compatible hood.",
      care: "Machine wash delicate with DWR tech wash. Do not use fabric softener. Air dry.",
    },
    relatedProductSlugs: ["ridge-pack", "utility-overshirt"],
  },
  {
    id: "prod-ridge-pack",
    slug: "ridge-pack",
    name: "Ridge Pack",
    collection: "outdoor",
    category: "accessories",
    price: 950000,
    featured: false,
    description:
      "An exploration of the journey outdoors. A study in quiet form, considered proportions, and the ZCorté design language.",
    colors: colorways("ridge-pack", { oliveBack: "jpeg" }),
    sizes: [],
    contextImages: ["/images/apex/campaign-outdoor-2.jpeg"],
    isConcept: false,
    specifications: {
      concept: CONCEPT_NOTE,
      materials: MATERIALS_NOTE,
      fit: "One size. Load-bearing hip belt, sternum strap, and ventilated mesh back panel.",
      care: "Hand wash with mild soap. Empty pockets and air dry fully open.",
    },
    relatedProductSlugs: ["trail-shell", "transit-sling"],
  },
];
