export const SITE_URL = "https://ecommerce.pixelnusa.com";
export const SITE_NAME = "APEX";
export const SITE_TAGLINE = "HERE, THE JOURNEY BEGINS.";
export const SITE_DESCRIPTION =
  "Three distinct expressions. One connected system. Discover APEX TACTIX, APEXTIVE, and APEX OUTDOOR.";

export const NAV_ITEMS = [
  { label: "Explore", href: "/#brand" },
  { label: "TACTIX", href: "/collections/tactix", collection: "tactix" },
  { label: "APEXTIVE", href: "/collections/apextive", collection: "apextive" },
  { label: "OUTDOOR", href: "/collections/outdoor", collection: "outdoor" },
] as const;

export const FOOTER_NAV_ITEMS = [
  { label: "SHOP ALL", href: "/shop" },
  { label: "TACTIX", href: "/collections/tactix" },
  { label: "APEXTIVE", href: "/collections/apextive" },
  { label: "OUTDOOR", href: "/collections/outdoor" },
] as const;
