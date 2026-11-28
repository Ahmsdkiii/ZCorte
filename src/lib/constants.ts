export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "ZCorté";
export const SITE_TAGLINE = "HERE, THE JOURNEY BEGINS.";
export const SITE_DESCRIPTION =
  "Three distinct expressions. One connected system. Discover ZCorté TACTIX, APEXTIVE, and ZCorté OUTDOOR.";
export const SITE_COPYRIGHT = `© 2026 ${SITE_NAME}`;
export const SITE_CONCEPT_DISCLAIMER = `Concept imagery — not official ${SITE_NAME} product photography.`;

export const NAV_ITEMS = [
  { num: "01", label: "Explore", href: "/#brand" },
  { num: "02", label: "TACTIX", href: "/collections/tactix", collection: "tactix" },
  { num: "03", label: "APEXTIVE", href: "/collections/apextive", collection: "apextive" },
  { num: "04", label: "OUTDOOR", href: "/collections/outdoor", collection: "outdoor" },
] as const;

export const FOOTER_NAV_ITEMS = [
  { label: "SHOP ALL", href: "/shop" },
  { label: "TACTIX", href: "/collections/tactix" },
  { label: "APEXTIVE", href: "/collections/apextive" },
  { label: "OUTDOOR", href: "/collections/outdoor" },
] as const;
